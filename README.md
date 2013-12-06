simple-calendar
===============

It's a no-nonsense pop up calendar date picker ting.
It handles leap years and centuries, is super-easily adaptable to localisation and handles all it's own event management, returning an ISO Date String to a user-defined callback.

![simple-calendar screenshot](/screenshots/screenshot.png "Outta the box styling")

How To
------

add a link to the js file and another one to the css

    <link rel="stylesheet" type="text/css" href="./css/showing.css" />
    <script src="./js/calendar.js" type="text/javascript"></script>

and, from your own javascript, initialise with a DOM node and a callback.


    Calendar.init(domNode, callback);

The dom node is the element which, when clicked, triggers the pop up calendar. Style its position yourself.

The callback function should be able to handle an ISO Date format parameter (it's a string)

This ISO Date is also dumped into the DOM as a "data-date" attribute of the triggering element (the one you passed in to the init)

calendar.html has a full working example - take a look and adapt it for yourself.

Told you it was no-nonsense.


