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

            .when('/signup', {
                templateUrl : 'pages/signup.html',
                controller  : 'signupController'
            })

            .when('/admin', {
                templateUrl : 'pages/admin.html',
                controller  : 'adminController'
            })

            .when('/manager', {
                templateUrl : 'pages/manager.html',
                controller  : 'managerController'
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


    scotchApp.controller('adminController', ['$rootScope', '$scope', 'myservice','elec','$location','$mdDialog',function($rootScope, $scope, myservice,elec,$location,$mdDialog) {
        // create a message to display in our view
        $scope.page = "";
        $scope.roles = ['user','manager','admin'];
        $scope.types = ['multichoice','number'];
        //Get Date Beforehand
        $scope.refreshUsers = function()
        {
            elec.getUsers().success(function(data) {
                $scope.users = data;
                $scope.managers = [];
                debugger;
                for(var i in $scope.users)
                {
                    if($scope.users[i].userRole == 'manager')
                        $scope.managers.push($scope.users[i]);
                }
            });
        }

        $scope.refreshStations = function()
        {
            elec.getStations().success(function(data) {
                    $scope.stations = data;
            })
        }

        $scope.refreshPolls = function()
        {
            elec.getPoll().success(function(data) {
                $scope.loading = false;
                $scope.polls = data;
            });
        }

        $scope.refreshUsers();
        $scope.refreshStations();
        $scope.refreshPolls();

        $scope.page = 'users';//Default Page

        $scope.showPollingStations = function()
        {
            $scope.page = 'stations';   
            $scope.refreshStations();
        }

        $scope.openStation = function(index)
        {
            $scope.page = 'station'; 
            $scope.isNew = false; 
            $scope.station = $scope.stations[index];
        }

        $scope.newStation = function()
        {
            elec.createStation($scope.station).success(function(data) {

                if(data == 'station exist')
                {
                    $mdDialog.show(
                        $mdDialog.alert()
                            .parent(angular.element(document.querySelector('#popupContainer')))
                            .clickOutsideToClose(true)
                            .title('Station create failed.')
                            .content('Station alredy exist.')
                            .ariaLabel('')
                            .ok('Ok')
                        );
                }else if(data == 'success')
                {
                    $scope.showPollingStations();
                }else
                {
                    alert(JSON.stringify(data));
                }
            });

        }
        
        $scope.delStation = function()
        {
            elec.deleteStation($scope.station._id).success(function(data) {
                $scope.showPollingStations();
            });
        }
        
        $scope.addStation = function()
        {
            $scope.page = 'station';  
            $scope.isNew = true;
            $scope.station = 
            {
                stationName:''
            }
        }

        $scope.showUsers = function()
        {
            $scope.page = 'users'; 
        }

        $scope.openUser = function(index)
        {
            $scope.newUser = false;  
            elec.getStations().success(function(data) {
                $scope.stations = data;
                $scope.page = 'user';  
                $scope.user = $scope.users[index];
            })

        }

        $scope.updateUser = function()
        {
            if($scope.user.userRole != 'user')
                $scope.user.userManager = '';

            elec.updateUser($scope.user).success(function(data) {
                if(data == 'success')
                {
                    $mdDialog.show(
                        $mdDialog.alert()
                            .parent(angular.element(document.querySelector('#popupContainer')))
                            .clickOutsideToClose(true)
                            .title('User Update')
                            .content('User update successfully')
                            .ariaLabel('')
                            .ok('Ok')
                        );
                    $scope.page = 'users';  
                }else
                {
                    $mdDialog.show(
                        $mdDialog.alert()
                            .parent(angular.element(document.querySelector('#popupContainer')))
                            .clickOutsideToClose(true)
                            .title('User Update failed.')
                            .content(data.err)
                            .ariaLabel('')
                            .ok('Ok')
                        );
                }
            });
        }

        $scope.addUser = function()
        {
            $scope.page = 'user';  
            $scope.newUser = true;
            $scope.user = {};         
        }


        $scope.signup = function()
        {
            elec.createUser($scope.user).success(function(data) {
                if(data == 'user exist')
                {
                    $mdDialog.show(
                        $mdDialog.alert()
                            .parent(angular.element(document.querySelector('#popupContainer')))
                            .clickOutsideToClose(true)
                            .title('Sign up failed.')
                            .content('User alredy exist.')
                            .ariaLabel('')
                            .ok('Ok')
                        );
                }else if(data == 'success')
                {
                    $scope.page = 'users';
                    $scope.refreshUsers();
                }else
                {
                    alert(JSON.stringify(data));
                }
            });
        }

        $scope.showPolls = function()
        {
            $scope.page = 'polls';
            $scope.refreshPolls();
        }

        $scope.openPoll = function(index)
        {
            $scope.page = 'poll'; 
            $scope.isNew = false; 
            $scope.poll = $scope.polls[index];
            $scope.poll._id = $scope.poll._id + '';
        }

        $scope.newPoll = function()
        {
            elec.createPoll($scope.poll).success(function(data) {

                if(data == 'poll exist')
                {
                    $mdDialog.show(
                        $mdDialog.alert()
                            .parent(angular.element(document.querySelector('#popupContainer')))
                            .clickOutsideToClose(true)
                            .title('Poll create failed.')
                            .content('Poll alredy exist.')
                            .ariaLabel('')
                            .ok('Ok')
                        );
                }else if(data == 'success')
                {
                    $scope.showPolls();
                }else
                {
                    alert(JSON.stringify(data));
                }
            });


        }

        $scope.addPoll = function()
        {
            $scope.page = 'poll';  
            $scope.isNew = true;
            $scope.poll = {};  

        }

        $scope.delPoll = function()
        {
           elec.deletePoll($scope.poll._id).success(function(data) {
                $scope.showPolls();
            });       
        }

        $scope.openQuestions = function()
        {   
            $scope.questions = [];
            $scope.page = 'questions';
            elec.getQuestion($scope.poll._id).success(function(data) {
                $scope.questions = data;
            }); 
        }

        $scope.addQuestion = function()
        {
            $scope.page = 'question';
            $scope.isNew = true;
            $scope.question = {};
        }

        $scope.newQuestion = function()
        {

            $scope.question.questionPoll = $scope.poll._id ;
            elec.createQuestion($scope.question).success(function(data) {

                if(data == 'question exist')
                {
                    $mdDialog.show(
                        $mdDialog.alert()
                            .parent(angular.element(document.querySelector('#popupContainer')))
                            .clickOutsideToClose(true)
                            .title('Question create failed.')
                            .content('Question Number alredy exist.')
                            .ariaLabel('')
                            .ok('Ok')
                        );
                }else if(data == 'success')
                {
                    $scope.openQuestions();
                }else
                {
                    alert(JSON.stringify(data));
                }
            });
        }

    }]);

 scotchApp.controller('managerController', ['$rootScope', '$scope', 'myservice','elec','$location',function($rootScope, $scope, myservice,elec,$location) {
        // create a message to display in our view
        // $scope.message = myservice.user;

        // elec.getPoll().success(function(data) {
        //     $scope.loading = false;
        //     $scope.polls = data;

        // });

        // $scope.pollClick = function(_id)
        // {
        //     myservice.id = _id;
        //     $location.path('questions'); // path not hash
        // }
        alert('Manager Controller');

    }]);

    scotchApp.controller('signupController', ['$rootScope', '$scope', 'myservice','elec','$location','$mdDialog',function($rootScope, $scope, myservice,elec,$location,$mdDialog) {
        // create a message to display in our view
        $scope.username = '';
        $scope.password = '';
        $scope.confirmPassword = '';
        $scope.email = '';
        
        $scope.signup = function()
        {
            var newUser = {};
            newUser.userUserName = $scope.username;
            newUser.userName = $scope.name;
            newUser.userSurname = $scope.surname;;
            newUser.userPassword = $scope.password;
            newUser.userEmail = $scope.email;
            newUser.userPollingStation = "";
            newUser.userType = 'yes';

            elec.createUser(newUser).success(function(data) {
                if(data == 'user exist')
                {
                    $mdDialog.show(
                        $mdDialog.alert()
                            .parent(angular.element(document.querySelector('#popupContainer')))
                            .clickOutsideToClose(true)
                            .title('Sign up failed.')
                            .content('User alredy exist.')
                            .ariaLabel('')
                            .ok('Ok')
                        );
                }else if(data == 'success')
                {
                    $location.path(''); 
                }else
                {
                    alert(JSON.stringify(data));
                }
            });
        }
    }]);

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

                if(data == 'fail')
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
                }else
                {
                    myservice.username = $scope.username;
                    myservice.password = $scope.password;

                    myservice.userRole = data.userRole;

                    myservice.loggedIn = true;
                    $scope.$parent.loggedIn = true;
                    
                    if(myservice.userRole == 'admin')
                        $scope.$parent.isAdmin = true;
                    else
                        $scope.$parent.isAdmin = false;

                    if(myservice.userRole == 'manager')
                        $location.path('manager');  
                    else if(myservice.userRole == 'admin')
                        $location.path('admin');  
                    else if(myservice.userRole == 'user')
                        $location.path('polls');  
                    else
                        alert('NO USER ROLE???? Contact Administrator');

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
            $scope.loggedIn = false;
            $scope.isAdmin = false;
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

