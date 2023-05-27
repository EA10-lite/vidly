
const { login_validation_schema, User, user_validation_schema } = require("../models/users");
const auth = require("../middlewares/auth");
const validate = require("../middlewares/validate");
const bcrypt = require("bcrypt");
const express = require("express");
const _ = require("lodash");
const router = express.Router();

const hash_password = async (password) => {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
}

// get current logged in user
router.get("/me", auth, async (req,res) => {
    const user = await User.findById(req.user._id).select('-password')
    if(!user) return res.status(404).send({ error: "user not found." });

    res.status({
        data: user,
        error: null,
    });
});

// create new user
router.post("/", validate(user_validation_schema), async (req,res) => {
    let user = await User.findOne({ email: req.body.email });
    if(user) return res.status(400).send({ error: "user already exist with that email" });

    user = new User(_.pick(req.body, ['name', 'email', 'password']));
    user.password = await hash_password(user.password);
    await user.save();

    const token = user.generateAuthToken();

    res.header('x-auth-token', token).status(200).send({
        data: _.pick(user, ['name', 'email', 'password']),
        error: null,
        message: "registration successful."
    });
});

// login
router.post("/login", validate(login_validation_schema), async (req,res)=> {
    let user = await User.findOne({ email: req.body.email });
    if(!user) return res.status(400).send({ error: "invalid email or password." });

    const is_valid_password = await bcrypt.compare(req.body.password, user.password);
    if(!is_valid_password) return res.status(400).send({ error: "incorrect email or password." });

    const token = user.generateAuthToken();

    res.status(200).send({
        data: token,
        error: null,
        message: "login successful"
    });
});


module.exports = router;