import { Chess, type Square, type Move as ChessMove } from "chess.js";

window.addEventListener("load", () => {
  const boardEl = document.getElementById("board") as HTMLElement;
  const moveBody = document.getElementById("move-body") as HTMLTableSectionElement;
  const statusEl = document.getElementById("game-status") as HTMLElement;
  const aiLevelSelect = document.getElementById("ai-level") as HTMLSelectElement;

  if (!boardEl || !statusEl) return;

  const game = new Chess();
  let selectedSquare: Square | null = null;

  // Sonidos
  const moveSound = new Audio("/sounds/move_sound.mp3");
  const captureSound = new Audio("/sounds/capture_sound.mp3");

  // --- LÓGICA DE IA (Random para este ejemplo, ampliable) ---
  function makeAIMove() {
    if (game.isGameOver()) return;

    const possibleMoves = game.moves();
    const randomIdx = Math.floor(Math.random() * possibleMoves.length);
    const move = game.move(possibleMoves[randomIdx]);

    if (move) {
      playSound(move);
      renderBoard();
      updateUI();
    }
  }

  // --- UTILIDADES DE RENDERIZADO (Igual que el anterior) ---
  function getPieceImage(piece: { color: string, type: string }) {
    const color = piece.color === "w" ? "white" : "black";
    const map: any = { p: "pawn", r: "rook", n: "horse", b: "bishop", q: "queen", k: "king" };
    return `/pieces/${color[0]}_${map[piece.type]}.svg`;
  }

  function playSound(move: ChessMove) {
    const sound = move.captured ? captureSound : moveSound;
    sound.currentTime = 0;
    sound.play().catch(() => {});
  }

  function renderBoard() {
    boardEl.innerHTML = "";
    const state = game.board();

    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const square = document.createElement("div");
        square.className = `square ${(row + col) % 2 === 1 ? "dark" : "light"}`;
        square.dataset.row = String(row);
        square.dataset.col = String(col);

        const piece = state[row][col];
        if (piece) {
          const img = document.createElement("img");
          img.src = getPieceImage(piece);
          img.className = "piece";
          img.draggable = piece.color === 'w'; // Solo arrastrable si es blanco
          
          img.addEventListener("dragstart", (e) => {
            if (game.turn() !== 'w') return e.preventDefault();
            const from = (String.fromCharCode(97 + col) + (8 - row)) as Square;
            e.dataTransfer?.setData("text/plain", from);
          });
          
          square.appendChild(img);
        }

        square.onclick = () => handleSquareClick(row, col);
        
        // Setup Drop
        square.addEventListener("dragover", (e) => e.preventDefault());
        square.addEventListener("drop", (e) => {
          e.preventDefault();
          const from = e.dataTransfer?.getData("text/plain") as Square;
          const to = (String.fromCharCode(97 + col) + (8 - row)) as Square;
          executePlayerMove(from, to);
        });

        boardEl.appendChild(square);
      }
    }
  }

  function handleSquareClick(row: number, col: number) {
    if (game.turn() !== 'w') return; // Bloquear si no es turno humano
    const target = (String.fromCharCode(97 + col) + (8 - row)) as Square;
    
    if (!selectedSquare) {
      const piece = game.get(target);
      if (piece && piece.color === 'w') selectedSquare = target;
    } else {
      executePlayerMove(selectedSquare, target);
      selectedSquare = null;
    }
  }

  function executePlayerMove(from: Square, to: Square) {
    const move = game.move({ from, to, promotion: "q" });
    if (!move) return;

    playSound(move);
    renderBoard();
    updateUI();

    // Turno de la IA
    setTimeout(makeAIMove, 400);
  }

  function updateUI() {
    const turnText = game.turn() === "w" ? "Tu turno (Blancas)" : "IA pensando...";
    statusEl.textContent = game.isCheckmate() ? "Jaque Mate" : turnText;
    
    // Historial
    const history = game.history();
    let html = '';
    for (let i = 0; i < history.length; i += 2) {
      html += `<tr><td>${Math.floor(i/2) + 1}</td><td>${history[i]}</td><td>${history[i+1] || ''}</td></tr>`;
    }
    moveBody.innerHTML = html;
  }

  renderBoard();
  updateUI();
});