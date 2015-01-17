'use strict';

var App = require('../lib/App');

var app = new App();

app.init(document.body);
app.addTreeNode(document.head);
app.addTreeNode(document.body);
