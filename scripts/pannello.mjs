/**
 * MAGICAL QUEST TRACKER – il pannello privato del master.
 *
 * A SINISTRA l'elenco: ricerca (titolo, zona, descrizione, PNG), filtro per zona e per PNG, schede per stato
 * (Tutte, Disponibili, Attive, Completate, Fallite) e, in fondo, le «Missioni delle avventure»: quelle scritte nei diari
 * delle avventure importate e non ancora messe nel tracker (Aggiungi / Attiva).
 * A DESTRA la missione scelta, modificabile: titolo, stato, visibile ai giocatori, zona, PNG (anche trascinando attori),
 * immagine, riassunto, descrizione, obiettivi (con quelli segreti), premi (oggetti trascinati da qualsiasi compendio con
 * la quantità, valuta, punti esperienza, altro), scadenza, personaggi che la seguono. Ogni campo si salva da solo.
 * Pulsanti: Attiva, Completa (apre la consegna dei premi), Fallita, Riapri, Mostra ai giocatori, Duplica, Elimina.
 */
import { MOD, t, esc, STATI, ICONE_STATO, normalizza, soloTesto, nuovoId } from "./costanti.mjs";
import { elenco, trova, modifica, elimina, nuova, duplica, definizioni, definizione, daChiave, daAvventura } from "./dati.mjs";
import { valute, personaggiGiocatori, haPE } from "./sistema.mjs";
import { apriScheda } from "./scheda.mjs";
import { apriConsegna } from "./consegna.mjs";
import { datiTrascinati, arricchisci } from "./testo.mjs";
import { mostraATutti } from "./socket.mjs";

const { ApplicationV2, DialogV2 } = foundry.applications.api;

async function conferma(titolo, domanda) {
  return (await DialogV2.confirm({
    window: { title: titolo }, content: `<p>${domanda}</p>`,
    yes: { label: "MQT.Comune.si", icon: "fa-solid fa-check" }, no: { label: "MQT.Comune.no", icon: "fa-solid fa-xmark" }, rejectClose: false
  })) === true;
}

export class PannelloMissioni extends ApplicationV2 {
  static DEFAULT_OPTIONS = {
    id: "mqt-pannello",
    classes: ["mqt", "mqt-pannello"],
    tag: "div",
    window: { icon: "fa-solid fa-scroll", resizable: true },
    position: { width: 1040, height: 760 },
    actions: {
      nuova: PannelloMissioni.#nuova,
      scegli: PannelloMissioni.#scegli,
      stato: PannelloMissioni.#filtroStato,
      attiva: function () { return modifica(this.scelta, { stato: "attiva" }); },
      fallita: function () { return modifica(this.scelta, { stato: "fallita" }); },
      riapri: function () { return modifica(this.scelta, { stato: "attiva" }); },
      completa: function () { apriConsegna(this.scelta); },
      visibile: PannelloMissioni.#visibile,
      mostra: function () { mostraATutti(this.scelta); },
      scheda: function () { apriScheda(this.scelta); },
      duplica: async function () { const m = await duplica(this.scelta); if (m) { this.scelta = m.id; this.render(); } },
      elimina: PannelloMissioni.#elimina,
      immagine: PannelloMissioni.#immagine,
      nuovoObiettivo: PannelloMissioni.#nuovoObiettivo,
      togliObiettivo: PannelloMissioni.#togliObiettivo,
      togliPremio: PannelloMissioni.#togliPremio,
      togliPng: PannelloMissioni.#togliPng,
      aggiungiDef: PannelloMissioni.#aggiungiDef,
      attivaDef: PannelloMissioni.#attivaDef,
      scegliDef: PannelloMissioni.#scegliDef,
      attivaMostraDef: PannelloMissioni.#attivaMostraDef,
      diarioDef: PannelloMissioni.#diarioDef,
      apriPremio: PannelloMissioni.#apriPremio
    }
  };

  scelta = null;
  sceltaDef = null;        // definizione di un'avventura in anteprima (non ancora nel tracker)
  arricchiti = {};         // HTML arricchito per gli editor (descrizione, note del master)
  filtro = { testo: "", zona: "", png: "", stato: "tutte" };
  scorrimento = [0, 0];

