(function () {
    var Ctrl = null;
    define(['app', 'createjs', 'socketio'], function (app, createjs) {
        if (Ctrl == null) {
            Ctrl = ['$scope', '$rootScope', '$location', 
            function ($scope, $rootScope, $location) {
                // App = {}
                // App.socket = io.connect()

                // // Draw Function
                // App.draw = function(data) {
                //     if (data.type == "dragstart") {
                //         App.ctx.beginPath()
                //         App.ctx.moveTo(data.x,data.y)
                //     } else if (data.type == "drag") {
                //         App.ctx.lineTo(data.x,data.y)
                //         App.ctx.stroke()
                //     } else {
                //         App.ctx.stroke()
                //         App.ctx.closePath()
                //     }
                // }

                // // Draw from other sockets
                // App.socket.on('draw', App.draw) 

                // // Bind click and drag events to drawing and sockets.
                // $(function() {
                //     App.ctx = $('canvas')[0].getContext("2d")
                //     $('canvas').on('drag dragstart dragend', function(e) {
                //         offset = $(this).offset()
                //         data = {
                //             x: (e.clientX - offset.left), 
                //             y: (e.clientY - offset.top),
                //             type: e.handleObj.type
                //         }
                //         App.draw(data) // Draw yourself.
                //         App.socket.emit('drawClick', data) // Broadcast draw.
                //     })
                // })
            }];

            app.lazy.controller('BlackboarController', Ctrl);
        };
    });
})();
