const API_BASE = "http://localhost:8080/api/v1/etiquetas";

const contenedor = document.getElementById("contenedorCategorias");
const btnGuardar = document.getElementById("btnGuardarCategoria");
const inputNombre = document.getElementById("nombreCategoria");
const buscador = document.getElementById("buscadorCategoria");

const modalEliminar = document.getElementById("modalEliminarCategoria");
const modalEditar = document.getElementById("modalEditarCategoria");

let etiquetaSeleccionadaId = null;
let listaEtiquetas = [];

/* ================= CREAR ================= */
btnGuardar.addEventListener("click", async () => {

  const nombre = inputNombre.value.trim();

  if (!nombre) {
    alert("El nombre es obligatorio");
    return;
  }

  try {
    const response = await fetch(API_BASE, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nombreEtiqueta: nombre,
        estatus: true
      })
    });

    if (!response.ok) throw new Error();

    inputNombre.value = "";
    cargarEtiquetas();

  } catch (error) {
    alert("Error al crear etiqueta");
  }
});

/* ================= CARGAR ================= */
async function cargarEtiquetas() {
  try {
    const res = await fetch(API_BASE);
    listaEtiquetas = await res.json();
    renderEtiquetas(listaEtiquetas);
  } catch (error) {
    console.error("Error cargando etiquetas:", error);
  }
}

/* ================= RENDER ================= */
function renderEtiquetas(etiquetas) {

  contenedor.innerHTML = "";

  etiquetas.forEach(et => {

    const id = et.id_etiqueta; // 🔥 ESTE ES EL ID CORRECTO

    const card = document.createElement("div");
    card.className = `categoria-card ${
      et.estatus ? "categoria-activa" : "categoria-inactiva"
    }`;

    card.innerHTML = `
      <h3>${et.nombreEtiqueta}</h3>
      <p>${et.estatus ? "Activa" : "Inactiva"}</p>
    `;

    const actions = document.createElement("div");
    actions.className = "categoria-actions";

    const btnEditar = document.createElement("button");
    btnEditar.className = "btn btn-primary";
    btnEditar.textContent = "Editar";
    btnEditar.onclick = () => abrirEditar(et, id);

    const btnEliminar = document.createElement("button");
    btnEliminar.className = "btn btn-danger";
    btnEliminar.textContent = "Eliminar";
    btnEliminar.onclick = () => abrirEliminar(id);

    actions.appendChild(btnEditar);
    actions.appendChild(btnEliminar);

    card.appendChild(actions);
    contenedor.appendChild(card);
  });
}

/* ================= BUSCADOR ================= */
buscador.addEventListener("input", () => {

  const texto = buscador.value.toLowerCase();

  const filtradas = listaEtiquetas.filter(e =>
    e.nombreEtiqueta.toLowerCase().includes(texto)
  );

  renderEtiquetas(filtradas);
});

/* ================= ELIMINAR ================= */
function abrirEliminar(id) {
  etiquetaSeleccionadaId = id;
  modalEliminar.style.display = "flex";
}

document.getElementById("confirmarEliminarCategoria")
.addEventListener("click", async () => {

  if (!etiquetaSeleccionadaId) return;

  try {
    const response = await fetch(`${API_BASE}/${etiquetaSeleccionadaId}`, {
      method: "DELETE"
    });

    if (!response.ok) throw new Error();

    modalEliminar.style.display = "none";
    etiquetaSeleccionadaId = null;
    cargarEtiquetas();

  } catch (error) {
    alert("Error al eliminar");
  }
});

/* ================= EDITAR ================= */
function abrirEditar(etiqueta, id) {

  etiquetaSeleccionadaId = id;

  document.getElementById("editNombreCategoria").value =
    etiqueta.nombreEtiqueta;

  document.getElementById("editEstatusCategoria").value =
    etiqueta.estatus.toString();

  modalEditar.style.display = "flex";
}

document.getElementById("confirmarEditarCategoria")
.addEventListener("click", async () => {

  const nuevoNombre =
    document.getElementById("editNombreCategoria").value.trim();

  const nuevoEstatus =
    document.getElementById("editEstatusCategoria").value === "true";

  if (!nuevoNombre) {
    alert("El nombre es obligatorio");
    return;
  }

  try {
    const response = await fetch(
      `${API_BASE}/editar/${etiquetaSeleccionadaId}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombreEtiqueta: nuevoNombre,
          estatus: nuevoEstatus
        })
      }
    );

    if (!response.ok) throw new Error();

    modalEditar.style.display = "none";
    etiquetaSeleccionadaId = null;
    cargarEtiquetas();

  } catch (error) {
    alert("Error al actualizar");
  }
});

/* ================= CERRAR MODALES ================= */
document.querySelectorAll(".close-modal").forEach(btn => {
  btn.addEventListener("click", () => {
    modalEliminar.style.display = "none";
    modalEditar.style.display = "none";
    etiquetaSeleccionadaId = null;
  });
});

/* ================= INICIALIZAR ================= */
cargarEtiquetas();