angular.module('directives').run(['$templateCache', function($templateCache) {
    $templateCache.put('ui-captcha.html',
        '<div class="ui-captcha" ng-class="{update: update}">' +
            '<input type="text" name="captchaCode" ng-model="captcha.code" placeholder="Введите код >" />' +
            '<img ng-src="{{src+captcha.url}}" />' +
            '<a href="#" ng-click="captcha.reload(); $event.preventDefault()" class="button"><i class="icon-spinner6"></i></a>' +
        '</div>'
    );
}]);
