// 1. "Base de Datos" (Solo lo que pertenece a esta página)
const baseDeDatos = [
    { id: 10, nombre: "Duo en Tom & Jerry", precio: 899, img: "/img/Catalogo/Sudaderas/DuoTomJerry.png", descripcion: "Dúo de sudaderas icónicas..." },
];

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

    // 3. Obtener Producto de la URL y configurar botón
    const queryParams = new URLSearchParams(window.location.search);
    const idProducto = parseInt(queryParams.get("id"));
    const producto = baseDeDatos.find(p => p.id === idProducto) || baseDeDatos[0]; // fallback al 10 si no hay ID

    const btnAgregar = document.getElementById("btn-add-to-cart");
    if (btnAgregar) {
        btnAgregar.onclick = () => {
            if (!colorSeleccionado || !tallaSeleccionada) {
                alert("Por favor, selecciona una talla y un color.");
                return;
            }

            const productoFinal = {
                ...producto,
                id: `${producto.id}-${colorSeleccionado}-${tallaSeleccionada}`, // ID único por combinación
                nombre: `${producto.nombre} (${colorSeleccionado} - ${tallaSeleccionada})`,
                talla: tallaSeleccionada,
                color: colorSeleccionado
            };

            
            agregarAlCarrito(productoFinal);
            actualizarNumeroCarrito();
            alert("¡Agregado al carrito!");
        };
    }
    
    document.addEventListener("DOMContentLoaded", () => {
        
        if (typeof window.actualizarNumeroCarrito === "function") {
            window.actualizarNumeroCarrito();
        }
    })
});
