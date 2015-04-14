tpls['ui-confirm.html'] =
'<div class="ui-modal-overlay"><div class="ui-modal ui-confirm">' +
    '<header>' +
        '<h3>{{title | translate}}</h3>' +
        '<i ng-click="cancel()" class="icon-close"></i>' +
    '</header>' +
    '<section>{{content | translate}}</section>' +
    '<footer class="text-right">' +
        '<button ng-click="cancel()" class="ui-btn ui-btn-default" translate>CANCEL</button>' +
        '<button ng-click="success()" class="ui-btn ui-btn-danger ml1" translate>OK</button>' +
    '</footer>' +
'</div></div>';