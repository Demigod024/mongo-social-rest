const router = require('express').Router();
const User = require('../models/user');
const bcrypt = require('bcrypt');

//so in here we perform all verifivation of the users "sign up", "sign in"

//register
// router.get('/register', async (req, res) => {
// // lets take data from client
// // create a new User for test on broswer
// const user = await new User({
//     username: 'saul',
//     email: 'saul@gmail.com',
//     password: '123456'

// })
// // lets save what we created, return a success msg
// await user.save();
// res.send("ok")
// })


////register
router.post('/register', async (req, res) => {
    // we use try catch so as to catch errors
    try {
        // bcrypt, generate salt then hash password asynchroniousely
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);

        // create new user
        const user = new User({
            username: req.body.username,
            email: req.body.email,
            password: hashedPassword
        })
        //save new user & return response
        const newUser = await user.save();
        res.status(200).json(newUser)
    } catch (err) {
        console.log(err)
    }

})
/////login///

router.post('/login', async (req, res) => {

    try {
        // lets find user by email
        const user = await User.findOne({ email: req.body.email });
        !user && res.status(404).json("user not found");

        // lets confirm and verify users password with the passowrd he registered with
        const validatePassword = await bcrypt.compare(req.body.password, user.password)
        !validatePassword && res.status(400).json("wrong password")

        res.status(200).json(user)
    } catch (error) {
        res.status(500).json(error)
    }
})

module.exports = router;