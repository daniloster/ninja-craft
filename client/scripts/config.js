(function () {
    define(['routes'], function (routes) {
        return function(app) {
            
            app.lazy = {
                controller: app.controller,
                factory: app.factory,
                service: app.service,
                provider: app.provider,
                filter: app.filter,
                directive: app.directive,
                constant: app.constant,
                animation: app.animation
            };

            app.config(['$routeProvider', '$locationProvider', '$controllerProvider', '$provide', '$filterProvider', '$animateProvider', '$compileProvider', '$httpProvider',
            function ($routeProvider, $locationProvider, $controllerProvider, $provide, $filterProvider, $animateProvider, $compileProvider, $httpProvider) {
                $httpProvider.defaults.useXDomain = true;
                //Remove the header used to identify ajax call  that would prevent CORS from working
                delete $httpProvider.defaults.headers.common['X-Requested-With'];

                app.lazy = {
                    controller: $controllerProvider.register,
                    factory: $provide.factory,
                    service: $provide.service,
                    provider: $provide.provider,
                    filter: $filterProvider.register,
                    directive: $compileProvider.directive,
                    constant: $provide.constant,
                    animation: $animateProvider.register
                };

                routes($routeProvider);

                $locationProvider.html5Mode({
                    enabled: true,
                    requireBase: false
                });
            }]);
        }
    });
})();