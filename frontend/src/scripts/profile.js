// @ts-check

/**
 * @typedef {{
 *   name: string,
 *   email: string
 * }} User
 */

/**
 * @typedef {{
 *   rating: number,
 *   wins: number,
 *   losses: number,
 *   draws: number,
 *   totalGames: number,
 *   puzzlesSolved: number,
 *   puzzlesFailed: number,
 *   createdAt: number,
 *   lastLogin: number
 * }} Stats
 */

document.addEventListener("DOMContentLoaded", () => {
  /** @type {HTMLElement | null} */
  const userBox = document.querySelector("#profile-user");

  /** @type {HTMLElement | null} */
  const logoutBtn = document.querySelector("#logoutBtn");

  /** @type {User | null} */
  const user = JSON.parse(localStorage.getItem("user") || "null");

  /** @type {Stats | null} */
  const stats = JSON.parse(localStorage.getItem("stats") || "null");

  // Si no hay usuario → redirigir automáticamente
  if (!user) {
    window.location.href = "/login";
    return;
  }

  // Mostrar perfil
  if (userBox) {
    userBox.classList.remove("hidden");
    userBox.classList.add("grid");
  }

  // Datos básicos
  const usernameEl = document.querySelector("#profile-username");
  const emailEl = document.querySelector("#profile-email");

  if (usernameEl) usernameEl.textContent = user.name ?? "Usuario";
  if (emailEl) emailEl.textContent = user.email;

  // Si no hay estadísticas, crearlas
  if (!stats) {
    /** @type {Stats} */
    const defaultStats = {
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
    localStorage.setItem("stats", JSON.stringify(defaultStats));
  }

  /** @type {Stats} */
  const s = JSON.parse(localStorage.getItem("stats") || "null");

  // Rating
  const ratingEl = document.querySelector("#stat-rating");
  if (ratingEl) ratingEl.textContent = `${s.rating} Elo`;

  // Estadísticas generales
  const gamesEl = document.querySelector("#stat-games");
  const winsEl = document.querySelector("#stat-wins");
  const lossesEl = document.querySelector("#stat-losses");
  const drawsEl = document.querySelector("#stat-draws");

  if (gamesEl) gamesEl.textContent = `Partidas jugadas: ${s.totalGames}`;
  if (winsEl) winsEl.textContent = `Victorias: ${s.wins}`;
  if (lossesEl) lossesEl.textContent = `Derrotas: ${s.losses}`;
  if (drawsEl) drawsEl.textContent = `Tablas: ${s.draws}`;

  // Puzzles
  const solvedEl = document.querySelector("#stat-puzzles-solved");
  const failedEl = document.querySelector("#stat-puzzles-failed");

  if (solvedEl) solvedEl.textContent = `Puzzles resueltos: ${s.puzzlesSolved}`;
  if (failedEl) failedEl.textContent = `Puzzles fallados: ${s.puzzlesFailed}`;

  // Barra de progreso
  const progressEl = /** @type {HTMLElement | null} */ (document.querySelector("#puzzle-progress"));

  const totalPuzzles = s.puzzlesSolved + s.puzzlesFailed;
  const progress = totalPuzzles > 0 ? (s.puzzlesSolved / totalPuzzles) * 100 : 0;

  if (progressEl) progressEl.style.width = progress + "%";

  // Fechas
  const createdEl = document.querySelector("#created-at");
  const lastLoginEl = document.querySelector("#last-login");

  if (createdEl)
    createdEl.textContent = "Cuenta creada: " + new Date(s.createdAt).toLocaleDateString();

  if (lastLoginEl)
    lastLoginEl.textContent = "Último inicio de sesión: " + new Date(s.lastLogin).toLocaleString();

  // Logout
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      localStorage.removeItem("user");
      localStorage.removeItem("stats");
      window.location.href = "/login";
    });
  }
});
