const translations = {
  de: {
    navAbout: "Über uns", navProjects: "Projekte", navJoin: "Mitmachen", navNewsletter: "Newsletter", navContact: "Kontakt",
    heroEyebrow: "Indie Animation Studio", heroSubtitle: "Ein Indie-Animationsstudio für cineastische Geschichten, Trailer und digitale Welten.", heroBtnProjects: "Projekt entdecken", heroBtnJoin: "Mitmachen",
    aboutEyebrow: "Über uns", aboutTitle: "Wir bauen atmosphärische Welten.", aboutText: "Northlight Animation Studios ist ein junges Indie-Studio mit Fokus auf cineastische Animation, Storytelling, Musik und digitale Welten. Unser Ziel ist es, Projekte zu erschaffen, die sich hochwertig, emotional und wiedererkennbar anfühlen.",
    projectsEyebrow: "Aktuelles Projekt", projectsTitle: "Official Trailer Project", projectCardTitle: "Cinematic Minecraft Animation", projectCardText: "Ein offizieller Trailer mit Studio-Intro, Voice Acting, Soundtrack, Behind-the-Scenes-Inhalten und einer starken visuellen Identität.",
    servicesEyebrow: "Unsere Arbeit", servicesTitle: "Von Idee bis Atmosphäre.", serviceAnimation: "Cinematische Szenen, Charaktere und digitale Welten.", serviceStory: "Geschichten mit Stimmung, Spannung und Wiedererkennung.", serviceSound: "Musik, Effekte und Stimmen für einen starken Eindruck.", serviceCommunity: "Zusammenarbeit mit kreativen Menschen aus verschiedenen Bereichen.",
    joinEyebrow: "Join Northlight", joinTitle: "Du willst Teil zukünftiger Projekte werden?", joinText: "Wir suchen immer wieder Sprecher, Animatoren, Cutter, Musiker und kreative Menschen, die Lust auf starke Indie-Projekte haben.", joinButton: "Jetzt bewerben",
    newsletterEyebrow: "Newsletter", newsletterTitle: "Updates direkt bekommen.", newsletterText: "Erhalte Projekt-Updates, Release-Infos und Behind-the-Scenes-Neuigkeiten von Northlight.", newsletterButton: "Eintragen", newsletterNote: "Hinweis: Verbinde dieses Formular später mit Google Forms, Brevo, Mailchimp oder Cloudflare Workers.",
    contactEyebrow: "Kontakt", contactTitle: "Business & Zusammenarbeit", footerText: "Alle Rechte vorbehalten."
  },
  en: {
    navAbout: "About", navProjects: "Projects", navJoin: "Join", navNewsletter: "Newsletter", navContact: "Contact",
    heroEyebrow: "Indie Animation Studio", heroSubtitle: "An independent animation studio creating cinematic stories, trailers and digital worlds.", heroBtnProjects: "Explore project", heroBtnJoin: "Join us",
    aboutEyebrow: "About", aboutTitle: "We build atmospheric worlds.", aboutText: "Northlight Animation Studios is a young indie studio focused on cinematic animation, storytelling, music and digital worlds. Our goal is to create projects that feel premium, emotional and recognizable.",
    projectsEyebrow: "Current project", projectsTitle: "Official Trailer Project", projectCardTitle: "Cinematic Minecraft Animation", projectCardText: "An official trailer with a studio intro, voice acting, soundtrack, behind-the-scenes content and a strong visual identity.",
    servicesEyebrow: "Our work", servicesTitle: "From idea to atmosphere.", serviceAnimation: "Cinematic scenes, characters and digital worlds.", serviceStory: "Stories with mood, tension and a recognizable identity.", serviceSound: "Music, effects and voices for a powerful impression.", serviceCommunity: "Collaboration with creative people from different fields.",
    joinEyebrow: "Join Northlight", joinTitle: "Do you want to be part of future projects?", joinText: "We are always looking for voice actors, animators, editors, musicians and creative people who want to work on strong indie projects.", joinButton: "Apply now",
    newsletterEyebrow: "Newsletter", newsletterTitle: "Get updates directly.", newsletterText: "Receive project updates, release news and behind-the-scenes information from Northlight.", newsletterButton: "Subscribe", newsletterNote: "Note: Connect this form later with Google Forms, Brevo, Mailchimp or Cloudflare Workers.",
    contactEyebrow: "Contact", contactTitle: "Business & collaboration", footerText: "All rights reserved."
  }
};

const languageToggle = document.getElementById("languageToggle");
const savedLanguage = localStorage.getItem("northlightLanguage") || "de";
let currentLanguage = savedLanguage;

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

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) entry.target.classList.add("visible");
  });
}, { threshold: 0.15 });

document.querySelectorAll(".reveal").forEach((element) => observer.observe(element));
