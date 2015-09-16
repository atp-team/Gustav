'use strict'

describe "message directive test", () ->
    elm = undefined
    scope = undefined

    #load core module
    beforeEach module("ngcsas.core.directives")
    beforeEach module("ngcsas.core.services")
    beforeEach module("pascalprecht.translate") #because directive uses translate filter
    beforeEach inject(($rootScope, $compile) ->
        elm = angular.element("<message></message>")
        scope = $rootScope
        $compile(elm)(scope)
        scope.$digest()
    )

    it "Message is showing", inject((ngcsasCoreConstants) ->
        row = elm.find("div")


        #Error message
        scope.$apply () ->
            scope.$broadcast(ngcsasCoreConstants.eventTypes.MESSAGE_EVT, 'Nazdar', 0)

        expect(row.find('div').hasClass('alert-danger')).toBe(true)

        #Info message
        scope.$apply () ->
            scope.$broadcast(ngcsasCoreConstants.eventTypes.MESSAGE_EVT, 'Nazdar', 2)

        expect(row.find('div').hasClass('alert-success')).toBe(true)
    )
