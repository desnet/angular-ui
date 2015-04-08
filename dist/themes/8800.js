angular.module('directives').run(['$templateCache', function($templateCache) {
    $templateCache.put('ui-busy.html', '<div class="ui-busy"><i class="icon-spinner3"></i></div>');
}]);

angular.module('directives').run(['$templateCache', function($templateCache) {
    $templateCache.put('ui-captcha.html',
        '<div class="ui-captcha" ng-class="{update: update}">' +
            '<input type="text" name="captchaCode" ng-model="captcha.code" placeholder="Введите код >" />' +
            '<img ng-src="{{src+captcha.url}}" />' +
            '<a href="#" ng-click="captcha.reload(); $event.preventDefault()" class="button"><i class="icon-spinner6"></i></a>' +
        '</div>'
    );
}]);

angular.module('directives').run(['$templateCache', function($templateCache) {
    $templateCache.put('ui-checkbox.html',
        '<div class="ui-checkbox" ng-click="toggle()">' +
            '<i ng-class="{\'icon-checkbox-partial\': !checked && marked,\'icon-checkbox-unchecked\': !checked && !marked, \'icon-checkbox-checked\': checked}"></i>' +
            '<span ng-transclude></span>' +
        '</div>'
    );
}]);

angular.module('directives').run(['$templateCache', function($templateCache) {
    $templateCache.put('ui-combo-box.html', '');
}]);

angular.module('directives').run(['$templateCache', function($templateCache) {
    $templateCache.put('ui-confirm.html',
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
    );
}]);

angular.module('directives').run(['$templateCache', function($templateCache) {
    $templateCache.put('ui-date-picker.html',
        '<div class="ui-date-picker">' +
            '<i ng-click="selectDate()" class="icon-calendar-alt-fill"></i>' +
            '<ul>' +
                '<li ng-repeat="s in selected">{{s|date:"dd.MM.yyyy"}}<span ng-if="!$last">, </span></li>' +
            '</ul>' +
            '<div ng-show="selecting">' +
                '<table>' +
                    '<thead>' +
                    '<tr>' +
                        '<td class="currentDate" colspan="7">{{date|date:"MMMM yyyy"}}</td>' +
                    '</tr>' +
                    '<tr class="navigation">' +
                        '<td ng-click="prevYear()" ng-class="{disabled: !isPrevYear}">&lt;&lt;</td>' +
                        '<td ng-click="prev()" ng-class="{disabled: !isPrev}">&lt;</td>' +
                        '<td colspan="3" ng-click="today()">Сегодня</td>' +
                        '<td ng-click="next()" ng-class="{disabled: !isNext}">&gt;</td>' +
                        '<td ng-click="nextYear()" ng-class="{disabled: !isNextYear}">&gt;&gt;</td>' +
                    '</tr>' +
                    '<tr>' +
                        '<td ng-repeat="day in days" ng-bind="day"></td>' +
                    '</tr>' +
                    '</thead>' +
                    '<tbody>' +
                        '<tr ng-repeat="week in weeks" class="week">' +
                        '<td ng-repeat="d in week" ng-click="selectDay(d)" ng-class="{active: d.selected, otherMonth: d.notCurrentMonth, disabled: d.disabled}">{{d.day|date:"d"}}</td>' +
                    '</tr>' +
                    '</tbody>' +
                '</table>' +
            '</div>' +
        '</div>'
    );
}]);

angular.module('directives').run(['$templateCache', function($templateCache) {
    $templateCache.put('ui-list-box.html',
        '<ul class="ui-list-box">' +
            '<li>' +
            '</li>' +
        '</ul>'
    );
}]);

angular.module('directives').run(['$templateCache', function($templateCache) {
    $templateCache.put('ui-modal.html',
        '<div class="ui-modal-overlay"><div class="ui-modal" ng-transclude></div></div>'
    );
}]);

angular.module('directives').run(['$templateCache', function($templateCache) {
    $templateCache.put('ui-notify.html',
        '<div ng-class="{\'show\': isShow}" class="ui-notify"><i ng-click="hide()" class="ui-notify-close icon-close"></i>{{text}}</div>'
    );
}]);

angular.module('directives').run(['$templateCache', function($templateCache) {
    $templateCache.put('ui-spinner.html',
        '<div class="ui-spinner">' +
            '<input type="text" ng-model="model" class="ui-spinner-input ui-field">' +
            '<span class="ui-spinner-btn-container">' +
                '<button type="button" ng-click="plus()" class="ui-btn ui-btn-default ui-spinner-btn ui-spinner-plus"><i class="ui-spinner-up glyphicon glyphicon-chevron-up"></i></button>' +
                '<button type="button" ng-click="minus()" class="ui-btn ui-btn-default ui-spinner-btn ui-spinner-minus"><i class="ui-spinner-down glyphicon glyphicon-chevron-down"></i></button>' +
            '</span>' +
        '</div>'
    );
}]);

angular.module('directives').run(['$templateCache', function($templateCache) {
    $templateCache.put('ui-switch.html',
        '<div class="ui-switch" ng-class="{\'ui-switch-init\': init,\'ui-switch-left\': !model, \'ui-switch-right\': model}" ng-click="toggle()">' +
            '<div class="ui-switch-button icon-list">&nbsp;</div>' +
        '</div>'
    );
}]);

angular.module('directives').run(['$templateCache', function($templateCache) {
    $templateCache.put('ui-time.html',
        '<div class="ui-time">' +
            '<input type="text" ng-model="value" ng-pattern="pattern" placeholder="00:00" />' +
        '</div>'
    );
}]);

angular.module('directives').run(['$templateCache', function($templateCache) {
    $templateCache.put('ui-tooltip.html',
        '<div class="ui-tooltip">' +
            '<span></span>' +
            '<section ng-if="include" ng-include="include"></section>' +
            '<section ng-if="!include" ng-bind-html="content"></section>' +
        '</div>'
    );
}]);


angular.module('directives').run(['$templateCache', function($templateCache) {
    $templateCache.put('ui-weekday-interval.html',
        '<span ng-repeat="interval in intervals">' +
            '{{interval}}<span ng-if="!$last">, </span>' +
        '</span>'
    );
}]);

angular.module('directives').run(['$templateCache', function($templateCache) {
    $templateCache.put('ui-weekday-switch.html',
        '<table class="ui-weekday-switch">' +
            '<tr>' +
                '<th colspan="5" translate="WEEK.WORKING">Рабочие</th>' +
                '<th colspan="2" translate="WEEK.WEEKEND">Выходные</th>' +
            '</tr>' +
            '<tr>' +
                '<td ng-repeat="weekday in weekdays" ng-click="toggle(weekday)" ng-class="{active: weekday.selected}">{{"WEEK." + weekday.name | translate}}.</td>' +
            '</tr>' +
        '</table>'
    );
}]);