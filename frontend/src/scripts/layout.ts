// menu.ts

const initMenu = (): void => {
  const menuBtn = document.querySelector("#menuBtn") as HTMLElement | null;
  const sideMenu = document.querySelector("#sideMenu") as HTMLElement | null;
  const overlay = document.querySelector("#menuOverlay") as HTMLElement | null;

  // Log para depuración (puedes borrarlo luego)
  console.log("Intentando inicializar menú...", { menuBtn, sideMenu, overlay });

  if (!menuBtn || !sideMenu || !overlay) {
    console.warn("No se encontraron los elementos del menú en esta página.");
    return;
  }

  // Eliminamos listeners previos para evitar duplicados (limpieza)
  const newMenuBtn = menuBtn.cloneNode(true) as HTMLElement;
  menuBtn.parentNode?.replaceChild(newMenuBtn, menuBtn);

  const newOverlay = overlay.cloneNode(true) as HTMLElement;
  overlay.parentNode?.replaceChild(newOverlay, overlay);

  // Funciones de acción
  const openMenu = () => {
    sideMenu.classList.remove("-translate-x-full");
    newOverlay.classList.remove("hidden");
  };

  const closeMenu = () => {
    sideMenu.classList.add("-translate-x-full");
    newOverlay.classList.add("hidden");
  };

  newMenuBtn.addEventListener("click", openMenu);
  newOverlay.addEventListener("click", closeMenu);
};

// --- EL TRUCO PARA QUE NO FALLE NUNCA ---
// Escucha el evento de Astro para cambios de página
document.addEventListener('astro:page-load', initMenu);

// Pero también ejecuta si es la primera carga y el DOM ya está listo
if (document.readyState !== 'loading') {
  initMenu();
} else {
  document.addEventListener('DOMContentLoaded', initMenu);
}