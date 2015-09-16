'use strict';

angular.module('gustav')
/**
 * @ngdoc service
 * @name gustav.account.service:Account
 *
 * @description
 * API service for account data.
 */
.factory('Profile', function($rootScope, $resource, ServicePrototype, ENV, ngcsasCoreConstants) {
    var PROFILE_URL, resourceObject;
    PROFILE_URL = ENV.apiEndpoint + ENV.profileApiPath;
    resourceObject = $resource(PROFILE_URL, {}, {
        get: {
            method: 'GET',
            isArray: false,
            cache: true
        }
    });

    resourceObject.prototype = ServicePrototype;
    //reference to resource (resolved or unresolved, bindable)
    resourceObject.profileResult = null;

    /**
     * @ngdoc method
     * @name gustav.account.service#load
     * @methodOf gustav.account.service:Account
     *
     * @description
     * Returns list of accounts
     * @return {promise} with list of accounts
     */
    resourceObject.load = function() {
        console.log("Firing a request for profile...");
        resourceObject.profileResult = resourceObject.get();

        return resourceObject.profileResult.$promise.then(function(data) {
            //Request returned OK (there are accounts in response)
            if (data) {
                resourceObject.profile = data;
                return (data);
            } else {
                throw new Error("gustav.NO_PROFILE");
            }
        });
    };

    $rootScope.$on(ngcsasCoreConstants.eventTypes.RELOAD_EVT, function() {
        console.log("RELOAD_EVT detected, reload Profile.");
        resourceObject.reload();
    });

    return resourceObject;
})



/**
 * @ngdoc directive
 * @name ngcsas.core.directive:bankcode
 * @element input
 * @function
 *
 * @description
 * Validate bank code.
 */
.directive('bankcode', function (Bic) {
    return {
        require: 'ngModel',
        link: function (scope, elm, attrs, ctrl) {
            ctrl.$parsers.unshift(function (viewValue) {
                if (ctrl.$isEmpty(viewValue)) {
                    ctrl.$setPristine();
                    return viewValue;
                }
                if (viewValue.length === 4 && Bic.getBic(viewValue) !== "") {
                    // it is valid
                    ctrl.$setValidity('invalidBankCode', true);
                    return viewValue;
                } else {
                    // it is invalid, return undefined (no model update)
                    ctrl.$setValidity('invalidBankCode', false);
                    return undefined;
                }
            });
        }
    };
})

/**
 * @ngdoc directive
 * @name ngcsas.core.directive:accountnumber
 * @element input
 * @function
 *
 * @description
 * Validate account number.
 */
.directive('accountnumber', function (Account) {
    return {
        require: 'ngModel',
        link: function (scope, elm, attrs, ctrl) {
            ctrl.$parsers.unshift(function (viewValue) {

                if (ctrl.$isEmpty(viewValue)) {
                    ctrl.$setPristine();
                    return viewValue;
                }

                var accountsplit = viewValue.split("-");

                if (Account.isCorrect(accountsplit[0]) !== "CM") {
                    // it is invalid, return undefined (no model update)
                    ctrl.$setValidity('invalidAccountNumber', false);
                    return undefined;
                }

                if (accountsplit.length === 2 && Account.isCorrect(accountsplit[1]) !== "CM") {
                    // it is invalid, return undefined (no model update)
                    ctrl.$setValidity('invalidAccountNumber', false);
                    return undefined;
                }

                //it is valid
                ctrl.$setValidity('invalidAccountNumber', true);
                return viewValue;

            });
        }
    };
});
