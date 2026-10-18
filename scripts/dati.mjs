/**
 * MAGICAL QUEST TRACKER – dove stanno le missioni.
 *
 * Le missioni del mondo stanno nell'impostazione di mondo `missioni` = { id: missione }: le scrive solo il master,
 * tutti i client la ricevono e ognuno mostra solo ciò che può vedere.
 * Le MISSIONI DELLE AVVENTURE stanno nei diari dell'avventura stessa, non nel modulo: una pagina di diario con il flag
 *   flags["magical-quest-tracker"].missioni = [ { id, titolo, descrizione, zona, png, obiettivi, ricompense, … } ]
 * e, nel testo, il richiamo @Missione[id]{Testo}. Il tracker le trova da solo (definizioni()) e il master le attiva
 * dal pannello o dal diario stesso: in quel momento diventano missioni del mondo.
 */
import { MOD, completa, nuovoId } from "./costanti.mjs";

export const leggi = () => {
  try { return foundry.utils.deepClone(game.settings.get(MOD, "missioni") ?? {}); } catch (err) { return {}; }
};

export const elenco = () => Object.values(leggi()).map(completa).sort((a, b) => (a.ordine - b.ordine) || a.titolo.localeCompare(b.titolo));
export const trova = id => { const m = leggi()[id]; return m ? completa(m) : null; };

async function scrivi(tutte) { await game.settings.set(MOD, "missioni", tutte); }

export async function salva(m) {
  const tutte = leggi();
  const c = completa(m);
  c.aggiornata = Date.now();
  tutte[c.id] = c;
  await scrivi(tutte);
  return c;
}

export async function modifica(id, cambi) {
  const tutte = leggi();
  if (!tutte[id]) return null;
  const m = completa(tutte[id]);
  if (typeof cambi === "function") cambi(m); else Object.assign(m, cambi);
  m.aggiornata = Date.now();
  tutte[id] = completa(m);
  await scrivi(tutte);
  return tutte[id];
}

export async function elimina(id) {
  const tutte = leggi();
  delete tutte[id];
  await game.settings.set(MOD, "missioni", tutte);
}

export async function nuova(dati = {}) {
  const tutte = leggi();
  const ordine = Math.max(0, ...Object.values(tutte).map(m => Number(m.ordine) || 0)) + 1;
  return salva({ ...dati, id: nuovoId(), ordine, creata: Date.now() });
}

export async function duplica(id) {
  const m = trova(id);
  if (!m) return null;
  return nuova({ ...m, titolo: `${m.titolo} (2)`, stato: "disponibile", consegna: null, personaggi: [], origine: m.origine, chiave: null,
                 obiettivi: m.obiettivi.map(o => ({ ...o, id: nuovoId(), fatto: false })) });
}

/* -------------------------------------------- */
/*  Missioni scritte nelle avventure            */
/* -------------------------------------------- */

/** Tutte le definizioni presenti nei diari del mondo: [{ def, pagina, diario }]. */
export function definizioni() {
  const out = [], visti = new Set();   // la stessa missione può essere copiata in più diari: conta una volta
  for (const j of game.journal ?? []) {
    for (const p of j.pages ?? []) {
      const lista = p.getFlag?.(MOD, "missioni");
      if (!Array.isArray(lista)) continue;
      for (const def of lista) if (def?.id && !visti.has(def.id)) { visti.add(def.id); out.push({ def, pagina: p, diario: j }); }
    }
  }
  return out;
}

/** La missione del mondo nata da una definizione (o null se non è ancora stata aggiunta). */
export const daChiave = chiave => elenco().find(m => m.chiave === chiave) ?? null;

/** Definizione per id. */
export const definizione = chiave => definizioni().find(d => d.def.id === chiave) ?? null;

/** Aggiunge al tracker la missione di un'avventura (se non c'è già) e la restituisce. */
export async function daAvventura(chiave, cambi = {}) {
  const gia = daChiave(chiave);
  if (gia) return Object.keys(cambi).length ? modifica(gia.id, cambi) : gia;
  const d = definizione(chiave);
  if (!d) return null;
  const { id, ...resto } = foundry.utils.deepClone(d.def);
  return nuova({ ...resto, chiave, origine: d.pagina.uuid, ...cambi });
}
