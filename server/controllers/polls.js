const express = require('express')
    , router = express.Router();
const { Poll } = require("./../models/Poll");
const { authenticate } = require('./../midllewares/auth');
const { ObjectID } = require('mongodb');

//POST /polls - create poll -> auth
router.post("/", authenticate, (req, res) => {
    var newPoll = new Poll({
        question: req.body.question,
        options: req.body.options,
        _author: req.user._id
    });
    newPoll.save().then(
        poll => {
            res.json(poll);
        },
        err => {
            res.status(400).send(err);
        }
    );
});

//GET /polls - view all polls
router.get('/', (req, res) => {
    Poll.find({}).then((polls) => {
        res.json(polls)
    }, err => {
        res.status(400).send(err);
    })
})

//GET /polls/:id - view single poll
router.get('/:id', (req, res) => {
    Poll.findById(req.params.id).then(poll => {
        res.json(poll);
    }, err => {
        res.json(err);
    })
})

//PUT /polls/:id - vote on a single poll
router.post('/:id', (req, res) => {
    var ip = req.ip;
    Poll.findById(req.params.id).then(poll => {
        if (poll.voted.includes(ip)) {
            res.status(400).send("You've allready voted.");
        } else {
            let voted = poll.voted.slice();
            voted.push(ip);
            poll.voted = voted;
            var option = poll.options.id(req.body._id);
            option.votes++;
            poll.save().then(poll => res.json(poll))
        }
    }, err => res.status(400).send(err))
})

//PATCH /polls/:id -add option to the existing poll -> auth
router.patch('/:id', authenticate, (req, res) => {
    Poll.findByIdAndUpdate(req.params.id, {
        $push: {
            "options": {
                text: req.body.text,
                _creator: req.user._id
            }
        }
    }, { safe: true, upsert: true, new: true }).then(poll => {
        res.json(poll);
    }, err => {
        res.json(err);
    })
})

//DELETE /polls/:id - delete poll you've created -> auth
router.delete('/:id', authenticate, (req, res) => {
    Poll.findOneAndRemove({ _id: req.params.id, _author: req.user._id }).then(() => {
        res.status(200).send("Poll deleted")
    }, err => {
        res.status(400).send(err);
    })
})

module.exports = router