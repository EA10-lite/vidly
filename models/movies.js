
const Joi = require("joi");
const mongoose = require("mongoose");
const { genre } = require("./genres");

const movie_validation_schema = {
    dailyRentalRate: Joi.number().min(0).max(10000).required(),
    genreId: Joi.objectId().required(),
    numberInStock: Joi.number().min(0).max(10000).required(),
    title: Joi.string().min(2).max(50).required()
}

const movie = new mongoose.Schema({
    dailyRentalRate: { type: Number, min: 0, max: 10000, required: true },
    genre: { type: genre, required: true },
    numberInStock: { type: Number, min: 0, max: 10000, required: true },
    title: { type: String, minLength: 2, maxLength: 50, required: true }
});

const Movie = mongoose.model("Movie", movie);

module.exports.movie = movie;
module.exports.Movie = Movie;
module.exports.movie_validation_schema = movie_validation_schema;