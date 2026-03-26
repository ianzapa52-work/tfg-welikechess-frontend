// @ts-check

document.addEventListener("DOMContentLoaded", () => {
  // 1. Capturar elementos con casteo de tipos
  const saveBtn = document.getElementById("save-settings-btn");
  const themeSelect = /** @type {HTMLSelectElement | null} */ (document.getElementById("theme-select"));
  const volumeSlider = /** @type {HTMLInputElement | null} */ (document.getElementById("volume-general"));
  const volumeBadge = document.getElementById("val-general");

  // 2. Cargar valores iniciales desde localStorage
  const savedTheme = localStorage.getItem("theme") || "dark";
  const savedVolume = localStorage.getItem("volume") || "70";

  // Sincronizar UI al cargar
  if (themeSelect) themeSelect.value = savedTheme;
  if (volumeSlider) {
    volumeSlider.value = savedVolume;
    if (volumeBadge) volumeBadge.textContent = `${savedVolume}%`;
  }

  // 3. Actualizar el badge de volumen en tiempo real
  volumeSlider?.addEventListener("input", (e) => {
    const target = /** @type {HTMLInputElement} */ (e.target);
    if (volumeBadge) volumeBadge.textContent = `${target.value}%`;
  });

  // 4. Lógica del botón Guardar
  if (saveBtn) {
    saveBtn.addEventListener("click", () => {
      // Guardar y Aplicar Tema
      if (themeSelect) {
        const selectedTheme = themeSelect.value;
        localStorage.setItem("theme", selectedTheme);
        
        if (selectedTheme === "dark") {
          document.body.classList.add("dark-mode");
        } else {
          document.body.classList.remove("dark-mode");
        }
      }

      // Guardar Volumen
      if (volumeSlider) {
        localStorage.setItem("volume", volumeSlider.value);
      }

      alert("✅ Configuración guardada correctamente.");
    });
  }
});