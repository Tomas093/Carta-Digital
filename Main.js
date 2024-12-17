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

  SHEET_TITLES.forEach(sheetTitle => {
    fetch(buildSheetURL(sheetTitle))
      .then(res => res.text())
      .then(rep => {
        const data = JSON.parse(rep.substr(47).slice(0, -2));
        const rows = data.table.rows;

        rows.slice(1).forEach(row => {
          const nombre = row.c[0]?.v || 'Nombre no disponible';
          const descripcion = row.c[1]?.v || '';
          const precio = row.c[2]?.v || 0;

          const platoElemento = document.createElement('div');
          platoElemento.className = 'menu-item';

          platoElemento.innerHTML = `
            <div class="menu-info">
              <p class="menu-title">${nombre}</p>
              <p class="menu-desc">${descripcion}</p>
            </div>
            <span class="menu-price">$${precio}</span>
          `;
          sectionContainer[sheetTitle].appendChild(platoElemento);
        });
      })
      .catch(err => {
        console.error(`Error al cargar los datos de ${sheetTitle}:`, err);
        sectionContainer[sheetTitle].innerHTML = '<p class="text-red-500">No se pudieron cargar los datos.</p>';
      });
  });
});
