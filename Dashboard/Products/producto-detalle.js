const API_PRODUCTO = "http://localhost:8080/api/v1/productos";
const API_INVENTARIO = "http://localhost:8080/api/v1/inventario";
const API_COLORES = "http://localhost:8080/api/colores/activas";
const API_TALLAS = "http://localhost:8080/api/tallas/activas";
const API_CATEGORIAS = "http://localhost:8080/api/v1/categories/activas";
const API_ETIQUETAS = "http://localhost:8080/api/v1/etiquetas/activas";

const params = new URLSearchParams(window.location.search);
const productoId = Number(params.get("id"));

let productoActual = null;
let inventarioActual = [];

const mxn = new Intl.NumberFormat("es-MX", {
  style: "currency",
  currency: "MXN"
});

async function init() {
  if (!productoId) return alert("ID inválido");

  await cargarProducto();
  await cargarSelects();
  await cargarInventario();
  await cargarRelaciones();
}

init();

/* ================= PRODUCTO ================= */

async function cargarProducto() {
  const res = await fetch(`${API_PRODUCTO}/${productoId}`);
  productoActual = await res.json();

  tituloProducto.textContent = productoActual.nombre;
  imagenProducto.src = productoActual.imgUrl;
  skuProducto.textContent = productoActual.sku;
  precioProducto.textContent = mxn.format(Number(productoActual.precio));
  estadoProducto.textContent = productoActual.estadoProducto;
}

/* ================= MODAL ================= */

function abrirModalEditar() {
  modalEditar.style.display = "flex";

  editNombre.value = productoActual.nombre;
  editPrecio.value = productoActual.precio;
  editDescripcion.value = productoActual.descripcion || "";
}

function cerrarModal() {
  modalEditar.style.display = "none";
}

async function guardarEdicion() {

  const nombre = editNombre.value.trim();
  const precio = Number(editPrecio.value);
  const descripcion = editDescripcion.value.trim();

  if (!nombre) return alert("Nombre obligatorio");
  if (isNaN(precio) || precio <= 0) return alert("Precio inválido");

  await fetch(`${API_PRODUCTO}/${productoId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      sku: productoActual.sku,
      nombre,
      precio,
      descripcion
    })
  });

  cerrarModal();
  await cargarProducto();
}

/* ================= INVENTARIO ================= */

async function cargarInventario() {

  const res = await fetch(`${API_INVENTARIO}/producto/${productoId}`);
  inventarioActual = await res.json();

  tablaInventario.innerHTML = "";
  let total = 0;

  inventarioActual.forEach(item => {

    total += item.cantidad;

    tablaInventario.innerHTML += `
      <tr>
        <td>${item.nombreColor}</td>
        <td>${item.nombreTalla}</td>
        <td>${item.cantidad}</td>
        <td>
          <div class="btn-group">
            <button class="btn-mini btn-add"
              onclick="incrementar(${item.idInventario})">+</button>

            <button class="btn-mini btn-remove"
              onclick="decrementar(${item.idInventario})">−</button>
          </div>
        </td>
      </tr>`;
  });

  stockTotal.textContent = "Stock Total: " + total;
}

async function guardarVariante() {

  const colorId = Number(selectColor.value);
  const tallaId = Number(selectTalla.value);
  const cantidad = Number(cantidadVariante.value);

  if (!colorId || !tallaId) return alert("Selecciona color y talla");
  if (cantidad <= 0) return alert("Cantidad inválida");

  const nombreColor = selectColor.selectedOptions[0].text;
  const nombreTalla = selectTalla.selectedOptions[0].text;

  const existente = inventarioActual.find(i =>
    i.nombreColor === nombreColor &&
    i.nombreTalla === nombreTalla
  );

  if (existente) {

    await fetch(`${API_INVENTARIO}/${existente.idInventario}/incrementar`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ delta: cantidad })
    });

  } else {

    await fetch(`${API_INVENTARIO}/variante`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productoId, colorId, tallaId, cantidad })
    });
  }

  cantidadVariante.value = "";
  await cargarInventario();
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

/* ================= SELECTS ================= */

async function cargarSelects() {

  const [c, t, cat, e] = await Promise.all([
    fetch(API_COLORES),
    fetch(API_TALLAS),
    fetch(API_CATEGORIAS),
    fetch(API_ETIQUETAS)
  ]);

  llenarSelect("selectColor", await c.json(), "id", "nombreColor");
  llenarSelect("selectTalla", await t.json(), "id", "nombreTalla");
  llenarSelect("selectCategoria", await cat.json(), "idCategoria", "nombreCategoria");
  llenarSelect("selectEtiqueta", await e.json(), "id_etiqueta", "nombreEtiqueta");
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

/* ================= RELACIONES ================= */

async function cargarRelaciones() {

  const res = await fetch(`${API_PRODUCTO}/${productoId}`);
  const producto = await res.json();

  renderTabla("tablaCategorias",
    producto.categoriaNombres || [],
    producto.categoriaIds || [],
    "categoria");

  renderTabla("tablaEtiquetas",
    producto.etiquetaNombres || [],
    producto.etiquetaIds || [],
    "etiquetas");
}

function renderTabla(tablaId, nombres, ids, tipo) {

  const tabla = document.getElementById(tablaId);
  tabla.innerHTML = "";

  nombres.forEach((nombre, i) => {
    tabla.innerHTML += `
      <tr>
        <td>${nombre}</td>
        <td>
          <button class="btn-mini btn-danger"
            onclick="eliminarRelacion('${tipo}', ${ids[i]})">
            Eliminar
          </button>
        </td>
      </tr>`;
  });
}

async function insertarCategoria() {
  const id = Number(selectCategoria.value);
  await fetch(`${API_PRODUCTO}/${productoId}/categoria/${id}`, { method: "POST" });
  cargarRelaciones();
}

async function insertarEtiqueta() {
  const id = Number(selectEtiqueta.value);
  await fetch(`${API_PRODUCTO}/${productoId}/etiquetas/${id}`, { method: "POST" });
  cargarRelaciones();
}
function volverAtras() {
  window.history.back();
}
async function eliminarRelacion(tipo, id) {
  await fetch(`${API_PRODUCTO}/${productoId}/${tipo}/${id}`, { method: "DELETE" });
  cargarRelaciones();
}