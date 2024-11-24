import express from "express";
import bodyParser from "body-parser";
import axios from "axios";
import {config} from "dotenv";

const app = express();
const port = 3000;

// Use this API to get your geocoordinates from making a request.
// FreeIpAPI - https://freeipapi.com/
const freeIpAPI_URL = "https://freeipapi.com/api/json/"

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
config();

// Use OpenWeather API to get current Weather from a specified longitude and Latitiude.
// Open Weather - https://openweathermap.org/
const openWeatherAPI_URL = "https://api.openweathermap.org/data/2.5/weather";
const openWeatherAPI_KEY = process.env.OPEN_WEATHER_API_KEY;

app.get("/", async (req, res) => {
  try {
    const response = await axios.get(freeIpAPI_URL);
    const result = response.data;  
    const lat = result.latitude;
    const lon = result.longitude;

    try {
      const weatherResponse = await axios.get(
        `${openWeatherAPI_URL}?lat=${lat}&lo=${lon}&units=metric&appid=${openWeatherAPI_KEY}`
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
      res.status(500).render("error.ejs", {
        _message: "Something went wrong!",
      })
    }
  } catch (error) {
    console.error("Failed to make request", error.message);
  }
});


// Use this API to get geo-coordinates from human readable address.
// Geocoding API - https://geocode.maps.co/
const geocodingAPI_URL = "https://geocode.maps.co/search?";
const geocodingAPI_Key = process.env.GEOCODING_API_KEY;

app.post("/search", async (req, res) => {
  const address = req.body.address;
  console.log(req.body.address);
  try {
    const response = await axios.get(`${geocodingAPI_URL}q=${address}&api_key=${geocodingAPI_Key}`);
    const result = response.data;
    const lat = result[0].lat;
    const lon = result[0].lon;

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
    res.render("index.ejs", {
      _error: "Search Invalid! Search town, city, or country.",
    });
  }
  
});

app.listen(port, () => {
  console.log(`Server running port ${port}`);
});