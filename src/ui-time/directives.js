
/* ui-time */

angular.module('directives', ['ng']).directive('uiTime', ['$filter', function($filter) {
    return {
        require: 'ngModel',
        restrict: 'AE',
        replace: true,
        template: (
            '<div class="ui-time">' +
                '<input type="text" ng-model="value" ng-pattern="pattern" placeholder="00:00" />' +
            '</div>'
        ),
        scope: true,
        link: function ($scope, element, attrs, ngModel) {

            // маска для поля
            $scope.pattern = "(2[0-3]|[0-1][0-9]):([0-5][0-9])";

            // следим за значением внутри компонента
            $scope.$watch('value', function(val) {

                var time = String(val).split(":"),
                    newValue,
                    oldValue;

                // если время вбито правильно
                if(time.length==2) {

                    // получаем старую дату
                    if(ngModel.$viewValue) {
                        oldValue = new Date(ngModel.$viewValue);
                    }
                    else {
                        oldValue = new Date();
                        oldValue.setHours(0, 0);
                    }

                    // формируем новую дату
                    newValue = new Date(oldValue);
                    newValue.setHours(parseInt(time[0]), parseInt(time[1]));

                    // если задана новая дата то передаем ее в родительскую модель
                    if(newValue.getTime() != oldValue.getTime()) {
                        ngModel.$setViewValue(newValue);
                    }
                }
                // если время не вбили вообще
                else if (val==='') {
                    ngModel.$setViewValue(null);
                }
            });

            // заполняем значение внутреннего поля
            ngModel.$render = function () {
                $scope.value = $filter('date')(new Date(ngModel.$viewValue), 'HH:mm');
            };
        }
    };
}]);
