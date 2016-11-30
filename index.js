const express = require("express");
const http = require("http");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const mongoose = require("mongoose");
const router = require("./router");
const cors = require("cors");
const config = require("./config");


// DB setup
mongoose.Promise = global.Promise;
mongoose.connect(config.database);
//App Setup
const app = express();
app.use(cors());
app.use(morgan('combined'));
app.use(bodyParser.json({type: '*/*'}));

router(app);

//Server Setup
const port = process.env.PORT || 3000;

const server = http.createServer(app);
server.listen(port, ()=> {
    console.log('Server listen on port ',port);
})


