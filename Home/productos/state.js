export const state = {
  favorites: new Set(
    JSON.parse(localStorage.getItem("favorites") || "[]")
  )
};
