// theme-engine.ts
const applyTheme = () => {
  const savedTheme = localStorage.getItem("theme") || "dark";
  
  // Usar documentElement (html) suele ser más limpio para selectores CSS
  if (savedTheme === "dark") {
    document.body.classList.add("dark-mode");
  } else {
    document.body.classList.remove("dark-mode");
  }
};

// Se ejecuta inmediatamente para evitar el parpadeo blanco
applyTheme();

// Y también al navegar con Astro
document.addEventListener('astro:after-swap', applyTheme);