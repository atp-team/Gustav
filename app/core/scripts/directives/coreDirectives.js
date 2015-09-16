
//Core directives

/**
 * @ngdoc directive
 * @name ngCsasCore.directive:message
 * @element div
 * @function
 *
 * @description
 * Listens to messageEvent and shows message.
 * @see ngCsasCore.event:messageEvent
 */
/**
 * @ngdoc object
 * @name ngCsasCore.event:messageEvent
 * @eventOf ngCsasCore.directive:message
 * @eventType broadcast on root scope
 * @param {string} message Message text
 * @param {integer} errorLevel Severity - 0 for error, 1 for warning, 2 for info
 * @param {string} context Message context
 *
 * @description
 * Event to propagate a message to user.
 */
angular.module('ngcsas.core.directives', [])

.directive('message', function ($timeout, ngcsasCoreConstants) {

    'use strict';

    var template = '';
    template += '<div class="message">';
    template += '   <div class="animate-fade-up" ng-if="message">';
    template += '       <div class="col-xs-10 col-xs-offset-1 alert message-inner" ng-class="style">';
    template += '           <button type="button" class="close" ng-click="hide()">&times;</button>';
    template += '               {{ message | translate}}';
    template += '       </div>';
    template += '   </div>';
    template += '</div>';

    return {
        template: template,
        restrict: 'EA',
        link: function (scope) {
            var t;
            scope.$on(ngcsasCoreConstants.eventTypes.MESSAGE_EVT, function (event, message, errorLevel, context) {
                if (t !== null) {
                    $timeout.cancel(t);
                }
                t = null;
                scope.message = message;
                if ((angular.isUndefined(message) || message === null) && scope.errorLevel + "|" + scope.context === errorLevel + "|" + context) {
                    return;
                }
                scope.context = context;
                scope.errorLevel = errorLevel;

                var styles = ['alert-danger', 'alert-warning', 'alert-success'];
                errorLevel = Number(errorLevel);
                if (isNaN(errorLevel) || errorLevel < 0 || errorLevel > styles.length - 1) {
                    errorLevel = 0;
                }
                scope.style = styles[errorLevel];

                t = $timeout(function () {
                    scope.message = null;
                }, 5000);
            });

            scope.hide = function(){
                if (t !== null) {
                    $timeout.cancel(t);
                }
                t = null;
                scope.message = null;
            };
        }
    };
});


