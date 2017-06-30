'use strict';

var violet = require('../lib/violet.js')('einstein');
var violetUtils = require('../lib/violetUtils.js')(violet);

var violetSFStore = require('../lib/violetSFStore.js');
violet.setPersistentStore(violetSFStore.store);

violetSFStore.store.propOfInterest = {
  'appointment': ['doctorName', 'appointmentDateTime'],
  'Citizen_Preference': ['Profile_Name', 'Biking'],
  'reminder': ['description', 'date']
}

const days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
const months = ['January','February','March','April','May','June','July', 'August', 'September', 'October', 'November', 'December'];

Date.daysBetween = function( date1, date2 ) {
  //Get 1 day in milliseconds
  var one_day=1000*60*60*24;

  // Convert both dates to milliseconds
  var date1_ms = date1.getTime();
  var date2_ms = date2.getTime();

  // Calculate the difference in milliseconds
  var difference_ms = date2_ms - date1_ms;
    
  // Convert back to days and return
  return Math.round(difference_ms/one_day); 
}

//Violet queries for list of doctors associated with me and creates an array of expected results
violet.addKeyTypes({
  'doctor': 'AMAZON.US_FIRST_NAME',
  'reminderText': 'AMAZON.LITERAL',
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
 ['I\'m', 'I am'],
 ['When\'s', 'When is'],
 ['I\'d', 'I would']
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
    expecting: ['Don\'t want to talk about it'],
    resolve: (response) => {
     response.say('Okay. If you need me, I\'m here to help');
  }}, {
    expecting: ['I have [[diabetesSymptomOne]]', 
                'I have [[diabetesSymptomOne]] and [[diabetesSymptomTwo]]', 
                'I have [[diabetesSymptomOne]] and [[diabetesSymptomTwo]] and [[diabetesSymptomThree]]', 
                'I have [[diabetesSymptomOne]] and [[diabetesSymptomTwo]] and [[diabetesSymptomThree]] and [[diabetesSymptomFour]]', 
                'I have [[diabetesSymptomOne]] and [[diabetesSymptomTwo]] and [[diabetesSymptomThree]] and [[diabetesSymptomFour]] and [[diabetesSymptomFive]]'],
    resolve: function *(response) {
      var symptomOne = response.get('[[diabetesSymptomOne]]');
      var symptomTwo = response.get('[[diabetesSymptomTwo]]');
      var symptomThree = response.get('[[diabetesSymptomThree]]');
      var symptomFour = response.get('[[diabetesSymptomFour]]');
      var symptomFive = response.get('[[diabetesSymptomFive]]');

      console.log('diabetesSymptomOne ' + symptomOne);
      console.log('diabetesSymptomTwo ' + symptomTwo);
      console.log('diabetesSymptomThree ' + symptomThree);
      console.log('diabetesSymptomFour ' + symptomFour);
      console.log('diabetesSymptomFive ' + symptomFive);

      var symptoms = '';

      if (symptomOne) {
        symptoms = symptoms + '; ' + symptomOne;
      }

      if (symptomTwo) {
        symptoms = symptoms + '; ' + symptomTwo;
      }
      
      if (symptomThree) {
        symptoms = symptoms + '; ' + symptomThree;
      }
      
      if (symptomFour) {
        symptoms = symptoms + '; ' + symptomFour;
      }
      
      if (symptomFive) {
        symptoms = symptoms + '; ' + symptomFive;
      }

      if (symptoms.indexOf('nausea') >= 0) {
        violetSFStore.updater.updatePreferences('nausea__c', true);
      }

      if (symptoms.indexOf('fatigue') >= 0) {
        violetSFStore.updater.updatePreferences('fatigue__c', true);
      }

      if (symptoms.indexOf('frequent urination') >= 0) {
        violetSFStore.updater.updatePreferences('frequent_urination__c', true);
      }

      /*
      TODO: Given the symptoms, it should query salesforce to figure out best match. 
      set the user preferences in haiku based on condition
      */
      response.set('{{condition}}', 'diabetes');

      //response.set('{{symptoms}}', 'next');
      response.addGoal('{{schedule}}');
  }}]
});

violet.defineGoal({
  goal: '{{schedule}}',
  prompt: ['Given your symptoms, we recommend lab work and consultation with a doctor to determine if you have early signs of diabetes. Would you like me to schedule an appointment for you?'],
  respondTo: [
    {expecting: ['Nevermind', 'Nope'],
      resolve: (response) => {
       response.set('{{schedule}}', 'next');
       response.say('Okay. If you need me, I\'m here to help');
      }
    }, 
    {expecting: ['Yes', 'Sure', 'Please'],
      resolve: (response) => {
        //response.set('{{schedule}}', 'next');
        response.say('Okay. Let me check your calendars and find the best time');
        response.addGoal('{{confirmAppointment}}');
      }
    }
  ]
});

violet.defineGoal({
  goal: '{{confirmAppointment}}',
  prompt: ['I see something is available for Thursday morning at 8am. Will that work for you?'],
  respondTo: [
    {expecting: ['Cannot do that time'],
      resolve: (response) => {
       response.say('Okay. I will look for a different time');
      }
    }, 
    {expecting: ['That\'s perfect'],
      resolve: (response) => {
        response.say('I\'ve scheduled you. When your lab results come back, we\'ll evaluate the treatment options and determine best options for you.');        
      }
    }
  ]
});

violet.registerIntents();

module.exports = violet;
