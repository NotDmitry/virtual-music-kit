import {Key} from "./js-modules/Key.js";

// Constants definition
const FRETS = 7;
const KEYS = 6;
const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

// Execution flow
const mainWrapper = document.createElement('main');
const guitar = createGuitar();
const modal = createModal();

mainWrapper.append(guitar);
mainWrapper.append(modal);
document.body.append(mainWrapper);

const activeKeys = getActiveKeys();
const editButtons = Array.from(document.querySelectorAll('.guitar__edit'));
const editInput = document.getElementById('edit-input');
const editKeysMap = new Map(
  editButtons.map((button, i) => [button, activeKeys[i]])
);

let pressedKey = null;
let currentEditButton = null;
let lastInputCode = null;

// Mouse actions
activeKeys.forEach((key) => {
  key.keyElement.disabled = false;
  key.keyElement.addEventListener('mousedown', (e) => keyPress(e.target));
  key.keyElement.addEventListener('mouseup', (e) => keyRelease(e.target));
  key.keyElement.addEventListener('mouseout', (e) => keyRelease(e.target));
})

// Keyboard actions
document.body.addEventListener('keydown', (e) => {
  if (e.target === editInput) {
    if (e.key === 'Enter') {
      const currentKey = editKeysMap.get(currentEditButton);
      const currentValue = editInput.value.toUpperCase();
      const assignedKeys = activeKeys.map((key) => key.keyChar)

      if (assignedKeys.includes(currentValue)) {
        alert('The key is already assigned!');
        return;
      }

      if (!currentValue) {
        alert('Empty value is not allowed!');
        return;
      }

      if (!ALPHABET.includes(currentValue)) {
        alert('Not a valid key! Please use one English letter key.');
        return;
      }

      currentKey.keyChar = currentValue;
      const label = currentKey.keyElement.querySelector('.guitar__label');
      label.textContent = `${currentKey.keyChar}`;
      if (lastInputCode) currentKey.keyCode = lastInputCode;
      modal.close();
    }

    lastInputCode = e.code;
    return;
  }

  if (!e.repeat) {
    const key = activeKeys.find((key) => key.keyCode === e.code);
    if (key) keyPress(key.keyElement);
  }
})

document.body.addEventListener('keyup', (e) => {
  const key = activeKeys.find((key) => key.keyCode === e.code);
  if (key) keyRelease(key.keyElement);
})

// Edit button actions
editButtons.forEach((button) => {
  button.addEventListener('click', (e) => {
    editInput.value = editKeysMap.get(button).keyChar;
    currentEditButton = button;
    modal.showModal();
  })
})

// Modal window actions
modal.addEventListener('click', (e) => {
  if (e.target.contains(modal)) modal.close();
})

editInput.addEventListener('paste', (e) => {
  e.preventDefault();
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

  return guitar;
}

// Create modal window
function createModal() {
  const modal = document.createElement('dialog');
  const modalBody = document.createElement('div');
  const modalLabel = document.createElement('label');
  const modalText = document.createTextNode('Edit key binding');
  const modalInput = document.createElement('input');

  modal.classList.add('modal');
  modalBody.classList.add('modal__inner');
  modalLabel.classList.add('modal__label');
  modalInput.classList.add('modal__edit');

  modalInput.id = 'edit-input';
  modalInput.type = 'text';
  modalInput.maxLength = 1;
  modalInput.value = 'X';
  modalLabel.for = modalInput.id;

  modalLabel.append(modalText);
  modalBody.append(modalLabel);
  modalBody.append(modalInput);
  modal.append(modalBody);

  return modal;
}

// Create array of objects representing active keys
function getActiveKeys() {
  const assignedKeyChars = "LKJHGFD";
  const assignedKeyCodes = assignedKeyChars.split("")
    .map((char) => `Key${char}`);

  const keys = Array.from(document.querySelectorAll('.guitar__key:last-of-type'));
  const img = document.createElement('img');
  img.classList.add('guitar__edit');
  img.src = './assets/svg/edit.svg';
  img.alt = 'Select guitar key binding';
  const label = document.createElement('span');
  label.classList.add('guitar__label');

  return keys.map((key, i) => {
    key.classList.add('guitar__key_active');
    const span = label.cloneNode(true);
    span.textContent = `${assignedKeyChars[i]}`;
    key.append(span);
    key.append(img.cloneNode(true));
    return new Key(key, assignedKeyChars[i], assignedKeyCodes[i], null);
  });
}