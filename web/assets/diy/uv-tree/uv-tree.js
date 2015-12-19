/**
 * 基于dtree的angularjs版tree
 *
 * example：
 <div class="tree" uv-tree="funcs" uv-tree-data="funcs" uv-tree-node-id-key="func_code"
 uv-tree-node-parent-id-key="par_func_code" uv-tree-node-name-key="func_name" uv-tree-node-selected-key="selected"
 uv-tree-multi-select="true">
 </div>
 *
 *
 */
angular.module('uv.directive.tree', [])
    .directive('uvTree', ['$timeout', function ($timeout) {
        return {
            restrict: 'EA',
            template: '<div></div>',
            scope: {
                uvTreeData: '=',            //tree的源数据
                uvTreeNodeIdKey: '@',       //tree节点的json对象中表示id的key
                uvTreeNodeParentIdKey: '@', //tree节点的json对象中表示父节点ID的key
                uvTreeNodeNameKey: '@',     //tree节点的json对象中表示名称的key
                uvTreeNodeSelectedKey: '@', //tree节点的json对象中表示当前节点应该已被默认选中的key
                uvTreeMultiSelect: '@',     //tree是否支持多选，现在单选有点问题
                uvTreeSelectNodeFunc: '&'   //暂时没用
            },
            link: function ($scope, elem, attr) {
                var treeScopeName = attr.uvTree;
                window.funcTree = new dTree('funcTree', '/static/assets/uv-tree/img');
                $scope.$parent[treeScopeName] = window.funcTree;
                funcTree.config.multiSelect = !!$scope.uvTreeMultiSelect;
                funcTree.config.checkbox = !!$scope.uvTreeMultiSelect;
                funcTree.config.useIcons = false;
                var id = $scope.uvTreeNodeIdKey,
                    pid = $scope.uvTreeNodeParentIdKey,
                    name = $scope.uvTreeNodeNameKey,
                    selectKey = $scope.uvTreeNodeSelectedKey;
                angular.forEach($scope.uvTreeData, function (v) {
                    funcTree.add(v[id], v[pid], v[name], '', '', v[selectKey], v, true);
                });
                var treeHtml = funcTree.toString();
                elem.html(treeHtml);

            }
        }
    }]);