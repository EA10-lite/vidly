
module.exports = (req, res, next) => {
    console.log(req.user);
    const is_admin = req.user.is_admin;
    if(!is_admin) return res.status(403).send({ error: "you dont have access to this request." });

    next();
}