const API_PRODUCTO = "http://localhost:8080/api/v1/productos/admin";

const contenedor = document.getElementById("contenedorProductos");
const buscador = document.getElementById("buscadorProducto");

let listaProductos = [];

const mxn = new Intl.NumberFormat('es-MX', {
  style: 'currency',
  currency: 'MXN'
});


/* ================================
   CARGAR PRODUCTOS
================================ */
async function cargarProductos() {
  try {
    const res = await fetch(API_PRODUCTO);

    if (!res.ok) {
      throw new Error("Error al obtener productos");
    }

    listaProductos = await res.json();
    renderProductos(listaProductos);

  } catch (error) {
    console.error("Error:", error);
    contenedor.innerHTML = "<p>Error al cargar productos</p>";
  }
}


/* ================================
   RENDER PRODUCTOS
================================ */
function renderProductos(productos) {
  contenedor.innerHTML = "";

  if (productos.length === 0) {
    contenedor.innerHTML = "<p>No se encontraron productos</p>";
    return;
  }

  productos.forEach(prod => {

    const card = document.createElement("div");
    card.className = `producto-card ${
      prod.estatus ? "producto-activo" : "producto-inactivo"
    }`;

    card.innerHTML = `
      <img src="${prod.imgUrl || 'https://via.placeholder.com/300'}" class="producto-img">
      <h3>${prod.nombre}</h3>
      <p><strong>SKU:</strong> ${prod.sku}</p>
      <p><strong>Precio:</strong> ${mxn.format(prod.precio)}</p>
      <button class="btn btn-primary">Gestionar</button>
    `;

    card.querySelector("button").onclick = () => {
      window.location.href = `./producto-detalle.html?id=${prod.id}`;
    };

    contenedor.appendChild(card);
  });
}


/* ================================
   BUSCADOR EN TIEMPO REAL
================================ */
buscador.addEventListener("input", () => {
  const texto = buscador.value.toLowerCase().trim();

  const filtrados = listaProductos.filter(prod =>
    prod.nombre.toLowerCase().includes(texto) ||
    prod.sku.toLowerCase().includes(texto)
  );

  renderProductos(filtrados);
});


/* ================================
   INICIALIZAR
================================ */
document.addEventListener("DOMContentLoaded", () => {
  cargarProductos();
});