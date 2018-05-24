 "use strict";

var urlPattern=/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&\/\/=]*)/;

function refreshEventList(){
	console.log("Refreshing event list.");
	
	var url="http://stuartspence.ca/api/google_calendar_proxy?calendar_id=shyshyschullie@gmail.com";
	
	$.ajax({
		url: url,
		headers: {"Access-Control-Allow-Origin":"*"},
		type: "GET",
		success:function(data){
			console.log("Successfully retrieved Calendar API data.");
			handleCalendarData(data);
		}		
		})
}

function handleCalendarData(data){
	console.log("Successfully retrieved Calendar API data.");
	data.items.sort(function(a,b){
		var aDate="dateTime" in a.start?a.start.dateTime:a.start.date;
		var bDate="dateTime" in b.start?b.start.dateTime:b.start.date;
		return aDate>bDate;
	});
	for (var index=0;index<data.items.length;index++){
		var event=data.items[index];
		processEventData(event);
	}	
}

function processEventData(event){
	//Process one event item from the JSON array returned by the Google Calendar API request.
	
	try{
		var title=event.summary;
		var url = urlPattern.exec(event.description);
		url=url?url[0]:"";
		
		var d = "dateTime" in event.start?event.start.dateTime:event.start.date;
		var dateText=moment(d).format("dddd, MMMM Do");
		
		var details="";	
		if("dateTime" in event.start){
			details=moment(d).format("h:mm a")+" to "+moment(event.end.dateTime).format("h:mm a");
		}
		
		addEvent(dateText,title,details,url);
	}catch(error){
		console.error("processEventData failed.");
		console.error(JSON.stringify(event,null,2));
		console.error(error);
	}
}

function addEvent(dateText,title,details,url){
	var event=getNewEventElement("#event-template");
	setEventElement(event,dateText,title,details,url);
}

function setEventElement(event,dateText,title,details,url){
	$(event).find(".event-date").html(dateText);
	$(event).find(".event-title").html(title);
	$(event).find(".event-details").html(details);
	
	var urlButton=$(event).find(".event-url");
	if(url){
		urlButton.attr("href",url);
	}else{
		urlButton.remove();
	}
	$("#events-container").append(event);
}

function getNewEventElement(query){
	var clone = $(query).clone(true,true);
	if (clone.length != 1){
		console.error("Uh oh! getEventClone query did not find exactly one element. query = '"+query+"'");
	}
	clone.removeAttr("id");
	return clone;
}

$(document).ready(function(){
	refreshEventList();
});