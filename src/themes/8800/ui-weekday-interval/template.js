angular.module('directives').run(['$templateCache', function($templateCache) {
    $templateCache.put('ui-weekday-interval.html',
        '<span ng-repeat="interval in intervals">' +
            '{{interval}}<span ng-if="!$last">, </span>' +
        '</span>'
    );
}]);
