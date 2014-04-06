var api_tools = "http://d7f91bb8-4e6a01aaa4c0.my.apitools.com/";

var tembooIgUrl = "https://picsoung.temboolive.com/temboo-api/1.0/choreos/Library/Instagram/";

var Instagram = {
	searchMediaByLocation: function(lat,lon,distance){
		// var api_url = tembooIgUrl + "SearchMedia"
		// api_url+="?preset=igAccesToken";
		// api_url+="&lat="+lat;
		// api_url+="&lng="+lon;

		// console.log(api_url);

		// var request_data = {
		// 	'preset':"igAccesToken",
		// 	'inputs': [{'name':"Latitude", 'value':lat},{'name':"Longitude", 'value':lon}]
		// };

		// $.ajax({
	 //        type: "POST",
	 //        url: api_url,
	 //        dataType: "jsonp",
	 //        headers:{
	 //        	"Authorization":"Basic bXlGaXJzdEFwcDpkMDBlOWExMWY1OWY0ZDU1YmJhY2NmMDJkMmNlNDY4Yw=",
	 //        	"x-temboo-domain":"/picsoung/master",
	 //        	"Content-Type": "application/json; charset=utf-8",
	 //        	"Accept": "application/json",
	 //        },
	 //        // data: request_data,
	 //        success: function (response, status, xhr) {
  //             console.log(response[0].trends);
  //             return response[0].trends;
	 //        },
	 //        error: function (xhr, err) {
	 //          console.log(xhr);
	 //          console.log(xhr.statusText);
	 //        }
		// });

		var api_url = api_tools + "media/search";
		api_url+= "?lat="+lat;
		api_url+= "&lng="+lon;
		api_url+= "&distance="+distance;
		api_url+= "&access_token=39190672.f75d2ca.d43e51bf817f4da1b23699852d0192f0";

		$.ajax({
	        type: "GET",
	        url: api_url,
	        dataType: "jsonp",
	        success: function (response, status, xhr) {
              console.log(response);
              return response.data;
	        },
	        error: function (xhr, err) {
	          console.log(xhr);
	          console.log(xhr.statusText);
	        }
		});
	},

	searchMediaByTag: function(tag, cb){
	  //No # or %23 character
	  tag = tag.replace('#','');
	  tag = tag.replace('%23','');

	  var api_url = api_tools +'tags/';
	  api_url += tag+"/";
	  api_url += "media/recent";
	  api_url += "?access_token=39190672.f75d2ca.d43e51bf817f4da1b23699852d0192f0";
	  $.ajax({
	        type: "GET",
	        url: api_url,
	        dataType: "jsonp",
	        success: function (response, status, xhr) {
              console.log(response);
              return cb(response.data);
	        },
	        error: function (xhr, err) {
	          console.log(xhr);
	          console.log(xhr.statusText);
	        }
		});
	}
}
