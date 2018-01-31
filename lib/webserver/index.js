'use strict';

var path = require('path');
var express = require('express');
var FRONTEND_PATH = path.normalize(__dirname + '/../../frontend');
var application = express();

application.use(express.static(FRONTEND_PATH));
application.set('views', FRONTEND_PATH + '/views');
application.get('/views/*', function(req, res) {
    var templateName = req.params[0].replace(/\.html$/, '');

    res.render(templateName);
  }
);

exports = module.exports = application;
