var mongoose = require('mongoose');

module.exports = mongoose.model('result', {
	resultPoll : {type : String , default: ''},
	resultStation : {type : String , default: ''},
	resultAnswers : {type : Array ,default: []},
	isDeleted : {type : Boolean, default: false}
});
