const API_URL = "http://localhost:8080/api/v1/productos/catalogo";

export async function getProducts({ limit = 6, category = null, tag = null } = {}) {
  try {
    const res = await fetch(API_URL, {
      method: "GET",
      headers: { "Accept": "application/json" },
      cache: "no-store"
    });

    if (!res.ok) throw new Error(`Error HTTP: ${res.status}`);

    const data = await res.json();
    if (!Array.isArray(data)) throw new Error("Formato inválido");

    const mapped = data.map(p => ({
      id: p.id,
      name: p.nombre,
      description: p.descripcion,
      price: p.precio,
      image: p.image ?? p.imagen,
      categoria: p.categoria ?? null,
      categorias: Array.isArray(p.categorias) ? p.categorias : [],
      etiquetas: Array.isArray(p.etiquetas) ? p.etiquetas : []
    }));

    const categoryNorm = category ? category.trim().toLowerCase() : null;
    const tagNorm = tag ? tag.trim().toLowerCase() : null;

    const filtered = mapped.filter(p => {

      const matchCategoriaString =
        p.categoria &&
        p.categoria.trim().toLowerCase() === categoryNorm;

      const matchCategoriaArray =
        p.categorias.some(c =>
          String(c).trim().toLowerCase() === categoryNorm
        );

      const matchTag =
        p.etiquetas.some(t =>
          String(t).trim().toLowerCase() === tagNorm
        );

      const okCategory = !categoryNorm || matchCategoriaString || matchCategoriaArray;
      const okTag = !tagNorm || matchTag;

      return okCategory && okTag;
    });

    console.log("Total:", mapped.length);
    console.log("Filtrados:", filtered.length);

    return filtered.slice(0, limit);

  } catch (error) {
    console.error("Error Season:", error);
    return [];
  }
}

