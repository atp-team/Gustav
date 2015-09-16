/**
 * @ngdoc directive
 * @name gustav.card.directive:cardBox
 * @restrict EA
 * @element ANY
 * @scope
 * @description
 * Displays information about an card.
 */
angular.module('gustav.card').directive('cardBox', function () {
    return {
        templateUrl: 'plugins/card/partials/card.html',
        restrict: 'EA',
        scope: {
            card: '='
        }
    };
});

/**
 * @ngdoc directive
 * @name gustav.card.directive:cardLogo
 * @element span
 * @description
 * Displays card logo (VISA, MasterCard etc).
 */
angular.module('gustav.card').directive('cardLogo', function () {
    return {
        template: "<img ng-src=\"{{icon}}\" class=\"img-responsive card-logo\">",
        restrict: 'EA',
        scope: {
            product: '@'
        },
        link: function (scope) {
            return scope.$watch('product', function (value) {
                if (value.indexOf('Visa Electron') !== -1) {
                    scope.icon = 'plugins/card/images/visa-electron-curved-32px.png';
                } else if (value.indexOf('Visa Classic') !== -1 || value.indexOf('Visa Gold') !== -1) {
                    scope.icon = 'plugins/card/images/visa-curved-32px.png';
                } else if (value.indexOf('Maestro') !== -1) {
                    scope.icon = 'plugins/card/images/maestro-curved-32px.png';
                } else {
                    scope.icon = 'plugins/card/images/mastercard-curved-32px.png';
                }
            });
        }
    };
});
