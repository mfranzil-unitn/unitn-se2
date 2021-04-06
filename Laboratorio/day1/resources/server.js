/*
 * server.js
 * In this example we see how to create a simple server.
 */

const http = require('http');
const port = 3000;

const requestHandler = (request, response) => {
  console.log(request.url);
  response.end('Hello World!');
};

let server = http.createServer(requestHandler);
server.listen(port, () =>
  console.log(`Server started, listening on port ${port}.`)
);
