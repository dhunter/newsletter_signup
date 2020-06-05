const express = require('express');
const body_parser = require('body-parser');
const https = require('https');
const dotenv = require('dotenv').config();

const app = express();
app.use(express.static(__dirname + '/public'));
app.use(body_parser.urlencoded({extended: true}));

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/signup.html');
})

app.post('/', function(req, res) {
    const first_name = req.body.first_name;
    const last_name = req.body.last_name
    const email = req.body.email;

    const data = {
        members: [
            {
                email_address: email,
                status: 'subscribed',
                merge_fields: {
                    FNAME: first_name,
                    LNAME: last_name
                }
            }
        ]
    };
    const json_data = JSON.stringify(data);
    const list_id = process.env.MAILCHIMP_LIST_ID_1;
    const url = process.env.MAILCHIMP_ENTRY_POINT + list_id;
    const options = {
        method: 'POST',
        auth: process.env.MAILCHIMP_API_KEY
    };
    
    const request = https.request(url, options, function(response) {
        if (response.statusCode === 200) {
            res.sendFile(__dirname + '/success.html');
        } else {
            res.sendFile(__dirname + '/failure.html');
        }
    });
    request.write(json_data);
    request.end();
})

app.post('/failure', function(req, res) {
    res.redirect("/");
})

app.listen(process.env.PORT, function() {
    console.log("Server is running on port " + process.env.PORT + ".");
})