// home.ts

const initHome = (): void => {
  const king = document.querySelector("#homeKing") as HTMLElement | null;
  const card = document.querySelector("#homeCard") as HTMLElement | null;
  const buttons = document.querySelectorAll<HTMLElement>(".home-btn");
  const brand = document.querySelector("#brandTitle") as HTMLElement | null;

  if (!king || !card) return;

  // Clases compartidas para hover
  const hoverClasses = ["ring-2", "ring-yellow-400", "shadow-yellow-400", "scale-[1.03]"];

  // Rey
  king.addEventListener("mouseenter", () => king.classList.add("drop-shadow-[0_0_14px_gold]"));
  king.addEventListener("mouseleave", () => king.classList.remove("drop-shadow-[0_0_14px_gold]"));
  king.addEventListener("click", () => {
    king.classList.add("king-bounce");
    setTimeout(() => king.classList.remove("king-bounce"), 600);
  });

  // Tarjeta principal
  card.addEventListener("mouseenter", () => card.classList.add(...hoverClasses));
  card.addEventListener("mouseleave", () => card.classList.remove(...hoverClasses));

  // Botones
  buttons.forEach(btn => {
    btn.addEventListener("mouseenter", () => btn.classList.add(...hoverClasses));
    btn.addEventListener("mouseleave", () => btn.classList.remove(...hoverClasses));
  });

  // Título (Brand)
  if (brand) {
    brand.addEventListener("mouseenter", () => {
      brand.classList.add("text-yellow-500");
      brand.style.textShadow = "0 0 8px rgba(212, 175, 55, 0.7)";
    });
    brand.addEventListener("mouseleave", () => {
      brand.classList.remove("text-yellow-500");
      brand.style.textShadow = "none";
    });
    brand.addEventListener("click", () => brand.classList.toggle("active"));
  }
};

document.addEventListener('astro:page-load', initHome);