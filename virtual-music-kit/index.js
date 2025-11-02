import {Key} from "./js-modules/Key.js";

const mainWrapper = document.createElement('main');
document.body.append(mainWrapper);

// Constants definition
const FRETS = 7;
const KEYS = 6;

// Execution flow
createGuitar();
const activeKeys = Array.from(document.querySelectorAll('.guitar__key:last-of-type'));
const keyMap = new Map(activeKeys.map((key) => {
  return [key, new Key(null, null, null)]
}));
activeKeys.forEach(key => key.classList.add('guitar__key_active'));
activeKeys.forEach((key) => {
  key.addEventListener('mousedown', (e) => keyPress(e.target));
  key.addEventListener('mouseup', (e) => keyRelease(e.target));
  key.addEventListener('mouseout', (e) => keyRelease(e.target));
})

// Controlling key state
function keyPress(key) {
  key.classList.add('guitar__key_pressed');
  key.classList.remove('guitar__key_active');
}

function keyRelease(key) {
  key.classList.remove('guitar__key_pressed');
  key.classList.add('guitar__key_active');
}

// Render the guitar
function createGuitar() {
  const guitar = document.createElement('div');
  const guitarHead = document.createElement('div');
  const guitarFret = document.createElement('div');
  const guitarKey = document.createElement('div');

  guitar.classList.add('guitar');
  guitarHead.classList.add('guitar__head');
  guitarFret.classList.add('guitar__fret');
  guitarKey.classList.add('guitar__key');

  const guitarKeys = Array.from({length: KEYS}, _ => guitarKey.cloneNode(true));
  guitarFret.append(...guitarKeys);
  const frets = Array.from({length: FRETS}, _ => guitarFret.cloneNode(true));
  guitar.append(guitarHead);
  guitar.append(...frets);

  document.body.append(guitar);
}