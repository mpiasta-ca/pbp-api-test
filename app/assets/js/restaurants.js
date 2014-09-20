(function(){

    // Init Module
    var module = angular.module('Restaurants', ['ngAnimate']);

    // Search Controller
    module.controller('SearchController', ['$scope', '$timeout', '$http', function ($scope, $timeout, $http) {
        // Init vars
        $scope.businesses = [];
        $scope.history = [];
        $scope.alert = [];
        
        // Init default search
        $scope.params = {
            keywords: 'McDonalds',
            location: '1168 Hamilton, Vancouver, BC',
            radius: '3000'
        };
        
        // Form Submit
        $scope.search = function (inject) {
            if (inject) {
                $scope.params = inject;
            }
           
            // Skip Loading if Equal Query
            if (angular.equals($scope.history[0], $scope.params)) {
                return $scope.message("warning", "Oops!", "This search is already being displayed.");
            }
            
            // Init Query UI
            $scope.loading = true;
            $scope.alert.show = false;
            $scope.businesses = [];
            $scope.history.unshift(angular.copy($scope.params));
            
            // Limit history length
            if ($scope.history.length > 5) {
                $scope.history.pop();
            }
            
            // Yelp Call
            $http.get('/yelp', {params: $scope.params}).
                success(function(data){
                    $scope.loading = false;
                    $scope.businesses = data;
                }).
                error(function(data){
                    $scope.loading = false;
                    //console.log(data);
                });
        };
        
        // Display Message
        $scope.message = function (type, header, body) {
            // Set alert data
            $scope.alert = {
                show: true,
                type: type,
                header: header,
                body: body
            };
            
            // Cancel existing timer
            $timeout.cancel($scope.alertTimer);
            
            // Auto-hide after 5 seconds
            $scope.alertTimer = $timeout(function(){
               $scope.alert.show = false;
            }, 5000);
        };
    }]);    
})();