# Node.js Tutorial

In this part of the tutorial, we focus on increasing our Node.js skills by practicing more :)

# 1. Package management with npm

NPM is a very powerful tool that can help you manage project dependencies and in general automate development workflows, much like `ant` or `make` in java and C.

In the exercises folder we have a project called _hello_, which uses an external module: `node-fetch`. How do we manage this dependency?

### Package.json

The file `package.json` contains the metadata regarding your project, including name, version, license, and dependencies. Although you can install dependencies without a `package.json` file, it is the best way to keep track of your local dependencies.

How do we start? We execute the command below and follow the instructions prompted.

```shell
npm init
```

This generates the `package.json` file containing with a structure similar to this one:

```json
{
  "name": "se2019-node-express",
  "version": "1.0.0",
  "description": "Node.js & Express tutorial",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "repository": {
    "type": "git",
    "url": "git+https://github.com/jorgeramirez/se2019-node-express.git"
  },
  "author": "Jorge Ramirez",
  "license": "MIT",
  "bugs": {
    "url": "https://github.com/jorgeramirez/se2019-node-express/issues"
  },
  "homepage": "https://github.com/jorgeramirez/se2019-node-express#readme"
}
```

### Installing modules

To install an external module, we can use the `npm install` command

```shell
npm install --save node-fetch
```

The save params indicates npm to add the module to the list of dependencies in the `package.json` file. Indeed, if you check its contents, you'll now see:

```json
{
  "name": "se2019-node-express",
  "version": "1.0.0",
  "description": "Node.js & Express tutorial",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "repository": {
    "type": "git",
    "url": "git+https://github.com/jorgeramirez/se2019-node-express.git"
  },
  "author": "Jorge Ramirez",
  "license": "MIT",
  "bugs": {
    "url": "https://github.com/jorgeramirez/se2019-node-express/issues"
  },
  "homepage": "https://github.com/jorgeramirez/se2019-node-express#readme",
  "dependencies": {
    "node-fetch": "^2.6.0"
  }
}
```

### Installing all dependencies from a project

When someone shares the source code of their project (on a github, other source code management system, but even on a memory stick), they will not put their local dependency builds with their source code but give you only the `package.json` dependecies.

Let us "uninstall" node-fetch for a second, using `npm uninstall node-fetch` (if you add --save you'll also remove it from `package.json` but that's not what we want in this case). This removes the module from our project, and put it at the state you'll find any project on github. The way you install the dependencies of the project is then with the following command.

```shell
npm install
```

### Scripts and more

You can do so much more with npm, but here we are covering only the basics. A very useful feature you want to look into is `scripts`, which help you automate some tasks. Those interested can check the further reading section.

# 2. A better way of doing async code: Promises

