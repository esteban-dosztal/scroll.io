# scroll.io

This module allows to share the same document and events scroll between all connected users.

## Updates
[2016/07/18] now support for ratio screen!.
## install 

```bash
$ npm install scrollio
```


## example

```javascript
const scrollio = require("../index");
const http = require("http");
const socket = require('socket.io');
const fs = require("fs");

const server  = http.createServer((req, res)=>{
    res.end(fs.readFileSync("./public/index.html"));
});

new scrollio(server);
server.listen(3000);

```



