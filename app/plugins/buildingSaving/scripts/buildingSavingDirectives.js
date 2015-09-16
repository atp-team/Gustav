/**
 * @ngdoc directive
 * @name gustav.buildingSaving.directive:buildingSavingBox
 * @restrict EA
 * @element ANY
 * @scope
 * @description
 * Displays information about an building saving.
 */
angular.module('gustav.buildingSaving').directive('buildingSavingBox', function () {
    return {
        templateUrl: 'plugins/buildingSaving/partials/buildingSaving.html',
        restrict: 'EA',
        scope: {
            buildingSaving: '='
        }
    };
});
