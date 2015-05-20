angular.module('currencyConverter.directives', [])

.directive('keypad', function () {
    return {
        restrict: 'E',
        transclude: true,
        replace: true,
        scope: {
            bindModel: '=ngModel',
            bindShow: '=ngShow'
        },
        link: function ($scope, $element, $attr) {
            var decimalAdded = function () {
                return $scope.bindModel.indexOf(".") !== -1;
            };

            if (angular.isUndefined($scope.bindModel)) {
                $scope.bindModel = '0';
            }

            $scope.add = function (num) {
                if ($scope.bindModel && $scope.bindModel.length > 12) {
                    return;
                } else if (num === '.') {
                    if (!decimalAdded()) {
                        if ($scope.bindModel === '0') {
                            $scope.bindModel = '0.';
                        } else {
                            $scope.bindModel += num;
                        }
                    }
                } else if ($scope.bindModel === '0') {
                    if (num !== '00' && num !== '000') {
                        $scope.bindModel = num;
                    }
                } else {
                    $scope.bindModel += num;
                }
            };

            $scope.del = function () {
                $scope.bindModel = '0';
            };

            $scope.done = function () {
                if ($scope.bindShow)
                    $scope.bindShow = false;
            };
        },
        templateUrl: 'templates/partial/keypad.html'
    };
})

;