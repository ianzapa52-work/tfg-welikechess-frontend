// @ts-check

document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("#loginForm");
  const email = document.querySelector("#loginEmail");
  const password = document.querySelector("#loginPassword");

  // Si falta algo, no hacemos nada
  if (!(form instanceof HTMLFormElement)) return;
  if (!(email instanceof HTMLInputElement)) return;
  if (!(password instanceof HTMLInputElement)) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const user = {
      name: email.value.split("@")[0],
      email: email.value,
      avatar: "/avatars/w_king_avatar.png"
    };

    localStorage.setItem("user", JSON.stringify(user));

    window.location.href = "/profile";
  });
});
