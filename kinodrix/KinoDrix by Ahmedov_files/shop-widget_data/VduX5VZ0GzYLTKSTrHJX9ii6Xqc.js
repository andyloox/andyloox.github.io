/* begin: ./quickpay.bemhtml.js */

var nextTick = function () {
	var fns = [],
	    enqueueFn = function enqueueFn(fn) {
		return fns.push(fn) === 1;
	},
	    callFns = function callFns() {
		var fnsToCall = fns,
		    i = 0,
		    len = fns.length;
		fns = [];
		while (i < len) {
			fnsToCall[i++]();
		}
	};

	if (window.setImmediate) {
		// ie10
		return function (fn) {
			enqueueFn(fn) && window.setImmediate(callFns);
		};
	}

	if (window.postMessage && !window.opera) {
		// modern browsers
		var isPostMessageAsync = true;
		if (window.attachEvent) {
			var checkAsync = function checkAsync() {
				isPostMessageAsync = false;
			};
			window.attachEvent('onmessage', checkAsync);
			window.postMessage('__checkAsync', '*');
			window.detachEvent('onmessage', checkAsync);
		}

		if (isPostMessageAsync) {
			var msg = '__modules' + +new Date(),
			    onMessage = function onMessage(e) {
				if (e.data === msg) {
					e.stopPropagation && e.stopPropagation();
					callFns();
				}
			};

			window.addEventListener ? window.addEventListener('message', onMessage, true) : window.attachEvent('onmessage', onMessage);

			return function (fn) {
				enqueueFn(fn) && window.postMessage(msg, '*');
			};
		}
	}

	return function (fn) {
		// old browsers
		enqueueFn(fn) && setTimeout(callFns, 0);
	};
}();
nextTick(function () {
	BEMHTML.compile(function () {

		/* /var/lib/jenkins/workspace/FRONTEND-GEN/frontend/yamoney-frontend-makeupd/release_9.266.0/release_flow/source/node_modules/@yoo/bem-portal-components/common.blocks/b-autocomplete-item/b-autocomplete-item.bemhtml.js: begin */
		block('b-autocomplete-item')(tag()('li'), js()(true), content()(function () {
			var data = this.ctx.data;
			return Array.isArray(data) ? data[1] : data;
		}));
		/*  /var/lib/jenkins/workspace/FRONTEND-GEN/frontend/yamoney-frontend-makeupd/release_9.266.0/release_flow/source/node_modules/@yoo/bem-portal-components/common.blocks/b-autocomplete-item/b-autocomplete-item.bemhtml.js : end */
		/* /var/lib/jenkins/workspace/FRONTEND-GEN/frontend/yamoney-frontend-makeupd/release_9.266.0/release_flow/source/node_modules/@yoo/bem-portal-components/common.blocks/b-autocomplete-item/_type/b-autocomplete-item_type_nav.bemhtml.js: begin */
		block('b-autocomplete-item').mod('type', 'nav').content()(function () {
			return {
				elem: 'link',
				tag: 'a',
				attrs: {
					href: this._url,
					target: '_self'
				},
				content: [{
					elem: 'link-url',
					tag: 'span',
					content: this._linkUrlContent
				}, {
					elem: 'link-info',
					tag: 'span',
					content: this._linkInfoConten
				}]
			};
		});
		/*  /var/lib/jenkins/workspace/FRONTEND-GEN/frontend/yamoney-frontend-makeupd/release_9.266.0/release_flow/source/node_modules/@yoo/bem-portal-components/common.blocks/b-autocomplete-item/_type/b-autocomplete-item_type_nav.bemhtml.js : end */
	});
});
/* end: ./quickpay.bemhtml.js */
/* begin: ./quickpay.js */
/**
 * @module radio-group
 */

modules.define('radio-group', ['i-bem__dom', 'jquery', 'dom', 'radio'], function (provide, BEMDOM, $, dom) {

    var undef;
    /**
     * @exports
     * @class radio-group
     * @bem
     */
    provide(BEMDOM.decl(this.name, /** @lends radio-group.prototype */{
        beforeSetMod: {
            'focused': {
                'true': function _true() {
                    return !this.hasMod('disabled');
                }
            }
        },

        onSetMod: {
            'js': {
                'inited': function inited() {
                    this._checkedRadio = this.findBlockInside({
                        block: 'radio',
                        modName: 'checked',
                        modVal: true
                    });

                    this._inSetVal = false;
                    this._val = this._checkedRadio ? this._checkedRadio.getVal() : undef;
                    this._radios = undef;
                }
            },

            'disabled': function disabled(modName, modVal) {
                this.getRadios().forEach(function (option) {
                    option.setMod(modName, modVal);
                });
            },

            'focused': {
                'true': function _true() {
                    if (dom.containsFocus(this.domElem)) return;

                    var radios = this.getRadios(),
                        i = 0,
                        radio;

                    while (radio = radios[i++]) {
                        if (radio.setMod('focused').hasMod('focused')) {
                            // we need to be sure that radio has got focus
                            return;
                        }
                    }
                },

                '': function _() {
                    var focusedRadio = this.findBlockInside({
                        block: 'radio',
                        modName: 'focused',
                        modVal: true
                    });

                    focusedRadio && focusedRadio.delMod('focused');
                }
            }
        },

        /**
         * Returns control value
         * @returns {String}
         */
        getVal: function getVal() {
            return this._val;
        },

        /**
         * Sets control value
         * @param {String} val value
         * @param {Object} [data] additional data
         * @returns {radio-group} this
         */
        setVal: function setVal(val, data) {
            var isValUndef = val === undef;

            isValUndef || (val = String(val));

            if (this._val !== val) {
                if (isValUndef) {
                    this._val = undef;
                    this._checkedRadio.delMod('checked');
                    this.emit('change', data);
                } else {
                    var radio = this._getRadioByVal(val);
                    if (radio) {
                        this._inSetVal = true;

                        this._val !== undef && this._getRadioByVal(this._val).delMod('checked');
                        this._val = radio.getVal();
                        radio.setMod('checked');

                        this._inSetVal = false;
                        this.emit('change', data);
                    }
                }
            }

            return this;
        },

        /**
         * Returns name of control
         * @returns {String}
         */
        getName: function getName() {
            return this.getRadios()[0].getName();
        },

        /**
         * Returns options
         * @returns {radio[]}
         */
        getRadios: function getRadios() {
            return this._radios || (this._radios = this.findBlocksInside('radio'));
        },

        _getRadioByVal: function _getRadioByVal(val) {
            var radios = this.getRadios(),
                i = 0,
                option;

            while (option = radios[i++]) {
                if (option.getVal() === val) {
                    return option;
                }
            }
        },

        _onRadioCheck: function _onRadioCheck(e) {
            var radioVal = (this._checkedRadio = e.target).getVal();
            if (!this._inSetVal) {
                if (this._val === radioVal) {
                    // on block init value set in constructor, we need remove old checked and emit "change" event
                    this.getRadios().forEach(function (radio) {
                        radio.getVal() !== radioVal && radio.delMod('checked');
                    });
                    this.emit('change');
                } else {
                    this.setVal(radioVal);
                }
            }
        },

        _onRadioFocus: function _onRadioFocus(e) {
            this.setMod('focused', e.target.getMod('focused'));
        }
    }, /** @lends radio-group */{
        live: function live() {
            var ptp = this.prototype;
            this.liveInitOnBlockInsideEvent({ modName: 'checked', modVal: true }, 'radio', ptp._onRadioCheck).liveInitOnBlockInsideEvent({ modName: 'focused', modVal: '*' }, 'radio', ptp._onRadioFocus);
        }
    }));
});
/**
 * @module radio
 */

modules.define('radio', ['i-bem__dom', 'control'], function (provide, BEMDOM, Control) {

    /**
     * @exports
     * @class radio
     * @augments control
     * @bem
     */
    provide(BEMDOM.decl({ block: this.name, baseBlock: Control }, /** @lends radio.prototype */{
        onSetMod: {
            'checked': {
                'true': function _true() {
                    this.elem('control').attr('checked', true).prop('checked', true);
                },
                '': function _() {
                    this.elem('control').removeAttr('checked').prop('checked', false);
                }
            }
        },

        _onChange: function _onChange() {
            this.hasMod('disabled') || this.setMod('checked');
        }
    }, /** @lends radio */{
        live: function live() {
            this.liveBindTo('change', this.prototype._onChange);
            return this.__base.apply(this, arguments);
        }
    }));
});
/**
 * @module button
 */

modules.define('button', function (provide, Button) {

    /**
     * @exports
     * @class button
     * @bem
     */
    provide(Button.decl({ modName: 'togglable' }, /** @lends button.prototype */{
        onSetMod: {
            'checked': function checked(_, modVal) {
                this.__base.apply(this, arguments);
                this.domElem.attr('aria-pressed', !!modVal);
            }
        }
    }));
});
/* eslint-disable */
/**
 * @module formatter
 */
