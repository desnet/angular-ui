
/* сравнение паролей */

angular.module('directives', ['ng']).directive("uiCompareTo", function() {
    return {
        require: "ngModel",
        scope: {
            otherModelValue: "=uiCompareTo"
        },
        link: function(scope, element, attributes, ngModel) {

            ngModel.$validators.compareTo = function(modelValue) {
                return modelValue == scope.otherModelValue;
            };

            scope.$watch("otherModelValue", function() {
                ngModel.$validate();
            });
        }
    };
});
