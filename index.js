require("dotenv").config();
require("express-async-errors");
const winston = require("winston");
require("winston-mongodb");
const express = require("express");
const error = require("./middlewares/error");
const app = express();



winston.createLogger({
    level: 'error',
    format: winston.format.combine(winston.format.timestamp()),
    rejectionHandlers: [
        new winston.transports.File({ filename: 'rejections.log', level: 'error'})
    ]
});

winston.add(new winston.transports.File({ filename: 'logfile.log', level: 'error'}));
winston.add(new winston.transports.MongoDB({ db: 'mongodb://localhost/vidly', level: 'error' }));

const p = Promise.reject(new Error('Something failed miserably!!'))
p.then(()=> console.log("DONE"))

// throw new Error("Something failed during startup");

// require("./structure/logger");
require("./structure/config")();
require("./structure/validate")();
require("./structure/db")();
require("./structure/routes")(app);

app.use(error);

const port = process.env.PORT || 4000;
app.listen(port, ()=> { winston.info("listening at port", port) });