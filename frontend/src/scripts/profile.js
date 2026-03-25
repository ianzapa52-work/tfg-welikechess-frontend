// @ts-check

document.addEventListener("DOMContentLoaded", () => {
  const userBox = document.querySelector("#profile-user");
  const logoutBtn = document.querySelector("#logoutBtn");

  /** @type {{name:string,email:string,avatar?:string} | null} */
  const user = JSON.parse(localStorage.getItem("user") || "null");

  if (!user) {
    window.location.href = "/login";
    return;
  }

  // Avatar por defecto
  if (!user.avatar) {
    user.avatar = "/avatars/w_king_avatar.png";
    localStorage.setItem("user", JSON.stringify(user));
  }

  if (userBox instanceof HTMLElement) {
    userBox.classList.remove("hidden");
    userBox.classList.add("grid");
  }

  const usernameEl = document.querySelector("#profile-username");
  const emailEl = document.querySelector("#profile-email");

  if (usernameEl instanceof HTMLElement) usernameEl.textContent = user.name ?? "Usuario";
  if (emailEl instanceof HTMLElement) emailEl.textContent = user.email;

  // Stats
  let stats = JSON.parse(localStorage.getItem("stats") || "null");

  if (!stats) {
    stats = {
      rating: 1200,
      wins: 0,
      losses: 0,
      draws: 0,
      totalGames: 0,
      puzzlesSolved: 0,
      puzzlesFailed: 0,
      createdAt: Date.now(),
      lastLogin: Date.now()
    };
    localStorage.setItem("stats", JSON.stringify(stats));
  }

  const ratingEl = document.querySelector("#stat-rating");
  if (ratingEl instanceof HTMLElement) ratingEl.textContent = `${stats.rating} Elo`;

  const gamesEl = document.querySelector("#stat-games");
  const winsEl = document.querySelector("#stat-wins");
  const lossesEl = document.querySelector("#stat-losses");
  const drawsEl = document.querySelector("#stat-draws");

  if (gamesEl instanceof HTMLElement) gamesEl.textContent = `Partidas jugadas: ${stats.totalGames}`;
  if (winsEl instanceof HTMLElement) winsEl.textContent = `Victorias: ${stats.wins}`;
  if (lossesEl instanceof HTMLElement) lossesEl.textContent = `Derrotas: ${stats.losses}`;
  if (drawsEl instanceof HTMLElement) drawsEl.textContent = `Tablas: ${stats.draws}`;

  const solvedEl = document.querySelector("#stat-puzzles-solved");
  const failedEl = document.querySelector("#stat-puzzles-failed");

  if (solvedEl instanceof HTMLElement) solvedEl.textContent = `Puzzles resueltos: ${stats.puzzlesSolved}`;
  if (failedEl instanceof HTMLElement) failedEl.textContent = `Puzzles fallados: ${stats.puzzlesFailed}`;

  const progressEl = document.querySelector("#puzzle-progress");
  const totalPuzzles = stats.puzzlesSolved + stats.puzzlesFailed;
  const progress = totalPuzzles > 0 ? (stats.puzzlesSolved / totalPuzzles) * 100 : 0;

  if (progressEl instanceof HTMLElement) progressEl.style.width = progress + "%";

  const createdEl = document.querySelector("#created-at");
  const lastLoginEl = document.querySelector("#last-login");

  if (createdEl instanceof HTMLElement) createdEl.textContent = "Cuenta creada: " + new Date(stats.createdAt).toLocaleDateString();
  if (lastLoginEl instanceof HTMLElement) lastLoginEl.textContent = "Último inicio de sesión: " + new Date(stats.lastLogin).toLocaleString();

  if (logoutBtn instanceof HTMLElement) {
    logoutBtn.addEventListener("click", () => {
      localStorage.removeItem("user");
      localStorage.removeItem("stats");
      window.location.href = "/login";
    });
  }

  // --- SELECTOR DE AVATAR ---

  const avatarMenu = document.querySelector("#avatarMenu");
  const openAvatarMenu = document.querySelector("#openAvatarMenu");
  const currentAvatar = document.querySelector("#current-avatar");

  const availableAvatars = [
    "w_king_avatar.png",
    "w_queen_avatar.png",
    "w_horse_avatar.png",
    "w_bishop_avatar.png",
    "w_rook_avatar.png",
    "w_pawn_avatar.png",
    "b_king_avatar.png",
    "b_queen_avatar.png",
    "b_horse_avatar.png",
    "b_bishop_avatar.png",
    "b_rook_avatar.png",
    "b_pawn_avatar.png"
  ];

  // Mostrar / ocultar menú
  if (openAvatarMenu instanceof HTMLElement && avatarMenu instanceof HTMLElement) {
    openAvatarMenu.addEventListener("click", () => {
      avatarMenu.classList.toggle("hidden");
    });
  }

  // Insertar avatares en el menú
  if (avatarMenu instanceof HTMLElement) {
    availableAvatars.forEach(file => {
      const img = document.createElement("img");
      img.src = `/avatars/${file}`;
      img.className =
        "w-16 h-16 rounded-lg cursor-pointer border-2 border-transparent hover:border-yellow-500 transition";

      img.addEventListener("click", () => {
        user.avatar = `/avatars/${file}`;
        localStorage.setItem("user", JSON.stringify(user));

        if (currentAvatar instanceof HTMLImageElement) {
          currentAvatar.src = user.avatar;
        }

        avatarMenu.classList.add("hidden");
      });

      avatarMenu.appendChild(img);
    });

    // Mostrar avatar actual
    if (currentAvatar instanceof HTMLImageElement) {
      currentAvatar.src = user.avatar;
    }
  }
});
