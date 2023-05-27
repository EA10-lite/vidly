
const { Customer, customer_validation_schema } = require("../models/customers");
const auth = require("../middlewares/auth");
const admin = require("../middlewares/admin");
const validate = require("../middlewares/validate");

const _ = require("lodash");
const express = require("express");
const router = express.Router();

router.get("/", async (req,res) => {
    const customers = await Customer.find()

    res.status(200).send({
        data: customers,
        error: null
    });
});

router.get("/:id", async (req,res) => {
    const customer = await Customer.findById(req.params.id);
    if(!customer) return res.status(404).send({ error: "customer not found." });

    res.status(200).send({
        data: customer,
        error: null
    });
});

router.post("/", [ auth, validate(customer_validation_schema) ],  async (req,res) => {
    const customer = new Customer(_.pick(req.body, ['name', 'phone', 'is_gold_member']));
    await customer.save();

    res.status(200).send({
        data: customer,
        error: null,
        message: "customer created."
    })
});

router.put("/:id",  [ auth, validate(customer_validation_schema) ], async (req,res) => {
    const customer = await Customer.findByIdAndUpdate(req.params.id, { 
        $set: { ..._.pick(req.body, ['name', 'phone', 'is_gold_member']) }
    }, { new: true });
    if(!customer) return res.status(404).send({ error: "customer not found." })

    res.status(200).send({
        data: customer,
        error: null,
        message: "customer created."
    })
});

router.delete("/:id", [ auth, admin ], async (req,res) => {
    const customer = await Customer.findByIdAndRemove(req.params.id);
    if(!customer) return res.status(400).send({ error: "customer does not exist." });

    res.status(200).send({
        data: customer,
        error: null,
        message: "customer deleted."
    });
});


module.exports = router;