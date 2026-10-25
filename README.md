<p align="center"><img src="assets/logo.webp" alt="Magical Quest Tracker" width="320"></p>

<h3 align="center">The quest journal the GM controls, for Foundry VTT 13 and 14</h3>

<p align="center">Quests, objectives and rewards · automatic loot sharing · visible to players only when you allow it · ready-made quests from adventures</p>

<p align="center">
  <a href="https://github.com/morningstar3010/magical-quest-tracker/releases"><img alt="Version" src="https://img.shields.io/badge/dynamic/json?url=https%3A%2F%2Fraw.githubusercontent.com%2Fmorningstar3010%2Fmagical-quest-tracker%2Fmain%2Fmodule.json&query=%24.version&label=version&color=8e44ad"></a>
  <img alt="Foundry VTT" src="https://img.shields.io/badge/dynamic/json?url=https%3A%2F%2Fraw.githubusercontent.com%2Fmorningstar3010%2Fmagical-quest-tracker%2Fmain%2Fmodule.json&query=%24.compatibility.verified&label=Foundry%20VTT&prefix=v&color=f37b21">
  <a href="https://github.com/morningstar3010/magical-quest-tracker/releases"><img alt="Downloads" src="https://img.shields.io/github/downloads/morningstar3010/magical-quest-tracker/total?label=downloads&color=16a085"></a>
</p>

<p align="center">
  <a href="README.md" title="English"><img src="https://flagcdn.com/32x24/gb.png" alt="English" width="32" height="24"></a>
  <a href="README.it.md" title="Italiano"><img src="https://flagcdn.com/32x24/it.png" alt="Italiano" width="32" height="24"></a>
</p>

<p align="center">
  🌐 <b>English</b> · <a href="README.it.md">Italiano</a>
</p>

---

**Magical Quest Tracker** keeps every quest of your campaign in one private panel. You decide which quests exist, which are active and which ones the players can see. When a quest is completed you choose who gets each reward: items, currency and experience go straight to the character sheets.

## Contents

