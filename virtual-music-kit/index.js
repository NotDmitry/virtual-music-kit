import {Key} from "./js-modules/Key.js";

// Constants definition
const FRETS = 7;
const KEYS = 6;
const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const CONTROL_KEYS = [
  'ARROWLEFT',
  'ARROWRIGHT',
  'BACKSPACE',
  'DELETE',
  'SHIFT',
  'ALT',
  'CAPSLOCK',
  'CONTROL',
  'ENTER'
];
const audioContext = new AudioContext();

// Execution flow
const mainWrapper = document.createElement('main');
mainWrapper.classList.add('page');
const guitar = createGuitar();
const modal = createModal();
const activeKeys = getActiveKeys(guitar);
const sequencer = createSequencer(activeKeys.length * 2);

mainWrapper.append(guitar);
mainWrapper.append(modal);
mainWrapper.append(sequencer);
document.body.append(mainWrapper);

const editButtons = Array.from(document.querySelectorAll('.guitar__edit'));
const editInput = document.getElementById('edit-input');
const sequencerInput = document.getElementById('sequencer-input');
const playButton = document.querySelector('.sequencer__btn');
const editKeysMap = new Map(
  editButtons.map((button, i) => [button, activeKeys[i]])
);

let pressedKey = null;
let currentEditButton = null;
let lastInputCode = null;
let lastFocusedElement = document.activeElement;
let oscillator = null;
let isAutoPlaying = false;

// Mouse actions
activeKeys.forEach((key) => {
  key.keyElement.disabled = false;
  key.keyElement.addEventListener('mousedown', (e) => {
    if (isAutoPlaying) return;
    keyPress(key);
  });
  key.keyElement.addEventListener('mouseup', (e) => {
    if (isAutoPlaying) return;
    keyRelease(key);
  });
  key.keyElement.addEventListener('mouseout', (e) => {
    if (isAutoPlaying) return;
    keyRelease(key);
  });
})

// Keyboard actions
document.body.addEventListener('keydown', (e) => {
  if (isAutoPlaying) {
    e.preventDefault();
    return;
  }

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

  if (e.target === sequencerInput) {
    lastFocusedElement = sequencerInput;
    const assignedKeys = activeKeys.map((key) => key.keyChar)
    const currentChar = e.key.toUpperCase();

    if (CONTROL_KEYS.includes(currentChar)) return;

    if (!assignedKeys.includes(currentChar)) {
      e.preventDefault();
      alert('Invalid character input prevented! Please use ASSIGNED English letter keys.');
      return;
    }

    if (sequencerInput.value.length < sequencerInput.maxLength) {
      sequencerInput.value += e.key;
    }
  }

  if (!e.repeat) {
    const key = activeKeys.find((key) => key.keyCode === e.code);
    if (key) {
      keyPress(key);
    }
  }
})

document.body.addEventListener('keyup', (e) => {
  if (isAutoPlaying) return;
  const key = activeKeys.find((key) => key.keyCode === e.code);
  if (key) {
    keyRelease(key);
  }
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

editInput.addEventListener('paste', (e) => e.preventDefault())

// Sequencer actions
sequencerInput.addEventListener('paste', (e) => e.preventDefault());

playButton.addEventListener('click', async (e) => {
  if (audioContext.state === 'suspended') {
    await audioContext.resume();
  }

  const duration = 500;
  const delay = 350;
  isAutoPlaying = true;

  const notes = sequencerInput.value.split('');
  for (const note of notes) {
    if (note) {
      const key = activeKeys.find((key) => key.keyChar === note);
      keyPress(key);
      await sleep(duration);
      keyRelease(key);
      await sleep(delay);
    }
  }

  isAutoPlaying = false;
})

// Controlling key state
function keyPress(key, time = 0) {
  if (!pressedKey) {
    pressedKey = key;
    key.keyElement.classList.add('guitar__key_pressed');
    key.keyElement.classList.remove('guitar__key_active');
    key.keyElement.focus();

    if (audioContext.state === 'suspended') {
      audioContext.resume();
    }

    oscillator = playSound(key.sound, time);
  }
}

function keyRelease(key, time = 0) {
  if (key === pressedKey) {
    oscillator.stop(time);
    pressedKey = null;
    key.keyElement.classList.remove('guitar__key_pressed');
    key.keyElement.classList.add('guitar__key_active');
    key.keyElement.blur();
    lastFocusedElement.focus();
  }
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function playSound(freq, time = 0) {
  const osc = audioContext.createOscillator();
  osc.type = 'triangle';
  osc.frequency.value = freq;
  osc.connect(audioContext.destination);
  osc.start(time);
  return osc;
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
  modalLabel.htmlFor = modalInput.id;

  modalLabel.append(modalText);
  modalBody.append(modalLabel);
  modalBody.append(modalInput);
  modal.append(modalBody);

  return modal;
}

// Create sequencer
function createSequencer(maxSequenceLength) {
  const sequencer = document.createElement('div');
  const sequencerLabel = document.createElement('label');
  const sequencerInput = document.createElement('input');
  const sequencerPlayBtn = document.createElement('button');

  sequencer.classList.add('sequencer');
  sequencerLabel.classList.add('sequencer__label');
  sequencerInput.classList.add('sequencer__input');
  sequencerPlayBtn.classList.add('sequencer__btn');

  sequencerInput.id = 'sequencer-input';
  sequencerInput.type = 'text';
  sequencerInput.maxLength = maxSequenceLength;
  sequencerLabel.htmlFor = sequencerInput.id;

  sequencerPlayBtn.append(document.createTextNode('Let\'s rock!'));
  sequencerLabel.append(document.createTextNode('Enter the sequence for autoplay'));
  sequencer.append(sequencerLabel);
  sequencer.append(sequencerInput);
  sequencer.append(sequencerPlayBtn);

  return sequencer;
}

// Create array of objects representing active keys
function getActiveKeys(guitar) {
  const assignedKeyChars = "LKJHGFD";
  const frequencies = [349.23, 369.99, 392.00, 415.30, 440.00, 466.16, 493.88];
  const assignedKeyCodes = assignedKeyChars.split("")
    .map((char) => `Key${char}`);

  const keys = Array.from(guitar.querySelectorAll('.guitar__key:last-of-type'));
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
    return new Key(key, assignedKeyChars[i], assignedKeyCodes[i], frequencies[i]);
  });
}