
angular.module('gustav.help')

    .controller("HelpController", function($scope, $interpolate, $translatePartialLoader, $log){
        var _this = this;
        var isw = $scope.$watch(function(){
            _this.title = $interpolate("{{'help.TITLE' | translate}}")($scope);
            var b1= _this.title !== null;
            var b2 = _this.title.indexOf !== undefined;
            var b3 = _this.title !== "";
            var b4 = _this.title.indexOf('help.TITLE') === -1;
            $log.log("b1, b2, b3, b4 " + [b1, b2, b3, b4]);
            return b1 && b2 && b3 && b4;
        }, function(){
            _this.title = $interpolate("{{'help.TITLE' | translate}}")($scope);
            if (_this.title.indexOf('help.TITLE') === -1) {
                isw();
            }
            $log.log("watching title fro translation: _this.title  " + _this.title );
        });
        //true still not wotking here, BUG in translate, TODO add link
        //var ip =
        $translatePartialLoader.isPartAvailable("plugins/help");

    });