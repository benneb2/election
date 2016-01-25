var mongoose = require('mongoose');

module.exports = mongoose.model('pollingStation', {
	stationName : {type : String, default: ''},
	stationProvince : {type : String, default: ''},
	stationMunicipality : {type : String, default: ''},
	isDeleted : {type : Boolean, default: false}
});
