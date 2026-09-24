// src/i18n/config.ts - la liste des langues du site. Ajouter une langue commence ici, et seulement ici.
//
// Ce fork ne sert qu'une langue, le chinois traditionnel. L'architecture
// bilingue d'origine reste en place (une seule langue est un cas particulier
// de plusieurs) parce qu'elle ne coute rien de plus une fois degeneree a un
// seul element : aucune des cinquante et quelques pages qui appellent
// getLocale/useTranslations/localizePath n'a besoin d'etre modifiee. Pour
// ajouter une langue il faut exactement deux gestes :
//   1. ajouter le code ci-dessous dans `locales` et sa fiche dans `localeMeta` ;
//   2. creer le dossier src/i18n/ui/<code>/ en copiant src/i18n/ui/zh/
//      (TypeScript refusera de compiler tant qu'une seule cle manque : c'est le
//      filet de securite).
//
// Les segments d'URL, eux, ne se traduisent pas : /blog/, /topics/ et /authors/
// sont ecrits une seule fois dans src/config/navData.json.ts, et localizePath
// se contente de leur ajouter le prefixe de langue.
//
// Aucune page n'est a dupliquer : les routes vivent sous src/pages/[...locale]/
// et se generent pour chaque langue de cette liste.

/** Les langues servies par le site. La premiere est la langue par defaut. */
export const locales = ["zh"] as const;

export type Locale = (typeof locales)[number];

/** La langue servie a la racine du domaine, sans prefixe d'URL. */
export const defaultLocale: Locale = "zh";

export interface LocaleMeta {
  /** Le nom de la langue ECRIT DANS CETTE LANGUE. Jamais traduit : un
   *  francophone perdu sur la version anglaise cherche "Francais", pas "French". */
  label: string;
  /** Code BCP-47 complet, pour <html lang> et les balises hreflang. */
  htmlLang: string;
  /** Sens d'ecriture. Prevu des maintenant pour que l'ajout d'une langue RTL
   *  (arabe, hebreu) ne demande pas de rouvrir les layouts. */
  dir: "ltr" | "rtl";
  /** Locale de formatage des dates et des nombres (Intl). */
  intl: string;
  /** Drapeau ? Non. Un drapeau designe un pays, pas une langue : le francais
   *  n'est pas la propriete de la France. Deux lettres, c'est plus honnete et
   *  ca ne casse pas sur les polices systeme. */
  short: string;
}

export const localeMeta: Record<Locale, LocaleMeta> = {
  zh: { label: "繁體中文", htmlLang: "zh-Hant", dir: "ltr", intl: "zh-TW", short: "中" },
};

/** Vrai si la chaine est bien une langue du site. Utilise pour valider ce qui
 *  vient de l'URL, donc de l'exterieur : on ne fait jamais confiance a un
 *  segment d'URL pour indexer un dictionnaire. */
export function isLocale(value: unknown): value is Locale {
  return typeof value === "string" && (locales as readonly string[]).includes(value);
}