We can now turn our attention to using [Promises](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) for dealing with asynchronous code.
JavaScript promises are constructs that allow us to reduce the complexity of writing asynchronous code, which can quickly become unmaintainable (e.g., [callback hell](http://callbackhell.com/)).

Let's start by revisiting our file reading example. This is how we implemented using the callback-based API:

```javascript
// Loading the file system library
const fs = require('fs');

// File name from the common line params
const fileName = process.argv[2];

// Accessing the content of the file asynchnously
fs.readFile(fileName, 'utf8', (error, data) => {
  console.log(data);
  console.log('Program ended.');
});
```

And the following snippet shows how the same example looks like when we use the Promise-based API:

```javascript
// Loading the file system library
const fs = require('fs').promises;

// File name from the common line params
const fileName = process.argv[2];

// Accessing the content of the file asynchnously
fs.readFile(fileName, 'utf8')
  .then(data => {
    console.log(data);
    console.log('Program ended.');
  })
  .catch(error => console.error(error));
```

At first, it might not look better, but we shifted to a coding structure that will look simpler even when we start to write more complex logic than just reading a file.

To show how we improve the readability of the code, let's code a function that relies on two services.

## Sunrise-sunset module

Let's create a small module that will receive as input a city and output the sunrise and sunset information. To do this, it will do two things:

- Call [MAPQUEST geocoding API](https://developer.mapquest.com/documentation/geocoding-api/address/get/) to determine the coordinates of the city (lat/lng)
- Then call the [sunrise-sunset API](https://api.sunrise-sunset.org/json?) to obtain the sunrise/sunset information.

MAPQUEST requires you to include an API key in your request. So, [obtain a key first](https://developer.mapquest.com/documentation/) and issue the following in your command line before running the examples:

```
$ export API_KEY=<Your MAPQUEST API key>
```

### Callback-based implementation

Install `request` to run this example:

```shell
$ npm i request
```

We first show how the code looks when implemented using callbacks:

```javascript
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
```

### Promise-based implementation

Install `node-fetch` to run this example:

```shell
$ npm i node-fetch
```

And the following is the same module but using Promises.

```javascript
const fetch = require('node-fetch');

const API_KEY = process.env.API_KEY;
const MAPQUEST_URL = `http://www.mapquestapi.com/geocoding/v1/address?key=${API_KEY}`;
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
```

As you may notice, the [code gestalt](https://yetanotherchris.dev/clean-code/gestalt-principles/) is substantially different. We move from a paradigm that keeps adding nested levels to a paradigm that, in this example, has only one "indent" level and reads nicely.

### Notes on callback-based code

The example using callbacks does not follow best practices for [callback-based code](http://callbackhell.com/). Next, we show a cleaner version of this approach.

```javascript
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
```

The above code packs the logic into named functions that we can reuse, instead of keep nesting and using anonymous functions. But still, Promises allow us to do this more easily, and the code is more compact than the callback-based version.

## What's a promise?

Now you know how to use Promises, and here we give a brief description of what exactly is a Promise.

Taken from [MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises), _"A Promise is an object representing the eventual completion or failure of an asynchronous operation"_. Basically, a promise is an object to which we can attach callbacks, instead of passing them around as function parameters.

We go from

```javascript
function onSuccess(response) {
  //...
}

function onError(error) {
  //...
}

asyncFunction(onSuccess, onError);
```

to

```javascript
function onSuccess(response) {
  //...
}

function onError(error) {
  //...
}

const promise = asyncFunctionThatReturnsAPromise();
promise.then(onSuccess, onError);
```

and, we can even use `.catch` to handle errors

```javascript
const promise = asyncFunctionThatReturnsAPromise();
promise
  .then(onSuccess)
  .catch(onError);
```

since `.catch` is a shortcut for `.then(null, onError)`.

This is intentionally a very brief discussion about promises, but we encourage the readers to visit the references for further readings.


# 3. Async/Await

Here we discuss how to write asynchronous code that looks synchronous. Concretely, we introduce the [async/await](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function) feature of ES2017.

The following snippet shows how our sunrise-sunset examples looks like when using async/await.


```javascript
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
```

But... don't be tempted to go too sequential (source: [Web Fundamentals](https://developers.google.com/web/fundamentals/primers/async-functions#careful_avoid_going_too_sequential)).


```javascript
async function series() {
  await wait(500); // Wait 500ms…
  await wait(500); // …then wait another 500ms.
  return "done!";
}
```

vs.

```javascript
async function parallel() {
  const wait1 = wait(500); // Start a 500ms timer asynchronously…
  const wait2 = wait(500); // …meaning this timer happens in parallel.
  await wait1; // Wait 500ms for the first timer…
  await wait2; // …by which time this timer has already finished.
  return "done!";
}
```


Again, this section is intentionally brief; we suggest you head over [this article](https://developers.google.com/web/fundamentals/primers/async-functions) from the Web Fundamentals catalog by Google developers. In the article you'll find further dos and don'ts :).

# References and further reading

- https://nodesource.com/blog/an-absolute-beginners-guide-to-using-npm/
- https://docs.npmjs.com/misc/scripts
- https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise
- https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises
- https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function
- https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/await
