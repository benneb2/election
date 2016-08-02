// script.js

    // create the module and name it scotchApp
        // also include ngRoute for all our routing needs
    var scotchApp = angular.module('scotchApp', ['ngRoute','elecService','ngMaterial', 'ngAnimate', 'ngAria','uiGmapgoogle-maps']);

    // configure our routes
    scotchApp.config(function (uiGmapGoogleMapApiProvider) {
        uiGmapGoogleMapApiProvider.configure({
             key: 'AIzaSyD7_YvHBuTpxr1acf3kiE8p9VIySUCLvHE',
             v: '3.17',
             libraries: 'weather,geometry,visualization'
        });
    });

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

            .when('/dashboard', {
                templateUrl : 'pages/dashboard.html',
                controller  : 'dashboardController'
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

             .when('/results', {
                templateUrl : 'pages/results.html',
                controller  : 'resultsController'
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


    scotchApp.controller('dashboardController', ['$rootScope', '$scope', 'myservice','elec','$location','$mdDialog','uiGmapIsReady','uiGmapGoogleMapApi','$mdDialog',function($rootScope, $scope, myservice,elec,$location,$mdDialog,uiGmapIsReady,uiGmapGoogleMapApi,$mdDialog) {
        // create a message to display in our view



        google.charts.load('current', {'packages':['corechart']});
        $scope.page = "users";

        $scope.toggleIncident = true;
        $scope.toggleObserver = true;
        $scope.togglePublic = true;

        $scope.numIncident = 0;
        $scope.numObserver = 0;
        $scope.numPublic = 0;

        $scope.updateIncident = function(id)
        {
            elec.updateIncident(id).success(function(data) {
                // $scope.users = data;
                // $scope.managers = [];
                // for(var i in $scope.users)
                // {
                //     if($scope.users[i].userRole == 'manager')
                //         $scope.managers.push($scope.users[i]);
                // }
            });
        }  

        $scope.refreshUsers = function()
        {
            elec.getUsers().success(function(data) {
                $scope.users = data;
                $scope.managers = [];
                for(var i in $scope.users)
                {
                    if($scope.users[i].userRole == 'manager')
                        $scope.managers.push($scope.users[i]);
                }
            });
        }

        $scope.refreshIncident = function(cb)
        {
            elec.getIncidents().success(function(data) {
                
                $scope.incidents = data;
                // $scope.incidents = data;
                if(typeof cb != 'undefined')
                {
                    cb();
                }
            });
        }

        $scope.refreshUsersPub = function()
        {
            elec.getUsersPub().success(function(data) {
                $scope.loading = false;
                $scope.usersPub = data;
            });
        }


        $scope.refreshPolls = function()
        {
            elec.getPoll().success(function(data) {
                $scope.loading = false;
                $scope.polls = data;
            });
        }

        $scope.refreshUsers();
        $scope.refreshPolls();
        $scope.refreshUsersPub();

        // $scope.page = 'users';//Default Page

        
        $scope.showMap = function()
        {
            $scope.page = 'map'; 


            $scope.refreshIncident(function()
            {
                 var createMarker3 = function (info){
            
                    // var newIcon = MapIconMaker.createMarkerIcon({width: 20, height: 34, primaryColor: "#0000FF", cornercolor:"#0000FF"});

                    var marker = new google.maps.Marker({
                        map: $scope.map,
                        position: new google.maps.LatLng(info.lat, info.lon),
                        title:  info.dateTime + ':' + info.name,
                        icon : pinSymbol('red')
                    });
                    marker.content = '<div class="infoWindowContent">' + info.tel + '</div>';
                    
                    google.maps.event.addListener(marker, 'click', function(){
                        infoWindow.setContent('<h2>' + marker.title + '</h2>' + marker.content);
                        infoWindow.open($scope.map, marker);
                    });
                    
                    $scope.markers.push(marker);
                    
                }  

                $scope.numIncident = $scope.incidents.length;
                if($scope.toggleIncident)
                {
                    for (i = 0; i < $scope.incidents.length; i++){
                        createMarker3($scope.incidents[i]);
                    }
                }

            });
            var mapOptions = {
                zoom: 6,
                center: new google.maps.LatLng(-28.787419, 24.494382)
            }

            $scope.map = new google.maps.Map(document.getElementById('map'), mapOptions);

            $scope.markers = [];
            
            var infoWindow = new google.maps.InfoWindow();
            
            var pinSymbol = function(color) {
                return {
                    path: 'M 0,0 C -2,-20 -10,-22 -10,-30 A 10,10 0 1,1 10,-30 C 10,-22 2,-20 0,0 z',
                    fillColor: color,
                    fillOpacity: 1,
                    strokeColor: '#000',
                    strokeWeight: 2,
                    scale: 0.75,

                };
            }

            var createMarker = function (info){
                
                // var newIcon = MapIconMaker.createMarkerIcon({width: 20, height: 34, primaryColor: "#0000FF", cornercolor:"#0000FF"});

                var marker = new google.maps.Marker({
                    map: $scope.map,
                    position: new google.maps.LatLng(info.userLat, info.userLon),
                    title: info.userName + ' ' + info.userSurname,
                    icon : pinSymbol('orange')
                });
                marker.content = '<div class="infoWindowContent">' + info.userTelephone + '</div>';
                
                google.maps.event.addListener(marker, 'click', function(){
                    infoWindow.setContent('<h2>' + marker.title + '</h2>' + marker.content);
                    infoWindow.open($scope.map, marker);
                });
                
                $scope.markers.push(marker);
                
            }  
            
           

            var createMarker2 = function (info){
                
                // var newIcon = MapIconMaker.createMarkerIcon({width: 20, height: 34, primaryColor: "#0000FF", cornercolor:"#0000FF"});

                var marker = new google.maps.Marker({
                    map: $scope.map,
                    position: new google.maps.LatLng(info.userLat, info.userLon),
                    title: info.userName + ' ' + info.userSurname,
                    icon : pinSymbol('green')
                });
                // marker.content = '<div class="infoWindowContent">' + info.userTelephone + '</div>';
                
                google.maps.event.addListener(marker, 'click', function(){
                    infoWindow.setContent('<h2>' + marker.title + '</h2>' + marker.content);
                    infoWindow.open($scope.map, marker);
                });
                
                $scope.markers.push(marker);
                
            }  

            $scope.numObserver = 0;
            for (i = 0; i < $scope.users.length; i++){
                if($scope.users[i].userLat != "")
                    $scope.numObserver ++;
            }
            
            $scope.numPublic = $scope.usersPub.length;
            if($scope.toggleObserver)
            {
                for (i = 0; i < $scope.users.length; i++){
                    createMarker2($scope.users[i]);
                }
            }

            if($scope.togglePublic)
            {
                for (i = 0; i < $scope.usersPub.length; i++){
                    createMarker($scope.usersPub[i]);
                }
            }

                $scope.openInfoWindow = function(e, selectedMarker){
                    e.preventDefault();
                    google.maps.event.trigger(selectedMarker, 'click');
                }

              // map = new google.maps.Map(document.getElementById('map'), {
              //     center: {lat: -25.788673, lng: 28.170473},
              //     zoom: 8
              //   });
        }

        $scope.showPubUsers = function()
        {
            $scope.page = 'usersPub'; 
        }
        

        $scope.showIncident = function()
        {
            $scope.page = 'incident';
            $scope.refreshIncident();
            $scope.loop();
        }

        $scope.loop = function()
        {
          setTimeout(function(){
            $scope.refreshIncident(function()
            {
              if($scope.page == 'incident')
              {
                $scope.loop();
              }
            });
          }, 1000);   
        }
        

        

        $scope.showResults = function()
        {
            $scope.page = 'results';
        }

        $scope.exportPoll = function()
        {
            elec.exportPoll($scope.poll._id).success(function(data) {
                var anchor = angular.element('<a/>');
                 anchor.attr({
                     href: 'data:attachment/csv;charset=utf-8,' + encodeURI(data),
                     target: '_blank',
                     download: $scope.poll.pollName +'.csv'
                 })[0].click();
             });
        }

        $scope.openResult = function(index)
        {
            $scope.page = 'result'; 
            $scope.results = [];
            $scope.poll = $scope.polls[index];
            $scope.poll._id = $scope.poll._id + '';
            $scope.loading = true;
            elec.getQuestion($scope.poll._id).success(function(questions) {

                elec.getPollResult($scope.poll._id)
                    .success(function(data) {
                        $scope.loading = false;
                        $scope.results = data;
                        
                          setTimeout(function(){
                              var count = 0;
                                for(var i in $scope.results.results)
                                {
                                    debugger;
                                    var chartObj = [];
                                    chartObj.push(['Value', 'Count']);
                                    for(var j in  $scope.results.results[i])
                                    {
                                        chartObj.push([j + '-' + $scope.results.results[i][j],$scope.results.results[i][j]]);
                                    }


                                     var data = google.visualization.arrayToDataTable(chartObj);
                                     var title = i;

                                     var options = {};

                                    options.title = $scope.results.questions[i];

                                    if($scope.results.type[i] == 'radio button' || $scope.results.type[i] == 'multichoice')
                                        var chart = new google.visualization.PieChart(document.getElementById('chart_'+count));
                                    if($scope.results.type[i] == 'number' || $scope.results.type[i] == 'text')
                                        var chart = new google.visualization.ColumnChart(document.getElementById('chart_'+count));
                                    
                                    chart.draw(data, options);                                 
                                    count++;
                                }

                        }, 500);


                    });

            }); 

        }

        

    }]);
scotchApp.controller('adminController', ['$rootScope', '$scope', 'myservice','elec','$location','$mdDialog','uiGmapIsReady','uiGmapGoogleMapApi',function($rootScope, $scope, myservice,elec,$location,$mdDialog,uiGmapIsReady,uiGmapGoogleMapApi) {
        // create a message to display in our view



        google.charts.load('current', {'packages':['corechart']});
        $scope.page = "users";
        $scope.roles = ['user','manager','admin','dashboard'];
        $scope.types = ['radio button','multichoice','number','text','image'];
        //Get Date Beforehand

        $scope.refreshUsers = function()
        {
            elec.getUsers().success(function(data) {
                $scope.users = data;
                $scope.managers = [];
                for(var i in $scope.users)
                {
                    if($scope.users[i].userRole == 'manager')
                        $scope.managers.push($scope.users[i]);
                }
            });
        }

        $scope.refreshIncident = function(cb)
        {
            elec.getIncidents().success(function(data) {
                
                $scope.incidents = data;
                // $scope.incidents = data;
                if(typeof cb != 'undefined')
                {
                    cb();
                }
            });
        }

        $scope.refreshUsersPub = function()
        {
            elec.getUsersPub().success(function(data) {
                $scope.loading = false;
                $scope.usersPub = data;
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
        $scope.refreshUsersPub();

        // $scope.page = 'users';//Default Page

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

        $scope.toggleIncident = true;
        $scope.toggleObserver = true;
        $scope.togglePublic = true;

        $scope.numIncident = 0;
        $scope.numObserver = 0;
        $scope.numPublic = 0;

        $scope.showMap = function()
        {
            $scope.page = 'map'; 


            $scope.refreshIncident(function()
            {
                 var createMarker3 = function (info){
            
                    // var newIcon = MapIconMaker.createMarkerIcon({width: 20, height: 34, primaryColor: "#0000FF", cornercolor:"#0000FF"});

                    var marker = new google.maps.Marker({
                        map: $scope.map,
                        position: new google.maps.LatLng(info.lat, info.lon),
                        title:  info.dateTime + ':' + info.name,
                        icon : pinSymbol('red')
                    });
                    marker.content = '<div class="infoWindowContent">' + info.tel + '</div>';
                    
                    google.maps.event.addListener(marker, 'click', function(){
                        infoWindow.setContent('<h2>' + marker.title + '</h2>' + marker.content);
                        infoWindow.open($scope.map, marker);
                    });
                    
                    $scope.markers.push(marker);
                    
                }  

                $scope.numIncident = $scope.incidents.length;
                if($scope.toggleIncident)
                {
                    for (i = 0; i < $scope.incidents.length; i++){
                        createMarker3($scope.incidents[i]);
                    }
                }


            });
            var mapOptions = {
                zoom: 6,
                center: new google.maps.LatLng(-28.787419, 24.494382)
            }

            $scope.map = new google.maps.Map(document.getElementById('map'), mapOptions);

            $scope.markers = [];
            
            var infoWindow = new google.maps.InfoWindow();
            
            var pinSymbol = function(color) {
                return {
                    path: 'M 0,0 C -2,-20 -10,-22 -10,-30 A 10,10 0 1,1 10,-30 C 10,-22 2,-20 0,0 z',
                    fillColor: color,
                    fillOpacity: 1,
                    strokeColor: '#000',
                    strokeWeight: 2,
                    scale: 1
                };
            }

            var createMarker = function (info){
                
                // var newIcon = MapIconMaker.createMarkerIcon({width: 20, height: 34, primaryColor: "#0000FF", cornercolor:"#0000FF"});

                var marker = new google.maps.Marker({
                    map: $scope.map,
                    position: new google.maps.LatLng(info.userLat, info.userLon),
                    title: info.userName + ' ' + info.userSurname,
                    icon : pinSymbol('orange')
                });
                marker.content = '<div class="infoWindowContent">' + info.userTelephone + '</div>';
                
                google.maps.event.addListener(marker, 'click', function(){
                    infoWindow.setContent('<h2>' + marker.title + '</h2>' + marker.content);
                    infoWindow.open($scope.map, marker);
                });
                
                $scope.markers.push(marker);
                
            }  

            var createMarker2 = function (info){
                
                // var newIcon = MapIconMaker.createMarkerIcon({width: 20, height: 34, primaryColor: "#0000FF", cornercolor:"#0000FF"});

                var marker = new google.maps.Marker({
                    map: $scope.map,
                    position: new google.maps.LatLng(info.userLat, info.userLon),
                    title: info.userName + ' ' + info.userSurname,
                    icon : pinSymbol('green')
                });
                // marker.content = '<div class="infoWindowContent">' + info.userTelephone + '</div>';
                
                google.maps.event.addListener(marker, 'click', function(){
                    infoWindow.setContent('<h2>' + marker.title + '</h2>' + marker.content);
                    infoWindow.open($scope.map, marker);
                });
                
                $scope.markers.push(marker);
                
            }  
            
            $scope.numObserver = 0;
            for (i = 0; i < $scope.users.length; i++){
                if($scope.users[i].userLat != "")
                    $scope.numObserver ++;
            }

            
            $scope.numPublic = $scope.usersPub.length;

            if($scope.togglePublic)
            {
                for (i = 0; i < $scope.usersPub.length; i++)
                {
                    createMarker($scope.usersPub[i]);
                }
            }

            if($scope.toggleObserver)
            {
                for (i = 0; i < $scope.users.length; i++){
                    if($scope.users[i].userLat != "")
                        createMarker2($scope.users[i]);
                }
            }

            $scope.openInfoWindow = function(e, selectedMarker){
                e.preventDefault();
                google.maps.event.trigger(selectedMarker, 'click');
            }

        }

        $scope.showPubUsers = function()
        {
            $scope.page = 'usersPub'; 
        }
        

        $scope.showIncident = function()
        {
            $scope.page = 'incident';
            $scope.refreshIncident();
            $scope.loop();
        }

        $scope.loop = function()
        {
          setTimeout(function(){
            $scope.refreshIncident(function()
            {
              if($scope.page == 'incident')
                $scope.loop();
            });
          }, 1000);   
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

        $scope.showResults = function()
        {
            $scope.page = 'results';
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
            $scope.poll.pollStartTime = new Date($scope.poll.pollStartTime);
            $scope.poll.pollEndTime = new Date($scope.poll.pollEndTime);
            $scope.poll._id = $scope.poll._id + '';
        }

        $scope.exportPoll = function()
        {
            elec.exportPoll($scope.poll._id).success(function(data) {
                var anchor = angular.element('<a/>');
                 anchor.attr({
                     href: 'data:attachment/csv;charset=utf-8,' + encodeURI(data),
                     target: '_blank',
                     download: $scope.poll.pollName +'.csv'
                 })[0].click();
             });
        }

        $scope.openResult = function(index)
        {
            $scope.page = 'result'; 
            $scope.results = [];
            $scope.poll = $scope.polls[index];
            $scope.poll._id = $scope.poll._id + '';
            $scope.loading = true;
            elec.getQuestion($scope.poll._id).success(function(questions) {

                elec.getPollResult($scope.poll._id)
                    .success(function(data) {
                        $scope.loading = false;
                        $scope.results = data;
                        
                          setTimeout(function(){
                              var count = 0;
                                for(var i in $scope.results.results)
                                {
                                    debugger;
                                    var chartObj = [];
                                    chartObj.push(['Value', 'Count']);
                                    for(var j in  $scope.results.results[i])
                                    {
                                        chartObj.push([j + '-' + $scope.results.results[i][j],$scope.results.results[i][j]]);
                                    }


                                     var data = google.visualization.arrayToDataTable(chartObj);
                                     var title = i;

                                     var options = {};

                                    options.title = $scope.results.questions[i];

                                    if($scope.results.type[i] == 'radio button' || $scope.results.type[i] == 'multichoice')
                                        var chart = new google.visualization.PieChart(document.getElementById('chart_'+count));
                                    if($scope.results.type[i] == 'number' || $scope.results.type[i] == 'text')
                                        var chart = new google.visualization.ColumnChart(document.getElementById('chart_'+count));

                                    chart.draw(data, options);                                 
                                    count++;
                                }

                        }, 500);


                    });

            }); 

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
            $scope.poll.pollPublic = false;
            $scope.poll.pollCreateNew = false;

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

        $scope.openQuestion = function(index)
        {
            $scope.page = 'question'; 
            $scope.isNew = false; 
            $scope.question = $scope.questions[index];
        }

        $scope.addQuestion = function()
        {
            $scope.page = 'question';
            $scope.isNew = true;
            $scope.question = {};
        }

        $scope.delQuestion = function()
        {
            elec.deleteQuestion($scope.question._id).success(function(data) {
                $scope.openQuestions();
            }); 
        }

        $scope.addAnswer = function()
        {
            if(typeof $scope.question.questionAnswers == 'undefined')
                $scope.question.questionAnswers = [];
            $scope.question.questionAnswers.push('');
        }

        $scope.deleteAnswer = function(index)
        {
            $scope.question.questionAnswers.splice(index, 1);
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

        elec.getManagerUsers(myservice.username).success(function(data) {
            $scope.loading = false;
            $scope.users = data;
        });

        $scope.openUser = function(index)
        {
            myservice.currUser = $scope.users[index];
            $location.path('polls');
        }

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
            myservice.currPoll = _id;
            $location.path('questions'); // path not hash
        }


    }]);

     scotchApp.controller('resultsController', ['$rootScope', '$scope', 'myservice','elec','$location',function($rootScope, $scope, myservice,elec,$location) {
        // create a message to display in our view
        alert('HELLO RESSULTS');

        $scope.message = myservice.user;

        elec.getPoll().success(function(data) {
            $scope.loading = false;
            $scope.polls = data;

        });

        $scope.pollClick = function(_id)
        {
            myservice.currPoll = _id;
            $location.path('questions'); // path not hash
        }


    }]);

    scotchApp.controller('questionsController', ['$rootScope', '$scope', 'myservice','elec','$location','$mdDialog',function($rootScope, $scope, myservice,elec,$location,$mdDialog) {
        // create a message to display in our view
        elec.getQuestion(myservice.currPoll)
            .success(function(data) {

                $scope.questions = data;
                 elec.getResults(myservice.currPoll,myservice.currUser.userPollingStation)
                    .success(function(data) {

                        $scope.answers = data;
                        $scope.mapData();
                        $scope.loading = false;
                    });
            });



        $scope.mapData = function()
        {
            for(var i in $scope.questions) 
            {
                for(var j in $scope.answers)
                {
                    if($scope.questions[i].questionNumber == $scope.answers[j].q)
                    {
                        $scope.questions[i].questionResult = $scope.answers[j].r;
                        break;
                    }
                }
            }
        }  

        $scope.submit = function()
        {
            var data = {
                resultPoll : myservice.currPoll,
                resultStation : myservice.currUser.userPollingStation,
                resultAnswers : [],
            }

            for(var i in $scope.questions)
            {
                var result = {
                    q:$scope.questions[i].questionNumber,
                    r:$scope.questions[i].questionResult
                };
                data.resultAnswers.push(result);
            }

            elec.createResult(data).success(function(data) {

                // if(data == 'station exist')
                // {
               
                if(data == 'success')
                {
                    $mdDialog.show(
                        $mdDialog.alert()
                            .parent(angular.element(document.querySelector('#popupContainer')))
                            .clickOutsideToClose(true)
                            .title('Submit Successfull.')
                            .content(JSON.stringify(data))
                            .ariaLabel('')
                            .ok('Ok')
                    );
                    $location.path('polls');
                }else
                {
                    $mdDialog.show(
                        $mdDialog.alert()
                            .parent(angular.element(document.querySelector('#popupContainer')))
                            .clickOutsideToClose(true)
                            .title('Submit failed.')
                            .content(JSON.stringify(data))
                            .ariaLabel('')
                            .ok('Ok')
                    );
                }
            });
        }

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

                    $scope.$parent.userRole = myservice.userRole;
                    if(myservice.userRole == 'manager')
                    {
                        $location.path('manager');  
                    }
                    else if(myservice.userRole == 'admin')
                    {
                        $location.path('admin');  
                    }
                    else if(myservice.userRole == 'dashboard')
                    {
                        $location.path('dashboard');  
                    }
                    else if(myservice.userRole == 'user')
                    {   
                        myservice.currUser = data;
                        $location.path('polls');  
                    }
                    else
                        alert('NO USER ROLE???? Contact Administrator ' + myservice.userRole);

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
        this.currPoll = "";
    });

