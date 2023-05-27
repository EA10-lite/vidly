
const { Genre } = require("../models/genres");
const { Movie, movie_validation_schema } = require("../models/movies");
const admin = require("../middlewares/admin");
const auth = require("../middlewares/auth");
const validate = require("../middlewares/validate");

const _ = require("lodash");
const express = require("express");
const router = express.Router();

router.get("/", async (req,res) => {
    const movies = await Movie.find().select('genre title')
    
    res.status(200).send({
        data: movies,
        error: null,
    });
});

router.get("/:id", async (req,res) => {
    const movie = await Movie.findById(req.params.id).select('genre title')
    if(!movie) return res.status(404).send({ error: "movie not found." });
    
    res.status(200).send({
        data: movie,
        error: null,
    });
});

router.post("/",[ auth, validate(movie_validation_schema) ], async (req,res) => {
    const genre = await Genre.findById(req.body.genreId);
    if(!genre) return res.status(400).send({ error: "genre does not exist." });

    const movie = new Movie({
        ...req.body,
        genre: {
            _id: genre._id,
            title: genre.title
        }
    });
    await movie.save();

    res.status(200).send({
        data: movie,
        error: null,
        message: "movie created."
    });
});

router.put("/:id",[ auth, validate(movie_validation_schema) ], async (req,res) => {
    const genre = await Genre.findById(req.body.genreId);
    if(!genre) return res.status(400).send({ error: "genre does not exist." });

    const movie = await Movie.findByIdAndUpdate(req.params.id, { $set: {
        ...req.body,
        genre: {
            _id: genre._id,
            title: genre.title
        }
    }}, { new: true });
    if(!movie) return res.status(404).send({ error: "movie not found." });

    res.status(200).send({
        data: movie,
        error: null,
        message: "movie created."
    });
});

router.delete("/:id", [ auth, admin ], async (req,res) => {
    const movie = await Movie.findByIdAndRemove(req.params.id);
    if(!movie) return res.status(400).send({ error: "movie does not exist." });

    res.status(200).send({
        data: movie,
        error: null,
        message: "movie deleted."
    });
});

module.exports = router;