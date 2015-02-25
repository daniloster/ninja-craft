(function () {
    var Ctrl = null;
    define(['app'], function (app) {
        if (Ctrl == null) {

            Ctrl = ['$scope', function ($scope) {
                 
            }];

            app.lazy.controller('GameStageController', Ctrl);
        }
    });
})();