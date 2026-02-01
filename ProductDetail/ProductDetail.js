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
    const btnAgregar = document.getElementById("btn-add-to-cart");

    if (btnAgregar) {
        btnAgregar.addEventListener("click", () => {
            agregarAlCarrito(productoActual);
            // Opcional: Feedback al usuario
            alert("¡Producto añadido al carrito!");
            actualizarNumeroCarrito(); // Para que el número del header suba
        });
    }
    
    // Inicializar el número del carrito al cargar la página
    actualizarNumeroCarrito();
});

/** * Estas funciones deben ser espejos de las que usas en tu tienda
 * para que la "memoria" (localStorage) sea la misma.
 */
function agregarAlCarrito(producto) {
    // Revisar si hay algo en el local storage
    let memoria = JSON.parse(localStorage.getItem("Articulos")) || [];
    
    // Buscar si el producto ya existe en el carrito
    const indiceProducto = memoria.findIndex(item => item.id === producto.id);

    if (indiceProducto === -1) {
        // Si no existe, lo agregamos con cantidad 1
        const nuevoProducto = { ...producto, cantidad: 1 };
        memoria.push(nuevoProducto);
    } else {
        // Si ya existe, aumentamos la cantidad
        memoria[indiceProducto].cantidad++;
    }

    // Guardamos de nuevo en localStorage
    localStorage.setItem("Articulos", JSON.stringify(memoria));
}

function actualizarNumeroCarrito() {
    const cuentaCarritoElement = document.getElementById("cuenta-carrito");
    if (cuentaCarritoElement) {
        const memoria = JSON.parse(localStorage.getItem("Articulos")) || [];
        const cuenta = memoria.reduce((acum, current) => acum + current.cantidad, 0);
        cuentaCarritoElement.innerText = cuenta;
    }
}


// Codigo del js para el selector de color y talla en la pagina de detalle de producto

