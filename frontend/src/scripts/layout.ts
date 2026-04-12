const initLayout = (): void => {
  const loginBtn = document.querySelector("#loginBtnLayout");
  const settingsBtn = document.querySelector("#settingsBtnLayout");
  const historyBtn = document.querySelector("#historyBtnLayout");

  loginBtn?.addEventListener("click", () => {
    window.dispatchEvent(new CustomEvent('open-login'));
  });

  settingsBtn?.addEventListener("click", () => {
    window.dispatchEvent(new CustomEvent('open-settings'));
  });

  historyBtn?.addEventListener("click", () => {
    window.dispatchEvent(new CustomEvent('open-history'));
  });
};

document.addEventListener('astro:page-load', initLayout);
initLayout();