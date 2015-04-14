
/* uiConfirm */

uis.directive('uiConfirm', ['$document', '$compile', '$templateCache', function($document, $compile, $templateCache) {

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

            // задаем переменные
            this.$scope.title = this.title;
            this.$scope.content = this.content;

            // создаем и добавляем в DOM
            this.$confirm = $compile(this.template)(this.$scope);
            this.$confirm.appendTo($document.find('body'));
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
