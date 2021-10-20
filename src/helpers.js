let previous = 1;

export function getAudioPath(effect) {
  return `src/audio/${effect.folder}/${effect.file}`;
}

export function generateUniqueRandom() {
  let number = previous;
  while (number < previous + 0.1 && number > previous - 0.1) {
    number = Math.random() * (1.4 - 0.75) + 0.75;
  }
  return (previous = number);
}
