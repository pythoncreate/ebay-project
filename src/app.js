const path = require("path");
const express = require("express");
const hbs = require("hbs");

const app = express();

//Define paths for express config
const publicDirectoryPath = path.join(__dirname, "../public");
const viewsPath = path.join(__dirname, "../templates/views");
const partialsPath = path.join(__dirname, "../templates/partials");

//Setup handlebars engine and views location
app.set("view engine", "hbs");
app.set("views", viewsPath);
hbs.registerPartials(partialsPath);

//Setup static directory to serve
app.use(express.static(publicDirectoryPath));

let eBay = require("ebay-node-api");

let ebay = new eBay({
  clientID: "ChrisStu-cards-SBX-4a6d0a603-8c90f375",
  // options  - optional HTTP request timeout to apply to all requests.
  env: "SANDBOX" // optional default = 'PRODUCTION'
});

//this an ebay search test

app.get("/", (req, res) => {
  if (!req.query.search) {
    return res.send({
      error: "You must provide search term"
    });
  }
  ebay.findItemsByKeywords(req.query.search).then(data => {
    const newData = data[0].searchResult[0].item;
    res.render("index", {
      newData
    });
    // res.send(JSON.stringify(newData));
  });
});

app.get("/search", (req, res) => {
  ebay.findItemsByKeywords("iphone").then(data => {
    const newData = data[0].searchResult[0].item;
    res.send(JSON.stringify(newData));
  });
});

app.get("/products", (req, res) => {
  if (!req.query.search) {
    return res.send({
      error: "You must provide search term"
    });
  }
  res.send({
    products: []
  });
});

app.get("/weather", (req, res) => {
  if (!req.query.address) {
    return res.send({
      error: "Please provide an address"
    });
  }
  res.send({
    forecast: "It is sunny",
    location: "Philadelphia",
    address: req.query.address
  });
});

app.get("/search/*", (req, res) => {
  res.send("Not Found");
});

app.get("*", (req, res) => {
  res.send("404 ERROR PAGE");
});

app.listen(3000, () => {
  console.log("Server is up on Port 3000");
});
