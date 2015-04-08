
/* ui-switch */

angular.module('directives', ['ng']).directive('uiSwitch', [function() {
    return {
        require: 'ngModel',
        restrict: 'AE',
        replace: true,
        templateUrl: "ui-switch.html",
        scope: {},
        link: function(scope, element, attrs, ngModel) {
            function updateModel() {
                scope.model = ngModel.$viewValue;
                return scope.model;
            }
            scope.toggle = function() {
                ngModel.$setViewValue(!ngModel.$viewValue);
                return updateModel();
            };
            ngModel.$render = function() {
                return updateModel();
            };
            $timeout(function(){
                scope.init = true;
            }, 1000);
            return ngModel.$render;
        }
    };
}]);
