import { state } from "./state.js";
import { toggleFavorite } from "./favorites.js";
import { normalizeImage } from "./normalizeImage.js ";

export function renderProducts(container, products = []) {
  container.innerHTML = "";

  const fragment = document.createDocumentFragment();
  products.forEach(p => fragment.appendChild(createProductCard(p)));

  container.appendChild(fragment);
  bindEvents(container);
}

function createProductCard(p) {
  const fav = state.favorites.has(p.id);
  const img = normalizeImage(p);

  const col = document.createElement("div");
  col.className = "featured-product";
  col.role = "listitem";

  col.innerHTML = `
    <a class="product-link" href="#" data-action="open" data-id="${p.id}">
      <article class="product-card">
        <button
          class="wishlist-btn"
          type="button"
          data-action="favorite"
          data-id="${p.id}">
          ${fav ? "♥" : "♡"}
        </button>

        <img class="product-img" src="${img.src}" alt="${img.alt}" />

        <div class="product-body">
          <h3 class="product-name">${escapeHTML(p.name)}</h3>
          <p class="product-desc">${escapeHTML(p.description)}</p>
          <div class="product-meta">
            <span class="product-price">$${Number(p.price || 0).toFixed(2)}</span>
            <span>⭐ ${p.rating ?? 0} (${p.reviews ?? 0})</span>
          </div>
        </div>
      </article>
    </a>
  `;

  return col;
}

function bindEvents(container) {
  container.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-action='favorite']");
    if (!btn) return;

    e.preventDefault();
    toggleFavorite(btn.dataset.id);
    btn.textContent = state.favorites.has(btn.dataset.id) ? "♥" : "♡";
  });
}

function escapeHTML(str = "") {
  return String(str).replace(/[&<>"']/g, m => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  })[m]);
}

