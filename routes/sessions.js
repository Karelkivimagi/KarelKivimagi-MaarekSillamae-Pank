const express = require('express');
const router = express.Router();
const Users = require('../models/User');
const Sessions = require('../models/Session');
const { verifyToken } = require('../middlewares');

// Create a session
router.post(
    '/',
    async (req, res) => {

        // Validate a user with given username and password exists in the database
        try {
            // Checks if the username and/or password exists in the database before logging in
            const user = await Users.findOne({username: req.body.username, password: req.body.password});
            if (!user) {
                // Returns if the username and/or password is invalid
                return res.status(401).json({error: "Invalid username or password"});
            }

            // Creates a new Session in the database with an users userId
            const newSession = await Sessions.create({userId: user._id});
            // Returns a successful status and the token created
            return res.status(200).json({token: newSession._id});

        } catch (e) {
            // If mongodb has an issue
            console.log(e);
            return res.status(500).json();
        }
    })

// Delete a session
router.delete('/', verifyToken, async (req, res) => {
    try {
        // Removes a session by the header with the provided sessionId
        const removedSessions = await Sessions.deleteOne({ _id: req.headers.sessionId });
        res.status(200).json({ message: "Token successfully deleted" });
    } catch (err) {
        // If mongodb has an issue
        res.status(500).json({ error: "Unsuccessful" });
    }
});

module.exports = router;
