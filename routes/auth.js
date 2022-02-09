const router = require('express').Router();
const bcrypt = require('bcryptjs');
const User = require('../models/User.model');
const saltRounds = 10;


router.get("/signup", (req, res) => {
    res.render("auth/signup");
})

router.post("/signup", (req,res) => {
    let errors = []

    if (!req.body.username){
        errors.push("You did not include a name!")
    }
    if (!req.body.password) {
        errors.push("You need a password")
    }

    if(errors.length > 0) {
        res.json(errors)
    }

    const salt = bcrypt.genSaltSync(saltRounds)
    const hashedPass = bcrypt.hashSync(req.body.password, salt);

    User.create({
        username: req.body.username,
        password: hashedPass
    })
    .then((createdUser) => {
        console.log("User created:", createdUser)
        res.json(createdUser)
    })
    .catch((err) => {
        console.log(err.errors);
        res.json(err)
    });
});

module.exports = router;