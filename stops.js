class StopList/*I dont think this needs its own class unless it extends another class */ {
	constructor(busroutenumber){
		
	}
	
	function getAPIname(busroute '401'){
		return 'http://api.translink.ca/rttiapi/v1/stopsapikey=5SWf1ehJ5hqNp6dfxiA2&routeNo=' + busroute;
	}
	var APILink = getAPIname('401'/*input bus route here */); 

	
	var array = [];
	var xmlhttp = new XMLHttpRequest();
	xmlhttp.open('GET', (APILink.request.Headers.Add("accept", "application/JSON")), true);
	xmlhttp.onreadystatechange = function() {
    if (xmlhttp.readyState == 4) {
        if(xmlhttp.status == 200) {
            var obj = JSON.parse(xmlhttp.responseText);
	    for (var key in obj) {
  		if (obj.hasOwnProperty(key)) {
			array.push({
				stopName: obj[key].Name,
				latitude: obj[key].longitude,
				longitude: obj[key].latitude
  			});
		}
	
            
         }
    }
};
xmlhttp.send(null);

