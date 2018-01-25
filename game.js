class Game {
  constructor(min, max) {
    this.number = this.determineNumber(min, max);
  }

  checkGuess(guess) {
    if(guess > this.number) {
      return 1;
    } else if(guess < this.number) {
      return -1;
    } else {
      return 0;
    }
  }

  determineNumber(min, max) {
    return 10;
  }
}

module.exports = Game;