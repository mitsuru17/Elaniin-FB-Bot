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
            }
            else if (text.indexOf("hola") > -1 || text.indexOf("buenas") > -1) {
                sendTextMessage(sender, "Hola! ¿Comó estas?");
            }
            else if (text.indexOf("ayuda") > -1) {
                sendTextMessage(sender, "Con gusto puedo ayudarte, ¿te gustaria saber mis opciones?");
            }
            else if (text.indexOf("chiste") > -1) {
                sendTextMessage(sender, "¿Tienes wi-fi? Sí ¿Y cuál es la clave? Tener dinero y pagarlo.");
            }
            else if (text.indexOf("contacto") > -1) {
                sendTextMessage(sender, "Puedes escribirnos a hello@elaniin.com o llamarnos desde El Salvador al 2297-9723 o desde USA al (813)922-3440");
            }
            else if (text == "equipo") {
                sendTextMessage(sender, "Nuestro equipo de trabajo es");
            }
            else if (text.indexOf("cotiza") > -1) {
                sendTextMessage(sender, "Para cotizar cualquier de nuestros servicios puedes ingresar al siguiente link: https://elaniin.com/cotiza-tu-proyecto/");
            }
            else if (text == "sms") {
                sendTextMessage(sender, "Para enviar un sms debes escribir: 'enviar + numero + mensaje'");
            }
            else if (text.indexOf("enviar") > -1) {
                sendSMS("72600261","vamos hacerlo");
                sendTextMessage(sender, "Mensaje enviado con exito!");
            }
            else{
                sendTextMessage(sender, "¿Qué te gustaria saber de nosotros? ¿Información de contacto, cotizar un proyecto, conocer a nuestro equipo, enviar un SMS o leer un chiste?");
            }
            

            
        }
    }

    res.sendStatus(200);

});

//App listen
app.listen(port, function () {

    console.log('Facebook Messenger Bot on port: ' + port);

});

//send SMS with Twillio
function sendSMS(number,messagex){

    
    var url = 'https://api.inxights.co/general/sendsms/';
    var headers = { 
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.8; rv:24.0) Gecko/20100101 Firefox/24.0',
        'Content-Type' : 'application/x-www-form-urlencoded' 
    };
    var form = { country_code: '503', to: number, message: messagex};

    request.post({ url: url, form: form, headers: headers }, function (e, r, body) {
        // your callback body
    });    
}
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