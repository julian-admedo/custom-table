module.exports = function(ngModule){
    ngModule.controller('tableController',['tableService',
        function (tableService, $q) {

            var vm = this;

            vm.data = tableService.getData();

            vm.data2 = tableService.getData();

            vm.getChildren = tableService.getChildren;


        }]);
}
