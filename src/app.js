require('angular');
require('angular-animate');
require('./customTable.directive');
require('./demo')(angular.module('demo', ['customTable']));

let app = angular.module('app', ['ngAnimate','demo']);
module.exports = app;
