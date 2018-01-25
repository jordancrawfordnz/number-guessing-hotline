var plivo = require('plivo');
var express = require('express');
var bodyParser = require('body-parser');
var app = express();

app.set('port', (process.env.PORT || 5000));
app.use(bodyParser.urlencoded({extended: true}));

var WELCOME_MESSAGE = "Welcome to the number guessing hotline.";
var GUESS_PROMPT = "What is your guess?"
var WRONG_INPUT_MESSAGE = "Huh? I didn't understand. Could you try again?";
var TOO_HIGH_MESSAGE = "You guessed too high!";
var TOO_LOW_MESSAGE = "You guessed too low!";
var WON_MESSAGE = "You're the best! Congrats!"

app.get('/', function(request, response) {
  var randomNumber = findRandomNumber(1, 99);

  var r = plivo.Response();
  r.addSpeak(WELCOME_MESSAGE);
  requestGuess(request, r, randomNumber);

  response.set({'Content-Type': 'text/xml'});
  response.send(r.toXML());
});

app.post('/guess', function(request, response) {
  var r = plivo.Response();
  var randomNumber = parseInt(request.query.number);
  var guess = parseInt(request.body.Digits);

  var won = guess !== undefined && guess === randomNumber;

  console.log('The player guessed: ' + guess);
  console.log('The actual number is: ' + randomNumber)

  if (won) {
    r.addSpeak(WON_MESSAGE);
    // TODO: Play music?
  } else {
    if (guess > randomNumber) {
      r.addSpeak(TOO_HIGH_MESSAGE);
    } else if (guess < randomNumber) {
      r.addSpeak(TOO_LOW_MESSAGE);
    } else {
      r.addSpeak(WRONG_INPUT_MESSAGE);
    }

    requestGuess(request, r, randomNumber)
  }

  response.set({'Content-Type': 'text/xml'});
  response.send(r.toXML());
});

app.listen(app.get('port'), function() {
    console.log('Node app is running on port', app.get('port'));
});

function requestGuess(request, r, randomNumber) {
  var guessPromptParams = {
    'action': guessActionUrl(request, randomNumber),
    'method': 'POST',
    'timeout': '8',
    'numDigits': '2',
    'retries': '3'
  };

  var getDigits = r.addGetDigits(guessPromptParams);
  getDigits.addSpeak(GUESS_PROMPT);
  r.addSpeak(WRONG_INPUT_MESSAGE);
}

function guessActionUrl(request, randomNumber) {
  return request.protocol + '://' + request.headers.host + '/guess?number=' + randomNumber;
}

function findRandomNumber(min, max) {
  return Math.floor((Math.random() * max) + min);
}
