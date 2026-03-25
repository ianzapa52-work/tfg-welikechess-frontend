// @ts-check

window.addEventListener("load", () => {
  /** @type {HTMLElement | null} */
  const containerEl = document.getElementById("ranking-container");

  /** @type {HTMLElement | null} */
  const loadingEl = document.getElementById("loadingRanking");

  // Si faltan elementos → salir
  if (!containerEl || !loadingEl) {
    console.warn("Ranking: faltan elementos del DOM");
    return;
  }

  // A partir de aquí, TypeScript SABE que no son null
  /** @type {HTMLElement} */
  const container = containerEl;

  /** @type {HTMLElement} */
  const loading = loadingEl;

  /** @type {{name:string,avatar:string}|null} */
  const storedUser = JSON.parse(localStorage.getItem("user") || "null");

  /**
   * @typedef {{
   *  id: string,
   *  name: string,
   *  elo: number,
   *  wins: number,
   *  losses: number,
   *  games: number,
   *  country: string,
   *  avatar: string,
   *  level: "master" | "expert" | "rookie"
   * }} Player
   */

  /** @type {Player[]} */
  const dummyRanking = [
    {
      id: "1",
      name: storedUser?.name || "Jugador",
      elo: 1820,
      wins: 120,
      losses: 40,
      games: 160,
      country: "es",
      avatar: storedUser?.avatar || "/avatars/w_king_avatar.png",
      level: "master"
    },
    { id: "2", name: "Carlos", elo: 1750, wins: 98, losses: 55, games: 153, country: "mx", avatar: "/avatars/b_king_avatar.png", level: "expert" },
    { id: "3", name: "Lucía", elo: 1690, wins: 80, losses: 60, games: 140, country: "ar", avatar: "/avatars/w_horse_avatar.png", level: "expert" },
    { id: "4", name: "Marcos", elo: 1650, wins: 70, losses: 50, games: 120, country: "es", avatar: "/avatars/b_horse_avatar.png", level: "rookie" },
    { id: "5", name: "Ana", elo: 1600, wins: 65, losses: 45, games: 110, country: "cl", avatar: "/avatars/b_bishop_avatar.png", level: "rookie" }
  ];

  dummyRanking.sort((a, b) => b.elo - a.elo);

  /**
   * @param {Player} player
   * @param {number} index
   */
  function renderPlayer(player, index) {
    const winrate = Math.round((player.wins / player.games) * 100);

    const row = document.createElement("div");
    row.className = "ranking-row";
    row.style.animationDelay = `${index * 0.08}s`;

    row.innerHTML = `
      <div class="rank-left">
        <img class="rank-flag" src="/flags/${player.country}.svg" />
        <img class="rank-avatar" src="${player.avatar}" />
        <div class="rank-info">
          <span class="rank-position">${index + 1}</span>
          <span class="rank-name">${player.name}</span>
          <span class="rank-badge badge-${player.level}">${player.level.toUpperCase()}</span>
        </div>
      </div>

      <div class="rank-right">
        <span class="rank-medal"></span>
        <p class="rank-elo">${player.elo} ELO</p>
        <p class="rank-stats">${player.wins}W - ${player.losses}L (${player.games} partidas)</p>
        <div class="rank-progress">
          <div class="rank-progress-fill" style="width: ${winrate}%"></div>
        </div>
      </div>
    `;

    return row;
  }

  function loadRanking() {
    loading.style.display = "none";
    dummyRanking.forEach((player, i) => container.appendChild(renderPlayer(player, i)));
  }

  loadRanking();
});
