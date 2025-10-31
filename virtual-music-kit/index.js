const mainWrapper = document.createElement('main');
document.body.append(mainWrapper);

const FRETS = 7;
const KEYS = 6;

function createGuitar() {
  const guitar = document.createElement('div');
  const guitarHead = document.createElement('div');
  const guitarFret = document.createElement('div');
  const guitarKey = document.createElement('div');
  const guitarString = document.createElement('span');
  const guitarBody = document.createElement('div');

  guitar.classList.add('guitar');
  guitarHead.classList.add('guitar__head');
  guitarFret.classList.add('guitar__fret');
  guitarKey.classList.add('guitar__key');
  guitarString.classList.add('guitar__string');
  guitarBody.classList.add('guitar__body');

  guitarKey.append(guitarString);
  const guitarKeys = Array.from({length: KEYS}, _ => guitarKey.cloneNode(true));
  guitarFret.append(...guitarKeys);
  const frets = Array.from({length: FRETS}, _ => guitarFret.cloneNode(true));
  guitar.append(guitarHead);
  guitar.append(...frets);
  guitar.append(guitarBody);

  document.body.append(guitar);
}

createGuitar();