/**
 * sunrise-sunset-async-await.js
 *
 * This example shows how we can use async/await syntax to make our asynchronous code looks
 * synchronous.
 */
const fetch = require('node-fetch');

const API_KEY = process.env.API_KEY;
const MAPQUEST_URL = `https://www.mapquestapi.com/geocoding/v1/address?key=${API_KEY}`;
const SS_API = 'https://api.sunrise-sunset.org/json?';

const printSunriseSunsetInfo = async cityName => {
  try {
    let res = await fetch(`${MAPQUEST_URL}&location=${cityName}`);
    let json = await res.json();
    let city = json.results[0].locations[0].latLng;
    let sRes = await fetch(`${SS_API}&lat=${city.lat}&lng=${city.lng}`);
    let sunriseSunset = await sRes.json();
    console.log(sunriseSunset);
  } catch (error) {
    console.error(error);
  }
};

const cityName = process.argv[2] || 'New York,NY';
console.log(`Sunrise/sunset in: ${cityName}`);
printSunriseSunsetInfo(cityName);
