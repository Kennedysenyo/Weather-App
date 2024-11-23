import express from "express";
import bodyParser from "body-parser";
import axios from "axios";

const app = express();
const port = 3000;

// Use this API to get your geocoordinates from making a request.
// FreeIpAPI - https://freeipapi.com/
const freeIpAPI_URL = "https://freeipapi.com/api/json/"

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

// Use OpenWeather API to get current Weather from a specified longitude and Latitiude.
// Open Weather - https://openweathermap.org/
const openWeatherAPI_URL = "https://api.openweathermap.org/data/2.5/weather";
const openWeatherAPI_KEY = "c4cdceee34a78089d0ee144694bce6a2"
app.get("/", async (req, res) => {
  try {
    const response = await axios.get(freeIpAPI_URL);
    const result = response.data;
    const lat = result.latitude;
    const lon = result.longitude;

    try {
      const weatherResponse = await axios.get(
        `${openWeatherAPI_URL}?lat=${lat}&lon=${lon}&units=metric&appid=${openWeatherAPI_KEY}`
      );

      // Use `weatherResponse.data` instead of `JSON.stringify` to keep it as an object
      const weatherData = weatherResponse.data;

      const icon = weatherData.weather[0].icon; 

      const temp = Math.round(weatherData.main.temp);

      const address = weatherData.name; 

      const humi = weatherData.main.humidity;
    
      const wind = weatherData.wind.speed;

      res.render("index.ejs", {
        _icon: `icons/${icon}.png`,
        _temp: temp,
        _address: address,
        _humi: humi,
        _wind: wind,
      });
    } catch (error) {
      console.error("Failed to make weather request", error.message);
    }
  } catch (error) {
    console.error("Failed to make request", error.message);
  }
});


// Use this API to get geo-coordinates from human readable address.
// Geocoding API - https://geocode.maps.co/
const geocodingAPI_URL = "https://geocode.maps.co/search?";
const geocodingAPI_Key = "674147f957fe9461980883awbeb5232";

app.post("/search", (req, res) => {

});

app.listen(port, () => {
  console.log(`Server running port ${port}`);
});