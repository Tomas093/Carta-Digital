const SHEET_ID = '1NKhXd-lW30E8ddCUa8ZCfsTt6Q2XOKcAwpAzDcGnQIo'; // ID de la hoja de Google Sheets
const SHEET_TITLE = 'Platos'; // Nombre de la pestaña dentro de la hoja
const SHEET_RANGE = 'A:C'; // Rango: A = nombre, B = descripción, C = precio

const FULL_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?sheet=${SHEET_TITLE}&range=${SHEET_RANGE}`;

document.addEventListener('DOMContentLoaded', () => {
    const menuPlatos = document.getElementById('menuPlatos'); // Contenedor principal

    fetch(FULL_URL)
        .then(res => {
            if (!res.ok) throw new Error('Error al cargar los datos');
            return res.text();
        })
        .then(rep => {
            const data = JSON.parse(rep.substr(47).slice(0, -2)); // Procesar la respuesta
            const rows = data.table.rows;

            if (!rows || rows.length === 0) {
                throw new Error('No hay datos en la hoja.');
            }

            // Iterar sobre las filas de datos, ignorando la primera (encabezado)
            for (let i = 1; i < rows.length; i++) {
                const nombre = rows[i].c[0]?.v || 'Nombre no disponible';
                const descripcion = rows[i].c[1]?.v || 'Descripción no disponible';
                const precio = rows[i].c[2]?.v ? `$${rows[i].c[2].v}` : 'Precio no disponible'; // Agregar el $

                // Crear un elemento para cada plato
                const platoElemento = document.createElement('div');
                platoElemento.className = 'plato-item';
                platoElemento.innerHTML = `
                    <h3>${nombre} - <span class="precio">${precio}</span></h3>
                    <p>${descripcion}</p>
                `;
                menuPlatos.appendChild(platoElemento);
            }
        })
        .catch(err => {
            console.error('Error al procesar los datos:', err);
            menuPlatos.innerHTML = '<p>Error al cargar los datos del menú.</p>';
        });
});
