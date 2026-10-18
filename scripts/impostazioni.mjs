/**
 * MAGICAL QUEST TRACKER – impostazioni e tasti.
 * Si trovano in: Impostazioni di gioco → Configura impostazioni → Magical Quest Tracker.
 */
import { MOD } from "./costanti.mjs";
import { NOMI_LINGUE } from "./lingue-dati.mjs";
import { ridisegnaPannello, apriPannello } from "./pannello.mjs";
import { ridisegnaSchede } from "./scheda.mjs";
import { ridisegnaDiari } from "./diari.mjs";

export function registraImpostazioni() {
  game.settings.register(MOD, "lingua", {
    name: "MQT.Impostazioni.lingua.nome", hint: "MQT.Impostazioni.lingua.hint",
    scope: "client", config: true, type: String, default: "auto",
    choices: { auto: "MQT.Impostazioni.lingua.auto", ...NOMI_LINGUE }, requiresReload: true
  });

  // Tutte le missioni del mondo (le scrive solo il master).
  game.settings.register(MOD, "missioni", {
    scope: "world", config: false, type: Object, default: {},
    onChange: () => { ridisegnaPannello(); ridisegnaSchede(); ridisegnaDiari(); }
  });

  // Riquadro delle missioni in cima alla sezione dei Diari.
  game.settings.register(MOD, "nelDiario", {
    name: "MQT.Impostazioni.nelDiario.nome", hint: "MQT.Impostazioni.nelDiario.hint",
    scope: "world", config: true, type: Boolean, default: true,
    onChange: () => ui.journal?.render()
  });

  // Gruppi del riquadro chiusi da questo utente.
  game.settings.register(MOD, "gruppiChiusi", { scope: "client", config: false, type: Object, default: {} });

  game.keybindings.register(MOD, "pannello", {
    name: "MQT.Impostazioni.tastoPannello.nome", hint: "MQT.Impostazioni.tastoPannello.hint",
    editable: [], restricted: true,
    onDown: () => { apriPannello(); return true; }
  });
}
