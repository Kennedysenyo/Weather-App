import express from "express";
import bodyParser from "body-parser";
import axios from "axios";

const app = express();
const port = 3000;

// Geocoding API 
const geocodingAPI_URL = "https://geocode.maps.co/search?";
const geocodingAPI_Key = "674147f957fe9461980883awbeb5232"

app.use(express.static("public"));
app.use("/", (req, res) => {
  res.render("index.ejs",);
});

app.post("/search", (req, res) => {

});

app.listen(port, () => {
  console.log(`Server running port ${port}`);
});