const expect = require('expect');
const request = require('supertest');
const { ObjectID } = require('mongodb');

const { app } = require('./../index');
const { Poll } = require('./../models/Poll');
const { User } = require('./../models/User');
const { polls, populatePolls, users, populateUsers } = require('./seed/seed');

beforeEach(populateUsers);
beforeEach(populatePolls);

describe('POST /polls', () => {
    it('shoud create new poll', (done) => {
        var question = "What's your favorite color?";
        var options = [{ text: "red" }, { text: "blue" }, { text: "green" }];
        request(app)
            .post('/polls')
            .set('x-auth', users[0].tokens[0].token)
            .send({ question, options })
            .expect(200)
            .expect((res) => {
                expect(res.body.question).toBe(question);
                expect(res.body.options.length).toBe(3);
            })
            .end((err, res) => {
                if (err) {
                    return done(err);
                }
                Poll.find().then(polls => {
                    expect(polls.length).toBe(3);
                    expect(polls[2].question).toBe(question);
                    done();
                }).catch(err => done(err))
            })
    })
    it('shoud NOT create new poll if data incorrect', (done) => {
        request(app)
            .post('/polls')
            .set('x-auth', users[0].tokens[0].token)
            .send({})
            .expect(400)
            .end((err, res) => {
                if (err) {
                    return done(err);
                }
                Poll.find().then(polls => {
                    expect(polls.length).toBe(2);
                    done();
                }).catch(err => done(err))
            })
    })
})

describe('GET /polls', () => {
    it('should get all the polls', (done) => {
        request(app)
            .get('/polls')
            .expect(200)
            .expect(res => expect(res.body.length).toBe(2))
            .end(done)
    })
})

describe('GET /polls/:id', () => {
    it('should get the single poll', (done) => {
        request(app)
            .get(`/polls/${polls[0]._id.toHexString()}`)
            .expect(200)
            .expect(res => {
                expect(res.body.question).toBe(polls[0].question);
                expect(res.body.options.length).toBe(2);
            })
            .end(done)
    })
})

describe('POST /polls/:id', () => {
    it('could place a vote', (done) => {
        request(app)
            .post(`/polls/${polls[0]._id.toHexString()}`)
            .send({ "_id": polls[0].options[0]._id })
            .expect(200)
            .expect(res => {
                expect(res.body.voted.length).toBe(1);
                expect(res.body.options[0].votes).toBe(1);
            })
            .end(done)
    })
    it('prevents voting twice on the same poll', (done) => {
        request(app)
            .post(`/polls/${polls[0]._id.toHexString()}`)
            .send({ "_id": polls[0].options[0]._id })
            .end(() => {
                request(app)
                    .post(`/polls/${polls[0]._id.toHexString()}`)
                    .send({ "_id": polls[0].options[0]._id })
                    .expect(400)
                    .end((err, res) => {
                        if (err) {
                            return done(err);
                        }
                        Poll.findById(polls[0]._id).then(poll => {
                            expect(poll.voted.length).toBe(1);
                            expect(poll.options[0].votes).toBe(1);
                            done();
                        }).catch(err => done(err))
                    });
            })
    })
})

describe('PATCH /polls/:id', () => {
    it('will add option to a poll', (done) => {
        request(app)
            .patch(`/polls/${polls[1]._id.toHexString()}`)
            .set('x-auth', users[1].tokens[0].token)
            .send({ "text": "hevy-metal" })
            .expect(200)
            .end((err, res) => {
                if (err) {
                    return done(err);
                }
                Poll.findById(polls[1]._id).then(poll => {
                    expect(poll.options.length).toBe(3);
                    expect(poll.options[2].text).toBe("hevy-metal");
                    expect(poll.options[2]._creator).toEqual(users[1]._id);
                    done();
                }).catch(err => done(err))
            })
    })
    it('will not add option if user is not authenticated', (done) => {
        request(app)
            .patch(`/polls/${polls[1]._id.toHexString()}`)
            .send({ "text": "hevy-metal" })
            .expect(401)
            .end((err, res) => {
                if (err) {
                    return done(err);
                }
                Poll.findById(polls[1]._id).then(poll => {
                    expect(poll.options.length).toBe(2);
                    done();
                }).catch(err => done(err))
            })
    })
})


