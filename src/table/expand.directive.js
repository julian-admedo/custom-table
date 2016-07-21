module.exports = function(ngModule) {
    ngModule.directive('expand', function ($parse) {
        return {
            restrict: 'A',
            scope:true,
            link: function ($scope,el,attr) {

                var childrenCount = 0;
                var icon = el.find('i');

                if (!attr['parent']) {
                    icon.addClass('fa-plus');

                    el.on('click',function() {

                        var rowid = attr['key'];
                        var rowIndex = 0;
                        $scope.vm.data.forEach(function(e,i){
                            if (e.id == rowid) {
                                rowIndex = i;
                                return;
                            }
                        });

                        $scope.$apply(function() {
                            if (!el.attr('data-expanded')) {
                                $scope.$eval(attr['expand']).call(null,rowid).then(function(data) {
                                    childrenCount = data.length;
                                    $scope.vm.data.splice.apply($scope.vm.data, [rowIndex + 1, 0].concat(data));
                                    el.attr('data-expanded',true);
                                    icon.removeClass('fa-plus');
                                    icon.addClass('fa-minus');
                                });
                            }
                            else {
                                $scope.vm.data.splice(rowIndex+1,childrenCount);
                                el.removeAttr('data-expanded');
                                icon.removeClass('fa-minus');
                                icon.addClass('fa-plus');
                            }
                        });
                    });
                }

            }
        };
    });

};
