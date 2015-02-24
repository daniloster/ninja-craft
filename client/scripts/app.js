(function () {
    var app = null;
    define(['config', 'auth/session', 'angular', 'ngRoute', 'ngResource', 'ngCookies', 'ngSanitize', 'ngAnimate'], 
        function (config, session, angular) {
        if (app === null) {
            app = angular.module('ninjaCraft', ['ngRoute', 'ngResource', 'ngCookies', 'ngSanitize', 'ngAnimate']);

            config(app);

            var _base = null;
            try { _base = baseUrl; } catch (e) { }
            app.lazy.constant('ConfigApp', {
                hasBaseUrl: !!_base,
                getPath: function (relativePath) {
                    return this.hasBaseUrl ? _base + relativePath : relativePath;
                }
            });

            app.lazy.factory('AuthorizationService',
            ['$http', '$cookieStore', function ($http, $cookieStore) {

                var resource = {
                    login: function (user, success, error) {
                        $http.post('/user/login', user).success(function (data) {
                            session.init($cookieStore, data);
                            success(data);
                        }).error(function (data) {
                            session.clear($cookieStore);
                            error(data);
                        });
                    },
                    logout: function (success, error) {
                        try {
                            session.clear($cookieStore);
                            success();
                        } catch (e) {
                            error(e);
                        }
                    },
                    getCurrent: function (success, error) {
                        $http.post('/user/current').success(success).error(error);
                    }
                };

                return resource;
            }]);
        }
        return app;
    });
})();