const http = require('http');

let nextDogId = 1;

function getNewDogId() {
  const newDogId = nextDogId;
  nextDogId++;
  return newDogId;
}

const server = http.createServer((req, res) => {
  console.log(`${req.method} ${req.url}`);

  let reqBody = "";
  req.on("data", (data) => {
    reqBody += data;
  });

  // When the request is finished processing the entire body
  req.on("end", () => {
    // Parsing the body of the request
    if (reqBody) {
      req.body = reqBody
        .split("&")
        .map((keyValuePair) => keyValuePair.split("="))
        .map(([key, value]) => [key, value.replace(/\+/g, " ")])
        .map(([key, value]) => [key, decodeURIComponent(value)])
        .reduce((acc, [key, value]) => {
          acc[key] = value;
          return acc;
        }, {});
      console.log(req.body);
    }
    // Do not edit above this line

    // define route handlers here

    // GET /
    if (req.method === 'GET' && req.url === '/') {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'text/plain');
      return res.end('Dog Club');
    }

    // GET /dogs
    if (req.method === 'GET' && req.url === '/dogs') {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'text/plain');
      return res.end('Dogs index');
    }

    // Out of order so it checks before dogId
    // GET /dogs/new
    if (req.method === 'GET' && req.url === '/dogs/new') {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'text/plain');
      return res.end('Dog create form page');
    }

    let urlSubs = req.url.split('/');
    let urlLength = urlSubs.length;
    let targetSubs = '/dogs/:dogId'.split('/');
    let targetLength = targetSubs.length;

    if (req.method === 'GET' && req.url.startsWith('/dogs')) {

      // GET /dogs/:dogId
      if (targetLength === urlLength) {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/plain');
        return res.end(`Dog details for ${targetSubs[2]}:`)
      }

      // GET /dogs/:dogId/edit
      if (targetLength === urlLength - 1) {
        console.log(urlSubs);
        res.setHeader('Content-Type', 'text/plain');
        return res.end(`Dog edit form page for ${urlSubs[2]}`)
      }
    }

    let newId = getNewDogId();

    // POST /dogs
    if (req.method === 'POST' && req.url === '/dogs') {
      res.statusCode = 302;
      res.setHeader('Location', `/dogs/${newId}`);
      return res.end();
    }

    // POST /dogs/:dogId
    if (req.method === 'POST' && req.url.startsWith('/dogs')) {

      if (targetLength === urlLength) {
        res.statusCode = 302;
        res.setHeader('Location', `/dogs/${targetSubs[2]}`);
        return res.end();
      }
    }


    // Do not edit below this line
    // Return a 404 response when there is no matching route handler
    res.statusCode = 404;
    res.setHeader('Content-Type', 'text/plain');
    return res.end('No matching route handler found for this endpoint');
  });
});

const port = 5000;

server.listen(port, () => console.log('Server is listening on port', port));
