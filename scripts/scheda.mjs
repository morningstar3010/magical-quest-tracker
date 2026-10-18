/**
 * MAGICAL QUEST TRACKER – la scheda di una missione (quella che vedono i giocatori, e il master in lettura).
 *
 * Si apre cliccando la missione nel riquadro in cima ai Diari, dal pannello del master o con «Mostra ai giocatori».
 * Mostra immagine, stato, zona, personaggi non giocanti, riassunto e descrizione, obiettivi (quelli segreti solo al
 * master), premi (se il master li rende visibili), scadenza, chi la segue e le note personali del giocatore
 * (salvate nel suo utente: le vede solo lui).
 */
import { MOD, t, esc, ICONE_STATO } from "./costanti.mjs";
import { trova, modifica } from "./dati.mjs";
import { valute } from "./sistema.mjs";
import { arricchisci } from "./testo.mjs";

const { ApplicationV2 } = foundry.applications.api;
const APERTE = new Map();

/** La missione è visibile a questo utente? */
export const visibileA = m => game.user.isGM || !!m.visibile;

export class SchedaMissione extends ApplicationV2 {
  static DEFAULT_OPTIONS = {
    classes: ["mqt", "mqt-scheda"],
    tag: "div",
    window: { icon: "fa-solid fa-scroll", resizable: true },
    position: { width: 560, height: 680 },
    actions: {
      obiettivo: SchedaMissione.#obiettivo,
      modifica: SchedaMissione.#modifica,
      diario: SchedaMissione.#diario
    }
  };

  constructor(id, options = {}) {
    super({ id: `mqt-scheda-${id}`, ...options });
    this.missioneId = id;
  }

  get title() { return trova(this.missioneId)?.titolo || t("MQT.Missione"); }

  async _renderHTML() {
    const m = trova(this.missioneId);
    if (!m || !visibileA(m)) return `<p class="mqt-vuoto">${esc(t("MQT.Scheda.nonDisponibile"))}</p>`;
    const gm = game.user.isGM;
    const desc = await arricchisci(m.descrizione, { relativeTo: m.origine ? await fromUuid(m.origine).catch(() => null) : null });
    const riass = m.riassunto ? `<p class="mqt-riassunto">${esc(m.riassunto)}</p>` : "";
    const png = m.png.length ? `<p><strong>${esc(t("MQT.Campi.png"))}:</strong> ${(await Promise.all(m.png.map(p => /^[A-Z][A-Za-z]+\./.test(p) ? arricchisci(`@UUID[${p}]`) : esc(p)))).join(", ")}</p>` : "";
    const zona = m.zona ? `<p><strong>${esc(t("MQT.Campi.zona"))}:</strong> ${esc(m.zona)}</p>` : "";
    const scad = m.scadenza ? `<p class="mqt-scadenza"><i class="fa-solid fa-hourglass-half"></i> ${esc(m.scadenza)}</p>` : "";
    const obiettivi = m.obiettivi.filter(o => gm || !o.segreto);
    const fatti = obiettivi.filter(o => o.fatto).length;
    const ob = obiettivi.length ? `<h3>${esc(t("MQT.Campi.obiettivi"))} <span class="mqt-conto">${fatti}/${obiettivi.length}</span></h3><ul class="mqt-obiettivi">${obiettivi.map(o =>
      `<li class="${o.fatto ? "fatto" : ""} ${o.segreto ? "segreto" : ""}" data-obiettivo="${o.id}">
        ${gm ? `<a data-action="obiettivo"><i class="fa-regular ${o.fatto ? "fa-square-check" : "fa-square"}"></i></a>` : `<i class="fa-regular ${o.fatto ? "fa-square-check" : "fa-square"}"></i>`}
        <span>${esc(o.testo)}</span>${o.segreto ? ` <i class="fa-solid fa-user-secret" data-tooltip="${esc(t("MQT.Campi.segreto"))}"></i>` : ""}</li>`).join("")}</ul>` : "";
    let premi = "";
    if (gm || m.premiVisibili) {
      const r = m.ricompense, righe = [];
      for (const o of r.oggetti) righe.push(`<li><img src="${esc(o.img || "icons/svg/item-bag.svg")}"> ${o.uuid ? await arricchisci(`@UUID[${o.uuid}]{${o.nome}}`) : esc(o.nome)}${o.quantita > 1 ? ` ×${o.quantita}` : ""}</li>`);
      const monete = valute().filter(v => r.valuta[v.chiave]).map(v => `${r.valuta[v.chiave]} ${esc(v.nome)}`).join(", ");
      if (monete) righe.push(`<li><i class="fa-solid fa-coins"></i> ${monete}</li>`);
      if (r.pe) righe.push(`<li><i class="fa-solid fa-star"></i> ${r.pe} ${esc(t("MQT.Premi.pe"))}</li>`);
      if (r.altro) righe.push(`<li><i class="fa-solid fa-gift"></i> ${esc(r.altro)}</li>`);
      if (righe.length) premi = `<h3>${esc(t("MQT.Campi.ricompense"))}${!m.premiVisibili ? ` <i class="fa-solid fa-eye-slash" data-tooltip="${esc(t("MQT.Scheda.premiNascosti"))}"></i>` : ""}</h3><ul class="mqt-premi">${righe.join("")}</ul>`;
    }
    const chi = m.personaggi.map(id => game.actors.get(id)?.name).filter(Boolean);
    const seguono = chi.length ? `<p><strong>${esc(t("MQT.Campi.personaggi"))}:</strong> ${chi.map(esc).join(", ")}</p>` : "";
    const consegna = m.consegna?.testo ? `<h3>${esc(t("MQT.Scheda.consegnato"))}</h3><div class="mqt-consegna">${m.consegna.testo}</div>` : "";
    const note = (game.user.getFlag(MOD, "note") ?? {})[m.id] ?? "";
    return `<div class="mqt-testa">
        ${m.immagine ? `<img class="mqt-immagine" src="${esc(m.immagine)}">` : ""}
        <div><h2>${esc(m.titolo)}</h2>
          <p class="mqt-stato stato-${m.stato}"><i class="${ICONE_STATO[m.stato]}"></i> ${esc(t(`MQT.Stati.${m.stato}`))}
          ${gm ? `<i class="fa-solid ${m.visibile ? "fa-eye" : "fa-eye-slash"}" data-tooltip="${esc(t(m.visibile ? "MQT.Pannello.visibile" : "MQT.Pannello.nascosta"))}"></i>` : ""}</p>
          ${zona}${png}${scad}</div></div>
      ${riass}<div class="mqt-descrizione">${desc}</div>${ob}${premi}${seguono}${consegna}
      <h3>${esc(t("MQT.Scheda.note"))}</h3><textarea class="mqt-note" placeholder="${esc(t("MQT.Scheda.notePlaceholder"))}">${esc(note)}</textarea>
      <div class="mqt-fila">${m.origine ? `<button type="button" data-action="diario"><i class="fa-solid fa-book-open"></i> ${esc(t("MQT.Scheda.apriDiario"))}</button>` : ""}
      ${gm ? `<button type="button" data-action="modifica"><i class="fa-solid fa-pen"></i> ${esc(t("MQT.Scheda.modifica"))}</button>` : ""}</div>`;
  }

