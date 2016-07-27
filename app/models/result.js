var mongoose = require('mongoose');

module.exports = mongoose.model('result', {
	resultPoll : {type : String , default: ''},
	resultStation : {type : String , default: ''},
	resultAnswers : {type : Array ,default: []},
	resultUser : {type : String , default: ''},
	resultInterval : Number,
	resultLat : {type : String, default: ''},
	resultLon : {type : String, default: ''},
	isDeleted : {type : Boolean, default: false}
});
