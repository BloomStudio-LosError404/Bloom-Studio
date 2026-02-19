document.addEventListener("DOMContentLoaded", () => {

    // 1. Obtener los datos guardados desde el catálogo (shop)

    const product = JSON.parse(localStorage.getItem("selectedProduct"));

    const allProducts = JSON.parse(localStorage.getItem("allProducts")) || [];



    if (!product) {

        console.error("No se encontró información del producto. Regresando al catálogo...");

        return;

    }



    // --- IDENTIFICAR CATEGORÍA ---

   

    const isClothing = product.category === "sudadera" || product.category === "playeras";



    // --- 2. RENDERIZAR INFORMACIÓN PRINCIPAL ---

    document.querySelector(".product-info h1").textContent = product.name ?? "Producto sin nombre";

    document.querySelector(".product-info .price").textContent = `$ ${Number(product.price || 0).toFixed(2)}`;

    document.querySelector(".description h3").textContent = product.name;



    // Lógica de descripción editable:

    const descP = document.querySelector(".description p");

    descP.textContent = product.mensaje_detalle || product.description || "Sin descripción disponible.";



    // --- 3. GALERÍA DE IMÁGENES (Tu lógica funcional) ---

    const thumbnailsContainer = document.querySelector(".thumbnails");

    const mainImg = document.querySelector(".main-image img");



    const imagesToShow = (product.images && product.images.length > 0)

        ? product.images

        : [product.image?.src, product.image?.src, product.image?.src];



    thumbnailsContainer.innerHTML = imagesToShow.map((imgSrc, index) => `

        <img src="${imgSrc}"

             alt="mini-${index}"

             class="thumb-img"

             onclick="changeMainImage('${imgSrc}')"

             style="cursor: pointer; object-fit: cover; border-radius: 8px; border: 1px solid #ddd; margin-bottom: 10px; width: 80px; height: 80px;">

    `).join("");



    mainImg.src = product.image?.src || "https://via.placeholder.com/400";

    mainImg.alt = product.name;



    // --- 4. OPCIONES CONDICIONALES (Colores, Tallas y Cuidados) ---

    const colorSelector = document.getElementById("color-selector");

    const sizeSelector = document.getElementById("size-selector");

   

    // Seleccionamos los títulos o contenedores de cuidados para ocultarlos si no es ropa

    const cuidadosH3 = document.querySelector(".description h3:nth-of-type(2)");

    const cuidadosP = document.querySelector(".description p:nth-of-type(2)");



    if (isClothing) {

        // --- ES ROPA: Mostrar todo ---

        if (colorSelector) {

            colorSelector.style.display = "block";

            colorSelector.innerHTML = (product.colors || []).map(color =>

                `<span class="dot" data-color="${color}" style="background-color: ${color}; width: 25px; height: 25px; border-radius: 50%; display: inline-block; margin-right: 10px; cursor: pointer; border: 1px solid #ccc;"></span>`

            ).join("");

        }



        if (sizeSelector) {

            sizeSelector.style.display = "block";

            sizeSelector.innerHTML = (product.sizes || []).map(size =>

                `<span class="pill" data-size="${size}" style="padding: 8px 15px; border: 1px solid #ccc; border-radius: 20px; margin-right: 10px; cursor: pointer; display: inline-block;">${size}</span>`

            ).join("");

        }



        if (cuidadosH3) cuidadosH3.style.display = "block";

        if (cuidadosP) {

            cuidadosP.style.display = "block";

            cuidadosP.textContent = product.cuidados || "Lavar a mano, secar a la sombra.";

        }

    } else {

        // --- NO ES ROPA: Ocultar para que el contenido suba ---

        if (colorSelector) colorSelector.style.display = "none";

        if (sizeSelector) sizeSelector.style.display = "none";

        if (cuidadosH3) cuidadosH3.style.display = "none";

        if (cuidadosP) cuidadosP.style.display = "none";

    }





    // Activar selección visual (dots y pills)

    if (typeof setupSelection === "function") {

        setupSelection('.dot');

        setupSelection('.pill');

    }



    // --- 5. PRODUCTOS RELACIONADOS ---

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



/** Cambia la imagen principal al clickear miniatura **/

window.changeMainImage = (src) => {

    const mainImg = document.querySelector(".main-image img");

    if (mainImg) mainImg.src = src;

};



/** Cambia el producto actual **/

window.changeProduct = (id) => {

    const all = JSON.parse(localStorage.getItem("allProducts")) || [];

    const selected = all.find(p => String(p.id) === String(id));

    if (selected) {

        localStorage.setItem("selectedProduct", JSON.stringify(selected));

        window.location.reload();

        window.scrollTo(0, 0);

    }

};