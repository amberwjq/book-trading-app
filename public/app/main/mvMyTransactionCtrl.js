angular.module('app').controller('mvMyTransactionCtrl', function($scope,$http,mvNotifier,$location, $routeParams,$route,mvIdentity) {
  console.log("IN transaction CONTROLLER");
      var param1 = $routeParams.param1;
  
  
   
      $http.get('/api/mytransaction/'+param1).then(function(response){
        
        if(response.data.success){
          $scope.myTransaction=response.data.transactions; 
          console.log(response.data.transactions); 

                  
        }
        else {
            mvNotifier.error(response.data.reason)
        }
      })

    
    });
  
  
  
    