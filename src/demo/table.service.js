module.exports = function(ngModule){
    ngModule.factory('tableService', function ($q) {
        return {
            getData: function() {
                return [
                    { id: 1, name: 'John', age: 10, town: 'Cambridge', country:'England'},
                    { id: 2, name: 'Jim', age: 20, town: 'Glasgow', country:'Scotland'},
                    { id: 3, name: 'Jane', age: 30,town: 'Dublin', country:'Ireland'},
                ]
            }
            ,
            getChildren: function(key) {
                console.log('get children called with key ' + key);
                var children;
                switch (parseInt(key,10)) {
                    case 1:
                        children = [
                            {name: 'Alice', age: 1, country: 'England'},
                            {name: 'Joan', age: 3, country: 'England'}
                        ];
                        break;
                    case 2:
                       children = [
                            {name: 'George', age: 4, country: 'Scotland'},
                            {name: 'Alex', age: 6, country: 'Scotland'},
                            {name: 'Mark', age: 2, country: 'Scotland'}
                        ];
                        break;
                    case 3:
                        children = [
                            {name: 'Edward', age: 4, country: 'Ireland'},
                            {name: 'Johann', age: 6, country: 'Ireland'},
                            {name: 'Rita', age: 2, country: 'Ireland'}
                        ]
                        break;
                }

                var deferred = $q.defer();
                deferred.resolve(children);
                return deferred.promise;
            }
        }
    });
}
