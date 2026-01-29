export const normalizeImage = (p) => ({
  src: p?.image?.src || "",
  alt: p?.image?.alt || "Producto"
});