modules.define('formatter', function (provide) {
	// оборачиваем в самовызывающуюся функцию, чтобы в качестве root передавался объект window
	(function () {
		/*!
   * v0.1.5
   * Copyright (c) 2014 First Opinion
   * formatter.js is open sourced under the MIT license.
   *
   * thanks to digitalBush/jquery.maskedinput for some of the trickier
   * keycode handling
   */

		//
		// Uses Node, AMD or browser globals to create a module. This example creates
		// a global even when AMD is used. This is useful if you have some scripts
		// that are loaded by an AMD loader, but they still want access to globals.
		// If you do not need to export a global for the AMD case,
		// see returnExports.js.
		//
		// If you want something that will work in other stricter CommonJS environments,
		// or if you need to create a circular dependency, see commonJsStrictGlobal.js
		//
		// Defines a module "returnExportsGlobal" that depends another module called
		// "b". Note that the name of the module is implied by the file name. It is
		// best if the file name and the exported global have matching names.
		//
		// If the 'b' module also uses this type of boilerplate, then
		// in the browser, it will create a global .b that is used below.
		//
		(function (root, factory) {
			if (typeof define === 'function' && define.amd) {
				// AMD. Register as an anonymous module.
				define([], function () {
					return root.returnExportsGlobal = factory();
				});
			} else if ((typeof exports === 'undefined' ? 'undefined' : babelHelpers.typeof(exports)) === 'object') {
				// Node. Does not work with strict CommonJS, but
				// only CommonJS-like enviroments that support module.exports,
				// like Node.
				module.exports = factory();
			} else {
				root['Formatter'] = factory();
			}
		})(this, function () {
			var userAgent = navigator.userAgent.toLowerCase();
			var isAndroid = userAgent.indexOf('android') !== -1;
			var isChrome = userAgent.indexOf('chrome') !== -1;

			/*
    * pattern.js
    *
    * Utilities to parse str pattern and return info
    *
    */
			var pattern = function () {
				// Define module
				var pattern = {};
				// Match information
				var DELIM_SIZE = 4;
				// Our regex used to parse
				var regexp = new RegExp('{{([^}]+)}}', 'g');
				//
				// Helper method to parse pattern str
				//
				var getMatches = function getMatches(pattern) {
					// Populate array of matches
					var matches = [],
					    match;
					while (match = regexp.exec(pattern)) {
						matches.push(match);
					}
					return matches;
				};
				//
				// Create an object holding all formatted characters
				// with corresponding positions
				//
				pattern.parse = function (pattern) {
					// Our obj to populate
					var info = {
						inpts: {},
						chars: {}
					};
					// Pattern information
					var matches = getMatches(pattern),
					    pLength = pattern.length;
					// Counters
					var mCount = 0,
					    iCount = 0,
					    i = 0;
					// Add inpts, move to end of match, and process
					var processMatch = function processMatch(val) {
						var valLength = val.length;
						for (var j = 0; j < valLength; j++) {
							info.inpts[iCount] = val.charAt(j);
							iCount++;
						}
						mCount++;
						i += val.length + DELIM_SIZE - 1;
					};
					// Process match or add chars
					for (i; i < pLength; i++) {
						if (mCount < matches.length && i === matches[mCount].index) {
							processMatch(matches[mCount][1]);
						} else {
							info.chars[i - mCount * DELIM_SIZE] = pattern.charAt(i);
						}
					}
					// Set mLength and return
					info.mLength = i - mCount * DELIM_SIZE;
					return info;
				};
				// Expose
				return pattern;
			}();
			/*
    * utils.js
    *
    * Independent helper methods (cross browser, etc..)
    *
    */
			var utils = function () {
				// Define module
				var utils = {};
				// Useragent info for keycode handling
				var uAgent = typeof navigator !== 'undefined' ? navigator.userAgent : null;
				//
				// Shallow copy properties from n objects to destObj
				//
				utils.extend = function (destObj) {
					for (var i = 1; i < arguments.length; i++) {
						for (var key in arguments[i]) {
							destObj[key] = arguments[i][key];
						}
					}
					return destObj;
				};
				//
				// Add a given character to a string at a defined pos
				//
				utils.addChars = function (str, chars, pos) {
					return str.substr(0, pos) + chars + str.substr(pos, str.length);
				};
				//
				// Remove a span of characters
				//
				utils.removeChars = function (str, start, end) {
					return str.substr(0, start) + str.substr(end, str.length);
				};
				//
				// Return true/false is num false between bounds
				//
				utils.isBetween = function (num, bounds) {
					bounds.sort(function (a, b) {
						return a - b;
					});
					return num > bounds[0] && num < bounds[1];
				};
				//
				// Helper method for cross browser event listeners
				//
				utils.addListener = function (el, evt, handler) {
					return typeof el.addEventListener !== 'undefined' ? el.addEventListener(evt, handler, false) : el.attachEvent('on' + evt, handler);
				};
				//
				// Helper method for cross browser implementation of preventDefault
				//
				utils.preventDefault = function (evt) {
					return evt.preventDefault ? evt.preventDefault() : evt.returnValue = false;
				};
				//
				// Helper method for cross browser implementation for grabbing
				// clipboard data
				//
				utils.getClip = function (evt) {
					//Chrome on Android has a bug in clipboardData.getData()
					//it always returns an empty sting.
					//https://code.google.com/p/chromium/issues/detail?id=369101
					if (evt.clipboardData && !(isChrome && isAndroid)) {
						return evt.clipboardData.getData('Text');
					}
					if (window.clipboardData) {
						return window.clipboardData.getData('Text');
					}
					return null;
				};
				//
				// Loop over object and checking for matching properties
				//
				utils.getMatchingKey = function (which, keyCode, keys) {
					// Loop over and return if matched.
					for (var k in keys) {
						var key = keys[k];
						if (which === key.which && keyCode === key.keyCode) {
							return k;
						}
					}
				};
				//
				// Returns true/false if k is a del keyDown
				//
				utils.isDelKeyDown = function (which, keyCode) {
					var keys = {
						'backspace': {
							'which': 8,
							'keyCode': 8
						},
						'delete': {
							'which': 46,
							'keyCode': 46
						}
					};
					return utils.getMatchingKey(which, keyCode, keys);
				};
				//
				// Returns true/false if k is a del keyPress
				//
				utils.isDelKeyPress = function (which, keyCode) {
					var keys = {
						'backspace': {
							'which': 8,
							'keyCode': 8,
							'shiftKey': false
						},
						'delete': {
							'which': 0,
							'keyCode': 46
						}
					};
					return utils.getMatchingKey(which, keyCode, keys);
				};
				// //
				// // Determine if keydown relates to specialKey
				// //
				// utils.isSpecialKeyDown = function(which, keyCode) {
				//   var keys = {
				//     'tab': { 'which': 9, 'keyCode': 9 },
				//     'enter': { 'which': 13, 'keyCode': 13 },
				//     'end': { 'which': 35, 'keyCode': 35 },
				//     'home': { 'which': 36, 'keyCode': 36 },
				//     'leftarrow': { 'which': 37, 'keyCode': 37 },
				//     'uparrow': { 'which': 38, 'keyCode': 38 },
				//     'rightarrow': { 'which': 39, 'keyCode': 39 },
				//     'downarrow': { 'which': 40, 'keyCode': 40 },
				//     'F5': { 'which': 116, 'keyCode': 116 }
				//   };
				//   return utils.getMatchingKey(which, keyCode, keys);
				// };
				//
				// Determine if keypress relates to specialKey
				//
				utils.isSpecialKeyPress = function (which, keyCode) {
					var keys = {
						'tab': {
							'which': 0,
							'keyCode': 9
						},
						'enter': {
							'which': 13,
							'keyCode': 13
						},
						'end': {
							'which': 0,
							'keyCode': 35
						},
						'home': {
							'which': 0,
							'keyCode': 36
						},
						'leftarrow': {
							'which': 0,
							'keyCode': 37
						},
						'uparrow': {
							'which': 0,
							'keyCode': 38
						},
						'rightarrow': {
							'which': 0,
							'keyCode': 39
						},
						'downarrow': {
							'which': 0,
							'keyCode': 40
						},
						'F5': {
							'which': 0,
							'keyCode': 116
						}
					};
					return utils.getMatchingKey(which, keyCode, keys);
				};
				//
				// Returns true/false if modifier key is held down
				//
				utils.isModifier = function (evt) {
					return evt.ctrlKey || evt.altKey || evt.metaKey;
				};
				//
				// Iterates over each property of object or array.
				//
				utils.forEach = function (collection, callback, thisArg) {
					if (collection.hasOwnProperty('length')) {
						for (var index = 0, len = collection.length; index < len; index++) {
							if (callback.call(thisArg, collection[index], index, collection) === false) {
								break;
							}
						}
					} else {
						for (var key in collection) {
							if (collection.hasOwnProperty(key)) {
								if (callback.call(thisArg, collection[key], key, collection) === false) {
									break;
								}
							}
						}
					}
				};
				// Expose
				return utils;
			}();
			/*
    * pattern-matcher.js
    *
    * Parses a pattern specification and determines appropriate pattern for an
    * input string
    *
    */
			var patternMatcher = function (pattern, utils) {
				//
				// Parse a matcher string into a RegExp. Accepts valid regular
				// expressions and the catchall '*'.
				// @private
				//
				var parseMatcher = function parseMatcher(matcher) {
					if (matcher === '*') {
						return (/.*/
						);
					}
					return new RegExp(matcher);
				};
				//
				// Parse a pattern spec and return a function that returns a pattern
				// based on user input. The first matching pattern will be chosen.
				// Pattern spec format:
				// Array [
				//  Object: { Matcher(RegExp String) : Pattern(Pattern String) },
				//  ...
				// ]
				function patternMatcher(patternSpec) {
					var matchers = [],
					    patterns = [];
					// Iterate over each pattern in order.
					utils.forEach(patternSpec, function (patternMatcher) {
						// Process single property object to obtain pattern and matcher.
						utils.forEach(patternMatcher, function (patternStr, matcherStr) {
							var parsedPattern = pattern.parse(patternStr),
							    regExpMatcher = parseMatcher(matcherStr);
							matchers.push(regExpMatcher);
							patterns.push(parsedPattern);
							// Stop after one iteration.
							return false;
						});
					});
					var getPattern = function getPattern(input) {
						var matchedIndex;
						utils.forEach(matchers, function (matcher, index) {
							if (matcher.test(input)) {
								matchedIndex = index;
								return false;
							}
						});
						return matchedIndex === undefined ? null : patterns[matchedIndex];
					};
					return {
						getPattern: getPattern,
						patterns: patterns,
						matchers: matchers
					};
				}
				// Expose
				return patternMatcher;
			}(pattern, utils);
			/*
    * inpt-sel.js
    *
    * Cross browser implementation to get and set input selections
    *
    */
			var inptSel = function () {
				// Define module
				var inptSel = {};
				//
				// Get begin and end positions of selected input. Return 0's
				// if there is no selectiion data
				//
				inptSel.get = function (el) {
					// If normal browser return with result
					if (typeof el.selectionStart === 'number') {
						return {
							begin: el.selectionStart,
							end: el.selectionEnd
						};
					}
					// Uh-Oh. We must be IE. Fun with TextRange!!
					var range = document.selection.createRange();
					// Determine if there is a selection
					if (range && range.parentElement() === el) {
						var inputRange = el.createTextRange(),
						    endRange = el.createTextRange(),
						    length = el.value.length;
						// Create a working TextRange for the input selection
						inputRange.moveToBookmark(range.getBookmark());
						// Move endRange begin pos to end pos (hence endRange)
						endRange.collapse(false);
						// If we are at the very end of the input, begin and end
						// must both be the length of the el.value
						if (inputRange.compareEndPoints('StartToEnd', endRange) > -1) {
							return {
								begin: length,
								end: length
							};
						}
						// Note: moveStart usually returns the units moved, which
						// one may think is -length, however, it will stop when it
						// gets to the begin of the range, thus giving us the
						// negative value of the pos.
						return {
							begin: -inputRange.moveStart('character', -length),
							end: -inputRange.moveEnd('character', -length)
						};
					}
					//Return 0's on no selection data
					return {
						begin: 0,
						end: 0
					};
				};
				//
				// Set the caret position at a specified location
				//
				inptSel.set = function (el, pos) {
					// Normalize pos
					if ((typeof pos === 'undefined' ? 'undefined' : babelHelpers.typeof(pos)) !== 'object') {
						pos = {
							begin: pos,
							end: pos
						};
					}
					// If normal browser
					if (el.setSelectionRange) {
						el.focus();
						el.setSelectionRange(pos.begin, pos.end);
					} else if (el.createTextRange) {
						var range = el.createTextRange();
						range.collapse(true);
						range.moveEnd('character', pos.end);
						range.moveStart('character', pos.begin);
						range.select();
					}
				};
				// Expose
				return inptSel;
			}();
			/*
    * formatter.js
    *
    * Class used to format input based on passed pattern
    *
    */
			var formatter = function (patternMatcher, inptSel, utils) {
				// Defaults
				var defaults = {
					persistent: false,
					repeat: false,
					placeholder: ' '
				};
				// Regexs for input validation
				var inptRegs = {
					'9': /[0-9]/,
					'a': /[A-Za-z]/,
					'*': /[A-Za-z0-9]/
				};
				//
				// Class Constructor - Called with new Formatter(el, opts)
				// Responsible for setting up required instance variables, and
				// attaching the event listener to the element.
				//
				function Formatter(el, opts) {
					// Cache this
					var self = this;
					// Make sure we have an element. Make accesible to instance
					self.el = el;
					if (!self.el) {
						throw new TypeError('Must provide an existing element');
					}
					// Merge opts with defaults
					self.opts = utils.extend({}, defaults, opts);
					// 1 pattern is special case
					if (typeof self.opts.pattern !== 'undefined') {
						self.opts.patterns = self._specFromSinglePattern(self.opts.pattern);
						delete self.opts.pattern;
					}
					// Make sure we have valid opts
					if (typeof self.opts.patterns === 'undefined') {
						throw new TypeError('Must provide a pattern or array of patterns');
					}
					self.patternMatcher = patternMatcher(self.opts.patterns);
					// Upate pattern with initial value
					self._updatePattern();
					// Init values
					self.hldrs = {};
					self.focus = 0;
					// Add Listeners
					utils.addListener(self.el, 'keydown', function (evt) {
						self._keyDown(evt);
					});
					utils.addListener(self.el, 'keypress', function (evt) {
						self._keyPress(evt);
					});
					utils.addListener(self.el, 'paste', function (evt) {
						self._paste(evt);
					});
					// Persistence
					if (self.opts.persistent) {
						// Format on start
						self._processKey('', false);
						self.el.blur();
						// Add Listeners
						utils.addListener(self.el, 'focus', function (evt) {
							self._focus(evt);
						});
						utils.addListener(self.el, 'click', function (evt) {
							self._focus(evt);
						});
						utils.addListener(self.el, 'touchstart', function (evt) {
							self._focus(evt);
						});
					}
				}
				//
				// @public
				// Add new char
				//
				Formatter.addInptType = function (chr, reg) {
					inptRegs[chr] = reg;
				};
				//
				// @public
				// Apply the given pattern to the current input without moving caret.
				//
				Formatter.prototype.resetPattern = function (str) {
					// Update opts to hold new pattern
					this.opts.patterns = str ? this._specFromSinglePattern(str) : this.opts.patterns;
					// Get current state
					this.sel = inptSel.get(this.el);
					this.val = this.el.value;
					// Init values
					this.delta = 0;
					// Remove all formatted chars from val
					this._removeChars();
					this.patternMatcher = patternMatcher(this.opts.patterns);
					// Update pattern
					var newPattern = this.patternMatcher.getPattern(this.val);
					this.mLength = newPattern.mLength;
					this.chars = newPattern.chars;
					this.inpts = newPattern.inpts;
					// Format on start
					this._processKey('', false, true);
				};
				//
				// @private
				// Determine correct format pattern based on input val
				//
				Formatter.prototype._updatePattern = function () {
					// Determine appropriate pattern
					var newPattern = this.patternMatcher.getPattern(this.val);
					// Only update the pattern if there is an appropriate pattern for the value.
					// Otherwise, leave the current pattern (and likely delete the latest character.)
					if (newPattern) {
						// Get info about the given pattern
						this.mLength = newPattern.mLength;
						this.chars = newPattern.chars;
						this.inpts = newPattern.inpts;
					}
				};
				//
				// @private
				// Handler called on all keyDown strokes. All keys trigger
				// this handler. Only process delete keys.
				//
				Formatter.prototype._keyDown = function (evt) {
					// The first thing we need is the character code
					var k = evt.which || evt.keyCode;
					// If delete key
					if (k && utils.isDelKeyDown(evt.which, evt.keyCode)) {
						// Process the keyCode and prevent default
						this._processKey(null, k);
						return utils.preventDefault(evt);
					}
				};
				//
				// @private
				// Handler called on all keyPress strokes. Only processes
				// character keys (as long as no modifier key is in use).
				//
				Formatter.prototype._keyPress = function (evt) {
					// The first thing we need is the character code
					var k, isSpecial;
					// Mozilla will trigger on special keys and assign the the value 0
					// We want to use that 0 rather than the keyCode it assigns.
					k = evt.which || evt.keyCode;
					isSpecial = utils.isSpecialKeyPress(evt.which, evt.keyCode);
					// Process the keyCode and prevent default
					if (!utils.isDelKeyPress(evt.which, evt.keyCode) && !isSpecial && !utils.isModifier(evt)) {
						this._processKey(String.fromCharCode(k), false);
						return utils.preventDefault(evt);
					}
				};
				//
				// @private
				// Handler called on paste event.
				//
				Formatter.prototype._paste = function (evt) {
					var clipboardData = utils.getClip(evt);
					if (clipboardData != null) {
						//In case clipboardData is present,
						//process the clipboard paste and prevent default
						this._processKey(clipboardData, false);
						return utils.preventDefault(evt);
					} else {
						//In case clipboardData is null try to format new field value
						var ctx = this;

						window.setTimeout(function () {
							ctx._processKey('', false, true);
						}, 0);
					}
				};
				//
				// @private
				// Handle called on focus event.
				//
				Formatter.prototype._focus = function () {
					// Wrapped in timeout so that we can grab input selection
					var self = this;
					setTimeout(function () {
						// Grab selection
						var selection = inptSel.get(self.el);
						// Char check
						var isAfterStart = selection.end > self.focus,
						    isFirstChar = selection.end === 0;
						// If clicked in front of start, refocus to start
						if (isAfterStart || isFirstChar) {
							inptSel.set(self.el, self.focus);
						}
					}, 0);
				};
				//
				// @private
				// Using the provided key information, alter el value.
				//
				Formatter.prototype._processKey = function (chars, delKey, ignoreCaret) {
					// Get current state
					this.sel = inptSel.get(this.el);
					this.val = this.el.value;
					// Init values
					this.delta = 0;
					// If chars were highlighted, we need to remove them
					if (this.sel.begin !== this.sel.end) {
						this.delta = -1 * Math.abs(this.sel.begin - this.sel.end);
						this.val = utils.removeChars(this.val, this.sel.begin, this.sel.end);
					} else if (delKey && delKey === 46) {
						this._delete();
					} else if (delKey && this.sel.begin - 1 >= 0) {
						// Always have a delta of at least -1 for the character being deleted.
						this.val = utils.removeChars(this.val, this.sel.end - 1, this.sel.end);
						this.delta -= 1;
					} else if (delKey) {
						return true;
					}
					// If the key is not a del key, it should convert to a str
					if (!delKey) {
						// Add char at position and increment delta
						this.val = utils.addChars(this.val, chars, this.sel.begin);
						this.delta += chars.length;
					}
					// Format el.value (also handles updating caret position)
					this._formatValue(ignoreCaret);
				};
				//
				// @private
				// Deletes the character in front of it
				//
				Formatter.prototype._delete = function () {
					// Adjust focus to make sure its not on a formatted char
					while (this.chars[this.sel.begin]) {
						this._nextPos();
					}
					// As long as we are not at the end
					if (this.sel.begin < this.val.length) {
						// We will simulate a delete by moving the caret to the next char
						// and then deleting
						this._nextPos();
						this.val = utils.removeChars(this.val, this.sel.end - 1, this.sel.end);
						this.delta = -1;
					}
				};
				//
				// @private
				// Quick helper method to move the caret to the next pos
				//
				Formatter.prototype._nextPos = function () {
					this.sel.end++;
					this.sel.begin++;
				};
				//
				// @private
				// Alter element value to display characters matching the provided
				// instance pattern. Also responsible for updating
				//
				Formatter.prototype._formatValue = function (ignoreCaret) {
					// Set caret pos
					this.newPos = this.sel.end + this.delta;
					// Remove all formatted chars from val
					this._removeChars();
					// Switch to first matching pattern based on val
					this._updatePattern();
					// Validate inputs
					this._validateInpts();
					// Add formatted characters
					this._addChars();
					// Set value and adhere to maxLength
					this.el.value = this.val.substr(0, this.mLength);
					// Set new caret position
					if (typeof ignoreCaret === 'undefined' || ignoreCaret === false) {
						inptSel.set(this.el, this.newPos);
					}
				};
				//
				// @private
				// Remove all formatted before and after a specified pos
				//
				Formatter.prototype._removeChars = function () {
					// Delta shouldn't include placeholders
					if (this.sel.end > this.focus) {
						this.delta += this.sel.end - this.focus;
					}
					// Account for shifts during removal
					var shift = 0;
					// Loop through all possible char positions
					for (var i = 0; i <= this.mLength; i++) {
						// Get transformed position
						var curChar = this.chars[i],
						    curHldr = this.hldrs[i],
						    pos = i + shift,
						    val;
						// If after selection we need to account for delta
						pos = i >= this.sel.begin ? pos + this.delta : pos;
						val = this.val.charAt(pos);
						// Remove char and account for shift
						if (curChar && curChar === val || curHldr && curHldr === val) {
							this.val = utils.removeChars(this.val, pos, pos + 1);
							shift--;
						}
					}
					// All hldrs should be removed now
					this.hldrs = {};
					// Set focus to last character
					this.focus = this.val.length;
				};
				//
				// @private
				// Make sure all inpts are valid, else remove and update delta
				//
				Formatter.prototype._validateInpts = function () {
					// Loop over each char and validate
					for (var i = 0; i < this.val.length; i++) {
						// Get char inpt type
						var inptType = this.inpts[i];
						// Checks
						var isBadType = !inptRegs[inptType],
						    isInvalid = !isBadType && !inptRegs[inptType].test(this.val.charAt(i)),
						    inBounds = this.inpts[i];
						// Remove if incorrect and inbounds
						if ((isBadType || isInvalid) && inBounds) {
							this.val = utils.removeChars(this.val, i, i + 1);
							this.focusStart--;
							this.newPos--;
							this.delta--;
							i--;
						}
					}
				};
				//
				// @private
				// Loop over val and add formatted chars as necessary
				//
				Formatter.prototype._addChars = function () {
					if (this.opts.persistent) {
						// Loop over all possible characters
						for (var i = 0; i <= this.mLength; i++) {
							if (!this.val.charAt(i)) {
								// Add placeholder at pos
								this.val = utils.addChars(this.val, this.opts.placeholder, i);
								this.hldrs[i] = this.opts.placeholder;
							}
							this._addChar(i);
						}
						// Adjust focus to make sure its not on a formatted char
						while (this.chars[this.focus]) {
							this.focus++;
						}
					} else {
						// Avoid caching val.length, as they may change in _addChar.
						for (var j = 0; j <= this.val.length; j++) {
							// When moving backwards there are some race conditions where we
							// dont want to add the character
							if (this.delta <= 0 && j === this.focus) {
								return true;
							}
							// Place character in current position of the formatted string.
							this._addChar(j);
						}
					}
				};
				//
				// @private
				// Add formattted char at position
				//
				Formatter.prototype._addChar = function (i) {
					// If char exists at position
					var chr = this.chars[i];
					if (!chr) {
						return true;
					}
					// If chars are added in between the old pos and new pos
					// we need to increment pos and delta
					if (utils.isBetween(i, [this.sel.begin - 1, this.newPos + 1])) {
						this.newPos++;
						this.delta++;
					}
					// If character added before focus, incr
					if (i <= this.focus) {
						this.focus++;
					}
					// Updateholder
					if (this.hldrs[i]) {
						delete this.hldrs[i];
						this.hldrs[i + 1] = this.opts.placeholder;
					}
					// Update value
					this.val = utils.addChars(this.val, chr, i);
				};
				//
				// @private
				// Create a patternSpec for passing into patternMatcher that
				// has exactly one catch all pattern.
				//
				Formatter.prototype._specFromSinglePattern = function (patternStr) {
					return [{ '*': patternStr }];
				};
				// Expose
				return Formatter;
			}(patternMatcher, inptSel, utils);

			return formatter;
		});
	})();

	/**
  * Возвращает true, если браузер пользователя совместим с formatter.js
  * @returns {boolean}
  */
	Formatter.isBrowserCompatible = function () {
		var userAgent = navigator.userAgent.toLowerCase();
		var isAndroid = userAgent.indexOf('android') !== -1;
		var isFirefox = userAgent.indexOf('firefox/') !== -1;
		var isChrome = userAgent.indexOf('chrome') !== -1;
		var isIEMobile = userAgent.indexOf('iemobile') !== -1;
		var isWP = userAgent.indexOf('windows phone') !== -1;
		// определяем мажорную версию Chrome
		var chromeVersion = 0;
		if (isChrome) {
			chromeVersion = parseInt(window.navigator.appVersion.match(/Chrome\/(\d+)\./)[1], 10);
		}
		// в Браузере Opera.Mobile Classic не подключаем formatter,
		// из-за бага описанного здесь https://github.com/firstopinion/formatter.js/issues/62
		// + Анализ бага от Леши Чернова:
		// Проблему нашел, но простого решения она не имеет)
		// Дело в том, что в этой опере события клавиатуры срабатывают уже после того, как значение поля было изменено.
		// Следовательно, preventDefault для keypress совершенно не работает 
		// и введенные пользователем данные дублируются.
		// UPD: Также есть баг в хроме:
		// https://code.google.com/p/chromium/issues/detail?id=118639
		// Решили тут поступить, как с Оперой. Подключать formatter.js только в Chrome 38+ 
		// (это касается только андроида).
		// UPD tolochny: Мобильный IE на WP очень неадекватно себя ведёт - 
		// можно вводить любые символы, форматирование начинается
		// если нажать Backspace. Решили отключить.
		//
		// В Firefox на Android отключаем по результатам обсуждения https://jira.yamoney.ru/browse/QWEB-14060
		var isOperaMobile = userAgent.indexOf('opera mobi/') !== -1;

		// Корректное окружение для formatter
		// В некоторых связках formatter себя неправильно ведёт и желательно его не подключать
		var isCorrectEnvForFormatter = !isOperaMobile && !(isAndroid && isFirefox) && !(isAndroid && isChrome && chromeVersion < 38) && !(isIEMobile && isWP);

		return isCorrectEnvForFormatter;
	};

	provide(Formatter);
});
/**
 * @module functions__debounce
 */

