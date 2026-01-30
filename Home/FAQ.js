const faqs = [
  {
    question: "¿Cómo personalizo un producto?",
    answer:
      "Selecciona el producto que quieras, elige colores, textos o imágenes, y ajusta cada detalle hasta que quede a tu gusto. Luego agrégalo al carrito y listo."
  },
  {
    question: "¿Puedo enviar un diseño como regalo?",
    answer:
      "¡Claro! Puedes personalizar el producto y enviarlo directamente a la dirección que desees, perfecto para regalos únicos y especiales."
  },
  {
    question: "¿Qué tipos de productos puedo personalizar?",
    answer:
      "Tenemos playeras, tazas, cachuchas y más. Cada producto puede ser adaptado a tu estilo con colores, textos y diseños exclusivos."
  },
  {
    question: "¿Los productos personalizados tardan más en llegar?",
    answer:
      "Sí, el tiempo de entrega puede ser un poco mayor debido al proceso de personalización, pero garantizamos que cada detalle sea perfecto."
  }
];

const container = document.getElementById("faqContainer");

faqs.forEach(faq => {
  const item = document.createElement("div");
  item.className = "faq-item";

  item.innerHTML = `
    <div class="faq-header">
      <h3>${faq.question}</h3>
      <svg class="faq-icon" width="18" height="18" viewBox="0 0 18 18">
        <path d="m4.5 7.2 3.8 3.8a1 1 0 0 0 1.4 0l3.8-3.8"
          stroke="#1D293D" stroke-width="1.5"
          stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </div>
    <p class="faq-answer">${faq.answer}</p>
  `;

  item.querySelector(".faq-header").addEventListener("click", () => {
    document.querySelectorAll(".faq-item").forEach(el => {
      if (el !== item) el.classList.remove("active");
    });
    item.classList.toggle("active");
  });

  container.appendChild(item);
});