document.addEventListener("DOMContentLoaded", () => {
    const btnAgregar = document.getElementById("btn-add-to-cart");
    const colores = document.querySelectorAll("#color-selector .dot");
    const tallas = document.querySelectorAll("#size-selector .pill");

    let colorSeleccionado = null;
    let tallaSeleccionada = null;

    // --- Lógica de Selección Visual ---

    // Selección de Color
    colores.forEach(dot => {
        dot.addEventListener("click", () => {
            colores.forEach(d => d.style.border = "none"); // Limpiar selección anterior
            dot.style.border = "2px solid #000"; // Resaltar seleccionado
            colorSeleccionado = dot.getAttribute("data-color");
        });
    });

    // Selección de Talla
    tallas.forEach(pill => {
        pill.addEventListener("click", () => {
            tallas.forEach(p => p.style.backgroundColor = ""); // Limpiar otros
            tallas.forEach(p => p.style.color = "");
            pill.style.backgroundColor = "#ffc8a2"; // Color de tu diseño
            pill.style.color = "white";
            tallaSeleccionada = pill.getAttribute("data-size");
        });
    });

    Swal.fire({
  title: '¡Atención!',
  text: 'Por favor, selecciona una talla y un color antes de continuar.',
  icon: 'warning',
  confirmButtonText: 'Entendido',
  confirmButtonColor: '#d33' // Puedes poner el color rosa de tu botón aquí
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
Swal.fire({
  title: '¡Excelente!',
  text: '¡Producto añadido al carrito!',
  icon: 'success',
  confirmButtonText: 'Aceptar',
  confirmButtonColor: '#f3b0e3' // Color rosita como el de tu imagen
});
// Mantén tus funciones agregarAlCarrito() y actualizarNumeroCarrito() igual que antes

document.addEventListener("DOMContentLoaded", () => {
    // 1. Obtener los datos guardados desde el catálogo (shop)
    const product = JSON.parse(localStorage.getItem("selectedProduct"));
    const allProducts = JSON.parse(localStorage.getItem("allProducts")) || [];

    if (!product) {
        console.error("No se encontró información del producto. Regresando al catálogo...");
        // Opcional: window.location.href = "../Shop/index.html"; 
        return;
    }

    // 2. Renderizar Información Principal (Textos)
    document.querySelector(".product-info h1").textContent = product.name ?? "Producto sin nombre";
    document.querySelector(".product-info .price").textContent = `$ ${Number(product.price || 0).toFixed(2)}`;
    document.querySelector(".description h3").textContent = product.name;
    document.querySelector(".description p").textContent = product.description ?? "Sin descripción disponible.";

    // 3. Renderizar Galería de Imágenes (Miniaturas y Principal)
    const thumbnailsContainer = document.querySelector(".thumbnails");
    const mainImg = document.querySelector(".main-image img");

    // Lógica de imágenes: si el JSON no tiene array 'images', usamos la principal 3 veces para el diseño
    const imagesToShow = (product.images && product.images.length > 0) 
        ? product.images 
        : [product.image?.src, product.image?.src, product.image?.src];

    // Inyectar miniaturas dinámicamente
    thumbnailsContainer.innerHTML = imagesToShow.map((imgSrc, index) => `
        <img src="${imgSrc}" 
             alt="mini-${index}" 
             class="thumb-img" 
             onclick="changeMainImage('${imgSrc}')"
             style="cursor: pointer; object-fit: cover; border-radius: 8px; border: 1px solid #ddd; margin-bottom: 10px; width: 80px; height: 80px;">
    `).join("");

    // Imagen principal inicial
    mainImg.src = product.image?.src || "https://via.placeholder.com/400";
    mainImg.alt = product.name;

    // 4. Rellenar Opciones (Colores y Tallas)
    const colorSelector = document.getElementById("color-selector");
    const sizeSelector = document.getElementById("size-selector");

    if (product.colors && Array.isArray(product.colors)) {
        colorSelector.innerHTML = product.colors.map(color => 
            `<span class="dot" data-color="${color}" style="background-color: ${color}; width: 25px; height: 25px; border-radius: 50%; display: inline-block; margin-right: 10px; cursor: pointer; border: 1px solid #ccc;"></span>`
        ).join("");
    }

    if (product.sizes && Array.isArray(product.sizes)) {
        sizeSelector.innerHTML = product.sizes.map(size => 
            `<span class="pill" data-size="${size}" style="padding: 8px 15px; border: 1px solid #ccc; border-radius: 20px; margin-right: 10px; cursor: pointer; display: inline-block;">${size}</span>`
        ).join("");
    }

    // Volver a activar la lógica de selección (la función que tienes en tu HTML)
    if (typeof setupSelection === "function") {
        setupSelection('.dot');
        setupSelection('.pill');
    }

    // 5. Rellenar "Podrías estar interesado en" (Productos relacionados)
    const relatedGrid = document.querySelector(".related-grid");
    const relatedProducts = allProducts.filter(p => p.id !== product.id).slice(0, 4);

    relatedGrid.innerHTML = relatedProducts.map(p => `
        <div class="product-card" onclick="changeProduct('${p.id}')" style="cursor:pointer; border: 1px solid #eee; padding: 15px; border-radius: 8px; transition: 0.3s;">
            <div class="card-img" style="text-align: center;">
                <img src="${p.image?.src}" alt="${p.name}" style="max-width: 100%; height: 150px; object-fit: contain;">
            </div>
            <div class="card-info" style="margin-top: 10px;">
                <h4 style="font-size: 1rem; margin: 5px 0;">${p.name}</h4>
                <p class="card-price" style="font-weight: bold; color: #333;">$ ${Number(p.price).toFixed(2)}</p>
            </div>
        </div>
    `).join("");
});

/**
 * Cambia la imagen principal cuando se hace click en una miniatura
 */
window.changeMainImage = (src) => {
    const mainImg = document.querySelector(".main-image img");
    if (mainImg) mainImg.src = src;
};

/**
 * Cambia el producto actual por uno relacionado
 */
window.changeProduct = (id) => {
    const all = JSON.parse(localStorage.getItem("allProducts")) || [];
    const selected = all.find(p => String(p.id) === String(id));
    if (selected) {
        localStorage.setItem("selectedProduct", JSON.stringify(selected));
        window.location.reload(); // Recarga la página con los datos del nuevo producto
        window.scrollTo(0, 0);    // Sube al inicio de la página
    }
};