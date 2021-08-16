/* 
Top Currency Converter 
========================

Version: 1.0
Author: Asaf Halili

Note: The code requires jQuery to work properly.
In order for the autocomplete to work properly, it requires jQuery-UI as well.

*/

// ============ Helper Functions - Start ===================

/** 
The function gets a selector and returns a boolean value,
whether the element exists in the page DOM or not. 
**/
function isElementExists(selector) {
	return $(selector).length > 0;
}

/**
The function gets an object and returns one of it properties.
If there is no properties, the function returns null. 
**/
function getOneKeyOfObject(obj) {
	for (var key in obj) {
	    if (obj.hasOwnProperty(key) && typeof(key) !== 'function') 
	        return key;
	}
	return null;
}

/* The function gets two select elements and swap between it's values. */
function switchSelectValues(element1,element2){
	var temp = element1.val();
	element1.val(element2.val());
	element2.val(temp);
}

function setSelectValue(element,value){
	element.find('option[value="'+value+'"]').attr("selected",true);
}

/**
The function gets an element and a value and sets the value in the element's value. **/
function setTextValue(element,value){
	element.attr("value",value);
}
// ============ Helpers Functions - End ===================

/* Fix for jQuery-UI autoComplete.
jQuery-UI has a bug in the width of it's dropdown,
the following code fix the bug. */
$.extend($.ui.autocomplete.prototype.options, {
	open: function(event, ui) {
		$(this).autocomplete("widget").css({
            "width": ($(this).width()+20 + "px")
        });
    }
});

