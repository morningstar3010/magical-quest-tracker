/**
 * MAGICAL QUEST TRACKER – messaggi fra i client.
 * «Mostra ai giocatori»: il master apre a tutti la scheda di una missione (solo a chi può vederla).
 */
import { MOD } from "./costanti.mjs";
import { apriScheda } from "./scheda.mjs";
import { trova } from "./dati.mjs";

const SOCKET = `module.${MOD}`;

export function mostraATutti(id) {
  const m = trova(id);
  if (!m) return;
  if (!m.visibile) return ui.notifications.warn(game.i18n.localize("MQT.Avvisi.primaVisibile"));
  game.socket.emit(SOCKET, { azione: "mostra", id });
  apriScheda(id);
}

export function registraSocket() {
  game.socket.on(SOCKET, msg => {
    if (msg?.azione === "mostra" && msg.id) apriScheda(msg.id);
  });
}
