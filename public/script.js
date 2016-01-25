// script.js

    // create the module and name it scotchApp
        // also include ngRoute for all our routing needs
    var scotchApp = angular.module('scotchApp', ['ngRoute','elecService','ngMaterial', 'ngAnimate', 'ngAria']);

    // configure our routes
    scotchApp.config(function($routeProvider) {
        $routeProvider

            // route for the home page
            .when('/', {
                templateUrl : 'pages/login.html',
                controller  : 'loginController'
            })

            .when('/questions', {
                templateUrl : 'pages/questions.html',
                controller  : 'questionsController'
            })

            .when('/polls', {
                templateUrl : 'pages/polls.html',
                controller  : 'pollsController'
            })

            // route for the about page
            .when('/about', {
                templateUrl : 'pages/about.html',
                controller  : 'aboutController'
            })

            // route for the contact page
            .when('/contact', {
                templateUrl : 'pages/contact.html',
                controller  : 'contactController'
            });
    });

    // create the controller and inject Angular's $scope

    scotchApp.controller('pollsController', ['$rootScope', '$scope', 'myservice','elec','$location',function($rootScope, $scope, myservice,elec,$location) {
        // create a message to display in our view
        $scope.message = myservice.user;

        elec.getPoll().success(function(data) {
			$scope.loading = false;
			$scope.polls = data;

		});

		$scope.pollClick = function(_id)
		{
			myservice.id = _id;
			$location.path('questions'); // path not hash
		}


    }]);

        scotchApp.controller('questionsController', ['$rootScope', '$scope', 'myservice','elec','$location',function($rootScope, $scope, myservice,elec,$location) {
        // create a message to display in our view
        elec.getQuestion(myservice.id)
			.success(function(data) {
				$scope.loading = false;
				$scope.formData = {}; // clear the form so our user is ready to enter another
				// $scope.polls = data; // assign our new list of todos
				$scope.questions = data;
			});
    }]);


    scotchApp.controller('loginController', ['$rootScope', '$scope', 'myservice','elec','$location','$mdDialog',function($rootScope, $scope, myservice,elec,$location,$mdDialog) {
        
        $scope.username = myservice.username;
        $scope.password = myservice.password;

        $scope.login = function()
        {
            elec.getUser($scope.username,$scope.password).success(function(data) 
            {
                if(data.length > 0)
                {
                    myservice.username = $scope.username;
                    myservice.password = $scope.password;
                    myservice.loggedIn = true;
                    $scope.$parent.loggedIn = true;
                    $location.path('polls'); 

                }else 
                {
                    $mdDialog.show(
                        $mdDialog.alert()
                            .parent(angular.element(document.querySelector('#popupContainer')))
                            .clickOutsideToClose(true)
                            .title('Login failed.')
                            .content('The username and password combination does not match.')
                            .ariaLabel('')
                            .ok('Ok')
                        );
                } 
            });  
        }
    }]);


    scotchApp.controller('mainController', ['$rootScope', '$scope', 'myservice','elec','$location',function($rootScope, $scope, myservice,elec,$location) {
        // create a message to display in our view
        $scope.loggedIn = false;//myservice.loggedIn;
        $scope.logout = function()
        {
            myservice.loggedIn = false;
            myservice.username = "";
            myservice.password = "";
            $location.path(''); 
        }

    }]);

    scotchApp.controller('aboutController', ['$rootScope', '$scope', 'myservice',function($rootScope, $scope, myservice) {
        // create a message to display in our view
        $scope.message = myservice.user;
        $scope.id = myservice.id;
    }]);

    scotchApp.controller('contactController', ['$rootScope', '$scope', 'myservice',function($rootScope, $scope, myservice) {

    }]);

    scotchApp
    .service('myservice', function() {
        this.loggedIn = false;
        this.username = "";
        this.password = "";
    });

