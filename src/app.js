require('angular');
require('angular-animate');
require('./table')(angular.module('table', []));

let app = angular.module('app', ['ngAnimate','table']);
module.exports = app;
