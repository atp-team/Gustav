angular.module('gustav.help.i18n', ['pascalprecht.translate']).run(['$translatePartialLoader', function($translatePartialLoader) {
    $translatePartialLoader.addPart('plugins/help');
}]);
