
/* применяется для группировки строк таблиц */

uis.directive('uiRowGroup', [function() {
    return {
        restrict: 'AE',
        link: function ($scope, element, attr) {

            var length = 0;

            function getLength() {
                return length || element.children().length - 1;
            }

            element.addClass('group');

            $scope.groupToggle = function(e) {
                if(e && e.preventDefault) {
                    e.preventDefault();
                }

                if(getLength()>0) {
                    element.toggleClass('opened');
                }
            };

            if(attr.uiRowGroup) {
                $scope.$watch(attr.uiRowGroup, function(val) {

                    if(val && !angular.isUndefined(val.length)){
                        length = val.length;
                    }
                    if(getLength()<1) {
                        element.removeClass('opened');
                    }
                });
            }
            else {
                if(getLength()<1) {
                    element.removeClass('opened');
                }
            }
        }
    };
}]);