1. [Install](#install)
2. [Your first quest in one minute](#quick-start)
3. [The GM panel](#panel)
4. [What players see](#players)
5. [Completing a quest and sharing the rewards](#rewards)
6. [Quests from adventures](#adventures)
7. [Settings and language](#settings)
8. [For adventure authors](#authors)
9. [Macros](#macros)

<a name="install"></a>
## 1. Install

1. In Foundry, open **Add-on Modules** and press **Install Module**.
2. In the **Manifest URL** field paste this address and press **Install**:

```
https://github.com/morningstar3010/magical-quest-tracker/releases/latest/download/module.json
```

3. Open your world, go to **Manage Modules**, tick **Magical Quest Tracker** and save.

<a name="quick-start"></a>
## 2. Your first quest in one minute

- [ ] Click the **Magical Quest Tracker** button (the scroll) in the toolbar on the left, or the list icon in the **Quests** box at the top of the Journals tab.
- [ ] Press **New quest** and type a title.
- [ ] Drop a potion from any compendium into **Rewards** and write 100 in **gp**.
- [ ] Press **Activate**, then **Show in the players' journals**.
- [ ] Done! Your players see the quest at the top of their Journals tab.

<a name="panel"></a>
## 3. The GM panel

On the **left** there is the list of quests: search by name, area, description or NPC, filter by area and by NPC, and the tabs **All**, **Available**, **Active**, **Completed** and **Failed**. At the bottom, **Adventure quests** lists the quests written in the adventures you imported and not yet added: **Add to the tracker** or **Activate now**.

On the **right** there is the chosen quest. Every field saves itself:

| Field | What it is |
|---|---|
| Image, Title, Status, Area | the basics; the area also works as a filter |
| Visible to players | only visible quests appear to the players |
| Non-player characters | type a name and press Enter, or drop an actor |
| Summary, Description | short line and full text (with links, rolls and pictures) |
| Objectives | optional; tick them as the party goes on; **secret** objectives are seen by the GM only |
| Rewards | drop items from any compendium or the Items sidebar and set the quantity; currency, XP and other rewards; **Rewards visible to players** |
| Deadline | optional, free text |
| Followed by | the characters who took the quest |

Buttons: **Activate**, **Completed…** (opens the reward sharing), **Failed**, **Reopen**, **Show in the players' journals** / **Hide from players**, **Open for players** (opens the quest sheet on every player's screen), **Sheet**, **Duplicate**, **Delete**.

<a name="players"></a>
## 4. What players see

- At the top of the **Journals** tab, the **Quests** box with the visible quests grouped in *In progress*, *Available*, *Completed* and *Failed*, with the objectives done.
- Clicking a quest opens its **sheet**: image, area, NPCs, description, objectives (not the secret ones), rewards (if you show them), deadline, who follows it and **My notes**, personal notes that only that player sees.

<a name="rewards"></a>
## 5. Completing a quest and sharing the rewards

Press **Completed…**:

1. tick the characters who receive the rewards (those who follow the quest are already ticked);
2. for every **item** choose how many each character gets (the total is green when it is right);
3. **currency** and **XP**: *split equally* (the remainder goes to the first ones) or *I decide*;
4. press **Give the rewards and complete**.

With D&D 5e items go into the inventories (the quantity adds up if the character already has the same item), currency and XP are added to the sheets. With other game systems items are given anyway, and currency and XP are written in the chat report. **Complete without rewards** just closes the quest.

<a name="adventures"></a>
## 6. Quests from adventures

Some adventures already contain their quests. They are written in the adventure's journals, not in this module: after importing the adventure they appear in **Adventure quests** in the panel. In the journal page the quest is a link: the GM clicks it, reads the preview and chooses **Activate**, **Activate and show to players** or **Add without activating**.

<a name="settings"></a>
## 7. Settings and language

- **Magical Quest Tracker language**: «Automatic» follows Foundry; otherwise English, Italiano, Deutsch or Español (only the texts of this module change).
- **Quests at the top of the Journals**: shows or hides the box.
- In **Configure Controls**: a key to open the panel.

<a name="authors"></a>
## 8. For adventure authors

Put the quests in the flags of a journal page of your adventure, and a link in its text:

```json
"flags": { "magical-quest-tracker": { "missioni": [ {
  "id": "bounty-green-gargoyle",
  "titolo": "The horn of the green gargoyle",
  "zona": "Dragon Marsh",
  "png": ["Zhanna"],
  "riassunto": "Zhanna pays 250 gp for the horn.",
  "descrizione": "<p>Bring the horn of a green guardian gargoyle to Zhanna.</p>",
  "noteMaster": "<p>The gargoyle lairs on Aragnak's island (W-9). Only the GM sees these notes.</p>",
  "obiettivi": [ { "testo": "Find a green guardian gargoyle" }, { "testo": "Bring the horn to Zhanna" } ],
  "ricompense": { "valuta": { "gp": 250 }, "pe": 0, "oggetti": [ { "uuid": "Compendium.my-module.items.Item.xxxxxxxxxxxxxxxx", "nome": "Potion", "quantita": 1 } ] }
} ] } }
```

```
@Missione[bounty-green-gargoyle]{The horn of the green gargoyle}
```

`@Quest[…]` works too. Without the tracker installed the text stays as it is written.

`noteMaster` (optional) is text only the GM sees: secrets, checks, consequences. In the panel, clicking an adventure quest shows its full preview before you add it.


<a name="macros"></a>
## 9. Macros

```js
const q = game.modules.get("magical-quest-tracker").api;
q.pannello();                       // open the GM panel
q.crea({ titolo: "Rescue the merchant", zona: "Zelkor" });
q.missioni();                       // all quests
q.attiva(id); q.fallita(id);        // change status
q.completa(id);                     // open the reward sharing
q.mostra(id);                       // open the quest sheet for every player
q.definizioni();                    // quests written in the imported adventures
q.daAvventura("bounty-green-gargoyle", { stato: "attiva", visibile: true });
```

---

<p align="center">Made by <b>MorningStar</b></p>
