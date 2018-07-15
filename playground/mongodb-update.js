const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (error, client) => {
    if (error) {
        return console.log('ERROR: Database connection failed!');
    }
    console.log('SUCCESS: Connected to database.');
    const db = client.db('TodoApp');

    // db.collection('Todos').findOneAndUpdate({
    //     _id: new ObjectID('5b4b62d81f4e55aacf8cf5fa')
    // },{
    //     $set: {
    //         complete: true
    //     }
    // },{
    //     returnOriginal: false
    // }).then((result) => {
    //     console.log(result);
    // });

    db.collection('Users').findOneAndUpdate({
        _id: new ObjectID('5b4b623df20a0439068e3bba')
    },{
        $set: {
            name: 'Remilia Scarlet',
            age: 500,
            location: 'Scarlet Devil Mansion'
        }
    },{
        returnOriginal: false
    }).then((result) => {
        console.log(result);
    });

    //db.close();
});