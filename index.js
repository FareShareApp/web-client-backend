var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var url = require('url');

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
mongoose.connect('mongodb://sammnaser:sabrina2004@ds153958.mlab.com:53958/fareshare-backend');

var User = require('./models/user');
var Request = require('./models/request');



//-=-=-=-=-=-=-=-=-=-
// Request Routes 
//-=-=-=-=-=-=-=-=-=-

router.route('/requests')

    //create an article
    .post(function(req, res){

		console.log("POST: requests")

        var request = new Request();
        request.destination = req.body.destination;
        request.desiredTime = Date(req.body.desiredTime);
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
        
        if(!req.query.userId)
            return;

        let desiredUserId = req.query.userId;
        console.log(desiredUserId);

        Request.find({requester: desiredUserId}, function(err, requests){
            if (err){
                res.send(err);
                console.log(err);
            }

			res.json(requests);

        });

    });



//-=-=-=-=-=-=-=-=-=-
// User Routes 
//-=-=-=-=-=-=-=-=-=-

router.route('/users')

    .get(function(req, res){

        if(!req.query.username){
            console.log("ROUTE REQUIRES USERNAME");
            return;
        }

        User.findOne({email: req.query.username}, function(err, desiredUser){
            if (err){
                res.send(err);
                console.log(err);
            }

			res.json(desiredUser);

        });
    })

    //create an article
    .post(function(req, res){

		console.log("POST: users")

        var user = new User();
        user.email = req.body.email;

        if(req.body.firstName)
            user.firstName = req.body.firstName;

        if(req.body.lastName)
            user.lastName = req.body.lastName;

        if(req.body.profileUrl)
		    user.profileUrl = req.body.profileUrl;
                
        if(req.body.school)
            user.school = req.body.school;

        //save auction
        user.save(function(err){
            //return the error in response if it exists
            if (err){
                res.send(err);
                console.log(err);
            }

            res.json({message: 'User created!'});
        });

    })

//Route that accepts an incoming Id as a parameter 
//And either deletes or gets data for the given request
router.route('/users/:id')

    //Grab a request with the given ID 
    .get(function(req, res){
        let requestId = req.params.id;
        User.findById(requestId, function(err, request){
            res.json(request);
        })
    })

    //Delete request with a given ID
    .delete(function(req, res){

        console.log("DELETE: delete request")

        let requestId = req.params.id;
        Request.remove({ _id: requestId}, function(err){
            console.log("ERROR: could not delete given resource.")
        });

        res.json({message: 'Request deleted!'});

    }) 


//-=-=-=-=-=-=-=-=-=-
// User Routes 
//-=-=-=-=-=-=-=-=-=-

router.route('/match/:id')

    //get route
    .get(function(req, res){
        console.log("GET: requests")
        
        let requestId = req.params.id;
        Request.findById(requestId, function(err, request){
            if (err){
                res.send(err);
                console.log(err);
            }

            let destination = request.destination;
            let desiredTime = request.desiredTime;
            let timeBuffer = request.timeBuffer;

            //Take attributes to find minimum and maximium time frames
            //TODO figure out why needs to be -(-)... JS type system whack
            let msBuffer = Number(timeBuffer) * 60 * 1000;
            let lowerTimeBound = desiredTime - msBuffer;
            let upperTimeBound = desiredTime - (-msBuffer);

            //Find all requests with given time boundaries
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

                let userIdList = compatibleRequests.map((rideRequest) => {
                    return mongoose.Types.ObjectId(rideRequest.requester);
                })

                User.find({
                    '_id': { $in: userIdList}
                    }, 
                
                    function(err, userMatches){
                        console.log(userMatches);
                        res.json(userMatches);
                    });

            });

        });

    });

app.use('/api', router);
app.listen(PORT);

console.log('Application listening on PORT: ' + PORT);