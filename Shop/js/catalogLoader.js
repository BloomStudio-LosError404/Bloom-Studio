// catalogLoader.js
import { DATA_SOURCE_URL } from "./config.js";

export async function loadCatalog() {
  try {
    const response = await fetch(DATA_SOURCE_URL);

    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`);
    }

    const data = await response.json();

   
    const products = data.map((producto) => ({
      id: producto.id,
      sku: producto.sku,

      name: producto.nombre,
      description: producto.descripcion,

      category: producto.categoria,
      categories: producto.categorias || [],

      colors: producto.colores || [],
      sizes: producto.tallas || [],

      price: producto.precio,

      rating: producto.rating ?? 0,
      reviews: producto.reviews ?? 0,

      stockTotal: producto.stockTotal ?? 0,

      tags: producto.etiquetas || [],

      image: {
        src: producto.imagen?.src || "",
        alt: producto.imagen?.alt || producto.nombre
      }
    }));

    return {
      catalog: {},
      products
    };

  } catch (error) {
    console.error("Error cargando catálogo:", error);
    return {
      catalog: {},
      products: []
    };
  }
}

