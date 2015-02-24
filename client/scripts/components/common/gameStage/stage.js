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

                        var stage = new createjs.Stage(canvas), w, h, loader, 
                        player = (function(myStage) { 
                            var p = {
                                position: { x: 35, y: 35 },
                                actions: {
                                    MoveUp: {
                                        id: 'up',
                                        xAxisDelta: 0,
                                        yAxisDelta: -150,
                                        keyCode: 38
                                    },
                                    MoveRight: {
                                        id: 'right',
                                        xAxisDelta: 150,
                                        yAxisDelta: 0,
                                        keyCode: 39
                                    },
                                    MoveDown: {
                                        id: 'down',
                                        xAxisDelta: 0,
                                        yAxisDelta: 150,
                                        keyCode: 40
                                    },
                                    MoveLeft: {
                                        id: 'left',
                                        xAxisDelta: -150,
                                        yAxisDelta: 0,
                                        keyCode: 37
                                    },
                                    None: {
                                        id: 'lookAtDown',
                                        xAxisDelta: 0,
                                        yAxisDelta: 0
                                    }
                                },
                                setCurrentAction: function(evt) {
                                    if (evt === null && currentAction.id !== p.actions.None.id) {
                                        myStage.removeChild(currentAction.sprite);
                                        currentAction = p.actions.None;
                                        stage.addChild(currentAction.sprite);
                                    } else if (evt !== null){
                                        var keyCode = (evt.originalEvent.which || evt.originalEvent.keyCode);
                                        console.log(keyCode);
                                        if (keyCode !== currentAction.keyCode) {
                                            myStage.removeChild(currentAction.sprite);
                                            if (keyCode === p.actions.MoveUp.keyCode) {
                                                currentAction = p.actions.MoveUp;
                                                stage.addChild(currentAction.sprite);
                                            } else if (keyCode === p.actions.MoveRight.keyCode) {
                                                currentAction = p.actions.MoveRight;
                                                stage.addChild(currentAction.sprite);
                                            } else if (keyCode === p.actions.MoveDown.keyCode) {
                                                currentAction = p.actions.MoveDown;
                                                stage.addChild(currentAction.sprite);
                                            } else if (keyCode === p.actions.MoveLeft.keyCode) {
                                                currentAction = p.actions.MoveLeft;
                                                stage.addChild(currentAction.sprite);
                                            } 
                                        }
                                    }
                                },
                                getCurrentAction: function() {
                                    currentAction.sprite.x = this.position.x;
                                    currentAction.sprite.y = this.position.y;
                                },
                                refresh: function(evt) {
                                    var deltaS = evt.delta / 1000,
                                    positionX = this.position.x + currentAction.xAxisDelta * deltaS,
                                    positionY = this.position.y + currentAction.yAxisDelta * deltaS;

                                    // var playerW = player.getBounds().width * player.scaleX,
                                    // playerH = player.getBounds().height * player.scaleY;

                                    var playerW = 48 * currentAction.sprite.scaleX,
                                    playerH = 60 * currentAction.sprite.scaleY;

                                    currentAction.sprite.x = (player.position.x = (positionX >= w + playerW) ? -playerW : positionX);
                                    currentAction.sprite.y = (player.position.y = (positionY >= h + playerH) ? -playerH : positionY);

                                }
                            }, currentAction = p.actions.None;

                            $(document).on('keydown', function(evt){
                                p.setCurrentAction(evt);
                            });

                            $(document).on('keyup', function(evt){
                                p.setCurrentAction(null);
                            });

                            return p;
                        })(stage);

                        

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
                                "frames": {"regX": 0, "regY": 0, "width": 48, "height": 60, "count": 12,  "spacing":0, "margin":0},
                                //"frames": {"width": 144, "height": 60},
                                // define two animations, run (loops, 1.5x speed) and jump (returns to run):
                                "animations": {
                                    "moveUp": [0, 2, "moveUp", 0.3],
                                    "moveRight": [3, 5, "moveRight", 0.3],
                                    "moveDown": [6, 8, "moveDown", 0.3],
                                    "moveLeft": [9, 11, "moveLeft", 0.3],
                                    "lookDown": [7, 7, "lookDown", 0.1]
                                }
                            });

                            player.actions.MoveUp.sprite = new createjs.Sprite(spriteSheet, "moveUp");
                            player.actions.MoveRight.sprite = new createjs.Sprite(spriteSheet, "moveRight");
                            player.actions.MoveDown.sprite = new createjs.Sprite(spriteSheet, "moveDown");
                            player.actions.MoveLeft.sprite = new createjs.Sprite(spriteSheet, "moveLeft");
                            player.actions.None.sprite = new createjs.Sprite(spriteSheet, "lookDown");

                            stage.addChild(/*sky, hill, hill2, ground, */player.actions.None.sprite);
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