  get title() { return t("MQT.Pannello.titolo"); }

  async _renderHTML() {
    const tutte = elenco();
    if (this.scelta && !tutte.find(m => m.id === this.scelta)) this.scelta = null;
    if (this.sceltaDef && daChiave(this.sceltaDef)) { this.scelta = daChiave(this.sceltaDef).id; this.sceltaDef = null; }
    const sc = this.scelta ? trova(this.scelta) : null;
    this.arricchiti = sc ? { descrizione: await arricchisci(sc.descrizione), noteMaster: await arricchisci(sc.noteMaster) } : {};
    const destra = sc ? this.#editor() : (this.sceltaDef ? await this.#anteprimaDef(this.sceltaDef) : this.#editor());
    const zone = [...new Set(tutte.map(m => m.zona).filter(Boolean))].sort((a, b) => a.localeCompare(b));
    const png = [...new Set(tutte.flatMap(m => m.png.map(p => this.#nomePng(p))).filter(Boolean))].sort((a, b) => a.localeCompare(b));
    const conti = Object.fromEntries(STATI.map(s => [s, tutte.filter(m => m.stato === s).length]));
    const schede = ["tutte", ...STATI].map(s => `<a class="${this.filtro.stato === s ? "attiva" : ""}" data-action="stato" data-stato="${s}">${s === "tutte" ? esc(t("MQT.Pannello.tutte")) : `<i class="${ICONE_STATO[s]}"></i> ${esc(t(`MQT.Stati.${s}`))}`} <span>${s === "tutte" ? tutte.length : conti[s]}</span></a>`).join("");
    const voci = tutte.map(m => {
      const ob = m.obiettivi.length ? ` · ${m.obiettivi.filter(o => o.fatto).length}/${m.obiettivi.length}` : "";
      const cerca = normalizza([m.titolo, m.zona, soloTesto(m.descrizione), soloTesto(m.noteMaster), m.riassunto, ...m.png.map(p => this.#nomePng(p))].join(" "));
      return `<li class="mqt-voce stato-${m.stato} ${m.id === this.scelta ? "scelta" : ""}" data-action="scegli" data-id="${m.id}"
          data-cerca="${esc(cerca)}" data-zona="${esc(m.zona)}" data-png="${esc(m.png.map(p => this.#nomePng(p)).join("|"))}" data-stato="${m.stato}">
        <i class="${ICONE_STATO[m.stato]}"></i><div><strong>${esc(m.titolo || t("MQT.Pannello.senzaTitolo"))}</strong>
        <small>${esc(m.zona)}${ob}</small></div>
        <i class="fa-solid ${m.visibile ? "fa-eye" : "fa-eye-slash"} mqt-occhio" data-tooltip="${esc(t(m.visibile ? "MQT.Pannello.visibile" : "MQT.Pannello.nascosta"))}"></i></li>`;
    }).join("");
    const defs = definizioni().filter(d => !daChiave(d.def.id));
    const voceDef = defs.map(d => `<li class="mqt-voce mqt-def ${d.def.id === this.sceltaDef ? "scelta" : ""}" data-action="scegliDef" data-chiave="${esc(d.def.id)}"
        data-cerca="${esc(normalizza([d.def.titolo, d.def.zona, soloTesto(d.def.descrizione), d.def.riassunto, ...(d.def.png ?? [])].join(" ")))}" data-zona="${esc(d.def.zona ?? "")}" data-png="${esc((d.def.png ?? []).join("|"))}" data-stato="disponibile">
        <i class="fa-solid fa-book"></i><div><strong>${esc(d.def.titolo)}</strong><small>${esc(d.diario.name)}${d.def.zona ? ` · ${esc(d.def.zona)}` : ""}</small></div>
        <a data-action="aggiungiDef" data-tooltip="${esc(t("MQT.Pannello.aggiungiDef"))}"><i class="fa-solid fa-plus"></i></a>
        <a data-action="attivaDef" data-tooltip="${esc(t("MQT.Pannello.attivaDef"))}"><i class="fa-solid fa-flag"></i></a></li>`).join("");
    const sinistra = `<div class="mqt-filtri">
        <input type="search" class="mqt-cerca" placeholder="${esc(t("MQT.Pannello.cerca"))}" value="${esc(this.filtro.testo)}">
        <div class="mqt-fila"><select class="mqt-filtro-zona"><option value="">${esc(t("MQT.Pannello.tutteZone"))}</option>${zone.map(z => `<option ${z === this.filtro.zona ? "selected" : ""}>${esc(z)}</option>`).join("")}</select>
        <select class="mqt-filtro-png"><option value="">${esc(t("MQT.Pannello.tuttiPng"))}</option>${png.map(z => `<option ${z === this.filtro.png ? "selected" : ""}>${esc(z)}</option>`).join("")}</select></div>
        <nav class="mqt-stati">${schede}</nav></div>
      <ul class="mqt-elenco">${voci || `<li class="mqt-vuoto">${esc(t("MQT.Pannello.nessuna"))}</li>`}</ul>
      ${defs.length ? `<h4 class="mqt-titolo-def"><i class="fa-solid fa-book-open"></i> ${esc(t("MQT.Pannello.dalleAvventure"))} (${defs.length})</h4><ul class="mqt-elenco mqt-elenco-def">${voceDef}</ul>` : ""}`;
    return `<div class="mqt-barra"><button type="button" data-action="nuova"><i class="fa-solid fa-plus"></i> ${esc(t("MQT.Pannello.nuova"))}</button></div>
      <div class="mqt-corpo"><aside class="mqt-sinistra">${sinistra}</aside><section class="mqt-destra">${destra}</section></div>`;
  }

  #nomePng(p) {
    if (/^[A-Z][A-Za-z]+\./.test(p)) { try { return fromUuidSync(p)?.name ?? p; } catch (err) { return p; } }
    return p;
  }

  #editor() {
    const m = this.scelta ? trova(this.scelta) : null;
    if (!m) return `<p class="mqt-vuoto">${esc(t("MQT.Pannello.scegliUna"))}</p>`;
    const campo = (nome, html) => `<div class="form-group"><label>${esc(t(`MQT.Campi.${nome}`))}</label><div class="form-fields">${html}</div></div>`;
    const stati = STATI.map(s => `<option value="${s}" ${m.stato === s ? "selected" : ""}>${esc(t(`MQT.Stati.${s}`))}</option>`).join("");
    const png = m.png.map((p, i) => `<span class="mqt-etichetta" data-indice="${i}">${esc(this.#nomePng(p))} <a data-action="togliPng"><i class="fa-solid fa-xmark"></i></a></span>`).join("");
    const ob = m.obiettivi.map(o => `<li data-obiettivo="${o.id}"><input type="checkbox" data-obiettivo-campo="fatto" ${o.fatto ? "checked" : ""}>
        <input type="text" data-obiettivo-campo="testo" value="${esc(o.testo)}">
        <label data-tooltip="${esc(t("MQT.Campi.segreto"))}"><input type="checkbox" data-obiettivo-campo="segreto" ${o.segreto ? "checked" : ""}> <i class="fa-solid fa-user-secret"></i></label>
        <a data-action="togliObiettivo"><i class="fa-solid fa-trash"></i></a></li>`).join("");
    const premi = m.ricompense.oggetti.map(o => `<li data-premio="${o.id}"><img src="${esc(o.img || "icons/svg/item-bag.svg")}"><a data-action="apriPremio">${esc(o.nome)}</a>
        <input type="number" min="1" step="1" data-premio-campo="quantita" value="${o.quantita}"><a data-action="togliPremio"><i class="fa-solid fa-trash"></i></a></li>`).join("");
    const monete = valute().map(v => `<label class="mqt-moneta">${esc(v.nome)} <input type="number" min="0" step="1" data-valuta="${v.chiave}" value="${m.ricompense.valuta[v.chiave] ?? 0}"></label>`).join("");
    const pgs = personaggiGiocatori().map(a => `<label class="mqt-pg"><input type="checkbox" data-personaggio="${a.id}" ${m.personaggi.includes(a.id) ? "checked" : ""}> ${esc(a.name)}</label>`).join("");
    const origine = m.origine ? `<p class="mqt-nota"><i class="fa-solid fa-book"></i> ${esc(t("MQT.Pannello.daAvventura"))}</p>` : "";
    const bott = [];
    if (m.stato === "disponibile") bott.push(["attiva", "fa-flag", "MQT.Pannello.attiva"]);
    if (m.stato === "attiva") bott.push(["completa", "fa-circle-check", "MQT.Pannello.completa"], ["fallita", "fa-circle-xmark", "MQT.Pannello.fallita"]);
    if (m.stato === "completata" || m.stato === "fallita") bott.push(["riapri", "fa-rotate-left", "MQT.Pannello.riapri"]);
    bott.push(["visibile", m.visibile ? "fa-eye-slash" : "fa-eye", m.visibile ? "MQT.Pannello.nascondi" : "MQT.Pannello.rendiVisibile"],
      ["mostra", "fa-bullhorn", "MQT.Pannello.mostra"], ["scheda", "fa-id-card", "MQT.Pannello.scheda"], ["duplica", "fa-clone", "MQT.Pannello.duplica"], ["elimina", "fa-trash", "MQT.Pannello.elimina"]);
    return `<div class="mqt-azioni">${bott.map(([a, i, k]) => `<button type="button" data-action="${a}"><i class="fa-solid ${i}"></i> ${esc(t(k))}</button>`).join("")}</div>
      ${origine}
      <div class="mqt-editor" data-id="${m.id}">
        <div class="mqt-testa-editor">
          <a class="mqt-immagine-scelta" data-action="immagine" data-tooltip="${esc(t("MQT.Campi.immagine"))}">${m.immagine ? `<img src="${esc(m.immagine)}">` : `<i class="fa-solid fa-image"></i>`}</a>
          <div class="mqt-campi-testa">
            ${campo("titolo", `<input type="text" data-campo="titolo" value="${esc(m.titolo)}">`)}
            ${campo("stato", `<select data-campo="stato">${stati}</select>`)}
            ${campo("visibile", `<input type="checkbox" data-campo="visibile" ${m.visibile ? "checked" : ""}>`)}
            ${campo("zona", `<input type="text" data-campo="zona" list="mqt-zone" value="${esc(m.zona)}"><datalist id="mqt-zone">${[...new Set(elenco().map(x => x.zona).filter(Boolean))].map(z => `<option value="${esc(z)}">`).join("")}</datalist>`)}
          </div>
        </div>
        ${campo("png", `<div class="mqt-png mqt-rilascio" data-rilascio="png">${png}<input type="text" class="mqt-nuovo-png" placeholder="${esc(t("MQT.Pannello.pngPlaceholder"))}"></div>`)}
        ${campo("riassunto", `<input type="text" data-campo="riassunto" value="${esc(m.riassunto)}">`)}
        <div class="form-group mqt-blocco"><label>${esc(t("MQT.Campi.descrizione"))}</label><div class="mqt-descrizione-editor" data-editor="descrizione"></div></div>
        <div class="form-group mqt-blocco mqt-note-master"><label><i class="fa-solid fa-user-secret"></i> ${esc(t("MQT.Campi.noteMaster"))}</label><div class="mqt-descrizione-editor" data-editor="noteMaster"></div></div>
        <h3>${esc(t("MQT.Campi.obiettivi"))} <a data-action="nuovoObiettivo" data-tooltip="${esc(t("MQT.Pannello.nuovoObiettivo"))}"><i class="fa-solid fa-plus"></i></a></h3>
        <ul class="mqt-obiettivi-editor">${ob || `<li class="mqt-nota">${esc(t("MQT.Pannello.nessunObiettivo"))}</li>`}</ul>
        <h3>${esc(t("MQT.Campi.ricompense"))}</h3>
        <div class="mqt-rilascio mqt-premi-editor" data-rilascio="premi"><ul>${premi}</ul><p class="mqt-nota"><i class="fa-solid fa-hand-pointer"></i> ${esc(t("MQT.Pannello.trascinaOggetti"))}</p></div>
        <div class="mqt-fila mqt-monete">${monete}${haPE() ? `<label class="mqt-moneta">${esc(t("MQT.Premi.pe"))} <input type="number" min="0" step="1" data-pe="1" value="${m.ricompense.pe}"></label>` : ""}</div>
        ${campo("altro", `<input type="text" data-premio-altro="1" value="${esc(m.ricompense.altro)}">`)}
        ${campo("premiVisibili", `<input type="checkbox" data-campo="premiVisibili" ${m.premiVisibili ? "checked" : ""}>`)}
        ${campo("scadenza", `<input type="text" data-campo="scadenza" value="${esc(m.scadenza)}" placeholder="${esc(t("MQT.Pannello.scadenzaPlaceholder"))}">`)}
        <h3>${esc(t("MQT.Campi.personaggi"))}</h3><div class="mqt-pgs">${pgs || `<em>${esc(t("MQT.Consegna.nessunPG"))}</em>`}</div>
      </div>`;
  }

  _replaceHTML(html, contenuto) {
    const vecchi = [contenuto.querySelector(".mqt-sinistra"), contenuto.querySelector(".mqt-destra")];
    if (vecchi[0]) this.scorrimento = vecchi.map(x => x?.scrollTop ?? 0);
    contenuto.innerHTML = html;
    const nuovi = [contenuto.querySelector(".mqt-sinistra"), contenuto.querySelector(".mqt-destra")];
    nuovi.forEach((x, i) => { if (x) x.scrollTop = this.scorrimento[i]; });
    this.#editorDescrizione(contenuto);
    this.#applicaFiltri();
  }

  /** Editor della descrizione e delle note del master: ProseMirror di Foundry (con il testo già arricchito, se no
   *  in modalità lettura sembra vuoto), altrimenti un'area di testo. */
  #editorDescrizione(contenuto) {
    const m = this.scelta ? trova(this.scelta) : null;
    if (!m) return;
    const PM = foundry.applications?.elements?.HTMLProseMirrorElement;
    for (const posto of contenuto.querySelectorAll(".mqt-descrizione-editor[data-editor]")) {
      const campo = posto.dataset.editor;
      if (PM?.create) {
        const el = PM.create({ name: campo, value: m[campo] ?? "", enriched: this.arricchiti[campo] ?? "", toggled: true, collaborate: false });
        el.addEventListener("change", ev => modifica(m.id, { [campo]: ev.currentTarget.value ?? el.value }));
        posto.append(el);
      } else {
        const ta = document.createElement("textarea");
        ta.value = m[campo] ?? ""; ta.rows = 6;
        ta.addEventListener("change", () => modifica(m.id, { [campo]: ta.value }));
        posto.append(ta);
      }
    }
  }

  /** Anteprima (sola lettura) di una missione scritta in un'avventura, con Aggiungi / Attiva / Attiva e mostra. */
  async #anteprimaDef(chiave) {
    const d = definizione(chiave);
    if (!d) { this.sceltaDef = null; return this.#editor(); }
    const def = d.def;
    const ob = (def.obiettivi ?? []).map(o => `<li>${esc(o.testo)}${o.segreto ? ` <i class="fa-solid fa-user-secret" data-tooltip="${esc(t("MQT.Campi.segreto"))}"></i>` : ""}</li>`).join("");
    const r = def.ricompense ?? {}, premi = [];
    const monete = valute().filter(v => r.valuta?.[v.chiave]).map(v => `${r.valuta[v.chiave]} ${esc(v.nome)}`).join(", ");
    if (monete) premi.push(`<li><i class="fa-solid fa-coins"></i> ${monete}</li>`);
    if (r.pe) premi.push(`<li><i class="fa-solid fa-star"></i> ${r.pe} ${esc(t("MQT.Premi.pe"))}</li>`);
    if (r.altro) premi.push(`<li><i class="fa-solid fa-gift"></i> ${esc(r.altro)}</li>`);
    for (const o of r.oggetti ?? []) premi.push(`<li><i class="fa-solid fa-box-open"></i> ${esc(o.nome)}${o.quantita > 1 ? ` ×${o.quantita}` : ""}</li>`);
    const rel = { relativeTo: d.pagina };
    return `<div class="mqt-azioni">
        <button type="button" data-action="attivaDef" data-chiave="${esc(chiave)}"><i class="fa-solid fa-flag"></i> ${esc(t("MQT.Pannello.attivaDef"))}</button>
        <button type="button" data-action="attivaMostraDef" data-chiave="${esc(chiave)}"><i class="fa-solid fa-eye"></i> ${esc(t("MQT.Pannello.attivaMostraDef"))}</button>
        <button type="button" data-action="aggiungiDef" data-chiave="${esc(chiave)}"><i class="fa-solid fa-plus"></i> ${esc(t("MQT.Pannello.aggiungiDef"))}</button>
        <button type="button" data-action="diarioDef" data-chiave="${esc(chiave)}"><i class="fa-solid fa-book-open"></i> ${esc(t("MQT.Scheda.apriDiario"))}</button></div>
      <p class="mqt-nota"><i class="fa-solid fa-book"></i> ${esc(t("MQT.Pannello.anteprimaDef"))}</p>
      <div class="mqt-anteprima-def">${def.immagine ? `<img class="mqt-immagine" src="${esc(def.immagine)}">` : ""}
        <h2>${esc(def.titolo)}</h2>
        ${def.zona ? `<p><strong>${esc(t("MQT.Campi.zona"))}:</strong> ${esc(def.zona)}</p>` : ""}
        ${def.png?.length ? `<p><strong>${esc(t("MQT.Campi.png"))}:</strong> ${def.png.map(esc).join(", ")}</p>` : ""}
        ${def.riassunto ? `<p class="mqt-riassunto">${esc(def.riassunto)}</p>` : ""}
        <div class="mqt-descrizione">${await arricchisci(def.descrizione ?? "", rel)}</div>
        ${def.noteMaster ? `<div class="mqt-note-master"><h3><i class="fa-solid fa-user-secret"></i> ${esc(t("MQT.Campi.noteMaster"))}</h3>${await arricchisci(def.noteMaster, rel)}</div>` : ""}
        ${ob ? `<h3>${esc(t("MQT.Campi.obiettivi"))}</h3><ul>${ob}</ul>` : ""}
        ${premi.length ? `<h3>${esc(t("MQT.Campi.ricompense"))}</h3><ul class="mqt-premi">${premi.join("")}</ul>` : ""}</div>`;
  }

  _onFirstRender() {
    const el = this.element;
    el.addEventListener("input", ev => {
      if (ev.target.classList.contains("mqt-cerca")) { this.filtro.testo = ev.target.value; this.#applicaFiltri(); }
    });
    el.addEventListener("change", ev => this.#cambiato(ev));
    el.addEventListener("keydown", ev => {
      if (ev.key === "Enter" && ev.target.classList.contains("mqt-nuovo-png") && ev.target.value.trim()) {
        ev.preventDefault();
        const nome = ev.target.value.trim();
        modifica(this.scelta, m => { m.png.push(nome); });
      }
    });
    el.addEventListener("dragover", ev => { if (ev.target.closest(".mqt-rilascio")) ev.preventDefault(); });
    el.addEventListener("drop", ev => this.#rilascio(ev));
  }

  #applicaFiltri() {
    const el = this.element;
    if (!el) return;
    const q = normalizza(this.filtro.testo), parole = q.split(/\s+/).filter(Boolean);
    for (const li of el.querySelectorAll(".mqt-elenco li[data-cerca]")) {
      const ok = parole.every(p => li.dataset.cerca.includes(p))
        && (!this.filtro.zona || li.dataset.zona === this.filtro.zona)
        && (!this.filtro.png || li.dataset.png.split("|").includes(this.filtro.png))
        && (this.filtro.stato === "tutte" || li.dataset.stato === this.filtro.stato || li.classList.contains("mqt-def"));
      li.hidden = !ok;
    }
  }

  async #cambiato(ev) {
    const el = ev.target, d = el.dataset;
    if (el.classList.contains("mqt-filtro-zona")) { this.filtro.zona = el.value; return this.#applicaFiltri(); }
    if (el.classList.contains("mqt-filtro-png")) { this.filtro.png = el.value; return this.#applicaFiltri(); }
    if (!this.scelta || el.closest("prose-mirror")) return;
    const id = this.scelta;
    if (d.campo) return modifica(id, { [d.campo]: el.type === "checkbox" ? el.checked : el.value });
    if (d.obiettivoCampo) {
      const oid = el.closest("[data-obiettivo]").dataset.obiettivo;
      return modifica(id, m => { const o = m.obiettivi.find(x => x.id === oid); if (o) o[d.obiettivoCampo] = el.type === "checkbox" ? el.checked : el.value; });
    }
    if (d.premioCampo) {
      const pid = el.closest("[data-premio]").dataset.premio;
      return modifica(id, m => { const o = m.ricompense.oggetti.find(x => x.id === pid); if (o) o.quantita = Math.max(1, Math.floor(Number(el.value) || 1)); });
    }
    if (d.valuta) return modifica(id, m => { m.ricompense.valuta[d.valuta] = Math.max(0, Math.floor(Number(el.value) || 0)); });
    if (d.pe) return modifica(id, m => { m.ricompense.pe = Math.max(0, Math.floor(Number(el.value) || 0)); });
    if (d.premioAltro) return modifica(id, m => { m.ricompense.altro = el.value; });
    if (d.personaggio) return modifica(id, m => { m.personaggi = el.checked ? [...new Set([...m.personaggi, d.personaggio])] : m.personaggi.filter(x => x !== d.personaggio); });
  }

  /** Rilascio di oggetti (premi) o attori (PNG) trascinati da compendi, barra laterale o schede. */
  async #rilascio(ev) {
    const zona = ev.target.closest(".mqt-rilascio");
    if (!zona || !this.scelta) return;
    ev.preventDefault();
    const dati = datiTrascinati(ev);
    if (!dati?.uuid) return;
    const doc = await fromUuid(dati.uuid);
    if (!doc) return;
    if (zona.dataset.rilascio === "premi") {
      if (doc.documentName !== "Item") return ui.notifications.warn(t("MQT.Avvisi.soloOggetti"));
      await modifica(this.scelta, m => {
        const gia = m.ricompense.oggetti.find(o => o.uuid === doc.uuid);
        if (gia) gia.quantita += 1;
        else m.ricompense.oggetti.push({ id: nuovoId(), uuid: doc.uuid, nome: doc.name, img: doc.img, quantita: 1 });
      });
    } else if (zona.dataset.rilascio === "png") {
      if (doc.documentName !== "Actor") return ui.notifications.warn(t("MQT.Avvisi.soloAttori"));
      await modifica(this.scelta, m => { if (!m.png.includes(doc.uuid)) m.png.push(doc.uuid); });
    }
  }

  /* -------------------------------------------- */

  static async #nuova() {
    const m = await nuova({ titolo: t("MQT.Pannello.nuovaTitolo"), stato: "disponibile" });
    this.scelta = m.id;
    this.render();
  }

  static #scegli(ev, el) {
    if (ev.target.closest(".mqt-occhio")) return PannelloMissioni.#visibile.call(this, ev, el, el.dataset.id);
    this.scelta = el.dataset.id; this.sceltaDef = null;
    this.render();
  }

  static #filtroStato(ev, el) {
    this.filtro.stato = el.dataset.stato;
    for (const a of this.element.querySelectorAll(".mqt-stati a")) a.classList.toggle("attiva", a === el);
    this.#applicaFiltri();
  }

  static async #visibile(ev, el, id) {
    const m = trova(id ?? this.scelta);
    if (m) await modifica(m.id, { visibile: !m.visibile });
  }

  static async #elimina() {
    const m = trova(this.scelta);
    if (m && await conferma("MQT.Pannello.elimina", t("MQT.Domande.elimina", { titolo: esc(m.titolo) }))) { await elimina(m.id); this.scelta = null; }
  }

  static #immagine() {
    const m = trova(this.scelta);
    const FP = foundry.applications.apps?.FilePicker?.implementation ?? globalThis.FilePicker;
    new FP({ type: "image", current: m?.immagine ?? "", callback: percorso => modifica(this.scelta, { immagine: percorso }) }).render(true);
  }

