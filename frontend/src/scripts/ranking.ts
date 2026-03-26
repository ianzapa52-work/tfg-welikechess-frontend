// @ts-nocheck
interface Player {
  id: string;
  name: string;
  elo: number;
  wins: number;
  country: string;
  avatar: string;
  tier: string;
}

const initRanking = () => {
  const container = document.getElementById("ranking-container");
  if (!container) return;

  const dummyPlayers: Player[] = [
    { id: "1", name: "MAGNUS CARLSEN", elo: 2850, wins: 542, country: "no", avatar: "/avatars/w_king_avatar.png", tier: "GRANDMASTER" },
    { id: "2", name: "HIKARU NAKAMURA", elo: 2800, wins: 498, country: "us", avatar: "/avatars/b_king_avatar.png", tier: "GRANDMASTER" },
    { id: "3", name: "ALIREZA FIROUZJA", elo: 2780, wins: 320, country: "fr", avatar: "/avatars/w_rook_avatar.png", tier: "MASTER" },
    { id: "4", name: "FABIANO CARUANA", elo: 2765, wins: 410, country: "us", avatar: "/avatars/b_queen_avatar.png", tier: "MASTER" }
  ];

  // Generamos el HTML con la estructura que pide tu CSS
  container.innerHTML = dummyPlayers.map((p, i) => {
    const pos = i + 1;
    // Lógica para medallas (asumiendo que tienes estas imágenes o similares)
    const medalImg = pos === 1 ? "/assets/gold_medal.png" : pos === 2 ? "/assets/silver_medal.png" : "/assets/bronze_medal.png";
    
    return `
      <a href="/profile/${p.id}" class="ranking-link rank-${pos}">
        <div class="ranking-row">
          
          <div class="rank-position-wrapper">
            ${pos <= 3 ? `<img src="${medalImg}" class="rank-medal-img" alt="Medal" />` : ''}
            <span class="rank-number">#${pos}</span>
          </div>

          <div class="rank-visuals">
            <img src="${p.avatar}" class="rank-avatar" alt="${p.name}" />
            <div class="flag-wrapper">
              <img src="/flags/${p.country}.svg" class="rank-flag" alt="${p.country}" />
            </div>
          </div>

          <div class="rank-info">
            <div class="flex items-center">
              <span class="rank-name">${p.name}</span>
              <span class="rank-tier">${p.tier}</span>
            </div>
            <div class="rank-stats">
              <span>WINS: <strong>${p.wins}</strong></span>
              <span>•</span>
              <span>STATUS: <strong>ONLINE</strong></span>
            </div>
          </div>

          <div class="rank-elo-box">
            <span class="rank-elo-val">${p.elo}</span>
            <span class="rank-elo-label">ELO RATING</span>
          </div>

        </div>
      </a>
    `;
  }).join("");
};

// Asegurar carga en Astro
document.addEventListener('astro:page-load', initRanking);
if (document.readyState !== 'loading') initRanking();