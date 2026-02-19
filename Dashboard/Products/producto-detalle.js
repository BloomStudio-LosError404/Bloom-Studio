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

/* ================= INIT ================= */

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
  if (!res.ok) return alert("Error al cargar producto");

  productoActual = await res.json();

  document.getElementById("tituloProducto").textContent = productoActual.nombre;
  document.getElementById("imagenProducto").src = productoActual.imgUrl;
  document.getElementById("skuProducto").textContent = productoActual.sku;
  document.getElementById("precioProducto").textContent =
    mxn.format(Number(productoActual.precio));
  document.getElementById("estadoProducto").textContent =
    productoActual.estadoProducto;
}

/* ================= MODAL ================= */

function abrirModalEditar() {
  document.getElementById("modalEditar").style.display = "flex";

  document.getElementById("editNombre").value = productoActual.nombre;
  document.getElementById("editPrecio").value = productoActual.precio;
  document.getElementById("editDescripcion").value =
    productoActual.descripcion || "";
  document.getElementById("editImagen").value = "";
}

function cerrarModal() {
  document.getElementById("modalEditar").style.display = "none";
}

/* ================= EDITAR PRODUCTO + IMAGEN ================= */

async function guardarEdicion() {
  const nombre = document.getElementById("editNombre").value.trim();
  const precio = Number(document.getElementById("editPrecio").value);
  const descripcion = document.getElementById("editDescripcion").value.trim();
  const imagen = document.getElementById("editImagen").files[0];

  if (!nombre) return alert("Nombre obligatorio");
  if (isNaN(precio) || precio <= 0) return alert("Precio inválido");

  try {
    const res = await fetch(`${API_PRODUCTO}/${productoId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sku: productoActual.sku,
        nombre,
        precio,
        descripcion
      })
    });

    if (!res.ok) throw new Error("Error al actualizar producto");

    if (imagen) {
      const formData = new FormData();
      formData.append("imagen", imagen);

      const resImagen = await fetch(
        `${API_PRODUCTO}/${productoId}/imagen`,
        {
          method: "PUT",
          body: formData
        }
      );

      if (!resImagen.ok) throw new Error("Error al actualizar imagen");
    }

    cerrarModal();
    await cargarProducto();
    alert("Producto actualizado correctamente ");

  } catch (error) {
    alert(error.message);
  }
}

/* ================= INVENTARIO ================= */

async function cargarInventario() {
  const res = await fetch(`${API_INVENTARIO}/producto/${productoId}`);
  if (!res.ok) return alert("Error al cargar inventario");

  inventarioActual = await res.json();

  const tabla = document.getElementById("tablaInventario");
  tabla.innerHTML = "";

  let total = 0;

  inventarioActual.forEach(item => {
    total += item.cantidad;

    tabla.innerHTML += `
      <tr>
        <td>${item.nombreColor}</td>
        <td>${item.nombreTalla}</td>
        <td>${item.cantidad}</td>
        <td>
          <button class="btn-mini btn-add"
            onclick="incrementar(${item.idInventario})">+</button>

          <button class="btn-mini btn-danger"
            onclick="decrementar(${item.idInventario})">−</button>
        </td>
      </tr>
    `;
  });

  document.getElementById("stockTotal").textContent =
    "Stock Total: " + total;
}

async function guardarVariante() {
  const colorId = Number(document.getElementById("selectColor").value);
  const tallaId = Number(document.getElementById("selectTalla").value);
  const cantidad = Number(document.getElementById("cantidadVariante").value);

  if (!colorId || !tallaId) return alert("Selecciona color y talla");
  if (cantidad <= 0) return alert("Cantidad inválida");

  try {
    await fetch(`${API_INVENTARIO}/variante`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productoId, colorId, tallaId, cantidad })
    });

    document.getElementById("cantidadVariante").value = "";
    await cargarInventario();
  } catch {
    alert("Error al guardar variante");
  }
}

async function incrementar(id) {
  try {
    await fetch(`${API_INVENTARIO}/${id}/incrementar`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ delta: 1 })
    });
    await cargarInventario();
  } catch {
    alert("Error al incrementar");
  }
}

async function decrementar(id) {
  try {
    await fetch(`${API_INVENTARIO}/${id}/decrementar`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ delta: 1 })
    });
    await cargarInventario();
  } catch {
    alert("Error al decrementar");
  }
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

  renderTabla(
    "tablaCategorias",
    producto.categoriaNombres || [],
    producto.categoriaIds || [],
    "categoria"
  );

  renderTabla(
    "tablaEtiquetas",
    producto.etiquetaNombres || [],
    producto.etiquetaIds || [],
    "etiquetas"
  );
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
      </tr>
    `;
  });
}

async function insertarCategoria() {
  const id = Number(document.getElementById("selectCategoria").value);
  await fetch(`${API_PRODUCTO}/${productoId}/categoria/${id}`, { method: "POST" });
  await cargarRelaciones();
}

async function insertarEtiqueta() {
  const id = Number(document.getElementById("selectEtiqueta").value);
  await fetch(`${API_PRODUCTO}/${productoId}/etiquetas/${id}`, { method: "POST" });
  await cargarRelaciones();
}

async function eliminarRelacion(tipo, id) {
  await fetch(`${API_PRODUCTO}/${productoId}/${tipo}/${id}`, {
    method: "DELETE"
  });
  await cargarRelaciones();
}

function volverAtras() {
  window.history.back();
}