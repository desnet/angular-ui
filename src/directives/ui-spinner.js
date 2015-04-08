
/* ui-spinner */

angular.module('directives', ['ng']).directive('uiSpinner', [function() {
    return {
        require: 'ngModel',
        restrict: 'AE',
        replace: true,
        templateUrl: "ui-spinner.html",
        scope: {
            options: '=uiSpinnerOptions'
        },
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
