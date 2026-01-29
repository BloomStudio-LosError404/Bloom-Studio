import { getProducts } from "./productServiceSeason.js";
import { renderProducts } from "./productRendererSeason.js";

document.addEventListener("DOMContentLoaded", async () => {
  const grid = document.getElementById("productsGrid2");
  if (!grid) return;

  try {
    const products = await getProducts({ limit: 6 });
    renderProducts(grid, products);
  } catch (err) {
    console.error(err);
    grid.textContent = "No se pudieron cargar los productos.";
  }
});
