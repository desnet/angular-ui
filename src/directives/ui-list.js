
/* ui-list-box */

uis.directive('uiList', [function() {
    return {
        require: '^ngModel',
        restrict: 'AE',
        replace: true,
        templateUrl: "ui-list-box.html",
        scope: true,
        compile: function(tElement, tAttrs) {

            var contents = angular.element(tElement.context.innerHTML);

            // если в контенте 1 элемент и он li, то нужно итерировать его
            if(contents.length==1 && contents[0].tagName && contents[0].tagName.toLowerCase()=='li') {
                tElement.contents().remove();
                tElement.append(contents);
            }
            else {
                tElement.contents().append(tElement.context.innerHTML);
            }

            // назначаем репитер и фильтры
            tElement.contents().attr('ng-repeat', 'node in nodes' + (tAttrs.filter ? ' | ' + tAttrs.filter : ''));

            return function ($scope, element, attrs, ngModel) {

                ngModel.$render = function () {
                    $scope.nodes = ngModel.$viewValue;
                };

                $scope.$watchCollection('nodes', function() {
                    ngModel.$validate();
                });
            };
        }
    };
}]);
