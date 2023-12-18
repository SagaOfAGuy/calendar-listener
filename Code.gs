// Function to create the triggers for events created on EACH calendar
function setUpTrigger() {


   // Grab all calendars with desired prefix name. In our case, this is test. Change the "test" prefix
   var filteredCalendars = getCalendarsWithPrefix("Test");


   // Loop through all of those calendars
   for(var index = 0; index < filteredCalendars.length; index++) {


    // Grab the calendar id for each calendar 
    var calendarId = filteredCalendars[index].getId(); 

    
    // Create the calendar event listener trigger. We run the checkForNewMeetings() function for this trigger
    Logger.log(`${calendarId}`); 
    var trigger = ScriptApp
      .newTrigger('checkForNewMeetings')
      .forUserCalendar(calendarId)
      .onEventUpdated()
      .create()

    
    // Store the trigger Id of the created trigger 
   PropertiesService.getScriptProperties().setProperty('triggerId_' + calendarId, trigger.getUniqueId());


   // Log storing the trigger Id 
   Logger.log(`Trigger id ${trigger.getUniqueId()} has been stored in properties`)
   }
}






// Function to help find new meetings on particular calendar. We have 'e' as an event object that we can grab the trigger Id from
function checkForNewMeetings(event) {


    // Grab the current trigger Id based from the event kicked off from the trigger
    var recentTriggerId = event.triggerUid
    Logger.log(`Recent trigger Id returned from event: ${recentTriggerId}`);
    
    
    // Grab all trigger ids that have been stored so far. These should only be trigger Ids at this point. These are stored in the function 'setUpTrigger()' 
    var scriptProperties = PropertiesService.getScriptProperties();
    var allProperties = scriptProperties.getProperties();


    // Loop through the stored trigger ids in the properties database
    for (var property in allProperties) {
      Logger.log(`Stored trigger from properties database: ${allProperties[property]}`);


      // If the recent trigger id matches one of the trigger ids stored in properties
      if(recentTriggerId == allProperties[property]) {


        // Grab the calendar id that is stored in the name of the property name Id
        var [, calendarId] = property.split('_');
        Logger.log(`calendar Id: ${calendarId}`);
        

        // Grab the calendar based on the calendar Id that we grabbed
        var calendar = CalendarApp.getCalendarById(calendarId);
  

        // Get all events from now until a future date. From years 1900 to 2100 which should cover all meeting events on the calendar
        var events = calendar.getEvents(new Date('1900-01-01'), new Date('2100-01-01'));
        

        // Create a map so we can store events by year
        const eventsByYear = new Map();
        
        
        // Sort the events based on date of creation
        events.forEach(event => {
          const creationYear = event.getDateCreated().getFullYear();
          const eventsInYear = eventsByYear.get(creationYear) || [];
          eventsInYear.push(event);
          eventsInYear.sort((a, b) => a.getDateCreated() - b.getDateCreated());
          eventsByYear.set(creationYear, eventsInYear);
        });


        // Create an array to hold the events sorted by the creation date
        const sortedEvents = Array.from(eventsByYear.values()).flat();


        // Grab the most recently created event based on creation date
        const latestEvent = sortedEvents[sortedEvents.length-1];


        // Grab the email of the owner (assuming its the first email)
        const latestEventCreatorEmail = latestEvent.getCreators()[0]; 
        const latestEventName = latestEvent.getTitle();
        const latestEventCreationDate = latestEvent.getDateCreated(); 


        // Logging date created and latest event for debugging
        Logger.log(`
Latest event creation: ${latestEventCreationDate} 
Latest event name: ${latestEventName} 
Latest event creator email: ${latestEventCreatorEmail}
        `); 

        
        // Send email to assumed owner
        sendMail(latestEventCreatorEmail, "Test Email", `
        Event Name: ${latestEventName} 
        Event Created at: ${latestEventCreationDate}
        
        Event organizer email: ${latestEventCreatorEmail}
        `); 
      }
    }
}







// Function to filter calendars by Prefix text. 
function getCalendarsWithPrefix(prefix) {
  // Get all calendars accessible by the current user
  var calendars = CalendarApp.getAllCalendars();
  

  // Filter calendars that have the specified prefix
  var filteredCalendars = calendars.filter(function(calendar) {
    return calendar.getName().indexOf(prefix) === 0; // Check if the name starts with the prefix
  });


  // Return array of calendars that have that prefix name
  return filteredCalendars;
}






// Function to send email to person who booked the event
function sendMail(recipient, subject, body) { 
   try {
    // Send the email
    MailApp.sendEmail({
      to: recipient,
      subject: subject,
      body: body
    });

    
    // Show whether or not email was able to send
    Logger.log('Email sent successfully.');
  } catch (error) {
    Logger.log('Error sending email: ' + error.toString());
  }
}







// Function to delete all properties and all existing triggers
function cleanUp() { 
  
  // Delete all properties that are stored
  PropertiesService.getScriptProperties().deleteAllProperties();


  // Grab all existing triggers
  var allTriggers = ScriptApp.getProjectTriggers();


  // Loop through all existing triggers
  for (var i = 0; i < allTriggers.length; i++) {

      // Delete all triggers
      ScriptApp.deleteTrigger(allTriggers[i]);
  }
  
  // Log that triggers have been deleted
  Logger.log('All triggers deleted.');
}

