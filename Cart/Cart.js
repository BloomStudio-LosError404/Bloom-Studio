// 1. SELECTORES
const contenedorTarjetas = document.getElementById("product-items-container");
const unidadesElement = document.getElementById("unidades");
const precioElement = document.getElementById("precio");
const descuentoElement = document.getElementById("descuento");
const carritoVacioElement = document.getElementById("carrito-vacio");
const totalesElement = document.getElementById("totales");
const vaciarCarritoElement = document.getElementById("vaciar");
const inputCupon = document.querySelector(".cupon input");
const botonCupon = document.querySelector(".aplicar-cupon");

const envio = 0;
let descuentoAplicado = 0;

// 2. FUNCIONES DE INTERFAZ LOCAL (Solo para esta página)
function actualizarInterfazCompleta() {
    crearTarjetasProductosCarrito();
    actualizarTotales();
    revisarMensajeVacio();
    // Llamamos a la función que está en el JS del Header
    if (typeof actualizarNumeroCarrito === 'function') {
        actualizarNumeroCarrito();
    }
}

function actualizarTotales() {
    const productos = JSON.parse(localStorage.getItem("Articulos")) || [];
    let unidades = 0;
    let precio = 0;

    productos.forEach(producto => {
        unidades += producto.precio  * producto.cantidad;
        precio += producto.precio * producto.cantidad;
    });
    actualizarDescuento(precio);
    const precioFinal = precio - (precio * descuentoAplicado);

    if (unidadesElement) unidadesElement.innerText = `$${unidades.toFixed(2)}`;
    if (precioElement) precioElement.innerText = `$${precioFinal.toFixed(2)}`;
}


function revisarMensajeVacio() {
       const productos = JSON.parse(localStorage.getItem("Articulos")) || [];
    if (carritoVacioElement) {
        carritoVacioElement.style.display = (productos.length > 0) ? "none" : "block";
    }
}

// 3. RENDERIZADO DE COMPONENTES
function crearTarjetasProductosCarrito() {
    if (!contenedorTarjetas) return;
    contenedorTarjetas.innerHTML = "";
    const productos = JSON.parse(localStorage.getItem("Articulos")) || [];

    productos.forEach((producto) => {
        const nuevoProducto = document.createElement("div");
        nuevoProducto.classList = "tarjeta-producto";
        nuevoProducto.innerHTML = `
            <img src="../src/images/products/temporada-14-febrero/temporada-009.JPG" alt="${producto.nombre}">
            <h2>${producto.nombre}</h2>
            <p>$${producto.precio}</p>
            <div>
                <button class="btn-restar">-</button>
                <span class="cantidad">${producto.cantidad}</span>
                <button class="btn-sumar">+</button>
            </div>
        `;
        contenedorTarjetas.appendChild(nuevoProducto);

        // Usamos las funciones globales del Header
        nuevoProducto.querySelector(".btn-sumar").addEventListener("click", () => {
            agregarAlCarrito(producto);
            actualizarInterfazCompleta();
        });

        nuevoProducto.querySelector(".btn-restar").addEventListener("click", () => {
            restarAlCarrito(producto);
            actualizarInterfazCompleta();
        });
    });
}

// 4. LÓGICA DE CUPONES Y VACIADO
function vaciarCarrito() {
    localStorage.removeItem("Articulos");
    descuentoAplicado = 0;
    if (botonCupon) botonCupon.disabled = false;
    if (inputCupon) {
        inputCupon.disabled = false;
        inputCupon.value = "";
    }
    actualizarInterfazCompleta();
}

function aplicarCupon() {
    const codigoIngresado = inputCupon.value.trim().toUpperCase();
    const cupones = JSON.parse(localStorage.getItem("Cupones")) || [];
    const cupon = cupones.find(c => c.codigo === codigoIngresado);

    if (!cupon || !cupon.activo) {
         Swal.fire({
                icon: "error",
                title: "Cupón inválido",
                text: "Ingresa un cupón válido"
            });
            return;
    }

    const productos = JSON.parse(localStorage.getItem("Articulos")) || [];
    const totalCarrito = productos.reduce((acc, p) => acc + (p.precio * p.cantidad), 0);

    if (totalCarrito < cupon.minimoCompra) {
        Swal.fire({
                icon: "error",
                title: "El minimo de compra debe ser de $1500",
            });
            return;
    } else{
        Swal.fire({
                icon: "success",
                title: "¡Cupón aceptado!",
            });}
    descuentoAplicado = cupon.descuento;
    botonCupon.disabled = true;
    inputCupon.disabled = true;
    actualizarTotales();
}
function actualizarDescuento(precioSinDescuento) {
    if (!descuentoElement) return;

    const montoDescuento = precioSinDescuento * descuentoAplicado;
    descuentoElement.innerText = `$${montoDescuento.toFixed(2)}`;
}

function guardarCupones() {
    const cupones = [{ codigo: "BLOOM10", descuento: 0.10, activo: true, minimoCompra: 1500 }];
    localStorage.setItem("Cupones", JSON.stringify(cupones));
}

// 5. EVENTOS E INICIALIZACIÓN
if (vaciarCarritoElement) vaciarCarritoElement.addEventListener("click", vaciarCarrito);
if (botonCupon) botonCupon.addEventListener("click", aplicarCupon);

guardarCupones();
actualizarInterfazCompleta();



