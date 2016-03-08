angular.module('elecService', [])

	// super simple service
	// each function returns a promise object 
	.factory('elec', ['$http',function($http) {
		return {
			//POLLS
			getPoll : function() {
				return $http.get('http://localhost:8080/api/polls');
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

			//USERS
			getUsers : function() {
				return $http.get('/api/users' );
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