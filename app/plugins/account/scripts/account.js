/**
 * @ngdoc overview
 * @name gustav.account
 * @description Account module
 */
angular.module('gustav.account', ['ngcsas.core']);

/**
 * @ngdoc service
 * @name gustav.account.service:Account
 *
 * @description
 * API service for account data.
 */
angular.module('gustav.account').factory('Account', function($rootScope, $resource, $filter, ServicePrototype, ENV, ngcsasCoreConstants) {
    var ACCOUNTS_URL, resourceObject;
    ACCOUNTS_URL = ENV.apiEndpoint + ENV.accountsApiPath;
    resourceObject = $resource(ACCOUNTS_URL, {}, {
        get: {
            method: 'GET',
            isArray: false,
            cache:true
        }
    });

    resourceObject.prototype = ServicePrototype;
    //reference to resource (resolved or unresolved, bindable)
    resourceObject.accountsResult = null;

    /**
     * @ngdoc method
     * @name gustav.account.service#load
     * @methodOf gustav.account.service:Account
     *
     * @description
     * Returns list of accounts
     * @return {promise} with list of accounts
     */
    resourceObject.load = function(){
        console.log("Firing a request for accounts...");
        resourceObject.accountsResult = resourceObject.get();

        return resourceObject.accountsResult.$promise.then(function(data) {
            //Request returned OK (there are accounts in response)
            if (data && data.accounts && data.accounts.length > 0) {
                resourceObject.accounts = data.accounts;
                resourceObject.currentAccounts = $filter('filter')(data.accounts, function (a) {
                    if (a.flags.indexOf('cardAccount') != -1 ||
                        a.flags.indexOf('loanAccount') != -1 ||
                        a.flags.indexOf('savingsAccount') != -1) {
                        return false;
                    }
                    return true;
                });

                resourceObject.default = resourceObject.currentAccounts[0];
                return (data.accounts);
            } else {
                throw new Error("account.NO_ACCOUNTS");
            }
        });
    };

    $rootScope.$on(ngcsasCoreConstants.eventTypes.RELOAD_EVT, function() {
        console.log("RELOAD_EVT detected, reload Accounts.");
        resourceObject.reload();
    });

    /**
     * @ngdoc method
     * @name gustav.account.service#isCorrect
     * @methodOf gustav.account.service:Account
     *
     * @description
     * Checks whether account number is correct by checking modulo 11.
     * @return {string} two characters, first is C if string is number, second is M if number conforms with modulo 11
     * test. Returns E otherwise. That means 'CM' means that account number is OK.
     */
    resourceObject.isCorrect = function(CI) {
        var ret = "N"; //N-cislo0,C-cislo,E-chyba
        var vahy = new Array("1", "2", "4", "8", "5", "10", "9", "7", "3", "6");
        var suma = 0;
        var len = CI.length;
        var c,j = 0;
        for (var i = len - 1; i >= 0; i--) {
            c = CI.charAt(i);
            if (c === '0') {} else {
                if (c >= '1' && c <= '9') {
                    ret = "C";
                    suma = suma + c * vahy[j];
                } else {
                    ret = "E";
                    break;
                }
            }
            j++;
        }
        if ((suma % 11) === 0) {
            ret = ret + "M";
        } else {
            ret = ret + "E";
        }

        return ret;
    };
    return resourceObject;
});

/**
 * @ngdoc service
 * @name gustav.account.service:AccountContext
 * @description Account context service for getting registered directives
 */

/**
 * @ngdoc service
 * @name gustav.account.service:AccountContextProvider
 * @description Account context service for registering directives at config time
 */
angular.module('gustav.account').provider('AccountContext', function () {
    var _directives = [];

    this.$get = function () {
        return {

            /**
             * @ngdoc method
             * @name gustav.account.service:get
             * @methodOf gustav.account.service:AccountContext
             *
             * @description
             * Returns list of registered directives to show in account context
             * @return {list} all registered directives
             */

            get: function () {
                return _directives;
            }
        };
    };

    /**
     * @ngdoc method
     * @name gustav.account.service:register
     * @methodOf gustav.account.service:AccountContextProvider
     *
     * @description
     * Register new directive to display in account context
     * @param {string} directive HTML code of directive
     */
    this.register = function (directive) {
        _directives.push(directive);
    };

});

/**
 * @ngdoc service
 * @name gustav.account.service:Iban
 *
 * @description
 * Converts Czech account number to IBAN.
 *
 */
