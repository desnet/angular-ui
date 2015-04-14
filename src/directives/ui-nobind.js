
/* uiNoBind */

(function(angular, module) {

    var timeoutWait = 100;
    var destroyParam = 'noBind-DestroyMe';

    var ctrlBind = function($parse, $timeout) {
        return function($scope) {
            var resolveValueWithoutWatching = function(varExpression, func) {
                var workingScope = this;
                // varExpression.exp is passed as the 'old' value
                //   so that angular can remove the expression text from an
                //   element's attributes, such as when using an expression for the class.
                if (!func && typeof varExpression === 'function') {
                    varExpression();
                } else {
                    var resolvedVal = $parse(varExpression)(workingScope);
                    if (resolvedVal === null || resolvedVal === undefined || resolvedVal === 0) {
                        // Value is not set, wait for it to be set.
                        $timeout(function() {
                            resolveValueWithoutWatching.apply(workingScope, [varExpression, func]);
                        }, timeoutWait, false);
                    } else {
                        func(resolvedVal, varExpression.exp);
                        $scope[destroyParam] = true;
                    }
                }
            };
            $scope.$watch = resolveValueWithoutWatching;
        };
    };

    var destroyTheScope = function($timeout, scope) {
        var scopeDestroyFn = function() {
            if (scope[destroyParam]) {
                $timeout(function() {
                    scope.$destroy();
                }, 0, true);
            }
            else {
                $timeout(scopeDestroyFn, timeoutWait, false);
            }
        };
        scopeDestroyFn();
    };

    module.directive('uiNoBind', function ($parse, $timeout) {
        return {
            restrict: 'A',
            priority: 999999,
            scope: true,
            controller: ctrlBind($parse, $timeout),
            link: {
                pre: function(scope, element, attrs) {
                },
                post: function(scope, element, attrs) {
                    element.removeClass('ng-binding');
                    element.removeClass('ng-scope');
                    element.find('*').removeClass('ng-binding');
                    element.find('*').removeClass('ng-scope');

                    destroyTheScope($timeout, scope);
                }
            }
        };
    });

    module.directive('uiNoBindChildren', function ($parse, $timeout, $compile) {
        return {
            restrict: 'A',
            priority: 999999,
            compile: function($element, $attrs) {

                var childScope,
                    nestedHtml = $element[0].innerHTML;

                $element.empty();

                return {
                    pre: function(scope, element, attrs) {
                        // Create child scope
                        childScope = scope.$new();
                        // Apply controller to scope
                        ctrlBind($parse, $timeout)(childScope);

                        var childElements = $compile('<div>' + nestedHtml + '</div>')(childScope).children();
                        element.append(childElements);
                    },
                    post: function(scope, element, attrs) {
                        element.find('*').removeClass('ng-binding');
                        element.find('*').removeClass('ng-scope');

                        destroyTheScope($timeout, childScope);
                    }
                };
            }
        };
    });

})(angular, uis);