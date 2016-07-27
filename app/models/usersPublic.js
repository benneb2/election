var mongoose = require('mongoose');

module.exports = mongoose.model('usersPublic', {
	userName : {type : String, default: ''},
	userSurname : {type : String, default: ''},
	userTelephone : {type : String, default: ''},
	userLat : {type : String, default: ''},
	userLon : {type : String, default: ''},
});
