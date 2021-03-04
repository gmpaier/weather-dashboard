function Weather(name, date, cond, icon, temp, hum, wind, lat, lon, uvi, day1, day2, day3, day4, day5){
  this.name = name;
  this.date = date;
  this.cond = cond;
  this.icon = icon;
  this.temp = temp;
  this.hum = hum;
  this.wind = wind;
  this.lat = lat;
  this.lon = lon;
  this.uvi = uvi;
  this.day1 = day1;
  this.day2 = day2;
  this.day3 = day3;
  this.day4 = day4;
  this.day5 = day5;   
}

var tempData = {
  name: "",
  date: "",
  cond: "",
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

let cityList = [];



function getAPI(){
  const key = "75f04fe88f0718f0439006e20e72ddf1";
  $("#display").show();
  let city = $("#city-input").val();
  city = city.trim();
  var requestUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial&appid=" + key;

    fetch(requestUrl)
      .then(function (response) {
        if (response.status !== 200){
          throw new Error('network response not okay');;
        } 
        return response.json();
      })
      .then(function (data) {
          console.log(data);
          tempData.name = data.name;
          tempData.date = new Date(parseInt(data.dt)*1000);
          tempData.cond = data.weather[0].main;
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
                    tempData[day].date = new Date(parseInt(data.daily[i].dt)*1000);
                    tempData[day].icon = data.daily[i].weather[0].icon;
                    tempData[day].temp = data.daily[i].temp.day;
                    tempData[day].hum = data.daily[i].humidity;
                }
                tempData.uvi = data.current.uvi;
                fill(tempData);
                cityList[cityList.length] = new Weather(tempData.name, tempData.date, tempData.cond, tempData.icon, tempData.temp, tempData.hum, tempData.wind, tempData.lat, tempData.lon, tempData.uvi, tempData.day1, tempData.day2, tempData.day3, tempData.day4, tempData.day5);
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

function fill(city){
  $("#city-name").text(city.name);
  $("#date").text("("+ displayDate(city.date) + ")");
  $("#weather-icon").attr("src", "http://openweathermap.org/img/wn/" + city.icon + "@2x.png");
  $("#temperature").text(city.temp);
  $("#humidity").text(city.hum);
  $("#wind-speed").text(city.wind);
  $("#uvi").text(city.uvi);
  for (let i = 1; i < 6; i++){
    let day = "day" + i;
    $("#date"+i).text(displayDate(city[day].date));
    $("#icon"+i).attr("src", "http://openweathermap.org/img/wn/" + city[day].icon + "@2x.png");
    $("#temp"+i).text(city[day].temp);
    $("#hum"+i).text(city[day].hum);
  }
}

function displayDate (dt){
  let format = (dt.getMonth() + 1) + "/" + dt.getDate() + "/" + dt.getFullYear();
  return format;
}

//Runtime
$("#display").hide();
$("#search-btn").on("click", getAPI);