modules.define('functions__debounce', function (provide) {

    var global = this.global;

    provide(
    /**
     * Debounces given function
     * @exports
     * @param {Function} fn function to debounce
     * @param {Number} timeout debounce interval
     * @param {Boolean} [invokeAsap=false] invoke before first interval
     * @param {Object} [ctx] context of function invocation
     * @returns {Function} debounced function
     */
    function (fn, timeout, invokeAsap, ctx) {
        if (arguments.length === 3 && typeof invokeAsap !== 'boolean') {
            ctx = invokeAsap;
            invokeAsap = false;
        }

        var timer;
        return function () {
            var args = arguments;
            ctx || (ctx = this);

            invokeAsap && !timer && fn.apply(ctx, args);

            global.clearTimeout(timer);

            timer = global.setTimeout(function () {
                invokeAsap || fn.apply(ctx, args);
                timer = null;
            }, timeout);
        };
    });
});
modules.define('i-request', ['i-bem', 'jquery'], function (provide, BEM, $) {
	var cache = {};

	provide(BEM.decl({ block: 'i-request' }, /** @lends i-request.prototype */{
		onSetMod: {
			js: {
				inited: function inited() {
					this._preventCache = false;
				}
			}
		},

		get: function get(request, onSuccess, onError, params) {
			if (!$.isFunction(onError)) {
				params = onError;
				onError = this.params.onError;
			}

			this._get(request, onSuccess, onError, $.extend({}, this.params, params));

			return this;
		},
		_get: function _get(request, onSuccess, onError, params) {
			var key = this._buildCacheKey(request, params);
			var cacheGroup = cache[params.cacheGroup];

			params.cache && cacheGroup && key in cacheGroup.data ? this.nextTick(function () {
				onSuccess.call(this.params.callbackCtx, cacheGroup.data[key]);
			}, this) : this._do(request, onSuccess, onError, params);
		},


		// eslint-disable-next-line no-unused-vars, no-empty-function
		_do: function _do(request, onSuccess, onError, params) {},
		_onSuccess: function _onSuccess(requestKey, request, data, params) {
			params.cache && !this._preventCache && this.putToCache(params, requestKey, data);
			this._preventCache = false;
		},


		// eslint-disable-next-line no-unused-vars
		_buildCacheKey: function _buildCacheKey(obj, params) {
			return typeof obj === 'string' ? obj : $.param(obj);
		},
		putToCache: function putToCache(params, request, data) {
			var cacheGroup = cache[params.cacheGroup] || (cache[params.cacheGroup] = { keys: [], data: {} });

			if (cacheGroup.keys.length >= params.cacheSize) {
				delete cacheGroup.data[cacheGroup.keys.shift()];
			}

			var key = this._buildCacheKey(request, params);

			cacheGroup.data[key] = data;
			cacheGroup.keys.push(key);
			return this;
		},
		dropCache: function dropCache() {
			delete cache[this.params.cacheGroup];
			return this;
		},
		getDefaultParams: function getDefaultParams() {
			return {
				cache: false,
				cacheGroup: 'default',
				cacheSize: 100,
				callbackCtx: this
			};
		}
	}, {
		_cache: cache
	}));
});
/**
 * Auto initialization on DOM ready
 */

modules.require(['i-bem__dom_init', 'jquery', 'next-tick'], function (init, $, nextTick) {

    $(function () {
        nextTick(init);
    });
});
/**
 * @module widget-shop
 */
modules.define('widget-shop', ['i-bem__dom', 'yamoney-lib', 'jquery'], function (provide, BEMDOM, ymLib, $) {
	/**
  * @exports
  * @class widget-shop
  * @bem
  */
	provide(BEMDOM.decl(this.name,
	/**
  * @lends widget-shop.prototype
  */
	{
		onSetMod: {
			js: function js() {
				/**
     * Блок input ввода суммы
     *
     * @type {BEM}
     * @private
     */
				this._bSum = this.findBlockOn(this.elem('sum-input'), 'input');

				/**
     * Блок выбора типа платежа
     *
     * @type {BEM}
     * @private
     */
				this._bPayments = this.findBlockInside('radio-group');

				/**
     * Минимальная сумма при платеже с карты
     *
     * @private
     */
				this._MIN_SUM_AC = 1.02;

				this._setCustomValidation();
			}
		},

		/**
   * Устанавливает кастомную валидацию
   *
   * @private
   */
		_setCustomValidation: function _setCustomValidation() {
			var _this = this;

			var bSumValidation = this._bSum.findBlockInside('validation');
			bSumValidation.setCustomRule(function () {
				return _this._sumCustomValidation();
			});
		},


		/**
   * Кастомная валидация поля суммы
   *
   * @returns {Promise} промис валидации
   * @private
   */
		_sumCustomValidation: function _sumCustomValidation() {
			var deferred = $.Deferred();

			if (this._sumIsValid()) {
				return deferred.resolve();
			} else {
				this._bSum.showErrorTip({
					content: BEM.I18N('widget-shop', 'widget-shop-small-sum-error'),
					unclosable: 'yes'
				});
				return deferred.reject();
			}
		},


		/**
   * Проверяет значение поля суммы
   *
   * @returns {boolean} boolean
   * @private
   */
		_sumIsValid: function _sumIsValid() {
			if (this._bPayments && this._bPayments.getVal() === 'AC' && ymLib.utils.toNum(this._bSum.getVal(), 0) < this._MIN_SUM_AC) {
				return false;
			}

			return true;
		}
	}));
});
/**
 * @module native-input
 */
modules.define('native-input', ['i-bem__dom'], function (provide, BEMDOM) {
	/**
  * @exports
  * @class @module native-input
  * @bem
  */
	provide(BEMDOM.decl(this.name, /* @lends native-input.prototype */{
		onSetMod: {
			disabled: {
				'*': function _(modName, modVal) {
					this.domElem.attr('disabled', modVal);
				}
			}
		},
		/**
   * Установка/получение значения инпута
   * @param {String} [value] Устанавливаемое значение
   * @public
   * @fires native-input#change
   * @returns {String}
   */
		val: function val(value) {
			var currentValue = this.domElem.val();

			if (typeof value === 'undefined') {
				return currentValue;
			}

			if (value !== currentValue) {
				this.domElem.val(value);
				this.emit('change', value);
			}
		},

		/**
   * Проверяет, находится ли блок в отключенном состоянии.
   * Отключенное состояние характеризуется наличием модификатора `_disabled_yes`.
   *
   * @public
   * @returns {Boolean}
   */
		isDisabled: function isDisabled() {
			return this.hasMod('disabled');
		}
	}));
});
/**
 * @module radio
 */

modules.define('radio', ['button'], function (provide, _, Radio) {

    /**
     * @exports
     * @class radio
     * @bem
     */
    provide(Radio.decl({ modName: 'type', modVal: 'button' }, /** @lends radio.prototype */{
        onSetMod: {
            'js': {
                'inited': function inited() {
                    this.__base.apply(this, arguments);
                    this._button = this.findBlockInside('button').on({ modName: 'checked', modVal: '*' }, proxyModFromButton, this).on({ modName: 'focused', modVal: '*' }, proxyModFromButton, this);
                }
            },

            'checked': proxyModToButton,
            'disabled': proxyModToButton,
            'focused': function focused(modName, modVal) {
                proxyModToButton.call(this, modName, modVal, false);
            }
        }
    }, /** @lends radio */{
        live: function live() {
            this.liveInitOnBlockInsideEvent({ modName: 'js', modVal: 'inited' }, 'button');
            return this.__base.apply(this, arguments);
        }
    }));

    function proxyModToButton(modName, modVal, callBase) {
        callBase !== false && this.__base.apply(this, arguments);
        this._button.setMod(modName, modVal);
    }

    function proxyModFromButton(_, data) {
        this.setMod(data.modName, data.modVal);
    }
});
/**
 * @module visibility
 */
