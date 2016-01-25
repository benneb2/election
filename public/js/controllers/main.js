var app = angular.module('todoController', ['ngMaterial','ngRoute']);


app.config(function($routeProvider) {
    $routeProvider
        .when('/view1', {
            templateUrl: 'view1.html',
            controller: 'FirstController'
        })
        .when('/view2', {
            templateUrl: 'view2.html',
            controller: 'SecondController'
        })
        .otherwise({
            redirectTo: '/view1'
        });
});

	// inject the Todo service factory into our controller

	app.controller('mainController', ['$scope','$http','elec', function($scope,  $http,elec) {
		$scope.formData = {};
		$scope.loading = true;

		// GET =====================================================================
		// when landing on the page, get all todos and show them
		// use the service to get all the todos

		elec.getPoll().success(function(data) {
				$scope.loading = false;
				$scope.polls = data;
			});

		elec.getUsers().success(function(data) {
				$scope.loading = false;
				$scope.users = data;
			});

		elec.getStations().success(function(data) {
				$scope.loading = false;
				$scope.stations = data;
			});


		
		$scope.delStation = function(id) {
			$scope.loading = true;

			elec.deleteStation(id)
				// if successful creation, call our get function to get all the new todos
				.success(function(data) {
					$scope.loading = false;
					$scope.stations = data;
				});
		};

		$scope.createStation = function()
		{
				$scope.loading = true;
				// call the create function from our service (returns a promise object)
				elec.createStation($scope.formData)

					// if successful creation, call our get function to get all the new todos
					.success(function(data) {
						$scope.loading = false;
						$scope.formData = {}; // clear the form so our user is ready to enter another
						//$scope.polls = data; // assign our new list of todos
						$scope.stations = data;
					});
			
		};


		$scope.getUser = function()
		{
				$scope.loading = true;
				// call the create function from our service (returns a promise object)
				elec.getUser($scope.formData.userName)

					// if successful creation, call our get function to get all the new todos
					.success(function(data) {
						$scope.loading = false;
						$scope.formData = {}; // clear the form so our user is ready to enter another
						// $scope.polls = data; // assign our new list of todos
						$scope.users = data;
					});
			
		};

		$scope.delUser = function(id) {
			$scope.loading = true;

			elec.deleteUser(id)
				// if successful creation, call our get function to get all the new todos
				.success(function(data) {
					$scope.loading = false;
					$scope.users = data;
				});
		};

		$scope.createUser = function()
		{
				$scope.loading = true;
				// call the create function from our service (returns a promise object)
				elec.createUser($scope.formData)

					// if successful creation, call our get function to get all the new todos
					.success(function(data) {
						$scope.loading = false;
						$scope.formData = {}; // clear the form so our user is ready to enter another
						//$scope.polls = data; // assign our new list of todos
						$scope.users = data;
					});
			
		};


		$scope.createResult = function()
		{
				$scope.loading = true;
				// call the create function from our service (returns a promise object)
				elec.createResult($scope.formData)

					// if successful creation, call our get function to get all the new todos
					.success(function(data) {
						$scope.loading = false;
						$scope.formData = {}; // clear the form so our user is ready to enter another
						//$scope.polls = data; // assign our new list of todos
						//$scope.questions = data;
					});
			
		};

		$scope.getUserResults = function()
		{
				$scope.loading = true;
				// call the create function from our service (returns a promise object)
				elec.getResultUser($scope.formData.resultPollGet,$scope.formData.resultUserGet)

					// if successful creation, call our get function to get all the new todos
					.success(function(data) {
						$scope.loading = false;
						$scope.formData = {}; // clear the form so our user is ready to enter another
						// $scope.polls = data; // assign our new list of todos
						$scope.results = data;
					});
			
		};

		$scope.getQuestionResults = function()
		{
				$scope.loading = true;
				// call the create function from our service (returns a promise object)
				elec.getResultQuestion($scope.formData.resultQuestionGet)

					// if successful creation, call our get function to get all the new todos
					.success(function(data) {
						$scope.loading = false;
						$scope.formData = {}; // clear the form so our user is ready to enter another
						// $scope.polls = data; // assign our new list of todos
						$scope.results = data;
					});
			
		};

		$scope.delResult = function(id) {
			$scope.loading = true;

			elec.deleteResult(id)
				// if successful creation, call our get function to get all the new todos
				.success(function(data) {
					$scope.loading = false;
					$scope.results = data;
				});
		};

		$scope.getQuestion = function()
		{
				$scope.loading = true;
				// call the create function from our service (returns a promise object)
				elec.getQuestion($scope.formData.questionPollGet)

					// if successful creation, call our get function to get all the new todos
					.success(function(data) {
						$scope.loading = false;
						$scope.formData = {}; // clear the form so our user is ready to enter another
						// $scope.polls = data; // assign our new list of todos
						$scope.questions = data;
					});
			
		};
		$scope.createQuestion = function()
		{
				$scope.loading = true;
				// call the create function from our service (returns a promise object)
				elec.createQuestion($scope.formData)

					// if successful creation, call our get function to get all the new todos
					.success(function(data) {
						$scope.loading = false;
						$scope.formData = {}; // clear the form so our user is ready to enter another
						//$scope.polls = data; // assign our new list of todos
						$scope.questions = data;
					});
			
		};
		$scope.delQuestion = function(id) {
			$scope.loading = true;

			elec.deleteQuestion(id)
				// if successful creation, call our get function to get all the new todos
				.success(function(data) {
					$scope.loading = false;
					$scope.questions = data;
				});
		};

		$scope.createPoll = function()
		{
			if ($scope.formData.pollName != undefined && $scope.formData.pollName != undefined) {
				$scope.loading = true;
				// call the create function from our service (returns a promise object)
				elec.createPoll($scope.formData)

					// if successful creation, call our get function to get all the new todos
					.success(function(data) {
						$scope.loading = false;
						$scope.formData = {}; // clear the form so our user is ready to enter another
						$scope.polls = data; // assign our new list of todos
					});
			}
		}

		$scope.pollClick = function(id)
		{
			alert(typeof id);
		};

		// DELETE ==================================================================
		// delete a todo after checking it
		$scope.deletePoll = function(id) {
			$scope.loading = true;

			elec.deletePoll(id)
				// if successful creation, call our get function to get all the new todos
				.success(function(data) {
					$scope.loading = false;
					$scope.polls = data; // assign our new list of todos
				});
		};
	}]);

app.controller('pollController', ['$scope','$http','elec', function($scope, $http,elec) {
		$scope.formData = {};
		$scope.loading = true;


		// GET =====================================================================
		// when landing on the page, get all todos and show them
		// use the service to get all the todos

		elec.getPoll().success(function(data) {
				$scope.loading = false;
				$scope.polls = data;
			});

		$scope.createPoll = function()
		{
			if ($scope.formData.pollName != undefined && $scope.formData.pollName != undefined) {
				$scope.loading = true;
				// call the create function from our service (returns a promise object)
				elec.createPoll($scope.formData)

					// if successful creation, call our get function to get all the new todos
					.success(function(data) {
						$scope.loading = false;
						$scope.formData = {}; // clear the form so our user is ready to enter another
						$scope.polls = data; // assign our new list of todos
					});
			}
		}
		// DELETE ==================================================================
		// delete a todo after checking it
		$scope.deletePoll = function(id) {
			$scope.loading = true;

			elec.deletePoll(id)
				// if successful creation, call our get function to get all the new todos
				.success(function(data) {
					$scope.loading = false;
					$scope.polls = data; // assign our new list of todos
				});
		};
	}])