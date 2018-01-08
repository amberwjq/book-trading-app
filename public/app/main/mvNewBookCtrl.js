angular.module('app').controller('mvNewBookCtrl', function($scope,$http,mvNotifier,$location,mvIdentity,$route) {
    console.log("IN mvNewBookCtrl CONTROLLER");
    $scope.identity = mvIdentity;  
    currentUser = $scope.identity.currentUser.username;
    $scope.searchBook = function(name) {
        console.log(name);
      
      $http.get("/api/book/"+name).then(function(response){
        if(response.data.success){
          $scope.bookfromapi=response.data.books; 
          console.log("BOOK API END");    
        }
        else {
            mvNotifier.error(response.data.reason)
        }
      })
      
    };
    $scope.addBook = function(book) {
        console.log("ADD BOOK FUNCTION");
        console.log(book);
        var newBooklData = {
            "title": book.title,
            "authors":book.authors,
            "image":book.image
          }; 
          $http.post('/api/createbook',newBooklData).then(function(response){
            if(response.data.success){
              mvNotifier.notify('Your Book Added!');
              $scope.books=response.data.books;     

            }
            else {
                mvNotifier.error(response.data.reason)
            }
          });
      
    };
  
  });