var express = require('express');
var app = express();
var bodyParser = require('body-parser');

//so the server can handle POST requests
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use(function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	next();
});

var PORT = process.env.PORT || 8080;
var router = express.Router();

router.get('/', function(req, res){
	console.log("API has launched.");
	res.json({message: "API Base Endpoint."});
});

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/test');

var User = require('./models/user');
var Request = require('./models/request');

//-=-=-=-=-=-=-=-=-=-
// ROUTE DEFINITIONS 
//-=-=-=-=-=-=-=-=-=-

router.route('/requests')

    //create an article
    .post(function(req, res){

		console.log("POST: requests")

        var request = new Request();
        request.destination = req.body.destination;
        request.desiredTime = req.body.desiredTime;
		request.requester = req.body.requester;
		request.timeBuffer = req.body.timeBuffer;

		console.log(req.body.destination);
		console.log(req.body.desiredTime);
		console.log(req.body.requester); 
		console.log(req.body.timeBuffer); 

        //save auction
        request.save(function(err){
            //return the error in response if it exists
            if (err){
                res.send(err);
                console.log(err);
            }

            res.json({message: 'Request created!'});
        });

    })

    //get route
    .get(function(req, res){
		console.log("GET: requests")
        Request.find(function(err, requests){
            if (err){
                res.send(err);
                conosle.log(err);
            }

			res.json(requests);

        });

    });

app.use('/api', router);
app.listen(PORT);

console.log('Application listening on PORT: ' + PORT);