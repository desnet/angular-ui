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
