// catalogLoader.js
import { DATA_SOURCE_URL } from "./config.js";

export const loadCatalog = async () => {
  try {
    const res = await fetch(DATA_SOURCE_URL, { cache: "no-store" });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const data = await res.json();

    // Soportamos ambos formatos:
    // 1) Backend (Spring) devuelve arreglo directo: [ { ... }, { ... } ]
    // 2) Formato previo local: { catalog, products }
    const raw = Array.isArray(data) ? data : Array.isArray(data.products) ? data.products : [];

    // Normaliza a la estructura que consume storeView.js
    // (si el backend ya devuelve los nombres en inglés, esto no rompe)
    const products = raw.map((p) => {
      const isEs =
        p && ("nombre" in p || "precio" in p || "imagen" in p || "colores" in p || "tallas" in p);

      if (!isEs) return p;

      const categories = Array.isArray(p.categorias) ? p.categorias : [];

      return {
        id: p.id,
        sku: p.sku,
        name: p.nombre,
        description: p.descripcion,
        category: p.categoria || categories[0] || "",
        categories,
        colors: Array.isArray(p.colores) ? p.colores : [],
        sizes: Array.isArray(p.tallas) ? p.tallas : [],
        price: p.precio,
        rating: p.rating ?? 0,
        reviews: p.reviews ?? 0,
        stockTotal: p.stockTotal ?? 0,
        tags: Array.isArray(p.etiquetas) ? p.etiquetas : [],
        image: {
          src: p.imagen?.src || "",
          alt: p.imagen?.alt || p.nombre || "Producto"
        }
      };
    });

    return { catalog: Array.isArray(data) ? null : data.catalog || null, products };
  } catch (err) {
    console.error("No se pudo cargar el catálogo:", err);
    return { catalog: null, products: [] };
  }
};


