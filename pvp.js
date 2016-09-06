var express = require('express');
var app = express();
app.set("express", express);
var http = require('http').Server(app);
var io = require('socket.io')(http);
var fs = require('fs');
var async = require("async");

var http = require('http').Server(app);
var io = require('socket.io')(http);
var fs = require('fs');

var bodyParser = require('body-parser');

var config  = require('./server/config.js');
app.set("config", config);

var MysqlManager = require('./server/mysql.js')(app);
app.set("MysqlManager", MysqlManager);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.static("public"));

var routes = require('./server/routes.js')(app);

eval(fs.readFileSync('./server/gameserver.js')+'');

http.listen(3000);
