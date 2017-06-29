'use strict';

var violet = require('../lib/violet.js')('einstein');
var violetUtils = require('../lib/violetUtils.js')(violet);

var violetSFStore = require('../lib/violetSFStore.js');
violet.setPersistentStore(violetSFStore.store);

violetSFStore.store.propOfInterest = {
  'appointment': ['doctor_name', 'appointment_date_time'],
  'Citizen_Preference': ['Name', 'Biking']
}

//Violet queries for list of doctors associated with me and creates an array of expected results
violet.addKeyTypes({
  'symptomList': 'AMAZON.LITERAL',
  'diabetesSymptomOne': {
    'type': 'symptomDesc',
    'values': ['tired',
                'thirst',
                'peeing a lot',
                'frequent urination',
                'weight loss',
                'weight gain',
                'fatigue',
                'blurred vision',
                'wounds healing slowly',
                'nausea',
                'skin infections',
                'patches of darker skin',
                'breath smells sweet',
                'breath smells fruity',
                'breath has acetone odor',
                'reduced feeling in hands',
                'reduced feeling in feet',
                'dry mouth',
                'excessive urination',
                'hunger',
                'blurry vision',
                'cloudy thinking']
  },
  'diabetesSymptomTwo': {
    'type': 'symptomDesc'
  },
  'diabetesSymptomThree': {
    'type': 'symptomDesc',
  },
  'diabetesSymptomFour': {
    'type': 'symptomDesc',
  },
  'diabetesSymptomFive': {
    'type': 'symptomDesc',
  },
  'diabetesSymptomSix': {
    'type': 'symptomDesc',
  },
  'diabetesSymptomSeven': {
    'type': 'symptomDesc',
  },
  'diabetesSymptomEight': {
    'type': 'symptomDesc',
  },
  'diabetesSymptomNine': {
    'type': 'symptomDesc',
  },
  'diabetesSymptomTen': {
    'type': 'symptomDesc',
  }
});

//common across multiple goals
violet.addPhraseEquivalents([
 ['I\'m', 'I am']
]);

violet.addTopLevelGoal('{{telemedicine}}');

violet.respondTo({
  expecting: ['I am not feeling well'],
  resolve: (response) => {
   response.addGoal('{{symptoms}}');
}});

violet.defineGoal({
  goal: '{{symptoms}}',
  prompt: ['I am sorry to hear that. What\'s going on?', 'I am sorry to hear that. Tell me what you\'re feeling'],
  respondTo: [{
    expecting: ['Nevermind', 'Gotta run now', 'Don\'t want to talk about it'],
    resolve: (response) => {
     response.say('Okay. If you need me, I\'m here to help');
  }}, {
    expecting: ['I have [[diabetesSymptomOne]]', 
                'I have [[diabetesSymptomOne]] and [[diabetesSymptomTwo]]', 
                'I have [[diabetesSymptomOne]] and [[diabetesSymptomTwo]] and [[diabetesSymptomThree]]', 
                'I have [[diabetesSymptomOne]] and [[diabetesSymptomTwo]] and [[diabetesSymptomThree]] and [[diabetesSymptomFour]]', 
                'I have [[diabetesSymptomOne]] and [[diabetesSymptomTwo]] and [[diabetesSymptomThree]] and [[diabetesSymptomFour]] and [[diabetesSymptomFive]]'],
    resolve: function *(response) {
      var diabetesSymptomOne = response.get('[[diabetesSymptomOne]]');
      var diabetesSymptomTwo = response.get('[[diabetesSymptomTwo]]');
      var diabetesSymptomThree = response.get('[[diabetesSymptomThree]]');
      var diabetesSymptomFour = response.get('[[diabetesSymptomFour]]');
      var diabetesSymptomFive = response.get('[[diabetesSymptomFive]]');

      console.log('diabetesSymptomOne ' + diabetesSymptomOne);
      console.log('diabetesSymptomTwo ' + diabetesSymptomTwo);
      console.log('diabetesSymptomThree ' + diabetesSymptomThree);
      console.log('diabetesSymptomFour ' + diabetesSymptomFour);
      console.log('diabetesSymptomFive ' + diabetesSymptomFive);

      yield response.store('Citizen_Preference', {'Name': 'IP-0004',
                                                  'Biking': 'true'});

      response.addGoal('{{continueSymptoms}}');
  }}]
});

violet.defineGoal({
  goal: '{{continueSymptoms}}',
  prompt: ['Got it. Anything else', 'Got it. Go on'],
  respondTo: [{
    expecting: ['That\'s it'],
    resolve: (response) => {
     response.say('that\'s a lot of symptoms');
  }}, {
    expecting: ['I have [[diabetesSymptomSix]]', 
                'I have [[diabetesSymptomSix]] and [[diabetesSymptomSeven]]', 
                'I have [[diabetesSymptomSix]] and [[diabetesSymptomSeven]] and [[diabetesSymptomEight]]', 
                'I have [[diabetesSymptomSix]] and [[diabetesSymptomSeven]] and [[diabetesSymptomEight]] and [[diabetesSymptomNine]]', 
                'I have [[diabetesSymptomSix]] and [[diabetesSymptomSeven]] and [[diabetesSymptomEight]] and [[diabetesSymptomNine]] and [[diabetesSymptomTen]]'],
    resolve: (response) => {
      var diabetesSymptomSix = response.get('[[diabetesSymptomSix]]');
      var diabetesSymptomSeven = response.get('[[diabetesSymptomSeven]]');
      var diabetesSymptomEight = response.get('[[diabetesSymptomEight]]');
      var diabetesSymptomNine = response.get('[[diabetesSymptomNine]]');
      var diabetesSymptomTen = response.get('[[diabetesSymptomTen]]');

      console.log('diabetesSymptomSix ' + diabetesSymptomSix);
      console.log('diabetesSymptomSeven ' + diabetesSymptomSeven);
      console.log('diabetesSymptomEight ' + diabetesSymptomEight);
      console.log('diabetesSymptomNine ' + diabetesSymptomNine);
      console.log('diabetesSymptomTen ' + diabetesSymptomTen);

      response.addGoal('{{continueSymptoms}}');
  }}]
});

violet.registerIntents();

module.exports = violet;
