import { state } from "./state.js";

export const saveFavorites = () => {
  localStorage.setItem(
    "favorites",
    JSON.stringify([...state.favorites])
  );
};

export const toggleFavorite = (productId) => {
  state.favorites.has(productId)
    ? state.favorites.delete(productId)
    : state.favorites.add(productId);

  saveFavorites();
};
