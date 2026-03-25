// @ts-check

/**
 * @typedef {Object} Player
 * @property {string} id
 * @property {string} name
 * @property {number} elo
 * @property {number} wins
 * @property {number} losses
 * @property {number} games
 * @property {string} country
 * @property {string} avatar
 * @property {string} level
 */

window.addEventListener("load", () => {
  const container = document.getElementById("ranking-container");
  const loading = document.getElementById("loadingRanking");

  if (!container || !loading) return;

  const storedUser = JSON.parse(localStorage.getItem("user") || "null");

  /** @type {Player[]} */
  const dummyRanking = [
    { id: "1", name: "ASPA", elo: 2150, wins: 145, losses: 20, games: 165, country: "es", avatar: storedUser?.avatar || "/avatars/w_king_avatar.png", level: "master" },
    { id: "2", name: "CARLOS", elo: 1950, wins: 98, losses: 55, games: 153, country: "mx", avatar: "/avatars/b_king_avatar.png", level: "master" },
    { id: "3", name: "LUCÍA", elo: 1890, wins: 80, losses: 60, games: 140, country: "ar", avatar: "/avatars/w_horse_avatar.png", level: "expert" },
    { id: "4", name: "MARCOS", elo: 1650, wins: 70, losses: 50, games: 120, country: "es", avatar: "/avatars/b_horse_avatar.png", level: "expert" },
    { id: "5", name: "ANA", elo: 1400, wins: 65, losses: 45, games: 110, country: "cl", avatar: "/avatars/b_bishop_avatar.png", level: "rookie" }
  ];

  /**
   * @param {Player} player 
   * @param {number} index 
   */
  function renderPlayer(player, index) {
    const a = document.createElement("a");
    a.href = `/profile/${player.id}`;
    a.className = "ranking-link";
    
    const isTop3 = index < 3;
    const rankClass = isTop3 ? `rank-${index + 1}` : "";
    
    // Ajusta esta ruta según tu carpeta real: /assets/${player.country}.svg
    const flagPath = `/assets/${player.country}.svg`;
    const medalImages = ["gold_medal.png", "silver_medal.png", "bronze_medal.png"];
    const medalHtml = isTop3 ? `<img src="/assets/${medalImages[index]}" class="rank-medal-img" alt="Medalla" />` : "";

    a.innerHTML = `
      <div class="ranking-row ${rankClass}" style="animation-delay: ${index * 0.1}s">
        <div class="rank-position-wrapper">
          ${medalHtml}
          <span class="rank-number">#${index + 1}</span>
        </div>
        
        <div class="rank-visuals">
          <div class="avatar-container">
            <img class="rank-avatar" src="${player.avatar}" alt="Avatar" />
            <div class="flag-wrapper">
              <img class="rank-flag" src="/flags/${player.country}.svg" alt="Flag" />
            </div>
          </div>
        </div>

        <div class="rank-info">
          <div class="flex items-center">
            <span class="rank-name">${player.name}</span>
            <span class="rank-tier">${player.level.toUpperCase()}</span>
          </div>
          <div class="rank-stats">
            <span><strong>${player.wins}</strong>W</span>
            <span>•</span>
            <span><strong>${player.losses}</strong>L</span>
            <span>•</span>
            <span>${player.games} partidas</span>
          </div>
        </div>

        <div class="rank-elo-box">
          <span class="rank-elo-val">${player.elo}</span>
          <span class="rank-elo-label">ELO</span>
        </div>
      </div>
    `;
    return a;
  }

  setTimeout(() => {
    loading.style.display = "none";
    dummyRanking
      .sort((a, b) => b.elo - a.elo)
      .forEach((player, i) => container.appendChild(renderPlayer(player, i)));
  }, 400);
});