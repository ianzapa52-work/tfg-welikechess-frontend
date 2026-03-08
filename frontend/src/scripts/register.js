// @ts-check

document.addEventListener("DOMContentLoaded", () => {
  /** @type {HTMLElement | null} */
  const kingIcon = document.querySelector("#kingIcon");

  /** @type {HTMLElement | null} */
  const registerCard = document.querySelector("#registerCard");

  // --- EFECTO DORADO SOLO EN EL REY ---
  if (kingIcon) {
    kingIcon.addEventListener("mouseenter", () => {
      kingIcon.classList.add("drop-shadow-[0_0_12px_gold]");
    });

    kingIcon.addEventListener("mouseleave", () => {
      kingIcon.classList.remove("drop-shadow-[0_0_12px_gold]");
    });

    // --- SALTO DEL REY ---
    kingIcon.addEventListener("click", () => {
      kingIcon.classList.add("king-bounce");

      setTimeout(() => {
        kingIcon.classList.remove("king-bounce");
      }, 600);
    });
  }

  // --- EFECTO DORADO SOLO EN LA TARJETA ---
  if (registerCard) {
    registerCard.addEventListener("mouseenter", () => {
      registerCard.classList.add("ring-2", "ring-yellow-400", "shadow-yellow-400");
    });

    registerCard.addEventListener("mouseleave", () => {
      registerCard.classList.remove("ring-2", "ring-yellow-400", "shadow-yellow-400");
    });
  }

  // --- VALIDACIÓN DEL FORMULARIO ---
  /** @type {HTMLFormElement | null} */
  const form = document.querySelector("#registerForm");

  /** @type {HTMLInputElement | null} */
  const name = document.querySelector("#name");

  /** @type {HTMLInputElement | null} */
  const email = document.querySelector("#email");

  /** @type {HTMLInputElement | null} */
  const password = document.querySelector("#password");

  /** @type {HTMLElement | null} */
  const nameError = document.querySelector("#nameError");

  /** @type {HTMLElement | null} */
  const emailError = document.querySelector("#emailError");

  /** @type {HTMLElement | null} */
  const passwordError = document.querySelector("#passwordError");

  // Si falta algo del formulario, no seguimos
  if (!form || !name || !email || !password || !nameError || !emailError || !passwordError) {
    console.warn("Faltan elementos del formulario en el DOM");
    return;
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    let valid = true;

    // Validación del nombre
    if (name.value.trim() === "") {
      nameError.classList.remove("hidden");
      valid = false;
    } else {
      nameError.classList.add("hidden");
    }

    // Validación del email
    if (!email.value.includes("@")) {
      emailError.classList.remove("hidden");
      valid = false;
    } else {
      emailError.classList.add("hidden");
    }

    // Validación de la contraseña
    if (password.value.trim() === "") {
      passwordError.classList.remove("hidden");
      valid = false;
    } else {
      passwordError.classList.add("hidden");
    }

    if (!valid) return;

    // Guardar usuario
    localStorage.setItem("user", JSON.stringify({
      name: name.value,
      email: email.value
    }));

    window.location.href = "/profile";
  });
});
