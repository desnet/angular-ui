
/* uiCombo */

angular.module('directives', ['ng']).directive('uiCombo', ['$document', function($document) {
    return {
        restrict: 'AE',
        scope: {
            value: '=uiModel'
        },
        link: function($scope, element, attrs) {

            var variable = element.children('var');

            $scope.setValue = function(value) {

                if(!value) {
                    return true;
                }

                element.find("[data-value]").each(function() {
                    var $this = $(this);
                    if($this.data('value')==value) {

                        $this.addClass('active');
                        variable.html($this.html());

                        // изменяем модель только если данные изменились
                        if(typeof $scope.value != 'undefined' && $scope.value!=value) {
                            $scope.$apply(function() {
                                $scope.value = value;
                            });
                        }
                    }
                    else {
                        $this.removeClass('active');
                    }
                });
            };

            $scope.$watch('value', $scope.setValue);

            element.on('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                if($scope.disabled) return false;
                $scope.setValue($(e.target).data('value'));
                element.toggleClass('open');
                $document.triggerHandler('click', this);
            });

            $document.on('click', function(e, el) {
                if(el!=element[0] && element.hasClass('open')) {
                    element.removeClass('open');
                }
            });

            // отключение
            attrs.$observe('disabled', function(disabled) {
                $scope.disabled = disabled;
            });
        }
    };
}]);
