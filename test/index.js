

const scrollio = require("../index");
const http = require("http");
const socket = require('socket.io');
const fs = require("fs");

const server  = http.createServer((req, res)=>{
    res.end(fs.readFileSync("./public/index.html"));
});

new scrollio(server);
server.listen(3000);
