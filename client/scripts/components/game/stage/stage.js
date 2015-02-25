(function () {
    var loaded = false;
    define(['jquery', 'angular', 'app',  
        'components/game/player',
        'components/game/stage/gameStageController', 
        'components/common/loading/loading'], 
        function ($, angular, app) {
        if (!loaded) {
            app.lazy.directive("gameStage", ['ConfigApp', 'Player', function (configApp, player) {
                angular.element('body').after(angular.element('<link href="' + configApp.getPath('/js/components/game/stage/style.css') + '" type="text/css" rel="stylesheet" />'));
                return {
                    controller: "GameStageController",
                    restrict: 'A',
                    //templateUrl: configApp.getPath('/js/components/common/gameStage/template.html'),
                    scope: {
                        manifest: '=',
                        onLoadComplete: '&'
                    },
                    link: function(scope, elem, attrs) {
                        var canvas = elem[0];
                        // canvas.width(canvas.parent().width());
                        // canvas.height(canvas.parent().height());

                        var stage = new createjs.Stage(canvas), w, h, loader;

                        function init() {
                            // grab canvas width and height for later calculations:
                            w = stage.canvas.width;
                            h = stage.canvas.height;
                            // w = $(elem).width();
                            // h = $(elem).height();

                            manifest = [
                                {src: "character.png", id: "player"}/*,
                                {src: "sky.png", id: "sky"},
                                {src: "ground.png", id: "ground"},
                                {src: "hill1.png", id: "hill"},
                                {src: "hill2.png", id: "hill2"}*/
                            ];

                            loader = new createjs.LoadQueue(false);
                            loader.addEventListener("complete", handleComplete);
                            loader.loadManifest(manifest, true, "/sprites/");
                        }

                        function handleComplete() {
                            //examples.hideDistractor();
                            player.setup(stage, loader.getResult("player"), { x: 35, y: 35, w: w, h: h });
                            
                            stage.addEventListener("pressmove", handlePressMove);

                            createjs.Ticker.timingMode = createjs.Ticker.RAF;
                            createjs.Ticker.addEventListener("tick", tick);
                        }

                        function handlePressMove(evt) {
                            console.log(arguments);
                            
                        }

                        // function move(direction) {
                        //     //direction = 'Right';
                        //     if (!! direction) {
                        //         direction = direction.chartAt(0).toUpperCase() + direction.substr(1);
                        //         player.gotoAndPlay('move' + direction);
                        //     }
                        // }

                        function tick(event) {
                            player.refresh(event);
                            stage.update(event);
                        }

                        init();
                    }
                };
            }]);
            loaded = true;
        }
    });
})();