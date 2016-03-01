(function () {
    'use strict';

    angular
        .module('app')
        .factory('UserService', UserService);

    UserService.$inject = ['$http'];
    function UserService($http) {
        var service = {};

        service.GetAll = GetAll;
        service.GetById = GetById;
        service.GetByUsername = GetByUsername;
        service.Create = Create;
        service.Update = Update;
        service.Delete = Delete;
        service.ResetPassword = ResetPassword;

        return service;

        function GetAll() {
            return $http.get('/clinicaltrial/user').then(handleSuccess, handleError('Error getting all user'));
        }

        function GetById(id) {
            return $http.get('/clinicaltrial/user/' + id).then(handleSuccess, handleError('Error getting user by id'));
        }

        function GetByUsername(username) {
            return $http.get('/clinicaltrial/user/' + username).then(handleSuccess, handleError('Error getting user by id'));
        }

        function Create(user) {
            return $http.post('/clinicaltrial/user', user).then(handleSuccess, handleError);
        }

        function Update(user) {
            return $http.put('/clinicaltrial/user/' + user._id, user).then(handleSuccess, handleError);
        }

        function Delete(id) {
            return $http.delete('/clinicaltrial/user/' + id).then(handleSuccess, handleError('Error deleting user'));
        }

        function ResetPassword(id) {
            return $http.post('/clinicaltrial/user/resetPassword/' + id).then(handleSuccess, handleError('Error deleting user'));
        }

        // private functions

        function handleSuccess(res) {
            return res.data;
        }

        function handleError(error) {
          return error.data;
        }
    }

})();
