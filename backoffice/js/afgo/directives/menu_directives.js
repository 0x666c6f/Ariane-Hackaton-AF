'use strict';

angular.module('AFGo.Directives', [])
.directive('menuBar', ['$route', '$location', '$rootScope', '$window', function($route, $location, $rootScope, $window) {
    return {
        // A = attribute, E = Element, C = Class and M = HTML Comment
        restrict:'E',
        //means that any content inside the tag body will be embed in the final markup
        transclude: true,
        //Any parameters to pass to the directive as tag attribute
        scope : {
            //the title passed as a string
            'title': '@',
            'home': '@'
        },
        // the Html template to use for this directive
        // the content inside the menu-bar tag will be embed in the tag in the template marked
        // with a ng-transclude.
        // { {title} } will be replaced by the value of the title scope variable.
        templateUrl: "views/menu/menuBar.html",
        
        link: function(scope, element, attrs) {
            
            scope.$on('$routeChangeStart', function() {
                scope.isCollapsed = true;
            })
            
            scope.isActive = function (viewLocation) { 
		        return $location.path().indexOf(viewLocation) !== -1; 
		    };
            
            scope.refresh = function() {
                
                var refreshData = {
                    treated: false
                };
                
                // On envoie un event a tous les controleurs
                $rootScope.$broadcast('navRefresh', refreshData);
                
                if (refreshData.treated == false) {
                    $route.reload();
                }
            };
            
            scope.homeButtonClick = function() {
                delete $window.sessionStorage.lastSearch;
            }
            
            scope.goBack = function() {
                $window.history.back();
            }
            
            scope.isHomePage = function() {
                return $location.url() == scope.home;
            }
        }
    };
}])
//A menuDropdown child directive that can contains child of its own.
.directive('menuDropdown', ['$location', function ($location) {
    return {
        restrict:'E',
        //the menu-dropdown tag need to be inside a menu-bar tag
        require:['^?menuBar'],
        transclude: true,
        replace : true,
        scope : {
            'title': '@',
            'accessKey' : '@'
        },
        templateUrl : "views/menu/menuDropdown.html",
        //the link function (called upon construction of the DOM)
        link: function(scope, element, attrs) {
            
            scope.isDisabled = 'disabled' in attrs;
            
            scope.isDropdownActive = function() {
                
                if (scope.lastLocation == $location.path()) {
                    return scope.lastValue;
                }
                else {
                    
                    scope.lastLocation = $location.path();
                    
                    var childMenus = element.children('.dropdown-menu').children();
                    
                    for (var i=0; i<childMenus.length; i++) {
                        if ($location.path().indexOf(childMenus[i].getAttribute('to')) !== -1) {
                            scope.lastValue = true;
                            return true;
                        }
                    }
                    scope.lastValue = false;
                    return false;
                }
            };
        }
    };
}])
//The menu item directive (the leaf elements of the navigation menu)
.directive('menuItem', ["$location", function ($location) {
    return {
        restrict:'E',
        //Requires to be either in a menu-bar tag or in a menu-dropdown tag
        require:['^?menuBar','^?menuDropdown'],
        replace : true,
        transclude: true,
        scope : {
            //the to attribute used to set the href of the menu item
            'to': '@',
            'accessKey' : '@',
        },
        templateUrl: "views/menu/menuItem.html",
        link: function(scope, element, attrs) {
        	
            scope.isActive = function (viewLocation) {
                if (viewLocation) {
                    return $location.path().indexOf(viewLocation) !== -1;
                }
                else {
                    return false;
                }
		    };
        }
    };
}]);