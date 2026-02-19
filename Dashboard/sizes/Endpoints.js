const API_BASE = "http://localhost:8080/api/tallas";

const contenedor = document.getElementById("contenedorTallas");
const btnGuardar = document.getElementById("btnGuardar");
const inputTalla = document.getElementById("nombreTalla");
const buscador = document.getElementById("buscadorTalla");

const modalEliminar = document.getElementById("modalEliminar");
const modalEditar = document.getElementById("modalEditar");

let tallaSeleccionadaId = null;
let listaTallas = [];

/* CREAR */
btnGuardar.addEventListener("click", async () => {

  const nombre = inputTalla.value.trim();

  if (!nombre) {
    alert("Ingresa una talla");
    return;
  }

  if (nombre.length > 10) {
    alert("Máximo 10 caracteres");
    return;
  }

  await fetch(`${API_BASE}/Createtalla`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      nombreTalla: nombre,
      estatus: true
    })
  });

  inputTalla.value = "";
  cargarTallas();
});

/* CARGAR */
async function cargarTallas() {
  const res = await fetch(`${API_BASE}/AllTallas`);
  listaTallas = await res.json();
  renderTallas(listaTallas);
}

/* RENDER */
function renderTallas(tallas) {

  contenedor.innerHTML = "";

  tallas.forEach(talla => {

    const card = document.createElement("div");
    card.className = `talla-card ${
      talla.estatus ? "talla-activa" : "talla-inactiva"
    }`;

    card.innerHTML = `
      <h3>${talla.nombreTalla}</h3>
      <p>${talla.estatus ? "Activa" : "Inactiva"}</p>
    `;

    const actions = document.createElement("div");
    actions.className = "talla-actions";

    const btnEditar = document.createElement("button");
    btnEditar.className = "btn btn-primary";
    btnEditar.textContent = "Actualizar";
    btnEditar.addEventListener("click", () => abrirEditar(talla));
    actions.appendChild(btnEditar);

    // SOLO mostrar eliminar si estatus === true
    if (talla.estatus === true) {
      const btnEliminar = document.createElement("button");
      btnEliminar.className = "btn btn-danger";
      btnEliminar.textContent = "Eliminar";
      btnEliminar.addEventListener("click", () =>
        abrirEliminar(talla.id)
      );
      actions.appendChild(btnEliminar);
    }

    card.appendChild(actions);
    contenedor.appendChild(card);
  });
}

/* BUSCADOR */
buscador.addEventListener("input", () => {
  const texto = buscador.value.toLowerCase();
  const filtradas = listaTallas.filter(t =>
    t.nombreTalla.toLowerCase().includes(texto)
  );
  renderTallas(filtradas);
});

/* ELIMINAR */
function abrirEliminar(id) {
  tallaSeleccionadaId = id;
  modalEliminar.style.display = "flex";
}

document.getElementById("confirmarEliminar")
.addEventListener("click", async () => {

  await fetch(`${API_BASE}/deletetalla/${tallaSeleccionadaId}`, {
    method: "DELETE"
  });

  modalEliminar.style.display = "none";
  cargarTallas();
});

/* EDITAR */
function abrirEditar(talla) {
  tallaSeleccionadaId = talla.id;
  document.getElementById("editNombre").value = talla.nombreTalla;
  document.getElementById("editEstatus").value = talla.estatus.toString();
  modalEditar.style.display = "flex";
}

document.getElementById("confirmarEditar")
.addEventListener("click", async () => {

  const nombre = document.getElementById("editNombre").value;
  const estatus = document.getElementById("editEstatus").value === "true";

  await fetch(`${API_BASE}/updatetalla/${tallaSeleccionadaId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      nombreTalla: nombre,
      estatus: estatus
    })
  });

  modalEditar.style.display = "none";
  cargarTallas();
});

/* CERRAR MODALES */
document.querySelectorAll(".close-modal").forEach(btn => {
  btn.addEventListener("click", () => {
    modalEliminar.style.display = "none";
    modalEditar.style.display = "none";
  });
});

cargarTallas();