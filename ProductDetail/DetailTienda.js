document.addEventListener("DOMContentLoaded", () => {
    const detailContainer = document.getElementById("product-detail-content");
    const relatedGrid = document.getElementById("related-grid");

    // 1. Extraer datos del localStorage
    const product = JSON.parse(localStorage.getItem("selectedProduct"));
    const allProducts = JSON.parse(localStorage.getItem("allProducts")) || [];

    if (!product) {
        detailContainer.innerHTML = "<h1>Producto no encontrado</h1>";
        return;
    }

    // 2. Renderizar el producto principal
    detailContainer.innerHTML = `
        <div class="detail-wrapper">
            <div class="image-column">
                <img src="${product.image?.src}" alt="${product.name}">
            </div>
            <div class="info-column">
                <span class="status">Nuevo | +1000 vendidos</span>
                <h1>${product.name}</h1>
                <p class="price">$ ${product.price}</p>
                <p class="promo">4 meses sin intereses de $ ${(product.price / 4).toFixed(2)}</p>
                <button class="buy-now">Comprar ahora</button>
                <button class="add-cart">Agregar al carrito</button>
            </div>
        </div>
    `;

    // 3. Renderizar relacionados (como se ve en el video al hacer scroll)
    const related = allProducts.filter(p => p.id !== product.id).slice(0, 6);
    
    relatedGrid.innerHTML = related.map(p => `
        <div class="product-card-mini" onclick="viewNewProduct('${p.id}')">
            <img src="${p.image?.src}" alt="${p.name}">
            <p class="mini-price">$ ${p.price}</p>
            <p class="mini-name">${p.name}</p>
        </div>
    `).join("");
});

// Función para cuando haces click en un producto de "abajo"
window.viewNewProduct = (id) => {
    const all = JSON.parse(localStorage.getItem("allProducts"));
    const found = all.find(p => p.id == id);
    if (found) {
        localStorage.setItem("selectedProduct", JSON.stringify(found));
        window.location.reload(); // Recarga la página con el nuevo producto
    }
};