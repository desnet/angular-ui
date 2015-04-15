
/* uiWeekdayInterval */

uis.directive('uiWeekdaySwitch', ['$translate', function($translate) {

    var weekdays = ['SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA'],
        firstWeekday = weekdays.indexOf($translate.instant('WEEK.FIRST_DAY'));

    // первый день не может быть меньше нуля
    if(firstWeekday<0) firstWeekday = 0;

    return {
        restrict: 'AE',
        transclude: true,
        replace: true,
        templateUrl: "ui-weekday-switch.html",
        scope: {
            model: '=uiModel'
        },
        link: function($scope) {

            // построение дней для вывода
            function build(val) {

                var i, wd = [];

                // находим первый день недели и трансформируем если нужно
                for(i=firstWeekday; i<weekdays.length; i++) {
                    wd.push({key: i, name: weekdays[i], selected: val.indexOf(i) >= 0});
                }
                for(i=0; i<firstWeekday; i++) {
                    wd.push({key: i, name: weekdays[i], selected: val.indexOf(i) >= 0});
                }
                return wd;
            }

            // выбор дня недели
            $scope.toggle = function(weekday) {

                var i = $scope.model.indexOf(weekday.key);

                if(i >= 0) {
                    $scope.model.splice(i, 1);
                    weekday.selected = false;
                }
                else {
                    $scope.model.push(weekday.key);
                    $scope.model.sort();
                    weekday.selected = true;
                }

            };

            // заглушка, если модель пуста
            if(!$scope.model) {
                $scope.model = [];
            }

            $scope.$watchCollection('model', function(val) {
                $scope.weekdays = build(val);
            });
        }
    };
}]);
