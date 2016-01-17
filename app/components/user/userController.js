(function () {
    'use strict';

    angular
        .module('app')
        .controller('UserController', UserController);

    UserController.$inject = ['$location', '$window', 'AuthenticationService', 'FlashService'];
    function UserController($location, $window, AuthenticationService, FlashService) {
        var vm = this;

        vm.login = login;

        (function initController() {
            // reset login status
            AuthenticationService.ClearCredentials();

        })();

        function login() {
          vm.dataLoading = true;
          AuthenticationService.Login(vm.email, vm.password, function (response) {
            if (!response.error) {
              AuthenticationService.SetCredentials(vm.email,vm.password);
              $location.path('/');
            } else {
              FlashService.Error("Utente non autenticato");
              vm.dataLoading = false;
            }
          });
        };

    }

})();
