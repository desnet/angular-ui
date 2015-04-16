(function(){var tpls = {};
angular.module('ui.tpls', []).run(['$templateCache', function($templateCache) {
    for(var tpl in tpls) {
        $templateCache.put(tpl, tpls[tpl]);
    }
}]);
tpls['ui-busy.html'] = '<div class="ui-busy"><i class="icon-spinner3"></i></div>';

tpls['ui-captcha.html'] =
'<div class="ui-captcha" ng-class="{update: update}">' +
    '<input type="text" name="captchaCode" ng-model="captcha.code" placeholder="Введите код >" />' +
    '<img ng-src="{{src+captcha.url}}" />' +
    '<a href="#" ng-click="captcha.reload(); $event.preventDefault()" class="button"><i class="icon-spinner6"></i></a>' +
'</div>';
tpls['ui-checkbox.html'] =
'<div class="ui-checkbox" ng-click="toggle()">' +
    '<i ng-class="{\'icon-checkbox-partial\': !checked && marked,\'icon-checkbox-unchecked\': !checked && !marked, \'icon-checkbox-checked\': checked}"></i>' +
    '<span ng-transclude></span>' +
'</div>';

tpls['ui-combobox.html'] =
'<div ng-click="open($event)" ng-class="{\'ui-combo-box-opened\': isOpen, \'ui-combo-box-disabled\': isDisabled}" class="ui-combo-box">' +
    '<var>{{selected.text}}</var>' +
    '<ul>' +
        '<li ng-repeat="node in nodes" ng-click="select(node)" ng-class="{\'active\': selected&&selected.value==node.value}" translate>{{node.text}}</li>' +
    '</ul>' +
'</div>';
tpls['ui-confirm.html'] =
'<div class="ui-modal-overlay"><div class="ui-modal ui-confirm">' +
    '<header>' +
        '<h3>{{title|translate}}</h3>' +
        '<i ng-click="cancel()" class="icon-close"></i>' +
    '</header>' +
    '<section>{{content|translate}}</section>' +
    '<footer class="text-right">' +
        '<a href="#" ng-click="cancel(); $event.preventDefault();" class="dashed">Отмена</a> или' +
        '<button ng-click="success()" class="button active ml1">Подтвердить</button>' +
    '</footer>' +
'</div></div>';

tpls['ui-date-picker.html'] =
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
'</div>';

tpls['ui-highlight.html'] = '<pre class="ui-highlight"><code ng-transclude></code></pre>';
tpls['ui-list-box.html'] =
'<ul class="ui-list-box">' +
    '<li>' +
    '</li>' +
'</ul>';

tpls['ui-modal.html'] = '<div class="ui-modal-overlay"><div class="ui-modal" ng-transclude></div></div>';

tpls['ui-notify.html'] = '<div ng-class="{\'show\': isShow}" class="ui-notify"><i ng-click="hide()" class="ui-notify-close icon-close"></i>{{text}}</div>';

tpls['ui-spinner.html'] =
'<div class="ui-spinner">' +
    '<input type="text" ng-model="model" class="ui-spinner-input ui-field">' +
    '<span class="ui-spinner-btn-container">' +
        '<button type="button" ng-click="plus()" class="ui-btn ui-btn-default ui-spinner-btn ui-spinner-plus"><i class="ui-spinner-up glyphicon glyphicon-chevron-up"></i></button>' +
        '<button type="button" ng-click="minus()" class="ui-btn ui-btn-default ui-spinner-btn ui-spinner-minus"><i class="ui-spinner-down glyphicon glyphicon-chevron-down"></i></button>' +
    '</span>' +
'</div>';

tpls['ui-switcher.html'] =
'<div class="ui-switcher" ng-class="{\'ui-switcher-init\': init,\'ui-switcher-left\': !model, \'ui-switcher-right\': model}" ng-click="toggle()">' +
    '<div class="ui-switcher-button icon-list">&nbsp;</div>' +
'</div>';

tpls['ui-time.html'] =
'<div class="ui-time">' +
    '<input type="text" ng-model="value" ng-pattern="pattern" placeholder="00:00" />' +
'</div>';

tpls['ui-tooltip.html'] =
'<div class="ui-tooltip">' +
    '<span></span>' +
    '<section ng-if="include" ng-include="include"></section>' +
    '<section ng-if="!include" ng-bind-html="content"></section>' +
'</div>';


tpls['ui-weekday-interval.html'] =
'<span ng-repeat="interval in intervals">' +
    '{{interval}}<span ng-if="!$last">, </span>' +
'</span>';

tpls['ui-weekday-switch.html'] =
'<table class="ui-weekday-switch">' +
'<tr>' +
'<th colspan="5" translate="WEEK.WORKING">Рабочие</th>' +
'<th colspan="2" translate="WEEK.WEEKEND">Выходные</th>' +
'</tr>' +
'<tr>' +
'<td ng-repeat="weekday in weekdays" ng-click="toggle(weekday)" ng-class="{active: weekday.selected}">{{"WEEK." + weekday.name | translate}}.</td>' +
'</tr>' +
'</table>';})();