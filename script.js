const GOOGLE_SCRIPT_URL = "DEINE_GOOGLE_SCRIPT_WEB_APP_URL_HIER_EINFÜGEN";

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

    if (status) {
      status.textContent = "E-Mail wurde kopiert.";

      setTimeout(() => {
        status.textContent = "";
      }, 2500);
    }
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

      setTimeout(() => {
        newsletterStatus.textContent = "";
      }, 5000);
    } catch (error) {
      newsletterStatus.textContent = "Fehler. Bitte später erneut versuchen.";
    }
  });
}

const cookieBanner = document.getElementById("cookieBanner");

if (cookieBanner && !localStorage.getItem("northlightCookies")) {
  cookieBanner.style.display = "flex";
}

function acceptCookies(type) {
  localStorage.setItem("northlightCookies", type);

  if (cookieBanner) {
    cookieBanner.style.display = "none";
  }
}
