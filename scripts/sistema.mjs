/**
 * MAGICAL QUEST TRACKER – consegna dei premi alle schede, sistema per sistema.
 *
 * D&D 5e: oggetti nell'inventario (quantità sommata se il personaggio ha già lo stesso oggetto), monete in
 * system.currency (mp, mo, me, ma, mr) e punti esperienza in system.details.xp.value.
 * Altri sistemi: gli oggetti si consegnano lo stesso (con la quantità se il sistema ne ha una), valuta e PE si scrivono
 * nel resoconto in chat perché il master li annoti a mano.
 */
import { t } from "./costanti.mjs";

const dnd5e = () => game.system.id === "dnd5e";

/** Monete del sistema: [{ chiave, nome }] in ordine dal valore più alto. */
export function valute() {
  if (dnd5e()) {
    const c = CONFIG.DND5E?.currencies ?? {};
    const ordine = ["pp", "gp", "ep", "sp", "cp"];
    return ordine.map(k => ({ chiave: k, nome: c[k]?.abbreviation ? game.i18n.localize(c[k].abbreviation) : k, completo: c[k]?.label ? game.i18n.localize(c[k].label) : k }));
  }
  return [{ chiave: "valuta", nome: t("MQT.Premi.valuta"), completo: t("MQT.Premi.valuta") }];
}

export const haPE = () => dnd5e();
export const valutaAutomatica = () => dnd5e();

/** Personaggi dei giocatori: attori di tipo personaggio con almeno un proprietario non master. */
export function personaggiGiocatori() {
  const assegnati = new Set(game.users.filter(u => !u.isGM && u.character).map(u => u.character.id));
  return game.actors.filter(a => assegnati.has(a.id) || (a.hasPlayerOwner && (a.type === "character" || !dnd5e())))
    .sort((a, b) => a.name.localeCompare(b.name));
}

/** Dati di un oggetto dal suo uuid (compendio o mondo), pronti da creare in una scheda. */
export async function datiOggetto(uuid) {
  const doc = await fromUuid(uuid);
  if (!doc) return null;
  const d = doc.toObject();
  delete d._id;
  d._stats = { ...(d._stats ?? {}), compendiumSource: doc.pack ? doc.uuid : (d._stats?.compendiumSource ?? null) };
  return d;
}

/** Aggiunge un oggetto a un attore: se ne ha già uno uguale (stesso nome e tipo) aumenta la quantità. */
export async function daiOggetto(actor, uuid, quantita) {
  const dati = await datiOggetto(uuid);
  if (!dati) return false;
  const haQuantita = foundry.utils.hasProperty(dati, "system.quantity");
  const uguale = actor.items.find(i => i.name === dati.name && i.type === dati.type && foundry.utils.hasProperty(i, "system.quantity"));
  if (haQuantita && uguale) {
    await uguale.update({ "system.quantity": (Number(uguale.system.quantity) || 0) + quantita });
    return true;
  }
  if (haQuantita) {
    dati.system.quantity = quantita;
    await actor.createEmbeddedDocuments("Item", [dati]);
  } else {
    await actor.createEmbeddedDocuments("Item", Array.from({ length: quantita }, () => foundry.utils.deepClone(dati)));
  }
  return true;
}

/** Aggiunge monete a un attore (solo D&D 5e). valuta = { gp: 10, sp: 5 }. */
export async function daiValuta(actor, valuta) {
  if (!dnd5e()) return false;
  const cambi = {};
  for (const [k, v] of Object.entries(valuta)) {
    if (!v) continue;
    cambi[`system.currency.${k}`] = (Number(foundry.utils.getProperty(actor, `system.currency.${k}`)) || 0) + v;
  }
  if (Object.keys(cambi).length) await actor.update(cambi);
  return true;
}

/** Aggiunge punti esperienza (solo D&D 5e). */
export async function daiPE(actor, pe) {
  if (!dnd5e() || !pe) return false;
  await actor.update({ "system.details.xp.value": (Number(actor.system?.details?.xp?.value) || 0) + pe });
  return true;
}

/**
 * Divide una quantità intera fra n persone in parti uguali; il resto va ai primi.
 * @returns {number[]}
 */
export function partiUguali(totale, n) {
  if (n <= 0) return [];
  const base = Math.floor(totale / n), resto = totale - base * n;
  return Array.from({ length: n }, (_, i) => base + (i < resto ? 1 : 0));
}
