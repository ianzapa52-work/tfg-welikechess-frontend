// @ts-nocheck
const initLogin = () => {
  // USAMOS EL ID EXACTO DEL HTML: loginForm
  const loginForm = document.getElementById("loginForm");
  
  if (!loginForm) {
    if (window.location.pathname.includes('login')) setTimeout(initLogin, 50);
    return;
  }

  loginForm.onsubmit = (e) => {
    e.preventDefault();
    e.stopImmediatePropagation();

    const emailInput = document.getElementById("loginEmail") as HTMLInputElement;
    const email = emailInput?.value || "user@chess.com";

    const user = {
      name: email.split('@')[0].toUpperCase(),
      email: email,
      avatar: "/avatars/w_king_avatar.png"
    };

    const stats = {
      rating: 1200, totalGames: 0, wins: 0, losses: 0, draws: 0, puzzlesSolved: 0, puzzlesFailed: 0
    };

    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("stats", JSON.stringify(stats));

    window.location.assign("/profile"); 
  };
};

document.addEventListener('astro:page-load', initLogin);
if (document.readyState !== 'loading') initLogin();