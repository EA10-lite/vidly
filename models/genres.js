
const Joi = require("joi");
const mongoose = require("mongoose");

const genre_validation_schema = {
    title: Joi.string().min(3).max(50).required()
}

const genre = new mongoose.Schema({
    title: { type: String, minLength: 3, maxLength: 50, required: true },
});

const Genre = mongoose.model("Genre", genre);

module.exports.genre_validation_schema = genre_validation_schema;
module.exports.Genre = Genre;
module.exports.genre = genre;