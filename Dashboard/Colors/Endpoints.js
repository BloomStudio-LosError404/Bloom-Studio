document.addEventListener("DOMContentLoaded", () => {

  const API_BASE = "http://localhost:8080/api/colores";

  const contenedor = document.getElementById("contenedorColores");
  const btnGuardar = document.getElementById("btnGuardarColor");
  const inputNombre = document.getElementById("nombreColor");
  const inputHex = document.getElementById("codigoHex");
  const buscador = document.getElementById("buscadorColor");

  const modalEliminar = document.getElementById("modalEliminarColor");
  const modalEditar = document.getElementById("modalEditarColor");

  const confirmarEliminar = document.getElementById("confirmarEliminarColor");
  const confirmarEditar = document.getElementById("confirmarEditarColor");

  const menuBtn = document.getElementById("menuBtn");
  const sidebar = document.getElementById("sidebar");
  const overlay = document.getElementById("overlay");

  let listaColores = [];
  let colorSeleccionadoId = null;

  /* ===== SIDEBAR ===== */
  menuBtn.addEventListener("click", () => {
    sidebar.classList.toggle("open");
    overlay.classList.toggle("show");
  });

  overlay.addEventListener("click", () => {
    sidebar.classList.remove("open");
    overlay.classList.remove("show");
  });

  /* ===== CARGAR ===== */
  async function cargarColores() {
    try {
      const res = await fetch(API_BASE);
      listaColores = await res.json();
      renderColores(listaColores);
    } catch (error) {
      console.error("Error cargando colores:", error);
    }
  }

  /* ===== RENDER ===== */
  function renderColores(colores) {

    contenedor.innerHTML = "";

    colores.forEach(color => {

      const card = document.createElement("div");
      card.className = `color-card ${
        color.estatus ? "color-activo" : "color-inactivo"
      }`;

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
      btnEditar.onclick = () => abrirEditar(color);

      actions.appendChild(btnEditar);

      if (color.estatus) {
        const btnEliminar = document.createElement("button");
        btnEliminar.className = "btn btn-danger";
        btnEliminar.textContent = "Eliminar";
        btnEliminar.onclick = () => abrirEliminar(color.id);
        actions.appendChild(btnEliminar);
      }

      card.append(preview, nombre, hex, estado, actions);
      contenedor.appendChild(card);
    });
  }

  /* ===== CREAR ===== */
  btnGuardar.onclick = async () => {

    const nombre = inputNombre.value.trim();
    const hex = inputHex.value;

    if (!nombre) return alert("Ingresa un nombre");

    await fetch(API_BASE, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nombreColor: nombre,
        codigoHex: hex,
        estatus: true
      })
    });

    inputNombre.value = "";
    cargarColores();
  };

  /* ===== ELIMINAR ===== */
  function abrirEliminar(id) {
    colorSeleccionadoId = id;
    modalEliminar.style.display = "flex";
  }

  confirmarEliminar.onclick = async () => {
    await fetch(`${API_BASE}/${colorSeleccionadoId}`, {
      method: "DELETE"
    });

    modalEliminar.style.display = "none";
    cargarColores();
  };

  /* ===== EDITAR ===== */
  function abrirEditar(color) {
    colorSeleccionadoId = color.id;
    document.getElementById("editNombreColor").value = color.nombreColor;
    document.getElementById("editCodigoHex").value = color.codigoHex;
    document.getElementById("editEstatusColor").value = color.estatus.toString();
    modalEditar.style.display = "flex";
  }

  confirmarEditar.onclick = async () => {

    await fetch(`${API_BASE}/${colorSeleccionadoId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nombreColor: document.getElementById("editNombreColor").value,
        codigoHex: document.getElementById("editCodigoHex").value,
        estatus: document.getElementById("editEstatusColor").value === "true"
      })
    });

    modalEditar.style.display = "none";
    cargarColores();
  };

  document.querySelectorAll(".close-modal").forEach(btn => {
    btn.onclick = () => {
      modalEliminar.style.display = "none";
      modalEditar.style.display = "none";
    };
  });

  /* ===== BUSCADOR ===== */
  buscador.addEventListener("input", () => {
    const texto = buscador.value.toLowerCase();
    const filtrados = listaColores.filter(c =>
      c.nombreColor.toLowerCase().includes(texto)
    );
    renderColores(filtrados);
  });

  cargarColores();
});