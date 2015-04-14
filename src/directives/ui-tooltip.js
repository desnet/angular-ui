
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
