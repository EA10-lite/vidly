
const mongoose = require("mongoose");
const winston = require("winston");

module.exports = () => {
    mongoose.connect(process.env.MONGO_URI)
        .then(()=> winston.info("connecting to mongodb..."))
}
