(function(){

'use strict';

/* Controllers */

angular.module('controllers', [])
    .controller('auth', ['$scope', '$state', '$cookies', 'Identify', function ($scope, $state, $cookies, Identify) {

        $scope.auth = {
            login:      '',
            password:   ''
        };

        $scope.login = function() {
            Identify.login(angular.extend($scope.auth));
        };

    }])
    .controller('demo', ['$scope', '$state', '$cookies', 'Identify', function ($scope, $state, $cookies, Identify) {

        $scope.tree = [{
            name: 'ДФО',
            $expand: true,
            children: [{
                name: 'ДФО - Амурская область',
                children: [{
                    name: 'ДФО - Амурская область - Амурская область городские',
                    children: []
                }, {
                    name: 'ДФО - Амурская область - Амурская область мобильные',
                    children: []
                }]
            }, {
                name: 'ДФО - Еврейская автономная область',
                children: [{
                    name: 'ДФО - Еврейская автономная область - Биробиджан городские',
                    children: []
                }, {
                    name: 'ДФО - Еврейская автономная область - Еврейская автономная область городские',
                    children: []
                }]
            }]
        }, {
            name: 'ПФО',
            $expand: true,
            children: [{
                name: 'ПФО - Кировская область',
                children: []
            }, {
                name: 'ПФО - Нижегородская область',
                children: []
            }]
        }];

        $scope.date = new Date();

        $scope.comboBox = 1;
        $scope.comboBoxData = [{
            text: 'Фрукты',
            value: 1
        }, {
            text: 'Овощи',
            value: 2
        }];

    }]);

})();