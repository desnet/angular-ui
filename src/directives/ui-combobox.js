
/* uiCombo */

uis.directive('uiComboBox', ['$document', function($document) {
    return {
        restrict: 'E',
        require: '^ngModel',
        replace: true,
        templateUrl: "ui-combobox.html",
        scope: {
            options: '=uiOptions'
        },
        link: function($scope, element, attrs, ngModel) {

            $scope.nodes = $scope.options && $scope.options.data;
            $scope.isDisabled = $scope.options && $scope.options.disabled;
            $scope.selected = {};

            // выбор елемента
            $scope.open = function(e) {
                e.preventDefault();
                e.stopPropagation();
                $scope.isOpen = $scope.isDisabled ? false : !$scope.isOpen;
            };

            // выбор елемента
            $scope.select = function(node) {
                $scope.selected = node;
                ngModel.$setViewValue(node.value);
            };

            // выбираем значение при рендере
            ngModel.$render = function () {
                for(var i=0; i<$scope.nodes.length; i++) {
                    if($scope.nodes[i].value==ngModel.$viewValue) {
                        $scope.selected = $scope.nodes[i];
                        break;
                    }
                }
            };

            // скрываем при клике по документу
            $document.on('click', function(e) {
                if($scope.isOpen) {
                    $scope.isOpen = false;
                    $scope.$apply();
                }
            });
        }
    };
}]);
