import {Key} from "./js-modules/Key.js";

const mainWrapper = document.createElement('main');
document.body.append(mainWrapper);

// Constants definition
const FRETS = 7;
const KEYS = 6;

// Execution flow
createGuitar();
const activeKeys = getActiveKeys();
let pressedKey = null;

activeKeys.forEach((key) => {
  key.keyElement.disabled = false;
  key.keyElement.addEventListener('mousedown', (e) => keyPress(e.target));
  key.keyElement.addEventListener('mouseup', (e) => keyRelease(e.target));
  key.keyElement.addEventListener('mouseout', (e) => keyRelease(e.target));
})

document.body.addEventListener('keydown', (e) => {
  if (!e.repeat) {
    const key = activeKeys.find((key) => key.keyCode === e.code);
    if (key) keyPress(key.keyElement);
  }
})

document.body.addEventListener('keyup', (e) => {
  const key = activeKeys.find((key) => key.keyCode === e.code);
  if (key) keyRelease(key.keyElement);
})

// Controlling key state
function keyPress(key) {
  if (!pressedKey) {
    pressedKey = key;
    key.classList.add('guitar__key_pressed');
    key.classList.remove('guitar__key_active');
    key.focus();
  }
}

function keyRelease(key) {
  if (key === pressedKey) {
    pressedKey = null;
    key.classList.remove('guitar__key_pressed');
    key.classList.add('guitar__key_active');
    key.blur();
  }
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

// Create array of objects representing active keys
function getActiveKeys() {
  const assignedKeyChars = "LKJHGFD";
  const assignedKeyCodes = assignedKeyChars.split("")
    .map((char) => `Key${char}`);

  const keys = Array.from(document.querySelectorAll('.guitar__key:last-of-type'));
  keys.forEach((key) => key.classList.add('guitar__key_active'));

  return keys.map((key, i) => {
    return new Key(key, assignedKeyChars[i], assignedKeyCodes[i], null);
  });
}