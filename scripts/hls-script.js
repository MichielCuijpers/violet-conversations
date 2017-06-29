'use strict';

var violet = require('../lib/violet.js')('einstein');
var violetUtils = require('../lib/violetUtils.js')(violet);

var violetSFStore = require('../lib/violetSFStore.js');
violet.setPersistentStore(violetSFStore.store);

violetSFStore.store.propOfInterest = {
  'appointment': ['doctor_name', 'appointment_date_time'],
  'symptomCheckin': ['reportDate', 'symptom']
}

//Violet queries for list of doctors associated with me and creates an array of expected results
violet.addKeyTypes({
  'symptomList': 'AMAZON.LITERAL',
  'diabetesSymptomOne': {
    'type': 'symptomDesc',
    'values': ['fatigue', 'thirst', 'frequent urination', 'drinking a lot of water', 'low blood sugar', 'dry mouth', 'blurred vision', 'vision blurred', 'pain in feet', 'pain in legs', 'vomiting', 'nausea', 'weakness', 'stomach pain', 'belly ache', 'fast breathing']
  },
  'diabetesSymptomTwo': {
    'type': 'symptomDesc',
    'values': ['fatigue', 'thirst', 'frequent urination', 'drinking a lot of water', 'low blood sugar', 'dry mouth', 'blurred vision', 'vision blurred', 'pain in feet', 'pain in legs', 'vomiting', 'nausea', 'weakness', 'stomach pain', 'belly ache', 'fast breathing']
  },
  'diabetesSymptomThree': {
    'type': 'symptomDesc',
    'values': ['fatigue', 'thirst', 'frequent urination', 'drinking a lot of water', 'low blood sugar', 'dry mouth', 'blurred vision', 'vision blurred', 'pain in feet', 'pain in legs', 'vomiting', 'nausea', 'weakness', 'stomach pain', 'belly ache', 'fast breathing']
  },
  'diabetesSymptomFour': {
    'type': 'symptomDesc',
    'values': ['fatigue', 'thirst', 'frequent urination', 'drinking a lot of water', 'low blood sugar', 'dry mouth', 'blurred vision', 'vision blurred', 'pain in feet', 'pain in legs', 'vomiting', 'nausea', 'weakness', 'stomach pain', 'belly ache', 'fast breathing']
  },
  'diabetesSymptomFive': {
    'type': 'symptomDesc',
    'values': ['fatigue', 'thirst', 'frequent urination', 'drinking a lot of water', 'low blood sugar', 'dry mouth', 'blurred vision', 'vision blurred', 'pain in feet', 'pain in legs', 'vomiting', 'nausea', 'weakness', 'stomach pain', 'belly ache', 'fast breathing']
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
   response.addGoal('{{quickCheckIn}}');
}});

violet.defineGoal({
  goal: '{{quickCheckIn}}',
  prompt: ['I am sorry to hear that. What\'s going on?', 'I am sorry to hear that. Tell me what you\'re feeling'],
  respondTo: [{
    expecting: ['Nevermind', 'Gotta run now', 'Don\'t want to talk about it'],
    resolve: (response) => {
     response.say('Okay. If you need me, I\'m here to help');
  }}, {
    expecting: ['I\'m feeling [[diabetesSymptomOne]]', 'I\'m feeling [[diabetesSymptomOne]] and [[diabetesSymptomTwo]]', 'I\'m feeling [[diabetesSymptomOne]] and [[diabetesSymptomTwo]] and [[diabetesSymptomThree]]', 'I\'m feeling[[diabetesSymptomOne]] and [[diabetesSymptomTwo]] and [[diabetesSymptomThree]] and [[diabetesSymptomFour]]', 'I\'m feeling [[diabetesSymptomOne]] and [[diabetesSymptomTwo]] and [[diabetesSymptomThree]] and [[diabetesSymptomFour]] and [[diabetesSymptomFive]]'],
    resolve: (response) => {
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

      var symptoms = '';

      if (diabetesSymptomOne) {
        symptoms = symptoms + '; ' + diabetesSymptomOne;
      }

      if (diabetesSymptomTwo) {
        symptoms = symptoms + '; ' + diabetesSymptomTwo;
      }
      
      if (diabetesSymptomThree) {
        symptoms = symptoms + '; ' + diabetesSymptomThree;
      }
      
      if (diabetesSymptomFour) {
        symptoms = symptoms + '; ' + diabetesSymptomFour;
      }
      
      if (diabetesSymptomFive) {
        symptoms = symptoms + '; ' + diabetesSymptomFive;
      }
      

      response.set('<<symptomCheckin.reportDate>>', new Date() );
      response.set('<<symptomCheckin.symptom>>', symptoms );
      response.store('<<symptomCheckin>>');
      response.say('Logging your symptoms');
  }}]
});

violet.registerIntents();

module.exports = violet;
