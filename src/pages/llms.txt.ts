// src/pages/llms.txt.ts - llms.txt dynamique : presente le blog aux agents, ses pages cles et ses derniers billets, dans toutes les langues.
//
// Il n'existe QU'UN llms.txt par domaine, d'ou sa place a la racine de
// src/pages et non sous [...locale]. Il doit donc decrire le site dans toutes
// ses langues, sinon un agent conclut que la moitie du site n'existe pas. Le
// fichier lui-meme reste redige en anglais, langue de travail des agents, mais
// il liste et nomme les URLs de chaque langue.
import siteData from "@config/siteData.json";
import { localeMeta, localizePath, locales } from "@i18n";
import { entrySlug } from "@i18n/content";
import { getResolvedPosts, getSortedTopics } from "@js/posts";
import type { APIRoute } from "astro";

export const GET: APIRoute = async ({ site, url }) => {
  const base = site ?? url;
  const absolute = (path: string): string => new URL(path, base).href;

  // Ce site n'a qu'une langue : la phrase "published in N languages" du theme
  // d'origine ne garde son sens que s'il en a plusieurs.
  const languages =
    locales.length === 1
      ? `This site is written in ${localeMeta[locales[0]].label} (Traditional Chinese).`
      : `This site is published in ${locales.length} languages: ` +
        locales
          .map((locale) => `${localeMeta[locale].label} (${absolute(localizePath("/", locale))})`)
          .join(", ") +
        ". Every page listed below exists in each of them.";

  const lines = [
    `# ${siteData.name} (${siteData.alternateName})`,
    "",
    `> ${siteData.description}`,
    "",
    languages,
    "",
  ];

  // Seulement les pages que ce site construit vraiment : pas de page auteurs,
  // un lien mort ici enverrait un agent sur une 404.
  const core: [string, string][] = [
    ["/", "the home page: the featured post, the latest notes and the topics"],
    ["/blog/", "every published post, newest first, paginated nine to a page"],
    ["/topics/", "the topic index; each topic has its own paginated archive"],
    ["/about/", "who writes here (Hailey) and why this blog exists"],
  ];

  for (const locale of locales) {
    lines.push(`## Core pages (${localeMeta[locale].label})`, "");
    for (const [path, note] of core) {
      lines.push(`- ${absolute(localizePath(path, locale))}: ${note}`);
    }
    lines.push("");
  }

  for (const locale of locales) {
    const topics = await getSortedTopics(locale);
    if (topics.length === 0) continue;
    lines.push(`## Topics (${localeMeta[locale].label})`, "");
    for (const topic of topics) {
      const href = absolute(localizePath(`/topics/${entrySlug(topic.id)}/`, locale));
      lines.push(`- [${topic.data.name}](${href}): ${topic.data.description}`);
    }
    lines.push("");
  }

  for (const locale of locales) {
    // Les brouillons sont deja ecartes par getResolvedPosts : un billet non
    // publie ne doit pas fuiter par le fichier destine aux agents.
    const posts = (await getResolvedPosts(locale)).slice(0, 10);
    if (posts.length === 0) continue;
    lines.push(`## Latest posts (${localeMeta[locale].label})`, "");
    for (const { post, slug } of posts) {
      const href = absolute(localizePath(`/blog/${slug}/`, locale));
      lines.push(`- [${post.data.title}](${href}): ${post.data.description}`);
    }
    lines.push("");
  }

  lines.push(
    "## Machine-readable",
    "",
    `- [Sitemap](${absolute("/sitemap-index.xml")}): every indexable URL on this site`,
    "",
  );

  return new Response(lines.join("\n"), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
};
