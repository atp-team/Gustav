angular.module('gustav.history.i18n', ['pascalprecht.translate']).run(function($translatePartialLoader) {
    $translatePartialLoader.addPart('plugins/history');
});
