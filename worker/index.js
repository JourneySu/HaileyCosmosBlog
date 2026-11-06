// worker/index.js - le Worker du site : sert dist/ tel quel et n'ajoute qu'une route dynamique, POST /api/subscribe (inscription Buttondown).
//
// POURQUOI UN WORKER ET PAS UN ADAPTER ASTRO
// Le site reste 100 % statique (docs/conventions/astro.md : pas d'adapter). Les
// fichiers de dist/ sont servis directement par Cloudflare, sans passer par ce
// script : il n'est appele que pour une adresse qui n'existe pas dans dist/,
// et la seule qu'il traite lui-meme est /api/subscribe. Tout le reste repart
// vers les fichiers statiques, inchange.
//
// POURQUOI UN INTERMEDIAIRE
// La cle d'API Buttondown ne doit jamais atteindre le navigateur. Elle vit dans
// un secret Cloudflare (BUTTONDOWN_API_KEY, tableau de bord > Worker >
// Parametres > Variables et secrets), jamais dans le depot. En local, elle se
// pose dans .dev.vars, ignore par git.
//
// CE QUE RENVOIE LA ROUTE
// Toujours { ok, code }, jamais le detail d'une erreur : le detail part dans les
// journaux du Worker (Observability), pas chez le visiteur. Les codes, lus par
// src/components/Sections/Global/_newsletter.ts :
//   success  inscription acceptee, l'e-mail de confirmation part (double opt-in)
//   already  adresse deja connue de Buttondown
//   invalid  adresse mal formee
//   limited  trop d'envois depuis la meme IP, ou limite de Buttondown atteinte
//   failed   tout le reste : le message propose la page d'inscription Buttondown

const BUTTONDOWN_URL = "https://api.buttondown.com/v1/subscribers";

// Assez strict pour refuser une faute de frappe, assez large pour ne jamais
// refuser une vraie adresse : la vraie verification, c'est l'e-mail de
// confirmation.
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === "/api/subscribe") {
      if (request.method !== "POST") return reply({ ok: false, code: "failed" }, 405, { Allow: "POST" });
      return subscribe(request, env);
    }
    return env.ASSETS.fetch(request);
  },
};

async function subscribe(request, env) {
  let form;
  try {
    form = await request.formData();
  } catch {
    return reply({ ok: false, code: "invalid" }, 400);
  }

  // Champ piege : invisible pour un humain, rempli par les robots qui
  // remplissent tout. On repond "succes" sans rien envoyer, pour que le robot
  // n'apprenne pas qu'il a ete repere.
  if (String(form.get("website") ?? "").trim() !== "") {
    return reply({ ok: true, code: "success" });
  }

  const email = String(form.get("email") ?? "").trim();
  if (email.length > 254 || !EMAIL_RE.test(email)) {
    return reply({ ok: false, code: "invalid" }, 400);
  }

  // Limite par IP (wrangler.jsonc, SUBSCRIBE_LIMITER) : genereuse, une IP peut
  // etre partagee par toute une ecole ou tout un reseau mobile. Si la liaison
  // est absente, on passe : la limite protege, elle ne doit jamais casser
  // l'inscription.
  const ip = request.headers.get("CF-Connecting-IP") ?? "";
  if (env.SUBSCRIBE_LIMITER && ip) {
    const { success } = await env.SUBSCRIBE_LIMITER.limit({ key: ip });
    if (!success) return reply({ ok: false, code: "limited" }, 429);
  }

  if (!env.BUTTONDOWN_API_KEY) {
    console.error("subscribe: secret BUTTONDOWN_API_KEY absent");
    return reply({ ok: false, code: "failed" }, 500);
  }

  let res;
  try {
    res = await fetch(BUTTONDOWN_URL, {
      method: "POST",
      headers: {
        Authorization: `Token ${env.BUTTONDOWN_API_KEY}`,
        "Content-Type": "application/json",
      },
      // Pas de `type` : Buttondown cree alors un abonne "unactivated" et
      // envoie l'e-mail de confirmation. L'IP du visiteur nourrit son pare-feu.
      body: JSON.stringify(ip ? { email_address: email, ip_address: ip } : { email_address: email }),
    });
  } catch (err) {
    console.error("subscribe: Buttondown injoignable", String(err));
    return reply({ ok: false, code: "failed" }, 502);
  }

  if (res.status === 201) return reply({ ok: true, code: "success" });

  // Le format exact des erreurs n'est pas documente : on journalise le statut
  // et le corps (tronque) pour pouvoir affiner, et on classe au mieux.
  const detail = await res.text().catch(() => "");
  console.error("subscribe: Buttondown a refuse", res.status, detail.slice(0, 500));

  if ((res.status === 400 || res.status === 409) && /already|exist/i.test(detail)) {
    return reply({ ok: true, code: "already" });
  }
  if (res.status === 429) return reply({ ok: false, code: "limited" }, 429);
  return reply({ ok: false, code: "failed" }, 502);
}

function reply(body, status = 200, headers = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store", ...headers },
  });
}
