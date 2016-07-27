var mongoose = require('mongoose');

module.exports = mongoose.model('poll', {
	pollName : {type : String, default: ''},
	pollDesc : {type : String, default: ''},
	pollStartTime : Date,
	pollEndTime : Date,
	pollInterval : Number,
	isDeleted : {type : Boolean, default: false},
	pollPublic : {type : Boolean, default: false},
	pollCreateNew : {type : Boolean, default: false},
});
