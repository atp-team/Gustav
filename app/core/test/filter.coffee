'use strict'

describe "amount filter test", () ->

    #load core module
    beforeEach module("gustav")

    it "Basic formatting", inject(($filter) ->
        test = {
            value: 1000
            precision: 2
            currency: 'CZK'
        }

        #Beware the space. It's not usual one, but some kind of 'hard' space.
        expect($filter('amount')(test)).toBe('10,00 CZK')

        test.precision = 1
        expect($filter('amount')(test)).toBe('100,00 CZK')

        test.precision = 0
        expect($filter('amount')(test)).toBe('1 000,00 CZK')

        test.precision = 2
        test.value = 5429450
        expect($filter('amount')(test)).toBe('54 294,50 CZK')
    )

    it "Missing currency", inject(($filter) ->
        test = {
            value: 1000
            precision: 2
        }
        expect($filter('amount')(test)).toBe('10,00 Kč')
    )

    it "Missing precision", inject(($filter) ->
        test = {
            value: 1000
            currency: 'CZK'
        }
        expect($filter('amount')(test)).toBe('1 000,00 CZK')
    )

    it "Missing value", inject(($filter) ->
        test = {
            precision: 2
            currency: 'CZK'
        }
        expect($filter('amount')(test)).toBe('0,00 CZK')
    )
