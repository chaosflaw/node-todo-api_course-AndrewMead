// const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (error, client) => {
    if (error) {
        return console.log('ERROR: Database connection failed!');
    }
    console.log('SUCCESS: Connected to database.');
    const db = client.db('TodoApp');

    // db.collection('Todos').insertOne({
    //     text: 'Something something',
    //     completed: false
    // }, (error, result) => {
    //     if (error) {
    //         return console.log('Unable to insert todo.', error);
    //     }
    //     console.log(JSON.stringify(result.ops, undefined, 2));
    // });

    //Insert new doc into Users (name, age, location)

    db.collection('Users').insertOne({
        name: 'Sophie',
        age: 24,
        location: 'Netherlands'
    },(err, res) => {
        if (err) {
            return console.log('Unable to insert user.', err);
        }
        console.log(JSON.stringify(res.ops, undefined, 2));
    });

    client.close();
});