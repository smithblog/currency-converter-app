angular.module('currencyConverter.services', [])

.factory("ExchangeRateService", ['$http', '$q',
    function ($http, $q) {
        return {
            convert: function (foreign, base) {

                var q = $q.defer();

                var yql = 'select * from yahoo.finance.xchange where pair in ("' + foreign + base + '")';
                var uri = 'https://query.yahooapis.com/v1/public/yql?q=' + yql + '&format=json&env=store://datatables.org/alltableswithkeys';

                $http.get(encodeURI(uri)).success(function (data) {
                    q.resolve(data.query.results.rate.Rate);
                }).error(function (error) {
                    q.reject(error);
                });

                return q.promise;
            }
        };
}
])

.factory("CreditCardFileService", ['$http', '$q', '$log', '$cordovaFile',
    function ($http, $q, $log, $cordovaFile) {
        var jsonFile = 'creditcard.json';

        var initCC = function () {
            var q = $q.defer();

            $http.get('js/creditcard.json').success(function (data) {
                $cordovaFile.writeFile(cordova.file.dataDirectory, jsonFile, JSON.stringify(data), true).then(function (success) {
                    q.resolve();
                }, function (error) {
                    q.reject(error);
                });
            }).error(function (data) {
                $log.error('Read creditcard.json error: ' + JSON.stringify(data));
            });

            return q.promise;
        };

        return {
            init: function () {
                var q = $q.defer();

                $cordovaFile.checkFile(cordova.file.dataDirectory, jsonFile)
                    .then(function (success) {
                        // file exists
                        q.resolve();
                    }, function (error) {
                        // init
                        initCC().then(function (success) {
                            q.resolve();
                        }, function (error) {
                            q.reject(error);
                        });
                    });

                return q.promise;
            },
            read: function () {
                var q = $q.defer();

                $cordovaFile.readAsText(cordova.file.dataDirectory, jsonFile)
                    .then(function (data) {
                        q.resolve(JSON.parse(data));
                    }, function (error) {
                        q.reject(error);
                    });

                return q.promise;
            },
            write: function (data) {
                var q = $q.defer();

                $cordovaFile.writeFile(cordova.file.dataDirectory, jsonFile, JSON.stringify(data), true)
                    .then(function (success) {
                        q.resolve();
                    }, function (error) {
                        q.reject(error);
                    });

                return q.promise;
            }
        };

}])

;