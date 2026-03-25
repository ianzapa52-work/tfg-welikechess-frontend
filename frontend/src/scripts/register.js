// @ts-check

document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("#registerForm");
  const username = document.querySelector("#registerUsername");
  const email = document.querySelector("#registerEmail");
  const password = document.querySelector("#registerPassword");

  // Si falta algo, no hacemos nada
  if (!(form instanceof HTMLFormElement)) return;
  if (!(username instanceof HTMLInputElement)) return;
  if (!(email instanceof HTMLInputElement)) return;
  if (!(password instanceof HTMLInputElement)) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    // Crear usuario
    const user = {
      name: username.value,
      email: email.value,
      avatar: "/avatars/w_king_avatar.png"
    };

    localStorage.setItem("user", JSON.stringify(user));

    // Crear estadísticas iniciales
    const stats = {
      rating: 1200,
      wins: 0,
      losses: 0,
      draws: 0,
      totalGames: 0,
      puzzlesSolved: 0,
      puzzlesFailed: 0,
      createdAt: Date.now(),
      lastLogin: Date.now()
    };

    localStorage.setItem("stats", JSON.stringify(stats));

    // Redirigir al perfil
    window.location.href = "/profile";
  });
});
