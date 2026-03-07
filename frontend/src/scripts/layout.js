document.addEventListener("DOMContentLoaded", () => {
  const menuBtn = document.querySelector("#menuBtn");
  const sideMenu = document.querySelector("#sideMenu");
  const overlay = document.querySelector("#menuOverlay");
  
  // --- MENÚ LATERAL ---
  if (menuBtn && sideMenu && overlay) {
    menuBtn.addEventListener("click", () => {
      sideMenu.classList.remove("-translate-x-full");
      overlay.classList.remove("hidden");
    });

    overlay.addEventListener("click", () => {
      sideMenu.classList.add("-translate-x-full");
      overlay.classList.add("hidden");
    });
  }
});
