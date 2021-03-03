var tempWeather = {
  name: "",
  date: "",
  cond: "",
  desc: "",
  icon: "",
  temp: "",
  humidity: "",
  wind: "",
  lat: "",
  lon: "",
  uvi: "",
  day1: {
    date: "",
    icon: "",
    temp: "",
    humidity: ""
  },
  day2: {
    date: "",
    icon: "",
    temp: "",
    humidity: ""
  },
  day3: {
    date: "",
    icon: "",
    temp: "",
    humidity: ""
  },
  day4: {
    date: "",
    icon: "",
    temp: "",
    humidity: ""
  },
  day5: {
    date: "",
    icon: "",
    temp: "",
    humidity: ""
  } 
};

const key = "75f04fe88f0718f0439006e20e72ddf1";

function getAPI(){
  var city = $("#city-input").val();
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
          tempWeather.name = data.name;
          tempWeather.date = data.dt;
          tempWeather.cond = data.weather[0].main;
          tempWeather.desc = data.weather[0].description;
          tempWeather.icon = data.weather[0].icon;
          tempWeather.temp = data.main.temp;
          tempWeather.humidity = data.main.humidity;
          tempWeather.wind = data.wind.speed;
          tempWeather.lat = data.coord.lat;
          tempWeather.lon = data.coord.lon;
          var oneUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + tempWeather.lat + "&lon=" + tempWeather.lon + "&units=imperial&appid=" + key;
          return fetch(oneUrl)
            .then(function (response) {
                if (response.status !== 200){
                    throw new Error('network response not okay');;
                } 
                return response.json();
            })
            .then(function (data) {
                for (let i = 1; i<6; i++){
                    let day = "day" + i;
                    tempWeather[day].date = data.daily[i].dt;
                    tempWeather[day].icon = data.daily[i].weather[0].icon;
                    tempWeather[day].temp = data.daily[i].temp.day;
                    tempWeather[day].humidity = data.daily[i].humidity;
                }
                tempWeather.uvi = data.current.uvi;
                console.log(tempWeather);
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



$("#search-btn").on("click", getAPI);


// What do I need?
//where to get from?? one call can get 5 day and current but requires lon/lat... otherwise multiple api calls

    //name: name
    //date: dt
    //weather condition: weather[i].main & weather[i].description
    //weather condition icon: weather[i].icon
    //temp: main.temp
        //make sure units are in API call
    //humidity: main.humidity
    //wind speed: wind.speed

    //lat for 2nd call: coord.lat
    //lon for 2nd call: coord.long

//seperate API call
    //call: https://api.openweathermap.org/data/2.5/onecall?lat={lat}&lon={lon}&appid={API key}
    //uv index: current.uvi