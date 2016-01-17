(function () {
    'use strict';

    angular
        .module('app')
        .filter('byRole', function(){
          return function(doctors,filters){
            var out = [];
            if(filters){
              var check1 = (filters[1] ? 1 : 0);
              var check2 = (filters[2] ? 2 : 0);
              var check3 = (filters[3] ? 3 : 0);
              out = [];
              for(var doctor in doctors){
                if(doctors[doctor].RoleId == check1 || doctors[doctor].RoleId == check2 || doctors[doctor].RoleId == check3)
                  out.push(doctors[doctor]);
              }
            }
            else {
              out = doctors;
            }

            return out;
          }
        })
        .filter('checkStudiesByPatient',function(){
          return function(patient){
            // TODO : manca NRS > 5 e dilatazione cervice
            //            if(patient.Summary.c1s5 == 0 && patient.birth)
          }
        })
        .filter('split', function() {
          return function(input, splitChar) {
              // do some bounds checking here to ensure it has that index
              if(!input) return input;
              input = input.substr(0,input.length-1);
              return input.split(splitChar);
          }
        })
        .filter('getStage', function() {
          return function(input, splitChar,index) {
            // do some bounds checking here to ensure it has that index
            if(!input) return input;
            var hashmap = [];
            index = !index ? 0 : index;
            for(var key in input)
            {
              if(hashmap.indexOf(input[key].split(splitChar)[index]) == -1 && input[key].split(splitChar)[index] != "")
                hashmap.push(input[key].split(splitChar)[index]);
            }
            hashmap.push("<Nuova categoria>");
            return hashmap;
          }
        })
        .filter('splitDuration', function() {
          return function(input, splitChar, splitIndex) {
            // do some bounds checking here to ensure it has that index
            if(input)
              return input.split(splitChar)[splitIndex];
          }
        })
        .filter('range', function() {
          return function(input, total) {
              total = parseInt(total);

              for(var i =0 ; i< total;i++)
                input.push(i);

              return input;
          }
        })
        .filter('customLimitTo', function() {
          return function(input, limit, begin) {
            limit = parseInt(limit);
            begin = parseInt(begin);
            var out = [];
            for(var i=0 ; i<limit;i++)
              if(input.length > i+begin)
                out.push(input[i+begin]);

            return out;
          }
        })

})();
