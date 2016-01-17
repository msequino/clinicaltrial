(function () {
    'use strict';

    angular
        .module('app')
        .factory('DoctorService', DoctorService);

    DoctorService.$inject = ['$http'];
    function DoctorService($http) {
        var service = {};

        service.GetAll = GetAll;
        service.GetById = GetById;
        service.Create = Create;
        service.Update = Update;
        service.Delete = Delete;

        return service;

        function GetAll() {
            return $http.get('/goirc/doctors').then(handleSuccess, handleError('Error getting all doctors'));
        }

        function GetById(id) {
            return $http.get('/goirc/doctors/' + id).then(handleSuccess, handleError('Error getting doctor by id'));
        }

        function Create(doctor) {
            return $http.post('/goirc/doctors', doctor).then(handleSuccess, handleError);
        }

        function Update(doctor) {
            return $http.put('/goirc/doctors/' + doctor._id, doctor).then(handleSuccess, handleError);
        }

        function Delete(id) {
            return $http.delete('/goirc/doctors/' + id).then(handleSuccess, handleError('Error deleting doctor'));
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
