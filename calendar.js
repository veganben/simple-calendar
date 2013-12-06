var Calendar = (function(){

    var monthName = ["January", "Feburary", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    var dayNames = ["Sun","Mon","Tues","Wed","Thurs","Fri","Sat"];
    var monthLength = [31, 0, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
	var currentMonth = {};
    var clickHandler = function() {};
    var triggerElement: null;
    var isOpen = false;

	var calendarEvents = function(e) {
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
            Calendar.triggerElement.value = "" + h + ". " + Calendar.monthName[saved.month] + " " + saved.year;
            var theDate = new Date(saved.year, saved.month, h).toISOString();
            Calendar.triggerElement.setAttribute("data-date", theDate);
            Calendar.hideCalendar();
	        Calendar.clickHandler(theDate);
	    }
	};

	var windowClick = function(e) {
        var el = e.target;
        e.preventDefault();
        if(el != Calendar.triggerElement && !core.isDescendant($("calendar"), el)) {
            if(Calendar.isOpen) {
                Calendar.hideCalendar();
            }
        }
    };

	var hideCalendar = function() {
        core.hide($("calendar"));
        window.removeEventListener("click", Calendar.windowClick, false);
        Calendar.isOpen = false;
    };

	var showCalendar = function() {
	    core.show($("calendar"));
	    window.addEventListener("click", Calendar.windowClick, false);
	    Calendar.isOpen = true;
	};

	var createCalendar = function(month, year) {
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
	    $(".easy-calendar>tbody")[0].innerHTML = "";
	    for ( i = (-1*offset), k = 0; i < ( 42 - offset); i++, k++, j = k % 7) {
	        calString += "<td" + ( i > 0 && i <= Calendar.monthLength[month] ? (earlierThanThisMonth || thisIsThisMonth && i < t.getDate() ? inactiveClass : "") + ">" + i : ">") + "</td>";
	        if(j == 6 && i >=0 ){calString += "</tr><tr>"}
	    }
	    $("timeDate").innerHTML = '<time>' + monthName + '</time> <time datetime="'+ fullYear + '-'+ month+'">' + fullYear + '</time>'

	    $("#calendar>tbody")[0].innerHTML = calString;
	};

    var createStructure: function() {
        var calendarElement = $(".easy-calendar",0),
            output = "";
        core.addClassName(calendarElement, "zebra calendar hidden");
        output += "<thead><tr><th>&lt;</th><th colspan='5' id='timeDate'><time></time><time datetime></time></th><th>&gt;</th><tr>";
        for (var i=0;i<7;i++){
            output += "<th>" + Calendar.dayNames[i] + "</th>";
        }
        output += "</tr></thead><tbody></tbody>";
        calendarElement.innerHTML = output;
        Calendar.createCalendar();
    };

    var init = function(openElement, callback) {
		Calendar.clickHandler = callback;
        Calendar.triggerElement = openElement;
        Calendar.triggerElement.addEventListener("click", Calendar.showCalendar,false)
		$("calendar").addEventListener("click", Calendar.calendarEvents, false);
        Calendar.createStructure();
    };
    return {
        init: init
    }
}());