angular.module('AFGo.Services', ['AFGo.Controllers.Modals'])
.factory('Utils', function () {
	return {
		displayHour: function(hour) {
	    	if (hour != null && hour.length == 4) {
	    		return [hour.slice(0, 2), ":", hour.slice(2)].join('');
	    	}
	    	else {
	    		return hour;
	    	}
	    },
	    
	    secondsTommss: function(totalSec) {
	    	if (totalSec == null) {
	    		return totalSec;
	    	}
	    	else {
	    		var hours = parseInt( totalSec / 3600 ) % 3600;
	    		var minutes = parseInt( totalSec / 60 ) % 60;
	    		var seconds = totalSec % 60;
	    		
	    		var displayedMinutes = hours * 60 + minutes;
	    		
	    		if (displayedMinutes < 10) {
	    			displayedMinutes = "0" + displayedMinutes;
	    		}
	    		if (seconds < 10) {
	    			seconds = "0" + seconds;
	    		}
	    		
	    		return displayedMinutes + ":" + seconds;
	    	}
	    }
	}
})
.factory('FlightUtils', function() {
    return {
        getAirlineCode: function(flightNumber) {
            return (typeof flightNumber === 'string' && flightNumber.length > 2) ? flightNumber.substr(0, 2) : flightNumber;
        },
        
        getNumber: function(flightNumber) {
            if (typeof flightNumber === 'string' && flightNumber.length > 2) {
                
                var flightNumberWithoutAirline = flightNumber.substr(2);
                
                var lastChar = flightNumberWithoutAirline.slice(-1);
                
                // On verifie si le lastChar est une lettre
                return /^[a-zA-Z]+$/.test(lastChar) ? flightNumberWithoutAirline.slice(0, -1) : flightNumberWithoutAirline;
            }
            else {
                return flightNumber;
            }
        },
        
        getSuffix: function(flightNumber) {
            if (typeof flightNumber === 'string' && flightNumber.length > 2) {
                var lastChar = flightNumber.slice(-1);
                
                // On verifie si le lastChar est une lettre
                return /^[a-zA-Z]+$/.test(lastChar) ? lastChar : '';
            }
            else {
                return '';
            }
        },
        
        isFlightCancelled: function(flightObj) {
            return flightObj != null && flightObj.irregularity != null && flightObj.irregularity.flightCancelledIndicator;
        },
        
        printTime: function (dateString) {
            if (dateString) {
                if (dateString.length >= 19) {
                    return dateString.substring(11, 16);
                }
                else if (dateString.length >= 12) {
                    return dateString.substring(8, 10) + ':' + dateString.substring(10, 12);
                }
            }
            return '';
        },
        
        getFullFlightNumber: function(flightObj) {
            if (flightObj) {
                
                if (flightObj.flightInfo) {
                    return (flightObj.flightInfo.airlineCode ? flightObj.flightInfo.airlineCode : '') +
                        (flightObj.flightInfo.flightNumber ? flightObj.flightInfo.flightNumber : '') +
                        (flightObj.flightInfo.suffix ? flightObj.flightInfo.suffix : '');
                }
                else if (flightObj.flightNumber) {
                    return (flightObj.airlineCode ? flightObj.airlineCode : '') +
                        (flightObj.flightNumber ? flightObj.flightNumber : '') +
                        (flightObj.suffix ? flightObj.suffix : '');
                }
                else if (flightObj.operatingFlightNumber) {
                    return (flightObj.operatingAirline ? flightObj.operatingAirline : '') +
                        (flightObj.operatingFlightNumber ? flightObj.operatingFlightNumber : '') +
                        (flightObj.operatingSuffix ? flightObj.operatingSuffix : '');
                }
            }
        },
        
        getMovementType: function(flightObj, escale) {
            if (flightObj && flightObj.leg && flightObj.leg.departureAirport)
                return (flightObj.leg.departureAirport.airportCode == escale) ? 'D' : 'A';
        },
        
        getDepDateYYYYMMDD: function(flightObj) {
            if (flightObj && flightObj.leg && flightObj.leg.departureTiming && flightObj.leg.departureTiming.scheduledLTDate)
                return flightObj.leg.departureTiming.scheduledLTDate.substring(0, 8);
                
            else if (flightObj && flightObj.departureDate)
                return flightObj.departureDate.substring(0, 8);
                
            else if (flightObj && flightObj.departureDateLT)
                return flightObj.departureDateLT.substring(0, 10);
        }
    }
})
.factory('LoadSpinner', function() {
    /* SPINNER CONTROLS */
    return {
        nbInProgress: 0,
        cancelFunction: undefined,
        isCancelled: false,
        
	    loadingStart: function(cancelFunction) {

            this.cancelFunction = cancelFunction;
            this.isCancelled = false;

            if (this.nbInProgress == 0) {
                //angular.element(".spinner").stop(true).fadeTo(300, 1);
                angular.element(".loading-spinner").show();
            }
            this.nbInProgress++;
        },
	
	    loadingEnd: function() {
            if (this.nbInProgress > 0) {
                this.nbInProgress--; 
            }
            if (this.nbInProgress == 0) {
                /*angular.element(".spinner").stop(true).fadeTo(100, 0, function() {
                    angular.element(this).hide();
                });*/
                
                angular.element(".loading-spinner").hide();
            }
	    },

        cancelLoading: function() {
            this.isCancelled = true;
            this.nbInProgress = 0;
            angular.element(".loading-spinner").hide();

            if (this.cancelFunction && this.cancelFunction.call) {
                this.cancelFunction.call();
            }
        }
    }
})

