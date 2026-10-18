/**
 * MAGICAL QUEST TRACKER – arricchimento dei testi (collegamenti @UUID, tiri, ecc.) uguale in Foundry 13 e 14.
 */
export function editorTesti() {
  return foundry.applications?.ux?.TextEditor?.implementation ?? globalThis.TextEditor;
}

export async function arricchisci(html, opzioni = {}) {
  if (!html) return "";
  try { return await editorTesti().enrichHTML(html, { secrets: game.user.isGM, ...opzioni }); }
  catch (err) { return html; }
}

/** Dati trascinati (oggetti, attori) da un evento di rilascio. */
export function datiTrascinati(ev) {
  try { return editorTesti().getDragEventData(ev); }
  catch (err) { try { return JSON.parse(ev.dataTransfer.getData("text/plain")); } catch (e) { return null; } }
}
