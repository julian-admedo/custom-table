module.exports = function(ngModule) {
    ngModule.controller('tableController', ['tableService',
        function (tableService, $q) {
            var vm = this;
            tableService.getData().then(function(data){
                vm.data = data;
            });
            vm.getChildren = tableService.getChildren;
            vm.buttonClick = function(name) {
                window.alert('button clicked - ' + name);
            };
        }]);
};
