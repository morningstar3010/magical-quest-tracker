/**
 * MAGICAL QUEST TRACKER – fine della missione e consegna dei premi.
 *
 * Quando il master segna una missione come completata si apre questa finestra:
 *  - si spuntano i personaggi che ricevono qualcosa (di partenza quelli che seguono la missione, altrimenti tutti
 *    i personaggi dei giocatori);
 *  - per ogni OGGETTO si sceglie quanti ne va a ciascuno (con un oggetto solo: a chi va);
 *  - VALUTA e PUNTI ESPERIENZA: «in parti uguali» (il resto va ai primi dell'elenco) oppure «decido io» quanto a ciascuno;
 *  - «Consegna» mette tutto nelle schede, scrive il resoconto in chat e nella missione e la segna come completata.
 * «Completa senza premi» la chiude e basta.
 */
import { MOD, t, esc } from "./costanti.mjs";
import { trova, modifica } from "./dati.mjs";
import { valute, personaggiGiocatori, partiUguali, daiOggetto, daiValuta, daiPE, haPE, valutaAutomatica } from "./sistema.mjs";

const { ApplicationV2 } = foundry.applications.api;

export class Consegna extends ApplicationV2 {
  static DEFAULT_OPTIONS = {
    classes: ["mqt", "mqt-consegna-finestra"],
    tag: "div",
    window: { icon: "fa-solid fa-gift", resizable: true },
    position: { width: 720, height: "auto" },
    actions: {
      consegna: Consegna.#consegna,
      senzaPremi: Consegna.#senzaPremi,
      annulla: function () { this.close(); }
    }
  };

  constructor(id) {
    super({ id: `mqt-consegna-${id}` });
    this.missioneId = id;
    const m = trova(id);
    const tutti = personaggiGiocatori();
    this.disponibili = [...new Map([...tutti, ...m.personaggi.map(x => game.actors.get(x)).filter(Boolean)].map(a => [a.id, a])).values()];
    this.scelti = new Set(m.personaggi.filter(x => game.actors.get(x)).length ? m.personaggi : tutti.map(a => a.id));
    this.modoValuta = "uguali";
    this.modoPE = "uguali";
    this.oggetti = {};     // id premio → { attore: quantità }
    this.valutaMano = {};  // attore → { moneta: quantità }
    this.peMano = {};      // attore → pe
    this.#distribuisciOggetti();
  }

  get title() { return t("MQT.Consegna.titolo", { titolo: trova(this.missioneId)?.titolo ?? "" }); }
  get chi() { return this.disponibili.filter(a => this.scelti.has(a.id)); }

