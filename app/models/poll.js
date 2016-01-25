var mongoose = require('mongoose');

module.exports = mongoose.model('poll', {
	pollName : {type : String, default: ''},
	pollDesc : {type : String, default: ''},
	isDeleted : {type : Boolean, default: false}
});
