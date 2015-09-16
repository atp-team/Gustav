
/**
 * @ngdoc filter
 * @name gustav.filter:IBANout
 *
 * @description
 * Converts IBAN to CZ account format.
 */
angular.module('gustav').filter('IBANout', function () {
    return function (iban) {

        var prefix = iban.substring(14, 8).replace(/^0+/, '');
        var number = iban.substring(iban.length - 10).replace(/^0+/, '');
        var accountNumber;

        if (prefix === "") {
            accountNumber = number;
        } else {
            accountNumber = prefix + "-" + number;
        }

        return (accountNumber + '/0800');
    };
})

/**
 * @ngdoc filter
 * @name gustav.filter:amount
 *
 * @description
 * Formats object with given precision, value and currency.
 */
    .filter('amount', function ($filter) {
        return function (object) {
            var value = 0;
            var precision = 0;

            if (!angular.isUndefinedOrNull(object) && !angular.isUndefinedOrNull(object.value)) {
                value = object.value;
            }

            if (! angular.isUndefinedOrNull(object.precision)) {
                precision = object.precision;
            }

            value = value / Math.pow(10, precision);
            return $filter('currency')(value, object.currency);
        };
    });

