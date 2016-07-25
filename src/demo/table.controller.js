module.exports = function(ngModule) {
    ngModule.controller('tableController', ['tableService',
        function (tableService, $q) {
            var vm = this;
            vm.data = tableService.getData();
            vm.getChildren = tableService.getChildren;
            vm.buttonClick = function(name) {
                window.alert('button clicked - ' + name);
            };
        }]);
};
