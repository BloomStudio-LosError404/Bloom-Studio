const API_BASE = "http://localhost:8080/api/colores";

const contenedor = document.getElementById("contenedorColores");
const btnGuardar = document.getElementById("btnGuardarColor");
const inputNombre = document.getElementById("nombreColor");
const inputHex = document.getElementById("codigoHex");
const buscador = document.getElementById("buscadorColor");

const modalEliminar = document.getElementById("modalEliminarColor");
const modalEditar = document.getElementById("modalEditarColor");

let colorSeleccionadoId = null;
let listaColores = [];

if (menuBtn) {
  menuBtn.addEventListener("click", () => {
    sidebar.classList.toggle("open");
    overlay.classList.toggle("show");
  });
}

/* CREAR */
btnGuardar.addEventListener("click", async () => {

  const nombre = inputNombre.value.trim();

  if (!nombre) {
    alert("Ingresa un color");
    return;
  }

  if (nombre.length > 50) {
    alert("Máximo 50 caracteres");
    return;
  }

  await fetch(API_BASE, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      nombreColor: nombre,
      codigoHex: inputHex.value,
      estatus: true
    })
  });

  inputNombre.value = "";
  cargarColores();
});

/* CARGAR */
async function cargarColores() {
  const res = await fetch(API_BASE);
  listaColores = await res.json();
  renderColores(listaColores);
}

/* RENDER */
function renderColores(colores) {

  contenedor.innerHTML = "";

  colores.forEach(color => {

    const card = document.createElement("div");
    card.className = `color-card ${
      color.estatus ? "color-activo" : "color-inactivo"
    }`;

    // Preview pequeño del color
    const preview = document.createElement("div");
    preview.className = "color-preview";
    preview.style.background = color.codigoHex;

    const nombre = document.createElement("h3");
    nombre.textContent = color.nombreColor;

    const hex = document.createElement("p");
    hex.textContent = color.codigoHex;

    const estado = document.createElement("p");
    estado.textContent = color.estatus ? "Activo" : "Inactivo";

    const actions = document.createElement("div");
    actions.className = "color-actions";

    const btnEditar = document.createElement("button");
    btnEditar.className = "btn btn-primary";
    btnEditar.textContent = "Actualizar";
    btnEditar.addEventListener("click", () => abrirEditar(color));
    actions.appendChild(btnEditar);

    if (color.estatus === true) {
      const btnEliminar = document.createElement("button");
      btnEliminar.className = "btn btn-danger";
      btnEliminar.textContent = "Eliminar";
      btnEliminar.addEventListener("click", () => abrirEliminar(color.id));
      actions.appendChild(btnEliminar);
    }

    card.appendChild(preview);
    card.appendChild(nombre);
    card.appendChild(hex);
    card.appendChild(estado);
    card.appendChild(actions);

    contenedor.appendChild(card);
  });
}

/* BUSCADOR */
buscador.addEventListener("input", () => {
  const texto = buscador.value.toLowerCase();
  const filtrados = listaColores.filter(c =>
    c.nombreColor.toLowerCase().includes(texto)
  );
  renderColores(filtrados);
});

/* ELIMINAR */
function abrirEliminar(id) {
  colorSeleccionadoId = id;
  modalEliminar.style.display = "flex";
}

document.getElementById("confirmarEliminarColor")
.addEventListener("click", async () => {

  await fetch(`${API_BASE}/${colorSeleccionadoId}`, {
    method: "DELETE"
  });

  modalEliminar.style.display = "none";
  cargarColores();
});

/* EDITAR */
function abrirEditar(color) {
  colorSeleccionadoId = color.id;
  document.getElementById("editNombreColor").value = color.nombreColor;
  document.getElementById("editCodigoHex").value = color.codigoHex;
  document.getElementById("editEstatusColor").value = color.estatus.toString();
  modalEditar.style.display = "flex";
}

document.getElementById("confirmarEditarColor")
.addEventListener("click", async () => {

  await fetch(`${API_BASE}/${colorSeleccionadoId}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      nombreColor: document.getElementById("editNombreColor").value,
      codigoHex: document.getElementById("editCodigoHex").value,
      estatus: document.getElementById("editEstatusColor").value === "true"
    })
  });

  modalEditar.style.display = "none";
  cargarColores();
});

/* CERRAR MODALES */
document.querySelectorAll(".close-modal").forEach(btn => {
  btn.addEventListener("click", () => {
    modalEliminar.style.display = "none";
    modalEditar.style.display = "none";
  });
});

cargarColores();