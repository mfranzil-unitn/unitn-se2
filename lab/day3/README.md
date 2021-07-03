# APIs

In this part of the tutorial, we focus on using Express to develop a backend server exposing a REST API.


## Express 

Web framework for Node.js.
*Express is a minimal and flexible Node.js web application framework that provides a robust set of features for web and mobile applications.* (Source: https://expressjs.com/).

Let's rewrite our node server based on the `http` module using express:


### Hello World!

```javascript
var express = require('express');
var app = express();

var port = 3000;

// Handling GET requests
app.get('/', function(req, res){ 
  res.send('Hello World!');
});

app.listen(port, function() {
  console.log('Server running on port ', port);
});
```

There are a few interesting concepts that we can highlight in this trivial example:
- we can listen to specific http verbs (`app.get`)
- we can specify specific routes (`/`)

The above help us focus on the services that we want to implement, without worriying about 
the logic for handling the request (e.g., checking manually that the request method is GET, and that the request url is '/').


### Serving static files

If we had to implement a way to serve static files, one way would be to:
- Check the request URL
- Look for the file in the local file system
- Check the type / format, and set the headers manually

This requires quite some work, fortunately express provides some standard way of managing common features like this one. Look at the example `mid-static`.

```javascript
var express = require('express');
var app = express();

var port = 3000;

app.use(express.static('public'));

// Handling GET requests
app.get('/hello', function(req, res){ 
  res.send('Hello World!');
});

app.listen(port, function() {
  console.log('Server running on port ', port);
});
```

What the above does is to mount the built-in `static` middleware, which facilitates the task of servicing static assets.

Run the script and then open [http://localhost:3000](http://localhost:3000) in your browser. What happens when you request the following?:
- [http://localhost:3000/hello](http://localhost:3000/hello)
- [http://localhost:3000/index.html](http://localhost:3000/index.html)
- [http://localhost:3000/image1.jpg](http://localhost:3000/image1.jpg)

You can decide where path in which the static files will be access, by simply specifying the root as first parameter in `app.use`:

```javascript
app.use('/static', express.static('public'));
```

But what are middlewares, and how do they work?. Let's look at the following informative figure by [hannahhoward](https://github.com/hannahhoward):

[![](https://camo.githubusercontent.com/af25dcefb2d951a9925adfc0c2c11f9684e19c1e/687474703a2f2f61647269616e6d656a69612e636f6d2f696d616765732f657870726573732d6d6964646c6577617265732e706e67)](https://gist.github.com/hannahhoward/fe639ca2f6e95eaf0ede34a218e948f9 "")


### Handling requests from a browser
Serving requests to web forms can be done easily by extending our previous example in the following way (source code in `exercises/forms`):


```javascript
var express = require('express');
var app  = express();

// Loading utils to inspect the content of js objects
var util = require('util');

var port = 3000;

app.use('/', express.static('public'));

// Handling GET requests
app.get('/search', function(req, res){ 
  
  console.log(util.inspect(req.headers, {showHidden: false, depth: null}))
  console.log(util.inspect(req.url, {showHidden: false, depth: null}))
  console.log(util.inspect(req.query, {showHidden: false, depth: null}))
  
  res.status(200).send('These are the items found!');  
});

app.post('/subscribe', function(req, res){ 

  console.log(util.inspect(req.headers, {showHidden: false, depth: null}))
  console.log(util.inspect(req.params, {showHidden: false, depth: null}))
  
  res.status(201).send('You are now subscribed!');
  
});

app.listen(port, function() {
  console.log('Server running on port ', port);
});
```
Run the script of this skeleton.

In the code you can see that we are listening to two different routes `subscribe` and `search`. Both rely on different HTTP verbs (post and get), and are built to serve the needs of two different types of requests. Let's open the example clients:

- http://localhost:3000/search.html
- http://localhost:3000/subscribe.html

Play with the above forms, submit some example requests and analyse what arrives to the server. Some points to discuss:

1. What do you think is the reason behind using GET / POST ?
2. Where is the data we are sending?

On the first point, there is nice an extensive discussion here (https://www.w3schools.com/tags/ref_httpmethods.asp). Apart from some obvious practical reasons, we'll discuss some more fundamentals one when we get to REST APIs.

On the second point, an alternative would be to process the put together the response body by concatenating chunks from the stream (remember when we did this in the first day?) but that is not necessary, because the body-parser middleware provides this funcionality already. 

**Parsing request body contents**

First, we install the library

```shell
npm install --save body-parser
```
and then add the following code to our forms app.js

```javascript
// Load the module
var bodyParser = require('body-parser');

// Mount body-parser middleware, and instruct it to 
// process form url-encoded data
app.use(bodyParser.urlencoded());

```
After doing this, we should be able to access the form data by directy using `req.body`

```javascript
console.log(req.body);
```

Notice that in this case we were parsing form data, but depending on the type of data
you want your service to handle, you'll need a different type of parsing. This post provides
a nice overview:

https://www.quora.com/What-exactly-does-body-parser-do-with-express-js-and-why-do-I-need-it

- bodyParser.raw(): Doesn't actually parse the body, but just exposes the buffered up contents from before in a Buffer on req.body.
- bodyParser.text(): Reads the buffer as plain text and exposes the resulting string on req.body.
- bodyParser.urlencoded(): Parses the text as URL encoded data (which is how browsers tend to send form data from regular forms set to POST) and exposes the resulting object (containing the keys and values) on req.body. For comparison; in PHP all of this is automatically done and exposed in $_POST.
- bodyParser.json(): Parses the text as JSON and exposes the resulting object on req.body.

**What about HTTP status codes?**
You can read the following blog post, which summarises nicely what each stands for and when to use them:
https://www.digitalocean.com/community/tutorials/how-to-troubleshoot-common-http-error-codes

- 1xx: Informational
- 2xx: Success
- 3xx: Redirection
- 4xx: Client Error
- 5xx: Server Error


### Exercises
1. Finish implementing the subcription service, using the array of people as "database"
2. Finish implementing the search functionality, looking for subscribers in the people array.


## RESTful APIs
*Representational State Transfer (REST) is an architectural style that defines a set of constraints to be used for creating web services. Web Services that conform to the REST architectural style, or RESTful web services, provide interoperability between computer systems on the Internet. **REST-compliant web services allow the requesting systems to access and manipulate textual representations of web resources by using a uniform and predefined set of stateless operations.*** (Source [Wikipedia](https://en.wikipedia.org/wiki/Representational_state_transfer))

* web resource: any resource on the web that can be identied by an URI (universal resource identifier - urls are the most common type of identifiers).
* text representation: json, xml, ...
* operations: In our case we are talking about HTTP operations (GET, POST, PUT, DELETE)

### Managing a web resource

For example, let's say we want to implement a REST API to manage products. 
```json
{
  "id" : 1,
  "name" : "iPhone XL",
  "description" : "Extra large"  
}
```

We then map CRUD (or CRUSD) operations to the standard HTTP verbs. 


| Operation | HTTP Verb    |   URI          |   Req body  | Resp body  |
|-----------|--------------|----------------|-------------|------------|
| Search    |  GET         | /products      |  Empty      | [Product+] |
| Create    |  POST        | /products      |  Product    | Empty      |
| Read      |  GET         | /products/:id  |  Empty      | Product    | 
| Update    |  PUT / PATCH | /products/:id  |  Product*   | Product    |
| Delete    |  DELETE      | /products/:id  |  Empty      | Empty      |


This works pretty well with simple resources. More complex APIs will require special attention to the relationship between web resources, and ways of traversing the relationships. For example, to get the list of products associated to a user (`/user/:id/products`).

Our challenge: Implementing the products API!. There is a stub implementation in `exercises/products-api`, which includes a simple client web app.


### Exercises
1. Finish implementing the Products API backend
2. Implement the web API for managing student registrations as specified here: https://www.studytonight.com/rest-web-service/designing-the-rest-api

### Challenge
Create the Zlatan service, replicating the functionality of the Chuck Norris Internet Database, and using Google Spreadsheet as you database. Tip: You can use the link a downloaded CSV file (File -> Download as -> Comma Separated Values) and transform it to json.


## References and further reading

- https://ourcodeworld.com/articles/read/261/how-to-create-an-http-server-with-express-in-node-js

