const SHEET_ID = '1NKhXd-lW30E8ddCUa8ZCfsTt6Q2XOKcAwpAzDcGnQIo';
const SHEET_TITLES = ['Comidas', 'Postres', 'Bebidas', 'Entradas'];
const SHEET_RANGE = 'A:C';

const buildSheetURL = (sheetTitle) =>
  `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?sheet=${sheetTitle}&range=${SHEET_RANGE}`;

document.addEventListener('DOMContentLoaded', () => {
  const sectionContainer = {
    Comidas: document.getElementById('menuComidas'),
    Postres: document.getElementById('menuPostres'),
    Bebidas: document.getElementById('menuBebidas'),
    Entradas: document.getElementById('menuEntradas'),
  };

  const observer = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible'); // Agrega clase visible al elemento
          observer.unobserve(entry.target); // Deja de observar el elemento
        }
      });
    },
    {
      root: null, // El viewport es el área raíz
      threshold: 0.2, // Aparece cuando el 20% del elemento es visible
    }
  );

  SHEET_TITLES.forEach(sheetTitle => {
    fetch(buildSheetURL(sheetTitle))
      .then(res => res.text())
      .then(rep => {
        try {
          const data = JSON.parse(rep.substr(47).slice(0, -2)); // Parsear JSON del texto
          const rows = data.table.rows;

          rows.slice(1).forEach(row => {
            const nombre = row.c[0]?.v || 'Nombre no disponible';
            const descripcion = row.c[1]?.v || '';
            const precio = row.c[2]?.v || 0;

            // Crear el elemento del plato
            const platoElemento = document.createElement('div');
            platoElemento.className = 'menu-item'; // Inicialmente sin "visible"

            platoElemento.innerHTML = `
              <div class="menu-info">
                <p class="menu-title">${nombre}</p>
                <p class="menu-desc">${descripcion}</p>
              </div>
              <span class="menu-price">$${precio}</span>
            `;

            // Añadir elemento al contenedor correspondiente
            if (sectionContainer[sheetTitle]) {
              sectionContainer[sheetTitle].appendChild(platoElemento);
              observer.observe(platoElemento); // Observar el nuevo elemento
            } else {
              console.warn(`Contenedor para ${sheetTitle} no encontrado.`);
            }
          });
        } catch (err) {
          console.error(`Error procesando los datos de ${sheetTitle}:`, err);
          sectionContainer[sheetTitle].innerHTML =
            '<p class="text-red-500">Error al procesar los datos.</p>';
        }
      })
      .catch(err => {
        console.error(`Error al cargar los datos de ${sheetTitle}:`, err);
        sectionContainer[sheetTitle].innerHTML =
          '<p class="text-red-500">No se pudieron cargar los datos.</p>';
      });
  });
});
// Código existente
document.getElementById('menu-toggle').addEventListener('click', () => {
  const menu = document.getElementById('menu');
  menu.classList.toggle('hidden');
});

// Nuevo código para cerrar el menú al hacer clic en un enlace
document.querySelectorAll('#menu li a').forEach(link => {
  link.addEventListener('click', () => {
    const menu = document.getElementById('menu');
    const menuToggle = document.getElementById('menu-toggle');
    
    // Solo cerrar el menú si está en modo móvil (cuando el botón de toggle está visible)
    if (window.getComputedStyle(menuToggle).display !== 'none') {
      menu.classList.add('hidden');
    }
  });
});