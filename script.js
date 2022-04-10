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
    var queryURL = "http://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + apikey;
    fetch(queryURL)
    .then(function(response){
      
        return response.json();
    })
    .then(function (data) {
       
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
        console.log(a);
        
        $("#history").append(cityButton);
    }
    $("#history").on("click",handleSaveButtons)
        
    
    
 
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
    tempP.textContent = "Temp: " + weatherConv(weather.main.temp) + "°F";
    windP.textContent = "Humidity: " + weather.main.humidity + " %";
    humidP.textContent = "Wind Speed: " + weather.wind.speed + " MPH";
    var lat = weather.coord.lat;
    var lon = weather.coord.lon;
    
    secondCall(lat,lon);

    

    
}



function secondCall(lat,lon){
    
    var queryURL = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly&appid=${apikey}`
    fetch(queryURL)
    .then(function(response){
       
        return response.json();

        
    })
    .then(function(data){
       
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
    
    for(var i = 1; i < 6; i++){
        document.querySelector("#future" + i).children[0].textContent = moment().add(i, "days").format("MM-DD-YYYY");
        document.querySelector("#future" + i).children[1].setAttribute("src",`https://openweathermap.org/img/wn/${data.daily[i].weather[0].icon}.png`);
        document.querySelector("#future" + i).children[2].textContent = "Temp: " + weatherConv(data.daily[i].temp.day) + "°F";
        document.querySelector("#future" + i).children[3].textContent = "Wind: " + (data.daily[i].wind_speed) + " MPH";
        document.querySelector("#future" + i).children[4].textContent = "Humidity: " + (data.daily[i].humidity) + "%";
    }

}




getCities();







