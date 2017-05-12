var express = require('express');
var app = express();
var bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var config = require('./config');
var db = require('./db');
db(config.db.user, config.db.password, config.db.cluster, config.db.db, function() {
    console.log('Connected!');
});