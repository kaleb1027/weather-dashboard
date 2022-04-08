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
var uvNum = document.createElement("span");
var cityStats = document.querySelector("#cityStats");
var search = document.querySelector("#searchBtn");
var history = document.querySelector("#history")
var cities = [];

var f1 = document.querySelector("#future1")
//var f1 = document.querySelector("#future2")
//var f1 = document.querySelector("#future3")
//var f1 = document.querySelector("#future4")
//var f1 = document.querySelector("#future5")







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
        //console.log(response);
        return response.json();
    })
    .then(function (data) {
        //console.log(data);
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
    renderCities();
}
function renderCities(){
    history.innerHTML = "";
    console.log(cities);
    for (i = 0; i <cities.length; i++){
        var cityButton = document.createElement("button");
        cityButton.textContent = cities[i];
        cityButton.setAttribute("data-name",cities[i]);
        var a = cityButton.textContent;
        console.log(a)
        
        $("#history").append(cityButton);
    }
    $("#history").on("click",handleSaveButtons)
        
    
    
   // console.log(cities);
   // console.log(history);
   // console.log(cityButton);
}

function handleSaveButtons(event){
    var savedName = event.target.textContent;
    currentWeather(savedName);
}

function weatherConv(temp){
    return Math.floor((temp - 273) * (9/5) + 32);
    
}

function displayWeather(weather,city){

    var icon = `http://openweathermap.org/img/wn/${weather.weather[0].icon}.png`
    headIMG.setAttribute("src",icon);
    cityStats.appendChild(headIMG);
    
    cityHead.textContent = city + " " + moment().format("MM-DD-YYYY");
    tempP.textContent = "Temp: " + weatherConv(weather.main.temp) + " °F";
    windP.textContent = "Humidity: " + weather.main.humidity + " %";
    humidP.textContent = "Wind Speed: " + weather.wind.speed + " MPH";
    var lat = weather.coord.lat;
    var lon = weather.coord.lon;
    //console.log(lat);
    //console.log(lon);
    secondCall(lat,lon);

    

    
}



function secondCall(lat,lon){
    
    var queryURL = `http://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly&appid=${apikey}`
    fetch(queryURL)
    .then(function(response){
       
        return response.json();

        
    })
    .then(function(data){
        //console.log(data);
        //console.log(data.current.uvi);
        if (data.current.uvi <= 2){
            uvNum.setAttribute("class","low")
        }
        else if(data.current.uvi > 5){
            uvNum.setAttribute("class","high")
        }
        else{
            uvNum.setAttribute("class","moderate")
        }
        uvP.textContent = "UV Index: "
        uvNum.textContent = data.current.uvi;
        uvP.append(uvNum);
        
       displaySecondCall(data)
    })
    
}   

function displaySecondCall(data){
    console.log(data);
    console.log(data.daily[1]);
    weatherConv(data.daily[1].temp.day);

    
    for(var i = 1; i < 6; i++){
        document.querySelector("#future" + i).children[0].textContent = moment().add(i, "days").format("MM-DD-YYYY");
        document.querySelector("#future" + i).children[1].setAttribute("src",`http://openweathermap.org/img/wn/${data.daily[i].weather[0].icon}.png`);
        document.querySelector("#future" + i).children[2].textContent = "Temp: " + weatherConv(data.daily[i].temp.day);
        document.querySelector("#future" + i).children[3].textContent = "Wind: " + (data.daily[i].wind_speed) + " MPH";
        document.querySelector("#future" + i).children[4].textContent = "Humidity: " + (data.daily[i].humidity) + "%";
    }

}




getCities();
//renderCities();






//for loop for displaySecondCall() (data.daily[i])


//write questions for tutor, try to be specific
