'use strict';

var alexa = require('alexa-app');
var app = new alexa.app('einstein');
var violet = require('../../lib/violet.js')(app);
var violetUtils = require('../../lib/violetUtils.js')(violet);

var violetSFStore = require('../../lib/violetSFStore.js');
violet.setPersistentStore(violetSFStore.store);
violetSFStore.store.propOfInterest = {
  'diabetesLog': ['user', 'timeOfCheckin', 'bloodSugarLvl', 'feetWounds', 'missedDosages']
}


/*
 * TODO: Get UX better. Right now it is a literal translation of the stop light card
 *       need to make it more conversational. Once this is working we says this
 *       as v1 and improve UX
 */
violet.addKeyTypes({
  "bloodSugarLvl": "NUMBER",
});

violet.addPhraseEquivalents([
]);

violet.respondTo({
  expecting: ['Check in', 'Can I check in', 'I would like to check in'],
  resolve: (response) => {
   response.say('Sure.');
   response.addGoal('{{checkIn}}');
}});

violet.defineGoal({
  goal: '{{checkIn}}',
  prompt: ['Did you check your blood sugar level today?'],
  respondTo: [{
    expecting: ['GLOBAL Yes', 'I tested my blood sugar level'],
    resolve: (response) => {
     response.say('Great.');
     response.addGoal('{{checkInDetails}}');
  }}, {
    expecting: ['GLOBAL No', 'I cannot test my blood sugar level'],
    resolve: (response) => {
      response.addGoal('{{whyCannotTestBloodSugar}}');
  }}]
});

violet.registerGlobalIntents();
module.exports = app;