modules.define('visibility', ['i-bem__dom', 'lodash'], function (provide, BEMDOM, _) {
	/**
  * @exports
  * @class visibility
  * @bem
  */
	provide(BEMDOM.decl({
		block: 'visibility',
		modName: 'animate',
		modVal: 'slide'
	}, /** @lends visibility.prototype */{
		/**
   * Переключает режим отображения блока
   *
   * @param {Boolean} [display] True для показа, false - для скрытия
   * @param {Function} [callback] Функция исполняемая после завершения анимации
   *
   * @public
   */
		toggle: function toggle(display, callback) {
			var _this = this;

			var isVisible = _.isBoolean(display) ? display : this.hasMod('hidden', 'yes');

			this.domElem.slideToggle(500, function () {
				_this._toggle(isVisible);
				var hasCallback = _.isFunction(callback);
				hasCallback && callback();
			});
		},


		/**
   * Показывает скрытый блок
   * @public
   */
		show: function show() {
			var _this2 = this;

			this.domElem.slideDown(500, function () {
				_this2._toggle(true);
			});
		},


		/**
   * Прячет блок
   * @public
   */
		hide: function hide() {
			var _this3 = this;

			this.domElem.slideUp(500, function () {
				_this3._toggle(false);
			});
		},


		/**
   * Переключает режим отображения блока
   *
   * @param {Boolean} [display] True для показа, false - для скрытия
   * @private
   */
		_toggle: function _toggle(display) {
			this.toggleMod('hidden', '', 'yes', display);

			// удаляем инлайновые стили, т.е. их приоритет выше, и они перебивают стили модификатора
			this.domElem.removeAttr('style');
		}
	}));
});
modules.define('i-request_type_ajax', ['i-bem', 'jquery', 'i-request'], function (provide, BEM, $, Request) {
	provide(BEM.decl({
		block: this.name,
		modaName: 'type',
		modVal: 'ajax',
		baseBlock: Request
	}, /** @lends i-request.prototype */{
		onSetMod: {
			js: {
				inited: function inited() {
					this.__base();
					this._requestNumber = this._number = this._preventNumber = this._retryCount = 0;
				}
			}
		},

		// eslint-disable-next-line no-unused-vars
		_get: function _get(request, onSuccess, onError, params) {
			this._number++;
			this._requestNumber++;
			this._retryCount = params.retryCount;

			this.__base.apply(this, arguments);
		},
		_do: function _do(request, onSuccess, onError, params) {
			var self = this;
			// Условие на случай, если кто-то синхронно позовет preventCallbacks
			if (self._number > self._preventNumber) {
				var args = arguments;
				var settings = {
					data: params.data ? $.extend({}, params.data, request) : request
				};
				var done = self._wrapCallback(function (respArgs, requestNumber, number) {
					self._onSuccess(self._buildCacheKey(request, params), request, respArgs[0], params);
					self._allowCallback(requestNumber, number) && onSuccess.apply(params.callbackCtx, respArgs);
				});
				var fail = self._wrapCallback(function (respArgs, requestNumber, number) {
					self._allowCallback(requestNumber, number) && (self._retryCount-- > 0 ? setTimeout(function () {
						self._do.apply(self, args);
					}, params.retryInterval) : onError && onError.apply(params.callbackCtx, respArgs));
				});

				$.each(['url', 'dataType', 'timeout', 'type', 'jsonp', 'jsonpCallback', 'xhrFields'].concat(params.paramsToSettings || []), function (i, name) {
					settings[name] = params[name];
				});

				$.ajax(settings).done(done).fail(fail);
			}
		},
		_wrapCallback: function _wrapCallback(callback) {
			var requestNumber = this._requestNumber;
			var number = this._number;

			return function (data) {
				data !== null && callback(arguments, requestNumber, number);
			};
		},
		_allowCallback: function _allowCallback(requestNumber, number) {
			return number > this._preventNumber && this._requestNumber === requestNumber;
		},
		_buildCacheKey: function _buildCacheKey(obj, params) {
			return typeof obj === 'string' ? obj : this.__base(obj) + params.url;
		},
		abort: function abort() {
			this._preventNumber = ++this._number;
		},
		getDefaultParams: function getDefaultParams() {
			return $.extend(this.__base(), {
				cache: true,
				type: 'GET',
				dataType: 'jsonp',
				timeout: 20000,
				retryCount: 0,
				retryInterval: 2000
			});
		}
	}));
});
modules.define('b-autocomplete-item', ['i-bem__dom', 'functions'], function (provide, BEMDOM, functions) {
	provide(BEMDOM.decl({ block: this.name }, /** @lends b-autocomplete-item.prototype */{

		/**
   * Возвращает значение, которое надо вставить в input.
   * @returns {String}
   */
		val: function val() {
			return this.params.val || this.elem('text').text() || this.domElem.text();
		},


		/**
   * Действие на наведение на пункт клавиатурой.
   * Метод должен возвращать false, если подставлять значение пункта не надо.
   *
   * @abstract
   */
		enter: functions.noop,

		/**
   * Действие на выбор пункта.
   * Метод должен возвращать false, если пункт сам сделал все необходимые действия.
   *
   * @abstract
   * @param {Boolean} [byKeyboard] Выбор осуществлен клавиатурой.
   */
		// eslint-disable-next-line no-unused-vars, no-empty-function
		select: function select(byKeyboard) {},
		_onPointerpress: function _onPointerpress() {
			this.setMod('pressed', 'yes').bindToDoc('pointerrelease', this._onPointerrelease);
		},
		_onPointerrelease: function _onPointerrelease() {
			this.delMod('pressed').unbindFromDoc('pointerrelease');
		}
	}, {
		live: function live() {
			this.liveBindTo('pointerpress', function (e) {
				this.hasMod('disabled') || this._onPointerpress(e);
			}).liveBindTo('mouseover mouseout mousedown mouseup pointerover pointerout pointerdown pointerup', function (e) {
				this.emit(e.type);
			});

			return this.__base();
		}
	}));
});
/**
 * @module input
 */
modules.define('input', ['i-bem__dom'], function (provide, BEMDOM) {
	/**
  * @exports
  * @class input
  * @bem
  */
	provide(BEMDOM.decl({ block: this.name, modName: 'type', modVal: 'adulthood' }, /** @lends input.prototype */{
		onSetMod: {
			js: {
				inited: function inited() {
					this.__base.apply(this, arguments);
					this._checkBirthDate();
					// По умолчанию считаем что поле валидно, пока блок валидации не вернул ошибку
					this._isValidAge = true;
				}
			}
		},

		/**
   * Проверка даты рождения
   *
   * @private
   */
		_checkBirthDate: function _checkBirthDate() {
			var _this = this;

			var bValidation = this.bValidation;
			bValidation.on('error', function (e, data) {
				if (data && data.type === 'adulthood') {
					_this._isValidAge = false;
				}
			});
		}
	}));
});
/**
 * @module input
 */
modules.define('input', ['i-bem__dom'], function (provide, BEMDOM) {
	/**
  * @exports
  * @class input
  * @bem
  */
	provide(BEMDOM.decl({ block: 'input', modName: 'type', modVal: 'adulthood' }, /** @lends input.prototype */{

		onSetMod: {
			js: {
				inited: function inited() {
					this.__base.apply(this, arguments);

					this._minAge = this.params.minAge || 18;

					this._bPopup = this.findBlockInside({ block: 'popup', modName: 'target', modVal: 'anchor' });
					this._bIcon = this.findBlockInside({
						block: 'icon',
						modName: 'name',
						modVal: this._minAge + '-year'
					});
					this._bPopup.setAnchor(this._bIcon);

					this._popupVisibilityHandler();
				}
			},
			focused: {
				true: function _true() {
					this.__base.apply(this, arguments);
					this._bPopup.delMod('visible');
				},
				'': function _() {
					this.__base.apply(this, arguments);

					if (this._isValidAge) {
						this._bIcon.setMod('name', this._minAge + '-year');
					} else {
						this._showWarning();
						this._bPopup.delMod('autoclosable');
					}
					// По умолчанию считаем что поле валидно, пока блок валидации не вернул ошибку
					this._isValidAge = true;
				}
			}
		},

		/**
   * Обработчик видимости попапа
   *
   * @private
   */
		_popupVisibilityHandler: function _popupVisibilityHandler() {
			var _this = this;

			this._bIcon.bindTo('click', function () {
				// По умолчанию попап должен быть самозакрывающимся, но при отображении его по событию blur,
				// надо убирать модификатор 'autoclosable' иначе, попап сразу закроется по событию pointerclick
				var hasAutoclosable = _this._bPopup.hasMod('autoclosable', true);
				var isVisible = _this._bPopup.hasMod('visible', true);
				if (!(hasAutoclosable || isVisible)) {
					_this._bPopup.setMod('autoclosable', true);
				}
				_this._bPopup.setMod('visible', true);
			});
		},


		/**
   * Вывод предупреждения
   *
   * @private
   */
		_showWarning: function _showWarning() {
			this._bIcon.setMod('name', this._minAge + '-year-red');
			this._bPopup.setMod('visible', true);
		}
	}));
});
/**
 * @module input
 */
modules.define('input', ['next-tick', 'i-bem__dom'], function (provide, nextTick, BEMDOM) {
	/**
  * @exports
  * @class input
  * @bem
  */
	provide(BEMDOM.decl({ block: this.name, modName: 'float-postfix-hint', modVal: 'yes' }, /** @lends input.prototype */{

		onSetMod: {
			js: {
				inited: function inited() {
					var _this = this;

					this.__base.apply(this, arguments);

					var $control = this.elem('control');
					var $postfixValue = this.elem('float-postfix-hint-value');
					$postfixValue.html(this.getVal());

					this.on('change focus blur', function () {
						$postfixValue.html(_this.getVal());
						// Возможно, что инпут какая-то функция отформатирует, и нужно еще раз проверить значение
						nextTick(function () {
							return $postfixValue.html(_this.getVal());
						});
					});

					var boxWidth = this.elem('box').innerWidth();
					var postfixWidth = this.elem('float-postfix-hint-content').innerWidth();
					$control.css('padding-right', postfixWidth);

					// fallback для не поддерживающих calc
					$postfixValue.css('maxWidth', boxWidth - postfixWidth + 'px');
					$postfixValue.css('maxWidth', 'calc(100% - ' + postfixWidth + 'px)');
				}
			}
		}
	}));
});
/**
 * @module input
 */
modules.define('input', ['lodash', 'basis'], function (provide, _, basis, Input) {
	/**
  * @exports
  * @class input
  * @bem
  */
	provide(Input.decl({ block: this.name, modName: 'filter', modVal: 'yes' }, /** @lends input.prototype */{
		onSetMod: {
			js: {
				inited: function inited() {
					this.__base.apply(this, arguments);

					this._$control = this.elem('control');

					this._filterOnKeypress();
					this._filterOnPaste();
				}
			}
		},

		/**
   * Фильтрует вводимые символы и при наличии флага showErrorTipOnFilter
   * выводит тултип с ошибкой
   *
   * @private
   */
		_filterOnKeypress: function _filterOnKeypress() {
			var _this = this;

			var allowedChars = this._getFilter();

			this._$control.keypress(function (event) {
				var charCode = event.which;
				var character = String.fromCharCode(charCode);

				_this.filterChars(event, allowedChars);

				if (_this.params.showErrorTipOnFilter) {
					if (event.isDefaultPrevented()) {
						var errorTipContent = _this.params.defaultErrorTipContent;

						if (_this.params.errorTips) {
							_this.params.errorTips.forEach(function (errorTip) {
								if (errorTip.letters.includes(character)) {
									errorTipContent = errorTip.errorTipContent;
								}
							});
						}

						_this.nextTick(function () {
							_this.showErrorTip({ content: errorTipContent });
						});
					} else {
						_this.hideErrorTip();
					}
				}
			});
		},


		/**
   * Проверяет, содержится ли в вставленном тексте хотя бы один недопустимый символ, в случае чего
   * при наличии флага showErrorTipOnFilter выводит тултип с ошибкой по умолчанию
   *
   * @private
   */
		_filterOnPaste: function _filterOnPaste() {
			var _this2 = this;

			var allowedChars = this._getFilter();

			this._$control.on('paste', function (event) {
				var clipboardData = _.get(event, 'originalEvent.clipboardData') || window.clipboardData;
				var pastedText = clipboardData && clipboardData.getData && clipboardData.getData('Text');

				if (pastedText) {
					var isEveryCharAllowed = pastedText.split('').every(function (char) {
						return allowedChars.includes(char);
					});

					if (!isEveryCharAllowed) {
						event.preventDefault();
					}

					if (_this2.params.showErrorTipOnFilter) {
						if (isEveryCharAllowed) {
							_this2.hideErrorTip();
						} else {
							_this2.showErrorTip({ content: _this2.params.defaultErrorTipContent });
						}
					}
				}
			});
		},


		/**
   * Получает строку с символами для фильтрации
   *
   * @private
   * @returns {String}
   */
		_getFilter: function _getFilter() {
			var filterParams = this.params.filter;
			var filters = this.__self._filters;

			return Array.isArray(filterParams) ? filterParams.map(function (filter) {
				return filters[filter] || filter;
			}).join('') : filters[filterParams] || filterParams;
		}
	}, /** @lends input */{
		/**
   * Общие настройки фильтров
   *
   * @private
   * @type {Object}
   */
		_filters: basis.filters
	}));
});
/**
 * @module form
 */
