(function(){

    // Init Module
    var app = angular.module('Restaurants',[]);

    // Search Controller
    app.controller('SearchController', ['$scope', '$http', function ($scope, $http) {
        
        // Init vars
        $scope.businesses = [];
        $scope.history = [];
        
        // On submit
        $scope.search = function () {
            $scope.loading = true;
            $scope.businesses = [];
            $scope.history.push(angular.copy($scope.params));
            console.log($scope.history);
            
            $http.get('/yelp', {params: $scope.params}).
            success(function(data){
                $scope.loading = false;
                $scope.businesses = data;
            }).
            error(function(data){
                //console.log(data);
            });
        };
        
        // Populate default search
        $scope.params = {
            keywords: 'McDonalds',
            location: '1168 Hamilton, Vancouver, BC',
            radius: '3000'
        };
    }]);
    
})();