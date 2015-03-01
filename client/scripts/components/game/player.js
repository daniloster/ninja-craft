(function () {
    var notLoaded = true;
    define(['app'], 
        function (app) {
        if (notLoaded) {
            app.lazy.factory('Player',
            [/*'$http', '$cookieStore', */function () {

                return {
                    create: function(isControlledByServer, playerId){

                        var currentAction = null, myStage = null, queueKeys = [];

                        function keydownHandler(evt){
                            var keyCode = (evt.originalEvent.which || evt.originalEvent.keyCode).toString();
                            if (queueKeys.indexOf(keyCode) < 0) {
                                queueKeys.push(keyCode);
                                p.setCurrentAction(queueKeys.length ? p.actions[keyCode] : p.actions.None);
                            }
                        }

                        function keyupHandler(evt){
                            var keyCode = (evt.originalEvent.which || evt.originalEvent.keyCode).toString();
                            queueKeys.remove(function(item){
                                return keyCode == item;
                            });
                            p.setCurrentAction(queueKeys.length ? p.actions[queueKeys[queueKeys.length - 1]] : p.actions.None);
                        }

                        var p = {
                            id: playerId == undefined ? 'Player:' + new Date().getTime() + ':' + Math.random() * 1000000000 : playerId,
                            position: { x: 35, y: 35 },
                            actions: {
                                '37': { // MoveLeft
                                    id: 'left',
                                    xAxisDelta: -150,
                                    yAxisDelta: 0,
                                    keyCode: 37
                                },
                                '38': { // MoveUp
                                    id: 'up',
                                    xAxisDelta: 0,
                                    yAxisDelta: -150,
                                    keyCode: 38
                                },
                                '39': { // MoveRight
                                    id: 'right',
                                    xAxisDelta: 150,
                                    yAxisDelta: 0,
                                    keyCode: 39
                                },
                                '40': { //MoveDown
                                    id: 'down',
                                    xAxisDelta: 0,
                                    yAxisDelta: 150,
                                    keyCode: 40
                                },
                                None: {
                                    id: 'lookAtDown',
                                    xAxisDelta: 0,
                                    yAxisDelta: 0
                                }
                            },
                            getData: function() {
                                return {
                                    id: p.id,
                                    position: {x: p.position.x, y: p.position.y},
                                    actionIndex: currentAction.keyCode == undefined ? 'None' : currentAction.keyCode.toString()
                                };
                            },
                            getAction: function(index) {
                                if (index == undefined || index == null || p.actions[index] == undefined) {
                                    return p.actions.None;
                                } else {
                                    return p.actions[index];
                                }
                            },
                            setCurrentAction: function(newCurrentAction) {
                                if (currentAction.id !== newCurrentAction.id) {
                                    myStage.removeChild(currentAction.sprite);
                                    currentAction = newCurrentAction;
                                    myStage.addChild(currentAction.sprite);
                                    if (!isControlledByServer) {
                                        myStage.socket.emit('Client:refreshPlayer', {
                                            player: p.getData(),
                                            gamePlayId: myStage.getGamePlayId()
                                        });
                                    }
                                }
                            },
                            getCurrentAction: function() {
                                currentAction.sprite.x = this.position.x;
                                currentAction.sprite.y = this.position.y;
                                return currentAction;
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

                                this.actions[37].sprite = new createjs.Sprite(spriteSheet, "moveLeft");
                                this.actions[38].sprite = new createjs.Sprite(spriteSheet, "moveUp");
                                this.actions[39].sprite = new createjs.Sprite(spriteSheet, "moveRight");
                                this.actions[40].sprite = new createjs.Sprite(spriteSheet, "moveDown");
                                this.actions.None.sprite = new createjs.Sprite(spriteSheet, "lookDown");

                                myStage.addChild(this.actions.None.sprite);

                                this.position.x = position.x;
                                this.position.y = position.y;

                                currentAction = p.actions.None;
                                myStage.addChild(currentAction.sprite);

                                if (!isControlledByServer) {
                                    $(document).on('keydown', keydownHandler);
                                    $(document).on('keyup', keyupHandler);
                                } else {
                                    stage.socket.on('Server:refreshPlayer', function(data){
                                        if (data.gamePlayId != stage.getGamePlayId() && p.id == data.player.id){
                                            var newAction = p.getAction(data.player.actionIndex);
                                            p.position.x = data.player.position.x;
                                            p.position.y = data.player.position.y;
                                            p.setCurrentAction(newAction);
                                        }
                                    });
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
                                if (!isControlledByServer) {
                                    $(document).unbind('keydown', keydownHandler);
                                    $(document).unbind('keyup', keyupHandler);
                                }
                            }
                        };

                        return p;
                    }
                };
            }]);
            notLoaded = true;
        }
    });
})();