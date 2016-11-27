angular.module('AFGo.Controllers.Pops', [])
.controller('enrollPopsController', ['$scope', '$location', 'Flight', 'Pops', function($scope, $location, Flight, Pops) {

    // Gets PNR from mockup API
    $scope.getPassenger = function() {

        delete $scope.pnrInfos;
        delete $scope.error;

        Flight.get({
            data: 'pnr',
            seatNumber: $scope.enrollForm.seatNumber
        }, function(data) {
            console.log(data);

            $scope.pnrInfos = data;
        }, function(errordata) {
            console.log(errordata);

            delete $scope.pnrInfos;

            $scope.error = "Passager inconnu";
        });
    }

    // Sends an enroll request
    $scope.enrollPops = function() {

        delete $scope.enrolled;
        
        Pops.save({
            action:'enroll',
            popsNumber: $scope.enrollForm.popsNumber,
            pnr: $scope.pnrInfos.pnr
        }, function(data) {
            console.log(data);

            $scope.enrolled = 'ok';
        }, function(errordata) {
            console.log(errordata);

            $scope.enrolled = 'failed';
        });
    }

    // Controller INIT
    if ($location.search().seatNumber) {
        $scope.enrollForm = {
            seatNumber: $location.search().seatNumber
        }
        $scope.getPassenger();
    }
    else {
        $scope.enrollForm = {}
    }

}])
.controller('popsHistoryController', ['$scope', '$location', 'Flight', 'Pops', function($scope, $location, Flight, Pops) {

    // Sends a POPUP message to a POPS
    $scope.sendMessage = function() {
        Pops.save({
            action: 'sendMessage',
            content: $scope.msgForm.messageText
        }, function(data) {
            
            $scope.history.push({
                from: 'backoffice',
                date: moment().format('DDMMM HH:mm').toUpperCase(),
                content: $scope.msgForm.messageText
            });

            delete $scope.msgForm.messageText;

        }, function(errordata) {
            console.log(errordata);
        });
    };

    // Controller INIT
    
    $scope.msgForm = {};

    Flight.get({
        data: 'pnr',
        seatNumber: '24H'
    }, function(data) {
        console.log(data);

        $scope.pnrInfos = data;
    }, function(errordata) {
        console.log(errordata);

        delete $scope.pnrInfos;

        $scope.error = "Passager inconnu";
    });

    Pops.query({
        action: 'history'
    }, function(data) {
        console.log(data);

        $scope.history = data;
    }, function(errordata) {
        console.log(errordata);
    });
}]);