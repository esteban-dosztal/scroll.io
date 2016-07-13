"use strict";

!(function(version){

    var scrollio = window.scrollio = function(socketio){
        console.log("scroll.io: ", this.version);
    };


    scrollio.prototype.version = version;

})("1.0.0");