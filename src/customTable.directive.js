(function() {
    'use strict';

    angular.module('customTable',[]).directive('customTable', function ($compile, $window) {
        return {
            restrict: 'E',
            replace: true,
            scope: {
                vm: '=',
                data: '=',
                getChildren: '&',
                iconChild: '@',
                iconParent: '@',
                iconParentExpanded: '@',
                className: '@class',
                selectable: '=',
                stickyHeader: '=',
                stickyOffset: '@'
            },
            bindToController: {
                data: '=',
                vm: '='
            },
            transclude: {
                'column':'column'
            },
            controllerAs: 'pvm',
            controller: function($scope) {
                var pvm = this;
                pvm.allSelected = false;

                $scope.$watch('pvm.allSelected', function(selected) {
                    pvm.data.forEach(function(e){
                        e.selected = selected;
                    });
                });
            },
            link: function (scope, el, attr, ctrl, transclude) {
                var columns;
                transclude(scope, function(cols) {
                    columns = cols;
                    buildHeader(el.find('thead'));
                }, null, 'column');

                if (scope.stickyHeader) {
                    stickyHeader(el.find('thead'));
                }

                function buildHeader(thead){
                    var tr = angular.element('<tr></tr>');
                    var th;
                    tr.append('<th class="icon-column"></th>');
                    if (scope.selectable) {
                        addSelectionColumn(tr);
                    }
                    var headers = columns.find('header');
                    for (var i=0; i<headers.length; i++) {
                        th = angular.element('<th></th>').append(headers[i].innerHTML );
                        tr.append(th);
                    }
                    thead.append(tr);

                    return thead;

                    function addSelectionColumn(tr) {
                        var th = angular.element('<th class="noselect"></th>');
                        var checkbox = angular.element('<input type="checkbox" ng-model="pvm.allSelected">');
                        var label = angular.element('<label for="check-all" class="checkbox-label"></label>');
                        th.append(checkbox).append(label);
                        tr.append($compile(th)(scope));
                    }
                }

                function stickyHeader(thead) {
                    var offset = parseInt(scope.stickyOffset,10);
                    var table = el.find('table').css('background','transparent');
                    var clone;

                    angular.element($window).on('scroll', checkScroll).on('resize', setWidth);

                    function checkScroll() {
                        var headPos = thead[0].getBoundingClientRect().top;
                        if (headPos <= offset) {
                           makeClone();
                        } else {
                            destroyClone();
                        }
                    }
                    function makeClone() {
                        if (!clone) {
                            clone = table.clone();
                            var theadCompiled = buildHeader(angular.element('<thead></thead>'));
                            clone.find('thead').replaceWith(theadCompiled);
                            clone
                                .addClass('cloned')
                                .css({
                                    position: 'fixed',
                                    top: offset,
                                    'pointer-events': 'none'
                                })
                                .width(table.width())
                                .find('tbody').css('opacity', 0)
                                .find('tr, td').css('border', 'none');
                            clone.find('thead').css('pointer-events','all');
                            el.append(clone);
                        }
                    }
                    function destroyClone() {
                        if (clone) {
                            clone.remove();
                            clone = undefined;
                        }
                    }
                    function setWidth() {
                        if (clone) {
                            clone.width(table.width());
                        }
                    }
                }
            },
            template:   '<div><table-container><header-section/><body-section>' +
                        '<row ng-repeat="row in data track by $index"' +
                        'ng-click="toggle(row,$index)"' +
                        'ng-class="{ \'child-row\':row.parent, \'parent-row\' : !row.parent }">' +
                        '<cells></cells></row></body-section></table-container></div>'
            };
        }).directive('headerSection', function() {
            return {
                restrict: 'E',
                replace:true,
                transclude:true,
                template:'<thead ng-transclude></thead>'
            };
        }).directive('bodySection', function() {
            return {
                restrict: 'E',
                replace:true,
                transclude:true,
                template:'<tbody ng-transclude></tbody>'
            };
        }).directive('tableContainer', function() {
            return {
                restrict: 'E',
                replace:true,
                transclude:true,
                template:'<table class="{{className}}" ng-transclude></table>'
            };
        }).directive('row', function() {
            return {
                restrict: 'E',
                replace: true,
                transclude: true,
                scope:true,
                template:'<tr ng-transclude></tr>',
                link: function (scope, el, attr, ctrl, transclude) {
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
            };
        }).directive('cells', function ($compile, $timeout) {
            return {
                restrict: 'E',
                link: function (scope, el, attr, ctrl, transclude) {
                    var row = el.parent();
                    addIconColumn(row);
                    if (scope.selectable) {
                        addSelectionColumn(row);
                    }
                    transclude(scope,function(columns) {
                        for (var j=0; j< columns.length; j++) {
                            var templates = angular.element(columns[j]).find('template');
                            var content = '';
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
                            cell[0].querySelectorAll('input,button,textarea,select,.form-control,.editable,.editable-input').forEach(function(c) {
                                c.setAttribute('stop-propagate', true);
                            });
                            row.append($compile(cell)(scope.$parent));
                        }
                        el.remove();
                    }, null, 'column');

                    function addIconColumn(row) {
                        var icon = angular.element('<i aria-hidden="true"></i>');
                        icon.attr('ng-class', '{"' +
                            scope.iconChild + '": row.parent,"' +
                            scope.iconParent + '": !row.parent && !row.expanded,"' +
                            scope.iconParentExpanded + '": !row.parent && row.expanded}');
                        var iconCell = angular.element('<td class="icon-column"></td>');
                        iconCell.append(icon);
                        row.append($compile(iconCell)(scope.$parent));
                    }

                    function addSelectionColumn(row) {
                        var selectionCell = angular.element('<td class="noselect" stop-propagate></td>');
                        var checkboxInput = angular.element('<input type="checkbox" id="check-{{row.id}}" ng-model="row.selected" ng-change="vm.selectRow(row)">');
                        var checkboxLabel = angular.element('<label for="check-{{row.id}}" class="checkbox-label"></label>');
                        selectionCell.append(checkboxInput).append(checkboxLabel);
                        row.append($compile(selectionCell)(scope.$parent));
                    }
                }
            };
        }).directive('stopPropagate', function() {
            return {
                restrict: 'A',
                link: function (scope, el) {
                    el.on('click', function(e) {
                        e.stopPropagation();
                    });
                }
            };
        });

})();
