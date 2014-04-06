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
	  tag = tag.split(' ').join('');

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
	},

	getManyMedia: function(cb,nb){
		var all_media=[];
		var allInstagramDone = barrier(9,function(){
			console.log("ALL media", all_media);
			cb(all_media);
		});

		// Tweets.getTrendingTopics(function(data){
			//FAKE DATA
			var data =[{
			name: "#BuyBuckWildOniTunes",
			query: "%23BuyBuckWildOniTunes",
			url: "http://twitter.com/search?q=%23BuyBuckWildOniTunes",
			promoted_content: null
			},
			{
			name: "#WWEHOF",
			query: "%23WWEHOF",
			url: "http://twitter.com/search?q=%23WWEHOF",
			promoted_content: null
			},
			{
			name: "Aaron Harrison",
			query: "%22Aaron+Harrison%22",
			url: "http://twitter.com/search?q=%22Aaron+Harrison%22",
			promoted_content: null
			},
			{
			name: "#FinalFour",
			query: "%23FinalFour",
			url: "http://twitter.com/search?q=%23FinalFour",
			promoted_content: null
			},
			{
			name: "#PixelRaceGame",
			query: "%23PixelRaceGame",
			url: "http://twitter.com/search?q=%23PixelRaceGame",
			promoted_content: null
			},
			{
			name: "Uconn vs Kentucky",
			query: "%22Uconn+vs+Kentucky%22",
			url: "http://twitter.com/search?q=%22Uconn+vs+Kentucky%22",
			promoted_content: null
			},
			{
			name: "Wisconsin",
			query: "Wisconsin",
			url: "http://twitter.com/search?q=Wisconsin",
			promoted_content: null
			},
			{
			name: "#MarchMadness",
			query: "%23MarchMadness",
			url: "http://twitter.com/search?q=%23MarchMadness",
			promoted_content: null
			},
			{
			name: "Captain America",
			query: "%22Captain+America%22",
			url: "http://twitter.com/search?q=%22Captain+America%22",
			promoted_content: null
			},
			{
			name: "Florida",
			query: "Florida",
			url: "http://twitter.com/search?q=Florida",
			promoted_content: null
			}];
			var trending_topics = data;
			for(var i=0;i<trending_topics.length-1;i++){
				var tweets = Instagram.searchMediaByTag(trending_topics[i].name,function(media_data){
					all_media= all_media.concat(media_data.slice(1,nb));
					allInstagramDone();
				});
			}
	}
}
