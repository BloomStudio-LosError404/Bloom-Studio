document.addEventListener("DOMContentLoaded", () => {

    const form = document.getElementById("formContacto");

    form.addEventListener("submit", function (e) {
        e.preventDefault();

        const tipo = document.getElementById("tipo").value.trim();
        const nombre = document.getElementById("nombre").value.trim();
        const apellido = document.getElementById("apellido").value.trim();
        const email = document.getElementById("email").value.trim();
        const telefono = document.getElementById("telefono").value.trim();
        const mensaje = document.getElementById("mensaje").value.trim();
        if (!tipo || !nombre || !apellido || !email || !telefono || !mensaje) {
            Swal.fire({
                icon: "warning",
                title: "Campos incompletos",
                text: "Por favor completa todos los campos"
            });
            return;
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            Swal.fire({
                icon: "error",
                title: "Correo inválido",
                text: "Ingresa un correo válido"
            });
            return;
        }

        const telefonoRegex = /^[0-9]{10}$/;
        if (!telefonoRegex.test(telefono)) {
            Swal.fire({
                icon: "error",
                title: "Teléfono inválido",
                text: "El teléfono debe tener 10 dígitos"
            });
            return;
        }
        Swal.fire({
            icon: "success",
            title: "¡Formulario enviado!",
            text: "Gracias por contactarnos, te responderemos pronto.",
            confirmButtonText: "Aceptar"
        });

        // Limpia el formulario
        form.reset();
    });

});
