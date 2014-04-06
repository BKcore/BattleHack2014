var api_root = "http://c2952e3a-4e6a01aaa4c0.my.apitools.com/1.1/";

var Tweets  = {
	getTrendingTopics: function(){
		// var api_url = "https://api.twitter.com/1.1/trends/place.json?id=2487956"; //SF id
		var api_url = api_root+"trends/place.json?id=2487956"
		$.ajax({
	        type: "GET",
	        url: api_url,
	        dataType: "jsonp",
	        success: function (response, status, xhr) {
              console.log(response[0].trends);
              return response[0].trends;
	        },
	        error: function (xhr, err) {
	          console.log(xhr);
	          console.log(xhr.statusText);
	        }
		});
	},
	getLocatedTweets: function(query,lat,lon,radius,cb){
		console.log(query);
		var api_url = api_root+"search/tweets.json";
		api_url+="?q="+encodeURIComponent(query);
		var geoloc = lat+","+lon+","+radius+"km"
		api_url+="&geocode="+encodeURIComponent(geoloc);
		console.log(api_url);
		$.ajax({
	        type: "GET",
	        url: api_url,
	        dataType: "jsonp",
	        success: function (response, status, xhr) {
              cb(response.statuses);
	        },
	        error: function (xhr, err) {
	          console.log(xhr);
	          console.log(xhr.statusText);
	        }
		});

	},
}
