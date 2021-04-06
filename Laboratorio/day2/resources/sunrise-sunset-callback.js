/**
 * sunrise-sunset-callback.js
 *
 * This files implement the sunrise-sunset module using callbacks.
 */
const request = require('request');

const API_KEY = process.env.API_KEY;
const MAPQUEST_URL = `https://www.mapquestapi.com/geocoding/v1/address?key=${API_KEY}`;
const SS_API = 'https://api.sunrise-sunset.org/json?';

const cityName = process.argv[2] || 'New York,NY';

console.log(`Sunrise/sunset in: ${cityName}`);

request(`${MAPQUEST_URL}&location=${cityName}`, (error, response, body) => {
  if (error) {
    console.error(error);
    return;
  }

  const json = JSON.parse(body);
  const city = json.results[0].locations[0].latLng;

  request(
    `${SS_API}&lat=${city.lat}&lng=${city.lng}`,
    (sError, sResponse, sBody) => {
      if (sError) {
        console.error(sError);
        return;
      }

      const sunriseSunset = JSON.parse(sBody);
      console.log(sunriseSunset);
    }
  );
});
