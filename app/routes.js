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
				res.json(results[0]); // return all results in JSON format
			else
				res.send('fail');
		});
};


module.exports = function(app) {

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
			}
				
			// console.log("poll.create " + JSON.stringify(pollData));
			// get and return all the polls after you create another
			getPolls(res);
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

		var questionData = {
			questionPoll : req.body.questionPoll,
			questionNumber : req.body.questionNumber,
			questionQuestion : req.body.questionQuestion,
			questionType : req.body.questionType,
			isDeleted : false,
		};
		// console.log(JSON.stringify(polldata));

		questionDB.create(questionData, function(err, questionData) {
			if (err)
			{
				console.log("err " + err);
				res.send(err);
			}
				
			// console.log("poll.create " + JSON.stringify(pollData));
			// get and return all the polls after you create another
			getQuestion(res,req.body.questionPoll);
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

	app.get('/api/resultsUser/:pollId/:userId', function(req, res) {
		// use mongoose to get all poll in the database
		console.log("GET resultsUser " + req.params.pollId + ' ' + req.params.userId);
		getResultUser(res,req.params.pollId,req.params.userId);
	});

	app.get('/api/resultsQuestion/:question_id', function(req, res) {
		// use mongoose to get all poll in the database
		console.log("GET resultsQuestion " + req.params.question_id);
		getResultQuestion(res,req.params.question_id);
	});

	app.post('/api/results', function(req, res) {
		// create a poll, information comes from AJAX request from Angular
		console.log("POST RESULTS " + JSON.stringify(req.body));

		var resultData = {
			resultPoll : req.body.resultPoll,
			resultQuestion : req.body.resultQuestion,
			resultAnswer : req.body.resultAnswer,
			resultUser : req.body.resultUser,
			isDeleted : false,
		};
		// console.log(JSON.stringify(polldata));

		resultDB.create(resultData, function(err, resultData) {
			if (err)
			{
				console.log("err " + err);
				res.send(err);
			}
				res.json(true);
			// console.log("poll.create " + JSON.stringify(pollData));
			// get and return all the polls after you create another
			// getQuestion(res,req.body.questionPoll);
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
	app.get('/api/users', function(req, res) {
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

	app.post('/api/user', function(req, res) {
		// create a poll, information comes from AJAX request from Angular
		console.log("POST USER " + JSON.stringify(req.body));


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
			result.isDeleted = false;

			// console.log(JSON.stringify(polldata));

			userDB.update(result, function(err, userData) {
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
		console.log("GET USERS");
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