/** 
The function is a constructor for the Currency object.
**/
function Currency(data){

    // Shortcut for convenience
    var currency = this;

    // Init an object for saving data
    currency.staticData = {};	

    // Create shortcut variable for minimize typing
    var std = this.staticData;
    std.mainElement = data.mainElement;

    // Sets language from the data object or sets the default language.
    var currLang = data.language || 'en';

    // Basic Configuration
    currency.currencies = languages[currLang].currencies;
    currency.errors = languages[currLang].errors;
    currency.texts = languages[currLang].texts;
    currency.themeColor = data.themeColor || 1;

    // Get Settings from the data object or by default values
    var settings = {};
    settings.currencyTitle = data.currencyTitle || currency.texts.title;
    settings.theme = data.theme || 'classic';
    settings.isRtl = languages[currLang].direction === 'rtl';
    settings.inputPlaceholder = data.inputPlaceholder || currency.texts.inputPlaceholder;
    settings.from = data.fromText || currency.texts.from;
    settings.to = data.toText || currency.texts.to;
    settings.convertButton = data.convertButtonText || currency.texts.convertButton;
    settings.switchButton = data.switchButtonText || currency.texts.switchButton;
    settings.loadingText = data.loadingText || currency.texts.loading;
    settings.maxWidth = data.maxWidth || 300;
    settings.digitsAfterDecimalPoint = data.digitsAfterDecimalPoint || 4;

    // Sets the Data Source
    if(data.hasOwnProperty('source'))
        settings.source = data.source;

    // Sets the Base Currency
    if(data.hasOwnProperty('baseCurrency'))
        std.baseCurrency = data.baseCurrency;
    else
        std.baseCurrency = getOneKeyOfObject(currency.currencies);

    // Pre-load element HTML code
    std.preloadHtml = '<div id="pre-load" style="text-align:center;">\
            <img src="images/loader.gif" id="loading-image" /><br />'
            + settings.loadingText +
        '</div>';

    // the basic HTML of the widget
    std.baseHtml = '<div id="heading">' + settings.currencyTitle + '</div>\
      <div id="body">\
        <input type="text" id="amount" placeholder="'+ settings.inputPlaceholder + '" />   '
         + settings.from +
            '   <select id="from-currencies-list">\
        </select>  ' +
        settings.to + '   <select id="to-currencies-list">\
        </select> <button type="button" id="convert">' + settings.convertButton + '</button>\
        <button id="switch">' + settings.switchButton + '</button> \
        <div id="converted-data"></div>\
        </div>';

    // Sets more settings from the data object
    if(data.hasOwnProperty('fromCurrency'))
        std.from = data.fromCurrency;
    if(data.hasOwnProperty('toCurrency'))
        std.to = data.toCurrency;
    if(data.hasOwnProperty('amountToConvert'))
        std.value = data.amountToConvert;
    if(data.hasOwnProperty('isSwitchButton'))
        std.isSwitchButton = data.isSwitchButton;
    else
        std.isSwitchButton = false;
    if(data.hasOwnProperty('type') && data.type === 'autocomplete'){
        std.type = 'autocomplete';
    }	
    if(data.hasOwnProperty('css') && data.css instanceof Object)
        settings.css = data.css;

    // Sets the IDs of the elements in the base HTML
    std.fromCurrSelect = '#from-currencies-list';
    std.toCurrSelect = '#to-currencies-list';
    std.moneyTextBox = '#amount';
    std.convertButton = '#convert';
    std.switchButton = '#switch';
    std.outputData = '#converted-data';
    std.loadingImage = '#loading-image';

    /** The function gets a selector and a boolean and returns the element in the dom
    * that represents the selector.
    * If the boolean is true, return the element.
    * If the boolean is false, return a string of the DOM representation of the element.
    **/
    currency.getPath = function(selector,returnElement) {
        if(returnElement === undefined || returnElement === true)
            return $(std.mainElement + ' ' + selector);
        return std.mainElement + ' ' + selector;	
    };

    /** 
    The function creates the URL to fetch the rates data (as JSON) from Yahoo API 
    **/
    currency.createUrl = function(){
        var j = 0;

        this.currenciesPairs = [];
        this.url = 'https://query.yahooapis.com/v1/public/yql?q=select * from yahoo.finance.xchange where pair in (';

        for(var key in this.currencies){
            if(key !== std.baseCurrency)
                this.currenciesPairs[j++] = '"' + std.baseCurrency + key + '"';
        }

        this.url = this.url + this.currenciesPairs.join() + ')&format=json&env=store://datatables.org/alltableswithkeys';
    };

    /** 
    The function fetches the data from the source and load the data.
    **/
    currency.getData = function(err){
        if(!settings.hasOwnProperty('source')){
            $.ajax({
              url: this.url,
            dataType: 'jsonp'})
              .done(function(data) {
                        currency.rates = data.query.results.rate;
                        // load the base html
                        $(std.mainElement).html(std.baseHtml);
                        $(std.mainElement).addClass('currency-theme');

                        // loading the data
                        currency.loadData(err);
              })
            .error(function(xhr, status, error) {
                err.call(this,new Error(xhr.responseText));
            })
        }else{   // If the source is not the default source
            currency.rates = data.source;
            $(std.mainElement).html(std.baseHtml);
            $(std.mainElement).addClass('currency-theme');
            currency.loadData(err);
        }

    };

    /** 
    The function gets a currency code and returns it's updated rate.
    **/
    currency.getDataByCode = function(code){

            // if it's the base currency
            if(code === std.baseCurrency)
                return 1;

            if(!settings.hasOwnProperty('source')){
                var pair = '"' + std.baseCurrency + code + '"';	
                var index = $.inArray(pair,this.currenciesPairs);

                // if it's not exist
                if(index == -1)
                    return null;

                // check if we fetched more than one currency 
                if(this.rates instanceof Array)
                    return this.rates[index].Rate;
                else
                    return this.rates.Rate;
            }else{ // If the source is not the default source
                if(this.rates.hasOwnProperty(code))
                    return this.rates[code];
                return null;
            }

    };

    /**
    The function loads the data got from the source into the HTML
    **/
    currency.loadData = function(err){
        // If dropDown chose
        if(std.type != 'autocomplete'){
            for(var key in this.currencies){
                this.getPath(std.fromCurrSelect).append('<option value="' + key + '">' + this.currencies[key] + ' (' + key + ')</option>');
                this.getPath(std.toCurrSelect).append('<option value="' + key + '">' + this.currencies[key] + ' (' + key + ')</option>');
            }
            
            if(std.hasOwnProperty('from'))
                setSelectValue(this.getPath(std.fromCurrSelect),std.from);
            if(std.hasOwnProperty('to'))
                setSelectValue(this.getPath(std.toCurrSelect),std.to);
            
        }else{ // If autoComplete chose
            currency.autocompleteData = $.map(currency.currencies, function(v, i) {
                    return {label: v + ' (' + i + ')', value: i};
                });

            $('<input id="from-currencies-text" placeholder="' + currency.texts.autocompletePlaceholder + '">').insertAfter(this.getPath(std.fromCurrSelect,false)).autocomplete({
                source: currency.autocompleteData
            });

            $('<input id="to-currencies-text" placeholder="' + currency.texts.autocompletePlaceholder + '">').insertAfter(this.getPath(std.toCurrSelect,false)).autocomplete({
                source: currency.autocompleteData
            });

            // Remove the dropdown elements from the DOM
            this.getPath(std.fromCurrSelect).remove();
            this.getPath(std.toCurrSelect).remove();

            std.fromCurrSelect = '#from-currencies-text';
            std.toCurrSelect = '#to-currencies-text';

            if(std.hasOwnProperty('from'))
                setTextValue(this.getPath(std.fromCurrSelect),std.from);
            if(std.hasOwnProperty('to'))
                setTextValue(this.getPath(std.toCurrSelect),std.to);

        }

        // Update default amount of money
        if(std.hasOwnProperty('value')){
            this.getPath(std.moneyTextBox).attr('value',std.value);
        }

        // Eemove switch button 
        if(std.hasOwnProperty('isSwitchButton') && std.isSwitchButton === false)
            this.getPath(std.switchButton).remove();

        // Fix for inline theme
        if(settings.theme !== 'inline')
            $(std.mainElement).css('max-width',settings.maxWidth + 'px');

        // Add additional css styles passed in the data object
        if(settings.hasOwnProperty('css'))
            for(var key in data.css)
                $(std.mainElement).css(key,data.css[key]);

    };

    // Error function, in case of errors
    var err = function(e,selector){
        if(selector === void 0)
            selector = std.outputData;

        selector = currency.getPath(selector);
        if(!isElementExists(selector)){
            alert(currency.errors.error);
            return;
        }

        $(std.loadingImage).remove();
        selector.html('<strong class="error">' + e + '</strong>');
    };

    /** 
    The function init the widget.
    **/
    currency.start = function(){

        // If the main element is not exists, show an error
        if(!isElementExists(std.mainElement)){
            err.call(this,new Error(this.errors.missingElement));
            return;
        }

        // Show the pre-load element
        $(std.mainElement).html(std.preloadHtml);
        
        // Add Theme Color and Theme style
        $(std.mainElement).addClass('currency-color-' + this.themeColor);
        $(std.mainElement).addClass('currency-theme-' + settings.theme);
        
        if(settings.isRtl){ // If the language is right-to-left, set css accordingly
            $(std.mainElement).css('direction','rtl');
        }

        /**
        The function calculate the math expression, convert to the suitable rate and
        view the result.
        **/
        var executeFunc = function(){
            var amount = currency.getPath(std.moneyTextBox).val();
            var fromCode = currency.getPath(std.fromCurrSelect).val();
            var toCode = currency.getPath(std.toCurrSelect).val();

            // Fetch the updated rates for the chosen currencies
            var fromRate = currency.getDataByCode(fromCode);
            var toRate = currency.getDataByCode(toCode);

            // If there isn't "from rate" or "to rate", shows an error
            if(fromRate === null || toRate === null){
                err.call(this,currency.errors.invalidCurrency);
                return;
            }

            // Parse the Math expression and calculate the result of it
            try{
                amount = Parser.evaluate(amount);
            }catch(e){ // If it's impossible to parse the expression, shows an error
                err.call(this,currency.errors.invalidExpression);
                return;
            }

            // Currency conversions
            var result = (toRate/fromRate * amount);
            result = Math.round(result * Math.pow(10,settings.digitsAfterDecimalPoint)) / (Math.pow(10,settings.digitsAfterDecimalPoint));

            // View the result
            currency.getPath(std.outputData).html(result + ' ' + currency.currencies[toCode]);
        };

        // Handle all nessecary events
        $(document).on('click',this.getPath(std.convertButton,false),executeFunc);

        $(document).on('keyup',this.getPath(std.moneyTextBox,false),executeFunc);

        $(document).on('change',this.getPath(std.fromCurrSelect,false),executeFunc);
        $(document).on('change',this.getPath(std.toCurrSelect,false),executeFunc);

        $(document).on('click',std.mainElement + ' #switch',function(){
            switchSelectValues(currency.getPath(std.fromCurrSelect),currency.getPath(std.toCurrSelect));
            executeFunc();
        });

        // calling the nessecary functions to get the currency rates data
        this.createUrl(err);
        this.getData(err);

    };

}


