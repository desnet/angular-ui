var tpls = {};
angular.module('ui.tpls', []).run(['$templateCache', function($templateCache) {
    for(var tpl in tpls) {
        $templateCache.put(tpl, tpls[tpl]);
    }
}]);