modules.define('form', ['i-bem__dom', 'jquery', 'basis', 'lodash', 'suggest-provider'],
// Зависимости нужны для работы саджестов
// eslint-disable-next-line
function (provide, BEMDOM, $, basis, _, SuggestProvider) {
	/**
  * @exports
  * @class form
  * @bem
  */
	provide(BEMDOM.decl({ block: this.name, modName: 'id', modVal: 'confirm' }, /** @lends form.prototype */{
		onSetMod: {
			js: function js() {
				var _this = this;

				this.__base.apply(this, arguments);

				// Изначально сабмит залочен поэтому разлочиваем его при инициализации js
				// (Чиним багу медленного интернета)
				var submitButton = this.findBlockInside({ block: 'button', mods: { type: 'submit' } });
				submitButton.delMod('disabled');

				// Тексты ошибок серверной валидации
				this.serverErrorsData = {
					'firstName': BEM.I18N('personal-info', 'personal-info-first-name-wrong'),
					'snils': BEM.I18N('additional-doc', 'additional-doc-snils-wrong'),
					'inn': BEM.I18N('additional-doc', 'additional-doc-itn-wrong'),
					'oms': BEM.I18N('additional-doc', 'additional-doc-oms-wrong'),
					'lastName': BEM.I18N('personal-info', 'personal-info-second-name-wrong'),
					'docNumber': BEM.I18N('personal-info', 'personal-info-passport-wrong'),
					'docIssueDate': BEM.I18N('personal-info', 'personal-info-issue-date-wrong'),
					'phoneNumber': BEM.I18N('personal-info', 'personal-info-phone-number-wrong-new'),
					'birthDay': BEM.I18N('personal-info', 'personal-info-birth-date-wrong')
				};

				this._goalPrefix = 'quickpay-confirm';

				basis.customYandexMetricsGoal(this._goalPrefix + '-ident-' + (this.params.requiredIdent ? 'yes' : 'no'));
				basis.customYandexMetricsGoal(this._goalPrefix + '-data-' + (this.params.requiredData ? 'yes' : 'no'));

				if (this.params.needAddress) {
					this._handleAddressFields();
				}

				this._handleFormSubmit();

				// Чекбокс копирования данных формы
				this.copyEnabled = this.findBlockInside('checkbox');

				// Если чекбокса нет больше ничего не делаем
				if (!this.copyEnabled) {
					return;
				}

				// Поля идентификации
				this.identInputs = {
					lastName: this._getInputBlock('lastName'),
					firstName: this._getInputBlock('firstName'),
					middleName: this._getInputBlock('middleName'),
					phoneNumber: this._getInputBlock('phoneNumber')
				};

				// Поля дозапроса
				this.additionalInputs = {
					lastName: this._getInputBlock('user-lastname'),
					firstName: this._getInputBlock('user-firstname'),
					middleName: this._getInputBlock('user-fathersname'),
					phoneNumber: this._getInputBlock('user-phone')
				};

				// Названия полей для копирования
				this.copyInputs = Object.keys(this.identInputs);

				this.copyInputs.forEach(function (key) {
					_this._pairInputs(_this.identInputs[key], _this.additionalInputs[key]);
				});

				this._handleCopyCheckbox();
			}
		},

		/**
   * Обработка сабмита формы
   */
		_handleFormSubmit: function _handleFormSubmit() {
			var _this2 = this;

			this.domElem.on('submit', function (e) {
				basis.customYandexMetricsGoal(_this2._goalPrefix + '-submit');

				if (_this2.params.requiredIdent) {
					return;
				}

				if (!_this2.validate()) {
					return;
				}

				var formData = _.pick(_this2.serializeForm(), _this2.params.formParamsList);
				window.location = _this2.params.formAction + '?' + $.param(formData);

				e.preventDefault();
			});
		},


		/**
   * Сопостовление двух инпутов
   * @private
   * @param {BEMDOM} srcInput исходное поле
   * @param {BEMDOM} copyInput поле для копирования
   */
		_pairInputs: function _pairInputs(srcInput, copyInput) {
			var _this3 = this;

			if (!srcInput || !copyInput) {
				return;
			}

			srcInput.on('change', function () {
				if (!_this3.copyEnabled.isChecked()) {
					return;
				}

				_this3._copyValues(srcInput, copyInput);
			});
		},


		/**
   * Копирование между двумя инпутами
   * @private
   * @param {BEMDOM} srcInput исходное поле
   * @param {BEMDOM} copyInput поле для копирования
   */
		_copyValues: function _copyValues(srcInput, copyInput) {
			copyInput.val(srcInput.val());
		},


		/**
   * Обработчик нажатия чекбокса копирования
   * @private
   */
		_handleCopyCheckbox: function _handleCopyCheckbox() {
			var _this4 = this;

			this.copyEnabled.on('change', function () {
				basis.customYandexMetricsGoal(_this4._goalPrefix + '-copy-' + (_this4.copyEnabled.isChecked() ? 'yes' : 'no'));

				_this4.copyInputs.forEach(function (key) {
					var additionalInput = _this4.additionalInputs[key];
					var identInput = _this4.identInputs[key];

					if (!additionalInput || !identInput) {
						return;
					}

					if (_this4.copyEnabled.isChecked()) {
						_this4._copyValues(identInput, additionalInput);
						additionalInput.hideErrorTip();
					}
				});
			});
		},


		/**
   * Обработчик копирования адреса в скрытые поля
   * @return {undefined}
   */
		_handleAddressFields: function _handleAddressFields() {
			var _this5 = this;

			var addressField = this._getInputBlock('user-address');

			if (!addressField) {
				return;
			}

			var inputsToCopy = ['user-city'].map(function (inputName) {
				return _this5._getInputBlock(inputName, 'native-input');
			});

			addressField.on('change', function () {
				inputsToCopy.forEach(function (inputToCopy) {
					_this5._copyValues(addressField, inputToCopy);
				});
			});
		},


		/**
   * Поиск инпута по имени модификатора
   * @private
   * @param  {String} name имя инпута
   * @param  {String} block имя блока для поиска
   * @return {BEMDOM} инпут
   */
		_getInputBlock: function _getInputBlock(name) {
			var block = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'input';

			return this.findBlockInside({
				block: block,
				modName: 'name',
				modVal: name
			});
		},


		/**
   * Логика обработки успешного ответа
   * @param {Object} data ответ AJAX запроса
   * @private
   */
		onResponseSuccess: function onResponseSuccess(data) {
			var status = _.get(data, 'result.status');
			var rejectedStatus = ['technicalError', 'rejected'];
			var hasRejectedStatus = _.includes(rejectedStatus, status);

			if (hasRejectedStatus) {
				this._showErrorMessage();
				return;
			}

			var formAction = this.params.formAction;
			var formData = _.pick(this.serializeForm(), this.params.formParamsList);

			$.post(formAction, Object.assign({}, formData, {
				processIdent: 'complete'
			})).then(function (response) {
				window.location = response.urlToRedirect;
			});
		},


		/**
   * Вывод сообщения с ошибкой
   * @private
   */
		_showErrorMessage: function _showErrorMessage() {
			this._requestId = null;

			var bError = this.findBlockInside(this.elem('error'), 'visibility');
			bError.setMod('hidden', 'no');
		},


		/**
   * Обработка сетевых ошибок
   * @private
   */
		onResponseError: function onResponseError() {
			this._showErrorMessage();
		},


		/**
   * Логика повторной отправки формы
   * @private
   * @param {Object} data ответ AJAX запроса
   */
		onRetry: function onRetry(data) {
			if (!this._requestId) {
				this._requestId = _.get(data, 'result.requestId', '');
			}

			var retryParam = {
				retryParams: {
					requestId: this._requestId,
					processIdent: true,
					userStatusReqId: this._requestId
				}
			};

			this.__base(retryParam);
		}
	}));
});
/**
 * @module input
 */
modules.define('input', ['basis', 'formatter', 'lodash'], function (provide, basis, Formatter, _, Input) {
	/**
  * @exports
  * @class input
  * @bem
  */
	provide(Input.decl({ block: this.name, modName: 'has-mask', modVal: 'yes' }, /** @lends input.prototype */{
		onSetMod: {
			js: {
				inited: function inited() {
					var _this = this;

					this.__base.apply(this, arguments);

					// необходимо для корректной работы события change при использовании форматтера
					this.bindTo('control', 'keyup', function () {
						_this.setVal(_this.elem('control').val());
					});

					this.formatter = this._formatter();
				}
			},
			focused: {
				'true': function _true() {
					this.setVal(this.elem('control').val());
					this.__base.apply(this, arguments);
				}
			}
		},

		/**
   * Инициализация formatter.js http://firstopinion.github.io/formatter.js/
   *
   * @private
   * @returns {Formatter}
   */
		_formatter: function _formatter() {
			if (!Formatter.isBrowserCompatible()) {
				return false;
			}

			var params = this.params;
			var commonFormatterOptions = params.format ? this.__self._formats[params.format] : null;
			var opts = _.extend({ persistent: false }, commonFormatterOptions, params.formatterOptions);

			_.forEach(opts.inputTypes, function (type) {
				Formatter.addInptType(type.char, new RegExp(type.pattern));
			});

			var $control = this.elem('control');

			var formatted = new Formatter($control.get(0), {
				'pattern': opts.pattern,
				'persistent': opts.persistent

			});

			formatted.resetPattern(opts.pattern);

			return formatted;
		}
	}, /** @lends has-mask */{

		/**
   * Общие настройки форматирования
   *
   * @private
   * @type {Object}
   */
		_formats: basis.maskFormats
	}));
});
/**
 * @module input
 */
modules.define('input', ['lodash'], function (provide, _, Input) {
	/**
  * @exports
  * @class input
  * @bem
  */
	provide(Input.decl({ block: this.name, modName: 'international-phone', modVal: 'yes' },
	/** @lends input.prototype **/{
		onSetMod: {
			js: {
				inited: function inited() {
					var _this = this;

					this.__base.apply(this, arguments);
					this._currentPhoneType = 'russian';

					var russianPattern = _.get(this, 'params.formatterOptions.pattern');
					var internationalPattern = _.get(this, 'params.formatterOptions.internationalPattern');

					this.on('change', function () {
						// В форматере есть проверка на совместимость:
						// если браузер не совместим, то не применяется.
						// Данный код нужен чтобы не вызывать форматер когда он не подключен к полю
						if (!(_this.formatter.resetPattern instanceof Function)) {
							return;
						}

						_this._isRussianPhone(_this.getVal()) ? _this._setPattern(russianPattern, 'russian') : _this._setPattern(internationalPattern, 'international');
					});
				}
			}
		},

		/**
   * Проверка типа телефона российский/заграничный
   * @private
   * @param {String} val Номер телефона
   * @returns {Boolean} Это российский телефон
   */
		_isRussianPhone: function _isRussianPhone(val) {
			return !!/^\+7\s?[34589]/.exec(val);
		},


		/**
   * Изменение маски ввода
   * @private
   * @param {String} pattern Маска ввода
   * @param {String} phoneType Новый тип телефона
   */
		_setPattern: function _setPattern(pattern, phoneType) {
			if (phoneType === this._currentPhoneType) {
				return;
			}

			this._currentPhoneType = phoneType;
			this.formatter.resetPattern(pattern);
		}
	}));
});
/**
 * @module input
 */
modules.define('input__dataprovider', ['i-bem', 'i-request_type_ajax'], function (provide, BEM, Request) {
	/**
  * Поставщик данных для саджеста.
  * Элемент реализован как наследник от блока `i-request_type_ajax`.
  */
	provide(BEM.decl({ block: 'input', elem: 'dataprovider', baseBlock: Request }, /** @lends input.prototype */{
		/**
   * Запрашивает подсказки для саджеста.
   *
   * @public
   * @param {String} request Часть текста, для которой нужно запросить данные.
   * @param {inputDataRecieved} callback Метод, который будет вызван после успешного получения данных.
   * @returns {BEM}
   */
		get: function get(request, callback) {
			return this.__base({ part: request }, function (data) {
				callback.call(this, { items: data[1], metainfo: data[2] });
			});
		}
	}));
});

/**
 * @callback inputDataRecieved
 * @param {Object} data Данные ответа.
 * @param {String[]} data.items Подсказки для саджеста.
 * @param {Object} data.metainfo Мета-информация о запросе.
 */
