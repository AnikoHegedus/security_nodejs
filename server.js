const express = require('express');
const app = express();
const bodyParser = require('body-parser');
// Load the MySQL pool connection
const pool = require(__dirname + "/" + "config.js");

// Load static files (ie: CSS)
app.use('/static', express.static('static'))

// Create application/x-www-form-urlencoded parser
const urlencodedParser = bodyParser.urlencoded({
    extended: false
})

app.get('/', function (req, res) {
    res.sendFile(__dirname + "/" + "index.html");
})

// prevent brute force attacks - throws 429 error by default 
/* const rateLimit = require("express-rate-limit");
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 50 // limit each IP to 50 requests per windowMs
});
app.use('/process_post', limiter); */


var permutations = require('permutation');

app.post('/process_post', urlencodedParser, function (req, res) {
    // brute force tries are based on the permutations of the string entered as password
    const arr = permutations(req.body.password);
    // iterate through the permutations and make a http request each time
    const promises = [];
    for (let i = 0; i < arr.length; ++i) {
        // try to stop brute force via limiter
        //app.use(limiter);
        // make the http calls
        promises.push(getPromise(arr[i]));
        Promise.all(promises)
            .then(value => {
                if (value[value.length - 1]) {
                    res.send("You are logged in");
                }
            }).then(value => {
                res.send("Wrong password");

            })
            .catch(e => {
                console.log("error: ", e);
            });
    }
});


const server = app.listen(8081, function () {
    const host = server.address().address
    const port = server.address().port

    console.log("Example app listening at http://%s:%s", host, port)

})

function getPromise(pw) {
    const Promise = require("bluebird");
    return new Promise((resolve, reject) => {
        // get password from database
        pool.query('SELECT username, password FROM users', (error, result) => {
            if (error) throw error;
            const pwFromDB = result[0].password;

            let loggedIn = false;
            // check if password is ok - pw = input from user
            if (pw == pwFromDB) {
                loggedIn = true;
            }
            resolve(loggedIn);
        });
    });
}