"use strict";

const SocketIO = require('socket.io');
const fs = require("fs");
const debug = require("debug")("scrollio");

class Scrollio{

    constructor(http, socketio){
        let self = this;
        this.http = http;
        this.version = "1.0.0";
        this.sockets = {};
        this.currentPosition = 0;
        debug("crating instance of scroll.io");

        if(typeof socketio== "undefined"){
            this.socketio = SocketIO.listen(http, {path: '/socket.io'});
        }else this.socketio = socketio;

        this.injectJS();

        this.socketio.on('connection',(socket)=>{
            self.ioConnect(socket);
        } );


    }

    ioConnect(socket){

        let self = this;
        self.sockets[socket.id] = socket;
        self.sockets[socket.id].created = new Date().getTime();

        self.notify("scroll.io.init", [socket.id]);

        socket.on('disconnected', ()=>{
            debug("disconnect: "+ socket.id);
        });



        socket.on('scroll.io.scroll', (y)=>{
            this.currentPosition= y;
            let to = Object.keys(self.sockets);
            to.splice(socket.id,1);
            self.notify("move", to, y);
        });

    }


    notify(event, to, msg){
        let self = this;

        to.forEach((k)=>{
            self.sockets[k].emit(event, msg);
        });
    }

    getJSFile(){
        return fs.readFileSync("./public/scroll.io.js");
    }


    injectJS(){

        debug('attaching bind to scroll.io required');

        var url = '/scroll.io/scroll.io.js';
        var events = this.http.listeners('request').slice(0);
        var self = this;


        this.http.removeAllListeners('request');
        this.http.on('request', (req, res) =>{

            if (req.url === url) {
                debug('serve client source');
                res.setHeader('Content-Type', 'application/javascript');
                res.writeHead(200);
                res.end(this.getJSFile());
                return;
            } else {
                for (var i = 0; i < events.length; i++) {
                    events[i].call(this.http, req, res);
                }//end for
            }//end else
        });

    }
}


module.exports  = Scrollio;