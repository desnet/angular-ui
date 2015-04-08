angular.module('directives').run(['$templateCache', function($templateCache) {
    $templateCache.put('ui-checkbox.html',
        '<div class="ui-checkbox" ng-click="toggle()">' +
            '<i ng-class="{\'icon-checkbox-partial\': !checked && marked,\'icon-checkbox-unchecked\': !checked && !marked, \'icon-checkbox-checked\': checked}"></i>' +
            '<span ng-transclude></span>' +
        '</div>'
    );
}]);
