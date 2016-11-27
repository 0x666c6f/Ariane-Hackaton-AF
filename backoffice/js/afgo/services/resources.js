'use strict';

// Resources from node backend
angular.module('AFGo.Services.Resources', ['ngResource'])
    .factory('Flight', ['$resource', function($resource) {
        return $resource('/flight/:data', {data: '@data'});
    }])
    .factory('Pops', ['$resource', function($resource) {
        return $resource('/pops/:action', {action: '@action'});
    }]);