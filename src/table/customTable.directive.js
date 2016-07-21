module.exports = function(ngModule) {

    ngModule.directive('customTable', function () {
        return {
            restrict: 'AE',
            replace: true,
            scope:{
                data:'=',
                getChildren:'&'
            }
            ,
            transclude: {
                'header':'header',
                'cell':'cell'
                },
            link: function (scope,el,attrs,ctrl,transclude) {

                var headerElement = el.find('thead');

                transclude(scope,function(clone){
                    var headerRow = $('<tr></tr>');
                    headerRow.append('<th class="iconColumn"></th>');
                    headerRow.append(clone);
                    headerElement.append(headerRow);
                },headerElement,'header');

            },
            template: require('./customTable.html')
        };
    })
    .directive('cell', function(){
        return {
            restrict: 'E',
            replace:true,
            transclude:true,
            template:'<td></td>',
            link: function (scope,el,attrs,d,transclude) {
                transclude(scope.$parent, function(clone, scope) {
                    el.append(clone);
                    el.find('input').on('click',function(e){
                        e.stopPropagation();
                    });
                });
            }
        }
    })
    .directive('parent', function(){
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
    })
    .directive('headerSection', function(){
        return {
            restrict: 'E',
            replace:true,
            transclude:true,
            template:'<thead ng-transclude></thead>'
        }
    })
    .directive('bodySection', function(){
        return {
            restrict: 'E',
            replace:true,
            transclude:true,
            template:'<tbody ng-transclude></tbody>'
        }
    })
    .directive('tableContainer', function(){
        return {
            restrict: 'E',
            replace:true,
            transclude:true,
            template:'<table class="table table table-hover table-striped" ng-transclude></table>'
        }
    })
    .directive('header', function(){
        return {
            restrict: 'E',
            replace:true,
            transclude:true,
            template:'<th ng-transclude></th>'
        }
    })
    .directive('row', function(){
        return {
            restrict: 'EA',
            replace: true,
            transclude: true,
            template:'<tr ng-transclude></tr>',
            link: function ($scope,el,attr) {
                var childrenCount = 0;
                var icon = el.find('i');
                var isParent = !attr['parent'];
                if (isParent) {
                    icon.addClass('fa-plus');
                    el.on('click',toggle);
                }
                function toggle() {
                    var rowid = attr['key'];
                    var rowIndex = parseInt(attr['index'],10);
                    $scope.$apply(function() {
                        if (!el.attr('data-expanded')) {
                            $scope.getChildren({id: rowid}).then(function(data) {
                                childrenCount = data.length;
                                data = data.map(function(item){
                                    item.parent = rowid;
                                    return item;
                                });
                                $scope.data.splice.apply($scope.data, [rowIndex+1, 0].concat(data));
                                el.attr('data-expanded',true);
                                icon.removeClass('fa-plus');
                                icon.addClass('fa-minus');
                            });
                        }
                        else {
                            $scope.data.splice(rowIndex+1,childrenCount);
                            el.removeAttr('data-expanded');
                            icon.removeClass('fa-minus');
                            icon.addClass('fa-plus');
                        }
                    })
                }
            }
        }
    }).directive('ngTranscludeReplace', ['$log', function ($log) {
              return {
                //  terminal: true,
                  restrict: 'EA',

                  link: function ($scope, $element, $attr, ctrl, transclude) {
                      if (!transclude) {
                          $log.error('orphan',
                                     'Illegal use of ngTranscludeReplace directive in the template! ' +
                                     'No parent directive that requires a transclusion found. ');
                          return;
                      }

                      transclude($scope,function (clone) {
                          if (clone.length) {
                              $element.replaceWith(clone);
                          }
                          else {
                              $element.remove();
                          }
                      },null,'cell');
                  }
              };
          }]);
}
