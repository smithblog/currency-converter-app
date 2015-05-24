angular.module('currencyConverter.controllers', [])

.controller('HomeCtrl', ['$scope', '$localStorage',
    function ($scope, $localStorage) {

        $scope.data = {
            amount: '0',
            base: 0,
            showEdit: false,
            keypadShow: true
        };

        $scope.$on('$ionicView.beforeEnter', function () {
            $scope.creditcards = $localStorage.creditcards;

            if (!$localStorage.settings) {
                $localStorage.settings = {
                    exchangeRate: 7.8,
                    onlineRate: 'na',
                    lastUpdateTime: null,
                    foreignCurrency: 'USD',
                    baseCurrency: "HKD"
                };
            }

            $scope.settings = $localStorage.settings;

            $scope.data.showEdit = false;

            updateMin();
        });

        $scope.onDelete = function (index) {
            $scope.creditcards.splice(index, 1);
        };

        $scope.onReorder = function (item, fromIndex, toIndex) {
            $scope.creditcards.splice(fromIndex, 1);
            $scope.creditcards.splice(toIndex, 0, item);
        };

        $scope.flagIcon = function (currency) {
            switch (currency) {
            case 'USD':
                return 'flag-icon-us';
            case 'EUR':
                return 'flag-icon-eu';
            case 'GBP':
                return 'flag-icon-gb';
            case 'JPY':
                return 'flag-icon-jp';
            case 'SGD':
                return 'flag-icon-sg';
            case 'AUD':
                return 'flag-icon-au';
            case 'NZD':
                return 'flag-icon-nz';
            case 'CHF':
                return 'flag-icon-ch';
            case 'CAD':
                return 'flag-icon-ca';
            case 'MYR':
                return 'flag-icon-my';
            case 'TWD':
                return 'flag-icon-tw';
            case 'CNY':
                return 'flag-icon-cn';
            case 'PHP':
                return 'flag-icon-ph';
            case 'THB':
                return 'flag-icon-th';
            case 'KRW':
                return 'flag-icon-kr';
            case 'AED':
                return 'flag-icon-ae';
            case 'HKD':
                return 'flag-icon-hk';
            }
        };

        $scope.amount = function () {
            return Math.round($scope.data.amount * $localStorage.settings.exchangeRate * 100) / 100;
        };

        $scope.ccAmount = function (cc) {
            var unionRate = 1.005;
            var ccRate = $localStorage.settings.onlineRate;
            if (ccRate === 'na') {
                return 0;
            }
            return Math.round($scope.data.amount * ccRate * (cc.type === 'unionpay' ? unionRate : 1) * (1 + cc.transactionFee / 100) * (1 - cc.rebate / 100) * 100) / 100;
        };

        var minValue;

        $scope.isMin = function (cc) {
            if (minValue === 0) return false;

            return $scope.ccAmount(cc) === minValue;
        };

        $scope.$watch('data.amount', function () {
            updateMin();
        });

        var updateMin = function () {
            minValue = Number.MAX_VALUE;
            $scope.creditcards.forEach(function (cc) {
                var ccValue = $scope.ccAmount(cc);
                if (ccValue < minValue) {
                    minValue = ccValue;
                }
            });
        };

        $scope.showKeypad = function () {
            $scope.data.keypadShow = true;
            $scope.data.amount = '0';
        };

    }
])

.controller('SettingsCtrl', ['$scope', '$localStorage', 'ExchangeRateService', '$cordovaNetwork', '$cordovaDialogs', '$translate',
    function ($scope, $localStorage, ExchangeRateService, $cordovaNetwork, $cordovaDialogs, $translate) {

        $scope.currencies = ['USD', 'EUR', 'GBP', 'JPY', 'SGD', 'AUD', 'NZD', 'CHF', 'CAD', 'MYR', 'TWD', 'CNY', 'PHP', 'THB', 'KRW', 'AED', 'HKD'];

        $scope.settings = $localStorage.settings;

        $scope.data = {
            keypadShow: false,
            loading: false
        };

        $scope.updateRate = function (onlineOnly) {
            if ($cordovaNetwork.isOnline()) {
                $scope.data.loading = true;

                ExchangeRateService.convert($localStorage.settings.foreignCurrency, $localStorage.settings.baseCurrency).then(function (data) {
                    if (!onlineOnly) {
                        $localStorage.settings.exchangeRate = data;
                    }
                    $localStorage.settings.onlineRate = data;
                    $localStorage.settings.lastUpdateTime = Date.now();
                    $scope.data.loading = false;
                }, function (err) {
                    $log.error('ExRateService err: ' + JSON.stringify(err));
                });
            } else {
                $cordovaDialogs.alert(
                    $translate.instant('dialog.no_network_sub_title'),
                    $translate.instant('dialog.no_network_title'),
                    $translate.instant('dialog.no_network_button'));
            }
        };

        $scope.showKeypad = function () {
            $scope.data.keypadShow = true;
            $scope.settings.exchangeRate = '0';
        };

}
])

