"use strict";

!(function (version) {



    /* polyfill for window.requestAnimationFrame and window.cancelAnimationFrame */
    var lastTime = 0;
    var vendors = ['webkit', 'moz'];
    for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
        window.cancelAnimationFrame =
            window[vendors[x] + 'CancelAnimationFrame'] || window[vendors[x] + 'CancelRequestAnimationFrame'];
    }

    if (!window.requestAnimationFrame)
        window.requestAnimationFrame = function (callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function () {
                    callback(currTime + timeToCall);
                },
                timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };

    if (!window.cancelAnimationFrame)
        window.cancelAnimationFrame = function (id) {
            clearTimeout(id);
        };

    var scrollio = window.scrollio = function (socketio) {

        var self = this;
        var ticking = false;
        var stop = false;
        this.lastPosition = 0;
        this.socketio = socketio;

        socketio.on('move', function (y) {
            self.move(y);
        });

        socketio.on('scroll.io.init', function (y) {
            self.move(y);
        });


        window.addEventListener('scroll', function (e) {

            var id = null;
            if (!ticking) {
                window.requestAnimationFrame(function () {
                    if (false === stop) self.notify();
                    stop = true;

                    /* dont send all packages to server, filter by time */
                    if (id == null) {
                        id = setTimeout(function () {
                            stop = false;
                            id = null;
                        }, 100);
                    }
                    ticking = false;
                });
            }
            ticking = true;
        });


    };


    scrollio.prototype.notify = function () {
        this.socketio.emit('scroll.io.scroll', window.scrollY);
    }

    scrollio.prototype.move = function (to) {
        var self = this;

        if (self.lastPosition != to) window.scrollTo(0, to);
        self.lastPosition = to;

    }

    scrollio.prototype.version = version;


})("1.0.0");