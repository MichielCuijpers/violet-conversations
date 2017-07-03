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


//common across multiple goals
violet.addPhraseEquivalents([
 ['I\'m', 'I am'],
 ['When\'s', 'When is'],
 ['I\'d', 'I would']
]);

violet.addTopLevelGoal();

violet.respondTo({
  expecting: ['Yes that works for me'],
  resolve: (response) => {
   response.say('Okay. Let me check your calendars and find the best time');
}});


violet.registerIntents();

module.exports = violet;
