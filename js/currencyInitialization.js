// Waits until the DOM is ready for manipulations
$(document).ready(function(){

    // Creates and Init Top Currency Currency Converter - Example 1
	var c1 = new Currency({mainElement: '#currency1'});
	c1.start();
    
    // Creates and Init Top Currency Currency Converter - Example 2
	var c2 = new Currency({
		themeColor: 4,
		mainElement: '#currency2',
		type: 'autocomplete'
	});
	c2.start();

    // Creates and Init Top Currency Currency Converter - Example 3
	var c3 = new Currency({
		themeColor: 10,
		mainElement: '#currency3' ,
		fromCurrency: 'USD',
		toCurrency: 'EUR',
		amountToConvert: '34.5'
	});
	c3.start();

    // Creates and Init Top Currency Currency Converter - Example 4
	var c4 = new Currency({
		themeColor: 8,
		mainElement: '#currency4',
		fromCurrency: 'USD',
		toCurrency: 'JPY',
		amountToConvert: '(5+25.6) * 0.3'
	});
	c4.start();

    // Creates and Init Top Currency Currency Converter - Example 5
	var c5 = new Currency({
		themeColor: 6,
		mainElement: '#currency5',
		currencyTitle: 'My Currency Converter',
		isSwitchButton: true,
		fromText: 'From Currency',
		toText: 'To Currency',
		convertButtonText: 'Show Rate',
		inputPlaceholder: 'Enter only Number/Math Exp',
		loadingText: 'Please Wait..',
		maxWidth: 500
	});
	c5.start();

    // Creates and Init Top Currency Currency Converter - Example 6
	var c6 = new Currency({
		themeColor: 6,
		theme: 'inline',
		mainElement: '#currency6',
		type: 'autocomplete'
	});
	c6.start();
});