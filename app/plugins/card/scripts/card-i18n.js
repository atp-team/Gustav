angular.module('gustav.card.i18n', ['pascalprecht.translate']).run(function($translatePartialLoader) {
    $translatePartialLoader.addPart('plugins/card');
});
