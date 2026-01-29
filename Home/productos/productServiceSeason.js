const DATA_SOURCE = "../../src/data/products.catalog.json";

export async function getProducts({ limit = 6 } = {}) {
  const res = await fetch(DATA_SOURCE, {
    method: "GET",
    headers: { "Accept": "application/json" },
    cache: "no-store"
  });

  if (!res.ok) {
    throw new Error("Error al obtener el catálogo");
  }

  const data = await res.json();

  if (!Array.isArray(data.products)) {
    throw new Error("Formato inválido");
  }

  return data.products.slice(0, limit);
}
