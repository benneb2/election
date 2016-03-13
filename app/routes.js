var express = require('express');

var pollDB = require('./models/poll');
var questionDB = require('./models/question');
var resultDB = require('./models/result');
var userDB = require('./models/users');
var stationDB = require('./models/pollingStations');
var util = require('util');


function getPolls(res){
	pollDB.find(function(err, polls) {

			// if there is an error retrieving, send the error. nothing after res.send(err) will execute
			if (err)
				res.send(err)

			res.json(polls); // return all polls in JSON format
		});
};

function getPoll(res,req){
	pollDB.find({_id:req.params.poll_id},function(err, polls) {

			// if there is an error retrieving, send the error. nothing after res.send(err) will execute
			if (err)
				res.send(err)

			res.json(polls); // return all polls in JSON format
		});
};

function getQuestion(res,pollId){
	questionDB.find({questionPoll:pollId},function(err, polls) {
			// if there is an error retrieving, send the error. nothing after res.send(err) will execute
			if (err)
				res.send(err)
			res.json(polls); // return all polls in JSON format
		});
};

function getResultQuestion(res,questionId){
	
	resultDB.find({resultQuestion:questionId},function(err, results) {

			// if there is an error retrieving, send the error. nothing after res.send(err) will execute
			if (err)
				res.send(err)

			res.json(results); // return all results in JSON format
		});
};

function getResultUser(res,pollId,userId){
	resultDB.find({resultUser:userId,resultPoll:pollId},function(err, results) {

			// if there is an error retrieving, send the error. nothing after res.send(err) will execute
			if (err)
				res.send(err)

			res.json(results); // return all results in JSON format
		});
};

function getUsers(res){
	userDB.find(function(err, results) {

			// if there is an error retrieving, send the error. nothing after res.send(err) will execute
			if (err)
				res.send(err)

			res.json(results); // return all results in JSON format
		});
};

function getStations(res){
	stationDB.find(function(err, results) {

			// if there is an error retrieving, send the error. nothing after res.send(err) will execute
			if (err)
				res.send(err)

			res.json(results); // return all results in JSON format
		});
};

function getUser(res,userName,password){

	userDB.find({userUserName:userName,userPassword:password},function(err, results) {

			// if there is an error retrieving, send the error. nothing after res.send(err) will execute
			if (err)
				res.send(err)

			if(results.length > 0)
				res.send(results[0]); // return all results in JSON format
			else
				res.send('fail');
		});
};


