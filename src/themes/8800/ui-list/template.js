angular.module('directives').run(['$templateCache', function($templateCache) {
    $templateCache.put('ui-list-box.html',
        '<ul class="ui-list-box">' +
            '<li>' +
            '</li>' +
        '</ul>'
    );
}]);
