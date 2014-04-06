var api_tools = "http://842b9006-4e6a01aaa4c0.my.apitools.com/"
var Events ={
	getConcerts: function (lat,lon,cb) {
		var api_url = api_tools+"events";
		api_url += "?lat="+lat;
		api_url += "&lon="+lon;
		$.ajax({
	        type: "GET",
	        url: api_url,
	        dataType: "jsonp",
	        success: function (response, status, xhr) {
	          console.log(response);
              cb(response.events);
	        },
	        error: function (xhr, err) {
	          console.log(xhr);
	          console.log(xhr.statusText);
	        }
		});
	}	
}