angular.module('app').factory('mvIdentity', function($cookieStore) {
  currentUser=$cookieStore.get("currentUser");
    return {
      currentUser,
      isAuthenticated: function() {
        
        return !!this.currentUser;
      },

    }
  })