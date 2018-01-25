const Game = require('./game');
const readlineSync = require('readline-sync');

game = new Game(1, 100);

while(!turn()) {}
won();

function turn() {
  var answer = readlineSync.question('Enter your guess: ');
  var guessResult = game.checkGuess(answer)

  if (guessResult > 0) {
    console.log('Thats too high!');
  } else if (guessResult < 0) {
    console.log('Thats too low!');
  }

  return guessResult === 0;
}

function won() {
  console.log('Nice work!')
}