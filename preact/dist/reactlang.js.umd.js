(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('preact')) :
	typeof define === 'function' && define.amd ? define(['preact'], factory) :
	(global.ReactlangJs = factory(global.preact));
}(this, (function (React) { 'use strict';

React = React && React.hasOwnProperty('default') ? React['default'] : React;

var commonjsGlobal = typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};





function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

var lang = createCommonjsModule(function (module, exports) {
/*!
 *  Lang.js for Laravel localization in JavaScript.
 *
 *  @version 1.1.12
 *  @license MIT https://github.com/rmariuzzo/Lang.js/blob/master/LICENSE
 *  @site    https://github.com/rmariuzzo/Lang.js
 *  @author  Rubens Mariuzzo <rubens@mariuzzo.com>
 */

(function(root, factory) {
    if (typeof undefined === 'function' && undefined.amd) {
        // AMD support.
        undefined([], factory);
    } else {
        // NodeJS support.
        module.exports = factory();
    }

}(commonjsGlobal, function() {
    function inferLocale() {
        if (typeof document !== 'undefined' && document.documentElement) {
            return document.documentElement.lang;
        }
    }

    function convertNumber(str) {
        if (str === '-Inf') {
            return -Infinity;
        } else if (str === '+Inf' || str === 'Inf' || str === '*') {
            return Infinity;
        }
        return parseInt(str, 10);
    }

    // Derived from: https://github.com/symfony/translation/blob/460390765eb7bb9338a4a323b8a4e815a47541ba/Interval.php
    var intervalRegexp = /^({\s*(\-?\d+(\.\d+)?[\s*,\s*\-?\d+(\.\d+)?]*)\s*})|([\[\]])\s*(-Inf|\*|\-?\d+(\.\d+)?)\s*,\s*(\+?Inf|\*|\-?\d+(\.\d+)?)\s*([\[\]])$/;
    var anyIntervalRegexp = /({\s*(\-?\d+(\.\d+)?[\s*,\s*\-?\d+(\.\d+)?]*)\s*})|([\[\]])\s*(-Inf|\*|\-?\d+(\.\d+)?)\s*,\s*(\+?Inf|\*|\-?\d+(\.\d+)?)\s*([\[\]])/;

    // Default options //

    var defaults = {
        locale: 'en'/** The default locale if not set. */
    };

    // Constructor //

    var Lang = function(options) {
        options = options || {};
        this.locale = options.locale || inferLocale() || defaults.locale;
        this.fallback = options.fallback;
        this.messages = options.messages;
    };

    // Methods //

    /**
     * Set messages source.
     *
     * @param messages {object} The messages source.
     *
     * @return void
     */
    Lang.prototype.setMessages = function(messages) {
        this.messages = messages;
    };

    /**
     * Get the current locale.
     *
     * @return {string} The current locale.
     */
    Lang.prototype.getLocale = function() {
        return this.locale || this.fallback;
    };

    /**
     * Set the current locale.
     *
     * @param locale {string} The locale to set.
     *
     * @return void
     */
    Lang.prototype.setLocale = function(locale) {
        this.locale = locale;
    };

    /**
     * Get the fallback locale being used.
     *
     * @return void
     */
    Lang.prototype.getFallback = function() {
        return this.fallback;
    };

    /**
     * Set the fallback locale being used.
     *
     * @param fallback {string} The fallback locale.
     *
     * @return void
     */
    Lang.prototype.setFallback = function(fallback) {
        this.fallback = fallback;
    };

    /**
     * This method act as an alias to get() method.
     *
     * @param key {string} The key of the message.
     * @param locale {string} The locale of the message
     *
     * @return {boolean} true if the given key is defined on the messages source, otherwise false.
     */
    Lang.prototype.has = function(key, locale) {
        if (typeof key !== 'string' || !this.messages) {
            return false;
        }

        return this._getMessage(key, locale) !== null;
    };

    /**
     * Get a translation message.
     *
     * @param key {string} The key of the message.
     * @param replacements {object} The replacements to be done in the message.
     * @param locale {string} The locale to use, if not passed use the default locale.
     *
     * @return {string} The translation message, if not found the given key.
     */
    Lang.prototype.get = function(key, replacements, locale) {
        if (!this.has(key, locale)) {
            return key;
        }

        var message = this._getMessage(key, locale);
        if (message === null) {
            return key;
        }

        if (replacements) {
            message = this._applyReplacements(message, replacements);
        }

        return message;
    };

    /**
     * This method act as an alias to get() method.
     *
     * @param key {string} The key of the message.
     * @param replacements {object} The replacements to be done in the message.
     *
     * @return {string} The translation message, if not found the given key.
     */
    Lang.prototype.trans = function(key, replacements) {
        return this.get(key, replacements);
    };

    /**
     * Gets the plural or singular form of the message specified based on an integer value.
     *
     * @param key {string} The key of the message.
     * @param count {number} The number of elements.
     * @param replacements {object} The replacements to be done in the message.
     * @param locale {string} The locale to use, if not passed use the default locale.
     *
     * @return {string} The translation message according to an integer value.
     */
    Lang.prototype.choice = function(key, number, replacements, locale) {
        // Set default values for parameters replace and locale
        replacements = typeof replacements !== 'undefined'
            ? replacements
            : {};

        // The count must be replaced if found in the message
        replacements.count = number;

        // Message to get the plural or singular
        var message = this.get(key, replacements, locale);

        // Check if message is not null or undefined
        if (message === null || message === undefined) {
            return message;
        }

        // Separate the plural from the singular, if any
        var messageParts = message.split('|');

        // Get the explicit rules, If any
        var explicitRules = [];

        for (var i = 0; i < messageParts.length; i++) {
            messageParts[i] = messageParts[i].trim();

            if (anyIntervalRegexp.test(messageParts[i])) {
                var messageSpaceSplit = messageParts[i].split(/\s/);
                explicitRules.push(messageSpaceSplit.shift());
                messageParts[i] = messageSpaceSplit.join(' ');
            }
        }

        // Check if there's only one message
        if (messageParts.length === 1) {
            // Nothing to do here
            return message;
        }

        // Check the explicit rules
        for (var j = 0; j < explicitRules.length; j++) {
            if (this._testInterval(number, explicitRules[j])) {
                return messageParts[j];
            }
        }

        locale = locale || this._getLocale(key);
        var pluralForm = this._getPluralForm(number, locale);

        return messageParts[pluralForm];
    };

    /**
     * This method act as an alias to choice() method.
     *
     * @param key {string} The key of the message.
     * @param count {number} The number of elements.
     * @param replacements {object} The replacements to be done in the message.
     *
     * @return {string} The translation message according to an integer value.
     */
    Lang.prototype.transChoice = function(key, count, replacements) {
        return this.choice(key, count, replacements);
    };

    /**
     * Parse a message key into components.
     *
     * @param key {string} The message key to parse.
     * @param key {string} The message locale to parse
     * @return {object} A key object with source and entries properties.
     */
    Lang.prototype._parseKey = function(key, locale) {
        if (typeof key !== 'string' || typeof locale !== 'string') {
            return null;
        }

        var segments = key.split('.');
        var source = segments[0].replace(/\//g, '.');

        return {
            source: locale + '.' + source,
            sourceFallback: this.getFallback() + '.' + source,
            entries: segments.slice(1)
        };
    };

    /**
     * Returns a translation message. Use `Lang.get()` method instead, this methods assumes the key exists.
     *
     * @param key {string} The key of the message.
     * @param locale {string} The locale of the message
     *
     * @return {string} The translation message for the given key.
     */
    Lang.prototype._getMessage = function(key, locale) {
        locale = locale || this.getLocale();
        key = this._parseKey(key, locale);

        // Ensure message source exists.
        if (this.messages[key.source] === undefined && this.messages[key.sourceFallback] === undefined) {
            return null;
        }

        // Get message from default locale.
        var message = this.messages[key.source];
        var entries = key.entries.slice();
        var subKey = '';
        while (entries.length && message !== undefined) {
            var subKey = !subKey ? entries.shift() : subKey.concat('.', entries.shift());
            if (message[subKey] !== undefined) {
                message = message[subKey];
                subKey = '';
            }
        }

        // Get message from fallback locale.
        if (typeof message !== 'string' && this.messages[key.sourceFallback]) {
            message = this.messages[key.sourceFallback];
            entries = key.entries.slice();
            subKey = '';
            while (entries.length && message !== undefined) {
                var subKey = !subKey ? entries.shift() : subKey.concat('.', entries.shift());
                if (message[subKey]) {
                    message = message[subKey];
                    subKey = '';
                }
            }
        }

        if (typeof message !== 'string') {
            return null;
        }

        return message;
    };

    /**
     * Return the locale to be used between default and fallback.
     * @param {String} key
     * @return {String}
     */
    Lang.prototype._getLocale = function(key) {
        key = this._parseKey(key, this.locale);
        if (this.messages[key.source]) {
            return this.locale;
        }
        if (this.messages[key.sourceFallback]) {
            return this.fallback;
        }
        return null;
    };

    /**
     * Find a message in a translation tree using both dotted keys and regular ones
     *
     * @param pathSegments {array} An array of path segments such as ['family', 'father']
     * @param tree {object} The translation tree
     */
    Lang.prototype._findMessageInTree = function(pathSegments, tree) {
        while (pathSegments.length && tree !== undefined) {
            var dottedKey = pathSegments.join('.');
            if (tree[dottedKey]) {
                tree = tree[dottedKey];
                break;
            }

            tree = tree[pathSegments.shift()];
        }

        return tree;
    };

    /**
     * Sort replacement keys by length in descending order.
     *
     * @param a {string} Replacement key
     * @param b {string} Sibling replacement key
     * @return {number}
     * @private
     */
    Lang.prototype._sortReplacementKeys = function(a, b) {
        return b.length - a.length;
    };

    /**
     * Apply replacements to a string message containing placeholders.
     *
     * @param message {string} The text message.
     * @param replacements {object} The replacements to be done in the message.
     *
     * @return {string} The string message with replacements applied.
     */
    Lang.prototype._applyReplacements = function(message, replacements) {
        var keys = Object.keys(replacements).sort(this._sortReplacementKeys);

        keys.forEach(function(replace) {
            message = message.replace(new RegExp(':' + replace, 'gi'), function (match) {
                var value = replacements[replace];

                // Capitalize all characters.
                var allCaps = match === match.toUpperCase();
                if (allCaps) {
                    return value.toUpperCase();
                }

                // Capitalize first letter.
                var firstCap = match === match.replace(/\w/i, function(letter) {
                    return letter.toUpperCase();
                });
                if (firstCap) {
                    return value.charAt(0).toUpperCase() + value.slice(1);
                }

                return value;
            });
        });
        return message;
    };

    /**
     * Checks if the given `count` is within the interval defined by the {string} `interval`
     *
     * @param  count     {int}    The amount of items.
     * @param  interval  {string} The interval to be compared with the count.
     * @return {boolean}          Returns true if count is within interval; false otherwise.
     */
    Lang.prototype._testInterval = function(count, interval) {
        /**
         * From the Symfony\Component\Translation\Interval Docs
         *
         * Tests if a given number belongs to a given math interval.
         *
         * An interval can represent a finite set of numbers:
         *
         *  {1,2,3,4}
         *
         * An interval can represent numbers between two numbers:
         *
         *  [1, +Inf]
         *  ]-1,2[
         *
         * The left delimiter can be [ (inclusive) or ] (exclusive).
         * The right delimiter can be [ (exclusive) or ] (inclusive).
         * Beside numbers, you can use -Inf and +Inf for the infinite.
         */

        if (typeof interval !== 'string') {
            throw 'Invalid interval: should be a string.';
        }

        interval = interval.trim();

        var matches = interval.match(intervalRegexp);
        if (!matches) {
            throw 'Invalid interval: ' + interval;
        }

        if (matches[2]) {
            var items = matches[2].split(',');
            for (var i = 0; i < items.length; i++) {
                if (parseInt(items[i], 10) === count) {
                    return true;
                }
            }
        } else {
            // Remove falsy values.
            matches = matches.filter(function(match) {
                return !!match;
            });

            var leftDelimiter = matches[1];
            var leftNumber = convertNumber(matches[2]);
            if (leftNumber === Infinity) {
                leftNumber = -Infinity;
            }
            var rightNumber = convertNumber(matches[3]);
            var rightDelimiter = matches[4];

            return (leftDelimiter === '[' ? count >= leftNumber : count > leftNumber)
                && (rightDelimiter === ']' ? count <= rightNumber : count < rightNumber);
        }

        return false;
    };

    /**
     * Returns the plural position to use for the given locale and number.
     *
     * The plural rules are derived from code of the Zend Framework (2010-09-25),
     * which is subject to the new BSD license (http://framework.zend.com/license/new-bsd).
     * Copyright (c) 2005-2010 Zend Technologies USA Inc. (http://www.zend.com)
     *
     * @param {Number} count
     * @param {String} locale
     * @return {Number}
     */
    Lang.prototype._getPluralForm = function(count, locale) {
        switch (locale) {
            case 'az':
            case 'bo':
            case 'dz':
            case 'id':
            case 'ja':
            case 'jv':
            case 'ka':
            case 'km':
            case 'kn':
            case 'ko':
            case 'ms':
            case 'th':
            case 'tr':
            case 'vi':
            case 'zh':
                return 0;

            case 'af':
            case 'bn':
            case 'bg':
            case 'ca':
            case 'da':
            case 'de':
            case 'el':
            case 'en':
            case 'eo':
            case 'es':
            case 'et':
            case 'eu':
            case 'fa':
            case 'fi':
            case 'fo':
            case 'fur':
            case 'fy':
            case 'gl':
            case 'gu':
            case 'ha':
            case 'he':
            case 'hu':
            case 'is':
            case 'it':
            case 'ku':
            case 'lb':
            case 'ml':
            case 'mn':
            case 'mr':
            case 'nah':
            case 'nb':
            case 'ne':
            case 'nl':
            case 'nn':
            case 'no':
            case 'om':
            case 'or':
            case 'pa':
            case 'pap':
            case 'ps':
            case 'pt':
            case 'so':
            case 'sq':
            case 'sv':
            case 'sw':
            case 'ta':
            case 'te':
            case 'tk':
            case 'ur':
            case 'zu':
                return (count == 1)
                    ? 0
                    : 1;

            case 'am':
            case 'bh':
            case 'fil':
            case 'fr':
            case 'gun':
            case 'hi':
            case 'hy':
            case 'ln':
            case 'mg':
            case 'nso':
            case 'xbr':
            case 'ti':
            case 'wa':
                return ((count === 0) || (count === 1))
                    ? 0
                    : 1;

            case 'be':
            case 'bs':
            case 'hr':
            case 'ru':
            case 'sr':
            case 'uk':
                return ((count % 10 == 1) && (count % 100 != 11))
                    ? 0
                    : (((count % 10 >= 2) && (count % 10 <= 4) && ((count % 100 < 10) || (count % 100 >= 20)))
                        ? 1
                        : 2);

            case 'cs':
            case 'sk':
                return (count == 1)
                    ? 0
                    : (((count >= 2) && (count <= 4))
                        ? 1
                        : 2);

            case 'ga':
                return (count == 1)
                    ? 0
                    : ((count == 2)
                        ? 1
                        : 2);

            case 'lt':
                return ((count % 10 == 1) && (count % 100 != 11))
                    ? 0
                    : (((count % 10 >= 2) && ((count % 100 < 10) || (count % 100 >= 20)))
                        ? 1
                        : 2);

            case 'sl':
                return (count % 100 == 1)
                    ? 0
                    : ((count % 100 == 2)
                        ? 1
                        : (((count % 100 == 3) || (count % 100 == 4))
                            ? 2
                            : 3));

            case 'mk':
                return (count % 10 == 1)
                    ? 0
                    : 1;

            case 'mt':
                return (count == 1)
                    ? 0
                    : (((count === 0) || ((count % 100 > 1) && (count % 100 < 11)))
                        ? 1
                        : (((count % 100 > 10) && (count % 100 < 20))
                            ? 2
                            : 3));

            case 'lv':
                return (count === 0)
                    ? 0
                    : (((count % 10 == 1) && (count % 100 != 11))
                        ? 1
                        : 2);

            case 'pl':
                return (count == 1)
                    ? 0
                    : (((count % 10 >= 2) && (count % 10 <= 4) && ((count % 100 < 12) || (count % 100 > 14)))
                        ? 1
                        : 2);

            case 'cy':
                return (count == 1)
                    ? 0
                    : ((count == 2)
                        ? 1
                        : (((count == 8) || (count == 11))
                            ? 2
                            : 3));

            case 'ro':
                return (count == 1)
                    ? 0
                    : (((count === 0) || ((count % 100 > 0) && (count % 100 < 20)))
                        ? 1
                        : 2);

            case 'ar':
                return (count === 0)
                    ? 0
                    : ((count == 1)
                        ? 1
                        : ((count == 2)
                            ? 2
                            : (((count % 100 >= 3) && (count % 100 <= 10))
                                ? 3
                                : (((count % 100 >= 11) && (count % 100 <= 99))
                                    ? 4
                                    : 5))));

            default:
                return 0;
        }
    };

    return Lang;

}));
});

var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();







var _extends = Object.assign || function (target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];

    for (var key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        target[key] = source[key];
      }
    }
  }

  return target;
};



