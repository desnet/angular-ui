
/* присваивает innerHtml элемента в переменную */

angular.module('directives', ['ng']).directive('uiHtml', ['$compile', '$timeout', function($compile, $timeout) {
    return {
        restrict: 'AE',
        link: function ($scope, element, attr) {
            if(element.html()) {
                $timeout(function(){
                    $scope.$apply(function() {
                        $scope[attr.uiHtml] = element.html().replace(/^\s+|\s+$/gm,'');
                    });
                }, 0);
            }
        }
    };
}]);
