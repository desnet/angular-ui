angular.module('ui.upload', [])
    .directive('uiUpload', function() {
        return {
            restrict: 'AE',
            replace: true,
            transclude: true,
            template: (
                '<button class="{{class}}" style="position: relative; overflow: hidden;">' +
                    '<span ng-transclude></span>' +
                    '<input type="file" style="position: absolute; top: 0; right: 0; margin: 0; opacity: 0; filter: alpha(opacity=0); transform: translate(-300px, 0) scale(4); font-size: 23px; direction: ltr; cursor: pointer;">' +
                '</button>'
            ),
            scope: {
                model: '=uiUpload'
            },
            link: function($scope, element) {
                element.find('input').bind('change', function() {
                    var files = this.files;
                    if(files.length && angular.isArray($scope.model.files)) {
                        $scope.$apply(function() {
                            for(var i=0; i<files.length; i++) {
                                $scope.model.files.push(files[i]);
                            }
                            $scope.model.upload();
                        });
                    }
                });
            }
        }
    })
    .factory('UiUpload', ['$http', '$q', function($http, $q) {

        var deferred = $q.defer(),
            uploader = {
                url: '',
                name: 'upload',
                files: [],
                upload: Upload,
                $promise: deferred.promise
            };

        return uploader;

        // загружаем
        function Upload() {

            var fd = new FormData();

            // добавляем данные в форму
            for(var i=0; i<uploader.files.length; i++) {
                fd.append(uploader.name, uploader.files[i]);
            }

            $http.post((typeof uploader.url == 'function' ? uploader.url() : uploader.url), fd, {
                transformRequest: angular.identity,
                headers: {
                    'Content-Type': undefined
                }
            })
            .success(function() {
                deferred.resolve.apply(this, arguments);
            })
            .error(function() {
                deferred.reject.apply(this, arguments);
            });
        }

    }]);
