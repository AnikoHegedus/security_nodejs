var express = require('express');
var app = express();
var bodyParser = require('body-parser');
// Load the MySQL pool connection
const pool = require(__dirname + "/" + "config.js");

// Load static files (ie: CSS)
app.use('/static', express.static('static'))

// Create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({
    extended: false
})

app.get('/', function (req, res) {
    res.sendFile(__dirname + "/" + "index.html");
})
var ExpressBrute = require('express-brute');
var store = new ExpressBrute.MemoryStore(); // stores state locally, don't use this in production
var bruteforce = new ExpressBrute(store);
var permutations = require('permutation');

app.post('/process_post', urlencodedParser, function (req, res) {
    // brute force tries are based on the permutations of the string entered as password
    var arr = permutations(req.body.password);
    // iterate through the permutations and make a http request each time
    for (var i = 0; i < arr.length; i++) {
        if (sendRequest(req, res)) {
            res.send("You are logged in");
        } else {
            res.send("Wrong password");
        }
    }
    res.redirect('/');
});

function sendRequest(req, res) {

    bruteforce.prevent, // error 429 if we hit this route too often
    password = "aba";
    pool.query('SELECT username, password FROM users', (error, result) => {
        if (error) throw error;
        password = result[0].password;
       return password;
    });

    // check if any of the permutations is identical to the password
    var arr = permutations(req.body.password);
    loggedIn = false;
    for (var i = 0; i < arr.length; i++) {
        if (password == arr[i]) {
            loggedIn = true;
        }
    }
    return loggedIn;
}

var server = app.listen(8081, function () {
    var host = server.address().address
    var port = server.address().port

    console.log("Example app listening at http://%s:%s", host, port)

})