  /** Di partenza: ogni oggetto diviso in parti uguali fra i personaggi scelti. */
  #distribuisciOggetti() {
    const m = trova(this.missioneId), chi = this.chi;
    for (const o of m.ricompense.oggetti) {
      const parti = partiUguali(o.quantita, chi.length);
      this.oggetti[o.id] = Object.fromEntries(chi.map((a, i) => [a.id, parti[i] ?? 0]));
    }
  }

  async _renderHTML() {
    const m = trova(this.missioneId);
    if (!m) return `<p>${esc(t("MQT.Scheda.nonDisponibile"))}</p>`;
    const chi = this.chi, r = m.ricompense, monete = valute();
    const scelta = this.disponibili.map(a => `<label class="mqt-pg"><input type="checkbox" data-pg="${a.id}" ${this.scelti.has(a.id) ? "checked" : ""}><img src="${esc(a.img)}"> ${esc(a.name)}</label>`).join("");
    const testa = `<tr><th></th>${chi.map(a => `<th>${esc(a.name)}</th>`).join("")}<th>${esc(t("MQT.Consegna.totale"))}</th></tr>`;
    // oggetti
    let righeOggetti = "";
    for (const o of r.oggetti) {
      const ass = this.oggetti[o.id] ?? {};
      const somma = chi.reduce((s, a) => s + (Number(ass[a.id]) || 0), 0);
      righeOggetti += `<tr data-premio="${o.id}"><td class="mqt-nome"><img src="${esc(o.img || "icons/svg/item-bag.svg")}"> ${esc(o.nome)}</td>
        ${chi.map(a => `<td><input type="number" min="0" max="${o.quantita}" step="1" data-oggetto="${o.id}" data-attore="${a.id}" value="${Number(ass[a.id]) || 0}"></td>`).join("")}
        <td class="${somma === o.quantita ? "giusto" : "sbagliato"}">${somma}/${o.quantita}</td></tr>`;
    }
    // valuta
    const totaleMonete = monete.filter(v => r.valuta[v.chiave]);
    let righeValuta = "";
    for (const v of totaleMonete) {
      const parti = partiUguali(r.valuta[v.chiave], chi.length);
      const somma = chi.reduce((s, a, i) => s + (this.modoValuta === "uguali" ? parti[i] : (Number(this.valutaMano[a.id]?.[v.chiave]) || 0)), 0);
      righeValuta += `<tr><td class="mqt-nome"><i class="fa-solid fa-coins"></i> ${esc(v.completo)}</td>
        ${chi.map((a, i) => this.modoValuta === "uguali" ? `<td class="mqt-auto">${parti[i]}</td>` :
          `<td><input type="number" min="0" step="1" data-moneta="${v.chiave}" data-attore="${a.id}" value="${Number(this.valutaMano[a.id]?.[v.chiave]) || 0}"></td>`).join("")}
        <td class="${somma === r.valuta[v.chiave] ? "giusto" : "sbagliato"}">${somma}/${r.valuta[v.chiave]}</td></tr>`;
    }
    // pe
    let rigaPE = "";
    if (r.pe) {
      const parti = partiUguali(r.pe, chi.length);
      const somma = chi.reduce((s, a, i) => s + (this.modoPE === "uguali" ? parti[i] : (Number(this.peMano[a.id]) || 0)), 0);
      rigaPE = `<tr><td class="mqt-nome"><i class="fa-solid fa-star"></i> ${esc(t("MQT.Premi.pe"))}</td>
        ${chi.map((a, i) => this.modoPE === "uguali" ? `<td class="mqt-auto">${parti[i]}</td>` :
          `<td><input type="number" min="0" step="1" data-pe="1" data-attore="${a.id}" value="${Number(this.peMano[a.id]) || 0}"></td>`).join("")}
        <td class="${somma === r.pe ? "giusto" : "sbagliato"}">${somma}/${r.pe}</td></tr>`;
    }
    const modo = (nome, valore) => `<select data-modo="${nome}"><option value="uguali" ${valore === "uguali" ? "selected" : ""}>${esc(t("MQT.Consegna.uguali"))}</option><option value="mano" ${valore === "mano" ? "selected" : ""}>${esc(t("MQT.Consegna.mano"))}</option></select>`;
    const nienteDaDare = !r.oggetti.length && !totaleMonete.length && !r.pe;
    return `<p class="mqt-spiega">${esc(t("MQT.Consegna.spiega"))}</p>
      <h3>${esc(t("MQT.Consegna.chi"))}</h3><div class="mqt-pgs">${scelta || `<em>${esc(t("MQT.Consegna.nessunPG"))}</em>`}</div>
      ${!chi.length || nienteDaDare ? "" : `<table class="mqt-tabella">${testa}
        ${r.oggetti.length ? `<tr class="mqt-sezione"><td colspan="${chi.length + 2}">${esc(t("MQT.Consegna.oggetti"))}</td></tr>${righeOggetti}` : ""}
        ${totaleMonete.length ? `<tr class="mqt-sezione"><td colspan="${chi.length + 2}">${esc(t("MQT.Premi.valuta"))} ${modo("valuta", this.modoValuta)}</td></tr>${righeValuta}` : ""}
        ${rigaPE ? `<tr class="mqt-sezione"><td colspan="${chi.length + 2}">${esc(t("MQT.Premi.pe"))} ${modo("pe", this.modoPE)}</td></tr>${rigaPE}` : ""}
      </table>`}
      ${!valutaAutomatica() && (totaleMonete.length || r.pe) ? `<p class="mqt-nota">${esc(t("MQT.Consegna.aMano"))}</p>` : ""}
      ${r.altro ? `<p class="mqt-nota"><i class="fa-solid fa-gift"></i> ${esc(r.altro)}</p>` : ""}
      <div class="mqt-fila">
        <button type="button" data-action="consegna" ${!chi.length || nienteDaDare ? "disabled" : ""}><i class="fa-solid fa-gift"></i> ${esc(t("MQT.Consegna.consegna"))}</button>
        <button type="button" data-action="senzaPremi"><i class="fa-solid fa-circle-check"></i> ${esc(t("MQT.Consegna.senzaPremi"))}</button>
        <button type="button" data-action="annulla"><i class="fa-solid fa-xmark"></i> ${esc(t("MQT.Comune.annulla"))}</button></div>`;
  }

  _replaceHTML(html, contenuto) { contenuto.innerHTML = html; }

  _onFirstRender() {
    this.element.addEventListener("change", ev => {
      const el = ev.target, d = el.dataset;
      if (d.pg) { el.checked ? this.scelti.add(d.pg) : this.scelti.delete(d.pg); this.#distribuisciOggetti(); }
      else if (d.oggetto) (this.oggetti[d.oggetto] ??= {})[d.attore] = Math.max(0, Math.floor(Number(el.value) || 0));
      else if (d.moneta) (this.valutaMano[d.attore] ??= {})[d.moneta] = Math.max(0, Math.floor(Number(el.value) || 0));
      else if (d.pe) this.peMano[d.attore] = Math.max(0, Math.floor(Number(el.value) || 0));
      else if (d.modo === "valuta") this.modoValuta = el.value;
      else if (d.modo === "pe") this.modoPE = el.value;
      else return;
      this.render();
    });
  }

  /** Quanto va a ciascuno: { attore: { oggetti: [[premio, n]], valuta: {k: n}, pe } } */
  #piano() {
    const m = trova(this.missioneId), r = m.ricompense, chi = this.chi, monete = valute();
    const piano = Object.fromEntries(chi.map(a => [a.id, { oggetti: [], valuta: {}, pe: 0 }]));
    for (const o of r.oggetti) for (const a of chi) { const n = Number(this.oggetti[o.id]?.[a.id]) || 0; if (n) piano[a.id].oggetti.push([o, n]); }
    for (const v of monete) {
      if (!r.valuta[v.chiave]) continue;
      const parti = partiUguali(r.valuta[v.chiave], chi.length);
      chi.forEach((a, i) => { const n = this.modoValuta === "uguali" ? parti[i] : (Number(this.valutaMano[a.id]?.[v.chiave]) || 0); if (n) piano[a.id].valuta[v.chiave] = n; });
    }
    if (r.pe) {
      const parti = partiUguali(r.pe, chi.length);
      chi.forEach((a, i) => { piano[a.id].pe = this.modoPE === "uguali" ? parti[i] : (Number(this.peMano[a.id]) || 0); });
    }
    return piano;
  }

  static async #consegna() {
    const m = trova(this.missioneId), piano = this.#piano(), monete = valute();
    // controllo: non si può dare più di quanto c'è
    for (const o of m.ricompense.oggetti) {
      const somma = Object.values(piano).reduce((s, p) => s + p.oggetti.filter(([x]) => x.id === o.id).reduce((q, [, n]) => q + n, 0), 0);
      if (somma > o.quantita) return ui.notifications.warn(t("MQT.Avvisi.troppi", { nome: o.nome, n: o.quantita }));
    }
    const righe = [];
    for (const [aid, p] of Object.entries(piano)) {
      const a = game.actors.get(aid);
      if (!a) continue;
      const voci = [];
      for (const [o, n] of p.oggetti) { if (o.uuid && await daiOggetto(a, o.uuid, n)) voci.push(`${esc(o.nome)}${n > 1 ? ` ×${n}` : ""}`); else voci.push(`${esc(o.nome)}${n > 1 ? ` ×${n}` : ""} (${esc(t("MQT.Consegna.daDareAMano"))})`); }
      if (Object.keys(p.valuta).length) {
        await daiValuta(a, p.valuta);
        voci.push(monete.filter(v => p.valuta[v.chiave]).map(v => `${p.valuta[v.chiave]} ${esc(v.nome)}`).join(", "));
      }
      if (p.pe) { await daiPE(a, p.pe); voci.push(`${p.pe} ${esc(t("MQT.Premi.pe"))}`); }
      if (voci.length) righe.push(`<li><strong>${esc(a.name)}</strong>: ${voci.join(", ")}</li>`);
    }
    const testo = righe.length ? `<ul>${righe.join("")}</ul>` : "";
    await modifica(this.missioneId, { stato: "completata", personaggi: [...this.scelti], consegna: { testo, quando: Date.now() } });
    await ChatMessage.create({
      speaker: { alias: t("MQT.Titolo") },
      content: `<div class="mqt-chat"><h3><i class="fa-solid fa-circle-check"></i> ${esc(t("MQT.Consegna.chat", { titolo: m.titolo }))}</h3>${testo}</div>`,
      whisper: m.visibile ? [] : ChatMessage.getWhisperRecipients("GM").map(u => u.id)
    });
    this.close();
  }

  static async #senzaPremi() {
    await modifica(this.missioneId, { stato: "completata", personaggi: [...this.scelti] });
    this.close();
  }
}

export function apriConsegna(id) {
  if (!game.user.isGM) return;
  const m = trova(id);
  if (!m) return;
  new Consegna(id).render({ force: true });
}
