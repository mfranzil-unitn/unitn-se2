/*
 * files.js
 * Example of synchronous access to files
 */

// Loading the file system library
const fs = require('fs');

// File name from the common line params
const fileName = process.argv[2];

// Accessing the content of the file synchnously
let data = fs.readFileSync(fileName, 'utf8');
console.log(data);

console.log('Program ended.');
