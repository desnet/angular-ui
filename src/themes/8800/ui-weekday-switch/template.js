angular.module('directives').run(['$templateCache', function($templateCache) {
    $templateCache.put('ui-weekday-switch.html',
        '<table class="ui-weekday-switch">' +
            '<tr>' +
                '<th colspan="5" translate="WEEK.WORKING">Рабочие</th>' +
                '<th colspan="2" translate="WEEK.WEEKEND">Выходные</th>' +
            '</tr>' +
            '<tr>' +
                '<td ng-repeat="weekday in weekdays" ng-click="toggle(weekday)" ng-class="{active: weekday.selected}">{{"WEEK." + weekday.name | translate}}.</td>' +
            '</tr>' +
        '</table>'
    );
}]);
