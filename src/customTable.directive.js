angular.module('customTable',[]).directive('customTable', function () {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            vm:'=',
            data:'=',
            getChildren:'&'
        },
        transclude: {
            'column':'column'
        },
        link: function (scope,el,attr,ctrl,transclude) {
            var headerElement = el.find('thead');
            transclude(scope, function(columns) {
                var headerRow = angular.element('<tr></tr>');
                headerRow.append('<th class="iconColumn"></th>');
                var headers = columns.find('header');
                for (var i=0;i<headers.length;i++){
                    headerRow.append('<th>' + headers[i].innerHTML + '</th>');
                }
                headerElement.append(headerRow);
            }, null, 'column');
        },
        template:   '<div><table-container><header-section/><body-section>' +
                    '<row ng-repeat="row in data track by $index"' +
                    'ng-click="toggle(row,$index)"' +
                    'ng-class="{ \'child-row\':row.parent, \'parent-row\' : !row.parent }">' +
                    '<cells></cells>' +
                    '</row></body-section></table-container></div>'
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
    }).directive('row', function(){
        return {
            restrict: 'E',
            replace: true,
            transclude: true,
            scope:true,
            template:'<tr ng-transclude></tr>',
            link: function (scope,el,attr,ctrl,transclude) {
                scope.toggle = toggle;
                function toggle(row, index) {
                    if (!row.parent) {
                        if (!row.expanded) {
                            scope.getChildren({id: row.id}).then(function(data) {
                                row.children = data.length;
                                data = data.map(function(item){
                                    item.parent = row.id;
                                    return item;
                                });
                                scope.data.splice.apply(scope.data, [index + 1, 0].concat(data));
                                row.expanded = true;
                            });
                        }
                        else {
                            scope.data.splice(index + 1, row.children);
                            row.expanded = false;
                        }
                    }
                }
            }
        }
    }).directive('cells', function ($compile) {
        return {
            restrict: 'E',
            link: function (scope, el, attr, ctrl, transclude) {
                var icon = angular.element('<i class="fa fa-plus" aria-hidden="true"></i>');
                icon.attr('ng-class','{"fa-mail-reply": row.parent,"fa-plus": !row.parent && !row.expanded,"fa-minus": !row.parent && row.expanded}');
                var iconCell = angular.element('<td class="iconColumn"></td>');
                iconCell.append(icon);
                el.parent().append($compile(iconCell)(scope.$parent));
                transclude(scope,function(columns) {
                    for (var j=0; j< columns.length; j++) {
                        var templates = angular.element(columns[j]).find('template');
                        var content = "";
                        for (var i=0; i < templates.length; i++){
                            if (templates[i].attributes.child) {
                                content += '<span ng-if="row.parent">' + templates[i].innerHTML + '</span>';
                            }
                            else if (templates[i].attributes.parent) {
                                content += '<span ng-if="!row.parent">' + templates[i].innerHTML+ '</span>';
                            }
                            else {
                                content = templates[i].innerHTML;
                            }
                        }
                        var cell = angular.element('<td>' + content + '</td>');
                        cell.find('input').on('click', function(e) {
                            e.stopPropagation();
                        });
                        cell.find('button').on('click', function(e) {
                            e.stopPropagation();
                        });
                        el.parent().append($compile(cell)(scope.$parent));
                    }
                    el.remove();
                },null,'column');
            }
        };
    });
