(function(){

    /*= Module
    ------------------------------------------------------------*/
    var app = angular.module('Restaurants', ['ngAnimate']);
        
    /*= Data Service
    ------------------------------------------------------------*/
    app.service('DataService', ['$http', '$rootScope', 'AlertService', function ($http, $rootScope, AlertService) {
        var businesses = undefined;
        var meta = undefined;

        return {
            getIndex: function (query) {
                $rootScope.loading = true;
                businesses = undefined;
                
                return $http.get('/yelp', { params: query }).
                    success(function (res) {
                        $rootScope.loading = false;
                        businesses = res.businesses;
                        delete res['businesses'];
                        meta = res;
                        return true;
                    }).
                    error(function (res) {
                        $rootScope.loading = false;
                        AlertService.error(res.error? res.error : "Connection failed. Try refreshing...");
                        return false;
                    });
            },
            getById: function (key) {                
                var business = businesses[key];
                business.loading = true;
                
                return $http.get('/yelp/' + business.id).                
                    success(function (res) {
                        business.loading = false;
                        business.reviews = res;
                        return true;
                    }).
                    error(function (res) {
                        business.loading = false;
                        AlertService.error(res.error? res.error : "Connection failed. Try refreshing...");
                        return false;
                    });
            },
            all: function () {
                return businesses;
            },
            meta: function () {
                return meta;
            }
        }
    }]);
    
    /*= History Service
    ------------------------------------------------------------*/
    app.service('HistoryService', function () {        
        var current = false;
        var history = [];
        var MAX_LENGTH = 5;
                
        // Remove existing if in list (will be shifted to top)
        function nodupes (query) {
            angular.forEach(history, function (value, key) {
                if (angular.equals(value, query)) {
                    return history.splice(key, 1);
                }
            });
        }
        
        // Remove last entry if longer than MAX_LENGTH
        function truncate () {
            if (history.length > MAX_LENGTH) {
                history.pop();
            }
        }
        
        return {
            save: function (query) {
                nodupes(query);
                history.unshift(query);
                current = query;
                truncate();
            },
            active: function () {
                return current;
            },
            all: function () {
                return history;
            }
        }
    });
    
    /*= Alert Service
    ------------------------------------------------------------*/
    app.service('AlertService', ['$timeout', function ($timeout) {
        var messages = [];
        var DISPLAY_TIME = 3500;
        var TRANSITION_TIME = 1250;
        
        // Mark message as hidden after DELAY_TIME (see: ng-animate)
        function scheduleExpire () {
            $timeout(function () {
                // Find first unhidden message
                for (var i = 0; i <= messages.length; i++) {
                    if (messages[i].hidden == false) {
                        messages[i].hidden = true;
                        scheduleDelete();
                        break;
                    }
                }                
            }, DISPLAY_TIME);
        }
        
        // Delete hidden message after TRANSITION_TIME (see: ng-animate)
        function scheduleDelete () {
            $timeout(function () {
                // Delete oldest entry in object
                messages.shift();
            }, TRANSITION_TIME);
        }

        // Add new message to queue
        function append (message) {
            messages.push(angular.extend(message, { hidden: false }));            
            // Schedule expire call for this message
            scheduleExpire();
        }

        return {
            success: function (message) {
                append({ type: 'success', header: 'OK!', body: message });
            },
            info: function (message) {
                append({ type: 'warning', header: 'Oops!', body: message });
            },
            error: function (message) {
                append({ type: 'danger', header: 'Uhoh!', body: message });
            },
            all: function () { return messages; }
        }
    }]);
    
    /*= Search Controller    
    ------------------------------------------------------------*/
    app.controller('SearchController', ['$scope', 'DataService', 'HistoryService', 'AlertService', function ($scope, DataService, HistoryService, AlertService) {        
        // Default fields at init
        $scope.params = {
            keywords: 'McDonalds',
            location: '1168 Hamilton, Vancouver, BC',
            radius: '3000'
        }
        
        // On form submit
        $scope.search = function () {
            var current = HistoryService.active();
            var params = angular.copy($scope.params);
            
            // Skip if already loaded
            if (angular.equals(current, params)) {
                return AlertService.info("Your request is already being displayed.");
            }
                       
            // Send API request
            if (DataService.getIndex(params)) {
                // On success, save query to recent searches
                HistoryService.save(params);
            }
        }
    }]);
        
    /*= Pagination Controller
    ------------------------------------------------------------*/
    app.controller('PaginationController', ['$scope', 'DataService', 'HistoryService', function ($scope, DataService, HistoryService) {
        $scope.meta = function () {
            return DataService.meta();
        }
        
        // On form submit
        $scope.search = function (page) {
            var current = angular.copy(HistoryService.active());
            var params = angular.extend(current, {
                page: parseInt($scope.meta().page) + parseInt(page),
                total: $scope.meta().total
            });
            
            // Send API request
            DataService.getIndex(params);
        }
    }]);
    
    /*= History Controller    
    ------------------------------------------------------------*/
    app.controller('HistoryController', ['$scope', 'DataService', 'HistoryService', 'AlertService', function ($scope, DataService, HistoryService, AlertService) {
        $scope.history = function () {
            return HistoryService.all()
        }
        
        // On click of a recent search link
        $scope.search = function (query) {
            var current = HistoryService.active();
            var params = angular.copy(query);
            
            // Skip if already loaded
            if (angular.equals(current, params)) {
                return AlertService.info("Your request is already being displayed.");
            }
            
            // Send API request
            if (DataService.getIndex(params)) {
                // On success, save query to recent searches
                HistoryService.save(params);
            }
        }
    }]);
    
    /*= Business Controller
    ------------------------------------------------------------*/
    app.controller('BusinessController', ['$scope', 'DataService', 'HistoryService', 'AlertService', function ($scope, DataService, HistoryService, AlertService) {
        $scope.businesses = function () {
            return DataService.all();
        }
        
        $scope.meta = function () {
            return DataService.meta();
        }
        
        $scope.current = function () {
            return HistoryService.active();
        }
        
        // Show review for business
        $scope.showBusiness = function (key) {            
            DataService.getById(key);
        }
       
        // Hide business
        $scope.hideBusiness = function (key) {
            $scope.businesses().splice(key, 1);
            AlertService.success("Restaurant was hidden.");
        }
    }]); 
    
    /*= Alert Controller
    ------------------------------------------------------------*/
    app.controller('AlertController', ['$scope', 'AlertService', function ($scope, AlertService) {
        $scope.messages = function () {
            return AlertService.all()
        };
    }]);
})();