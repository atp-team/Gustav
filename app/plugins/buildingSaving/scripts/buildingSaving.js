/**
 * @ngdoc overview
 * @name gustav.buildingSaving
 * @description Building saving module
 */
angular.module('gustav.buildingSaving', ['ngcsas.core']).config(function ($stateProvider) {
    $stateProvider.state('buildingSaving', {
        url:'/buildingSavings',
        templateUrl: 'plugins/buildingSaving/partials/buildingSavings.html',
        controller: 'BuildingSavingsCtrl',
        resolve: {
            buildingSavings: function (BuildingSaving) {
                return BuildingSaving.load();
            }
        }
    });
}).config(function (MenuProvider) {
    MenuProvider.add({
        icon: 'glyphicon glyphicon glyphicon-signal',
        url: '/buildingSavings',
        title: 'buildingSaving.MENU_ITEM'
    });
});

/**
 * @ngdoc controller
 * @name gustav.buildingSaving.controller:BuildingSavingsCtrl
 *
 * @description
 * Shows list of user building savings.
 */
angular.module('gustav.buildingSaving').controller('BuildingSavingsCtrl', function ($scope, BuildingSaving) {
    $scope.buildingSavings = BuildingSaving.buildingSavingsResult.buildings;
});



/**
 * @ngdoc service
 * @name gustav.card.service:Card
 *
 * @description
 * API service for card data.
 */
angular.module('gustav.buildingSaving').factory('BuildingSaving',
    function($rootScope, $resource, ServicePrototype, ENV, ngcsasCoreConstants) {
        var BUILDING_SAVINGS_URL, resourceObject;
        BUILDING_SAVINGS_URL = ENV.apiEndpoint + ENV.buildingSavingsApiPath;

        resourceObject = $resource(BUILDING_SAVINGS_URL, {}, {
            get: {
                method: 'GET',
                isArray: false,
                cache:true
            }
        });

        resourceObject.prototype = ServicePrototype;
        //reference to resource (resolved or unresolved, bindable)
        resourceObject.buildingSavingsResult = null;

        /**
         * @ngdoc method
         * @name gustav.buildingSaving.service:load
         * @methodOf gustav.buildingSaving.service:Card
         *
         * @description
         * Returns list of building Savings
         * @return {promise} with list of building savings
         */
        resourceObject.load = function(){
            console.log("Firing a request for building savings...");
            resourceObject.buildingSavingsResult = resourceObject.get();
            return resourceObject.buildingSavingsResult.$promise.then(function(data) {
                //Request returned OK (there are accounts in response)
                if (data && data.buildings && data.buildings.length > 0) {

                    return (data.buildings);
                } else {
                    throw new Error('buildingSaving.NO_SAVING');
                }
            });
        };

        return resourceObject;
    });
