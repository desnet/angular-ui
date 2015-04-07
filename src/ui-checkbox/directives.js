
/* ui-checkbox */

angular.module('directives', ['ng']).directive('uiCheckbox', function () {
    return {
        priority: 0,
        require: '^ngModel',
        restrict: 'EA',
        replace: true,
        transclude: true,
        template: (
            '<div class="ui-checkbox" ng-click="toggle()">' +
                '<i ng-class="{\'icon-checkbox-partial\': !checked && marked,\'icon-checkbox-unchecked\': !checked && !marked, \'icon-checkbox-checked\': checked}"></i>' +
                '<span ng-transclude></span>' +
            '</div>'
        ),
        scope: {
            value: '=',
            marked: '=uiMarked'
        },
        link: function ($scope, element, attrs, ngModel) {

            $scope.checked = false;

            ngModel.$render = function () {
                $scope.checked = angular.isUndefined($scope.value) ? ngModel.$viewValue : $scope.value == ngModel.$viewValue;
            };

            $scope.toggle = function() {

                if(attrs.disabled) {
                    return false;
                }

                if(angular.isUndefined($scope.value)) {
                    $scope.checked = !$scope.checked;
                    }
                    else {
                    $scope.checked = $scope.value == ngModel.$viewValue ? '' : $scope.value;
                }

                ngModel.$setViewValue($scope.checked);
            };
        }
    };
});
