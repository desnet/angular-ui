
/* ui-notify */

angular.module('directives', ['ng']).directive('uiNotify', ['$timeout', function($timeout) {
    return {
        restrict: 'AE',
        replace: true,
        template: '<div ng-class="{\'show\': isShow}" class="ui-notify"><i ng-click="hide()" class="ui-notify-close icon-close"></i>{{text}}</div>',
        scope: {
            config: '=uiNotify',
            notify: '=uiModel'
        },
        link: function($scope, element) {

            var timer;

            $scope.hide = function() {
                element.hide();
                $scope.isShow = false;
            };

            $scope.config = angular.extend({
                autohide: 0
            }, $scope.config);

            $scope.$watch('notify', function(notify){

                if (notify!==null && !angular.isUndefined(notify)) {

                    $scope.hide();

                    $scope.notify = null;
                    $scope.text = notify;

                    // блочный элемент
                    element.show();

                    // выравниваем по середине через $timeout и $apply так-как это нужно делать после вставки текста в шаблон
                    $timeout(function () {
                        $scope.$apply(function() {
                            element.css('margin-left', -parseInt(element.innerWidth()/2));
                            $scope.isShow = true;
                        });
                    }, 0);

                    // если таймер закрытия был создан, удаляем его
                    if (timer) {
                        $timeout.cancel(timer);
                        timer = false;
                    }

                    // если нужно автозакрытие
                    if ($scope.config.autohide) {
                        timer = $timeout($scope.hide, $scope.config.autohide);
                    }
                }
            });
        }
    };
}]);
