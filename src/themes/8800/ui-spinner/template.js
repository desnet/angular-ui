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
