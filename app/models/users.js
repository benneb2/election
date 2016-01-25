var mongoose = require('mongoose');

module.exports = mongoose.model('users', {
	userName : {type : String, default: ''},
	userSurname : {type : String, default: ''},
	userPollingStation : {type : String, default: ''},
	userType : {type : String, default: ''},
	isDeleted : {type : Boolean, default: false}
});
