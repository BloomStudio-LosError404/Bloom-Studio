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