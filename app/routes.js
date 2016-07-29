var express = require('express');

var pollDB = require('./models/poll');
var questionDB = require('./models/question');
var resultDB = require('./models/result');
var userDB = require('./models/users');
var stationDB = require('./models/pollingStations');
var userPublicDB = require('./models/usersPublic');
var util = require('util');
var mongoose   = require('mongoose');

function getPolls(res){
	pollDB.find(function(err, polls) {

			// if there is an error retrieving, send the error. nothing after res.send(err) will execute
			if (err)
				res.send(err)

			res.json(polls); // return all polls in JSON format
		});
};

function getIncidents(res)
{
	resultDB.find({resultPoll:'57974998331f664b1a8e7f74'}).sort({$natural:-1}).exec(function(err, results) {

		if (err)
				res.send(err)

		userPublicDB.find(function(err, users) {

			// if there is an error retrieving, send the error. nothing after res.send(err) will execute
			if (err)
				res.send(err)

			var returnObj = [];
			for(var i in results)
			{
				for(var j in users)
				{
					if(results[i].resultUser == users[j]._id)
					{
						var tmp = {};
						tmp.name = users[j].userName + ' ' + users[j].userSurname;
						tmp.tel = users[j].userTelephone;
						tmp.lat = results[i].resultLat;
						tmp.lon = results[i].resultLon;
						tmp.result = results[i].resultAnswers;
						tmp.dateTime = results[i].resultDate;
						returnObj.push(tmp);
						break;
					}
				}
			}
			res.json(returnObj); // return all results in JSON format
		});

	});
//
}


function getObPolls(res){

	var date = new Date();
	date = new Date(1970,0,1,date.getHours(),date.getMinutes(),date.getSeconds());
	// date = new Date(date.setHours(date.getHours() - 2));

	pollDB.find({pollPublic:false},function(err, polls) {


			// if there is an error retrieving, send the error. nothing after res.send(err) will execute
			if (err)
				res.send(err)


			console.log(JSON.stringify(polls));
			res.json(polls); // return all polls in JSON format

			// var returnPolls = [];
			// for(var i in polls)
			// {
			// 	if(typeof polls[i].pollStartTime == 'undefined')
			// 	{
			// 		continue;
			// 	}

			// 	var startTime = new Date(polls[i].pollStartTime);
			// 	var endTime = new Date(polls[i].pollEndTime);

			// 	if(startTime.getTime() < date.getTime() && endTime.getTime() > date.getTime())
			// 	{
			// 		returnPolls.push(polls[i]);
			// 	}
			// }

			// res.json(returnPolls); // return all polls in JSON format
		});
};

