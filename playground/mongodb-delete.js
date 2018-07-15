const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (error, client) => {
    if (error) {
        return console.log('ERROR: Database connection failed!');
    }
    console.log('SUCCESS: Connected to database.');
    const db = client.db('TodoApp');

    //deleteMany
    // db.collection('Todos').deleteMany({text: 'Buy coffee'}).then((result) => {
    //     console.log(result);
    // });

    //deleteOne
    // db.collection('Todos').deleteOne({text: 'Buy coffee'}).then((result) => {
    //     console.log(result.result);
    // });

    //findOneAndDelete
    // db.collection('Todos').findOneAndDelete({complete: false}).then((result) => {
    //     console.log(result);
    // });

    db.collection('Users').deleteMany({name: 'Sophie'});
    db.collection('Users').findOneAndDelete({
        _id: new ObjectID('5b4885949390f50ca8927d68')
    });

    //db.close();
});