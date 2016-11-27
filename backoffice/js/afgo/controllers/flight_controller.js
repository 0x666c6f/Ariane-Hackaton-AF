angular.module('AFGo.Controllers.Flight', [])
.controller('pnrListController', ['$scope', '$http', 'Flight', function($scope, $http, Flight) {

    $scope.flightForm = {}

    // Gets passenger list from mockup API
    $scope.getPassengerList = function() {

        delete $scope.flightInfo;
        delete $scope.error;

        Flight.get({
            data: 'pnrList',
            flightNumber: $scope.flightForm.flightNumber,
            date: $scope.flightForm.date
        }, function(data) {
            console.log(data);

            $scope.flightInfo = data;
        }, function(errordata) {
            console.log(errordata);

            delete $scope.flightInfo;

            $scope.error = "Passager inconnu";
        });
    }

    // Sends post request to start the Ariane process
    $scope.startAriane = function() {
        $http.post('/startAriane', {
            flightNumber: $scope.flightForm.flightNumber,
            date: $scope.flightForm.date
        }).then(function() {
            $scope.getPassengerList();
        });
    }

}]);