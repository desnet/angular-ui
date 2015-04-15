(function(){

'use strict';

angular.module('app', [
    'ui',
    'ui.router',
    'ngCookies',
    'ngAnimate',
    'pascalprecht.translate',
    'controllers',
    'filters',
    'services',
    'directives'
])
    .constant('apiUrl', '/api')
    .config([
        '$stateProvider', '$urlRouterProvider', '$httpProvider', '$translateProvider',
        function($stateProvider, $urlRouterProvider, $httpProvider, $translateProvider) {

            // настраиваем языки
            $translateProvider
                .useStaticFilesLoader({
                    prefix: 'i18n/',
                    suffix: '.json'
                })
                .preferredLanguage('ru');

            // индикатор загрузки
            $httpProvider.interceptors.push('restHttpLoader');

            // уведомления
            //$httpProvider.interceptors.push('restHttpMessages');

            // травсформатор запросов и ответов
            //$httpProvider.interceptors.push('restHttpTransformer');

            // Любые неопределенные url перенаправлять на /404
            $urlRouterProvider.otherwise("/404");

            // Определим состояния
            $stateProvider
                .state('home', {
                    url: "/"
                })
                .state('404', {
                    url: "/404",
                    templateUrl: "partials/404.html"
                })
                .state('login', {
                    url: "/login",
                    templateUrl: "partials/login.html",
                    controller: 'auth'
                })
                .state('tabs', {
                    url: "/tabs",
                    templateUrl: "partials/tabs.html",
                    resolve: {
                        access: access()
                    }
                })
                .state('table', {
                    url: "/table",
                    templateUrl: "partials/table.html",
                    resolve: {
                        access: access()
                    }
                })
                .state('tree', {
                    url: "/tree",
                    templateUrl: "partials/tree.html",
                    controller: 'demo',
                    resolve: {
                        access: access()
                    }
                })
                .state('form', {
                    url: "/form",
                    templateUrl: "partials/form.html",
                    controller: 'demo',
                    resolve: {
                        access: access()
                    }
                })
                .state('windows', {
                    url: "/windows",
                    templateUrl: "partials/windows.html",
                    resolve: {
                        access: access()
                    }
                })
                .state('classes', {
                    url: "/classes",
                    templateUrl: "partials/classes.html",
                    resolve: {
                        access: access()
                    }
                });

            function access() {
                return ['resolver', function(resolver) {
                    return resolver.isResolve();
                }];
            }

        }
    ])
    .run([
        '$rootScope', '$state', '$stateParams', '$cookies', '$q', '$translate', 'Identify', 'resolver',
        function($rootScope, $state, $stateParams, $cookies, $q, $translate, Identify, resolver) {

            $rootScope.timestamp = new Date();
            $rootScope.$state = $state;
            $rootScope.$stateParams = $stateParams;
            $rootScope.logout = Identify.logout;
            $rootScope.identify = false;

            // следим за изменениеи URL и проверяем авторизацию
            $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {

                $rootScope.resolve = false;

                if(toState.resolve && toState.resolve.access) {

                    var routing = resolver.run();

                    if (!$rootScope.identify) {

//                        Identify.getPermissions().then(function(){
//                            $rootScope.resolve = true;
//                            routing.resolve();
//                        }, function(){
//                            routing.reject(403);
//                        });

                        routing.resolve();
                    }
                    else if ($rootScope.identify) {
                        routing.resolve();
                    }
                    else {
                        routing.reject(403);
                    }
                }

                // запоминаем страничку на которую перешли
                //$cookies.state = toState.name;

                // заполняем титл странички
                $translate('TITLES.' + angular.uppercase(toState.name)).then(function(val){
                    $rootScope.title = val;
                });

            });

            $rootScope.$on('$stateChangeError', function(event, toState, toParams, fromState, fromParams, error){
                if(403==error) {
                    event.preventDefault();
                    //$state.go('login');
                }
            });
        }
    ]);

})();