var express = require('express');
var bodyParser = require('body-parser');
var request = require('request');
var app = express();

var port = process.env.PORT || 8080;
app.use(bodyParser.json());

//Your FanPageToken Generated in your FB App
var token = "EAAGntUHrzeUBAEp5BvTD1lYLl5hnI3wkHOaC6pymaSZCtlFXi2rN7WpdOW85emUH9AUig4kC3l8V3BAtUXT5QZCXFpLrZBnGl7HY4dK4W9GdSnV5ocV3iD0lD0JItrQSCf49sCcoiqBBZBiRQtoZCfN84A2Bl3QojdjqZAL2rmtwZDZD";
var verify_token = "inspirar1992!";

//Root EndPoint
app.get('/', function (req, res) {

    res.send('Facebook Messenger Bot root endpoint!');

});

//Setup Webhook
app.get('/webhook/', function (req, res) {

    if (req.query['hub.verify_token'] === verify_token) {
        res.send(req.query['hub.challenge']);
    }

    res.send('Error, wrong validation token');

});

app.post('/webhook/', function (req, res) {

    var messaging_events = req.body.entry[0].messaging;

    for (var i = 0; i < messaging_events.length; i++) {

        var event = req.body.entry[0].messaging[i];
        var sender = event.sender.id;

        if (event.message && event.message.text) {
            var text = event.message.text;
            text = text.toLowerCase();
            if (text.indexOf("gracias") > -1 || text.indexOf("thank") > -1) {
                sendTextMessage(sender, "Gracias a ti!");
            }else if (text == "opciones") {
                sendTextMessage(sender, "Te puedo brindar la siguiente información");
            }else{
                sendTextMessage(sender, "Hola! Estoy para ayudarte a encontrar todo lo que necesites sobre Elaniin Digital, para saber las opciones escribe 'opciones'. ");
            }

            
        }
    }

    res.sendStatus(200);

});

//App listen
app.listen(port, function () {

    console.log('Facebook Messenger Bot on port: ' + port);

});

//send Message with Facebook Graph Facebook v2.6
function sendTextMessage(sender, text) {

    var messageData = {
        text: text
    };

    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token: token},
        method: 'POST',
        json: {
            recipient: {id: sender},
            message: messageData
        }
    }, function (error, response) {

        if (error) {
            console.log('Error sending message: ', error);
        } else if (response.body.error) {
            console.log('Error: ', response.body.error);
        }

    });

}