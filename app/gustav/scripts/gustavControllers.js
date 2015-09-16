/**
 * @ngdoc controller
 * @name gustav.controller:HomeCtrl
 *
 * @description
 * Shows list of user accounts.
 */
angular.module('gustav').controller('HomeCtrl', function($scope, accounts) {
    $scope.accounts = accounts;
})

/**
 * @ngdoc controller
 * @name gustav.controller:RootCtrl
 *
 * @description
 * Main application controller which handles menus, language change etc.
 */
.controller('RootCtrl', function(
    $scope, $rootScope,
    $location, $translate, tmhDynamicLocale,
    ENV, Menu, ngcsasCoreConstants, PluginManager, $state, Profile) {
    //Put environment name to $scope
    $scope.imgEnvText = ENV.name;

    $scope.goto = function(path) {
        $location.path(path);
        console.log('Go to: ', $location.path());
    };

    $scope.langKey = $translate.proposedLanguage();
    $scope.changeLanguage = function(langKey) {
        $scope.langKey = langKey;
        $translate.use(langKey);
        tmhDynamicLocale.set(langKey);
    };

    $scope.isLocation = function(path) {
        return $location.path().indexOf(path) !== -1;
    };

    //no supporting async loaded module
    $scope.menu = Menu.get();
    $rootScope.$on(ngcsasCoreConstants.eventTypes.MENU_ITEM_ADDED,
        function() {
            $scope.menu = Menu.get();
        }
    );

    $scope.isPluginLoaded = function(name) {
        return PluginManager.isPluginLoaded(name);
    };

    $scope.PluginManager = PluginManager;

    $scope.loadHelpPlugin = function() {
        PluginManager.loadPlugin('gustav.help', {
            name: 'gustav.help',
            files: [
                'plugins/help/scripts/help.js',
                'plugins/help/partials/help-main.html'

            ]
        }).then(
            function() {
                $state.go("help");
            },
            function(reason) {
                alert("Load Help Plugin Failed: " + reason);
            });
    };

    Profile.load().then(function(profile) {
        console.log('profile', profile);
        $scope.profile = profile;
    });

});
