const SHEET_ID = '1NKhXd-lW30E8ddCUa8ZCfsTt6Q2XOKcAwpAzDcGnQIo';
const SHEET_TITLES = ['Comidas', 'Postres', 'Bebidas', 'Entradas'];
const SHEET_RANGE = 'A:C';

// URLs para cada hoja
const buildSheetURL = (sheetTitle) =>
  `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?sheet=${sheetTitle}&range=${SHEET_RANGE}`;

document.addEventListener('DOMContentLoaded', () => {
  const sectionContainer = {
    Comidas: document.getElementById('menuComidas'),
    Postres: document.getElementById('menuPostres'),
    Bebidas: document.getElementById('menuBebidas'),
    Entradas: document.getElementById('menuEntradas'),
  };

  // Intersection Observer para animaciones
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  // Procesar cada hoja del documento
  SHEET_TITLES.forEach(sheetTitle => {
    const FULL_URL = buildSheetURL(sheetTitle);
    const container = sectionContainer[sheetTitle];

    fetch(FULL_URL)
      .then(res => {
        if (!res.ok) throw new Error(`Error al cargar los datos de ${sheetTitle}`);
        return res.text();
      })
      .then(rep => {
        const data = JSON.parse(rep.substr(47).slice(0, -2));
        const rows = data.table.rows;

        if (!rows || rows.length === 0) {
          throw new Error(`No hay datos en la hoja ${sheetTitle}`);
        }

        for (let i = 1; i < rows.length; i++) {
          const nombre = rows[i].c[0]?.v || 'Nombre no disponible';
          const descripcion = rows[i].c[1]?.v || 'Descripción no disponible';
          const precio = rows[i].c[2]?.v ? `$${rows[i].c[2].v}` : 'Precio no disponible';

          // Crear elementos dinámicamente
          const platoElemento = document.createElement('div');
          platoElemento.className = 'plato-item hidden';

          const nombrePrecioElemento = document.createElement('h3');
          nombrePrecioElemento.className = 'plato-nombre';
          nombrePrecioElemento.innerHTML = `
            ${nombre}
            <span class="plato-precio">${precio}</span>
          `;

          const descripcionElemento = document.createElement('p');
          descripcionElemento.className = 'plato-descripcion';
          descripcionElemento.textContent = descripcion;

          // Agregar elementos al contenedor
          platoElemento.appendChild(nombrePrecioElemento);
          platoElemento.appendChild(descripcionElemento);
          container.appendChild(platoElemento);

          observer.observe(platoElemento);
        }
      })
      .catch(err => {
        console.error(`Error al procesar los datos de ${sheetTitle}:`, err);
        container.innerHTML = `<p>Error al cargar los datos de ${sheetTitle}.</p>`;
      });
  });
});
