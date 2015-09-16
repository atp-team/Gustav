/**
 * @ngdoc overview
 * @name gustav.card
 * @description Card module
 */
angular.module('gustav.card', ['ngcsas.core']).config(function ($stateProvider) {
    $stateProvider.state('cards', {
        url:'/cards',
        templateUrl: 'plugins/card/partials/cards.html',
        controller: 'CardsCtrl',
        resolve: {
            cards: function (Card) {
                return Card.load();
            }
        }
    });
}).config(function (MenuProvider) {
    MenuProvider.add({
                         icon: 'glyphicon glyphicon-credit-card',
                         url: '/cards',
                         title: 'card.MENU_ITEM'
                     });
});
/**
 * @ngdoc controller
 * @name gustav.card.controller:CardsCtrl
 *
 * @description
 * Shows list of user cards.
 */
angular.module('gustav.card').controller('CardsCtrl', function ($scope, Card) {
    $scope.cards = Card.cardsResult.cards;
});

/**
 * @ngdoc service
 * @name gustav.card.service:Card
 *
 * @description
 * API service for card data.
 */
angular.module('gustav.card').factory('Card',
                                      function($rootScope, $resource, ServicePrototype, ENV, ngcsasCoreConstants) {
    var CARDS_URL, resourceObject;
    CARDS_URL = ENV.apiEndpoint + ENV.cardsApiPath;

    resourceObject = $resource(CARDS_URL, {}, {
        get: {
            method: 'GET',
            isArray: false,
            cache:true
        }
    });

    resourceObject.prototype = ServicePrototype;
    //reference to resource (resolved or unresolved, bindable)
    resourceObject.cardsResult = null;

    /**
     * @ngdoc method
     * @name gustav.card.service:load
     * @methodOf gustav.card.service:Card
     *
     * @description
     * Returns list of cards
     * @return {promise} with list of cards
     */
    resourceObject.load = function(){
        console.log("Firing a request for cards...");
        resourceObject.cardsResult = resourceObject.get();
        return resourceObject.cardsResult.$promise.then(function(data) {
            //Request returned OK (there are accounts in response)
            if (data && data.cards && data.cards.length > 0) {

                var cards = [];

                angular.forEach(data.cards, function(card){
                    card.czOverallCardAccountLimits = card['cz-overallCardAccountLimits'];
                    cards.push(card);
                })

                return (cards);
            } else {
                throw new Error('card.NO_CARDS');
            }
        });
    };

    $rootScope.$on(ngcsasCoreConstants.eventTypes.RELOAD_EVT, function() {
        console.log("RELOAD_EVT detected, reload Cards.");
        resourceObject.reload();
    });
    return resourceObject;
});
