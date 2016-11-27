/*** APPLICATION INIT ***/

// Require modules and start Express

var express = require('express');
var request = require('request');
var bodyParser = require('body-parser');
var env = process.env;

var app = express();
app.use(bodyParser.json());
// Static files for angular app
app.use('/backoffice', express.static('backoffice'));

// Init application state

var popsHistory = [];

var popsGeoloc;

var arianeStarted = false;
var enrolled;


/*** AF APIs ***/

// Get token form mashery
function authentificate() {
    request.post({
        url: 'https://www.klm.com/oauthcust/oauth/token',
        headers: {
            'Authorization' : 'Basic azZ2NTNxcnc2c3Nnc2puNG5xczlkYmVqOk1ZU1RYZVNjdXQ=',
            'Content-Type': 'application/x-www-form-urlencoded',
            'Cache-Control': 'no-cache'
        },
        body: 'grant_type=client_credentials'
    }, function (error, resp, body) {
        console.log(resp);
    });
}

// Get flight status
app.get('/api/flight', function(req, res) {

    let flightNumber = req.query.flightNumber;
    let date = req.query.date;
    let origin = req.query.origin;

    request.get({
        url: 'https://api.klm.com/travel/flightstatus/' + flightNumber + '+' + date + '?origin=' + origin,
        headers: {
            'Authorization' : 'Bearer a7q9c5enfkygxtwpc7jjsp6z',
            'Accept': 'application/hal+json;version=com.afkl.operationalflight.v1',
            'Cache-Control': 'no-cache',
        }
    }, function (error, resp, body) {
        console.log(resp);

        res.send(body);
    });
});


/*** MOCKUP APIs ***/

// Start the ariane process
app.post('/startAriane', function(req, res) {
    if (req.body && req.body.flightNumber && req.body.flightNumber == 'AF977'
        && req.body.date && req.body.date == "25NOV") {
        
        arianeStarted = true;
        res.send();
    }
    else {
        res.status(404).send('Not found');
    }
});

// Returns the PNR list for backoffice
app.get('/flight/pnrList', function(req, res) {
    if (req.query && req.query.flightNumber && req.query.flightNumber == 'AF977'
        && req.query.date && req.query.date == "25NOV") {
        
        let response = {

            number: 'AF977',
            origin: 'LBV',
            destination: 'CDG',
            scheduledDepartureDate: '25NOV 22:50',
            scheduledArrivalDate: '26NOV 06:50',
            estimatedDepartureDate: '26NOV 07:30',

            arianeStarted: arianeStarted,

            pnrList: [
                {
                    pnr: 'BBB222',
                    enrolled: enrolled,
                    paxList: [
                        {
                            name:'HOWEL',
                            surname:'Vincent',
                        },
                        {
                            name:'HOWEL',
                            surname:'Emma',
                        },
                        {
                            name:'HOWEL',
                            surname:'Manon',
                        },
                        {
                            name:'HOWEL',
                            surname:'Gabriel',
                        },
                        {
                            name:'HOWEL',
                            surname:'Théo',
                        }
                    ]
                },
                {
                    pnr: 'AAA111',
                    enrolled: enrolled,
                    paxList: [
                        {
                            name: 'HUBERT',
                            surname: 'Charles'
                        }
                    ],
                    enrolled: 'mobile'
                }
            ],
        };

        res.send(response);
    }
    else {
        res.status(404).send('Not found');
    }
});

