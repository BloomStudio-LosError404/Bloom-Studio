const API_PRODUCTO = "http://localhost:8080/api/v1/productos/admin";
const API_CREAR = "http://localhost:8080/api/v1/productos/con-imagen";

const contenedor = document.getElementById("contenedorProductos");
const buscador = document.getElementById("buscadorProducto");
const form = document.getElementById("formProducto");

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

  if (!productos || productos.length === 0) {
    contenedor.innerHTML = "<p>No se encontraron productos</p>";
    return;
  }

  productos.forEach(prod => {

    const card = document.createElement("div");
    card.className = `producto-card ${
      prod.estatus ? "producto-activo" : "producto-inactivo"
    }`;

    const imagenValida =
      prod.imgUrl && prod.imgUrl.startsWith("http")
        ? prod.imgUrl
        : "https://via.placeholder.com/300";

    card.innerHTML = `
      <img src="${imagenValida}" class="producto-img">
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
   BUSCADOR
================================ */
if (buscador) {
  buscador.addEventListener("input", () => {
    const texto = buscador.value.toLowerCase().trim();

    const filtrados = listaProductos.filter(prod =>
      prod.nombre.toLowerCase().includes(texto) ||
      prod.sku.toLowerCase().includes(texto)
    );

    renderProductos(filtrados);
  });
}

/* ================================
   GUARDAR PRODUCTO (MULTIPART)
================================ */
if (form) {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const sku = document.getElementById("skuProducto").value.trim();
    const nombre = document.getElementById("nombreProducto").value.trim();
    const descripcion = document.getElementById("descripcionProducto").value.trim();
    const precio = document.getElementById("precioProducto").value;
    const imagen = document.getElementById("imagenProducto").files[0];

    if (!imagen) {
      alert("Debes seleccionar una imagen");
      return;
    }

    const producto = {
      sku,
      nombre,
      descripcion,
      precio: parseFloat(precio)
    };

    const formData = new FormData();
    formData.append("producto", JSON.stringify(producto));
    formData.append("imagen", imagen);

    try {
      const res = await fetch(API_CREAR, {
        method: "POST",
        body: formData
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText);
      }

      alert("Producto guardado correctamente ");

      form.reset();
      cargarProductos();

    } catch (error) {
      console.error("Error al guardar:", error);
      alert("Error al guardar producto ");
    }
  });
}

/* ================================
   INICIALIZAR
================================ */
document.addEventListener("DOMContentLoaded", () => {
  cargarProductos();
});