interface Piece { color: string; type: string; }
interface GameState {
  board: Array<Array<Piece | null>>;
  history: string[];
  status: string;
}

window.addEventListener("load", () => {
  const boardEl = document.getElementById("board") as HTMLElement;
  const statusEl = document.getElementById("game-status") as HTMLElement;
  const moveBody = document.getElementById("move-body") as HTMLTableSectionElement;

  if (!boardEl || !statusEl) return;

  // Conexión WebSocket
  const socket = new WebSocket("ws://localhost:3000");
  let selectedSquare: string | null = null;

  socket.onmessage = (event) => {
    const msg = JSON.parse(event.data);
    if (msg.type === "state") renderState(msg.payload);
    if (msg.type === "status") statusEl.textContent = msg.payload;
  };

  function renderState(state: GameState) {
    boardEl.innerHTML = "";
    
    state.board.forEach((row, r) => {
      row.forEach((piece, c) => {
        const square = document.createElement("div");
        square.className = `square ${(r + c) % 2 === 1 ? "dark" : "light"}`;
        const coord = String.fromCharCode(97 + c) + (8 - r);

        if (piece) {
          const img = document.createElement("img");
          img.src = `/pieces/${piece.color}_${getPieceName(piece.type)}.svg`;
          img.className = "piece";
          square.appendChild(img);
        }

        square.onclick = () => {
          if (!selectedSquare) {
            selectedSquare = coord;
            square.classList.add("selected");
          } else {
            // Enviar intento de movimiento al servidor
            socket.send(JSON.stringify({ 
              type: "move", 
              payload: { from: selectedSquare, to: coord, promotion: "q" } 
            }));
            selectedSquare = null;
          }
        };

        boardEl.appendChild(square);
      });
    });

    // Actualizar tabla de historial
    updateHistoryTable(state.history);
  }

  function getPieceName(type: string): string {
    const map: any = { p: "pawn", r: "rook", n: "horse", b: "bishop", q: "queen", k: "king" };
    return map[type] || type;
  }

  function updateHistoryTable(history: string[]) {
    if (!moveBody) return;
    let html = '';
    for (let i = 0; i < history.length; i += 2) {
      html += `<tr><td>${Math.floor(i/2) + 1}</td><td>${history[i]}</td><td>${history[i+1] || ''}</td></tr>`;
    }
    moveBody.innerHTML = html;
  }
});