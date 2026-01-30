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
                popup: 'rounded-4', // Bordes redondeados
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

    // --- LÓGICA DE REGISTRO ---
    const regForm = document.getElementById('register-form');
    if (regForm) {
        regForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const name = document.getElementById('name-reg').value;
            const email = document.getElementById('email-reg').value;
            const pass = document.getElementById('pass-reg').value;

            const users = JSON.parse(localStorage.getItem('users')) || [];
            
            if (users.find(u => u.email === email)) {
                return Swal.fire({
                    icon: 'error',
                    title: '¡Oops!',
                    text: 'Este correo ya está registrado.',
                    confirmButtonColor: '#4a3c6b'
                });
            }

            users.push({ name, email, pass });
            localStorage.setItem('users', JSON.stringify(users));

            Swal.fire({
                icon: 'success',
                title: '¡Bienvenido!',
                text: 'Cuenta creada con éxito.',
                showConfirmButton: false,
                timer: 2000 // Se cierra sola tras 2 segundos
            });

            regForm.reset();
            cardInner.classList.remove('is-flipped');
        });
    }

    // --- LÓGICA DE LOGIN ---
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const email = document.getElementById('email-login').value;
            const pass = document.getElementById('pass-login').value;
            
            const users = JSON.parse(localStorage.getItem('users')) || [];
            const userFound = users.find(u => u.email === email && u.pass === pass);

            if (userFound) {
                Swal.fire({
                    icon: 'success',
                    title: `¡Hola, ${userFound.name}!`,
                    text: 'Iniciando sesión...',
                    showConfirmButton: false,
                    timer: 1500
                }).then(() => {
                    window.location.href = '../Shop/shop.html';
                });
            } else {
                Swal.fire({
                    icon: 'warning',
                    title: 'Acceso denegado',
                    text: 'Credenciales incorrectas.',
                    confirmButtonColor: '#4a3c6b'
                });
            }
        });
    }
});