  static #nuovoObiettivo() { return modifica(this.scelta, m => { m.obiettivi.push({ id: nuovoId(), testo: "", fatto: false, segreto: false }); }); }

  static #togliObiettivo(ev, el) {
    const oid = el.closest("[data-obiettivo]").dataset.obiettivo;
    return modifica(this.scelta, m => { m.obiettivi = m.obiettivi.filter(o => o.id !== oid); });
  }

  static #togliPremio(ev, el) {
    const pid = el.closest("[data-premio]").dataset.premio;
    return modifica(this.scelta, m => { m.ricompense.oggetti = m.ricompense.oggetti.filter(o => o.id !== pid); });
  }

  static async #apriPremio(ev, el) {
    const pid = el.closest("[data-premio]").dataset.premio;
    const o = trova(this.scelta)?.ricompense.oggetti.find(x => x.id === pid);
    const doc = o?.uuid ? await fromUuid(o.uuid) : null;
    doc?.sheet?.render(true);
  }

  static #togliPng(ev, el) {
    const i = Number(el.closest("[data-indice]").dataset.indice);
    return modifica(this.scelta, m => { m.png.splice(i, 1); });
  }

  static #scegliDef(ev, el) {
    this.sceltaDef = el.dataset.chiave; this.scelta = null;
    this.render();
  }

  static async #attivaMostraDef(ev, el) {
    const m = await daAvventura(el.closest("[data-chiave]").dataset.chiave, { stato: "attiva", visibile: true });
    if (m) { this.scelta = m.id; this.sceltaDef = null; this.render(); mostraATutti(m.id); }
  }

  static async #diarioDef(ev, el) {
    const d = definizione(el.closest("[data-chiave]").dataset.chiave);
    if (d) d.diario.sheet.render(true, { pageId: d.pagina.id });
  }

  static async #aggiungiDef(ev, el) {
    const m = await daAvventura(el.closest("[data-chiave]").dataset.chiave);
    if (m) { this.scelta = m.id; this.sceltaDef = null; this.render(); }
  }

  static async #attivaDef(ev, el) {
    const m = await daAvventura(el.closest("[data-chiave]").dataset.chiave, { stato: "attiva" });
    if (m) { this.scelta = m.id; this.sceltaDef = null; this.render(); }
  }
}

let PANNELLO = null;

export function apriPannello(id = null, chiaveDef = null) {
  if (!game.user.isGM) return ui.notifications.warn(t("MQT.Avvisi.soloMaster"));
  PANNELLO ??= new PannelloMissioni();
  if (id) { PANNELLO.scelta = id; PANNELLO.sceltaDef = null; }
  else if (chiaveDef) { PANNELLO.sceltaDef = chiaveDef; PANNELLO.scelta = null; }
  PANNELLO.render({ force: true });
  return PANNELLO;
}

let rimando = null;
export function ridisegnaPannello() {
  if (!PANNELLO?.rendered) return;
  // non si ridisegna mentre il master sta scrivendo in un campo: lo farà quando esce dal campo
  const attivo = document.activeElement;
  if (attivo && PANNELLO.element.contains(attivo) && (attivo.matches("input[type=text], input[type=search], textarea") || attivo.closest("prose-mirror"))) {
    attivo.addEventListener("blur", () => ridisegnaPannello(), { once: true });
    return;
  }
  clearTimeout(rimando);
  rimando = setTimeout(() => PANNELLO?.rendered && PANNELLO.render(), 50);
}
