const { ObjectID } = require('mongodb');
const { Poll } = require('./../../models/Poll');
const { User } = require('./../../models/User');
const jwt = require('jsonwebtoken');

const userOneId = new ObjectID();
const userTwoId = new ObjectID();
const users = [
    {
        "_id": userOneId,
        "email": "jasmina@example.com",
        "password": "userOnePass",
        "tokens": [{ "access": "auth", "token": jwt.sign({ _id: userOneId.toHexString(), access: "auth" }, process.env.JWT_SECRET).toString() }]
    },
    {
        "_id": userTwoId,
        "email": "danka@example.com",
        "password": "userTwoPass",
        "tokens": [{ "access": "auth", "token": jwt.sign({ _id: userTwoId.toHexString(), access: "auth" }, process.env.JWT_SECRET).toString() }]
    }
];
const populateUsers = (done) => {
    User.remove({}).then(() => {
        let userOne = new User(users[0]).save();
        let userTwo = new User(users[1]).save();
        return Promise.all([userOne, userTwo])
    }).then(() => done());
}

const polls = [
    {
        "_id": new ObjectID(),
        "question": "What's your favorite programming language?",
        "options": [{ "text": "js", "_id": new ObjectID() }, { "text": "ruby" }],
        "_author": userOneId
    },
    {
        "_id": new ObjectID(),
        "question": "What's your favorite music?",
        "options": [{ "text": "rock" }, { "text": "classic" }],
        "_author": userOneId
    }
];
const populatePolls = (done) => {
    Poll.remove({}).then(() => {
        let pollOne = new Poll(polls[0]).save();
        let pollTwo = new Poll(polls[1]).save();
        return Promise.all([pollOne, pollTwo])
    }).then(() => done());
}

module.exports = {
    polls,
    populatePolls,
    users,
    populateUsers
}