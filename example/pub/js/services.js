(function(){

'use strict';

/* Services */

angular.module('services', ['ngResource'])
    .factory('Identify', ['apiUrl', '$http', '$state', '$rootScope', '$cookies', function(apiUrl, $http, $state, $rootScope, $cookies) {

        return {
            login: login,
            logout: logout,
            getPermissions: getPermissions
        };

        function login(params) {
            return $http.get(apiUrl + '/whoami/roles', {headers: {'Authorization': 'Basic ' + btoa(params.login + ":" + params.password)}}).then(function() {
                $cookies.user = params.login;
                $state.go('home');
            });
        }

        function logout() {
            return $http.get(apiUrl + '/whoami/roles/', {headers: {'Authorization': 'Basic ' + btoa($cookies.user + ":asdfghjklzxcvbnm")}}).then(function() {
                $rootScope.identify = null;
                $state.go('home');
            });
        }

        function getPermissions() {
            return $http.get(apiUrl + '/whoami/permissions');
        }
    }])

    // нужно для проверки прав доступа к страничке
    .factory('resolver', function($rootScope, $q, $timeout) {

        var deferred;

        function run () {
            deferred = $q.defer();
            return deferred;
        }

        function isResolve() {
            return deferred ? deferred.promise : null;
        }

        return {
            run: run,
            isResolve: isResolve
        };
    })

    // регистрация сервиса перехватчика
    .factory('restHttpMessages', ['$q', '$rootScope', function($q, $rootScope) {

        // кол-во ajax запросов
        var loader = 0,
            deferred;

        return {
            // не обязательный метод
            'request': function(config) {

                // если запросов еще небыло
                if(loader<1) {
                    deferred = $q.defer();
                    $rootScope.loader = deferred.promise;
                }
                // плюс 1 запрос
                loader++;
                // что-то делает при успешном статусе ответа сервера
                return config || $q.when(config);
            },
            // не обязательный метод
            'response': function(res) {

                notify(res);

                // минус 1 запрос
                loader--;

                // больше ничего не загружается
                if(loader<1 && deferred) {
                    deferred.resolve();
                }

                return res || $q.when(res);
            },
            // не обязательный метод
            'responseError': function(res) {

                notify(res);

                // минус 1 запрос
                loader--;

                // больше ничего не загружается
                if(loader<1 && deferred) {
                    deferred.resolve();
                }

                // что-то делает при ошибке
                return $q.reject(res);
            }
        };

        function notify(res) {
            if(angular.isObject(res.data) && res.data.response) {
                switch (res.data.response.status || res.status) {
                    case 200: // успех
                        if(res.config.method!='GET') $rootScope.notify = 'Операция завершена успешно.';
                        break;
                    case 400: //параметры переданные в запросе некорректны
                        $rootScope.notify = res.data.response.message;
                        break;
                    case 401: //переданы неверные логин или пароль
                        $rootScope.notify = "Неверный логин или пароль.";
                        break;
                    case 403: //пользователь не аутентифицирован или не имеет доступа к запрашиваемым объектам
                        $rootScope.notify = "Доступ запрещен.";
                        break;
                    case 404: //необходимый объект не найден
                        $rootScope.notify = "404 объект не найден.";
                        break;
                    case 500: //общая ошибка.
                        $rootScope.notify = "Внутренняя шибка сервера.";
                        break;
                    case 502: //не вернвй шлюз.
                        $rootScope.notify = "502 Сервер не отвечает.";
                        break;
                    default:
                }

            }
        }
    }])

    // сервис-индикатор процесса  http запросов
    .factory('restHttpLoader', ['$q', '$rootScope', function($q, $rootScope) {

        // кол-во ajax запросов
        var loader = 0,
            deferred;

        return {
            'request': function(config) {

                // если запросов еще небыло
                if(loader<1) {
                    deferred = $q.defer();
                    $rootScope.loader = deferred.promise;
                }

                // плюс 1 запрос
                loader++;

                // что-то делает при успешном статусе ответа сервера
                return config || $q.when(config);
            },
            'response': function(res) {

                // минус 1 запрос
                loader--;

                // больше ничего не загружается
                if(loader<1 && deferred) {
                    deferred.resolve();
                }

                return res || $q.when(res);
            },
            'responseError': function(res) {

                // минус 1 запрос
                loader--;

                // больше ничего не загружается
                if(loader<1 && deferred) {
                    deferred.resolve();
                }

                // что-то делает при ошибке
                return $q.reject(res);
            }
        };
    }]);

})();
