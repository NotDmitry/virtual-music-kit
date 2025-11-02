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
  key.disabled = false;
  key.addEventListener('mousedown', (e) => keyPress(e.target));
  key.addEventListener('mouseup', (e) => keyRelease(e.target));
  key.addEventListener('mouseout', (e) => keyRelease(e.target));
})

document.body.addEventListener('keydown', (e) => {
  keyPress(activeKeys[0]);
})

document.body.addEventListener('keyup', (e) => {
  keyRelease(activeKeys[0]);
})

// Controlling key state
function keyPress(key) {
  key.classList.add('guitar__key_pressed');
  key.classList.remove('guitar__key_active');
  key.focus();
}

function keyRelease(key) {
  key.classList.remove('guitar__key_pressed');
  key.classList.add('guitar__key_active');
  key.blur();
}

// Render the guitar
function createGuitar() {
  const guitar = document.createElement('div');
  const guitarHead = document.createElement('div');
  const guitarFret = document.createElement('div');
  const guitarKey = document.createElement('button');
  guitarKey.disabled = true;

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