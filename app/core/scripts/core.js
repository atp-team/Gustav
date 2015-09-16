/**
 * @ngdoc overview
 * @name ngCsasCore
 * @description ngCsas core module
 */
angular.module('ngcsas.core', [

        'ngResource',
        'ngCookies',
        'ngAnimate',
        'ngSanitize',
        'ngTouch',
        'ui.bootstrap',
        'ui.router',

        'ngcsas.core.services',
        'ngcsas.core.directives',
        'ngcsas.core.i18n',

        'LocalStorageModule',
        'pascalprecht.translate', 'tmh.dynamicLocale',
        'oc.lazyLoad'
    ])

    .config(
        function ($compileProvider) {
            $compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?|ftp|file|chrome-extension):|data:image\//);
            $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|chrome-extension):/);
        })

    .config(function ($logProvider, $translateProvider, tmhDynamicLocaleProvider, $httpProvider, localStorageServiceProvider) {

        $logProvider.debugEnabled(true);

        //use local storage for localization messages
        $translateProvider.useLocalStorage();
        $translateProvider.preferredLanguage('cs');
        $translateProvider.fallbackLanguage('en');

        $translateProvider.useLoader('$translatePartialLoader', {
            urlTemplate: '{part}/i18n/{lang}.json'
        });

        tmhDynamicLocaleProvider.localeLocationPattern('bower_components/angular-i18n/angular-locale_{{locale}}.js');

        localStorageServiceProvider.setPrefix('ngcsas-');

        $httpProvider.interceptors.push(function($q, $rootScope, ngcsasCoreConstants, $log){
            return {
                'responseError': function(response) {
                    if (response.status === 401 || response.status === 412) {
                        $log.log('Unauthorized! Force login');
                        $rootScope.$broadcast(ngcsasCoreConstants.eventTypes.LOGIN_EVT);
                        return $q.reject(response);
                    }
                    return response;
                }
            };
        });

        //Handle incoming errors (for error messages)
        $httpProvider.interceptors.push(function ($q, $rootScope, ngcsasCoreConstants, $log) {
            var handleError = function ($rootScope, data, statusText, statusCode) {
                //Skip 401 Unauthorized as it's handled elsewhere
                if (statusCode !== 401) {
                    var errorText = null;
                    if (!angular.isNullOrUndefined(data)&&  data.status && data.status.errors && data.status.errors.length > 0) {
                        errorText = "" + data.status.errors[0].message;
                    } else {
                        errorText = "core.ERROR_MESSAGE";

                        if (statusText !== null && statusText !== "") {
                            errorText = statusText;
                        }
                    }
                    $rootScope.$broadcast(
                        ngcsasCoreConstants.eventTypes.MESSAGE_EVT,
                        errorText, 0,
                        ngcsasCoreConstants.errorMessageContexts.SERVER);
                }
            };

            return {
                'responseError': function (response) {
                    $log.error('Handle incoming error...', response);
                    handleError($rootScope, response.data, response.statusText, response.status);
                    return $q.reject(response);
                },

                'response': function (response) {
                    return response || $q.when(response);
                }
            };
        });
    })


    .config(function(
        $urlRouterProvider) {

        $urlRouterProvider.otherwise(function($injector, $location){
            $location.path("/home");
        });

    })

    .run(function ($rootScope, $translate) {

        //Reload translations on change
        $rootScope.$on('$translatePartialLoaderStructureChanged', function () {
            $translate.refresh();
        });

        $translate.refresh();

    });


/*
 * @ngdoc method
 * @methodOf ngcsas.core
 * @description static angular method enhancements
 */
angular.isUndefinedOrNull = function(val) {
    return angular.isUndefined(val) || val === null;
};

angular.isNullOrUndefined = function(val) {
    return val === null || angular.isUndefined(val);
};