describe('DELETE /polls/:id', () => {
    it('will delete a single poll', (done) => {
        request(app)
            .delete(`/polls/${polls[1]._id.toHexString()}`)
            .set('x-auth', users[0].tokens[0].token)
            .expect(200)
            .end((err, res) => {
                if (err) {
                    return done(err);
                }
                Poll.find().then(polls => {
                    expect(polls.length).toBe(1);
                    expect(polls[0].question).toBe("What's your favorite programming language?");
                    done();
                }).catch(err => done(err))
            })
    })
    it('will not delete poll created by another user', (done) => {
        request(app)
            .delete(`/polls/${polls[1]._id.toHexString()}`)
            .set('x-auth', users[1].tokens[0].token)
            .expect(200)
            .end((err, res) => {
                if (err) {
                    return done(err);
                }
                Poll.find().then(polls => {
                    expect(polls.length).toBe(2);
                    done();
                }).catch(err => done(err))
            })
    })
})

describe('POST /users', () => {
    it('shoud create new user', (done) => {
        var email = "andria@example.com";
        var password = "userTreePass";
        request(app)
            .post('/users')
            .send({ email, password })
            .expect(200)
            .expect((res) => {
                expect(res.body.email).toBe(email);
            })
            .end((err, res) => {
                if (err) {
                    return done(err);
                }
                User.find().then(users => {
                    expect(users.length).toBe(3);
                    expect(users[2].email).toBe(email);
                    done();
                }).catch(err => done(err))
            })
    })
    it('shoud NOT create new user if data incomplete', (done) => {
        request(app)
            .post('/users')
            .send({})
            .expect(400)
            .end((err, res) => {
                if (err) {
                    return done(err);
                }
                User.find().then(users => {
                    expect(users.length).toBe(2);
                    done();
                }).catch(err => done(err))
            })
    })
    it('shoud NOT create new user if user exists', (done) => {
        request(app)
            .post('/users')
            .send({ email: users[1].email, password: users[1].password })
            .expect(400)
            .end((err, res) => {
                if (err) {
                    return done(err);
                }
                User.find().then(users => {
                    expect(users.length).toBe(2);
                    done();
                }).catch(err => done(err))
            })
    })
})

describe('GET /users/me', () => {
    it('will return polls created by authenticated user', (done) => {
        request(app)
            .get('/users/me')
            .set('x-auth', users[0].tokens[0].token)
            .expect(200)
            .expect((res) => {
                expect(res.body.length).toBe(2);
            })
            .end(done)
    })
    it('will return 401 if not authenticated', (done) => {
        request(app)
            .get('/users/me')
            .set('x-auth', 'blablabla')
            .expect(401)
            .end(done)
    })
})

describe('POST /users/login', () => {
    it('will login user', (done) => {
        request(app)
            .post('/users/login')
            .send({ email: users[1].email, password: users[1].password })
            .expect(200)
            .expect((res) => {
                expect(res.body._id).toBe(users[1]._id.toHexString())
                expect(res.body.email).toBe(users[1].email);
                expect(res.headers).toContainKey('x-auth');
            })
            .end(done)
    })
    it('will return 400 if wrong credentials', (done) => {
        request(app)
            .post('/users/login')
            .send({})
            .expect(400)
            .end(done)
    })
})

describe('DELETE /users/me/token', () => {
    it('will logout user', (done) => {
        request(app)
            .delete('/users/me/token')
            .set('x-auth', users[0].tokens[0].token)
            .expect(200)
            .end((err, res) => {
                if (err) {
                    return done(err);
                }
                User.findById(users[0]._id).then(user => {
                    expect(user.tokens.length).toBe(0);
                    done();
                }).catch(err => done(err))
            })
    })
    it('will return 401 if not authenticated', (done) => {
        request(app)
            .get('/users/me')
            .set('x-auth', 'blablabla')
            .expect(401)
            .end(done)
    })
})
