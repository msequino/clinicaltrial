(function () {
    'use strict';

    angular
        .module('app')
        .factory('ClinicService', ClinicService);

    ClinicService.$inject = ['$http'];
    function ClinicService($http) {
        var service = {};

        service.GetAll = GetAll;
        service.GetById = GetById;
        service.Create = Create;
        service.Update = Update;
        service.Delete = Delete;

        return service;

        function GetAll() {
            return $http.get('/goirc/clinic').then(handleSuccess, handleError('Error getting all clinics'));
        }

        function GetById(id) {
            return $http.get('/goirc/clinic/' + id).then(handleSuccess, handleError('Error getting clinic by id'));
        }

        function Create(clinic) {
            return $http.post('/goirc/clinic', clinic).then(handleSuccess, handleError);
        }

        function Update(clinic) {
            return $http.put('/goirc/clinic/' + clinic._id, clinic).then(handleSuccess, handleError);
        }

        function Delete(id) {
            return $http.delete('/goirc/clinic/' + id).then(handleSuccess, handleError('Error deleting clinic'));
        }

        // private functions

        function handleSuccess(res) {
            return res.data;
        }

        function handleError(error) {
            return { success: false, message: error };
        }
    }

})();
