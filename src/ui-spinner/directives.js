
/* ui-spinner */

angular.module('directives', ['ng']).directive('uiSpinner', [function() {
    return {
        require: 'ngModel',
        restrict: 'AE',
        replace: true,
        scope: {
            options: '=uiSpinnerOptions'
        },
        template: (
            '<div class="ui-spinner">' +
                '<input type="text" ng-model="model" class="ui-spinner-input ui-field">' +
                '<span class="ui-spinner-btn-container">' +
                    '<button type="button" ng-click="plus()" class="ui-btn ui-btn-default ui-spinner-btn ui-spinner-plus"><i class="ui-spinner-up glyphicon glyphicon-chevron-up"></i></button>' +
                    '<button type="button" ng-click="minus()" class="ui-btn ui-btn-default ui-spinner-btn ui-spinner-minus"><i class="ui-spinner-down glyphicon glyphicon-chevron-down"></i></button>' +
                '</span>' +
            '</div>'
        ),
        link: function(scope, element, attrs, ngModel) {

            var options = scope.options;

            scope.plus = function() {
                scope.model++;
            };

            scope.minus = function() {
                scope.model--;
            };

            scope.$watch('model', function(newVal, oldVal) {
                if(!String(newVal).match(/^(\-)?(\d*)$/) || options && ((typeof options.max == 'number' && newVal>options.max) || (typeof options.min == 'number' && newVal<options.min))) {
                    newVal = oldVal;
                    scope.model = oldVal;
                }
                ngModel.$setViewValue(newVal);
            });

            ngModel.$render = function() {
                if(!ngModel.$viewValue) {
                    ngModel.$setViewValue(0);
                    scope.model = 0;
                }
                else {
                    scope.model = ngModel.$viewValue;
                }
                return scope.model;
            };

            return ngModel.$render;
        }
    };
}]);
