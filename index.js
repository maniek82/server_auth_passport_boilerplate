const express = require("express");
const http = require("http");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const mongoose = require("mongoose");
const app = express();
const router = require("./router");

// DB setup
mongoose.Promise = global.Promise;
mongoose.connect("mongodb://maniek:baza123@ds163677.mlab.com:63677/react_auth");
//App Setup
app.use(morgan('combined'));
app.use(bodyParser.json({type: '*/*'}));

router(app);

//Server Setup
const port = process.env.PORT || 3000;

const server = http.createServer(app);
server.listen(port, ()=> {
    console.log('Server listen on port ',port);
})


