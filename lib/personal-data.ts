import { text, type Localized } from "./portfolio-data";

export const personalStory: {
  title: Localized;
  introduction: Localized;
  practice: Localized;
  beyond: Localized;
  curiosity: Localized;
} = {
  title: text("DÉVELOPPEUR FULL-STACK. TOUJOURS CURIEUX.", "FULL-STACK DEVELOPER. ALWAYS CURIOUS."),
  introduction: text(
    "Je suis Hassan, développeur Full-Stack à Rennes. J’ai un Bac+5 en ingénierie informatique et plus de trois ans d’expérience professionnelle, principalement dans les logiciels de santé.",
    "I’m Hassan, a Full-Stack Developer based in Rennes. I have a Master’s level degree in computer engineering and over three years of professional experience, mainly in healthcare software.",
  ),
  practice: text(
    "J’aime comprendre une application dans son ensemble : l’architecture, les API, les interfaces et les détails qui rendent un parcours agréable à utiliser. Le web, l’UI/UX, les produits numériques et les nouvelles technologies nourrissent cette curiosité.",
    "I like understanding an application as a whole: its architecture, APIs, interfaces and the details that make it pleasant to use. Web development, UI/UX, digital products and new technology keep me curious.",
  ),
  beyond: text(
    "L’audio occupe aussi une place importante pour moi : beatmaking, enregistrement, mixage et mastering. Je participe à 808BLOOM, à la fois autour du site, du studio et des événements du collectif.",
    "Audio is another big part of my life: beatmaking, recording, mixing and mastering. I’m involved with 808BLOOM through its website, studio and collective events.",
  ),
  curiosity: text(
    "En dehors de l’écran, je m’intéresse au sport, à l’histoire et à la géopolitique. J’aime continuer à apprendre et à expérimenter.",
    "Away from the screen, I’m interested in sport, history and geopolitics. I like to keep learning and experimenting.",
  ),
};

export const creativeLabCopy = {
  title: text("DES IDÉES À MANIPULER.", "IDEAS YOU CAN MOVE."),
  introduction: text(
    "Deux petites expériences interactives. Le signal explore le rythme ; la typographie explore la forme. Elles utilisent le même vocabulaire visuel que le portfolio.",
    "Two small interactive experiments. The signal explores rhythm; the typography explores form. Both use the same visual language as the portfolio.",
  ),
  background: text(
    "Le champ visuel derrière ces expériences prolonge le moteur Three.js et les shaders du site.",
    "The visual field behind these experiments extends the site’s existing Three.js and shader system.",
  ),
};

export const contactStory = {
  title: text("CONSTRUISONS LA SUITE.", "LET’S BUILD WHAT’S NEXT."),
  introduction: text(
    "Je suis basé à Rennes et mobile en Bretagne, à Nantes et à Paris. Si mon profil correspond à votre projet ou à votre équipe, échangeons.",
    "I’m based in Rennes and open to opportunities across Brittany, Nantes and Paris. If my experience fits your team or project, let’s talk.",
  ),
};
