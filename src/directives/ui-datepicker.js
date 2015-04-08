
/* date-picker */

angular.module('directives', ['ng']).directive('uiDatepicker', ['$document', function($document) {
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
