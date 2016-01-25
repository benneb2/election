var mongoose = require('mongoose');

module.exports = mongoose.model('result', {
	resultPoll : {type : String , default: ''},
	resultQuestion : {type : String , default: ''},
	resultAnswer : {type : String , default: ''},
	resultUser : {type : String , default: ''},
	isDeleted : {type : Boolean, default: false}
});
