// @ts-nocheck

const initSettings = () => {
  const saveBtn = document.getElementById("save-settings-btn");
  
  if (!saveBtn) {
    if (window.location.pathname.includes('settings')) setTimeout(initSettings, 50);
    return;
  }

  const themeSelect = document.getElementById("theme-select") as HTMLSelectElement | null;
  const volumeSlider = document.getElementById("volume-general") as HTMLInputElement | null;
  const volumeBadge = document.getElementById("val-general");

  // 1. Cargar valores guardados en los inputs al entrar a la página
  const currentTheme = localStorage.getItem("theme") || "dark";
  if (themeSelect) themeSelect.value = currentTheme;
  
  if (volumeSlider) {
    const vol = localStorage.getItem("volume") || "70";
    volumeSlider.value = vol;
    if (volumeBadge) volumeBadge.textContent = `${vol}%`;
  }

  // 2. Feedback visual del slider (solo cambia el numerito)
  volumeSlider?.addEventListener("input", (e) => {
    const val = (e.target as HTMLInputElement).value;
    if (volumeBadge) volumeBadge.textContent = `${val}%`;
  });

  // 3. LÓGICA DE GUARDADO E INSTANTANEIDAD
  saveBtn.onclick = (e) => {
    e.preventDefault();

    if (themeSelect) {
      const theme = themeSelect.value;
      
      // GUARDAR PREFERENCIA
      localStorage.setItem("theme", theme);

      // --- CAMBIO DE FONDO INSTANTÁNEO ---
      // Como en tu CSS usas ":root.dark-mode", atacamos al documentElement
      if (theme === "dark") {
        document.documentElement.classList.add("dark-mode");
        // Por si acaso también usamos la clase estándar de Tailwind
        document.documentElement.classList.add("dark"); 
      } else {
        document.documentElement.classList.remove("dark-mode");
        document.documentElement.classList.remove("dark");
      }

      // Aplicar al body por compatibilidad con otros estilos
      document.body.className = theme === "dark" ? "dark-mode" : "light-mode";
      
      console.log(`Textura cambiada a: ${theme === "dark" ? "Madera" : "Mármol"}`);
    }

    if (volumeSlider) {
      localStorage.setItem("volume", volumeSlider.value);
    }

    // Feedback visual en el botón
    const originalText = saveBtn.textContent;
    saveBtn.textContent = "✅ AJUSTES APLICADOS";
    saveBtn.style.backgroundColor = "#22c55e"; // Verde éxito momentáneo
    
    setTimeout(() => { 
      saveBtn.textContent = originalText;
      saveBtn.style.backgroundColor = ""; 
    }, 1500);
  };
};

// Iniciar con Astro
document.addEventListener('astro:page-load', initSettings);
if (document.readyState !== 'loading') initSettings();