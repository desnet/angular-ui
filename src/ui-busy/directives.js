
/* ui-busy */

angular.module('directives', ['ng']).directive('uiBusy', ['$timeout', function($timeout) {
    return {
        restrict: 'A', //attribute or element
        replace: false,
        scope: {
            value: '=uiBusy'
        },
        link: function ($scope, element) {

            var loader = angular.element('<div class="ui-busy"><i class="glyphicon glyphicon-refresh"></i></div>'),
                position = element.css('position'),
                timer;

            function showLoader() {
                element.css('position', 'relative');
                element.append(loader);
            }

            function hideLoader() {
                if(position) {
                    element.css('position', position);
                }
                loader.remove();
            }

            function thenLoader(){
                $timeout.cancel(timer);
                hideLoader();
            }

            $scope.$watch('value', function(value){
                if(value) {
                    if(value.$promise && typeof value.$promise.then == 'function') {
                        timer = $timeout(showLoader, 400);
                        value.$promise.then(thenLoader);
                    }
                    else if(typeof value.then == 'function') {
                        timer = $timeout(showLoader, 400);
                        value.then(thenLoader);
                    }
                }
            }, true);
        }
    };
}]);
