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
  var guessActionUrl = request.protocol + '://' + request.headers.host + '/guess?number=' + randomNumber;

  var r = plivo.Response();
  params = {
    'action': guessActionUrl,
    'method': 'POST',
    'timeout': '7',
    'numDigits': '2',
    'retries': '1'
  };
  getDigits = r.addGetDigits(params);
  getDigits.addSpeak(WELCOME_MESSAGE);
  r.addSpeak(WRONG_INPUT_MESSAGE);

  response.set({'Content-Type': 'text/xml'});
  response.send(r.toXML());
});

app.post('/guess', function(request, response) {
  var r = plivo.Response();
  var randomNumber = parseInt(request.query.number);
  var guess = parseInt(request.body.Digits);

  if (guess > randomNumber) {
    r.addSpeak(TOO_HIGH_MESSAGE);
    // TODO: Ask for input.
  } else if (guess < randomNumber) {
    r.addSpeak(TOO_LOW_MESSAGE);
    // TODO: Ask for input again.
  } else if (guess !== undefined && guess === randomNumber) {
    r.addSpeak(WON_MESSAGE);
    // TODO: Hang up?
  } else {
    r.addSpeak(WRONG_INPUT_MESSAGE);
  }

  response.set({'Content-Type': 'text/xml'});
  response.send(r.toXML());
});

app.listen(app.get('port'), function() {
    console.log('Node app is running on port', app.get('port'));
});

function findRandomNumber(min, max) {
  return Math.floor((Math.random() * max) + min);
}
