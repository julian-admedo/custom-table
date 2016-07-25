(function() {
    'use strict';

    angular
        .module('customTable')
        .directive('stickyHeader', stickyHeader);

    /* @ngInject */
    function stickyHeader($window, $compile) {
        var directive = {
            restrict: 'A',
            link: linkFn,
            require: 'customTable'
        };

        return directive;

        function linkFn(scope, element, attrs, ctrl) {
            // TODO: refactor this a bit. Eg: Use a debounce
            var viewPort = angular.element($window);
            var thead = element.find('thead')[0];
            var navBarHeight = angular.element('.navbar').height();
            var headPos;
            var clonedTable;

            if (attrs.stickyHeader === 'true') {
                viewPort.on('scroll', calcLayout);
                viewPort.on('resize', calcWidth);
            }

            function calcLayout() {
                clonedTable = element.find('table.cloned');
                headPos = thead.getBoundingClientRect().top;
                if (headPos <= navBarHeight) {
                    if (!clonedTable.length) {
                        var table = element.find('table');
                        table.css('background','transparent');
                        clonedTable = table.clone();
                        console.log(thead.innerHTML);
                        var theadCompiled = angular.element('<thead></thead').append($compile(thead.innerHTML)(ctrl));

                        clonedTable.find('thead').replaceWith(theadCompiled);

                        clonedTable
                            .addClass('cloned')
                            .css({
                                position: 'fixed',
                             //   'pointer-events': 'none',
                                top: navBarHeight
                            })
                            .width(calcWidth)
                            .find('thead').css('border-bottom', 'solid 1px #e2e1e1').end()
                            .find('tbody').css('opacity', 0).find('tr, td').css('border', 'none');
                        element.append(clonedTable);
                    }
                } else {
                    clonedTable.remove();
                }
            }

            function calcWidth() {
                var tableWidth = element.find('table:not(.cloned)').width();
                if (clonedTable && clonedTable.length) {
                    clonedTable.width(tableWidth);
                }
                return tableWidth;
            }

        }
    }

})();
