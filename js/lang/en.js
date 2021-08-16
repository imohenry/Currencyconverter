/* 
Top Currency Converter Language File - English
================================================
*/

// If no other laguanges already defined, creates the languages object
if(typeof languages === 'undefined')
	var languages = {};

// Create en (for English) property in the languages object
languages.en = {
    /* The direction of the language,
    'ltr' for left-to-right and 'rtl' for right-to-left. */
	direction: 'ltr',
    
    // All Currecncies as code : label format
	currencies: {USD: 'United States Dollars',
				 CAD: 'Canadian Dollars',
				 EUR: 'European Euro',
				 AED: 'United Arab Emirates Dirham',
				 AFN: 'Afghanistan Afghani',
				 ALL: 'Albanian Lek',
				 AMD: 'Armenian Dram',
				 ANG: 'Netherlands Antillean Guilder',
				 AOA: 'Angolan Kwanza',
				 ARS: 'Argentine Peso',
				 AUD: 'Australian Dollar',
 				 AWG: 'Aruban Florin',
				 AZN: 'Azerbaijani Manat',
				 BAM: 'Bosnia-Herzegovina Convertible Mark',
				 BBD: 'Barbadian Dollar',
				 BDT: 'Bangladeshi Taka',
				 BGN: 'Bulgarian Lev',
				 BHD: 'Bahraini Dinar',
				 BIF: 'Burundian Franc',
				 BMD: 'Bermudan Dollar',
				 BND: 'Brunei Dollar',
				 BOB: 'Bolivian Boliviano',
				 BRL: 'Brazilian Real',
				 BSD: 'Bahamian Dollar',
				 BTN: 'Bhutanese Ngultrum',
				 BWP: 'Botswanan Pula',
				 BYR: 'Belarusian Ruble',
				 BZD: 'Belize Dollar',
				 CDF: 'Congolese Franc',
				 CHF: 'Swiss Franc',
				 CLP: 'Chilean Peso',
				 CNY: 'Chinese Yuan',
				 COP: 'Colombian Peso',
				 CRC: 'Costa Rican Colón',
				 CUP: 'Cuba Peso',
				 CVE: 'Cape Verdean Escudo',
				 CZK: 'Czech Republic Koruna',
				 DJF: 'Djiboutian Franc',
				 DKK: 'Danish Krone',
				 DOP: 'Dominican Peso',
				 DZD: 'Algerian Dinar',
				 EGP: 'Egyptian Pound',
				 ERN: 'Eritrean Nakfa',
				 ETB: 'Ethiopian Birr',
				 FJD: 'Fijian Dollar',
				 FKP: 'Falkland Islands Pound',
				 GBP: 'British Pound',
				 GEL: 'Georgian Lari',
				 GHS: 'Ghanaian Cedi',
				 GIP: 'Gibraltar Pound',
				 GMD: 'Gambian Dalasi',
				 GNF: 'Guinean Franc',
				 GTQ: 'Guatemalan Quetzal',
				 GYD: 'Guyanaese Dollar',
				 HKD: 'Hong Kong Dollar',
				 HNL: 'Honduran Lempira',
				 HRK: 'Croatian Kuna',
				 HTG: 'Haitian Gourde',
				 HUF: 'Hungarian Forint',
				 IDR: 'Indonesian Rupiah',
				 ILS: 'Israeli New Sheqel',
				 INR: 'Indian Rupee',
				 IQD: 'Iraqi Dinar',
				 IRR: 'Iranian Rial',
				 ISK: 'Icelandic Króna',
				 JMD: 'Jamaican Dollar',
				 JOD: 'Jordanian Dinar',
				 JPY: 'Japanese Yen',
				 KES: 'Kenyan Shilling',
				 KGS: 'Kyrgystani Som',
				 KHR: 'Cambodian Riel',
				 KMF: 'Comorian Franc',
				 KPW: 'North Korean Won',
				 KRW: 'South Korean Won',
				 KWD: 'Kuwaiti Dinar',
				 KYD: 'Cayman Islands Dollar',
				 KZT: 'Kazakhstani Tenge',
				 LAK: 'Laotian Kip',
				 LBP: 'Lebanese Pound',
				 LKR: 'Sri Lankan Rupee',
				 LRD: 'Liberian Dollar',
				 LSL: 'Lesotho Loti',
				 LYD: 'Libyan Dinar',
				 MAD: 'Moroccan Dirham',
				 MDL: 'Moldovan Leu',
				 MGA: 'Malagasy Ariary',
				 MKD: 'Macedonian Denar',
				 MMK: 'Myanmar Kyat',
				 MNT: 'Mongolian Tugrik',
				 MOP: 'Macanese Pataca',
				 MRO: 'Mauritanian Ouguiya',
				 MUR: 'Mauritian Rupee',
				 MVR: 'Maldivian Rufiyaa',
				 MWK: 'Malawian Kwacha',
				 MXN: 'Mexican Peso',
				 MYR: 'Malaysia Ringgit',
				 MZN: 'Mozambique Metical',
				 NAD: 'Namibian Dollar',
				 NGN: 'Nigerian Naira',
				 NIO: 'Nicaraguan Córdoba',
				 NOK: 'Norwegian Krone',
				 NPR: 'Nepalese Rupee',
				 NZD: 'New Zealand Dollar',
				 OMR: 'Omani Rial',
				 PAB: 'Panamanian Balboa',
				 PEN: 'Peruvian Nuevo Sol',
				 PGK: 'Papua New Guinean Kina',
				 PHP: 'Philippine Peso',
				 PKR: 'Pakistani Rupee',
				 PLN: 'Polish Zloty',
				 PYG: 'Paraguayan Guarani',
				 QAR: 'Qatari Rial',
				 RON: 'Romanian Leu',
				 RSD: 'Serbian Dinar',
				 RUB: 'Russian Ruble',
				 RWF: 'Rwandan Franc',
				 SAR: 'Saudi Riyal',
				 SBD: 'Solomon Islands Dollar',
				 SCR: 'Seychellois Rupee',
				 SDG: 'Sudanese Pound',
				 SEK: 'Swedish Krona',
				 SGD: 'Singapore Dollar',
				 SHP: 'St. Helena Pound',
				 SLL: 'Sierra Leonean Leone',
				 SOS: 'Somali Shilling',
				 SRD: 'Surinamese Dollar',
				 STD: 'São Tomé & Príncipe Dobra',
				 SVC: 'Salvadoran Colón',
				 SYP: 'Syrian Pound',
				 SZL: 'Swazi Lilangeni',
				 THB: 'Thai Baht',
				 TJS: 'Tajikistani Somoni',
				 TMT: 'Turkmenistani Manat',
				 TND: 'Tunisian Dinar',
				 TOP: 'Tongan Pa\ʻanga',
				 TRY: 'Turkish Lira',
				 TTD: 'Trinidad & Tobago Dollar',
				 TWD: 'New Taiwan Dollar',
				 TZS: 'Tanzanian Shilling',
				 UAH: 'Ukrainian Hryvnia',
				 UGX: 'Ugandan Shilling',
				 UYU: 'Uruguayan Peso',
				 UZS: 'Uzbekistani Som',
				 VEF: 'Venezuelan Bolívar',
				 VND: 'Vietnamese Dong',
				 VUV: 'Vanuatu Vatu',
				 WST: 'Samoan Tala',
				 XAF: 'Central African CFA Franc',
				 XCD: 'East Caribbean Dollar',
				 XDR: 'Special Drawing Rights',
				 XOF: 'West African CFA Franc',
				 XPF: 'CFP Franc',
				 YER: 'Yemeni Rial',
				 ZAR: 'South African Rand',
				 ZMW: 'Zambia Kwacha'},
			
    // Error Messages
	errors: {missingElement: 'Missing Element!',
			 error: 'Error has been occured!',
			 invalidExpression: 'Invalid Expression!',
			invalidCurrency: 'Invalid Currency!'},
		
    // Texts of the widget
	texts: {title: 'Top Currency Converter',
			loading: 'Loading...',
			convertButton: 'Convert',
			switchButton: 'Switch',
			inputPlaceholder: 'Enter a number or math expression...',
			autocompletePlaceholder: 'Enter a currency..',
			from: 'From',
			to: 'To'}
	
};