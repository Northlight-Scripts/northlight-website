const translations = {
  de: {
    navAbout: "Über uns", navProjects: "Projekte", navJoin: "Mitmachen", navNewsletter: "Newsletter", navContact: "Kontakt",
    heroEyebrow: "Indie Film & Animation Studio", heroSubtitle: "Ein Indie-Animationsstudio für cineastische Geschichten, Trailer und digitale Welten.", heroBtnProjects: "Trailer-Projekt ansehen", heroBtnJoin: "Mitmachen", scrollHint: "Scroll",
    aboutEyebrow: "Über uns", aboutTitle: "Wir erzählen Geschichten wie ein Filmstudio – nur unabhängig.", aboutText: "Northlight Animation Studios ist ein junges Indie-Studio mit Fokus auf cineastische Animation, Storytelling, Sound und digitale Welten. Unser Ziel ist es, Projekte zu erschaffen, die sich hochwertig, emotional und wiedererkennbar anfühlen.",
    projectsEyebrow: "Aktuelles Projekt", projectsTitle: "Official Trailer Project", projectStatus: "In Produktion", projectCardTitle: "Cinematic Minecraft Animation", projectCardText: "Ein offizieller Trailer mit Studio-Intro, Voice Acting, Soundtrack, Behind-the-Scenes-Inhalten und einer starken visuellen Identität.",
    servicesEyebrow: "Unsere Arbeit", servicesTitle: "Von der ersten Idee bis zur finalen Szene.", serviceAnimation: "Cinematische Szenen, Charaktere und digitale Welten.", serviceStory: "Geschichten mit Stimmung, Spannung und Wiedererkennung.", serviceSound: "Musik, Effekte und Stimmen für einen starken Eindruck.", serviceCommunity: "Zusammenarbeit mit kreativen Menschen aus verschiedenen Bereichen.",
    joinEyebrow: "Join Northlight", joinTitle: "Du willst Teil zukünftiger Projekte werden?", joinText: "Wir suchen immer wieder Sprecher, Animatoren, Cutter, Musiker und kreative Menschen, die Lust auf starke Indie-Projekte haben.", joinButton: "Jetzt mitmachen",
    newsletterEyebrow: "Newsletter", newsletterTitle: "Updates direkt bekommen.", newsletterText: "Erhalte Projekt-Updates, Release-Infos und Behind-the-Scenes-Neuigkeiten von Northlight.", newsletterButton: "Eintragen", newsletterNote: "Hinweis: Das Formular öffnet aktuell Linktree. Später kann es mit Brevo, Mailchimp oder Cloudflare Workers verbunden werden.",
    contactEyebrow: "Kontakt", contactTitle: "Business & Zusammenarbeit", footerText: "Alle Rechte vorbehalten.", mailCopied: "E-Mail wurde kopiert."
  },
  en: {
    navAbout: "About", navProjects: "Projects", navJoin: "Join", navNewsletter: "Newsletter", navContact: "Contact",
    heroEyebrow: "Indie Film & Animation Studio", heroSubtitle: "An independent animation studio creating cinematic stories, trailers and digital worlds.", heroBtnProjects: "View trailer project", heroBtnJoin: "Join us", scrollHint: "Scroll",
    aboutEyebrow: "About", aboutTitle: "We tell stories like a film studio – independently.", aboutText: "Northlight Animation Studios is a young indie studio focused on cinematic animation, storytelling, sound and digital worlds. Our goal is to create projects that feel premium, emotional and recognizable.",
    projectsEyebrow: "Current project", projectsTitle: "Official Trailer Project", projectStatus: "In production", projectCardTitle: "Cinematic Minecraft Animation", projectCardText: "An official trailer with a studio intro, voice acting, soundtrack, behind-the-scenes content and a strong visual identity.",
    servicesEyebrow: "Our work", servicesTitle: "From first idea to final scene.", serviceAnimation: "Cinematic scenes, characters and digital worlds.", serviceStory: "Stories with atmosphere, tension and a recognizable identity.", serviceSound: "Music, effects and voices for a powerful impression.", serviceCommunity: "Collaboration with creative people from different fields.",
    joinEyebrow: "Join Northlight", joinTitle: "Do you want to be part of future projects?", joinText: "We are always looking for voice actors, animators, editors, musicians and creative people who want to work on strong indie projects.", joinButton: "Join now",
    newsletterEyebrow: "Newsletter", newsletterTitle: "Get updates directly.", newsletterText: "Receive project updates, release news and behind-the-scenes information from Northlight.", newsletterButton: "Subscribe", newsletterNote: "Note: The form currently opens Linktree. Later it can be connected to Brevo, Mailchimp or Cloudflare Workers.",
    contactEyebrow: "Contact", contactTitle: "Business & collaboration", footerText: "All rights reserved.", mailCopied: "Email address copied."
  }
};

const languageToggle = document.getElementById("languageToggle");
let currentLanguage = localStorage.getItem("northlightLanguage") || "de";

function applyLanguage(language) {
  document.documentElement.lang = language;
  document.querySelectorAll("[data-i18n]").forEach((element) => {
    const key = element.getAttribute("data-i18n");
    if (translations[language][key]) element.textContent = translations[language][key];
  });
  languageToggle.textContent = language === "de" ? "DE / EN" : "EN / DE";
  localStorage.setItem("northlightLanguage", language);
}

languageToggle.addEventListener("click", () => {
  currentLanguage = currentLanguage === "de" ? "en" : "de";
  applyLanguage(currentLanguage);
});

applyLanguage(currentLanguage);
document.getElementById("year").textContent = new Date().getFullYear();

const copyMailButton = document.querySelector(".copy-mail");
const copyStatus = document.getElementById("copyStatus");
copyMailButton.addEventListener("click", async () => {
  const mail = copyMailButton.dataset.copy;
  try {
    await navigator.clipboard.writeText(mail);
    copyStatus.textContent = translations[currentLanguage].mailCopied;
  } catch (error) {
    copyStatus.textContent = mail;
  }
  setTimeout(() => { copyStatus.textContent = ""; }, 3000);
});

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) entry.target.classList.add("visible");
  });
}, { threshold: 0.15 });

document.querySelectorAll(".reveal").forEach((element) => observer.observe(element));
