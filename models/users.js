
const Joi = require("joi");
const config = require("config");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

const user_validation_schema = {
    email: Joi.string().email().min(5).max(255).required(),
    name: Joi.string().min(3).max(50).required(),
    password: Joi.string().min(8).max(255).required()
}

const login_validation_schema = {
    email: Joi.string().email().min(5).max(255).required(),
    password: Joi.string().min(8).max(255).required()
}

const user = new mongoose.Schema({
    email: { type: String, minLength: 5, maxLength: 255, required: true, unique: true },
    is_admin: { type: Boolean, default: false },
    name: { type: String, minLength: 3, maxLength: 50, required: true },
    password: { type: String, minLength: 8, maxLength: 1024, required: true },
});

user.methods.generateAuthToken = function(){
    return jwt.sign({ _id: this._id, is_admin: this.is_admin }, config.get("jwtPrivateKey"));
};

const User = mongoose.model("User", user);

module.exports.User = User;
module.exports.user_validation_schema = user_validation_schema;
module.exports.login_validation_schema = login_validation_schema;