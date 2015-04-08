angular.module('directives').run(['$templateCache', function($templateCache) {
    $templateCache.put('ui-notify.html',
        '<div ng-class="{\'show\': isShow}" class="ui-notify"><i ng-click="hide()" class="ui-notify-close icon-close"></i>{{text}}</div>'
    );
}]);
