// @ts-nocheck

const initProfile = () => {
  // 1. Buscar el contenedor
  const profileContainer = document.getElementById("profile-user");
  
  // Si no existe el div, reintentamos (Astro delay)
  if (!profileContainer) {
    setTimeout(initProfile, 50);
    return;
  }

  // 2. Comprobar usuario
  const userData = localStorage.getItem("user");
  
  if (!userData || userData === "null") {
    console.log("No hay usuario, redirigiendo a login...");
    window.location.href = "/login";
    return;
  }

  const user = JSON.parse(userData);

  // 3. FORZAR VISIBILIDAD
  // Quitamos 'hidden' y aplicamos flex directamente al estilo para saltarnos CSS
  profileContainer.classList.remove("hidden");
  profileContainer.style.setProperty("display", "flex", "important");
  profileContainer.style.opacity = "1";

  // 4. Rellenar los campos (con IDs exactos de tu HTML)
  const usernameEl = document.getElementById("profile-username");
  const emailEl = document.getElementById("profile-email");
  const currentAvatar = document.getElementById("current-avatar") as HTMLImageElement | null;

  if (usernameEl) usernameEl.textContent = user.name;
  if (emailEl) emailEl.textContent = user.email;
  if (currentAvatar) currentAvatar.src = user.avatar || "/avatars/w_king_avatar.png";

  // 5. Estadísticas
  const stats = JSON.parse(localStorage.getItem("stats") || '{"rating":1200, "totalGames":0, "wins":0, "losses":0, "draws":0, "puzzlesSolved":0, "puzzlesFailed":0}');
  
  const d = (id, val) => {
    const el = document.getElementById(id);
    if (el) el.textContent = String(val);
  };

  d("stat-rating", stats.rating);
  d("stat-games", stats.totalGames);
  d("stat-wins", stats.wins);
  d("stat-losses", stats.losses);
  d("stat-draws", stats.draws);
  d("stat-puzzles-solved", stats.puzzlesSolved);
  const failedEl = document.getElementById("stat-puzzles-failed");
  if (failedEl) failedEl.textContent = `Fallos: ${stats.puzzlesFailed}`;

  // 6. BARRA DE PROGRESO
  const progressEl = document.getElementById("puzzle-progress");
  if (progressEl) {
    const total = stats.puzzlesSolved + stats.puzzlesFailed;
    const ratio = total > 0 ? (stats.puzzlesSolved / total) * 100 : 0;
    progressEl.style.width = `${ratio}%`;
  }

  // 7. BOTÓN CERRAR SESIÓN (IMPORTANTE)
  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) {
    logoutBtn.onclick = (e) => {
      e.preventDefault();
      localStorage.clear(); // Borramos todo para no dejar rastro
      window.location.href = "/login";
    };
  }

  // 8. MENÚ AVATARES
  const avatarBtn = document.getElementById("openAvatarMenu");
  const avatarMenu = document.getElementById("avatarMenu");
  
  if (avatarBtn && avatarMenu) {
    avatarBtn.onclick = (e) => {
      e.stopPropagation();
      avatarMenu.classList.toggle("hidden");
    };

    const files = [
      "b_bishop_avatar.png", "b_horse_avatar.png", "b_king_avatar.png", 
      "b_pawn_avatar.png", "b_queen_avatar.png", "b_rook_avatar.png",
      "w_bishop_avatar.png", "w_horse_avatar.png", "w_king_avatar.png",
      "w_pawn_avatar.png", "w_queen_avatar.png", "w_rook_avatar.png"
    ];

    avatarMenu.innerHTML = files.map(f => 
      `<img src="/avatars/${f}" data-file="${f}" class="cursor-pointer hover:scale-110 transition-transform" style="width:70px; border-radius:10px;" />`
    ).join("");

    avatarMenu.onclick = (e) => {
      const img = e.target as HTMLElement;
      if (img.tagName === "IMG") {
        const newPath = `/avatars/${img.dataset.file}`;
        user.avatar = newPath;
        localStorage.setItem("user", JSON.stringify(user));
        if (currentAvatar) currentAvatar.src = newPath;
        avatarMenu.classList.add("hidden");
      }
    };
  }
};

// Listener de Astro para cambios de página
document.addEventListener('astro:page-load', initProfile);

// Ejecución por si es carga directa
if (document.readyState !== 'loading') initProfile();