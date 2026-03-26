// @ts-nocheck
const initRegister = () => {
  // USAMOS EL ID EXACTO DEL HTML: registerForm
  const registerForm = document.getElementById("registerForm");
  
  if (!registerForm) {
    if (window.location.pathname.includes('register')) setTimeout(initRegister, 50);
    return;
  }

  registerForm.onsubmit = (e) => {
    e.preventDefault();
    e.stopImmediatePropagation();

    const nameInput = document.getElementById("registerUsername") as HTMLInputElement;
    const emailInput = document.getElementById("registerEmail") as HTMLInputElement;

    const user = {
      name: nameInput?.value || "NUEVO MAESTRO",
      email: emailInput?.value || "nuevo@chess.com",
      avatar: "/avatars/w_pawn_avatar.png"
    };

    const stats = {
      rating: 1200, totalGames: 0, wins: 0, losses: 0, draws: 0, puzzlesSolved: 0, puzzlesFailed: 0
    };

    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("stats", JSON.stringify(stats));

    window.location.assign("/profile");
  };
};

document.addEventListener('astro:page-load', initRegister);
if (document.readyState !== 'loading') initRegister();