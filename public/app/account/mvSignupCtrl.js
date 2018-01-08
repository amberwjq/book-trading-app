angular.module('app').controller('mvSignupCtrl', function($scope, mvNotifier, $location,$http,mvIdentity,$cookieStore,$route) {
      $scope.identity = mvIdentity;
      $scope.signup = function() {
        if ($scope.password != $scope.repeat) 
        {
            mvNotifier.notify('两次输入的口令不一致');
            return null
        }
        var newUserData = {
          "username": $scope.username,
          "password": $scope.password,
          "firstName": $scope.fname,
          "lastName": $scope.lname
        };
        
        $http.post('/api/signup',newUserData).then(function(response){
          if(response.data.success){
            $cookieStore.put("currentUser",response.data.user);
            $scope.identity.currentUser=$cookieStore.get("currentUser");
            console.log("cookie store "+$cookieStore.get("currentUser"));               
              mvNotifier.notify('User account created!');
              $location.path('/');
              $route.reload()

          }
          else {
            console.log("data reason"+response.data.reason);
              mvNotifier.error(response.data.reason)
          }
      })

      }
    })