/**
 * MAGICAL QUEST TRACKER  (modulo Foundry VTT 13 e 14)
 * ------------------------------------------------------------------------------------------
 * Diario delle missioni gestito dal master e visibile ai giocatori solo quando lui lo permette.
 *  - Pannello privato del master: tutte le missioni, ricerca per nome, zona, descrizione e PNG, filtri per zona, PNG
 *    e stato; crea, modifica, attiva, completa, fallisce, duplica, elimina; obiettivi (anche segreti); premi con oggetti
 *    trascinati da qualsiasi compendio, valuta e punti esperienza; personaggi che seguono la missione.
 *  - A missione completata la consegna dei premi: chi riceve quale oggetto, valuta e PE in parti uguali o a scelta;
 *    tutto finisce da solo nelle schede (D&D 5e) e il resoconto va in chat.
 *  - Riquadro in cima alla sezione dei Diari e scheda della missione per i giocatori, con le loro note personali.
 *  - Missioni già scritte nelle avventure (flag della pagina di diario + richiamo @Missione[id]): si attivano dal
 *    pannello o direttamente dal diario.
 *
 * API:  game.modules.get("magical-quest-tracker").api
 *   .pannello(id?)  .scheda(id)  .missioni()  .trova(id)  .crea({titolo, …})  .modifica(id, cambi)  .elimina(id)
 *   .attiva(id)  .completa(id)  (apre la consegna)  .fallita(id)  .mostra(id)  .definizioni()  .daAvventura(chiave, cambi)
 */
import { MOD, log } from "./costanti.mjs";
import { registraImpostazioni } from "./impostazioni.mjs";
import { applicaLinguaForzata } from "./lingua.mjs";
import { registraDiari, ridisegnaDiari } from "./diari.mjs";
import { registraSocket, mostraATutti } from "./socket.mjs";
import { apriPannello } from "./pannello.mjs";
import { apriScheda } from "./scheda.mjs";
import { apriConsegna } from "./consegna.mjs";
import { elenco, trova, nuova, modifica, elimina, definizioni, daAvventura } from "./dati.mjs";

Hooks.once("init", () => {
  log("inizializzazione");
  registraImpostazioni();
  registraDiari();
});

Hooks.once("i18nInit", () => applicaLinguaForzata());

// Pulsante nella barra a sinistra (Note dei diari e Token), solo master.
Hooks.on("getSceneControlButtons", controls => {
  if (!game.user.isGM) return;
  for (const nome of ["notes", "tokens"]) {
    const g = controls[nome];
    if (!g?.tools) continue;
    g.tools.magicalQuestTracker = {
      name: "magicalQuestTracker", title: "MQT.Pannello.pulsante", icon: "fa-solid fa-scroll",
      order: Object.keys(g.tools).length + 1, button: true, visible: true, onChange: () => apriPannello()
    };
  }
});

// Il riquadro dei diari si aggiorna anche quando cambiano i diari (missioni delle avventure importate).
for (const h of ["createJournalEntry", "deleteJournalEntry", "createJournalEntryPage", "updateJournalEntryPage", "deleteJournalEntryPage"]) {
  Hooks.on(h, () => ridisegnaDiari());
}

Hooks.once("ready", () => {
  registraSocket();
  game.modules.get(MOD).api = {
    pannello: id => apriPannello(id),
    scheda: id => apriScheda(id),
    missioni: () => elenco(),
    trova: id => trova(id),
    crea: dati => nuova(dati),
    modifica: (id, cambi) => modifica(id, cambi),
    elimina: id => elimina(id),
    attiva: id => modifica(id, { stato: "attiva" }),
    completa: id => apriConsegna(id),
    fallita: id => modifica(id, { stato: "fallita" }),
    mostra: id => mostraATutti(id),
    definizioni: () => definizioni().map(d => ({ ...d.def, pagina: d.pagina.uuid })),
    daAvventura: (chiave, cambi) => daAvventura(chiave, cambi)
  };
  ridisegnaDiari();
});
