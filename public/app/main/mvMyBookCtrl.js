angular.module('app').controller('mvMyBookCtrl', function($scope,$http,mvNotifier,$location, $routeParams,$route,mvIdentity,) {
  console.log("IN My Book CONTROLLER");
  $scope.identity = mvIdentity;
  
  var param1 = $routeParams.param1;
    console.log(param1);
    var mybooksInit = function(){
      $http.get('/api/mybook/'+param1).then(function(response){
        if(response.data.success){
          $scope.mybooks=response.data.books; 
          $scope.mybooksNumber= $scope.mybooks.length;           
        }
        else {
            mvNotifier.error(response.data.reason)
        }
      })
      $http.get('/api/mycart/'+param1).then(function(response){
        if(response.data.success){
          $scope.myCart=response.data.books; 
          $scope.myCartNumber= $scope.myCart.length;                  
        }
        else {
            mvNotifier.error(response.data.reason)
        }
      })
      $http.get('/api/requestreceived/'+param1).then(function(response){
        if(response.data.success){
          $scope.requesetReceived=response.data.books;  
          $scope.requesetReceivedNumber= $scope.requesetReceived.length;           
        }
        else {
            mvNotifier.error(response.data.reason)
        }
      }) 
      $http.get('/api/mytransaction/'+currentUser).then(function(response){
        if(response.data.success){
         
          $scope.myTransaction=response.data.transactions;              
        }
        else {
            mvNotifier.error(response.data.reason)
        }
      })
         
    }
   
     
    $scope.approveTrade = function(book)
    {
      var Indata = {"_id":book._id,"buyer":book.buyer,"owner":book._creator,"status":1,"transaction":"approved"};
      $http.post('/api/updatebook',Indata).then(function(response){
          if(response.data.success){
            $scope.books=response.data.books;     
            $location.path('/book/request/'+currentUser);
            $route.reload()
      
          }
          else {
              mvNotifier.error(response.data.reason)
          }
        });
    }
    $scope.denyTrade = function(book){
      var Indata = {"_id":book._id,"buyer":book.buyer,"owner":book._creator,"status":2,"transaction":"denied"};
      $http.post('/api/updatebook',Indata).then(function(response){
          if(response.data.success){   
            console.log(currentUser); 
            $location.path('/book/request/'+currentUser);
            $route.reload()
      
          }
          else {
              mvNotifier.error(response.data.reason)
          }
        });
    }
    $scope.removeTrade = function(book){
      var Indata = {"_id":book._id,"buyer":book.buyer,"owner":book._creator,"status":0,"transaction":"cancelled"};
      $http.post('/api/updatebook',Indata).then(function(response){
          if(response.data.success){   
            console.log(currentUser); 
            $location.path('/book/cart/'+currentUser);
            $route.reload()
      
          }
          else {
              mvNotifier.error(response.data.reason)
          }
        });
    }


    if($scope.identity.currentUser != null)
  {
    currentUser = $scope.identity.currentUser.username;
  
  }
    if(param1 != undefined){
      mybooksInit();
    }

  
  });



  