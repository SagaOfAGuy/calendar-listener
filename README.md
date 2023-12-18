# Google-Calendar-Listener
Google Apps Script that detects changes to a given group of Google calendars, and sends an email to the user that created that event. 

Could serve as a start script for other more large scale projects

## Installation Tutorial
Instructions for installing the script onto Google Apps Script dashboard. 

1. Navigate to https://script.google.com/home


2. On the starting page, create a new project


![Alt text](images/image.png)

3. Name the Google Apps Script project. In this example, we will name it `CalendarListener-2`. Click the **Rename** button after you've added the desired name. 

![Alt text](images/image-1.png)

4. Copy and paste the code in the `Code.gs` file into the Google Apps Script text editor 

![Alt text](images/image-2.png)

5.  Click the "save" button to save the project

![Alt text](images/image-3.png)

6. In the project, scroll down to line 6 of the project. Customize the parameter inside of the `getCalendarWithPrefix` function. In our case, we are targeting calendars that start with the prefix `Test`. 

![Alt text](images/image-4.png)

7. Navigate to https://calendar.google.com. Double check in Google calendar that the Google calendars we are targeting actually exists. On our case, we confirm that we have 2 calendars that start with the Prefix text `Test` which are `Test-3` and `Test-4`: 

![Alt text](images/image-5.png)

8. Back to https://script.google.com/home , scroll down to line 113. Customize the email message you desire to send to the event creator's email address. In the screenshot below, we are sending an email to the event creator's email, giving it a subject of "Test Email", and sending the email body which consists of the Event name, Event creation date, and the event organizer's email. Note that this is only a test email and for demo purposes so your email will be different from this generic example email. 

![Alt text](images/image-6.png)


9. After making the changes above, we make sure that the `setUpTrigger` function is selected as the entry point of our script. This function creates our triggers for our Google Calendars that fulfill having the prefix name specified in the `getCalendarWithPrefix` function. In our case, this creates event triggers on our Google calendars "Test-3" and "Test-4" as described back in step 7. 

![Alt text](images/image-7.png)

10. We click the "Run" button to run our script: 

![Alt text](images/image-8.png)

11. After clicking "Run" we get an Authorization screen. Click the "Review Permissions" button

![Alt text](images/image-9.png)

12. Choose an account we want to run our script: 

![Alt text](images/image-10.png)

13. Click the "Advanced" tab

![Alt text](images/image-11.png)

14. Click "Go to CalendarListener-2 (unsafe)" tab: 

![Alt text](images/image-12.png)

15. Click the "Allow" button: 

![Alt text](images/image-13.png)

16. Now, we can Click the "Run" button once more. 

![Alt text](images/image-14.png)

17. In the execution log, we should see some output. The "*.calendar.google.com" strings are the calendar Ids for our targeted Google calendars which in our case are `Test-3` and `Test-4`. We also notice that our trigger Ids have been stored in the Google Apps Script properties database. 

![Alt text](images/image-15.png)

18. Navigate to the "Triggers" tab

![Alt text](images/image-16.png)

19. Click the "Triggers" tab

![Alt text](images/image-17.png)

20. Notice that we now have 2 triggers for both of our `Test-3` and `Test-4` calendars: 

![Alt text](images/image-18.png)

21. Click on the "Executions" tab to confirm our script executed without error: 

![Alt text](images/image-19.png)

22. We notice that the script completed without error: 

![Alt text](images/image-20.png)

23. To test our trigger for calendar `Test-3`, we navigate on over to https://calendar.google.com and create an event for that calendar, and click the "Save" button: 

![Alt text](images/image-21.png)

24. After the event has been created, we navigate back over to the "Executions" page, and see that our script ran without error

![Alt text](images/image-22.png)

![Alt text](images/image-23.png)

25. To further confirm our script ran properly, we check our email and see the email message that we customized back in step 8. Because we created the calendar event called "Test Event" in Google calendar `Test-3`, it would send an email to ourselves. Note that if another person other than ourselves created the calendar event, they would be the ones recieving the email. 

![Alt text](images/image-24.png)

26. We do the same steps above for creating an event in calendar `Test-4`, and we recieve an email indicative that the script properly completed its task: 

Note that we created a new calendar event for calendar "Test-4", and named it "Testing Event # 2". We click the save button to save the event: 

![Alt text](images/image-26.png)

We confirm that the script has worked as we recieve an email: 
![Alt text](images/image-25.png)


## Configuration 

### Changing Calendar prefix text
We do this if we want to grab calendars with other prefix texts. For example, we may not have calendars named `Test-3` or `Test-4`. We may have other calendar names such as `Team-1` and `Team-2`. In this case, the prefix search string would be `Team`. We can go to line 6 to change the prefix text search string. 


Example: 
```
// This will get all calendars that start with the name 'Team' which will get calendars named "Team-1" and "Team-2" and so on

var filteredCalendars = getCalendarsWithPrefix("Team");

// Other examples
var filteredCalendars = getCalendarsWithPrefix("IT");

var filteredCalendars = getCalendarsWithPrefix("DEV");

var filteredCalendars = getCalendarsWithPrefix("Account");
```

### Customizing Email message
To do this we can change line 112. Here is an example: 
```
 // Send email to assumed owner
sendMail(latestEventCreatorEmail, "Warning!", "You just created an event!"); 
```
