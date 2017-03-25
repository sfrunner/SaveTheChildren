$("#information").hide();
$("#previous").hide();

var keyArray = ["AIzaSyDRDNChhRAne1dIBof67efRxBfachEQ3J8","AIzaSyBUG0vN5STrNDcWPYmVq1jPJsFQCH-F25Q","AIzaSyBwP6XaP6e2DuEQaqXMr6pbplO4GudxJxY","AIzaSyAYhyWSVsL86DP109ZivNQ6ZXpGwyns7zI","AIzaSyD9miZQ2zRNBaMIQWIOxawEj9-dds0zlBI"];
var keyNumber = 0;
var app = angular.module("myApp",[]);
var mainURL = "https://maps.googleapis.com/maps/api/geocode/json?";
var key = "AIzaSyATw30tgbosz8iKN0zi2WVL5y-jxEBPGto";
var weatherURL = "api.openweathermap.org/data/2.5/weather?q=";

app.controller("myCtrl", function($scope,$http){
	
	$scope.myFunction = function(cityInput) {
		var locationdataValue = angular.element("#locationdata").val().trim();
		var emailValue = angular.element("#email").val().trim();
		if(emailValue != "" && locationdataValue != ""){
			if(angular.element(".city-buttons").length == 0){
				var cityInput = angular.element("#locationdata").val().trim();
			}
			$http({
				method: "GET",
				url: mainURL + "address=" + cityInput + "&key=" + key
			}).then(function (response){
				console.log(response);
				//Error Handling geocoding api
				if(response.data.status.toLowerCase() == "zero_results"){
					var newDialog = $("<dialog>");
					newDialog.html("No Results Were Found. Please Try A Different Search");
					newDialog.attr("id","errorBox");
					$(".search").append(newDialog);
					newDialog.show();
					setTimeout(function(){
						newDialog.remove();
					}, 3000);
				}
				//Error Handling geocoding api
				else if(response.data.status.toLowerCase() !== "ok"){
					var newDialog = $("<dialog>");
					newDialog.attr("id","errorBox");
					newDialog.html("Error! Please Try Your Search Again");
					$(".search").append(newDialog);
					newDialog.show();
					setTimeout(function(){
						newDialog.remove();
					}, 3000);
				}
				else{
					//Regular Section Starts
					//.log(response.data.results[0].geometry.location.lat);
					console.log("Latitude is " + response.data.results[0].geometry.location.lat);
					console.log("Longitude is " + response.data.results[0].geometry.location.lng);
					var app = angular.module("myApp",[]);
					var queryURL = "https://maps.googleapis.com/maps/api/place/textsearch/json?query="+cityInput+"&location="+response.data.results[0].geometry.location.lat+","+response.data.results[0].geometry.location.lng+"&radius=8406&key=" + keyArray[keyNumber];

					$http({
						method: "GET",
						url: queryURL
					}).then(function successCallback(childResponse){
					//Error Handling geocoding api
						if(childResponse.data.status.toLowerCase() == "zero_results"){
							var newDialog = $("<dialog>");
							newDialog.html("No Results Were Found. Please Try A Different Search");
							newDialog.attr("id","errorBox");
							$(".search").append(newDialog);
							newDialog.show();
							setTimeout(function(){
								newDialog.remove();
							}, 3000);
						}	
			//Error Handling google photo reference api
						else if(childResponse.data.status.toLowerCase() !== "ok"){
							keyNumber++;
							var newDialog = $("<dialog>");
							newDialog.attr("id","errorBox");
							newDialog.html("Error! Please Try Your Search Again");
							$(".search").append(newDialog);
							newDialog.show();
							setTimeout(function(){
								newDialog.remove();
							}, 3000);
						}
						else{
							//Regular Section Starts
							console.log("HELLO", childResponse.data);
							var photoReference = childResponse.data.results[0].photos[0].photo_reference;

							var imageURL = "https://maps.googleapis.com/maps/api/place/photo?maxwidth=1000&photoreference="+photoReference+"&key=" + keyArray[keyNumber];

							$http({
								method: "GET",
								url: imageURL
							}).then(function (secondChildResponse){
								//Error Handling geocoding api
								if(childResponse.data.status.toLowerCase() == "zero_results"){
									var newDialog = $("<dialog>");
									newDialog.html("No Results Were Found. Please Try A Different Search");
									newDialog.attr("id","errorBox");
									$(".search").append(newDialog);
									newDialog.show();
									setTimeout(function(){
										newDialog.remove();
									}, 3000);
								}
								//Error Handling google photo api
								else if(childResponse.data.status.toLowerCase() !== "ok"){
									keyNumber++;
									var newDialog = $("<dialog>");
									newDialog.attr("id","errorBox");
									newDialog.html("Error! Please Try Your Search Again");
									$(".search").append(newDialog);
									newDialog.show();
									setTimeout(function(){
										newDialog.remove();
									}, 3000);
								}
								else{
									//Regular script starts
									$("#information").show();
									$("#previous").show();
									$("#city").html(cityInput);
									console.log(secondChildResponse.config.url);
									var image = $("<img>");
									image.attr("src",secondChildResponse.config.url);
									$(".background").hide();
									$(".search").hide();
									$("#background").empty();
									$("#background").append(image);
									image.addClass("backgroundImage");

									var widget = $("<div id='widget'></div>");
									widget.css({
									});
									$("#widget").append(widget);
									widget.addClass("widget");
									_aqiFeed({    
  										display:"<div style='color:#ffffff;max-width:180px;text-align:center;'><div style='font-size:60px;height:100px;padding-bottom:30px;'>%aqiv</div> %impact</div>",  
  										container:"widget",    
  										city: cityInput.replace(" ","").toLowerCase()
  									});  
						
									var weatherURL = "http://api.openweathermap.org/data/2.5/weather?lat="+response.data.results[0].geometry.location.lat+"&lon="+response.data.results[0].geometry.location.lng+"&appid=2e0b1f9b2b01a0eac68955d495e769b7";
									$http({
										method: "GET",
										url: weatherURL
									}).then(function (thirdChildResponse){
										var temp = thirdChildResponse.data.main.temp;
										var fahrenheitTemp = Math.round(temp*(9/5)-(459.67));
										console.log(fahrenheitTemp);
										$("#tempInfo").html(fahrenheitTemp+"°F");
									});

									var theLat = (response.data.results[0].geometry.location.lat).toFixed(0);
									var theLong = (response.data.results[0].geometry.location.lng).toFixed(0);
									console.log(theLat);
									console.log(theLong);
									var uvURL = "http://api.openweathermap.org/v3/uvi/"+theLat+","+theLong+"/current.json?appid=aae9e9af552036e9f4bea0d156fa613d";
									console.log(uvURL);
									$http({
										method: "GET",
										url: uvURL
									}).then(function (fourthChildResponse){
										console.log(fourthChildResponse.data.data);
										$("#uvInfo").html(fourthChildResponse.data.data);
									});
									//else third error handling ends	
								}
							});
						//second else error
						}
					});
				//first else error
				}
			});	
		}			
	}
});

$("#home").on("click",function(){
	$("#information").hide();
	$("#previous").hide();
	$(".background").show();
	$(".search").show();
	$(".widget").hide();
    $("#locationdata").val("");
})
