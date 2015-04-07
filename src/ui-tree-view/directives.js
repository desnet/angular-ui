
/* uiTreeView, uiTreeViewChildren */

angular.module('directives', ['ng'])
    .directive('uiTreeView', ['$compile', function($compile) {
        return {
            restrict: 'AE',
    //        template:
    //        '<ul>' +
    //            '<li ng-repeat="node in nodes" ui-tree-view-children="node." ng-class="{open: node.$expand}">' +
    //                '<div ui-tree-view-children></div>' +
    //            '</li>' +
    //        '</ul>',
            scope: {
                treeView: '=uiTreeView',
                nodes: '=uiModel'
            },
            controller: function($scope) {

                $scope.config = angular.extend({
                    children: 'children',
                    onChange: angular.noop
                }, $scope.treeView);

                $scope.toggleNode = function toggleNode(node) {
                    node.$expand = !node.$expand;
                };

                function markParents() {

                    /*jshint validthis:true */
                    var scope = this.$parent.$parent,
                        marked = false;

                    if(scope.node && this.depth>0) {
                        for(var i=0; i<scope.node[$scope.config.children].length; i++) {
                            if(scope.node[$scope.config.children][i].$checked || scope.node[$scope.config.children][i].$marked) {
                                marked = true;
                                break;
                            }
                        }
                        scope.node.$marked = marked;

                        if(scope.depth>0) {
                            markParents.call(scope);
                        }
                    }
                }

                function checkParents() {

                    /*jshint validthis:true */
                    var scope = this.$parent.$parent,
                        checked = false;

                    if(scope.node && this.depth>0) {
                        for(var i=0; i<scope.node[$scope.config.children].length; i++) {
                            if(scope.node[$scope.config.children][i].$checked) {
                                checked = true;
                                break;
                            }
                        }
                        scope.node.$checked = checked;
                        $scope.config.onChange.call(scope.node);

                        if(scope.depth>0) {
                            $scope.checkParents.call(scope);
                        }
                    }
                }

                $scope.checkChildren = function() {
                    var scope = this;
                    angular.forEach(scope.node[$scope.config.children], function(c) {
                        c.$checked = scope.node.$checked;
                        $scope.config.onChange.call(c);
                        $scope.checkChildren.call(scope, c);
                    });
                };

                $scope.checkParents = function() {
                    $scope.config.onChange.call(this.node);
                    checkParents.call(this);
                };

                $scope.checkAll = function() {
                    $scope.checkChildren.call(this);
                    $scope.config.onChange.call(this.node);
                    checkParents.call(this);
                };

                $scope.markParents = function() {
                    $scope.config.onChange.call(this.node);
                    markParents.call(this);
                };

            },
            compile: function (tElement) {

                // получаем шаблон для нод
                var template = angular.element(tElement.html());

                // удаляем содержимое тега
                tElement.contents().remove();

                return function ($scope, iElement, iAttr, ctrl) {

                    // навешиваем системные атрибуты
                    template.attr({
                        'ng-repeat': 'node in nodes',
                        'ui-tree-view-children': $scope.config.children
                    });

                    // запоминаем шаблон для дочерних узлов
                    ctrl.$tpl = angular.element('<ul></ul>').append(template);

                    // чтобы в дочерних нодах можно было обратиться к родительской ноде дерева
                    $scope.$ps = $scope.$parent;

                    // это root
                    $scope.depth = 0;

                    // компилируем root уровень
                    iElement.append($compile(template.clone())($scope));

                };
            }
        };
    }])
    .directive('uiTreeViewChildren', ['$compile', '$timeout', function ($compile, $timeout) {
        return {
            restrict: 'A',
            require: '^uiTreeView',
            link: function ($scope, element, attrs, ctrl) {

                //достаем дочерние элементы
                var newScope = $scope.$new();

                // передаем детей
                newScope.nodes = $scope.node[attrs.uiTreeViewChildren];
                newScope.depth = $scope.depth + 1;

                // если дети есть то рисуем их
                if (newScope.nodes !== null && newScope.nodes.length > 0) {
                    $timeout(function() {
                        element.append($compile(ctrl.$tpl.clone())(newScope));
                    }, 0);
                }
            }
        };
    }]);
