var mongoose = require('mongoose');

module.exports = mongoose.model('question', {
	questionPoll : {type : String , default: ''},
	questionNumber : {type : String , default: ''},
	questionQuestion : {type : String, default: ''},
	questionType : {type : String, default: ''},
	questionAnswers : {type : Array ,default: []},
	isDeleted : {type : Boolean, default: false}
});
