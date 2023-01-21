const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('../models/user');

// so in here we perform all our CRUD operations on the users "create delete update user"
//C- create 
//R- get a user
router.get('/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
        // we dont want to see this stuffs in the database
        const { password, updatedAt, ...others } = user._doc
        res.status(200).json(others)
    } catch (error) {
        res.status(500).json(error)
    }
})

//U-update user

router.put('/:id', async (req, res) => {
    //check if the userId from the client !== the one in the route /:id or the one coming from db
    if (req.body.userId === req.params.id || req.body.isAdmin) {
        if (req.body.password) {
            try {
                //generate pasword then hash before update
                const salt = await bcrypt.genSalt(10);
                req.body.password = await bcrypt.hash(req.body.password, salt);
            } catch (err) {
                return res.status(501).json(err)
            }
        }
        //updating a user and set  data gotten from the body in DB
        try {
            const user = await User.findByIdAndUpdate(req.params.id, { $set: req.body });
            res.status(200).json('account has been updated')
        } catch (error) {
            return res.status(500).json(error)
        }
    } else {
        return res.status(403).json('you are go for update')
    }
});


//D- delete user

router.delete('/:id', async (req, res) => {
    if (req.body.userId === req.params.id || req.body.isAdmin) {

        //deleting a user and set  data gotten from the body in DB
        try {
            const user = await User.findByIdAndDelete(req.params.id);
            res.status(200).json('account deleted')
        } catch (err) {
            return res.status(500).json(err)
        }
    } else {
        return res.status(403).json('you are go for deleting somthing')
    }
})
// then follow 
router.put('/:id/follow', async (req, res) => {
    if (req.body.userId !== req.body.id) {

        try {
            const user = await User.findById(req.params.id);
            const currentUser = await User.findById(req.body.userId);
            if (!user.followers.includes(req.body.userId)) {
                await user.updateOne({ $push: { followers: req.body.userId } })
                await currentUser.updateOne({ $push: { followings: req.params.id } })
                res.status(200).json('user has been followed')
            } else {
                res.status(403).json('you already follwing')

            }
        } catch (error) {
            res.status(500).json(error)
        }
    } else {
        res.status(403).json('you cant follow yourself')
    }
})

//and unfollow a user
router.put('/:id/unfollow', async (req, res) => {
    if (req.body.userId !== req.body.id) {

        try {
            const user = await User.findById(req.params.id);
            const currentUser = await User.findById(req.body.userId);
            if (user.followers.includes(req.body.userId)) {
                await user.updateOne({ $pull: { followers: req.body.userId } })
                await currentUser.updateOne({ $pull: { followings: req.params.id } })
                res.status(200).json('user has been unfollowed')
            } else {
                res.status(403).json('you already unfollwing')

            }
        } catch (error) {
            res.status(500).json(error)
        }
    } else {
        res.status(403).json('you cant unfollow yourself')
    }
})

//checkung routes
router.get('/', (req, res) => {
    res.send('hello frrom routes')
})


module.exports = router