module.exports = function(app) {

// fulfils pre-flight/promise request
app.options('*', function(req, res,next) {
	console.log('here');
    next();
});

app.all('/*', function(req, res, next) {
  // res.header("Access-Control-Allow-Origin", "*");
  // res.header("Access-Control-Allow-Headers", "X-Requested-With","Content-Type","Origin","Authorization","Accept","Client-Security-Token","Accept-Encoding");
  // res.header("Access-Control-Allow-Methods", "GET, POST","PUT","OPTIONS","DELETE");
  // res.header("Access-Control-Allow-Credentials", "true");

  res.header('Access-Control-Allow-Origin', req.headers.origin);
  res.header('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Credentials', false);
  res.header('Access-Control-Max-Age', '86400');
  res.header('Access-Control-Allow-Headers', 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept,Access-Control-Allow-Headers');
 

  next();

});
	// api ---------------------------------------------------------------------
	// POLLS -------------------------------------------------------------------
	app.get('/api/polls', function(req, res) {
		// use mongoose to get all polls in the database
		console.log("GET POLLS");
		getPolls(res);
	});

	app.get('/api/poll/:poll_id', function(req, res) {
		// use mongoose to get all poll in the database
		console.log("GET POLL " + req.params.poll_id);
		getPoll(res,req);
	});

	app.post('/api/polls', function(req, res) {
		// create a poll, information comes from AJAX request from Angular
		console.log("POST POLLS " + JSON.stringify(req.body));

		
		// console.log(JSON.stringify(polldata));

		


		pollDB.find({pollName:req.body.pollName},function(err, results) {

			console.log(results);
			if(err)
				res.send(err);

			if(results && results.length > 0)
			{
				console.log("poll Exist")
				res.send("poll exist");
				return;
			}

			var polldata = {
				pollName : req.body.pollName,
				pollDesc : req.body.pollDesc,
				isDeleted : false,
				done : false
			};


			// console.log(JSON.stringify(polldata));
			pollDB.create(polldata, function(err, pollData) {
				if (err)
				{
					console.log("err " + err);
					res.send(err);
				}else
				{	
					res.send("success");
				}
			});

		});

	});

	// delete a poll
	app.delete('/api/polls/:poll_id', function(req, res) {
		pollDB.remove({
			_id : req.params.poll_id
		}, function(err, poll) {
			if (err)
				res.send(err);

			getPolls(res);
		});
	});
	// POLLS -------------------------------------------------------------------
	// application -------------------------------------------------------------


	// api ---------------------------------------------------------------------
	// QUESTIONS ---------------------------------------------------------------

	app.get('/api/questions/:poll_id', function(req, res) {
		// use mongoose to get all poll in the database
		console.log("GET questions " + req.params.poll_id);
		getQuestion(res,req.params.poll_id);
	});

	app.post('/api/questions', function(req, res) {
		// create a poll, information comes from AJAX request from Angular
		console.log("POST POLLS " + JSON.stringify(req.body));

		questionDB.find({questionNumber:req.body.questionNumber,questionPoll:req.body.questionPoll},function(err, results) {

			console.log(results);
			if(err)
				res.send(err);

			if(results && results.length > 0)
			{
				console.log("question Exist")
				res.send("question exist");
				return;
			}

			var questionData = {
				questionPoll : req.body.questionPoll,
				questionNumber : req.body.questionNumber,
				questionQuestion : req.body.questionQuestion,
				questionType : req.body.questionType,
				questionAnswers : req.body.questionAnswers,
				isDeleted : false,
			};


			// console.log(JSON.stringify(polldata));
			questionDB.create(questionData, function(err, questionData) {
				if (err)
				{
					console.log("err " + err);
					res.send(err);
				}else
				{	
					res.send("success");
				}
			});
		});

	});

	// delete a poll
	app.delete('/api/questions/:question_id', function(req, res) {
		questionDB.remove({
			_id : req.params.question_id
		}, function(err, poll) {
			if (err)
				res.send(err);

			getQuestion(res,req.body.questionPoll);
		});
	});
	// QUESTIONS ---------------------------------------------------------------
	// application -------------------------------------------------------------

	// api ---------------------------------------------------------------------
	// RESULTS -----------------------------------------------------------------

	app.get('/api/results/:pollId/:station', function(req, res) {
		// use mongoose to get all poll in the database
		console.log("GET resultsUser " + req.params.pollId + ' ' + req.params.station);
		resultDB.find({resultPoll:req.params.pollId,resultStation:req.params.station},function(err, results) {

			console.log('here:' + JSON.stringify(results));
			// if there is an error retrieving, send the error. nothing after res.send(err) will execute
			if (err)
				res.send(err)

			if(results.length > 0)
				res.json(results[0].resultAnswers); // return all results in JSON format
			else
				res.json([]);
		});

	});

	app.get('/api/resultsQuestion/:question_id', function(req, res) {
		// use mongoose to get all poll in the database
		console.log("GET resultsQuestion " + req.params.question_id);
		getResultQuestion(res,req.params.question_id);
	});

	app.post('/api/results', function(req, res) {
		// create a poll, information comes from AJAX request from Angular
		console.log("POST RESULTS " + JSON.stringify(req.body));

		resultDB.find({resultPoll:req.body.resultPoll,resultStation:req.body.resultStation},function(err, results) {

			console.log(results);
			if(err)
				res.send(err);

			if(results && results.length > 0)
			{
				console.log("Update Exist")
				var result = results[0];
				result.resultAnswers = req.body.resultAnswers;
				resultDB.update({"_id": result._id},result, function(err, userData) {
					if (err)
					{
						console.log("err " + err);
						res.send(err);
					}else
					{	
						res.send("success");
					}
				});

				return;
			}

			var resultData = {
				resultPoll : req.body.resultPoll,
				resultStation : req.body.resultStation,
				resultAnswers : req.body.resultAnswers,
				isDeleted : false,
			};
			// console.log(JSON.stringify(polldata));
			resultDB.create(resultData, function(err, resultData) {
				if (err)
				{
					console.log("err " + err);
					res.send(err);
				}else
				{	
					res.send("success");
				}
			});

		});

	});

	// delete a poll
	app.delete('/api/results/:result_id', function(req, res) {
		resultDB.remove({
			_id : req.params.result_id
		}, function(err, poll) {
			if (err)
			{
				res.send(err);
			}
			res.json(true); // return all polls in JSON format
			//getQuestion(res,req.body.questionPoll);
		});
	});
	// RESULTS -----------------------------------------------------------------
	// application -------------------------------------------------------------


// USERS -------------------------------------------------------------------


	app.get('/api/managerUser/:manager', function(req, res) {
		// use mongoose to get all polls in the database
		console.log("GET MANAGER USER " + req.params.manager);

		userDB.find({userManager:req.params.manager},function(err, users) {

			// if there is an error retrieving, send the error. nothing after res.send(err) will execute
			if (err)
				res.send(err)

			if(users.length > 0)
				res.json(users); // return all results in JSON format
			else
				res.send('fail');
		});

	});

	app.get('/api/users/', function(req, res) {
		// use mongoose to get all polls in the database
		console.log("GET USERS");
		getUsers(res);
	});

	app.get('/api/users/:userName/:password', function(req, res) {
		// use mongoose to get all poll in the database
		console.log("GET USER " + req.params.userName + " " + req.params.password);
		getUser(res,req.params.userName,req.params.password);
	});

	app.post('/api/users', function(req, res) {
		// create a poll, information comes from AJAX request from Angular
		console.log("POST USERS " + JSON.stringify(req.body));


		userDB.find({userUserName:req.body.userUserName},function(err, results) {

			console.log(results);
			if(err)
				res.send(err);

			if(results && results.length > 0)
			{
				console.log("user Exist")
				res.send("user exist");
				return;
			}

			if(typeof req.body.userRole == 'undefined')
				req.body.userRole = 'user';

			var userData = {
				userName : req.body.userName,
				userUserName : req.body.userUserName,
				userSurname : req.body.userSurname,
				userPassword : req.body.userPassword,
				userEmail : req.body.userEmail,
				userPollingStation : req.body.userPollingStation,
				userType : req.body.userType,
				userRole : req.body.userRole,
				userManager : req.body.userManager,
				isDeleted : false,
			};

			// console.log(JSON.stringify(polldata));

			userDB.create(userData, function(err, userData) {
				if (err)
				{
					console.log("err " + err);
					res.send(err);
				}else
				{	
					res.send("success");
				}
				// console.log("poll.create " + JSON.stringify(pollData));
				// get and return all the polls after you create another
				// console.log(userData);

				// getUsers(res);
			});
		});

	});

	app.put('/api/user', function(req, res) {
		// create a poll, information comes from AJAX request from Angular
		console.log("PUT USER " + JSON.stringify(req.body));


		userDB.find({userUserName:req.body.userUserName},function(err, results) {

			console.log(results);

			if(err)
				res.send(err);

			if(typeof req.body.userRole == 'undefined')
				req.body.userRole = 'user';

			var result = results[0];

			result.userName = req.body.userName;
			result.userSurname = req.body.userSurname;
			result.userPassword = req.body.userPassword;
			result.userEmail = req.body.userEmail;
			result.userPollingStation = req.body.userPollingStation;
			result.userType = req.body.userType;
			result.userRole = req.body.userRole;
			result.userManager = req.body.userManager,
			result.isDeleted = false;

			if ( result._id && ( typeof(result._id) === 'string' ) ) {
  				result._id = mongodb.ObjectID.createFromHexString(result._id)
			}

			userDB.update({"_id": result._id},result, function(err, userData) {
				if (err)
				{
					console.log("err " + err);
					res.send(err);
				}else
				{	
					res.send("success");
				}
				// console.log("poll.create " + JSON.stringify(pollData));
				// get and return all the polls after you create another
				// console.log(userData);

				// getUsers(res);
			});
		});

	});

	// delete a user
	app.delete('/api/users/:user_id', function(req, res) {
		userDB.remove({
			_id : req.params.user_id
		}, function(err, poll) {
			if (err)
				res.send(err);

			getUsers(res);
		});
	});
	// USERS -------------------------------------------------------------------
	// application -------------------------------------------------------------


	// POLLING STATION ---------------------------------------------------------
	app.get('/api/station', function(req, res) {
		// use mongoose to get all polls in the database
		console.log("GET Stations");
		getStations(res);
	});

	app.post('/api/station', function(req, res) {
		// create a poll, information comes from AJAX request from Angular
		console.log("POST USERS " + JSON.stringify(req.body));

		var stationData = {
			stationName : req.body.stationName,
			stationProvince : req.body.stationProvince,
			stationMunicipality : req.body.stationMunicipality,
			isDeleted : false,
			
		};
		// console.log(JSON.stringify(polldata));

		stationDB.create(stationData, function(err, stationData) {
			
			if (err)
			{
				console.log("err " + err);
				res.send(err);
			}else
			{	
				res.send("success");
			}
			// console.log("poll.create " + JSON.stringify(pollData));
			// get and return all the polls after you create another
			// getStations(res);
		});

	});

	// delete a station
	app.delete('/api/station/:station_id', function(req, res) {
		stationDB.remove({
			_id : req.params.station_id
		}, function(err, poll) {
			if (err)
				res.send(err);

			getStations(res);
		});
	});
	// POLLING STATION ---------------------------------------------------------
	// application -------------------------------------------------------------


	app.use('/', express.static('./public/'));

	// app.get('/', function(req, res) {
	// 	res.sendfile('./public/index.html'); // load the single view file (angular will handle the page changes on the front-end)
	// });




};