/**
 * @ngdoc overview
 * @name gustav.history
 * @description Transaction history module
 */
angular.module('gustav.history', ['ngcsas.core', 'gustav.account']).config(function($stateProvider) {
        $stateProvider.state('history', {
            url: "/history?account",
            templateUrl: 'plugins/history/partials/history.html',
            controller: 'HistoryCtrl',
            reloadOnSearch: false,
            resolve: {
                accounts: function(Account) {
                    return Account.load();
                }
            }
        });
    })
    .config(function(MenuProvider) {
        MenuProvider.add({
            icon: "glyphicon glyphicon-th-list",
            url: '/history',
            title: 'history.MENU_ITEM'
        });
    })
    .config(function(AccountContextProvider) {
        AccountContextProvider.register('<short-history account="account"></short-history>');
    })

/**
 * @ngdoc controller
 * @name gustav.history.controller:HistoryCtrl
 *
 * @description
 * Shows list of transactions from transaction history.
 */
.controller('HistoryCtrl', function($scope, $http, $filter, $stateParams, $location, Account, History, accounts) {
    $scope.filter = {};
    $scope.accounts = Account.currentAccounts;
    $scope.filter.forAccount = Account.default;

    $scope.$watch('filter', function(filter) {
        if (filter && filter.forAccount && filter.dateStart && filter.dateEnd) {
            History.load(filter.forAccount.accountno.iban,
                new Date(filter.dateStart).toJSON().replace(/\.\d{3}/, ''),
                new Date(filter.dateEnd).toJSON().replace(/\.\d{3}/, '')).then(function(data) {
                $scope.transactions = data;
            });
        }
    }, true);

    //try to set account if present in params
    if ($stateParams.account) {
        angular.forEach($scope.accounts, function(account) {
            if (account.accountno.iban === $stateParams.account) {
                console.log('Switching account to: ', account);
                $scope.filter.forAccount = account;
                $location.search('');
            }
        });
    }

    var lastMonth = new Date();
    lastMonth.setMonth(lastMonth.getMonth() -1);
    $scope.filter.dateEnd = $filter("date")(Date.now(), 'yyyy-MM-dd');
    $scope.filter.dateStart = $filter("date")(lastMonth, 'yyyy-MM-dd');
});

/**
 * @ngdoc service
 * @name gustav.history.service:History
 *
 * @description
 * API service for transaction history data.
 */
angular.module('gustav.history').factory('History',
    function($rootScope, $resource, ServicePrototype, ENV) {
        var HISTORY_URL, resourceObject;
        HISTORY_URL = ENV.apiEndpoint + ENV.historyApiPath;

        resourceObject = $resource(HISTORY_URL, {
            account: '@account',
            from: '@from',
            to: '@to'
        }, {
            get: {
                method: 'GET',
                isArray: false,
                cache: true
            }
        });

        resourceObject.prototype = ServicePrototype;
        //reference to resource (resolved or unresolved, bindable)
        resourceObject.historyResult = null;

        /**
         * @ngdoc method
         * @name gustav.history.service:load
         * @methodOf gustav.history.service:History
         *
         * @description
         * Returns transaction history
         * @param {string} account account number (IBAN)
         * @param {string} from date from (ISO date string)
         * @param {string} to date to (ISO date string)
         * @return {promise} with transaction history
         */
        resourceObject.load = function(account, from, to) {
            console.log("Firing a request for transaction history...");
            resourceObject.historyResult = resourceObject.get({
                account: account,
                from: from,
                to: to
            });
            return resourceObject.historyResult.$promise.then(function(data) {
                //Request returned OK (there are accounts in response)
                if (data && data.transactions) {
                    return (data.transactions);
                } else {
                    throw new Error('history.NO_SHORT_HISTORY');
                }
            });
        };

        return resourceObject;
    });
