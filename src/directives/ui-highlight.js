
/* uiHt */

uis.directive('uiHighlight', ['$window', function($window) {
    return {
        restrict: 'AE',
        replace: true,
        transclude: true,
        templateUrl: 'ui-highlight.html',
        link: function (scope, element, attr) {
            var el = element.children();
            //el.html(el.html().replace(/</g, '&lt;').replace(/>/g, '&gt;'));
            $window.hljs.highlightBlock(el[0]);
        }
    };
}]);