const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbySlXJp6C1cW20kWY_jqHFlLKvkP95368uwUPo1BQ1VNSvfAsgW_HVftOX2kL7pHv-U/exec";

const langBtn = document.getElementById("langBtn");
let currentLang = localStorage.getItem("northlightLang") || "de";

function setLanguage(lang) {
  currentLang = lang;
  localStorage.setItem("northlightLang", lang);

  document.querySelectorAll("[data-de]").forEach((el) => {
    el.textContent = el.dataset[lang];
  });

  if (langBtn) {
    langBtn.textContent = lang === "de" ? "DE / EN" : "EN / DE";
  }
}

if (langBtn) {
  langBtn.addEventListener("click", () => {
    setLanguage(currentLang === "de" ? "en" : "de");
  });
  setLanguage(currentLang);
}

function copyMail() {
  navigator.clipboard.writeText("contact@northlightanimation.com").then(() => {
    const status = document.getElementById("copyStatus");
    if (status) status.textContent = "E-Mail wurde kopiert.";
  });
}

const newsletterForm = document.getElementById("newsletterForm");
const newsletterStatus = document.getElementById("newsletterStatus");

if (newsletterForm) {
  newsletterForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("emailInput").value.trim();

    if (!email) return;

    newsletterStatus.textContent = "Wird gespeichert...";

    try {
      await fetch(GOOGLE_SCRIPT_URL, {
        method: "POST",
        mode: "no-cors",
        body: JSON.stringify({
          email: email,
          source: "Northlight Website",
          date: new Date().toISOString()
        })
      });

      newsletterStatus.textContent = "Danke! Du wurdest eingetragen.";
      newsletterForm.reset();
    } catch (error) {
      newsletterStatus.textContent = "Fehler. Bitte später erneut versuchen.";
    }
  });
}

const cookieBanner = document.getElementById("cookieBanner");

if (!localStorage.getItem("northlightCookies")) {
  cookieBanner.style.display = "flex";
}

function acceptCookies(type) {
  localStorage.setItem("northlightCookies", type);
  cookieBanner.style.display = "none";
}
