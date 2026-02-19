const API_PRODUCTO = "http://localhost:8080/api/v1/productos/admin";

const contenedor = document.getElementById("contenedorProductos");

const mxn = new Intl.NumberFormat('es-MX', {
  style: 'currency',
  currency: 'MXN'
});

async function cargarProductos() {
  const res = await fetch(API_PRODUCTO);
  const productos = await res.json();

  contenedor.innerHTML = "";

  productos.forEach(prod => {

    const card = document.createElement("div");
    card.className = `producto-card ${prod.estatus ? "producto-activo" : "producto-inactivo"}`;

    card.innerHTML = `
      <img src="${prod.imgUrl}" class="producto-img">
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

cargarProductos();