// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('currencyConverter', ['ionic', 'currencyConverter.services', 'currencyConverter.controllers', 'currencyConverter.directives', 'ngStorage', 'angularMoment', 'ngCordova', 'pascalprecht.translate'])

.run(['$ionicPlatform', '$log', '$localStorage', 'ExchangeRateService', '$cordovaNetwork', 'amMoment', 'CreditCardFileService',
      function ($ionicPlatform, $log, $localStorage, ExchangeRateService, $cordovaNetwork, amMoment, CreditCardFileService) {
        $ionicPlatform.ready(function () {
            // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
            // for form inputs)
            if (window.cordova && window.cordova.plugins.Keyboard) {
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(false);
            }
            if (window.StatusBar) {
                StatusBar.styleDefault();
            }
            // update online exchange rate
            if ($cordovaNetwork.isOnline()) {
                ExchangeRateService.convert($localStorage.settings.foreignCurrency, $localStorage.settings.baseCurrency).then(function (data) {
                    $localStorage.settings.onlineRate = data;
                    $localStorage.settings.lastUpdateTime = Date.now();
                }, function (err) {
                    $log.error('ExRateService err: ' + JSON.stringify(err));
                });
            }
            amMoment.changeLocale('zh-TW');

            CreditCardFileService.init().then(function () {}, function (error) {
                $log.error('CreditCardFileService init err: ' + JSON.stringify(err));
            });
        });
}])

.config(['$translateProvider', function ($translateProvider) {
    $translateProvider.useStaticFilesLoader({
        prefix: 'i18n/',
        suffix: '.json'
    });
    $translateProvider.preferredLanguage('zh_HK');
    $translateProvider.useSanitizeValueStrategy('escaped');
}])

.config(['$ionicConfigProvider', function ($ionicConfigProvider) {
    $ionicConfigProvider.backButton.text('').previousTitleText(false);
}])

.config(['$stateProvider', '$urlRouterProvider',
         function ($stateProvider, $urlRouterProvider) {

        $urlRouterProvider.otherwise('/');

        $stateProvider
            .state('home', {
                url: '/',
                templateUrl: 'templates/home.html',
                controller: 'HomeCtrl'
            })
            .state('settings', {
                url: '/settings',
                templateUrl: 'templates/settings.html',
                controller: 'SettingsCtrl'
            })
            .state('creditcard', {
                url: '/creditcard',
                templateUrl: 'templates/creditcard.html',
                controller: 'CreditCardCtrl'
            })
            .state('creditcard-new', {
                url: '/creditcard-new',
                templateUrl: 'templates/creditcard-new.html',
                controller: 'CreditCardNewCtrl'
            });

}])

;