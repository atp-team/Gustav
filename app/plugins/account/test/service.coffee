'use strict'

describe "accountNumberService test", () ->

    #load application
    beforeEach module("gustav.account")
    beforeEach module("gustav.config")

    it "Account number service check", inject((Account) ->
        expect(Account.isCorrect("123")).toBe("CM")
        expect(Account.isCorrect("330855001")).toBe("CM")
        ## original account number 4773-7622021 has to be splitted to two parts and each validated impedently
        expect(Account.isCorrect("4773")).toBe("CM") # first part
        expect(Account.isCorrect("7622021")).toBe("CM") # second part
    )
