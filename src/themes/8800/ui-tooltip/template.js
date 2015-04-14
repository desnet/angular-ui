tpls['ui-tooltip.html'] =
'<div class="ui-tooltip">' +
    '<span></span>' +
    '<section ng-if="include" ng-include="include"></section>' +
    '<section ng-if="!include" ng-bind-html="content"></section>' +
'</div>';
