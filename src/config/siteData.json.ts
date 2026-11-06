// src/config/siteData.json.ts - l'identite de la publication : nom, auteur, adresse, reseaux.
import type { SiteDataProps } from "./types/configDataTypes";

// Tout ce qui identifie la publication vit ici. C'est le premier fichier que
// l'utilisateur edite, et le seul a editer pour changer de marque.
const siteData: SiteDataProps = {
  name: "Hailey",
  description:
    "一個離開日復一日的迴圈後，重新尋找生命意義的地方。閱讀、思考、書寫，記錄我一步步療癒自己、找回生活重量的過程。",
  useViewTransitions: true,

  // Identite NEUTRE, regle du catalogue Astro : une demo ne porte ni nom
  // d'utilisateur reel, ni domaine que l'on ne possede pas. L'utilisateur met
  // les siens ici, et le pied de page suit.
  author: {
    name: "Hailey",
    email: "",
    twitter: "",
  },

  // Page d'inscription Buttondown : proposee au lecteur si l'envoi du
  // formulaire du site echoue. Elle a son propre CAPTCHA et marche toujours.
  newsletterPage: "https://buttondown.com/haileycosmos",

  defaultImage: {
    src: "/og/default.png",
    alt: "Hailey Cosmos: Outside the loop, one page at a time.",
  },
};

export default siteData;
