angular.module('ngcsas.core.services', [])

.constant("ngcsasCoreConstants",
    {
        eventTypes:{
            "RELOAD_EVT":"reloadEvent",
            "MESSAGE_EVT":"messageEvent",
            "MENU_ITEM_ADDED":"menuItemAdded",
            "MENU_ITEM_REMOVED":"menuItemRemoved",
            "LOGIN_EVT":"loginEvent"
        },

        errorMessageContexts:{
            "ROUTE":"route",
            "SERVER":"server",
            "RESPONSE_DATA":"responseData",
            "USER":"user",
            "VALIDATION":"validation"
        }
    }
)

/**
 * @ngdoc service
 * @name ngCsasCore.service:ServicePrototype
 *
 * @description
 * Parent for API service services.
 */
.factory('ServicePrototype', function ($rootScope, $cacheFactory, ngcsasCoreConstants, $log) {
    'use strict';
    var service = {
        //just semantics fetish example
        reload: function () {
            return this.load();
        }
    };

    $rootScope.$on(ngcsasCoreConstants.eventTypes.LOGOUT_EVT, function () {
        $log.debug("LOGOUT_EVT detected, clear caches!");
        var httpCache = $cacheFactory.get('$http');
        httpCache.removeAll();
    });

    return service;
})


.factory('PluginManager', function ($ocLazyLoad, $q, $log) {
    'use strict';
    var _loadedPluginsDict = {};

    return {
        //just semantics fetish example
        getConfig: function () {
           //should return promise,, loading json config with plugins metadata
        },

        getLoadedPlugins:function() {
            return _loadedPluginsDict;
        },

        registerLoadedPlugin:function(pluginName) {
            _loadedPluginsDict[pluginName] = {};
            //todo _loadedPluginsDict[name] = metaDataObject from config with reference to actual module??
        },

        isPluginLoaded:function(pluginName) {
            return _loadedPluginsDict.hasOwnProperty(pluginName) &&  _loadedPluginsDict[pluginName] !== null;
        },

        loadPlugin:function(pluginName, config){
            if (this.isPluginLoaded(pluginName)) {
                var def = $q.defer();
                def.resolve();
                return def.promise;
            }
            // Load 'oc.modal' defined in the config of the provider $ocLazyLoadProvider
            var promise =  $ocLazyLoad.load(config).then(function success(data) {
                $log.debug('help module loaded', data);
                //alert("notes module loaded " + data);
            }, function error(err) {
                $log.debug.log("help module load Error " + err);
            });

            return promise;
        }

    };
})


.provider('Menu', function (ngcsasCoreConstants) {
    'use strict';
    var _menu = [];
    var rootScope = null;

    this.$get = function ($rootScope) {
        rootScope = $rootScope;
        return {
            get: function () {
                return get();
            },
            add: function (item){
                add.apply(this, [item]);
            },
            remove: function (item){
                remove.apply(this, [item]);
            },
            addItems: function (items){
                addItems.apply(this, [items]);
            },
            removeAllItems:function(){
                removeAllItems();
            },
            insert: function (item, index){
                insert.apply(this, [item, index]);
            }
        };
    };

    function get(){
        return _menu;
    }

    /*
     {
     icon: 'glyphicon glyphicon-home',
     url: '/page/1',
     title: 'core.menuItem1'
     }
     */
    function add(item) {
        _menu.push(item);

        //only if instantiated, i.e. in runtime, async loaded modules
        if (rootScope !== null) {
            rootScope.$broadcast(ngcsasCoreConstants.eventTypes.MENU_ITEM_ADDED);
        }
    }

    function remove(item){
        var index = _menu.indexOf(item);
        if (index > -1) {
            if (rootScope !== null) {
                rootScope.$broadcast(ngcsasCoreConstants.eventTypes.MENU_ITEM_REMOVED);
            }
            return _menu.splice(index, 1);
        } else {
            //lookup by label
            var i = 0, l = _menu.length, menuItem;
            for (; i < l; i++){
                menuItem = _menu[i];
                if (menuItem.title === item.title) {
                    if (rootScope !== null) {
                        rootScope.$broadcast(ngcsasCoreConstants.eventTypes.MENU_ITEM_REMOVED);
                    }
                    return _menu.splice(i, 1);
                }
            }

        }
    }

    function addItems(items){
        /*jshint validthis: true */
        var i= 0, l= items.length;
        for (; i < l; i++){
            this.add(items[i]);
        }
    }

    function removeAllItems(){
        _menu = [];
        if (rootScope !== null) {
            rootScope.$broadcast(ngcsasCoreConstants.eventTypes.MENU_ITEM_REMOVED);
        }
    }

    function insert(item, index) {
        index = angular.isNullOrUndefined(index) ? 0 : index;
        _menu.splice(index, 0, item);

        //only if instantiated, i.e. in runtime, async loaded modules
        if (rootScope !== null) {
            rootScope.$broadcast(ngcsasCoreConstants.eventTypes.MENU_ITEM_ADDED);
        }
    }

    this.get = function(){
        return get();
    };

    this.add = function (item){
        add.apply(this, [item]);
    };

    this.remove = function(item){
        remove.apply(this, [item]);
    };

    this.addItems = function (items){
        addItems.apply(this, [items]);
    };

    this.removeAllItems = function (){
        removeAllItems();
    };

    this.insert = function (item, index){
        insert.apply(this, [item, index]);
    };

});
