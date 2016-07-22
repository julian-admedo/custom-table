angular.module('customTable',[]).directive('customTable', function () {
    return {
        restrict: 'E',
        replace: true,
        scope:{
            data:'=',
            getChildren:'&'
        },
        transclude: {
            'column':'column'
            },
        link: function (scope,el,attr,ctrl,transclude) {
            var headerElement = el.find('thead');
            transclude(scope,function(clone){
                var headerRow = angular.element('<tr></tr>');
                headerRow.append('<th class="iconColumn"></th>');
                var headers = clone.find('header');
                for (var i=0;i<headers.length;i++){
                    headerRow.append('<th>' + headers[i].innerHTML + '</th>');
                }
                headerElement.append(headerRow);
            },null,'column');
        },
        template: require('./customTable.html')
        }
    }).directive('parent', function(){
        return {
            restrict: 'E',
            transclude:true,
            template:'<ng-transclude ng-if="!row.parent" ></ng-transclude>'

        }
    })
    .directive('child', function(){
        return {
            restrict: 'E',
            transclude:true,
            template:'<ng-transclude ng-if="row.parent" ></ng-transclude>'
        }
    }).directive('headerSection', function(){
        return {
            restrict: 'E',
            replace:true,
            transclude:true,
            template:'<thead ng-transclude></thead>'
        }
    }).directive('bodySection', function(){
        return {
            restrict: 'E',
            replace:true,
            transclude:true,
            template:'<tbody ng-transclude></tbody>'
        }
    }).directive('tableContainer', function(){
        return {
            restrict: 'E',
            replace:true,
            transclude:true,
            template:'<table class="table table table-hover table-striped" ng-transclude></table>'
        }
    }).directive('row', function($compile){
        return {
            restrict: 'E',
            replace: true,
            transclude: true,
            template:'<tr ng-transclude></tr>',
            link: function (scope,el,attr,ctrl,transclude) {
                var childrenCount = 0;
                var icon = el.find('i');
                scope.toggle = toggle;
                function toggle() {
                    if (!scope.row.parent) {
                        var rowid = scope.row.id;
                        var rowIndex = parseInt(scope.$index,10);
                        if (!el.attr('data-expanded')) {
                            scope.getChildren({id: rowid}).then(function(data) {
                                childrenCount = data.length;
                                data = data.map(function(item){
                                    item.parent = rowid;
                                    return item;
                                });
                                scope.data.splice.apply(scope.data, [rowIndex+1, 0].concat(data));
                                el.attr('data-expanded',true);
                                icon.removeClass('fa-plus');
                                icon.addClass('fa-minus');
                            });
                        }
                        else {
                            scope.data.splice(rowIndex+1,childrenCount);
                            el.removeAttr('data-expanded');
                            icon.removeClass('fa-minus');
                            icon.addClass('fa-plus');
                        }
                    }
                }
            }
        }
    }).directive('cells', function ($compile) {
        return {
            restrict: 'E',
            link: function (scope, el, attr, ctrl, transclude) {
                var icon = angular.element('<i class="fa fa-plus" ng-class="{\'fa-mail-reply\': row.parent}" aria-hidden="true"></i>');
                var iconCell = angular.element('<td class="iconColumn"></td>');
                iconCell.append(icon);
                el.parent().append($compile(iconCell)(scope.$parent));

                transclude(scope,function(clone) {
                    var templates = clone.find('template');
                    for (var i=0; i < templates.length; i++){
                        var cell = angular.element('<td>' + templates[i].innerHTML + '</td>');
                        el.parent().append($compile(cell)(scope.$parent));
                    }
                    el.remove();
                },null,'column');
            }
        };
    });

