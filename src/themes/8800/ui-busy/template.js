angular.module('directives').run(['$templateCache', function($templateCache) {
    $templateCache.put('ui-busy.html', '<div class="ui-busy"><i class="icon-spinner3"></i></div>');
}]);
