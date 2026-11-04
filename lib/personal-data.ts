import { text, type Localized } from "./portfolio-data";

export const personalStory: {
  title: Localized;

  introduction: Localized;

  practice: Localized;

  beyond: Localized;

  curiosity: Localized;
} = {
  title: text(
    "DÉVELOPPEUR FULL-STACK. TOUJOURS CURIEUX.",
    "FULL-STACK DEVELOPER. ALWAYS CURIOUS.",
  ),

  introduction: text(
    "Je suis Hassan, développeur Full-Stack à Rennes. Je suis diplômé de l’EPSI (Bac+5 en ingénierie informatique) et j’ai plus de trois ans d’expérience professionnelle, principalement dans les logiciels de santé.",

    "I’m Hassan, a Full-Stack Developer based in Rennes. I hold a Master’s level degree in computer engineering from EPSI and have over three years of professional experience, mainly in healthcare software.",
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
