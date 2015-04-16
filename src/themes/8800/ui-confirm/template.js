tpls['ui-confirm.html'] =
'<div class="ui-modal-overlay"><div class="ui-modal ui-confirm">' +
    '<header>' +
        '<h3>{{title|translate}}</h3>' +
        '<i ng-click="cancel()" class="icon-close"></i>' +
    '</header>' +
    '<section>{{content|translate}}</section>' +
    '<footer class="text-right">' +
        '<a href="#" ng-click="cancel(); $event.preventDefault();" class="dashed">Отмена</a> или' +
        '<button ng-click="success()" class="button active ml1">Подтвердить</button>' +
    '</footer>' +
'</div></div>';
