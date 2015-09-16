angular.module('ngcsas.core.i18n', ['pascalprecht.translate']).run(function ($translatePartialLoader) {
   $translatePartialLoader.addPart('core');
});
