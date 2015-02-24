(function () {
    define(['resolve', 'auth/roles', 'auth/session'], function (resolve, roles, session) {
        return function ($routeProvider) {
            $routeProvider
                .when("/", { templateUrl: '/partials/blackboard', 
                    resolve: resolve([
                    	'app/board/blackboardController',
                    	'components/common/gameStage/stage'
                	], 
                    [roles.Admin, roles.Member, roles.Guest]) })
                .otherwise({ redirectTo: '/' });
        }
    });
})();