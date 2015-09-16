angular.module('gustav.i18n', ['pascalprecht.translate']).run(function ($translatePartialLoader) {
    $translatePartialLoader.addPart('gustav');
});
