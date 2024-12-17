const SHEET_ID = '1NKhXd-lW30E8ddCUa8ZCfsTt6Q2XOKcAwpAzDcGnQIo';
const SHEET_TITLE = 'Platos';
const SHEET_RANGE = 'A:C';

const FULL_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?sheet=${SHEET_TITLE}&range=${SHEET_RANGE}`;

document.addEventListener('DOMContentLoaded', () => {
    const menuPlatos = document.getElementById('menuPlatos');

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

            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.1 });

            for (let i = 1; i < rows.length; i++) {
                const nombre = rows[i].c[0]?.v || 'Nombre no disponible';
                const descripcion = rows[i].c[1]?.v || 'Descripción no disponible';
                const precio = rows[i].c[2]?.v ? `$${rows[i].c[2].v}` : 'Precio no disponible';

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

                platoElemento.appendChild(nombrePrecioElemento);
                platoElemento.appendChild(descripcionElemento);

                menuPlatos.appendChild(platoElemento);

                observer.observe(platoElemento);
            }
        })
        .catch(err => {
            console.error('Error al procesar los datos:', err);
            menuPlatos.innerHTML = '<p>Error al cargar los datos del menú.</p>';
        });
});