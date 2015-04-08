angular.module('directives').run(['$templateCache', function($templateCache) {
    $templateCache.put('ui-time.html',
        '<div class="ui-time">' +
            '<input type="text" ng-model="value" ng-pattern="pattern" placeholder="00:00" />' +
        '</div>'
    );
}]);
