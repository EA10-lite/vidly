
const Joi = require("joi");
const mongoose = require("mongoose");

const customer_validation_schema = {
    is_gold_member: Joi.boolean(),
    name: Joi.string().min(3).max(50).required(),
    phone: Joi.string().min(5).max(50).required(),
}

const customer = new mongoose.Schema({
    is_gold_member: { type: Boolean, default: false },
    name: { type: String, minLength: 3, maxLength: 50, required: true },
    phone: { type: String, minLength: 5, maxLength: 50, required: true },
});

const Customer = mongoose.model("Customer", customer);

module.exports.customer = customer;
module.exports.Customer = Customer;
module.exports.customer_validation_schema = customer_validation_schema;