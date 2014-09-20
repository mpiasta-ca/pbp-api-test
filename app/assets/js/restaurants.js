(function(){

    /*= Module
    ------------------------------------------------------------*/
    var app = angular.module('Restaurants', ['ngAnimate']);
        
    /*= Search Controller
    ------------------------------------------------------------*/
    app.controller('SearchController', ['$scope', '$controller', '$http', function ($scope, $controller, $http) {
        // Get controllers
        var AlertController = $controller('AlertController');
        
        // Init vars
        $scope.data = [];
        $scope.history = [];
        
        // Init default search
        $scope.params = {
            keywords: 'McDonalds',
            location: '1168 Hamilton, Vancouver, BC',
            radius: '3000'
        };
        
        // Form Submit
        $scope.search = function (obj) {            
            // Inject values instead of using form fields
            var query = obj? angular.copy(obj) : angular.copy($scope.params);
           
            // Skip Loading if Equal Query
            if (angular.equals($scope.history[0], query) && (!obj || (obj && !obj.paginate))) {
                return AlertController.warn("This search is already displayed.");
            }
            
            // Init Query UI
            $scope.loading = true;
            $scope.data = [];
            
            // Yelp Call
            $http.get('/yelp', {params: query}).
                success(function (data) {
                    $scope.loading = false;
                    $scope.data = data;   
                    
                    // Save search to history
                    if (!obj || (obj && !obj.paginate)) {
                        $scope.history.unshift(query);
                    
                        // Limit history length
                        if ($scope.history.length > 5) {
                            $scope.history.pop();
                        }
                    }             
                }).
                error(function (data) {
                    $scope.loading = false;                    
                    return AlertController.error(data.error? data.error :"Connect failed. Try refreshing your browser.");
                });
        };
    
        // Show Business Details
        $scope.showBusiness = function (key) {
            var id = $scope.data.businesses[key].id;
            
            $scope.data.businesses[key].loading = true;
            
            $http.get('/yelp/' + id).
                success(function (data) {
                    $scope.data.businesses[key].loading = false;
                    $scope.data.businesses[key].reviews = data;
                }).
                error(function (data) {
                    $scope.data.businesses[key].loading = false;           
                    return AlertController.error(data.error? data.error : "Connect failed. Try refreshing your browser.");
                });
        };
        
        // Hide Business Record
        $scope.hideBusiness = function (key) {
            $scope.data.businesses.splice(key, 1);
            return AlertController.success("Restaurant was hidden.");
        };
        
        // Prev. Page
        $scope.prev = function () {
            var obj = angular.copy($scope.history[0]);
            obj.paginate = true;
            obj.page = parseInt($scope.data.page) - 1;
            $scope.search(obj);
        };
        
        // Next Page
        $scope.next = function () {
            var obj = angular.copy($scope.history[0]);
            obj.paginate = true;
            obj.page = parseInt($scope.data.page) + 1;
            obj.total = $scope.data.total;
            $scope.search(obj);
        };
    }]);
        
    /*= Alert Controller
    ------------------------------------------------------------*/
    app.controller('AlertController', ['$rootScope', '$timeout', function ($rootScope, $timeout) {
        $rootScope.message = [];
                
        this.success = function (message) {
            this.enqueue({
                show: true, type: 'success', header: 'Yay!', body: message
            });
        };
        
        this.warn = function (message) {
            this.enqueue({
                show: true, type: 'warning', header: 'Oops!', body: message
            });
        };
        
        this.error = function (message) {
            this.enqueue({
                show: true, type: 'danger', header: 'Uhoh!', body: message
            });
        };
        
        this.enqueue = function (obj) {
            $timeout.cancel(this.timer);
            $rootScope.message = obj;
            var that = this;
            this.timer = $timeout(function(){ that.remove() }, 5000);
        };
        
        this.remove = function () {
            $rootScope.message.show = false;
        };
    }]);    
})();