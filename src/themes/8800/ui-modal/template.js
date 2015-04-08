angular.module('directives').run(['$templateCache', function($templateCache) {
    $templateCache.put('ui-modal.html',
        '<div class="ui-modal-overlay"><div class="ui-modal" ng-transclude></div></div>'
    );
}]);
