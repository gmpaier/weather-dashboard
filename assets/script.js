//Functions and Variables

  //Constructor function for city weather data
function Weather(name, date, icon, temp, hum, wind, lat, lon, uvi, day1, day2, day3, day4, day5){
  this.name = name;
  this.date = date;
  this.icon = icon;
  this.temp = temp;
  this.hum = hum;
  this.wind = wind;
  this.lat = lat;
  this.lon = lon;
  this.uvi = uvi;
  this.day1 = {date: day1.date, icon: day1.icon, temp: day1.temp, hum: day1.hum};
  this.day2 = {date: day2.date, icon: day2.icon, temp: day2.temp, hum: day2.hum};
  this.day3 = {date: day3.date, icon: day3.icon, temp: day3.temp, hum: day3.hum};
  this.day4 = {date: day4.date, icon: day4.icon, temp: day4.temp, hum: day4.hum};
  this.day5 = {date: day5.date, icon: day5.icon, temp: day5.temp, hum: day5.hum};
}

  //object to temporarily store city weather data
var tempData = {
  name: "",
  date: "",
  icon: "",
  temp: "",
  hum: "",
  wind: "",
  lat: "",
  lon: "",
  uvi: "",
  day1: {
    date: "",
    icon: "",
    temp: "",
    hum: ""
  },
  day2: {
    date: "",
    icon: "",
    temp: "",
    hum: ""
  },
  day3: {
    date: "",
    icon: "",
    temp: "",
    hum: ""
  },
  day4: {
    date: "",
    icon: "",
    temp: "",
    hum: ""
  },
  day5: {
    date: "",
    icon: "",
    temp: "",
    hum: ""
  } 
};

  //Weather-Object array, save to local storage
let cityList = [];

  //today's date for reference
let today = Date.now();


  //compares city in search to stored cities: calls API if name does not match or if date is old, else loads data
function searchCity(){
  let city = $("#city-input").val();
  city = city.trim();
  let upper = city.toUpperCase()
  city = upper.charAt(0) + city.slice(1);
  let boo = false;
  let key = 0;
  for (let i = 0; i < cityList.length; i++){
    if (city === cityList[i].name){
      boo = true;
      key = i;
    }
  }
  if (boo === false){
    getAPI(city);
  }
  else {
    let now = displayDate(today)
    let then = displayDate(cityList[key].date)
    if (now === then){
      $("#display").show();
      fill(cityList[key]);
    }
    else {
      getAPI(city);
    }
  }
}

  //loads saved city data, calls API for fresh data if old
function clickCity(){
  let key = parseInt(this.value);
  let now = displayDate(today)
  let then = displayDate(cityList[key].date)
  if (now === then){
    $("#display").show();
    fill(cityList[key]);
  }
  else {
    getAPI(cityList[key].name);
  }
}

  //Performs two API calls: first call to Current Weather API, then gets lat/lon parameters for call to One Call API.
    // Stores in tempData object and saves to local storage
function getAPI(city){
  const key = "75f04fe88f0718f0439006e20e72ddf1";
  var requestUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial&appid=" + key;

    fetch(requestUrl)
      .then(function (response) {
        if (response.status !== 200){
          throw new Error('network response not okay');;
        } 
        return response.json();
      })
      .then(function (data) {
          $("#display").show();
          tempData.name = data.name;
          tempData.date = parseInt(data.dt)*1000;
          tempData.icon = data.weather[0].icon;
          tempData.temp = data.main.temp;
          tempData.hum = data.main.humidity;
          tempData.wind = data.wind.speed;
          tempData.lat = data.coord.lat;
          tempData.lon = data.coord.lon;
          var oneUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + tempData.lat + "&lon=" + tempData.lon + "&units=imperial&appid=" + key;
          return fetch(oneUrl)
            .then(function (response) {
                if (response.status !== 200){
                    throw new Error('network response not okay');;
                } 
                return response.json();
            })
            .then(function (data) {
                for (let i = 1; i < 6; i++){
                    let day = "day" + i;
                    tempData[day].date = parseInt(data.daily[i].dt*1000);
                    tempData[day].icon = data.daily[i].weather[0].icon;
                    tempData[day].temp = data.daily[i].temp.day;
                    tempData[day].hum = data.daily[i].humidity;
                }
                tempData.uvi = data.current.uvi;
                fill(tempData);
                addCity(tempData, cityList.length);
                cityList[cityList.length] = new Weather(tempData.name, tempData.date, tempData.icon, tempData.temp, tempData.hum, tempData.wind, tempData.lat, tempData.lon, tempData.uvi, tempData.day1, tempData.day2, tempData.day3, tempData.day4, tempData.day5);
                localStorage.setItem("weatherData", JSON.stringify(cityList));
                return data;
            })
            .catch(function (error) {
            console.error('There has been a problem with your fetch operation:', error);
            });
      })
      .catch(function (error) {
        console.error('There has been a problem with your fetch operation:', error);
      })
  
}

  //Colors the UV index background based on conditions
function colorUvi(uvi){
  if (uvi < 3){
    $("#uvi").css("background-color", "green");
  }
  else if (uvi >= 7){
    $("#uvi").css("background-color", "red");
  }
  else {
    $("#uvi").css("background-color", "gold");
  }
}

  //Adds a list item button of city for search history
function addCity(city, val){
  $(".list-group").append('<button type="button" class="list-group-item list-group-item-action short" value="'+ val + '">' + city.name + '</button>');
}

  //displays content on page for the chosen city
function fill(city){
  $("#city-name").text(city.name);
  $("#date").text("("+ displayDate(city.date) + ")");
  $("#weather-icon").attr("src", "http://openweathermap.org/img/wn/" + city.icon + "@2x.png");
  $("#temperature").text(city.temp);
  $("#humidity").text(city.hum);
  $("#wind-speed").text(city.wind);
  $("#uvi").text(city.uvi);
  colorUvi(city.uvi);
  for (let i = 1; i < 6; i++){
    let day = "day" + i;
    $("#date"+i).text(displayDate(city[day].date));
    $("#icon"+i).attr("src", "http://openweathermap.org/img/wn/" + city[day].icon + "@2x.png");
    $("#temp"+i).text(city[day].temp);
    $("#hum"+i).text(city[day].hum);
  }
}

  //converts UTC time into mm/dd/yyyy format
function displayDate (utc){
  let dt = new Date(utc);
  let format = (dt.getMonth() + 1) + "/" + dt.getDate() + "/" + dt.getFullYear();
  return format;
}

  //loads stored weather data
function loadData(){
  if(localStorage.getItem("weatherData") === null){}
  else{
    cityList = JSON.parse(localStorage.getItem("weatherData"));
    for (let i = 0; i < cityList.length; i++){
      addCity(cityList[i], i);
    }
  }
  
}
  //clears stored weather data
function clearData(){
  $(".list-group").empty();
  localStorage.removeItem("weatherData");
  cityList.splice(0, cityList.length);
}

//Runtime
loadData();
$("#display").hide();
$("#search-btn").on("click", searchCity);
$("#clear-btn").on("click", clearData);
$(document).on("click", ".list-group-item", clickCity);
