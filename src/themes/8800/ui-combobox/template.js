tpls['ui-combobox.html'] =
'<div ng-click="open($event)" ng-class="{\'ui-combo-box-opened\': isOpen, \'ui-combo-box-disabled\': isDisabled}" class="ui-combo-box">' +
    '<var>{{selected.text}}</var>' +
    '<ul>' +
        '<li ng-repeat="node in nodes" ng-click="select(node)" ng-class="{\'active\': selected&&selected.value==node.value}" translate>{{node.text}}</li>' +
    '</ul>' +
'</div>';