
/* ui-captcha */

uis.directive('uiCaptcha', [function() {

    // класс капчи
    function Captcha() {
        this.getToken();
        this.reload();
    }

    // перезагрузить картинку
    Captcha.prototype.reload = function reload() {
        this.code = '';
        this.url = '?token=' + this.token + '&time=' + new Date().getTime();
    };

    // получить токен
    Captcha.prototype.getToken = function getToken() {

        var result  = '',
            words   = '0123456789abcdef',
            position = 0,
            max_position = words.length - 1;

        for(var i = 0; i < 16; ++i ) {
            position = Math.floor(Math.random() * max_position);
            result = result + words.substring(position, position + 1);
        }

        this.token = result;

        return result;
    };

    return {
        restrict: 'AE',
        replace: true,
        templateUrl: "ui-captcha.html",
        scope: {
            model: '=uiModel'
        },
        link: function($scope, element, attr) {

            $scope.captcha = new Captcha();
            $scope.src = attr.src || '';

            if(attr.uiModel && attr.uiModel.charAt(0)!='{') {
                $scope.model = $scope.captcha;
            }

            $scope.$watch('captcha.url', function() {
                $scope.update = true;
            });

            element.find('img').load(function(){
                $scope.$apply(function(){
                    $scope.update = false;
                });
            });
        }
    };
}]);