angular.module('gustav.account').service('Iban', function() {
    var instance = {};

    /**
     * @ngdoc method
     * @name gustav.account.service:getIban
     * @methodOf gustav.account.service:Iban
     *
     * @description
     * Converts Czech account number to IBAN.
     * @param {string} prefix account number prefix
     * @param {string} accountNumber number
     * @param {string} bankCode bank code
     * @return {string} IBAN
     */
    instance.getIban = function(prefix, accountNumber, bankCode) {
        var DI;
        var BK = ("0000" + bankCode).substr(-4, 4); //bankCode with left zeroes padding
        var CU = ("000000" + prefix).substr(-6, 6); //prefix with left zeroes padding
        var AC = ("0000000000" + accountNumber).substr(-10, 10); //accountNumber with left zeroes padding

        DI = calc(BK + CU + AC + "123500");
        DI = 98 - DI;
        if (DI < 10) {
            DI = "0" + DI;
        }

        var IB = "CZ" + DI + BK + CU + AC;

        console.log("IBAN: " + IB);

        return (IB);
    };

    /**
     *  Helper function for IBAN counting
     */
    function calc(buf) {
        var index = 0;
        var dividend;
        var pz = -1;
        while (index <= buf.length) {
            if (pz < 0) {
                dividend = buf.substring(index, index + 9);
                index += 9;
            } else if (pz >= 0 && pz <= 9) {
                dividend = pz + buf.substring(index, index + 8);
                index += 8;
            } else {
                dividend = pz + buf.substring(index, index + 7);
                index += 7;
            }
            pz = dividend % 97;
        }
        return pz;
    }


    return instance;
});

/**
 * @ngdoc service
 * @name gustav.account.service:Bic
 *
 * @description
 * Computes BIC.
 *
 */
angular.module('gustav.account').service('Bic', function() {
    var instance = {};

    /**
     * @ngdoc method
     * @name gustav.account.service:getBic
     * @methodOf gustav.account.service:Bic
     *
     * @description
     * Returns bank BIC.
     * @param {string} bankCode bank code
     * @return {string} BIC
     */
    instance.getBic = function(bankCode) {
        var poc = 48;
        var bnkbic = [];
        bnkbic[0] = "0100KOMBCZPP";
        bnkbic[1] = "0300CEKOCZPP";
        bnkbic[2] = "0600AGBACZPP";
        bnkbic[3] = "0710CNBACZPP";
        bnkbic[4] = "0800GIBACZPX";
        bnkbic[5] = "2010FIOBCZPP";
        bnkbic[6] = "2020BOTKCZPP";
        bnkbic[7] = "2030?       ";
        bnkbic[8] = "2050?       ";
        bnkbic[9] = "2060CITFCZPP";
        bnkbic[10] = "2070MPUBCZPP";
        bnkbic[11] = "2100?       ";
        bnkbic[12] = "2200?       ";
        bnkbic[13] = "2210FICHCZPP";
        bnkbic[14] = "2220ARTTCZPP";
        bnkbic[15] = "2240POBNCZPP";
        bnkbic[16] = "2250CTASCZ22";
        bnkbic[17] = "2310ZUNOCZPP";
        bnkbic[18] = "2600CITICZPX";
        bnkbic[19] = "2700BACXCZPP";
        bnkbic[20] = "3020?       ";
        bnkbic[21] = "3030AIRACZPP";
        bnkbic[22] = "3500INGBCZPP";
        bnkbic[23] = "4000SOLACZPP";
        bnkbic[24] = "4300CMZRCZP1";
        bnkbic[25] = "5400ABNACZPP";
        bnkbic[26] = "5500RZBCCZPP";
        bnkbic[27] = "5800JTBPCZPP";
        bnkbic[28] = "6000PMBPCZPP";
        bnkbic[29] = "6100EQBKCZPP";
        bnkbic[30] = "6200COBACZPX";
        bnkbic[31] = "6210BREXCZPP";
        bnkbic[32] = "6300GEBACZPP";
        bnkbic[33] = "6700SUBACZPP";
        bnkbic[34] = "6800VBOECZ2X";
        bnkbic[35] = "7910DEUTCZPX";
        bnkbic[36] = "7940SPWTCZ21";
        bnkbic[37] = "7950?       ";
        bnkbic[38] = "7960?       ";
        bnkbic[39] = "7970?       ";
        bnkbic[40] = "7980?       ";
        bnkbic[41] = "7990?       ";
        bnkbic[42] = "8030GENOCZ21";
        bnkbic[43] = "8040OBKLCZ2X";
        bnkbic[44] = "8060?       ";
        bnkbic[45] = "8090CZEECZPP";
        bnkbic[46] = "8150MIDLCZPP";
        bnkbic[47] = "8200?       ";

        var BIC = '';
        bankCode = ("0000" + bankCode).substr(-4, 4);
        for (var i = 0; i < poc; i++) {
            if (bankCode === bnkbic[i].substring(0, 4)) {
                BIC = bnkbic[i].substring(4, 12);
                i = poc;
            }
        }

        return (BIC);
    };
    return instance;
});


