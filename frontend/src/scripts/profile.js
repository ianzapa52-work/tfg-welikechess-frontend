// @ts-check

document.addEventListener("DOMContentLoaded", () => {
  const userBox = document.querySelector("#profile-user");
  const logoutBtn = document.querySelector("#logoutBtn");
  const avatarMenu = document.querySelector("#avatarMenu");
  const openAvatarMenu = document.querySelector("#openAvatarMenu");
  const currentAvatar = document.querySelector("#current-avatar");

  /** @type {{name:string,email:string,avatar?:string} | null} */
  const user = JSON.parse(localStorage.getItem("user") || "null");

  if (!user) {
    window.location.href = "/login";
    return;
  }

  // Inicialización de Avatar
  if (!user.avatar) {
    user.avatar = "/avatars/w_king_avatar.png";
    localStorage.setItem("user", JSON.stringify(user));
  }
  
  if (currentAvatar instanceof HTMLImageElement) {
    currentAvatar.src = user.avatar;
  }

  // Mostrar panel principal
  if (userBox instanceof HTMLElement) {
    userBox.classList.remove("hidden");
    userBox.classList.add("flex");
  }

  // Datos de usuario
  const usernameEl = document.querySelector("#profile-username");
  const emailEl = document.querySelector("#profile-email");
  if (usernameEl) usernameEl.textContent = user.name ?? "Jugador";
  if (emailEl) emailEl.textContent = user.email;

  // Estadísticas
  let stats = JSON.parse(localStorage.getItem("stats") || "null");
  if (!stats) {
    stats = { rating: 1200, wins: 0, losses: 0, draws: 0, totalGames: 0, puzzlesSolved: 0, puzzlesFailed: 0, createdAt: Date.now(), lastLogin: Date.now() };
    localStorage.setItem("stats", JSON.stringify(stats));
  }

  /**
   * Actualiza el contenido de un elemento por su ID
   * @param {string} id - El selector del elemento (ej: "#stat-rating")
   * @param {string | number} value - El valor a mostrar
   */
  const setContent = (id, value) => {
    const el = document.querySelector(id);
    if (el) el.textContent = String(value);
  };

  setContent("#stat-rating", stats.rating);
  setContent("#stat-games", stats.totalGames);
  setContent("#stat-wins", stats.wins);
  setContent("#stat-losses", stats.losses);
  setContent("#stat-draws", stats.draws);
  setContent("#stat-puzzles-solved", stats.puzzlesSolved);
  setContent("#stat-puzzles-failed", `Fallos: ${stats.puzzlesFailed}`);

  // Barra de progreso de Puzzles
  const progressEl = document.querySelector("#puzzle-progress");
  const totalPuzzles = stats.puzzlesSolved + stats.puzzlesFailed;
  const progress = totalPuzzles > 0 ? (stats.puzzlesSolved / totalPuzzles) * 100 : 0;
  if (progressEl instanceof HTMLElement) progressEl.style.width = `${progress}%`;

  // Gestión de Avatares
  const availableAvatars = [
    "w_king_avatar.png", "w_queen_avatar.png", "w_horse_avatar.png", "w_bishop_avatar.png",
    "w_rook_avatar.png", "w_pawn_avatar.png", "b_king_avatar.png", "b_queen_avatar.png",
    "b_horse_avatar.png", "b_bishop_avatar.png", "b_rook_avatar.png", "b_pawn_avatar.png"
  ];

  if (openAvatarMenu && avatarMenu) {
    openAvatarMenu.addEventListener("click", (e) => {
      e.stopPropagation();
      avatarMenu.classList.toggle("hidden");
    });

    // Cerrar al hacer clic fuera
    document.addEventListener("click", () => avatarMenu.classList.add("hidden"));
    
    // Evitar que el clic dentro del menú lo cierre accidentalmente
    avatarMenu.addEventListener("click", (e) => e.stopPropagation());

    // Renderizar avatares
    avatarMenu.innerHTML = ''; 
    availableAvatars.forEach(file => {
      const img = document.createElement("img");
      img.src = `/avatars/${file}`;
      img.alt = "Avatar Option"; 
      img.addEventListener("click", () => {
        user.avatar = `/avatars/${file}`;
        localStorage.setItem("user", JSON.stringify(user));
        if (currentAvatar instanceof HTMLImageElement) currentAvatar.src = user.avatar;
        avatarMenu.classList.add("hidden");
      });
      avatarMenu.appendChild(img);
    });
  }

  // Cerrar Sesión
  logoutBtn?.addEventListener("click", () => {
    localStorage.removeItem("user");
    window.location.href = "/login";
  });
});