/* ============ Parser.js - Start ===================

 Based on ndef.parser, by Raphael Graf(r@undefined.ch)
 http://www.undefined.ch/mparser/index.html
 
 Ported to JavaScript and modified by Matthew Crumley (email@matthewcrumley.com,   http://silentmatt.com/)
*/
	if (!Array.indexOf) {
		Array.prototype.indexOf = function (obj, start) {
			for (var i = (start || 0); i < this.length; i++) {
				if (this[i] === obj) {
					return i;
				}
			}
			return -1;
		}
	}

var Parser = (function (scope) {
	function object(o) {
		function F() {}
		F.prototype = o;
		return new F();
	}

	var TNUMBER = 0;
	var TOP1 = 1;
	var TOP2 = 2;
	var TVAR = 3;
	var TFUNCALL = 4;

	function Token(type_, index_, prio_, number_) {
		this.type_ = type_;
		this.index_ = index_ || 0;
		this.prio_ = prio_ || 0;
		this.number_ = (number_ !== undefined && number_ !== null) ? number_ : 0;
		this.toString = function () {
			switch (this.type_) {
			case TNUMBER:
				return this.number_;
			case TOP1:
			case TOP2:
			case TVAR:
				return this.index_;
			case TFUNCALL:
				return "CALL";
			default:
				return "Invalid Token";
			}
		};
	}

	function Expression(tokens, ops1, ops2, functions) {
		this.tokens = tokens;
		this.ops1 = ops1;
		this.ops2 = ops2;
		this.functions = functions;
	}

	// Based on http://www.json.org/json2.js
    var cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
        escapable = /[\\\'\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
        meta = {    // table of character substitutions
            '\b': '\\b',
            '\t': '\\t',
            '\n': '\\n',
            '\f': '\\f',
            '\r': '\\r',
            "'" : "\\'",
            '\\': '\\\\'
        };

	function escapeValue(v) {
		if (typeof v === "string") {
			escapable.lastIndex = 0;
	        return escapable.test(v) ?
	            "'" + v.replace(escapable, function (a) {
	                var c = meta[a];
	                return typeof c === 'string' ? c :
	                    '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
	            }) + "'" :
	            "'" + v + "'";
		}
		return v;
	}

	Expression.prototype = {
		simplify: function (values) {
			values = values || {};
			var nstack = [];
			var newexpression = [];
			var n1;
			var n2;
			var f;
			var L = this.tokens.length;
			var item;
			var i = 0;
			for (i = 0; i < L; i++) {
				item = this.tokens[i];
				var type_ = item.type_;
				if (type_ === TNUMBER) {
					nstack.push(item);
				}
				else if (type_ === TVAR && (item.index_ in values)) {
					item = new Token(TNUMBER, 0, 0, values[item.index_]);
					nstack.push(item);
				}
				else if (type_ === TOP2 && nstack.length > 1) {
					n2 = nstack.pop();
					n1 = nstack.pop();
					f = this.ops2[item.index_];
					item = new Token(TNUMBER, 0, 0, f(n1.number_, n2.number_));
					nstack.push(item);
				}
				else if (type_ === TOP1 && nstack.length > 0) {
					n1 = nstack.pop();
					f = this.ops1[item.index_];
					item = new Token(TNUMBER, 0, 0, f(n1.number_));
					nstack.push(item);
				}
				else {
					while (nstack.length > 0) {
						newexpression.push(nstack.shift());
					}
					newexpression.push(item);
				}
			}
			while (nstack.length > 0) {
				newexpression.push(nstack.shift());
			}

			return new Expression(newexpression, object(this.ops1), object(this.ops2), object(this.functions));
		},

		substitute: function (variable, expr) {
			if (!(expr instanceof Expression)) {
				expr = new Parser().parse(String(expr));
			}
			var newexpression = [];
			var L = this.tokens.length;
			var item;
			var i = 0;
			for (i = 0; i < L; i++) {
				item = this.tokens[i];
				var type_ = item.type_;
				if (type_ === TVAR && item.index_ === variable) {
					for (var j = 0; j < expr.tokens.length; j++) {
						var expritem = expr.tokens[j];
						var replitem = new Token(expritem.type_, expritem.index_, expritem.prio_, expritem.number_);
						newexpression.push(replitem);
					}
				}
				else {
					newexpression.push(item);
				}
			}

			var ret = new Expression(newexpression, object(this.ops1), object(this.ops2), object(this.functions));
			return ret;
		},

		evaluate: function (values) {
			values = values || {};
			var nstack = [];
			var n1;
			var n2;
			var f;
			var L = this.tokens.length;
			var item;
			var i = 0;
			for (i = 0; i < L; i++) {
				item = this.tokens[i];
				var type_ = item.type_;
				if (type_ === TNUMBER) {
					nstack.push(item.number_);
				}
				else if (type_ === TOP2) {
					n2 = nstack.pop();
					n1 = nstack.pop();
					f = this.ops2[item.index_];
					nstack.push(f(n1, n2));
				}
				else if (type_ === TVAR) {
					if (item.index_ in values) {
						nstack.push(values[item.index_]);
					}
					else if (item.index_ in this.functions) {
						nstack.push(this.functions[item.index_]);
					}
					else {
						throw new Error("undefined variable: " + item.index_);
					}
				}
				else if (type_ === TOP1) {
					n1 = nstack.pop();
					f = this.ops1[item.index_];
					nstack.push(f(n1));
				}
				else if (type_ === TFUNCALL) {
					n1 = nstack.pop();
					f = nstack.pop();
					if (f.apply && f.call) {
						if (Object.prototype.toString.call(n1) == "[object Array]") {
							nstack.push(f.apply(undefined, n1));
						}
						else {
							nstack.push(f.call(undefined, n1));
						}
					}
					else {
						throw new Error(f + " is not a function");
					}
				}
				else {
					throw new Error("invalid Expression");
				}
			}
			if (nstack.length > 1) {
				throw new Error("invalid Expression (parity)");
			}
			return nstack[0];
		},

		toString: function (toJS) {
			var nstack = [];
			var n1;
			var n2;
			var f;
			var L = this.tokens.length;
			var item;
			var i = 0;
			for (i = 0; i < L; i++) {
				item = this.tokens[i];
				var type_ = item.type_;
				if (type_ === TNUMBER) {
					nstack.push(escapeValue(item.number_));
				}
				else if (type_ === TOP2) {
					n2 = nstack.pop();
					n1 = nstack.pop();
					f = item.index_;
					if (toJS && f == "^") {
						nstack.push("Math.pow(" + n1 + "," + n2 + ")");
					}
					else {
						nstack.push("(" + n1 + f + n2 + ")");
					}
				}
				else if (type_ === TVAR) {
					nstack.push(item.index_);
				}
				else if (type_ === TOP1) {
					n1 = nstack.pop();
					f = item.index_;
					if (f === "-") {
						nstack.push("(" + f + n1 + ")");
					}
					else {
						nstack.push(f + "(" + n1 + ")");
					}
				}
				else if (type_ === TFUNCALL) {
					n1 = nstack.pop();
					f = nstack.pop();
					nstack.push(f + "(" + n1 + ")");
				}
				else {
					throw new Error("invalid Expression");
				}
			}
			if (nstack.length > 1) {
				throw new Error("invalid Expression (parity)");
			}
			return nstack[0];
		},

		variables: function () {
			var L = this.tokens.length;
			var vars = [];
			for (var i = 0; i < L; i++) {
				var item = this.tokens[i];
				if (item.type_ === TVAR && (vars.indexOf(item.index_) == -1)) {
					vars.push(item.index_);
				}
			}

			return vars;
		},

		toJSFunction: function (param, variables) {
			var f = new Function(param, "with(Parser.values) { return " + this.simplify(variables).toString(true) + "; }");
			return f;
		}
	};

	function add(a, b) {
		return Number(a) + Number(b);
	}
	function sub(a, b) {
		return a - b;
	}
	function mul(a, b) {
		return a * b;
	}
	function div(a, b) {
		return a / b;
	}
	function mod(a, b) {
		return a % b;
	}
	function concat(a, b) {
		return "" + a + b;
	}
	function equal(a, b) {
		return a == b;
	}
	function notEqual(a, b) {
		return a != b;
	}
	function greaterThan(a, b) {
		return a > b;
	}
	function lessThan(a, b) {
		return a < b;
	}
	function greaterThanEqual(a, b) {
		return a >= b;
	}
	function lessThanEqual(a, b) {
		return a <= b;
	}
	function andOperator(a, b) {
		return Boolean(a && b);
	}
	function orOperator(a, b) {
		return Boolean(a || b);
	}
	function sinh(a) {
		return Math.sinh ? Math.sinh(a) : ((Math.exp(a) - Math.exp(-a)) / 2);
	}
	function cosh(a) {
		return Math.cosh ? Math.cosh(a) : ((Math.exp(a) + Math.exp(-a)) / 2);
	}
	function tanh(a) {
		if (Math.tanh) return Math.tanh(a);
		if(a === Infinity) return 1;
		if(a === -Infinity) return -1;
		return (Math.exp(a) - Math.exp(-a)) / (Math.exp(a) + Math.exp(-a));
	}
	function asinh(a) {
		if (Math.asinh) return Math.asinh(a);
		if(a === -Infinity) return a;
		return Math.log(a + Math.sqrt(a * a + 1));
	}
	function acosh(a) {
		return Math.acosh ? Math.acosh(a) : Math.log(a + Math.sqrt(a * a - 1));
	}
	function atanh(a) {
		return Math.atanh ? Math.atanh(a) : (Math.log((1+a)/(1-a)) / 2);
	}
	function log10(a) {
	      return Math.log(a) * Math.LOG10E;
	}
	function neg(a) {
		return -a;
	}
	function trunc(a) {
		if(Math.trunc) return Math.trunc(a);
		else return x < 0 ? Math.ceil(x) : Math.floor(x);
	}
	function random(a) {
		return Math.random() * (a || 1);
	}
	function fac(a) { //a!
		a = Math.floor(a);
		var b = a;
		while (a > 1) {
			b = b * (--a);
		}
		return b;
	}

	// TODO: use hypot that doesn't overflow
	function hypot() {
		if(Math.hypot) return Math.hypot.apply(this, arguments);
		var y = 0;
		var length = arguments.length;
		for (var i = 0; i < length; i++) {
			if (arguments[i] === Infinity || arguments[i] === -Infinity) {
				return Infinity;
			}
			y += arguments[i] * arguments[i];
		}
		return Math.sqrt(y);
	}

	function condition(cond, yep, nope) {
		return cond ? yep : nope;
	}

	function append(a, b) {
		if (Object.prototype.toString.call(a) != "[object Array]") {
			return [a, b];
		}
		a = a.slice();
		a.push(b);
		return a;
	}

	function Parser() {
		this.success = false;
		this.errormsg = "";
		this.expression = "";

		this.pos = 0;

		this.tokennumber = 0;
		this.tokenprio = 0;
		this.tokenindex = 0;
		this.tmpprio = 0;

		this.ops1 = {
			"sin": Math.sin,
			"cos": Math.cos,
			"tan": Math.tan,
			"asin": Math.asin,
			"acos": Math.acos,
			"atan": Math.atan,
			"sinh": sinh,
			"cosh": cosh,
			"tanh": tanh,
			"asinh": asinh,
			"acosh": acosh,
			"atanh": atanh,
			"sqrt": Math.sqrt,
			"log": Math.log,
			"lg" : log10,
			"log10" : log10,
			"abs": Math.abs,
			"ceil": Math.ceil,
			"floor": Math.floor,
			"round": Math.round,
			"trunc": trunc,
			"-": neg,
			"exp": Math.exp
		};

		this.ops2 = {
			"+": add,
			"-": sub,
			"*": mul,
			"/": div,
			"%": mod,
			"^": Math.pow,
			",": append,
			"||": concat,
			"==": equal,
			"!=": notEqual,
			">": greaterThan,
			"<": lessThan,
			">=": greaterThanEqual,
			"<=": lessThanEqual,
			"and": andOperator,
			"or": orOperator
		};

		this.functions = {
			"random": random,
			"fac": fac,
			"min": Math.min,
			"max": Math.max,
			"hypot": hypot,
			"pyt": hypot, // backward compat
			"pow": Math.pow,
			"atan2": Math.atan2,
			"if": condition
		};

		this.consts = {
			"E": Math.E,
			"PI": Math.PI
		};
	}

	Parser.parse = function (expr) {
		return new Parser().parse(expr);
	};

	Parser.evaluate = function (expr, variables) {
		return Parser.parse(expr).evaluate(variables);
	};

	Parser.Expression = Expression;

	Parser.values = {
		sin: Math.sin,
		cos: Math.cos,
		tan: Math.tan,
		asin: Math.asin,
		acos: Math.acos,
		atan: Math.atan,
		sinh: sinh,
		cosh: cosh,
		tanh: tanh,
		asinh: asinh,
		acosh: acosh,
		atanh: atanh,
		sqrt: Math.sqrt,
		log: Math.log,
		lg: log10,
		log10: log10,
		abs: Math.abs,
		ceil: Math.ceil,
		floor: Math.floor,
		round: Math.round,
		trunc: trunc,
		random: random,
		fac: fac,
		exp: Math.exp,
		min: Math.min,
		max: Math.max,
		hypot: hypot,
		pyt: hypot, // backward compat
		pow: Math.pow,
		atan2: Math.atan2,
		if: condition,
		E: Math.E,
		PI: Math.PI
	};

	var PRIMARY      = 1 << 0;
	var OPERATOR     = 1 << 1;
	var FUNCTION     = 1 << 2;
	var LPAREN       = 1 << 3;
	var RPAREN       = 1 << 4;
	var COMMA        = 1 << 5;
	var SIGN         = 1 << 6;
	var CALL         = 1 << 7;
	var NULLARY_CALL = 1 << 8;

	Parser.prototype = {
		parse: function (expr) {
			this.errormsg = "";
			this.success = true;
			var operstack = [];
			var tokenstack = [];
			this.tmpprio = 0;
			var expected = (PRIMARY | LPAREN | FUNCTION | SIGN);
			var noperators = 0;
			this.expression = expr;
			this.pos = 0;

			while (this.pos < this.expression.length) {
				if (this.isOperator()) {
					if (this.isSign() && (expected & SIGN)) {
						if (this.isNegativeSign()) {
							this.tokenprio = 2;
							this.tokenindex = "-";
							noperators++;
							this.addfunc(tokenstack, operstack, TOP1);
						}
						expected = (PRIMARY | LPAREN | FUNCTION | SIGN);
					}
					else if (this.isComment()) {

					}
					else {
						if ((expected & OPERATOR) === 0) {
							this.error_parsing(this.pos, "unexpected operator");
						}
						noperators += 2;
						this.addfunc(tokenstack, operstack, TOP2);
						expected = (PRIMARY | LPAREN | FUNCTION | SIGN);
					}
				}
				else if (this.isNumber()) {
					if ((expected & PRIMARY) === 0) {
						this.error_parsing(this.pos, "unexpected number");
					}
					var token = new Token(TNUMBER, 0, 0, this.tokennumber);
					tokenstack.push(token);

					expected = (OPERATOR | RPAREN | COMMA);
				}
				else if (this.isString()) {
					if ((expected & PRIMARY) === 0) {
						this.error_parsing(this.pos, "unexpected string");
					}
					var token = new Token(TNUMBER, 0, 0, this.tokennumber);
					tokenstack.push(token);

					expected = (OPERATOR | RPAREN | COMMA);
				}
				else if (this.isLeftParenth()) {
					if ((expected & LPAREN) === 0) {
						this.error_parsing(this.pos, "unexpected \"(\"");
					}

					if (expected & CALL) {
						noperators += 2;
						this.tokenprio = -2;
						this.tokenindex = -1;
						this.addfunc(tokenstack, operstack, TFUNCALL);
					}

					expected = (PRIMARY | LPAREN | FUNCTION | SIGN | NULLARY_CALL);
				}
				else if (this.isRightParenth()) {
				    if (expected & NULLARY_CALL) {
						var token = new Token(TNUMBER, 0, 0, []);
						tokenstack.push(token);
					}
					else if ((expected & RPAREN) === 0) {
						this.error_parsing(this.pos, "unexpected \")\"");
					}

					expected = (OPERATOR | RPAREN | COMMA | LPAREN | CALL);
				}
				else if (this.isComma()) {
					if ((expected & COMMA) === 0) {
						this.error_parsing(this.pos, "unexpected \",\"");
					}
					this.addfunc(tokenstack, operstack, TOP2);
					noperators += 2;
					expected = (PRIMARY | LPAREN | FUNCTION | SIGN);
				}
				else if (this.isConst()) {
					if ((expected & PRIMARY) === 0) {
						this.error_parsing(this.pos, "unexpected constant");
					}
					var consttoken = new Token(TNUMBER, 0, 0, this.tokennumber);
					tokenstack.push(consttoken);
					expected = (OPERATOR | RPAREN | COMMA);
				}
				else if (this.isOp2()) {
					if ((expected & FUNCTION) === 0) {
						this.error_parsing(this.pos, "unexpected function");
					}
					this.addfunc(tokenstack, operstack, TOP2);
					noperators += 2;
					expected = (LPAREN);
				}
				else if (this.isOp1()) {
					if ((expected & FUNCTION) === 0) {
						this.error_parsing(this.pos, "unexpected function");
					}
					this.addfunc(tokenstack, operstack, TOP1);
					noperators++;
					expected = (LPAREN);
				}
				else if (this.isVar()) {
					if ((expected & PRIMARY) === 0) {
						this.error_parsing(this.pos, "unexpected variable");
					}
					var vartoken = new Token(TVAR, this.tokenindex, 0, 0);
					tokenstack.push(vartoken);

					expected = (OPERATOR | RPAREN | COMMA | LPAREN | CALL);
				}
				else if (this.isWhite()) {
				}
				else {
					if (this.errormsg === "") {
						this.error_parsing(this.pos, "unknown character");
					}
					else {
						this.error_parsing(this.pos, this.errormsg);
					}
				}
			}
			if (this.tmpprio < 0 || this.tmpprio >= 10) {
				this.error_parsing(this.pos, "unmatched \"()\"");
			}
			while (operstack.length > 0) {
				var tmp = operstack.pop();
				tokenstack.push(tmp);
			}
			if (noperators + 1 !== tokenstack.length) {
				//print(noperators + 1);
				//print(tokenstack);
				this.error_parsing(this.pos, "parity");
			}

			return new Expression(tokenstack, object(this.ops1), object(this.ops2), object(this.functions));
		},

		evaluate: function (expr, variables) {
			return this.parse(expr).evaluate(variables);
		},

		error_parsing: function (column, msg) {
			this.success = false;
			this.errormsg = "parse error [column " + (column) + "]: " + msg;
			this.column = column;
			throw new Error(this.errormsg);
		},

//\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\

		addfunc: function (tokenstack, operstack, type_) {
			var operator = new Token(type_, this.tokenindex, this.tokenprio + this.tmpprio, 0);
			while (operstack.length > 0) {
				if (operator.prio_ <= operstack[operstack.length - 1].prio_) {
					tokenstack.push(operstack.pop());
				}
				else {
					break;
				}
			}
			operstack.push(operator);
		},

		isNumber: function () {
			var r = false;
			var str = "";
			while (this.pos < this.expression.length) {
				var code = this.expression.charCodeAt(this.pos);
				if ((code >= 48 && code <= 57) || code === 46) {
					str += this.expression.charAt(this.pos);
					this.pos++;
					this.tokennumber = parseFloat(str);
					r = true;
				}
				else {
					break;
				}
			}
			return r;
		},

		// Ported from the yajjl JSON parser at http://code.google.com/p/yajjl/
		unescape: function(v, pos) {
			var buffer = [];
			var escaping = false;

			for (var i = 0; i < v.length; i++) {
				var c = v.charAt(i);

				if (escaping) {
					switch (c) {
					case "'":
						buffer.push("'");
						break;
					case '\\':
						buffer.push('\\');
						break;
					case '/':
						buffer.push('/');
						break;
					case 'b':
						buffer.push('\b');
						break;
					case 'f':
						buffer.push('\f');
						break;
					case 'n':
						buffer.push('\n');
						break;
					case 'r':
						buffer.push('\r');
						break;
					case 't':
						buffer.push('\t');
						break;
					case 'u':
						// interpret the following 4 characters as the hex of the unicode code point
						var codePoint = parseInt(v.substring(i + 1, i + 5), 16);
						buffer.push(String.fromCharCode(codePoint));
						i += 4;
						break;
					default:
						throw this.error_parsing(pos + i, "Illegal escape sequence: '\\" + c + "'");
					}
					escaping = false;
				} else {
					if (c == '\\') {
						escaping = true;
					} else {
						buffer.push(c);
					}
				}
			}

			return buffer.join('');
		},

		isString: function () {
			var r = false;
			var str = "";
			var startpos = this.pos;
			if (this.pos < this.expression.length && this.expression.charAt(this.pos) == "'") {
				this.pos++;
				while (this.pos < this.expression.length) {
					var code = this.expression.charAt(this.pos);
					if (code != "'" || str.slice(-1) == "\\") {
						str += this.expression.charAt(this.pos);
						this.pos++;
					}
					else {
						this.pos++;
						this.tokennumber = this.unescape(str, startpos);
						r = true;
						break;
					}
				}
			}
			return r;
		},

		isConst: function () {
			var str;
			for (var i in this.consts) {
				if (true) {
					var L = i.length;
					str = this.expression.substr(this.pos, L);
					if (i === str) {
						this.tokennumber = this.consts[i];
						this.pos += L;
						return true;
					}
				}
			}
			return false;
		},

		isOperator: function () {
			var code = this.expression.charCodeAt(this.pos);
			if (code === 43) { // +
				this.tokenprio = 2;
				this.tokenindex = "+";
			}
			else if (code === 45) { // -
				this.tokenprio = 2;
				this.tokenindex = "-";
			}
			else if (code === 62) { // >
				if (this.expression.charCodeAt(this.pos + 1) === 61) {
					this.pos++;
					this.tokenprio = 1;
					this.tokenindex = ">=";
				} else {
					this.tokenprio = 1;
					this.tokenindex = ">";
				}
			}
			else if (code === 60) { // <
				if (this.expression.charCodeAt(this.pos + 1) === 61) {
					this.pos++;
					this.tokenprio = 1;
					this.tokenindex = "<=";
				} else {
					this.tokenprio = 1;
					this.tokenindex = "<";
				}
			}
			else if (code === 124) { // |
				if (this.expression.charCodeAt(this.pos + 1) === 124) {
					this.pos++;
					this.tokenprio = 1;
					this.tokenindex = "||";
				}
				else {
					return false;
				}
			}
			else if (code === 61) { // =
				if (this.expression.charCodeAt(this.pos + 1) === 61) {
					this.pos++;
					this.tokenprio = 1;
					this.tokenindex = "==";
				}
				else {
					return false;
				}
			}
			else if (code === 33) { // !
				if (this.expression.charCodeAt(this.pos + 1) === 61) {
					this.pos++;
					this.tokenprio = 1;
					this.tokenindex = "!=";
				}
				else {
					return false;
				}
			}
			else if (code === 97) { // a
				if (this.expression.charCodeAt(this.pos + 1) === 110 && this.expression.charCodeAt(this.pos + 2) === 100) { // n && d
					this.pos++;
					this.pos++;
					this.tokenprio = 0;
					this.tokenindex = "and";
				}
				else {
					return false;
				}
			}
			else if (code === 111) { // o
				if (this.expression.charCodeAt(this.pos + 1) === 114) { // r
					this.pos++;
					this.tokenprio = 0;
					this.tokenindex = "or";
				}
				else {
					return false;
				}
			}
			else if (code === 42 || code === 8729 || code === 8226) { // * or ∙ or •
				this.tokenprio = 3;
				this.tokenindex = "*";
			}
			else if (code === 47) { // /
				this.tokenprio = 4;
				this.tokenindex = "/";
			}
			else if (code === 37) { // %
				this.tokenprio = 4;
				this.tokenindex = "%";
			}
			else if (code === 94) { // ^
				this.tokenprio = 5;
				this.tokenindex = "^";
			}
			else {
				return false;
			}
			this.pos++;
			return true;
		},

		isSign: function () {
			var code = this.expression.charCodeAt(this.pos - 1);
			if (code === 45 || code === 43) { // -
				return true;
			}
			return false;
		},

		isPositiveSign: function () {
			var code = this.expression.charCodeAt(this.pos - 1);
			if (code === 43) { // +
				return true;
			}
			return false;
		},

		isNegativeSign: function () {
			var code = this.expression.charCodeAt(this.pos - 1);
			if (code === 45) { // -
				return true;
			}
			return false;
		},

		isLeftParenth: function () {
			var code = this.expression.charCodeAt(this.pos);
			if (code === 40) { // (
				this.pos++;
				this.tmpprio += 10;
				return true;
			}
			return false;
		},

		isRightParenth: function () {
			var code = this.expression.charCodeAt(this.pos);
			if (code === 41) { // )
				this.pos++;
				this.tmpprio -= 10;
				return true;
			}
			return false;
		},

		isComma: function () {
			var code = this.expression.charCodeAt(this.pos);
			if (code === 44) { // ,
				this.pos++;
				this.tokenprio = -1;
				this.tokenindex = ",";
				return true;
			}
			return false;
		},

		isWhite: function () {
			var code = this.expression.charCodeAt(this.pos);
			if (code === 32 || code === 9 || code === 10 || code === 13) {
				this.pos++;
				return true;
			}
			return false;
		},

		isOp1: function () {
			var str = "";
			for (var i = this.pos; i < this.expression.length; i++) {
				var c = this.expression.charAt(i);
				if (c.toUpperCase() === c.toLowerCase()) {
					if (i === this.pos || (c != '_' && (c < '0' || c > '9'))) {
						break;
					}
				}
				str += c;
			}
			if (str.length > 0 && (str in this.ops1)) {
				this.tokenindex = str;
				this.tokenprio = 5;
				this.pos += str.length;
				return true;
			}
			return false;
		},

		isOp2: function () {
			var str = "";
			for (var i = this.pos; i < this.expression.length; i++) {
				var c = this.expression.charAt(i);
				if (c.toUpperCase() === c.toLowerCase()) {
					if (i === this.pos || (c != '_' && (c < '0' || c > '9'))) {
						break;
					}
				}
				str += c;
			}
			if (str.length > 0 && (str in this.ops2)) {
				this.tokenindex = str;
				this.tokenprio = 5;
				this.pos += str.length;
				return true;
			}
			return false;
		},

		isVar: function () {
			var str = "";
			for (var i = this.pos; i < this.expression.length; i++) {
				var c = this.expression.charAt(i);
				if (c.toUpperCase() === c.toLowerCase()) {
					if (i === this.pos || (c != '_' && (c < '0' || c > '9'))) {
						break;
					}
				}
				str += c;
			}
			if (str.length > 0) {
				this.tokenindex = str;
				this.tokenprio = 4;
				this.pos += str.length;
				return true;
			}
			return false;
		},

		isComment: function () {
			var code = this.expression.charCodeAt(this.pos - 1);
			if (code === 47 && this.expression.charCodeAt(this.pos) === 42) {
				this.pos = this.expression.indexOf("*/", this.pos) + 2;
				if (this.pos === 1) {
					this.pos = this.expression.length;
				}
				return true;
			}
			return false;
		}
	};

	scope.Parser = Parser;
	return Parser
})(typeof exports === 'undefined' ? {} : exports);
/* ============ Parser.js - End =================== */