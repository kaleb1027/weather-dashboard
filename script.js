//GIVEN a weather dashboard with form inputs
//WHEN I search for a city
//THEN I am presented with current and future conditions for that city and that city is added to the search history
//WHEN I view current weather conditions for that city
//THEN I am presented with the city name, the date, an icon representation of weather conditions, the temperature, the humidity, the wind speed, and the UV index
//WHEN I view the UV index
//THEN I am presented with a color that indicates whether the conditions are favorable, moderate, or severe
//WHEN I view future weather conditions for that city
//THEN I am presented with a 5-day forecast that displays the date, an icon representation of weather conditions, the temperature, the wind speed, and the humidity
//WHEN I click on a city in the search history
//THEN I am again presented with current and future conditions for that city



var apikey = "50c9e11eea8b4547fcca53e292e4ee18";
var tempP = document.getElementById("temp");
var windP = document.getElementById("wind");
var humidP = document.getElementById("humid");
var uvP = document.getElementById("uv");
var cityForm = document.querySelector("form")
var cityHead = document.querySelector("#cityName")
var headIMG = document.createElement("img")
var cityInput = document.querySelector("#city");
var uvNum = document.querySelector("#index");
var cityStats = document.querySelector("#cityStats");
var cities = [];


function currentWeather(city) {
    
    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + apikey;
    fetch(queryURL)
    .then(function(response){
        console.log(response);
        return response.json();
    })
    .then(function (data) {
        console.log(data);
        displayWeather(data,city);
    })
    
}

function saveCity(){
    localStorage.setItem("cities", JSON.stringify(cities));
}

function formSubmitHandler(event){
    event.preventDefault();
}

function displayWeather(weather,city){

    var icon = `https://openweathermap.org/img/wn/${weather.weather[0].icon}.png`
    headIMG.setAttribute("src",icon);
    cityStats.appendChild(headIMG);
    var weatherConv = Math.floor((weather.main.temp - 273) * (9/5) + 32);
    cityHead.textContent = city;
    tempP.textContent = "Temp: " + weatherConv + " °F";
    windP.textContent = "Humidity: " + weather.main.humidity + " %";
    humidP.textContent = "Wind Speed: " + weather.wind.speed + " MPH";
    var lat = weather.coord.lat;
    var lon = weather.coord.lon;
    console.log(lat);
    console.log(lon);
    getUV(lat,lon);

}



function getUV(lat,lon){
    //var queryURL = "https://api.openweathermap.org/data/2.5/uvi?appid="+ apikey + "&lat="+lat +"&lon="+ lon;
    var queryURL = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=hourly,daily&appid=${apikey}`
    fetch(queryURL)
    .then(function(response){
       
        return response.json();

        console.log(response)
    })
    .then(function(data){
        console.log(data);
        console.log(data.current.uvi);
        displayUV(data.current.uvi)
    })
    
}   

function displayUV(data){
   uvP.textContent = "UV Index: " +  data;
}


currentWeather("Miami");

//give the form a function to collect user input, store input in variable to work with API. 
//find out if openweather gives that forecast in a response
//use all of my forecast data to append future days to the days
//work with local storage for search city

