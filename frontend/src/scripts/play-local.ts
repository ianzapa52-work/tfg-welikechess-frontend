import { Chess, type Square, type Move as ChessMove, type Color, type PieceSymbol } from "chess.js";

window.addEventListener("load", () => {
    const boardEl = document.getElementById("board") as HTMLElement;
    const statusEl = document.getElementById("game-status") as HTMLElement;
    const moveBody = document.getElementById("move-body") as HTMLTableSectionElement;
    const capWhite = document.getElementById("captured-white") as HTMLElement;
    const capBlack = document.getElementById("captured-black") as HTMLElement;
    const resetBtn = document.getElementById("resetBtn") as HTMLButtonElement;

    if (!boardEl) return;

    const game = new Chess();
    let selectedSquare: Square | null = null;
    let draggedPiece: HTMLElement | null = null;

    const moveSound = new Audio("/sounds/move_sound.mp3");
    const captureSound = new Audio("/sounds/capture_sound.mp3");

    function getPieceImage(piece: { color: Color; type: PieceSymbol }) {
        const colorFolder = piece.color === "w" ? "white" : "black";
        const pieceMap: Record<string, string> = { p: "pawn", r: "rook", n: "horse", b: "bishop", q: "queen", k: "king" };
        return `/pieces/${colorFolder[0]}_${pieceMap[piece.type]}.svg`;
    }

    function createBoard() {
        boardEl.innerHTML = "";
        for (let i = 0; i < 64; i++) {
            const row = Math.floor(i / 8);
            const col = i % 8;
            const coord = (String.fromCharCode(97 + col) + (8 - row)) as Square;
            const square = document.createElement("div");
            
            square.className = `square ${(row + col) % 2 === 1 ? "dark" : "light"}`;
            square.dataset.coord = coord;

            square.onclick = () => handleSquareClick(coord);
            boardEl.appendChild(square);
        }
        updateBoardPieces();
    }

    function updateBoardPieces() {
        const state = game.board();
        const squares = boardEl.querySelectorAll(".square");

        squares.forEach((sq, i) => {
            const squareEl = sq as HTMLElement;
            const coord = squareEl.dataset.coord as Square;
            const piece = state[Math.floor(i / 8)][i % 8];

            // ELIMINADO: Ya no añadimos la clase 'selected' aquí para evitar el brillo azul
            squareEl.classList.remove("selected", "legal-move");

            let img = squareEl.querySelector("img");
            if (piece) {
                if (!img) {
                    img = document.createElement("img");
                    img.className = "piece";
                    squareEl.appendChild(img);
                }
                img.src = getPieceImage(piece);
                img.style.opacity = "1";

                img.onmousedown = (e) => {
                    if (piece.color !== game.turn()) return;
                    e.preventDefault();
                    
                    selectedSquare = coord;
                    const originalPiece = img as HTMLElement;

                    originalPiece.style.opacity = "0.4";
                    
                    draggedPiece = originalPiece.cloneNode(true) as HTMLElement;
                    draggedPiece.style.opacity = "1";
                    draggedPiece.classList.add("dragging-active");
                    
                    document.body.appendChild(draggedPiece);
                    document.body.classList.add("is-dragging");
                    
                    movePieceAt(e.pageX, e.pageY);
                    highlightLegalMoves(coord);
                    
                    // Nos aseguramos de que al empezar a arrastrar no haya ninguna casilla con brillo azul
                    boardEl.querySelectorAll(".square").forEach(s => s.classList.remove("selected"));
                };
            } else if (img) {
                img.remove();
            }
        });
    }

    document.onmousemove = (e) => {
        if (draggedPiece) movePieceAt(e.pageX, e.pageY);
    };

    document.onmouseup = (e) => {
        if (!draggedPiece || !selectedSquare) return;

        const from = selectedSquare;
        draggedPiece.remove();
        draggedPiece = null;
        document.body.classList.remove("is-dragging");

        const elementBelow = document.elementFromPoint(e.clientX, e.clientY);
        const squareBelow = elementBelow?.closest(".square") as HTMLElement;
        const to = squareBelow?.dataset.coord as Square;

        if (to && from !== to) {
            executeMove(from, to);
        } else {
            updateBoardPieces();
        }
    };

    function movePieceAt(x: number, y: number) {
        if (draggedPiece) {
            draggedPiece.style.left = x + "px";
            draggedPiece.style.top = y + "px";
        }
    }

    function highlightLegalMoves(square: Square) {
        boardEl.querySelectorAll(".square").forEach(s => s.classList.remove("legal-move"));
        const moves = game.moves({ square, verbose: true });
        moves.forEach(m => {
            boardEl.querySelector(`[data-coord="${m.to}"]`)?.classList.add("legal-move");
        });
    }

    function handleSquareClick(coord: Square) {
        const piece = game.get(coord);
        
        if (selectedSquare) {
            if (piece && piece.color === game.turn() && coord !== selectedSquare) {
                selectedSquare = coord;
                updateBoardPieces();
                highlightLegalMoves(coord);
                // Si quieres que al hacer CLICK (no arrastre) sí brille, podrías añadirlo aquí,
                // pero como pides quitarlo, lo dejamos limpio.
                return;
            }
            executeMove(selectedSquare, coord);
        } else if (piece && piece.color === game.turn()) {
            selectedSquare = coord;
            updateBoardPieces();
            highlightLegalMoves(coord);
        }
    }

    function executeMove(from: Square, to: Square) {
        try {
            const move = game.move({ from, to, promotion: "q" });
            if (move) {
                selectedSquare = null;
                move.captured ? captureSound.play().catch(()=>null) : moveSound.play().catch(()=>null);
                if (move.captured) addCaptured(move);
                updateUI();
            }
        } catch (e) {}

        selectedSquare = null;
        updateBoardPieces();
    }

    function addCaptured(move: ChessMove) {
        const container = move.color === "w" ? capBlack : capWhite;
        const img = document.createElement("img");
        const map: Record<string, string> = { p: "pawn", r: "rook", n: "horse", b: "bishop", q: "queen", k: "king" };
        const colorChar = move.color === "w" ? "b" : "w"; 
        
        img.src = `/pieces/${colorChar}_${map[move.captured!]}.svg`;
        img.style.width = "22px";
        img.style.filter = "drop-shadow(0 2px 2px rgba(0,0,0,0.5))";
        container.appendChild(img);
    }

    function updateUI() {
        let statusText = game.turn() === "w" ? "TURNO BLANCAS" : "TURNO NEGRAS";
        if (game.inCheck()) statusText += " (¡JAQUE!)";
        if (game.isCheckmate()) statusText = "¡JAQUE MATE!";
        if (game.isDraw()) statusText = "TABLAS";
        statusEl.textContent = statusText;

        const history = game.history();
        moveBody.innerHTML = "";
        for (let i = 0; i < history.length; i += 2) {
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td style="color:#666; width: 30px;">${Math.floor(i / 2) + 1}.</td>
                <td style="font-weight:bold; color:#d4af37">${history[i]}</td>
                <td style="color:#ccc">${history[i + 1] || "-"}</td>
            `;
            moveBody.appendChild(tr);
        }
        
        const scroll = moveBody.closest(".history-scroll");
        if (scroll) scroll.scrollTop = scroll.scrollHeight;
    }

    resetBtn.onclick = () => {
        game.reset();
        capWhite.innerHTML = "";
        capBlack.innerHTML = "";
        selectedSquare = null;
        updateUI();
        updateBoardPieces();
    };

    createBoard();
});