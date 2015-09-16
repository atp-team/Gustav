/**
 * @ngdoc directive
 * @name gustav.account.directive:accountBox
 * @restrict EA
 * @element ANY
 * @scope
 * @description
 * Displays information about an account.
 */
angular.module('gustav.account').directive('accountBox', function (Account) {
    return {
        templateUrl: 'plugins/account/partials/account.html',
        restrict: 'EA',
        scope: {
            account: '='
        },
        link: function (scope) {
            //append only to current accounts
            if (Account.currentAccounts.filter(function (a) {
                return a.accountno.iban === scope.account.accountno.iban
            }).length > 0) {
                scope.showPlugins = true;
            }

        }
    };
});


/**
 * @ngdoc directive
 * @name gustav.account.directive:showPlugins
 * @restrict EA
 * @element ANY
 * @scope
 * @description
 * Shows all account context plugins.
 */
angular.module('gustav.account').directive('accountContext', function ($compile, AccountContext) {
    return {
        template: '',
        restrict: 'EA',
        scope: {
            account: '='
        },
        link: function (scope, element) {
            var directives = AccountContext.get();
            angular.forEach(directives, function (directive) {
                element.append(directive);
            });
            $compile(element.contents())(scope);
        }
    };
});

/**
 * @ngdoc directive
 * @name gustav.account.directive:accountIcon
 * @restrict EA
 * @element ANY
 * @scope
 * @description
 * Assign account icon class based on account flags
 */
angular.module('gustav.account').directive('accountIcon', function () {
    return {
        template: '',
        restrict: 'EA',
        scope: {
            account: '=accountIcon'
        },
        link: function (scope, element) {
            var account = scope.account;
            if (account.flags.indexOf('cardAccount') !== -1) {
                element.addClass('glyphicon-credit-card');
            } else if (account.flags.indexOf('savingsAccount') !== -1) {
                element.addClass('glyphicon-euro');
            } else if (account.flags.indexOf('loanAccount') !== -1) {
                element.addClass('glyphicon-gift');
            } else {
                element.addClass('glyphicon-user');
            }
        }
    };
});
