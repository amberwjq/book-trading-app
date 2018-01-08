angular.module('app').controller('mvNavBarLoginCtrl',function($scope,$http,$routeParams,mvNotifier,mvIdentity,$location,$cookieStore,$route){
    $scope.identity = mvIdentity;
  
  $scope.a=33;
  $scope.awaitingNotifications=500;

  

  var  oldDate = new Date();
  oldDate.setFullYear(1985, 8, 1);


    var currentUser;
    var opendd;
    var storedclickedTime;

    var init = function(){
      console.log("init function");
      $http.get('/api/mytransaction/'+currentUser).then(function(response){
        if(response.data.success){
         
          $scope.myTransaction=response.data.transactions;  
          $scope.newNotifications = $scope.myTransaction.filter(function (el) {

            console.log($scope.lastClickedTime);
         
          
            return el.transactionDate >$scope.lastClickedTime;
          });
          $scope.awaitingNotifications =$scope.newNotifications.length;
          console.log($scope.newNotifications);
          console.log($scope.awaitingNotifications);
          
                  
        }
        else {
            mvNotifier.error(response.data.reason)
        }
      })
      
      storedclickedTime = JSON.parse(localStorage.getItem('clickedTime'));
     
  
     
      if(storedclickedTime == null){
        $scope.lastClickedTime=oldDate;
      }
      else{
        $scope.lastClickedTime = storedclickedTime;
      }

      
 
    }
    if($scope.identity.currentUser != null)
    {
      currentUser = $scope.identity.currentUser.username;
      init();
    }
    $scope.signin=function(username,password){
        $http.post('/login',{username:username,password:password}).then(function(response){
            if(response.data.success){
                $cookieStore.put("currentUser",response.data.user);
                $scope.identity.currentUser=$cookieStore.get("currentUser");
                  console.log("cookie store "+$cookieStore.get("currentUser"));        
                mvNotifier.notify('You have successfully logged in');
                // $location.path('/');
                console.log( $scope.identity.currentUser);
                console.log("should route to mybook");
                $location.path('/book/'+$scope.identity.currentUser.username);
                $route.reload()
            }
            else {
                mvNotifier.notify('Invalid username/password')
            }
        })
      
    }
    $scope.signout=function(){
        $http.post('/logout',{logout:true}).then(function(){
            $cookieStore.remove("currentUser");
            $scope.username="";
            $scope.password="";
            $scope.identity.currentUser=undefined;
            mvNotifier.notify('You have successfully logged out');
            $location.path('/');
            $route.reload()

        })

    }
    $scope.showNotification = function(event){
        console.log("Clicked!!!");
         opendd= 1;
       // var targetdd = angular.element($event.target).closest('.dropdown-container').find('.dropdown-menu');
       // opendd = targetdd;
    
        $scope.lastClickedTime =new Date();
        console.log($scope.lastClickedTime);
        localStorage.setItem('clickedTime', JSON.stringify($scope.lastClickedTime ));
        $scope.awaitingNotifications=0;
        
      }  
      window.onclick = function(){
        console.log("opendd"+opendd);
        if(opendd != null){
          console.log("windows clicked");
          $scope.newNotifications = [];
          $scope.awaitingNotifications = 0;
        
        }
        
      }
})