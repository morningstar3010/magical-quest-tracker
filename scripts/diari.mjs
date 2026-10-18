/**
 * MAGICAL QUEST TRACKER – integrazione con i Diari.
 *
 * 1) RIQUADRO IN CIMA ALLA SEZIONE DEI DIARI: le missioni attive (e quelle offerte, completate e fallite in gruppi
 *    richiudibili). I giocatori vedono solo quelle che il master ha reso visibili; il master le vede tutte e ha il
 *    pulsante del pannello. Cliccando una missione si apre la sua scheda.
 * 2) RICHIAMO NEI TESTI: @Missione[id]{Testo} (anche @Quest[id]{Testo}) in una pagina di diario diventa un
 *    collegamento. Il master che lo clicca vede l'anteprima della missione dell'avventura e decide se attivarla, solo
 *    aggiungerla al tracker o aprirla nel pannello; il giocatore apre la scheda (se la missione gli è visibile).
 */
import { MOD, t, esc, ICONE_STATO } from "./costanti.mjs";
import { elenco, daChiave, definizione, daAvventura, trova } from "./dati.mjs";
import { apriScheda, visibileA } from "./scheda.mjs";
import { apriPannello } from "./pannello.mjs";
import { arricchisci } from "./testo.mjs";

const { DialogV2 } = foundry.applications.api;

/* -------------------------------------------- */
/*  Riquadro in cima ai Diari                   */
/* -------------------------------------------- */

function chiusi() { try { return game.settings.get(MOD, "gruppiChiusi") ?? {}; } catch (err) { return {}; } }

function voce(m) {
  const ob = m.obiettivi.filter(o => game.user.isGM || !o.segreto);
  const avanz = ob.length ? `<span class="mqt-conto">${ob.filter(o => o.fatto).length}/${ob.length}</span>` : "";
  return `<li class="mqt-voce-diari stato-${m.stato}" data-mqt-apri="${m.id}">
    <i class="${ICONE_STATO[m.stato]}"></i><span class="mqt-nome">${esc(m.titolo)}</span>${avanz}
    ${game.user.isGM ? `<i class="fa-solid ${m.visibile ? "fa-eye" : "fa-eye-slash"} mqt-occhio"></i>` : ""}</li>`;
}

export function riquadroDiari(app, html) {
  try { if (!game.settings.get(MOD, "nelDiario")) return; } catch (err) { return; }
  const radice = html instanceof HTMLElement ? html : html?.[0];
  if (!radice) return;
  radice.querySelector(".mqt-diari")?.remove();
  const tutte = elenco().filter(visibileA);
  const gm = game.user.isGM;
  if (!tutte.length && !gm) return;
  const gruppi = [["attiva", true], ["disponibile", false], ["completata", false], ["fallita", false]];
  const stato = chiusi();
  let corpo = "";
  for (const [s, apertoDiDefault] of gruppi) {
    const lista = tutte.filter(m => m.stato === s);
    if (!lista.length) continue;
    const aperto = stato[s] === undefined ? apertoDiDefault : !stato[s];
    corpo += `<details class="mqt-gruppo" data-gruppo="${s}" ${aperto ? "open" : ""}><summary><i class="${ICONE_STATO[s]}"></i> ${esc(t(`MQT.StatiPlurale.${s}`))} <span>${lista.length}</span></summary><ul>${lista.map(voce).join("")}</ul></details>`;
  }
  const div = document.createElement("section");
  div.className = "mqt-diari";
  div.innerHTML = `<header><h3><i class="fa-solid fa-scroll"></i> ${esc(t("MQT.Diari.titolo"))}</h3>
      ${gm ? `<a class="mqt-apri-pannello" data-tooltip="${esc(t("MQT.Pannello.titolo"))}"><i class="fa-solid fa-list-check"></i></a>` : ""}</header>
    ${corpo || `<p class="mqt-vuoto">${esc(t("MQT.Diari.nessuna"))}</p>`}`;
  div.addEventListener("click", ev => {
    const li = ev.target.closest("[data-mqt-apri]");
    if (li) return apriScheda(li.dataset.mqtApri);
    if (ev.target.closest(".mqt-apri-pannello")) apriPannello();
  });
  div.addEventListener("toggle", ev => {
    const d = ev.target.closest?.("details[data-gruppo]");
    if (!d) return;
    const s = { ...chiusi(), [d.dataset.gruppo]: !d.open };
    game.settings.set(MOD, "gruppiChiusi", s);
  }, true);
  const elencoDiari = radice.querySelector(".directory-list");
  if (elencoDiari) elencoDiari.before(div);
  else radice.querySelector(".window-content, section")?.prepend(div);
}

