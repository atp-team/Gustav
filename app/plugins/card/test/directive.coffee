'use strict'

describe "cardLogo directive test", () ->
    elm = undefined
    scope = undefined
    backend = undefined

    #load core module
    beforeEach module("gustav.card")
    beforeEach inject ($rootScope, $compile, $httpBackend) ->

        elm = angular.element("<card-logo product=\"{{product}}\"></card-logo>")
        scope = $rootScope
        backend = $httpBackend
        backend.whenGET(/core\/i18n\/.*\.json/).respond({})
        $compile(elm)(scope)


    it "Test correct card logos", inject () ->

        img = elm.find("img")
        scope.$apply () ->
            scope.product = "Visa Electron"

        expect(img.attr("src")).toBe "plugins/card/images/visa-electron-curved-32px.png"
        scope.$apply () ->
            scope.product = "Visa Classic"

        expect(img.attr("src")).toBe "plugins/card/images/visa-curved-32px.png"
        scope.$apply () ->
            scope.product = "Maestro"

        expect(img.attr("src")).toBe "plugins/card/images/maestro-curved-32px.png"
        scope.$apply () ->
            scope.product = "Nesmysl"

        #Master card is default
        expect(img.attr("src")).toBe "plugins/card/images/mastercard-curved-32px.png"