modules.define('b-autocomplete-item', ['i-bem__dom', 'jquery'], function (provide, BEMDOM, $) {
	provide(BEMDOM.decl({ block: 'b-autocomplete-item', modName: 'nav', modVal: 'yes' }, {
		enter: function enter() {
			return false;
		},


		/**
   * Действие на выбор пункта
   * @param {Boolean} [byKeyboard=false] выбор осуществлен клавиатурой
   * @returns {Boolean|Object} [Object.needUpdate] Если возвращается false,
   * значит пункт сам сделал все необходимые действия
   */
		select: function select(byKeyboard) {
			// Открываем ссылку только когда выбрали с помощью клавиатуры, если выбрали мышкой,
			// то сработает обычная ссылка
			byKeyboard && $('<form style="display:none" action="' + this.val() + '" target="_blank"/>').appendTo('body').submit().remove();

			return { needEvent: true };
		}
	}));
}, {
	/**
  * Получить полную ссылку с протоколом
  * @param {String} url Ссылка
  * @returns {String}
  */
	getUrl: function getUrl(url) {
		return (url.match(/^\w[\w-]*:\/\//g) ? '' : 'http://') + url;
	}
});
/**
 * @module input
 */
modules.define('input', ['i-bem__dom'], function (provide, BEMDOM) {
	/**
  * @exports
  * @class input
  * @bem
  */
	provide(BEMDOM.decl({ block: this.name, modName: 'popup-width', modVal: 'auto' }, /** @lends input.prototype */{

		onSetMod: {
			js: function js() {
				this.__base.apply(this, arguments);
			}
		},

		/**
   * Устанавливает ширину popup равной ширине инпута.
   *
   * Переопределение libs\islands-components\common.blocks\input\_suggest\input_suggest_yes.js
   *
   * @private
   */
		_setWidth: function _setWidth() {
			this._getPopup().domElem.css({
				width: this.elem('box').outerWidth(),
				minWidth: 'auto'
			});
		}
	}));
});
/**
 * @module fio-suggest-provider
 */
modules.define('fio-suggest-provider', ['i-bem', 'lodash', 'jquery', 'input__dataprovider'], function (provide, BEM, _, $, Dataprovider) {
	/**
  * @exports
  * @class fio-suggest-provider
  * @bem
  */
	provide(BEM.decl({ block: this.name, baseBlock: Dataprovider },
	/** @lends fio-suggest-provider.prototype */
	{
		/**
   * Запрашивает подсказки для саджеста.
   *
   * @public
   * @param {String} request Часть текста, для которой нужно запросить данные.
   * @param {Function} callback Метод, который будет вызван после успешного получения данных.
   */
		get: function get(request, callback) {
			var _this = this;

			var bDataProvider = _.get(this, 'params.callbackCtx');

			// Начинаем показывать саджесты с четвертого символа
			if (!request || request.length < 4) {
				callback({ items: [] });
				return;
			}

			var queryParams = {
				query: request,
				parts: this.params.type
			};

			if (this._inProcess) {
				this._inProcess.abort();
				this._callback({ items: [] });
			}

			this._callback = callback;

			this._inProcess = $.post(this.params.url, queryParams).done(function (data) {
				// Если юзер успел перейти в другое поле до показа саджестов, то саджесты не показываем.
				if (bDataProvider && !bDataProvider.hasMod('focused')) {
					callback({ items: [] });
					return;
				}
				if (_.get(data, 'error')) {
					callback({ items: [] });
					return;
				}

				var values = _.reduce(data, function (accum, item) {
					accum.push(item.name || item.patronymic || item.surname);
					return accum;
				}, []);

				if (values) {
					callback({ items: values });
					return;
				}

				callback({ items: [] });
			}).fail(function () {
				callback({ items: [] });
			}).always(function () {
				_this._process = false;
			});
		}
	}));
});
/**
 * @module address-suggest-provider
 */
modules.define('address-suggest-provider', ['i-bem', 'jquery', 'input__dataprovider'], function (provide, BEM, $, Dataprovider) {
	/**
  * @exports
  * @class address-suggest-provider
  * @bem
  */
	provide(BEM.decl({ block: this.name, baseBlock: Dataprovider },
	/** @lends address-suggest-provider.prototype */{

		/**
   * Запрашивает подсказки для саджеста.
   *
   * @public
   * @param {String} request Часть текста, для которой нужно запросить данные.
   * @param {Function} callback Метод, который будет вызван после успешного получения данных.
   */
		get: function get(request, callback) {
			var _this = this;

			if (!request) {
				callback({ items: [] });
				return;
			}

			var queryParams = { query: request };

			if (this.params.locations) {
				queryParams.locations = JSON.stringify(this.params.locations);
			}

			if (this._inProcess) {
				this._inProcess.abort();
				this._callback({ items: [] });
			}

			this._callback = callback;

			this._inProcess = $.post(this.params.url, queryParams).done(function (data) {
				if (data && data.error) {
					callback({
						items: [],
						metainfo: data
					});
					return;
				}

				var hasSuggests = data.length > 0;

				if (hasSuggests) {
					callback({
						items: data.map(function (item) {
							return item.value;
						}),
						metadata: { data: data }
					});
					return;
				}

				callback({ items: [] });
			}).fail(function () {
				callback({ items: [] });
			}).always(function () {
				_this._process = false;
			});
		}
	}));
});
/**
 * @module suggest-provider
 */
modules.define('suggest-provider', ['i-bem', 'lodash', 'jquery', 'input__dataprovider'], function (provide, BEM, _, $, Dataprovider) {
	/**
  * @exports
  * @class suggest-provider
  * @bem
  */
	provide(BEM.decl({ block: this.name, baseBlock: Dataprovider },
	/** @lends suggest-provider.prototype */
	{
		onSetMod: {
			js: {
				inited: function inited() {
					/**
      * Дополнительные парметры,
      * отправляемые при запросах
      * @type {Object}
      * @private
      */
					this._EXTRA_REQUEST_PARAMS = {};
					this.setExtraParams(this.params.extraRequestParams);
				}
			}
		},

		/**
   * Позволяет динамически добавлять саджесту
   * дополнительные (например уточняющие) параметры,
   * отправляемые при запросе
   * @param {Object} params доп. параметры отправляемые при запросе
   */
		setExtraParams: function setExtraParams() {
			var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

			Object.assign(this._EXTRA_REQUEST_PARAMS, params);
		},

		/**
   * Запрашивает подсказки для саджеста.
   *
   * @public
   * @param {String} request Часть текста, для которой нужно запросить данные.
   * @param {Function} callback Метод, который будет вызван после успешного получения данных.
   */
		get: function get(request, callback) {
			var _this = this;

			if (!request) {
				callback({ items: [] });
				return;
			}

			var queryParams = Object.assign({
				query: request
			}, this._EXTRA_REQUEST_PARAMS);

			if (this.params.locations) {
				queryParams.locations = JSON.stringify(this.params.locations);
			}

			this.abortCurrentRequest();

			this._callback = callback;

			this._inProcess = $.post(this.params.url, queryParams).done(function (data) {
				if (_.get(data, 'error')) {
					callback({ items: [], metainfo: data });
					return;
				}

				var result = _.map(data, function (item) {
					return _.assign(item, {
						shrinkValue: _this._shrinkValue(item.value, _this.params.maxlength)
					});
				});

				var values = _.map(result, function (item) {
					return {
						valueName: item.shrinkValue
					};
				});

				if (values) {
					if (_this.params['autocomplete-item-type']) {
						var res = data.map(function (item) {
							return [_this.params['autocomplete-item-type'], item.value];
						});
						return callback({ items: res, metainfo: result });
					}
					return callback({ items: ['valueName', values], metainfo: result });
				}

				callback({ items: [] });
			}).fail(function () {
				callback({ items: [] });
			}).always(function () {
				_this._process = false;
			});
		},


		/**
   * Абортит текущий реквест
   */
		abortCurrentRequest: function abortCurrentRequest() {
			if (this._inProcess) {
				this._inProcess.abort();
				this._callback({ items: [] });
			}
		},


		/**
   * Обрезает адрес с конца
   *
   * @private
   * @param {String} value Полная строка адреса
   * @param {Number} maxlength Максимальное количество символов адреса
   * @returns {String}
   */
		_shrinkValue: function _shrinkValue(value) {
			var maxlength = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 65;

			if (value.length > maxlength) {
				return '...' + value.substring(value.length - maxlength, value.length);
			}

			return value;
		}
	}));
});
/**
 * @module input
 */
modules.define('input', ['i-bem', 'i-bem__dom', 'BEMHTML', 'jquery', 'functions__throttle', 'functions__debounce', 'keyboard__codes', 'b-autocomplete-item', 'input__dataprovider'],
// eslint-disable-next-line no-unused-vars
function (provide, BEM, BEMDOM, BEMHTML, $, throttle, debounce, keyCodes, bAutocompleteItem, Dataprovider) {
	/**
  * Поле ввода с саджестом.
  *
  * Саджест представляет из себя выпадающее окно (используется блок popup),
  * в которой размещены варианты саджеста.
  *
  * Саджест появляется во время изменения текста в поле ввода. Вариант в саджесте можно выбрать с помощью
  * мыши или стрелочек вверх/вниз на клавиатуре.
  *
  *
  * Поставщиком данных для саджеста служит элемент `__dataprovider`, который наследует блок
  * `i-request_type_ajax`.
  *
  * @param {Number} [params.debounceDelay=50] Время (в ms), в течении которого при изменении текста не будет
  * выполняться запрос новых данных.
  * @param {Boolean} [params.showListOnFocus=true] Если `true`, то саджест откроется по фокусу на поле ввода,
  * иначе он откроется только при изменении текста.
  * @param {Boolean} [params.updateOnEnter=true] Если `true`, то текст в поле ввода будет дополнятся вариантами,
  * при перемещении по ним стрелочками вверх/вниз.
  * @param {Object} params.dataprovider Параметры для создания поставщика данных.
  * @param {Object} [params.popupMods] Модификаторы для создания блока popup.
  * @param {Object} [params.popupMixs] Миксины для создания блока popup.
  */
	provide(BEMDOM.decl({ block: this.name, modName: 'suggest', modVal: 'yes' }, /** @lends input.prototype */{
		/**
   * Генерируется при запросе данных для саджеста.
   *
   * @event input_suggest_yes#data-requested
   */

		/**
   * Генерируется при получении данных для саджеста.
   *
   * @event input_suggest_yes#data-received
   * @param {Object} data Данные для саджеста.
   */

		/**
   * Генерируется при обновлении саджеста новыми данными.
   *
   * @event input#update-items
   */

		/**
   * Генерируется при выборе варианта из саджеста.
   *
   * @event input#select
   * @param {Object} data Дополнительные данные события.
   * @param {BEMDOM} data.item Блок выбранного элемента саджеста.
   * @param {Boolean} data.byKeyboard `true`, если выбор подсказки произошел с помощью клавиатуры
   * (нажата клавиша Enter).
   */

		onSetMod: {

			js: {
				inited: function inited() {
					/**
      * Флаг, предотвращающий выполнение запросов за новыми данными для саджеста.
      *
      * @private
      * @type {Boolean}
      */
					this._preventRequest = true;

					this.__base.apply(this, arguments);

					/**
      * Последнее значение, введенное пользователем.
      *
      * @private
      * @type {String}
      */
					this._userVal = this.val();

					// Выключаем браузерный саджест
					var focused = this._focused;
					focused && this.delMod('focused');
					this.elem('control').attr('autocomplete', 'off');
					this._preventRequest = false;
					focused && this.setMod('focused');

					/**
      * Массив, содержащий ссылки на блоки подсказок.
      *
      * @private
      * @type {BEMDOM[]}
      */
					this._items = [];

					/**
      * Индекс текущей выделенной подсказки.
      *
      * @private
      * @type {Number}
      */
					this._curItemIndex = -1;

					this._doRequest = debounce(this._doRequest, this.params.debounceDelay);

					this.bindToWin('resize', throttle(this._setWidth, 60));
				}
			},

			focused: {
				true: function _true() {
					this.__base();

					var onChangeFn = this.params.showListOnFocus ? this._onChange() : this._onChange;
					this.on('change', onChangeFn);
				},
				'': function _() {
					// не наследуемся чтобы не тримить значение в инпуте (и как средствие не вызывать еще раз 'change')
					// Скрываем подсказку, если она есть
					this.params.hintMessage && this.hideHintTip();
					this.emit('blur');

					this.un('change', this._onChange)._preventHide || this._getPopup().delMod('visible');
				}
			}
		},

		/**
   * Обработчик уничтожения блока.
   *
   * @protected
   * @returns {BEM}
   */
		destruct: function destruct() {
			var popup = this._popup;
			if (popup && popup.domElem) {
				this._popup = null;
				BEMDOM.destruct(popup.domElem);
			}

			return this.__base.apply(this, arguments);
		},


		/**
   * Возвращает блок-поставщик данных. Создает его при первом обращении.
   *
   * @protected
   * @returns {BEM}
   */
		getDataprovider: function getDataprovider() {
			var url = this.params.dataprovider.url;
			var params = $.extend(this.params.dataprovider, {
				url: url,
				callbackCtx: this
			});

			return this._dataprovider || (this._dataprovider = BEM.create(this.params.dataprovider.name || this.__self.getName() + '__dataprovider', params));
		},


		/**
   * Обработчик события `change`. Вызывает загрузку данных для саджеста.
   * Возвращает сам себя.
   *
   * @private
   * @returns {Function}
   */
		_onChange: function _onChange() {
			this._preventRequest || this._doRequest();
			return this._onChange;
		},


		/**
   * Обработчик нажатий на клавиши при открытом саджесте.
   * Реализует перемещение по подсказкам вверх/вниз.
   *
   * @private
   * @param {$.Event} e DOM-событие нажатия клавиши.
   */
		_onKeyDown: function _onKeyDown(e) {
			var isArrow = e.which === keyCodes.UP || e.which === keyCodes.DOWN;

			if (isArrow && !e.shiftKey) {
				e.preventDefault();
				var len = this._items.length;
				var out = false;
				if (len) {
					var direction = e.which - 39; // Пользуемся особенностями кодов клавиш "вверх"/"вниз" ;-)
					var index = this._curItemIndex;
					var i = 0;

					do {
						// Если выбор перемещается с крайней подсказки вовне списка,
						// то ставим фокус на инпут и возвращаем в него пользовательское значение.
						out = (index === 0 && direction === -1 || index + direction >= len) && this._onLeaveItem(this._items[index], true);

						index += direction;
						if (index < 0) {
							index = len - 1;
						} else if (index >= len) {
							index = 0;
						}
					} while (!out && this._onEnterItem(this._items[index], true) === false && ++i < len);
				}
			}
		},


		/**
   * Обработчик нажатий на символьные клавиши при открытом саджесте.
   * Реализует выбор выделенной подсказки с помощью клавиши Enter.
   *
   * @private
   * @param {DOMEvent} e DOM-событие нажатия клавиши.
   */
		_onKeyPress: function _onKeyPress(e) {
			if (e.which === keyCodes.ENTER && this._curItemIndex > -1 && this._isCurItemEnteredByKeyboard) {
				e.preventDefault();
				this._onSelectItem(this._items[this._curItemIndex], true);
			} else if (e.which === keyCodes.ENTER) {
				this._getPopup().hide();
			}
		},


		/**
   * Возвращает блок popup, используемый для размещения вариантов саджеста.
   * При первом обращении создает блок и устанавливает необходимые обработчики событий.
   *
   * @private
   * @returns {BEMDOM}
   */
		_getPopup: function _getPopup() {
			var self = this;

			if (!self._popup) {
				var block = self.__self.getName();
				var content = [{ elem: 'items', tag: 'ul', mix: [{ block: block, elem: 'popup-items' }] }];
				var popupMix = Array.isArray(self.params.popupMixs) ? self.params.popupMixs : [];
				var popupParams = {};

				self._hasPopupFade() && content.push({ block: block, elem: 'fade' });

				// Пробрасываем пользовательские параметры из js-параметра 'popupParams' в блок 'popup'
				$.extend(popupParams, self.params.popupParams);

				popupMix.push({
					block: block,
					elem: 'popup',
					elemMods: self.params.popupMods,
					js: { uniqId: self._uniqId }
				});

				self._popup = $(BEMHTML.apply({
					block: 'popup',
					mods: {
						target: 'anchor',
						theme: 'islands'
					},
					zIndexGroupLevel: 10,
					mainOffset: 0, // переопределяем mainOffset из _theme_islands, чтобы попап был вплотную к инпуту
					mix: popupMix,
					js: popupParams,
					directions: ['bottom-left'],
					content: {
						elem: 'content',
						content: content
					}
				})).bem('popup').on({
					show: function show() {
						self.bindTo('keypress', self._onKeyPress).bindTo('keydown', self._onKeyDown);
					},
					hide: function hide() {
						self.unbindFrom('keypress keydown')._curItemIndex = -1;
					}
				});

				// При первом создании попапа подписываемся на live-события его элементов
				$.each({
					pointerover: self._onEnterItem,
					pointerout: self._onLeaveItem,
					pointerdown: self._onSelectItem,
					pointerup: self._onItemMouseUp
				}, function (e, fn) {
					// avm@TODO проверить live переопределения в makeupd
					bAutocompleteItem.on(self._popup.domElem, e, function (e) {
						fn.call(self, e.target);
					});
				});

				BEMDOM.init(self._popup.domElem);
			}

			return self._popup;
		},


		/**
   * Возвращает блок popup, используемый для размещения вариантов саджеста.
   *
   * @public
   * @returns {BEMDOM} Блок `popup`.
   */
		getPopup: function getPopup() {
			return this._getPopup();
		},


		/**
   * Проверяет, имеет ли блок `popup` модификатор `popup_fade_yes`.
   *
   * @private
   * @returns {Boolean}
   */
		_hasPopupFade: function _hasPopupFade() {
			return (this.params.popupMods || {}).fade === 'yes';
		},


		/**
   * Обработчик выделения варианта с помощью мыши или клавиатуры.
   *
   * @private
   * @param {BEMDOM} item Блок выделенного варианта.
   * @param {Boolean} byKeyboard `true`, если выделение произошло с помощью клавиатуры.
   * @returns {Boolean|undefined} `false`, если блок не должен принимать выделение.
   */
		_onEnterItem: function _onEnterItem(item, byKeyboard) {
			if (item.hasMod('enterable', 'no')) {
				return false;
			}

			var items = this._items;
			var index = this._curItemIndex;

			index > -1 && items[index].delMod('hovered');
			index = this._getItemIndex(item);
			index > -1 && items[index].setMod('hovered', 'yes');

			this._curItemIndex = index;
			this._isCurItemEnteredByKeyboard = Boolean(byKeyboard);

			if (byKeyboard && this.params.updateOnEnter) {
				this._preventRequest = true;
				this.val(item.enter() === false ? this._userVal : item.val(), { source: 'autocomplete', itemIndex: this._curItemIndex });
				this._preventRequest = false;
			}
		},


		/**
   * Обработчик снятия выделения с варианта. Вызывается, когда
   * с помощью мыши и или клавиатуры был выделен другой вариант.
   *
   * @private
   * @param {BEMDOM} item Блок варианта, с которого снято выделение.
   * @param {Boolean} byKeyboard `true`, если снятие выделения произошло с помощью клавиатуры.
   * @returns {Boolean} Всегда `true`.
   */
		_onLeaveItem: function _onLeaveItem(item, byKeyboard) {
			var index = this._curItemIndex;
			if (index > -1 && index === this._getItemIndex(item)) {
				this._items[index].delMod('hovered');
				this._curItemIndex = -1;
			}

			byKeyboard && this.val(this._userVal);

			return true;
		},


		/**
   * Обработчик выбора варианта. Вызывается по клику или
   * нажатию Enter на выделенном варианте.
   *
   * @private
   * @param {BEMDOM} item Блок выбранного варианта.
   * @param {Boolean} byKeyboard `true`, если выбор подсказки произошел с помощью клавиатуры.
   * (нажата клавиша Enter).
   */
		_onSelectItem: function _onSelectItem(item, byKeyboard) {
			var selectResult = item.select(byKeyboard || false);
			var needUpdate = (typeof selectResult === 'undefined' ? 'undefined' : babelHelpers.typeof(selectResult)) === 'object' ? selectResult.needUpdate : selectResult !== false;
			var needEvent = (typeof selectResult === 'undefined' ? 'undefined' : babelHelpers.typeof(selectResult)) === 'object' && selectResult.needEvent;

			this._preventRequest = true;

			if (needUpdate) {
				this._userVal = item.val();
				this.val(this._userVal, { source: 'autocomplete', itemIndex: this._curItemIndex });
			}

			if (byKeyboard) {
				this._getPopup().delMod('visible');
				this._preventRequest = false;
			} else {
				this.bindToDoc('pointerrelease', this._onDocMouseUp);

				needUpdate || (this._preventHide = true);
				this.nextTick(function () {
					this.setMod('focused');
					this._preventRequest = false;
				});
			}

			(needUpdate || needEvent) && this.emit('select', { item: item, byKeyboard: byKeyboard });
		},
		_onItemMouseUp: function _onItemMouseUp() {
			this._closePopupByMouseUp();
		},
		_onDocMouseUp: function _onDocMouseUp() {
			this._closePopupByMouseUp();
		},
		_closePopupByMouseUp: function _closePopupByMouseUp() {
			this.unbindFromDoc('pointerrelease')._getPopup().delMod('visible');
		},


		/**
   * Возвращает позицию варианта в саджесте.
   *
   * @private
   * @param {BEMDOM} item Блок варианта.
   * @returns {Number}
   */
		_getItemIndex: function _getItemIndex(item) {
			return $.inArray(item, this._items);
		},


		/**
   * Делает запрос за данными и обновляет ими саджест.
   * Генерирует события `data-requested`, `data-recieved`, `unpdate-items` соответственно.
   *
   * @private
   */
		_doRequest: function _doRequest() {
			var self = this;
			self._userVal = self.val();
			self.emit('data-requested').getDataprovider().get(self.val(), function (data) {
				self.emit('data-received', data);

				var popup = self._getPopup();
				var dataItems = data.items || data;

				if (dataItems.length) {
					self._curItemIndex = -1;

					BEMDOM.update(popup.elem('items'), self._buildItemsHtml(dataItems));
					popup.setAnchor(self.elem('box'));
					popup.setMod('visible');
					self._setWidth();

					self._items = popup.findBlocksInside('b-autocomplete-item');
					self.emit('update-items');
				} else {
					popup.delMod('visible');
				}
			});
		},


		/**
   * Устанавливает ширину саджеста равной ширине инпута.
   *
   * @private
   */
		_setWidth: function _setWidth() {
			this._hasPopupFade() && this._getPopup().domElem.css('width', this.elem('box').outerWidth());
		},


		/**
   * Шаблонизирует данные саджеста в html.
   *
   * @private
   * @param  {String[]} data Массив данных саджеста.
   * @returns {String} Выходной html.
   */
		_buildItemsHtml: function _buildItemsHtml(data) {
			return BEMHTML.apply($.map(data, function (data) {
				return {
					block: 'b-autocomplete-item',
					data: data,
					mods: {
						type: $.isArray(data) ? data[0] : 'text'
					}
				};
			}));
		},


		/**
   * Возвращает параметры блока по умолчанию.
   *
   * @protected
   * @returns {Object}
   */
		getDefaultParams: function getDefaultParams() {
			return $.extend(this.__base(), {
				updateOnEnter: true,
				debounceDelay: 50,
				showListOnFocus: true
			});
		}
	}));
});
modules.define('b-autocomplete-item', ['i-bem__dom'], function (provide, BEMDOM) {
	provide(BEMDOM.decl({ block: 'b-autocomplete-item', modName: 'type', modVal: 'nav' }, {
		onSetMod: {
			js: {
				inited: function inited() {
					this.setMod('nav', 'yes');
				}
			}
		},

		/**
   * __base в /_nav/b-autocomplete-item_nav_yes.js
   * @returns {BEM}
   */
		enter: function enter() {
			return this.__base.apply(this, arguments);
		},


		/**
   * Действие на выбор пункта
   * __base в /_nav/b-autocomplete-item_nav_yes.js
   * @returns {BEM}
   */
		select: function select() {
			return this.__base.apply(this, arguments);
		}
	}));
});
/**
 * @module input
 */
modules.define('input', ['BEMHTML', 'keycodes', 'jquery'], function (provide, BEMHTML, keycodes, $, Input) {
	/**
  * @exports
  * @class input
  * @bem
  */
	provide(Input.decl({ block: this.name, modName: 'type', modVal: 'combobox' }, /** @lends input.prototype */{
		onSetMod: {
			js: {
				inited: function inited() {
					this.__base.apply(this, arguments);

					this._toggleState();
					this._afterUpdate();
				}
			}
		},

		/**
   * Добавляет установку модификатора состояния при открытии/закрытии попапа
   *
   * @private
   */
		_toggleState: function _toggleState() {
			var _this = this;

			this._getPopup().on({
				'show': function show() {
					_this.setMod('state', 'opened');
				},
				'hide': function hide() {
					_this.setMod('state', 'closed');
				}
			});
		},


		/**
   * После обновления списка, проверяет на присутствие записей
   * Если записей нет - скрывает попап и устанавливает модификатор на инпут
   * @private
   */
		_afterUpdate: function _afterUpdate() {
			var _this = this;
			var popup = this._getPopup();

			var afterUpdate = function afterUpdate() {
				if (!_this._items.length) {
					_this.setMod('state', 'closed');
					popup.delMod('visible');
				}
			};

			this.on('update-items', afterUpdate);
		},


		/**
   * Получение блока popup
   *
   * Переопределение input_suggest_yes.js
   *
   * В комбобоксе может появиться скролл, по клику на который - закрывается popup
   * в связи с этим нужно немного изменить поведение по mousedown
   *
   * @private
   * @returns {BEM}
   */
		_getPopup: function _getPopup() {
			var bPopup = this.__base.apply(this, arguments);

			var $popup = bPopup.domElem;
			$popup.on('mousedown', function (e) {
				e.preventDefault();
			});

			return bPopup;
		},


		/**
   * Устанавливает ширину саджеста равной ширине инпута.
   *
   * Переопределение input_suggest_yes.js
   * Ширина попапа в input_type_combobox всегда равна ширине инпута
   *
   * @private
   */
		_setWidth: function _setWidth() {
			this._getPopup().domElem.css('width', this.elem('box').outerWidth());
		},


		/**
   * Шаблонизирует данные саджеста в html.
   *
   * Переопределение input_suggest_yes.js
   * Добавлено прокидывание js-параметров в b-autocomplete-item
   *
   * @private
   * @param  {String|Array} data Массив данных саджеста.
   * @returns {String} Выходной html.
   */
		_buildItemsHtml: function _buildItemsHtml(data) {
			var valueKeyName;

			if ($.isArray(data)) {
				// Название ключа, значение которого записывается в value
				valueKeyName = data[0];
				// Массив элементов саджеста
				data = data[1];

				// Наличие записей
				this._items = data;
			}

			// eslint-disable-next-line
			return BEMHTML.apply($.map(data, function (data, i) {
				var isDataArray = $.isArray(data);
				var jsData = {};

				if (valueKeyName && !isDataArray) {
					jsData = data;
					// Значение для записи в value
					data = data[valueKeyName];
					// Значения для записи в js-параметры
					delete jsData[valueKeyName];
				}

				var autocompleteItem = {
					block: 'b-autocomplete-item',
					data: data,
					mods: { type: isDataArray ? data[0] : 'text' },
					js: jsData
				};

				return autocompleteItem;
			}));
		},


		/**
   * Перемещения между элементами списка с добавлением прокрутки блока попапа
   *
   * Переопределение метода из input_suggest_yes.js
   *
   * @param {jQuery.Event} e Событие
   * @private
   */
		_onKeyDown: function _onKeyDown(e) {
			this.__base.apply(this, arguments);
			this._scrollToCurrent(e);
		},


		/**
   * Прокрутка попапа до элемента, который находится за пределами текущей видимости
   *
   * Реализация частично взята из select.js
   *
   * @param {Event} event Jquery Event Object
   * @private
   */
		_scrollToCurrent: function _scrollToCurrent(event) {
			var up = keycodes.checkKey(event, ['UP']);
			var down = keycodes.checkKey(event, ['DOWN']);

			// Ничего не делаем, если это не кнопки вверх/вниз
			if (!up && !down) {
				return;
			}

			var popup = this._getPopup();
			var item = popup.findBlockInside({ block: 'b-autocomplete-item', modName: 'hovered', modVal: 'yes' });
			if (!item || !item.domElem) {
				return;
			}

			var itemDom = item.domElem[0];
			var itemHeight = itemDom.offsetHeight;
			var curOffsetTop = itemDom.offsetTop;
			var popupContent = popup.elem('content');
			var display = curOffsetTop - popupContent.scrollTop();
			var newScrollTop;

			if (display > popupContent.height() - itemHeight) {
				newScrollTop = curOffsetTop - itemHeight;
			} else if (popupContent.scrollTop() && display < itemHeight) {
				newScrollTop = curOffsetTop - popupContent.height() + itemHeight;
			}

			newScrollTop && popupContent.scrollTop(newScrollTop);
		}
	}));
});
/**
 * @module personal-info
 */
modules.define('personal-info', ['fio-suggest-provider', 'address-suggest-provider', 'i-bem__dom'], function (provide, FioSuggestProvider, AddrSuggestProvider, BEMDOM) {
	/**
  * @exports
  * @class personal-info
  * @bem
  */
	provide(BEMDOM.decl({ block: 'personal-info' },
	/**
  * @lends personal-info prototype
  */
	{}));
});
/* end: ./quickpay.js */
/* begin: ./quickpay.lang.all.js */

/* end: ./quickpay.lang.all.js */
/* begin: ./quickpay.lang.ru.js */
if (typeof BEM !== 'undefined' && BEM.I18N) {BEM.I18N.decl('b-page', {
    "about": "О сервисе",
    "error": "Ошибка",
    "error-404": "Ошибка 404",
    "user-cards": "Банковские карты",
    "settings": "Настройки",
    "contacts": "Контакты",
    "virtual-about": "Виртуальная карта ЮMoney",
    "yacard-about": "Банковская карта ЮMoney",
    "default-title": "ЮMoney",
    "insurance-choose-company": "Выберите страховую",
    "portal-addresses": "Список адресов, обслуживаемых на портале",
    "default-og-description": "Платежный сервис: платежи и переводы, банковские карты и электронный кошелек"
}, {
"lang": "ru"
});

BEM.I18N.decl('form', {
    "empty-field": "Вам нужно заполнить это поле",
    "something-failed": "Не получилось",
    "card-topup-sum-commission": function(params) { return "С карты спишется эта сумма плюс комиссия — " + params["commission"] + " %" },
    "card-topup-secure": "Данные защищены по стандарту PCI DSS",
    "card-topup-action-refill": "Пополнить",
    "card-topup-empty-sum": "Укажите сумму, которую нужно зачислить на кошелек.",
    "sum": "Сумма",
    "topup-save-card": "Запомнить карту",
    "topup-to-small-sum": "Это слишком маленькая сумма",
    "topup-free-recharge-tooltip": function(params) { return "Если пополнить кошелёк на " + params["minSum"] + " рублей или больше, комиссии не будет" },
    "topup-commission-prefix": "К оплате ",
    "topup-without-commission": "Мы не берём комиссию, но её может взять ваш банк",
    "topup-additional-bank-commission-warning": "Ваш банк может взять дополнительную комиссию",
    "topup-receiver-limit-exceeded": "Кошелек переполнен, зачислить деньги не получится. Отправьте перевод на банковскую карту",
    "topup-another-cause": "Что-то пошло не так, попробуйте пополнить кошелек другим способом, или на другую сумму",
    "topup-illegal-sum": "Укажите сумму меньше 15 000 рублей. Учтите лимит кошелька: хранить можно максимум 60 тысяч рублей (именной) или 500 тысяч рублей (идентифицированный)",
    "topup-illegal-cvc": "Не верные данные карты",
    "topup-from-card-ac-yacard-message": "Лучше выберите кошелек: при переводе с карты ЮMoney снимется доп. комиссия: 3%, мин. 100 ₽",
    "wrong-format-field": "Вы заполнили поле неправильно. Попробуйте еще раз",
    "light-identification-title": "Добавление персональных данных",
    "light-identification-description": "Для этого платежа по закону нужны данные паспорта РФ. Если вы не можете их указать или у вас нероссийский паспорт, заплатите другим способом.",
    "light-identification-second-name": "Фамилия",
    "light-identification-second-name-empty": "Укажите фамилию как в паспорте",
    "light-identification-second-name-wrong": "Укажите фамилию как в паспорте",
    "light-identification-first-name": "Имя",
    "light-identification-first-name-empty": "Укажите имя как в паспорте",
    "light-identification-first-name-wrong": "Укажите имя как в паспорте",
    "light-identification-middle-name": "Отчество",
    "light-identification-middle-name-wrong": "Укажите отчество как в паспорте",
    "light-identification-birth-date": "Дата рождения",
    "light-identification-birth-date-placeholder": "ДД.ММ.ГГГГ",
    "light-identification-birth-date-empty": "Укажите дату, пожалуйста",
    "light-identification-birth-date-wrong": "Пожалуйста, укажите реальную дату — как в паспорте",
    "light-identification-passport": "Паспорт РФ",
    "light-identification-passport-placeholder": "Серия и номер",
    "light-identification-passport-empty": "Укажите серию и номер паспорта",
    "light-identification-passport-wrong": "Здесь должно быть 10 цифр, без пробелов и других символов. Проверьте, пожалуйста",
    "light-identification-issue-date": "Дата выдачи",
    "light-identification-issue-date-placeholder": "ДД.ММ.ГГГГ",
    "light-identification-issue-date-empty": "Укажите дату выдачи",
    "light-identification-issue-date-wrong": "Что-то не так c датой выдачи паспорта",
    "light-identification-phone-number": "Номер телефона",
    "light-identification-phone": "Телефон",
    "light-identification-phone-number-empty": "Укажите номер телефона",
    "light-identification-phone-number-wrong": "Что-то не так. Проверьте номер телефона",
    "light-identification-birth-date-hint": "Если вам нет 18, данные не пройдут проверку. Заплатите другим способом",
    "receiver-message": "Сообщение получателю",
    "payment-p2p-receiver-email": "Email получателя",
    "payment-p2p-receiver-email-empty": "Пожалуйста, укажите email получателя перевода",
    "payment-p2p-receiver-email-wrong": "С этим адресом что-то не так. Пожалуйста проверьте его",
    "payment-p2p-sender-email": "Ваш email",
    "payment-p2p-sender-email-empty": "Пожалуйста, укажите email. На этот адрес мы отправим информацию о переводе",
    "payment-p2p-sender-email-wrong": "С этим адресом что-то не так. Пожалуйста проверьте его",
    "payment-cps-phone-label": "Номер телефона",
    "payment-cps-phone-hint": "Начните с кода страны.<br/>На этот телефон придет код для платежа",
    "payment-cps-phone-empty": "Пожалуйста, укажите номер своего телефона",
    "payment-cps-phone-wrong": "Здесь что-то не так. Пожалуйста, проверьте этот номер",
    "payment-cash-phone-hint": "Начните с кода страны.<br/>На этот телефон придет код для платежа",
    "payment-sber-phone-hint-offline": "Укажите телефон, подключенный к «Мобильному банку» Сбербанка",
    "payment-sber-phone-hint-online": "Укажите номер своего телефона",
    "payment-sber-pay-method-label": "Оплата с помощью",
    "payment-sber-pay-method-offline": "Подтверждение по смс",
    "payment-sber-pay-method-online": "Сбербанк Онлайн",
    "payment-sber-pay-method-info-offline": function(params) { return "На следующем шаге вы сможете подтвердить оплату по смс через «" + this.keyset("basis").key("func-call", {"pass": "Мобильный банк", "func": params["sberMobileLink"]}) + "» Сбербанка." },
    "payment-sber-pay-method-info-online": "На следующем шаге вы перейдете в Сбербанк Онлайн. Чтобы завершить оплату, войдите под своим логином.",
    "payment-AC-remember-card": "Запомнить карту",
    "wallet-number": "Кошелек, телефон или почта",
    "wallet-empty-error": "Пожалуйста, укажите номер счета, телефон или электронную почту",
    "payment-p2p-protection-code": "Защитить кодом протекции",
    "add-protection-code": function(params) { return "Код " + params["code"] + " на " + params["days"] + " дней" },
    "protection-period-invalid": "Срок действия кода должен быть числом от 1 до 365",
    "change-code": "сменить",
    "payment-p2p-protection-code-hint": "Деньги получит тот, кто знает код — сообщите его отдельно; код сохранится в вашей истории",
    "payment-commission-sum": "Сумма комиссии",
    "payment-p2p-to-my-account": "Мой кошелек",
    "payment-p2p-bind-card": "Запомнить карту",
    "payment-p2p-show-receiver-message": "Добавить сообщение получателю",
    "captcha-response": "Код с картинки",
    "other-phrase": "Обновить картинку",
    "search-tr-text": "Магазин, компания, товар или услуга",
    "search-inner-button": "Найти",
    "shop-offer-link-description": "Нажимая на кнопку «Заплатить», вы соглашаетесь с ",
    "shop-offer-link-text": "условиями сервиса",
    "pin-error-expired": "Код уже не действует",
    "pin-error-already-activated": "Код уже использовали",
    "pin-error-not-found": "Такого кода нет",
    "pin-error-unknown": "Произошла неизвестная ошибка",
    "pin-error-once-more": "Не сработало, нажмите еще раз",
    "pin-error-limit-exceeded": "Вы исчерпали дневной лимит активаций",
    "empty-phone": "Укажите свой телефон",
    "confirm-form-transfer-title": "Данные для перевода",
    "confirm-form-transfer-info": "Эти данные получит человек, которому вы переводите деньги.",
    "confirm-form-transfer-from-me": "Перевод от моего имени",
    "confirm-form-email": "Электронная почта",
    "confirm-form-address": "Адрес",
    "confirm-form-continue": "Продолжить",
    "confirm-form-fio-only-cyrillic": "Здесь нужна кириллица, у вас другая раскладка — поменяйте, пожалуйста",
    "confirm-form-validation-firstname": "Укажите имя человека, за которого отправляете деньги",
    "confirm-form-validation-lastname": "Укажите фамилию человека, за которого отправляете деньги",
    "confirm-form-validation-middlename": "Укажите отчество человека, за которого отправляете деньги",
    "confirm-form-identification-spinner-text": "Минутку, проверяем вашу анкету",
    "confirm-form-personal-phone": "Ваш номер телефона"
}, {
"lang": "ru"
});

BEM.I18N.decl('input', {
    "copy-to-clipboard": "Скопировать",
    "illegal-login-symbol": "Такой логин не подходит. Используйте до 30 символов: латинские буквы, цифры, дефис и точку. Начните логин с буквы и закончите буквой или цифрой. Не ставьте рядом дефис и точку.",
    "invalid-password": "С этим паролем что-то не так. Пожалуйста, попробуйте другой.",
    "invalid-phone-number": "Вы заполнили поле неправильно. Попробуйте еще раз.",
    "nonidentical-passwords": "Пароли не совпадают. Попробуйте еще раз.",
    "passwd-like-login": "Пароль не должен совпадать с логином.",
    "passwd-like-phone-number": "Пароль не должен совпадать с номером телефона.",
    "too-weak-passwd": "Слишком просто. Используйте буквы в разных регистрах, цифры и спецсимволы"
}, {
"lang": "ru"
});

BEM.I18N.decl('page-layout', {
    "confirm-unknown-error-title": "Что-то не так",
    "confirm-unknown-error-text": "Обратитесь к владельцу формы (кнопки) — в запросе некорректные параметры.",
    "confirm-blocked-error-title": "Что-то не так",
    "confirm-blocked-error-text": "Операции для вашего счета приостановлены.",
    "confirm-form-error-title": "Ошибка в коде",
    "confirm-form-error-text": "Обратитесь к владельцу формы (кнопки): нужно исправить значение параметра quickpay-form.",
    "confirm-receiver-error-title": "Ошибка в номере кошелька",
    "confirm-receiver-error-text": "Обратитесь к владельцу формы (кнопки): нужно исправить номер кошелька, который указан в коде.",
    "confirm-referer-error-title": "На этом сайте переводы недоступны",
    "confirm-referer-error-text": function(params) { return "Если вы — владелец формы (кнопки), напишите службе поддержки ЮMoney. В сообщении укажите полный адрес сайта, на котором стоит форма (кнопка).<br/><br/>" + this.keyset("basis").key("func-call", {"pass": "Написать службе поддержки", "func": params["link"]}) },
    "confirm-sum-error-title": "Не указана сумма",
    "confirm-sum-error-text": "Укажите ее самостоятельно или обратитесь к владельцу формы (кнопки).",
    "confirm-money-error-title": "Не хватает денег",
    "confirm-money-error-text": "Пополните свой кошелек или выберите другой способ оплаты.",
    "confirm-money-ac-error-title": "Не получилось",
    "confirm-money-ac-error-text": "За один раз можно заплатить не больше 15 000 рублей. Попробуйте уменьшить сумму.",
    "quickpay-prepaid-account-topup": "Пополнить кошелек",
    "quickpay-need-phone-button": "Привязать телефон",
    "quickpay-need-phone-title": "Телефон для начала",
    "quickpay-need-phone-text": "Привяжите к кошельку мобильный телефон — после этого можно заполнять анкету.",
    "quickpay-need-phone-text-add": "С телефоном можно быстро восстановить доступ, если вы забудете пароль. Еще лучше — перейти на одноразовые смс-коды."
}, {
"lang": "ru"
});

BEM.I18N.decl('personal-info', {
    "personal-info-second-name": "Фамилия",
    "personal-info-second-name-empty": "Укажите фамилию как в паспорте",
    "personal-info-second-name-wrong": "Укажите фамилию как в паспорте",
    "personal-info-first-name": "Имя",
    "personal-info-first-name-empty": "Укажите имя как в паспорте",
    "personal-info-first-name-wrong": "Укажите имя как в паспорте",
    "personal-info-middle-name": "Отчество",
    "personal-info-middle-name-wrong": "Укажите отчество как в паспорте",
    "personal-info-passport": "Паспорт РФ",
    "personal-info-passport-placeholder": "Серия и номер",
    "personal-info-passport-empty": "Заполните поле, пожалуйста",
    "personal-info-issue-date": "Дата выдачи",
    "personal-info-issue-date-placeholder": "ДД.ММ.ГГГГ",
    "personal-info-issue-date-empty": "Укажите дату, пожалуйста",
    "personal-info-issue-date-wrong": "Пожалуйста, укажите реальную дату — как в паспорте",
    "personal-info-phone-number": "Номер телефона",
    "personal-info-phone-number-placeholder": "+7 900 1234567",
    "personal-info-phone-number-empty": "Укажите номер телефона",
    "personal-info-phone-number-wrong": "Что-то не так. Проверьте номер телефона",
    "personal-info-required-doc-issued-by": "Укажите орган, который выдал паспорт",
    "personal-info-required-post-code": "Укажите почтовый индекс",
    "personal-info-required-city": "Укажите город регистрации",
    "personal-info-require-birth-place": "Укажите место рождения",
    "personal-info-require-birth-date": "Укажите дату рождения",
    "personal-info-required-address": "Укажите полный адрес регистрации",
    "personal-info-required-address-hint": "Страна, район или область, город, улица, дом, кв.",
    "personal-info-address-placeholder": "Город, улица, дом, квартира",
    "personal-info-address-label": "Адрес",
    "personal-info-address-heading": "Адрес",
    "personal-info-account": "Номер кошелька",
    "personal-info-passport-issue-place": "Кем выдан паспорт",
    "personal-info-postal-code": "Почтовый индекс",
    "personal-info-postal-code-hint": "По адресу регистрации.",
    "personal-info-city": "Город регистрации",
    "personal-info-birth-place": "Место рождения",
    "personal-info-birth-date": "Дата рождения",
    "personal-info-address": "Полный адрес регистрации",
    "personal-info-nationality": "Гражданство",
    "personal-info-last-name": "Фамилия",
    "personal-info-last-name-empty": "Укажите фамилию как в паспорте",
    "personal-info-last-name-wrong": "Укажите фамилию как в паспорте",
    "personal-info-doc-number": "Серия и номер паспорта РФ",
    "personal-info-doc-number-placeholder": "10 цифр без пробелов",
    "personal-info-doc-number-empty": "Укажите дату серию и номер паспорта",
    "personal-info-doc-number-wrong": "Неверный формат",
    "personal-info-required-doc-issue-date-placeholder": "ДД.ММ.ГГГГ",
    "personal-info-doc-issue-date": "Дата выдачи",
    "personal-info-doc-issue-date-empty": "Укажите дату выдачи",
    "personal-info-doc-issue-date-wrong": "Укажите дату выдачи",
    "personal-info-doc-issuer": "Кем выдан",
    "personal-info-doc-issuer-empty": "Заполните это поле",
    "personal-info-doc-issuer-code": "Код подразделения выпустившего паспорт",
    "personal-info-doc-issuer-code-new": "Код подразделения",
    "personal-info-doc-issuer-code-empty": "Поле не может быть пустым",
    "personal-info-doc-issuer-code-placeholder": "000-000",
    "personal-info-city-empty": "Заполните это поле",
    "personal-info-town": "Город",
    "personal-info-birth-place-empty": "Поле не может быть пустым",
    "personal-info-birth-place-wrong": "Неверный формат",
    "personal-info-birth-date-placeholder": "ДД.ММ.ГГГГ",
    "personal-info-birth-date-empty": "Укажите дату, пожалуйста",
    "personal-info-birth-date-wrong": "Пожалуйста, укажите реальную дату — как в паспорте",
    "personal-info-country-residence": "Страна проживания",
    "personal-info-country-residence-empty": "Поле не может быть пустым",
    "personal-info-region": "Регион",
    "personal-info-region-empty": "Поле не может быть пустым",
    "personal-info-area": "Район регионального значения",
    "personal-info-area-empty": "Поле не может быть пустым",
    "personal-info-subarea": "Район регионального значения",
    "personal-info-street": "Улица",
    "personal-info-street-empty": "Поле не может быть пустым",
    "personal-info-house": "Дом",
    "personal-info-house-empty": "Поле не может быть пустым",
    "personal-info-block": "Номер корпуса, здания, литера",
    "personal-info-block-empty": "Поле не может быть пустым",
    "personal-info-place": "Дом",
    "personal-info-building": "Номер корпуса",
    "personal-info-flat": "Квартира",
    "personal-info-inn": "ИНН",
    "personal-info-inn-placeholder": "12 цифр",
    "personal-info-inn-empty": "Поле не может быть пустым",
    "personal-info-inn-wrong-format": "Неверный формат",
    "personal-info-number-inn": "Номер ИНН",
    "personal-info-popup-itn": function(params) { return "Если вы не знаете свой ИНН, <br/>поможет сайт налоговой: <br/> " + this.keyset("basis").key("func-call", {"pass": "проверить ИНН", "func": params["link"]}) },
    "personal-info-snils": "СНИЛС",
    "personal-info-snils-popup": "Номер на лицевой стороне карточки",
    "personal-info-snils-placeholder": "10 цифр",
    "personal-info-snils-empty": "Поле не может быть пустым",
    "personal-info-snils-wrong-format": "Неверный формат",
    "personal-info-number-snils": "Номер СНИЛС",
    "personal-info-oms": "ОМС",
    "personal-info-oms-placeholder": "16 цифр",
    "personal-info-oms-empty": "Поле не может быть пустым",
    "personal-info-oms-wrong-format": "Неверный формат",
    "personal-info-number-oms": "Номер ОМС",
    "personal-info-popup-oms": "Номер на лицевой стороне полиса",
    "personal-info-document": "Документ",
    "personal-info-number-wrong": function(params) { return "Здесь должно быть " + params["number"] + " цифр. Проверьте, пожалуйста" },
    "personal-info-name-wrong-language": "Здесь нужна кириллица, у вас другая раскладка — поменяйте, пожалуйста",
    "personal-info-passport-new": "Серия и номер паспорта",
    "personal-info-passport-placeholder-new": "12 34 567890",
    "personal-info-passport-wrong": "Здесь должно быть 10 цифр, без пробелов и других символов. Проверьте, пожалуйста",
    "personal-info-postcode-wrong": "Проверьте индекс: похоже, в нём ошибка",
    "personal-info-postcode-wrong-format": "Пожалуйста, введите настоящий индекс",
    "personal-info-phone-number-new": "Мобильный телефон",
    "personal-info-phone-number-wrong-new": "Укажите телефон, пожалуйста",
    "personal-info-birth-date-hint": function(params) { return "Если вы младше 14 лет, эта форма не подходит: нужна " + this.keyset("basis").key("func-call", {"pass": "идентификация", "func": params["link"]}) + "." },
    "personal-info-birth-date-hint-light": function(params) { return "Если вам нет " + params["minAge"] + ", данные не пройдут проверку. Заплатите другим способом" },
    "personal-info-birth-date-hint-payout": function(params) { return "Если вам нет " + params["minAge"] + ", данные не пройдут проверку." },
    "personal-info-second-doc": "Второй документ",
    "personal-info-phone": "Номер телефона"
}, {
"lang": "ru"
});

BEM.I18N.decl('widget-shop', {
    "targets-label": "Назначение платежа",
    "targets-value": "Перевод по кнопке",
    "sum-label": "Сумма",
    "sum-wrongformat": "Неверный формат суммы",
    "sum-too-small": "Это слишком мало (минимум — 2 рубля)",
    "sum-too-big": "Через форму можно отправить максимум 15 000 рублей",
    "currency-label": "руб.",
    "widget-shop-button-text-01": "Оплатить",
    "widget-shop-button-text-02": "Купить",
    "widget-shop-button-text-03": "Перевести",
    "widget-shop-button-text-04": "Подарить",
    "widget-shop-button-text-11": "Перевести",
    "widget-shop-button-text-12": "Отправить",
    "widget-shop-button-text-13": "Подарить",
    "widget-shop-button-text-14": "Пожертвовать",
    "widget-shop-payment-type": "Способ оплаты",
    "widget-shop-empty-field-error": "Пожалуйста, заполните это поле",
    "widget-shop-wrong-sum-error": "Вы указали сумму в неправильном формате",
    "widget-shop-small-sum-error": "Слишком маленькая сумма",
    "widget-shop-button-aria-PC": "Заплатить кошельком",
    "widget-shop-button-aria-AC": "Заплатить картой",
    "widget-shop-button-aria-MC": "Заплатить c баланса мобильного"
}, {
"lang": "ru"
});

BEM.I18N.lang('ru');

}

/* end: ./quickpay.lang.ru.js */