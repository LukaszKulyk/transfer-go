



function caluclateTotalAmount(sendingAmount, finalFee) {
    return sendingAmount - finalFee;
}

function verifyIfCalculatedAmountIsCorrect(calculatedAmount, expectedAmount) {
    if(expectedAmount === calculatedAmount) {
        return true
    }
    else{
        return false
    }
}

describe('Calculations endpoint tests', () => {
    
    it('Verify if Now and Standard delivery options are available with both card and bank payment methods and if fee calculations for this payments methods are correct.', () => {
        cy.request('/api/transfers/quote?calculationBase=sendAmount&amount=150.00&fromCountryCode=LT&toCountryCode=PL&fromCurrencyCode=EUR&toCurrencyCode=EUR').as('calculations');
        cy.get('@calculations').then(response => {

            //verify response status and if response is an array
            expect(response.status).to.eq(200)
            expect(response, 'Endpoint responds in less then 200ms').to.have.property('duration').and.be.lessThan(2000)
            assert.isObject(response.body, 'Caluclations response is an object')

            //verify if 'now' and 'standard' delivery options are available and 'today' is not
            expect(response.body.deliveryOptions).to.have.property('now')
            assert.isObject(response.body.deliveryOptions.now, 'Delivery options is an object')
            expect(response.body.deliveryOptions).to.have.property('standard')
            assert.isObject(response.body.deliveryOptions.standard, 'Delivery options is an object')
            expect(response.body.deliveryOptions).to.not.have.property('today')

            //********** NOW DELIVERY OPTION **************
            //verify default payment option
            expect(response.body.deliveryOptions.now.defaultPaymentOption).to.eq('card').and.be.a('string')

            //verify max amount set in configuration
            expect(response.body.deliveryOptions.now.configuration).to.have.property('maxAmount', 2000).and.be.a('number')

            //bank payment option
            //get finalFee value
            let bankNowFinalFee = response.body.deliveryOptions.now.paymentOptions.bank.quote.fees.finalFee
            //get sendAmount value
            let bankNowSendingAmount = response.body.deliveryOptions.now.paymentOptions.bank.quote.sendingAmount
            //verify if total amount is correct
            let bankNowTotalAmount = caluclateTotalAmount(bankNowSendingAmount, bankNowFinalFee)

            let verifyedBankNowCalculatedAmount = verifyIfCalculatedAmountIsCorrect(bankNowTotalAmount, bankNowSendingAmount)

            expect(verifyedBankNowCalculatedAmount).to.eq(true, 'Bank total amount is caluclated correctly.')

            //verify payment option availability
            expect(response.body.deliveryOptions.now.paymentOptions.bank.availability).to.have.property('maxAmount', null).and.be.a('null')
            expect(response.body.deliveryOptions.now.paymentOptions.bank.availability).to.have.property('isAvailable', false).and.be.a('boolean')
            expect(response.body.deliveryOptions.now.paymentOptions.bank.availability).to.have.property('reason', 'OPTION_DISABLED').and.be.a('string')

            //card payment option
            //get finalFee value
            let cardNowFinalFee = response.body.deliveryOptions.now.paymentOptions.card.quote.fees.finalFee
            //get sendAmount value
            let cardNowSendingAmount = response.body.deliveryOptions.now.paymentOptions.card.quote.sendingAmount
            //verify if total amount is correct
            let cardNowTotalAmount = caluclateTotalAmount(cardNowSendingAmount, cardNowFinalFee)

            let verifyedCardNowCalculatedAmount = verifyIfCalculatedAmountIsCorrect(cardNowTotalAmount, cardNowTotalAmount)

            expect(verifyedCardNowCalculatedAmount).to.eq(true, 'Card total amount is caluclated correctly.')

            //verify payment option availability
            expect(response.body.deliveryOptions.now.paymentOptions.card.availability).to.have.property('maxAmount', 11000).and.be.a('number')
            expect(response.body.deliveryOptions.now.paymentOptions.card.availability).to.have.property('isAvailable', true).and.be.a('boolean')
            expect(response.body.deliveryOptions.now.paymentOptions.card.availability).to.have.property('reason', null).and.be.a('null')

            //********** STANDARD DELIVERY OPTION **************
            //verify default payment option
            expect(response.body.deliveryOptions.standard.defaultPaymentOption).to.eq('card').and.be.a('string')

            //verify max amount set in configuration
            expect(response.body.deliveryOptions.standard.configuration).to.have.property('maxAmount', 1000000).and.be.a('number')

            //bank payment option
            //get finalFee value
            let bankStandardFinalFee = response.body.deliveryOptions.standard.paymentOptions.bank.quote.fees.finalFee
            //get sendAmount value
            let bankStandardSendingAmount = response.body.deliveryOptions.standard.paymentOptions.bank.quote.sendingAmount
            //verify if total amount is correct
            let bankStandardTotalAmount = caluclateTotalAmount(bankStandardSendingAmount, bankStandardFinalFee)

            let verifyedBankStandardCalculatedAmount = verifyIfCalculatedAmountIsCorrect(bankStandardTotalAmount, bankStandardSendingAmount)

            expect(verifyedBankStandardCalculatedAmount).to.eq(true, 'Bank total amount is caluclated correctly.')

            //verify payment option availability
            expect(response.body.deliveryOptions.standard.paymentOptions.bank.availability).to.have.property('maxAmount', null).and.be.a('null')
            expect(response.body.deliveryOptions.standard.paymentOptions.bank.availability).to.have.property('isAvailable', true).and.be.a('boolean')
            expect(response.body.deliveryOptions.standard.paymentOptions.bank.availability).to.have.property('reason', null).and.be.a('null')

            //card payment option
            //get finalFee value
            let cardStandardFinalFee = response.body.deliveryOptions.standard.paymentOptions.card.quote.fees.finalFee
            //get sendAmount value
            let cardStandardSendingAmount = response.body.deliveryOptions.standard.paymentOptions.card.quote.sendingAmount
            //verify if total amount is correct
            let cardStandardTotalAmount = caluclateTotalAmount(cardStandardSendingAmount, cardStandardFinalFee)

            let verifyedCardStandardCalculatedAmount = verifyIfCalculatedAmountIsCorrect(cardStandardTotalAmount, cardStandardSendingAmount)

            expect(verifyedCardStandardCalculatedAmount).to.eq(true, 'Card total amount is caluclated correctly.')

            //verify payment option availability
            expect(response.body.deliveryOptions.standard.paymentOptions.card.availability).to.have.property('maxAmount', 11000).and.be.a('number')
            expect(response.body.deliveryOptions.standard.paymentOptions.card.availability).to.have.property('isAvailable', true).and.be.a('boolean')
            expect(response.body.deliveryOptions.standard.paymentOptions.card.availability).to.have.property('reason', null).and.be.a('null')
        })
    })

    it('Verify if for Turkey and Turkish lira Today and Standard delivery methods are available.', () => {
        cy.request('/api/transfers/quote?calculationBase=sendAmount&amount=150.00&fromCountryCode=TR&toCountryCode=PL&fromCurrencyCode=TRY&toCurrencyCode=EUR').as('calculations');
        cy.get('@calculations').then(response => {

            //verify response status and if response is an array
            expect(response.status).to.eq(200)
            expect(response, 'Endpoint responds in less then 200ms').to.have.property('duration').and.be.lessThan(2000)
            assert.isObject(response.body, 'Caluclations response is an object')

            //verify if 'now' and 'standard' delivery options are available and 'today' is not
            expect(response.body.deliveryOptions).to.have.property('today')
            assert.isObject(response.body.deliveryOptions.today, 'Today is an object')
            expect(response.body.deliveryOptions).to.have.property('standard')
            assert.isObject(response.body.deliveryOptions.standard, 'Standard response is an object')
            expect(response.body.deliveryOptions).to.not.have.property('now')

            //Verify if only bank payment option is available for both TODAY and STANDARD delivery options.
            expect(response.body.deliveryOptions.today.paymentOptions).to.have.property('bank')
            assert.isObject(response.body.deliveryOptions.today.paymentOptions.bank, 'Bank is an object')
            expect(response.body.deliveryOptions.today.paymentOptions).to.not.have.property('card')

            expect(response.body.deliveryOptions.standard.paymentOptions).to.have.property('bank')
            assert.isObject(response.body.deliveryOptions.today.paymentOptions.bank, 'Bank is an object')
            expect(response.body.deliveryOptions.standard.paymentOptions).to.not.have.property('card')


            //********** TODAY DELIVERY OPTION **************
            //verify default payment option
            expect(response.body.deliveryOptions.today.defaultPaymentOption).to.eq('bank').and.be.a('string')

            //verify max amount set in configuration
            expect(response.body.deliveryOptions.today.configuration).to.have.property('maxAmount', 1000000).and.be.a('number')

            //bank payment option
            //get finalFee value
            let bankTodayFinalFee = response.body.deliveryOptions.today.paymentOptions.bank.quote.fees.finalFee
            //get sendAmount value
            let bankTodaySendingAmount = response.body.deliveryOptions.today.paymentOptions.bank.quote.sendingAmount
            //verify if total amount is correct
            let bankTodayTotalAmount = caluclateTotalAmount(bankTodaySendingAmount, bankTodayFinalFee)

            let verifyedBankTodayCalculatedAmount = verifyIfCalculatedAmountIsCorrect(bankTodayTotalAmount, bankTodaySendingAmount)

            expect(verifyedBankTodayCalculatedAmount).to.eq(true, 'Bank total amount is caluclated correctly.')

            //verify payment option availability
            expect(response.body.deliveryOptions.today.paymentOptions.bank.availability).to.have.property('isAvailable', true).and.be.a('boolean')
            expect(response.body.deliveryOptions.today.paymentOptions.bank.availability).to.have.property('reason', null).and.be.a('null')

            //********** STANDARD DELIVERY OPTION **************
            //verify default payment option
            expect(response.body.deliveryOptions.standard.defaultPaymentOption).to.eq('bank').and.be.a('string')

            //verify max amount set in configuration
            expect(response.body.deliveryOptions.standard.configuration).to.have.property('maxAmount', 1000000).and.be.a('number')

            //bank payment option
            //get finalFee value
            let bankStandardFinalFee = response.body.deliveryOptions.standard.paymentOptions.bank.quote.fees.finalFee
            //get sendAmount value
            let bankStandardSendingAmount = response.body.deliveryOptions.standard.paymentOptions.bank.quote.sendingAmount
            //verify if total amount is correct
            let bankStandardTotalAmount = caluclateTotalAmount(bankStandardSendingAmount, bankStandardFinalFee)

            let verifyedBankStandardCalculatedAmount = verifyIfCalculatedAmountIsCorrect(bankStandardTotalAmount, bankStandardSendingAmount)

            expect(verifyedBankStandardCalculatedAmount).to.eq(true, 'Bank total amount is caluclated correctly.')

            //verify payment option availability
            expect(response.body.deliveryOptions.standard.paymentOptions.bank.availability).to.have.property('isAvailable', true).and.be.a('boolean')
            expect(response.body.deliveryOptions.standard.paymentOptions.bank.availability).to.have.property('reason', null).and.be.a('null')
        })
    })

    it('Now delivery option - verify if it is not possible to exceed maxAmount by sending 2000,01EUR.', () => {
        cy.request('/api/transfers/quote?calculationBase=sendAmount&amount=2000.01&fromCountryCode=LT&toCountryCode=PL&fromCurrencyCode=EUR&toCurrencyCode=EUR').as('calculations');
        cy.get('@calculations').then(response => {
            //verify response status and if response is an array
            expect(response.status).to.eq(200)
            expect(response, 'Endpoint responds in less then 200ms').to.have.property('duration').and.be.lessThan(2000)
            assert.isObject(response.body, 'Caluclations response is an object')
            //NOW delivery option should have amount limit exceeded
            expect(response.body.deliveryOptions.now.availability).to.have.property('isAvailable', false).and.be.a('boolean')
            expect(response.body.deliveryOptions.now.availability).to.have.property('reason', 'AMOUNT_LIMIT_EXCEEDED').and.be.a('string')
            
            //STANDARD delivery options should be still available to use
            expect(response.body.deliveryOptions.standard.availability).to.have.property('isAvailable', true).and.be.a('boolean')
            expect(response.body.deliveryOptions.standard.availability).to.have.property('reason', null).and.be.a('null')
        })
    })

    it('Now delivery option - verify if it is not possible to send less than 1EUR.', () => {
        cy.request({url:'/api/transfers/quote?calculationBase=sendAmount&amount=0.99&fromCountryCode=LT&toCountryCode=PL&fromCurrencyCode=EUR&toCurrencyCode=EUR', failOnStatusCode: false}).as('calculations');
        cy.get('@calculations').then(response => {
            //verify response status and if response is an array
            expect(response.status).to.eq(422)
            expect(response, 'Endpoint responds in less then 200ms').to.have.property('duration').and.be.lessThan(2000)
            assert.isObject(response.body, 'Caluclations response is an object')

            expect(response.body).to.have.property('error', 'AMOUNT_IS_TOO_SMALL').and.be.a('string')
            expect(response.body).to.have.property('message', 'tooSmallAmount').and.be.a('string')
        })
    })

    it('Standard delivery option - verify if it is not possible to exceed maxAmount by sending 1000000,01EUR.', () => {
        cy.request({url:'/api/transfers/quote?calculationBase=sendAmount&amount=1000000.01&fromCountryCode=LT&toCountryCode=PL&fromCurrencyCode=EUR&toCurrencyCode=EUR', failOnStatusCode: false}).as('calculations');
        cy.get('@calculations').then(response => {
            //verify response status and if response is an array
            expect(response.status).to.eq(422)
            expect(response, 'Endpoint responds in less then 200ms').to.have.property('duration').and.be.lessThan(2000)
            assert.isObject(response.body, 'Caluclations response is an object')

            expect(response.body).to.have.property('error', 'AMOUNT_IS_TOO_LARGE').and.be.a('string')
            expect(response.body).to.have.property('message', 'invalidAmount').and.be.a('string')
        })
    })

    it('Standard delivery option - verify if it is not possible to send less than 1EUR.', () => {
        cy.request({url:'/api/transfers/quote?calculationBase=sendAmount&amount=0.98&fromCountryCode=LT&toCountryCode=PL&fromCurrencyCode=EUR&toCurrencyCode=EUR', failOnStatusCode: false}).as('calculations');
        cy.get('@calculations').then(response => {
            //verify response status and if response is an array
            expect(response.status).to.eq(422)
            expect(response, 'Endpoint responds in less then 200ms').to.have.property('duration').and.be.lessThan(2000)
            assert.isObject(response.body, 'Caluclations response is an object')

            expect(response.body).to.have.property('error', 'AMOUNT_IS_TOO_SMALL').and.be.a('string')
            expect(response.body).to.have.property('message', 'tooSmallAmount').and.be.a('string')
        })
    })

    it('Today delivery option - verify if it is not possible to exceed maxAmount by sending 1000000,01EUR.', () => {
        cy.request({url:'/api/transfers/quote?calculationBase=sendAmount&amount=1000000.02&fromCountryCode=TR&toCountryCode=PL&fromCurrencyCode=TRY&toCurrencyCode=EUR', failOnStatusCode: false}).as('calculations');
        cy.get('@calculations').then(response => {
            //verify response status and if response is an array
            expect(response.status).to.eq(422)
            expect(response, 'Endpoint responds in less then 200ms').to.have.property('duration').and.be.lessThan(2000)
            assert.isObject(response.body, 'Caluclations response is an object')

            expect(response.body).to.have.property('error', 'AMOUNT_IS_TOO_LARGE').and.be.a('string')
            expect(response.body).to.have.property('message', 'invalidAmount').and.be.a('string')
        })
    })

    it('Today delivery option - verify if it is not possible to send less than 1EUR.', () => {
        cy.request({url:'/api/transfers/quote?calculationBase=sendAmount&amount=0.98&fromCountryCode=TR&toCountryCode=PL&fromCurrencyCode=TRY&toCurrencyCode=EUR', failOnStatusCode: false}).as('calculations');
        cy.get('@calculations').then(response => {
            //verify response status and if response is an array
            expect(response.status).to.eq(422)
            expect(response, 'Endpoint responds in less then 200ms').to.have.property('duration').and.be.lessThan(2000)
            assert.isObject(response.body, 'Caluclations response is an object')

            expect(response.body).to.have.property('error', 'AMOUNT_IS_TOO_SMALL').and.be.a('string')
            expect(response.body).to.have.property('message', 'tooSmallAmount').and.be.a('string')
        })
    })

    it('Verify if response time is smaller than 1000ms', () => {
        cy.request({url:'/api/transfers/quote?calculationBase=sendAmount&amount=0.98&fromCountryCode=LT&toCountryCode=PL&fromCurrencyCode=EUR&toCurrencyCode=EUR', failOnStatusCode: false}).as('calculations');
        cy.get('@calculations').then(response => {
            expect(response, 'Endpoint responds in less then 200ms').to.have.property('duration').and.be.lessThan(2000)
        })
    })
})