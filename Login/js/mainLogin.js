document.addEventListener('DOMContentLoaded', () => {
    const cardInner = document.getElementById('card-inner');
    const btnToRegister = document.getElementById('btn-to-register');
    const btnToLogin = document.getElementById('btn-to-login');

    // Alertas minimalistas
    const toast = (title, icon = 'success') => {
        Swal.fire({
            title: title,
            icon: icon,
            confirmButtonColor: '#4a3c6b',
            customClass: {
                popup: 'rounded-4',
                confirmButton: 'rounded-pill px-4'
            }
        });
    };

    // --- LÓGICA DE ANIMACIÓN (GIRO) ---
    if (btnToRegister) {
        btnToRegister.addEventListener('click', (e) => {
            e.preventDefault();
            cardInner.classList.add('is-flipped');
        });
    }

    if (btnToLogin) {
        btnToLogin.addEventListener('click', (e) => {
            e.preventDefault();
            cardInner.classList.remove('is-flipped');
        });
    }

    // URL Base del Backend en localhost
    const API_URL = "http://localhost:8080/api";

    // --- LÓGICA DE REGISTRO ---
    document.getElementById('register-form').addEventListener('submit', async (e) => {
        e.preventDefault();

        const nombre = document.getElementById('name-reg').value;
        const email = document.getElementById('email-reg').value;
        const password = document.getElementById('pass-reg').value;

        const nuevoUsuario = {
            nombre: nombre,
            email: email,
            contrasena: password
            // No mandamos rol, el backend asigna CLIENTE por defecto.
        };

        try {
            const response = await fetch(`${API_URL}/v1/usuarios`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(nuevoUsuario)
            });

            if (response.ok) {
                Swal.fire({
                    icon: 'success',
                    title: 'Cuenta creada',
                    text: 'Ahora puedes iniciar sesión',
                    confirmButtonText: 'Ir al Login'
                }).then(() => {
                    // Simular click para voltear la tarjeta al login
                    document.getElementById('btn-to-login').click();
                    // O recargar: window.location.reload();
                });
            } else {
                // Si el correo ya existe (409 Conflict)
                const errorData = await response.json(); // El backend devuelve un JSON de error bonito
                Swal.fire('Error', errorData.message || 'No se pudo registrar', 'error');
            }

        } catch (error) {
            Swal.fire('Error', 'Fallo de conexión', 'error');
        }
    });

    // --- LOGIN ---
    document.getElementById('login-form').addEventListener('submit', async (e) => {
        e.preventDefault();

        const email = document.getElementById('email-login').value;
        const password = document.getElementById('pass-login').value;

        try {
            const response = await fetch(`${API_URL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            if (response.ok) {
                const data = await response.json();

                // 1. GUARDAR LA "PULSERA VIP" (TOKEN)
                localStorage.setItem('token', data.token);
                localStorage.setItem('email', data.email);
                localStorage.setItem('rol', data.role); // ADMIN o CLIENTE
                localStorage.setItem('nombre', data.nombre);

                // 2. REDIRECCIÓN SEGÚN ROL (CON EL NOMBRE EN LA ALERTA)
                Swal.fire({
                    icon: 'success',
                    title: `¡Hola, ${data.nombre}!`, 
                    text: 'Iniciando sesión...',
                    timer: 2000,
                    showConfirmButton: false
                }).then(() => {
                    if (data.role === 'ADMIN' || data.role === 'ROLE_ADMIN') {
                        window.location.href = '../../Administrator/admin.html';
                    } else {
                        window.location.href = '../../index.html';
                    }
                });

            } else {
                // Error de credenciales (401)
                Swal.fire('Error', 'Usuario o contraseña incorrectos', 'error');
            }

        } catch (error) {
            console.error(error);
            Swal.fire('Error', 'No se pudo conectar con el servidor', 'error');
        }
    });

    // Lógica para recuperar contraseña
    document.querySelector('.forgot-password').addEventListener('click', async (e) => {
        e.preventDefault();

        const { value: email } = await Swal.fire({
            title: 'Recuperar Contraseña',
            input: 'email',
            inputLabel: 'Ingresa tu correo registrado',
            inputPlaceholder: 'correo@ejemplo.com',
            showCancelButton: true,
            confirmButtonText: 'Enviar instrucciones',
            showLoaderOnConfirm: true,
            preConfirm: (email) => {
                // Petición al Backend
                return fetch('http://localhost:8080/api/auth/recuperar-password', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email: email })
                })
                    .then(response => {
                        if (!response.ok) {
                            throw new Error(response.statusText);
                        }
                        return response.text();
                    })
                    .catch(error => {
                        Swal.showValidationMessage(`Error: ${error}`);
                    });
            },
            allowOutsideClick: () => !Swal.isLoading()
        });

        if (email) {
            Swal.fire({
                title: '¡Enviado!',
                text: 'Si el correo existe, recibirás un enlace en breve.',
                icon: 'success'
            });
        }
    });
});