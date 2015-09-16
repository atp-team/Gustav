/**
 * @ngdoc directive
 * @name gustav.history.directive:shortHistory
 * @element div
 * @description
 * Displays short transaction history.
 */
angular.module('gustav.history').directive('shortHistory', function(History, $state) {
    return {
        templateUrl: 'plugins/history/partials/short-history.html',
        restrict: 'EA',
        scope: {
            account: '='
        },
        link: function(scope) {
            var lastMonth = new Date();
            lastMonth = lastMonth.setMonth(lastMonth.getMonth() - 1);
            History.load(scope.account.accountno.iban,
                new Date(lastMonth).toISOString().replace(/\.\d{3}/, ''),
                new Date().toISOString().replace(/\.\d{3}/, '')
            ).then(
                function(data) {
                    scope.transactions = data;
                },
                function() {
                    scope.transactions = [];
                });
            scope.goto = function(account) {
                $state.go('history', {account: account});
            };

        }
    };
});
