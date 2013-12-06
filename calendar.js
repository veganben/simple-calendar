(function(w){
    if(!window.$) {
        w.$ = function(el,n) {
            var ret;
            if(document.getElementById(el)){
                ret = document.getElementById(el);
            } else {
                ret = document.querySelectorAll(el);
                if (typeof n === "number" && ret.length > n) {
                    ret = ret[n];
                }
            }
            if (ret.length == 0){
                return false
            }
            return ret;
        }
    }
}(window))
var SimpleCalendar = (function(){
    var core = {
        hasClassName: function(el, nom) {
            var ecn = (!!el&&el.className)?el.className:" ";
            return ecn.indexOf(nom) != -1;
        },
        addClassName: function(el,nom) {
            if(!core.hasClassName(el, nom)) {
                el.className += " " + nom;
            }
        },
        removeClassName: function(el,nom) {
            if(el){
                var cn = el.className || "";
                var reg = new RegExp();
                reg.compile("\\s\{1\,\}|\\b"+ nom + "\\b","gi");
                var cnn = cn.replace(reg," ");
                el.className = cnn;
            }
        },
        toggleClassName: function(el, nom) {
            if(!core.hasClassName(el, nom)) {
                core.addClassName(el, nom);
            } else {
                core.removeClassName(el, nom);
            }
        },
        isDescendant: function (parent, child) {
            var node = child;
            while (node != null) {
                if (node == parent) {
                    return true;
                }
                node = node.parentNode;
            }
            return false;
        },
        show: function(el) {
            if(el){
                if (el.outerHTML && el.outerHTML.indexOf("<table")==0){
                    core.addClassName(el,"showntable");
                } else {
                    core.addClassName(el,"shown");
                }
                core.removeClassName(el,"hidden");
            }
        },
        hide: function(el) {
            if(el){
                core.addClassName(el,"hidden");
                core.removeClassName(el,"shown");
            }
        }

    };

    var monthNames = ["January", "Feburary", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    var dayNames = ["Sun","Mon","Tues","Wed","Thurs","Fri","Sat"];
    var monthLength = [31, 0, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
	var currentMonth = {};
    var clickHandler = function() {};
    var triggerElement = null;
    var isOpen = false;

	var calendarEvents = function(e) {
	    var t = e.target,
	        h = t.innerHTML,
	        nextM,
	        nextY,
	        saved = currentMonth,
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
	        createCalendar(nextM, nextY);
	        return;
	    }
	    if(core.hasClassName(t, "inactive")) {
	        return false;
	    }
	    if ( h == parseInt(h) && h < 32) {
            triggerElement.value = "" + h + ". " + monthNames[saved.month] + " " + saved.year;
            var theDate = new Date(saved.year, saved.month, h).toISOString();
            triggerElement.setAttribute("data-date", theDate);
            hideCalendar();
	        clickHandler(theDate);
	    }
	};

	var windowClick = function(e) {
        var el = e.target;
        e.preventDefault();
        if(el != triggerElement && !core.isDescendant($("calendar"), el)) {
            if(isOpen) {
                hideCalendar();
            }
        }
    };

	var hideCalendar = function() {
        core.hide($("calendar"));
        window.removeEventListener("click", windowClick, false);
        isOpen = false;
    };

	var showCalendar = function() {
	    core.show($("calendar"));
	    window.addEventListener("click", windowClick, false);
	    isOpen = true;
	};

	var createCalendar = function(month, year) {
	    var t = new Date();
	    if((month || month == 0) && year) {
	        d = new Date(year, month, 1);
	    } else {
	        d = t;
	    }
	    var fullYear = (year || d.getFullYear()) *1,
	        month = (month || d.getMonth()) * 1,
	        monthName = monthNames[month],
	        i, j, k,
	        offset,
	        date, dateParts,
	        calString = "<tr>",
	        earlierThanThisMonth = d.getFullYear() < t.getFullYear() || d.getFullYear() === t.getFullYear() && d.getMonth() < t.getMonth(),
	        thisIsThisMonth = d.getFullYear() === t.getFullYear() && d.getMonth() === t.getMonth(),
	        inactiveClass = " class='inactive'";

	    currentMonth.month = month;
	    currentMonth.year = fullYear;
	    theFirst = new Date(fullYear, month, 1);
	    offset = (theFirst.getDay()  % 7) -1;

	    monthLength[1] = ( (fullYear % 4 !==0 ) && ( fullYear % 400 !== 0) ? 28 : 29 );
	    $(".easy-calendar>tbody")[0].innerHTML = "";
	    for ( i = (-1*offset), k = 0; i < ( 42 - offset); i++, k++, j = k % 7) {
	        calString += "<td" + ( i > 0 && i <= monthLength[month] ? (earlierThanThisMonth || thisIsThisMonth && i < t.getDate() ? inactiveClass : "") + ">" + i : ">") + "</td>";
	        if(j == 6 && i >=0 ){calString += "</tr><tr>"}
	    }
	    $("timeDate").innerHTML = '<time>' + monthName + '</time> <time datetime="'+ fullYear + '-'+ month+'">' + fullYear + '</time>'

	    $("#calendar>tbody")[0].innerHTML = calString;
	};

    var createStructure = function() {
        var calendarElement = $(".easy-calendar",0),
            output = "";
        core.addClassName(calendarElement, "zebra calendar hidden");
        output += "<thead><tr><th>&lt;</th><th colspan='5' id='timeDate'><time></time><time datetime></time></th><th>&gt;</th><tr>";
        for (var i=0;i<7;i++){
            output += "<th>" + dayNames[i] + "</th>";
        }
        output += "</tr></thead><tbody></tbody>";
        calendarElement.innerHTML = output;
        createCalendar();
    };
    var init = function(openElement, callback) {
		clickHandler = callback;
        triggerElement = openElement;
        triggerElement.addEventListener("click", showCalendar,false)
		$("calendar").addEventListener("click", calendarEvents, false);
        createStructure();
    };
    return {
        init: init
    }
}());