
/* uiFormError */

angular.module('directives', ['ng']).directive('uiFormError', ['$document', '$parse', '$compile', '$translate', 'uiTooltipDirective', function($document, $parse, $compile, $translate, d) {
    return angular.extend({}, d[0], {
        priority: 0,
        require: ['^form', '^?ngModel', 'uiTooltip'],
        compile: function () {
            return function ($scope, element, attr, ctrls) {

                var ngForm = ctrls.shift(), ngModel = ctrls.shift(), uiTooltip = ctrls.shift(),
                    parts = 0,
                    config = {field: '', location: 'right', template: ''},
                    path;

                // если переданы настройки
                if(attr.uiFormError) {

                    if(attr.uiFormError.charAt(0)=='{') {
                        angular.extend(config, $parse(attr.uiFormError)($scope));
                    }
                    else {
                        config.field = attr.uiFormError;
                    }

                    // считаем длинну пути до поля
                    if(config.field) {
                        parts = config.field.split('.').length;
                    }
                }

                // если путь передан в параметре директивы
                if(parts>1) {
                    path = config.field;
                }
                // если неполный путь или не передан
                else {
                    if(!ngForm || (parts==1 && !ngModel)) throw new Error();
                    path = ngForm.$name + '.' + (parts==1 ? config.field : ngModel.$name);
                }

                // если пути не существует
                if(!$parse(path)($scope)) {
                    throw new Error();
                }

                // конфигурируем подсказку
                uiTooltip.location = config.location;

                function show($error) {

                    if($translate && !config.template) {

                        var tKeys = [],
                            tPath = ['ERRORS'].concat(path.split('.')),
                            tLength = tPath.length;

                        for (var errKey in $error) {
                            for (var i = 0; i < tLength; i++) {
                                tKeys.push(tPath.concat([errKey.replace(/^ui([A-Z].+)/, '$1')]).join('.').toUpperCase());
                                tPath.pop();
                            }
                        }

                        $translate(tKeys).then(function(translations) {
                            for(var i=0; i<tKeys.length; i++) {
                                if(translations[tKeys[i]]!=tKeys[i]) {
                                    uiTooltip.show(translations[tKeys[i]]);
                                    break;
                                }
                            }
                        });
                    }
                    else {
                        uiTooltip.show(config.template || path, true);
                    }
                }

                // наблюдаем за ошибками
                $scope.$watch(path + '.$error', function($error) {

                    if(!angular.equals($error, {})) {

                        if(element.filter(":focus").length) {
                            show($error);
                        }

                        element.on('mouseout', function() {
                            uiTooltip.hide();
                        });

                        element.on('mouseover', function() {
                            show($error);
                        });
                    }
                    else {
                        element.off('mouseout mouseover');
                        uiTooltip.hide();
                    }
                }, true);
            };
        }
    });
}]);
