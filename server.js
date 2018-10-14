var express = require('express');
var app = express();
var bodyParser = require('body-parser');
// Load the MySQL pool connection
const pool = require(__dirname + "/" + "config.js" );

// Create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false })

// Display all users
app.get('/users', (request, response) => {
    pool.query('SELECT * FROM users', (error, result) => {
        if (error) throw error;
 
        response.send(result);
    });
});

app.get('/', function (req, res) {
   res.sendFile( __dirname + "/" + "index.html" );
})

app.post('/process_post', urlencodedParser, function (req, res) {
    pool.query('SELECT username, password, secret FROM users', (error, result) => {
        if (error) throw error;
        response = {
            username:req.body.username,
            password:req.body.password
        };

        if (req.body.password == result[0].password){
            res.send(result[0].secret);
        } else {
            res.send("wrong password");
        }
        //response = JSON.stringify(response);
        // req.body.username = joe - end() or send()
        // result[0].username = admin - send()
        
    });
   // Prepare output in JSON format
   /* response = {
      first_name:req.body.first_name,
      last_name:req.body.last_name
   };
   console.log(response);
   res.end(JSON.stringify(response)); */
})

var server = app.listen(8081, function () {
   var host = server.address().address
   var port = server.address().port
   
   console.log("Example app listening at http://%s:%s", host, port)

})