function getPubPolls(user,res){

	var date = new Date();
	date = new Date(1970,0,1,date.getHours(),date.getMinutes(),date.getSeconds());
	// date = new Date(date.setHours(date.getHours() - 2));


	

	pollDB.find({pollPublic:true},function(err, polls) {

			// if there is an error retrieving, send the error. nothing after res.send(err) will execute
			if (err)
				res.send(err)


			resultDB.find({resultPoll:'57973d57a06358fb190a796d',resultUser : user},function(err, results) {

				if(results.length > 0)
				{
					var returnPolls = [];
					for(var i in polls)
					{
						if(polls[i]._id != '57973d57a06358fb190a796d')
							returnPolls.push(polls[i]);
					}
					res.json(returnPolls);
				}else
				{
					res.json(polls);
				}
			})
			
			// var returnPolls = [];
			// for(var i in polls)
			// {
			// 	if(typeof polls[i].pollStartTime == 'undefined')
			// 	{
			// 		continue;
			// 	}

			// 	var startTime = new Date(polls[i].pollStartTime);
			// 	var endTime = new Date(polls[i].pollEndTime);

			// 	if(startTime.getTime() < date.getTime() && endTime.getTime() > date.getTime())
			// 	{
			// 		returnPolls.push(polls[i]);
			// 	}
			// }

			// res.json(returnPolls); // return all polls in JSON format
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

var reA = /[^a-zA-Z]/g;
var reN = /[^0-9]/g;
function sortAlphaNum(a,b) {
    var aA = a.questionNumber.replace(reA, "");
    var bA = b.questionNumber.replace(reA, "");
    if(aA === bA) {
        var aN = parseInt(a.questionNumber.replace(reN, ""), 10);
        var bN = parseInt(b.questionNumber.replace(reN, ""), 10);
        return aN === bN ? 0 : aN > bN ? 1 : -1;
    } else {
        return aA > bA ? 1 : -1;
    }
}

function getQuestion(res,pollId){
	questionDB.find({questionPoll:pollId},null,{sort:'questionNumber'},function(err, polls) {
			// if there is an error retrieving, send the error. nothing after res.send(err) will execute
			if (err)
				res.send(err)

			var retPolls = polls.sort(sortAlphaNum);
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

function getPubUsers(res){
	userPublicDB.find(function(err, results) {

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

function getUser(res,userName,password,lat,lon){

	userDB.find({userUserName:userName,userPassword:password},function(err, results) {

			// if there is an error retrieving, send the error. nothing after res.send(err) will execute
			if (err)
				res.send(err)

			if(results.length > 0)
			{
				if(typeof lat == 'undefined')
				{
					res.send(results[0]); // return all results in JSON format
				}else
				{
					results[0].userLat = lat;
					results[0].userLon = lon;
					results[0].save(function(err) {
    					if (err) { 
    						res.send(err)
    					}
    					res.send(results[0]); 
  					});
				}
			}
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


	app.get('/api/pollsOb', function(req, res) {
		// use mongoose to get all polls in the database
		console.log("GET POLLS");
		getObPolls(res);
	});


	app.get('/api/terms', function(req, res) {
		// use mongoose to get all polls in the database
		console.log("GET terms ");
		var terms = require('./terms.json');
		res.json(terms.text);
	});

	app.get('/api/pollsPub/:id', function(req, res) {
		// use mongoose to get all polls in the database
		console.log("GET PubPOLLS " + req.params.id);
		getPubPolls(req.params.id,res);
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
				pollPublic : req.body.pollPublic,
				pollCreateNew : req.body.pollCreateNew,
				pollStartTime : req.body.pollStartTime,
				pollEndTime : req.body.pollEndTime,
				pollInterval : req.body.pollInterval,
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
	app.get('/api/results/:result_id', function(req, res) {
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

	app.get('/api/results/:pollId/:station', function(req, res) {

		var date = new Date();
		date = new Date(1970,0,1,date.getHours(),date.getMinutes(),date.getSeconds());
		// console.log(date);
		// date = new Date(date.setHours(date.getHours() - 2));
		// use mongoose to get all poll in the database
		console.log("GET resultsUser " + req.params.pollId + ' ' + req.params.station);
		resultDB.find({resultPoll:req.params.pollId,resultStation:req.params.station},function(err, results) {
			console.log('here:' + JSON.stringify(results));


				if (err)
				{
					res.send(err);
					return;
				}

				if(results.length > 0)
				{
					pollDB.find({"_id":req.params.pollId},function(err, polls) {

						if (err)
						{
							res.send(err);
							return;
						}

						var startTime = new Date(polls[0].pollStartTime);
						var interval = polls[0].pollInterval;

						var hoursDif = Math.floor(Math.abs(date.getTime() - startTime.getTime()) / 36e5);
						var intervalCount = Math.floor(hoursDif/interval)
						console.log('hoursDif ' + hoursDif);
						console.log('intervalCount ' + intervalCount);
						console.log('herePoll:' + JSON.stringify(polls));
						for(var i in results)
						{
							if(results[i].resultInterval == intervalCount)
							{
								res.json(results[i].resultAnswers);
								return;
							}
						}
						res.json([]);
					})
				}
				else
				{
					res.json([]);
				}
		});

	});

	app.get('/api/pollResults/:pollId/', function(req, res) {
		// use mongoose to get all poll in the database
		console.log("GET Pollresults " + req.params.pollId );
		resultDB.find({resultPoll:req.params.pollId},function(err, results) {

			console.log('here:' + JSON.stringify(results));
			// if there is an error retrieving, send the error. nothing after res.send(err) will execute
			if (err)
				res.send(err)

			if(results.length > 0)
				res.json(results); // return all results in JSON format
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
		var date = new Date();
		date = new Date(1970,0,1,date.getHours(),date.getMinutes(),date.getSeconds());

		var now = new Date();
		now = new Date(now.getTime() - (now.getTimezoneOffset() * 60000));
		if(typeof req.body.createNew != 'undefined' && req.body.createNew == true)
		{
			var resultData = {
				resultDate : now.toISOString().replace(/T/, ' ').replace(/\..+/, ''),
				resultPoll : req.body.resultPoll,
				resultAnswers : req.body.resultAnswers,
				isDeleted : false,
				verified : false,
			};
			if(typeof req.body.resultStation != 'undefined')
			{
				resultData.resultStation = req.body.resultStation;
			}

			if(typeof req.body.user != 'undefined')
			{
				resultData.resultUser = req.body.user;
			}

			if(typeof req.body.resultLat != 'undefined')
			{
				resultData.resultLat = req.body.resultLat;
			}

			if(typeof req.body.resultLon != 'undefined')
			{
				resultData.resultLon = req.body.resultLon;
			}


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
		}else
		{
			resultDB.find({resultPoll:req.body.resultPoll,resultStation:req.body.resultStation},function(err, results) {

				console.log(results);
				if(err)
					res.send(err);


				pollDB.find({"_id":req.body.resultPoll},function(err, polls) {

					if (err)
					{
						res.send(err);
						return;
					}

					console.log(JSON.stringify(polls));
					var startTime = new Date(polls[0].pollStartTime);
					var interval = polls[0].pollInterval;

					var hoursDif = Math.floor(Math.abs(date.getTime() - startTime.getTime()) / 36e5);
					var intervalCount = Math.floor(hoursDif/interval)

					console.log('intervalCount ' + intervalCount);

					if(results && results.length > 0)
					{
						console.log("Update Exist")
						
						var found = false;
						for(var i in results)
						{
							if(results[i].resultInterval == intervalCount)
							{
								found = true;
								var result = results[i];
								break;
							}
						}

						if(found)
						{
							console.log('FOUND ' + intervalCount);

							result.resultAnswers = req.body.resultAnswers;
							if(typeof req.body.resultLat != 'undefined')
							{
								result.resultLat = req.body.resultLat;
							}

							if(typeof req.body.resultLon != 'undefined')
							{
								result.resultLon = req.body.resultLon;
							}

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
						}else
						{
							console.log('CREATE NEW ' + intervalCount );

							var resultData = {
								resultPoll : req.body.resultPoll,
								resultStation : req.body.resultStation,
								resultAnswers : req.body.resultAnswers,
								resultInterval : intervalCount,
								isDeleted : false,
							};

							if(typeof req.body.resultLat != 'undefined')
							{
								resultData.resultLat = req.body.resultLat;
							}

							if(typeof req.body.resultLon != 'undefined')
							{
								resultData.resultLon = req.body.resultLon;
							}

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
						}
						
					}else
					{
						console.log('CREATE NEW ' + intervalCount);
						var resultData = {
							resultPoll : req.body.resultPoll,
							resultStation : req.body.resultStation,
							resultAnswers : req.body.resultAnswers,
							resultInterval : intervalCount,
							isDeleted : false,
						};

						if(typeof req.body.resultLat != 'undefined')
						{
							resultData.resultLat = req.body.resultLat;
						}

						if(typeof req.body.resultLon != 'undefined')
						{
							resultData.resultLon = req.body.resultLon;
						}

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
					}
					// for(var i in results)
					// {
					// 	if(results[i].resultInterval == intervalCount)
					// 	{
					// 		res.json(results[0].resultAnswers);
					// 		return;
					// 	}
					// }
					// res.json([]);
				})

			});
		}

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

	app.get('/api/incidents/', function(req, res) {
		// use mongoose to get all polls in the database
		console.log("GET incidents");
		getIncidents(res);
	});

	app.get('/api/users/', function(req, res) {
		// use mongoose to get all polls in the database
		console.log("GET USERS");
		getUsers(res);
	});

	app.get('/api/usersPub/', function(req, res) {
		// use mongoose to get all polls in the database
		console.log("GET USERS");
		getPubUsers(res);
	});

	app.get('/api/users/:userName/:password', function(req, res) {
		// use mongoose to get all poll in the database
		console.log("GET USER " + req.params.userName + " " + req.params.password);
		getUser(res,req.params.userName,req.params.password);
	});

	app.get('/api/users/:userName/:password/:lat/:lon', function(req, res) {
		// use mongoose to get all poll in the database
		console.log("GET USER " + req.params.userName + " " + req.params.password);
		getUser(res,req.params.userName,req.params.password,req.params.lat,req.params.lon);
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

	app.post('/api/usersPub', function(req, res) {
		// create a poll, information comes from AJAX request from Angular
		console.log("POST Pub USERS " + JSON.stringify(req.body));

			var userData = {
				userName : req.body.name,
				userSurname : req.body.surname,
				userTelephone : req.body.telephone,
			};

			if(typeof req.body.userLat != 'undefined')
			{
				userData.userLat = req.body.userLat;
				userData.userLon = req.body.userLon;
			}

			userPublicDB.create(userData, function(err, userData) {
				if (err)
				{
					console.log("err " + err);
					res.send(err);
				}else
				{	
					res.send(userData);
				}
				// console.log("poll.create " + JSON.stringify(pollData));
				// get and return all the polls after you create another
				// console.log(userData);

				// getUsers(res);
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

	app.get('/api/gpsStation/:lat/:lon', function(req, res) {
		// use mongoose to get all polls in the database
		console.log("GET GPS Stations " + req.params.lat +" "+ req.params.lon);
		var stations = require('./stations.json');

		if(typeof(Number.prototype.toRad) === "undefined") {
		    Number.prototype.toRad = function () {
		        return this * Math.PI / 180;
		    }
		}

		var getDistance = function(start, end, decimals) {
		    decimals = decimals || 2;
		    var earthRadius = 6371; // km
		    lat1 = parseFloat(start.latitude);
		    lat2 = parseFloat(end.latitude);
		    lon1 = parseFloat(start.longitude);
		    lon2 = parseFloat(end.longitude);

		    var dLat = (lat2 - lat1).toRad();
		    var dLon = (lon2 - lon1).toRad();
		    var lat1 = lat1.toRad();
		    var lat2 = lat2.toRad();

		    var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
		            Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
		    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
		    var d = earthRadius * c;
		    return Math.round(d * Math.pow(10, decimals)) / Math.pow(10, decimals);
		};

		var distances = [];
		for(var i in stations)
		{
			c = getDistance({latitude: stations[i].lat,longitude:stations[i].lon},{latitude: req.params.lat,longitude:req.params.lon});
			// var a = stations[i].lat - req.params.lat
			// var b = stations[i].lon - req.params.lon
			// var c = Math.sqrt( a*a + b*b );
			stations[i].distance = c;
			distances.push({index:i,dist:c});
		}

		function compare(a,b) {
		  if (a.dist < b.dist)
		    return -1;
		  if (a.dist > b.dist)
		    return 1;
		  return 0;
		}
		distances.sort(compare);

		var returnObj = [];
		for(var i = 0 ; i < 20 ; i++)
		{
			returnObj.push(stations[distances[i].index]);
		}
		res.json(returnObj);
		// getStations(res);
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