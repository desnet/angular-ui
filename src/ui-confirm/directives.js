
/* uiConfirm */

angular.module('directives', ['ng']).directive('uiConfirm', ['$document', '$compile', '$sce', function($document, $compile, $sce) {

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
        template: (
            '<div class="ui-modal-overlay"><div class="ui-modal ui-confirm">' +
                '<header>' +
                    '<h3>{{title | translate}}</h3>' +
                    '<i ng-click="cancel()" class="icon-close"></i>' +
                '</header>' +
                '<section>{{content | translate}}</section>' +
                '<footer class="text-right">' +
                    '<button ng-click="cancel()" class="ui-btn ui-btn-default" translate>CANCEL</button>' +
                    '<button ng-click="success()" class="ui-btn ui-btn-danger ml1" translate>OK</button>' +
                '</footer>' +
            '</div></div>'
        ),

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