var inherits = function (subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
};











var possibleConstructorReturn = function (self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return call && (typeof call === "object" || typeof call === "function") ? call : self;
};

var TranslationHelper = function (_Lang) {
    inherits(TranslationHelper, _Lang);

    function TranslationHelper(options) {
        classCallCheck(this, TranslationHelper);

        var _this = possibleConstructorReturn(this, (TranslationHelper.__proto__ || Object.getPrototypeOf(TranslationHelper)).call(this, options));

        _this.messages = options.messages;
        return _this;
    }

    // Overwrite _parseKey of lang.js import to remove the need
    // to include locale prefix in translation keys


    createClass(TranslationHelper, [{
        key: '_parseKey',
        value: function _parseKey(key) {
            if (typeof key !== 'string') {
                return null;
            }

            var segments = key.split('.');
            var source = segments[0].replace(/\//g, '.');

            return {
                source: source,
                sourceFallback: source,
                entries: segments.slice(1)
            };
        }
    }]);
    return TranslationHelper;
}(lang);

var Translatable$1 = function (_React$Component) {
    inherits(Translatable, _React$Component);

    function Translatable(props) {
        classCallCheck(this, Translatable);

        var _this = possibleConstructorReturn(this, (Translatable.__proto__ || Object.getPrototypeOf(Translatable)).call(this, props));

        _this.langHelper = new TranslationHelper({
            messages: props.lang
        });
        _this.applyPropsAndContentToChildren = _this.applyPropsAndContentToChildren.bind(_this);
        _this.handleAttributes = _this.handleAttributes.bind(_this);
        _this.handleNestedAttributes = _this.handleNestedAttributes.bind(_this);
        _this.mungeString = _this.mungeString.bind(_this);
        _this.removeUnwantedProps = _this.removeUnwantedProps.bind(_this);
        return _this;
    }

    createClass(Translatable, [{
        key: 'applyPropsAndContentToChildren',
        value: function applyPropsAndContentToChildren(props) {
            var content = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

            return React.Children.map(this.props.children, function (child) {
                var propsToApply = _extends({}, child.props, props);
                for (var key in child.props) {
                    if (props[key]) {
                        if (props[key] instanceof Object) {
                            propsToApply[key] = _extends({}, child.props[key], props[key]);
                        } else if (typeof props[key] === 'string') {
                            propsToApply[key] = child.props[key] + ' ' + props[key];
                        }
                    }
                }
                if (props.nestedAttributes) {
                    for (var _key in child.props) {
                        if (props.nestedAttributes[_key]) {
                            var prop = child.props[_key];
                            if (prop && prop instanceof Object && propsToApply[_key]) {
                                propsToApply[_key] = _extends({}, prop, props[_key]);
                            }
                        }
                    }
                }
                var updatedChild = React.cloneElement(child, propsToApply, content);
                if (child.props.children) {
                    updatedChild = React.cloneElement(child, propsToApply, child.props.children);
                }
                return updatedChild;
            });
        }
    }, {
        key: 'handleAttributes',
        value: function handleAttributes(props) {
            var newProps = _extends({}, props);
            for (var key in newProps.attributes) {
                var attribute = newProps.attributes[key];
                if (attribute) {
                    var transString = this.mungeString(attribute);
                    newProps[key] = transString;
                }
            }
            return newProps;
        }
    }, {
        key: 'handleNestedAttributes',
        value: function handleNestedAttributes(props) {
            var newProps = _extends({}, props);
            for (var key in newProps.nestedAttributes) {
                var nestedAttribute = newProps.nestedAttributes[key];
                if (nestedAttribute) {
                    for (var k in nestedAttribute) {
                        var attribute = nestedAttribute[k];
                        if (attribute) {
                            var transString = this.mungeString(attribute);
                            newProps[key] = {};
                            newProps[key][k] = transString;
                        }
                    }
                }
            }
            return newProps;
        }
    }, {
        key: 'mungeString',
        value: function mungeString(_ref) {
            var transKey = _ref.transKey,
                count = _ref.count,
                replacements = _ref.replacements;

            if (typeof count !== 'undefined' && typeof replacements !== 'undefined') {
                return this.langHelper.choice(transKey, count, replacements);
            } else if (typeof count === 'undefined' && typeof replacements !== 'undefined') {
                if (this.props.handleError) {
                    this.props.handleError({
                        message: 'Replacements were given without the required count property',
                        name: 'No count supplied'
                    });
                } else {
                    throw new Error('Replacements were given without the required count property');
                }
            }
            return this.langHelper.get(transKey);
        }
    }, {
        key: 'removeUnwantedProps',
        value: function removeUnwantedProps() {
            var props = _extends({}, this.props);
            delete props.store;
            delete props.storeSubscription;
            delete props.dispatch;
            delete props.lang;
            return props;
        }
    }, {
        key: 'render',
        value: function render() {
            if (this.props.children && React.Children.count(this.props.children) > 1) {
                if (this.props.handleError) {
                    this.props.handleError({
                        message: 'The Translatable component only allows a single child',
                        name: 'Too many children'
                    });
                } else {
                    throw new Error('The Translatable component only allows a single child');
                }
            }
            var props = this.removeUnwantedProps();
            var content = props.content;
            delete props.content;
            delete props.handleError;
            if (props.className) {
                props.className = 'translatable ' + props.className;
            } else {
                props.className = 'translatable';
            }
            if (props.attributes) {
                props = this.handleAttributes(props);
                delete props.attributes;
            }
            if (props.nestedAttributes) {
                props = this.handleNestedAttributes(props);
            }
            if (this.props.children) {
                delete props.children;
                var children = void 0;
                if (content) {
                    var translatedString = this.mungeString(content);
                    children = this.applyPropsAndContentToChildren(props, translatedString);
                } else {
                    children = this.applyPropsAndContentToChildren(props);
                }
                var component = children[0];
                return React.createElement(component.type, component.props);
            }
            return h(
                'span',
                props,
                this.mungeString(content)
            );
        }
    }]);
    return Translatable;
}(React.Component);

// export { default as withRedux } from './withRedux';

return Translatable$1;

})));
//# sourceMappingURL=reactlang.js.umd.js.map
