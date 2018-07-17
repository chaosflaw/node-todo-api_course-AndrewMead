const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');

const {ObjectID} = require('mongodb').ObjectID;

// var id = '5b4dc930223ee0107daae6dbaaa';

// if (!ObjectID.isValid(id)) {
//     console.log('ID not valid');
// }

// Todo.find({
//     _id: id
// }).then((todos) => {
//     if (todos.length === 0) {
//         return console.log('ID not found.');
//     }
//     console.log('Todos: ', todos);
// });

// Todo.findOne({
//     _id: id
// }).then((todo) => {
//     if (!todo) {
//         return console.log('ID not found.');
//     }
//     console.log('Todo: ', todo);
// });

// Todo.findById(id).then((todo) => {
//     if (!todo) {
//         return console.log('ID not found.');
//     }
//     console.log('Todo by id: ', todo);
// }).catch((e) => console.log(e));
var userID = '5b4b9032e8871f08a53cb691';

User.findById(userID).then((user) => {
    if (!user) {
        return console.log('User ID not found.');
    }
    console.log(JSON.stringify(user, undefined, 2));
}, (e) => {
    console.log(e);
});