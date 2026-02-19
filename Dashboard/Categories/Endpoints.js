const API_BASE = "http://localhost:8080/api/v1";

const contenedor = document.getElementById("contenedorCategorias");
const btnGuardar = document.getElementById("btnGuardarCategoria");
const inputNombre = document.getElementById("nombreCategoria");
const buscador = document.getElementById("buscadorCategoria");

const modalEliminar = document.getElementById("modalEliminarCategoria");
const modalEditar = document.getElementById("modalEditarCategoria");

let categoriaSeleccionadaId = null;
let listaCategorias = [];


/* CREAR */
btnGuardar.addEventListener("click", async () => {

  const nombre = inputNombre.value.trim();

  if (!nombre) {
    alert("El nombre es obligatorio");
    return;
  }

  if (nombre.length > 50) {
    alert("Máximo 50 caracteres");
    return;
  }

  const response = await fetch(`${API_BASE}/new-category`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      nombreCategoria: nombre,
      estatus: true
    })
  });

  if (response.status === 409) {
    alert("La categoría ya existe");
    return;
  }

  inputNombre.value = "";
  cargarCategorias();
});

/* CARGAR */
async function cargarCategorias() {
  const res = await fetch(`${API_BASE}/categories`);
  listaCategorias = await res.json();
  renderCategorias(listaCategorias);
}

/* RENDER */
function renderCategorias(categorias) {

  contenedor.innerHTML = "";

  categorias.forEach(cat => {

    const card = document.createElement("div");
    card.className = `categoria-card ${
      cat.estatus ? "categoria-activa" : "categoria-inactiva"
    }`;

    card.innerHTML = `
      <h3>${cat.nombreCategoria}</h3>
      <p>${cat.estatus ? "Activa" : "Inactiva"}</p>
    `;

    const actions = document.createElement("div");
    actions.className = "categoria-actions";

    const btnEditar = document.createElement("button");
    btnEditar.className = "btn btn-primary";
    btnEditar.textContent = "Actualizar";
    btnEditar.addEventListener("click", () => abrirEditar(cat));
    actions.appendChild(btnEditar);

    if (cat.estatus === true) {
      const btnEliminar = document.createElement("button");
      btnEliminar.className = "btn btn-danger";
      btnEliminar.textContent = "Eliminar";
      btnEliminar.addEventListener("click", () =>
        abrirEliminar(cat.idCategoria)
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
  const filtradas = listaCategorias.filter(c =>
    c.nombreCategoria.toLowerCase().includes(texto)
  );
  renderCategorias(filtradas);
});

/* ELIMINAR */
function abrirEliminar(id) {
  categoriaSeleccionadaId = id;
  modalEliminar.style.display = "flex";
}

document.getElementById("confirmarEliminarCategoria")
.addEventListener("click", async () => {

  await fetch(`${API_BASE}/delete-category/${categoriaSeleccionadaId}`, {
    method: "DELETE"
  });

  modalEliminar.style.display = "none";
  cargarCategorias();
});

/* EDITAR */
function abrirEditar(cat) {
  categoriaSeleccionadaId = cat.idCategoria;
  document.getElementById("editNombreCategoria").value = cat.nombreCategoria;
  document.getElementById("editEstatusCategoria").value = cat.estatus.toString();
  modalEditar.style.display = "flex";
}

document.getElementById("confirmarEditarCategoria")
.addEventListener("click", async () => {

  await fetch(`${API_BASE}/update-category/${categoriaSeleccionadaId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      nombreCategoria: document.getElementById("editNombreCategoria").value,
      estatus: document.getElementById("editEstatusCategoria").value === "true"
    })
  });

  modalEditar.style.display = "none";
  cargarCategorias();
});

/* CERRAR MODALES */
document.querySelectorAll(".close-modal").forEach(btn => {
  btn.addEventListener("click", () => {
    modalEliminar.style.display = "none";
    modalEditar.style.display = "none";
  });
});

cargarCategorias();