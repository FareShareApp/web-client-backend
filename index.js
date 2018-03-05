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
mongoose.connect('mongodb://@ds153958.mlab.com:53958/fareshare-backend');

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

router.route('/match/:id')

    //get route
    .get(function(req, res){
        console.log("GET: requests")
        
        let requestId = req.params.id;
        Request.findById(requestId, function(err, request){
            if (err){
                res.send(err);
                conosle.log(err);
            }

            let destination = request.destination;
            let desiredTime = request.desiredTime;
            let timeBuffer = request.timeBuffer;

            //Take attributes to find minimum and maximium time frames
            let msBuffer = Number(timeBuffer) * 60 * 1000;
            let lowerTimeBound = Date.now() - msBuffer;
            let upperTimeBound = Date.now() + msBuffer;

            console.log(msBuffer);
            console.log(desiredTime);
            console.log(upperTimeBound);

            Request.find({
                "_id": {
                    $ne: requestId 
                },
                "desiredTime": {
                    $gte: lowerTimeBound,
                    $lte: upperTimeBound
                },
                "destination": destination
            })
            .exec(function(err, compatibleRequests){
                console.log(compatibleRequests);
                res.json(compatibleRequests);
            });

        });

    });

app.use('/api', router);
app.listen(PORT);

console.log('Application listening on PORT: ' + PORT);