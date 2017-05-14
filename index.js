var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var role = require('./middleware/role');
var passport = require('passport');

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

var config = require('./config');
var db = require('./db');

db(config.db.user, config.db.password, config.db.cluster, config.db.db, function () {
    require('./auth');
    var router = express.Router();
    var routes = require('./router');
    routes(router);
    app.use(config.baseURL, router);
    // Serve
    app.listen(config.port);
    console.log('Listening on port: ' + config.port);
});