// We include directly the template instead of using templateUrl
// To successfully display an error modal even if the network has been lost.

.factory('ConfirmModal', ['$modal', function($modal) {
    return {
        createInstance: function(modalMessage) {
            return $modal.open({
                animation: true,
                
                template: '<div class="modal-content">\n' +
                            '<div class="modal-body">\n' +
                                '<h3 class="modal-title">{{message}}</h3>\n' +
                            '</div>\n' +
                            '<div class="modal-footer">\n' +
                                '<button class="btn btn-primary" ng-click="ok()">OK</button>\n' +
                            '</div>\n' +
                        '</div>',
                        
                controller: 'confirmModalController',
                size: 'xxs',
                resolve: {
                    title: function() {
                        return null;
                    },
                    message: function() {
                        return modalMessage;
                    }
                }
            });
        },
        
        createTitleInstance: function(modalTitle, modalMessage) {
            return $modal.open({
                animation: true,
                
                template: '<div class="modal-content">\n' +
                            '<div class="modal-header">\n' +
                                '<h3 class="modal-title" ng-class="title == \'WARNING\' ? \'text-warning\' : \'text-danger\'">{{title}}</h3>\n' +
                            '</div>\n' +
                        '<div class="modal-body">\n' +
                                '<p class="no-margin preline">{{message}}</p>\n' +
                            '</div>\n' +
                            '<div class="modal-footer">\n' +
                                '<button class="btn btn-primary" ng-click="ok()">OK</button>\n' +
                            '</div>\n' +
                        '</div>\n',
                    
                controller: 'confirmModalController',
                size: 'xs',
                resolve: {
                    title: function() {
                        return modalTitle;
                    },
                    message: function() {
                        return modalMessage;
                    }
                }
            });
        },
        
        createApprovalInstance: function(modalTitle, modalMessage) {
            return $modal.open({
                animation: true,
                
                template: '<div class="modal-content">\n' +
                            '<div class="modal-header" ng-show="title">\n' +
                                '<h3 class="modal-title">{{title}}</h3>\n' +
                            '</div>\n' +
                            '<div class="modal-body" ng-show="message">\n' +
                                '<p>{{message}}</p>\n' +
                            '</div>\n' +
                            '<div class="modal-footer">\n' +
                                '<button class="btn btn-primary" ng-click="ok()">{{ "YES"}}</button>\n' +
                                '<button class="btn btn-warning" ng-click="cancel()">{{ "NO"}}</button>\n' +
                            '</div>\n' +
                        '</div>\n',
                
                controller: 'confirmModalController',
                size: 'xs',
                resolve: {
                    title: function() {
                        return modalTitle;
                    },
                    message: function() {
                        return modalMessage;
                    }
                }
            });
        },
        
        buildErrorModal: function(errorInfo) {
            return this.createTitleInstance('ERROR', errorInfo.data ? errorInfo.data.message : 'ERROR_NETWORK_HABILE');
        }
    }
}]);