module.exports = function(ngModule) {
    ngModule.factory('tableService', function ($q, $timeout) {
        return {
            getData: function() {

                var data = [
                    { id: 1, name: 'John', age: 10, town: 'Cambridge', country:'England'},
                    { id: 2, name: 'Jim', age: 20, town: 'Glasgow', country:'Scotland'},
                    { id: 3, name: 'Jane', age: 30,town: 'Dublin', country:'Ireland'},
                     { id: 1, name: 'John', age: 10, town: 'Cambridge', country:'England'},
                    { id: 2, name: 'Jim', age: 20, town: 'Glasgow', country:'Scotland'},
                    { id: 3, name: 'Jane', age: 30,town: 'Dublin', country:'Ireland'},
                     { id: 1, name: 'John', age: 10, town: 'Cambridge', country:'England'},
                    { id: 2, name: 'Jim', age: 20, town: 'Glasgow', country:'Scotland'},
                    { id: 3, name: 'Jane', age: 30,town: 'Dublin', country:'Ireland'},
                     { id: 1, name: 'John', age: 10, town: 'Cambridge', country:'England'},
                    { id: 2, name: 'Jim', age: 20, town: 'Glasgow', country:'Scotland'},
                    { id: 3, name: 'Jane', age: 30,town: 'Dublin', country:'Ireland'},
                     { id: 1, name: 'John', age: 10, town: 'Cambridge', country:'England'},
                    { id: 2, name: 'Jim', age: 20, town: 'Glasgow', country:'Scotland'},
                    { id: 3, name: 'Jane', age: 30,town: 'Dublin', country:'Ireland'},
                     { id: 1, name: 'John', age: 10, town: 'Cambridge', country:'England'},
                    { id: 2, name: 'Jim', age: 20, town: 'Glasgow', country:'Scotland'},
                    { id: 3, name: 'Jane', age: 30,town: 'Dublin', country:'Ireland'},
                     { id: 1, name: 'John', age: 10, town: 'Cambridge', country:'England'},
                    { id: 2, name: 'Jim', age: 20, town: 'Glasgow', country:'Scotland'},
                    { id: 3, name: 'Jane', age: 30,town: 'Dublin', country:'Ireland'},
                     { id: 1, name: 'John', age: 10, town: 'Cambridge', country:'England'},
                    { id: 2, name: 'Jim', age: 20, town: 'Glasgow', country:'Scotland'},
                    { id: 3, name: 'Jane', age: 30,town: 'Dublin', country:'Ireland'}
                ];
                var deferred = $q.defer();
                $timeout(function() {
                    deferred.resolve(data);
                }, 3000);

                return deferred.promise;


            },
            getChildren: function(key) {
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
                            {name: 'Edward', age: 5, country: 'Ireland'},
                            {name: 'Johann', age: 9, country: 'Ireland'},
                            {name: 'Rita', age: 8, country: 'Ireland'}
                        ];
                        break;
                }

                var deferred = $q.defer();
                $timeout(function() {
                    deferred.resolve(children);
                }, 3000);

                return deferred.promise;
            }
        };
    });
};
