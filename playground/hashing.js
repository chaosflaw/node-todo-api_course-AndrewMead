const {SHA256} = require('crypto-js');
const jwt = require('jsonwebtoken');

const bcrypt = require('bcryptjs');

var password = '123abc';

bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(password, salt, (err, hash) => {
        console.log(hash);
    });
});

var hashedPassword = '$2a$10$sWQufrObXnM7wFCNg2Bli.MopYMNzfMHa7XrcYn.sf9zFsu5qduye';

bcrypt.compare(password, hashedPassword, (err, res) => {
    console.log(res);
});
// var data = {
//     id: 10,
// };

// var token = jwt.sign(data, '123abc');
// console.log(token);

// var decoded = jwt.verify(token, '123abc');
// console.log('decoded', decoded);



// var message = 'I am user no3';

// var hash = SHA256(message).toString();

// console.log(`MEssage ${message}`);
// console.log(`Hash: ${hash}`);

// var data = {
//     id: 4
// };
// var token = {
//     data,
//     hash: SHA256(JSON.stringify(data) + 'somesecret').toString()
// }

// token.data.id = 5;
// token.hash = SHA256(JSON.stringify(token.data)).toString();



// var resultHash = SHA256(JSON.stringify(token.data) + 'somesecret').toString();

// if (resultHash === token.hash) {
//     console.log('Data was NOT changed.');
// } else {
//     console.log('Data was changed.');
// }


