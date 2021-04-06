/*
 * files-async-promise.js
 *
 * Example of asynchronous access to files, using Promises.
 */

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
