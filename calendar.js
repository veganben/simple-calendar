var Calendar = {

    monthName: ["January", "Feburary", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
    monthLength: [31, 0, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],

    clickHandler: function() {},
    triggerElement: null,

	calendarEvents: function(e) {
	    var t = e.target,
	        h = t.innerHTML,
	        nextM,
	        nextY,
	        saved = Calendar.currentMonth,
	        tc, showid;
	    // switch calendar
	    e.preventDefault();
	    switch (h.toString()) {
	        case "&lt;":
	            nextM = saved.month == 0 ? 11 : saved.month - 1;
	            nextY = saved.month == 0 ? saved.year - 1 : saved.year;
	            break;
	        case "&gt;":
	            nextM = saved.month < 11 ? saved.month + 1 : 0;
	            nextY = saved.month < 11 ? saved.year : saved.year + 1;
	    }
	    if ((nextM || nextM === 0) && nextY) {
	        Calendar.createCalendar(nextM, nextY);
	        return;
	    }
	    if(core.hasClassName(t, "inactive")) {
	        return false;
	    }
	    if ( h == parseInt(h) && h < 32) {
	        if (core.hasClassName(t, "hasevent")){
	            showId = tc.substr(tc.indexOf("showid_")+7,2);
	            console.log(showid);

                url = "/php/getShows.php?showID=" + showId;
                simpleAjax(url, function(data){
                    var film = JSON.parse(data);
                    console.log(film);
                });

	        } else {
                // core.show($("addShowFormContainer"));
	            // $("addshowingError").innerHTML = "";
                Calendar.triggerElement.value = "" + h + ". " + Calendar.monthName[saved.month] + " " + saved.year;
                var theDate = new Date(saved.year, saved.month, h).toISOString();
                Calendar.triggerElement.setAttribute("data-date", theDate);
                core.hide($("calendar"));
	        }
	        Calendar.clickHandler();
	    }
	},

	currentMonth: {},

	showCalendar: function() {
	    core.show($("calendar"));
	},

	createCalendar: function(month, year) {
	    var t = new Date();
	    if((month || month == 0) && year) {
	        d = new Date(year, month, 1);
	    } else {
	        d = t;
	    }
	    var fullYear = year || d.getFullYear(),
	        month = month || d.getMonth(),
	        monthName = Calendar.monthName[month],
	        i, j, k,
	        offset,
	        date, dateParts,
	        calString = "<tr>",
	        earlierThanThisMonth = d.getFullYear() < t.getFullYear() || d.getFullYear() === t.getFullYear() && d.getMonth() < t.getMonth(),
	        thisIsThisMonth = d.getFullYear() === t.getFullYear() && d.getMonth() === t.getMonth(),
	        inactiveClass = " class='inactive'";

	    Calendar.currentMonth.month = month;
	    Calendar.currentMonth.year = fullYear;
	    theFirst = new Date(fullYear, month, 1);
	    offset = (theFirst.getDay()  % 7) -1;

	    Calendar.monthLength[1] = ( (fullYear % 4 !==0 ) && ( fullYear % 400 !== 0) ? 28 : 29 );
	    $("#calendar>tbody")[0].innerHTML = "";
	    for ( i = (-1*offset), k = 0; i < ( 42 - offset); i++, k++, j = k % 7) {
	        calString += "<td" + ( i > 0 && i <= Calendar.monthLength[month] ? (earlierThanThisMonth || thisIsThisMonth && i < t.getDate() ? inactiveClass : "") + ">" + i : ">") + "</td>";
	        if(j == 6 && i >=0 ){calString += "</tr><tr>"}
	    }
	    $("timeDate").innerHTML = '<time>' + monthName + '</time> <time datetime="'+ fullYear + '-'+ month+'">' + fullYear + '</time>'

	    $("#calendar>tbody")[0].innerHTML = calString;

	    /*for(i = 0, j = allshows.length-1; i < j; i++){
	        date = allshows[i].start_time.split(" ")[0];
	        dateParts = date.split("-");
	        if (dateParts[0] == fullYear && dateParts[1]-1 == month){
	            $("#calendar td")[parseInt(dateParts[2])+offset].className = "hasevent showid_"+allshows[i].id ;
	        }
	    }*/
	},

    init: function(openElement, callback) {
		Calendar.clickHandler = callback;
        Calendar.triggerElement = openElement;
        Calendar.triggerElement.addEventListener("click", Calendar.showCalendar,false)
		$("calendar").addEventListener("click", Calendar.calendarEvents, false);
        Calendar.createCalendar()
    }
};