/**
 * MAGICAL QUEST TRACKER – costanti e piccole utilità condivise.
 */
export const MOD = "magical-quest-tracker";
export const log = (...a) => console.log("Magical Quest Tracker |", ...a);
export const t = (k, d) => (d ? game.i18n.format(k, d) : game.i18n.localize(k));
export const esc = s => foundry.utils.escapeHTML?.(String(s ?? "")) ?? String(s ?? "").replace(/[&<>"']/g, c => `&#${c.charCodeAt(0)};`);
export const nuovoId = () => foundry.utils.randomID(16);
export const sonoIlGmAttivo = () => game.users.activeGM?.isSelf ?? game.user.isGM;

/** Stati di una missione, nell'ordine in cui si mostrano. */
export const STATI = ["disponibile", "attiva", "completata", "fallita"];
export const ICONE_STATO = { disponibile: "fa-solid fa-scroll", attiva: "fa-solid fa-flag", completata: "fa-solid fa-circle-check", fallita: "fa-solid fa-circle-xmark" };

/** Testo semplice da un HTML (ricerca e anteprime). */
export function soloTesto(html) {
  const d = document.createElement("div");
  d.innerHTML = String(html ?? "");
  return (d.textContent ?? "").replace(/\s+/g, " ").trim();
}

/** Testo per la ricerca: minuscolo e senza accenti. */
export const normalizza = s => String(s ?? "").normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().trim();

/** Una missione completa di tutti i campi (anche quelle salvate da versioni vecchie o scritte a mano nelle avventure). */
export function completa(m = {}) {
  const r = m.ricompense ?? {};
  return {
    id: m.id || nuovoId(),
    titolo: m.titolo ?? "",
    descrizione: m.descrizione ?? "",
    riassunto: m.riassunto ?? "",
    zona: m.zona ?? "",
    png: Array.isArray(m.png) ? m.png.filter(Boolean) : (m.png ? [m.png] : []),
    immagine: m.immagine ?? "",
    origine: m.origine ?? null,          // uuid della pagina di diario da cui viene (missioni delle avventure)
    chiave: m.chiave ?? null,            // id della definizione nell'avventura
    stato: STATI.includes(m.stato) ? m.stato : "disponibile",
    visibile: !!m.visibile,              // i giocatori la vedono
    premiVisibili: m.premiVisibili !== false,
    obiettivi: (m.obiettivi ?? []).map(o => ({ id: o.id || nuovoId(), testo: o.testo ?? "", fatto: !!o.fatto, segreto: !!o.segreto })),
    ricompense: {
      oggetti: (r.oggetti ?? []).map(o => ({ id: o.id || nuovoId(), uuid: o.uuid ?? null, nome: o.nome ?? "", img: o.img ?? "", quantita: Math.max(1, Number(o.quantita) || 1) })),
      valuta: Object.fromEntries(Object.entries(r.valuta ?? {}).map(([k, v]) => [k, Math.max(0, Number(v) || 0)])),
      pe: Math.max(0, Number(r.pe) || 0),
      altro: r.altro ?? ""
    },
    scadenza: m.scadenza ?? "",
    personaggi: Array.isArray(m.personaggi) ? m.personaggi : [],
    consegna: m.consegna ?? null,        // resoconto di chi ha ricevuto cosa
    ordine: Number(m.ordine) || 0,
    creata: m.creata ?? Date.now(),
    aggiornata: m.aggiornata ?? Date.now()
  };
}
