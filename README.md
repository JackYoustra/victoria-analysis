# Victoria Savegame Analyzer!

## Run it in your browser!

[//]: # (Link to website)

## Motivation
This project was made out of frustration with the installation difficulties in the traditional savegame analyzer.
Usually, there's a lot of downloading and configuration needed to get the tool to work. Now, just open your savegame folder with
the button in the site and you're good to go! If you want to add localization, you can do so by adding different game configuration folders.
Note that adding all the game configuration folders at once doesn't work (see: [https://github.com/GoogleChromeLabs/browser-fs-access/issues/32](https://github.com/GoogleChromeLabs/browser-fs-access/issues/32)).


## Instructions
1. Click "Load save folder"
2. Select your savegame folder (`C:\Users\username\Documents\Paradox Interactive\Victoria 2\save games`)
   * If you have mods, the savegames will be in the subfolder under the mod
3. (optional) Load the configuration folder (`C:\Program Files\Paradox Interactive\Victoria 2\{localization, common, ...}`)
   * If your save is based on a mod, you can load the configuration folder of the mod in the `mod` directory of the Victoria 2 program folder
   * For now, you can only load one configuration folder at a time. See TODO.
4. Click on the different views


## Release Features
- [x] Serverless! No communication / networking, all in browser.
- [x] Web Worker / Async.
- [x] Wiki boxes
  - [x]: PNG / (buggy) SVG export (right click menu)
- [x] Ag-grid + CSV export.
  - [x] Pops.
  - [x] Factories.
- [x] Localization.
- [x] Conversion to JSON.

## TODO (unordered)
- [ ] PWA
- [ ] Make it look nicer!
- [ ] Make it feel more complete!
  - [ ] Github link
  - [ ] About page
- [ ] Live refresh of folder / dashboard
- [ ] Add more analysis tools (I have a mapping of each of the fields onto a globe, exporting maps would be cool).
- [ ] Add icons / artwork to the wiki battleboxes (heavyweight way for fontset: [v86 linux image](https://copy.sh/v86/) + python + [nanoemoji](https://github.com/googlefonts/nanoemoji).
- [ ] Better scrolling experience with wiki battleboxes.
- [ ] Fix word wrapping in "save as svg".
- [ ] Add indicators of which configuration files are currently loaded.
- [ ] Support multiple saves being loaded at once.
  - [ ] Garbage collection on too much memory.
- [ ] Implement common fixups for save files.
  - [ ] Army standardizer: Standardize army stacks and distribute units to stacks.
- [ ] True rational planning: analyze / modify save files to satisfy a linear program (a [fun read](https://crookedtimber.org/2012/05/30/in-soviet-union-optimization-problem-solves-you/) for why this is infeasible IRL).
- [ ] Other paradox game support (turn into paradox-savegame-analyzer?)
  - [ ] HOI4
  - [ ] CK3
  - [ ] Others, if others are interested (the above are the only ones I play, for now)