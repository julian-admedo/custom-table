module.exports = function(ngModule) {

    require('./table.service')(ngModule);
    require('./table.controller')(ngModule);
    require('./customTable.directive')(ngModule);
    require('./expand.directive')(ngModule);
//      require('./expands.directive')(ngModule);
};
