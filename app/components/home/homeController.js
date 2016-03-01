(function () {
    'use strict';

    angular
        .module('app')
        .controller('HomeController', HomeController);

    HomeController.$inject = ['UserService', 'DoctorService', 'AuthenticationService', 'OptionService', 'StudyService', 'ClinicService','$rootScope', '$location', '$timeout', '$window'];
    function HomeController(UserService, DoctorService, AuthenticationService, OptionService, StudyService, ClinicService, $rootScope, $location, $timeout, window) {

        var vm = this;

        vm.chart = {labels : [],series : ['Serie A'],data : [[]]};

        vm.Math = window.Math;

        vm.errors = {};
        vm.today = new Date();

        vm.configs = {};

        vm.showModal = false;
        vm.showPanel = 'components/home/showTree.html';
        vm.treeView = [];
        vm.itemsPerPage = 10;

        vm.loadUser = loadUser;
        vm.loadStudy = loadStudy;
        vm.loadClinic = loadClinic;
        vm.loadCategory = loadCategory;
        vm.login = login;
        vm.logout = logout;
        vm.changeView = changeView;
        vm.cleanForm = cleanForm;
        vm.cleanCategory = cleanCategory;
        vm.addNewCategory = addNewCategory;

        vm.resetPassword = resetPassword;

        //Submits
        vm.submitUser = submitUser;
        vm.submitStudy = submitStudy;
        vm.submitClinic = submitClinic;

        vm.backToHomepage = backToHomepage;

        initController();

        function initController() {
            AuthenticationService.GetSession(function(response){
              if(!response || response.code == 401){
                AuthenticationService.ClearCredentials();
                //$location.path("/login");
              }
              else{
                vm.user = response;
                OptionService.Get('config').then(function(response){
                  vm.configs = response;
                });
                StudyService.GetStats('stats').then(function(response){
                  //ORA VEDIAMO
                  var data = response['data'];
                  for (var k in data){
                    vm.chart.labels.push(k);
                    vm.chart.data[0].push(data[k]);
                  }
                });
                vm.pagination = 1;

              }
              vm.template = 'components/home/homepage.html';

            });
        }
        function login() {
          AuthenticationService.Login(vm.email, vm.password, function (response) {
            if (!response.error) {
              AuthenticationService.SetCredentials(vm.email,vm.password);
              vm.user = response.data;
              OptionService.Get('config').then(function(response){
                vm.configs = response;
              });
              StudyService.GetStats('stats').then(function(response){
                //ORA VEDIAMO
                var data = response['data'];
                for (var k in data){
                  vm.chart.labels.push(k);
                  vm.chart.data[0].push(data[k]);
                }
              });
              vm.pagination = 1;

            }else {
              AuthenticationService.ClearCredentials();
            }
            vm.template = 'components/home/homepage.html';

          });
        };

        function logout() {
          AuthenticationService.Logout(function(){
            AuthenticationService.ClearCredentials();
            delete vm.user;
            vm.configs = {};
            vm.chart = {labels : [],series : ['Serie A'],data : [[]]};

            vm.template = 'components/home/homepage.html';
            //$location.path('/login');
          });
        }

        //Profile functionalities
        function loadUser(id) {
            UserService.GetById(id)
                .then(function (message) {
                    vm.data = message.data;
                });
        }

        function loadClinic(id) {
            ClinicService.GetById(id)
                .then(function (message) {
                    vm.data = message.data;
                });
        }

        //Study functionalities
        function loadStudy(id) {
            StudyService.GetById(id)
                .then(function (message) {
                    vm.data = message.data;
                });
        }

        vm.itemToEdit = 0;
        function loadCategory(newCat){
          vm.showCategoryModal = false;
          if(newCat.indexOf("<Nuova categoria>") >= 0){
            vm.showCategoryModal = !vm.showCategoryModal;
            vm.added = "";
            return;
          }
          var newCategories = "";
          if(!vm.data.categories){
            newCategories += newCat + "/";
            vm.data.categories = newCategories;
            return;
          }
          var splitted = vm.data.categories.split("/");
          for(var c in splitted){
            if(c != vm.itemToEdit)
              newCategories += splitted[c] + "/";
            else
              newCategories += newCat + "/";
          }
          vm.data.categories = newCategories;
        }

        function cleanCategory(){
          vm.added = "";
          vm.showCategoryModal = !vm.showCategoryModal;
        }

        function addNewCategory(){
          vm.itemToEdit = (vm.data.categories ? vm.data.categories.split('/').length : 0);
          vm.showCategoryModal = !vm.showCategoryModal;

        }
        //USER functionality

        // TEMPLATE
        function changeView(next,loadItems,id){
          if(loadItems == 1) //Load Users
            UserService.GetAll().then(function (response) {
              vm.users = response.data;
            });
          else{
            if(loadItems == 2) //Load patient with id
              UserService.GetById(vm.user.id).then(function (response) {
                vm.data = response.data;
              });
            else{
              if(loadItems == 3) //Load study with id
              {
                StudyService.GetCategories().then(function (response) {
                  vm.studies = response.data.projects;
                  vm.categories = response.data.categories;
                });
                StudyService.GetTreeViewCategories().then(function (response) {
                  vm.treeView = response.data;
                });
              }
              else{
                if(loadItems == 4) //Load study with id
                {
                  ClinicService.GetAll().then(function (response) {
                    vm.clinics = response.data;
                  });
                }
              }
            }
          }
          cleanForm();
          vm.template = next;

        }

        function cleanForm(){
          vm.data = {};
          if(vm.form)
            vm.form.$setPristine();
        }

        function submitUser(changePage){

          if(!vm.data._id){

            vm.data.clinic = vm.clinicsObject.originalObject._id;
            vm.data.active = (vm.data.active ? true : false);
            vm.data.group = 3;
            UserService.Create(vm.data).then(function(response){
              vm.error = response.code == 400;
              vm.success = response.code != 400;

              if(response.code == 400){
                vm.message = response.message;
                return;
              }

              vm.data._id = response._id;
              vm.users.push(vm.data);
              cleanForm();
            });
          }else{
            UserService.Update(vm.data).then(function(response){
              vm.error = response.code == 400;
              vm.success = response.code != 400;

              if(response.code == 400){
                vm.message = response.message;
                return;
              }
              if(changePage){
                vm.success = true;

              }else {
                for(var id in vm.users){
                  if(vm.users[id]._id == vm.data._id)
                    vm.users[id] = vm.data;
                }
                cleanForm();
              }
            },function(error){
              vm.error = error.success;
              vm.message = error.message;
            });
          }
        }

        function submitStudy(changePage){
          vm.data.clinic = vm.user.clinic;
          vm.data.closed = (vm.data.closed ? vm.data.closed : false);

          if(!vm.data._id){
            StudyService.Create(vm.data).then(function(response){
              if(response.code == 400){
                vm.error = !response.success;
                vm.message = response.message;
                return;
              }

              vm.data._id = response.data._id;
              vm.studies.push(vm.data);
              cleanForm();
            });
          }else{
            StudyService.Update(vm.data).then(function(response){
              if(response.code == 400){
                vm.error = !response.success;
                vm.message = response.message;
                return;
              }
              if(changePage){
                vm.success = true;

              }else {
                for(var id in vm.studies){
                  if(vm.studies[id]._id == vm.data._id)
                    vm.studies[id] = vm.data;
                }
                cleanForm();
              }
            },function(error){
              vm.error = error.success;
              vm.message = error.message;
            });
          }
        }

        function submitClinic(changePage){
          if(!vm.data._id){
            ClinicService.Create(vm.data).then(function(response){
              if(response.code == 400){
                vm.error = !response.success;
                vm.message = response.message;
                return;
              }

              vm.data._id = response.data._id;
              vm.clinics.push(vm.data);
              cleanForm();
            });
          }else{
            ClinicService.Update(vm.data).then(function(response){
              if(response.code == 400){
                vm.error = !response.success;
                vm.message = response.message;
                return;
              }
              for(var id in vm.clinics){
                if(vm.clinics[id]._id == vm.data._id)
                  vm.clinics[id] = vm.data;
              }
              cleanForm();
            },function(error){
              vm.error = error.success;
              vm.message = error.message;
            });
          }
        }

        function backToHomepage(){
          vm.showModal = false;
          cleanForm();
          timer(true,true);
        }

        function resetPassword(id){
          UserService.ResetPassword(id).then(function(response){
            vm.showModal = !vm.showModal;
            timer(response.code == 200,false);
          });
        }

        function timer(successAlert,mChangeView){
          vm.success = successAlert;
          vm.error = !successAlert;
          $timeout(function () {
            vm.success = false;
            vm.error = false;
            if(mChangeView)  changeView('components/home/statistics.html');
          }, 3000);
        }
        // TEMPLATE
    }

})();
