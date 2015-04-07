
/* ui-switch */

angular.module('directives', ['ng']).directive('uiSwitch', [function() {
    return {
        require: 'ngModel',
        restrict: 'AE',
        replace: true,
        scope: {},
        template: (
            '<div ng-class="{\'ui-switch-on\': model, \'ui-switch-off\': !model}" ng-click="toggle()" class="ui-switch ui-switch-xs">' +
                '<div class="ui-switch-container">' +
                    '<span class="ui-switch-handle-on">ON</span>' +
                    '<span class="ui-switch-label">&nbsp;</span>' +
                    '<span class="ui-switch-handle-off">OFF</span>' +
                '</div>' +
            '</div>'
        ),
        link: function(scope, element, attrs, ngModel) {
            function updateModel() {
                scope.model = ngModel.$viewValue;
                return scope.model;
            };
            scope.toggle = function() {
                ngModel.$setViewValue(!ngModel.$viewValue);
                return updateModel();
            };
            ngModel.$render = function() {
                return updateModel();
            };
            return ngModel.$render;
        }
    };
}]);
