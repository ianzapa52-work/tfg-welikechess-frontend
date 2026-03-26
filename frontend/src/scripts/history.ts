// history.ts

interface Game {
  id: string;
  mode: "online" | "ia" | "local";
  result: "win" | "loss" | "draw";
  date: string;
  moves: number;
}

const setupHistory = () => {
  const container = document.getElementById("history-container");
  const loading = document.getElementById("loadingHistory");

  // Si no existen en el DOM, no hacemos nada para no dar error
  if (!container || !loading) return;

  console.log("Historial detectado, renderizando...");

  const dummyHistory: Game[] = [
    { id: "1", mode: "online", result: "win", date: "2026-02-20", moves: 42 },
    { id: "2", mode: "ia", result: "loss", date: "2026-02-18", moves: 31 },
    { id: "3", mode: "local", result: "draw", date: "2026-02-15", moves: 58 },
    { id: "4", mode: "online", result: "win", date: "2026-02-20", moves: 42 },
    { id: "5", mode: "ia", result: "loss", date: "2026-02-18", moves: 31 }
  ];

  const resultLabels = { win: "Victoria", loss: "Derrota", draw: "Tablas" };
  const resultColors = { win: "text-green-700", loss: "text-red-700", draw: "text-yellow-700" };

  // Limpiamos el contenedor por si acaso
  container.innerHTML = "";
  loading.style.display = "none";

  dummyHistory.forEach((game) => {
    const card = document.createElement("div");
    card.className = "history-card cursor-pointer";
    card.innerHTML = `
      <div class="history-left">
        <p class="${resultColors[game.result]} font-bold">${resultLabels[game.result]}</p>
        <p class="text-sm opacity-80">${game.mode.toUpperCase()}</p>
      </div>
      <div class="history-right text-right">
        <p>${new Date(game.date).toLocaleDateString("es-ES")}</p>
        <p class="text-xs opacity-60">${game.moves} movs</p>
      </div>
    `;
    card.onclick = () => alert(`Partida ${game.id}`);
    container.appendChild(card);
  });
};

// EJECUCIÓN INMEDIATA Y SEGURA
// Esto cubre carga normal, View Transitions y recargas de Vercel
setupHistory();
document.addEventListener('astro:page-load', setupHistory);