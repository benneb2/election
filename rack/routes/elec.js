var url = require('url');
var express = require('express');
var router = express.Router();


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

//GET POLLS
router.get('/getpolls', function(req, res) {
    var db = req.db;
    var collection = db.get('poll');
    collection.find({},{},function(e,docs){
        res.json(docs);
    });
});


//GET POLL
router.get('/getpoll', function(req, res) {
   console.log(req.query);
    var db = req.db;
    var collection = db.get('poll');
    collection.find({_id:req.query.poll},{},function(e,docs){
        res.json(docs);
    });
});

//GET QUESTION
router.get('/getquestion', function(req, res) {
//req.query.id 
   console.log(req.query);
    var db = req.db;
    var collection = db.get('question');
    collection.find({poll:req.query.poll},{},function(e,docs){
        res.json(docs);
    });
});

//GET RESULT
router.get('/getresult', function(req, res) {
//req.query.id
   console.log(req.query);
    var db = req.db;
    var collection = db.get('result');
    collection.find({question:req.query.question},{},function(e,docs){
        res.json(docs);
    });
});



//ADD POLL
/* GET New Poll page. */
router.get('/newPoll', function(req, res) {
    res.render('newPoll', { title: 'Add New Poll' });
});

/* POST to Add Poll Service */
router.post('/addPoll', function(req, res) {

    // Set our internal DB variable
    var db = req.db;

    // Get our form values. These rely on the "name" attributes
    var pollName = req.body.pollName;
    var pollDesc = req.body.pollDesc;

    // Set our collection
    var collection = db.get('poll');

    // Submit to the DB
    collection.insert({
        "name" : pollName,
        "description" : pollDesc,
  	"private" : false,
	"show" : true,
	"isDeleted" : false
    }, function (err, doc) {
        if (err) {
            // If it failed, return error
            res.send("There was a problem adding the information to the database.");
        }
        else {
            // And forward to success page
            res.redirect("getpolls");
        }
    });
});



/* POST to Add Question Service */
router.post('/addquestion', function(req, res) {

    // Set our internal DB variable
    var db = req.db;

    // Get our form values. These rely on the "name" attributes
    var qNum = req.body.qNum;
    var qQuestion = req.body.qQuestion;
    var qPoll = req.body.qPoll;

    // Set our collection
    var collection = db.get('question');

    // Submit to the DB
    collection.insert({
	"poll" : qPoll,
        "nr" : qNum,
        "Question" : qQuestion,
    }, function (err, doc) {
        if (err) {
            // If it failed, return error
            res.send("There was a problem adding the information to the database.");
        }
        else {
            // And forward to success page
            res.redirect("getpolls");
        }
    });
});


//ADD QUESTION
/* GET New Question page. */
router.get('/newQuestion', function(req, res) {
    var db = req.db;
    var collection = db.get('poll');
    collection.find({_id:req.query.poll},{},function(e,docs){
        console.log(docs);
	if(docs.length > 0)
        {
	    res.render('newQuestion' , { title: 'Add New Question ', poll: req.query.poll });

	}else
	{
		console.log("Not Found");
       	        res.render('getpolls',{title : 'POES'});

	}
    });

});

//ADD RSULT
/* GET New Result page. */
router.get('/newResult', function(req, res) {
    var db = req.db;
    var collection = db.get('question');

	console.log(req.query.question);
    collection.find({_id:req.query.question},{},function(e,docs){
        console.log(docs);
        if(docs.length > 0)
        {
            res.render('newResult' , { title: 'Add New Result ', question: req.query.question });

        }else
        {
                console.log("Not Found");
                res.render('getpolls',{title : 'POES'});

        }
    });

});




/* POST to Add Result Service */
router.post('/addResult', function(req, res) {

    // Set our internal DB variable
    var db = req.db;

    // Get our form values. These rely on the "name" attributes
    var rQuestion = req.body.rQuestion;
    var rResult = req.body.rResult;

    // Set our collection
    var collection = db.get('result');

    // Submit to the DB
    collection.insert({
        "question" : rQuestion,
        "result" : rResult,
    }, function (err, doc) {
        if (err) {
            // If it failed, return error
            res.send("There was a problem adding the information to the database.");
        }
        else {
            // And forward to success page
            res.redirect("getpolls");
        }
    });
});



module.exports = router;