export function ridisegnaDiari() {
  const app = ui.journal;
  if (app?.rendered) riquadroDiari(app, app.element);
}

/* -------------------------------------------- */
/*  @Missione[id]{Testo}                        */
/* -------------------------------------------- */

const MODELLO = /@(?:Missione|Quest)\[([^\]]+)\](?:\{([^}]+)\})?/g;

async function arricchitore(match) {
  const chiave = match[1];
  const def = definizione(chiave)?.def;
  const m = daChiave(chiave) ?? trova(chiave);
  const testo = match[2] || m?.titolo || def?.titolo || chiave;
  const a = document.createElement("a");
  a.className = "mqt-link content-link";
  a.dataset.mqtChiave = chiave;
  a.innerHTML = `<i class="fa-solid fa-scroll"></i> ${esc(testo)}`;
  if (game.user.isGM) {
    const s = m?.stato;
    const b = document.createElement("span");
    b.className = `mqt-badge stato-${s ?? "nuova"}`;
    b.textContent = s ? t(`MQT.Stati.${s}`) : t("MQT.Diari.daAttivare");
    a.append(" ", b);
  }
  return a;
}

async function anteprima(def) {
  const desc = await arricchisci(def.descrizione ?? "");
  const ob = (def.obiettivi ?? []).map(o => `<li>${esc(o.testo)}${o.segreto ? ` <i class="fa-solid fa-user-secret"></i>` : ""}</li>`).join("");
  return `<div class="mqt mqt-anteprima">${def.immagine ? `<img class="mqt-immagine" src="${esc(def.immagine)}">` : ""}
    <h2>${esc(def.titolo)}</h2>${def.zona ? `<p><strong>${esc(t("MQT.Campi.zona"))}:</strong> ${esc(def.zona)}</p>` : ""}
    ${def.riassunto ? `<p class="mqt-riassunto">${esc(def.riassunto)}</p>` : ""}<div>${desc}</div>
    ${ob ? `<h3>${esc(t("MQT.Campi.obiettivi"))}</h3><ul>${ob}</ul>` : ""}</div>`;
}

async function clicLink(ev) {
  const a = ev.target.closest?.(".mqt-link[data-mqt-chiave]");
  if (!a) return;
  ev.preventDefault(); ev.stopPropagation();
  const chiave = a.dataset.mqtChiave;
  const m = daChiave(chiave) ?? trova(chiave);
  if (!game.user.isGM) {
    if (m && visibileA(m)) return apriScheda(m.id);
    return ui.notifications.info(t("MQT.Avvisi.nonAncora"));
  }
  if (m) return apriScheda(m.id);
  const d = definizione(chiave);
  if (!d) return ui.notifications.warn(t("MQT.Avvisi.definizioneNonTrovata", { chiave }));
  const scelta = await DialogV2.wait({
    window: { title: d.def.titolo || "MQT.Missione" },
    position: { width: 520 },
    content: await anteprima(d.def),
    buttons: [
      { action: "attiva", label: "MQT.Diari.attivaOra", icon: "fa-solid fa-flag", default: true },
      { action: "attivaVisibile", label: "MQT.Diari.attivaMostra", icon: "fa-solid fa-eye" },
      { action: "aggiungi", label: "MQT.Diari.soloAggiungi", icon: "fa-solid fa-plus" },
      { action: "annulla", label: "MQT.Comune.annulla", icon: "fa-solid fa-xmark" }
    ],
    rejectClose: false
  });
  if (!scelta || scelta === "annulla") return;
  const cambi = scelta === "attiva" ? { stato: "attiva" } : scelta === "attivaVisibile" ? { stato: "attiva", visibile: true } : {};
  const nuova = await daAvventura(chiave, cambi);
  if (nuova) { ui.notifications.info(t("MQT.Avvisi.aggiunta", { titolo: nuova.titolo })); apriPannello(nuova.id); }
}

export function registraDiari() {
  CONFIG.TextEditor.enrichers.push({ id: "mqt-missione", pattern: MODELLO, enricher: arricchitore });
  document.addEventListener("click", clicLink, true);
  Hooks.on("renderJournalDirectory", riquadroDiari);
}
