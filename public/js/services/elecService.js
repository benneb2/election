angular.module('elecService', [])

	// super simple service
	// each function returns a promise object 
	.factory('elec', ['$http',function($http) {
		return {


			//POLLS
			getPoll : function() {
				return $http.get('/api/polls');
			},
			createPoll : function(formData) {
				return $http.post('/api/polls', formData);
			},
			deletePoll : function(id) {
				return $http.delete('/api/polls/' + id);
			},

			//QUESTIONS
			getQuestion : function(pollId) {
				return $http.get('/api/questions/' + pollId);
			},
			createQuestion: function(formData) {
				return $http.post('/api/questions', formData);
			},
			deleteQuestion : function(id) {
				return $http.delete('/api/questions/' + id);
			},


			//RESULTS
			exportPoll : function(pollId) {
				return $http.get('/api/export/' + pollId);
			},
			getResults : function(pollId,station) {
				return $http.get('/api/results/' + pollId + '/' + station);
			},
			getPollResult : function(pollId) {
				return $http.get('/api/pollResults2/' + pollId );
			},
			getResultUser : function(pollId,userId) {
				return $http.get('/api/resultsUser/' + pollId + '/' + userId);
			},
			getResultQuestion : function(questionId) {
				return $http.get('/api/resultsQuestion/' + questionId);
			},
			createResult: function(formData) {
				return $http.post('/api/results', formData);
			},
			deleteResult : function(id) {
				return $http.delete('/api/results/' + id);
			},


			updateIncident: function(id) {
				return $http.put('/api/incidents/' + id);
			},
			getIncidents : function() {
				return $http.get('/api/incidents' );
			},
			//USERS
			getManagerUsers : function(manager) {
				return $http.get('/api/managerUser/' +  manager);
			},
			getUsers : function() {
				return $http.get('/api/users' );
			},
			getUsersPub : function() {
				return $http.get('/api/usersPub' );
			},
			getUser : function(userName,password) {
				return $http.get('/api/users/' + userName + '/' + password);
			},
			createUser: function(formData) {
				return $http.post('/api/users', formData);
			},
			deleteUser : function(id) {
				return $http.delete('/api/users/' + id);
			},
			updateUser: function(formData) {
				return $http.put('/api/user', formData);
			},
			createPubUser: function(formdata)
			{	
				return $http.post('/api/usersPub', formData);
			}
			,
			//STATIONS
			getStations : function() {
				return $http.get('/api/station' );
			},
			createStation: function(formData) {
				return $http.post('/api/station', formData);
			},
			deleteStation : function(id) {
				return $http.delete('/api/station/' + id);
			},
		}
	}]);