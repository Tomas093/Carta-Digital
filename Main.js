const SHEET_ID = '1NKhXd-lW30E8ddCUa8ZCfsTt6Q2XOKcAwpAzDcGnQIo';
const SHEET_TITLE = 'Platos';
const SHEET_RANGE = 'A1:C26';

const FULL_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?sheet=${SHEET_TITLE}&range=${SHEET_RANGE}`;

document.addEventListener('DOMContentLoaded', () => {
    const plateDropdown = document.getElementById('plateDropdown');
    const plateInfo = document.getElementById('plateInfo');

    // Crear un select para los nombres de los platos
    const selectElement = document.createElement('select');
    plateDropdown.appendChild(selectElement);

    fetch(FULL_URL)
        .then(res => {
            if (!res.ok) throw new Error('Error al cargar los datos');
            return res.text();
        })
        .then(rep => {
            const data = JSON.parse(rep.substr(47).slice(0, -2));
            const rows = data.table.rows;

            if (!rows || rows.length === 0) {
                throw new Error('No hay datos en la hoja.');
            }

            // Crear opciones en el select y mostrar el primer plato
            selectElement.innerHTML = '<option value="" disabled selected>Selecciona un plato</option>';

            for (let i = 1; i < rows.length; i++) {
                const name = rows[i].c[0]?.v || 'Nombre no disponible';
                const description = rows[i].c[1]?.v || 'Descripción no disponible';
                const price = rows[i].c[2]?.v || 'Precio no disponible';

                // Crear opción en el select
                const option = document.createElement('option');
                option.value = i;
                option.textContent = name;
                selectElement.appendChild(option);

                // Mostrar detalles cuando se selecciona un plato
                selectElement.addEventListener('change', () => {
                    const selectedIndex = selectElement.value;
                    if (selectedIndex == i) {
                        plateInfo.innerHTML = `
                            <h3>${name}</h3>
                            <p><strong>Descripción:</strong> ${description}</p>
                            <p><strong>Precio:</strong> ${price}</p>
                        `;
                    }
                });
            }
        })
        .catch(err => {
            console.error('Error al procesar los datos:', err);
            plateInfo.innerHTML = '<p>Error al cargar los datos del menú.</p>';
        });
});
