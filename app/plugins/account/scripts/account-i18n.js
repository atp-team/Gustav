angular.module('gustav.account.i18n', ['pascalprecht.translate']).run(function($translatePartialLoader) {
    $translatePartialLoader.addPart('plugins/account');
});