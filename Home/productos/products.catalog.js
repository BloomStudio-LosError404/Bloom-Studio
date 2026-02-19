import { getProducts } from "./productService.js";
import { renderProducts } from "./productRenderer.js";

document.addEventListener("DOMContentLoaded", async () => {
  const grid = document.getElementById("productsGrid");
  if (!grid) return;

  try {
    const products = await getProducts({ limit: 4 , tag: "Nuevo" });
    renderProducts(grid, products);
  } catch (err) {
    console.error(err);
    grid.textContent = "No se pudieron cargar los productos.";
  }
});
