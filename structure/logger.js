
require("express-async-errors");
const winston = require("winston-mongodb");
require("winston-mongodb");


module.exports = () => {
    winston.transports.Console({ colorize: true, prettyPrint: true });
    winston.handleExceptions(new winston.transports.File({ filename: 'uncaughtExceptions.log'}));

    process.on("unhandledRejection", ()=> {
        throw ex
    });

    winston.add(winston.transports.File, { filename: "logfile.log" });
    // winston.add(winston.transports.MongoDB, { db: 'mongodb://localhost/vidly' });
}