.controller('CreditCardCtrl', ['$scope', '$ionicListDelegate', '$log', '$localStorage', 'CreditCardFileService',
    function ($scope, $ionicListDelegate, $log, $localStorage, CreditCardFileService) {

        $scope.creditcard = {};

        $scope.$on('$ionicView.beforeEnter', function () {
            CreditCardFileService.read().then(function (data) {
                $scope.creditcards = data;
            }, function (error) {
                $log.error('CreditCardFileService.read error: ' + JSON.stringify(error));
            });
        });

        $scope.selectCreditCard = function (creditcard) {
            if ($scope.isAdded(creditcard)) {
                var elementPos = $localStorage.creditcards.map(function (x) {
                    return x.id;
                }).indexOf(creditcard.id);

                $localStorage.creditcards.splice(elementPos, 1);
            } else {
                if (!$localStorage.creditcards) {
                    $localStorage.creditcards = [];
                }
                $localStorage.creditcards.push(creditcard);
            }

        };

        $scope.isAdded = function (cc) {
            if ($localStorage.creditcards) {
                var elementPos = $localStorage.creditcards.map(function (x) {
                    return x.id;
                }).indexOf(cc.id);

                return elementPos !== -1;
            }
        };

        $scope.delete = function (cc) {
            // remove from file
            var elementPos = $scope.creditcards.map(function (x) {
                return x.id;
            }).indexOf(cc.id);

            $scope.creditcards.splice(elementPos, 1);

            CreditCardFileService.write($scope.creditcards).then(function () {
                // remove from added list (home) if needed
                var homePos = $localStorage.creditcards.map(function (x) {
                    return x.id;
                }).indexOf(cc.id);

                if (homePos !== -1) {
                    $localStorage.creditcards.splice(homePos, 1);
                }
            }, function (error) {
                $log.error("CreditCardFileService.write error: " + JSON.stringify(error));
            });

        };

    }
])

.controller('CreditCardNewCtrl', ['$scope', '$ionicHistory', '$log', '$localStorage', 'CreditCardFileService',
    function ($scope, $ionicHistory, $log, $localStorage, CreditCardFileService) {

        // order according to bank code
        $scope.banks = ['standardcharter', 'hsbc', 'citibank', 'ccb', 'boc', 'bea', 'dbs', 'citic', 'winglung', 'hangseng', 'shacom', 'bankcomm', 'winghang', 'dahsing', 'chonghing', 'icbc', 'fubon', 'aeon', 'ae'];

        $scope.ccTypes = ['visa', 'mastercard', 'unionpay', 'american-express', 'jcb'];

        $scope.$on('$ionicView.beforeEnter', function () {
            $scope.cc = {
                id: Date.now(),
                bank: 'standardcharter',
                type: 'visa',
                display: '',
                transactionFee: 0,
                rebate: 0
            };

            $scope.data = {
                keypadShow: false,
                model: '0',
                currentInput: ''
            };
        });


        $scope.$watch('data.model', function () {
            switch ($scope.data.currentInput) {
            case 'transactionFee':
                $scope.cc.transactionFee = $scope.data.model;
                break;
            case 'rebate':
                $scope.cc.rebate = $scope.data.model;
                break;
            }
        });

        $scope.updateModel = function (model) {
            $scope.data.model = '0';
            $scope.data.currentInput = model;
            $scope.data.keypadShow = true;
        };

        $scope.save = function (cc) {
            CreditCardFileService.read().then(function (data) {
                var creditcards = data;
                creditcards.push(cc);

                CreditCardFileService.write(creditcards).then(function () {
                    if (!$localStorage.creditcards) {
                        $localStorage.creditcards = [];
                    }
                    $localStorage.creditcards.push(cc);
                    $ionicHistory.goBack();
                }, function (error) {
                    $log.error("CreditCardFileService.write error " + JSON.stringify(error));
                });
            });
        };

}])

;
