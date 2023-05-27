
const Joi = require("joi");
const mongoose = require("mongoose");

const rental_validation_schema = {
    customerId: Joi.objectId().required(),
    movieId: Joi.objectId().required(),
};

const movie_schema = new mongoose.Schema({
    title: { type: String, minLength: 2, maxLength: 50, required: true },
    dailyRentalRate: { type: Number, min: 0 , max: 10000, required: true },
});

const customer_schema = new mongoose.Schema({
    name: { type: String, minLength: 5, maxLength: 50, required: true },
    phone: { type: Number, minLength: 5, maxLength: 50, required: true },
});

const rental = new mongoose.Schema({
    date_out: { type: Date, default: Date.now },
    date_returned: { type: Date, },
    customer: { type: customer_schema, required: true },
    movie: { type: movie_schema, required: true },
    rentalFee: { type: Number, min: 1, max: 10000 }
});

const Rental = mongoose.model("Rental", rental);

module.exports.Rental = Rental;
module.exports.rental_validation_schema = rental_validation_schema;