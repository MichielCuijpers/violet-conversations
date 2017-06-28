'use strict';

var violet = require('../lib/violet.js')('einstein');
var violetUtils = require('../lib/violetUtils.js')(violet);

var violetSFStore = require('../lib/violetSFStore.js');
violet.setPersistentStore(violetSFStore.store);

violetSFStore.store.propOfInterest = {
  'appointment': ['doctor_name', 'appointment_date_time'],
  'symptomCheckin': ['reportDate', 'symptom']
}

/*
Violet (Avatar on Screen): Hi Paul, nice to see you in person. How can I help you? 
Paul: I'm not feeling well
Violet: I'm sorry to hear that. You have been very regular with your diabetes medication. Have you had any of these symptoms recently? 
<List of common related symptoms on screen that he can touch, they are personalized from wisdom of crowd and are related to common setback patients see in early diabetes managemnet> 
Paul hits None of These
Violet: Sorry I couldn't help you Paul. I have a primary care physician available - would you like me to connect you to her?
Paul: Yes please
Violet: Great, let me help you with a quick vitals check before we do that - heartbeat and blood pressure. Would you mind standing on the Vitals kiosk on your right? 
Paul stands on kiosk, it prints out his BMI, weight, heartbeat etc and also pops it on the screen. It's basically one of these (http://www.tigermedical.com/Products/Body-Composition-Scale__HEABCS-G6-LIMBS__HEABCS-G6-.aspx?invsrc=adwords_tm&gclid=CIjW0rKO1dQCFQJrfgodaV4CVQ)
Violet: Great, I have your vitals. Connecting you to Dr Sally Soulsoother in Miami now...
*/

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
  prompt: ['I am sorry to hear that. I see that you have been taking your glucophage as prescribed. Which symptoms are you feeling today?'],
  respondTo: [{
    expecting: ['No', 'None', 'Nevermind'],
    resolve: (response) => {
     response.say('If you need me, I\'m here to help');
  }}, {
    expecting: ['I have [[diabetesSymptomOne]]', 'I have [[diabetesSymptomOne]] and [[diabetesSymptomTwo]]', 'I have [[diabetesSymptomOne]] and [[diabetesSymptomTwo]] and [[diabetesSymptomThree]]', 'I have [[diabetesSymptomOne]] and [[diabetesSymptomTwo]] and [[diabetesSymptomThree]] and [[diabetesSymptomFour]]', 'I have [[diabetesSymptomOne]] and [[diabetesSymptomTwo]] and [[diabetesSymptomThree]] and [[diabetesSymptomFour]] and [[diabetesSymptomFive]]'],
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
