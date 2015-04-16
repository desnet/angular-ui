(function(){var uis = angular.module('ui', ['ui.tpls', 'ng']);


/* ui-busy */

uis.directive('uiBusy', ['$timeout', '$templateCache', function($timeout, $templateCache) {
    return {
        restrict: 'A', //attribute or element
        replace: false,
        scope: {
            value: '=uiBusy'
        },
        link: function ($scope, element) {

            var loader = angular.element($templateCache.get('ui-busy.html')),
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


/* ui-captcha */

uis.directive('uiCaptcha', [function() {

    // класс капчи
    function Captcha() {
        this.getToken();
        this.reload();
    }

    // перезагрузить картинку
    Captcha.prototype.reload = function reload() {
        this.code = '';
        this.url = '?token=' + this.token + '&time=' + new Date().getTime();
    };

    // получить токен
    Captcha.prototype.getToken = function getToken() {

        var result  = '',
            words   = '0123456789abcdef',
            position = 0,
            max_position = words.length - 1;

        for(var i = 0; i < 16; ++i ) {
            position = Math.floor(Math.random() * max_position);
            result = result + words.substring(position, position + 1);
        }

        this.token = result;

        return result;
    };

    return {
        restrict: 'AE',
        replace: true,
        templateUrl: "ui-captcha.html",
        scope: {
            model: '=uiModel'
        },
        link: function($scope, element, attr) {

            $scope.captcha = new Captcha();
            $scope.src = attr.src || '';

            if(attr.uiModel && attr.uiModel.charAt(0)!='{') {
                $scope.model = $scope.captcha;
            }

            $scope.$watch('captcha.url', function() {
                $scope.update = true;
            });

            element.find('img').load(function(){
                $scope.$apply(function(){
                    $scope.update = false;
                });
            });
        }
    };
}]);



/* ui-checkbox */

uis.directive('uiCheckbox', function () {
    return {
        priority: 0,
        require: '^ngModel',
        restrict: 'EA',
        replace: true,
        transclude: true,
        templateUrl: "ui-checkbox.html",
        scope: {
            value: '=',
            marked: '=uiMarked'
        },
        link: function ($scope, element, attrs, ngModel) {

            $scope.checked = false;

            ngModel.$render = function () {
                $scope.checked = angular.isUndefined($scope.value) ? ngModel.$viewValue : $scope.value == ngModel.$viewValue;
            };

            $scope.toggle = function() {

                if(attrs.disabled) {
                    return false;
                }

                if(angular.isUndefined($scope.value)) {
                    $scope.checked = !$scope.checked;
                }
                else {
                    $scope.checked = $scope.value == ngModel.$viewValue ? '' : $scope.value;
                }

                ngModel.$setViewValue($scope.checked);
            };
        }
    };
});


/* uiCombo */

uis.directive('uiComboBox', ['$document', function($document) {
    return {
        restrict: 'E',
        require: '^ngModel',
        replace: true,
        templateUrl: "ui-combobox.html",
        scope: {
            options: '=uiOptions'
        },
        compile: function (tElement) {
            return function($scope, element, attrs, ngModel) {

                $scope.nodes = $scope.options && $scope.options.data;
                $scope.isDisabled = $scope.options && $scope.options.disabled;
                $scope.selected = {};

                // выбор елемента
                $scope.open = function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    $scope.isOpen = $scope.isDisabled ? false : !$scope.isOpen;
                };

                // выбор елемента
                $scope.select = function(node) {
                    $scope.selected = node;
                    ngModel.$setViewValue(node.value);
                };

                // выбираем значение при рендере
                ngModel.$render = function () {
                    for(var i=0; i<$scope.nodes.length; i++) {
                        if($scope.nodes[i].value==ngModel.$viewValue) {
                            $scope.selected = $scope.nodes[i];
                            break;
                        }
                    }
                };

                // скрываем при клике по документу
                $document.on('click', function(e) {
                    if($scope.isOpen) {
                        $scope.isOpen = false;
                        $scope.$apply();
                    }
                });
            };
        }
    };
}]);


/* сравнение паролей */

uis.directive("uiCompareTo", function() {
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


/* uiConfirm */

uis.directive('uiConfirm', ['$document', '$compile', '$templateCache', '$sce', function($document, $compile, $templateCache, $sce) {

    function Confirm(scope) {

        var self = this;

        // создаем
        this.$scope = scope.$new();

        // отмена
        this.$scope.cancel = function() {
            if(angular.isFunction(self.onCancel)) self.onCancel();
            self.hide();
        };

        // подтверждение
        this.$scope.success = function() {
            if(angular.isFunction(self.onSuccess)) self.onSuccess();
            self.hide();
        };

        // свойства
        this.title = '';
        this.content = '';
    }

    Confirm.prototype = {

        // шаблон
        template: $templateCache.get('ui-confirm.html'),

        // показать
        show: function() {

            var self = this;

            // задаем переменные
            this.$scope.title = this.title;
            this.$scope.content = this.content;

            // применяем к окружению
            this.$scope.$apply(function() {
                // создаем и добавляем в DOM
                self.$confirm = $compile(self.template)(self.$scope);
                self.$confirm.appendTo($document.find('body'));
            });
        },

        // скрыть
        hide: function() {
            this.$confirm.remove();
        }

    };

    return {
        restrict: 'A',
        scope: true,
        link: function ($scope, element, attr) {

            var uiConfirm = new Confirm($scope);

            element.on('click', function() {
                uiConfirm.show();
            });

            $scope.$watch(attr.uiConfirm, function(value) {
                angular.extend(uiConfirm, value);
            });

        }
    };
}]);


/* date-picker */

uis.directive('uiDatepicker', ['$document', function($document) {
    return {
        restrict: "AE",
        transclude: true,
        replace: true,
        templateUrl: "ui-date-picker.html",
        scope: {
            value: '=uiModel',
            cfg: '=uiDatepicker',
            opt: '=uiOptions'
        },
        controller: function($scope) {

            var config = $scope.cfg || $scope.opt;

            // параметры по умолчанию
            $scope.config = {
                empty: false,
                daysOfYear: false,
                limitFrom: null,
                limitTo: null
            };

            // объеденяем настройки
            if(angular.isObject(config)) {
                for(var key in $scope.config) {
                    if(config[key]) {
                        $scope.config[key] = (key=='limitFrom' || key=='limitTo') ? new Date(config[key]) : config[key];
                    }
                }
            }

            // включаем навигацию
            $scope.isPrev = true;
            $scope.isNext = true;
            $scope.isPrevYear = true;
            $scope.isNextYear = true;

            // отключаем навигацию по годам
            if($scope.config.daysOfYear) {
                $scope.isPrevYear = false;
                $scope.isNextYear = false;
            }

            // навигация по датам
            $scope.prev = function prevMonth() {
                if($scope.isPrev) $scope.buildCalendar($scope.date.setMonth($scope.date.getMonth() - 1));
                if($scope.config.daysOfYear && new Date($scope.date.getFullYear(), $scope.date.getMonth() - 1).getFullYear() != $scope.date.getFullYear()) {
                    $scope.isPrev = false;
                }
                if(!$scope.isNext) $scope.isNext = true;
            };
            $scope.prevYear = function prevYear() {
                if($scope.isPrevYear) $scope.buildCalendar($scope.date.setYear($scope.date.getFullYear() - 1));
            };
            $scope.next = function nextMonth() {
                if($scope.isNext) $scope.buildCalendar($scope.date.setMonth($scope.date.getMonth() + 1));
                if($scope.config.daysOfYear && new Date($scope.date.getFullYear(), $scope.date.getMonth() + 1).getFullYear() != $scope.date.getFullYear()) {
                    $scope.isNext = false;
                }
                if(!$scope.isPrev) $scope.isPrev = true;
            };
            $scope.nextYear = function nextYear() {
                if($scope.isNextYear) $scope.buildCalendar($scope.date.setYear($scope.date.getFullYear() + 1));
            };
            $scope.today = function today() {
                $scope.buildCalendar();
                $scope.isNext = true;
                $scope.isPrev = true;
            };

            // конвертация дней в году и наоборот
            $scope.getDayOfYear = function getDayOfYear(date, days) {
                date = new Date(date);
                if(!angular.isUndefined(days)) {
                    return days * 86400000 + new Date(date.getFullYear(), 0, 0).getTime();
                }
                else {
                    return parseInt((date.getTime() - new Date(date.getFullYear(), 0, 0).getTime()) / 86400000);
                }
            };

            // конструктор календаря
            $scope.buildCalendar = function buildCalendar(value) {

                var date = value ? new Date(value) : new Date(),
                    startDate = new Date(date),
                    startMonth = startDate.getMonth(),
                    startYear = startDate.getYear(),
                    weeks = [];

                startDate.setDate(1);
                if($scope.config.daysOfYear) startDate.setHours(0);

                if (startDate.getDay() === 0) {
                    startDate.setDate(-6);
                } else {
                    startDate.setDate(startDate.getDate() - startDate.getDay());
                }
                if (startDate.getDate() === 1) {
                    startDate.setDate(-6);
                }

                while (weeks.length < 6) { // creates weeks and each day
                    if (date.getYear() === startYear && date.getMonth() > startMonth) break;
                    var week = [];
                    for (var i = 0; i < 7; i++) {
                        week.push({
                            day: startDate.getTime(),
                            selected: $scope.selected.indexOf(startDate.getTime())>=0,
                            disabled: ($scope.config.daysOfYear && startDate.getYear() != startYear) || ($scope.config.limitFrom && startDate.getTime() < $scope.config.limitFrom.getTime()) || ($scope.config.limitTo && startDate.getTime() > $scope.config.limitTo.getTime()),
                            notCurrentMonth: startDate.getMonth() != startMonth,
                            notCurrentYear: startDate.getYear() != startYear
                        });
                        startDate.setDate(startDate.getDate() + 1);
                    }
                    weeks.push(week);
                }

                // значение в инпуте
                $scope.date = date;
                $scope.weeks = weeks; // Week Array
            };

            // выбор дня
            $scope.selectDay = function selectDay(date) {

                // дата блокирована
                if(date.disabled) {
                    return false;
                }

                if(!angular.isArray($scope.value)) {

                    // конвертируем даты в дни года, если нужно и задаем значание
                    if($scope.config.daysOfYear) {
                        $scope.value = $scope.getDayOfYear(date.day);

                    }
                    // залаем новую дату, сохраняя при этом часы, минуты, секунды
                    else if($scope.value) {
                        var oldVal = new Date($scope.value);
                        $scope.value = new Date(date.day).setHours(oldVal.getHours(), oldVal.getMinutes(), oldVal.getSeconds(), oldVal.getMilliseconds());
                    }
                    else {
                        $scope.value = date.day;
                    }

                    // задаем список выбраных
                    $scope.selected.splice(0, $scope.selected.length, $scope.value);

                    // скрываем календарь
                    $scope.selecting = !$scope.selecting;

                    // перестраиваем календарь
                    $scope.buildCalendar($scope.value);
                }
                else {
                    var index = $scope.selected.indexOf(date.day);

                    // дата выбрана
                    date.selected = index<0;

                    // добавляем значение в список выбраных
                    if(date.selected) $scope.selected.push(date.day); else $scope.selected.splice(index, 1);

                    // конвертируем даты в дни года, если нужно и задаем значание
                    if($scope.config.daysOfYear) {
                        $scope.value.splice(0, $scope.value.length);
                        for(var i=0; i<$scope.selected.length; i++) {
                            $scope.value.push($scope.getDayOfYear($scope.selected[i]));
                        }
                    }
                    else {
                        $scope.value = angular.copy($scope.selected);
                    }
                }
            };
            $scope.days = ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"];
            $scope.weeks = [];
        },
        link: function($scope, element, attrs) {

            if(angular.isArray($scope.value) && $scope.value.length) {
                $scope.selected = angular.copy($scope.value);
            }
            else if(!angular.isArray($scope.value) && $scope.value) {
                $scope.selected = [angular.copy($scope.value)];
            }
            else {
                $scope.selected = [];
            }

            // конвертируем дни года в даты, если нужно
            if($scope.config.daysOfYear) {
                var date = new Date();
                for(var i=0; i<$scope.selected.length; i++) {
                    $scope.selected[i] = $scope.getDayOfYear(date, $scope.selected[i]);
                }
            }

            // если пустой и сконфигурирован как не пустой
            if(!$scope.selected.length && !$scope.config.empty) {
                $scope.selected.push($scope.config.daysOfYear ? new Date().setHours(0) : new Date().getTime());
            }

            // функция показа/скрытия календаря
            $scope.selectDate = function selectDate() {
                if($scope.disabled) return false;
                $scope.selecting = !$scope.selecting;
                element.children('div').css('top', element.offset().top + element.outerHeight() - $document.scrollTop());
            };

            // строим календарь
            $scope.buildCalendar($scope.selected[0]);

            // клик по календарю
            element.on('click', function(e) {
                e.stopPropagation();
                $document.triggerHandler('click', this);
            });

            // для скрытия календаря по клику в не его
            $document.on('click', function(e, el) {
                if(el!=element[0] && $scope.selecting) {
                    $scope.$apply(function () {
                        $scope.selecting = false;
                    });
                }
            });

            // отключение каледаря
            attrs.$observe('disabled', function(disabled) {
                $scope.disabled = disabled;
            });
        }
    };
}]);


/* uiFormError */

uis.directive('uiFormError', ['$document', '$parse', '$compile', '$translate', 'uiTooltipDirective', function($document, $parse, $compile, $translate, d) {
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

/* присваивает innerHtml элемента в переменную */

uis.directive('uiHtml', ['$compile', '$timeout', function($compile, $timeout) {
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


/* изолированая вложенная форма */
uis.directive('isolatedForm', function(){
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


/* ui-list-box */

uis.directive('uiList', [function() {
    return {
        require: '^ngModel',
        restrict: 'AE',
        replace: true,
        templateUrl: "ui-list-box.html",
        scope: true,
        compile: function(tElement, tAttrs) {

            var contents = angular.element(tElement.context.innerHTML);

            // если в контенте 1 элемент и он li, то нужно итерировать его
            if(contents.length==1 && contents[0].tagName && contents[0].tagName.toLowerCase()=='li') {
                tElement.contents().remove();
                tElement.append(contents);
            }
            else {
                tElement.contents().append(tElement.context.innerHTML);
            }

            // назначаем репитер и фильтры
            tElement.contents().attr('ng-repeat', 'node in nodes' + (tAttrs.filter ? ' | ' + tAttrs.filter : ''));

            return function ($scope, element, attrs, ngModel) {

                ngModel.$render = function () {
                    $scope.nodes = ngModel.$viewValue;
                };

                $scope.$watchCollection('nodes', function() {
                    ngModel.$validate();
                });
            };
        }
    };
}]);


/* uiModal */

uis.directive('uiModal', ['$document', function($document) {
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


/* uiNoBind */

(function(angular, module) {

    var timeoutWait = 100;
    var destroyParam = 'noBind-DestroyMe';

    var ctrlBind = function($parse, $timeout) {
        return function($scope) {
            var resolveValueWithoutWatching = function(varExpression, func) {
                var workingScope = this;
                // varExpression.exp is passed as the 'old' value
                //   so that angular can remove the expression text from an
                //   element's attributes, such as when using an expression for the class.
                if (!func && typeof varExpression === 'function') {
                    varExpression();
                } else {
                    var resolvedVal = $parse(varExpression)(workingScope);
                    if (resolvedVal === null || resolvedVal === undefined || resolvedVal === 0) {
                        // Value is not set, wait for it to be set.
                        $timeout(function() {
                            resolveValueWithoutWatching.apply(workingScope, [varExpression, func]);
                        }, timeoutWait, false);
                    } else {
                        func(resolvedVal, varExpression.exp);
                        $scope[destroyParam] = true;
                    }
                }
            };
            $scope.$watch = resolveValueWithoutWatching;
        };
    };

    var destroyTheScope = function($timeout, scope) {
        var scopeDestroyFn = function() {
            if (scope[destroyParam]) {
                $timeout(function() {
                    scope.$destroy();
                }, 0, true);
            }
            else {
                $timeout(scopeDestroyFn, timeoutWait, false);
            }
        };
        scopeDestroyFn();
    };

    module.directive('uiNoBind', function ($parse, $timeout) {
        return {
            restrict: 'A',
            priority: 999999,
            scope: true,
            controller: ctrlBind($parse, $timeout),
            link: {
                pre: function(scope, element, attrs) {
                },
                post: function(scope, element, attrs) {
                    element.removeClass('ng-binding');
                    element.removeClass('ng-scope');
                    element.find('*').removeClass('ng-binding');
                    element.find('*').removeClass('ng-scope');

                    destroyTheScope($timeout, scope);
                }
            }
        };
    });

    module.directive('uiNoBindChildren', function ($parse, $timeout, $compile) {
        return {
            restrict: 'A',
            priority: 999999,
            compile: function($element, $attrs) {

                var childScope,
                    nestedHtml = $element[0].innerHTML;

                $element.empty();

                return {
                    pre: function(scope, element, attrs) {
                        // Create child scope
                        childScope = scope.$new();
                        // Apply controller to scope
                        ctrlBind($parse, $timeout)(childScope);

                        var childElements = $compile('<div>' + nestedHtml + '</div>')(childScope).children();
                        element.append(childElements);
                    },
                    post: function(scope, element, attrs) {
                        element.find('*').removeClass('ng-binding');
                        element.find('*').removeClass('ng-scope');

                        destroyTheScope($timeout, childScope);
                    }
                };
            }
        };
    });

})(angular, uis);

/* ui-notify */

uis.directive('uiNotify', ['$timeout', function($timeout) {
    return {
        restrict: 'AE',
        replace: true,
        templateUrl: "ui-notify.html",
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


/* uiScrollBar */

uis.directive('uiScrollBar', function() {
    return {
        restrict: 'A',
        link: function ($scope, element) {
            //element.
        }
    };
});


/* ui-spinner */

uis.directive('uiSpinner', [function() {
    return {
        require: 'ngModel',
        restrict: 'AE',
        replace: true,
        templateUrl: "ui-spinner.html",
        scope: {
            options: '=uiSpinnerOptions'
        },
        link: function(scope, element, attrs, ngModel) {

            var options = scope.options;

            scope.plus = function() {
                scope.model++;
            };

            scope.minus = function() {
                scope.model--;
            };

            scope.$watch('model', function(newVal, oldVal) {
                if(!String(newVal).match(/^(\-)?(\d*)$/) || options && ((typeof options.max == 'number' && newVal>options.max) || (typeof options.min == 'number' && newVal<options.min))) {
                    newVal = oldVal;
                    scope.model = oldVal;
                }
                ngModel.$setViewValue(newVal);
            });

            ngModel.$render = function() {
                if(!ngModel.$viewValue) {
                    ngModel.$setViewValue(0);
                    scope.model = 0;
                }
                else {
                    scope.model = ngModel.$viewValue;
                }
                return scope.model;
            };

            return ngModel.$render;
        }
    };
}]);


/* сложность пароля */

uis.directive('uiStrength', function() {
    return {
        restrict: 'A',
        replace: true,
        template: '<div ng-class="strength.state"><div style="width: {{strength.pct}}%;"></div></div>',
        scope: {
            strength: '=uiStrength',
            pwd: '=uiModel'
        },
        link: function($scope) {

            function mesureStrength(a) {

                var c = 0;

                // длина пароля
                if(a.length < 5) {
                    c = c + 7;
                }
                else if(a.length > 4 && a.length < 8) {
                    c = c + 14;
                }
                else if(a.length > 7 && a.length < 16) {
                    c = c + 17;
                }
                else if(a.length > 15) {
                    c = c + 23;
                }

                // символы и последовательности
                if(a.match(/[a-z]/)){
                    c = c + 9;
                }
                if(a.match(/[A-Z]/)) {
                    c = c + 10;
                }
                if(a.match(/\d+/)){
                    c = c + 10;
                }
                if(a.match(/(.*[0-9].*[0-9].*[0-9])/)) {
                    c = c + 10;
                }
                if(a.match(/.[!,@,#,$,%,^,&,*,?,_,~]/)){
                    c = c + 10;
                }
                if(a.match(/(.*[!,@,#,$,%,^,&,*,?,_,~].*[!,@,#,$,%,^,&,*,?,_,~])/)) {
                    c = c + 10;
                }
                if(a.match(/([a-z].*[A-Z])|([A-Z].*[a-z])/)) {
                    c = c + 7;
                }
                if(a.match(/([a-zA-Z])/) && a.match(/([0-9])/)) {
                    c = c + 7;
                }
                if(a.match(/([a-zA-Z0-9].*[!,@,#,$,%,^,&,*,?,_,~])|([!,@,#,$,%,^,&,*,?,_,~].*[a-zA-Z0-9])/)){
                    c = c + 15;
                }

                return c > 100 ? 100 : c;
            }

            function getState(s) {
                switch (Math.round(s / 33)) {
                    case 0:
                    case 1:
                        return 'danger';
                    case 2:
                        return 'warning';
                    case 3:
                        return 'success';
                }
            }

            $scope.strength = {};

            $scope.$watch('pwd', function() {
                var value = mesureStrength($scope.pwd || '');
                $scope.strength.pct = value;
                $scope.strength.state = getState(value);

            });

        }
    };
});


/* ui-switch */

uis.directive('uiSwitcher', ['$timeout', function($timeout) {
    return {
        require: 'ngModel',
        restrict: 'AE',
        replace: true,
        templateUrl: "ui-switcher.html",
        scope: {},
        link: function(scope, element, attrs, ngModel) {
            function updateModel() {
                scope.model = ngModel.$viewValue;
                return scope.model;
            }
            scope.toggle = function() {
                ngModel.$setViewValue(!ngModel.$viewValue);
                return updateModel();
            };
            ngModel.$render = function() {
                return updateModel();
            };
            $timeout(function(){
                scope.init = true;
            }, 1000);
            return ngModel.$render;
        }
    };
}]);


/* ui-time */

uis.directive('uiTime', ['$filter', function($filter) {
    return {
        require: 'ngModel',
        restrict: 'AE',
        replace: true,
        templateUrl: "ui-time.html",
        scope: true,
        link: function ($scope, element, attrs, ngModel) {

            // маска для поля
            $scope.pattern = "(2[0-3]|[0-1][0-9]):([0-5][0-9])";

            // следим за значением внутри компонента
            $scope.$watch('value', function(val) {

                var time = String(val).split(":"),
                    newValue,
                    oldValue;

                // если время вбито правильно
                if(time.length==2) {

                    // получаем старую дату
                    if(ngModel.$viewValue) {
                        oldValue = new Date(ngModel.$viewValue);
                    }
                    else {
                        oldValue = new Date();
                        oldValue.setHours(0, 0);
                    }

                    // формируем новую дату
                    newValue = new Date(oldValue);
                    newValue.setHours(parseInt(time[0]), parseInt(time[1]));

                    // если задана новая дата то передаем ее в родительскую модель
                    if(newValue.getTime() != oldValue.getTime()) {
                        ngModel.$setViewValue(newValue);
                    }
                }
                // если время не вбили вообще
                else if (val==='') {
                    ngModel.$setViewValue(null);
                }
            });

            // заполняем значение внутреннего поля
            ngModel.$render = function () {
                $scope.value = $filter('date')(new Date(ngModel.$viewValue), 'HH:mm');
            };
        }
    };
}]);


/* ui-tooltip */

uis.directive('uiTooltip', [
    '$window', '$document', '$compile', '$parse', '$timeout', '$sce', '$templateCache',
    function($window, $document, $compile, $parse, $timeout, $sce, $templateCache) {

        var $win = angular.element($window);

        // конструктор
        function TooltipObject(scope, element) {
            this.$element = element;
            this.$scope = scope.$new();
        }

        TooltipObject.prototype = {

            // задержка перед скрытием
            delay: 100,

            // отключение подсказки
            disabled: false,

            // позиция
            location: 'right',

            // приоритеты размещений
            locations: ['top', 'bottom', 'left', 'right'],

            // подключить шаблон
            include: false,

            // содержимое
            content: '',

            // шаблон
            template: $templateCache.get('ui-tooltip.html'),

            setContent: function(content, apply) {

                // задаем конткнт
                if(content.charAt(0)=='#') {
                    this.$scope.include = content.substr(1);
                    this.$scope.content = false;
                }
                else {
                    this.$scope.include = false;
                    this.$scope.content = $sce.trustAsHtml(content);
                }

                if(apply) this.$scope.$apply();

                // позиционируем если нужно
                if(angular.isElement(this.$tooltip)) {
                    $timeout(angular.bind(this, this.reposition), 0);
                }
            },

            // показываем подсказку
            show: function(content, apply) {

                // подсказка отключена
                if(this.disabled) {
                    return false;
                }

                // если контент не передан в функцию
                if(!content) content = this.content;

                // если таймер существует то удаляем его и ничего не делаем
                if(this.delayTimer) {
                    $timeout.cancel(this.delayTimer);
                    delete this.delayTimer;
                    return true;
                }

                // создаем тултип из шаблона
                if(!angular.isElement(this.$tooltip)) {

                    // создаем и добавляем в DOM
                    this.$tooltip = $compile(this.template)(this.$scope);
                    this.$tooltip.appendTo($document.find('body'));

                    // события наведения на тултип, нужны предотвращения скрытия при переходе мышкой на самого себя
                    this.$tooltip.on('mouseover', angular.bind(this, function(){
                        this.hover = true;
                        this.show(content, apply);
                    }));
                    this.$tooltip.on('mouseout', angular.bind(this, function(){
                        this.hover = false;
                        this.hide();
                    }));
                }

                // задаем содержимое тултипа
                if(content) {
                    this.setContent(content, apply);
                }
                // или позиционируем
                else {
                    $timeout(angular.bind(this, this.reposition), 0);
                }
            },

            // скрываем подсказку
            hide: function() {
                if(angular.isElement(this.$tooltip) && !this.hover) {
                    this.delayTimer = $timeout(angular.bind(this, function(){
                        this.$tooltip.css({top: 0, left: -1000}).remove();
                        delete this.$tooltip;
                        delete this.delayTimer;
                    }), this.delay);
                }
            },

            // позиционирование тултипа
            reposition: function() {

                var location = this.location,
                    offset = this.$element.offset(),
                    cantBe,
                    pos = {};

                // удаляем все классы позиционирования
                this.$tooltip.removeClass('bottom right top left');

                // верхнее положение
                this.$tooltip.addClass("top");
                pos.top = {
                    'top': offset.top - this.$tooltip.outerHeight(true),
                    'left': offset.left + this.$element.outerWidth()/2 - this.$tooltip.outerWidth(true)/2
                };
                pos.top.right = pos.top.left + this.$tooltip.outerWidth();
                this.$tooltip.removeClass("top");

                // нижнее положение
                this.$tooltip.addClass("bottom");
                pos.bottom = {
                    'top': offset.top + this.$element.outerHeight(),
                    'left': offset.left + this.$element.outerWidth()/2 - this.$tooltip.outerWidth(true)/2
                };
                pos.bottom.bottom = pos.bottom.top + this.$tooltip.outerHeight(true);
                pos.bottom.right = pos.bottom.left + this.$tooltip.outerWidth(true);
                this.$tooltip.removeClass("bottom");

                // подожение слева
                this.$tooltip.addClass("left");
                pos.left = {
                    'top': offset.top + this.$element.outerHeight()/2 - this.$tooltip.outerHeight(true)/2,
                    'left': offset.left - this.$tooltip.outerWidth(true)
                };
                pos.left.bottom = pos.left.top + this.$tooltip.outerHeight(true);
                this.$tooltip.removeClass("left");

                // положение справа
                this.$tooltip.addClass("right");
                pos.right = {
                    'top': offset.top + this.$element.outerHeight()/2 - this.$tooltip.outerHeight(true)/2,
                    'left': offset.left + this.$element.outerWidth()
                };
                pos.right.bottom = pos.right.top + this.$tooltip.outerHeight(true);
                pos.right.right = pos.right.left + this.$tooltip.outerWidth(true);
                this.$tooltip.removeClass("right");

                // массив флагов
                cantBe = {
                    // флаг "не может быть сверху"
                    'top': (pos.top.top < $document.scrollTop() || pos.top.left < 0 || pos.top.right > ($document.scrollLeft() + $win.width())),
                    // флаг "не может быть снизу"
                    'bottom': (pos.bottom.bottom > ($document.scrollTop() + $win.height()) || pos.bottom.left < 0 || pos.bottom.right > ($document.scrollLeft() + $win.width())),
                    // флаг "не может быть слева"
                    'left': (pos.left.left < 0 || pos.left.top < $document.scrollTop() || pos.left.bottom > ($document.scrollTop() + $win.height())),
                    // флаг "не может быть справа"
                    'right': (pos.right.right > ($document.scrollLeft() + $win.width()) || pos.right.top < $document.scrollTop() || pos.right.bottom > ($document.scrollTop() + $win.height()))
                };

                // ищем подходящее для тултипа размещение
                var i = location.indexOf(this.locations),
                    maxIters = 0;

                while (cantBe[location] && maxIters != this.locations.length) {
                    maxIters++;
                    i = ++i % this.locations.length;
                    location = this.locations[i];
                }

                // навешиваем на тултип класс для размещения его в выбранном положении
                this.$tooltip.addClass(location + " show");

                // позиционируем
                this.$tooltip.css({
                    left: Math.round(pos[location].left),
                    top: Math.round(pos[location].top)
                });
            }
        };

        return {
            restrict: 'A',
            controller: ['$scope', '$element', TooltipObject],
            link: function (scope, element, attr, ctrl) {

                var config = {}, defConfig = {disabled: false, delay: 100, location: 'right', include: false, content: ''};

                // передан конфиг или текст
                if(attr.uiTooltip.charAt(0)=='{') {
                    config = $parse(attr.uiTooltip)(scope);
                }
                else {
                    config.content = attr.uiTooltip;
                }

                // расширяем конфиг тултипа
                for(var key in defConfig) {
                    if(config[key]) {
                        ctrl[key] = config[key];
                    }
                    else if (attr['uiTooltip' + key.substring(0, 1).toUpperCase() + key.substring(1, key.length)]){
                        ctrl[key] = attr['uiTooltip' + key.substring(0, 1).toUpperCase() + key.substring(1, key.length)];
                    }
                    else {
                        ctrl[key] = defConfig[key];
                    }
                }

                // вставляем или прячем елемент
                element
                    .on('mouseout', function() {
                        ctrl.hide();
                    })
                    .on('mouseover', function() {
                        ctrl.show(null, true);
                    });
            }
        };
    }
]);


/* uiTreeView, uiTreeViewChildren */

uis.directive('uiTreeView', ['$compile', function($compile) {
    return {
        restrict: 'AE',
//        template:
//        '<ul>' +
//            '<li ng-repeat="node in nodes" ui-tree-view-children="node." ng-class="{open: node.$expand}">' +
//                '<div ui-tree-view-children></div>' +
//            '</li>' +
//        '</ul>',
        scope: {
            treeView: '=uiTreeView',
            nodes: '=uiModel'
        },
        controller: function($scope) {

            $scope.config = angular.extend({
                children: 'children',
                onChange: angular.noop
            }, $scope.treeView);

            $scope.toggleNode = function toggleNode(node) {
                node.$expand = !node.$expand;
            };

            function markParents() {

                /*jshint validthis:true */
                var scope = this.$parent.$parent,
                    marked = false;

                if(scope.node && this.depth>0) {
                    for(var i=0; i<scope.node[$scope.config.children].length; i++) {
                        if(scope.node[$scope.config.children][i].$checked || scope.node[$scope.config.children][i].$marked) {
                            marked = true;
                            break;
                        }
                    }
                    scope.node.$marked = marked;

                    if(scope.depth>0) {
                        markParents.call(scope);
                    }
                }
            }

            function checkParents() {

                /*jshint validthis:true */
                var scope = this.$parent.$parent,
                    checked = false;

                if(scope.node && this.depth>0) {
                    for(var i=0; i<scope.node[$scope.config.children].length; i++) {
                        if(scope.node[$scope.config.children][i].$checked) {
                            checked = true;
                            break;
                        }
                    }
                    scope.node.$checked = checked;
                    $scope.config.onChange.call(scope.node);

                    if(scope.depth>0) {
                        $scope.checkParents.call(scope);
                    }
                }
            }

            $scope.checkChildren = function() {
                var scope = this;
                angular.forEach(scope.node[$scope.config.children], function(c) {
                    c.$checked = scope.node.$checked;
                    $scope.config.onChange.call(c);
                    $scope.checkChildren.call(scope, c);
                });
            };

            $scope.checkParents = function() {
                $scope.config.onChange.call(this.node);
                checkParents.call(this);
            };

            $scope.checkAll = function() {
                $scope.checkChildren.call(this);
                $scope.config.onChange.call(this.node);
                checkParents.call(this);
            };

            $scope.markParents = function() {
                $scope.config.onChange.call(this.node);
                markParents.call(this);
            };

        },
        compile: function (tElement) {

            // получаем шаблон для нод
            var template = angular.element(tElement.html());

            // удаляем содержимое тега
            tElement.contents().remove();

            return function ($scope, iElement, iAttr, ctrl) {

                // навешиваем системные атрибуты
                template.attr({
                    'ng-repeat': 'node in nodes',
                    'ui-tree-view-children': $scope.config.children
                });

                // запоминаем шаблон для дочерних узлов
                ctrl.$tpl = angular.element('<ul></ul>').append(template);

                // чтобы в дочерних нодах можно было обратиться к родительской ноде дерева
                $scope.$ps = $scope.$parent;

                // это root
                $scope.depth = 0;

                // компилируем root уровень
                iElement.append($compile(template.clone())($scope));

            };
        }
    };
}]);
uis.directive('uiTreeViewChildren', ['$compile', '$timeout', function ($compile, $timeout) {
    return {
        restrict: 'A',
        require: '^uiTreeView',
        link: function ($scope, element, attrs, ctrl) {

            //достаем дочерние элементы
            var newScope = $scope.$new();

            // передаем детей
            newScope.nodes = $scope.node[attrs.uiTreeViewChildren];
            newScope.depth = $scope.depth + 1;

            // если дети есть то рисуем их
            if (newScope.nodes !== null && newScope.nodes.length > 0) {
                $timeout(function() {
                    element.append($compile(ctrl.$tpl.clone())(newScope));
                }, 0);
            }
        }
    };
}]);


// произвольная валидация
// http://angular-ui.github.io/

uis.directive('uiValidate', function () {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function (scope, elm, attrs, ctrl) {
            var validateFn, validators = {},
                validateExpr = scope.$eval(attrs.uiValidate);

            if (!validateExpr){ return;}

            if (angular.isString(validateExpr)) {
                validateExpr = { validator: validateExpr };
            }

            angular.forEach(validateExpr, function (exprssn, key) {
                validateFn = function (valueToValidate) {
                    var expression = scope.$eval(exprssn, { '$value' : valueToValidate });
                    if (angular.isObject(expression) && angular.isFunction(expression.then)) {
                        // expression is a promise
                        expression.then(function(){
                            ctrl.$setValidity(key, true);
                        }, function(){
                            ctrl.$setValidity(key, false);
                        });
                        return valueToValidate;
                    } else if (expression) {
                        // expression is true
                        ctrl.$setValidity(key, true);
                        return valueToValidate;
                    } else {
                        // expression is false
                        ctrl.$setValidity(key, false);
                        return valueToValidate;
                    }
                };
                validators[key] = validateFn;
                ctrl.$formatters.push(validateFn);
                ctrl.$parsers.push(validateFn);
            });

            function apply_watch(watch)
            {
                //string - update all validators on expression change
                if (angular.isString(watch))
                {
                    scope.$watch(watch, function(){
                        angular.forEach(validators, function(validatorFn){
                            validatorFn(ctrl.$modelValue);
                        });
                    });
                    return;
                }

                //array - update all validators on change of any expression
                if (angular.isArray(watch))
                {
                    angular.forEach(watch, function(expression){
                        scope.$watch(expression, function()
                        {
                            angular.forEach(validators, function(validatorFn){
                                validatorFn(ctrl.$modelValue);
                            });
                        });
                    });
                    return;
                }

                //object - update appropriate validator
                if (angular.isObject(watch))
                {
                    angular.forEach(watch, function(expression, validatorKey)
                    {
                        //value is string - look after one expression
                        if (angular.isString(expression))
                        {
                            scope.$watch(expression, function(){
                                validators[validatorKey](ctrl.$modelValue);
                            });
                        }

                        //value is array - look after all expressions in array
                        if (angular.isArray(expression))
                        {
                            angular.forEach(expression, function(intExpression)
                            {
                                scope.$watch(intExpression, function(){
                                    validators[validatorKey](ctrl.$modelValue);
                                });
                            });
                        }
                    });
                }
            }
            // Support for ui-validate-watch
            if (attrs.uiValidateWatch){
                apply_watch( scope.$eval(attrs.uiValidateWatch) );
            }
        }
    };
});


/* uiWeekdayInterval */

uis.directive('uiWeekdayInterval', ['$translate', function($translate) {

    var weekdays = ['SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA'],
        firstWeekday = weekdays.indexOf($translate.instant('WEEK.FIRST_DAY'));

    // первый день не может быть меньше нуля
    if(firstWeekday<0) firstWeekday = 0;

    function build(val) {

        var i, key=0, iv=[], res = [], wd = [];

        // копируем чтобы не изменить
        val = angular.copy(val);

        // сортируем
        val.sort();

        // находим первый день недели и трансформируем если нужно
        for(i=firstWeekday; i<weekdays.length; i++, key++) {
            if(val.indexOf(i)>=0) wd.push({key: key, name: weekdays[i]});
        }
        for(i=0; i<firstWeekday; i++, key++) {
            if(val.indexOf(i)>=0) wd.push({key: key, name: weekdays[i]});
        }

        // ищем интервалы
        for(i=0; i<wd.length; i++) {
            if(typeof wd[i-1] != 'undefined' && wd[i].key-wd[i-1].key > 1) {
                iv.push(wd.splice(0, i));
                i=0;
            }
        }

        // добавляем оиночный день, если он остался
        if(wd.length) {
            iv.push(wd);
        }

        // выводим интервалы
        for(i=0; i<iv.length; i++) {
            if(iv[i].length==1) {
                res.push($translate.instant('WEEK.' + iv[i][0].name));
            }
            else if(iv[i].length==2) {
                res.push($translate.instant('WEEK.' + iv[i][0].name), $translate.instant('WEEK.' + iv[i][1].name));
            }
            else {
                res.push($translate.instant('WEEK.' + iv[i][0].name) + '-' + $translate.instant('WEEK.' + iv[i][iv[i].length-1].name));
            }
        }

        return res;
    }

    return {
        restrict: 'AE',
        templateUrl: "ui-weekday-interval.html",
        replace: true,
        scope: {
            model: '=uiModel'
        },
        link: function($scope) {
            $scope.$watchCollection('model', function(val) {
                $scope.intervals = build(val);
            });
        }
    };
}]);


/* uiWeekdayInterval */

uis.directive('uiWeekdaySwitch', ['$translate', function($translate) {

    var weekdays = ['SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA'],
        firstWeekday = weekdays.indexOf($translate.instant('WEEK.FIRST_DAY'));

    // первый день не может быть меньше нуля
    if(firstWeekday<0) firstWeekday = 0;

    return {
        restrict: 'AE',
        transclude: true,
        replace: true,
        templateUrl: "ui-weekday-switch.html",
        scope: {
            model: '=uiModel'
        },
        link: function($scope) {

            // построение дней для вывода
            function build(val) {

                var i, wd = [];

                // находим первый день недели и трансформируем если нужно
                for(i=firstWeekday; i<weekdays.length; i++) {
                    wd.push({key: i, name: weekdays[i], selected: val.indexOf(i) >= 0});
                }
                for(i=0; i<firstWeekday; i++) {
                    wd.push({key: i, name: weekdays[i], selected: val.indexOf(i) >= 0});
                }
                return wd;
            }

            // выбор дня недели
            $scope.toggle = function(weekday) {

                var i = $scope.model.indexOf(weekday.key);

                if(i >= 0) {
                    $scope.model.splice(i, 1);
                    weekday.selected = false;
                }
                else {
                    $scope.model.push(weekday.key);
                    $scope.model.sort();
                    weekday.selected = true;
                }

            };

            // заглушка, если модель пуста
            if(!$scope.model) {
                $scope.model = [];
            }

            $scope.$watchCollection('model', function(val) {
                $scope.weekdays = build(val);
            });
        }
    };
}]);
})();