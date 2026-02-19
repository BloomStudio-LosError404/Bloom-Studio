const API_PRODUCTO = "http://localhost:8080/api/v1/productos";
const API_INVENTARIO = "http://localhost:8080/api/v1/inventario";
const API_COLORES = "http://localhost:8080/api/colores";

const params = new URLSearchParams(window.location.search);
const productoId = Number(params.get("id"));

let productoActual = null;
let inventarioActual = [];
let coloresAPI = [];

let colorSeleccionado = null;
let tallaSeleccionada = null;

const mxn = new Intl.NumberFormat("es-MX", {
  style: "currency",
  currency: "MXN"
});

document.addEventListener("DOMContentLoaded", init);

async function init() {
  if (!productoId) return alert("ID inválido");

  await cargarProducto();
  await cargarColores();
  await cargarInventario();
  renderColores();

  document
    .getElementById("btn-add-to-cart")
    .addEventListener("click", agregarAlCarritoHandler);
}

/* ================= PRODUCTO ================= */

async function cargarProducto() {
  const res = await fetch(`${API_PRODUCTO}/${productoId}`);
  productoActual = await res.json();

  document.getElementById("nombre-producto").textContent =
    productoActual.nombre;

  document.getElementById("sku-producto").textContent =
    "SKU: " + productoActual.sku;

  document.getElementById("precio-producto").textContent =
    mxn.format(productoActual.precio);

  document.getElementById("detail-title").textContent =
    productoActual.nombre;

  document.getElementById("descripcion-producto").textContent =
    productoActual.descripcion || "";

  document.getElementById("main-product-img").src =
    productoActual.imgUrl;

  if (productoActual.categoriaNombres?.length) {
    document.getElementById("specs-list").innerHTML =
      productoActual.categoriaNombres
        .map(c => `<li><strong>Categoría:</strong> ${c}</li>`)
        .join("");
  }
}

/* ================= COLORES DESDE API ================= */

async function cargarColores() {
  const res = await fetch(API_COLORES);
  coloresAPI = await res.json();
}

/* ================= INVENTARIO ================= */

async function cargarInventario() {
  const res = await fetch(`${API_INVENTARIO}/producto/${productoId}`);
  inventarioActual = await res.json();
}
function mostrarToast(mensaje) {

  const container = document.getElementById("toast-container");

  const toast = document.createElement("div");
  toast.className = "toast-success";
  toast.textContent = mensaje;

  container.appendChild(toast);

  // Activar animación
  setTimeout(() => {
    toast.classList.add("show");
  }, 50);

  // Desaparecer después de 3 segundos
  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => toast.remove(), 400);
  }, 3000);
}
/* ================= RENDER COLORES ================= */

function renderColores() {

  const container = document.getElementById("color-selector");
  container.innerHTML = "";

  const coloresConStock = [
    ...new Set(
      inventarioActual
        .filter(i => i.cantidad > 0)
        .map(i => i.nombreColor)
    )
  ];

  if (coloresConStock.length === 0) return;

  coloresConStock.forEach((nombreColor, index) => {

    const colorObj = coloresAPI.find(c =>
      c.nombreColor === nombreColor
    );

    if (!colorObj) return;

    const dot = document.createElement("div");
    dot.className = "color-dot";
    dot.title = nombreColor;

    dot.style.backgroundColor = colorObj.codigoHex;

    dot.addEventListener("click", () => {
      seleccionarColor(nombreColor, dot);
    });

    container.appendChild(dot);

    // 🔥 Selección automática del primer color
    if (index === 0) {
      seleccionarColor(nombreColor, dot);
    }
  });
}

/* ================= SELECCIONAR COLOR ================= */

function seleccionarColor(nombreColor, elementoDot) {

  colorSeleccionado = nombreColor;
  tallaSeleccionada = null;

  document.getElementById("color-seleccionado").textContent =
    `Color: ${nombreColor}`;

  document.querySelectorAll(".color-dot")
    .forEach(d => d.classList.remove("active"));

  elementoDot.classList.add("active");

  renderTallas(nombreColor);
}

/* ================= TALLAS ================= */

function renderTallas(color) {

  const container = document.getElementById("size-selector");
  container.innerHTML = "";

  const tallas = inventarioActual
    .filter(i => i.nombreColor === color);

  tallas.forEach(item => {

    const pill = document.createElement("div");
    pill.className = "size-pill";
    pill.textContent = item.nombreTalla;

    if (item.cantidad <= 0) {
      pill.classList.add("disabled");
      return;
    }

    pill.addEventListener("click", () => {

      tallaSeleccionada = item.nombreTalla;

      document.getElementById("stock-talla").textContent =
        `Stock disponible en talla ${item.nombreTalla}: ${item.cantidad}`;

      // 🔥 Bloquear cantidad según stock
      const inputCantidad =
        document.getElementById("cantidad-selector");

      inputCantidad.max = item.cantidad;
      inputCantidad.value = 1;

      document.querySelectorAll(".size-pill")
        .forEach(p => p.classList.remove("active"));

      pill.classList.add("active");
    });

    container.appendChild(pill);
  });
}

/* ================= CARRITO ================= */

function agregarAlCarritoHandler() {

  if (!colorSeleccionado || !tallaSeleccionada)
    return alert("Selecciona color y talla");

  const inputCantidad =
    document.getElementById("cantidad-selector");

  let cantidad = Number(inputCantidad.value);

  const variante = inventarioActual.find(i =>
    i.nombreColor === colorSeleccionado &&
    i.nombreTalla === tallaSeleccionada
  );

  if (!variante) return alert("Variante no encontrada");

  if (cantidad > variante.cantidad) {
    cantidad = variante.cantidad;
    inputCantidad.value = variante.cantidad;
  }

  const productoFinal = {
    id: `${productoActual.id}-${colorSeleccionado}-${tallaSeleccionada}`,
    productoId: productoActual.id,
    nombre: productoActual.nombre,
    precio: productoActual.precio,
    imagen: productoActual.imgUrl,
    color: colorSeleccionado,
    talla: tallaSeleccionada,
    cantidad: cantidad
  };

  agregarAlCarrito(productoFinal);

  if (typeof window.actualizarNumeroCarrito === "function") {
    window.actualizarNumeroCarrito();
  }

  mostrarToast("Producto agregado al carrito");
}