// Returns details on a PNR for the backoffice
app.get('/flight/pnr', function(req, res) {
    if (req.query && req.query.seatNumber
        && ['24E', '24F', '24G', '24G', '24H'].indexOf(req.query.seatNumber) !== -1) {
        
        let response = {
            pnr: 'BBB222',
            cabin_code:'W',
            flightList: [
                {
                    number: 'AF977',
                    origin: 'LBV',
                    destination: 'CDG',
                    departureDate: '25NOV 22:50',
                    arrivalDate: '26NOV 06:50'
                },
                {
                    number: 'AF976',
                    origin: 'CDG',
                    destination: 'LBV',
                    departureDate: '12DEC 10:35',
                    arrivalDate: '12DEC 17:35'
                }
            ],
            passengerList: [
                {
                    name:'HOWEL',
                    surname:'Vincent',
                    civil: 'MR',
                    seat:'24E',
                    ticketNumber:'057 2222222222',
                    fqtv: {
                        level: 'Ivory',
                        number: 'AF22222222222'
                    }
                },
                {
                    name:'HOWEL',
                    surname:'Emma',
                    civil: 'MRS',
                    seat:'24F',
                    ticketNumber:'057 2222222223',
                    fqtv: {
                        level: 'Ivory',
                        number: 'AF33333333333'
                    }
                },
                {
                    name:'HOWEL',
                    surname:'Manon',
                    civil: 'MISS',
                    seat:'24G',
                    ticketNumber:'057 2222222224',
                },
                {
                    name:'HOWEL',
                    surname:'Gabriel',
                    civil: 'MR',
                    seat:'24H',
                    ticketNumber:'057 2222222225',
                },
                {
                    name:'HOWEL',
                    surname:'Théo',
                    civil: 'INF',
                    seat:undefined,
                    ticketNumber:'057 2222222226',
                },
            ]
        };

        res.send(response);
    }
    else {
        res.status(404).send('Not found');
    }
});


/*** Interaction with POPS devices ***/

// Send JSON data to POPS device
function sendToPops(requestBody) {
    request.post({
        url: 'http://odc.kermit.orange-labs.fr/post/866224023458614',
        headers: {'Content-type' : 'application/json'},
        body: JSON.stringify(requestBody)
    }, function (error, resp, body) {   
        console.log(resp);
    });
}

// Records geolocation form POPS
app.post('/pops/receiveGeoloc', function(req, res) {
    console.log(req.body);
    popsGeoloc = req.body;
    res.send();
})

// Returns geoloc
app.get('/pops/geoloc', function(req, res) {
    res.send(popsGeoloc);
})

// Send a geoloc request to the POPS device
app.get('/pops/requestGeoloc', function(req, res) {
    
     let requestBody = {
        key: 'request',
        value: 'getLocation'
    };

    console.log(requestBody);

    sendToPops(requestBody);

    res.send('Sent Geoloc request ' + JSON.stringify(requestBody));
});

// Send a simple JSON message to display a popup on POPS
app.post('/pops/sendMessage', function(req, res) {

    console.log(req.body);

    let requestBody = {
        key: req.body.content
    };

    console.log(requestBody);

    sendToPops(requestBody);

    res.send('Sent ' + requestBody.key);
});

// Get pops decison tree history
app.get('/pops/history', function(req, res) {
    //res.send(JSON.stringify(popsHistory));

    // Mockup
    let result = [
        {
            from:'backoffice',
            date:'25NOV 21:30',
            content:'Enrollement du POPS'
        },
        {
            from:'backoffice',
            date:'25NOV 23:30',
            content:'Vol reporté J+1, envoi propositions hébergement'
        },
        {
            from:'pops',
            date:'25NOV 23:30',
            content:'ACK, choix : hôtel Novotel + navette'
        }
    ];

    res.send(result);
});

// Enroll a new POPS to Ariane
app.post('/pops/enroll', function(req, res) {
    console.log(req.body);

    if (req.body.popsNumber && req.body.popsNumber == 'POPS123') {

        enrolled = 'pops';

        let requestBody = {
            "element": "question",
            "value": "Hebergement ?",
            "reponse1": "Hotel",
            "reponse2": "Domicile"
        }

        sendToPops(requestBody);

        popsHistory.push(requestBody);

        res.send();
    }
    else {
        res.status(400).send();
    }
    
});

// Saves a decison tree answer from POPS
app.post('/pops/receiveAnswer', function(req, res) {
    console.log(req.body);

    let answer = req.body;

    popsHistory.push(answer);

    if (answer.question == "Hebergement ?") {
        if (answer.reponse == "Hotel") {

            let requestBody = {
                "element": "question",
                "value": "Hotel ?",
                "reponse1": "Ibis",
                "reponse2": "Novotel",
                "reponse3": "Mercure",
            }

            sendToPops(requestBody);

            popsHistory.push(requestBody);
        }
    }

    res.send();
});

// Saves a test message from POPS
app.post('/pops/receiveMessage', function(req, res) {
    console.log(req.body);
    popsHistory.push(req.body);
    res.send();
});


/*** APPLICATION BOOTSTRAP ***/
app.listen(env.NODE_PORT || 3000, env.NODE_IP || 'localhost');

// Get a token from mashery
authentificate();
