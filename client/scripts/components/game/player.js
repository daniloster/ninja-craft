(function () {
    var notLoaded = true;
    define(['app'], 
        function (app) {
        if (notLoaded) {
            app.lazy.factory('Player',
            [/*'$http', '$cookieStore', */function () {
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
                            myStage.addChild(currentAction.sprite);
                        } else if (evt !== null){
                            var keyCode = (evt.originalEvent.which || evt.originalEvent.keyCode);
                            console.log(keyCode);
                            if (keyCode !== currentAction.keyCode) {
                                myStage.removeChild(currentAction.sprite);
                                if (keyCode === p.actions.MoveUp.keyCode) {
                                    currentAction = p.actions.MoveUp;
                                    myStage.addChild(currentAction.sprite);
                                } else if (keyCode === p.actions.MoveRight.keyCode) {
                                    currentAction = p.actions.MoveRight;
                                    myStage.addChild(currentAction.sprite);
                                } else if (keyCode === p.actions.MoveDown.keyCode) {
                                    currentAction = p.actions.MoveDown;
                                    myStage.addChild(currentAction.sprite);
                                } else if (keyCode === p.actions.MoveLeft.keyCode) {
                                    currentAction = p.actions.MoveLeft;
                                    myStage.addChild(currentAction.sprite);
                                } 
                            }
                        }
                    },
                    getCurrentAction: function() {
                        currentAction.sprite.x = this.position.x;
                        currentAction.sprite.y = this.position.y;
                    },
                    setup: function(stage, image, position){
                        myStage = stage;

                        var spriteSheet = new createjs.SpriteSheet({
                                framerate: 30,
                                "images": [image],
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

                        this.actions.MoveUp.sprite = new createjs.Sprite(spriteSheet, "moveUp");
                        this.actions.MoveRight.sprite = new createjs.Sprite(spriteSheet, "moveRight");
                        this.actions.MoveDown.sprite = new createjs.Sprite(spriteSheet, "moveDown");
                        this.actions.MoveLeft.sprite = new createjs.Sprite(spriteSheet, "moveLeft");
                        this.actions.None.sprite = new createjs.Sprite(spriteSheet, "lookDown");

                        myStage.addChild(this.actions.None.sprite);

                        this.position.x = position.x;
                        this.position.y = position.y;
                        if (currentAction !== null && currentAction !== undefined && currentAction.sprite !== undefined) {
                            myStage.addChild(currentAction.sprite);
                        }
                    },
                    refresh: function(evt) {
                        var deltaS = evt.delta / 1000, 
                        w = myStage.canvas.width, h = myStage.canvas.height,
                        positionX = this.position.x + currentAction.xAxisDelta * deltaS,
                        positionY = this.position.y + currentAction.yAxisDelta * deltaS;

                        // var playerW = this.getBounds().width * currentAction.sprite.scaleX,
                        // playerH = this.getBounds().height * currentAction.sprite.scaleY;

                        var playerW = 48 * currentAction.sprite.scaleX,
                        playerH = 60 * currentAction.sprite.scaleY;

                        currentAction.sprite.x = (this.position.x = (positionX >= w + playerW) ? -playerW : positionX);
                        currentAction.sprite.y = (this.position.y = (positionY >= h + playerH) ? -playerH : positionY);

                    },
                    destroy: function() {
                        if (currentAction !== null && currentAction !== undefined && currentAction.sprite !== undefined && myStage !== undefined) {
                            myStage.removeChild(currentAction.sprite);
                            myStage = null;
                        }
                    }
                }, currentAction = p.actions.None, myStage = null;

                $(document).on('keydown', function(evt){
                    p.setCurrentAction(evt);
                });

                $(document).on('keyup', function(evt){
                    p.setCurrentAction(null);
                });

                return p;
            }]);
            notLoaded = true;
        }
    });
})();