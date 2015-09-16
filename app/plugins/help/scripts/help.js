/**
 * @ngdoc overview
 * @name gustav.help
 * @description help
 */
angular.module('gustav.help',
    //TODO strange ocLazyLoad dependencies reinstantiates providers???
    [   /*'gustav.core',*/
        {
            files: [
                'plugins/help/scripts/helpControllers.js',
                'plugins/help/scripts/helpDirectives.js',
                'plugins/help/scripts/helpServices.js'
            ]
        }
    ]
)
    //every config of menu provider with url SHOULD be complemented with stateprovider configuration
    //or this route config is done in main gustav.js accroding to some config file with plugin info
    .config(['MenuProvider', '$stateProvider', function(MenuProvider, $stateProvider) {
        MenuProvider
            .add({
                icon: "glyphicon glyphicon-question-sign",
                url: '/help',
                title: 'help.MENU_ITEM'
            });

        $stateProvider
            .state('help', {
                url: '/help',
                controller: 'HelpController as helpCtrl',
                templateUrl: 'plugins/help/partials/help-main.html'
            })
            .state('about', {
                url: '/about',
                templateUrl:'plugins/help/partials/help-about.html'
            });
    }])

    .run(['$translatePartialLoader', 'PluginManager', function($translatePartialLoader, PluginManager) {
        $translatePartialLoader.addPart('plugins/help');
        PluginManager.registerLoadedPlugin("gustav.help");
    }]);