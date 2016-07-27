var mongoose = require('mongoose');

module.exports = mongoose.model('users', {
	userName : {type : String, default: ''},
	userUserName : {type : String, default: ''},
	userSurname : {type : String, default: ''},
	userPassword : {type : String, default: ''},
	userLon : {type : String, default: ''},
	userLat : {type : String, default: ''},
	userPollingStation : {type : String, default: ''},
	userType : {type : String, default: ''},
	userEmail : {type : String, default: ''},
	userRole : {type : String, default: 'user'},
	userManager : {type : String, default: ''},
	isDeleted : {type : Boolean, default: false}
});
