document.addEventListener("DOMContentLoaded", () => {
  const king = document.querySelector("#homeKing");
  const card = document.querySelector("#homeCard");
  const buttons = document.querySelectorAll(".home-btn");

  if (!king || !card) return;

  // --- EFECTO PARA EL REY ---
  king.addEventListener("mouseenter", () => {
    king.classList.add("drop-shadow-[0_0_14px_gold]");
  });

  king.addEventListener("mouseleave", () => {
    king.classList.remove("drop-shadow-[0_0_14px_gold]");
  });

  // --- EFECTO PARA LA TARJETA ---
  card.addEventListener("mouseenter", () => {
    card.classList.add(
      "ring-2",
      "ring-yellow-400",
      "shadow-yellow-400",
      "scale-[1.03]"
    );
  });

  card.addEventListener("mouseleave", () => {
    card.classList.remove(
      "ring-2",
      "ring-yellow-400",
      "shadow-yellow-400",
      "scale-[1.03]"
    );
  });

  // --- EFECTO PARA LOS BOTONES ---
  buttons.forEach(btn => {
    btn.addEventListener("mouseenter", () => {
      btn.classList.add(
        "ring-2",
        "ring-yellow-400",
        "shadow-yellow-400",
        "scale-[1.03]"
      );
    });

    btn.addEventListener("mouseleave", () => {
      btn.classList.remove(
        "ring-2",
        "ring-yellow-400",
        "shadow-yellow-400",
        "scale-[1.03]"
      );
    });
  });
});
