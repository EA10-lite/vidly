
const { Customer } = require("../models/customers");
const { Movie } = require("../models/movies");
const { Rental, rental_validation_schema } = require("../models/rentals");
const admin = require("../middlewares/admin");
const auth = require("../middlewares/auth");
const validate = require("../middlewares/validate");

const _ = require("lodash");
const express = require("express");
const router = express.Router();

router.get("/", async (req,res) => {
    const rentals = await Rental.find()
        .select('movie.title date_out customer.name customer.phone')
        .sort('-date_out')

    res.status(200).send({
        data: rentals,
        error: null
    });
});

router.get("/:id", async (req,res) => {
    const rental = await Rental.findById(req.params.id).select('movie.title date_out customer.name customer.phone');
    if(!rental) return res.status(404).send({ error: "rental does not exist." })

    res.status(200).send({
        data: rental,
        error: null
    });
});

router.post("/", [ auth, validate(rental_validation_schema) ], async (req,res) => {
    const customer = await Customer.findById(req.body.customerId);
    const movie = await Movie.findById(req.body.movieId);

    if(!customer) return res.status(400).send({ error: "customer does not exist." });
    if(!movie) return res.status(400).send({ error: "movie does not exist." });
    if(movie.numberInStock <= 0) return res.status(400).send({ error: "movie not available."});

    let rental = new Rental({
        customer: {
            _id: customer._id,
            name: customer.name,
            phone: customer.phone
        },
        movie: {
            _id: movie._id,
            dailyRentalRate: movie.dailyRentalRate,
            title: movie.title,
        }
    });
    rental = await rental.save();
    movie.numberInStock--;
    await movie.save();

    res.status(200).send({
        data: rental,
        error: null,
        message: "rental created."
    })
});

module.exports = router;