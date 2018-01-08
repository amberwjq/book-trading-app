angular.module('app', ['ngResource', 'ngRoute','ngCookies']);

angular.module('app').config(function($routeProvider, $locationProvider) {
    // $locationProvider.html5Mode(true);
    $routeProvider
    .when('/signup', { templateUrl: '/partials/signup.html',controller:'mvSignupCtrl'})
    .when('/login', { templateUrl: '/partials/login.html',controller:'mvNavBarLoginCtrl'})
    .when('/book/:param1', { templateUrl: '/partials/mybook.html', controller: 'mvMyBookCtrl'})
    .when('/book/cart/:param1', { templateUrl: '/partials/mycart.html', controller: 'mvMyBookCtrl'})
    .when('/book/request/:param1', { templateUrl: '/partials/pendngrequest.html', controller: 'mvMyBookCtrl'})
    .when('/book/history/:param1', { templateUrl: '/partials/mytransaction.html', controller: 'mvMyTransactionCtrl'})
     .when('/', { templateUrl: '/partials/home.html', controller: 'mvMainCtrl'})    
    .when('/newbook', { templateUrl: '/partials/newbook.html', controller: 'mvNewBookCtrl'})
    
    
    
   
      
});



