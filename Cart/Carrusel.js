let currentOffset = 0;

// Tomamos el track UNA sola vez y validamos su existencia
const track = document.getElementById('product-track');

// Solo carga productos si existe la sección "Te podría interesar"
async function cargarProductos() {
    if (!track) return; // Este JS queda “encapsulado” a esa sección

    try {
        const response = await fetch('http://localhost:8080/api/v1/productos/catalogo');

        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }

        const data = await response.json();
        renderizarProductos(Array.isArray(data) ? data : []);

        // Reinicia el offset por si el usuario venía desplazado
        currentOffset = 0;
        track.style.transform = `translateX(0px)`;

    } catch (error) {
        console.error("Error conectando con el backend para 'Te podría interesar':", error);
        track.innerHTML = ""; // Evita que quede basura visual
    }
}

function renderizarProductos(data) {
    if (!track) return;

    track.innerHTML = data.map(p => {
        const imgSrc = p.imagen?.src || p.imgUrl || "";

        return `
            <div class="product-card">
                <div class="img-container">
                    <img src="${imgSrc}" alt="${p.imagen?.alt || p.nombre || 'Producto'}">
                </div>
                <div class="card-info">
                    <h3>${p.nombre || 'Sin nombre'}</h3>
                    <p class="description">${p.descripcion || ''}</p>
                    <div class="card-footer">
                        <div class="price-badge">$${p.precio ? Number(p.precio).toFixed(2) : "0.00"}</div>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

// Debe ser global porque el HTML usa onclick="moveSlide(...)"
function moveSlide(direction) {
    if (!track) return;

    const card = track.querySelector('.product-card');
    if (!card) return;

    const cardWidth = card.offsetWidth + 20;
    const maxScroll = track.scrollWidth - track.parentElement.offsetWidth;

    currentOffset += direction * cardWidth;

    if (currentOffset < 0) currentOffset = 0;
    if (currentOffset > maxScroll) currentOffset = maxScroll;

    track.style.transform = `translateX(-${currentOffset}px)`;
}

// Iniciar solo cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', cargarProductos);

