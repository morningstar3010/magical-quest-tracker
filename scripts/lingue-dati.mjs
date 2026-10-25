/**
 * MAGICAL QUEST TRACKER – tutti i testi in tutte le lingue (file creato da strumenti/lingue.py, non modificarlo a mano).
 * Serve all'impostazione «Lingua di Magical Quest Tracker» per usare una lingua diversa da quella di Foundry.
 */
export const NOMI_LINGUE = {"en": "English", "it": "Italiano", "de": "Deutsch", "es": "Español"};

export const TESTI = {
 "en": {
  "MQT": {
   "Titolo": "Magical Quest Tracker",
   "Missione": "Quest",
   "Comune": {
    "si": "Yes",
    "no": "No",
    "annulla": "Cancel"
   },
   "Stati": {
    "disponibile": "Available",
    "attiva": "Active",
    "completata": "Completed",
    "fallita": "Failed"
   },
   "StatiPlurale": {
    "disponibile": "Available",
    "attiva": "In progress",
    "completata": "Completed",
    "fallita": "Failed"
   },
   "Campi": {
    "titolo": "Title",
    "stato": "Status",
    "visibile": "Visible to players",
    "zona": "Area",
    "png": "Non-player characters",
    "riassunto": "Summary",
    "descrizione": "Description",
    "immagine": "Image",
    "obiettivi": "Objectives",
    "segreto": "Secret: only the GM sees it",
    "ricompense": "Rewards",
    "altro": "Other rewards",
    "premiVisibili": "Rewards visible to players",
    "scadenza": "Deadline",
    "personaggi": "Followed by",
    "noteMaster": "GM notes (only you)"
   },
   "Premi": {
    "valuta": "Currency",
    "pe": "XP"
   },
   "Pannello": {
    "titolo": "Magical Quest Tracker – GM panel",
    "pulsante": "Magical Quest Tracker",
    "nuova": "New quest",
    "nuovaTitolo": "New quest",
    "senzaTitolo": "(untitled)",
    "cerca": "Search by name, area, description or NPC",
    "tutteZone": "All areas",
    "tuttiPng": "All NPCs",
    "tutte": "All",
    "nessuna": "No quests. Press «New quest» or add one from the adventures.",
    "dalleAvventure": "Adventure quests",
    "aggiungiDef": "Add to the tracker",
    "attivaDef": "Activate now",
    "anteprimaDef": "Quest written in the adventure and not yet in the tracker: add or activate it to edit it.",
    "attivaMostraDef": "Activate and show to players",
    "daAvventura": "This quest comes from an adventure: «Open the journal» in its sheet leads to the page where it is written.",
    "scegliUna": "Choose a quest on the left to see and edit it.",
    "attiva": "Activate",
    "completa": "Completed…",
    "fallita": "Failed",
    "riapri": "Reopen",
    "rendiVisibile": "Show in the players' journals",
    "nascondi": "Hide from players",
    "visibile": "Visible to players",
    "nascosta": "Hidden from players",
    "mostra": "Open for players",
    "scheda": "Sheet",
    "duplica": "Duplicate",
    "elimina": "Delete",
    "pngPlaceholder": "Type a name and press Enter, or drop an actor here",
    "nuovoObiettivo": "New objective",
    "nessunObiettivo": "No objectives (optional).",
    "trascinaOggetti": "Drop items here from any compendium or from the Items sidebar; change the quantity next to them.",
    "scadenzaPlaceholder": "For example: before the new moon (optional)"
   },
   "Scheda": {
    "nonDisponibile": "This quest is not available.",
    "premiNascosti": "Players do not see the rewards",
    "consegnato": "Rewards given",
    "note": "My notes",
    "notePlaceholder": "Your own notes: only you can see them.",
    "apriDiario": "Open the journal",
    "modifica": "Edit"
   },
   "Consegna": {
    "titolo": "Quest completed: {titolo}",
    "spiega": "Choose who receives the rewards. Items go into the inventory, currency and experience points are added to the sheet.",
    "chi": "Who receives the rewards",
    "nessunPG": "No player characters in the world.",
    "oggetti": "Items",
    "totale": "Total",
    "uguali": "split equally",
    "mano": "I decide",
    "aMano": "In this game system currency and experience points are not added automatically: they are written in the chat report.",
    "consegna": "Give the rewards and complete",
    "senzaPremi": "Complete without rewards",
    "daDareAMano": "to give by hand",
    "chat": "Quest completed: {titolo}"
   },
   "Diari": {
    "titolo": "Quests",
    "nessuna": "No quests in progress.",
    "daAttivare": "to activate",
    "attivaOra": "Activate",
    "attivaMostra": "Activate and show to players",
    "soloAggiungi": "Add without activating"
   },
   "Domande": {
    "elimina": "Delete the quest «{titolo}»?"
   },
   "Avvisi": {
    "soloMaster": "Only the GM can use the quest panel.",
    "soloOggetti": "Only items can be dropped here.",
    "soloAttori": "Only actors can be dropped here.",
    "troppi": "«{nome}»: you assigned more than {n}.",
    "diarioNonTrovato": "The journal of this quest is no longer in the world.",
    "primaVisibile": "Make the quest visible to players first.",
    "nonAncora": "This quest has not been revealed yet.",
    "definizioneNonTrovata": "Quest «{chiave}» not found in the journals.",
    "aggiunta": "Quest added to the tracker: {titolo}."
   },
   "Impostazioni": {
    "lingua": {
     "nome": "Magical Quest Tracker language",
     "hint": "Language of this module's texts. «Automatic» follows Foundry's language.",
     "auto": "Automatic"
    },
    "nelDiario": {
     "nome": "Quests at the top of the Journals",
     "hint": "Shows the quest box at the top of the Journals sidebar (players only see the visible ones)."
    },
    "tastoPannello": {
     "nome": "Open the quest panel",
     "hint": "GM only."
    }
   }
  }
 },
 "it": {
  "MQT": {
   "Titolo": "Magical Quest Tracker",
   "Missione": "Missione",
   "Comune": {
    "si": "Sì",
    "no": "No",
    "annulla": "Annulla"
   },
   "Stati": {
    "disponibile": "Disponibile",
    "attiva": "Attiva",
    "completata": "Completata",
    "fallita": "Fallita"
   },
   "StatiPlurale": {
    "disponibile": "Disponibili",
    "attiva": "In corso",
    "completata": "Completate",
    "fallita": "Fallite"
   },
   "Campi": {
    "titolo": "Titolo",
    "stato": "Stato",
    "visibile": "Visibile ai giocatori",
    "zona": "Zona",
    "png": "Personaggi non giocanti",
    "riassunto": "Riassunto",
    "descrizione": "Descrizione",
    "immagine": "Immagine",
    "obiettivi": "Obiettivi",
    "segreto": "Segreto: lo vede solo il master",
    "ricompense": "Premi",
    "altro": "Altri premi",
    "premiVisibili": "Premi visibili ai giocatori",
    "scadenza": "Scadenza",
    "personaggi": "La seguono",
    "noteMaster": "Note del master (solo tu)"
   },
   "Premi": {
    "valuta": "Valuta",
    "pe": "PE"
   },
   "Pannello": {
    "titolo": "Magical Quest Tracker – Pannello del master",
    "pulsante": "Magical Quest Tracker",
    "nuova": "Nuova missione",
    "nuovaTitolo": "Nuova missione",
    "senzaTitolo": "(senza titolo)",
    "cerca": "Cerca per nome, zona, descrizione o PNG",
    "tutteZone": "Tutte le zone",
    "tuttiPng": "Tutti i PNG",
    "tutte": "Tutte",
    "nessuna": "Nessuna missione. Premi «Nuova missione» o aggiungine una dalle avventure.",
    "dalleAvventure": "Missioni delle avventure",
    "aggiungiDef": "Aggiungi al tracker",
    "attivaDef": "Attiva subito",
    "anteprimaDef": "Missione scritta nell'avventura e non ancora nel tracker: aggiungila o attivala per modificarla.",
    "attivaMostraDef": "Attiva e mostra ai giocatori",
    "daAvventura": "Questa missione viene da un'avventura: «Apri il diario» nella scheda porta alla pagina dove è scritta.",
    "scegliUna": "Scegli una missione a sinistra per vederla e modificarla.",
    "attiva": "Attiva",
    "completa": "Completata…",
    "fallita": "Fallita",
    "riapri": "Riapri",
    "rendiVisibile": "Mostra nei diari dei giocatori",
    "nascondi": "Nascondi ai giocatori",
    "visibile": "Visibile ai giocatori",
    "nascosta": "Nascosta ai giocatori",
    "mostra": "Apri ai giocatori",
    "scheda": "Scheda",
    "duplica": "Duplica",
    "elimina": "Elimina",
    "pngPlaceholder": "Scrivi un nome e premi Invio, oppure trascina qui un attore",
    "nuovoObiettivo": "Nuovo obiettivo",
    "nessunObiettivo": "Nessun obiettivo (facoltativi).",
    "trascinaOggetti": "Trascina qui gli oggetti da qualsiasi compendio o dalla barra degli oggetti; la quantità si cambia accanto.",
    "scadenzaPlaceholder": "Per esempio: entro la luna nuova (facoltativa)"
   },
   "Scheda": {
    "nonDisponibile": "Questa missione non è disponibile.",
    "premiNascosti": "I giocatori non vedono i premi",
    "consegnato": "Premi consegnati",
    "note": "Le mie note",
    "notePlaceholder": "Appunti tuoi: li vedi solo tu.",
    "apriDiario": "Apri il diario",
    "modifica": "Modifica"
   },
   "Consegna": {
    "titolo": "Missione completata: {titolo}",
    "spiega": "Scegli chi riceve i premi. Gli oggetti vanno nell'inventario, la valuta e i punti esperienza si sommano nella scheda.",
    "chi": "Chi riceve i premi",
    "nessunPG": "Nessun personaggio dei giocatori nel mondo.",
    "oggetti": "Oggetti",
    "totale": "Totale",
    "uguali": "in parti uguali",
    "mano": "decido io",
    "aMano": "In questo sistema di gioco valuta e punti esperienza non si sommano da soli: sono scritti nel resoconto in chat.",
    "consegna": "Consegna i premi e completa",
    "senzaPremi": "Completa senza premi",
    "daDareAMano": "da consegnare a mano",
    "chat": "Missione completata: {titolo}"
   },
   "Diari": {
    "titolo": "Missioni",
    "nessuna": "Nessuna missione in corso.",
    "daAttivare": "da attivare",
    "attivaOra": "Attiva",
    "attivaMostra": "Attiva e mostra ai giocatori",
    "soloAggiungi": "Aggiungi senza attivare"
   },
   "Domande": {
    "elimina": "Eliminare la missione «{titolo}»?"
   },
   "Avvisi": {
    "soloMaster": "Solo il master può usare il pannello delle missioni.",
    "soloOggetti": "Qui si possono trascinare solo oggetti.",
    "soloAttori": "Qui si possono trascinare solo attori.",
    "troppi": "«{nome}»: ne hai assegnati più di {n}.",
    "diarioNonTrovato": "Il diario di questa missione non c'è più nel mondo.",
    "primaVisibile": "Rendi prima la missione visibile ai giocatori.",
    "nonAncora": "Questa missione non è ancora stata rivelata.",
    "definizioneNonTrovata": "Missione «{chiave}» non trovata nei diari.",
    "aggiunta": "Missione aggiunta al tracker: {titolo}."
   },
   "Impostazioni": {
    "lingua": {
     "nome": "Lingua di Magical Quest Tracker",
     "hint": "Lingua dei testi di questo modulo. «Automatica» segue la lingua di Foundry.",
     "auto": "Automatica"
    },
    "nelDiario": {
     "nome": "Missioni in cima ai Diari",
     "hint": "Mostra il riquadro delle missioni in cima alla sezione dei Diari (i giocatori vedono solo quelle rese visibili)."
    },
    "tastoPannello": {
     "nome": "Apri il pannello delle missioni",
     "hint": "Solo per il master."
    }
   }
  }
 },
 "de": {
  "MQT": {
   "Titolo": "Magical Quest Tracker",
   "Missione": "Quest",
   "Comune": {
    "si": "Ja",
    "no": "Nein",
    "annulla": "Abbrechen"
   },
   "Stati": {
    "disponibile": "Verfügbar",
    "attiva": "Aktiv",
    "completata": "Abgeschlossen",
    "fallita": "Gescheitert"
   },
   "StatiPlurale": {
    "disponibile": "Verfügbar",
    "attiva": "Laufend",
    "completata": "Abgeschlossen",
    "fallita": "Gescheitert"
   },
   "Campi": {
    "titolo": "Titel",
    "stato": "Status",
    "visibile": "Für Spieler sichtbar",
    "zona": "Gebiet",
    "png": "Nichtspielercharaktere",
    "riassunto": "Zusammenfassung",
    "descrizione": "Beschreibung",
    "immagine": "Bild",
    "obiettivi": "Ziele",
    "segreto": "Geheim: nur die SL sieht es",
    "ricompense": "Belohnungen",
    "altro": "Weitere Belohnungen",
    "premiVisibili": "Belohnungen für Spieler sichtbar",
    "scadenza": "Frist",
    "personaggi": "Verfolgt von",
    "noteMaster": "SL-Notizen (nur du)"
   },
   "Premi": {
    "valuta": "Währung",
    "pe": "EP"
   },
   "Pannello": {
    "titolo": "Magical Quest Tracker – SL-Panel",
    "pulsante": "Magical Quest Tracker",
    "nuova": "Neue Quest",
    "nuovaTitolo": "Neue Quest",
    "senzaTitolo": "(ohne Titel)",
    "cerca": "Suche nach Name, Gebiet, Beschreibung oder NSC",
    "tutteZone": "Alle Gebiete",
    "tuttiPng": "Alle NSC",
    "tutte": "Alle",
    "nessuna": "Keine Quests. Drücke «Neue Quest» oder füge eine aus den Abenteuern hinzu.",
    "dalleAvventure": "Quests der Abenteuer",
    "aggiungiDef": "Zum Tracker hinzufügen",
    "attivaDef": "Sofort aktivieren",
    "anteprimaDef": "Im Abenteuer geschriebene Quest, noch nicht im Tracker: füge sie hinzu oder aktiviere sie, um sie zu bearbeiten.",
    "attivaMostraDef": "Aktivieren und den Spielern zeigen",
    "daAvventura": "Diese Quest stammt aus einem Abenteuer: «Journal öffnen» im Blatt führt zur Seite, auf der sie steht.",
    "scegliUna": "Wähle links eine Quest, um sie zu sehen und zu bearbeiten.",
    "attiva": "Aktivieren",
    "completa": "Abgeschlossen…",
    "fallita": "Gescheitert",
    "riapri": "Wieder öffnen",
    "rendiVisibile": "In den Journalen der Spieler zeigen",
    "nascondi": "Vor den Spielern verbergen",
    "visibile": "Für Spieler sichtbar",
    "nascosta": "Vor Spielern verborgen",
    "mostra": "Für Spieler öffnen",
    "scheda": "Blatt",
    "duplica": "Duplizieren",
    "elimina": "Löschen",
    "pngPlaceholder": "Name eingeben und Enter drücken, oder einen Akteur hierher ziehen",
    "nuovoObiettivo": "Neues Ziel",
    "nessunObiettivo": "Keine Ziele (optional).",
    "trascinaOggetti": "Ziehe Gegenstände aus einem beliebigen Kompendium oder der Gegenstandsleiste hierher; die Menge änderst du daneben.",
    "scadenzaPlaceholder": "Zum Beispiel: vor dem Neumond (optional)"
   },
   "Scheda": {
    "nonDisponibile": "Diese Quest ist nicht verfügbar.",
    "premiNascosti": "Die Spieler sehen die Belohnungen nicht",
    "consegnato": "Vergebene Belohnungen",
    "note": "Meine Notizen",
    "notePlaceholder": "Deine Notizen: nur du siehst sie.",
    "apriDiario": "Journal öffnen",
    "modifica": "Bearbeiten"
   },
   "Consegna": {
    "titolo": "Quest abgeschlossen: {titolo}",
    "spiega": "Wähle, wer die Belohnungen erhält. Gegenstände kommen ins Inventar, Währung und Erfahrungspunkte werden auf dem Bogen addiert.",
    "chi": "Wer erhält die Belohnungen",
    "nessunPG": "Keine Spielercharaktere in der Welt.",
    "oggetti": "Gegenstände",
    "totale": "Gesamt",
    "uguali": "zu gleichen Teilen",
    "mano": "ich entscheide",
    "aMano": "In diesem Spielsystem werden Währung und Erfahrungspunkte nicht automatisch addiert: sie stehen im Bericht im Chat.",
    "consegna": "Belohnungen vergeben und abschließen",
    "senzaPremi": "Ohne Belohnungen abschließen",
    "daDareAMano": "von Hand zu vergeben",
    "chat": "Quest abgeschlossen: {titolo}"
   },
   "Diari": {
    "titolo": "Quests",
    "nessuna": "Keine laufenden Quests.",
    "daAttivare": "zu aktivieren",
    "attivaOra": "Aktivieren",
    "attivaMostra": "Aktivieren und den Spielern zeigen",
    "soloAggiungi": "Hinzufügen ohne zu aktivieren"
   },
   "Domande": {
    "elimina": "Die Quest «{titolo}» löschen?"
   },
   "Avvisi": {
    "soloMaster": "Nur die SL kann das Quest-Panel benutzen.",
    "soloOggetti": "Hier können nur Gegenstände abgelegt werden.",
    "soloAttori": "Hier können nur Akteure abgelegt werden.",
    "troppi": "«{nome}»: du hast mehr als {n} vergeben.",
    "diarioNonTrovato": "Das Journal dieser Quest ist nicht mehr in der Welt.",
    "primaVisibile": "Mache die Quest zuerst für die Spieler sichtbar.",
    "nonAncora": "Diese Quest wurde noch nicht enthüllt.",
    "definizioneNonTrovata": "Quest «{chiave}» in den Journalen nicht gefunden.",
    "aggiunta": "Quest zum Tracker hinzugefügt: {titolo}."
   },
   "Impostazioni": {
    "lingua": {
     "nome": "Sprache von Magical Quest Tracker",
     "hint": "Sprache der Texte dieses Moduls. «Automatisch» folgt der Sprache von Foundry.",
     "auto": "Automatisch"
    },
    "nelDiario": {
     "nome": "Quests oben in den Journalen",
     "hint": "Zeigt den Quest-Kasten oben in der Journalleiste (Spieler sehen nur die sichtbaren)."
    },
    "tastoPannello": {
     "nome": "Quest-Panel öffnen",
     "hint": "Nur für die SL."
    }
   }
  }
 },
 "es": {
  "MQT": {
   "Titolo": "Magical Quest Tracker",
   "Missione": "Misión",
   "Comune": {
    "si": "Sí",
    "no": "No",
    "annulla": "Cancelar"
   },
   "Stati": {
    "disponibile": "Disponible",
    "attiva": "Activa",
    "completata": "Completada",
    "fallita": "Fallida"
   },
   "StatiPlurale": {
    "disponibile": "Disponibles",
    "attiva": "En curso",
    "completata": "Completadas",
    "fallita": "Fallidas"
   },
   "Campi": {
    "titolo": "Título",
    "stato": "Estado",
    "visibile": "Visible para los jugadores",
    "zona": "Zona",
    "png": "Personajes no jugadores",
    "riassunto": "Resumen",
    "descrizione": "Descripción",
    "immagine": "Imagen",
    "obiettivi": "Objetivos",
    "segreto": "Secreto: solo lo ve el DJ",
    "ricompense": "Recompensas",
    "altro": "Otras recompensas",
    "premiVisibili": "Recompensas visibles para los jugadores",
    "scadenza": "Plazo",
    "personaggi": "La siguen",
    "noteMaster": "Notas del DJ (solo tú)"
   },
   "Premi": {
    "valuta": "Moneda",
    "pe": "PX"
   },
   "Pannello": {
    "titolo": "Magical Quest Tracker – Panel del DJ",
    "pulsante": "Magical Quest Tracker",
    "nuova": "Nueva misión",
    "nuovaTitolo": "Nueva misión",
    "senzaTitolo": "(sin título)",
    "cerca": "Buscar por nombre, zona, descripción o PNJ",
    "tutteZone": "Todas las zonas",
    "tuttiPng": "Todos los PNJ",
    "tutte": "Todas",
    "nessuna": "No hay misiones. Pulsa «Nueva misión» o añade una de las aventuras.",
    "dalleAvventure": "Misiones de las aventuras",
    "aggiungiDef": "Añadir al tracker",
    "attivaDef": "Activar ahora",
    "anteprimaDef": "Misión escrita en la aventura y aún no en el tracker: añádela o actívala para editarla.",
    "attivaMostraDef": "Activar y mostrar a los jugadores",
    "daAvventura": "Esta misión viene de una aventura: «Abrir el diario» en su ficha lleva a la página donde está escrita.",
    "scegliUna": "Elige una misión a la izquierda para verla y editarla.",
    "attiva": "Activar",
    "completa": "Completada…",
    "fallita": "Fallida",
    "riapri": "Reabrir",
    "rendiVisibile": "Mostrar en los diarios de los jugadores",
    "nascondi": "Ocultar a los jugadores",
    "visibile": "Visible para los jugadores",
    "nascosta": "Oculta a los jugadores",
    "mostra": "Abrir a los jugadores",
    "scheda": "Ficha",
    "duplica": "Duplicar",
    "elimina": "Eliminar",
    "pngPlaceholder": "Escribe un nombre y pulsa Intro, o arrastra aquí un actor",
    "nuovoObiettivo": "Nuevo objetivo",
    "nessunObiettivo": "Sin objetivos (opcionales).",
    "trascinaOggetti": "Arrastra aquí objetos de cualquier compendio o de la barra de objetos; la cantidad se cambia al lado.",
    "scadenzaPlaceholder": "Por ejemplo: antes de la luna nueva (opcional)"
   },
   "Scheda": {
    "nonDisponibile": "Esta misión no está disponible.",
    "premiNascosti": "Los jugadores no ven las recompensas",
    "consegnato": "Recompensas entregadas",
    "note": "Mis notas",
    "notePlaceholder": "Tus apuntes: solo los ves tú.",
    "apriDiario": "Abrir el diario",
    "modifica": "Editar"
   },
   "Consegna": {
    "titolo": "Misión completada: {titolo}",
    "spiega": "Elige quién recibe las recompensas. Los objetos van al inventario; la moneda y los puntos de experiencia se suman en la ficha.",
    "chi": "Quién recibe las recompensas",
    "nessunPG": "No hay personajes de jugadores en el mundo.",
    "oggetti": "Objetos",
    "totale": "Total",
    "uguali": "a partes iguales",
    "mano": "decido yo",
    "aMano": "En este sistema de juego la moneda y los puntos de experiencia no se suman solos: se escriben en el resumen del chat.",
    "consegna": "Entregar las recompensas y completar",
    "senzaPremi": "Completar sin recompensas",
    "daDareAMano": "a entregar a mano",
    "chat": "Misión completada: {titolo}"
   },
   "Diari": {
    "titolo": "Misiones",
    "nessuna": "No hay misiones en curso.",
    "daAttivare": "por activar",
    "attivaOra": "Activar",
    "attivaMostra": "Activar y mostrar a los jugadores",
    "soloAggiungi": "Añadir sin activar"
   },
   "Domande": {
    "elimina": "¿Eliminar la misión «{titolo}»?"
   },
   "Avvisi": {
    "soloMaster": "Solo el DJ puede usar el panel de misiones.",
    "soloOggetti": "Aquí solo se pueden arrastrar objetos.",
    "soloAttori": "Aquí solo se pueden arrastrar actores.",
    "troppi": "«{nome}»: has asignado más de {n}.",
    "diarioNonTrovato": "El diario de esta misión ya no está en el mundo.",
    "primaVisibile": "Primero haz la misión visible para los jugadores.",
    "nonAncora": "Esta misión aún no se ha revelado.",
    "definizioneNonTrovata": "Misión «{chiave}» no encontrada en los diarios.",
    "aggiunta": "Misión añadida al tracker: {titolo}."
   },
   "Impostazioni": {
    "lingua": {
     "nome": "Idioma de Magical Quest Tracker",
     "hint": "Idioma de los textos de este módulo. «Automático» sigue el idioma de Foundry.",
     "auto": "Automático"
    },
    "nelDiario": {
     "nome": "Misiones en lo alto de los Diarios",
     "hint": "Muestra el recuadro de misiones en lo alto de la barra de Diarios (los jugadores solo ven las visibles)."
    },
    "tastoPannello": {
     "nome": "Abrir el panel de misiones",
     "hint": "Solo para el DJ."
    }
   }
  }
 }
};
