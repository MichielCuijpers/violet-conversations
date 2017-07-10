violet.respondTo({
  expecting: ['Can you set a reminder for me', 'I would like to set a reminder'],
  resolve: (response) => {
   response.say('Go ahead. I\'m listening');
}});

violet.respondTo({
  expecting: ['Please add the following [[reminderText]]'],
  resolve: (response) => {
   response.say('Got it! I heard ' + response.get('[[reminderText]]'));
   console.log('here\'s what I heard: ' + response.get('[[reminderText]]'));

   response.set('<<reminder.date>>', new Date() );
   response.set('<<reminder.description>>', response.get('[[reminderText]]') );
   response.store('<<reminder>>');
}});

violet.respondTo({
 expecting: ['When is my appointment with [[doctor]]?', 'When do I see [[doctor]] next', 'Do I have an upcoming appointment with [[doctor]]'],
  resolve: function *(response) {
    var apptDateArray = yield response.load('<<appointment>>', '<<appointment.doctorName>>', response.get('[[doctor]]'), null, 'AND appointmentDateTime__c >= today ORDER BY appointmentDateTime__c ASC NULLS FIRST LIMIT 1');
    
    console.log(apptDateArray);

    if (apptDateArray.length > 0) {
      var apptDateTime = response.get('<<appointment>>')[0].appointmentDateTime;

      if (apptDateTime) {
        var apptDate = new Date(apptDateTime);
        var noDayOfWeek = apptDate.getDay();
        var dayOfTheWeek = days[noDayOfWeek];
        var daysBetween = Date.daysBetween(new Date(), apptDate);
        var apptMonth = months[apptDate.getMonth()];
        var apptDayOfTheMonth = apptDate.getDate();
        var hour = apptDate.getHours();
        var minutes = apptDate.getMinutes();
        var minutesString = minutes;

        var amOrPm = 'A M';

        if (hour >= 12) {
          amOrPm = 'P M'
        }

        if (hour > 12) {
          hour = hour - 12;
        }

        if (minutes == 0) {
          minutesString = '';
        }


        console.log(daysBetween);
          
        if (daysBetween == 0) {
          response.say('Your next appointment with ' + response.get('[[doctor]]') + ' is today at ' + hour + " " + minutesString + ' ' + amOrPm);    
        } else if (daysBetween == 1) {
          response.say('Your next appointment with ' + response.get('[[doctor]]') + ' is tomorrow at ' + hour + " " + minutesString + ' ' + amOrPm);  
        }
        else if (daysBetween < 7) {
          response.say('Your next appointment with ' + response.get('[[doctor]]') + ' is on ' + dayOfTheWeek + ' at ' + hour + " " + minutesString + ' ' + amOrPm);  
        } else {
          response.say('Your next appointment with ' + response.get('[[doctor]]') + ' is on ' + dayOfTheWeek + ' ' + apptMonth + ' ' + apptDayOfTheMonth + ' at ' + hour + " " + minutes+ ' ' + amOrPm);  
        }
      }
    }
    else {
      response.say('I do not see an appointment with ' + response.get('[[doctor]]') + ' on your calendar. Would you like me to schedule one?');
    }

    
  }
});