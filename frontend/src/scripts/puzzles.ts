import { Chess, type Square, type PieceSymbol, type Color } from "chess.js";

interface Puzzle {
  fen: string;
  solution: string; // Ejemplo: "e2e4"
  objective: string;
}

window.addEventListener("load", () => {
  const boardEl = document.getElementById("puzzle-board") as HTMLElement;
  const objectiveEl = document.getElementById("puzzleObjective") as HTMLElement;
  const nextBtn = document.getElementById("nextPuzzle") as HTMLButtonElement;

  if (!boardEl || !objectiveEl) return;

  const game = new Chess();
  let currentIndex = 0;
  let selectedSquare: Square | null = null;

  // Base de datos de puzzles (puedes mover esto a un JSON externo luego)
  const puzzles: Puzzle[] = [
    { 
      fen: "4kb1r/p2n1ppp/4q3/4p3/3P4/8/PP1P1PPP/RNB1KBNR w KQk - 0 1", 
      solution: "d4e5", 
      objective: "Blancas juegan y ganan material" 
    },
    { 
      fen: "r1bqkb1r/pppp1ppp/2n2n2/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 4 4", 
      solution: "c4f7", 
      objective: "Encuentra el sacrificio de pieza" 
    }
  ];

  // --- UTILIDADES ---

  function getPieceImage(piece: { color: Color; type: PieceSymbol }): string {
    const colorName = piece.color === "w" ? "white" : "black";
    const pieceMap: Record<PieceSymbol, string> = {
      p: "pawn", r: "rook", n: "horse", b: "bishop", q: "queen", k: "king"
    };
    return `/pieces/${colorName[0]}_${pieceMap[piece.type]}.svg`;
  }

  function renderBoard() {
    boardEl.innerHTML = "";
    const state = game.board();

    state.forEach((row, r) => {
      row.forEach((piece, c) => {
        const square = document.createElement("div");
        square.className = `square ${(r + c) % 2 === 1 ? "dark" : "light"}`;
        const currentCoord = (String.fromCharCode(97 + c) + (8 - r)) as Square;

        if (selectedSquare === currentCoord) {
          square.classList.add("selected");
        }

        if (piece) {
          const img = document.createElement("img");
          img.src = getPieceImage(piece);
          img.className = "piece";
          square.appendChild(img);
        }

        square.onclick = () => handleSquareClick(currentCoord);
        boardEl.appendChild(square);
      });
    });
  }

  function handleSquareClick(clickedSq: Square) {
    const piece = game.get(clickedSq);

    // 1. Seleccionar pieza
    if (!selectedSquare) {
      if (piece && piece.color === game.turn()) {
        selectedSquare = clickedSq;
        renderBoard();
      }
      return;
    }

    // 2. Intentar mover
    const moveAttempt = { from: selectedSquare, to: clickedSq, promotion: "q" as const };
    const move = game.move(moveAttempt);

    if (move) {
      const playedMove = move.from + move.to;
      const correctMove = puzzles[currentIndex].solution;

      if (playedMove === correctMove) {
        objectiveEl.textContent = "¡Excelente! Movimiento correcto.";
        objectiveEl.classList.replace("bg-white", "bg-green-100");
        // Aquí podrías disparar un sonido de éxito
      } else {
        objectiveEl.textContent = "Incorrecto. Intenta otra vez.";
        objectiveEl.classList.replace("bg-white", "bg-red-100");
        game.undo();
      }
      renderBoard();
    }

    selectedSquare = null;
    renderBoard();
  }

  function loadPuzzle(index: number) {
    const p = puzzles[index];
    if (!p) return;

    game.load(p.fen);
    objectiveEl.textContent = p.objective;
    objectiveEl.classList.remove("bg-green-100", "bg-red-100");
    objectiveEl.classList.add("bg-white");
    renderBoard();
  }

  // --- EVENTOS ---

  if (nextBtn) {
    nextBtn.onclick = () => {
      currentIndex = (currentIndex + 1) % puzzles.length;
      loadPuzzle(currentIndex);
    };
  }

  // Inicio
  loadPuzzle(currentIndex);
});