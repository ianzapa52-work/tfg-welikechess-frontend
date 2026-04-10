import { Chess, type Square } from "chess.js";

window.addEventListener("load", () => {
    const boardEl = document.getElementById("board") as HTMLElement;
    const feedbackEl = document.getElementById("puzzle-feedback") as HTMLElement;
    const objectiveEl = document.getElementById("puzzleObjective") as HTMLElement;
    const nextBtn = document.getElementById("nextPuzzle") as HTMLButtonElement;
    
    if (!boardEl) return;

    const game = new Chess();
    let currentIndex = 0;
    let selectedSquare: Square | null = null;
    let draggedPiece: HTMLElement | null = null; 

    const puzzles = [
        { id: "p1", fen: "4kb1r/p2n1ppp/4q3/4p3/3P4/8/PP1P1PPP/RNB1KBNR w KQk - 0 1", solution: "d4e5", objective: "Blancas ganan material" },
        { id: "p2", fen: "r1bqkb1r/pppp1ppp/2n2n2/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 4 4", solution: "f3e5", objective: "Ataque táctico" },
        { id: "p3", fen: "6k1/pp3p1p/6p1/8/8/1P6/P1P2PPP/3R2K1 w - - 0 1", solution: "d1d8", objective: "Mate en 1" }
    ];

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
            const row = Math.floor(i / 8);
            const col = i % 8;
            const piece = state[row][col];
            const coord = squareEl.dataset.coord as Square;
            
            squareEl.classList.remove("selected", "legal-move");

            let img = squareEl.querySelector("img");
            if (piece) {
                if (!img) {
                    img = document.createElement("img");
                    img.className = "piece";
                    squareEl.appendChild(img);
                }
                const pieceMap: Record<string, string> = { p: "pawn", r: "rook", n: "horse", b: "bishop", q: "queen", k: "king" };
                img.src = `/pieces/${piece.color}_${pieceMap[piece.type]}.svg`;
                img.style.opacity = "1"; 

                img.onmousedown = (e) => {
                    if (piece.color !== game.turn()) return;
                    e.preventDefault();
                    
                    selectedSquare = coord;
                    const originalPiece = img as HTMLElement;

                    originalPiece.style.opacity = "0.4";

                    draggedPiece = originalPiece.cloneNode(true) as HTMLElement;
                    draggedPiece.classList.add("dragging-active");
                    draggedPiece.style.opacity = "1"; 
                    
                    document.body.appendChild(draggedPiece);
                    document.body.classList.add("is-dragging");
                    
                    movePieceAt(e.pageX, e.pageY);
                    highlightLegalMoves(coord);

                    boardEl.querySelectorAll(".square").forEach(s => s.classList.remove("selected"));
                };
            } else if (img) img.remove();
        });
    }

    document.onmousemove = (e) => {
        if (draggedPiece) movePieceAt(e.pageX, e.pageY);
    };

    // AQUÍ ESTÁ LA CORRECCIÓN LITERAL COMO EN PLAY-LOCAL
    document.onmouseup = (e) => {
        if (!draggedPiece || !selectedSquare) return;

        const from = selectedSquare;
        draggedPiece.remove();
        draggedPiece = null;
        document.body.classList.remove("is-dragging");

        // Limpiar los puntos de movimientos legales inmediatamente al soltar
        boardEl.querySelectorAll(".square").forEach(s => s.classList.remove("legal-move"));

        const elementBelow = document.elementFromPoint(e.clientX, e.clientY);
        const squareBelow = elementBelow?.closest(".square") as HTMLElement;
        const to = squareBelow?.dataset.coord as Square;

        if (to && from !== to) {
            executePuzzleMove(from, to);
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

    function handleSquareClick(coord: Square) {
        const piece = game.get(coord);
        
        if (selectedSquare === coord) {
            selectedSquare = null;
            boardEl.querySelectorAll(".square").forEach(s => s.classList.remove("selected", "legal-move"));
            return;
        }

        if (piece && piece.color === game.turn()) {
            selectedSquare = coord;
            boardEl.querySelectorAll(".square").forEach(s => s.classList.remove("selected", "legal-move"));
            highlightLegalMoves(coord);
            return;
        }

        if (selectedSquare) {
            // Limpiar puntos antes de ejecutar movimiento por click
            boardEl.querySelectorAll(".square").forEach(s => s.classList.remove("legal-move"));
            executePuzzleMove(selectedSquare, coord);
        }
    }

    function highlightLegalMoves(square: Square) {
        boardEl.querySelectorAll(".square").forEach(s => s.classList.remove("legal-move"));
        const moves = game.moves({ square, verbose: true });
        moves.forEach(m => {
            boardEl.querySelector(`[data-coord="${m.to}"]`)?.classList.add("legal-move");
        });
    }

    function executePuzzleMove(from: Square, to: Square) {
        const puzzle = puzzles[currentIndex];
        selectedSquare = null;

        try {
            const tempGame = new Chess(game.fen());
            const move = tempGame.move({ from, to, promotion: "q" });

            if (move) {
                if ((from + to) === puzzle.solution) {
                    game.move({ from, to, promotion: "q" });
                    feedbackEl.textContent = "¡CORRECTO!";
                    feedbackEl.style.color = "#2ecc71";
                    updateBoardPieces();
                    flashSquare(to, "success-flash", 2000);
                    
                    const solvedCountEl = document.getElementById("solved-count");
                    if (solvedCountEl) {
                        const currentScore = parseInt(solvedCountEl.textContent || "0");
                        solvedCountEl.textContent = (currentScore + 1).toString();
                    }
                    window.dispatchEvent(new CustomEvent('puzzle-solved', { detail: "¡Movimiento Maestro!" }));
                } else {
                    game.move({ from, to, promotion: "q" });
                    updateBoardPieces();
                    feedbackEl.textContent = "INTÉNTALO DE NUEVO";
                    feedbackEl.style.color = "#ec2914";
                    flashSquare(to, "error-flash", 1000); 
                    setTimeout(() => {
                        game.undo();
                        updateBoardPieces();
                        feedbackEl.textContent = "TU TURNO";
                        feedbackEl.style.color = "white";
                    }, 1000); 
                }
            } else {
                updateBoardPieces();
            }
        } catch (e) {
            updateBoardPieces();
        }
    }

    function flashSquare(coord: string, className: string, ms: number) {
        const sq = boardEl.querySelector(`[data-coord="${coord}"]`);
        sq?.classList.add(className);
        setTimeout(() => sq?.classList.remove(className), ms);
    }

    function loadPuzzle(idx: number) {
        currentIndex = idx;
        selectedSquare = null;
        game.load(puzzles[idx].fen);
        objectiveEl.textContent = puzzles[idx].objective;
        feedbackEl.textContent = "TU TURNO";
        feedbackEl.style.color = "white";
        updateBoardPieces();
    }

    createBoard();
    loadPuzzle(0);
    nextBtn.onclick = () => loadPuzzle((currentIndex + 1) % puzzles.length);
});