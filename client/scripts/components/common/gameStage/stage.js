(function () {
    var loaded = false;
    define(['jquery', 'angular', 'app', 'components/common/gameStage/gameStageController', 'components/common/loading/loading'], 
        function ($, angular, app) {
        if (!loaded) {
            app.lazy.directive("gameStage", ['ConfigApp', function (configApp) {
                angular.element('body').after(angular.element('<link href="' + configApp.getPath('/js/components/common/gameStage/style.css') + '" type="text/css" rel="stylesheet" />'));
                return {
                    controller: "GameStageController",
                    restrict: 'A',
                    //templateUrl: configApp.getPath('/js/components/common/gameStage/template.html'),
                    scope: {
                        manifest: '=',
                        onLoadComplete: '&'
                    },
                    link: function(scope, elem, attrs) {
                        var canvas = elem[0];//document.getElementById(attrs.id);//$(elem);
                        // canvas.width(canvas.parent().width());
                        // canvas.height(canvas.parent().height());

                        var stage = new createjs.Stage(canvas), w, h, loader, player, 
                        directions = {
                            Up: {
                                id: 'up',
                                xAxisDelta: 0,
                                yAxisDelta: 150
                            },
                            Right: {
                                id: 'right',
                                xAxisDelta: 150,
                                yAxisDelta: 0
                            },
                            Down: {
                                id: 'down',
                                xAxisDelta: 0,
                                yAxisDelta: -150
                            },
                            Left: {
                                id: 'left',
                                xAxisDelta: -150,
                                yAxisDelta: 0
                            },
                            None: {
                                id: 'lookAtDown',
                                xAxisDelta: 0,
                                yAxisDelta: 0
                            }
                        }, direction = directions.None;

                        

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
                            var spriteSheet = new createjs.SpriteSheet({
                                framerate: 30,
                                "images": [loader.getResult("player")],
                                "frames": {"regX": 0, "regY": 0, "width": 144, "height": 60, "count": 12,  "spacing":0, "margin":0},
                                //"frames": {"width": 144, "height": 60},
                                // define two animations, run (loops, 1.5x speed) and jump (returns to run):
                                "animations": {
                                    "moveUp": [0, 2, "moveUp", 1.5],
                                    "moveRight": [3, 5, "moveRight", 1.5],
                                    "moveDown": [6, 8, "moveDown", 1.5],
                                    "moveLeft": [9, 11, "moveLeft", 1.5],
                                    "lookAtUp": [1, 1, "lookAtDown", 1.5],
                                    "lookAtDown": [7, 7, "lookAtUp", 1.5]
                                }
                            });
                            player = new createjs.Sprite(spriteSheet, "lookAtDown");
                            player.y = 35;
                            player.x = 35;

                            stage.addChild(/*sky, hill, hill2, ground, */player);
                            stage.addEventListener("pressmove", handleMove);

                            createjs.Ticker.timingMode = createjs.Ticker.RAF;
                            createjs.Ticker.addEventListener("tick", tick);
                        }

                        function handleMove(evt) {
                            console.log(arguments);
                            setDirection(evt);
                        }

                        function setDirection(evt) {
                            direction =  directions.None;
                            player.gotoAndPlay();
                        }

                        // function move(direction) {
                        //     //direction = 'Right';
                        //     if (!! direction) {
                        //         direction = direction.chartAt(0).toUpperCase() + direction.substr(1);
                        //         player.gotoAndPlay('move' + direction);
                        //     }
                        // }

                        function tick(event) {
                            var deltaS = event.delta / 1000,
                            positionX = player.x + direction.xAxisDelta * deltaS,
                            positionY = player.y + direction.yAxisDelta * deltaS;

                            // var playerW = player.getBounds().width * player.scaleX,
                            // playerH = player.getBounds().height * player.scaleY;

                            var playerW = 144 * player.scaleX,
                            playerH = 60 * player.scaleY;

                            player.x = (positionX >= w + playerW) ? -playerW : positionX;
                            player.y = (positionY >= h + playerH) ? -playerH : positionY;

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