(function(){
    'use strict';

    /* изолированая вложенная форма */
    angular.module('directives', ['ng']).directive('isolatedForm', function(){
        return {
            restrict: 'A',
            require: 'form',
            link: function(scope, formElement, attrs, formController) {

                var parentFormCtrl = formElement.parent().controller('form'),
                    core$setValidity = formController.$setValidity;

                formController.$setValidity = function(validationToken, isValid, control) {
                    core$setValidity(validationToken, isValid, control);
                    if (!isValid && parentFormCtrl) {
                        parentFormCtrl.$setValidity(validationToken, true, formController);
                    }
                };
            }
        };
    });
})();
