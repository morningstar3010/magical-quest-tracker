/**
 * MAGICAL QUEST TRACKER – lingua forzata: con l'impostazione «Lingua di Magical Quest Tracker» si usano i testi
 * di un'altra lingua, presi da lingue-dati.mjs, al posto di quelli caricati da Foundry. Cambia SOLO i testi del modulo.
 */
import { MOD, log } from "./costanti.mjs";
import { TESTI } from "./lingue-dati.mjs";

export function applicaLinguaForzata() {
  let scelta = "auto";
  try { scelta = game.settings.get(MOD, "lingua"); } catch (err) { return; }
  if (!scelta || scelta === "auto" || !TESTI[scelta]) return;
  const tr = game.i18n.translations;
  tr.MQT = foundry.utils.mergeObject(tr.MQT ?? {}, foundry.utils.deepClone(TESTI[scelta].MQT), { inplace: false });
  log(`lingua forzata: ${scelta}`);
}
