document.getElementById("formContacto").addEventListener("submit", function (e) {
    e.preventDefault();

    const tipo = document.getElementById("tipo").value.trim();
    const nombre = document.getElementById("nombre").value.trim();
    const apellido = document.getElementById("apellido").value.trim();
    const email = document.getElementById("email").value.trim();
    const telefono = document.getElementById("telefono").value.trim();
    const mensaje = document.getElementById("mensaje").value.trim();


    if (!tipo || !nombre || !apellido || !email || !telefono) {
        alert("Por favor, completa todos los campos obligatorios");
        return;
    }

   
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        alert("Ingresa un correo electrónico válido");
        return;
    }

   
    const telefonoRegex = /^[0-9]{10}$/;
    if (!telefonoRegex.test(telefono)) {
        alert("El teléfono debe tener 10 dígitos numéricos");
        return;
    }

  
    alert("Formulario enviado correctamente");
    this.submit();
});
