
const { Genre, genre_validation_schema } = require("../models/genres");
const admin = require("../middlewares/admin");
const auth = require("../middlewares/auth");
const validate = require("../middlewares/validate");

const express = require("express");
const router = express.Router();


router.get("/", async (req,res) => {
    const genres = await Genre.find();
    throw new Error("SOMETHING FAILED HERE!");

    res.status(200).send({
        data: genres,
        error: null
    })
});

router.get("/:id", async (req,res) => {
    const genre = await Genre.findById(req.params.id);
    if(!genre) return res.status(404).send({ error: "genre not found." });

    res.status(200).send({
        data: genre,
        error: null
    });
});

router.post("/", [ auth, validate(genre_validation_schema) ], async (req,res) => {
    let genre = await Genre.findOne({ title: req.body.title });
    if(genre) return res.status(400).send({ error: "genre already exist with that title." });

    genre = new Genre({ title: req.body.title });
    await genre.save();

    res.status(200).send({
        data: genre,
        error: null,
        message: "genre created."
    });
});

router.put("/:id", [ auth, validate(genre_validation_schema) ], async (req, res) => {
    let genre = await Genre.findOne({ title: req.body.title });
    if(genre) return res.status(400).send({ error: "genre with the title already exist."})

    genre = await Genre.findByIdAndUpdate(req.params.id, { $set: {
        title: req.body.title
    } }, { new: true });
    if(!genre) return res.status(400).send({ error:"genre not found." });

    res.status(200).send({
        data: genre,
        error: null,
        message: "genre updated."
    });
});

router.delete("/:id", [ auth, admin ], async (req,res) => {
    const genre = await Genre.findByIdAndRemove(req.params.id);
    if(!genre) return res.status(400).send({ error: "bad request." });

    res.status(200).send({
        data: genre,
        error: null,
        message: "genre deleted."
    });
});

module.exports = router;
