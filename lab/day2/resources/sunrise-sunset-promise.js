/**
 * sunrise-sunset-promise.js
 *
 * This example shows how we can use Promises to make the async code more readable.
 */
const fetch = require('node-fetch');

const API_KEY = process.env.API_KEY;
const MAPQUEST_URL = `https://www.mapquestapi.com/geocoding/v1/address?key=${API_KEY}`;
const SS_API = 'https://api.sunrise-sunset.org/json?';

const cityName = process.argv[2] || 'New York,NY';

console.log(`Sunrise/sunset in: ${cityName}`);

fetch(`${MAPQUEST_URL}&location=${cityName}`)
  .then(res => res.json())
  .then(json => json.results[0].locations[0].latLng)
  .then(city => fetch(`${SS_API}&lat=${city.lat}&lng=${city.lng}`))
  .then(res => res.json())
  .then(sunriseSunset => console.log(sunriseSunset))
  .catch(err => console.error(err));
