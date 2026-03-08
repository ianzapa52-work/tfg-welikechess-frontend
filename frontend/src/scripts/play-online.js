// @ts-check

/** @typedef {{ from: string, to: string, promotion?: string }} ServerMove */
/** @typedef {{ type: string, payload: any }} ServerMessage */

window.addEventListener("load", () => {
  // NARROWING DE ELEMENTOS
  const boardMaybe = document.getElementById("board");
  if (!(boardMaybe instanceof HTMLElement)) throw new Error("Missing #board");
  const boardEl = boardMaybe;

  const moveBodyMaybe = document.getElementById("move-body");
  if (!(moveBodyMaybe instanceof HTMLTableSectionElement)) throw new Error("Missing #move-body");
  const moveBody = moveBodyMaybe;

  const statusMaybe = document.getElementById("game-status");
  if (!(statusMaybe instanceof HTMLElement)) throw new Error("Missing #game-status");
  const statusEl = statusMaybe;

  const capturedWhiteMaybe = document.getElementById("captured-white");
  if (!(capturedWhiteMaybe instanceof HTMLElement)) throw new Error("Missing #captured-white");
  const capturedWhite = capturedWhiteMaybe;

  const capturedBlackMaybe = document.getElementById("captured-black");
  if (!(capturedBlackMaybe instanceof HTMLElement)) throw new Error("Missing #captured-black");
  const capturedBlack = capturedBlackMaybe;

  // WEBSOCKET (aún no existe backend)
  const socket = new WebSocket("ws://localhost:3000");

  socket.addEventListener("open", () => {
    console.log("Conectado al servidor (aunque aún no exista)");
  });

  socket.addEventListener("message", (event) => {
    /** @type {ServerMessage} */
    const msg = JSON.parse(event.data);

    switch (msg.type) {
      case "state":
        renderFullState(msg.payload);
        break;

      case "move":
        applyMove(msg.payload);
        break;

      case "status":
        statusEl.textContent = msg.payload;
        break;
    }
  });

  // UTILIDADES

  function clearBoard() {
    boardEl.querySelectorAll(".square").forEach((sq) => (sq.innerHTML = ""));
  }

  /**
   * @param {{ board: Array<Array<{color:string,type:string}|null>>, history: string[], capturedWhite: string[], capturedBlack: string[], status: string }} state
   */
  function renderFullState(state) {
    clearBoard();

    // Pintar piezas
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const sq = boardEl.querySelector(`[data-row="${row}"][data-col="${col}"]`);
        if (!(sq instanceof HTMLElement)) continue;

        const piece = state.board[row][col];
        if (!piece) continue;

        const img = document.createElement("img");
        img.src = `/pieces/${piece.color}_${piece.type}.svg`;
        img.className = "piece";
        img.draggable = true;

        enableDrag(img, row, col);
        sq.appendChild(img);
      }
    }

    // Capturas
    capturedWhite.innerHTML = "";
    capturedBlack.innerHTML = "";

    for (const p of state.capturedWhite) {
      const img = document.createElement("img");
      img.src = `/pieces/w_${p}.svg`;
      img.classList.add("w-8", "h-8");
      capturedWhite.appendChild(img);
    }

    for (const p of state.capturedBlack) {
      const img = document.createElement("img");
      img.src = `/pieces/b_${p}.svg`;
      img.classList.add("w-8", "h-8");
      capturedBlack.appendChild(img);
    }

    // Historial
    const rows = moveBody.querySelectorAll("tr");
    for (let i = 0; i < rows.length; i++) {
      const cells = rows[i].querySelectorAll("td");
      cells[1].textContent = state.history[i * 2] ?? "";
      cells[2].textContent = state.history[i * 2 + 1] ?? "";
    }

    statusEl.textContent = state.status;
  }

  /**
   * @param {ServerMove} move
   */
  function applyMove(move) {
    const fromSq = squareToCoord(move.from);
    const toSq = squareToCoord(move.to);

    const fromEl = boardEl.querySelector(`[data-row="${fromSq.row}"][data-col="${fromSq.col}"]`);
    const toEl = boardEl.querySelector(`[data-row="${toSq.row}"][data-col="${toSq.col}"]`);

    if (!(fromEl instanceof HTMLElement) || !(toEl instanceof HTMLElement)) return;

    const piece = fromEl.querySelector("img");
    fromEl.innerHTML = "";
    toEl.innerHTML = "";

    if (piece) toEl.appendChild(piece);
  }

  // DRAG & DROP

  /**
   * @param {HTMLImageElement} img
   * @param {number} row
   * @param {number} col
   */
  function enableDrag(img, row, col) {
    img.addEventListener("dragstart", (e) => {
      if (!e.dataTransfer) return;
      e.dataTransfer.setData("from", coordToSquare(row, col));
    });
  }

  /**
   * @param {number} row
   * @param {number} col
   */
  function coordToSquare(row, col) {
    return String.fromCharCode(97 + col) + (8 - row);
  }

  /**
   * @param {string} square
   */
  function squareToCoord(square) {
    return {
      row: 8 - Number(square[1]),
      col: square.charCodeAt(0) - 97
    };
  }

  // CREAR CASILLAS
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const square = document.createElement("div");
      square.classList.add("square");
      square.dataset.row = String(row);
      square.dataset.col = String(col);

      const isDark = (row + col) % 2 === 1;
      square.classList.add(isDark ? "dark" : "light");

      square.addEventListener("dragover", (e) => e.preventDefault());

      square.addEventListener("drop", (e) => {
        e.preventDefault();
        if (!e.dataTransfer) return;

        const from = e.dataTransfer.getData("from");
        const to = coordToSquare(row, col);

        socket.send(JSON.stringify({
          type: "move",
          payload: { from, to }
        }));
      });

      boardEl.appendChild(square);
    }
  }
});
