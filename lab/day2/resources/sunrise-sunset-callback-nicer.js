/**
 * sunrise-sunset-callback-nicer.js
 *
 * This file implements the sunrise-sunset module using callbacks. Here, we follow best
 * practices. And instead of keep nesting and using anonymous functions, we pack our logic
 * into named functions that we can reuse.
 */
const request = require('request');

const API_KEY = process.env.API_KEY;
const MAPQUEST_URL = `https://www.mapquestapi.com/geocoding/v1/address?key=${API_KEY}`;
const SS_API = 'https://api.sunrise-sunset.org/json?';

function fetchCoordinate(cityname, callback) {
  request(`${MAPQUEST_URL}&location=${cityname}`, (error, response, body) => {
    if (error) {
      return callback(error);
    }
    const json = JSON.parse(body);
    const city = json.results[0].locations[0].latLng;
    return callback(null, city);
  });
}

function fetchSunriseSunset(city, callback) {
  request(
    `${SS_API}&lat=${city.lat}&lng=${city.lng}`,
    (error, response, body) => {
      if (error) {
        return callback(error);
      }
      const sunriseSunset = JSON.parse(body);
      return callback(null, sunriseSunset);
    }
  );
}

const cityName = process.argv[2] || 'New York,NY';
console.log(`Sunrise/sunset in: ${cityName}`);

fetchCoordinate(cityName, (error, city) => {
  if (error) {
    console.error(error);
    return;
  }

  fetchSunriseSunset(city, (sError, sunriseSunset) => {
    if (sError) {
      console.error(error);
      return;
    }
    console.log(sunriseSunset);
  });
});
