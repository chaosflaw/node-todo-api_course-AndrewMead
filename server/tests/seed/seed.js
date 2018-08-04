const {ObjectID} = require('mongodb');
const jwt = require('jsonwebtoken');

const {Todo} = require('./../../models/todo');
const {User} = require('./../../models/user');

const userOneId = new ObjectID();
const userTwoId = new ObjectID();

const usersSeed = [{
    _id: userOneId,
    email: 'userOne@test.com',
    password: 'passwordOne',
    tokens: [{
        access: 'auth',
        token: jwt.sign({_id: userOneId, access: 'auth'}, process.env.JWT_SECRET).toString()
    }]
}, {
    _id: userTwoId,
    email: 'userTwo@test.com',
    password: 'passwordTwo',
    tokens: [{
        access: 'auth',
        token: jwt.sign({_id: userTwoId, access: 'auth'}, process.env.JWT_SECRET).toString()
    }]
}];


const todosSeed = [{
    _id: new ObjectID(),
    text: 'Test todo 1',
    _creator: userOneId
}, {
    _id: new ObjectID(),
    text: 'Test todo 2',
    _creator: userTwoId
}, {
    _id: new ObjectID(),
    text: 'Test todo 3',
    completed: 'true',
    completedAt: 13287651,
    _creator: userTwoId
}];

const populateTodos = (done) => {
    Todo.remove({}).then(() => {
        return Todo.insertMany(todosSeed);
    }).then(() => done());
};

const populateUsers = (done) => {
    User.remove({}).then(() => {
        var userOne = new User(usersSeed[0]).save();
        var userTwo = new User(usersSeed[1]).save();

        return Promise.all([userOne, userTwo]);
    }).then(() => done());
};

module.exports = {todosSeed, populateTodos, usersSeed, populateUsers};