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

var cityHead = document.querySelector("#cityName")
var headIMG = document.createElement("img")
var cityInput = document.querySelector("#city");
var uvNum = document.querySelector("#index");
var cityStats = document.querySelector("#cityStats");
var search = document.querySelector("#searchBtn");
var history = document.querySelector("#history")
var cities = [];






search.addEventListener("click", function(){
    var name = cityInput.value;
    cityInput.value = '';
    if(!cities.includes(name)){
        cities.push(name);
        saveCity();
    }
    
    currentWeather(name);
})

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

function getCities(){
    var storedCities = JSON.parse(localStorage.getItem("cities"));
    if (storedCities !== null){
        cities = storedCities;
    }
}
function renderCities(){
    history.innerHTML = "";
    for (i = 0; i <cities.length; i++){
        var cityButton = document.createElement("button");
        cityButton.textContent = cities[i];
        cityButton.setAttribute("data-name",cities[i]);
        
    }
}



function displayWeather(weather,city){

    var icon = `http://openweathermap.org/img/wn/${weather.weather[0].icon}.png`
    headIMG.setAttribute("src",icon);
    cityStats.appendChild(headIMG);
    var weatherConv = Math.floor((weather.main.temp - 273) * (9/5) + 32);
    cityHead.textContent = city + " " + moment().format("MM-DD-YYYY");
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
    
    var queryURL = `http://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=hourly,daily&appid=${apikey}`
    fetch(queryURL)
    .then(function(response){
       
        return response.json();

        
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



getCities();
renderCities();






//make the history
    //create buttons for everything i search (refer to carol's scripts)
    //save the cities and buttons
    //get the cities and render to page
    //give the buttons functionality to clear the current weather, and put the new city's weather
    //give the buttons functionality to clear the weather in the next 5 days, and put the new city's future forecasts

//show the weather forecasts for the next five days
    //show 5 boxes on the page
    //grab the data needed for the next 5 days
    //display the data we fetched for the next 5 days


//write questions for tutor, try to be specific
