angular.module('app').controller('mvMainCtrl', function($scope,$http,mvNotifier,$location,mvIdentity,$route,$cookieStore) {
  console.log("IN MAIN CONTROLLER");
  $scope.identity = mvIdentity;  

  if($scope.identity.currentUser != null)
  {
    currentUser = $scope.identity.currentUser.username;
  }


  $http.get('/api/books').then(function(response){
    if(response.data.success){
      $scope.books=response.data.books;     
    }
    else {
        mvNotifier.error(response.data.reason)
    }
  });

    
  $scope.addToCart = function(book) {
    var Indata = {"_id":book._id,"buyer":currentUser,"owner":book._creator,"status":3,"transaction":"denied"};
    $http.post('/api/updatebook',Indata).then(function(response){
        if(response.data.success){
          mvNotifier.notify('Added to your cart!');
          $scope.books=response.data.books;     
          $location.path('/');
          $route.reload()
    
        }
        else {
            mvNotifier.error(response.data.reason)
        }
      });
  
}; 
 
  $scope.filterMyPoll=function(){
    console.log("In fileter my poll");
    $http.get('/api/mypoll').then(function(response){
      if(response.data.success){
        $scope.books=response.data.books;     
      }
      else {
          mvNotifier.error(response.data.reason)
      }
    })     
  }
 

});