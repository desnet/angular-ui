
/* uiWeekdayInterval */

angular.module('directives', ['ng']).directive('uiWeekdayInterval', ['$translate', function($translate) {

    var weekdays = ['SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA'],
        firstWeekday = weekdays.indexOf($translate.instant('WEEK.FIRST_DAY'));

    // первый день не может быть меньше нуля
    if(firstWeekday<0) firstWeekday = 0;

    function build(val) {

        var i, key=0, iv=[], res = [], wd = [];

        // копируем чтобы не изменить
        val = angular.copy(val);

        // сортируем
        val.sort();

        // находим первый день недели и трансформируем если нужно
        for(i=firstWeekday; i<weekdays.length; i++, key++) {
            if(val.indexOf(i)>=0) wd.push({key: key, name: weekdays[i]});
        }
        for(i=0; i<firstWeekday; i++, key++) {
            if(val.indexOf(i)>=0) wd.push({key: key, name: weekdays[i]});
        }

        // ищем интервалы
        for(i=0; i<wd.length; i++) {
            if(typeof wd[i-1] != 'undefined' && wd[i].key-wd[i-1].key > 1) {
                iv.push(wd.splice(0, i));
                i=0;
            }
        }

        // добавляем оиночный день, если он остался
        if(wd.length) {
            iv.push(wd);
        }

        // выводим интервалы
        for(i=0; i<iv.length; i++) {
            if(iv[i].length==1) {
                res.push($translate.instant('WEEK.' + iv[i][0].name));
            }
            else if(iv[i].length==2) {
                res.push($translate.instant('WEEK.' + iv[i][0].name), $translate.instant('WEEK.' + iv[i][1].name));
            }
            else {
                res.push($translate.instant('WEEK.' + iv[i][0].name) + '-' + $translate.instant('WEEK.' + iv[i][iv[i].length-1].name));
            }
        }

        return res;
    }

    return {
        restrict: 'AE',
        template: (
            '<span ng-repeat="interval in intervals">' +
                '{{interval}}<span ng-if="!$last">, </span>' +
            '</span>'
        ),
        replace: true,
        scope: {
            model: '=uiModel'
        },
        link: function($scope) {
            $scope.$watch('model', function(val) {
                $scope.intervals = build(val);
            });
        }
    };
}]);
