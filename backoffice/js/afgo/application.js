'use strict';

/* App Module */

var AFGoApp = angular.module('AFGo',
	[	'ngRoute',
        'ngAnimate',
        'ngMessages',
		'ui.bootstrap',
        'AFGo.Controllers.Flight',
        'AFGo.Controllers.Pops',
        'AFGo.Controllers.Modals',
        'AFGo.Directives',
        'AFGo.Services.Resources',
        'AFGo.Services'
	])
.config(['$routeProvider', function($routeProvider) {
    $routeProvider.
        when('/flightInfo', {
            templateUrl: 'views/flight/pnrList.html',
            controller: 'pnrListController'
        }).
        when('/enrollPops', {
            templateUrl: 'views/pops/enrollPops.html',
            controller: 'enrollPopsController'
        }).
        when('/history', {
            templateUrl: 'views/pops/popsHistory.html',
            controller: 'popsHistoryController'
        }).
        otherwise({redirectTo: '/flightInfo'});
}])
.config(['$httpProvider', function($httpProvider) {    
	var interceptor = ['$q', '$window', function($q, $window) {
		return {
            'response': function(response) {
                if (typeof response.data === "string" && response.data.indexOf("SITEMINDEROBJECT") !== -1) {
                    $window.location.reload(true);
                    // There has been an error, reject this response
                    return $q.reject(response);
                }
                return response;
            },
            
            'responseError': function(rejection) {
                if ( (rejection.status === 403) || (rejection.status === 401) ) {
                    // Unauthorized request, we redirect the user to the error page
                    $window.location.href = "#/403";
                }
                else if (rejection.status === -1) {
                    // HABILE error, we force the user to log back again
                    $window.location.reload();
                }
                // otherwise, default behaviour
                return $q.reject(rejection);
            }
        }
	}];
	$httpProvider.interceptors.push(interceptor);
    
    // Needed for cross domain requests with the renfort rest api
    $httpProvider.defaults.withCredentials = true;
    
}])
.config(['$animateProvider', function($animateProvider) {
    $animateProvider.classNameFilter(/modal|popover|collapse|tooltip/);
}]);
