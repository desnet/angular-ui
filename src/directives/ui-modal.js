
/* uiModal */

angular.module('directives', ['ng']).directive('uiModal', ['$document', function($document) {
    return {
        restrict: 'AE',
        replace: true,
        templateUrl: "ui-modal.html",
        transclude: true,
        link: function ($scope, element, attr) {

            var modal = element.children(),
                width = modal.outerWidth(),
                height = modal.outerHeight();

            modal.css({
                'width':        width,
                //'height':       height,
                'margin-left':  -parseInt(width / 2) + 'px',
                'margin-top':   -parseInt(height / 2) - 30 + 'px'
            });
        }
    };
}]);
