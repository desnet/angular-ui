
/* сложность пароля */

angular.module('directives', ['ng']).directive('uiStrength', function() {
    return {
        restrict: 'A',
        replace: true,
        template: '<div ng-class="strength.state"><div style="width: {{strength.pct}}%;"></div></div>',
        scope: {
            strength: '=uiStrength',
            pwd: '=uiModel'
        },
        link: function($scope) {

            function mesureStrength(a) {

                var c = 0;

                // длина пароля
                if(a.length < 5) {
                    c = c + 7;
                }
                else if(a.length > 4 && a.length < 8) {
                    c = c + 14;
                }
                else if(a.length > 7 && a.length < 16) {
                    c = c + 17;
                }
                else if(a.length > 15) {
                    c = c + 23;
                }

                // символы и последовательности
                if(a.match(/[a-z]/)){
                    c = c + 9;
                }
                if(a.match(/[A-Z]/)) {
                    c = c + 10;
                }
                if(a.match(/\d+/)){
                    c = c + 10;
                }
                if(a.match(/(.*[0-9].*[0-9].*[0-9])/)) {
                    c = c + 10;
                }
                if(a.match(/.[!,@,#,$,%,^,&,*,?,_,~]/)){
                    c = c + 10;
                }
                if(a.match(/(.*[!,@,#,$,%,^,&,*,?,_,~].*[!,@,#,$,%,^,&,*,?,_,~])/)) {
                    c = c + 10;
                }
                if(a.match(/([a-z].*[A-Z])|([A-Z].*[a-z])/)) {
                    c = c + 7;
                }
                if(a.match(/([a-zA-Z])/) && a.match(/([0-9])/)) {
                    c = c + 7;
                }
                if(a.match(/([a-zA-Z0-9].*[!,@,#,$,%,^,&,*,?,_,~])|([!,@,#,$,%,^,&,*,?,_,~].*[a-zA-Z0-9])/)){
                    c = c + 15;
                }

                return c > 100 ? 100 : c;
            }

            function getState(s) {
                switch (Math.round(s / 33)) {
                    case 0:
                    case 1:
                        return 'danger';
                    case 2:
                        return 'warning';
                    case 3:
                        return 'success';
                }
            }

            $scope.strength = {};

            $scope.$watch('pwd', function() {
                var value = mesureStrength($scope.pwd || '');
                $scope.strength.pct = value;
                $scope.strength.state = getState(value);

            });

        }
    };
});
