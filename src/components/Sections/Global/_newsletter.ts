// src/components/Sections/Global/_newsletter.ts - envoi des formulaires d'inscription sans quitter la page : POST /api/subscribe, puis le message dans la zone de statut.
//
// CYCLE DE VIE. Un seul ecouteur "submit" sur document, pose une fois, comme
// src/components/ui/_dialog.ts : le routeur client echange le contenu de la
// page mais garde document, donc l'ecouteur survit aux navigations sans rien
// re-brancher, et il sert tous les formulaires marques data-newsletter, ceux
// d'aujourd'hui (accueil, pied de page) comme ceux de demain.
//
// LE TEXTE NE VIT PAS ICI. Chaque formulaire porte ses messages en attributs
// data-msg-*, ecrits depuis le dictionnaire (src/i18n/ui/zh/reading.ts). Ce
// module ne fait que choisir lequel afficher.
//
// Les codes viennent de worker/index.js. Un code inconnu, une reponse illisible
// ou un refus du serveur tombent sur "failed", qui propose la page
// d'inscription Buttondown : un lecteur n'est jamais laisse sans issue.

type Code = "success" | "already" | "invalid" | "limited" | "failed" | "offline";

const KNOWN: readonly Code[] = ["success", "already", "invalid", "limited", "failed", "offline"];

let bound = false;

function show(form: HTMLFormElement, code: Code): void {
  const id = form.dataset.newsletterStatus;
  const status = id ? document.getElementById(id) : null;
  if (!status) return;

  const ok = code === "success" || code === "already";
  status.dataset.state = ok ? "ok" : "error";
  status.textContent = form.dataset[`msg${code[0].toUpperCase()}${code.slice(1)}`] ?? "";

  // Seul "failed" porte un lien : la page d'inscription de Buttondown, qui a
  // son propre CAPTCHA et marche quoi qu'il arrive a notre route.
  if (code === "failed" && form.dataset.fallbackUrl) {
    const link = document.createElement("a");
    link.href = form.dataset.fallbackUrl;
    link.textContent = form.dataset.fallbackLabel ?? form.dataset.fallbackUrl;
    link.className = "underline underline-offset-4";
    link.rel = "noopener";
    status.append(link, "。");
  }
}

async function send(form: HTMLFormElement): Promise<void> {
  if (form.dataset.newsletterBusy === "true") return;
  form.dataset.newsletterBusy = "true";

  const button = form.querySelector<HTMLButtonElement>('button[type="submit"]');
  const label = button?.textContent ?? "";
  if (button) {
    button.disabled = true;
    button.textContent = form.dataset.msgSending ?? label;
  }

  let code: Code = "failed";
  try {
    const res = await fetch(form.action, { method: "POST", body: new FormData(form) });
    const data: unknown = await res.json().catch(() => null);
    const raw = data && typeof data === "object" && "code" in data ? (data as { code: unknown }).code : null;
    code = KNOWN.includes(raw as Code) ? (raw as Code) : "failed";
  } catch {
    // fetch ne rejette que sans reseau : pas de reponse du tout.
    code = "offline";
  } finally {
    if (button) {
      button.disabled = false;
      button.textContent = label;
    }
    delete form.dataset.newsletterBusy;
  }

  if (code === "success" || code === "already") form.reset();
  show(form, code);
}

if (!bound) {
  bound = true;
  document.addEventListener("submit", (event) => {
    const form = event.target;
    if (!(form instanceof HTMLFormElement) || !form.hasAttribute("data-newsletter")) return;
    event.preventDefault();
    void send(form);
  });
}
