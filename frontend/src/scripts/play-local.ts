import { Chess, type Square, type Move as ChessMove, type Color, type PieceSymbol } from "chess.js";

interface Piece {
  color: Color;
  type: PieceSymbol;
}

window.addEventListener("load", () => {
  // SELECCIÓN DE ELEMENTOS CON TYPE ASSERTION
  const boardEl = document.getElementById("board") as HTMLElement;
  const moveBody = document.getElementById("move-body") as HTMLTableSectionElement;
  const statusEl = document.getElementById("game-status") as HTMLElement;
  const capturedWhite = document.getElementById("captured-white") as HTMLElement;
  const capturedBlack = document.getElementById("captured-black") as HTMLElement;

  if (!boardEl || !moveBody || !statusEl) {
    console.error("Faltan elementos críticos en el DOM");
    return;
  }

  // SONIDOS
  const moveSound = new Audio("/sounds/move_sound.mp3");
  moveSound.volume = 0.4;

  const captureSound = new Audio("/sounds/capture_sound.mp3");
  captureSound.volume = 0.45;

  // ESTADO DEL JUEGO
  const game = new Chess();
  let selectedSquare: Square | null = null;

  // INICIALIZAR TABLA DE HISTORIAL (60 filas vacías)
  for (let i = 0; i < 60; i++) {
    const row = document.createElement("tr");
    row.innerHTML = `<td>${i + 1}</td><td></td><td></td>`;
    moveBody.appendChild(row);
  }

  // UTILIDADES
  function getPieceImage(piece: Piece): string {
    const color = piece.color === "w" ? "white" : "black";
    const map: Record<PieceSymbol, string> = { 
      p: "pawn", r: "rook", n: "horse", b: "bishop", q: "queen", k: "king" 
    };
    return `/pieces/${color[0]}_${map[piece.type]}.svg`;
  }

  function highlightSquare(el: HTMLElement | null): void {
    const prev = boardEl.querySelector(".selected");
    if (prev) prev.classList.remove("selected");
    if (el) el.classList.add("selected");
  }

  function clearLegalMoves(): void {
    boardEl.querySelectorAll(".legal-move").forEach((sq) => {
      sq.classList.remove("legal-move");
    });
  }

  function highlightLegalMoves(targets: Square[]): void {
    clearLegalMoves();
    for (const sq of targets) {
      const { row, col } = squareToCoord(sq);
      const el = boardEl.querySelector(`[data-row="${row}"][data-col="${col}"]`) as HTMLElement;
      if (el) el.classList.add("legal-move");
    }
  }

  function coordToSquare(row: number, col: number): Square {
    return (String.fromCharCode(97 + col) + (8 - row)) as Square;
  }

  function squareToCoord(square: Square): { row: number; col: number } {
    return {
      row: 8 - Number(square[1]),
      col: square.charCodeAt(0) - 97
    };
  }

  // LÓGICA DE ACTUALIZACIÓN
  function updateGameStatus(): void {
    if (game.isCheckmate()) {
      const winner = game.turn() === "w" ? "negras" : "blancas";
      statusEl.textContent = `Jaque mate: ganan las ${winner}`;
      return;
    }
    if (game.isStalemate() || game.isDraw()) {
      statusEl.textContent = "Tablas";
      return;
    }
    if (game.inCheck()) {
      const side = game.turn() === "w" ? "blancas" : "negras";
      statusEl.textContent = `Jaque a las ${side}`;
      return;
    }
    statusEl.textContent = "Turno de las " + (game.turn() === "w" ? "blancas" : "negras");
  }

  function updateHistory(): void {
    const history = game.history();
    const rows = moveBody.querySelectorAll("tr");

    for (let i = 0; i < rows.length; i++) {
      const cells = rows[i].querySelectorAll("td");
      if (cells.length < 3) continue;
      cells[1].textContent = history[i * 2] ?? "";
      cells[2].textContent = history[i * 2 + 1] ?? "";
    }
  }

  function registerCapture(move: ChessMove): void {
    if (!move.captured) return;

    const capturedColor = move.color === "w" ? "black" : "white";
    const container = capturedColor === "white" ? capturedWhite : capturedBlack;

    const map: Record<string, string> = { p: "pawn", r: "rook", n: "horse", b: "bishop", q: "queen", k: "king" };
    const img = document.createElement("img");
    img.src = `/pieces/${capturedColor[0]}_${map[move.captured]}.svg`;
    img.alt = "";
    img.classList.add("w-8", "h-8");
    container.appendChild(img);
  }

  function updateSingleMove(from: Square, to: Square, move: ChessMove): void {
    const fromCoord = squareToCoord(from);
    const toCoord = squareToCoord(to);

    const fromSq = boardEl.querySelector(`[data-row="${fromCoord.row}"][data-col="${fromCoord.col}"]`) as HTMLElement;
    const toSq = boardEl.querySelector(`[data-row="${toCoord.row}"][data-col="${toCoord.col}"]`) as HTMLElement;

    if (!fromSq || !toSq) return;

    fromSq.innerHTML = "";
    const piece = game.get(to);
    if (piece) {
      const img = document.createElement("img");
      img.src = getPieceImage(piece);
      img.className = "piece";
      img.draggable = true;
      enableDrag(img, toCoord.row, toCoord.col);
      toSq.innerHTML = "";
      toSq.appendChild(img);
    }
  }

  function renderBoard(): void {
    const state = game.board();
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const sq = boardEl.querySelector(`[data-row="${row}"][data-col="${col}"]`) as HTMLElement;
        if (!sq) continue;

        sq.innerHTML = "";
        const piece = state[row][col];
        if (piece) {
          const img = document.createElement("img");
          img.src = getPieceImage(piece);
          img.className = "piece";
          img.draggable = true;
          enableDrag(img, row, col);
          sq.appendChild(img);
        }
      }
    }
  }

  function enableDrag(img: HTMLImageElement, row: number, col: number): void {
    img.addEventListener("dragstart", (e) => {
      if (!e.dataTransfer) return;

      const from = coordToSquare(row, col);
      const piece = game.get(from);
      if (!piece || piece.color !== game.turn()) {
        e.preventDefault();
        return;
      }

      e.dataTransfer.setData("text/plain", from);
      selectedSquare = from;

      const sqEl = boardEl.querySelector(`[data-row="${row}"][data-col="${col}"]`) as HTMLElement;
      highlightSquare(sqEl);

      const moves = game.moves({ square: from, verbose: true });
      highlightLegalMoves(moves.map((m) => m.to));
    });
  }

  function handleSquareClick(row: number, col: number): void {
    const target = coordToSquare(row, col);
    const pieceHere = game.get(target);

    if (!selectedSquare) {
      if (pieceHere && pieceHere.color === game.turn()) {
        selectedSquare = target;
        const sqEl = boardEl.querySelector(`[data-row="${row}"][data-col="${col}"]`) as HTMLElement;
        highlightSquare(sqEl);
        const moves = game.moves({ square: target, verbose: true });
        highlightLegalMoves(moves.map((m) => m.to));
      }
      return;
    }

    if (pieceHere && pieceHere.color === game.turn() && target !== selectedSquare) {
      selectedSquare = target;
      const sqEl = boardEl.querySelector(`[data-row="${row}"][data-col="${col}"]`) as HTMLElement;
      highlightSquare(sqEl);
      const moves = game.moves({ square: target, verbose: true });
      highlightLegalMoves(moves.map((m) => m.to));
      return;
    }

    if (target === selectedSquare) {
      selectedSquare = null;
      highlightSquare(null);
      clearLegalMoves();
      return;
    }

    executeMove(selectedSquare, target);
  }

  function executeMove(from: Square, to: Square): void {
    const move = game.move({ from, to, promotion: "q" });
    if (!move) return;

    registerCapture(move);
    updateSingleMove(from, to, move);
    updateHistory();
    updateGameStatus();

    if (move.captured) {
      captureSound.currentTime = 0;
      captureSound.play().catch(() => {});
    } else {
      moveSound.currentTime = 0;
      moveSound.play().catch(() => {});
    }

    selectedSquare = null;
    highlightSquare(null);
    clearLegalMoves();
  }

  // CREACIÓN DINÁMICA DE LAS CASILLAS
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const square = document.createElement("div");
      square.classList.add("square");
      square.dataset.row = String(row);
      square.dataset.col = String(col);
      square.classList.add((row + col) % 2 === 1 ? "dark" : "light");

      square.addEventListener("click", () => handleSquareClick(row, col));
      square.addEventListener("dragover", (e) => {
        e.preventDefault();
        square.classList.add("hover-target");
      });
      square.addEventListener("dragleave", () => square.classList.remove("hover-target"));
      square.addEventListener("drop", (e) => {
        e.preventDefault();
        square.classList.remove("hover-target");
        if (!e.dataTransfer) return;

        const from = e.dataTransfer.getData("text/plain") as Square;
        const to = coordToSquare(row, col);
        if (from !== to) executeMove(from, to);
      });

      boardEl.appendChild(square);
    }
  }

  renderBoard();
  updateGameStatus();
});