  _replaceHTML(html, contenuto) { contenuto.innerHTML = html; }

  _onFirstRender() {
    this.element.addEventListener("change", async ev => {
      if (!ev.target.classList.contains("mqt-note")) return;
      const note = { ...(game.user.getFlag(MOD, "note") ?? {}), [this.missioneId]: ev.target.value };
      await game.user.setFlag(MOD, "note", note);
    });
  }

  _onClose(options) { APERTE.delete(this.missioneId); super._onClose?.(options); }

  static async #obiettivo(ev, el) {
    const oid = el.closest("[data-obiettivo]").dataset.obiettivo;
    await modifica(this.missioneId, m => { const o = m.obiettivi.find(x => x.id === oid); if (o) o.fatto = !o.fatto; });
  }

  static async #modifica() {
    const { apriPannello } = await import("./pannello.mjs");
    apriPannello(this.missioneId);
  }

  static async #diario() {
    const m = trova(this.missioneId);
    const doc = m?.origine ? await fromUuid(m.origine) : null;
    if (!doc) return ui.notifications.warn(t("MQT.Avvisi.diarioNonTrovato"));
    if (doc.documentName === "JournalEntryPage") doc.parent.sheet.render(true, { pageId: doc.id });
    else doc.sheet.render(true);
  }
}

/** Apre (o porta davanti) la scheda di una missione. */
export function apriScheda(id) {
  const m = trova(id);
  if (!m || !visibileA(m)) return ui.notifications.warn(t("MQT.Scheda.nonDisponibile"));
  let s = APERTE.get(id);
  if (!s || !s.rendered) { s = new SchedaMissione(id); APERTE.set(id, s); }
  s.render({ force: true });
  return s;
}

/** Ridisegna le schede aperte (dopo un cambio delle missioni). */
export function ridisegnaSchede() {
  for (const [id, s] of APERTE) {
    if (!s.rendered) continue;
    const m = trova(id);
    if (!m || !visibileA(m)) s.close(); else s.render();
  }
}
