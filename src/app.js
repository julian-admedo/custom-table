require('angular');
require('angular-animate');
require('./customTable.directive');
///require('./stickyHeader.directive');
require('./demo')(angular.module('demo', ['customTable']));

var app = angular.module('app', ['ngAnimate','demo']);
module.exports = app;
