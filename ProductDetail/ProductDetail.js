// Codigo del js para el carrito en la pagina de detalle de producto

// 1. Definimos el producto que se muestra actualmente en la página
// Nota: El ID debe ser único para que el carrito no se confunda
const productoActual = {
    id: 10,
    nombre: "Duo en Tom & Jerry",
    precio: 899,
    img: "/img/Catalogo/Sudaderas/DuoTomJerry.png"
};

// 2. Esperamos a que el DOM cargue
document.addEventListener("DOMContentLoaded", () => {
    // 2. Selección de Talla y Color (Lógica visual de la página)
    let colorSeleccionado = null;
    let tallaSeleccionada = null;

    const colores = document.querySelectorAll("#color-selector .dot");
    const tallas = document.querySelectorAll("#size-selector .pill");

    colores.forEach(dot => {
        dot.addEventListener("click", () => {
            colores.forEach(d => d.style.border = "none");
            dot.style.border = "2px solid #000";
            colorSeleccionado = dot.getAttribute("data-color");
        });
    });

    tallas.forEach(pill => {
        pill.addEventListener("click", () => {
            tallas.forEach(p => { p.style.backgroundColor = ""; p.style.color = ""; });
            pill.style.backgroundColor = "#ffc8a2";
            pill.style.color = "white";
            tallaSeleccionada = pill.getAttribute("data-size");
        });
    });

    // --- Botón Añadir al Carrito ---

    if (btnAgregar) {
        btnAgregar.addEventListener("click", () => {
            // VALIDACIÓN: Si no ha seleccionado ambos, avisamos
            if (!colorSeleccionado || !tallaSeleccionada) {
                alert("Por favor, selecciona una talla y un color antes de continuar.");
                return;
            }

            const productoParaCarrito = {
                id: 10, 
                nombre: `Duo Tom & Jerry (${colorSeleccionado} - ${tallaSeleccionada})`,
                precio: 899,
                img: "/img/Catalogo/Sudaderas/DuoTomJerry.png",
                color: colorSeleccionado,
                talla: tallaSeleccionada
            };

            agregarAlCarrito(productoParaCarrito);
            alert(`¡Agregado! Color: ${colorSeleccionado}, Talla: ${tallaSeleccionada}`);
            actualizarNumeroCarrito();
        });
    }
    
    actualizarNumeroCarrito();
});

// Mantén tus funciones agregarAlCarrito() y actualizarNumeroCarrito() igual que antes




// 1.  "Base de Datos" 
const baseDeDatos = [
    { id: 1, nombre: "Veloziraptor", precio: 111111, img: "/img/productos/1.jpg", descripcion: "Descripción de la Veloziraptor..." },
    { id: 10, nombre: "Duo en Tom & Jerry", precio: 899, img: "/img/Catalogo/Sudaderas/DuoTomJerry.png", descripcion: "Dúo de sudaderas icónicas..." },
    // ... agrega el resto de tus productos aquí
];

document.addEventListener("DOMContentLoaded", () => {
    // 2. Obtener el ID de la URL
    const queryParams = new URLSearchParams(window.location.search);
    const idProducto = parseInt(queryParams.get("id"));

    // 3. Buscar el producto en la base de datos
    const producto = baseDeDatos.find(p => p.id === idProducto);

    if (producto) {
        cargarDatosProducto(producto);
    } else {
        console.error("Producto no encontrado");
        // Opcional: redireccionar a la tienda si no existe el ID
    }
});

// 4. Función para inyectar la información en el HTML
function cargarDatosProducto(producto) {
    document.getElementById("nombre-producto").innerText = producto.nombre;
    document.getElementById("precio-producto").innerText = `$${producto.precio}.00`;
    document.getElementById("img-producto").src = producto.img;
    
    // Si tienes un contenedor de descripción:
    if(document.getElementById("descripcion-producto")) {
        document.getElementById("descripcion-producto").innerText = producto.descripcion;
    }

    // Configurar el botón de añadir al carrito con el producto encontrado
    configurarBotonCarrito(producto);
}

function configurarBotonCarrito(producto) {
    const btnAgregar = document.getElementById("btn-add-to-cart");
    btnAgregar.onclick = () => {
        // Aquí recuperas la talla y color que seleccionó el usuario
        const talla = document.querySelector(".pill.selected")?.dataset.size;
        const color = document.querySelector(".dot.selected")?.dataset.color;

        if (!talla || !color) {
            alert("Selecciona talla y color");
            return;
        }

        const productoFinal = {
            ...producto,
            nombre: `${producto.nombre} (${color} - ${talla})`,
            talla,
            color
        };

        agregarAlCarrito(productoFinal);
        actualizarNumeroCarrito();
        alert("¡Agregado al carrito!");
    };
}