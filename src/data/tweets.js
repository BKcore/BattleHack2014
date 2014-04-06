var api_root = "http://c2952e3a-4e6a01aaa4c0.my.apitools.com/1.1/";

var Tweets  = {
	getTrendingTopics: function(cb){
		// var api_url = "https://api.twitter.com/1.1/trends/place.json?id=2487956"; //SF id
		var api_url = api_root+"trends/place.json?id=2487956"
		$.ajax({
	        type: "GET",
	        url: api_url,
	        dataType: "jsonp",
	        success: function (response, status, xhr) {
              cb(response[0].trends);
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
	getTweetsByTag: function(query,nb,cb){
		var api_url = api_root+"search/tweets.json";
		api_url+="?q="+encodeURIComponent(query);
		api_url+="&count="+nb;
		$.ajax({
	        type: "GET",
	        url: api_url,
	        dataType: "jsonp",
	        success: function (response, status, xhr) {
              cb(response.statuses)
	        },
	        error: function (xhr, err) {
	          console.log(xhr);
	          console.log(xhr.statusText);
	        }
		});
	},
	getManyTweets: function(cb,nb){
		var all_tweets=[];
		var allDone = barrier(9,function(){
			console.log("ALL TWEETS", all_tweets);
			cb(all_tweets);
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
			console.log("ahahahaha", data);
			for(var i=0;i<trending_topics.length-1;i++){
				var tweets =Tweets.getTweetsByTag(trending_topics[i],nb,function(tweets_data){
					all_tweets= all_tweets.concat(tweets_data);
					allDone();
				});
			}
	}
}
