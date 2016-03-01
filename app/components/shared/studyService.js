(function () {
    'use strict';

    angular
        .module('app')
        .factory('StudyService', StudyService);

    StudyService.$inject = ['$http'];
    function StudyService($http) {
        var service = {};

        service.GetAll = GetAll;
        service.GetById = GetById;
        service.GetByPatient = GetByPatient;
        service.GetCategories = GetCategories;
        service.GetStats = GetStats;
        service.GetTreeViewCategories = GetTreeViewCategories;
        service.Create = Create;
        service.Update = Update;

        return service;

        function GetAll() {
            return $http.get('/clinicaltrial/study').then(handleSuccess, handleError('Error getting all study'));
        }

        function GetCategories() {
            return $http.get('/clinicaltrial/category').then(handleSuccess, handleError('Error getting all study'));
        }

        function GetTreeViewCategories() {
            return $http.get('/clinicaltrial/category/treeview').then(handleSuccess, handleError('Error getting all study'));
        }

        function GetById(id) {
            return $http.get('/clinicaltrial/study/' + id).then(handleSuccess, handleError('Error getting user by id'));
        }

        function GetStats() {
            return $http.get('/clinicaltrial/study/stats').then(handleSuccess, handleError('Error getting user by id'));
        }

        function GetByPatient(id) {
            return $http.get('/clinicaltrial/study/' + id).then(handleSuccess, handleError('Error getting user by id'));
        }

        function Create(study) {
            return $http.post('/clinicaltrial/study', study).then(handleSuccess, handleError);
        }

        function Update(study) {
            return $http.put('/clinicaltrial/study/' + study._id, study).then(handleSuccess, handleError);
        }

        // private functions

        function handleSuccess(res) {
            return res.data;
        }

        function handleError(error) {
            return function () {
                return { success: false, message: error };
            };
        }
    }

})();
