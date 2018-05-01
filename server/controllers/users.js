const express = require('express')
    , router = express.Router();
const { User } = require("./../models/User");
const { Poll } = require('./../models/Poll');
const { authenticate } = require('./../midllewares/auth')

//POST /users/login
router.post('/login', (req, res) => {
    User.findByCredentials(req.body.email, req.body.password).then((user) => {
        return user.generateAuthToken().then(token => res.header('x-auth', token).send(user))
    }).catch(e => res.status(400).send());
})

//POST /users - create user
router.post('/', (req, res) => {
    var user = new User({
        email: req.body.email,
        password: req.body.password
    });
    user.save().then(
        () => {
            return user.generateAuthToken();
        }).then(token => {
            res.header('x-auth', token).send(user);
        }).catch(err => res.status(400).send(err));
})

//GET /users/me - view your polls -> auth
router.get('/me', authenticate, (req, res) => {
    Poll.find({ _author: req.user._id }).then(polls => {
        res.json(polls)
    }, err => res.send(err))
})

//DELETE /users/me/token
router.delete('/me/token', authenticate, (req, res) => {
    req.user.removeToken(req.token).then(() => {
        res.status(200).send()
    }, (err) => {
        res.status(400).send(err)
    })
})

module.exports = router