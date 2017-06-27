'use strict';

var violet = require('../lib/violet.js')('einstein');
var violetUtils = require('../lib/violetUtils.js')(violet);

var violetSFStore = require('../lib/violetSFStore.js');
violet.setPersistentStore(violetSFStore.store);

violetSFStore.store.propOfInterest = {
  'appointment': ['doctor_name', 'appointment_date_time']
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
 
});

//common across multiple goals
violet.addPhraseEquivalents([
 ['I\'m', 'I am']
]);

violet.addTopLevelGoal('{{telemedicine}}');

violet.respondTo({
  expecting: ['Can you help me?'],
  resolve: (response) => {
   response.say('Sure.');
   response.addGoal('{{telemedicine}}');
}});

violet.defineGoal({
  goal: '{{telemedicine}}',
  prompt: ['Great to see you in person. How are you feeling today?'],
  respondTo: [{
    expecting: ['Great', 'Not bad at all'],
    resolve: (response) => {
     response.say('Great.');
  }}, {
    expecting: ['Bad', 'Exhausted', 'I am not feeling well'],
    resolve: (response) => {
      response.addGoal('{{quickCheckIn}}');
  }}]
});

violet.defineGoal({
  goal: '{{quickCheckIn}}',
  prompt: ['I am sorry to hear that. I see that you have been taking your glucophage as prescribed. Do you have increased urination?'],
  respondTo: [{
    expecting: ['No'],
    resolve: (response) => {
     response.say('Great.');
  }}, {
    expecting: ['Yes'],
    resolve: (response) => {
      response.say('Increased urination is a sign of increased blood sugar');
  }}]
});

violet.registerIntents();

module.exports = violet;
