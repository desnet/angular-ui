angular.module('directives').run(['$templateCache', function($templateCache) {
    $templateCache.put('ui-switch.html',
        '<div class="ui-switch" ng-class="{\'ui-switch-init\': init,\'ui-switch-left\': !model, \'ui-switch-right\': model}" ng-click="toggle()">' +
            '<div class="ui-switch-button icon-list">&nbsp;</div>' +
        '</div>'
    );
}]);
