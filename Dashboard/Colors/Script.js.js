const API_PRODUCTO = "http://localhost:8080/api/v1/productos/admin";
const API_PRODUCTO_ID = "http://localhost:8080/api/v1/productos";
const API_INVENTARIO = "http://localhost:8080/api/v1/inventario";
const API_COLORES = "http://localhost:8080/api/colores";
const API_TALLAS = "http://localhost:8080/api/tallas/AllTallas";
const API_CATEGORIAS = "http://localhost:8080/api/v1/categories";
const API_ETIQUETAS = "http://localhost:8080/api/v1/etiquetas";

const params = new URLSearchParams(window.location.search);
const productoId = Number(params.get("id"));

const mxn = new Intl.NumberFormat("es-MX", {
  style: "currency",
  currency: "MXN"
});

let categoriasSeleccionadas = [];
let etiquetasSeleccionadas = [];

async function init() {
  await cargarProducto();
  await cargarSelects();
  await cargarInventario();
}

async function cargarProducto() {

  const res = await fetch(`${API_PRODUCTO_ID}/${productoId}`);
  const prod = await res.json();

  document.getElementById("tituloProducto").textContent = prod.nombre;

  document.getElementById("infoProducto").innerHTML = `
    <img src="${prod.imgUrl}" width="200">
    <p><strong>SKU:</strong> ${prod.sku}</p>
    <p><strong>Precio:</strong> ${mxn.format(Number(prod.precio) || 0)}</p>
    <p><strong>Estado:</strong> ${prod.estadoProducto}</p>
  `;

  categoriasSeleccionadas = [...prod.categoriaNombres];
  etiquetasSeleccionadas = [...prod.etiquetaNombres];

  renderCategoriasRelacionadas();
  renderEtiquetasRelacionadas();
}

async function cargarSelects() {

  const [coloresRes, tallasRes, categoriasRes, etiquetasRes] =
    await Promise.all([
      fetch(API_COLORES),
      fetch(API_TALLAS),
      fetch(API_CATEGORIAS),
      fetch(API_ETIQUETAS)
    ]);

  llenarSelect("selectColor", await coloresRes.json(), "id", "nombreColor");
  llenarSelect("selectTalla", await tallasRes.json(), "id", "nombreTalla");
  llenarSelect("selectCategoria", await categoriasRes.json(), "idCategoria", "nombreCategoria");
  llenarSelect("selectEtiqueta", await etiquetasRes.json(), "id", "nombreEtiqueta");
}

function llenarSelect(id, data, valueKey, textKey) {

  const select = document.getElementById(id);
  select.innerHTML = "";

  data.forEach(item => {
    const option = document.createElement("option");
    option.value = item[valueKey];
    option.textContent = item[textKey];
    select.appendChild(option);
  });
}

/* ================= INVENTARIO ================= */

async function guardarVariante() {

  const body = {
    productoId: productoId,
    colorId: document.getElementById("selectColor").value,
    tallaId: document.getElementById("selectTalla").value,
    cantidad: document.getElementById("cantidadVariante").value
  };

  await fetch(`${API_INVENTARIO}/variante`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });

  cargarInventario();
}

async function cargarInventario() {

  const res = await fetch(`${API_INVENTARIO}/producto/${productoId}`);
  const inventario = await res.json();

  const tabla = document.getElementById("tablaInventario");
  tabla.innerHTML = "";

  let total = 0;

  inventario.forEach(item => {

    total += item.cantidad;

    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${item.nombreProducto}</td>
      <td>${item.nombreColor}</td>
      <td>${item.nombreTalla}</td>
      <td>${item.cantidad}</td>
      <td>
        <button onclick="incrementar(${item.idInventario})">+</button>
        <button onclick="decrementar(${item.idInventario})">-</button>
      </td>
    `;

    tabla.appendChild(row);
  });

  document.getElementById("stockTotal").textContent =
    "Stock Total: " + total;
}

async function incrementar(id) {
  await fetch(`${API_INVENTARIO}/${id}/incrementar`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ delta: 1 })
  });
  cargarInventario();
}

async function decrementar(id) {
  await fetch(`${API_INVENTARIO}/${id}/decrementar`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ delta: 1 })
  });
  cargarInventario();
}

/* ================= CATEGORÍAS ================= */

function agregarCategoria() {
  const select = document.getElementById("selectCategoria");
  const nombre = select.options[select.selectedIndex].text;

  if (!categoriasSeleccionadas.includes(nombre)) {
    categoriasSeleccionadas.push(nombre);
    renderCategoriasRelacionadas();
  }
}

function renderCategoriasRelacionadas() {
  const ul = document.getElementById("listaCategoriasRelacionadas");
  ul.innerHTML = "";

  categoriasSeleccionadas.forEach(cat => {
    const li = document.createElement("li");
    li.textContent = cat;
    ul.appendChild(li);
  });
}

/* ================= ETIQUETAS ================= */

function agregarEtiqueta() {
  const select = document.getElementById("selectEtiqueta");
  const nombre = select.options[select.selectedIndex].text;

  if (!etiquetasSeleccionadas.includes(nombre)) {
    etiquetasSeleccionadas.push(nombre);
    renderEtiquetasRelacionadas();
  }
}

function renderEtiquetasRelacionadas() {
  const ul = document.getElementById("listaEtiquetasRelacionadas");
  ul.innerHTML = "";

  etiquetasSeleccionadas.forEach(et => {
    const li = document.createElement("li");
    li.textContent = et;
    ul.appendChild(li);
  });
}

/* ================= GUARDAR RELACIONES ================= */

async function guardarCategoriasEtiquetas() {

  const categoriasRes = await fetch(API_CATEGORIAS);
  const categoriasAll = await categoriasRes.json();

  const etiquetasRes = await fetch(API_ETIQUETAS);
  const etiquetasAll = await etiquetasRes.json();

  const categoriaIds = categoriasAll
    .filter(c => categoriasSeleccionadas.includes(c.nombreCategoria))
    .map(c => c.idCategoria);

  const etiquetaIds = etiquetasAll
    .filter(e => etiquetasSeleccionadas.includes(e.nombreEtiqueta))
    .map(e => e.id);

  await fetch(`${API_PRODUCTO_ID}/${productoId}/categorias-etiquetas`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      categoriaIds,
      etiquetaIds
    })
  });

  alert("Relaciones actualizadas correctamente");
}

init();