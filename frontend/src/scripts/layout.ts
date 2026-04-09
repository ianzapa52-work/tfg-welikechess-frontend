// layout.ts

const initMenu = (): void => {
  const menuBtn = document.querySelector("#menuBtn") as HTMLElement | null;
  const sideMenu = document.querySelector("#sideMenu") as HTMLElement | null;
  const overlay = document.querySelector("#menuOverlay") as HTMLElement | null;

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

document.addEventListener('astro:page-load', initMenu);

if (document.readyState !== 'loading') {
  initMenu();
} else {
  document.addEventListener('DOMContentLoaded', initMenu);
}