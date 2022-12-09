/* begin: ./bc-common.js */
(function (global) {
	var babelHelpers = global.babelHelpers = {};
	babelHelpers.typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
		return typeof obj;
	} : function (obj) {
		return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
	};

	babelHelpers.jsx = function () {
		var REACT_ELEMENT_TYPE = typeof Symbol === "function" && Symbol.for && Symbol.for("react.element") || 0xeac7;
		return function createRawReactElement(type, props, key, children) {
			var defaultProps = type && type.defaultProps;
			var childrenLength = arguments.length - 3;

			if (!props && childrenLength !== 0) {
				props = {};
			}

			if (props && defaultProps) {
				for (var propName in defaultProps) {
					if (props[propName] === void 0) {
						props[propName] = defaultProps[propName];
					}
				}
			} else if (!props) {
				props = defaultProps || {};
			}

			if (childrenLength === 1) {
				props.children = children;
			} else if (childrenLength > 1) {
				var childArray = Array(childrenLength);

				for (var i = 0; i < childrenLength; i++) {
					childArray[i] = arguments[i + 3];
				}

				props.children = childArray;
			}

			return {
				$$typeof: REACT_ELEMENT_TYPE,
				type: type,
				key: key === undefined ? null : '' + key,
				ref: null,
				props: props,
				_owner: null
			};
		};
	}();

	babelHelpers.asyncIterator = function (iterable) {
		if (typeof Symbol === "function") {
			if (Symbol.asyncIterator) {
				var method = iterable[Symbol.asyncIterator];
				if (method != null) return method.call(iterable);
			}

			if (Symbol.iterator) {
				return iterable[Symbol.iterator]();
			}
		}

		throw new TypeError("Object is not async iterable");
	};

	babelHelpers.asyncGenerator = function () {
		function AwaitValue(value) {
			this.value = value;
		}

		function AsyncGenerator(gen) {
			var front, back;

			function send(key, arg) {
				return new Promise(function (resolve, reject) {
					var request = {
						key: key,
						arg: arg,
						resolve: resolve,
						reject: reject,
						next: null
					};

					if (back) {
						back = back.next = request;
					} else {
						front = back = request;
						resume(key, arg);
					}
				});
			}

			function resume(key, arg) {
				try {
					var result = gen[key](arg);
					var value = result.value;

					if (value instanceof AwaitValue) {
						Promise.resolve(value.value).then(function (arg) {
							resume("next", arg);
						}, function (arg) {
							resume("throw", arg);
						});
					} else {
						settle(result.done ? "return" : "normal", result.value);
					}
				} catch (err) {
					settle("throw", err);
				}
			}

			function settle(type, value) {
				switch (type) {
					case "return":
						front.resolve({
							value: value,
							done: true
						});
						break;

					case "throw":
						front.reject(value);
						break;

					default:
						front.resolve({
							value: value,
							done: false
						});
						break;
				}

				front = front.next;

				if (front) {
					resume(front.key, front.arg);
				} else {
					back = null;
				}
			}

			this._invoke = send;

			if (typeof gen.return !== "function") {
				this.return = undefined;
			}
		}

		if (typeof Symbol === "function" && Symbol.asyncIterator) {
			AsyncGenerator.prototype[Symbol.asyncIterator] = function () {
				return this;
			};
		}

		AsyncGenerator.prototype.next = function (arg) {
			return this._invoke("next", arg);
		};

		AsyncGenerator.prototype.throw = function (arg) {
			return this._invoke("throw", arg);
		};

		AsyncGenerator.prototype.return = function (arg) {
			return this._invoke("return", arg);
		};

		return {
			wrap: function (fn) {
				return function () {
					return new AsyncGenerator(fn.apply(this, arguments));
				};
			},
			await: function (value) {
				return new AwaitValue(value);
			}
		};
	}();

	babelHelpers.asyncGeneratorDelegate = function (inner, awaitWrap) {
		var iter = {},
				waiting = false;

		function pump(key, value) {
			waiting = true;
			value = new Promise(function (resolve) {
				resolve(inner[key](value));
			});
			return {
				done: false,
				value: awaitWrap(value)
			};
		}

		;

		if (typeof Symbol === "function" && Symbol.iterator) {
			iter[Symbol.iterator] = function () {
				return this;
			};
		}

		iter.next = function (value) {
			if (waiting) {
				waiting = false;
				return value;
			}

			return pump("next", value);
		};

		if (typeof inner.throw === "function") {
			iter.throw = function (value) {
				if (waiting) {
					waiting = false;
					throw value;
				}

				return pump("throw", value);
			};
		}

		if (typeof inner.return === "function") {
			iter.return = function (value) {
				return pump("return", value);
			};
		}

		return iter;
	};

	babelHelpers.asyncToGenerator = function (fn) {
		return function () {
			var gen = fn.apply(this, arguments);
			return new Promise(function (resolve, reject) {
				function step(key, arg) {
					try {
						var info = gen[key](arg);
						var value = info.value;
					} catch (error) {
						reject(error);
						return;
					}

					if (info.done) {
						resolve(value);
					} else {
						return Promise.resolve(value).then(function (value) {
							step("next", value);
						}, function (err) {
							step("throw", err);
						});
					}
				}

				return step("next");
			});
		};
	};

	babelHelpers.classCallCheck = function (instance, Constructor) {
		if (!(instance instanceof Constructor)) {
			throw new TypeError("Cannot call a class as a function");
		}
	};

	babelHelpers.createClass = function () {
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

	babelHelpers.defineEnumerableProperties = function (obj, descs) {
		for (var key in descs) {
			var desc = descs[key];
			desc.configurable = desc.enumerable = true;
			if ("value" in desc) desc.writable = true;
			Object.defineProperty(obj, key, desc);
		}

		return obj;
	};

	babelHelpers.defaults = function (obj, defaults) {
		var keys = Object.getOwnPropertyNames(defaults);

		for (var i = 0; i < keys.length; i++) {
			var key = keys[i];
			var value = Object.getOwnPropertyDescriptor(defaults, key);

			if (value && value.configurable && obj[key] === undefined) {
				Object.defineProperty(obj, key, value);
			}
		}

		return obj;
	};

	babelHelpers.defineProperty = function (obj, key, value) {
		if (key in obj) {
			Object.defineProperty(obj, key, {
				value: value,
				enumerable: true,
				configurable: true,
				writable: true
			});
		} else {
			obj[key] = value;
		}

		return obj;
	};

	babelHelpers.extends = Object.assign || function (target) {
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

	babelHelpers.get = function get(object, property, receiver) {
		if (object === null) object = Function.prototype;
		var desc = Object.getOwnPropertyDescriptor(object, property);

		if (desc === undefined) {
			var parent = Object.getPrototypeOf(object);

			if (parent === null) {
				return undefined;
			} else {
				return get(parent, property, receiver);
			}
		} else if ("value" in desc) {
			return desc.value;
		} else {
			var getter = desc.get;

			if (getter === undefined) {
				return undefined;
			}

			return getter.call(receiver);
		}
	};

	babelHelpers.inherits = function (subClass, superClass) {
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

	babelHelpers.instanceof = function (left, right) {
		if (right != null && typeof Symbol !== "undefined" && right[Symbol.hasInstance]) {
			return right[Symbol.hasInstance](left);
		} else {
			return left instanceof right;
		}
	};

	babelHelpers.interopRequireDefault = function (obj) {
		return obj && obj.__esModule ? obj : {
			default: obj
		};
	};

	babelHelpers.interopRequireWildcard = function (obj) {
		if (obj && obj.__esModule) {
			return obj;
		} else {
			var newObj = {};

			if (obj != null) {
				for (var key in obj) {
					if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key];
				}
			}

			newObj.default = obj;
			return newObj;
		}
	};

	babelHelpers.newArrowCheck = function (innerThis, boundThis) {
		if (innerThis !== boundThis) {
			throw new TypeError("Cannot instantiate an arrow function");
		}
	};

	babelHelpers.objectDestructuringEmpty = function (obj) {
		if (obj == null) throw new TypeError("Cannot destructure undefined");
	};

	babelHelpers.objectWithoutProperties = function (obj, keys) {
		var target = {};

		for (var i in obj) {
			if (keys.indexOf(i) >= 0) continue;
			if (!Object.prototype.hasOwnProperty.call(obj, i)) continue;
			target[i] = obj[i];
		}

		return target;
	};

	babelHelpers.possibleConstructorReturn = function (self, call) {
		if (!self) {
			throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
		}

		return call && (typeof call === "object" || typeof call === "function") ? call : self;
	};

	babelHelpers.selfGlobal = typeof global === "undefined" ? self : global;

	babelHelpers.set = function set(object, property, value, receiver) {
		var desc = Object.getOwnPropertyDescriptor(object, property);

		if (desc === undefined) {
			var parent = Object.getPrototypeOf(object);

			if (parent !== null) {
				set(parent, property, value, receiver);
			}
		} else if ("value" in desc && desc.writable) {
			desc.value = value;
		} else {
			var setter = desc.set;

			if (setter !== undefined) {
				setter.call(receiver, value);
			}
		}

		return value;
	};

	babelHelpers.slicedToArray = function () {
		function sliceIterator(arr, i) {
			var _arr = [];
			var _n = true;
			var _d = false;
			var _e = undefined;

			try {
				for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
					_arr.push(_s.value);

					if (i && _arr.length === i) break;
				}
			} catch (err) {
				_d = true;
				_e = err;
			} finally {
				try {
					if (!_n && _i["return"]) _i["return"]();
				} finally {
					if (_d) throw _e;
				}
			}

			return _arr;
		}

		return function (arr, i) {
			if (Array.isArray(arr)) {
				return arr;
			} else if (Symbol.iterator in Object(arr)) {
				return sliceIterator(arr, i);
			} else {
				throw new TypeError("Invalid attempt to destructure non-iterable instance");
			}
		};
	}();

	babelHelpers.slicedToArrayLoose = function (arr, i) {
		if (Array.isArray(arr)) {
			return arr;
		} else if (Symbol.iterator in Object(arr)) {
			var _arr = [];

			for (var _iterator = arr[Symbol.iterator](), _step; !(_step = _iterator.next()).done;) {
				_arr.push(_step.value);

				if (i && _arr.length === i) break;
			}

			return _arr;
		} else {
			throw new TypeError("Invalid attempt to destructure non-iterable instance");
		}
	};

	babelHelpers.taggedTemplateLiteral = function (strings, raw) {
		return Object.freeze(Object.defineProperties(strings, {
			raw: {
				value: Object.freeze(raw)
			}
		}));
	};

	babelHelpers.taggedTemplateLiteralLoose = function (strings, raw) {
		strings.raw = raw;
		return strings;
	};

	babelHelpers.temporalRef = function (val, name, undef) {
		if (val === undef) {
			throw new ReferenceError(name + " is not defined - temporal dead zone");
		} else {
			return val;
		}
	};

	babelHelpers.temporalUndefined = {};

	babelHelpers.toArray = function (arr) {
		return Array.isArray(arr) ? arr : Array.from(arr);
	};

	babelHelpers.toConsumableArray = function (arr) {
		if (Array.isArray(arr)) {
			for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

			return arr2;
		} else {
			return Array.from(arr);
		}
	};
})(typeof global === "undefined" ? self : global);
/**
 * @module i-bem__dom
 */

modules.define('i-bem__dom', ['i-bem', 'i-bem__internal', 'identify', 'objects', 'functions', 'jquery', 'dom'], function (provide, BEM, INTERNAL, identify, objects, functions, $, dom) {

    var undef,
        win = $(window),
        doc = $(document),


    /**
     * Storage for DOM elements by unique key
     * @type Object
     */
    uniqIdToDomElems = {},


    /**
     * Storage for blocks by unique key
     * @type Object
     */
    uniqIdToBlock = {},


    /**
     * Storage for DOM element's parent nodes
     * @type Object
     */
    domNodesToParents = {},


    /**
     * Storage for block parameters
     * @type Object
     */
    domElemToParams = {},


    /**
     * Storage for liveCtx event handlers
     * @type Object
     */
    liveEventCtxStorage = {},


    /**
     * Storage for liveClass event handlers
     * @type Object
     */
    liveClassEventStorage = {},
        blocks = BEM.blocks,
        BEM_CLASS = 'i-bem',
        BEM_SELECTOR = '.' + BEM_CLASS,
        BEM_PARAMS_ATTR = 'data-bem',
        NAME_PATTERN = INTERNAL.NAME_PATTERN,
        MOD_DELIM = INTERNAL.MOD_DELIM,
        ELEM_DELIM = INTERNAL.ELEM_DELIM,
        EXTRACT_MODS_RE = RegExp('[^' + MOD_DELIM + ']' + MOD_DELIM + '(' + NAME_PATTERN + ')' + '(?:' + MOD_DELIM + '(' + NAME_PATTERN + '))?$'),
        buildModPostfix = INTERNAL.buildModPostfix,
        _buildClass = INTERNAL.buildClass,
        reverse = Array.prototype.reverse;

    /**
     * Initializes blocks on a DOM element
     * @param {jQuery} domElem DOM element
     * @param {String} uniqInitId ID of the "initialization wave"
     */
    function initBlocks(domElem, uniqInitId) {
        var domNode = domElem[0],
            params = getParams(domNode),
            blockName;

        for (blockName in params) {
            initBlock(blockName, domElem, processParams(params[blockName], blockName, uniqInitId));
        }
    }

    /**
     * Initializes a specific block on a DOM element, or returns the existing block if it was already created
     * @param {String} blockName Block name
     * @param {jQuery} domElem DOM element
     * @param {Object} [params] Initialization parameters
     * @param {Boolean} [forceLive=false] Force live initialization
     * @param {Function} [callback] Handler to call after complete initialization
     */
    function initBlock(blockName, domElem, params, forceLive, callback) {
        var domNode = domElem[0];

        params || (params = processParams(getBlockParams(domNode, blockName), blockName));

        var uniqId = params.uniqId,
            block = uniqIdToBlock[uniqId];

        if (block) {
            if (block.domElem.index(domNode) < 0) {
                block.domElem = block.domElem.add(domElem);
                objects.extend(block.params, params);
            }

            return block;
        }

        uniqIdToDomElems[uniqId] = uniqIdToDomElems[uniqId] ? uniqIdToDomElems[uniqId].add(domElem) : domElem;

        var parentDomNode = domNode.parentNode;
        if (!parentDomNode || parentDomNode.nodeType === 11) {
            // jquery doesn't unique disconnected node
            $.unique(uniqIdToDomElems[uniqId]);
        }

        var blockClass = blocks[blockName] || DOM.decl(blockName, {}, { live: true }, true);
        if (!(blockClass._liveInitable = !!blockClass._processLive()) || forceLive || params.live === false) {
            forceLive && domElem.addClass(BEM_CLASS); // add css class for preventing memory leaks in further destructing

            block = new blockClass(uniqIdToDomElems[uniqId], params, !!forceLive);

            delete uniqIdToDomElems[uniqId];
            callback && callback.apply(block, Array.prototype.slice.call(arguments, 4));
            return block;
        }
    }

    /**
     * Processes and adds necessary block parameters
     * @param {Object} params Initialization parameters
     * @param {String} blockName Block name
     * @param {String} [uniqInitId] ID of the "initialization wave"
     */
    function processParams(params, blockName, uniqInitId) {
        params.uniqId || (params.uniqId = (params.id ? blockName + '-id-' + params.id : identify()) + (uniqInitId || identify()));

        return params;
    }

    /**
     * Helper for searching for a DOM element using a selector inside the context, including the context itself
     * @param {jQuery} ctx Context
     * @param {String} selector CSS selector
     * @param {Boolean} [excludeSelf=false] Exclude context from search
     * @returns {jQuery}
     */
    function findDomElem(ctx, selector, excludeSelf) {
        var res = ctx.find(selector);
        return excludeSelf ? res : res.add(ctx.filter(selector));
    }

    /**
     * Returns parameters of a block's DOM element
     * @param {HTMLElement} domNode DOM node
     * @returns {Object}
     */
    function getParams(domNode, blockName) {
        var uniqId = identify(domNode);
        return domElemToParams[uniqId] || (domElemToParams[uniqId] = extractParams(domNode));
    }

    /**
     * Returns parameters of a block extracted from DOM node
     * @param {HTMLElement} domNode DOM node
     * @param {String} blockName
     * @returns {Object}
     */

    function getBlockParams(domNode, blockName) {
        var params = getParams(domNode);
        return params[blockName] || (params[blockName] = {});
    }

    /**
     * Retrieves block parameters from a DOM element
     * @param {HTMLElement} domNode DOM node
     * @returns {Object}
     */
    function extractParams(domNode) {
        var attrVal = domNode.getAttribute(BEM_PARAMS_ATTR);
        return attrVal ? JSON.parse(attrVal) : {};
    }

    /**
     * Uncouple DOM node from the block. If this is the last node, then destroys the block.
     * @param {BEMDOM} block block
     * @param {HTMLElement} domNode DOM node
     */
    function removeDomNodeFromBlock(block, domNode) {
        block.domElem.length === 1 ? block._destruct() : block.domElem = block.domElem.not(domNode);
    }

    /**
     * Fills DOM node's parent nodes to the storage
     * @param {jQuery} domElem
     */
    function storeDomNodeParents(domElem) {
        domElem.each(function () {
            domNodesToParents[identify(this)] = this.parentNode;
        });
    }

    /**
     * Returns jQuery collection for provided HTML
     * @param {jQuery|String} html
     * @returns {jQuery}
     */
    function getJqueryCollection(html) {
        return $(typeof html === 'string' ? $.parseHTML(html, null, true) : html);
    }

    var DOM;

    $(function () {

        /**
         * @class BEMDOM
         * @description Base block for creating BEM blocks that have DOM representation
         * @exports
         */

        DOM = BEM.decl('i-bem__dom', /** @lends BEMDOM.prototype */{
            /**
             * @constructor
             * @private
             * @param {jQuery} domElem DOM element that the block is created on
             * @param {Object} params Block parameters
             * @param {Boolean} [initImmediately=true]
             */
            __constructor: function __constructor(domElem, params, initImmediately) {
                /**
                 * DOM elements of block
                 * @member {jQuery}
                 * @readonly
                 */
                this.domElem = domElem;

                /**
                 * Cache for names of events on DOM elements
                 * @member {Object}
                 * @private
                 */
                this._eventNameCache = {};

                /**
                 * Cache for elements
                 * @member {Object}
                 * @private
                 */
                this._elemCache = {};

                /**
                 * @member {String} Unique block ID
                 * @private
                 */
                this._uniqId = params.uniqId;

                uniqIdToBlock[this._uniqId] = this;

                /**
                 * @member {Boolean} Flag for whether it's necessary to unbind from the document and window when destroying the block
                 * @private
                 */
                this._needSpecialUnbind = false;

                this.__base(null, params, initImmediately);
            },

            /**
             * Finds blocks inside the current block or its elements (including context)
             * @param {String|jQuery} [elem] Block element
             * @param {String|Object} block Name or description (block,modName,modVal) of the block to find
             * @returns {BEMDOM[]}
             */
            findBlocksInside: function findBlocksInside(elem, block) {
                return this._findBlocks('find', elem, block);
            },

            /**
             * Finds the first block inside the current block or its elements (including context)
             * @param {String|jQuery} [elem] Block element
             * @param {String|Object} block Name or description (block,modName,modVal) of the block to find
             * @returns {BEMDOM}
             */
            findBlockInside: function findBlockInside(elem, block) {
                return this._findBlocks('find', elem, block, true);
            },

            /**
             * Finds blocks outside the current block or its elements (including context)
             * @param {String|jQuery} [elem] Block element
             * @param {String|Object} block Name or description (block,modName,modVal) of the block to find
             * @returns {BEMDOM[]}
             */
            findBlocksOutside: function findBlocksOutside(elem, block) {
                return this._findBlocks('parents', elem, block);
            },

            /**
             * Finds the first block outside the current block or its elements (including context)
             * @param {String|jQuery} [elem] Block element
             * @param {String|Object} block Name or description (block,modName,modVal) of the block to find
             * @returns {BEMDOM}
             */
            findBlockOutside: function findBlockOutside(elem, block) {
                return this._findBlocks('closest', elem, block)[0] || null;
            },

            /**
             * Finds blocks on DOM elements of the current block or its elements
             * @param {String|jQuery} [elem] Block element
             * @param {String|Object} block Name or description (block,modName,modVal) of the block to find
             * @returns {BEMDOM[]}
             */
            findBlocksOn: function findBlocksOn(elem, block) {
                return this._findBlocks('', elem, block);
            },

            /**
             * Finds the first block on DOM elements of the current block or its elements
             * @param {String|jQuery} [elem] Block element
             * @param {String|Object} block Name or description (block,modName,modVal) of the block to find
             * @returns {BEMDOM}
             */
            findBlockOn: function findBlockOn(elem, block) {
                return this._findBlocks('', elem, block, true);
            },

            _findBlocks: function _findBlocks(select, elem, block, onlyFirst) {
                if (!block) {
                    block = elem;
                    elem = undef;
                }

                var ctxElem = elem ? typeof elem === 'string' ? this.findElem(elem) : elem : this.domElem,
                    isSimpleBlock = typeof block === 'string',
                    blockName = isSimpleBlock ? block : block.block || block.blockName,
                    selector = '.' + (isSimpleBlock ? _buildClass(blockName) : _buildClass(blockName, block.modName, block.modVal)) + (onlyFirst ? ':first' : ''),
                    domElems = ctxElem.filter(selector);

                select && (domElems = domElems.add(ctxElem[select](selector)));

                if (onlyFirst) {
                    return domElems[0] ? initBlock(blockName, domElems.eq(0), undef, true)._init() : null;
                }

                var res = [],
                    uniqIds = {};

                domElems.each(function (i, domElem) {
                    var block = initBlock(blockName, $(domElem), undef, true)._init();
                    if (!uniqIds[block._uniqId]) {
                        uniqIds[block._uniqId] = true;
                        res.push(block);
                    }
                });

                return res;
            },

            /**
             * Adds an event handler for any DOM element
             * @protected
             * @param {jQuery} domElem DOM element where the event will be listened for
             * @param {String|Object} event Event name or event object
             * @param {Object} [data] Additional event data
             * @param {Function} fn Handler function, which will be executed in the block's context
             * @returns {BEMDOM} this
             */
            bindToDomElem: function bindToDomElem(domElem, event, data, fn) {
                if (functions.isFunction(data)) {
                    fn = data;
                    data = undef;
                }

                fn ? domElem.bind(this._buildEventName(event), data, $.proxy(fn, this)) : objects.each(event, function (fn, event) {
                    this.bindToDomElem(domElem, event, data, fn);
                }, this);

                return this;
            },

            /**
             * Adds an event handler to the document
             * @protected
             * @param {String|Object} event Event name or event object
             * @param {Object} [data] Additional event data
             * @param {Function} fn Handler function, which will be executed in the block's context
             * @returns {BEMDOM} this
             */
            bindToDoc: function bindToDoc(event, data, fn) {
                this._needSpecialUnbind = true;
                return this.bindToDomElem(doc, event, data, fn);
            },

            /**
             * Adds an event handler to the window
             * @protected
             * @param {String|Object} event Event name or event object
             * @param {Object} [data] Additional event data
             * @param {Function} fn Handler function, which will be executed in the block's context
             * @returns {BEMDOM} this
             */
            bindToWin: function bindToWin(event, data, fn) {
                this._needSpecialUnbind = true;
                return this.bindToDomElem(win, event, data, fn);
            },

            /**
             * Adds an event handler to the block's main DOM elements or its nested elements
             * @protected
             * @param {jQuery|String} [elem] Element
             * @param {String|Object} event Event name or event object
             * @param {Object} [data] Additional event data
             * @param {Function} fn Handler function, which will be executed in the block's context
             * @returns {BEMDOM} this
             */
            bindTo: function bindTo(elem, event, data, fn) {
                var len = arguments.length;
                if (len === 3) {
                    if (functions.isFunction(data)) {
                        fn = data;
                        if ((typeof event === 'undefined' ? 'undefined' : babelHelpers.typeof(event)) === 'object') {
                            data = event;
                            event = elem;
                            elem = this.domElem;
                        }
                    }
                } else if (len === 2) {
                    if (functions.isFunction(event)) {
                        fn = event;
                        event = elem;
                        elem = this.domElem;
                    } else if (!(typeof elem === 'string' || elem instanceof $)) {
                        data = event;
                        event = elem;
                        elem = this.domElem;
                    }
                } else if (len === 1) {
                    event = elem;
                    elem = this.domElem;
                }

                typeof elem === 'string' && (elem = this.elem(elem));

                return this.bindToDomElem(elem, event, data, fn);
            },

            /**
             * Removes event handlers from any DOM element
             * @protected
             * @param {jQuery} domElem DOM element where the event was being listened for
             * @param {String|Object} event Event name or event object
             * @param {Function} [fn] Handler function
             * @returns {BEMDOM} this
             */
            unbindFromDomElem: function unbindFromDomElem(domElem, event, fn) {
                if (typeof event === 'string') {
                    event = this._buildEventName(event);
                    fn ? domElem.unbind(event, fn) : domElem.unbind(event);
                } else {
                    objects.each(event, function (fn, event) {
                        this.unbindFromDomElem(domElem, event, fn);
                    }, this);
                }

                return this;
            },

            /**
             * Removes event handler from document
             * @protected
             * @param {String|Object} event Event name or event object
             * @param {Function} [fn] Handler function
             * @returns {BEMDOM} this
             */
            unbindFromDoc: function unbindFromDoc(event, fn) {
                return this.unbindFromDomElem(doc, event, fn);
            },

            /**
             * Removes event handler from window
             * @protected
             * @param {String|Object} event Event name or event object
             * @param {Function} [fn] Handler function
             * @returns {BEMDOM} this
             */
            unbindFromWin: function unbindFromWin(event, fn) {
                return this.unbindFromDomElem(win, event, fn);
            },

            /**
             * Removes event handlers from the block's main DOM elements or its nested elements
             * @protected
             * @param {jQuery|String} [elem] Nested element
             * @param {String|Object} event Event name or event object
             * @param {Function} [fn] Handler function
             * @returns {BEMDOM} this
             */
            unbindFrom: function unbindFrom(elem, event, fn) {
                var argLen = arguments.length;
                if (argLen === 1) {
                    event = elem;
                    elem = this.domElem;
                } else if (argLen === 2 && functions.isFunction(event)) {
                    fn = event;
                    event = elem;
                    elem = this.domElem;
                } else if (typeof elem === 'string') {
                    elem = this.elem(elem);
                }

                return this.unbindFromDomElem(elem, event, fn);
            },

            /**
             * Builds a full name for an event
             * @private
             * @param {String} event Event name
             * @returns {String}
             */
            _buildEventName: function _buildEventName(event) {
                return event.indexOf(' ') > 1 ? event.split(' ').map(function (e) {
                    return this._buildOneEventName(e);
                }, this).join(' ') : this._buildOneEventName(event);
            },

            /**
             * Builds a full name for a single event
             * @private
             * @param {String} event Event name
             * @returns {String}
             */
            _buildOneEventName: function _buildOneEventName(event) {
                var eventNameCache = this._eventNameCache;

                if (event in eventNameCache) return eventNameCache[event];

                var uniq = '.' + this._uniqId;

                if (event.indexOf('.') < 0) return eventNameCache[event] = event + uniq;

                var lego = '.bem_' + this.__self._name;

                return eventNameCache[event] = event.split('.').map(function (e, i) {
                    return i === 0 ? e + lego : lego + '_' + e;
                }).join('') + uniq;
            },

            _ctxEmit: function _ctxEmit(e, data) {
                this.__base.apply(this, arguments);

                var _this = this,
                    storage = liveEventCtxStorage[_this.__self._buildCtxEventName(e.type)],
                    ctxIds = {};

                storage && _this.domElem.each(function (_, ctx) {
                    var counter = storage.counter;
                    while (ctx && counter) {
                        var ctxId = identify(ctx, true);
                        if (ctxId) {
                            if (ctxIds[ctxId]) break;
                            var storageCtx = storage.ctxs[ctxId];
                            if (storageCtx) {
                                objects.each(storageCtx, function (handler) {
                                    handler.fn.call(handler.ctx || _this, e, data);
                                });
                                counter--;
                            }
                            ctxIds[ctxId] = true;
                        }
                        ctx = ctx.parentNode || domNodesToParents[ctxId];
                    }
                });
            },

            /**
             * Returns values of modifiers of the block/nested element
             * @param {Object} [elem] Nested element
             * @param {String} [...modNames] Modifier names
             * @returns {Object} Hash of modifier values
             */
            getMods: function getMods(elem) {
                var hasElem = elem && typeof elem !== 'string',
                    modCache = this._modCache,
                    modNames = [].slice.call(arguments, hasElem ? 1 : 0),
                    res = this._extractMods(modNames, hasElem ? elem : undef);

                if (!hasElem) {
                    // Caching
                    modNames.length ? modNames.forEach(function (name) {
                        modCache[name] = res[name];
                    }) : modCache = res;
                }

                return res;
            },

            /**
             * Sets a modifier for a block/nested element
             * @param {jQuery} [elem] Nested element
             * @param {String} modName Modifier name
             * @param {String|Boolean} [modVal=true] Modifier value
             * @returns {BEMDOM} this
             */
            setMod: function setMod(elem, modName, modVal) {
                if (elem && typeof modVal !== 'undefined' && elem.length > 1) {
                    var _this = this;
                    elem.each(function () {
                        var item = $(this);
                        item.__bemElemName = elem.__bemElemName;
                        _this.setMod(item, modName, modVal);
                    });
                    return _this;
                }
                return this.__base(elem, modName, modVal);
            },

            /**
             * Retrieves modifier value from the DOM node's CSS class
             * @private
             * @param {String} modName Modifier name
             * @param {jQuery} [elem] Nested element
             * @param {String} [elemName] Name of the nested element
             * @returns {String} Modifier value
             */
            _extractModVal: function _extractModVal(modName, elem, elemName) {
                var domNode = (elem || this.domElem)[0],
                    matches;

                domNode && (matches = domNode.className.match(this.__self._buildModValRE(modName, elemName || elem)));

                return matches ? matches[2] || true : '';
            },

            /**
             * Retrieves a name/value list of modifiers
             * @private
             * @param {Array} [modNames] Names of modifiers
             * @param {Object} [elem] Element
             * @returns {Object} Hash of modifier values by names
             */
            _extractMods: function _extractMods(modNames, elem) {
                var res = {},
                    extractAll = !modNames.length,
                    countMatched = 0;

                ((elem || this.domElem)[0].className.match(this.__self._buildModValRE('(' + (extractAll ? NAME_PATTERN : modNames.join('|')) + ')', elem, 'g')) || []).forEach(function (className) {
                    var matches = className.match(EXTRACT_MODS_RE);
                    res[matches[1]] = matches[2] || true;
                    ++countMatched;
                });

                // empty modifier values are not reflected in classes; they must be filled with empty values
                countMatched < modNames.length && modNames.forEach(function (modName) {
                    modName in res || (res[modName] = '');
                });

                return res;
            },

            /**
             * Sets a modifier's CSS class for a block's DOM element or nested element
             * @private
             * @param {String} modName Modifier name
             * @param {String} modVal Modifier value
             * @param {String} oldModVal Old modifier value
             * @param {jQuery} [elem] Element
             * @param {String} [elemName] Element name
             */
            _onSetMod: function _onSetMod(modName, modVal, oldModVal, elem, elemName) {
                if (modName !== 'js' || modVal !== '') {
                    var _self = this.__self,
                        classPrefix = _self._buildModClassPrefix(modName, elemName),
                        classRE = _self._buildModValRE(modName, elemName),
                        needDel = modVal === '' || modVal === false;

                    (elem || this.domElem).each(function () {
                        var className = this.className,
                            modClassName = classPrefix;

                        modVal !== true && (modClassName += MOD_DELIM + modVal);

                        (oldModVal === true ? classRE.test(className) : (' ' + className).indexOf(' ' + classPrefix + MOD_DELIM) > -1) ? this.className = className.replace(classRE, needDel ? '' : '$1' + modClassName) : needDel || $(this).addClass(modClassName);
                    });

                    elemName && this.dropElemCache(elemName, modName, oldModVal).dropElemCache(elemName, modName, modVal);
                }

                this.__base.apply(this, arguments);
            },

            /**
             * Finds elements nested in a block
             * @param {jQuery} [ctx=this.domElem] Element where search is being performed
             * @param {String} names Nested element name (or names separated by spaces)
             * @param {String} [modName] Modifier name
             * @param {String} [modVal] Modifier value
             * @param {Boolean} [strictMode=false]
             * @returns {jQuery} DOM elements
             */
            findElem: function findElem(ctx, names, modName, modVal, strictMode) {
                if (typeof ctx === 'string') {
                    strictMode = modVal;
                    modVal = modName;
                    modName = names;
                    names = ctx;
                    ctx = this.domElem;
                }

                if (typeof modName === 'boolean') {
                    strictMode = modName;
                    modName = undef;
                }

                names = names.split(' ');

                var _self = this.__self,
                    modPostfix = buildModPostfix(modName, modVal),
                    selectors = [],
                    keys = names.map(function (name) {
                    selectors.push(_self.buildSelector(name, modName, modVal));
                    return name + modPostfix;
                }),
                    isSingleName = keys.length === 1,
                    res = findDomElem(ctx, selectors.join(','));

                // caching results if possible
                ctx === this.domElem && selectors.forEach(function (selector, i) {
                    (this._elemCache[keys[i]] = isSingleName ? res : res.filter(selector)).__bemElemName = names[i];
                }, this);

                return strictMode ? this._filterFindElemResults(res) : res;
            },

            /**
             * Filters results of findElem helper execution in strict mode
             * @param {jQuery} res DOM elements
             * @returns {jQuery} DOM elements
             */
            _filterFindElemResults: function _filterFindElemResults(res) {
                var blockSelector = this.buildSelector(),
                    domElem = this.domElem;
                return res.filter(function () {
                    return domElem.index($(this).closest(blockSelector)) > -1;
                });
            },

            /**
             * Finds elements nested in a block
             * @private
             * @param {String} name Nested element name
             * @param {String} [modName] Modifier name
             * @param {String|Boolean} [modVal] Modifier value
             * @returns {jQuery} DOM elements
             */
            _elem: function _elem(name, modName, modVal) {
                return this._elemCache[name + buildModPostfix(modName, modVal)] || this.findElem(name, modName, modVal);
            },

            /**
             * Lazy search for elements nested in a block (caches results)
             * @param {String} names Nested element name (or names separated by spaces)
             * @param {String} [modName] Modifier name
             * @param {String|Boolean} [modVal=true] Modifier value
             * @returns {jQuery} DOM elements
             */
            elem: function elem(names, modName, modVal) {
                if (arguments.length === 2) {
                    modVal = true;
                }

                if (modName && typeof modName !== 'string') {
                    modName.__bemElemName = names;
                    return modName;
                }

                if (names.indexOf(' ') < 0) {
                    return this._elem(names, modName, modVal);
                }

                var res = $([]);
                names.split(' ').forEach(function (name) {
                    res = res.add(this._elem(name, modName, modVal));
                }, this);
                return res;
            },

            /**
             * Finds elements outside the context
             * @param {jQuery} ctx context
             * @param {String} elemName Element name
             * @returns {jQuery} DOM elements
             */
            closestElem: function closestElem(ctx, elemName) {
                return ctx.closest(this.buildSelector(elemName));
            },

            /**
             * Clearing the cache for elements
             * @protected
             * @param {String} [names] Nested element name (or names separated by spaces)
             * @param {String} [modName] Modifier name
             * @param {String} [modVal] Modifier value
             * @returns {BEMDOM} this
             */
            dropElemCache: function dropElemCache(names, modName, modVal) {
                if (names) {
                    var modPostfix = buildModPostfix(modName, modVal);
                    names.indexOf(' ') < 0 ? delete this._elemCache[names + modPostfix] : names.split(' ').forEach(function (name) {
                        delete this._elemCache[name + modPostfix];
                    }, this);
                } else {
                    this._elemCache = {};
                }

                return this;
            },

            /**
             * Retrieves parameters of a block element
             * @param {String|jQuery} elem Element
             * @returns {Object} Parameters
             */
            elemParams: function elemParams(elem) {
                var elemName;
                if (typeof elem === 'string') {
                    elemName = elem;
                    elem = this.elem(elem);
                } else {
                    elemName = this.__self._extractElemNameFrom(elem);
                }

                return extractParams(elem[0])[this.__self.buildClass(elemName)] || {};
            },

            /**
             * Elemify given element
             * @param {jQuery} elem Element
             * @param {String} elemName Name
             * @returns {jQuery}
             */
            elemify: function elemify(elem, elemName) {
                (elem = $(elem)).__bemElemName = elemName;
                return elem;
            },

            /**
             * Checks whether a DOM element is in a block
             * @protected
             * @param {jQuery} [ctx=this.domElem] Element where check is being performed
             * @param {jQuery} domElem DOM element
             * @returns {Boolean}
             */
            containsDomElem: function containsDomElem(ctx, domElem) {
                if (arguments.length === 1) {
                    domElem = ctx;
                    ctx = this.domElem;
                }

                return dom.contains(ctx, domElem);
            },

            /**
             * Builds a CSS selector corresponding to a block/element and modifier
             * @param {String} [elem] Element name
             * @param {String} [modName] Modifier name
             * @param {String} [modVal] Modifier value
             * @returns {String}
             */
            buildSelector: function buildSelector(elem, modName, modVal) {
                return this.__self.buildSelector(elem, modName, modVal);
            },

            /**
             * Destructs a block
             * @private
             */
            _destruct: function _destruct() {
                var _this = this,
                    _self = _this.__self;

                _this._needSpecialUnbind && _self.doc.add(_self.win).unbind('.' + _this._uniqId);

                _this.__base();

                delete uniqIdToBlock[_this.un()._uniqId];
            }

        }, /** @lends BEMDOM */{

            /**
             * Scope
             * @type jQuery
             */
            scope: $('body'),

            /**
             * Document shortcut
             * @type jQuery
             */
            doc: doc,

            /**
             * Window shortcut
             * @type jQuery
             */
            win: win,

            /**
             * Processes a block's live properties
             * @private
             * @param {Boolean} [heedLive=false] Whether to take into account that the block already processed its live properties
             * @returns {Boolean} Whether the block is a live block
             */
            _processLive: function _processLive(heedLive) {
                var res = this._liveInitable;

                if ('live' in this) {
                    var noLive = typeof res === 'undefined';

                    if (noLive ^ heedLive) {
                        // should be opposite to each other
                        res = this.live() !== false;

                        var blockName = this.getName(),
                            origLive = this.live;

                        this.live = function () {
                            return this.getName() === blockName ? res : origLive.apply(this, arguments);
                        };
                    }
                }

                return res;
            },

            /**
             * Initializes blocks on a fragment of the DOM tree
             * @param {jQuery|String} [ctx=scope] Root DOM node
             * @returns {jQuery} ctx Initialization context
             */
            init: function init(ctx) {
                if (typeof ctx === 'string') {
                    ctx = $(ctx);
                } else if (!ctx) ctx = DOM.scope;

                var uniqInitId = identify();
                findDomElem(ctx, BEM_SELECTOR).each(function () {
                    initBlocks($(this), uniqInitId);
                });

                this._runInitFns();

                return ctx;
            },

            /**
             * @param {jQuery} ctx Root DOM node
             * @param {Boolean} [excludeSelf=false] Exclude the main domElem
             * @param {Boolean} [destructDom=false] Remove DOM node during destruction
             * @private
             */
            _destruct: function _destruct(ctx, excludeSelf, destructDom) {
                var _ctx;
                if (excludeSelf) {
                    storeDomNodeParents(_ctx = ctx.children());
                    destructDom && ctx.empty();
                } else {
                    storeDomNodeParents(_ctx = ctx);
                    destructDom && ctx.remove();
                }

                reverse.call(findDomElem(_ctx, BEM_SELECTOR)).each(function (_, domNode) {
                    var params = getParams(domNode);
                    objects.each(params, function (blockParams) {
                        if (blockParams.uniqId) {
                            var block = uniqIdToBlock[blockParams.uniqId];
                            block ? removeDomNodeFromBlock(block, domNode) : delete uniqIdToDomElems[blockParams.uniqId];
                        }
                    });
                    delete domElemToParams[identify(domNode)];
                });

                // flush parent nodes storage that has been filled above
                domNodesToParents = {};
            },

            /**
             * Destroys blocks on a fragment of the DOM tree
             * @param {jQuery} ctx Root DOM node
             * @param {Boolean} [excludeSelf=false] Exclude the main domElem
             */
            destruct: function destruct(ctx, excludeSelf) {
                this._destruct(ctx, excludeSelf, true);
            },

            /**
             * Detaches blocks on a fragment of the DOM tree without destructing DOM tree
             * @param {jQuery} ctx Root DOM node
             * @param {Boolean} [excludeSelf=false] Exclude the main domElem
             */
            detach: function detach(ctx, excludeSelf) {
                this._destruct(ctx, excludeSelf);
            },

            /**
             * Replaces a fragment of the DOM tree inside the context, destroying old blocks and intializing new ones
             * @param {jQuery} ctx Root DOM node
             * @param {jQuery|String} content New content
             * @returns {jQuery} Updated root DOM node
             */
            update: function update(ctx, content) {
                this.destruct(ctx, true);
                return this.init(ctx.html(content));
            },

            /**
             * Changes a fragment of the DOM tree including the context and initializes blocks.
             * @param {jQuery} ctx Root DOM node
             * @param {jQuery|String} content Content to be added
             * @returns {jQuery} New content
             */
            replace: function replace(ctx, content) {
                var prev = ctx.prev(),
                    parent = ctx.parent();

                content = getJqueryCollection(content);

                this.destruct(ctx);

                return this.init(prev.length ? content.insertAfter(prev) : content.prependTo(parent));
            },

            /**
             * Adds a fragment of the DOM tree at the end of the context and initializes blocks
             * @param {jQuery} ctx Root DOM node
             * @param {jQuery|String} content Content to be added
             * @returns {jQuery} New content
             */
            append: function append(ctx, content) {
                return this.init(getJqueryCollection(content).appendTo(ctx));
            },

            /**
             * Adds a fragment of the DOM tree at the beginning of the context and initializes blocks
             * @param {jQuery} ctx Root DOM node
             * @param {jQuery|String} content Content to be added
             * @returns {jQuery} New content
             */
            prepend: function prepend(ctx, content) {
                return this.init(getJqueryCollection(content).prependTo(ctx));
            },

            /**
             * Adds a fragment of the DOM tree before the context and initializes blocks
             * @param {jQuery} ctx Contextual DOM node
             * @param {jQuery|String} content Content to be added
             * @returns {jQuery} New content
             */
            before: function before(ctx, content) {
                return this.init(getJqueryCollection(content).insertBefore(ctx));
            },

            /**
             * Adds a fragment of the DOM tree after the context and initializes blocks
             * @param {jQuery} ctx Contextual DOM node
             * @param {jQuery|String} content Content to be added
             * @returns {jQuery} New content
             */
            after: function after(ctx, content) {
                return this.init(getJqueryCollection(content).insertAfter(ctx));
            },

            /**
             * Builds a full name for a live event
             * @private
             * @param {String} e Event name
             * @returns {String}
             */
            _buildCtxEventName: function _buildCtxEventName(e) {
                return this._name + ':' + e;
            },

            _liveClassBind: function _liveClassBind(className, e, callback, invokeOnInit) {
                if (e.indexOf(' ') > -1) {
                    e.split(' ').forEach(function (e) {
                        this._liveClassBind(className, e, callback, invokeOnInit);
                    }, this);
                } else {
                    var storage = liveClassEventStorage[e],
                        uniqId = identify(callback);

                    if (!storage) {
                        storage = liveClassEventStorage[e] = {};
                        DOM.scope.bind(e, $.proxy(this._liveClassTrigger, this));
                    }

                    storage = storage[className] || (storage[className] = { uniqIds: {}, fns: [] });

                    if (!(uniqId in storage.uniqIds)) {
                        storage.fns.push({ uniqId: uniqId, fn: this._buildLiveEventFn(callback, invokeOnInit) });
                        storage.uniqIds[uniqId] = storage.fns.length - 1;
                    }
                }

                return this;
            },

            _liveClassUnbind: function _liveClassUnbind(className, e, callback) {
                var storage = liveClassEventStorage[e];
                if (storage) {
                    if (callback) {
                        if (storage = storage[className]) {
                            var uniqId = identify(callback);
                            if (uniqId in storage.uniqIds) {
                                var i = storage.uniqIds[uniqId],
                                    len = storage.fns.length - 1;
                                storage.fns.splice(i, 1);
                                while (i < len) {
                                    storage.uniqIds[storage.fns[i++].uniqId] = i - 1;
                                }delete storage.uniqIds[uniqId];
                            }
                        }
                    } else {
                        delete storage[className];
                    }
                }

                return this;
            },

            _liveClassTrigger: function _liveClassTrigger(e) {
                var storage = liveClassEventStorage[e.type];
                if (storage) {
                    var node = e.target,
                        classNames = [];
                    for (var className in storage) {
                        classNames.push(className);
                    }
                    do {
                        var nodeClassName = ' ' + node.className + ' ',
                            i = 0;
                        while (className = classNames[i++]) {
                            if (nodeClassName.indexOf(' ' + className + ' ') > -1) {
                                var j = 0,
                                    fns = storage[className].fns,
                                    fn,
                                    stopPropagationAndPreventDefault = false;
                                while (fn = fns[j++]) {
                                    if (fn.fn.call($(node), e) === false) stopPropagationAndPreventDefault = true;
                                }stopPropagationAndPreventDefault && e.preventDefault();
                                if (stopPropagationAndPreventDefault || e.isPropagationStopped()) return;

                                classNames.splice(--i, 1);
                            }
                        }
                    } while (classNames.length && (node = node.parentNode));
                }
            },

            _buildLiveEventFn: function _buildLiveEventFn(callback, invokeOnInit) {
                var _this = this;
                return function (e) {
                    e.currentTarget = this;
                    var args = [_this._name, $(this).closest(_this.buildSelector()), undef, true],
                        block = initBlock.apply(null, invokeOnInit ? args.concat([callback, e]) : args);

                    if (block && !invokeOnInit && callback) return callback.apply(block, arguments);
                };
            },

            /**
             * Helper for live initialization for an event on DOM elements of a block or its elements
             * @protected
             * @param {String} [elemName] Element name or names (separated by spaces)
             * @param {String} event Event name
             * @param {Function} [callback] Handler to call after successful initialization
             */
            liveInitOnEvent: function liveInitOnEvent(elemName, event, callback) {
                return this.liveBindTo(elemName, event, callback, true);
            },

            /**
             * Helper for subscribing to live events on DOM elements of a block or its elements
             * @protected
             * @param {String|Object} [to] Description (object with modName, modVal, elem) or name of the element or elements (space-separated)
             * @param {String} event Event name
             * @param {Function} [callback] Handler
             */
            liveBindTo: function liveBindTo(to, event, callback, invokeOnInit) {
                if (!event || functions.isFunction(event)) {
                    callback = event;
                    event = to;
                    to = undef;
                }

                if (!to || typeof to === 'string') {
                    to = { elem: to };
                }

                if (to.elem && to.elem.indexOf(' ') > 0) {
                    to.elem.split(' ').forEach(function (elem) {
                        this._liveClassBind(this.buildClass(elem, to.modName, to.modVal), event, callback, invokeOnInit);
                    }, this);
                    return this;
                }

                return this._liveClassBind(this.buildClass(to.elem, to.modName, to.modVal), event, callback, invokeOnInit);
            },

            /**
             * Helper for unsubscribing from live events on DOM elements of a block or its elements
             * @protected
             * @param {String} [elem] Name of the element or elements (space-separated)
             * @param {String} event Event name
             * @param {Function} [callback] Handler
             */
            liveUnbindFrom: function liveUnbindFrom(elem, event, callback) {

                if (!event || functions.isFunction(event)) {
                    callback = event;
                    event = elem;
                    elem = undef;
                }

                if (elem && elem.indexOf(' ') > 1) {
                    elem.split(' ').forEach(function (elem) {
                        this._liveClassUnbind(this.buildClass(elem), event, callback);
                    }, this);
                    return this;
                }

                return this._liveClassUnbind(this.buildClass(elem), event, callback);
            },

            /**
             * Helper for live initialization when a different block is initialized
             * @private
             * @param {String} event Event name
             * @param {String} blockName Name of the block that should trigger a reaction when initialized
             * @param {Function} callback Handler to be called after successful initialization in the new block's context
             * @param {String} findFnName Name of the method for searching
             */
            _liveInitOnBlockEvent: function _liveInitOnBlockEvent(event, blockName, callback, findFnName) {
                var name = this._name;
                blocks[blockName].on(event, function (e) {
                    var args = arguments,
                        blocks = e.target[findFnName](name);

                    callback && blocks.forEach(function (block) {
                        callback.apply(block, args);
                    });
                });
                return this;
            },

            /**
             * Helper for live initialization for a different block's event on the current block's DOM element
             * @protected
             * @param {String} event Event name
             * @param {String} blockName Name of the block that should trigger a reaction when initialized
             * @param {Function} callback Handler to be called after successful initialization in the new block's context
             */
            liveInitOnBlockEvent: function liveInitOnBlockEvent(event, blockName, callback) {
                return this._liveInitOnBlockEvent(event, blockName, callback, 'findBlocksOn');
            },

            /**
             * Helper for live initialization for a different block's event inside the current block
             * @protected
             * @param {String} event Event name
             * @param {String} blockName Name of the block that should trigger a reaction when initialized
             * @param {Function} [callback] Handler to be called after successful initialization in the new block's context
             */
            liveInitOnBlockInsideEvent: function liveInitOnBlockInsideEvent(event, blockName, callback) {
                return this._liveInitOnBlockEvent(event, blockName, callback, 'findBlocksOutside');
            },

            /**
             * Adds a live event handler to a block, based on a specified element where the event will be listened for
             * @param {jQuery} [ctx] The element in which the event will be listened for
             * @param {String} e Event name
             * @param {Object} [data] Additional information that the handler gets as e.data
             * @param {Function} fn Handler
             * @param {Object} [fnCtx] Handler's context
             */
            on: function on(ctx, e, data, fn, fnCtx) {
                return (typeof ctx === 'undefined' ? 'undefined' : babelHelpers.typeof(ctx)) === 'object' && ctx.jquery ? this._liveCtxBind(ctx, e, data, fn, fnCtx) : this.__base(ctx, e, data, fn);
            },

            /**
             * Removes the live event handler from a block, based on a specified element where the event was being listened for
             * @param {jQuery} [ctx] The element in which the event was being listened for
             * @param {String} e Event name
             * @param {Function} [fn] Handler
             * @param {Object} [fnCtx] Handler context
             */
            un: function un(ctx, e, fn, fnCtx) {
                return (typeof ctx === 'undefined' ? 'undefined' : babelHelpers.typeof(ctx)) === 'object' && ctx.jquery ? this._liveCtxUnbind(ctx, e, fn, fnCtx) : this.__base(ctx, e, fn);
            },

            /**
             * Adds a live event handler to a block, based on a specified element where the event will be listened for
             * @private
             * @param {jQuery} ctx The element in which the event will be listened for
             * @param {String} e  Event name
             * @param {Object} [data] Additional information that the handler gets as e.data
             * @param {Function} fn Handler
             * @param {Object} [fnCtx] Handler context
             * @returns {BEMDOM} this
             */
            _liveCtxBind: function _liveCtxBind(ctx, e, data, fn, fnCtx) {
                if ((typeof e === 'undefined' ? 'undefined' : babelHelpers.typeof(e)) === 'object') {
                    if (functions.isFunction(data) || functions.isFunction(fn)) {
                        // mod change event
                        e = this._buildModEventName(e);
                    } else {
                        objects.each(e, function (fn, e) {
                            this._liveCtxBind(ctx, e, fn, data);
                        }, this);
                        return this;
                    }
                }

                if (functions.isFunction(data)) {
                    fnCtx = fn;
                    fn = data;
                    data = undef;
                }

                if (e.indexOf(' ') > -1) {
                    e.split(' ').forEach(function (e) {
                        this._liveCtxBind(ctx, e, data, fn, fnCtx);
                    }, this);
                } else {
                    var ctxE = this._buildCtxEventName(e),
                        storage = liveEventCtxStorage[ctxE] || (liveEventCtxStorage[ctxE] = { counter: 0, ctxs: {} });

                    ctx.each(function () {
                        var ctxId = identify(this),
                            ctxStorage = storage.ctxs[ctxId];
                        if (!ctxStorage) {
                            ctxStorage = storage.ctxs[ctxId] = {};
                            ++storage.counter;
                        }
                        ctxStorage[identify(fn) + (fnCtx ? identify(fnCtx) : '')] = {
                            fn: fn,
                            data: data,
                            ctx: fnCtx
                        };
                    });
                }

                return this;
            },

            /**
             * Removes a live event handler from a block, based on a specified element where the event was being listened for
             * @private
             * @param {jQuery} ctx The element in which the event was being listened for
             * @param {String|Object} e Event name
             * @param {Function} [fn] Handler
             * @param {Object} [fnCtx] Handler context
             */
            _liveCtxUnbind: function _liveCtxUnbind(ctx, e, fn, fnCtx) {
                if ((typeof e === 'undefined' ? 'undefined' : babelHelpers.typeof(e)) === 'object' && functions.isFunction(fn)) {
                    // mod change event
                    e = this._buildModEventName(e);
                }

                var storage = liveEventCtxStorage[e = this._buildCtxEventName(e)];

                if (storage) {
                    ctx.each(function () {
                        var ctxId = identify(this, true),
                            ctxStorage;
                        if (ctxId && (ctxStorage = storage.ctxs[ctxId])) {
                            fn && delete ctxStorage[identify(fn) + (fnCtx ? identify(fnCtx) : '')];
                            if (!fn || objects.isEmpty(ctxStorage)) {
                                storage.counter--;
                                delete storage.ctxs[ctxId];
                            }
                        }
                    });
                    storage.counter || delete liveEventCtxStorage[e];
                }

                return this;
            },

            /**
             * Retrieves the name of an element nested in a block
             * @private
             * @param {jQuery} elem Nested element
             * @returns {String|undef}
             */
            _extractElemNameFrom: function _extractElemNameFrom(elem) {
                if (elem.__bemElemName) return elem.__bemElemName;

                var matches = elem[0].className.match(this._buildElemNameRE());
                return matches ? matches[1] : undef;
            },

            /**
             * Builds a prefix for the CSS class of a DOM element or nested element of the block, based on modifier name
             * @private
             * @param {String} modName Modifier name
             * @param {jQuery|String} [elem] Element
             * @returns {String}
             */
            _buildModClassPrefix: function _buildModClassPrefix(modName, elem) {
                return this._name + (elem ? ELEM_DELIM + (typeof elem === 'string' ? elem : this._extractElemNameFrom(elem)) : '') + MOD_DELIM + modName;
            },

            /**
             * Builds a regular expression for extracting modifier values from a DOM element or nested element of a block
             * @private
             * @param {String} modName Modifier name
             * @param {jQuery|String} [elem] Element
             * @param {String} [quantifiers] Regular expression quantifiers
             * @returns {RegExp}
             */
            _buildModValRE: function _buildModValRE(modName, elem, quantifiers) {
                return new RegExp('(\\s|^)' + this._buildModClassPrefix(modName, elem) + '(?:' + MOD_DELIM + '(' + NAME_PATTERN + '))?(?=\\s|$)', quantifiers);
            },

            /**
             * Builds a regular expression for extracting names of elements nested in a block
             * @private
             * @returns {RegExp}
             */
            _buildElemNameRE: function _buildElemNameRE() {
                return new RegExp(this._name + ELEM_DELIM + '(' + NAME_PATTERN + ')(?:\\s|$)');
            },

            /**
             * Builds a CSS class corresponding to the block/element and modifier
             * @param {String} [elem] Element name
             * @param {String} [modName] Modifier name
             * @param {String} [modVal] Modifier value
             * @returns {String}
             */
            buildClass: function buildClass(elem, modName, modVal) {
                return _buildClass(this._name, elem, modName, modVal);
            },

            /**
             * Builds a CSS selector corresponding to the block/element and modifier
             * @param {String} [elem] Element name
             * @param {String} [modName] Modifier name
             * @param {String} [modVal] Modifier value
             * @returns {String}
             */
            buildSelector: function buildSelector(elem, modName, modVal) {
                return '.' + this.buildClass(elem, modName, modVal);
            }
        });

        /**
         * Returns a block on a DOM element and initializes it if necessary
         * @param {String} blockName Block name
         * @param {Object} [params] Block parameters
         * @returns {BEMDOM}
         */
        $.fn.bem = function (blockName, params) {
            return initBlock(blockName, this, params, true)._init();
        };

        provide(DOM);
    });
});

(function () {

    var origDefine = modules.define,
        storedDeps = []; // NOTE: see https://github.com/bem/bem-core/issues/1446

    modules.define = function (name, deps, decl) {
        origDefine.apply(modules, arguments);

        if (name !== 'i-bem__dom_init' && arguments.length > 2 && ~deps.indexOf('i-bem__dom')) {
            storedDeps.push(name);
            storedDeps.length === 1 && modules.define('i-bem__dom_init', storedDeps, function (provide) {
                provide(arguments[arguments.length - 1]);
                storedDeps = [];
            });
        }
    };
})();
// Глобальный BEMHTML и BEM.DOM для обратной совместимости
// eslint-disable-next-line
var BEMHTML = void 0;
modules.require(['BEMHTML'], function (b) {
	BEMHTML = b;
});

modules.require('i-bem__dom', function (DOM) {
	BEM.DOM = DOM;
});

modules.define('i-bem__dom', ['i-bem'], function (provide, BEM, DOM) {
	provide(BEM.decl('i-bem__dom', /** @lends DOM.prototype */{
		/**
   * Удаляет блок
   * @deprecated использовать DOM.destruct(block.domElem)
   */
		destruct: function destruct() {
			DOM.destruct(this.domElem);
		}
	}));
});
/**
 * @module i-bem
 */

modules.define('i-bem', ['i-bem__internal', 'inherit', 'identify', 'next-tick', 'objects', 'functions', 'events'], function (provide, INTERNAL, inherit, identify, _nextTick, objects, functions, events) {

    var undef,
        MOD_DELIM = INTERNAL.MOD_DELIM,
        ELEM_DELIM = INTERNAL.ELEM_DELIM,


    /**
     * Storage for block init functions
     * @private
     * @type Array
     */
    initFns = [],


    /**
     * Storage for block declarations (hash by block name)
     * @private
     * @type Object
     */
    blocks = {};

    /**
     * Builds the name of the handler method for setting a modifier
     * @param {String} prefix
     * @param {String} modName Modifier name
     * @param {String} modVal Modifier value
     * @param {String} [elemName] Element name
     * @returns {String}
     */
    function buildModFnName(prefix, modName, modVal, elemName) {
        return '__' + prefix + (elemName ? '__elem_' + elemName : '') + '__mod' + (modName ? '_' + modName : '') + (modVal ? '_' + modVal : '');
    }

    /**
     * Transforms a hash of modifier handlers to methods
     * @param {String} prefix
     * @param {Object} modFns
     * @param {Object} props
     * @param {String} [elemName]
     */
    function modFnsToProps(prefix, modFns, props, elemName) {
        if (functions.isFunction(modFns)) {
            props[buildModFnName(prefix, '*', '*', elemName)] = modFns;
        } else {
            var modName, modVal, modFn;
            for (modName in modFns) {
                if (modFns.hasOwnProperty(modName)) {
                    modFn = modFns[modName];
                    if (functions.isFunction(modFn)) {
                        props[buildModFnName(prefix, modName, '*', elemName)] = modFn;
                    } else {
                        for (modVal in modFn) {
                            if (modFn.hasOwnProperty(modVal)) {
                                props[buildModFnName(prefix, modName, modVal, elemName)] = modFn[modVal];
                            }
                        }
                    }
                }
            }
        }
    }

    function buildCheckMod(modName, modVal) {
        return modVal ? Array.isArray(modVal) ? function (block) {
            var i = 0,
                len = modVal.length;
            while (i < len) {
                if (block.hasMod(modName, modVal[i++])) return true;
            }return false;
        } : function (block) {
            return block.hasMod(modName, modVal);
        } : function (block) {
            return block.hasMod(modName);
        };
    }

    function convertModHandlersToMethods(props) {
        if (props.beforeSetMod) {
            modFnsToProps('before', props.beforeSetMod, props);
            delete props.beforeSetMod;
        }

        if (props.onSetMod) {
            modFnsToProps('after', props.onSetMod, props);
            delete props.onSetMod;
        }

        var elemName;
        if (props.beforeElemSetMod) {
            for (elemName in props.beforeElemSetMod) {
                if (props.beforeElemSetMod.hasOwnProperty(elemName)) {
                    modFnsToProps('before', props.beforeElemSetMod[elemName], props, elemName);
                }
            }
            delete props.beforeElemSetMod;
        }

        if (props.onElemSetMod) {
            for (elemName in props.onElemSetMod) {
                if (props.onElemSetMod.hasOwnProperty(elemName)) {
                    modFnsToProps('after', props.onElemSetMod[elemName], props, elemName);
                }
            }
            delete props.onElemSetMod;
        }
    }

    /**
     * @class BEM
     * @description Base block for creating BEM blocks
     * @augments events:Emitter
     * @exports
     */
    var BEM = inherit(events.Emitter, /** @lends BEM.prototype */{
        /**
         * @constructor
         * @private
         * @param {Object} mods Block modifiers
         * @param {Object} params Block parameters
         * @param {Boolean} [initImmediately=true]
         */
        __constructor: function __constructor(mods, params, initImmediately) {
            /**
             * Cache of block modifiers
             * @member {Object}
             * @private
             */
            this._modCache = mods || {};

            /**
             * Current modifiers in the stack
             * @member {Object}
             * @private
             */
            this._processingMods = {};

            /**
             * Block parameters, taking into account the defaults
             * @member {Object}
             * @readonly
             */
            this.params = objects.extend(this.getDefaultParams(), params);

            initImmediately !== false ? this._init() : initFns.push(this._init, this);
        },

        /**
         * Initializes the block
         * @private
         */
        _init: function _init() {
            return this.setMod('js', 'inited');
        },

        /**
         * Adds an event handler
         * @param {String|Object} e Event type
         * @param {Object} [data] Additional data that the handler gets as e.data
         * @param {Function} fn Handler
         * @param {Object} [ctx] Handler context
         * @returns {BEM} this
         */
        on: function on(e, data, fn, ctx) {
            if ((typeof e === 'undefined' ? 'undefined' : babelHelpers.typeof(e)) === 'object' && (functions.isFunction(data) || functions.isFunction(fn))) {
                // mod change event
                e = this.__self._buildModEventName(e);
            }

            return this.__base.apply(this, arguments);
        },

        /**
         * Removes event handler or handlers
         * @param {String|Object} [e] Event type
         * @param {Function} [fn] Handler
         * @param {Object} [ctx] Handler context
         * @returns {BEM} this
         */
        un: function un(e, fn, ctx) {
            if ((typeof e === 'undefined' ? 'undefined' : babelHelpers.typeof(e)) === 'object' && functions.isFunction(fn)) {
                // mod change event
                e = this.__self._buildModEventName(e);
            }

            return this.__base.apply(this, arguments);
        },

        /**
         * Executes the block's event handlers and live event handlers
         * @protected
         * @param {String} e Event name
         * @param {Object} [data] Additional information
         * @returns {BEM} this
         */
        emit: function emit(e, data) {
            var isModJsEvent = false;
            if ((typeof e === 'undefined' ? 'undefined' : babelHelpers.typeof(e)) === 'object' && !(e instanceof events.Event)) {
                isModJsEvent = e.modName === 'js';
                e = this.__self._buildModEventName(e);
            }

            if (isModJsEvent || this.hasMod('js', 'inited')) {
                this.__base(e = this._buildEvent(e), data);
                this._ctxEmit(e, data);
            }

            return this;
        },

        _ctxEmit: function _ctxEmit(e, data) {
            this.__self.emit(e, data);
        },

        /**
         * Builds event
         * @private
         * @param {String|events:Event} e
         * @returns {events:Event}
         */
        _buildEvent: function _buildEvent(e) {
            typeof e === 'string' ? e = new events.Event(e, this) : e.target || (e.target = this);

            return e;
        },

        /**
         * Checks whether a block or nested element has a modifier
         * @param {Object} [elem] Nested element
         * @param {String} modName Modifier name
         * @param {String|Boolean} [modVal] Modifier value. If defined and not of type String or Boolean, it is casted to String
         * @returns {Boolean}
         */
        hasMod: function hasMod(elem, modName, modVal) {
            var len = arguments.length,
                invert = false;

            if (len === 1) {
                modVal = '';
                modName = elem;
                elem = undef;
                invert = true;
            } else if (len === 2) {
                if (typeof elem === 'string') {
                    modVal = modName;
                    modName = elem;
                    elem = undef;
                } else {
                    modVal = '';
                    invert = true;
                }
            }

            var typeModVal = typeof modVal === 'undefined' ? 'undefined' : babelHelpers.typeof(modVal);
            typeModVal === 'string' || typeModVal === 'boolean' || typeModVal === 'undefined' || (modVal = modVal.toString());

            var res = this.getMod(elem, modName) === modVal;
            return invert ? !res : res;
        },

        /**
         * Returns the value of the modifier of the block/nested element
         * @param {Object} [elem] Nested element
         * @param {String} modName Modifier name
         * @returns {String|Boolean} Modifier value
         */
        getMod: function getMod(elem, modName) {
            var type = typeof elem === 'undefined' ? 'undefined' : babelHelpers.typeof(elem);
            if (type === 'string' || type === 'undefined') {
                // elem either omitted or undefined
                modName = elem || modName;
                var modCache = this._modCache;
                return modName in modCache ? modCache[modName] || '' : modCache[modName] = this._extractModVal(modName);
            }

            return this._getElemMod(modName, elem);
        },

        /**
         * Returns the value of the modifier of the nested element
         * @private
         * @param {String} modName Modifier name
         * @param {Object} elem Nested element
         * @param {Object} [elemName] Nested element name
         * @returns {String} Modifier value
         */
        _getElemMod: function _getElemMod(modName, elem, elemName) {
            return this._extractModVal(modName, elem, elemName);
        },

        /**
         * Returns values of modifiers of the block/nested element
         * @param {Object} [elem] Nested element
         * @param {String} [...modNames] Modifier names
         * @returns {Object} Hash of modifier values
         */
        getMods: function getMods(elem) {
            var hasElem = elem && typeof elem !== 'string',
                modCache = this._modCache,
                modNames = [].slice.call(arguments, hasElem ? 1 : 0);

            return !modNames.length ? modCache : modNames.reduce(function (res, mod) {
                if (mod in modCache) {
                    res[mod] = modCache[mod];
                }

                return res;
            }, {});
        },

        /**
         * Sets the modifier for a block/nested element
         * @param {Object} [elem] Nested element
         * @param {String} modName Modifier name
         * @param {String|Boolean} [modVal=true] Modifier value. If not of type String or Boolean, it is casted to String
         * @returns {BEM} this
         */
        setMod: function setMod(elem, modName, modVal) {
            if (typeof modVal === 'undefined') {
                if (typeof elem === 'string') {
                    // if no elem
                    modVal = typeof modName === 'undefined' ? true : // e.g. setMod('focused')
                    modName; // e.g. setMod('js', 'inited')
                    modName = elem;
                    elem = undef;
                } else {
                    // if elem
                    modVal = true; // e.g. setMod(elem, 'focused')
                }
            }

            if (!elem || elem[0]) {
                if (modVal === false) {
                    modVal = '';
                } else if (typeof modVal !== 'boolean') {
                    modVal = modVal.toString();
                }

                var modId = (elem && elem[0] ? identify(elem[0]) : '') + '_' + modName;

                if (this._processingMods[modId]) return this;

                var elemName,
                    curModVal = elem ? this._getElemMod(modName, elem, elemName = this.__self._extractElemNameFrom(elem)) : this.getMod(modName);

                if (curModVal === modVal) return this;

                this._processingMods[modId] = true;

                var needSetMod = true,
                    modFnParams = [modName, modVal, curModVal];

                elem && modFnParams.unshift(elem);

                var modVars = [['*', '*'], [modName, '*'], [modName, modVal]],
                    prefixes = ['before', 'after'],
                    i = 0,
                    prefix,
                    j,
                    modVar;

                while (prefix = prefixes[i++]) {
                    j = 0;
                    while (modVar = modVars[j++]) {
                        if (this._callModFn(prefix, elemName, modVar[0], modVar[1], modFnParams) === false) {
                            needSetMod = false;
                            break;
                        }
                    }

                    if (!needSetMod) break;

                    if (prefix === 'before') {
                        elem || (this._modCache[modName] = modVal); // cache only block mods
                        this._onSetMod(modName, modVal, curModVal, elem, elemName);
                    }
                }

                this._processingMods[modId] = null;
                needSetMod && this._emitModChangeEvents(modName, modVal, curModVal, elem, elemName);
            }

            return this;
        },

        /**
         * Function after successfully changing the modifier of the block/nested element
         * @protected
         * @param {String} modName Modifier name
         * @param {String} modVal Modifier value
         * @param {String} oldModVal Old modifier value
         * @param {Object} [elem] Nested element
         * @param {String} [elemName] Element name
         */
        _onSetMod: function _onSetMod(modName, modVal, oldModVal, elem, elemName) {},

        _emitModChangeEvents: function _emitModChangeEvents(modName, modVal, oldModVal, elem, elemName) {
            var eventData = { modName: modName, modVal: modVal, oldModVal: oldModVal };
            elem && (eventData.elem = elem);
            this.emit({ modName: modName, modVal: '*', elem: elemName }, eventData).emit({ modName: modName, modVal: modVal, elem: elemName }, eventData);
        },

        /**
         * Sets a modifier for a block/nested element, depending on conditions.
         * If the condition parameter is passed: when true, modVal1 is set; when false, modVal2 is set.
         * If the condition parameter is not passed: modVal1 is set if modVal2 was set, or vice versa.
         * @param {Object} [elem] Nested element
         * @param {String} modName Modifier name
         * @param {String} [modVal1=true] First modifier value, optional for boolean modifiers
         * @param {String} [modVal2] Second modifier value
         * @param {Boolean} [condition] Condition
         * @returns {BEM} this
         */
        toggleMod: function toggleMod(elem, modName, modVal1, modVal2, condition) {
            if (typeof elem === 'string') {
                // if this is a block
                condition = modVal2;
                modVal2 = modVal1;
                modVal1 = modName;
                modName = elem;
                elem = undef;
            }

            if (typeof modVal1 === 'undefined') {
                // boolean mod
                modVal1 = true;
            }

            if (typeof modVal2 === 'undefined') {
                modVal2 = '';
            } else if (typeof modVal2 === 'boolean') {
                condition = modVal2;
                modVal2 = '';
            }

            var modVal = this.getMod(elem, modName);
            (modVal === modVal1 || modVal === modVal2) && this.setMod(elem, modName, typeof condition === 'boolean' ? condition ? modVal1 : modVal2 : this.hasMod(elem, modName, modVal1) ? modVal2 : modVal1);

            return this;
        },

        /**
         * Removes a modifier from a block/nested element
         * @protected
         * @param {Object} [elem] Nested element
         * @param {String} modName Modifier name
         * @returns {BEM} this
         */
        delMod: function delMod(elem, modName) {
            if (!modName) {
                modName = elem;
                elem = undef;
            }

            return this.setMod(elem, modName, '');
        },

        /**
         * Executes handlers for setting modifiers
         * @private
         * @param {String} prefix
         * @param {String} elemName Element name
         * @param {String} modName Modifier name
         * @param {String} modVal Modifier value
         * @param {Array} modFnParams Handler parameters
         */
        _callModFn: function _callModFn(prefix, elemName, modName, modVal, modFnParams) {
            var modFnName = buildModFnName(prefix, modName, modVal, elemName);
            return this[modFnName] ? this[modFnName].apply(this, modFnParams) : undef;
        },

        /**
         * Retrieves the value of the modifier
         * @private
         * @param {String} modName Modifier name
         * @param {Object} [elem] Element
         * @returns {String} Modifier value
         */
        _extractModVal: function _extractModVal(modName, elem) {
            return '';
        },

        /**
         * Returns a block's default parameters
         * @protected
         * @returns {Object}
         */
        getDefaultParams: function getDefaultParams() {
            return {};
        },

        /**
         * Deletes a block
         * @private
         */
        _destruct: function _destruct() {
            this.delMod('js');
        },

        /**
         * Executes given callback on next turn eventloop in block's context
         * @protected
         * @param {Function} fn callback
         * @returns {BEM} this
         */
        nextTick: function nextTick(fn) {
            var _this = this;
            _nextTick(function () {
                _this.hasMod('js', 'inited') && fn.call(_this);
            });
            return this;
        }
    }, /** @lends BEM */{

        _name: 'i-bem',

        /**
         * Storage for block declarations (hash by block name)
         * @type Object
         */
        blocks: blocks,

        /**
         * Declares blocks and creates a block class
         * @param {String|Object} decl Block name (simple syntax) or description
         * @param {String} decl.block|decl.name Block name
         * @param {String} [decl.baseBlock] Name of the parent block
         * @param {Array} [decl.baseMix] Mixed block names
         * @param {String} [decl.modName] Modifier name
         * @param {String|Array} [decl.modVal] Modifier value
         * @param {Object} [props] Methods
         * @param {Object} [staticProps] Static methods
         * @returns {Function}
         */
        decl: function decl(_decl, props, staticProps) {
            // string as block
            typeof _decl === 'string' && (_decl = { block: _decl });
            // inherit from itself
            if (arguments.length <= 2 && (typeof _decl === 'undefined' ? 'undefined' : babelHelpers.typeof(_decl)) === 'object' && (!_decl || typeof _decl.block !== 'string' && typeof _decl.modName !== 'string')) {
                staticProps = props;
                props = _decl;
                _decl = {};
            }
            typeof _decl.block === 'undefined' && (_decl.block = this.getName());

            var baseBlock;
            if (typeof _decl.baseBlock === 'undefined') {
                baseBlock = blocks[_decl.block] || this;
            } else if (typeof _decl.baseBlock === 'string') {
                baseBlock = blocks[_decl.baseBlock];
                if (!baseBlock) throw 'baseBlock "' + _decl.baseBlock + '" for "' + _decl.block + '" is undefined';
            } else {
                baseBlock = _decl.baseBlock;
            }

            convertModHandlersToMethods(props || (props = {}));

            if (_decl.modName) {
                var checkMod = buildCheckMod(_decl.modName, _decl.modVal);
                objects.each(props, function (prop, name) {
                    functions.isFunction(prop) && (props[name] = function () {
                        var method;
                        if (checkMod(this)) {
                            method = prop;
                        } else {
                            var baseMethod = baseBlock.prototype[name];
                            baseMethod && baseMethod !== prop && (method = this.__base);
                        }
                        return method ? method.apply(this, arguments) : undef;
                    });
                });
            }

            if (staticProps && typeof staticProps.live === 'boolean') {
                var live = staticProps.live;
                staticProps.live = function () {
                    return live;
                };
            }

            var block,
                baseBlocks = baseBlock;
            if (_decl.baseMix) {
                baseBlocks = [baseBlocks];
                _decl.baseMix.forEach(function (mixedBlock) {
                    if (!blocks[mixedBlock]) {
                        throw 'mix block "' + mixedBlock + '" for "' + _decl.block + '" is undefined';
                    }
                    baseBlocks.push(blocks[mixedBlock]);
                });
            }

            if (_decl.block === baseBlock.getName()) {
                // makes a new "live" if the old one was already executed
                (block = inherit.self(baseBlocks, props, staticProps))._processLive(true);
            } else {
                (block = blocks[_decl.block] = inherit(baseBlocks, props, staticProps))._name = _decl.block;
                delete block._liveInitable;
            }

            return block;
        },

        declMix: function declMix(block, props, staticProps) {
            convertModHandlersToMethods(props || (props = {}));
            return blocks[block] = inherit(props, staticProps);
        },

        /**
         * Processes a block's live properties
         * @private
         * @param {Boolean} [heedLive=false] Whether to take into account that the block already processed its live properties
         * @returns {Boolean} Whether the block is a live block
         */
        _processLive: function _processLive(heedLive) {
            return false;
        },

        /**
         * Factory method for creating an instance of the block named
         * @param {String|Object} block Block name or description
         * @param {Object} [params] Block parameters
         * @returns {BEM}
         */
        create: function create(block, params) {
            typeof block === 'string' && (block = { block: block });

            return new blocks[block.block](block.mods, params);
        },

        /**
         * Returns the name of the current block
         * @returns {String}
         */
        getName: function getName() {
            return this._name;
        },

        /**
         * Adds an event handler
         * @param {String|Object} e Event type
         * @param {Object} [data] Additional data that the handler gets as e.data
         * @param {Function} fn Handler
         * @param {Object} [ctx] Handler context
         * @returns {Function} this
         */
        on: function on(e, data, fn, ctx) {
            if ((typeof e === 'undefined' ? 'undefined' : babelHelpers.typeof(e)) === 'object' && (functions.isFunction(data) || functions.isFunction(fn))) {
                // mod change event
                e = this._buildModEventName(e);
            }

            return this.__base.apply(this, arguments);
        },

        /**
         * Removes event handler or handlers
         * @param {String|Object} [e] Event type
         * @param {Function} [fn] Handler
         * @param {Object} [ctx] Handler context
         * @returns {Function} this
         */
        un: function un(e, fn, ctx) {
            if ((typeof e === 'undefined' ? 'undefined' : babelHelpers.typeof(e)) === 'object' && functions.isFunction(fn)) {
                // mod change event
                e = this._buildModEventName(e);
            }

            return this.__base.apply(this, arguments);
        },

        _buildModEventName: function _buildModEventName(modEvent) {
            var res = MOD_DELIM + modEvent.modName + MOD_DELIM + (modEvent.modVal === false ? '' : modEvent.modVal);
            modEvent.elem && (res = ELEM_DELIM + modEvent.elem + res);
            return res;
        },

        /**
         * Retrieves the name of an element nested in a block
         * @private
         * @param {Object} elem Nested element
         * @returns {String|undefined}
         */
        _extractElemNameFrom: function _extractElemNameFrom(elem) {},

        /**
         * Executes the block init functions
         * @private
         */
        _runInitFns: function _runInitFns() {
            if (initFns.length) {
                var fns = initFns,
                    fn,
                    i = 0;

                initFns = [];
                while (fn = fns[i]) {
                    fn.call(fns[i + 1]);
                    i += 2;
                }
            }
        }
    });

    provide(BEM);
});
/**
 * @module i-bem
 */
modules.define('i-bem', function (provide, BEM) {
	/**
 * Вызов события на блоке
 * @deprecated Использовать emit
 * @param {String} e Имя события
 * @param {Object} [data] Данные
 * @returns {BEM}
 */
	BEM.prototype.trigger = BEM.emit;

	/**
 * Выполнят колбэк в следующем такте
 * @deprecated использовать nextTick
 * @param {Function} fn Колбэк
 * @returns {BEM}
 */
	BEM.prototype.afterCurrentEvent = BEM.prototype.nextTick;

	// в bem-core отдельный блок i18n. Не используем его, чтобы не менять работу с ключами:
	// скопирован старый элемент i-bem__i18n из более ранней версии и добавлен в глобальную область видимости.
	// Добавляем его здесь в BEM тоже, чтобы в блоках с require['i-bem'] BEM.I18N не стал undefined
	BEM.I18N = window.BEM.I18N;

	provide(BEM);
});
/**
 * @module i-bem__internal
 */

modules.define('i-bem__internal', function (provide) {

    var undef,

    /**
     * Separator for modifiers and their values
     * @const
     * @type String
     */
    MOD_DELIM = '_',


    /**
     * Separator between names of a block and a nested element
     * @const
     * @type String
     */
    ELEM_DELIM = '__',


    /**
     * Pattern for acceptable element and modifier names
     * @const
     * @type String
     */
    NAME_PATTERN = '[a-zA-Z0-9-]+';

    function isSimple(obj) {
        var typeOf = typeof obj === 'undefined' ? 'undefined' : babelHelpers.typeof(obj);
        return typeOf === 'string' || typeOf === 'number' || typeOf === 'boolean';
    }

    function buildModPostfix(modName, modVal) {
        var res = '';
        /* jshint eqnull: true */
        if (modVal != null && modVal !== false) {
            res += MOD_DELIM + modName;
            modVal !== true && (res += MOD_DELIM + modVal);
        }
        return res;
    }

    function buildBlockClass(name, modName, modVal) {
        return name + buildModPostfix(modName, modVal);
    }

    function buildElemClass(block, name, modName, modVal) {
        return buildBlockClass(block, undef, undef) + ELEM_DELIM + name + buildModPostfix(modName, modVal);
    }

    provide( /** @exports */{
        NAME_PATTERN: NAME_PATTERN,

        MOD_DELIM: MOD_DELIM,
        ELEM_DELIM: ELEM_DELIM,

        buildModPostfix: buildModPostfix,

        /**
         * Builds the class of a block or element with a modifier
         * @param {String} block Block name
         * @param {String} [elem] Element name
         * @param {String} [modName] Modifier name
         * @param {String|Number} [modVal] Modifier value
         * @returns {String} Class
         */
        buildClass: function buildClass(block, elem, modName, modVal) {
            if (isSimple(modName)) {
                if (!isSimple(modVal)) {
                    modVal = modName;
                    modName = elem;
                    elem = undef;
                }
            } else if (typeof modName !== 'undefined') {
                modName = undef;
            } else if (elem && typeof elem !== 'string') {
                elem = undef;
            }

            if (!(elem || modName)) {
                // optimization for simple case
                return block;
            }

            return elem ? buildElemClass(block, elem, modName, modVal) : buildBlockClass(block, modName, modVal);
        },

        /**
         * Builds full classes for a buffer or element with modifiers
         * @param {String} block Block name
         * @param {String} [elem] Element name
         * @param {Object} [mods] Modifiers
         * @returns {String} Class
         */
        buildClasses: function buildClasses(block, elem, mods) {
            if (elem && typeof elem !== 'string') {
                mods = elem;
                elem = undef;
            }

            var res = elem ? buildElemClass(block, elem, undef, undef) : buildBlockClass(block, undef, undef);

            if (mods) {
                for (var modName in mods) {
                    if (mods.hasOwnProperty(modName) && mods[modName]) {
                        res += ' ' + (elem ? buildElemClass(block, elem, modName, mods[modName]) : buildBlockClass(block, modName, mods[modName]));
                    }
                }
            }

            return res;
        }
    });
});
/**
 * @module inherit
 * @version 2.2.6
 * @author Filatov Dmitry <dfilatov@yandex-team.ru>
 * @description This module provides some syntax sugar for "class" declarations, constructors, mixins, "super" calls and static members.
 */

(function (global) {

    var noop = function noop() {},
        hasOwnProperty = Object.prototype.hasOwnProperty,
        objCreate = Object.create || function (ptp) {
        var inheritance = function inheritance() {};
        inheritance.prototype = ptp;
        return new inheritance();
    },
        objKeys = Object.keys || function (obj) {
        var res = [];
        for (var i in obj) {
            hasOwnProperty.call(obj, i) && res.push(i);
        }
        return res;
    },
        extend = function extend(o1, o2) {
        for (var i in o2) {
            hasOwnProperty.call(o2, i) && (o1[i] = o2[i]);
        }

        return o1;
    },
        toStr = Object.prototype.toString,
        isArray = Array.isArray || function (obj) {
        return toStr.call(obj) === '[object Array]';
    },
        isFunction = function isFunction(obj) {
        return toStr.call(obj) === '[object Function]';
    },
        needCheckProps = true,
        testPropObj = { toString: '' };

    for (var i in testPropObj) {
        // It's a pity ie hasn't toString, valueOf in for
        testPropObj.hasOwnProperty(i) && (needCheckProps = false);
    }

    var specProps = needCheckProps ? ['toString', 'valueOf'] : null;

    function getPropList(obj) {
        var res = objKeys(obj);
        if (needCheckProps) {
            var specProp,
                i = 0;
            while (specProp = specProps[i++]) {
                obj.hasOwnProperty(specProp) && res.push(specProp);
            }
        }

        return res;
    }

    function override(base, res, add) {
        var addList = getPropList(add),
            j = 0,
            len = addList.length,
            name,
            prop;
        while (j < len) {
            if ((name = addList[j++]) === '__self') {
                continue;
            }
            prop = add[name];
            if (isFunction(prop) && (!prop.prototype || !prop.prototype.__self) && // check to prevent wrapping of "class" functions
            prop.toString().indexOf('.__base') > -1) {
                res[name] = function (name, prop) {
                    var baseMethod = base[name] ? base[name] : name === '__constructor' ? // case of inheritance from plain function
                    res.__self.__parent : noop,
                        result = function result() {
                        var baseSaved = this.__base;

                        this.__base = result.__base;
                        var res = prop.apply(this, arguments);
                        this.__base = baseSaved;

                        return res;
                    };
                    result.__base = baseMethod;

                    return result;
                }(name, prop);
            } else {
                res[name] = prop;
            }
        }
    }

    function applyMixins(mixins, res) {
        var i = 1,
            mixin;
        while (mixin = mixins[i++]) {
            res ? isFunction(mixin) ? inherit.self(res, mixin.prototype, mixin) : inherit.self(res, mixin) : res = isFunction(mixin) ? inherit(mixins[0], mixin.prototype, mixin) : inherit(mixins[0], mixin);
        }
        return res || mixins[0];
    }

    /**
    * Creates class
    * @exports
    * @param {Function|Array} [baseClass|baseClassAndMixins] class (or class and mixins) to inherit from
    * @param {Object} prototypeFields
    * @param {Object} [staticFields]
    * @returns {Function} class
    */
    function inherit() {
        var args = arguments,
            withMixins = isArray(args[0]),
            hasBase = withMixins || isFunction(args[0]),
            base = hasBase ? withMixins ? applyMixins(args[0]) : args[0] : noop,
            props = args[hasBase ? 1 : 0] || {},
            staticProps = args[hasBase ? 2 : 1],
            res = props.__constructor || hasBase && base.prototype && base.prototype.__constructor ? function () {
            return this.__constructor.apply(this, arguments);
        } : hasBase ? function () {
            return base.apply(this, arguments);
        } : function () {};

        if (!hasBase) {
            res.prototype = props;
            res.prototype.__self = res.prototype.constructor = res;
            return extend(res, staticProps);
        }

        extend(res, base);

        res.__parent = base;

        var basePtp = base.prototype,
            resPtp = res.prototype = objCreate(basePtp);

        resPtp.__self = resPtp.constructor = res;

        props && override(basePtp, resPtp, props);
        staticProps && override(base, res, staticProps);

        return res;
    }

    inherit.self = function () {
        var args = arguments,
            withMixins = isArray(args[0]),
            base = withMixins ? applyMixins(args[0], args[0][0]) : args[0],
            props = args[1],
            staticProps = args[2],
            basePtp = base.prototype;

        props && override(basePtp, basePtp, props);
        staticProps && override(base, base, staticProps);

        return base;
    };

    var defineAsGlobal = true;
    /* istanbul ignore next */
    if ((typeof exports === 'undefined' ? 'undefined' : babelHelpers.typeof(exports)) === 'object') {
        module.exports = inherit;
        defineAsGlobal = false;
    }
    /* istanbul ignore next */
    if ((typeof modules === 'undefined' ? 'undefined' : babelHelpers.typeof(modules)) === 'object' && typeof modules.define === 'function') {
        modules.define('inherit', function (provide) {
            provide(inherit);
        });
        defineAsGlobal = false;
    }
    /* istanbul ignore next */
    if (typeof define === 'function') {
        define(function (require, exports, module) {
            module.exports = inherit;
        });
        defineAsGlobal = false;
    }
    /* istanbul ignore next */
    defineAsGlobal && (global.inherit = inherit);
})(this);
/**
 * @module identify
 */

modules.define('identify', function (provide) {

    var counter = 0,
        expando = '__' + +new Date(),
        get = function get() {
        return 'uniq' + ++counter;
    };

    provide(
    /**
     * Makes unique ID
     * @exports
     * @param {Object} obj Object that needs to be identified
     * @param {Boolean} [onlyGet=false] Return a unique value only if it had already been assigned before
     * @returns {String} ID
     */
    function (obj, onlyGet) {
        if (!obj) return get();

        var key = 'uniqueID' in obj ? 'uniqueID' : expando; // Use when possible native uniqueID for elements in IE

        return onlyGet || key in obj ? obj[key] : obj[key] = get();
    });
});
/**
 * @module next-tick
 */

modules.define('next-tick', function (provide) {

    /**
     * Executes given function on next tick.
     * @exports
     * @type Function
     * @param {Function} fn
     */

    var global = this.global,
        fns = [],
        enqueueFn = function enqueueFn(fn) {
        fns.push(fn);
        return fns.length === 1;
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

    /* global process */
    if ((typeof process === 'undefined' ? 'undefined' : babelHelpers.typeof(process)) === 'object' && process.nextTick) {
        // nodejs
        return provide(function (fn) {
            enqueueFn(fn) && process.nextTick(callFns);
        });
    }

    if (global.setImmediate) {
        // ie10
        return provide(function (fn) {
            enqueueFn(fn) && global.setImmediate(callFns);
        });
    }

    if (global.postMessage) {
        // modern browsers
        var isPostMessageAsync = true;
        if (global.attachEvent) {
            var checkAsync = function checkAsync() {
                isPostMessageAsync = false;
            };
            global.attachEvent('onmessage', checkAsync);
            global.postMessage('__checkAsync', '*');
            global.detachEvent('onmessage', checkAsync);
        }

        if (isPostMessageAsync) {
            var msg = '__nextTick' + +new Date(),
                onMessage = function onMessage(e) {
                if (e.data === msg) {
                    e.stopPropagation && e.stopPropagation();
                    callFns();
                }
            };

            global.addEventListener ? global.addEventListener('message', onMessage, true) : global.attachEvent('onmessage', onMessage);

            return provide(function (fn) {
                enqueueFn(fn) && global.postMessage(msg, '*');
            });
        }
    }

    var doc = global.document;
    if ('onreadystatechange' in doc.createElement('script')) {
        // ie6-ie8
        var head = doc.getElementsByTagName('head')[0],
            createScript = function createScript() {
            var script = doc.createElement('script');
            script.onreadystatechange = function () {
                script.parentNode.removeChild(script);
                script = script.onreadystatechange = null;
                callFns();
            };
            head.appendChild(script);
        };

        return provide(function (fn) {
            enqueueFn(fn) && createScript();
        });
    }

    provide(function (fn) {
        // old browsers
        enqueueFn(fn) && global.setTimeout(callFns, 0);
    });
});
/**
 * @module objects
 * @description A set of helpers to work with JavaScript objects
 */

modules.define('objects', function (provide) {

    var hasOwnProp = Object.prototype.hasOwnProperty;

    provide( /** @exports */{
        /**
         * Extends a given target by
         * @param {Object} target object to extend
         * @param {Object} source
         * @returns {Object}
         */
        extend: function extend(target, source) {
            ((typeof target === 'undefined' ? 'undefined' : babelHelpers.typeof(target)) !== 'object' || target === null) && (target = {});

            for (var i = 1, len = arguments.length; i < len; i++) {
                var obj = arguments[i];
                if (obj) {
                    for (var key in obj) {
                        hasOwnProp.call(obj, key) && (target[key] = obj[key]);
                    }
                }
            }

            return target;
        },

        /**
         * Check whether a given object is empty (contains no enumerable properties)
         * @param {Object} obj
         * @returns {Boolean}
         */
        isEmpty: function isEmpty(obj) {
            for (var key in obj) {
                if (hasOwnProp.call(obj, key)) {
                    return false;
                }
            }

            return true;
        },

        /**
         * Generic iterator function over object
         * @param {Object} obj object to iterate
         * @param {Function} fn callback
         * @param {Object} [ctx] callbacks's context
         */
        each: function each(obj, fn, ctx) {
            for (var key in obj) {
                if (hasOwnProp.call(obj, key)) {
                    ctx ? fn.call(ctx, obj[key], key) : fn(obj[key], key);
                }
            }
        }
    });
});
/**
 * @module functions
 * @description A set of helpers to work with JavaScript functions
 */

modules.define('functions', function (provide) {

  var toStr = Object.prototype.toString;

  provide( /** @exports */{
    /**
     * Checks whether a given object is function
     * @param {*} obj
     * @returns {Boolean}
     */
    isFunction: function isFunction(obj) {
      return toStr.call(obj) === '[object Function]';
    },

    /**
     * Empty function
     */
    noop: function noop() {}
  });
});
/**
 * @module events
 */

modules.define('events', ['identify', 'inherit', 'functions'], function (provide, identify, inherit, functions) {

    var undef,
        storageExpando = '__' + +new Date() + 'storage',
        getFnId = function getFnId(fn, ctx) {
        return identify(fn) + (ctx ? identify(ctx) : '');
    },


    /**
     * @class Event
     * @exports events:Event
     */
    Event = inherit( /** @lends Event.prototype */{
        /**
         * @constructor
         * @param {String} type
         * @param {Object} target
         */
        __constructor: function __constructor(type, target) {
            /**
             * Type
             * @member {String}
             */
            this.type = type;

            /**
             * Target
             * @member {Object}
             */
            this.target = target;

            /**
             * Result
             * @member {*}
             */
            this.result = undef;

            /**
             * Data
             * @member {*}
             */
            this.data = undef;

            this._isDefaultPrevented = false;
            this._isPropagationStopped = false;
        },

        /**
         * Prevents default action
         */
        preventDefault: function preventDefault() {
            this._isDefaultPrevented = true;
        },

        /**
         * Returns whether is default action prevented
         * @returns {Boolean}
         */
        isDefaultPrevented: function isDefaultPrevented() {
            return this._isDefaultPrevented;
        },

        /**
         * Stops propagation
         */
        stopPropagation: function stopPropagation() {
            this._isPropagationStopped = true;
        },

        /**
         * Returns whether is propagation stopped
         * @returns {Boolean}
         */
        isPropagationStopped: function isPropagationStopped() {
            return this._isPropagationStopped;
        }
    }),


    /**
     * @lends Emitter
     * @lends Emitter.prototype
     */
    EmitterProps = {
        /**
         * Adds an event handler
         * @param {String} e Event type
         * @param {Object} [data] Additional data that the handler gets as e.data
         * @param {Function} fn Handler
         * @param {Object} [ctx] Handler context
         * @returns {Emitter} this
         */
        on: function on(e, data, fn, ctx, _special) {
            if (typeof e === 'string') {
                if (functions.isFunction(data)) {
                    ctx = fn;
                    fn = data;
                    data = undef;
                }

                var id = getFnId(fn, ctx),
                    storage = this[storageExpando] || (this[storageExpando] = {}),
                    eventTypes = e.split(' '),
                    eventType,
                    i = 0,
                    list,
                    item,
                    eventStorage;

                while (eventType = eventTypes[i++]) {
                    eventStorage = storage[eventType] || (storage[eventType] = { ids: {}, list: {} });
                    if (!(id in eventStorage.ids)) {
                        list = eventStorage.list;
                        item = { fn: fn, data: data, ctx: ctx, special: _special };
                        if (list.last) {
                            list.last.next = item;
                            item.prev = list.last;
                        } else {
                            list.first = item;
                        }
                        eventStorage.ids[id] = list.last = item;
                    }
                }
            } else {
                for (var key in e) {
                    e.hasOwnProperty(key) && this.on(key, e[key], data, _special);
                }
            }

            return this;
        },

        /**
         * Adds a one time handler for the event.
         * Handler is executed only the next time the event is fired, after which it is removed.
         * @param {String} e Event type
         * @param {Object} [data] Additional data that the handler gets as e.data
         * @param {Function} fn Handler
         * @param {Object} [ctx] Handler context
         * @returns {Emitter} this
         */
        once: function once(e, data, fn, ctx) {
            return this.on(e, data, fn, ctx, { once: true });
        },

        /**
         * Removes event handler or handlers
         * @param {String} [e] Event type
         * @param {Function} [fn] Handler
         * @param {Object} [ctx] Handler context
         * @returns {Emitter} this
         */
        un: function un(e, fn, ctx) {
            if (typeof e === 'string' || typeof e === 'undefined') {
                var storage = this[storageExpando];
                if (storage) {
                    if (e) {
                        // if event type was passed
                        var eventTypes = e.split(' '),
                            i = 0,
                            eventStorage;
                        while (e = eventTypes[i++]) {
                            if (eventStorage = storage[e]) {
                                if (fn) {
                                    // if specific handler was passed
                                    var id = getFnId(fn, ctx),
                                        ids = eventStorage.ids;
                                    if (id in ids) {
                                        var list = eventStorage.list,
                                            item = ids[id],
                                            prev = item.prev,
                                            next = item.next;

                                        if (prev) {
                                            prev.next = next;
                                        } else if (item === list.first) {
                                            list.first = next;
                                        }

                                        if (next) {
                                            next.prev = prev;
                                        } else if (item === list.last) {
                                            list.last = prev;
                                        }

                                        delete ids[id];
                                    }
                                } else {
                                    delete this[storageExpando][e];
                                }
                            }
                        }
                    } else {
                        delete this[storageExpando];
                    }
                }
            } else {
                for (var key in e) {
                    e.hasOwnProperty(key) && this.un(key, e[key], fn);
                }
            }

            return this;
        },

        /**
         * Fires event handlers
         * @param {String|events:Event} e Event
         * @param {Object} [data] Additional data
         * @returns {Emitter} this
         */
        emit: function emit(e, data) {
            var storage = this[storageExpando],
                eventInstantiated = false;

            if (storage) {
                var eventTypes = [typeof e === 'string' ? e : e.type, '*'],
                    i = 0,
                    eventType,
                    eventStorage;
                while (eventType = eventTypes[i++]) {
                    if (eventStorage = storage[eventType]) {
                        var item = eventStorage.list.first,
                            lastItem = eventStorage.list.last,
                            res;
                        while (item) {
                            if (!eventInstantiated) {
                                // instantiate Event only on demand
                                eventInstantiated = true;
                                typeof e === 'string' && (e = new Event(e));
                                e.target || (e.target = this);
                            }

                            e.data = item.data;
                            res = item.fn.apply(item.ctx || this, arguments);
                            if (typeof res !== 'undefined') {
                                e.result = res;
                                if (res === false) {
                                    e.preventDefault();
                                    e.stopPropagation();
                                }
                            }

                            item.special && item.special.once && this.un(e.type, item.fn, item.ctx);

                            if (item === lastItem) {
                                break;
                            }

                            item = item.next;
                        }
                    }
                }
            }

            return this;
        }
    },

    /**
     * @class Emitter
     * @exports events:Emitter
     */
    Emitter = inherit(EmitterProps, EmitterProps);

    provide({
        Emitter: Emitter,
        Event: Event
    });
});
/**
 * @module jquery__config
 * @description Configuration for jQuery
 */

modules.define('jquery__config', function (provide) {

  provide( /** @exports */{
    /**
     * URL for loading jQuery if it does not exist
     * @type {String}
     */
    url: 'https://yastatic.net/jquery/2.2.3/jquery.min.js'
  });
});
/**
 * @module jquery__config
 * @description Configuration for jQuery
 */

modules.define('jquery__config', ['ua', 'objects'], function (provide, ua, objects, base) {

    provide(ua.msie && parseInt(ua.version, 10) < 9 ? objects.extend(base, {
        url: 'https://yastatic.net/jquery/1.12.3/jquery.min.js'
    }) : base);
});
modules.define('jquery__config', function (provide) {
	// Считываем домен статики из window, т.к. i-global является рекурсивной зависимостью для jquery
	var staticDomain = this.global.staticDomain || 'https://static.yoomoney.ru';

	provide({
		url: staticDomain + '/files-front/libs/jquery/1.8.3/jquery.min.js'
	});
});
/**
 * @module ua
 * @description Detect some user agent features (works like jQuery.browser in jQuery 1.8)
 * @see http://code.jquery.com/jquery-migrate-1.1.1.js
 */

modules.define('ua', function (provide) {

    var ua = navigator.userAgent.toLowerCase(),
        match = /(chrome)[ \/]([\w.]+)/.exec(ua) || /(webkit)[ \/]([\w.]+)/.exec(ua) || /(opera)(?:.*version|)[ \/]([\w.]+)/.exec(ua) || /(msie) ([\w.]+)/.exec(ua) || ua.indexOf('compatible') < 0 && /(mozilla)(?:.*? rv:([\w.]+)|)/.exec(ua) || [],
        matched = {
        browser: match[1] || '',
        version: match[2] || '0'
    },
        browser = {};

    if (matched.browser) {
        browser[matched.browser] = true;
        browser.version = matched.version;
    }

    if (browser.chrome) {
        browser.webkit = true;
    } else if (browser.webkit) {
        browser.safari = true;
    }

    /**
     * @exports
     * @type Object
     */
    provide(browser);
});
/**
 * @module dom
 * @description some DOM utils
 */

modules.define('dom', ['jquery'], function (provide, $) {

    provide( /** @exports */{
        /**
         * Checks whether a DOM elem is in a context
         * @param {jQuery} ctx DOM elem where check is being performed
         * @param {jQuery} domElem DOM elem to check
         * @returns {Boolean}
         */
        contains: function contains(ctx, domElem) {
            var res = false;

            domElem.each(function () {
                var domNode = this;
                do {
                    if (~ctx.index(domNode)) return !(res = true);
                } while (domNode = domNode.parentNode);

                return res;
            });

            return res;
        },

        /**
         * Returns current focused DOM elem in document
         * @returns {jQuery}
         */
        getFocused: function getFocused() {
            // "Error: Unspecified error." in iframe in IE9
            try {
                return $(document.activeElement);
            } catch (e) {}
        },

        /**
         * Checks whether a DOM element contains focus
         * @param {jQuery} domElem
         * @returns {Boolean}
         */
        containsFocus: function containsFocus(domElem) {
            return this.contains(domElem, this.getFocused());
        },

        /**
        * Checks whether a browser currently can set focus on DOM elem
        * @param {jQuery} domElem
        * @returns {Boolean}
        */
        isFocusable: function isFocusable(domElem) {
            var domNode = domElem[0];

            if (!domNode) return false;
            if (domNode.hasAttribute('tabindex')) return true;

            switch (domNode.tagName.toLowerCase()) {
                case 'iframe':
                    return true;

                case 'input':
                case 'button':
                case 'textarea':
                case 'select':
                    return !domNode.disabled;

                case 'a':
                    return !!domNode.href;
            }

            return false;
        },

        /**
        * Checks whether a domElem is intended to edit text
        * @param {jQuery} domElem
        * @returns {Boolean}
        */
        isEditable: function isEditable(domElem) {
            var domNode = domElem[0];

            if (!domNode) return false;

            switch (domNode.tagName.toLowerCase()) {
                case 'input':
                    var type = domNode.type;
                    return (type === 'text' || type === 'password') && !domNode.disabled && !domNode.readOnly;

                case 'textarea':
                    return !domNode.disabled && !domNode.readOnly;

                default:
                    return domNode.contentEditable === 'true';
            }
        }
    });
});
/**
 * @module i-bem__dom_init
 */

modules.define('i-bem__dom_init', ['i-bem__dom'], function (provide, BEMDOM) {

  provide(
  /**
   * Initializes blocks on a fragment of the DOM tree
   * @exports
   * @param {jQuery} [ctx=scope] Root DOM node
   * @returns {jQuery} ctx Initialization context
   */
  function (ctx) {
    return BEMDOM.init(ctx);
  });
});
/**
 * @module querystring__uri
 * @description A set of helpers to work with URI
 */

modules.define('querystring__uri', function (provide) {

    // Equivalency table for cp1251 and utf8.
    var map = { '%D0': '%D0%A0', '%C0': '%D0%90', '%C1': '%D0%91', '%C2': '%D0%92', '%C3': '%D0%93', '%C4': '%D0%94', '%C5': '%D0%95', '%A8': '%D0%81', '%C6': '%D0%96', '%C7': '%D0%97', '%C8': '%D0%98', '%C9': '%D0%99', '%CA': '%D0%9A', '%CB': '%D0%9B', '%CC': '%D0%9C', '%CD': '%D0%9D', '%CE': '%D0%9E', '%CF': '%D0%9F', '%D1': '%D0%A1', '%D2': '%D0%A2', '%D3': '%D0%A3', '%D4': '%D0%A4', '%D5': '%D0%A5', '%D6': '%D0%A6', '%D7': '%D0%A7', '%D8': '%D0%A8', '%D9': '%D0%A9', '%DA': '%D0%AA', '%DB': '%D0%AB', '%DC': '%D0%AC', '%DD': '%D0%AD', '%DE': '%D0%AE', '%DF': '%D0%AF', '%E0': '%D0%B0', '%E1': '%D0%B1', '%E2': '%D0%B2', '%E3': '%D0%B3', '%E4': '%D0%B4', '%E5': '%D0%B5', '%B8': '%D1%91', '%E6': '%D0%B6', '%E7': '%D0%B7', '%E8': '%D0%B8', '%E9': '%D0%B9', '%EA': '%D0%BA', '%EB': '%D0%BB', '%EC': '%D0%BC', '%ED': '%D0%BD', '%EE': '%D0%BE', '%EF': '%D0%BF', '%F0': '%D1%80', '%F1': '%D1%81', '%F2': '%D1%82', '%F3': '%D1%83', '%F4': '%D1%84', '%F5': '%D1%85', '%F6': '%D1%86', '%F7': '%D1%87', '%F8': '%D1%88', '%F9': '%D1%89', '%FA': '%D1%8A', '%FB': '%D1%8B', '%FC': '%D1%8C', '%FD': '%D1%8D', '%FE': '%D1%8E', '%FF': '%D1%8F' };

    function convert(str) {
        // Symbol code in cp1251 (hex) : symbol code in utf8)
        return str.replace(/%.{2}/g, function ($0) {
            return map[$0] || $0;
        });
    }

    function decode(fn, str) {
        var decoded = '';

        // Try/catch block for getting the encoding of the source string.
        // Error is thrown if a non-UTF8 string is input.
        // If the string was not decoded, it is returned without changes.
        try {
            decoded = fn(str);
        } catch (e1) {
            try {
                decoded = fn(convert(str));
            } catch (e2) {
                decoded = str;
            }
        }

        return decoded;
    }

    provide( /** @exports */{
        /**
         * Decodes URI string
         * @param {String} str
         * @returns {String}
         */
        decodeURI: function (_decodeURI) {
            function decodeURI(_x) {
                return _decodeURI.apply(this, arguments);
            }

            decodeURI.toString = function () {
                return _decodeURI.toString();
            };

            return decodeURI;
        }(function (str) {
            return decode(decodeURI, str);
        }),

        /**
         * Decodes URI component string
         * @param {String} str
         * @returns {String}
         */
        decodeURIComponent: function (_decodeURIComponent) {
            function decodeURIComponent(_x2) {
                return _decodeURIComponent.apply(this, arguments);
            }

            decodeURIComponent.toString = function () {
                return _decodeURIComponent.toString();
            };

            return decodeURIComponent;
        }(function (str) {
            return decode(decodeURIComponent, str);
        })
    });
});
/**
 * @module stat-scripts
 */
modules.define('stat-scripts', ['i-bem__dom', 'lodash'], function (provide, BEMDOM, _) {
	/**
  * @exports
  * @class stat-scripts
  * @bem
  */
	provide(BEMDOM.decl(this.name, /** @lends stat-scripts.prototype */{
		onSetMod: {
			js: function js() {
				var _this = this;

				var scriptList = _.values(this.params);

				var callbackList = {
					ga: this.startGoogleAnalytics,
					gtm: this.startGoogleTagManager,
					visualdna: this.startVisualDNA,
					yametrics: this.startYandexMetrics,
					vk: this.startVkMetrics,
					mytarget: this.startMyTargetMetrics,
					rutarget: this.startRutargetclickMetrics,
					doubleclick: this.startDoubleclickMetrics
				};

				scriptList.forEach(function (scriptName) {
					if (_.has(callbackList, scriptName)) {
						callbackList[scriptName].call(_this);
					}
				});
			}
		}
	}));
});
/**
 * @module stat-scripts
 */
modules.define('stat-scripts', ['i-bem__dom'], function (provide, BEMDOM) {
	/**
  * @exports
  * @class stat-scripts
  * @bem
  */
	provide(BEMDOM.decl(this.name, /** @lends stat-scripts.prototype */{
		/**
   * Запуск сессии gtag
   * @public
   */
		startGoogleAnalytics: function startGoogleAnalytics() {
			this._globalParams = this.findBlockOutside('i-global').params;
			this._gaAppId = this._globalParams.gaAppId || 'UA-19216811-1';

			if (typeof window.gtag === 'undefined') {
				var gtag = document.createElement('script');
				gtag.type = 'text/javascript';
				gtag.async = true;
				gtag.src = 'https://www.googletagmanager.com/gtag/js?id=' + this._gaAppId;
				var s = document.getElementsByTagName('script')[0];
				s.parentNode.insertBefore(gtag, s);
			}

			window.dataLayer = window.dataLayer || [];
			/**
    * Отложенное выполнение после загрузки скрипта
    */
			window.gtag = function () {
				window.dataLayer.push(arguments);
			};

			window.gtag('js', new Date());
			window.gtag('config', this._gaAppId);
		},
		gtagEvent: function gtagEvent(eventName, eventParams) {
			window.gtag('event', eventName, eventParams);
		}
	}));
});
/**
 * @module stat-scripts
 */
modules.define('stat-scripts', ['i-bem__dom'], function (provide, BEMDOM) {
	/**
  * @exports
  * @class stat-scripts
  * @bem
  */
	provide(BEMDOM.decl(this.name, /** @lends stat-scripts.prototype */{
		/**
   * Запуск сессии GoogleTagManager
   */
		startGoogleTagManager: function startGoogleTagManager() {
			this._globalParams = this.findBlockOutside('i-global').params;
			this.gtmAppId = this._globalParams.gtmAppId;

			(function (w, d, s, l, i) {
				w[l] = w[l] || [];
				w[l].push({
					'gtm.start': new Date().getTime(),
					event: 'gtm.js'
				});
				var f = d.getElementsByTagName(s)[0];
				var j = d.createElement(s);
				var dl = l === 'dataLayer' ? '' : '&l=' + l;

				j.async = true;
				j.src = 'https://www.googletagmanager.com/gtm.js?id=' + i + dl;
				f.parentNode.insertBefore(j, f);
			})(window, document, 'script', 'dataLayer', this.gtmAppId);
		}
	}));
});
/**
 * @module stat-scripts
 */
modules.define('stat-scripts', ['i-bem__dom'], function (provide, BEMDOM) {
	/**
  * @exports
  * @class stat-scripts
  * @bem
  */
	provide(BEMDOM.decl(this.name, /** @lends stat-scripts.prototype */{

		/**
   * Запуск сессии VisualDNA
   * @public
   */
		startVisualDNA: function startVisualDNA() {
			(function () {
				var s;
				var e;
				s = document.createElement('script');
				s.type = 'text/javascript';
				s.src = '//a1.vdna-assets.com/analytics.js';
				s.async = true;
				e = document.getElementsByTagName('body')[0];
				e.insertBefore(s, e.lastChild);
				this.VDNA = this.VDNA || {};
				this.VDNA.queue = this.VDNA.queue || [];
			})();

			// eslint-disable-next-line
			VDNA.queue.push({
				apiKey: 'yandexmoney1393582641971',
				method: 'reportPageView'
			});
		}
	}));
});
/**
 * @module lodash
 */
modules.define('lodash', function (provide) {
	provide(window._);
});
/**
 * @module stat-scripts
 */
modules.define('stat-scripts', ['i-bem__dom'], function (provide, BEMDOM) {
	/**
  * @exports
  * @class stat-scripts
  * @bem
  */
	provide(BEMDOM.decl(this.name, /** @lends stat-scripts.prototype */{
		/**
   * Создание сессии метрики, подгрузка скрипта, инициализация.
   * @public
   */
		startRutargetclickMetrics: function startRutargetclickMetrics() {
			setTimeout(function () {
				(function (w, d, s, p) {
					var f = d.getElementsByTagName(s)[0];
					var j = d.createElement(s);
					j.async = true;
					j.src = '//cdn.rutarget.ru/static/tag/tag.js';
					f.parentNode.insertBefore(j, f);
					w[p] = {
						rtgNoSync: false,
						rtgSyncFrame: true
					};
				})(window, document, 'script', '_rtgParams');
			}, 0);
		},


		/**
   * Пуш события
   *
   * @public
   * @param {Object} eventObj Объект события
   */
		ruTargetPushEvent: function ruTargetPushEvent(eventObj) {
			var rutargetScript = window._rutarget;
			rutargetScript && rutargetScript.push(eventObj);
		}
	}));
});
/**
 * @module stat-scripts
 */
modules.define('stat-scripts', ['i-bem__dom'], function (provide, BEMDOM) {
	/**
  * @exports
  * @class stat-scripts
  * @bem
  */
	provide(BEMDOM.decl(this.name, /** @lends stat-scripts.prototype */{
		/**
   * Создание сессии метрики, подгрузка скрипта, инициализация.
   * @public
   */
		startDoubleclickMetrics: function startDoubleclickMetrics() {
			this._globalParams = this.findBlockOutside('i-global').params;
			this._doubleclickAppId = this._globalParams.doubleclickAppId;

			if (!this._doubleclickAppId) {
				return;
			}

			var axel = Math.random().toString();
			var a = axel * 10000000000000;
			var src = 'https://8239911.fls.doubleclick.net/activityi;' + ('src=8239911;type=invmedia;cat=' + this._doubleclickAppId + ';') + ('dc_lat=;dc_rdid=;tag_for_child_directed_treatment=;ord=' + a + '?');

			(function (w, d) {
				var iframe = d.createElement('iframe');
				iframe.src = src;
				iframe.width = '1';
				iframe.height = '1';
				iframe.frameborder = '0';
				iframe.style = 'display:none';

				var el = document.getElementsByTagName('body')[0];
				el.insertBefore(iframe, el.firstChild);
			})(window, document);
		}
	}));
});
modules.define('navigation-timing', ['i-bem__dom', 'lodash', 'jquery'], function (provide, BEMDOM, _, $) {
	provide(BEMDOM.decl(this.name, {
		onSetMod: {
			js: function js() {
				/**
     * Максимально допустимая длина для метрики.
     * https://jira.yamoney.ru/browse/FRONTEND-46
     *
     * @private
     * @type {Number}
     */
				this._METRIC_MAX_LENGTH = 6;

				/**
     * Процент заходов, которые покрываются метрикой
     * https://jira.yamoney.ru/browse/FRONTEND-1823
     *
     * @private
     * @type {Number}
     */
				this._METRIC_COVERING_PERCENT = 5;

				window.performance && this._needMetricSend() && this._send();
			}
		},

		/**
   * Возвращает целое случайное число между min (включительно) и max (включительно)
   *
   * @param {Number} min Минимальное число
   * @param {Number} max Максимальное число
   * @private
   * @returns {Number}
   */
		_getRandomNumber: function _getRandomNumber(min, max) {
			return Math.floor(Math.random() * (max + 1 - min) + min);
		},


		/**
   * Возвращает, нужно ли отправлять метрику
   *
   * @private
   * @returns {Boolean}
   */
		_needMetricSend: function _needMetricSend() {
			return this._getRandomNumber(1, 100) <= this._METRIC_COVERING_PERCENT;
		},


		/**
   * Вычисляет метрики этапов загрузки и отрисовки страниц в браузерах.
   * https://jira.yamoney.ru/browse/QWEB-18540
   *
   * @public
   * @returns {object}
   */
		getTimingData: function getTimingData() {
			var data = {
				path: this.params.urlPath,
				platform: this.params.platform,
				// eslint-disable-next-line camelcase
				loadEventEnd_domLoading: performance.timing.loadEventEnd - performance.timing.domLoading,
				// eslint-disable-next-line camelcase
				loadEventEnd_navigationStart: performance.timing.loadEventEnd - performance.timing.navigationStart
			};

			if (window.chrome && window.chrome.loadTimes || performance.timing.msFirstPaint) {
				var firstPaintTime = performance.timing.msFirstPaint || Math.floor(window.chrome.loadTimes().firstPaintTime) * 1000;
				// eslint-disable-next-line camelcase
				data.firstPaintTime_navigationStart = firstPaintTime - performance.timing.navigationStart;
				// eslint-disable-next-line camelcase
				data.firstPaintTime_domLoading = firstPaintTime - performance.timing.domLoading;
			}
			return data;
		},


		/**
   * Фильтрует метрики
   * https://jira.yamoney.ru/browse/FRONTEND-46
   *
   * @param {object} data Данные метрики
   * @public
   * @returns {object}
   */
		filterTimingMetrics: function filterTimingMetrics(data) {
			var _this = this;

			return _.omitBy(data, function (value) {
				var isMoreThenMax = _.isNumber(value) && value.toString().length >= _this._METRIC_MAX_LENGTH;
				var isLessThenZero = value < 0;
				return isMoreThenMax || isLessThenZero;
			});
		},


		/**
   * Отправляет данные времени загрузки на ajax ручку.
   *
   * В момент отправки запроса со статистикой нужно, чтобы все этапы были пройдены (чтобы иметь числа), поэтому
   * вешаемся на onload (jQuery.load и BEMDOM.init недостаточно, т.к. могут сработать на domContentLoaded)
   *
   * @public
   */
		_send: function _send() {
			var _this2 = this;

			/**
    * Функция отправки запроса
    */
			var handler = function handler() {
				// loadEventEnd тоже нужен, поэтому выполняем в следующем такте
				setTimeout(function () {
					$.ajax({
						url: '/ajax/push-navigation-timing',
						data: _this2.filterTimingMetrics(_this2.getTimingData())
					});
				}, 0);
			};

			// Если document.readyState === 'complete', выполняем функцию отправки запроса сразу.
			// https://jira.yamoney.ru/browse/QWEB-17580
			if (document.readyState === 'complete') {
				handler();
			} else {
				window.onload = handler;
			}
		}
	}));
});
/**
 * @module link
 */

modules.define('link', ['i-bem__dom', 'control', 'events'], function (provide, BEMDOM, Control, events) {

    /**
     * @exports
     * @class link
     * @augments control
     * @bem
     */
    provide(BEMDOM.decl({ block: this.name, baseBlock: Control }, /** @lends link.prototype */{
        onSetMod: {
            'js': {
                'inited': function inited() {
                    this._url = this.params.url || this.domElem.attr('href');

                    this.hasMod('disabled') && this.domElem.removeAttr('href');
                }
            },

            'disabled': {
                'true': function _true() {
                    this.__base.apply(this, arguments);
                    this.domElem.removeAttr('href').attr('aria-disabled', true);
                },

                '': function _() {
                    this.__base.apply(this, arguments);
                    this.domElem.attr('href', this._url).removeAttr('aria-disabled');
                }
            }
        },

        /**
         * Returns url
         * @returns {String}
         */
        getUrl: function getUrl() {
            return this._url;
        },

        /**
         * Sets url
         * @param {String} url
         * @returns {link} this
         */
        setUrl: function setUrl(url) {
            this._url = url;
            this.hasMod('disabled') || this.domElem.attr('href', url);
            return this;
        },

        _onPointerClick: function _onPointerClick(e) {
            if (this.hasMod('disabled')) {
                e.preventDefault();
            } else {
                var event = new events.Event('click');
                this.emit(event);
                event.isDefaultPrevented() && e.preventDefault();
            }
        }
    }, /** @lends link */{
        live: function live() {
            this.liveBindTo('control', 'pointerclick', this.prototype._onPointerClick);
            return this.__base.apply(this, arguments);
        }
    }));
});
/**
 * @module keyboard__codes
 */
modules.define('keyboard__codes', function (provide) {

    provide( /** @exports */{
        /** @type {Number} */
        BACKSPACE: 8,
        /** @type {Number} */
        TAB: 9,
        /** @type {Number} */
        ENTER: 13,
        /** @type {Number} */
        CAPS_LOCK: 20,
        /** @type {Number} */
        ESC: 27,
        /** @type {Number} */
        SPACE: 32,
        /** @type {Number} */
        PAGE_UP: 33,
        /** @type {Number} */
        PAGE_DOWN: 34,
        /** @type {Number} */
        END: 35,
        /** @type {Number} */
        HOME: 36,
        /** @type {Number} */
        LEFT: 37,
        /** @type {Number} */
        UP: 38,
        /** @type {Number} */
        RIGHT: 39,
        /** @type {Number} */
        DOWN: 40,
        /** @type {Number} */
        INSERT: 45,
        /** @type {Number} */
        DELETE: 46
    });
});
/**
 * @module control
 */

modules.define('control', ['i-bem__dom', 'dom', 'next-tick'], function (provide, BEMDOM, dom, nextTick) {

    /**
     * @exports
     * @class control
     * @abstract
     * @bem
     */
    provide(BEMDOM.decl(this.name, /** @lends control.prototype */{
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
                    this._focused = dom.containsFocus(this.elem('control'));
                    this._focused ?
                    // if control is already in focus, we need to force _onFocus
                    this._onFocus() :
                    // if block already has focused mod, we need to focus control
                    this.hasMod('focused') && this._focus();

                    this._tabIndex = typeof this.params.tabIndex !== 'undefined' ? this.params.tabIndex : this.elem('control').attr('tabindex');

                    if (this.hasMod('disabled') && this._tabIndex !== 'undefined') this.elem('control').removeAttr('tabindex');
                }
            },

            'focused': {
                'true': function _true() {
                    this._focused || this._focus();
                },

                '': function _() {
                    this._focused && this._blur();
                }
            },

            'disabled': {
                'true': function _true() {
                    this.elem('control').attr('disabled', true);
                    this.delMod('focused');
                    typeof this._tabIndex !== 'undefined' && this.elem('control').removeAttr('tabindex');
                },

                '': function _() {
                    this.elem('control').removeAttr('disabled');
                    typeof this._tabIndex !== 'undefined' && this.elem('control').attr('tabindex', this._tabIndex);
                }
            }
        },

        /**
         * Returns name of control
         * @returns {String}
         */
        getName: function getName() {
            return this.elem('control').attr('name') || '';
        },

        /**
         * Returns control value
         * @returns {String}
         */
        getVal: function getVal() {
            return this.elem('control').val();
        },

        _onFocus: function _onFocus() {
            this._focused = true;
            this.setMod('focused');
        },

        _onBlur: function _onBlur() {
            this._focused = false;
            this.delMod('focused');
        },

        _focus: function _focus() {
            dom.isFocusable(this.elem('control')) ? this.elem('control').focus() : this._onFocus(); // issues/1456
        },

        _blur: function _blur() {
            // force both `blur` and `_onBlur` for FF which can have disabled element as `document.activeElement`
            this.elem('control').blur();
            this._onBlur();
        }
    }, /** @lends control */{
        live: function live() {
            this.liveBindTo('control', 'focusin', function () {
                this._focused || this._onFocus(); // to prevent double call of _onFocus in case of init by focus
            }).liveBindTo('control', 'focusout', this.prototype._onBlur);

            var focused = dom.getFocused();
            if (focused.hasClass(this.buildClass('control'))) {
                var _this = this; // TODO: https://github.com/bem/bem-core/issues/425
                nextTick(function () {
                    if (focused[0] === dom.getFocused()[0]) {
                        var block = focused.closest(_this.buildSelector());
                        block && block.bem(_this.getName());
                    }
                });
            }
        }
    }));
});
/** @module control */

modules.define('control', function (provide, Control) {

    provide(Control.decl({
        beforeSetMod: {
            'hovered': {
                'true': function _true() {
                    return !this.hasMod('disabled');
                }
            }
        },

        onSetMod: {
            'disabled': {
                'true': function _true() {
                    this.__base.apply(this, arguments);
                    this.delMod('hovered');
                }
            },

            'hovered': {
                'true': function _true() {
                    this.bindTo('mouseleave', this._onMouseLeave);
                },

                '': function _() {
                    this.unbindFrom('mouseleave', this._onMouseLeave);
                }
            }
        },

        _onMouseOver: function _onMouseOver() {
            this.setMod('hovered');
        },

        _onMouseLeave: function _onMouseLeave() {
            this.delMod('hovered');
        }
    }, {
        live: function live() {
            return this.liveBindTo('mouseover', this.prototype._onMouseOver).__base.apply(this, arguments);
        }
    }));
});
/**
 * @module link
 */

modules.define('link', ['keyboard__codes'], function (provide, keyCodes, Link) {

    /**
     * @exports
     * @class link
     * @bem
     */
    provide(Link.decl({ modName: 'pseudo', modVal: true }, /** @lends link.prototype */{
        onSetMod: {
            'focused': {
                'true': function _true() {
                    this.__base.apply(this, arguments);

                    this.bindTo('control', 'keydown', this._onKeyDown);
                },
                '': function _() {
                    this.__base.apply(this, arguments);

                    this.unbindFrom('control', 'keydown', this._onKeyDown);
                }
            }
        },

        _onPointerClick: function _onPointerClick(e) {
            e.preventDefault();

            this.__base.apply(this, arguments);
        },

        _onKeyDown: function _onKeyDown(e) {
            e.keyCode === keyCodes.ENTER && this._onPointerClick(e);
        }
    }));
});
/**
 * @module form
 */
modules.define('form', ['i-bem__dom', 'BEMHTML', 'keycodes', 'lodash', 'jquery', 'next-tick'], function (provide, BEMDOM, BEMHTML, keycodes, _, $, nextTick) {
	/**
  * @exports
  * @class form
  * @bem
  */
	provide(BEMDOM.decl(this.name, /** @lends form.prototype */{

		/**
   * @event submit Генерируется при сабмите формы (непосредственно перед переходом на страницу action).
   */

		/**
   * @event beforeSubmit Генерируется перед отправкой, чтобы желающие успели остановить событие.
   * @event beforeSubmit Обработчик события может провалидировать произвольные поля самостоятельно
   * @event beforeSubmit и вернуть результат валидации через data-поле customValidationFailed.
   */

		/**
   * @event afterValidation Генерируется после успешного прохождения валидации.
   */

		/**
   * @event afterValidationFail Генерируется после неудачного прохождения валидации.
   */

		/**
   * @event beforeAjax Генерируется перед отправкой ajax запроса.
   */

		onSetMod: {
			js: {
				inited: function inited() {
					// Вешаем обработчик на сабмит формы
					this.bindTo('submit', this._onSubmit);

					/**
      * Блок b-page, используется в методе refreshPage для перерисовки тултипов
      * @private
      * @type {BEM}
      */
					this._bPage = this.findBlockOutside('b-page');
					/**
      * Блок page-layout, используется для обновления содержимого страницы
      * @public
      * @type {BEM}
      */
					this.bPageLayout = this.findBlockOutside('page-layout');

					/**
      * Дополнительные допустимые для валидации блоки
      * @private
      * @type {Array}
      */
					this._allowedValidationBlocks = this.params.allowedValidationBlocks || [];

					/**
      * Фонарь на форме
      * @private
      * @type {Jquery}
      */
					this._lantern = null;
				}
			},

			disabled: {
				yes: function yes() {
					this.setMod('disabled');
				}
			}
		},

		/**
   * Обработчик DOM-события `submit` на форме
   *
   * @param {Object} e событие
   * @returns {Boolean}
   * @private
   */
		_onSubmit: function _onSubmit(e) {
			// Признак валидности формы
			var isValidForm = true;
			// Признак ajax-формы
			var isAjaxForm = this.hasMod('ajax', 'yes');
			var formHasValidation = this.hasMod('validation', 'yes');

			/**
    * Генерируем событие "перед отправкой", чтобы желающие успели остановить событие.
    * Обработчик события может провалидировать произвольные поля самостоятельно
    * и вернуть результат валидации через data-поле customValidationFailed.
    */
			var beforeSubmitEventData = {
				originalEvent: e,
				customValidationFailed: false
			};
			this.emit('beforeSubmit', beforeSubmitEventData);
			if (e.isDefaultPrevented()) {
				return false;
			}
			if (beforeSubmitEventData.customValidationFailed) {
				isValidForm = false;
			}
			if (formHasValidation) {
				this.hideErrors(this.domElem);
				// Сначала запускаем валидацию, а потом объединяем её результат с имеющимся.
				isValidForm = this.validate() && isValidForm;
			}

			// Генерируем событие "после валидации",
			// чтобы желающие могли выполнить необходимые действия.
			if (formHasValidation) {
				var eventAfter = isValidForm ? 'afterValidation' : 'afterValidationFail';
				this.emit(eventAfter, { originalEvent: e });
				// Сабмит можно остановить в этом методе.
				if (e.isDefaultPrevented()) {
					return false;
				}
			}

			if (isAjaxForm && isValidForm) {
				// Генерируем событие "перед аяксом", чтобы желающие могли выполнить необходимые действия.
				this.emit('beforeAjax', { originalEvent: e });
				// Сабмит можно остановить в этом методе.
				if (e.isDefaultPrevented()) {
					return false;
				}

				// QWEB-15732: При наличии признака перед отправкой аякса добавляем в историю состояние страницы
				if (this.params.saveHistory) {
					this._saveHistory();
				}

				this.sendAjaxRequest();
			}

			// Сабмитим только валидную форму без модификатора ajax
			var isSubmitted = isValidForm && !isAjaxForm;
			if (isSubmitted) {
				this.emit('submit');
				return true;
			}

			return false;
		},


		/**
   * Сохранение состояния страницы в историю браузера
   * @private
   */
		_saveHistory: function _saveHistory() {
			// Содержимое формы
			var content = {
				mainContent: this.domElem[0].outerHTML
			};

			// Содержимое правой колонки страницы, если она есть
			var $rightColumn = this.bPageLayout.elem('right-column');
			if ($rightColumn.length) {
				content.rightColumn = $rightColumn[0].innerHTML;
			}

			history.pushState(content, null);
		},


		/**
   * Триггерит событие изменения страницы для перерисовки тултипов
   * @public
   */
		refreshPage: function refreshPage() {
			this._bPage.emit('change');
		},


		/**
   * Скрывает подсказки об ошибках внутри заданного блока
   * @public
   * @param {Object} block блок, внутри которого нужно скрыть подсказки
   */
		hideErrors: function hideErrors(block) {
			var _this2 = this;

			var parentBlock = block || this.domElem;

			var allowedBlocks = ['input', 'select'].concat(this._allowedValidationBlocks);

			_.forEach(allowedBlocks, function (blockName) {
				var blocks = _this2.findBlocksInside(parentBlock, blockName);
				blocks && _.forEach(blocks, function (itemBlock) {
					itemBlock.hideErrorTip();
				});
			});
		},


		/**
   * Обновляет содержимое колонок main-content и right-column
   * @public
   * @param {Object} data Объект с содержимым колонок { mainContent: html, rightColumn: html }
   */
		updateContent: function updateContent(data) {
			if (!this.bPageLayout) {
				return;
			}
			var bPageLayout = this.bPageLayout;
			var $rightColumn = bPageLayout.elem('right-column');
			var $contentWrap = bPageLayout.elem('main-content');

			if (!data || !data.mainContent) {
				return;
			}
			// Для разных раскладок страницы разная "обертка" контента

			$contentWrap[0].innerHTML = data.mainContent;

			if ($rightColumn.length) {
				$rightColumn[0].innerHTML = data.rightColumn;
			}
		},


		/**
   * Отрисовка фонаря на форме. Если фонарь уже отрисован, то заменяем в нем содержимое
   * @public
   * @param {Object} options Объект с параметрами
   * @param {BEMJSON} options.content bemjson содержимого фонаря
   */
		drawLantern: function drawLantern(options) {
			var lanternBemjson = this._getLanternSectionBemjson(options);
			var $lantern = $(BEMHTML.apply(lanternBemjson));

			if (this._lantern) {
				this._lantern.replaceWith($lantern);
				this._lantern = $lantern;
			} else {
				this._lantern = $lantern.prependTo(this.domElem);
			}
			this.refreshPage();
		},


		/**
   * Скрытие блока фонаря на форме, если он был отрисован
   * @public
   */
		hideLantern: function hideLantern() {
			var bLantern = this.findBlockInside('lantern');

			if (bLantern) {
				bLantern.setMod('hidden', 'yes');
			}
			this.refreshPage();
		},


		/**
   * Получение bemjson секции с фонарем (@todo Добавить параметры с настройками фонаря (theme, indent))
   * @param {Object} options Объект с параметрами
   * @param {BEMJSON} options.content bemjson содержимого фонаря
   * @param {String} [options.theme] Задает значение модификатора theme блока lantern. По умолчанию 'alert'
   * @param {String} [options.padding] Задает значение модификатора padding блока lantern.
   * @returns {BEMJSON}
   * @private
   */
		_getLanternSectionBemjson: function _getLanternSectionBemjson(options) {
			return {
				block: 'lantern',
				mods: {
					theme: options.theme ? options.theme : 'alert',
					padding: options.padding ? options.padding : ''
				},
				content: options.content
			};
		},


		/**
   * Метод, выставляет кнопке submit свойство disabled, если пришел параметр true
   *
   * @param {Boolean} noPay - флаг, нужно ли блокировать кнопку
   */
		toggleDisableButton: function toggleDisableButton(noPay) {
			noPay = noPay || false;
			this.findBlockInside('button').toggleMod('disabled', true, noPay);
		},


		/**
   * Переключение видимости раздела формы с дизейблом контролов
   *
   * @public
   * @param {String|JQuery} ctrlName Название контрола формы с разделом
   * @param {boolean} toggleCond Условие переключения (true - показать, false - скрыть)
   * @param {boolean} [useCache=true] Признак использования кэширующего поиска элемента
   */
		toggleFormSection: function toggleFormSection(ctrlName, toggleCond) {
			var useCache = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

			var $section = this._getSectionByName(ctrlName, useCache);

			// При скрытии сперва очистим все результаты валидации
			if (!toggleCond) {
				this._cleanSectionValidation($section);
			}

			// При отображении сначала показываем раздел, потом раздизейбливаем
			// только видимые контролы (скрытые оставляем задизейбленными)
			if (toggleCond) {
				this.delMod($section, 'hidden', 'yes');
			}
			$section.find('.input:visible').each(function () {
				$(this).bem('input').toggleMod('disabled', true, !toggleCond).hideErrorTip();
			});
			$section.find('.month-picker:visible').each(function () {
				$(this).bem('month-picker').toggleMod('disabled', true, !toggleCond);
			});
			$section.find('.date-picker:visible').each(function () {
				$(this).bem('date-picker').toggleMod('disabled', true, !toggleCond);
			});
			$section.find('.select:visible').each(function () {
				$(this).bem('select').toggleMod('disabled', true, !toggleCond);
			});
			$section.find('.checkbox:visible').each(function () {
				$(this).bem('checkbox').toggleMod('disabled', true, !toggleCond);
			});
			$section.find('.radio:visible').each(function () {
				$(this).bem('radio').toggleMod('disabled', true, !toggleCond);
			});
			$section.find('.tumbler:visible').each(function () {
				$(this).bem('tumbler').toggleMod('disabled', true, !toggleCond);
			});
			// При скрытии сначала дизейблим только видимые контролы, потом скрываем раздел
			if (!toggleCond) {
				this.setMod($section, 'hidden', 'yes');
			}
		},


		/**
   * Удаляет результаты валидации контролов раздела формы
   *
   * @public
   * @param {String|JQuery} ctrlName Название контрола формы с разделом
   * @param {boolean} [useCache=true] Признак использования кэширующего поиска элемента
   */
		cleanValidationOnFormSection: function cleanValidationOnFormSection(ctrlName) {
			var useCache = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

			var $section = this._getSectionByName(ctrlName, useCache);
			this._cleanSectionValidation($section);
		},


		/**
   * Получение секции по имени контрола
   *
   * @private
   * @param {String|JQuery} ctrlName Название контрола формы
   * @param {boolean} [useCache=true] Признак использования кэширующего поиска элемента
   * @returns {JQuery}
   */
		_getSectionByName: function _getSectionByName(ctrlName) {
			var useCache = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

			if (_.isString(ctrlName)) {
				return useCache ? this.elem('control', 'name', ctrlName) : this.findElem('control', 'name', ctrlName);
			}

			return ctrlName;
		},


		/**
   * Удаляет результаты валидации контролов раздела формы
   *
   * @private
   * @param {JQuery} $section контрол формы
   */
		_cleanSectionValidation: function _cleanSectionValidation($section) {
			_.forEach(this.findBlocksInside($section, 'validation'), function (bValidation) {
				bValidation.setValidationState('');
			});
		},


		/**
   * Переключение видимости контрола формы (и data-unit)
   *
   * @public
   * @param {string} ctrlName Название контрола формы
   * @param {boolean} toggleCond Условие переключения (true - показать, false - скрыть)
   * @param {string} [ctrlType='input'] Тип контрола формы
   */
		toggleFormControl: function toggleFormControl(ctrlName, toggleCond, ctrlType) {
			ctrlType = ctrlType || 'input';
			var $control = this.elem('control', 'name', ctrlName);
			if ($control.length) {
				var bControl = $control.bem(ctrlType);
				var $controlFormItem = bControl.domElem.closest('.form__item, .data-unit');

				this.toggleMod($controlFormItem, 'hidden', 'yes', !toggleCond);
				bControl.toggleMod('disabled', true, !toggleCond);
				// Для инпутов скрываем тултипы
				ctrlType === 'input' && bControl.hideErrorTip();
			}
		},


		/**
   * Показывает необходимый набор полей для выбранного способа оплаты, остальные скрывает
   *
   * @param {String} name имя контролоа, который нужно показать
   * @param {String} group имя группы контролов
   *
   * @private
   */
		showOnlyOneSection: function showOnlyOneSection(name, group) {
			var _this = this;
			var $section = _this.elem('control', 'name', name);
			var allPaymentControls = _this.elem('control', 'group', group);

			_.each(allPaymentControls, function (control) {
				_this.toggleFormSection($(control), $section[0] === control);
			});
		},


		/**
   * Очищает поля для раздела формы
   *
   * @param {String|JQuery} elem название контрола формы с разделом или JQuery объект
   * @param {Boolean} condition условие при котором произойдет очистка полей
   *
   * @private
   */
		clearSectionFields: function clearSectionFields(elem, condition) {
			if (condition) {
				var $section = _.isString(elem) ? this.elem('control', 'name', elem) : elem;
				_.each($section.find(':input').not('input[type="hidden"]').not('input[type="checkbox"]'), function (control) {
					$(control).val('');
				});
			}
		},


		/**
   * Переключение состояния контролов формы
   * @param {Boolean} isEnable состояние формы
   * @private
   */
		_toggleDisable: function _toggleDisable(isEnable) {
			var controlsList = this.getControlsList();

			_.each(controlsList, function (bControl) {
				bControl.toggleMod('disabled', true, isEnable);
			});
		},


		/**
   * Дизейбл всех контролов формы
   *
   * @public
   */
		disable: function disable() {
			this._toggleDisable(true);
		},


		/**
   * Раздизейбл всех контролов формы
   *
   * @public
   */
		unDisable: function unDisable() {
			this._toggleDisable(false);
		},


		/**
   * Получает не пустые значения формы
   *
   * @param {String} [sectionName = ''] имя секции в которой нужно выполнить поиск полей
   *
   * @returns {Object}
   *
   * @private
   */
		serializeForm: function serializeForm(sectionName) {
			var formData = this.domElem.serializeArray();
			if (sectionName) {
				var $section = this.elem('control', 'name', sectionName);
				formData = $section.find(':input').serializeArray();
			}
			var formattedFormData = _.reduce(formData, function (result, item) {
				result[item.name] = item.value;
				return result;
			}, {});

			return _.omitBy(formattedFormData, _.isEmpty);
		},


		/**
   * Возвращает список контролов формы
   *
   * @public
   * @param {String[]} [nameslist] список имен контролов
   * @returns {BEM[]} список блоков
   */
		getControlsList: function getControlsList(nameslist) {
			var _this = this;
			var defaultNamesList = ['input', 'select', 'checkbox', 'textarea', 'button', 'radio'];
			var namesListResult = nameslist || defaultNamesList;
			var controlsList = [];

			_.each(namesListResult, function (name) {
				controlsList = controlsList.concat(_this.findBlocksInside(name));
			});

			return controlsList;
		},


		/**
   * Скрывает ошибку на инпуте при первом изменении после валидации
   *
   * @param {BEM} bInput Инпут
   * @param {BEM} [bTipOwner=bInput] Поле, на котором отображается ошибка
   *
   * @private
   */
		_hideErrorOnFirstChange: function _hideErrorOnFirstChange(bInput, bTipOwner) {
			var bTipOwnerResult = bTipOwner || bInput;
			var $control = bInput.elem('control');
			var $clear = bInput.elem('clear');

			// Единоразово скрываем ошибку и отписываемся от события
			var hideTip = function hideTip(e) {
				// на enter ошибку не скрываем
				if (!keycodes.checkKey(e, ['ENTER'])) {
					bTipOwnerResult.hideErrorTip();
					$control.off('keyup', hideTip);
				}
			};

			// one не подходит, потому что сработает сразу при нажатии enter -
			// ошибка покажется и сразу скроется, что неправильно
			$control.on('keyup', hideTip);

			if ($clear.length) {
				$clear.one('click', function () {
					bTipOwnerResult.hideErrorTip();
				});
			}
		},


		/**
   * Очищает поле при ошибке, если передан параметр clearOnError: true в блоке validation
   *
   * @param {BEM} bValidation блок validation
   *
   * @private
   */
		_clearInputOnError: function _clearInputOnError(bValidation) {
			if (bValidation && bValidation.params.clearOnError) {
				var bInputs = bValidation.findBlocksInside('input');
				var bFocusedInput = bValidation.findBlockInside({
					block: 'input',
					modName: 'focused',
					modVal: true
				});

				// Стираем данные из инпутов
				_.each(bInputs, function (bInput) {
					bInput.setVal('');
				});

				// Для групповой валидации, если в момент очистки фокус был не на первом поле, переставляем фокус
				if (bFocusedInput && _.indexOf(bInputs, bFocusedInput) !== 0) {
					var bFirstInput = bInputs[0];
					bFocusedInput.delMod('focused');
					// После смены фокусов показываем ошибку
					bFirstInput.setMod('focused');
					nextTick(function () {
						return bFirstInput.showErrorTip();
					});
				}
			}
		}
	}));
});
/**
 * @module keycodes
 */
modules.define('keycodes', ['i-bem', 'jquery'], function (provide, BEM, $) {
	provide(BEM.decl('keycodes', {}, {
		BACKSPACE: 8,
		TAB: 9,
		ENTER: 13,
		SHIFT: 16,
		CTRL: 17,
		ALT: 18,
		CAPS_LOCK: 20,
		ESC: 27,
		SPACE: 32,
		PAGE_UP: 33,
		PAGE_DOWN: 34,
		END: 35,
		HOME: 36,
		LEFT: 37,
		UP: 38,
		RIGHT: 39,
		DOWN: 40,
		INSERT: 45,
		DELETE: 46,

		/**
   * Проверка соответствия кода клавиши одному из переданных названий
   *
   * @example
   * keycodes.is(e.keyCode, 'SPACE', 'ENTER');
   *
   * @param {Number} code Код клавиши
   * @param {...String|String[]} name Названия клавиш
   * @returns {Boolean}
   */
		is: function is(code, name) {
			return (Array.isArray(name) ? name : Array.prototype.slice.call(arguments, 1)).some(function (name) {
				return this[name] === code;
			}, this);
		},


		/**
   * Проверка кода клавиши, по нажатию на которую произошло событие
   *
   * @param {Event} e Jquery Event Object
   * @param {String[]} keys Массив клавиш
   * @returns {Boolean}
   */
		checkKey: function checkKey(e, keys) {
			var _this = this;

			return keys.some(function (name) {
				return e.which === _this[name];
			});
		},


		/**
   * Проверяет, не нажаты ли клавиши-модификаторы
   *
   * @param {Event} e Jquery Event Object
   * @returns {Boolean}
   */
		isModifyerKey: function isModifyerKey(e) {
			return e.shiftKey || e.ctrlKey || e.altKey || e.metaKey;
		},


		/**
   * Возвращает признак того, является ли данный код символа навигационным
   *
   * @param {number} charCode Код символа
   * @returns {boolean}
   */
		isNavKey: function isNavKey(charCode) {
			/**
    * Массив кодов навигационных символов
    */
			var navKeys = [this.BACKSPACE, this.TAB, this.ENTER, this.SHIFT, this.CTRL, this.ALT, this.CAPS_LOCK, this.END, this.HOME, this.LEFT, this.UP, this.RIGHT, this.DOWN, this.DELETE];
			// eslint-disable-next-line no-undef
			return $.browser.opera
			/*
    * Баг ~2012г.: Opera криво работает с keypress, передаёт у специальных клавиш
    * такие же коды, как у обычных. Например, у точки и del код 46.
    */
			? navKeys.indexOf(charCode) >= 0
			// 0 - home, end, стрелки и т.п.
			: charCode === 0;
		},


		/**
   * Возвращает признак того, является ли данный код символа специальным (backspace, enter)
   *
   * @param {number} charCode Код символа
   * @returns {boolean}
   */
		isSpecialKey: function isSpecialKey(charCode) {
			var specialKeys = [this.BACKSPACE, this.ENTER];

			return specialKeys.indexOf(charCode) >= 0;
		}
	}));
});
/**
 * @module validation
 */
modules.define('validation', ['i-bem__dom', 'lodash', 'yamoney-lib', 'basis', 'jquery'], function (provide, BEMDOM, _, ymLib, basis, $) {
	/**
  * @exports
  * @class validation
  * @bem
  */
	provide(BEMDOM.decl('validation', /** @lends validation.prototype */{

		/**
   * @event succeess Генерируется при успешной валидации
   */

		/**
   * @event error Генерируется при неуспешной валидации
   */

		onSetMod: {
			js: {
				inited: function inited() {
					this.__base.apply(this, arguments);

					/**
      * Вьюпорт для показа ошибок
      * @private
      * @type {string}
      */
					this._viewport = 'html,body';

					/**
      * Признак валидации группы полей
      * @private
      * @type {Boolean}
      */
					this._isValidationGroup = this.hasMod('group');

					/**
      * Событие триггер для текущего процесса валидации
      * @private
      * @type {String}
      */
					this._currentValidationTriggerEvent = '';

					/**
      * Список контроллов, разрешенных для валидации
      *
      * @public
      * @type {Array}
      */
					this.allowedControlsList = ['input', 'select', 'month-picker', 'date-picker'];

					var allowedControls = this.params.allowedControls || [];
					_.extend(this.allowedControlsList, allowedControls);

					/**
      * Валидируемый контрол
      * Для группы полей, контрол определяющий статус активности, видимости и положения тултипа
      * @private
      * @type {BEM}
      */
					this._bControl = this._getValidatingControl();

					this._initValidationSets();
				}
			}
		},

		/**
   * Имя набора параметров валидации по умолчанию.
   * @type {string}
   * @const
   */
		DEFAULT_VALIDATION_SET_NAME: 'defaultSet',

		/**
   * Возвращает признак необходимости повторной валидации
   * не смотря на модификатор validation_state_failed
   *
   * @returns {Boolean}
   */
		isForceRevalidation: function isForceRevalidation() {
			var params = this.params || {};
			return !!params.forceRevalidation;
		},


		/**
   * Инициализирует наборы правил
   * @private
   */
		_initValidationSets: function _initValidationSets() {
			var _this = this;
			var params = this.params;
			var validationSets = params.validationSets || {};
			var defaultSetName = this.DEFAULT_VALIDATION_SET_NAME;

			// Оборачиваем дефолтные правила в validationSets
			if ($.isEmptyObject(validationSets)) {
				validationSets[defaultSetName] = {};
				validationSets[defaultSetName].validationRules = params.validationRules;

				if (params.bind) {
					validationSets[defaultSetName].bind = params.bind;
				}

				this.params.validationSets = validationSets;
			}

			// Cоздаем обработчики для тех наборов правил, у которых указан bind
			$.each(validationSets, function (validationSetName, validationSet) {
				if (validationSet.bind) {
					_this._validateOnEvents(validationSetName, validationSet.bind);
				}
			});
		},


		/**
   * Валидирует контрол по событию
   *
   * @private
   * @param {String} validationSetName Название набора правил валидации
   * @param {String|Array} events События
   */
		_validateOnEvents: function _validateOnEvents(validationSetName, events) {
			var _this = this;

			events = _.isArray(events) ? events.join(' ') : events;

			_this._bControl.on(events, function (e) {
				if (_this._controlHasValue()) {
					// Записываем событие, вызвавшее процесс валидации
					_this._currentValidationTriggerEvent = e.type;
					// Валидируем контрол с постобработкой результата
					_this.validateWithPostProcess(validationSetName);
				} else if (!_this.params.clearOnError) {
					// Обнуляем статус валидации и скрываем ошибки,
					// если поле пустое и нет параметра отчистки на ошибку
					_this.setValidationState('');
					_this._bControl.hideErrorTip();
				}
			});
		},


		/**
   * Добавляет кастомную валидацию
   * Валидирующая фукнция для кастомной проверки должна возвращать промис объект,
   * который будет успешным или неуспешным в зависимости от результата проверки.
   * Эта проверка будет выполнена после и в случае успеха валидации по правилам,
   * указанным в наборах из validationSetNames.
   *
   * @param {String} validationSetNames Название наборов правил валидации,
   * 		в которые будет добавлено новое правило
   * @param {Promise} customRule Правило валидации
   * @private
   */
		setCustomRule: function setCustomRule(validationSetNames, customRule) {
			var _this = this;
			// Проверяем, передано ли название набора
			if (!_.isString(validationSetNames)) {
				customRule = validationSetNames;
				validationSetNames = this.DEFAULT_VALIDATION_SET_NAME;
			}

			validationSetNames = validationSetNames.split(' ');

			// Для каждого указанного набора добавляем переданное правило
			$.each(validationSetNames, function (index, validationSetName) {
				_this.params.validationSets[validationSetName].customRule = customRule;
			});
		},


		/**
   * Получает статус результата валидации контрола
   * @returns {*|String|Boolean}
   */
		getValidationState: function getValidationState() {
			return this.getMod('state');
		},


		/**
   * Устанавливает статус результата валидации контрола
   *
   * @param {String} state Статус результата валидации
   *
   * @returns {BEMDOM}
   */
		setValidationState: function setValidationState(state) {
			return this.setMod('state', state);
		},


		/**
   * Получает валидируемый контрол
   *
   * @public
   * @returns {BEM}
   */
		getValidatingControl: function getValidatingControl() {
			return this._bControl;
		},


		/**
   * Получает валидируемый контрол
   *
   * @private
   * @returns {BEMDOM}
   */
		_getValidatingControl: function _getValidatingControl() {
			var _this2 = this;

			var bControl = null;

			if (this._isValidationGroup) {
				// для группы ищем контрол помеченный как tooltipOwner
				return this.elem('control', 'name', this.params.tooltipOwner.name).bem(this.params.tooltipOwner.block);
			} else {
				// одиночный контрол ищем на DOM-узле блока validation
				_.forEach(this.allowedControlsList, function (controlName) {
					bControl = _this2.findBlockOn(controlName);
					return !bControl;
				});
				return bControl;
			}
		},


		/**
   * Проверяет существование значения у контрола или группы контролов
   *
   * @returns {boolean}
   * @private
   */
		_controlHasValue: function _controlHasValue() {
			var hasValue = false;

			if (this._isValidationGroup) {
				var _this = this;
				_.forEach(this.elem('control'), function (control) {
					var bControl = $(control).bem(_this.getMod($(control), 'block'));
					hasValue = !!bControl.getVal();
					return !hasValue;
				});
			} else {
				hasValue = !!this._bControl.getVal();
			}
			return hasValue;
		},


		/**
   * Метод возвращает текст ошибки в зависимости от наличия параметров:
   *
   * Сначала смотрим на наличие
   * checkResult.message
   * если checkResult.message не указан, то смотрим на наличие
   * checkResult.errorKeyId
   * если и checkResult.errorKeyId не указан, то текст ошибки берем из объекта
   * errors[id]
   *
   * Если не указан ни один из перечисленных параметров, то возвращаем пустую строку
   *
   *
   * @param {Object} [checkResult] Результат проверки
   * @param {String} [checkResult.message] Текст ошибки зашитый в правила валидации
   * @param {String} [checkResult.errorKeyId] Ключ ошибки в танкере
   * @param {String} [checkResult.errorKeyParams] Параметры для танкера
   * @param {String} [checkResult.error] Тип ошибки
   * @param {Object} [errors] Коллекция ошибок
   * @returns {String}
   * @private
   */
		_getErrorText: function _getErrorText(checkResult, errors) {
			if (!_.isEmpty(checkResult.message)) {
				return checkResult.message;
			}

			if (!_.isEmpty(checkResult.errorKeyId)) {
				return BEM.I18N('form', checkResult.errorKeyId, checkResult.errorKeyParams);
			}

			if (!_.isEmpty(errors) && _.isObject(errors)) {
				return errors[checkResult.error];
			}

			return '';
		},


		/**
   * Скролл страницы до заданного поля с нужными настройками.
   *
   * @public
   * @param {jQuery} $field Поле, до которого нужно скроллить.
   * @param {object} params Настройки валидации.
   * 		См. setDefaultValidationParams.
   */
		scrollToInvalidField: function scrollToInvalidField($field, params) {
			var fieldOffset = $field.offset().top;
			var scrollTo = fieldOffset - params.viewportPadding;
			var viewport = params.viewport || this._viewport;
			var $viewport = $(viewport);
			var isFieldInViewport = fieldOffset < $viewport.offset().top || fieldOffset > $viewport.height();

			// Если задан вьюпорт, не скроллим, когда инпут находится в области видимости
			if (viewport !== this._viewport) {
				if (fieldOffset < 0) {
					scrollTo = -fieldOffset;
				} else if (isFieldInViewport) {
					scrollTo = fieldOffset;
				} else {
					scrollTo = $viewport.scrollTop();
				}
			}
			// https://snipt.net/tbeseda/scroll-to-element-with-jquery/
			$viewport.animate({ scrollTop: scrollTo }, 500);
		},


		/**
   * Метод обвязка для validate, валидирует контрол с постобработкой результата
   *
   * @param {String} [validationSetName] Название набора правил валидации.
   * @param {object} [validateParams] Настройки валидации.
   * 		См. form_validation_yes setDefaultValidationParams.
   * @param {boolean} [validateParams.validateOnly=false] Не показывать ошибки валидации
   *
   * @public
   */
		validateWithPostProcess: function validateWithPostProcess(validationSetName, validateParams) {
			var _this3 = this;

			// Валидируем контрол по правилам, заданным в наборе с заданными параметрами
			var validationResult = this.validate(validationSetName, validateParams);

			// Обрабатываем результат валидации
			validationResult.done(function () {
				// Скрываем тултип при успешном результате
				_this3._bControl.hideErrorTip();
				// Выставляем статус валидации
				_this3.setValidationState('');
				// Триггерим событие успешной валидации
				_this3.emit('success');
			}).fail(function (checkResultErr) {
				// Выставляем статус валидации
				_this3.setValidationState('failed');
				// Триггерим событие неуспешной валидации
				_this3.emit('error', checkResultErr);
			});
		},


		/**
   * Валидирует контрол (группу) по правилам, указанным в наборе validationSetName
   * с учетом параметров из validateParams. Возвращает промис объект, который будет
   * успешным или нет в зависимости от результата проверки.
   *
   * @param {String} [validationSetName] Название набора правил валидации.
   * @param {object} [validateParams] Настройки валидации.
   * 		См. form_validation_yes setDefaultValidationParams.
   * @param {boolean} [validateParams.validateOnly=false] Не показывать ошибки валидации
   *
   * @public
   * @returns {Promise}
   */
		validate: function validate(validationSetName, validateParams) {
			var _this = this;
			var defaultSetName = this.DEFAULT_VALIDATION_SET_NAME;

			// Проверяющие функции
			var checkers = this.__self._checkers;
			// Деферред объект-признак результата прохождения процесса валидации
			var validationDeferredResult = $.Deferred();

			// Параметры не переданы
			if (!validationSetName) {
				validateParams = {};
				validationSetName = defaultSetName;
				// Передан только параметр validateParams
			} else if (_.isObject(validationSetName)) {
				validateParams = validationSetName;
				validationSetName = defaultSetName;
				// Передан только параметр validationSetName
			} else if (!validateParams) {
				validateParams = {};
			}

			if (this._bControl && !this._bControl.hasMod('disabled') && this._bControl.domElem.is(':visible')) {
				// Основные правила
				var rules = this.params.validationSets[validationSetName].validationRules || [];
				// Правило кастомной проверки
				var customRule = this.params.validationSets[validationSetName].customRule || null;

				// Если отсутствуют правила валидации, пишем предупреждение в лог
				// и переходим к следующему контролу
				if (!rules) {
					var controlName = _this._bControl.elem('control').attr('name');
					var warnMessage = _this._isValidationGroup ? 'group ' + controlName + ' have' : controlName + ' has';
					/* eslint-disable no-console */
					console.warn('Control ' + warnMessage + ' not validation rules.');

					return true;
				}

				$.each(rules, function (index, rule) {
					var type = rule.type;
					var errors = rule.errors;
					var params = rule.params || {};
					var checkResult = '';
					params.value = {};

					// Проверка для одиночного поля
					if (!_this._isValidationGroup) {
						params.value = _this._bControl.getVal();
						params.name = _this._bControl.elem('control').attr('name');
						checkResult = checkers[type](params);
					} else if (rule.forEach) {
						// Проверка для каждого из группы полей по отдельности
						_.forEach(_this.elem('control'), function (control) {
							var bControl = $(control).bem(_this.getMod($(control), 'block'));

							params.value = bControl.getVal();
							checkResult = checkers[type](params);

							// Если валидация "жесткая", выходим после же первой неудачной проверки элемента группы
							// Если нет, то выходим после первой же удачной проверки элемента группы
							return rule.forEach === 'hard' ? checkResult.success : !checkResult.success;
						});
					} else {
						// Проверка для группы полей вместе
						_.forEach(_this.elem('control'), function (control) {
							var bControl = $(control).bem(_this.getMod($(control), 'block'));
							var controlName = bControl.elem('control').attr('name');

							// Добавляем к параметрам в формате имя - значение
							params.value[controlName] = bControl.getVal();
						});
						// Делаем общую проверку для группы полей
						checkResult = checkers[type](params);
					}

					if (!checkResult.success) {
						var checkResultErr = { type: type, params: params, checkResult: checkResult };
						// При непрохождении валидации реджектим объект результата валидации
						validationDeferredResult = validationDeferredResult.reject(checkResultErr);

						// Нужно ли переставлять фокус на поле, не прошедшее валидацию.
						var needToFocus = validateParams.focusToFirstInvalid || false;
						var viewport = validateParams.viewport || _this._viewport;
						var $viewport = $(viewport);
						var hasCustomViewport = viewport !== _this._viewport;

						var showError = function showError() {
							var controlOffset = _this._bControl.domElem.offset().top;
							var isInViewport = true;

							if (hasCustomViewport) {
								isInViewport = $viewport.offset().top < controlOffset && controlOffset < $viewport.height();
							}

							// Показываем ошибку, если она находится во вьюпорте
							if (isInViewport) {
								var error = _this._getErrorText(checkResult, errors);
								_this._bControl.showErrorTip(error);

								// Очищаем инпут при ошибке, если передан параметр clearOnError
								if (_this.params.clearOnError) {
									var bInputs = _this.findBlocksInside('input');
									_.each(bInputs, function (bInput) {
										bInput.setVal('');
									});
								}
							}
						};

						// Если нужно, то прокручиваем страницу до поля с ошибкой
						if (needToFocus && !$viewport.is(':animated')) {
							_this.scrollToInvalidField(_this._bControl.domElem, validateParams);
							needToFocus = false;
						}

						var validateOnly = validateParams.validateOnly || params.validateOnly || false;
						if (!validateOnly) {
							// Если страница анимируется, выводим ошибки по окончании анимации
							if ($viewport.is(':animated')) {
								$(viewport + ':animated').promise().done(showError);
							} else {
								showError();
							}
						}
					}

					// Выходим с первой неудачной проверкой для данного элемента.
					// Остальные правила валидации элемента не проверяем.
					return checkResult.success;
				});

				// Если основные проверки прошли успешно, выполняем кастомную валидацию, если она определена
				if (validationDeferredResult.state() !== 'rejected') {
					validationDeferredResult = customRule ? customRule() : validationDeferredResult.resolve();
				}
			}

			return validationDeferredResult.promise();
		}
	}, /** @lends validation */{
		/**
   * Объект с проверяющими функциями
   *
   * @private
   * @type {Object}
   */
		_checkers: _.extend(basis.validationCheckers, /** @lends validation */{

			/**
    * Проверки с использованием XEV
    *
    * @param {Object} params Параметры проверки
    * @param {String} params.value Валидируемое значение
    * @param {String} params.name Имя поля
    * @param {Object} params.callback Имя метода, который должен выполниться при валидации
    * @returns {Object} Объект с признаком успешной проверки и типом ошибки
    */
			xevCallback: function xevCallback(params) {
				var callbackName = params.callback;
				var xev = ymLib.xev;
				var callback = xev.callback[callbackName];

				// Если групповая валидация value - это объект, где ключ это имя блока, а значение - это значение
				if (_.isObject(params.value)) {
					xev.setFields(params.value);
				} else {
					xev.setField(params.name, params.value);
				}

				// Сначала ищем обработчик в списке callbacks. Если ничего не находим,
				// то значит перед нами кастомный обработчик. Пытаемся его найти в объекте xev
				if (_.isFunction(callback)) {
					return callback(params);
				}

				if (_.isFunction(xev[callbackName])) {
					// Устанавливаем параметр ctx т.к. с ним работает старый механизм xev
					// и все кастомные правила из киоска используют это свойство
					params.xev = xev;
					// вызываем специальный обработчик-обертку для кастомных обработчиков xevCustom
					return xev.callback.xevCustom(params);
				}
				return { success: true };
			},


			/**
    * Проверка даты
    *
    * @param {Object} params Параметры проверки
    * @param {String} params.value Валидируемое значение
    *
    * @returns {Object} Объект с признаком успешной проверки и типом ошибки
    */
			date: function date(params) {
				var value = $.trim(params.value);
				var dateRegExp = /^\d{2}\.\d{2}\.\d{4}$/;

				if (!dateRegExp.test(value)) {
					return {
						success: false,
						error: 'wrongFormat'
					};
				}

				var dateIsValid = ymLib.utils.dateIsValid(value, 'DD.MM.YYYY');
				if (!dateIsValid) {
					return {
						success: false,
						error: 'invalidDate'
					};
				}

				return { success: true };
			},


			/**
    * Функция валидации введённой даты протухания банковской карты.
    *
    * @param {Object} params Параметры проверки
    * @param {Object} params.value Валидируемое значение
    * @param {String} params.inputNames.month Имя поля месяца
    * @param {String} params.inputNames.year Имя поля года
    * @param {String} params.noValidationDate Флаг для расширенного диапозона
    *
    * @returns {Object} Объект с признаком успешной проверки и типом ошибки
    */
			cardDate: function cardDate(params) {
				// Имена полей по умолчанию.
				// Блок bank-card2 позволяет использовать произвольные имена полей для года и месяца
				var defaultInputNames = {
					month: 'skr_month',
					year: 'skr_year'
				};

				params.inputNames = _.extend(defaultInputNames, params.inputNames);

				var month = params.value[params.inputNames.month];
				var year = params.value[params.inputNames.year];

				// если есть флаг, то пропускаем все карты,
				// действующие дольше чем 01.22 включительно
				var today = params.noValidationDate ? new Date(2022, 0) : new Date();
				var currYear = today.getFullYear();
				var currMonth = today.getMonth() + 1;

				if (year.length === 2) {
					currYear = currYear.toString().substr(2, 2);
					currYear = ymLib.utils.toNum(currYear);
				}

				// Приводим строки к числам.
				year = ymLib.utils.toNum(year);
				month = ymLib.utils.toNum(month);

				// Проверяем, что срок действия не в далёком прошлом.
				if (year < currYear || year === currYear && month < currMonth) {
					return {
						success: false,
						error: 'wrongDate'
					};
				}

				// Проверяем правильность месяца и что срок действия не превышает 10 лет
				if (year > currYear + 10 || month > 12 || month < 1) {
					return {
						success: false,
						error: 'wrongFormat'
					};
				}

				return { success: true };
			},


			/**
    * Проверка формата даты в форме фильтрации платежей в ЛК
    *
    * @param {Object} params Параметры проверки
    * @param {String} params.value Валидируемое значение
    *
    * @returns {Object} Объект с признаком успешной проверки и типом ошибки
    */
			officePaymentsDate: function officePaymentsDate(params) {
				var date = $.trim(params.value);

				var dateRegExps = [/^\d{2}-\d{2}-\d{4}$/, /^\d{2}\.\d{2}\.\d{4}$/, /^\d{2}\/\d{2}\/\d{4}$/];

				var regexpTestPassed = _.some(dateRegExps, function (dateRegExp) {
					return dateRegExp.test(date);
				});

				if (!regexpTestPassed) {
					return {
						success: false,
						error: 'wrongFormat'
					};
				}

				var dateIsValid = ymLib.utils.dateIsValid(date, 'DD-MM-YYYY');
				if (!dateIsValid) {
					return {
						success: false,
						error: 'invalidDate'
					};
				}

				var now = new Date();
				var dateIsNotInFuture = ymLib.utils.checkDateInterval(date, now);
				if (!dateIsNotInFuture) {
					return {
						success: false,
						error: 'dateIsInFuture'
					};
				}

				return { success: true };
			},


			/**
    * Проверка диапазона дат в форме фильтрации платежей в ЛК
    *
    * @param {Object} params Параметры проверки
    * @param {String} params.value Валидируемое значение
    * @param {String} params.prefix Префикс валидируемых полей
    *
    * @returns {Object} Объект с признаком успешной проверки и типом ошибки
    */
			dateInterval: function dateInterval(params) {
				// Префикс на случай, если в одной форме несколько интервалов дат
				var prefix = params.prefix || '';
				var startDate = params.value[prefix + 'startDate'];
				var endDate = params.value[prefix + 'endDate'];

				// Проверяем, что дата начала интервала раньше, чем конец
				var isStartEarlier = ymLib.utils.checkDateInterval(startDate, endDate);

				if (isStartEarlier) {
					return { success: true };
				}

				return {
					success: false,
					error: 'wrongInterval'
				};
			},


			/**
    * Проверка попадания даты в интервал.
    * Если не передать одну из границ интервала, то сравнение будет только со второй границей
    *
    * @param {Object} params Параметры проверки
    * @param {String} params.value Валидируемое значение
    * @param {String|Date} params.startDate Нижняя граница интервала
    * @param {String|Date} params.endDate Верхняя граница интервала
    *
    * @returns {Object} Объект с признаком успешной проверки и типом ошибки
    */
			dateInRange: function dateInRange(params) {
				var startDate = params.startDate;
				var endDate = params.endDate;
				var date = $.trim(params.value);

				if (startDate) {
					// Проверим, что дата больше, чем нижняя граница интервала
					var isStartEarlier = ymLib.utils.checkDateInterval(startDate, date);
					if (!isStartEarlier) {
						return {
							success: false,
							error: 'belowLowerEdge'
						};
					}
				}

				if (endDate) {
					// Проверим, что дата меньше, чем верхняя граница интервала
					var isEndLater = ymLib.utils.checkDateInterval(date, endDate);

					if (!isEndLater) {
						return {
							success: false,
							error: 'aboveTopEdge'
						};
					}
				}

				return { success: true };
			},


			/**
    * Функция валидации выбранного значения CMS (QWEB-14538)
    * Срабатывает, если пользователь не выбрал какую-нибудь CMS вместо "Не выбрана".
    *
    * @param {Object} params Параметры проверки
    * @param {Object} params.value Валидируемое значение
    *
    * @returns {Object} Объект с признаком успешной проверки и типом ошибки
    */
			cmsIsNotFake: function cmsIsNotFake(params) {
				var cms = params.value;
				if (!cms || cms === 'fakeCms') {
					return {
						success: false,
						error: 'cmsIsFake'
					};
				}

				return { success: true };
			},


			/**
    * Проверка идентичности значений группы полей
    *
    * @param {Object} params Параметры проверки
    * @param {Object} params.value Валидируемое значение
    *
    * @returns {Object} Объект с признаком успешной проверки и типом ошибки
    */
			equal: function equal(params) {
				var values = params.value;

				var notEqual = _.uniq(_.values(values)).length > 1;

				if (notEqual) {
					return {
						success: false,
						error: 'notEqual'
					};
				}

				return { success: true };
			},


			/**
    * Проверка уина. (TRANSPORT-5386)
    *
    * @param {Object} params Параметры проверки
    * @param {String} params.value Валидируемое значение
    *
    * @returns {Object} Объект с признаком успешной проверки и типом ошибки
    */
			uin: function uin(params) {
				var value = $.trim(params.value);
				var uin = value.split('');
				var MAX_IDENTIFIER_NUMBER = 10;
				var NEXT_LEVEL_INDEX = 3;
				var CHECK_MODULO = 11;
				var length = uin.length - 1;
				var index = 1;
				var errorResponse = {
					success: false,
					error: 'wrongFormat'
				};
				var successResponse = { success: true };
				var getGroupDischarge = function getGroupDischarge() {
					var arr = [];
					for (var i = 0; i < length; i++) {
						if (index > MAX_IDENTIFIER_NUMBER) {
							index = 1;
						}
						arr.push(uin[i] * index);
						index++;
					}
					return arr;
				};
				var getCheckDigit = function getCheckDigit(arr) {
					var sum = arr.reduce(function (sum, current) {
						return sum + current;
					}, 0);
					return sum % CHECK_MODULO;
				};
				var arr = getGroupDischarge();
				var result = getCheckDigit(arr);
				if (result === MAX_IDENTIFIER_NUMBER) {
					index = NEXT_LEVEL_INDEX;
					var _arr = getGroupDischarge();
					result = getCheckDigit(_arr);
					if (result === MAX_IDENTIFIER_NUMBER) {
						return +uin[length] === 0 ? successResponse : errorResponse;
					} else {
						return +uin[length] === result ? successResponse : errorResponse;
					}
				} else {
					return +uin[length] === result ? successResponse : errorResponse;
				}
			}
		})
	}));
});
(function () {
    function r(e, n, t) {
        function o(i, f) {
            if (!n[i]) {
                if (!e[i]) {
                    var c = "function" == typeof require && require;if (!f && c) return c(i, !0);if (u) return u(i, !0);var a = new Error("Cannot find module '" + i + "'");throw a.code = "MODULE_NOT_FOUND", a;
                }var p = n[i] = { exports: {} };e[i][0].call(p.exports, function (r) {
                    var n = e[i][1][r];return o(n || r);
                }, p, p.exports, r, e, n, t);
            }return n[i].exports;
        }for (var u = "function" == typeof require && require, i = 0; i < t.length; i++) {
            o(t[i]);
        }return o;
    }return r;
})()({ 1: [function (require, module, exports) {
        /**
         * @module yamoney-lib
         */
        // eslint-disable-next-line
        modules.define('yamoney-lib', ['lodash'], function (provide, _) {
            var yamoneyLib = require('yamoney-frontend-lib');
            provide(yamoneyLib);
        });
    }, { "yamoney-frontend-lib": 60 }], 2: [function (require, module, exports) {
        var root = require('./_root');

        /** Built-in value references. */
        var _Symbol = root.Symbol;

        module.exports = _Symbol;
    }, { "./_root": 38 }], 3: [function (require, module, exports) {
        /**
         * A faster alternative to `Function#apply`, this function invokes `func`
         * with the `this` binding of `thisArg` and the arguments of `args`.
         *
         * @private
         * @param {Function} func The function to invoke.
         * @param {*} thisArg The `this` binding of `func`.
         * @param {Array} args The arguments to invoke `func` with.
         * @returns {*} Returns the result of `func`.
         */
        function apply(func, thisArg, args) {
            switch (args.length) {
                case 0:
                    return func.call(thisArg);
                case 1:
                    return func.call(thisArg, args[0]);
                case 2:
                    return func.call(thisArg, args[0], args[1]);
                case 3:
                    return func.call(thisArg, args[0], args[1], args[2]);
            }
            return func.apply(thisArg, args);
        }

        module.exports = apply;
    }, {}], 4: [function (require, module, exports) {
        /**
         * A specialized version of `_.forEach` for arrays without support for
         * iteratee shorthands.
         *
         * @private
         * @param {Array} [array] The array to iterate over.
         * @param {Function} iteratee The function invoked per iteration.
         * @returns {Array} Returns `array`.
         */
        function arrayEach(array, iteratee) {
            var index = -1,
                length = array == null ? 0 : array.length;

            while (++index < length) {
                if (iteratee(array[index], index, array) === false) {
                    break;
                }
            }
            return array;
        }

        module.exports = arrayEach;
    }, {}], 5: [function (require, module, exports) {
        var baseTimes = require('./_baseTimes'),
            isArguments = require('./isArguments'),
            isArray = require('./isArray'),
            isBuffer = require('./isBuffer'),
            isIndex = require('./_isIndex'),
            isTypedArray = require('./isTypedArray');

        /** Used for built-in method references. */
        var objectProto = Object.prototype;

        /** Used to check objects for own properties. */
        var hasOwnProperty = objectProto.hasOwnProperty;

        /**
         * Creates an array of the enumerable property names of the array-like `value`.
         *
         * @private
         * @param {*} value The value to query.
         * @param {boolean} inherited Specify returning inherited property names.
         * @returns {Array} Returns the array of property names.
         */
        function arrayLikeKeys(value, inherited) {
            var isArr = isArray(value),
                isArg = !isArr && isArguments(value),
                isBuff = !isArr && !isArg && isBuffer(value),
                isType = !isArr && !isArg && !isBuff && isTypedArray(value),
                skipIndexes = isArr || isArg || isBuff || isType,
                result = skipIndexes ? baseTimes(value.length, String) : [],
                length = result.length;

            for (var key in value) {
                if ((inherited || hasOwnProperty.call(value, key)) && !(skipIndexes && (
                // Safari 9 has enumerable `arguments.length` in strict mode.
                key == 'length' ||
                // Node.js 0.10 has enumerable non-index properties on buffers.
                isBuff && (key == 'offset' || key == 'parent') ||
                // PhantomJS 2 has enumerable non-index properties on typed arrays.
                isType && (key == 'buffer' || key == 'byteLength' || key == 'byteOffset') ||
                // Skip index properties.
                isIndex(key, length)))) {
                    result.push(key);
                }
            }
            return result;
        }

        module.exports = arrayLikeKeys;
    }, { "./_baseTimes": 17, "./_isIndex": 28, "./isArguments": 47, "./isArray": 48, "./isBuffer": 50, "./isTypedArray": 55 }], 6: [function (require, module, exports) {
        var baseForOwn = require('./_baseForOwn'),
            createBaseEach = require('./_createBaseEach');

        /**
         * The base implementation of `_.forEach` without support for iteratee shorthands.
         *
         * @private
         * @param {Array|Object} collection The collection to iterate over.
         * @param {Function} iteratee The function invoked per iteration.
         * @returns {Array|Object} Returns `collection`.
         */
        var baseEach = createBaseEach(baseForOwn);

        module.exports = baseEach;
    }, { "./_baseForOwn": 8, "./_createBaseEach": 21 }], 7: [function (require, module, exports) {
        var createBaseFor = require('./_createBaseFor');

        /**
         * The base implementation of `baseForOwn` which iterates over `object`
         * properties returned by `keysFunc` and invokes `iteratee` for each property.
         * Iteratee functions may exit iteration early by explicitly returning `false`.
         *
         * @private
         * @param {Object} object The object to iterate over.
         * @param {Function} iteratee The function invoked per iteration.
         * @param {Function} keysFunc The function to get the keys of `object`.
         * @returns {Object} Returns `object`.
         */
        var baseFor = createBaseFor();

        module.exports = baseFor;
    }, { "./_createBaseFor": 22 }], 8: [function (require, module, exports) {
        var baseFor = require('./_baseFor'),
            keys = require('./keys');

        /**
         * The base implementation of `_.forOwn` without support for iteratee shorthands.
         *
         * @private
         * @param {Object} object The object to iterate over.
         * @param {Function} iteratee The function invoked per iteration.
         * @returns {Object} Returns `object`.
         */
        function baseForOwn(object, iteratee) {
            return object && baseFor(object, iteratee, keys);
        }

        module.exports = baseForOwn;
    }, { "./_baseFor": 7, "./keys": 56 }], 9: [function (require, module, exports) {
        var _Symbol2 = require('./_Symbol'),
            getRawTag = require('./_getRawTag'),
            objectToString = require('./_objectToString');

        /** `Object#toString` result references. */
        var nullTag = '[object Null]',
            undefinedTag = '[object Undefined]';

        /** Built-in value references. */
        var symToStringTag = _Symbol2 ? _Symbol2.toStringTag : undefined;

        /**
         * The base implementation of `getTag` without fallbacks for buggy environments.
         *
         * @private
         * @param {*} value The value to query.
         * @returns {string} Returns the `toStringTag`.
         */
        function baseGetTag(value) {
            if (value == null) {
                return value === undefined ? undefinedTag : nullTag;
            }
            return symToStringTag && symToStringTag in Object(value) ? getRawTag(value) : objectToString(value);
        }

        module.exports = baseGetTag;
    }, { "./_Symbol": 2, "./_getRawTag": 26, "./_objectToString": 35 }], 10: [function (require, module, exports) {
        var baseGetTag = require('./_baseGetTag'),
            isObjectLike = require('./isObjectLike');

        /** `Object#toString` result references. */
        var argsTag = '[object Arguments]';

        /**
         * The base implementation of `_.isArguments`.
         *
         * @private
         * @param {*} value The value to check.
         * @returns {boolean} Returns `true` if `value` is an `arguments` object,
         */
        function baseIsArguments(value) {
            return isObjectLike(value) && baseGetTag(value) == argsTag;
        }

        module.exports = baseIsArguments;
    }, { "./_baseGetTag": 9, "./isObjectLike": 54 }], 11: [function (require, module, exports) {
        var isFunction = require('./isFunction'),
            isMasked = require('./_isMasked'),
            isObject = require('./isObject'),
            toSource = require('./_toSource');

        /**
         * Used to match `RegExp`
         * [syntax characters](http://ecma-international.org/ecma-262/7.0/#sec-patterns).
         */
        var reRegExpChar = /[\\^$.*+?()[\]{}|]/g;

        /** Used to detect host constructors (Safari). */
        var reIsHostCtor = /^\[object .+?Constructor\]$/;

        /** Used for built-in method references. */
        var funcProto = Function.prototype,
            objectProto = Object.prototype;

        /** Used to resolve the decompiled source of functions. */
        var funcToString = funcProto.toString;

        /** Used to check objects for own properties. */
        var hasOwnProperty = objectProto.hasOwnProperty;

        /** Used to detect if a method is native. */
        var reIsNative = RegExp('^' + funcToString.call(hasOwnProperty).replace(reRegExpChar, '\\$&').replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$');

        /**
         * The base implementation of `_.isNative` without bad shim checks.
         *
         * @private
         * @param {*} value The value to check.
         * @returns {boolean} Returns `true` if `value` is a native function,
         *  else `false`.
         */
        function baseIsNative(value) {
            if (!isObject(value) || isMasked(value)) {
                return false;
            }
            var pattern = isFunction(value) ? reIsNative : reIsHostCtor;
            return pattern.test(toSource(value));
        }

        module.exports = baseIsNative;
    }, { "./_isMasked": 30, "./_toSource": 41, "./isFunction": 51, "./isObject": 53 }], 12: [function (require, module, exports) {
        var baseGetTag = require('./_baseGetTag'),
            isLength = require('./isLength'),
            isObjectLike = require('./isObjectLike');

        /** `Object#toString` result references. */
        var argsTag = '[object Arguments]',
            arrayTag = '[object Array]',
            boolTag = '[object Boolean]',
            dateTag = '[object Date]',
            errorTag = '[object Error]',
            funcTag = '[object Function]',
            mapTag = '[object Map]',
            numberTag = '[object Number]',
            objectTag = '[object Object]',
            regexpTag = '[object RegExp]',
            setTag = '[object Set]',
            stringTag = '[object String]',
            weakMapTag = '[object WeakMap]';

        var arrayBufferTag = '[object ArrayBuffer]',
            dataViewTag = '[object DataView]',
            float32Tag = '[object Float32Array]',
            float64Tag = '[object Float64Array]',
            int8Tag = '[object Int8Array]',
            int16Tag = '[object Int16Array]',
            int32Tag = '[object Int32Array]',
            uint8Tag = '[object Uint8Array]',
            uint8ClampedTag = '[object Uint8ClampedArray]',
            uint16Tag = '[object Uint16Array]',
            uint32Tag = '[object Uint32Array]';

        /** Used to identify `toStringTag` values of typed arrays. */
        var typedArrayTags = {};
        typedArrayTags[float32Tag] = typedArrayTags[float64Tag] = typedArrayTags[int8Tag] = typedArrayTags[int16Tag] = typedArrayTags[int32Tag] = typedArrayTags[uint8Tag] = typedArrayTags[uint8ClampedTag] = typedArrayTags[uint16Tag] = typedArrayTags[uint32Tag] = true;
        typedArrayTags[argsTag] = typedArrayTags[arrayTag] = typedArrayTags[arrayBufferTag] = typedArrayTags[boolTag] = typedArrayTags[dataViewTag] = typedArrayTags[dateTag] = typedArrayTags[errorTag] = typedArrayTags[funcTag] = typedArrayTags[mapTag] = typedArrayTags[numberTag] = typedArrayTags[objectTag] = typedArrayTags[regexpTag] = typedArrayTags[setTag] = typedArrayTags[stringTag] = typedArrayTags[weakMapTag] = false;

        /**
         * The base implementation of `_.isTypedArray` without Node.js optimizations.
         *
         * @private
         * @param {*} value The value to check.
         * @returns {boolean} Returns `true` if `value` is a typed array, else `false`.
         */
        function baseIsTypedArray(value) {
            return isObjectLike(value) && isLength(value.length) && !!typedArrayTags[baseGetTag(value)];
        }

        module.exports = baseIsTypedArray;
    }, { "./_baseGetTag": 9, "./isLength": 52, "./isObjectLike": 54 }], 13: [function (require, module, exports) {
        var isPrototype = require('./_isPrototype'),
            nativeKeys = require('./_nativeKeys');

        /** Used for built-in method references. */
        var objectProto = Object.prototype;

        /** Used to check objects for own properties. */
        var hasOwnProperty = objectProto.hasOwnProperty;

        /**
         * The base implementation of `_.keys` which doesn't treat sparse arrays as dense.
         *
         * @private
         * @param {Object} object The object to query.
         * @returns {Array} Returns the array of property names.
         */
        function baseKeys(object) {
            if (!isPrototype(object)) {
                return nativeKeys(object);
            }
            var result = [];
            for (var key in Object(object)) {
                if (hasOwnProperty.call(object, key) && key != 'constructor') {
                    result.push(key);
                }
            }
            return result;
        }

        module.exports = baseKeys;
    }, { "./_isPrototype": 31, "./_nativeKeys": 32 }], 14: [function (require, module, exports) {
        var isObject = require('./isObject'),
            isPrototype = require('./_isPrototype'),
            nativeKeysIn = require('./_nativeKeysIn');

        /** Used for built-in method references. */
        var objectProto = Object.prototype;

        /** Used to check objects for own properties. */
        var hasOwnProperty = objectProto.hasOwnProperty;

        /**
         * The base implementation of `_.keysIn` which doesn't treat sparse arrays as dense.
         *
         * @private
         * @param {Object} object The object to query.
         * @returns {Array} Returns the array of property names.
         */
        function baseKeysIn(object) {
            if (!isObject(object)) {
                return nativeKeysIn(object);
            }
            var isProto = isPrototype(object),
                result = [];

            for (var key in object) {
                if (!(key == 'constructor' && (isProto || !hasOwnProperty.call(object, key)))) {
                    result.push(key);
                }
            }
            return result;
        }

        module.exports = baseKeysIn;
    }, { "./_isPrototype": 31, "./_nativeKeysIn": 33, "./isObject": 53 }], 15: [function (require, module, exports) {
        var identity = require('./identity'),
            overRest = require('./_overRest'),
            setToString = require('./_setToString');

        /**
         * The base implementation of `_.rest` which doesn't validate or coerce arguments.
         *
         * @private
         * @param {Function} func The function to apply a rest parameter to.
         * @param {number} [start=func.length-1] The start position of the rest parameter.
         * @returns {Function} Returns the new function.
         */
        function baseRest(func, start) {
            return setToString(overRest(func, start, identity), func + '');
        }

        module.exports = baseRest;
    }, { "./_overRest": 37, "./_setToString": 39, "./identity": 46 }], 16: [function (require, module, exports) {
        var constant = require('./constant'),
            defineProperty = require('./_defineProperty'),
            identity = require('./identity');

        /**
         * The base implementation of `setToString` without support for hot loop shorting.
         *
         * @private
         * @param {Function} func The function to modify.
         * @param {Function} string The `toString` result.
         * @returns {Function} Returns `func`.
         */
        var baseSetToString = !defineProperty ? identity : function (func, string) {
            return defineProperty(func, 'toString', {
                'configurable': true,
                'enumerable': false,
                'value': constant(string),
                'writable': true
            });
        };

        module.exports = baseSetToString;
    }, { "./_defineProperty": 23, "./constant": 42, "./identity": 46 }], 17: [function (require, module, exports) {
        /**
         * The base implementation of `_.times` without support for iteratee shorthands
         * or max array length checks.
         *
         * @private
         * @param {number} n The number of times to invoke `iteratee`.
         * @param {Function} iteratee The function invoked per iteration.
         * @returns {Array} Returns the array of results.
         */
        function baseTimes(n, iteratee) {
            var index = -1,
                result = Array(n);

            while (++index < n) {
                result[index] = iteratee(index);
            }
            return result;
        }

        module.exports = baseTimes;
    }, {}], 18: [function (require, module, exports) {
        /**
         * The base implementation of `_.unary` without support for storing metadata.
         *
         * @private
         * @param {Function} func The function to cap arguments for.
         * @returns {Function} Returns the new capped function.
         */
        function baseUnary(func) {
            return function (value) {
                return func(value);
            };
        }

        module.exports = baseUnary;
    }, {}], 19: [function (require, module, exports) {
        var identity = require('./identity');

        /**
         * Casts `value` to `identity` if it's not a function.
         *
         * @private
         * @param {*} value The value to inspect.
         * @returns {Function} Returns cast function.
         */
        function castFunction(value) {
            return typeof value == 'function' ? value : identity;
        }

        module.exports = castFunction;
    }, { "./identity": 46 }], 20: [function (require, module, exports) {
        var root = require('./_root');

        /** Used to detect overreaching core-js shims. */
        var coreJsData = root['__core-js_shared__'];

        module.exports = coreJsData;
    }, { "./_root": 38 }], 21: [function (require, module, exports) {
        var isArrayLike = require('./isArrayLike');

        /**
         * Creates a `baseEach` or `baseEachRight` function.
         *
         * @private
         * @param {Function} eachFunc The function to iterate over a collection.
         * @param {boolean} [fromRight] Specify iterating from right to left.
         * @returns {Function} Returns the new base function.
         */
        function createBaseEach(eachFunc, fromRight) {
            return function (collection, iteratee) {
                if (collection == null) {
                    return collection;
                }
                if (!isArrayLike(collection)) {
                    return eachFunc(collection, iteratee);
                }
                var length = collection.length,
                    index = fromRight ? length : -1,
                    iterable = Object(collection);

                while (fromRight ? index-- : ++index < length) {
                    if (iteratee(iterable[index], index, iterable) === false) {
                        break;
                    }
                }
                return collection;
            };
        }

        module.exports = createBaseEach;
    }, { "./isArrayLike": 49 }], 22: [function (require, module, exports) {
        /**
         * Creates a base function for methods like `_.forIn` and `_.forOwn`.
         *
         * @private
         * @param {boolean} [fromRight] Specify iterating from right to left.
         * @returns {Function} Returns the new base function.
         */
        function createBaseFor(fromRight) {
            return function (object, iteratee, keysFunc) {
                var index = -1,
                    iterable = Object(object),
                    props = keysFunc(object),
                    length = props.length;

                while (length--) {
                    var key = props[fromRight ? length : ++index];
                    if (iteratee(iterable[key], key, iterable) === false) {
                        break;
                    }
                }
                return object;
            };
        }

        module.exports = createBaseFor;
    }, {}], 23: [function (require, module, exports) {
        var getNative = require('./_getNative');

        var defineProperty = function () {
            try {
                var func = getNative(Object, 'defineProperty');
                func({}, '', {});
                return func;
            } catch (e) {}
        }();

        module.exports = defineProperty;
    }, { "./_getNative": 25 }], 24: [function (require, module, exports) {
        (function (global) {
            (function () {
                /** Detect free variable `global` from Node.js. */
                var freeGlobal = (typeof global === "undefined" ? "undefined" : babelHelpers.typeof(global)) == 'object' && global && global.Object === Object && global;

                module.exports = freeGlobal;
            }).call(this);
        }).call(this, typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {});
    }, {}], 25: [function (require, module, exports) {
        var baseIsNative = require('./_baseIsNative'),
            getValue = require('./_getValue');

        /**
         * Gets the native function at `key` of `object`.
         *
         * @private
         * @param {Object} object The object to query.
         * @param {string} key The key of the method to get.
         * @returns {*} Returns the function if it's native, else `undefined`.
         */
        function getNative(object, key) {
            var value = getValue(object, key);
            return baseIsNative(value) ? value : undefined;
        }

        module.exports = getNative;
    }, { "./_baseIsNative": 11, "./_getValue": 27 }], 26: [function (require, module, exports) {
        var _Symbol3 = require('./_Symbol');

        /** Used for built-in method references. */
        var objectProto = Object.prototype;

        /** Used to check objects for own properties. */
        var hasOwnProperty = objectProto.hasOwnProperty;

        /**
         * Used to resolve the
         * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
         * of values.
         */
        var nativeObjectToString = objectProto.toString;

        /** Built-in value references. */
        var symToStringTag = _Symbol3 ? _Symbol3.toStringTag : undefined;

        /**
         * A specialized version of `baseGetTag` which ignores `Symbol.toStringTag` values.
         *
         * @private
         * @param {*} value The value to query.
         * @returns {string} Returns the raw `toStringTag`.
         */
        function getRawTag(value) {
            var isOwn = hasOwnProperty.call(value, symToStringTag),
                tag = value[symToStringTag];

            try {
                value[symToStringTag] = undefined;
                var unmasked = true;
            } catch (e) {}

            var result = nativeObjectToString.call(value);
            if (unmasked) {
                if (isOwn) {
                    value[symToStringTag] = tag;
                } else {
                    delete value[symToStringTag];
                }
            }
            return result;
        }

        module.exports = getRawTag;
    }, { "./_Symbol": 2 }], 27: [function (require, module, exports) {
        /**
         * Gets the value at `key` of `object`.
         *
         * @private
         * @param {Object} [object] The object to query.
         * @param {string} key The key of the property to get.
         * @returns {*} Returns the property value.
         */
        function getValue(object, key) {
            return object == null ? undefined : object[key];
        }

        module.exports = getValue;
    }, {}], 28: [function (require, module, exports) {
        /** Used as references for various `Number` constants. */
        var MAX_SAFE_INTEGER = 9007199254740991;

        /** Used to detect unsigned integer values. */
        var reIsUint = /^(?:0|[1-9]\d*)$/;

        /**
         * Checks if `value` is a valid array-like index.
         *
         * @private
         * @param {*} value The value to check.
         * @param {number} [length=MAX_SAFE_INTEGER] The upper bounds of a valid index.
         * @returns {boolean} Returns `true` if `value` is a valid index, else `false`.
         */
        function isIndex(value, length) {
            var type = typeof value === "undefined" ? "undefined" : babelHelpers.typeof(value);
            length = length == null ? MAX_SAFE_INTEGER : length;

            return !!length && (type == 'number' || type != 'symbol' && reIsUint.test(value)) && value > -1 && value % 1 == 0 && value < length;
        }

        module.exports = isIndex;
    }, {}], 29: [function (require, module, exports) {
        var eq = require('./eq'),
            isArrayLike = require('./isArrayLike'),
            isIndex = require('./_isIndex'),
            isObject = require('./isObject');

        /**
         * Checks if the given arguments are from an iteratee call.
         *
         * @private
         * @param {*} value The potential iteratee value argument.
         * @param {*} index The potential iteratee index or key argument.
         * @param {*} object The potential iteratee object argument.
         * @returns {boolean} Returns `true` if the arguments are from an iteratee call,
         *  else `false`.
         */
        function isIterateeCall(value, index, object) {
            if (!isObject(object)) {
                return false;
            }
            var type = typeof index === "undefined" ? "undefined" : babelHelpers.typeof(index);
            if (type == 'number' ? isArrayLike(object) && isIndex(index, object.length) : type == 'string' && index in object) {
                return eq(object[index], value);
            }
            return false;
        }

        module.exports = isIterateeCall;
    }, { "./_isIndex": 28, "./eq": 44, "./isArrayLike": 49, "./isObject": 53 }], 30: [function (require, module, exports) {
        var coreJsData = require('./_coreJsData');

        /** Used to detect methods masquerading as native. */
        var maskSrcKey = function () {
            var uid = /[^.]+$/.exec(coreJsData && coreJsData.keys && coreJsData.keys.IE_PROTO || '');
            return uid ? 'Symbol(src)_1.' + uid : '';
        }();

        /**
         * Checks if `func` has its source masked.
         *
         * @private
         * @param {Function} func The function to check.
         * @returns {boolean} Returns `true` if `func` is masked, else `false`.
         */
        function isMasked(func) {
            return !!maskSrcKey && maskSrcKey in func;
        }

        module.exports = isMasked;
    }, { "./_coreJsData": 20 }], 31: [function (require, module, exports) {
        /** Used for built-in method references. */
        var objectProto = Object.prototype;

        /**
         * Checks if `value` is likely a prototype object.
         *
         * @private
         * @param {*} value The value to check.
         * @returns {boolean} Returns `true` if `value` is a prototype, else `false`.
         */
        function isPrototype(value) {
            var Ctor = value && value.constructor,
                proto = typeof Ctor == 'function' && Ctor.prototype || objectProto;

            return value === proto;
        }

        module.exports = isPrototype;
    }, {}], 32: [function (require, module, exports) {
        var overArg = require('./_overArg');

        /* Built-in method references for those with the same name as other `lodash` methods. */
        var nativeKeys = overArg(Object.keys, Object);

        module.exports = nativeKeys;
    }, { "./_overArg": 36 }], 33: [function (require, module, exports) {
        /**
         * This function is like
         * [`Object.keys`](http://ecma-international.org/ecma-262/7.0/#sec-object.keys)
         * except that it includes inherited enumerable properties.
         *
         * @private
         * @param {Object} object The object to query.
         * @returns {Array} Returns the array of property names.
         */
        function nativeKeysIn(object) {
            var result = [];
            if (object != null) {
                for (var key in Object(object)) {
                    result.push(key);
                }
            }
            return result;
        }

        module.exports = nativeKeysIn;
    }, {}], 34: [function (require, module, exports) {
        var freeGlobal = require('./_freeGlobal');

        /** Detect free variable `exports`. */
        var freeExports = (typeof exports === "undefined" ? "undefined" : babelHelpers.typeof(exports)) == 'object' && exports && !exports.nodeType && exports;

        /** Detect free variable `module`. */
        var freeModule = freeExports && (typeof module === "undefined" ? "undefined" : babelHelpers.typeof(module)) == 'object' && module && !module.nodeType && module;

        /** Detect the popular CommonJS extension `module.exports`. */
        var moduleExports = freeModule && freeModule.exports === freeExports;

        /** Detect free variable `process` from Node.js. */
        var freeProcess = moduleExports && freeGlobal.process;

        /** Used to access faster Node.js helpers. */
        var nodeUtil = function () {
            try {
                // Use `util.types` for Node.js 10+.
                var types = freeModule && freeModule.require && freeModule.require('util').types;

                if (types) {
                    return types;
                }

                // Legacy `process.binding('util')` for Node.js < 10.
                return freeProcess && freeProcess.binding && freeProcess.binding('util');
            } catch (e) {}
        }();

        module.exports = nodeUtil;
    }, { "./_freeGlobal": 24 }], 35: [function (require, module, exports) {
        /** Used for built-in method references. */
        var objectProto = Object.prototype;

        /**
         * Used to resolve the
         * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
         * of values.
         */
        var nativeObjectToString = objectProto.toString;

        /**
         * Converts `value` to a string using `Object.prototype.toString`.
         *
         * @private
         * @param {*} value The value to convert.
         * @returns {string} Returns the converted string.
         */
        function objectToString(value) {
            return nativeObjectToString.call(value);
        }

        module.exports = objectToString;
    }, {}], 36: [function (require, module, exports) {
        /**
         * Creates a unary function that invokes `func` with its argument transformed.
         *
         * @private
         * @param {Function} func The function to wrap.
         * @param {Function} transform The argument transform.
         * @returns {Function} Returns the new function.
         */
        function overArg(func, transform) {
            return function (arg) {
                return func(transform(arg));
            };
        }

        module.exports = overArg;
    }, {}], 37: [function (require, module, exports) {
        var apply = require('./_apply');

        /* Built-in method references for those with the same name as other `lodash` methods. */
        var nativeMax = Math.max;

        /**
         * A specialized version of `baseRest` which transforms the rest array.
         *
         * @private
         * @param {Function} func The function to apply a rest parameter to.
         * @param {number} [start=func.length-1] The start position of the rest parameter.
         * @param {Function} transform The rest array transform.
         * @returns {Function} Returns the new function.
         */
        function overRest(func, start, transform) {
            start = nativeMax(start === undefined ? func.length - 1 : start, 0);
            return function () {
                var args = arguments,
                    index = -1,
                    length = nativeMax(args.length - start, 0),
                    array = Array(length);

                while (++index < length) {
                    array[index] = args[start + index];
                }
                index = -1;
                var otherArgs = Array(start + 1);
                while (++index < start) {
                    otherArgs[index] = args[index];
                }
                otherArgs[start] = transform(array);
                return apply(func, this, otherArgs);
            };
        }

        module.exports = overRest;
    }, { "./_apply": 3 }], 38: [function (require, module, exports) {
        var freeGlobal = require('./_freeGlobal');

        /** Detect free variable `self`. */
        var freeSelf = (typeof self === "undefined" ? "undefined" : babelHelpers.typeof(self)) == 'object' && self && self.Object === Object && self;

        /** Used as a reference to the global object. */
        var root = freeGlobal || freeSelf || Function('return this')();

        module.exports = root;
    }, { "./_freeGlobal": 24 }], 39: [function (require, module, exports) {
        var baseSetToString = require('./_baseSetToString'),
            shortOut = require('./_shortOut');

        /**
         * Sets the `toString` method of `func` to return `string`.
         *
         * @private
         * @param {Function} func The function to modify.
         * @param {Function} string The `toString` result.
         * @returns {Function} Returns `func`.
         */
        var setToString = shortOut(baseSetToString);

        module.exports = setToString;
    }, { "./_baseSetToString": 16, "./_shortOut": 40 }], 40: [function (require, module, exports) {
        /** Used to detect hot functions by number of calls within a span of milliseconds. */
        var HOT_COUNT = 800,
            HOT_SPAN = 16;

        /* Built-in method references for those with the same name as other `lodash` methods. */
        var nativeNow = Date.now;

        /**
         * Creates a function that'll short out and invoke `identity` instead
         * of `func` when it's called `HOT_COUNT` or more times in `HOT_SPAN`
         * milliseconds.
         *
         * @private
         * @param {Function} func The function to restrict.
         * @returns {Function} Returns the new shortable function.
         */
        function shortOut(func) {
            var count = 0,
                lastCalled = 0;

            return function () {
                var stamp = nativeNow(),
                    remaining = HOT_SPAN - (stamp - lastCalled);

                lastCalled = stamp;
                if (remaining > 0) {
                    if (++count >= HOT_COUNT) {
                        return arguments[0];
                    }
                } else {
                    count = 0;
                }
                return func.apply(undefined, arguments);
            };
        }

        module.exports = shortOut;
    }, {}], 41: [function (require, module, exports) {
        /** Used for built-in method references. */
        var funcProto = Function.prototype;

        /** Used to resolve the decompiled source of functions. */
        var funcToString = funcProto.toString;

        /**
         * Converts `func` to its source code.
         *
         * @private
         * @param {Function} func The function to convert.
         * @returns {string} Returns the source code.
         */
        function toSource(func) {
            if (func != null) {
                try {
                    return funcToString.call(func);
                } catch (e) {}
                try {
                    return func + '';
                } catch (e) {}
            }
            return '';
        }

        module.exports = toSource;
    }, {}], 42: [function (require, module, exports) {
        /**
         * Creates a function that returns `value`.
         *
         * @static
         * @memberOf _
         * @since 2.4.0
         * @category Util
         * @param {*} value The value to return from the new function.
         * @returns {Function} Returns the new constant function.
         * @example
         *
         * var objects = _.times(2, _.constant({ 'a': 1 }));
         *
         * console.log(objects);
         * // => [{ 'a': 1 }, { 'a': 1 }]
         *
         * console.log(objects[0] === objects[1]);
         * // => true
         */
        function constant(value) {
            return function () {
                return value;
            };
        }

        module.exports = constant;
    }, {}], 43: [function (require, module, exports) {
        var baseRest = require('./_baseRest'),
            eq = require('./eq'),
            isIterateeCall = require('./_isIterateeCall'),
            keysIn = require('./keysIn');

        /** Used for built-in method references. */
        var objectProto = Object.prototype;

        /** Used to check objects for own properties. */
        var hasOwnProperty = objectProto.hasOwnProperty;

        /**
         * Assigns own and inherited enumerable string keyed properties of source
         * objects to the destination object for all destination properties that
         * resolve to `undefined`. Source objects are applied from left to right.
         * Once a property is set, additional values of the same property are ignored.
         *
         * **Note:** This method mutates `object`.
         *
         * @static
         * @since 0.1.0
         * @memberOf _
         * @category Object
         * @param {Object} object The destination object.
         * @param {...Object} [sources] The source objects.
         * @returns {Object} Returns `object`.
         * @see _.defaultsDeep
         * @example
         *
         * _.defaults({ 'a': 1 }, { 'b': 2 }, { 'a': 3 });
         * // => { 'a': 1, 'b': 2 }
         */
        var defaults = baseRest(function (object, sources) {
            object = Object(object);

            var index = -1;
            var length = sources.length;
            var guard = length > 2 ? sources[2] : undefined;

            if (guard && isIterateeCall(sources[0], sources[1], guard)) {
                length = 1;
            }

            while (++index < length) {
                var source = sources[index];
                var props = keysIn(source);
                var propsIndex = -1;
                var propsLength = props.length;

                while (++propsIndex < propsLength) {
                    var key = props[propsIndex];
                    var value = object[key];

                    if (value === undefined || eq(value, objectProto[key]) && !hasOwnProperty.call(object, key)) {
                        object[key] = source[key];
                    }
                }
            }

            return object;
        });

        module.exports = defaults;
    }, { "./_baseRest": 15, "./_isIterateeCall": 29, "./eq": 44, "./keysIn": 57 }], 44: [function (require, module, exports) {
        /**
         * Performs a
         * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
         * comparison between two values to determine if they are equivalent.
         *
         * @static
         * @memberOf _
         * @since 4.0.0
         * @category Lang
         * @param {*} value The value to compare.
         * @param {*} other The other value to compare.
         * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
         * @example
         *
         * var object = { 'a': 1 };
         * var other = { 'a': 1 };
         *
         * _.eq(object, object);
         * // => true
         *
         * _.eq(object, other);
         * // => false
         *
         * _.eq('a', 'a');
         * // => true
         *
         * _.eq('a', Object('a'));
         * // => false
         *
         * _.eq(NaN, NaN);
         * // => true
         */
        function eq(value, other) {
            return value === other || value !== value && other !== other;
        }

        module.exports = eq;
    }, {}], 45: [function (require, module, exports) {
        var arrayEach = require('./_arrayEach'),
            baseEach = require('./_baseEach'),
            castFunction = require('./_castFunction'),
            isArray = require('./isArray');

        /**
         * Iterates over elements of `collection` and invokes `iteratee` for each element.
         * The iteratee is invoked with three arguments: (value, index|key, collection).
         * Iteratee functions may exit iteration early by explicitly returning `false`.
         *
         * **Note:** As with other "Collections" methods, objects with a "length"
         * property are iterated like arrays. To avoid this behavior use `_.forIn`
         * or `_.forOwn` for object iteration.
         *
         * @static
         * @memberOf _
         * @since 0.1.0
         * @alias each
         * @category Collection
         * @param {Array|Object} collection The collection to iterate over.
         * @param {Function} [iteratee=_.identity] The function invoked per iteration.
         * @returns {Array|Object} Returns `collection`.
         * @see _.forEachRight
         * @example
         *
         * _.forEach([1, 2], function(value) {
         *   console.log(value);
         * });
         * // => Logs `1` then `2`.
         *
         * _.forEach({ 'a': 1, 'b': 2 }, function(value, key) {
         *   console.log(key);
         * });
         * // => Logs 'a' then 'b' (iteration order is not guaranteed).
         */
        function forEach(collection, iteratee) {
            var func = isArray(collection) ? arrayEach : baseEach;
            return func(collection, castFunction(iteratee));
        }

        module.exports = forEach;
    }, { "./_arrayEach": 4, "./_baseEach": 6, "./_castFunction": 19, "./isArray": 48 }], 46: [function (require, module, exports) {
        /**
         * This method returns the first argument it receives.
         *
         * @static
         * @since 0.1.0
         * @memberOf _
         * @category Util
         * @param {*} value Any value.
         * @returns {*} Returns `value`.
         * @example
         *
         * var object = { 'a': 1 };
         *
         * console.log(_.identity(object) === object);
         * // => true
         */
        function identity(value) {
            return value;
        }

        module.exports = identity;
    }, {}], 47: [function (require, module, exports) {
        var baseIsArguments = require('./_baseIsArguments'),
            isObjectLike = require('./isObjectLike');

        /** Used for built-in method references. */
        var objectProto = Object.prototype;

        /** Used to check objects for own properties. */
        var hasOwnProperty = objectProto.hasOwnProperty;

        /** Built-in value references. */
        var propertyIsEnumerable = objectProto.propertyIsEnumerable;

        /**
         * Checks if `value` is likely an `arguments` object.
         *
         * @static
         * @memberOf _
         * @since 0.1.0
         * @category Lang
         * @param {*} value The value to check.
         * @returns {boolean} Returns `true` if `value` is an `arguments` object,
         *  else `false`.
         * @example
         *
         * _.isArguments(function() { return arguments; }());
         * // => true
         *
         * _.isArguments([1, 2, 3]);
         * // => false
         */
        var isArguments = baseIsArguments(function () {
            return arguments;
        }()) ? baseIsArguments : function (value) {
            return isObjectLike(value) && hasOwnProperty.call(value, 'callee') && !propertyIsEnumerable.call(value, 'callee');
        };

        module.exports = isArguments;
    }, { "./_baseIsArguments": 10, "./isObjectLike": 54 }], 48: [function (require, module, exports) {
        /**
         * Checks if `value` is classified as an `Array` object.
         *
         * @static
         * @memberOf _
         * @since 0.1.0
         * @category Lang
         * @param {*} value The value to check.
         * @returns {boolean} Returns `true` if `value` is an array, else `false`.
         * @example
         *
         * _.isArray([1, 2, 3]);
         * // => true
         *
         * _.isArray(document.body.children);
         * // => false
         *
         * _.isArray('abc');
         * // => false
         *
         * _.isArray(_.noop);
         * // => false
         */
        var isArray = Array.isArray;

        module.exports = isArray;
    }, {}], 49: [function (require, module, exports) {
        var isFunction = require('./isFunction'),
            isLength = require('./isLength');

        /**
         * Checks if `value` is array-like. A value is considered array-like if it's
         * not a function and has a `value.length` that's an integer greater than or
         * equal to `0` and less than or equal to `Number.MAX_SAFE_INTEGER`.
         *
         * @static
         * @memberOf _
         * @since 4.0.0
         * @category Lang
         * @param {*} value The value to check.
         * @returns {boolean} Returns `true` if `value` is array-like, else `false`.
         * @example
         *
         * _.isArrayLike([1, 2, 3]);
         * // => true
         *
         * _.isArrayLike(document.body.children);
         * // => true
         *
         * _.isArrayLike('abc');
         * // => true
         *
         * _.isArrayLike(_.noop);
         * // => false
         */
        function isArrayLike(value) {
            return value != null && isLength(value.length) && !isFunction(value);
        }

        module.exports = isArrayLike;
    }, { "./isFunction": 51, "./isLength": 52 }], 50: [function (require, module, exports) {
        var root = require('./_root'),
            stubFalse = require('./stubFalse');

        /** Detect free variable `exports`. */
        var freeExports = (typeof exports === "undefined" ? "undefined" : babelHelpers.typeof(exports)) == 'object' && exports && !exports.nodeType && exports;

        /** Detect free variable `module`. */
        var freeModule = freeExports && (typeof module === "undefined" ? "undefined" : babelHelpers.typeof(module)) == 'object' && module && !module.nodeType && module;

        /** Detect the popular CommonJS extension `module.exports`. */
        var moduleExports = freeModule && freeModule.exports === freeExports;

        /** Built-in value references. */
        var Buffer = moduleExports ? root.Buffer : undefined;

        /* Built-in method references for those with the same name as other `lodash` methods. */
        var nativeIsBuffer = Buffer ? Buffer.isBuffer : undefined;

        /**
         * Checks if `value` is a buffer.
         *
         * @static
         * @memberOf _
         * @since 4.3.0
         * @category Lang
         * @param {*} value The value to check.
         * @returns {boolean} Returns `true` if `value` is a buffer, else `false`.
         * @example
         *
         * _.isBuffer(new Buffer(2));
         * // => true
         *
         * _.isBuffer(new Uint8Array(2));
         * // => false
         */
        var isBuffer = nativeIsBuffer || stubFalse;

        module.exports = isBuffer;
    }, { "./_root": 38, "./stubFalse": 58 }], 51: [function (require, module, exports) {
        var baseGetTag = require('./_baseGetTag'),
            isObject = require('./isObject');

        /** `Object#toString` result references. */
        var asyncTag = '[object AsyncFunction]',
            funcTag = '[object Function]',
            genTag = '[object GeneratorFunction]',
            proxyTag = '[object Proxy]';

        /**
         * Checks if `value` is classified as a `Function` object.
         *
         * @static
         * @memberOf _
         * @since 0.1.0
         * @category Lang
         * @param {*} value The value to check.
         * @returns {boolean} Returns `true` if `value` is a function, else `false`.
         * @example
         *
         * _.isFunction(_);
         * // => true
         *
         * _.isFunction(/abc/);
         * // => false
         */
        function isFunction(value) {
            if (!isObject(value)) {
                return false;
            }
            // The use of `Object#toString` avoids issues with the `typeof` operator
            // in Safari 9 which returns 'object' for typed arrays and other constructors.
            var tag = baseGetTag(value);
            return tag == funcTag || tag == genTag || tag == asyncTag || tag == proxyTag;
        }

        module.exports = isFunction;
    }, { "./_baseGetTag": 9, "./isObject": 53 }], 52: [function (require, module, exports) {
        /** Used as references for various `Number` constants. */
        var MAX_SAFE_INTEGER = 9007199254740991;

        /**
         * Checks if `value` is a valid array-like length.
         *
         * **Note:** This method is loosely based on
         * [`ToLength`](http://ecma-international.org/ecma-262/7.0/#sec-tolength).
         *
         * @static
         * @memberOf _
         * @since 4.0.0
         * @category Lang
         * @param {*} value The value to check.
         * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
         * @example
         *
         * _.isLength(3);
         * // => true
         *
         * _.isLength(Number.MIN_VALUE);
         * // => false
         *
         * _.isLength(Infinity);
         * // => false
         *
         * _.isLength('3');
         * // => false
         */
        function isLength(value) {
            return typeof value == 'number' && value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
        }

        module.exports = isLength;
    }, {}], 53: [function (require, module, exports) {
        /**
         * Checks if `value` is the
         * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
         * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
         *
         * @static
         * @memberOf _
         * @since 0.1.0
         * @category Lang
         * @param {*} value The value to check.
         * @returns {boolean} Returns `true` if `value` is an object, else `false`.
         * @example
         *
         * _.isObject({});
         * // => true
         *
         * _.isObject([1, 2, 3]);
         * // => true
         *
         * _.isObject(_.noop);
         * // => true
         *
         * _.isObject(null);
         * // => false
         */
        function isObject(value) {
            var type = typeof value === "undefined" ? "undefined" : babelHelpers.typeof(value);
            return value != null && (type == 'object' || type == 'function');
        }

        module.exports = isObject;
    }, {}], 54: [function (require, module, exports) {
        /**
         * Checks if `value` is object-like. A value is object-like if it's not `null`
         * and has a `typeof` result of "object".
         *
         * @static
         * @memberOf _
         * @since 4.0.0
         * @category Lang
         * @param {*} value The value to check.
         * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
         * @example
         *
         * _.isObjectLike({});
         * // => true
         *
         * _.isObjectLike([1, 2, 3]);
         * // => true
         *
         * _.isObjectLike(_.noop);
         * // => false
         *
         * _.isObjectLike(null);
         * // => false
         */
        function isObjectLike(value) {
            return value != null && (typeof value === "undefined" ? "undefined" : babelHelpers.typeof(value)) == 'object';
        }

        module.exports = isObjectLike;
    }, {}], 55: [function (require, module, exports) {
        var baseIsTypedArray = require('./_baseIsTypedArray'),
            baseUnary = require('./_baseUnary'),
            nodeUtil = require('./_nodeUtil');

        /* Node.js helper references. */
        var nodeIsTypedArray = nodeUtil && nodeUtil.isTypedArray;

        /**
         * Checks if `value` is classified as a typed array.
         *
         * @static
         * @memberOf _
         * @since 3.0.0
         * @category Lang
         * @param {*} value The value to check.
         * @returns {boolean} Returns `true` if `value` is a typed array, else `false`.
         * @example
         *
         * _.isTypedArray(new Uint8Array);
         * // => true
         *
         * _.isTypedArray([]);
         * // => false
         */
        var isTypedArray = nodeIsTypedArray ? baseUnary(nodeIsTypedArray) : baseIsTypedArray;

        module.exports = isTypedArray;
    }, { "./_baseIsTypedArray": 12, "./_baseUnary": 18, "./_nodeUtil": 34 }], 56: [function (require, module, exports) {
        var arrayLikeKeys = require('./_arrayLikeKeys'),
            baseKeys = require('./_baseKeys'),
            isArrayLike = require('./isArrayLike');

        /**
         * Creates an array of the own enumerable property names of `object`.
         *
         * **Note:** Non-object values are coerced to objects. See the
         * [ES spec](http://ecma-international.org/ecma-262/7.0/#sec-object.keys)
         * for more details.
         *
         * @static
         * @since 0.1.0
         * @memberOf _
         * @category Object
         * @param {Object} object The object to query.
         * @returns {Array} Returns the array of property names.
         * @example
         *
         * function Foo() {
         *   this.a = 1;
         *   this.b = 2;
         * }
         *
         * Foo.prototype.c = 3;
         *
         * _.keys(new Foo);
         * // => ['a', 'b'] (iteration order is not guaranteed)
         *
         * _.keys('hi');
         * // => ['0', '1']
         */
        function keys(object) {
            return isArrayLike(object) ? arrayLikeKeys(object) : baseKeys(object);
        }

        module.exports = keys;
    }, { "./_arrayLikeKeys": 5, "./_baseKeys": 13, "./isArrayLike": 49 }], 57: [function (require, module, exports) {
        var arrayLikeKeys = require('./_arrayLikeKeys'),
            baseKeysIn = require('./_baseKeysIn'),
            isArrayLike = require('./isArrayLike');

        /**
         * Creates an array of the own and inherited enumerable property names of `object`.
         *
         * **Note:** Non-object values are coerced to objects.
         *
         * @static
         * @memberOf _
         * @since 3.0.0
         * @category Object
         * @param {Object} object The object to query.
         * @returns {Array} Returns the array of property names.
         * @example
         *
         * function Foo() {
         *   this.a = 1;
         *   this.b = 2;
         * }
         *
         * Foo.prototype.c = 3;
         *
         * _.keysIn(new Foo);
         * // => ['a', 'b', 'c'] (iteration order is not guaranteed)
         */
        function keysIn(object) {
            return isArrayLike(object) ? arrayLikeKeys(object, true) : baseKeysIn(object);
        }

        module.exports = keysIn;
    }, { "./_arrayLikeKeys": 5, "./_baseKeysIn": 14, "./isArrayLike": 49 }], 58: [function (require, module, exports) {
        /**
         * This method returns `false`.
         *
         * @static
         * @memberOf _
         * @since 4.13.0
         * @category Util
         * @returns {boolean} Returns `false`.
         * @example
         *
         * _.times(2, _.stubFalse);
         * // => [false, false]
         */
        function stubFalse() {
            return false;
        }

        module.exports = stubFalse;
    }, {}], 59: [function (require, module, exports) {
        //! moment.js
        //! version : 2.29.1
        //! authors : Tim Wood, Iskren Chernev, Moment.js contributors
        //! license : MIT
        //! momentjs.com

        ;(function (global, factory) {
            (typeof exports === "undefined" ? "undefined" : babelHelpers.typeof(exports)) === 'object' && typeof module !== 'undefined' ? module.exports = factory() : typeof define === 'function' && define.amd ? define(factory) : global.moment = factory();
        })(this, function () {
            'use strict';

            var hookCallback;

            function hooks() {
                return hookCallback.apply(null, arguments);
            }

            // This is done to register the method called with moment()
            // without creating circular dependencies.
            function setHookCallback(callback) {
                hookCallback = callback;
            }

            function isArray(input) {
                return input instanceof Array || Object.prototype.toString.call(input) === '[object Array]';
            }

            function isObject(input) {
                // IE8 will treat undefined and null as object if it wasn't for
                // input != null
                return input != null && Object.prototype.toString.call(input) === '[object Object]';
            }

            function hasOwnProp(a, b) {
                return Object.prototype.hasOwnProperty.call(a, b);
            }

            function isObjectEmpty(obj) {
                if (Object.getOwnPropertyNames) {
                    return Object.getOwnPropertyNames(obj).length === 0;
                } else {
                    var k;
                    for (k in obj) {
                        if (hasOwnProp(obj, k)) {
                            return false;
                        }
                    }
                    return true;
                }
            }

            function isUndefined(input) {
                return input === void 0;
            }

            function isNumber(input) {
                return typeof input === 'number' || Object.prototype.toString.call(input) === '[object Number]';
            }

            function isDate(input) {
                return input instanceof Date || Object.prototype.toString.call(input) === '[object Date]';
            }

            function map(arr, fn) {
                var res = [],
                    i;
                for (i = 0; i < arr.length; ++i) {
                    res.push(fn(arr[i], i));
                }
                return res;
            }

            function extend(a, b) {
                for (var i in b) {
                    if (hasOwnProp(b, i)) {
                        a[i] = b[i];
                    }
                }

                if (hasOwnProp(b, 'toString')) {
                    a.toString = b.toString;
                }

                if (hasOwnProp(b, 'valueOf')) {
                    a.valueOf = b.valueOf;
                }

                return a;
            }

            function createUTC(input, format, locale, strict) {
                return createLocalOrUTC(input, format, locale, strict, true).utc();
            }

            function defaultParsingFlags() {
                // We need to deep clone this object.
                return {
                    empty: false,
                    unusedTokens: [],
                    unusedInput: [],
                    overflow: -2,
                    charsLeftOver: 0,
                    nullInput: false,
                    invalidEra: null,
                    invalidMonth: null,
                    invalidFormat: false,
                    userInvalidated: false,
                    iso: false,
                    parsedDateParts: [],
                    era: null,
                    meridiem: null,
                    rfc2822: false,
                    weekdayMismatch: false
                };
            }

            function getParsingFlags(m) {
                if (m._pf == null) {
                    m._pf = defaultParsingFlags();
                }
                return m._pf;
            }

            var some;
            if (Array.prototype.some) {
                some = Array.prototype.some;
            } else {
                some = function some(fun) {
                    var t = Object(this),
                        len = t.length >>> 0,
                        i;

                    for (i = 0; i < len; i++) {
                        if (i in t && fun.call(this, t[i], i, t)) {
                            return true;
                        }
                    }

                    return false;
                };
            }

            function isValid(m) {
                if (m._isValid == null) {
                    var flags = getParsingFlags(m),
                        parsedParts = some.call(flags.parsedDateParts, function (i) {
                        return i != null;
                    }),
                        isNowValid = !isNaN(m._d.getTime()) && flags.overflow < 0 && !flags.empty && !flags.invalidEra && !flags.invalidMonth && !flags.invalidWeekday && !flags.weekdayMismatch && !flags.nullInput && !flags.invalidFormat && !flags.userInvalidated && (!flags.meridiem || flags.meridiem && parsedParts);

                    if (m._strict) {
                        isNowValid = isNowValid && flags.charsLeftOver === 0 && flags.unusedTokens.length === 0 && flags.bigHour === undefined;
                    }

                    if (Object.isFrozen == null || !Object.isFrozen(m)) {
                        m._isValid = isNowValid;
                    } else {
                        return isNowValid;
                    }
                }
                return m._isValid;
            }

            function createInvalid(flags) {
                var m = createUTC(NaN);
                if (flags != null) {
                    extend(getParsingFlags(m), flags);
                } else {
                    getParsingFlags(m).userInvalidated = true;
                }

                return m;
            }

            // Plugins that add properties should also add the key here (null value),
            // so we can properly clone ourselves.
            var momentProperties = hooks.momentProperties = [],
                updateInProgress = false;

            function copyConfig(to, from) {
                var i, prop, val;

                if (!isUndefined(from._isAMomentObject)) {
                    to._isAMomentObject = from._isAMomentObject;
                }
                if (!isUndefined(from._i)) {
                    to._i = from._i;
                }
                if (!isUndefined(from._f)) {
                    to._f = from._f;
                }
                if (!isUndefined(from._l)) {
                    to._l = from._l;
                }
                if (!isUndefined(from._strict)) {
                    to._strict = from._strict;
                }
                if (!isUndefined(from._tzm)) {
                    to._tzm = from._tzm;
                }
                if (!isUndefined(from._isUTC)) {
                    to._isUTC = from._isUTC;
                }
                if (!isUndefined(from._offset)) {
                    to._offset = from._offset;
                }
                if (!isUndefined(from._pf)) {
                    to._pf = getParsingFlags(from);
                }
                if (!isUndefined(from._locale)) {
                    to._locale = from._locale;
                }

                if (momentProperties.length > 0) {
                    for (i = 0; i < momentProperties.length; i++) {
                        prop = momentProperties[i];
                        val = from[prop];
                        if (!isUndefined(val)) {
                            to[prop] = val;
                        }
                    }
                }

                return to;
            }

            // Moment prototype object
            function Moment(config) {
                copyConfig(this, config);
                this._d = new Date(config._d != null ? config._d.getTime() : NaN);
                if (!this.isValid()) {
                    this._d = new Date(NaN);
                }
                // Prevent infinite loop in case updateOffset creates new moment
                // objects.
                if (updateInProgress === false) {
                    updateInProgress = true;
                    hooks.updateOffset(this);
                    updateInProgress = false;
                }
            }

            function isMoment(obj) {
                return obj instanceof Moment || obj != null && obj._isAMomentObject != null;
            }

            function warn(msg) {
                if (hooks.suppressDeprecationWarnings === false && typeof console !== 'undefined' && console.warn) {
                    console.warn('Deprecation warning: ' + msg);
                }
            }

            function deprecate(msg, fn) {
                var firstTime = true;

                return extend(function () {
                    if (hooks.deprecationHandler != null) {
                        hooks.deprecationHandler(null, msg);
                    }
                    if (firstTime) {
                        var args = [],
                            arg,
                            i,
                            key;
                        for (i = 0; i < arguments.length; i++) {
                            arg = '';
                            if (babelHelpers.typeof(arguments[i]) === 'object') {
                                arg += '\n[' + i + '] ';
                                for (key in arguments[0]) {
                                    if (hasOwnProp(arguments[0], key)) {
                                        arg += key + ': ' + arguments[0][key] + ', ';
                                    }
                                }
                                arg = arg.slice(0, -2); // Remove trailing comma and space
                            } else {
                                arg = arguments[i];
                            }
                            args.push(arg);
                        }
                        warn(msg + '\nArguments: ' + Array.prototype.slice.call(args).join('') + '\n' + new Error().stack);
                        firstTime = false;
                    }
                    return fn.apply(this, arguments);
                }, fn);
            }

            var deprecations = {};

            function deprecateSimple(name, msg) {
                if (hooks.deprecationHandler != null) {
                    hooks.deprecationHandler(name, msg);
                }
                if (!deprecations[name]) {
                    warn(msg);
                    deprecations[name] = true;
                }
            }

            hooks.suppressDeprecationWarnings = false;
            hooks.deprecationHandler = null;

            function isFunction(input) {
                return typeof Function !== 'undefined' && input instanceof Function || Object.prototype.toString.call(input) === '[object Function]';
            }

            function set(config) {
                var prop, i;
                for (i in config) {
                    if (hasOwnProp(config, i)) {
                        prop = config[i];
                        if (isFunction(prop)) {
                            this[i] = prop;
                        } else {
                            this['_' + i] = prop;
                        }
                    }
                }
                this._config = config;
                // Lenient ordinal parsing accepts just a number in addition to
                // number + (possibly) stuff coming from _dayOfMonthOrdinalParse.
                // TODO: Remove "ordinalParse" fallback in next major release.
                this._dayOfMonthOrdinalParseLenient = new RegExp((this._dayOfMonthOrdinalParse.source || this._ordinalParse.source) + '|' + /\d{1,2}/.source);
            }

            function mergeConfigs(parentConfig, childConfig) {
                var res = extend({}, parentConfig),
                    prop;
                for (prop in childConfig) {
                    if (hasOwnProp(childConfig, prop)) {
                        if (isObject(parentConfig[prop]) && isObject(childConfig[prop])) {
                            res[prop] = {};
                            extend(res[prop], parentConfig[prop]);
                            extend(res[prop], childConfig[prop]);
                        } else if (childConfig[prop] != null) {
                            res[prop] = childConfig[prop];
                        } else {
                            delete res[prop];
                        }
                    }
                }
                for (prop in parentConfig) {
                    if (hasOwnProp(parentConfig, prop) && !hasOwnProp(childConfig, prop) && isObject(parentConfig[prop])) {
                        // make sure changes to properties don't modify parent config
                        res[prop] = extend({}, res[prop]);
                    }
                }
                return res;
            }

            function Locale(config) {
                if (config != null) {
                    this.set(config);
                }
            }

            var keys;

            if (Object.keys) {
                keys = Object.keys;
            } else {
                keys = function keys(obj) {
                    var i,
                        res = [];
                    for (i in obj) {
                        if (hasOwnProp(obj, i)) {
                            res.push(i);
                        }
                    }
                    return res;
                };
            }

            var defaultCalendar = {
                sameDay: '[Today at] LT',
                nextDay: '[Tomorrow at] LT',
                nextWeek: 'dddd [at] LT',
                lastDay: '[Yesterday at] LT',
                lastWeek: '[Last] dddd [at] LT',
                sameElse: 'L'
            };

            function calendar(key, mom, now) {
                var output = this._calendar[key] || this._calendar['sameElse'];
                return isFunction(output) ? output.call(mom, now) : output;
            }

            function zeroFill(number, targetLength, forceSign) {
                var absNumber = '' + Math.abs(number),
                    zerosToFill = targetLength - absNumber.length,
                    sign = number >= 0;
                return (sign ? forceSign ? '+' : '' : '-') + Math.pow(10, Math.max(0, zerosToFill)).toString().substr(1) + absNumber;
            }

            var formattingTokens = /(\[[^\[]*\])|(\\)?([Hh]mm(ss)?|Mo|MM?M?M?|Do|DDDo|DD?D?D?|ddd?d?|do?|w[o|w]?|W[o|W]?|Qo?|N{1,5}|YYYYYY|YYYYY|YYYY|YY|y{2,4}|yo?|gg(ggg?)?|GG(GGG?)?|e|E|a|A|hh?|HH?|kk?|mm?|ss?|S{1,9}|x|X|zz?|ZZ?|.)/g,
                localFormattingTokens = /(\[[^\[]*\])|(\\)?(LTS|LT|LL?L?L?|l{1,4})/g,
                formatFunctions = {},
                formatTokenFunctions = {};

            // token:    'M'
            // padded:   ['MM', 2]
            // ordinal:  'Mo'
            // callback: function () { this.month() + 1 }
            function addFormatToken(token, padded, ordinal, callback) {
                var func = callback;
                if (typeof callback === 'string') {
                    func = function func() {
                        return this[callback]();
                    };
                }
                if (token) {
                    formatTokenFunctions[token] = func;
                }
                if (padded) {
                    formatTokenFunctions[padded[0]] = function () {
                        return zeroFill(func.apply(this, arguments), padded[1], padded[2]);
                    };
                }
                if (ordinal) {
                    formatTokenFunctions[ordinal] = function () {
                        return this.localeData().ordinal(func.apply(this, arguments), token);
                    };
                }
            }

            function removeFormattingTokens(input) {
                if (input.match(/\[[\s\S]/)) {
                    return input.replace(/^\[|\]$/g, '');
                }
                return input.replace(/\\/g, '');
            }

            function makeFormatFunction(format) {
                var array = format.match(formattingTokens),
                    i,
                    length;

                for (i = 0, length = array.length; i < length; i++) {
                    if (formatTokenFunctions[array[i]]) {
                        array[i] = formatTokenFunctions[array[i]];
                    } else {
                        array[i] = removeFormattingTokens(array[i]);
                    }
                }

                return function (mom) {
                    var output = '',
                        i;
                    for (i = 0; i < length; i++) {
                        output += isFunction(array[i]) ? array[i].call(mom, format) : array[i];
                    }
                    return output;
                };
            }

            // format date using native date object
            function formatMoment(m, format) {
                if (!m.isValid()) {
                    return m.localeData().invalidDate();
                }

                format = expandFormat(format, m.localeData());
                formatFunctions[format] = formatFunctions[format] || makeFormatFunction(format);

                return formatFunctions[format](m);
            }

            function expandFormat(format, locale) {
                var i = 5;

                function replaceLongDateFormatTokens(input) {
                    return locale.longDateFormat(input) || input;
                }

                localFormattingTokens.lastIndex = 0;
                while (i >= 0 && localFormattingTokens.test(format)) {
                    format = format.replace(localFormattingTokens, replaceLongDateFormatTokens);
                    localFormattingTokens.lastIndex = 0;
                    i -= 1;
                }

                return format;
            }

            var defaultLongDateFormat = {
                LTS: 'h:mm:ss A',
                LT: 'h:mm A',
                L: 'MM/DD/YYYY',
                LL: 'MMMM D, YYYY',
                LLL: 'MMMM D, YYYY h:mm A',
                LLLL: 'dddd, MMMM D, YYYY h:mm A'
            };

            function longDateFormat(key) {
                var format = this._longDateFormat[key],
                    formatUpper = this._longDateFormat[key.toUpperCase()];

                if (format || !formatUpper) {
                    return format;
                }

                this._longDateFormat[key] = formatUpper.match(formattingTokens).map(function (tok) {
                    if (tok === 'MMMM' || tok === 'MM' || tok === 'DD' || tok === 'dddd') {
                        return tok.slice(1);
                    }
                    return tok;
                }).join('');

                return this._longDateFormat[key];
            }

            var defaultInvalidDate = 'Invalid date';

            function invalidDate() {
                return this._invalidDate;
            }

            var defaultOrdinal = '%d',
                defaultDayOfMonthOrdinalParse = /\d{1,2}/;

            function ordinal(number) {
                return this._ordinal.replace('%d', number);
            }

            var defaultRelativeTime = {
                future: 'in %s',
                past: '%s ago',
                s: 'a few seconds',
                ss: '%d seconds',
                m: 'a minute',
                mm: '%d minutes',
                h: 'an hour',
                hh: '%d hours',
                d: 'a day',
                dd: '%d days',
                w: 'a week',
                ww: '%d weeks',
                M: 'a month',
                MM: '%d months',
                y: 'a year',
                yy: '%d years'
            };

            function relativeTime(number, withoutSuffix, string, isFuture) {
                var output = this._relativeTime[string];
                return isFunction(output) ? output(number, withoutSuffix, string, isFuture) : output.replace(/%d/i, number);
            }

            function pastFuture(diff, output) {
                var format = this._relativeTime[diff > 0 ? 'future' : 'past'];
                return isFunction(format) ? format(output) : format.replace(/%s/i, output);
            }

            var aliases = {};

            function addUnitAlias(unit, shorthand) {
                var lowerCase = unit.toLowerCase();
                aliases[lowerCase] = aliases[lowerCase + 's'] = aliases[shorthand] = unit;
            }

            function normalizeUnits(units) {
                return typeof units === 'string' ? aliases[units] || aliases[units.toLowerCase()] : undefined;
            }

            function normalizeObjectUnits(inputObject) {
                var normalizedInput = {},
                    normalizedProp,
                    prop;

                for (prop in inputObject) {
                    if (hasOwnProp(inputObject, prop)) {
                        normalizedProp = normalizeUnits(prop);
                        if (normalizedProp) {
                            normalizedInput[normalizedProp] = inputObject[prop];
                        }
                    }
                }

                return normalizedInput;
            }

            var priorities = {};

            function addUnitPriority(unit, priority) {
                priorities[unit] = priority;
            }

            function getPrioritizedUnits(unitsObj) {
                var units = [],
                    u;
                for (u in unitsObj) {
                    if (hasOwnProp(unitsObj, u)) {
                        units.push({ unit: u, priority: priorities[u] });
                    }
                }
                units.sort(function (a, b) {
                    return a.priority - b.priority;
                });
                return units;
            }

            function isLeapYear(year) {
                return year % 4 === 0 && year % 100 !== 0 || year % 400 === 0;
            }

            function absFloor(number) {
                if (number < 0) {
                    // -0 -> 0
                    return Math.ceil(number) || 0;
                } else {
                    return Math.floor(number);
                }
            }

            function toInt(argumentForCoercion) {
                var coercedNumber = +argumentForCoercion,
                    value = 0;

                if (coercedNumber !== 0 && isFinite(coercedNumber)) {
                    value = absFloor(coercedNumber);
                }

                return value;
            }

            function makeGetSet(unit, keepTime) {
                return function (value) {
                    if (value != null) {
                        set$1(this, unit, value);
                        hooks.updateOffset(this, keepTime);
                        return this;
                    } else {
                        return get(this, unit);
                    }
                };
            }

            function get(mom, unit) {
                return mom.isValid() ? mom._d['get' + (mom._isUTC ? 'UTC' : '') + unit]() : NaN;
            }

            function set$1(mom, unit, value) {
                if (mom.isValid() && !isNaN(value)) {
                    if (unit === 'FullYear' && isLeapYear(mom.year()) && mom.month() === 1 && mom.date() === 29) {
                        value = toInt(value);
                        mom._d['set' + (mom._isUTC ? 'UTC' : '') + unit](value, mom.month(), daysInMonth(value, mom.month()));
                    } else {
                        mom._d['set' + (mom._isUTC ? 'UTC' : '') + unit](value);
                    }
                }
            }

            // MOMENTS

            function stringGet(units) {
                units = normalizeUnits(units);
                if (isFunction(this[units])) {
                    return this[units]();
                }
                return this;
            }

            function stringSet(units, value) {
                if ((typeof units === "undefined" ? "undefined" : babelHelpers.typeof(units)) === 'object') {
                    units = normalizeObjectUnits(units);
                    var prioritized = getPrioritizedUnits(units),
                        i;
                    for (i = 0; i < prioritized.length; i++) {
                        this[prioritized[i].unit](units[prioritized[i].unit]);
                    }
                } else {
                    units = normalizeUnits(units);
                    if (isFunction(this[units])) {
                        return this[units](value);
                    }
                }
                return this;
            }

            var match1 = /\d/,
                //       0 - 9
            match2 = /\d\d/,
                //      00 - 99
            match3 = /\d{3}/,
                //     000 - 999
            match4 = /\d{4}/,
                //    0000 - 9999
            match6 = /[+-]?\d{6}/,
                // -999999 - 999999
            match1to2 = /\d\d?/,
                //       0 - 99
            match3to4 = /\d\d\d\d?/,
                //     999 - 9999
            match5to6 = /\d\d\d\d\d\d?/,
                //   99999 - 999999
            match1to3 = /\d{1,3}/,
                //       0 - 999
            match1to4 = /\d{1,4}/,
                //       0 - 9999
            match1to6 = /[+-]?\d{1,6}/,
                // -999999 - 999999
            matchUnsigned = /\d+/,
                //       0 - inf
            matchSigned = /[+-]?\d+/,
                //    -inf - inf
            matchOffset = /Z|[+-]\d\d:?\d\d/gi,
                // +00:00 -00:00 +0000 -0000 or Z
            matchShortOffset = /Z|[+-]\d\d(?::?\d\d)?/gi,
                // +00 -00 +00:00 -00:00 +0000 -0000 or Z
            matchTimestamp = /[+-]?\d+(\.\d{1,3})?/,
                // 123456789 123456789.123
            // any word (or two) characters or numbers including two/three word month in arabic.
            // includes scottish gaelic two word and hyphenated months
            matchWord = /[0-9]{0,256}['a-z\u00A0-\u05FF\u0700-\uD7FF\uF900-\uFDCF\uFDF0-\uFF07\uFF10-\uFFEF]{1,256}|[\u0600-\u06FF\/]{1,256}(\s*?[\u0600-\u06FF]{1,256}){1,2}/i,
                regexes;

            regexes = {};

            function addRegexToken(token, regex, strictRegex) {
                regexes[token] = isFunction(regex) ? regex : function (isStrict, localeData) {
                    return isStrict && strictRegex ? strictRegex : regex;
                };
            }

            function getParseRegexForToken(token, config) {
                if (!hasOwnProp(regexes, token)) {
                    return new RegExp(unescapeFormat(token));
                }

                return regexes[token](config._strict, config._locale);
            }

            // Code from http://stackoverflow.com/questions/3561493/is-there-a-regexp-escape-function-in-javascript
            function unescapeFormat(s) {
                return regexEscape(s.replace('\\', '').replace(/\\(\[)|\\(\])|\[([^\]\[]*)\]|\\(.)/g, function (matched, p1, p2, p3, p4) {
                    return p1 || p2 || p3 || p4;
                }));
            }

            function regexEscape(s) {
                return s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
            }

            var tokens = {};

            function addParseToken(token, callback) {
                var i,
                    func = callback;
                if (typeof token === 'string') {
                    token = [token];
                }
                if (isNumber(callback)) {
                    func = function func(input, array) {
                        array[callback] = toInt(input);
                    };
                }
                for (i = 0; i < token.length; i++) {
                    tokens[token[i]] = func;
                }
            }

            function addWeekParseToken(token, callback) {
                addParseToken(token, function (input, array, config, token) {
                    config._w = config._w || {};
                    callback(input, config._w, config, token);
                });
            }

            function addTimeToArrayFromToken(token, input, config) {
                if (input != null && hasOwnProp(tokens, token)) {
                    tokens[token](input, config._a, config, token);
                }
            }

            var YEAR = 0,
                MONTH = 1,
                DATE = 2,
                HOUR = 3,
                MINUTE = 4,
                SECOND = 5,
                MILLISECOND = 6,
                WEEK = 7,
                WEEKDAY = 8;

            function mod(n, x) {
                return (n % x + x) % x;
            }

            var indexOf;

            if (Array.prototype.indexOf) {
                indexOf = Array.prototype.indexOf;
            } else {
                indexOf = function indexOf(o) {
                    // I know
                    var i;
                    for (i = 0; i < this.length; ++i) {
                        if (this[i] === o) {
                            return i;
                        }
                    }
                    return -1;
                };
            }

            function daysInMonth(year, month) {
                if (isNaN(year) || isNaN(month)) {
                    return NaN;
                }
                var modMonth = mod(month, 12);
                year += (month - modMonth) / 12;
                return modMonth === 1 ? isLeapYear(year) ? 29 : 28 : 31 - modMonth % 7 % 2;
            }

            // FORMATTING

            addFormatToken('M', ['MM', 2], 'Mo', function () {
                return this.month() + 1;
            });

            addFormatToken('MMM', 0, 0, function (format) {
                return this.localeData().monthsShort(this, format);
            });

            addFormatToken('MMMM', 0, 0, function (format) {
                return this.localeData().months(this, format);
            });

            // ALIASES

            addUnitAlias('month', 'M');

            // PRIORITY

            addUnitPriority('month', 8);

            // PARSING

            addRegexToken('M', match1to2);
            addRegexToken('MM', match1to2, match2);
            addRegexToken('MMM', function (isStrict, locale) {
                return locale.monthsShortRegex(isStrict);
            });
            addRegexToken('MMMM', function (isStrict, locale) {
                return locale.monthsRegex(isStrict);
            });

            addParseToken(['M', 'MM'], function (input, array) {
                array[MONTH] = toInt(input) - 1;
            });

            addParseToken(['MMM', 'MMMM'], function (input, array, config, token) {
                var month = config._locale.monthsParse(input, token, config._strict);
                // if we didn't find a month name, mark the date as invalid.
                if (month != null) {
                    array[MONTH] = month;
                } else {
                    getParsingFlags(config).invalidMonth = input;
                }
            });

            // LOCALES

            var defaultLocaleMonths = 'January_February_March_April_May_June_July_August_September_October_November_December'.split('_'),
                defaultLocaleMonthsShort = 'Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec'.split('_'),
                MONTHS_IN_FORMAT = /D[oD]?(\[[^\[\]]*\]|\s)+MMMM?/,
                defaultMonthsShortRegex = matchWord,
                defaultMonthsRegex = matchWord;

            function localeMonths(m, format) {
                if (!m) {
                    return isArray(this._months) ? this._months : this._months['standalone'];
                }
                return isArray(this._months) ? this._months[m.month()] : this._months[(this._months.isFormat || MONTHS_IN_FORMAT).test(format) ? 'format' : 'standalone'][m.month()];
            }

            function localeMonthsShort(m, format) {
                if (!m) {
                    return isArray(this._monthsShort) ? this._monthsShort : this._monthsShort['standalone'];
                }
                return isArray(this._monthsShort) ? this._monthsShort[m.month()] : this._monthsShort[MONTHS_IN_FORMAT.test(format) ? 'format' : 'standalone'][m.month()];
            }

            function handleStrictParse(monthName, format, strict) {
                var i,
                    ii,
                    mom,
                    llc = monthName.toLocaleLowerCase();
                if (!this._monthsParse) {
                    // this is not used
                    this._monthsParse = [];
                    this._longMonthsParse = [];
                    this._shortMonthsParse = [];
                    for (i = 0; i < 12; ++i) {
                        mom = createUTC([2000, i]);
                        this._shortMonthsParse[i] = this.monthsShort(mom, '').toLocaleLowerCase();
                        this._longMonthsParse[i] = this.months(mom, '').toLocaleLowerCase();
                    }
                }

                if (strict) {
                    if (format === 'MMM') {
                        ii = indexOf.call(this._shortMonthsParse, llc);
                        return ii !== -1 ? ii : null;
                    } else {
                        ii = indexOf.call(this._longMonthsParse, llc);
                        return ii !== -1 ? ii : null;
                    }
                } else {
                    if (format === 'MMM') {
                        ii = indexOf.call(this._shortMonthsParse, llc);
                        if (ii !== -1) {
                            return ii;
                        }
                        ii = indexOf.call(this._longMonthsParse, llc);
                        return ii !== -1 ? ii : null;
                    } else {
                        ii = indexOf.call(this._longMonthsParse, llc);
                        if (ii !== -1) {
                            return ii;
                        }
                        ii = indexOf.call(this._shortMonthsParse, llc);
                        return ii !== -1 ? ii : null;
                    }
                }
            }

            function localeMonthsParse(monthName, format, strict) {
                var i, mom, regex;

                if (this._monthsParseExact) {
                    return handleStrictParse.call(this, monthName, format, strict);
                }

                if (!this._monthsParse) {
                    this._monthsParse = [];
                    this._longMonthsParse = [];
                    this._shortMonthsParse = [];
                }

                // TODO: add sorting
                // Sorting makes sure if one month (or abbr) is a prefix of another
                // see sorting in computeMonthsParse
                for (i = 0; i < 12; i++) {
                    // make the regex if we don't have it already
                    mom = createUTC([2000, i]);
                    if (strict && !this._longMonthsParse[i]) {
                        this._longMonthsParse[i] = new RegExp('^' + this.months(mom, '').replace('.', '') + '$', 'i');
                        this._shortMonthsParse[i] = new RegExp('^' + this.monthsShort(mom, '').replace('.', '') + '$', 'i');
                    }
                    if (!strict && !this._monthsParse[i]) {
                        regex = '^' + this.months(mom, '') + '|^' + this.monthsShort(mom, '');
                        this._monthsParse[i] = new RegExp(regex.replace('.', ''), 'i');
                    }
                    // test the regex
                    if (strict && format === 'MMMM' && this._longMonthsParse[i].test(monthName)) {
                        return i;
                    } else if (strict && format === 'MMM' && this._shortMonthsParse[i].test(monthName)) {
                        return i;
                    } else if (!strict && this._monthsParse[i].test(monthName)) {
                        return i;
                    }
                }
            }

            // MOMENTS

            function setMonth(mom, value) {
                var dayOfMonth;

                if (!mom.isValid()) {
                    // No op
                    return mom;
                }

                if (typeof value === 'string') {
                    if (/^\d+$/.test(value)) {
                        value = toInt(value);
                    } else {
                        value = mom.localeData().monthsParse(value);
                        // TODO: Another silent failure?
                        if (!isNumber(value)) {
                            return mom;
                        }
                    }
                }

                dayOfMonth = Math.min(mom.date(), daysInMonth(mom.year(), value));
                mom._d['set' + (mom._isUTC ? 'UTC' : '') + 'Month'](value, dayOfMonth);
                return mom;
            }

            function getSetMonth(value) {
                if (value != null) {
                    setMonth(this, value);
                    hooks.updateOffset(this, true);
                    return this;
                } else {
                    return get(this, 'Month');
                }
            }

            function getDaysInMonth() {
                return daysInMonth(this.year(), this.month());
            }

            function monthsShortRegex(isStrict) {
                if (this._monthsParseExact) {
                    if (!hasOwnProp(this, '_monthsRegex')) {
                        computeMonthsParse.call(this);
                    }
                    if (isStrict) {
                        return this._monthsShortStrictRegex;
                    } else {
                        return this._monthsShortRegex;
                    }
                } else {
                    if (!hasOwnProp(this, '_monthsShortRegex')) {
                        this._monthsShortRegex = defaultMonthsShortRegex;
                    }
                    return this._monthsShortStrictRegex && isStrict ? this._monthsShortStrictRegex : this._monthsShortRegex;
                }
            }

            function monthsRegex(isStrict) {
                if (this._monthsParseExact) {
                    if (!hasOwnProp(this, '_monthsRegex')) {
                        computeMonthsParse.call(this);
                    }
                    if (isStrict) {
                        return this._monthsStrictRegex;
                    } else {
                        return this._monthsRegex;
                    }
                } else {
                    if (!hasOwnProp(this, '_monthsRegex')) {
                        this._monthsRegex = defaultMonthsRegex;
                    }
                    return this._monthsStrictRegex && isStrict ? this._monthsStrictRegex : this._monthsRegex;
                }
            }

            function computeMonthsParse() {
                function cmpLenRev(a, b) {
                    return b.length - a.length;
                }

                var shortPieces = [],
                    longPieces = [],
                    mixedPieces = [],
                    i,
                    mom;
                for (i = 0; i < 12; i++) {
                    // make the regex if we don't have it already
                    mom = createUTC([2000, i]);
                    shortPieces.push(this.monthsShort(mom, ''));
                    longPieces.push(this.months(mom, ''));
                    mixedPieces.push(this.months(mom, ''));
                    mixedPieces.push(this.monthsShort(mom, ''));
                }
                // Sorting makes sure if one month (or abbr) is a prefix of another it
                // will match the longer piece.
                shortPieces.sort(cmpLenRev);
                longPieces.sort(cmpLenRev);
                mixedPieces.sort(cmpLenRev);
                for (i = 0; i < 12; i++) {
                    shortPieces[i] = regexEscape(shortPieces[i]);
                    longPieces[i] = regexEscape(longPieces[i]);
                }
                for (i = 0; i < 24; i++) {
                    mixedPieces[i] = regexEscape(mixedPieces[i]);
                }

                this._monthsRegex = new RegExp('^(' + mixedPieces.join('|') + ')', 'i');
                this._monthsShortRegex = this._monthsRegex;
                this._monthsStrictRegex = new RegExp('^(' + longPieces.join('|') + ')', 'i');
                this._monthsShortStrictRegex = new RegExp('^(' + shortPieces.join('|') + ')', 'i');
            }

            // FORMATTING

            addFormatToken('Y', 0, 0, function () {
                var y = this.year();
                return y <= 9999 ? zeroFill(y, 4) : '+' + y;
            });

            addFormatToken(0, ['YY', 2], 0, function () {
                return this.year() % 100;
            });

            addFormatToken(0, ['YYYY', 4], 0, 'year');
            addFormatToken(0, ['YYYYY', 5], 0, 'year');
            addFormatToken(0, ['YYYYYY', 6, true], 0, 'year');

            // ALIASES

            addUnitAlias('year', 'y');

            // PRIORITIES

            addUnitPriority('year', 1);

            // PARSING

            addRegexToken('Y', matchSigned);
            addRegexToken('YY', match1to2, match2);
            addRegexToken('YYYY', match1to4, match4);
            addRegexToken('YYYYY', match1to6, match6);
            addRegexToken('YYYYYY', match1to6, match6);

            addParseToken(['YYYYY', 'YYYYYY'], YEAR);
            addParseToken('YYYY', function (input, array) {
                array[YEAR] = input.length === 2 ? hooks.parseTwoDigitYear(input) : toInt(input);
            });
            addParseToken('YY', function (input, array) {
                array[YEAR] = hooks.parseTwoDigitYear(input);
            });
            addParseToken('Y', function (input, array) {
                array[YEAR] = parseInt(input, 10);
            });

            // HELPERS

            function daysInYear(year) {
                return isLeapYear(year) ? 366 : 365;
            }

            // HOOKS

            hooks.parseTwoDigitYear = function (input) {
                return toInt(input) + (toInt(input) > 68 ? 1900 : 2000);
            };

            // MOMENTS

            var getSetYear = makeGetSet('FullYear', true);

            function getIsLeapYear() {
                return isLeapYear(this.year());
            }

            function createDate(y, m, d, h, M, s, ms) {
                // can't just apply() to create a date:
                // https://stackoverflow.com/q/181348
                var date;
                // the date constructor remaps years 0-99 to 1900-1999
                if (y < 100 && y >= 0) {
                    // preserve leap years using a full 400 year cycle, then reset
                    date = new Date(y + 400, m, d, h, M, s, ms);
                    if (isFinite(date.getFullYear())) {
                        date.setFullYear(y);
                    }
                } else {
                    date = new Date(y, m, d, h, M, s, ms);
                }

                return date;
            }

            function createUTCDate(y) {
                var date, args;
                // the Date.UTC function remaps years 0-99 to 1900-1999
                if (y < 100 && y >= 0) {
                    args = Array.prototype.slice.call(arguments);
                    // preserve leap years using a full 400 year cycle, then reset
                    args[0] = y + 400;
                    date = new Date(Date.UTC.apply(null, args));
                    if (isFinite(date.getUTCFullYear())) {
                        date.setUTCFullYear(y);
                    }
                } else {
                    date = new Date(Date.UTC.apply(null, arguments));
                }

                return date;
            }

            // start-of-first-week - start-of-year
            function firstWeekOffset(year, dow, doy) {
                var // first-week day -- which january is always in the first week (4 for iso, 1 for other)
                fwd = 7 + dow - doy,

                // first-week day local weekday -- which local weekday is fwd
                fwdlw = (7 + createUTCDate(year, 0, fwd).getUTCDay() - dow) % 7;

                return -fwdlw + fwd - 1;
            }

            // https://en.wikipedia.org/wiki/ISO_week_date#Calculating_a_date_given_the_year.2C_week_number_and_weekday
            function dayOfYearFromWeeks(year, week, weekday, dow, doy) {
                var localWeekday = (7 + weekday - dow) % 7,
                    weekOffset = firstWeekOffset(year, dow, doy),
                    dayOfYear = 1 + 7 * (week - 1) + localWeekday + weekOffset,
                    resYear,
                    resDayOfYear;

                if (dayOfYear <= 0) {
                    resYear = year - 1;
                    resDayOfYear = daysInYear(resYear) + dayOfYear;
                } else if (dayOfYear > daysInYear(year)) {
                    resYear = year + 1;
                    resDayOfYear = dayOfYear - daysInYear(year);
                } else {
                    resYear = year;
                    resDayOfYear = dayOfYear;
                }

                return {
                    year: resYear,
                    dayOfYear: resDayOfYear
                };
            }

            function weekOfYear(mom, dow, doy) {
                var weekOffset = firstWeekOffset(mom.year(), dow, doy),
                    week = Math.floor((mom.dayOfYear() - weekOffset - 1) / 7) + 1,
                    resWeek,
                    resYear;

                if (week < 1) {
                    resYear = mom.year() - 1;
                    resWeek = week + weeksInYear(resYear, dow, doy);
                } else if (week > weeksInYear(mom.year(), dow, doy)) {
                    resWeek = week - weeksInYear(mom.year(), dow, doy);
                    resYear = mom.year() + 1;
                } else {
                    resYear = mom.year();
                    resWeek = week;
                }

                return {
                    week: resWeek,
                    year: resYear
                };
            }

            function weeksInYear(year, dow, doy) {
                var weekOffset = firstWeekOffset(year, dow, doy),
                    weekOffsetNext = firstWeekOffset(year + 1, dow, doy);
                return (daysInYear(year) - weekOffset + weekOffsetNext) / 7;
            }

            // FORMATTING

            addFormatToken('w', ['ww', 2], 'wo', 'week');
            addFormatToken('W', ['WW', 2], 'Wo', 'isoWeek');

            // ALIASES

            addUnitAlias('week', 'w');
            addUnitAlias('isoWeek', 'W');

            // PRIORITIES

            addUnitPriority('week', 5);
            addUnitPriority('isoWeek', 5);

            // PARSING

            addRegexToken('w', match1to2);
            addRegexToken('ww', match1to2, match2);
            addRegexToken('W', match1to2);
            addRegexToken('WW', match1to2, match2);

            addWeekParseToken(['w', 'ww', 'W', 'WW'], function (input, week, config, token) {
                week[token.substr(0, 1)] = toInt(input);
            });

            // HELPERS

            // LOCALES

            function localeWeek(mom) {
                return weekOfYear(mom, this._week.dow, this._week.doy).week;
            }

            var defaultLocaleWeek = {
                dow: 0, // Sunday is the first day of the week.
                doy: 6 // The week that contains Jan 6th is the first week of the year.
            };

            function localeFirstDayOfWeek() {
                return this._week.dow;
            }

            function localeFirstDayOfYear() {
                return this._week.doy;
            }

            // MOMENTS

            function getSetWeek(input) {
                var week = this.localeData().week(this);
                return input == null ? week : this.add((input - week) * 7, 'd');
            }

            function getSetISOWeek(input) {
                var week = weekOfYear(this, 1, 4).week;
                return input == null ? week : this.add((input - week) * 7, 'd');
            }

            // FORMATTING

            addFormatToken('d', 0, 'do', 'day');

            addFormatToken('dd', 0, 0, function (format) {
                return this.localeData().weekdaysMin(this, format);
            });

            addFormatToken('ddd', 0, 0, function (format) {
                return this.localeData().weekdaysShort(this, format);
            });

            addFormatToken('dddd', 0, 0, function (format) {
                return this.localeData().weekdays(this, format);
            });

            addFormatToken('e', 0, 0, 'weekday');
            addFormatToken('E', 0, 0, 'isoWeekday');

            // ALIASES

            addUnitAlias('day', 'd');
            addUnitAlias('weekday', 'e');
            addUnitAlias('isoWeekday', 'E');

            // PRIORITY
            addUnitPriority('day', 11);
            addUnitPriority('weekday', 11);
            addUnitPriority('isoWeekday', 11);

            // PARSING

            addRegexToken('d', match1to2);
            addRegexToken('e', match1to2);
            addRegexToken('E', match1to2);
            addRegexToken('dd', function (isStrict, locale) {
                return locale.weekdaysMinRegex(isStrict);
            });
            addRegexToken('ddd', function (isStrict, locale) {
                return locale.weekdaysShortRegex(isStrict);
            });
            addRegexToken('dddd', function (isStrict, locale) {
                return locale.weekdaysRegex(isStrict);
            });

            addWeekParseToken(['dd', 'ddd', 'dddd'], function (input, week, config, token) {
                var weekday = config._locale.weekdaysParse(input, token, config._strict);
                // if we didn't get a weekday name, mark the date as invalid
                if (weekday != null) {
                    week.d = weekday;
                } else {
                    getParsingFlags(config).invalidWeekday = input;
                }
            });

            addWeekParseToken(['d', 'e', 'E'], function (input, week, config, token) {
                week[token] = toInt(input);
            });

            // HELPERS

            function parseWeekday(input, locale) {
                if (typeof input !== 'string') {
                    return input;
                }

                if (!isNaN(input)) {
                    return parseInt(input, 10);
                }

                input = locale.weekdaysParse(input);
                if (typeof input === 'number') {
                    return input;
                }

                return null;
            }

            function parseIsoWeekday(input, locale) {
                if (typeof input === 'string') {
                    return locale.weekdaysParse(input) % 7 || 7;
                }
                return isNaN(input) ? null : input;
            }

            // LOCALES
            function shiftWeekdays(ws, n) {
                return ws.slice(n, 7).concat(ws.slice(0, n));
            }

            var defaultLocaleWeekdays = 'Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday'.split('_'),
                defaultLocaleWeekdaysShort = 'Sun_Mon_Tue_Wed_Thu_Fri_Sat'.split('_'),
                defaultLocaleWeekdaysMin = 'Su_Mo_Tu_We_Th_Fr_Sa'.split('_'),
                defaultWeekdaysRegex = matchWord,
                defaultWeekdaysShortRegex = matchWord,
                defaultWeekdaysMinRegex = matchWord;

            function localeWeekdays(m, format) {
                var weekdays = isArray(this._weekdays) ? this._weekdays : this._weekdays[m && m !== true && this._weekdays.isFormat.test(format) ? 'format' : 'standalone'];
                return m === true ? shiftWeekdays(weekdays, this._week.dow) : m ? weekdays[m.day()] : weekdays;
            }

            function localeWeekdaysShort(m) {
                return m === true ? shiftWeekdays(this._weekdaysShort, this._week.dow) : m ? this._weekdaysShort[m.day()] : this._weekdaysShort;
            }

            function localeWeekdaysMin(m) {
                return m === true ? shiftWeekdays(this._weekdaysMin, this._week.dow) : m ? this._weekdaysMin[m.day()] : this._weekdaysMin;
            }

            function handleStrictParse$1(weekdayName, format, strict) {
                var i,
                    ii,
                    mom,
                    llc = weekdayName.toLocaleLowerCase();
                if (!this._weekdaysParse) {
                    this._weekdaysParse = [];
                    this._shortWeekdaysParse = [];
                    this._minWeekdaysParse = [];

                    for (i = 0; i < 7; ++i) {
                        mom = createUTC([2000, 1]).day(i);
                        this._minWeekdaysParse[i] = this.weekdaysMin(mom, '').toLocaleLowerCase();
                        this._shortWeekdaysParse[i] = this.weekdaysShort(mom, '').toLocaleLowerCase();
                        this._weekdaysParse[i] = this.weekdays(mom, '').toLocaleLowerCase();
                    }
                }

                if (strict) {
                    if (format === 'dddd') {
                        ii = indexOf.call(this._weekdaysParse, llc);
                        return ii !== -1 ? ii : null;
                    } else if (format === 'ddd') {
                        ii = indexOf.call(this._shortWeekdaysParse, llc);
                        return ii !== -1 ? ii : null;
                    } else {
                        ii = indexOf.call(this._minWeekdaysParse, llc);
                        return ii !== -1 ? ii : null;
                    }
                } else {
                    if (format === 'dddd') {
                        ii = indexOf.call(this._weekdaysParse, llc);
                        if (ii !== -1) {
                            return ii;
                        }
                        ii = indexOf.call(this._shortWeekdaysParse, llc);
                        if (ii !== -1) {
                            return ii;
                        }
                        ii = indexOf.call(this._minWeekdaysParse, llc);
                        return ii !== -1 ? ii : null;
                    } else if (format === 'ddd') {
                        ii = indexOf.call(this._shortWeekdaysParse, llc);
                        if (ii !== -1) {
                            return ii;
                        }
                        ii = indexOf.call(this._weekdaysParse, llc);
                        if (ii !== -1) {
                            return ii;
                        }
                        ii = indexOf.call(this._minWeekdaysParse, llc);
                        return ii !== -1 ? ii : null;
                    } else {
                        ii = indexOf.call(this._minWeekdaysParse, llc);
                        if (ii !== -1) {
                            return ii;
                        }
                        ii = indexOf.call(this._weekdaysParse, llc);
                        if (ii !== -1) {
                            return ii;
                        }
                        ii = indexOf.call(this._shortWeekdaysParse, llc);
                        return ii !== -1 ? ii : null;
                    }
                }
            }

            function localeWeekdaysParse(weekdayName, format, strict) {
                var i, mom, regex;

                if (this._weekdaysParseExact) {
                    return handleStrictParse$1.call(this, weekdayName, format, strict);
                }

                if (!this._weekdaysParse) {
                    this._weekdaysParse = [];
                    this._minWeekdaysParse = [];
                    this._shortWeekdaysParse = [];
                    this._fullWeekdaysParse = [];
                }

                for (i = 0; i < 7; i++) {
                    // make the regex if we don't have it already

                    mom = createUTC([2000, 1]).day(i);
                    if (strict && !this._fullWeekdaysParse[i]) {
                        this._fullWeekdaysParse[i] = new RegExp('^' + this.weekdays(mom, '').replace('.', '\\.?') + '$', 'i');
                        this._shortWeekdaysParse[i] = new RegExp('^' + this.weekdaysShort(mom, '').replace('.', '\\.?') + '$', 'i');
                        this._minWeekdaysParse[i] = new RegExp('^' + this.weekdaysMin(mom, '').replace('.', '\\.?') + '$', 'i');
                    }
                    if (!this._weekdaysParse[i]) {
                        regex = '^' + this.weekdays(mom, '') + '|^' + this.weekdaysShort(mom, '') + '|^' + this.weekdaysMin(mom, '');
                        this._weekdaysParse[i] = new RegExp(regex.replace('.', ''), 'i');
                    }
                    // test the regex
                    if (strict && format === 'dddd' && this._fullWeekdaysParse[i].test(weekdayName)) {
                        return i;
                    } else if (strict && format === 'ddd' && this._shortWeekdaysParse[i].test(weekdayName)) {
                        return i;
                    } else if (strict && format === 'dd' && this._minWeekdaysParse[i].test(weekdayName)) {
                        return i;
                    } else if (!strict && this._weekdaysParse[i].test(weekdayName)) {
                        return i;
                    }
                }
            }

            // MOMENTS

            function getSetDayOfWeek(input) {
                if (!this.isValid()) {
                    return input != null ? this : NaN;
                }
                var day = this._isUTC ? this._d.getUTCDay() : this._d.getDay();
                if (input != null) {
                    input = parseWeekday(input, this.localeData());
                    return this.add(input - day, 'd');
                } else {
                    return day;
                }
            }

            function getSetLocaleDayOfWeek(input) {
                if (!this.isValid()) {
                    return input != null ? this : NaN;
                }
                var weekday = (this.day() + 7 - this.localeData()._week.dow) % 7;
                return input == null ? weekday : this.add(input - weekday, 'd');
            }

            function getSetISODayOfWeek(input) {
                if (!this.isValid()) {
                    return input != null ? this : NaN;
                }

                // behaves the same as moment#day except
                // as a getter, returns 7 instead of 0 (1-7 range instead of 0-6)
                // as a setter, sunday should belong to the previous week.

                if (input != null) {
                    var weekday = parseIsoWeekday(input, this.localeData());
                    return this.day(this.day() % 7 ? weekday : weekday - 7);
                } else {
                    return this.day() || 7;
                }
            }

            function weekdaysRegex(isStrict) {
                if (this._weekdaysParseExact) {
                    if (!hasOwnProp(this, '_weekdaysRegex')) {
                        computeWeekdaysParse.call(this);
                    }
                    if (isStrict) {
                        return this._weekdaysStrictRegex;
                    } else {
                        return this._weekdaysRegex;
                    }
                } else {
                    if (!hasOwnProp(this, '_weekdaysRegex')) {
                        this._weekdaysRegex = defaultWeekdaysRegex;
                    }
                    return this._weekdaysStrictRegex && isStrict ? this._weekdaysStrictRegex : this._weekdaysRegex;
                }
            }

            function weekdaysShortRegex(isStrict) {
                if (this._weekdaysParseExact) {
                    if (!hasOwnProp(this, '_weekdaysRegex')) {
                        computeWeekdaysParse.call(this);
                    }
                    if (isStrict) {
                        return this._weekdaysShortStrictRegex;
                    } else {
                        return this._weekdaysShortRegex;
                    }
                } else {
                    if (!hasOwnProp(this, '_weekdaysShortRegex')) {
                        this._weekdaysShortRegex = defaultWeekdaysShortRegex;
                    }
                    return this._weekdaysShortStrictRegex && isStrict ? this._weekdaysShortStrictRegex : this._weekdaysShortRegex;
                }
            }

            function weekdaysMinRegex(isStrict) {
                if (this._weekdaysParseExact) {
                    if (!hasOwnProp(this, '_weekdaysRegex')) {
                        computeWeekdaysParse.call(this);
                    }
                    if (isStrict) {
                        return this._weekdaysMinStrictRegex;
                    } else {
                        return this._weekdaysMinRegex;
                    }
                } else {
                    if (!hasOwnProp(this, '_weekdaysMinRegex')) {
                        this._weekdaysMinRegex = defaultWeekdaysMinRegex;
                    }
                    return this._weekdaysMinStrictRegex && isStrict ? this._weekdaysMinStrictRegex : this._weekdaysMinRegex;
                }
            }

            function computeWeekdaysParse() {
                function cmpLenRev(a, b) {
                    return b.length - a.length;
                }

                var minPieces = [],
                    shortPieces = [],
                    longPieces = [],
                    mixedPieces = [],
                    i,
                    mom,
                    minp,
                    shortp,
                    longp;
                for (i = 0; i < 7; i++) {
                    // make the regex if we don't have it already
                    mom = createUTC([2000, 1]).day(i);
                    minp = regexEscape(this.weekdaysMin(mom, ''));
                    shortp = regexEscape(this.weekdaysShort(mom, ''));
                    longp = regexEscape(this.weekdays(mom, ''));
                    minPieces.push(minp);
                    shortPieces.push(shortp);
                    longPieces.push(longp);
                    mixedPieces.push(minp);
                    mixedPieces.push(shortp);
                    mixedPieces.push(longp);
                }
                // Sorting makes sure if one weekday (or abbr) is a prefix of another it
                // will match the longer piece.
                minPieces.sort(cmpLenRev);
                shortPieces.sort(cmpLenRev);
                longPieces.sort(cmpLenRev);
                mixedPieces.sort(cmpLenRev);

                this._weekdaysRegex = new RegExp('^(' + mixedPieces.join('|') + ')', 'i');
                this._weekdaysShortRegex = this._weekdaysRegex;
                this._weekdaysMinRegex = this._weekdaysRegex;

                this._weekdaysStrictRegex = new RegExp('^(' + longPieces.join('|') + ')', 'i');
                this._weekdaysShortStrictRegex = new RegExp('^(' + shortPieces.join('|') + ')', 'i');
                this._weekdaysMinStrictRegex = new RegExp('^(' + minPieces.join('|') + ')', 'i');
            }

            // FORMATTING

            function hFormat() {
                return this.hours() % 12 || 12;
            }

            function kFormat() {
                return this.hours() || 24;
            }

            addFormatToken('H', ['HH', 2], 0, 'hour');
            addFormatToken('h', ['hh', 2], 0, hFormat);
            addFormatToken('k', ['kk', 2], 0, kFormat);

            addFormatToken('hmm', 0, 0, function () {
                return '' + hFormat.apply(this) + zeroFill(this.minutes(), 2);
            });

            addFormatToken('hmmss', 0, 0, function () {
                return '' + hFormat.apply(this) + zeroFill(this.minutes(), 2) + zeroFill(this.seconds(), 2);
            });

            addFormatToken('Hmm', 0, 0, function () {
                return '' + this.hours() + zeroFill(this.minutes(), 2);
            });

            addFormatToken('Hmmss', 0, 0, function () {
                return '' + this.hours() + zeroFill(this.minutes(), 2) + zeroFill(this.seconds(), 2);
            });

            function meridiem(token, lowercase) {
                addFormatToken(token, 0, 0, function () {
                    return this.localeData().meridiem(this.hours(), this.minutes(), lowercase);
                });
            }

            meridiem('a', true);
            meridiem('A', false);

            // ALIASES

            addUnitAlias('hour', 'h');

            // PRIORITY
            addUnitPriority('hour', 13);

            // PARSING

            function matchMeridiem(isStrict, locale) {
                return locale._meridiemParse;
            }

            addRegexToken('a', matchMeridiem);
            addRegexToken('A', matchMeridiem);
            addRegexToken('H', match1to2);
            addRegexToken('h', match1to2);
            addRegexToken('k', match1to2);
            addRegexToken('HH', match1to2, match2);
            addRegexToken('hh', match1to2, match2);
            addRegexToken('kk', match1to2, match2);

            addRegexToken('hmm', match3to4);
            addRegexToken('hmmss', match5to6);
            addRegexToken('Hmm', match3to4);
            addRegexToken('Hmmss', match5to6);

            addParseToken(['H', 'HH'], HOUR);
            addParseToken(['k', 'kk'], function (input, array, config) {
                var kInput = toInt(input);
                array[HOUR] = kInput === 24 ? 0 : kInput;
            });
            addParseToken(['a', 'A'], function (input, array, config) {
                config._isPm = config._locale.isPM(input);
                config._meridiem = input;
            });
            addParseToken(['h', 'hh'], function (input, array, config) {
                array[HOUR] = toInt(input);
                getParsingFlags(config).bigHour = true;
            });
            addParseToken('hmm', function (input, array, config) {
                var pos = input.length - 2;
                array[HOUR] = toInt(input.substr(0, pos));
                array[MINUTE] = toInt(input.substr(pos));
                getParsingFlags(config).bigHour = true;
            });
            addParseToken('hmmss', function (input, array, config) {
                var pos1 = input.length - 4,
                    pos2 = input.length - 2;
                array[HOUR] = toInt(input.substr(0, pos1));
                array[MINUTE] = toInt(input.substr(pos1, 2));
                array[SECOND] = toInt(input.substr(pos2));
                getParsingFlags(config).bigHour = true;
            });
            addParseToken('Hmm', function (input, array, config) {
                var pos = input.length - 2;
                array[HOUR] = toInt(input.substr(0, pos));
                array[MINUTE] = toInt(input.substr(pos));
            });
            addParseToken('Hmmss', function (input, array, config) {
                var pos1 = input.length - 4,
                    pos2 = input.length - 2;
                array[HOUR] = toInt(input.substr(0, pos1));
                array[MINUTE] = toInt(input.substr(pos1, 2));
                array[SECOND] = toInt(input.substr(pos2));
            });

            // LOCALES

            function localeIsPM(input) {
                // IE8 Quirks Mode & IE7 Standards Mode do not allow accessing strings like arrays
                // Using charAt should be more compatible.
                return (input + '').toLowerCase().charAt(0) === 'p';
            }

            var defaultLocaleMeridiemParse = /[ap]\.?m?\.?/i,

            // Setting the hour should keep the time, because the user explicitly
            // specified which hour they want. So trying to maintain the same hour (in
            // a new timezone) makes sense. Adding/subtracting hours does not follow
            // this rule.
            getSetHour = makeGetSet('Hours', true);

            function localeMeridiem(hours, minutes, isLower) {
                if (hours > 11) {
                    return isLower ? 'pm' : 'PM';
                } else {
                    return isLower ? 'am' : 'AM';
                }
            }

            var baseConfig = {
                calendar: defaultCalendar,
                longDateFormat: defaultLongDateFormat,
                invalidDate: defaultInvalidDate,
                ordinal: defaultOrdinal,
                dayOfMonthOrdinalParse: defaultDayOfMonthOrdinalParse,
                relativeTime: defaultRelativeTime,

                months: defaultLocaleMonths,
                monthsShort: defaultLocaleMonthsShort,

                week: defaultLocaleWeek,

                weekdays: defaultLocaleWeekdays,
                weekdaysMin: defaultLocaleWeekdaysMin,
                weekdaysShort: defaultLocaleWeekdaysShort,

                meridiemParse: defaultLocaleMeridiemParse
            };

            // internal storage for locale config files
            var locales = {},
                localeFamilies = {},
                globalLocale;

            function commonPrefix(arr1, arr2) {
                var i,
                    minl = Math.min(arr1.length, arr2.length);
                for (i = 0; i < minl; i += 1) {
                    if (arr1[i] !== arr2[i]) {
                        return i;
                    }
                }
                return minl;
            }

            function normalizeLocale(key) {
                return key ? key.toLowerCase().replace('_', '-') : key;
            }

            // pick the locale from the array
            // try ['en-au', 'en-gb'] as 'en-au', 'en-gb', 'en', as in move through the list trying each
            // substring from most specific to least, but move to the next array item if it's a more specific variant than the current root
            function chooseLocale(names) {
                var i = 0,
                    j,
                    next,
                    locale,
                    split;

                while (i < names.length) {
                    split = normalizeLocale(names[i]).split('-');
                    j = split.length;
                    next = normalizeLocale(names[i + 1]);
                    next = next ? next.split('-') : null;
                    while (j > 0) {
                        locale = loadLocale(split.slice(0, j).join('-'));
                        if (locale) {
                            return locale;
                        }
                        if (next && next.length >= j && commonPrefix(split, next) >= j - 1) {
                            //the next array item is better than a shallower substring of this one
                            break;
                        }
                        j--;
                    }
                    i++;
                }
                return globalLocale;
            }

            function loadLocale(name) {
                var oldLocale = null,
                    aliasedRequire;
                // TODO: Find a better way to register and load all the locales in Node
                if (locales[name] === undefined && typeof module !== 'undefined' && module && module.exports) {
                    try {
                        oldLocale = globalLocale._abbr;
                        aliasedRequire = require;
                        aliasedRequire('./locale/' + name);
                        getSetGlobalLocale(oldLocale);
                    } catch (e) {
                        // mark as not found to avoid repeating expensive file require call causing high CPU
                        // when trying to find en-US, en_US, en-us for every format call
                        locales[name] = null; // null means not found
                    }
                }
                return locales[name];
            }

            // This function will load locale and then set the global locale.  If
            // no arguments are passed in, it will simply return the current global
            // locale key.
            function getSetGlobalLocale(key, values) {
                var data;
                if (key) {
                    if (isUndefined(values)) {
                        data = getLocale(key);
                    } else {
                        data = defineLocale(key, values);
                    }

                    if (data) {
                        // moment.duration._locale = moment._locale = data;
                        globalLocale = data;
                    } else {
                        if (typeof console !== 'undefined' && console.warn) {
                            //warn user if arguments are passed but the locale could not be set
                            console.warn('Locale ' + key + ' not found. Did you forget to load it?');
                        }
                    }
                }

                return globalLocale._abbr;
            }

            function defineLocale(name, config) {
                if (config !== null) {
                    var locale,
                        parentConfig = baseConfig;
                    config.abbr = name;
                    if (locales[name] != null) {
                        deprecateSimple('defineLocaleOverride', 'use moment.updateLocale(localeName, config) to change ' + 'an existing locale. moment.defineLocale(localeName, ' + 'config) should only be used for creating a new locale ' + 'See http://momentjs.com/guides/#/warnings/define-locale/ for more info.');
                        parentConfig = locales[name]._config;
                    } else if (config.parentLocale != null) {
                        if (locales[config.parentLocale] != null) {
                            parentConfig = locales[config.parentLocale]._config;
                        } else {
                            locale = loadLocale(config.parentLocale);
                            if (locale != null) {
                                parentConfig = locale._config;
                            } else {
                                if (!localeFamilies[config.parentLocale]) {
                                    localeFamilies[config.parentLocale] = [];
                                }
                                localeFamilies[config.parentLocale].push({
                                    name: name,
                                    config: config
                                });
                                return null;
                            }
                        }
                    }
                    locales[name] = new Locale(mergeConfigs(parentConfig, config));

                    if (localeFamilies[name]) {
                        localeFamilies[name].forEach(function (x) {
                            defineLocale(x.name, x.config);
                        });
                    }

                    // backwards compat for now: also set the locale
                    // make sure we set the locale AFTER all child locales have been
                    // created, so we won't end up with the child locale set.
                    getSetGlobalLocale(name);

                    return locales[name];
                } else {
                    // useful for testing
                    delete locales[name];
                    return null;
                }
            }

            function updateLocale(name, config) {
                if (config != null) {
                    var locale,
                        tmpLocale,
                        parentConfig = baseConfig;

                    if (locales[name] != null && locales[name].parentLocale != null) {
                        // Update existing child locale in-place to avoid memory-leaks
                        locales[name].set(mergeConfigs(locales[name]._config, config));
                    } else {
                        // MERGE
                        tmpLocale = loadLocale(name);
                        if (tmpLocale != null) {
                            parentConfig = tmpLocale._config;
                        }
                        config = mergeConfigs(parentConfig, config);
                        if (tmpLocale == null) {
                            // updateLocale is called for creating a new locale
                            // Set abbr so it will have a name (getters return
                            // undefined otherwise).
                            config.abbr = name;
                        }
                        locale = new Locale(config);
                        locale.parentLocale = locales[name];
                        locales[name] = locale;
                    }

                    // backwards compat for now: also set the locale
                    getSetGlobalLocale(name);
                } else {
                    // pass null for config to unupdate, useful for tests
                    if (locales[name] != null) {
                        if (locales[name].parentLocale != null) {
                            locales[name] = locales[name].parentLocale;
                            if (name === getSetGlobalLocale()) {
                                getSetGlobalLocale(name);
                            }
                        } else if (locales[name] != null) {
                            delete locales[name];
                        }
                    }
                }
                return locales[name];
            }

            // returns locale data
            function getLocale(key) {
                var locale;

                if (key && key._locale && key._locale._abbr) {
                    key = key._locale._abbr;
                }

                if (!key) {
                    return globalLocale;
                }

                if (!isArray(key)) {
                    //short-circuit everything else
                    locale = loadLocale(key);
                    if (locale) {
                        return locale;
                    }
                    key = [key];
                }

                return chooseLocale(key);
            }

            function listLocales() {
                return keys(locales);
            }

            function checkOverflow(m) {
                var overflow,
                    a = m._a;

                if (a && getParsingFlags(m).overflow === -2) {
                    overflow = a[MONTH] < 0 || a[MONTH] > 11 ? MONTH : a[DATE] < 1 || a[DATE] > daysInMonth(a[YEAR], a[MONTH]) ? DATE : a[HOUR] < 0 || a[HOUR] > 24 || a[HOUR] === 24 && (a[MINUTE] !== 0 || a[SECOND] !== 0 || a[MILLISECOND] !== 0) ? HOUR : a[MINUTE] < 0 || a[MINUTE] > 59 ? MINUTE : a[SECOND] < 0 || a[SECOND] > 59 ? SECOND : a[MILLISECOND] < 0 || a[MILLISECOND] > 999 ? MILLISECOND : -1;

                    if (getParsingFlags(m)._overflowDayOfYear && (overflow < YEAR || overflow > DATE)) {
                        overflow = DATE;
                    }
                    if (getParsingFlags(m)._overflowWeeks && overflow === -1) {
                        overflow = WEEK;
                    }
                    if (getParsingFlags(m)._overflowWeekday && overflow === -1) {
                        overflow = WEEKDAY;
                    }

                    getParsingFlags(m).overflow = overflow;
                }

                return m;
            }

            // iso 8601 regex
            // 0000-00-00 0000-W00 or 0000-W00-0 + T + 00 or 00:00 or 00:00:00 or 00:00:00.000 + +00:00 or +0000 or +00)
            var extendedIsoRegex = /^\s*((?:[+-]\d{6}|\d{4})-(?:\d\d-\d\d|W\d\d-\d|W\d\d|\d\d\d|\d\d))(?:(T| )(\d\d(?::\d\d(?::\d\d(?:[.,]\d+)?)?)?)([+-]\d\d(?::?\d\d)?|\s*Z)?)?$/,
                basicIsoRegex = /^\s*((?:[+-]\d{6}|\d{4})(?:\d\d\d\d|W\d\d\d|W\d\d|\d\d\d|\d\d|))(?:(T| )(\d\d(?:\d\d(?:\d\d(?:[.,]\d+)?)?)?)([+-]\d\d(?::?\d\d)?|\s*Z)?)?$/,
                tzRegex = /Z|[+-]\d\d(?::?\d\d)?/,
                isoDates = [['YYYYYY-MM-DD', /[+-]\d{6}-\d\d-\d\d/], ['YYYY-MM-DD', /\d{4}-\d\d-\d\d/], ['GGGG-[W]WW-E', /\d{4}-W\d\d-\d/], ['GGGG-[W]WW', /\d{4}-W\d\d/, false], ['YYYY-DDD', /\d{4}-\d{3}/], ['YYYY-MM', /\d{4}-\d\d/, false], ['YYYYYYMMDD', /[+-]\d{10}/], ['YYYYMMDD', /\d{8}/], ['GGGG[W]WWE', /\d{4}W\d{3}/], ['GGGG[W]WW', /\d{4}W\d{2}/, false], ['YYYYDDD', /\d{7}/], ['YYYYMM', /\d{6}/, false], ['YYYY', /\d{4}/, false]],

            // iso time formats and regexes
            isoTimes = [['HH:mm:ss.SSSS', /\d\d:\d\d:\d\d\.\d+/], ['HH:mm:ss,SSSS', /\d\d:\d\d:\d\d,\d+/], ['HH:mm:ss', /\d\d:\d\d:\d\d/], ['HH:mm', /\d\d:\d\d/], ['HHmmss.SSSS', /\d\d\d\d\d\d\.\d+/], ['HHmmss,SSSS', /\d\d\d\d\d\d,\d+/], ['HHmmss', /\d\d\d\d\d\d/], ['HHmm', /\d\d\d\d/], ['HH', /\d\d/]],
                aspNetJsonRegex = /^\/?Date\((-?\d+)/i,

            // RFC 2822 regex: For details see https://tools.ietf.org/html/rfc2822#section-3.3
            rfc2822 = /^(?:(Mon|Tue|Wed|Thu|Fri|Sat|Sun),?\s)?(\d{1,2})\s(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s(\d{2,4})\s(\d\d):(\d\d)(?::(\d\d))?\s(?:(UT|GMT|[ECMP][SD]T)|([Zz])|([+-]\d{4}))$/,
                obsOffsets = {
                UT: 0,
                GMT: 0,
                EDT: -4 * 60,
                EST: -5 * 60,
                CDT: -5 * 60,
                CST: -6 * 60,
                MDT: -6 * 60,
                MST: -7 * 60,
                PDT: -7 * 60,
                PST: -8 * 60
            };

            // date from iso format
            function configFromISO(config) {
                var i,
                    l,
                    string = config._i,
                    match = extendedIsoRegex.exec(string) || basicIsoRegex.exec(string),
                    allowTime,
                    dateFormat,
                    timeFormat,
                    tzFormat;

                if (match) {
                    getParsingFlags(config).iso = true;

                    for (i = 0, l = isoDates.length; i < l; i++) {
                        if (isoDates[i][1].exec(match[1])) {
                            dateFormat = isoDates[i][0];
                            allowTime = isoDates[i][2] !== false;
                            break;
                        }
                    }
                    if (dateFormat == null) {
                        config._isValid = false;
                        return;
                    }
                    if (match[3]) {
                        for (i = 0, l = isoTimes.length; i < l; i++) {
                            if (isoTimes[i][1].exec(match[3])) {
                                // match[2] should be 'T' or space
                                timeFormat = (match[2] || ' ') + isoTimes[i][0];
                                break;
                            }
                        }
                        if (timeFormat == null) {
                            config._isValid = false;
                            return;
                        }
                    }
                    if (!allowTime && timeFormat != null) {
                        config._isValid = false;
                        return;
                    }
                    if (match[4]) {
                        if (tzRegex.exec(match[4])) {
                            tzFormat = 'Z';
                        } else {
                            config._isValid = false;
                            return;
                        }
                    }
                    config._f = dateFormat + (timeFormat || '') + (tzFormat || '');
                    configFromStringAndFormat(config);
                } else {
                    config._isValid = false;
                }
            }

            function extractFromRFC2822Strings(yearStr, monthStr, dayStr, hourStr, minuteStr, secondStr) {
                var result = [untruncateYear(yearStr), defaultLocaleMonthsShort.indexOf(monthStr), parseInt(dayStr, 10), parseInt(hourStr, 10), parseInt(minuteStr, 10)];

                if (secondStr) {
                    result.push(parseInt(secondStr, 10));
                }

                return result;
            }

            function untruncateYear(yearStr) {
                var year = parseInt(yearStr, 10);
                if (year <= 49) {
                    return 2000 + year;
                } else if (year <= 999) {
                    return 1900 + year;
                }
                return year;
            }

            function preprocessRFC2822(s) {
                // Remove comments and folding whitespace and replace multiple-spaces with a single space
                return s.replace(/\([^)]*\)|[\n\t]/g, ' ').replace(/(\s\s+)/g, ' ').replace(/^\s\s*/, '').replace(/\s\s*$/, '');
            }

            function checkWeekday(weekdayStr, parsedInput, config) {
                if (weekdayStr) {
                    // TODO: Replace the vanilla JS Date object with an independent day-of-week check.
                    var weekdayProvided = defaultLocaleWeekdaysShort.indexOf(weekdayStr),
                        weekdayActual = new Date(parsedInput[0], parsedInput[1], parsedInput[2]).getDay();
                    if (weekdayProvided !== weekdayActual) {
                        getParsingFlags(config).weekdayMismatch = true;
                        config._isValid = false;
                        return false;
                    }
                }
                return true;
            }

            function calculateOffset(obsOffset, militaryOffset, numOffset) {
                if (obsOffset) {
                    return obsOffsets[obsOffset];
                } else if (militaryOffset) {
                    // the only allowed military tz is Z
                    return 0;
                } else {
                    var hm = parseInt(numOffset, 10),
                        m = hm % 100,
                        h = (hm - m) / 100;
                    return h * 60 + m;
                }
            }

            // date and time from ref 2822 format
            function configFromRFC2822(config) {
                var match = rfc2822.exec(preprocessRFC2822(config._i)),
                    parsedArray;
                if (match) {
                    parsedArray = extractFromRFC2822Strings(match[4], match[3], match[2], match[5], match[6], match[7]);
                    if (!checkWeekday(match[1], parsedArray, config)) {
                        return;
                    }

                    config._a = parsedArray;
                    config._tzm = calculateOffset(match[8], match[9], match[10]);

                    config._d = createUTCDate.apply(null, config._a);
                    config._d.setUTCMinutes(config._d.getUTCMinutes() - config._tzm);

                    getParsingFlags(config).rfc2822 = true;
                } else {
                    config._isValid = false;
                }
            }

            // date from 1) ASP.NET, 2) ISO, 3) RFC 2822 formats, or 4) optional fallback if parsing isn't strict
            function configFromString(config) {
                var matched = aspNetJsonRegex.exec(config._i);
                if (matched !== null) {
                    config._d = new Date(+matched[1]);
                    return;
                }

                configFromISO(config);
                if (config._isValid === false) {
                    delete config._isValid;
                } else {
                    return;
                }

                configFromRFC2822(config);
                if (config._isValid === false) {
                    delete config._isValid;
                } else {
                    return;
                }

                if (config._strict) {
                    config._isValid = false;
                } else {
                    // Final attempt, use Input Fallback
                    hooks.createFromInputFallback(config);
                }
            }

            hooks.createFromInputFallback = deprecate('value provided is not in a recognized RFC2822 or ISO format. moment construction falls back to js Date(), ' + 'which is not reliable across all browsers and versions. Non RFC2822/ISO date formats are ' + 'discouraged. Please refer to http://momentjs.com/guides/#/warnings/js-date/ for more info.', function (config) {
                config._d = new Date(config._i + (config._useUTC ? ' UTC' : ''));
            });

            // Pick the first defined of two or three arguments.
            function defaults(a, b, c) {
                if (a != null) {
                    return a;
                }
                if (b != null) {
                    return b;
                }
                return c;
            }

            function currentDateArray(config) {
                // hooks is actually the exported moment object
                var nowValue = new Date(hooks.now());
                if (config._useUTC) {
                    return [nowValue.getUTCFullYear(), nowValue.getUTCMonth(), nowValue.getUTCDate()];
                }
                return [nowValue.getFullYear(), nowValue.getMonth(), nowValue.getDate()];
            }

            // convert an array to a date.
            // the array should mirror the parameters below
            // note: all values past the year are optional and will default to the lowest possible value.
            // [year, month, day , hour, minute, second, millisecond]
            function configFromArray(config) {
                var i,
                    date,
                    input = [],
                    currentDate,
                    expectedWeekday,
                    yearToUse;

                if (config._d) {
                    return;
                }

                currentDate = currentDateArray(config);

                //compute day of the year from weeks and weekdays
                if (config._w && config._a[DATE] == null && config._a[MONTH] == null) {
                    dayOfYearFromWeekInfo(config);
                }

                //if the day of the year is set, figure out what it is
                if (config._dayOfYear != null) {
                    yearToUse = defaults(config._a[YEAR], currentDate[YEAR]);

                    if (config._dayOfYear > daysInYear(yearToUse) || config._dayOfYear === 0) {
                        getParsingFlags(config)._overflowDayOfYear = true;
                    }

                    date = createUTCDate(yearToUse, 0, config._dayOfYear);
                    config._a[MONTH] = date.getUTCMonth();
                    config._a[DATE] = date.getUTCDate();
                }

                // Default to current date.
                // * if no year, month, day of month are given, default to today
                // * if day of month is given, default month and year
                // * if month is given, default only year
                // * if year is given, don't default anything
                for (i = 0; i < 3 && config._a[i] == null; ++i) {
                    config._a[i] = input[i] = currentDate[i];
                }

                // Zero out whatever was not defaulted, including time
                for (; i < 7; i++) {
                    config._a[i] = input[i] = config._a[i] == null ? i === 2 ? 1 : 0 : config._a[i];
                }

                // Check for 24:00:00.000
                if (config._a[HOUR] === 24 && config._a[MINUTE] === 0 && config._a[SECOND] === 0 && config._a[MILLISECOND] === 0) {
                    config._nextDay = true;
                    config._a[HOUR] = 0;
                }

                config._d = (config._useUTC ? createUTCDate : createDate).apply(null, input);
                expectedWeekday = config._useUTC ? config._d.getUTCDay() : config._d.getDay();

                // Apply timezone offset from input. The actual utcOffset can be changed
                // with parseZone.
                if (config._tzm != null) {
                    config._d.setUTCMinutes(config._d.getUTCMinutes() - config._tzm);
                }

                if (config._nextDay) {
                    config._a[HOUR] = 24;
                }

                // check for mismatching day of week
                if (config._w && typeof config._w.d !== 'undefined' && config._w.d !== expectedWeekday) {
                    getParsingFlags(config).weekdayMismatch = true;
                }
            }

            function dayOfYearFromWeekInfo(config) {
                var w, weekYear, week, weekday, dow, doy, temp, weekdayOverflow, curWeek;

                w = config._w;
                if (w.GG != null || w.W != null || w.E != null) {
                    dow = 1;
                    doy = 4;

                    // TODO: We need to take the current isoWeekYear, but that depends on
                    // how we interpret now (local, utc, fixed offset). So create
                    // a now version of current config (take local/utc/offset flags, and
                    // create now).
                    weekYear = defaults(w.GG, config._a[YEAR], weekOfYear(createLocal(), 1, 4).year);
                    week = defaults(w.W, 1);
                    weekday = defaults(w.E, 1);
                    if (weekday < 1 || weekday > 7) {
                        weekdayOverflow = true;
                    }
                } else {
                    dow = config._locale._week.dow;
                    doy = config._locale._week.doy;

                    curWeek = weekOfYear(createLocal(), dow, doy);

                    weekYear = defaults(w.gg, config._a[YEAR], curWeek.year);

                    // Default to current week.
                    week = defaults(w.w, curWeek.week);

                    if (w.d != null) {
                        // weekday -- low day numbers are considered next week
                        weekday = w.d;
                        if (weekday < 0 || weekday > 6) {
                            weekdayOverflow = true;
                        }
                    } else if (w.e != null) {
                        // local weekday -- counting starts from beginning of week
                        weekday = w.e + dow;
                        if (w.e < 0 || w.e > 6) {
                            weekdayOverflow = true;
                        }
                    } else {
                        // default to beginning of week
                        weekday = dow;
                    }
                }
                if (week < 1 || week > weeksInYear(weekYear, dow, doy)) {
                    getParsingFlags(config)._overflowWeeks = true;
                } else if (weekdayOverflow != null) {
                    getParsingFlags(config)._overflowWeekday = true;
                } else {
                    temp = dayOfYearFromWeeks(weekYear, week, weekday, dow, doy);
                    config._a[YEAR] = temp.year;
                    config._dayOfYear = temp.dayOfYear;
                }
            }

            // constant that refers to the ISO standard
            hooks.ISO_8601 = function () {};

            // constant that refers to the RFC 2822 form
            hooks.RFC_2822 = function () {};

            // date from string and format string
            function configFromStringAndFormat(config) {
                // TODO: Move this to another part of the creation flow to prevent circular deps
                if (config._f === hooks.ISO_8601) {
                    configFromISO(config);
                    return;
                }
                if (config._f === hooks.RFC_2822) {
                    configFromRFC2822(config);
                    return;
                }
                config._a = [];
                getParsingFlags(config).empty = true;

                // This array is used to make a Date, either with `new Date` or `Date.UTC`
                var string = '' + config._i,
                    i,
                    parsedInput,
                    tokens,
                    token,
                    skipped,
                    stringLength = string.length,
                    totalParsedInputLength = 0,
                    era;

                tokens = expandFormat(config._f, config._locale).match(formattingTokens) || [];

                for (i = 0; i < tokens.length; i++) {
                    token = tokens[i];
                    parsedInput = (string.match(getParseRegexForToken(token, config)) || [])[0];
                    if (parsedInput) {
                        skipped = string.substr(0, string.indexOf(parsedInput));
                        if (skipped.length > 0) {
                            getParsingFlags(config).unusedInput.push(skipped);
                        }
                        string = string.slice(string.indexOf(parsedInput) + parsedInput.length);
                        totalParsedInputLength += parsedInput.length;
                    }
                    // don't parse if it's not a known token
                    if (formatTokenFunctions[token]) {
                        if (parsedInput) {
                            getParsingFlags(config).empty = false;
                        } else {
                            getParsingFlags(config).unusedTokens.push(token);
                        }
                        addTimeToArrayFromToken(token, parsedInput, config);
                    } else if (config._strict && !parsedInput) {
                        getParsingFlags(config).unusedTokens.push(token);
                    }
                }

                // add remaining unparsed input length to the string
                getParsingFlags(config).charsLeftOver = stringLength - totalParsedInputLength;
                if (string.length > 0) {
                    getParsingFlags(config).unusedInput.push(string);
                }

                // clear _12h flag if hour is <= 12
                if (config._a[HOUR] <= 12 && getParsingFlags(config).bigHour === true && config._a[HOUR] > 0) {
                    getParsingFlags(config).bigHour = undefined;
                }

                getParsingFlags(config).parsedDateParts = config._a.slice(0);
                getParsingFlags(config).meridiem = config._meridiem;
                // handle meridiem
                config._a[HOUR] = meridiemFixWrap(config._locale, config._a[HOUR], config._meridiem);

                // handle era
                era = getParsingFlags(config).era;
                if (era !== null) {
                    config._a[YEAR] = config._locale.erasConvertYear(era, config._a[YEAR]);
                }

                configFromArray(config);
                checkOverflow(config);
            }

            function meridiemFixWrap(locale, hour, meridiem) {
                var isPm;

                if (meridiem == null) {
                    // nothing to do
                    return hour;
                }
                if (locale.meridiemHour != null) {
                    return locale.meridiemHour(hour, meridiem);
                } else if (locale.isPM != null) {
                    // Fallback
                    isPm = locale.isPM(meridiem);
                    if (isPm && hour < 12) {
                        hour += 12;
                    }
                    if (!isPm && hour === 12) {
                        hour = 0;
                    }
                    return hour;
                } else {
                    // this is not supposed to happen
                    return hour;
                }
            }

            // date from string and array of format strings
            function configFromStringAndArray(config) {
                var tempConfig,
                    bestMoment,
                    scoreToBeat,
                    i,
                    currentScore,
                    validFormatFound,
                    bestFormatIsValid = false;

                if (config._f.length === 0) {
                    getParsingFlags(config).invalidFormat = true;
                    config._d = new Date(NaN);
                    return;
                }

                for (i = 0; i < config._f.length; i++) {
                    currentScore = 0;
                    validFormatFound = false;
                    tempConfig = copyConfig({}, config);
                    if (config._useUTC != null) {
                        tempConfig._useUTC = config._useUTC;
                    }
                    tempConfig._f = config._f[i];
                    configFromStringAndFormat(tempConfig);

                    if (isValid(tempConfig)) {
                        validFormatFound = true;
                    }

                    // if there is any input that was not parsed add a penalty for that format
                    currentScore += getParsingFlags(tempConfig).charsLeftOver;

                    //or tokens
                    currentScore += getParsingFlags(tempConfig).unusedTokens.length * 10;

                    getParsingFlags(tempConfig).score = currentScore;

                    if (!bestFormatIsValid) {
                        if (scoreToBeat == null || currentScore < scoreToBeat || validFormatFound) {
                            scoreToBeat = currentScore;
                            bestMoment = tempConfig;
                            if (validFormatFound) {
                                bestFormatIsValid = true;
                            }
                        }
                    } else {
                        if (currentScore < scoreToBeat) {
                            scoreToBeat = currentScore;
                            bestMoment = tempConfig;
                        }
                    }
                }

                extend(config, bestMoment || tempConfig);
            }

            function configFromObject(config) {
                if (config._d) {
                    return;
                }

                var i = normalizeObjectUnits(config._i),
                    dayOrDate = i.day === undefined ? i.date : i.day;
                config._a = map([i.year, i.month, dayOrDate, i.hour, i.minute, i.second, i.millisecond], function (obj) {
                    return obj && parseInt(obj, 10);
                });

                configFromArray(config);
            }

            function createFromConfig(config) {
                var res = new Moment(checkOverflow(prepareConfig(config)));
                if (res._nextDay) {
                    // Adding is smart enough around DST
                    res.add(1, 'd');
                    res._nextDay = undefined;
                }

                return res;
            }

            function prepareConfig(config) {
                var input = config._i,
                    format = config._f;

                config._locale = config._locale || getLocale(config._l);

                if (input === null || format === undefined && input === '') {
                    return createInvalid({ nullInput: true });
                }

                if (typeof input === 'string') {
                    config._i = input = config._locale.preparse(input);
                }

                if (isMoment(input)) {
                    return new Moment(checkOverflow(input));
                } else if (isDate(input)) {
                    config._d = input;
                } else if (isArray(format)) {
                    configFromStringAndArray(config);
                } else if (format) {
                    configFromStringAndFormat(config);
                } else {
                    configFromInput(config);
                }

                if (!isValid(config)) {
                    config._d = null;
                }

                return config;
            }

            function configFromInput(config) {
                var input = config._i;
                if (isUndefined(input)) {
                    config._d = new Date(hooks.now());
                } else if (isDate(input)) {
                    config._d = new Date(input.valueOf());
                } else if (typeof input === 'string') {
                    configFromString(config);
                } else if (isArray(input)) {
                    config._a = map(input.slice(0), function (obj) {
                        return parseInt(obj, 10);
                    });
                    configFromArray(config);
                } else if (isObject(input)) {
                    configFromObject(config);
                } else if (isNumber(input)) {
                    // from milliseconds
                    config._d = new Date(input);
                } else {
                    hooks.createFromInputFallback(config);
                }
            }

            function createLocalOrUTC(input, format, locale, strict, isUTC) {
                var c = {};

                if (format === true || format === false) {
                    strict = format;
                    format = undefined;
                }

                if (locale === true || locale === false) {
                    strict = locale;
                    locale = undefined;
                }

                if (isObject(input) && isObjectEmpty(input) || isArray(input) && input.length === 0) {
                    input = undefined;
                }
                // object construction must be done this way.
                // https://github.com/moment/moment/issues/1423
                c._isAMomentObject = true;
                c._useUTC = c._isUTC = isUTC;
                c._l = locale;
                c._i = input;
                c._f = format;
                c._strict = strict;

                return createFromConfig(c);
            }

            function createLocal(input, format, locale, strict) {
                return createLocalOrUTC(input, format, locale, strict, false);
            }

            var prototypeMin = deprecate('moment().min is deprecated, use moment.max instead. http://momentjs.com/guides/#/warnings/min-max/', function () {
                var other = createLocal.apply(null, arguments);
                if (this.isValid() && other.isValid()) {
                    return other < this ? this : other;
                } else {
                    return createInvalid();
                }
            }),
                prototypeMax = deprecate('moment().max is deprecated, use moment.min instead. http://momentjs.com/guides/#/warnings/min-max/', function () {
                var other = createLocal.apply(null, arguments);
                if (this.isValid() && other.isValid()) {
                    return other > this ? this : other;
                } else {
                    return createInvalid();
                }
            });

            // Pick a moment m from moments so that m[fn](other) is true for all
            // other. This relies on the function fn to be transitive.
            //
            // moments should either be an array of moment objects or an array, whose
            // first element is an array of moment objects.
            function pickBy(fn, moments) {
                var res, i;
                if (moments.length === 1 && isArray(moments[0])) {
                    moments = moments[0];
                }
                if (!moments.length) {
                    return createLocal();
                }
                res = moments[0];
                for (i = 1; i < moments.length; ++i) {
                    if (!moments[i].isValid() || moments[i][fn](res)) {
                        res = moments[i];
                    }
                }
                return res;
            }

            // TODO: Use [].sort instead?
            function min() {
                var args = [].slice.call(arguments, 0);

                return pickBy('isBefore', args);
            }

            function max() {
                var args = [].slice.call(arguments, 0);

                return pickBy('isAfter', args);
            }

            var now = function now() {
                return Date.now ? Date.now() : +new Date();
            };

            var ordering = ['year', 'quarter', 'month', 'week', 'day', 'hour', 'minute', 'second', 'millisecond'];

            function isDurationValid(m) {
                var key,
                    unitHasDecimal = false,
                    i;
                for (key in m) {
                    if (hasOwnProp(m, key) && !(indexOf.call(ordering, key) !== -1 && (m[key] == null || !isNaN(m[key])))) {
                        return false;
                    }
                }

                for (i = 0; i < ordering.length; ++i) {
                    if (m[ordering[i]]) {
                        if (unitHasDecimal) {
                            return false; // only allow non-integers for smallest unit
                        }
                        if (parseFloat(m[ordering[i]]) !== toInt(m[ordering[i]])) {
                            unitHasDecimal = true;
                        }
                    }
                }

                return true;
            }

            function isValid$1() {
                return this._isValid;
            }

            function createInvalid$1() {
                return createDuration(NaN);
            }

            function Duration(duration) {
                var normalizedInput = normalizeObjectUnits(duration),
                    years = normalizedInput.year || 0,
                    quarters = normalizedInput.quarter || 0,
                    months = normalizedInput.month || 0,
                    weeks = normalizedInput.week || normalizedInput.isoWeek || 0,
                    days = normalizedInput.day || 0,
                    hours = normalizedInput.hour || 0,
                    minutes = normalizedInput.minute || 0,
                    seconds = normalizedInput.second || 0,
                    milliseconds = normalizedInput.millisecond || 0;

                this._isValid = isDurationValid(normalizedInput);

                // representation for dateAddRemove
                this._milliseconds = +milliseconds + seconds * 1e3 + // 1000
                minutes * 6e4 + // 1000 * 60
                hours * 1000 * 60 * 60; //using 1000 * 60 * 60 instead of 36e5 to avoid floating point rounding errors https://github.com/moment/moment/issues/2978
                // Because of dateAddRemove treats 24 hours as different from a
                // day when working around DST, we need to store them separately
                this._days = +days + weeks * 7;
                // It is impossible to translate months into days without knowing
                // which months you are are talking about, so we have to store
                // it separately.
                this._months = +months + quarters * 3 + years * 12;

                this._data = {};

                this._locale = getLocale();

                this._bubble();
            }

            function isDuration(obj) {
                return obj instanceof Duration;
            }

            function absRound(number) {
                if (number < 0) {
                    return Math.round(-1 * number) * -1;
                } else {
                    return Math.round(number);
                }
            }

            // compare two arrays, return the number of differences
            function compareArrays(array1, array2, dontConvert) {
                var len = Math.min(array1.length, array2.length),
                    lengthDiff = Math.abs(array1.length - array2.length),
                    diffs = 0,
                    i;
                for (i = 0; i < len; i++) {
                    if (dontConvert && array1[i] !== array2[i] || !dontConvert && toInt(array1[i]) !== toInt(array2[i])) {
                        diffs++;
                    }
                }
                return diffs + lengthDiff;
            }

            // FORMATTING

            function offset(token, separator) {
                addFormatToken(token, 0, 0, function () {
                    var offset = this.utcOffset(),
                        sign = '+';
                    if (offset < 0) {
                        offset = -offset;
                        sign = '-';
                    }
                    return sign + zeroFill(~~(offset / 60), 2) + separator + zeroFill(~~offset % 60, 2);
                });
            }

            offset('Z', ':');
            offset('ZZ', '');

            // PARSING

            addRegexToken('Z', matchShortOffset);
            addRegexToken('ZZ', matchShortOffset);
            addParseToken(['Z', 'ZZ'], function (input, array, config) {
                config._useUTC = true;
                config._tzm = offsetFromString(matchShortOffset, input);
            });

            // HELPERS

            // timezone chunker
            // '+10:00' > ['10',  '00']
            // '-1530'  > ['-15', '30']
            var chunkOffset = /([\+\-]|\d\d)/gi;

            function offsetFromString(matcher, string) {
                var matches = (string || '').match(matcher),
                    chunk,
                    parts,
                    minutes;

                if (matches === null) {
                    return null;
                }

                chunk = matches[matches.length - 1] || [];
                parts = (chunk + '').match(chunkOffset) || ['-', 0, 0];
                minutes = +(parts[1] * 60) + toInt(parts[2]);

                return minutes === 0 ? 0 : parts[0] === '+' ? minutes : -minutes;
            }

            // Return a moment from input, that is local/utc/zone equivalent to model.
            function cloneWithOffset(input, model) {
                var res, diff;
                if (model._isUTC) {
                    res = model.clone();
                    diff = (isMoment(input) || isDate(input) ? input.valueOf() : createLocal(input).valueOf()) - res.valueOf();
                    // Use low-level api, because this fn is low-level api.
                    res._d.setTime(res._d.valueOf() + diff);
                    hooks.updateOffset(res, false);
                    return res;
                } else {
                    return createLocal(input).local();
                }
            }

            function getDateOffset(m) {
                // On Firefox.24 Date#getTimezoneOffset returns a floating point.
                // https://github.com/moment/moment/pull/1871
                return -Math.round(m._d.getTimezoneOffset());
            }

            // HOOKS

            // This function will be called whenever a moment is mutated.
            // It is intended to keep the offset in sync with the timezone.
            hooks.updateOffset = function () {};

            // MOMENTS

            // keepLocalTime = true means only change the timezone, without
            // affecting the local hour. So 5:31:26 +0300 --[utcOffset(2, true)]-->
            // 5:31:26 +0200 It is possible that 5:31:26 doesn't exist with offset
            // +0200, so we adjust the time as needed, to be valid.
            //
            // Keeping the time actually adds/subtracts (one hour)
            // from the actual represented time. That is why we call updateOffset
            // a second time. In case it wants us to change the offset again
            // _changeInProgress == true case, then we have to adjust, because
            // there is no such time in the given timezone.
            function getSetOffset(input, keepLocalTime, keepMinutes) {
                var offset = this._offset || 0,
                    localAdjust;
                if (!this.isValid()) {
                    return input != null ? this : NaN;
                }
                if (input != null) {
                    if (typeof input === 'string') {
                        input = offsetFromString(matchShortOffset, input);
                        if (input === null) {
                            return this;
                        }
                    } else if (Math.abs(input) < 16 && !keepMinutes) {
                        input = input * 60;
                    }
                    if (!this._isUTC && keepLocalTime) {
                        localAdjust = getDateOffset(this);
                    }
                    this._offset = input;
                    this._isUTC = true;
                    if (localAdjust != null) {
                        this.add(localAdjust, 'm');
                    }
                    if (offset !== input) {
                        if (!keepLocalTime || this._changeInProgress) {
                            addSubtract(this, createDuration(input - offset, 'm'), 1, false);
                        } else if (!this._changeInProgress) {
                            this._changeInProgress = true;
                            hooks.updateOffset(this, true);
                            this._changeInProgress = null;
                        }
                    }
                    return this;
                } else {
                    return this._isUTC ? offset : getDateOffset(this);
                }
            }

            function getSetZone(input, keepLocalTime) {
                if (input != null) {
                    if (typeof input !== 'string') {
                        input = -input;
                    }

                    this.utcOffset(input, keepLocalTime);

                    return this;
                } else {
                    return -this.utcOffset();
                }
            }

            function setOffsetToUTC(keepLocalTime) {
                return this.utcOffset(0, keepLocalTime);
            }

            function setOffsetToLocal(keepLocalTime) {
                if (this._isUTC) {
                    this.utcOffset(0, keepLocalTime);
                    this._isUTC = false;

                    if (keepLocalTime) {
                        this.subtract(getDateOffset(this), 'm');
                    }
                }
                return this;
            }

            function setOffsetToParsedOffset() {
                if (this._tzm != null) {
                    this.utcOffset(this._tzm, false, true);
                } else if (typeof this._i === 'string') {
                    var tZone = offsetFromString(matchOffset, this._i);
                    if (tZone != null) {
                        this.utcOffset(tZone);
                    } else {
                        this.utcOffset(0, true);
                    }
                }
                return this;
            }

            function hasAlignedHourOffset(input) {
                if (!this.isValid()) {
                    return false;
                }
                input = input ? createLocal(input).utcOffset() : 0;

                return (this.utcOffset() - input) % 60 === 0;
            }

            function isDaylightSavingTime() {
                return this.utcOffset() > this.clone().month(0).utcOffset() || this.utcOffset() > this.clone().month(5).utcOffset();
            }

            function isDaylightSavingTimeShifted() {
                if (!isUndefined(this._isDSTShifted)) {
                    return this._isDSTShifted;
                }

                var c = {},
                    other;

                copyConfig(c, this);
                c = prepareConfig(c);

                if (c._a) {
                    other = c._isUTC ? createUTC(c._a) : createLocal(c._a);
                    this._isDSTShifted = this.isValid() && compareArrays(c._a, other.toArray()) > 0;
                } else {
                    this._isDSTShifted = false;
                }

                return this._isDSTShifted;
            }

            function isLocal() {
                return this.isValid() ? !this._isUTC : false;
            }

            function isUtcOffset() {
                return this.isValid() ? this._isUTC : false;
            }

            function isUtc() {
                return this.isValid() ? this._isUTC && this._offset === 0 : false;
            }

            // ASP.NET json date format regex
            var aspNetRegex = /^(-|\+)?(?:(\d*)[. ])?(\d+):(\d+)(?::(\d+)(\.\d*)?)?$/,

            // from http://docs.closure-library.googlecode.com/git/closure_goog_date_date.js.source.html
            // somewhat more in line with 4.4.3.2 2004 spec, but allows decimal anywhere
            // and further modified to allow for strings containing both week and day
            isoRegex = /^(-|\+)?P(?:([-+]?[0-9,.]*)Y)?(?:([-+]?[0-9,.]*)M)?(?:([-+]?[0-9,.]*)W)?(?:([-+]?[0-9,.]*)D)?(?:T(?:([-+]?[0-9,.]*)H)?(?:([-+]?[0-9,.]*)M)?(?:([-+]?[0-9,.]*)S)?)?$/;

            function createDuration(input, key) {
                var duration = input,

                // matching against regexp is expensive, do it on demand
                match = null,
                    sign,
                    ret,
                    diffRes;

                if (isDuration(input)) {
                    duration = {
                        ms: input._milliseconds,
                        d: input._days,
                        M: input._months
                    };
                } else if (isNumber(input) || !isNaN(+input)) {
                    duration = {};
                    if (key) {
                        duration[key] = +input;
                    } else {
                        duration.milliseconds = +input;
                    }
                } else if (match = aspNetRegex.exec(input)) {
                    sign = match[1] === '-' ? -1 : 1;
                    duration = {
                        y: 0,
                        d: toInt(match[DATE]) * sign,
                        h: toInt(match[HOUR]) * sign,
                        m: toInt(match[MINUTE]) * sign,
                        s: toInt(match[SECOND]) * sign,
                        ms: toInt(absRound(match[MILLISECOND] * 1000)) * sign // the millisecond decimal point is included in the match
                    };
                } else if (match = isoRegex.exec(input)) {
                    sign = match[1] === '-' ? -1 : 1;
                    duration = {
                        y: parseIso(match[2], sign),
                        M: parseIso(match[3], sign),
                        w: parseIso(match[4], sign),
                        d: parseIso(match[5], sign),
                        h: parseIso(match[6], sign),
                        m: parseIso(match[7], sign),
                        s: parseIso(match[8], sign)
                    };
                } else if (duration == null) {
                    // checks for null or undefined
                    duration = {};
                } else if ((typeof duration === "undefined" ? "undefined" : babelHelpers.typeof(duration)) === 'object' && ('from' in duration || 'to' in duration)) {
                    diffRes = momentsDifference(createLocal(duration.from), createLocal(duration.to));

                    duration = {};
                    duration.ms = diffRes.milliseconds;
                    duration.M = diffRes.months;
                }

                ret = new Duration(duration);

                if (isDuration(input) && hasOwnProp(input, '_locale')) {
                    ret._locale = input._locale;
                }

                if (isDuration(input) && hasOwnProp(input, '_isValid')) {
                    ret._isValid = input._isValid;
                }

                return ret;
            }

            createDuration.fn = Duration.prototype;
            createDuration.invalid = createInvalid$1;

            function parseIso(inp, sign) {
                // We'd normally use ~~inp for this, but unfortunately it also
                // converts floats to ints.
                // inp may be undefined, so careful calling replace on it.
                var res = inp && parseFloat(inp.replace(',', '.'));
                // apply sign while we're at it
                return (isNaN(res) ? 0 : res) * sign;
            }

            function positiveMomentsDifference(base, other) {
                var res = {};

                res.months = other.month() - base.month() + (other.year() - base.year()) * 12;
                if (base.clone().add(res.months, 'M').isAfter(other)) {
                    --res.months;
                }

                res.milliseconds = +other - +base.clone().add(res.months, 'M');

                return res;
            }

            function momentsDifference(base, other) {
                var res;
                if (!(base.isValid() && other.isValid())) {
                    return { milliseconds: 0, months: 0 };
                }

                other = cloneWithOffset(other, base);
                if (base.isBefore(other)) {
                    res = positiveMomentsDifference(base, other);
                } else {
                    res = positiveMomentsDifference(other, base);
                    res.milliseconds = -res.milliseconds;
                    res.months = -res.months;
                }

                return res;
            }

            // TODO: remove 'name' arg after deprecation is removed
            function createAdder(direction, name) {
                return function (val, period) {
                    var dur, tmp;
                    //invert the arguments, but complain about it
                    if (period !== null && !isNaN(+period)) {
                        deprecateSimple(name, 'moment().' + name + '(period, number) is deprecated. Please use moment().' + name + '(number, period). ' + 'See http://momentjs.com/guides/#/warnings/add-inverted-param/ for more info.');
                        tmp = val;
                        val = period;
                        period = tmp;
                    }

                    dur = createDuration(val, period);
                    addSubtract(this, dur, direction);
                    return this;
                };
            }

            function addSubtract(mom, duration, isAdding, updateOffset) {
                var milliseconds = duration._milliseconds,
                    days = absRound(duration._days),
                    months = absRound(duration._months);

                if (!mom.isValid()) {
                    // No op
                    return;
                }

                updateOffset = updateOffset == null ? true : updateOffset;

                if (months) {
                    setMonth(mom, get(mom, 'Month') + months * isAdding);
                }
                if (days) {
                    set$1(mom, 'Date', get(mom, 'Date') + days * isAdding);
                }
                if (milliseconds) {
                    mom._d.setTime(mom._d.valueOf() + milliseconds * isAdding);
                }
                if (updateOffset) {
                    hooks.updateOffset(mom, days || months);
                }
            }

            var add = createAdder(1, 'add'),
                subtract = createAdder(-1, 'subtract');

            function isString(input) {
                return typeof input === 'string' || input instanceof String;
            }

            // type MomentInput = Moment | Date | string | number | (number | string)[] | MomentInputObject | void; // null | undefined
            function isMomentInput(input) {
                return isMoment(input) || isDate(input) || isString(input) || isNumber(input) || isNumberOrStringArray(input) || isMomentInputObject(input) || input === null || input === undefined;
            }

            function isMomentInputObject(input) {
                var objectTest = isObject(input) && !isObjectEmpty(input),
                    propertyTest = false,
                    properties = ['years', 'year', 'y', 'months', 'month', 'M', 'days', 'day', 'd', 'dates', 'date', 'D', 'hours', 'hour', 'h', 'minutes', 'minute', 'm', 'seconds', 'second', 's', 'milliseconds', 'millisecond', 'ms'],
                    i,
                    property;

                for (i = 0; i < properties.length; i += 1) {
                    property = properties[i];
                    propertyTest = propertyTest || hasOwnProp(input, property);
                }

                return objectTest && propertyTest;
            }

            function isNumberOrStringArray(input) {
                var arrayTest = isArray(input),
                    dataTypeTest = false;
                if (arrayTest) {
                    dataTypeTest = input.filter(function (item) {
                        return !isNumber(item) && isString(input);
                    }).length === 0;
                }
                return arrayTest && dataTypeTest;
            }

            function isCalendarSpec(input) {
                var objectTest = isObject(input) && !isObjectEmpty(input),
                    propertyTest = false,
                    properties = ['sameDay', 'nextDay', 'lastDay', 'nextWeek', 'lastWeek', 'sameElse'],
                    i,
                    property;

                for (i = 0; i < properties.length; i += 1) {
                    property = properties[i];
                    propertyTest = propertyTest || hasOwnProp(input, property);
                }

                return objectTest && propertyTest;
            }

            function getCalendarFormat(myMoment, now) {
                var diff = myMoment.diff(now, 'days', true);
                return diff < -6 ? 'sameElse' : diff < -1 ? 'lastWeek' : diff < 0 ? 'lastDay' : diff < 1 ? 'sameDay' : diff < 2 ? 'nextDay' : diff < 7 ? 'nextWeek' : 'sameElse';
            }

            function calendar$1(time, formats) {
                // Support for single parameter, formats only overload to the calendar function
                if (arguments.length === 1) {
                    if (!arguments[0]) {
                        time = undefined;
                        formats = undefined;
                    } else if (isMomentInput(arguments[0])) {
                        time = arguments[0];
                        formats = undefined;
                    } else if (isCalendarSpec(arguments[0])) {
                        formats = arguments[0];
                        time = undefined;
                    }
                }
                // We want to compare the start of today, vs this.
                // Getting start-of-today depends on whether we're local/utc/offset or not.
                var now = time || createLocal(),
                    sod = cloneWithOffset(now, this).startOf('day'),
                    format = hooks.calendarFormat(this, sod) || 'sameElse',
                    output = formats && (isFunction(formats[format]) ? formats[format].call(this, now) : formats[format]);

                return this.format(output || this.localeData().calendar(format, this, createLocal(now)));
            }

            function clone() {
                return new Moment(this);
            }

            function isAfter(input, units) {
                var localInput = isMoment(input) ? input : createLocal(input);
                if (!(this.isValid() && localInput.isValid())) {
                    return false;
                }
                units = normalizeUnits(units) || 'millisecond';
                if (units === 'millisecond') {
                    return this.valueOf() > localInput.valueOf();
                } else {
                    return localInput.valueOf() < this.clone().startOf(units).valueOf();
                }
            }

            function isBefore(input, units) {
                var localInput = isMoment(input) ? input : createLocal(input);
                if (!(this.isValid() && localInput.isValid())) {
                    return false;
                }
                units = normalizeUnits(units) || 'millisecond';
                if (units === 'millisecond') {
                    return this.valueOf() < localInput.valueOf();
                } else {
                    return this.clone().endOf(units).valueOf() < localInput.valueOf();
                }
            }

            function isBetween(from, to, units, inclusivity) {
                var localFrom = isMoment(from) ? from : createLocal(from),
                    localTo = isMoment(to) ? to : createLocal(to);
                if (!(this.isValid() && localFrom.isValid() && localTo.isValid())) {
                    return false;
                }
                inclusivity = inclusivity || '()';
                return (inclusivity[0] === '(' ? this.isAfter(localFrom, units) : !this.isBefore(localFrom, units)) && (inclusivity[1] === ')' ? this.isBefore(localTo, units) : !this.isAfter(localTo, units));
            }

            function isSame(input, units) {
                var localInput = isMoment(input) ? input : createLocal(input),
                    inputMs;
                if (!(this.isValid() && localInput.isValid())) {
                    return false;
                }
                units = normalizeUnits(units) || 'millisecond';
                if (units === 'millisecond') {
                    return this.valueOf() === localInput.valueOf();
                } else {
                    inputMs = localInput.valueOf();
                    return this.clone().startOf(units).valueOf() <= inputMs && inputMs <= this.clone().endOf(units).valueOf();
                }
            }

            function isSameOrAfter(input, units) {
                return this.isSame(input, units) || this.isAfter(input, units);
            }

            function isSameOrBefore(input, units) {
                return this.isSame(input, units) || this.isBefore(input, units);
            }

            function diff(input, units, asFloat) {
                var that, zoneDelta, output;

                if (!this.isValid()) {
                    return NaN;
                }

                that = cloneWithOffset(input, this);

                if (!that.isValid()) {
                    return NaN;
                }

                zoneDelta = (that.utcOffset() - this.utcOffset()) * 6e4;

                units = normalizeUnits(units);

                switch (units) {
                    case 'year':
                        output = monthDiff(this, that) / 12;
                        break;
                    case 'month':
                        output = monthDiff(this, that);
                        break;
                    case 'quarter':
                        output = monthDiff(this, that) / 3;
                        break;
                    case 'second':
                        output = (this - that) / 1e3;
                        break; // 1000
                    case 'minute':
                        output = (this - that) / 6e4;
                        break; // 1000 * 60
                    case 'hour':
                        output = (this - that) / 36e5;
                        break; // 1000 * 60 * 60
                    case 'day':
                        output = (this - that - zoneDelta) / 864e5;
                        break; // 1000 * 60 * 60 * 24, negate dst
                    case 'week':
                        output = (this - that - zoneDelta) / 6048e5;
                        break; // 1000 * 60 * 60 * 24 * 7, negate dst
                    default:
                        output = this - that;
                }

                return asFloat ? output : absFloor(output);
            }

            function monthDiff(a, b) {
                if (a.date() < b.date()) {
                    // end-of-month calculations work correct when the start month has more
                    // days than the end month.
                    return -monthDiff(b, a);
                }
                // difference in months
                var wholeMonthDiff = (b.year() - a.year()) * 12 + (b.month() - a.month()),

                // b is in (anchor - 1 month, anchor + 1 month)
                anchor = a.clone().add(wholeMonthDiff, 'months'),
                    anchor2,
                    adjust;

                if (b - anchor < 0) {
                    anchor2 = a.clone().add(wholeMonthDiff - 1, 'months');
                    // linear across the month
                    adjust = (b - anchor) / (anchor - anchor2);
                } else {
                    anchor2 = a.clone().add(wholeMonthDiff + 1, 'months');
                    // linear across the month
                    adjust = (b - anchor) / (anchor2 - anchor);
                }

                //check for negative zero, return zero if negative zero
                return -(wholeMonthDiff + adjust) || 0;
            }

            hooks.defaultFormat = 'YYYY-MM-DDTHH:mm:ssZ';
            hooks.defaultFormatUtc = 'YYYY-MM-DDTHH:mm:ss[Z]';

            function toString() {
                return this.clone().locale('en').format('ddd MMM DD YYYY HH:mm:ss [GMT]ZZ');
            }

            function toISOString(keepOffset) {
                if (!this.isValid()) {
                    return null;
                }
                var utc = keepOffset !== true,
                    m = utc ? this.clone().utc() : this;
                if (m.year() < 0 || m.year() > 9999) {
                    return formatMoment(m, utc ? 'YYYYYY-MM-DD[T]HH:mm:ss.SSS[Z]' : 'YYYYYY-MM-DD[T]HH:mm:ss.SSSZ');
                }
                if (isFunction(Date.prototype.toISOString)) {
                    // native implementation is ~50x faster, use it when we can
                    if (utc) {
                        return this.toDate().toISOString();
                    } else {
                        return new Date(this.valueOf() + this.utcOffset() * 60 * 1000).toISOString().replace('Z', formatMoment(m, 'Z'));
                    }
                }
                return formatMoment(m, utc ? 'YYYY-MM-DD[T]HH:mm:ss.SSS[Z]' : 'YYYY-MM-DD[T]HH:mm:ss.SSSZ');
            }

            /**
             * Return a human readable representation of a moment that can
             * also be evaluated to get a new moment which is the same
             *
             * @link https://nodejs.org/dist/latest/docs/api/util.html#util_custom_inspect_function_on_objects
             */
            function inspect() {
                if (!this.isValid()) {
                    return 'moment.invalid(/* ' + this._i + ' */)';
                }
                var func = 'moment',
                    zone = '',
                    prefix,
                    year,
                    datetime,
                    suffix;
                if (!this.isLocal()) {
                    func = this.utcOffset() === 0 ? 'moment.utc' : 'moment.parseZone';
                    zone = 'Z';
                }
                prefix = '[' + func + '("]';
                year = 0 <= this.year() && this.year() <= 9999 ? 'YYYY' : 'YYYYYY';
                datetime = '-MM-DD[T]HH:mm:ss.SSS';
                suffix = zone + '[")]';

                return this.format(prefix + year + datetime + suffix);
            }

            function format(inputString) {
                if (!inputString) {
                    inputString = this.isUtc() ? hooks.defaultFormatUtc : hooks.defaultFormat;
                }
                var output = formatMoment(this, inputString);
                return this.localeData().postformat(output);
            }

            function from(time, withoutSuffix) {
                if (this.isValid() && (isMoment(time) && time.isValid() || createLocal(time).isValid())) {
                    return createDuration({ to: this, from: time }).locale(this.locale()).humanize(!withoutSuffix);
                } else {
                    return this.localeData().invalidDate();
                }
            }

            function fromNow(withoutSuffix) {
                return this.from(createLocal(), withoutSuffix);
            }

            function to(time, withoutSuffix) {
                if (this.isValid() && (isMoment(time) && time.isValid() || createLocal(time).isValid())) {
                    return createDuration({ from: this, to: time }).locale(this.locale()).humanize(!withoutSuffix);
                } else {
                    return this.localeData().invalidDate();
                }
            }

            function toNow(withoutSuffix) {
                return this.to(createLocal(), withoutSuffix);
            }

            // If passed a locale key, it will set the locale for this
            // instance.  Otherwise, it will return the locale configuration
            // variables for this instance.
            function locale(key) {
                var newLocaleData;

                if (key === undefined) {
                    return this._locale._abbr;
                } else {
                    newLocaleData = getLocale(key);
                    if (newLocaleData != null) {
                        this._locale = newLocaleData;
                    }
                    return this;
                }
            }

            var lang = deprecate('moment().lang() is deprecated. Instead, use moment().localeData() to get the language configuration. Use moment().locale() to change languages.', function (key) {
                if (key === undefined) {
                    return this.localeData();
                } else {
                    return this.locale(key);
                }
            });

            function localeData() {
                return this._locale;
            }

            var MS_PER_SECOND = 1000,
                MS_PER_MINUTE = 60 * MS_PER_SECOND,
                MS_PER_HOUR = 60 * MS_PER_MINUTE,
                MS_PER_400_YEARS = (365 * 400 + 97) * 24 * MS_PER_HOUR;

            // actual modulo - handles negative numbers (for dates before 1970):
            function mod$1(dividend, divisor) {
                return (dividend % divisor + divisor) % divisor;
            }

            function localStartOfDate(y, m, d) {
                // the date constructor remaps years 0-99 to 1900-1999
                if (y < 100 && y >= 0) {
                    // preserve leap years using a full 400 year cycle, then reset
                    return new Date(y + 400, m, d) - MS_PER_400_YEARS;
                } else {
                    return new Date(y, m, d).valueOf();
                }
            }

            function utcStartOfDate(y, m, d) {
                // Date.UTC remaps years 0-99 to 1900-1999
                if (y < 100 && y >= 0) {
                    // preserve leap years using a full 400 year cycle, then reset
                    return Date.UTC(y + 400, m, d) - MS_PER_400_YEARS;
                } else {
                    return Date.UTC(y, m, d);
                }
            }

            function startOf(units) {
                var time, startOfDate;
                units = normalizeUnits(units);
                if (units === undefined || units === 'millisecond' || !this.isValid()) {
                    return this;
                }

                startOfDate = this._isUTC ? utcStartOfDate : localStartOfDate;

                switch (units) {
                    case 'year':
                        time = startOfDate(this.year(), 0, 1);
                        break;
                    case 'quarter':
                        time = startOfDate(this.year(), this.month() - this.month() % 3, 1);
                        break;
                    case 'month':
                        time = startOfDate(this.year(), this.month(), 1);
                        break;
                    case 'week':
                        time = startOfDate(this.year(), this.month(), this.date() - this.weekday());
                        break;
                    case 'isoWeek':
                        time = startOfDate(this.year(), this.month(), this.date() - (this.isoWeekday() - 1));
                        break;
                    case 'day':
                    case 'date':
                        time = startOfDate(this.year(), this.month(), this.date());
                        break;
                    case 'hour':
                        time = this._d.valueOf();
                        time -= mod$1(time + (this._isUTC ? 0 : this.utcOffset() * MS_PER_MINUTE), MS_PER_HOUR);
                        break;
                    case 'minute':
                        time = this._d.valueOf();
                        time -= mod$1(time, MS_PER_MINUTE);
                        break;
                    case 'second':
                        time = this._d.valueOf();
                        time -= mod$1(time, MS_PER_SECOND);
                        break;
                }

                this._d.setTime(time);
                hooks.updateOffset(this, true);
                return this;
            }

            function endOf(units) {
                var time, startOfDate;
                units = normalizeUnits(units);
                if (units === undefined || units === 'millisecond' || !this.isValid()) {
                    return this;
                }

                startOfDate = this._isUTC ? utcStartOfDate : localStartOfDate;

                switch (units) {
                    case 'year':
                        time = startOfDate(this.year() + 1, 0, 1) - 1;
                        break;
                    case 'quarter':
                        time = startOfDate(this.year(), this.month() - this.month() % 3 + 3, 1) - 1;
                        break;
                    case 'month':
                        time = startOfDate(this.year(), this.month() + 1, 1) - 1;
                        break;
                    case 'week':
                        time = startOfDate(this.year(), this.month(), this.date() - this.weekday() + 7) - 1;
                        break;
                    case 'isoWeek':
                        time = startOfDate(this.year(), this.month(), this.date() - (this.isoWeekday() - 1) + 7) - 1;
                        break;
                    case 'day':
                    case 'date':
                        time = startOfDate(this.year(), this.month(), this.date() + 1) - 1;
                        break;
                    case 'hour':
                        time = this._d.valueOf();
                        time += MS_PER_HOUR - mod$1(time + (this._isUTC ? 0 : this.utcOffset() * MS_PER_MINUTE), MS_PER_HOUR) - 1;
                        break;
                    case 'minute':
                        time = this._d.valueOf();
                        time += MS_PER_MINUTE - mod$1(time, MS_PER_MINUTE) - 1;
                        break;
                    case 'second':
                        time = this._d.valueOf();
                        time += MS_PER_SECOND - mod$1(time, MS_PER_SECOND) - 1;
                        break;
                }

                this._d.setTime(time);
                hooks.updateOffset(this, true);
                return this;
            }

            function valueOf() {
                return this._d.valueOf() - (this._offset || 0) * 60000;
            }

            function unix() {
                return Math.floor(this.valueOf() / 1000);
            }

            function toDate() {
                return new Date(this.valueOf());
            }

            function toArray() {
                var m = this;
                return [m.year(), m.month(), m.date(), m.hour(), m.minute(), m.second(), m.millisecond()];
            }

            function toObject() {
                var m = this;
                return {
                    years: m.year(),
                    months: m.month(),
                    date: m.date(),
                    hours: m.hours(),
                    minutes: m.minutes(),
                    seconds: m.seconds(),
                    milliseconds: m.milliseconds()
                };
            }

            function toJSON() {
                // new Date(NaN).toJSON() === null
                return this.isValid() ? this.toISOString() : null;
            }

            function isValid$2() {
                return isValid(this);
            }

            function parsingFlags() {
                return extend({}, getParsingFlags(this));
            }

            function invalidAt() {
                return getParsingFlags(this).overflow;
            }

            function creationData() {
                return {
                    input: this._i,
                    format: this._f,
                    locale: this._locale,
                    isUTC: this._isUTC,
                    strict: this._strict
                };
            }

            addFormatToken('N', 0, 0, 'eraAbbr');
            addFormatToken('NN', 0, 0, 'eraAbbr');
            addFormatToken('NNN', 0, 0, 'eraAbbr');
            addFormatToken('NNNN', 0, 0, 'eraName');
            addFormatToken('NNNNN', 0, 0, 'eraNarrow');

            addFormatToken('y', ['y', 1], 'yo', 'eraYear');
            addFormatToken('y', ['yy', 2], 0, 'eraYear');
            addFormatToken('y', ['yyy', 3], 0, 'eraYear');
            addFormatToken('y', ['yyyy', 4], 0, 'eraYear');

            addRegexToken('N', matchEraAbbr);
            addRegexToken('NN', matchEraAbbr);
            addRegexToken('NNN', matchEraAbbr);
            addRegexToken('NNNN', matchEraName);
            addRegexToken('NNNNN', matchEraNarrow);

            addParseToken(['N', 'NN', 'NNN', 'NNNN', 'NNNNN'], function (input, array, config, token) {
                var era = config._locale.erasParse(input, token, config._strict);
                if (era) {
                    getParsingFlags(config).era = era;
                } else {
                    getParsingFlags(config).invalidEra = input;
                }
            });

            addRegexToken('y', matchUnsigned);
            addRegexToken('yy', matchUnsigned);
            addRegexToken('yyy', matchUnsigned);
            addRegexToken('yyyy', matchUnsigned);
            addRegexToken('yo', matchEraYearOrdinal);

            addParseToken(['y', 'yy', 'yyy', 'yyyy'], YEAR);
            addParseToken(['yo'], function (input, array, config, token) {
                var match;
                if (config._locale._eraYearOrdinalRegex) {
                    match = input.match(config._locale._eraYearOrdinalRegex);
                }

                if (config._locale.eraYearOrdinalParse) {
                    array[YEAR] = config._locale.eraYearOrdinalParse(input, match);
                } else {
                    array[YEAR] = parseInt(input, 10);
                }
            });

            function localeEras(m, format) {
                var i,
                    l,
                    date,
                    eras = this._eras || getLocale('en')._eras;
                for (i = 0, l = eras.length; i < l; ++i) {
                    switch (babelHelpers.typeof(eras[i].since)) {
                        case 'string':
                            // truncate time
                            date = hooks(eras[i].since).startOf('day');
                            eras[i].since = date.valueOf();
                            break;
                    }

                    switch (babelHelpers.typeof(eras[i].until)) {
                        case 'undefined':
                            eras[i].until = +Infinity;
                            break;
                        case 'string':
                            // truncate time
                            date = hooks(eras[i].until).startOf('day').valueOf();
                            eras[i].until = date.valueOf();
                            break;
                    }
                }
                return eras;
            }

            function localeErasParse(eraName, format, strict) {
                var i,
                    l,
                    eras = this.eras(),
                    name,
                    abbr,
                    narrow;
                eraName = eraName.toUpperCase();

                for (i = 0, l = eras.length; i < l; ++i) {
                    name = eras[i].name.toUpperCase();
                    abbr = eras[i].abbr.toUpperCase();
                    narrow = eras[i].narrow.toUpperCase();

                    if (strict) {
                        switch (format) {
                            case 'N':
                            case 'NN':
                            case 'NNN':
                                if (abbr === eraName) {
                                    return eras[i];
                                }
                                break;

                            case 'NNNN':
                                if (name === eraName) {
                                    return eras[i];
                                }
                                break;

                            case 'NNNNN':
                                if (narrow === eraName) {
                                    return eras[i];
                                }
                                break;
                        }
                    } else if ([name, abbr, narrow].indexOf(eraName) >= 0) {
                        return eras[i];
                    }
                }
            }

            function localeErasConvertYear(era, year) {
                var dir = era.since <= era.until ? +1 : -1;
                if (year === undefined) {
                    return hooks(era.since).year();
                } else {
                    return hooks(era.since).year() + (year - era.offset) * dir;
                }
            }

            function getEraName() {
                var i,
                    l,
                    val,
                    eras = this.localeData().eras();
                for (i = 0, l = eras.length; i < l; ++i) {
                    // truncate time
                    val = this.clone().startOf('day').valueOf();

                    if (eras[i].since <= val && val <= eras[i].until) {
                        return eras[i].name;
                    }
                    if (eras[i].until <= val && val <= eras[i].since) {
                        return eras[i].name;
                    }
                }

                return '';
            }

            function getEraNarrow() {
                var i,
                    l,
                    val,
                    eras = this.localeData().eras();
                for (i = 0, l = eras.length; i < l; ++i) {
                    // truncate time
                    val = this.clone().startOf('day').valueOf();

                    if (eras[i].since <= val && val <= eras[i].until) {
                        return eras[i].narrow;
                    }
                    if (eras[i].until <= val && val <= eras[i].since) {
                        return eras[i].narrow;
                    }
                }

                return '';
            }

            function getEraAbbr() {
                var i,
                    l,
                    val,
                    eras = this.localeData().eras();
                for (i = 0, l = eras.length; i < l; ++i) {
                    // truncate time
                    val = this.clone().startOf('day').valueOf();

                    if (eras[i].since <= val && val <= eras[i].until) {
                        return eras[i].abbr;
                    }
                    if (eras[i].until <= val && val <= eras[i].since) {
                        return eras[i].abbr;
                    }
                }

                return '';
            }

            function getEraYear() {
                var i,
                    l,
                    dir,
                    val,
                    eras = this.localeData().eras();
                for (i = 0, l = eras.length; i < l; ++i) {
                    dir = eras[i].since <= eras[i].until ? +1 : -1;

                    // truncate time
                    val = this.clone().startOf('day').valueOf();

                    if (eras[i].since <= val && val <= eras[i].until || eras[i].until <= val && val <= eras[i].since) {
                        return (this.year() - hooks(eras[i].since).year()) * dir + eras[i].offset;
                    }
                }

                return this.year();
            }

            function erasNameRegex(isStrict) {
                if (!hasOwnProp(this, '_erasNameRegex')) {
                    computeErasParse.call(this);
                }
                return isStrict ? this._erasNameRegex : this._erasRegex;
            }

            function erasAbbrRegex(isStrict) {
                if (!hasOwnProp(this, '_erasAbbrRegex')) {
                    computeErasParse.call(this);
                }
                return isStrict ? this._erasAbbrRegex : this._erasRegex;
            }

            function erasNarrowRegex(isStrict) {
                if (!hasOwnProp(this, '_erasNarrowRegex')) {
                    computeErasParse.call(this);
                }
                return isStrict ? this._erasNarrowRegex : this._erasRegex;
            }

            function matchEraAbbr(isStrict, locale) {
                return locale.erasAbbrRegex(isStrict);
            }

            function matchEraName(isStrict, locale) {
                return locale.erasNameRegex(isStrict);
            }

            function matchEraNarrow(isStrict, locale) {
                return locale.erasNarrowRegex(isStrict);
            }

            function matchEraYearOrdinal(isStrict, locale) {
                return locale._eraYearOrdinalRegex || matchUnsigned;
            }

            function computeErasParse() {
                var abbrPieces = [],
                    namePieces = [],
                    narrowPieces = [],
                    mixedPieces = [],
                    i,
                    l,
                    eras = this.eras();

                for (i = 0, l = eras.length; i < l; ++i) {
                    namePieces.push(regexEscape(eras[i].name));
                    abbrPieces.push(regexEscape(eras[i].abbr));
                    narrowPieces.push(regexEscape(eras[i].narrow));

                    mixedPieces.push(regexEscape(eras[i].name));
                    mixedPieces.push(regexEscape(eras[i].abbr));
                    mixedPieces.push(regexEscape(eras[i].narrow));
                }

                this._erasRegex = new RegExp('^(' + mixedPieces.join('|') + ')', 'i');
                this._erasNameRegex = new RegExp('^(' + namePieces.join('|') + ')', 'i');
                this._erasAbbrRegex = new RegExp('^(' + abbrPieces.join('|') + ')', 'i');
                this._erasNarrowRegex = new RegExp('^(' + narrowPieces.join('|') + ')', 'i');
            }

            // FORMATTING

            addFormatToken(0, ['gg', 2], 0, function () {
                return this.weekYear() % 100;
            });

            addFormatToken(0, ['GG', 2], 0, function () {
                return this.isoWeekYear() % 100;
            });

            function addWeekYearFormatToken(token, getter) {
                addFormatToken(0, [token, token.length], 0, getter);
            }

            addWeekYearFormatToken('gggg', 'weekYear');
            addWeekYearFormatToken('ggggg', 'weekYear');
            addWeekYearFormatToken('GGGG', 'isoWeekYear');
            addWeekYearFormatToken('GGGGG', 'isoWeekYear');

            // ALIASES

            addUnitAlias('weekYear', 'gg');
            addUnitAlias('isoWeekYear', 'GG');

            // PRIORITY

            addUnitPriority('weekYear', 1);
            addUnitPriority('isoWeekYear', 1);

            // PARSING

            addRegexToken('G', matchSigned);
            addRegexToken('g', matchSigned);
            addRegexToken('GG', match1to2, match2);
            addRegexToken('gg', match1to2, match2);
            addRegexToken('GGGG', match1to4, match4);
            addRegexToken('gggg', match1to4, match4);
            addRegexToken('GGGGG', match1to6, match6);
            addRegexToken('ggggg', match1to6, match6);

            addWeekParseToken(['gggg', 'ggggg', 'GGGG', 'GGGGG'], function (input, week, config, token) {
                week[token.substr(0, 2)] = toInt(input);
            });

            addWeekParseToken(['gg', 'GG'], function (input, week, config, token) {
                week[token] = hooks.parseTwoDigitYear(input);
            });

            // MOMENTS

            function getSetWeekYear(input) {
                return getSetWeekYearHelper.call(this, input, this.week(), this.weekday(), this.localeData()._week.dow, this.localeData()._week.doy);
            }

            function getSetISOWeekYear(input) {
                return getSetWeekYearHelper.call(this, input, this.isoWeek(), this.isoWeekday(), 1, 4);
            }

            function getISOWeeksInYear() {
                return weeksInYear(this.year(), 1, 4);
            }

            function getISOWeeksInISOWeekYear() {
                return weeksInYear(this.isoWeekYear(), 1, 4);
            }

            function getWeeksInYear() {
                var weekInfo = this.localeData()._week;
                return weeksInYear(this.year(), weekInfo.dow, weekInfo.doy);
            }

            function getWeeksInWeekYear() {
                var weekInfo = this.localeData()._week;
                return weeksInYear(this.weekYear(), weekInfo.dow, weekInfo.doy);
            }

            function getSetWeekYearHelper(input, week, weekday, dow, doy) {
                var weeksTarget;
                if (input == null) {
                    return weekOfYear(this, dow, doy).year;
                } else {
                    weeksTarget = weeksInYear(input, dow, doy);
                    if (week > weeksTarget) {
                        week = weeksTarget;
                    }
                    return setWeekAll.call(this, input, week, weekday, dow, doy);
                }
            }

            function setWeekAll(weekYear, week, weekday, dow, doy) {
                var dayOfYearData = dayOfYearFromWeeks(weekYear, week, weekday, dow, doy),
                    date = createUTCDate(dayOfYearData.year, 0, dayOfYearData.dayOfYear);

                this.year(date.getUTCFullYear());
                this.month(date.getUTCMonth());
                this.date(date.getUTCDate());
                return this;
            }

            // FORMATTING

            addFormatToken('Q', 0, 'Qo', 'quarter');

            // ALIASES

            addUnitAlias('quarter', 'Q');

            // PRIORITY

            addUnitPriority('quarter', 7);

            // PARSING

            addRegexToken('Q', match1);
            addParseToken('Q', function (input, array) {
                array[MONTH] = (toInt(input) - 1) * 3;
            });

            // MOMENTS

            function getSetQuarter(input) {
                return input == null ? Math.ceil((this.month() + 1) / 3) : this.month((input - 1) * 3 + this.month() % 3);
            }

            // FORMATTING

            addFormatToken('D', ['DD', 2], 'Do', 'date');

            // ALIASES

            addUnitAlias('date', 'D');

            // PRIORITY
            addUnitPriority('date', 9);

            // PARSING

            addRegexToken('D', match1to2);
            addRegexToken('DD', match1to2, match2);
            addRegexToken('Do', function (isStrict, locale) {
                // TODO: Remove "ordinalParse" fallback in next major release.
                return isStrict ? locale._dayOfMonthOrdinalParse || locale._ordinalParse : locale._dayOfMonthOrdinalParseLenient;
            });

            addParseToken(['D', 'DD'], DATE);
            addParseToken('Do', function (input, array) {
                array[DATE] = toInt(input.match(match1to2)[0]);
            });

            // MOMENTS

            var getSetDayOfMonth = makeGetSet('Date', true);

            // FORMATTING

            addFormatToken('DDD', ['DDDD', 3], 'DDDo', 'dayOfYear');

            // ALIASES

            addUnitAlias('dayOfYear', 'DDD');

            // PRIORITY
            addUnitPriority('dayOfYear', 4);

            // PARSING

            addRegexToken('DDD', match1to3);
            addRegexToken('DDDD', match3);
            addParseToken(['DDD', 'DDDD'], function (input, array, config) {
                config._dayOfYear = toInt(input);
            });

            // HELPERS

            // MOMENTS

            function getSetDayOfYear(input) {
                var dayOfYear = Math.round((this.clone().startOf('day') - this.clone().startOf('year')) / 864e5) + 1;
                return input == null ? dayOfYear : this.add(input - dayOfYear, 'd');
            }

            // FORMATTING

            addFormatToken('m', ['mm', 2], 0, 'minute');

            // ALIASES

            addUnitAlias('minute', 'm');

            // PRIORITY

            addUnitPriority('minute', 14);

            // PARSING

            addRegexToken('m', match1to2);
            addRegexToken('mm', match1to2, match2);
            addParseToken(['m', 'mm'], MINUTE);

            // MOMENTS

            var getSetMinute = makeGetSet('Minutes', false);

            // FORMATTING

            addFormatToken('s', ['ss', 2], 0, 'second');

            // ALIASES

            addUnitAlias('second', 's');

            // PRIORITY

            addUnitPriority('second', 15);

            // PARSING

            addRegexToken('s', match1to2);
            addRegexToken('ss', match1to2, match2);
            addParseToken(['s', 'ss'], SECOND);

            // MOMENTS

            var getSetSecond = makeGetSet('Seconds', false);

            // FORMATTING

            addFormatToken('S', 0, 0, function () {
                return ~~(this.millisecond() / 100);
            });

            addFormatToken(0, ['SS', 2], 0, function () {
                return ~~(this.millisecond() / 10);
            });

            addFormatToken(0, ['SSS', 3], 0, 'millisecond');
            addFormatToken(0, ['SSSS', 4], 0, function () {
                return this.millisecond() * 10;
            });
            addFormatToken(0, ['SSSSS', 5], 0, function () {
                return this.millisecond() * 100;
            });
            addFormatToken(0, ['SSSSSS', 6], 0, function () {
                return this.millisecond() * 1000;
            });
            addFormatToken(0, ['SSSSSSS', 7], 0, function () {
                return this.millisecond() * 10000;
            });
            addFormatToken(0, ['SSSSSSSS', 8], 0, function () {
                return this.millisecond() * 100000;
            });
            addFormatToken(0, ['SSSSSSSSS', 9], 0, function () {
                return this.millisecond() * 1000000;
            });

            // ALIASES

            addUnitAlias('millisecond', 'ms');

            // PRIORITY

            addUnitPriority('millisecond', 16);

            // PARSING

            addRegexToken('S', match1to3, match1);
            addRegexToken('SS', match1to3, match2);
            addRegexToken('SSS', match1to3, match3);

            var token, getSetMillisecond;
            for (token = 'SSSS'; token.length <= 9; token += 'S') {
                addRegexToken(token, matchUnsigned);
            }

            function parseMs(input, array) {
                array[MILLISECOND] = toInt(('0.' + input) * 1000);
            }

            for (token = 'S'; token.length <= 9; token += 'S') {
                addParseToken(token, parseMs);
            }

            getSetMillisecond = makeGetSet('Milliseconds', false);

            // FORMATTING

            addFormatToken('z', 0, 0, 'zoneAbbr');
            addFormatToken('zz', 0, 0, 'zoneName');

            // MOMENTS

            function getZoneAbbr() {
                return this._isUTC ? 'UTC' : '';
            }

            function getZoneName() {
                return this._isUTC ? 'Coordinated Universal Time' : '';
            }

            var proto = Moment.prototype;

            proto.add = add;
            proto.calendar = calendar$1;
            proto.clone = clone;
            proto.diff = diff;
            proto.endOf = endOf;
            proto.format = format;
            proto.from = from;
            proto.fromNow = fromNow;
            proto.to = to;
            proto.toNow = toNow;
            proto.get = stringGet;
            proto.invalidAt = invalidAt;
            proto.isAfter = isAfter;
            proto.isBefore = isBefore;
            proto.isBetween = isBetween;
            proto.isSame = isSame;
            proto.isSameOrAfter = isSameOrAfter;
            proto.isSameOrBefore = isSameOrBefore;
            proto.isValid = isValid$2;
            proto.lang = lang;
            proto.locale = locale;
            proto.localeData = localeData;
            proto.max = prototypeMax;
            proto.min = prototypeMin;
            proto.parsingFlags = parsingFlags;
            proto.set = stringSet;
            proto.startOf = startOf;
            proto.subtract = subtract;
            proto.toArray = toArray;
            proto.toObject = toObject;
            proto.toDate = toDate;
            proto.toISOString = toISOString;
            proto.inspect = inspect;
            if (typeof Symbol !== 'undefined' && Symbol.for != null) {
                proto[Symbol.for('nodejs.util.inspect.custom')] = function () {
                    return 'Moment<' + this.format() + '>';
                };
            }
            proto.toJSON = toJSON;
            proto.toString = toString;
            proto.unix = unix;
            proto.valueOf = valueOf;
            proto.creationData = creationData;
            proto.eraName = getEraName;
            proto.eraNarrow = getEraNarrow;
            proto.eraAbbr = getEraAbbr;
            proto.eraYear = getEraYear;
            proto.year = getSetYear;
            proto.isLeapYear = getIsLeapYear;
            proto.weekYear = getSetWeekYear;
            proto.isoWeekYear = getSetISOWeekYear;
            proto.quarter = proto.quarters = getSetQuarter;
            proto.month = getSetMonth;
            proto.daysInMonth = getDaysInMonth;
            proto.week = proto.weeks = getSetWeek;
            proto.isoWeek = proto.isoWeeks = getSetISOWeek;
            proto.weeksInYear = getWeeksInYear;
            proto.weeksInWeekYear = getWeeksInWeekYear;
            proto.isoWeeksInYear = getISOWeeksInYear;
            proto.isoWeeksInISOWeekYear = getISOWeeksInISOWeekYear;
            proto.date = getSetDayOfMonth;
            proto.day = proto.days = getSetDayOfWeek;
            proto.weekday = getSetLocaleDayOfWeek;
            proto.isoWeekday = getSetISODayOfWeek;
            proto.dayOfYear = getSetDayOfYear;
            proto.hour = proto.hours = getSetHour;
            proto.minute = proto.minutes = getSetMinute;
            proto.second = proto.seconds = getSetSecond;
            proto.millisecond = proto.milliseconds = getSetMillisecond;
            proto.utcOffset = getSetOffset;
            proto.utc = setOffsetToUTC;
            proto.local = setOffsetToLocal;
            proto.parseZone = setOffsetToParsedOffset;
            proto.hasAlignedHourOffset = hasAlignedHourOffset;
            proto.isDST = isDaylightSavingTime;
            proto.isLocal = isLocal;
            proto.isUtcOffset = isUtcOffset;
            proto.isUtc = isUtc;
            proto.isUTC = isUtc;
            proto.zoneAbbr = getZoneAbbr;
            proto.zoneName = getZoneName;
            proto.dates = deprecate('dates accessor is deprecated. Use date instead.', getSetDayOfMonth);
            proto.months = deprecate('months accessor is deprecated. Use month instead', getSetMonth);
            proto.years = deprecate('years accessor is deprecated. Use year instead', getSetYear);
            proto.zone = deprecate('moment().zone is deprecated, use moment().utcOffset instead. http://momentjs.com/guides/#/warnings/zone/', getSetZone);
            proto.isDSTShifted = deprecate('isDSTShifted is deprecated. See http://momentjs.com/guides/#/warnings/dst-shifted/ for more information', isDaylightSavingTimeShifted);

            function createUnix(input) {
                return createLocal(input * 1000);
            }

            function createInZone() {
                return createLocal.apply(null, arguments).parseZone();
            }

            function preParsePostFormat(string) {
                return string;
            }

            var proto$1 = Locale.prototype;

            proto$1.calendar = calendar;
            proto$1.longDateFormat = longDateFormat;
            proto$1.invalidDate = invalidDate;
            proto$1.ordinal = ordinal;
            proto$1.preparse = preParsePostFormat;
            proto$1.postformat = preParsePostFormat;
            proto$1.relativeTime = relativeTime;
            proto$1.pastFuture = pastFuture;
            proto$1.set = set;
            proto$1.eras = localeEras;
            proto$1.erasParse = localeErasParse;
            proto$1.erasConvertYear = localeErasConvertYear;
            proto$1.erasAbbrRegex = erasAbbrRegex;
            proto$1.erasNameRegex = erasNameRegex;
            proto$1.erasNarrowRegex = erasNarrowRegex;

            proto$1.months = localeMonths;
            proto$1.monthsShort = localeMonthsShort;
            proto$1.monthsParse = localeMonthsParse;
            proto$1.monthsRegex = monthsRegex;
            proto$1.monthsShortRegex = monthsShortRegex;
            proto$1.week = localeWeek;
            proto$1.firstDayOfYear = localeFirstDayOfYear;
            proto$1.firstDayOfWeek = localeFirstDayOfWeek;

            proto$1.weekdays = localeWeekdays;
            proto$1.weekdaysMin = localeWeekdaysMin;
            proto$1.weekdaysShort = localeWeekdaysShort;
            proto$1.weekdaysParse = localeWeekdaysParse;

            proto$1.weekdaysRegex = weekdaysRegex;
            proto$1.weekdaysShortRegex = weekdaysShortRegex;
            proto$1.weekdaysMinRegex = weekdaysMinRegex;

            proto$1.isPM = localeIsPM;
            proto$1.meridiem = localeMeridiem;

            function get$1(format, index, field, setter) {
                var locale = getLocale(),
                    utc = createUTC().set(setter, index);
                return locale[field](utc, format);
            }

            function listMonthsImpl(format, index, field) {
                if (isNumber(format)) {
                    index = format;
                    format = undefined;
                }

                format = format || '';

                if (index != null) {
                    return get$1(format, index, field, 'month');
                }

                var i,
                    out = [];
                for (i = 0; i < 12; i++) {
                    out[i] = get$1(format, i, field, 'month');
                }
                return out;
            }

            // ()
            // (5)
            // (fmt, 5)
            // (fmt)
            // (true)
            // (true, 5)
            // (true, fmt, 5)
            // (true, fmt)
            function listWeekdaysImpl(localeSorted, format, index, field) {
                if (typeof localeSorted === 'boolean') {
                    if (isNumber(format)) {
                        index = format;
                        format = undefined;
                    }

                    format = format || '';
                } else {
                    format = localeSorted;
                    index = format;
                    localeSorted = false;

                    if (isNumber(format)) {
                        index = format;
                        format = undefined;
                    }

                    format = format || '';
                }

                var locale = getLocale(),
                    shift = localeSorted ? locale._week.dow : 0,
                    i,
                    out = [];

                if (index != null) {
                    return get$1(format, (index + shift) % 7, field, 'day');
                }

                for (i = 0; i < 7; i++) {
                    out[i] = get$1(format, (i + shift) % 7, field, 'day');
                }
                return out;
            }

            function listMonths(format, index) {
                return listMonthsImpl(format, index, 'months');
            }

            function listMonthsShort(format, index) {
                return listMonthsImpl(format, index, 'monthsShort');
            }

            function listWeekdays(localeSorted, format, index) {
                return listWeekdaysImpl(localeSorted, format, index, 'weekdays');
            }

            function listWeekdaysShort(localeSorted, format, index) {
                return listWeekdaysImpl(localeSorted, format, index, 'weekdaysShort');
            }

            function listWeekdaysMin(localeSorted, format, index) {
                return listWeekdaysImpl(localeSorted, format, index, 'weekdaysMin');
            }

            getSetGlobalLocale('en', {
                eras: [{
                    since: '0001-01-01',
                    until: +Infinity,
                    offset: 1,
                    name: 'Anno Domini',
                    narrow: 'AD',
                    abbr: 'AD'
                }, {
                    since: '0000-12-31',
                    until: -Infinity,
                    offset: 1,
                    name: 'Before Christ',
                    narrow: 'BC',
                    abbr: 'BC'
                }],
                dayOfMonthOrdinalParse: /\d{1,2}(th|st|nd|rd)/,
                ordinal: function ordinal(number) {
                    var b = number % 10,
                        output = toInt(number % 100 / 10) === 1 ? 'th' : b === 1 ? 'st' : b === 2 ? 'nd' : b === 3 ? 'rd' : 'th';
                    return number + output;
                }
            });

            // Side effect imports

            hooks.lang = deprecate('moment.lang is deprecated. Use moment.locale instead.', getSetGlobalLocale);
            hooks.langData = deprecate('moment.langData is deprecated. Use moment.localeData instead.', getLocale);

            var mathAbs = Math.abs;

            function abs() {
                var data = this._data;

                this._milliseconds = mathAbs(this._milliseconds);
                this._days = mathAbs(this._days);
                this._months = mathAbs(this._months);

                data.milliseconds = mathAbs(data.milliseconds);
                data.seconds = mathAbs(data.seconds);
                data.minutes = mathAbs(data.minutes);
                data.hours = mathAbs(data.hours);
                data.months = mathAbs(data.months);
                data.years = mathAbs(data.years);

                return this;
            }

            function addSubtract$1(duration, input, value, direction) {
                var other = createDuration(input, value);

                duration._milliseconds += direction * other._milliseconds;
                duration._days += direction * other._days;
                duration._months += direction * other._months;

                return duration._bubble();
            }

            // supports only 2.0-style add(1, 's') or add(duration)
            function add$1(input, value) {
                return addSubtract$1(this, input, value, 1);
            }

            // supports only 2.0-style subtract(1, 's') or subtract(duration)
            function subtract$1(input, value) {
                return addSubtract$1(this, input, value, -1);
            }

            function absCeil(number) {
                if (number < 0) {
                    return Math.floor(number);
                } else {
                    return Math.ceil(number);
                }
            }

            function bubble() {
                var milliseconds = this._milliseconds,
                    days = this._days,
                    months = this._months,
                    data = this._data,
                    seconds,
                    minutes,
                    hours,
                    years,
                    monthsFromDays;

                // if we have a mix of positive and negative values, bubble down first
                // check: https://github.com/moment/moment/issues/2166
                if (!(milliseconds >= 0 && days >= 0 && months >= 0 || milliseconds <= 0 && days <= 0 && months <= 0)) {
                    milliseconds += absCeil(monthsToDays(months) + days) * 864e5;
                    days = 0;
                    months = 0;
                }

                // The following code bubbles up values, see the tests for
                // examples of what that means.
                data.milliseconds = milliseconds % 1000;

                seconds = absFloor(milliseconds / 1000);
                data.seconds = seconds % 60;

                minutes = absFloor(seconds / 60);
                data.minutes = minutes % 60;

                hours = absFloor(minutes / 60);
                data.hours = hours % 24;

                days += absFloor(hours / 24);

                // convert days to months
                monthsFromDays = absFloor(daysToMonths(days));
                months += monthsFromDays;
                days -= absCeil(monthsToDays(monthsFromDays));

                // 12 months -> 1 year
                years = absFloor(months / 12);
                months %= 12;

                data.days = days;
                data.months = months;
                data.years = years;

                return this;
            }

            function daysToMonths(days) {
                // 400 years have 146097 days (taking into account leap year rules)
                // 400 years have 12 months === 4800
                return days * 4800 / 146097;
            }

            function monthsToDays(months) {
                // the reverse of daysToMonths
                return months * 146097 / 4800;
            }

            function as(units) {
                if (!this.isValid()) {
                    return NaN;
                }
                var days,
                    months,
                    milliseconds = this._milliseconds;

                units = normalizeUnits(units);

                if (units === 'month' || units === 'quarter' || units === 'year') {
                    days = this._days + milliseconds / 864e5;
                    months = this._months + daysToMonths(days);
                    switch (units) {
                        case 'month':
                            return months;
                        case 'quarter':
                            return months / 3;
                        case 'year':
                            return months / 12;
                    }
                } else {
                    // handle milliseconds separately because of floating point math errors (issue #1867)
                    days = this._days + Math.round(monthsToDays(this._months));
                    switch (units) {
                        case 'week':
                            return days / 7 + milliseconds / 6048e5;
                        case 'day':
                            return days + milliseconds / 864e5;
                        case 'hour':
                            return days * 24 + milliseconds / 36e5;
                        case 'minute':
                            return days * 1440 + milliseconds / 6e4;
                        case 'second':
                            return days * 86400 + milliseconds / 1000;
                        // Math.floor prevents floating point math errors here
                        case 'millisecond':
                            return Math.floor(days * 864e5) + milliseconds;
                        default:
                            throw new Error('Unknown unit ' + units);
                    }
                }
            }

            // TODO: Use this.as('ms')?
            function valueOf$1() {
                if (!this.isValid()) {
                    return NaN;
                }
                return this._milliseconds + this._days * 864e5 + this._months % 12 * 2592e6 + toInt(this._months / 12) * 31536e6;
            }

            function makeAs(alias) {
                return function () {
                    return this.as(alias);
                };
            }

            var asMilliseconds = makeAs('ms'),
                asSeconds = makeAs('s'),
                asMinutes = makeAs('m'),
                asHours = makeAs('h'),
                asDays = makeAs('d'),
                asWeeks = makeAs('w'),
                asMonths = makeAs('M'),
                asQuarters = makeAs('Q'),
                asYears = makeAs('y');

            function clone$1() {
                return createDuration(this);
            }

            function get$2(units) {
                units = normalizeUnits(units);
                return this.isValid() ? this[units + 's']() : NaN;
            }

            function makeGetter(name) {
                return function () {
                    return this.isValid() ? this._data[name] : NaN;
                };
            }

            var milliseconds = makeGetter('milliseconds'),
                seconds = makeGetter('seconds'),
                minutes = makeGetter('minutes'),
                hours = makeGetter('hours'),
                days = makeGetter('days'),
                months = makeGetter('months'),
                years = makeGetter('years');

            function weeks() {
                return absFloor(this.days() / 7);
            }

            var round = Math.round,
                thresholds = {
                ss: 44, // a few seconds to seconds
                s: 45, // seconds to minute
                m: 45, // minutes to hour
                h: 22, // hours to day
                d: 26, // days to month/week
                w: null, // weeks to month
                M: 11 // months to year
            };

            // helper function for moment.fn.from, moment.fn.fromNow, and moment.duration.fn.humanize
            function substituteTimeAgo(string, number, withoutSuffix, isFuture, locale) {
                return locale.relativeTime(number || 1, !!withoutSuffix, string, isFuture);
            }

            function relativeTime$1(posNegDuration, withoutSuffix, thresholds, locale) {
                var duration = createDuration(posNegDuration).abs(),
                    seconds = round(duration.as('s')),
                    minutes = round(duration.as('m')),
                    hours = round(duration.as('h')),
                    days = round(duration.as('d')),
                    months = round(duration.as('M')),
                    weeks = round(duration.as('w')),
                    years = round(duration.as('y')),
                    a = seconds <= thresholds.ss && ['s', seconds] || seconds < thresholds.s && ['ss', seconds] || minutes <= 1 && ['m'] || minutes < thresholds.m && ['mm', minutes] || hours <= 1 && ['h'] || hours < thresholds.h && ['hh', hours] || days <= 1 && ['d'] || days < thresholds.d && ['dd', days];

                if (thresholds.w != null) {
                    a = a || weeks <= 1 && ['w'] || weeks < thresholds.w && ['ww', weeks];
                }
                a = a || months <= 1 && ['M'] || months < thresholds.M && ['MM', months] || years <= 1 && ['y'] || ['yy', years];

                a[2] = withoutSuffix;
                a[3] = +posNegDuration > 0;
                a[4] = locale;
                return substituteTimeAgo.apply(null, a);
            }

            // This function allows you to set the rounding function for relative time strings
            function getSetRelativeTimeRounding(roundingFunction) {
                if (roundingFunction === undefined) {
                    return round;
                }
                if (typeof roundingFunction === 'function') {
                    round = roundingFunction;
                    return true;
                }
                return false;
            }

            // This function allows you to set a threshold for relative time strings
            function getSetRelativeTimeThreshold(threshold, limit) {
                if (thresholds[threshold] === undefined) {
                    return false;
                }
                if (limit === undefined) {
                    return thresholds[threshold];
                }
                thresholds[threshold] = limit;
                if (threshold === 's') {
                    thresholds.ss = limit - 1;
                }
                return true;
            }

            function humanize(argWithSuffix, argThresholds) {
                if (!this.isValid()) {
                    return this.localeData().invalidDate();
                }

                var withSuffix = false,
                    th = thresholds,
                    locale,
                    output;

                if ((typeof argWithSuffix === "undefined" ? "undefined" : babelHelpers.typeof(argWithSuffix)) === 'object') {
                    argThresholds = argWithSuffix;
                    argWithSuffix = false;
                }
                if (typeof argWithSuffix === 'boolean') {
                    withSuffix = argWithSuffix;
                }
                if ((typeof argThresholds === "undefined" ? "undefined" : babelHelpers.typeof(argThresholds)) === 'object') {
                    th = Object.assign({}, thresholds, argThresholds);
                    if (argThresholds.s != null && argThresholds.ss == null) {
                        th.ss = argThresholds.s - 1;
                    }
                }

                locale = this.localeData();
                output = relativeTime$1(this, !withSuffix, th, locale);

                if (withSuffix) {
                    output = locale.pastFuture(+this, output);
                }

                return locale.postformat(output);
            }

            var abs$1 = Math.abs;

            function sign(x) {
                return (x > 0) - (x < 0) || +x;
            }

            function toISOString$1() {
                // for ISO strings we do not use the normal bubbling rules:
                //  * milliseconds bubble up until they become hours
                //  * days do not bubble at all
                //  * months bubble up until they become years
                // This is because there is no context-free conversion between hours and days
                // (think of clock changes)
                // and also not between days and months (28-31 days per month)
                if (!this.isValid()) {
                    return this.localeData().invalidDate();
                }

                var seconds = abs$1(this._milliseconds) / 1000,
                    days = abs$1(this._days),
                    months = abs$1(this._months),
                    minutes,
                    hours,
                    years,
                    s,
                    total = this.asSeconds(),
                    totalSign,
                    ymSign,
                    daysSign,
                    hmsSign;

                if (!total) {
                    // this is the same as C#'s (Noda) and python (isodate)...
                    // but not other JS (goog.date)
                    return 'P0D';
                }

                // 3600 seconds -> 60 minutes -> 1 hour
                minutes = absFloor(seconds / 60);
                hours = absFloor(minutes / 60);
                seconds %= 60;
                minutes %= 60;

                // 12 months -> 1 year
                years = absFloor(months / 12);
                months %= 12;

                // inspired by https://github.com/dordille/moment-isoduration/blob/master/moment.isoduration.js
                s = seconds ? seconds.toFixed(3).replace(/\.?0+$/, '') : '';

                totalSign = total < 0 ? '-' : '';
                ymSign = sign(this._months) !== sign(total) ? '-' : '';
                daysSign = sign(this._days) !== sign(total) ? '-' : '';
                hmsSign = sign(this._milliseconds) !== sign(total) ? '-' : '';

                return totalSign + 'P' + (years ? ymSign + years + 'Y' : '') + (months ? ymSign + months + 'M' : '') + (days ? daysSign + days + 'D' : '') + (hours || minutes || seconds ? 'T' : '') + (hours ? hmsSign + hours + 'H' : '') + (minutes ? hmsSign + minutes + 'M' : '') + (seconds ? hmsSign + s + 'S' : '');
            }

            var proto$2 = Duration.prototype;

            proto$2.isValid = isValid$1;
            proto$2.abs = abs;
            proto$2.add = add$1;
            proto$2.subtract = subtract$1;
            proto$2.as = as;
            proto$2.asMilliseconds = asMilliseconds;
            proto$2.asSeconds = asSeconds;
            proto$2.asMinutes = asMinutes;
            proto$2.asHours = asHours;
            proto$2.asDays = asDays;
            proto$2.asWeeks = asWeeks;
            proto$2.asMonths = asMonths;
            proto$2.asQuarters = asQuarters;
            proto$2.asYears = asYears;
            proto$2.valueOf = valueOf$1;
            proto$2._bubble = bubble;
            proto$2.clone = clone$1;
            proto$2.get = get$2;
            proto$2.milliseconds = milliseconds;
            proto$2.seconds = seconds;
            proto$2.minutes = minutes;
            proto$2.hours = hours;
            proto$2.days = days;
            proto$2.weeks = weeks;
            proto$2.months = months;
            proto$2.years = years;
            proto$2.humanize = humanize;
            proto$2.toISOString = toISOString$1;
            proto$2.toString = toISOString$1;
            proto$2.toJSON = toISOString$1;
            proto$2.locale = locale;
            proto$2.localeData = localeData;

            proto$2.toIsoString = deprecate('toIsoString() is deprecated. Please use toISOString() instead (notice the capitals)', toISOString$1);
            proto$2.lang = lang;

            // FORMATTING

            addFormatToken('X', 0, 0, 'unix');
            addFormatToken('x', 0, 0, 'valueOf');

            // PARSING

            addRegexToken('x', matchSigned);
            addRegexToken('X', matchTimestamp);
            addParseToken('X', function (input, array, config) {
                config._d = new Date(parseFloat(input) * 1000);
            });
            addParseToken('x', function (input, array, config) {
                config._d = new Date(toInt(input));
            });

            //! moment.js

            hooks.version = '2.29.1';

            setHookCallback(createLocal);

            hooks.fn = proto;
            hooks.min = min;
            hooks.max = max;
            hooks.now = now;
            hooks.utc = createUTC;
            hooks.unix = createUnix;
            hooks.months = listMonths;
            hooks.isDate = isDate;
            hooks.locale = getSetGlobalLocale;
            hooks.invalid = createInvalid;
            hooks.duration = createDuration;
            hooks.isMoment = isMoment;
            hooks.weekdays = listWeekdays;
            hooks.parseZone = createInZone;
            hooks.localeData = getLocale;
            hooks.isDuration = isDuration;
            hooks.monthsShort = listMonthsShort;
            hooks.weekdaysMin = listWeekdaysMin;
            hooks.defineLocale = defineLocale;
            hooks.updateLocale = updateLocale;
            hooks.locales = listLocales;
            hooks.weekdaysShort = listWeekdaysShort;
            hooks.normalizeUnits = normalizeUnits;
            hooks.relativeTimeRounding = getSetRelativeTimeRounding;
            hooks.relativeTimeThreshold = getSetRelativeTimeThreshold;
            hooks.calendarFormat = getCalendarFormat;
            hooks.prototype = proto;

            // currently HTML5 input type only supports 24-hour formats
            hooks.HTML5_FMT = {
                DATETIME_LOCAL: 'YYYY-MM-DDTHH:mm', // <input type="datetime-local" />
                DATETIME_LOCAL_SECONDS: 'YYYY-MM-DDTHH:mm:ss', // <input type="datetime-local" step="1" />
                DATETIME_LOCAL_MS: 'YYYY-MM-DDTHH:mm:ss.SSS', // <input type="datetime-local" step="0.001" />
                DATE: 'YYYY-MM-DD', // <input type="date" />
                TIME: 'HH:mm', // <input type="time" />
                TIME_SECONDS: 'HH:mm:ss', // <input type="time" step="1" />
                TIME_MS: 'HH:mm:ss.SSS', // <input type="time" step="0.001" />
                WEEK: 'GGGG-[W]WW', // <input type="week" />
                MONTH: 'YYYY-MM' // <input type="month" />
            };

            return hooks;
        });
    }, {}], 60: [function (require, module, exports) {
        'use strict';

        var bankUtils = require('yandex-money-bank-utils');
        var envType = require('yandex-money-env-type');
        var url = require('yandex-money-url');
        var utils = require('yandex-money-utils');
        var xev = require('yandex-money-xev');

        module.exports = {
            bankUtils: bankUtils,
            envType: envType,
            url: url,
            utils: utils,
            xev: xev
        };
    }, { "yandex-money-bank-utils": 63, "yandex-money-env-type": 64, "yandex-money-url": 65, "yandex-money-utils": 68, "yandex-money-xev": 80 }], 61: [function (require, module, exports) {
        module.exports = {
            "220053": "akbars",
            "424436": "akbars",
            "424437": "akbars",
            "424438": "akbars",
            "424439": "akbars",
            "424440": "akbars",
            "677088": "akbars",
            "220015": "alfabank",
            "410243": "alfabank",
            "410244": "alfabank",
            "410245": "alfabank",
            "410246": "alfabank",
            "410247": "alfabank",
            "410584": "alfabank",
            "415400": "alfabank",
            "415428": "alfabank",
            "415429": "alfabank",
            "415481": "alfabank",
            "415482": "alfabank",
            "419540": "alfabank",
            "420102": "alfabank",
            "420103": "alfabank",
            "420104": "alfabank",
            "420105": "alfabank",
            "420106": "alfabank",
            "420108": "alfabank",
            "421118": "alfabank",
            "422605": "alfabank",
            "423719": "alfabank",
            "427218": "alfabank",
            "427714": "alfabank",
            "428804": "alfabank",
            "428905": "alfabank",
            "428906": "alfabank",
            "431416": "alfabank",
            "431417": "alfabank",
            "431727": "alfabank",
            "434135": "alfabank",
            "438138": "alfabank",
            "438139": "alfabank",
            "438140": "alfabank",
            "439000": "alfabank",
            "439077": "alfabank",
            "440237": "alfabank",
            "458280": "alfabank",
            "458410": "alfabank",
            "458411": "alfabank",
            "458450": "alfabank",
            "458521": "alfabank",
            "477932": "alfabank",
            "477964": "alfabank",
            "478752": "alfabank",
            "479004": "alfabank",
            "479087": "alfabank",
            "510126": "alfabank",
            "521178": "alfabank",
            "530827": "alfabank",
            "543259": "alfabank",
            "548601": "alfabank",
            "548655": "alfabank",
            "548673": "alfabank",
            "548674": "alfabank",
            "552175": "alfabank",
            "555947": "alfabank",
            "555949": "alfabank",
            "555957": "alfabank",
            "403896": "avangard",
            "403897": "avangard",
            "403898": "avangard",
            "404114": "avangard",
            "419163": "avangard",
            "522223": "avangard",
            "522224": "avangard",
            "419149": "az-to-bank",
            "419150": "az-to-bank",
            "419151": "az-to-bank",
            "419152": "az-to-bank",
            "419153": "az-to-bank",
            "458488": "az-to-bank",
            "458489": "az-to-bank",
            "458490": "az-to-bank",
            "532947": "az-to-bank",
            "428247": "baltinvestbank",
            "428248": "baltinvestbank",
            "428249": "baltinvestbank",
            "413064": "bank-moskvi",
            "424646": "bank-moskvi",
            "427275": "bank-moskvi",
            "427726": "bank-moskvi",
            "429158": "bank-moskvi",
            "431336": "bank-moskvi",
            "465206": "bank-moskvi",
            "465207": "bank-moskvi",
            "465208": "bank-moskvi",
            "465218": "bank-moskvi",
            "541715": "bank-moskvi",
            "402538": "binbank",
            "425175": "binbank",
            "433920": "binbank",
            "465008": "binbank",
            "518961": "binbank",
            "400648": "center-invest",
            "411717": "center-invest",
            "411718": "center-invest",
            "430312": "center-invest",
            "430314": "center-invest",
            "458527": "center-invest",
            "512762": "citibank",
            "515854": "citibank",
            "520306": "citibank",
            "525689": "citibank",
            "527594": "citibank",
            "531809": "citibank",
            "532974": "citibank",
            "533201": "citibank",
            "533681": "citibank",
            "539726": "citibank",
            "540788": "citibank",
            "545182": "citibank",
            "552573": "citibank",
            "555057": "citibank",
            "555058": "citibank",
            "408373": "crediteuropebank",
            "411647": "crediteuropebank",
            "411648": "crediteuropebank",
            "411649": "crediteuropebank",
            "432158": "crediteuropebank",
            "512273": "crediteuropebank",
            "520957": "crediteuropebank",
            "520993": "crediteuropebank",
            "521144": "crediteuropebank",
            "521830": "crediteuropebank",
            "525991": "crediteuropebank",
            "531034": "crediteuropebank",
            "532315": "crediteuropebank",
            "541450": "crediteuropebank",
            "547550": "crediteuropebank",
            "557056": "crediteuropebank",
            "557057": "crediteuropebank",
            "676586": "crediteuropebank",
            "404160": "expobank",
            "422081": "expobank",
            "427754": "expobank",
            "487432": "expobank",
            "487433": "expobank",
            "487434": "expobank",
            "487435": "expobank",
            "546855": "expobank",
            "554834": "expobank",
            "220071": "express-bank",
            "425534": "express-bank",
            "425535": "express-bank",
            "443886": "express-bank",
            "443887": "express-bank",
            "443888": "express-bank",
            "444094": "express-bank",
            "220172": "finservice",
            "429907": "finservice",
            "429908": "finservice",
            "403828": "fnp-bank",
            "403829": "fnp-bank",
            "403830": "fnp-bank",
            "478488": "fnp-bank",
            "220001": "gasprom",
            "404270": "gasprom",
            "487415": "gasprom",
            "514082": "gasprom",
            "518228": "gasprom",
            "518373": "gasprom",
            "518704": "gasprom",
            "518816": "gasprom",
            "518902": "gasprom",
            "521155": "gasprom",
            "522193": "gasprom",
            "522477": "gasprom",
            "522826": "gasprom",
            "522988": "gasprom",
            "522989": "gasprom",
            "525740": "gasprom",
            "525784": "gasprom",
            "525833": "gasprom",
            "526483": "gasprom",
            "529278": "gasprom",
            "530114": "gasprom",
            "530993": "gasprom",
            "531305": "gasprom",
            "532684": "gasprom",
            "534130": "gasprom",
            "534196": "gasprom",
            "536995": "gasprom",
            "539839": "gasprom",
            "540664": "gasprom",
            "542255": "gasprom",
            "543672": "gasprom",
            "543724": "gasprom",
            "543762": "gasprom",
            "544026": "gasprom",
            "544561": "gasprom",
            "545101": "gasprom",
            "547348": "gasprom",
            "548027": "gasprom",
            "548999": "gasprom",
            "549000": "gasprom",
            "549098": "gasprom",
            "549600": "gasprom",
            "552702": "gasprom",
            "556052": "gasprom",
            "558355": "gasprom",
            "676454": "gasprom",
            "676990": "gasprom",
            "677484": "gasprom",
            "677585": "gasprom",
            "220179": "globex",
            "406726": "globex",
            "424547": "globex",
            "424548": "globex",
            "439245": "globex",
            "220050": "homecredit",
            "445433": "homecredit",
            "445434": "homecredit",
            "445435": "homecredit",
            "446098": "homecredit",
            "472445": "homecredit",
            "522199": "homecredit",
            "525933": "homecredit",
            "536511": "homecredit",
            "545762": "homecredit",
            "548745": "homecredit",
            "557734": "homecredit",
            "406180": "intercommerz",
            "406181": "intercommerz",
            "406182": "intercommerz",
            "460052": "intercommerz",
            "510170": "intercommerz",
            "402578": "inteza",
            "421169": "inteza",
            "421170": "inteza",
            "421171": "inteza",
            "484891": "inteza",
            "406777": "jugra",
            "406778": "jugra",
            "406780": "jugra",
            "406781": "jugra",
            "549966": "jugra",
            "558385": "jugra",
            "405992": "leto-bank",
            "220022": "mdm",
            "515785": "mdm",
            "518586": "mdm",
            "518788": "mdm",
            "518876": "mdm",
            "520328": "mdm",
            "524860": "mdm",
            "524862": "mdm",
            "525742": "mdm",
            "525744": "mdm",
            "527448": "mdm",
            "527450": "mdm",
            "531425": "mdm",
            "532835": "mdm",
            "533614": "mdm",
            "539036": "mdm",
            "539600": "mdm",
            "540194": "mdm",
            "540455": "mdm",
            "540642": "mdm",
            "541152": "mdm",
            "541294": "mdm",
            "541587": "mdm",
            "542504": "mdm",
            "543038": "mdm",
            "543366": "mdm",
            "544117": "mdm",
            "547243": "mdm",
            "547801": "mdm",
            "548092": "mdm",
            "548265": "mdm",
            "548270": "mdm",
            "549349": "mdm",
            "549512": "mdm",
            "549523": "mdm",
            "552866": "mdm",
            "554372": "mdm",
            "554373": "mdm",
            "558625": "mdm",
            "558636": "mdm",
            "676428": "mdm",
            "676934": "mdm",
            "676947": "mdm",
            "676998": "mdm",
            "677058": "mdm",
            "677275": "mdm",
            "677276": "mdm",
            "677358": "mdm",
            "677406": "mdm",
            "677505": "mdm",
            "430112": "mfk",
            "430113": "mfk",
            "430114": "mfk",
            "445636": "mfk",
            "445637": "mfk",
            "458449": "mfk",
            "402326": "mib",
            "402327": "mib",
            "402328": "mib",
            "402549": "mib",
            "472480": "mib",
            "480938": "mib",
            "515587": "mib",
            "557071": "mib",
            "557072": "mib",
            "515770": "moscredbank",
            "521801": "moscredbank",
            "532184": "moscredbank",
            "542033": "moscredbank",
            "543211": "moscredbank",
            "552680": "moscredbank",
            "676967": "moscredbank",
            "220028": "mts-bank",
            "404204": "mts-bank",
            "404224": "mts-bank",
            "404266": "mts-bank",
            "404267": "mts-bank",
            "404268": "mts-bank",
            "404269": "mts-bank",
            "406356": "mts-bank",
            "517955": "mts-bank",
            "533736": "mts-bank",
            "540616": "mts-bank",
            "541435": "mts-bank",
            "550583": "mts-bank",
            "676884": "mts-bank",
            "220156": "novikombank",
            "402457": "novikombank",
            "402909": "novikombank",
            "402910": "novikombank",
            "402911": "novikombank",
            "458559": "novikombank",
            "471436": "novikombank",
            "532130": "rocketbank",
            "220029": "otkritie",
            "406790": "otkritie",
            "406791": "otkritie",
            "406792": "otkritie",
            "409755": "otkritie",
            "409756": "otkritie",
            "417676": "otkritie",
            "425656": "otkritie",
            "437351": "otkritie",
            "446065": "otkritie",
            "474159": "otkritie",
            "530183": "otkritie",
            "530403": "otkritie",
            "531674": "otkritie",
            "532301": "otkritie",
            "539714": "otkritie",
            "544218": "otkritie",
            "544962": "otkritie",
            "549024": "otkritie",
            "549025": "otkritie",
            "558620": "otkritie",
            "670518": "otkritie",
            "676231": "otkritie",
            "405870": "otkritie",
            "405844": "probusiness",
            "405845": "probusiness",
            "405846": "probusiness",
            "405847": "probusiness",
            "413229": "probusiness",
            "220003": "promsvyazbank",
            "515848": "promsvyazbank",
            "516473": "promsvyazbank",
            "518486": "promsvyazbank",
            "518946": "promsvyazbank",
            "518951": "promsvyazbank",
            "518970": "promsvyazbank",
            "518977": "promsvyazbank",
            "518981": "promsvyazbank",
            "520085": "promsvyazbank",
            "520088": "promsvyazbank",
            "520373": "promsvyazbank",
            "521124": "promsvyazbank",
            "525494": "promsvyazbank",
            "526280": "promsvyazbank",
            "528701": "promsvyazbank",
            "529160": "promsvyazbank",
            "530441": "promsvyazbank",
            "531534": "promsvyazbank",
            "532421": "promsvyazbank",
            "539621": "promsvyazbank",
            "539704": "promsvyazbank",
            "539861": "promsvyazbank",
            "541269": "promsvyazbank",
            "542340": "promsvyazbank",
            "543874": "promsvyazbank",
            "544800": "promsvyazbank",
            "545350": "promsvyazbank",
            "546766": "promsvyazbank",
            "547329": "promsvyazbank",
            "548172": "promsvyazbank",
            "548429": "promsvyazbank",
            "549425": "promsvyazbank",
            "549439": "promsvyazbank",
            "549524": "promsvyazbank",
            "554279": "promsvyazbank",
            "554759": "promsvyazbank",
            "554781": "promsvyazbank",
            "556046": "promsvyazbank",
            "557981": "promsvyazbank",
            "558254": "promsvyazbank",
            "558268": "promsvyazbank",
            "558516": "promsvyazbank",
            "558672": "promsvyazbank",
            "670508": "promsvyazbank",
            "670583": "promsvyazbank",
            "670611": "promsvyazbank",
            "670654": "promsvyazbank",
            "670661": "promsvyazbank",
            "676444": "promsvyazbank",
            "677263": "promsvyazbank",
            "677356": "promsvyazbank",
            "677370": "promsvyazbank",
            "677371": "promsvyazbank",
            "677372": "promsvyazbank",
            "677461": "promsvyazbank",
            "677462": "promsvyazbank",
            "677506": "promsvyazbank",
            "220030": "raiffeisen",
            "462729": "raiffeisen",
            "508406": "raiffeisen",
            "510069": "raiffeisen",
            "510070": "raiffeisen",
            "515876": "raiffeisen",
            "528053": "raiffeisen",
            "528808": "raiffeisen",
            "528809": "raiffeisen",
            "530867": "raiffeisen",
            "533594": "raiffeisen",
            "533616": "raiffeisen",
            "536392": "raiffeisen",
            "542772": "raiffeisen",
            "544237": "raiffeisen",
            "545115": "raiffeisen",
            "547613": "raiffeisen",
            "553496": "raiffeisen",
            "558273": "raiffeisen",
            "558536": "raiffeisen",
            "676625": "raiffeisen",
            "447603": "raiffeisen",
            "416982": "rgs",
            "416983": "rgs",
            "416984": "rgs",
            "431359": "rgs",
            "472489": "rgs",
            "521172": "rgs",
            "526818": "rgs",
            "677189": "rgs",
            "485078": "rocketbank",
            "220039": "rosbank",
            "404862": "rosbank",
            "404890": "rosbank",
            "404892": "rosbank",
            "406767": "rosbank",
            "407564": "rosbank",
            "412519": "rosbank",
            "416956": "rosbank",
            "423169": "rosbank",
            "425153": "rosbank",
            "427715": "rosbank",
            "432638": "rosbank",
            "438933": "rosbank",
            "438970": "rosbank",
            "438971": "rosbank",
            "440503": "rosbank",
            "440505": "rosbank",
            "440540": "rosbank",
            "440541": "rosbank",
            "459937": "rosbank",
            "474218": "rosbank",
            "477908": "rosbank",
            "477986": "rosbank",
            "499932": "rosbank",
            "499966": "rosbank",
            "515605": "rosbank",
            "518079": "rosbank",
            "518642": "rosbank",
            "526462": "rosbank",
            "528933": "rosbank",
            "531222": "rosbank",
            "534251": "rosbank",
            "540035": "rosbank",
            "541903": "rosbank",
            "549475": "rosbank",
            "554761": "rosbank",
            "554782": "rosbank",
            "555079": "rosbank",
            "558673": "rosbank",
            "220008": "rossiya",
            "419905": "rossiya",
            "426809": "rossiya",
            "426810": "rossiya",
            "426811": "rossiya",
            "426812": "rossiya",
            "426813": "rossiya",
            "426814": "rossiya",
            "426815": "rossiya",
            "430708": "rossiya",
            "430709": "rossiya",
            "458722": "rossiya",
            "458723": "rossiya",
            "220038": "rsb",
            "422608": "rsb",
            "525446": "rsb",
            "534162": "rsb",
            "536409": "rsb",
            "547601": "rsb",
            "549715": "rsb",
            "623446": "rsb",
            "417250": "russtandart",
            "417251": "russtandart",
            "417252": "russtandart",
            "417253": "russtandart",
            "417254": "russtandart",
            "417291": "russtandart",
            "510047": "russtandart",
            "510092": "russtandart",
            "513691": "russtandart",
            "533469": "russtandart",
            "536401": "russtandart",
            "542048": "russtandart",
            "545160": "russtandart",
            "676565": "russtandart",
            "220220": "sberbank",
            "426343": "sberbank",
            "427400": "sberbank",
            "427401": "sberbank",
            "427402": "sberbank",
            "427403": "sberbank",
            "427404": "sberbank",
            "427405": "sberbank",
            "427406": "sberbank",
            "427407": "sberbank",
            "427408": "sberbank",
            "427409": "sberbank",
            "427410": "sberbank",
            "427411": "sberbank",
            "427412": "sberbank",
            "427413": "sberbank",
            "427414": "sberbank",
            "427416": "sberbank",
            "427417": "sberbank",
            "427418": "sberbank",
            "427419": "sberbank",
            "427420": "sberbank",
            "427421": "sberbank",
            "427422": "sberbank",
            "427423": "sberbank",
            "427424": "sberbank",
            "427425": "sberbank",
            "427426": "sberbank",
            "427427": "sberbank",
            "427428": "sberbank",
            "427429": "sberbank",
            "427430": "sberbank",
            "427431": "sberbank",
            "427433": "sberbank",
            "427434": "sberbank",
            "427435": "sberbank",
            "427437": "sberbank",
            "427438": "sberbank",
            "427439": "sberbank",
            "427440": "sberbank",
            "427441": "sberbank",
            "427442": "sberbank",
            "427443": "sberbank",
            "427444": "sberbank",
            "427445": "sberbank",
            "427446": "sberbank",
            "427447": "sberbank",
            "427448": "sberbank",
            "427449": "sberbank",
            "427450": "sberbank",
            "427451": "sberbank",
            "427453": "sberbank",
            "427454": "sberbank",
            "427455": "sberbank",
            "427456": "sberbank",
            "427457": "sberbank",
            "427458": "sberbank",
            "427459": "sberbank",
            "427460": "sberbank",
            "427461": "sberbank",
            "427462": "sberbank",
            "427463": "sberbank",
            "427465": "sberbank",
            "427466": "sberbank",
            "427467": "sberbank",
            "427468": "sberbank",
            "427469": "sberbank",
            "427470": "sberbank",
            "427471": "sberbank",
            "427472": "sberbank",
            "427473": "sberbank",
            "427474": "sberbank",
            "427475": "sberbank",
            "427476": "sberbank",
            "427477": "sberbank",
            "427491": "sberbank",
            "427499": "sberbank",
            "427600": "sberbank",
            "427601": "sberbank",
            "427602": "sberbank",
            "427603": "sberbank",
            "427604": "sberbank",
            "427605": "sberbank",
            "427606": "sberbank",
            "427607": "sberbank",
            "427608": "sberbank",
            "427609": "sberbank",
            "427610": "sberbank",
            "427611": "sberbank",
            "427612": "sberbank",
            "427613": "sberbank",
            "427614": "sberbank",
            "427615": "sberbank",
            "427616": "sberbank",
            "427617": "sberbank",
            "427618": "sberbank",
            "427619": "sberbank",
            "427620": "sberbank",
            "427621": "sberbank",
            "427622": "sberbank",
            "427624": "sberbank",
            "427625": "sberbank",
            "427626": "sberbank",
            "427627": "sberbank",
            "427628": "sberbank",
            "427629": "sberbank",
            "427630": "sberbank",
            "427631": "sberbank",
            "427632": "sberbank",
            "427633": "sberbank",
            "427634": "sberbank",
            "427635": "sberbank",
            "427636": "sberbank",
            "427637": "sberbank",
            "427638": "sberbank",
            "427639": "sberbank",
            "427640": "sberbank",
            "427641": "sberbank",
            "427642": "sberbank",
            "427643": "sberbank",
            "427644": "sberbank",
            "427645": "sberbank",
            "427646": "sberbank",
            "427647": "sberbank",
            "427648": "sberbank",
            "427649": "sberbank",
            "427650": "sberbank",
            "427651": "sberbank",
            "427652": "sberbank",
            "427653": "sberbank",
            "427654": "sberbank",
            "427655": "sberbank",
            "427656": "sberbank",
            "427657": "sberbank",
            "427658": "sberbank",
            "427659": "sberbank",
            "427660": "sberbank",
            "427661": "sberbank",
            "427662": "sberbank",
            "427663": "sberbank",
            "427664": "sberbank",
            "427665": "sberbank",
            "427666": "sberbank",
            "427667": "sberbank",
            "427668": "sberbank",
            "427669": "sberbank",
            "427670": "sberbank",
            "427671": "sberbank",
            "427672": "sberbank",
            "427673": "sberbank",
            "427674": "sberbank",
            "427675": "sberbank",
            "427676": "sberbank",
            "427677": "sberbank",
            "427678": "sberbank",
            "427679": "sberbank",
            "427680": "sberbank",
            "427681": "sberbank",
            "427684": "sberbank",
            "427685": "sberbank",
            "427686": "sberbank",
            "427687": "sberbank",
            "427688": "sberbank",
            "427689": "sberbank",
            "427690": "sberbank",
            "427692": "sberbank",
            "427693": "sberbank",
            "427694": "sberbank",
            "427695": "sberbank",
            "427696": "sberbank",
            "427697": "sberbank",
            "427900": "sberbank",
            "427902": "sberbank",
            "427903": "sberbank",
            "427904": "sberbank",
            "427905": "sberbank",
            "427906": "sberbank",
            "427907": "sberbank",
            "427908": "sberbank",
            "427910": "sberbank",
            "427911": "sberbank",
            "427912": "sberbank",
            "427913": "sberbank",
            "427914": "sberbank",
            "427915": "sberbank",
            "427916": "sberbank",
            "427917": "sberbank",
            "427918": "sberbank",
            "427919": "sberbank",
            "427920": "sberbank",
            "427921": "sberbank",
            "427922": "sberbank",
            "427923": "sberbank",
            "427924": "sberbank",
            "427925": "sberbank",
            "427927": "sberbank",
            "427928": "sberbank",
            "427929": "sberbank",
            "427930": "sberbank",
            "427931": "sberbank",
            "427932": "sberbank",
            "427933": "sberbank",
            "427934": "sberbank",
            "427935": "sberbank",
            "427936": "sberbank",
            "427937": "sberbank",
            "427938": "sberbank",
            "427939": "sberbank",
            "427940": "sberbank",
            "427941": "sberbank",
            "427942": "sberbank",
            "427943": "sberbank",
            "427944": "sberbank",
            "427945": "sberbank",
            "427946": "sberbank",
            "427947": "sberbank",
            "427948": "sberbank",
            "427949": "sberbank",
            "427950": "sberbank",
            "427951": "sberbank",
            "427952": "sberbank",
            "427953": "sberbank",
            "427954": "sberbank",
            "427955": "sberbank",
            "427956": "sberbank",
            "427957": "sberbank",
            "427958": "sberbank",
            "427960": "sberbank",
            "427961": "sberbank",
            "427962": "sberbank",
            "427963": "sberbank",
            "427964": "sberbank",
            "427965": "sberbank",
            "427966": "sberbank",
            "427967": "sberbank",
            "427968": "sberbank",
            "427969": "sberbank",
            "427970": "sberbank",
            "427971": "sberbank",
            "427972": "sberbank",
            "427973": "sberbank",
            "427974": "sberbank",
            "427975": "sberbank",
            "427976": "sberbank",
            "427977": "sberbank",
            "427978": "sberbank",
            "427979": "sberbank",
            "427980": "sberbank",
            "427982": "sberbank",
            "427983": "sberbank",
            "427984": "sberbank",
            "427986": "sberbank",
            "427988": "sberbank",
            "427989": "sberbank",
            "427990": "sberbank",
            "427991": "sberbank",
            "427992": "sberbank",
            "427993": "sberbank",
            "427994": "sberbank",
            "427995": "sberbank",
            "427996": "sberbank",
            "427997": "sberbank",
            "427998": "sberbank",
            "427999": "sberbank",
            "437435": "sberbank",
            "437985": "sberbank",
            "481776": "sberbank",
            "515842": "sberbank",
            "531310": "sberbank",
            "533669": "sberbank",
            "545037": "sberbank",
            "546902": "sberbank",
            "546903": "sberbank",
            "546904": "sberbank",
            "546905": "sberbank",
            "546906": "sberbank",
            "546907": "sberbank",
            "546908": "sberbank",
            "546909": "sberbank",
            "546910": "sberbank",
            "546911": "sberbank",
            "546912": "sberbank",
            "546913": "sberbank",
            "546916": "sberbank",
            "546917": "sberbank",
            "546918": "sberbank",
            "546920": "sberbank",
            "546922": "sberbank",
            "546925": "sberbank",
            "546926": "sberbank",
            "546927": "sberbank",
            "546928": "sberbank",
            "546930": "sberbank",
            "546931": "sberbank",
            "546935": "sberbank",
            "546936": "sberbank",
            "546937": "sberbank",
            "546938": "sberbank",
            "546939": "sberbank",
            "546940": "sberbank",
            "546941": "sberbank",
            "546942": "sberbank",
            "546943": "sberbank",
            "546944": "sberbank",
            "546945": "sberbank",
            "546947": "sberbank",
            "546948": "sberbank",
            "546949": "sberbank",
            "546951": "sberbank",
            "546952": "sberbank",
            "546953": "sberbank",
            "546954": "sberbank",
            "546955": "sberbank",
            "546956": "sberbank",
            "546959": "sberbank",
            "546960": "sberbank",
            "546961": "sberbank",
            "546962": "sberbank",
            "546963": "sberbank",
            "546964": "sberbank",
            "546966": "sberbank",
            "546967": "sberbank",
            "546968": "sberbank",
            "546969": "sberbank",
            "546970": "sberbank",
            "546972": "sberbank",
            "546974": "sberbank",
            "546975": "sberbank",
            "546977": "sberbank",
            "546999": "sberbank",
            "547927": "sberbank",
            "547931": "sberbank",
            "547932": "sberbank",
            "547947": "sberbank",
            "547952": "sberbank",
            "547955": "sberbank",
            "547961": "sberbank",
            "548401": "sberbank",
            "548402": "sberbank",
            "548407": "sberbank",
            "548410": "sberbank",
            "548412": "sberbank",
            "548413": "sberbank",
            "548416": "sberbank",
            "548420": "sberbank",
            "548425": "sberbank",
            "548426": "sberbank",
            "548427": "sberbank",
            "548428": "sberbank",
            "548430": "sberbank",
            "548435": "sberbank",
            "548440": "sberbank",
            "548442": "sberbank",
            "548443": "sberbank",
            "548444": "sberbank",
            "548445": "sberbank",
            "548447": "sberbank",
            "548448": "sberbank",
            "548449": "sberbank",
            "548450": "sberbank",
            "548452": "sberbank",
            "548454": "sberbank",
            "548455": "sberbank",
            "548459": "sberbank",
            "548460": "sberbank",
            "548461": "sberbank",
            "548462": "sberbank",
            "548463": "sberbank",
            "548464": "sberbank",
            "548466": "sberbank",
            "548469": "sberbank",
            "548470": "sberbank",
            "548472": "sberbank",
            "548477": "sberbank",
            "548498": "sberbank",
            "548499": "sberbank",
            "605461": "sberbank",
            "639002": "sberbank",
            "676195": "sberbank",
            "676196": "sberbank",
            "220048": "skb-bank",
            "413877": "skb-bank",
            "413878": "skb-bank",
            "413879": "skb-bank",
            "488951": "skb-bank",
            "220488": "smp-bank",
            "520920": "smp-bank",
            "521326": "smp-bank",
            "220049": "soyuz",
            "400287": "soyuz",
            "400881": "soyuz",
            "424352": "soyuz",
            "432974": "soyuz",
            "433710": "soyuz",
            "433711": "soyuz",
            "434381": "soyuz",
            "434382": "soyuz",
            "434383": "soyuz",
            "434384": "soyuz",
            "488967": "soyuz",
            "488968": "soyuz",
            "489008": "soyuz",
            "489095": "soyuz",
            "540670": "soyuz",
            "220033": "spb-bank",
            "522858": "spb-bank",
            "530900": "spb-bank",
            "532186": "spb-bank",
            "541600": "spb-bank",
            "543101": "spb-bank",
            "552669": "spb-bank",
            "676948": "spb-bank",
            "417225": "tatfondbank",
            "417226": "tatfondbank",
            "417227": "tatfondbank",
            "423217": "tatfondbank",
            "427871": "tatfondbank",
            "445034": "tatfondbank",
            "515783": "tatfondbank",
            "677225": "tatfondbank",
            "220070": "tinkoff",
            "437773": "tinkoff",
            "521324": "tinkoff",
            "553691": "tinkoff",
            "220059": "transcapital",
            "402877": "transcapital",
            "478474": "transcapital",
            "478475": "transcapital",
            "478476": "transcapital",
            "530145": "transcapital",
            "220084": "unicredit",
            "510074": "unicredit",
            "518996": "unicredit",
            "518997": "unicredit",
            "522458": "unicredit",
            "530172": "unicredit",
            "531236": "unicredit",
            "531344": "unicredit",
            "547728": "unicredit",
            "549302": "unicredit",
            "676672": "unicredit",
            "406140": "vbrr",
            "406141": "vbrr",
            "413203": "vbrr",
            "413204": "vbrr",
            "413205": "vbrr",
            "417627": "visa-qiwi",
            "417628": "visa-qiwi",
            "417629": "visa-qiwi",
            "426740": "visa-qiwi",
            "428122": "visa-qiwi",
            "469395": "visa-qiwi",
            "489049": "visa-qiwi",
            "423649": "vneshprombank",
            "478471": "vneshprombank",
            "478472": "vneshprombank",
            "488993": "vneshprombank",
            "220024": "vtb24",
            "427229": "vtb24",
            "510144": "vtb24",
            "518591": "vtb24",
            "518640": "vtb24",
            "519304": "vtb24",
            "519998": "vtb24",
            "527883": "vtb24",
            "529025": "vtb24",
            "529938": "vtb24",
            "535082": "vtb24",
            "536829": "vtb24",
            "540154": "vtb24",
            "545224": "vtb24",
            "549223": "vtb24",
            "549270": "vtb24",
            "549500": "vtb24",
            "549866": "vtb24",
            "554386": "vtb24",
            "554393": "vtb24",
            "558518": "vtb24",
            "676421": "vtb24",
            "676974": "vtb24",
            "677470": "vtb24",
            "677471": "vtb24",
            "677517": "vtb24",
            "510621": "ym",
            "518901": "ym",
            "548387": "ym",
            "559900": "ym",
            "404802": "ym",
            "404841": "ym",
            "220062": "zenit",
            "414656": "zenit",
            "414657": "zenit",
            "414658": "zenit",
            "414659": "zenit",
            "428266": "zenit",
            "470434": "zenit",
            "480232": "zenit",
            "512449": "zenit",
            "515760": "zenit",
            "516333": "zenit",
            "516358": "zenit",
            "517667": "zenit",
            "518647": "zenit",
            "521194": "zenit",
            "522456": "zenit",
            "522851": "zenit",
            "526891": "zenit",
            "532461": "zenit",
            "532463": "zenit",
            "539607": "zenit",
            "539613": "zenit",
            "539850": "zenit",
            "539898": "zenit",
            "541778": "zenit",
            "543236": "zenit",
            "543301": "zenit",
            "544025": "zenit",
            "544852": "zenit",
            "545896": "zenit",
            "545929": "zenit",
            "548767": "zenit",
            "549411": "zenit",
            "549413": "zenit",
            "549882": "zenit",
            "549888": "zenit",
            "554780": "zenit",
            "557029": "zenit",
            "557030": "zenit",
            "557944": "zenit",
            "557960": "zenit",
            "558696": "zenit"
        };
    }, {}], 62: [function (require, module, exports) {
        var binMap = require('./binMap.json');
        module.exports = binMap;
    }, { "./binMap.json": 61 }], 63: [function (require, module, exports) {
        'use strict';

        var bankUtils = {};
        var binMap = require('./binMap');

        /**
         * Функция возвращает название банка по БИНу:
         * @param {String} bin БИН карты (первые 6 цифр)
         * @returns {String}
         */
        bankUtils.getBankName = function (bin) {
            return binMap[bin];
        };

        /**
         * Типы банковскиx карт
         * @type {Object}
         */
        bankUtils.cardTypes = {
            VISA: 'visa',
            MAESTRO: 'maestro',
            MASTERCARD: 'mastercard',
            MIR: 'mir',
            AMEX: 'americanexpress',
            DC: 'dinnersclub',
            JCB: 'jcb',
            UP: 'unionpay'
        };

        /**
         * Проверяет тип карты
         * @param {String} val номер карты
         * @returns {String} тип карты
         */
        bankUtils.getCardType = function (val) {
            // Бины ПС МИР 220000 - 220499
            var mirBin = /^220[0-4]\s?\d\d/;

            var firstNum = val[0];

            switch (firstNum) {
                case '2':
                    {
                        if (mirBin.test(val)) {
                            return bankUtils.cardTypes.MIR;
                        } else {
                            return '';
                        }
                    }
                case '3':
                    {
                        var secondNum = val[1] || '';

                        if (secondNum === '7') {
                            return bankUtils.cardTypes.AMEX;
                        } else if (secondNum === '5') {
                            return bankUtils.cardTypes.JCB;
                        } else if (secondNum) {
                            return bankUtils.cardTypes.DC;
                        } else {
                            return '';
                        }
                    }
                case '4':
                    {
                        return bankUtils.cardTypes.VISA;
                    }
                case '5':
                    {
                        var _secondNum = val[1] || '';

                        if (_secondNum === '0' || _secondNum > '5') {
                            return bankUtils.cardTypes.MAESTRO;
                        } else {
                            return bankUtils.cardTypes.MASTERCARD;
                        }
                    }
                case '6':
                    {
                        var _secondNum2 = val[1] || '';

                        if (_secondNum2 === '2') {
                            return bankUtils.cardTypes.UP;
                        } else {
                            return bankUtils.cardTypes.MAESTRO;
                        }
                    }
                case '8':
                    {
                        return bankUtils.cardTypes.UP;
                    }
                case '9':
                    {
                        return bankUtils.cardTypes.MIR;
                    }
                default:
                    {
                        return '';
                    }
            }
        };

        /**
         * Форматирует номер карты, используя заданный разделитель
         *
         * @param {String} cardNumber номер карты
         * @param {String} delimeter = '\u00A0' разделитель
         * @returns {string} форматированный номер карты
         */
        bankUtils.formatCardNumber = function (cardNumber, delimeter) {
            var formattedCardNumber = [];
            delimeter = delimeter || "\xA0";

            if (cardNumber) {
                while (cardNumber && typeof cardNumber === 'string') {
                    formattedCardNumber.push(cardNumber.substr(0, 4));
                    cardNumber = cardNumber.substr(4);
                    if (cardNumber) {
                        formattedCardNumber.push(delimeter);
                    }
                }
            }
            return formattedCardNumber.join('');
        };

        module.exports = bankUtils;
    }, { "./binMap": 62 }], 64: [function (require, module, exports) {
        var _this = this;

        var envType = {
            isClient: function isClient() {
                return (typeof document === "undefined" ? "undefined" : babelHelpers.typeof(document)) === 'object';
            },
            isNode: function isNode() {
                return !_this.isClient();
            }
        };

        if ((typeof module === "undefined" ? "undefined" : babelHelpers.typeof(module)) === 'object') {
            module.exports = envType;
        }
    }, {}], 65: [function (require, module, exports) {
        "use strict";

        var common = require('./common');

        module.exports = common;
    }, { "./common": 66 }], 66: [function (require, module, exports) {
        'use strict';

        function _typeof(obj) {
            "@babel/helpers - typeof";
            if (typeof Symbol === "function" && babelHelpers.typeof(Symbol.iterator) === "symbol") {
                _typeof = function _typeof(obj) {
                    return typeof obj === "undefined" ? "undefined" : babelHelpers.typeof(obj);
                };
            } else {
                _typeof = function _typeof(obj) {
                    return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj === "undefined" ? "undefined" : babelHelpers.typeof(obj);
                };
            }return _typeof(obj);
        }

        var defaults = require('lodash/defaults');

        var url = {};
        /**
         * Получение полного адреса из атрибутов.
         * Склеивает все аргументы и нормализует получившийся URL.
         *
         * @returns {String}
         */

        url.join = function () {
            var joined = [].slice.call(arguments, 0).join('/');
            return joined // Заменяем в строке несколько идущих подряд '/' на один '/'
            // eslint-disable-next-line no-useless-escape
            .replace(/[\/]+/g, '/') // После чего заменяем ':/' на '://'
            // eslint-disable-next-line no-useless-escape
            .replace(/\:\//g, '://');
        };
        /**
         * Метод форматирует объект со свойствами URL в строку.
         * Код взят из модуля URL http://nodejs.org/api/url.html#url_url_format_urlobj
         * Единственное отличие - использование метода преобразования query-параметров в строку заменено на url.serializeParams
         *
         * @param {Object} [options] параметры команды
         * @param {String} [options.protocol] Протокол
         * @param {String} [options.hostname] Хост (без порта)
         * @param {String} [options.host] Хост и порт
         * @param {String|Number} [options.port] Порт
         * @param {String} [options.pathname] Строка пути (относительно хоста)
         * @param {String} [options.search] Часть адреса после символа "?", включая символ "?"
         * @param {Object} [options.query] Часть адреса после символа "?", не включая символ "?"
         * @param {String} [options.hash] Часть URL, которая идет после символа решетки '#', включая символ '#'.
         * @returns {String}
         *
         * @see http://nodejs.org/api/url.html#url_url_format_urlobj
         *
         * @example
         * u.format({
         *		protocol: 'https',
         *		hostname: 'byakko.yandex.ru',
         *		pathname: '/my/questionnaire/partTest',
         *		query: {
         *			param1: 1
         *		},
         *		port: 8000
         *	})
         *	// http://byakko.yandex.ru:8000/my/questionnaire/partTest?param1=1
         */

        url.format = function (options) {
            var auth = options.auth || '';

            if (auth) {
                auth = encodeURIComponent(auth);
                auth = auth.replace(/%3A/i, ':');
                auth += '@';
            }

            var protocol = options.protocol || '';
            var pathname = options.pathname || '';
            var hash = options.hash || '';
            var host = false;
            var query = '';

            if (options.host) {
                host = auth + options.host;
            } else if (options.hostname) {
                host = auth + (options.hostname.indexOf(':') === -1 ? options.hostname : "[".concat(options.hostname, "]"));

                if (options.port) {
                    host += ":".concat(options.port);
                }
            }

            if (options.query && _typeof(options.query) === 'object' && Object.keys(options.query).length) {
                query = url.serializeParams(options.query);
            }

            var search = options.search || query && "?".concat(query) || '';

            if (protocol && protocol.substr(-1) !== ':') {
                protocol += ':';
            } // only the slashedProtocols get the //.  Not mailto:, xmpp:, etc.
            // unless they had them to begin with.


            if (options.slashes || protocol && host !== false) {
                host = "//".concat(host || '');

                if (pathname && pathname.charAt(0) !== '/') {
                    pathname = "/".concat(pathname);
                }
            } else if (!host) {
                host = '';
            }

            if (hash && hash.charAt(0) !== '#') {
                hash = "#".concat(hash);
            }

            if (search && search.charAt(0) !== '?') {
                search = "?".concat(search);
            }

            pathname = pathname.replace(/[?#]/g, function (match) {
                return encodeURIComponent(match);
            });
            search = search.replace('#', '%23');
            return protocol + host + pathname + search + hash;
        };
        /**
         * Сериализация свойств объекта в http query string
         *
         * @param {Object} params Объект с параметрами
         * @param {Object} [options] опции вызова
         * @param {Boolean} [options.allowEmpty=true] Флаг, нужно ли включать пустые параметры. По умолчанию включен.
         *
         * @returns {String}
         */

        url.serializeParams = require('./functions/serializeParams');
        /**
         * Возвращает указанный uri с подклеенными к нему сериализованными параметрами
         * в отличие от xscript-версии нет сворачивания параметров в storeRequest
         *
         * @param {String} uri Адрес, к которому добавляются параметры.
         * @param {Object} [params] Параметры для добавления к адресу.
         * @param {Object} [options] Дополнительные настройки обработки параметров.
         * @param {Boolean} [options.allowEmpty=true] Флаг, нужно ли включать пустые параметры. По умолчанию включен.
         * @param {String} [options.anchor=''] Установка якоря для ссылки.
         *
         * @returns {String} Адрес с параметрами
         */

        url.serializeWithParams = function (uri, params, options) {
            params = params || {};
            options = options || {};
            options = defaults(options, {
                allowEmpty: true
            });
            var separator = ''; // Поддержка якоря в исходной ссылке

            var anchor = '';
            var parts = uri.split('#'); // Если якорь есть, выделяем его из исходной строки

            if (parts[1]) {
                uri = parts[0];
                anchor = "#".concat(parts[1]);
            } // Если якорь задан в options, указываем его


            if (options.anchor) {
                anchor = "#".concat(options.anchor);
            } // Подготавливаем параметры для ссылки


            params = url.serializeParams(params, {
                allowEmpty: options.allowEmpty
            }); // Если параметры указаны, подготавливаем разделитель (ссылка уже может содержать параметры)

            if (params) {
                // eslint-disable-next-line no-negated-condition
                separator = uri.indexOf('?') !== -1 ? '&' : '?';
            }

            return uri + separator + params + anchor;
        };
        /**
         * (QWEB-14541) Подставляем https вместо http в переданных урлах.
         * Используется на клиенте (form_id_office-techIntegration.js)
         *
         * @param {String} url url, который требует проверки
         * @returns {String}
         */

        url.getHttps = function (url) {
            return url.replace(/^http:\/\//i, 'https://');
        };
        /**
         * Возвращает результат определения, является указанный url абсолютным, или нет
         *
         * @param {String} url - Проверяемый url
         * @returns {Boolean}
         */

        url.isAbsolute = function (url) {
            return url && (url.indexOf('http://') === 0 || url.indexOf('https://') === 0 || url.indexOf('//') === 0 || url.indexOf('mailto:') === 0) || false;
        };

        module.exports = url;
    }, { "./functions/serializeParams": 67, "lodash/defaults": 43 }], 67: [function (require, module, exports) {
        'use strict';

        var defaults = require('lodash/defaults');

        var forEach = require('lodash/forEach');
        /**
         * Сериализация свойств объекта в http query string
         *
         * @param {Object} params Объект с параметрами
         * @param {Object} [options] опции вызова
         * @param {Boolean} [options.allowEmpty=true] Флаг, нужно ли включать пустые параметры. По умолчанию включен.
         *
         * @returns {String}
         */

        var serializeParams = function serializeParams(params, options) {
            var queryStringArray = [];
            options = options || {};
            options = defaults(options, {
                allowEmpty: true
            });
            forEach(params, function (val, p) {
                val = typeof val === 'undefined' ? '' : val; // eslint-disable-next-line eqeqeq

                if (options.allowEmpty || val != '' || val === 0) {
                    queryStringArray.push("".concat(encodeURIComponent(p), "=").concat(encodeURIComponent(val)));
                }
            });
            return queryStringArray.join('&');
        };

        module.exports = serializeParams;
    }, { "lodash/defaults": 43, "lodash/forEach": 45 }], 68: [function (require, module, exports) {
        'use strict';

        var utils = require('./common');
        var _ = window._;

        var keysMap = {
            'space': 32,
            'enter': 13,
            'left': 37,
            'up': 38,
            'right': 39,
            'down': 40,
            'tab': 9
        };

        /**
         * Создание функции логирования
         *
         * @param {String} level Уровень отладки
         *
         * @returns {Function}
         */
        var logger = function logger(level) {
            return function (msg, meta) {
                console[level](msg, meta);
            };
        };

        /**
         * Проверка кода клавиши, по нажатию на которую произошло событие
         *
         * @param {Event} e Jquery Event Object
         * @param {String[]} keys Массив клавиш
         * @returns {Boolean}
         */
        utils.checkKey = function (e, keys) {
            return _.some(keys, function (val) {
                return e.which === keysMap[val];
            });
        };

        /**
         * Возвращает код клавиши
         *
         * @param {String} key Название клавиши
         * @returns {Number}
         */
        utils.getKey = function (key) {
            return keysMap[key];
        };

        /**
         * Проверяет, не нажаты ли клавиши-модификаторы
         *
         * @param {Event} e Jquery Event Object
         * @returns {Boolean}
         */
        utils.isModifyerKey = function (e) {
            return e.shiftKey || e.ctrlKey || e.altKey || e.metaKey;
        };

        /**
         * Возвращает случайный индекс в заданном дискретном распределении
         *
         * @param {Number[]} distr Дискретное распределение. Вероятность задается в процентах.
         * @returns {Number|Null}
         * @example
         * var index = utils.distributedIndex([80, 10, 10]);
         * // index - случайное число 0..2 с распределением:
         * // 0 - 80%
         * // 1 - 10%
         * // 2 - 10%
         */
        utils.distributedIndex = function (distr) {
            return require('./functions/distributedIndex')(distr, logger('warn'));
        };

        /**
         * Экспортируем moment в браузер, так как он все равно раскроется по зависимостям этого модуля после browserify,
         * поэтому его же будем использовать на клиенте.
         */
        utils.moment = require('moment');

        module.exports = utils;
    }, { "./common": 69, "./functions/distributedIndex": 71, "moment": 59 }], 69: [function (require, module, exports) {
        'use strict';

        var _ = window._;
        var moment = require('moment');
        var utils = {};

        /**
         * Возвращает значение поля объекта или undefined, если поле не найдено
         *
         * @example
         *
         * var ref = require('yandex-money-utils').ref;
         *
         * var obj = { a: { b: { c: 3 } } } ;
         * ref(obj, 'a.b.c') === 3; // true
         * typeof ref(obj, 'a.b.d.e'); === 'undefined'; // true
         *
         * @param {object} obj Объект.
         * @param {string} path Путь до нужного поля объекта.
         * @returns {any} Возвращает значение поля или undefined, если поле не найдено.
         */
        utils.ref = require('./functions/ref');

        /**
         * Устанавливает значение поля объекта, создавая промежуточные свойства, если их нет
         *
         * @param {object} obj Объект
         * @param {string} path Путь до нужного поля объекта
         * @param {string} value Устанавливаемое значение
         *
         * @returns {object}
         *
         * @example
         *
         * var setRef = require('yandex-money-utils').setRef;
         *
         * var obj = { p: 1 } ;
         * setRef(obj, 'a.b.c', 3);
         * obj.a.b.c === 3; // true
         */
        utils.setRef = require('./functions/setRef');

        /**
         * Создает новый объект без "пустых" значений. "Пустыми" значениями являются false, NULL, 0, "", undefined и NaN.
         * Аналог метода lo-dash _.compact для работы с  массивами.
         * @see https://lodash.com/docs#compact
         *
         * @param {Object} obj Исходный объект
         * @returns {Object}
         * @example
         * var newObj = utils.compactObject({
         *		foo: 'bar',
         *		a: 0,
         *		b: false,
         *		c: '',
         *		d: null,
         *		e: undefined,
         *		f: NaN
         *	}
         *  console.log(newObj);
         * // {foo: 'bar'}
         *
         */
        utils.compactObject = require('./functions/compactObject');

        /**
         * Объект с регистронезависимыми методами для работы с ключами
         *
         * @example
         *
         * var createICase = require('yandex-money-utils').createICase;
         * var params = createICase();
         * params.set('sum', 10);
         * params.get('sUm'); // 10
         * params.key('sUm'); // 'sum'
         *
         */
        utils.methodsICase = {
            /**
             * Поиск ключа в текущем объекте
             *
             * @param {String} key Имя ключа
             *
             * @returns {String}
             */
            key: function key(_key2) {
                var _all = this._all;
                return utils.ikey(_all, _key2);
            },

            /**
             * Получение значения из текущего объекта
             *
             * @param {String} key Имя ключа
             *
             * @returns {Any}
             */
            get: function get(key) {
                if (_.isEmpty(key)) {
                    return false;
                }
                var _all = this._all;
                var k = utils.ikey(_all, key);
                return _all[k];
            },

            /**
             * Запись значения в текущий объект
             *
             * @param {String} key Имя ключа
             * @param {Any} value Значение
             * @returns {Object} Текущий icase объект
             */
            set: function set(key, value) {
                var _all = this._all;
                var k = utils.ikey(_all, key);
                _all[k] = value;
                return this;
            },

            /**
             * Удаление ключа из текущего объекта
             *
             * @param {String} key Имя ключа
             *
             * @returns {Boolean} Успешность удаления
             */
            del: function del(key) {
                var _all = this._all;
                var k = utils.ikey(_all, key);
                delete _all[k];
                return this;
            },

            /**
             * Плоское слияние объекта (js или icase) с текущим icase объектом. Поддерживает chaining.
             *
             * Приоритет у параметров из source.
             *
             * @param {Object} source Объект-источник. Может быть обычным объектом js или icase объектом
             *
             * @returns {Object} Текущий icase объект
             */
            merge: function merge(source) {
                // Поддержка слияния из icase объектов
                if (source && _.isFunction(source.all)) {
                    source = source.all();
                }
                var _all = this._all;
                utils.imerge(_all, source);
                return this;
            },

            /**
             * Плоское слияние объекта (js или icase) с текущим icase объектом. Поддерживает chaining.
             *
             * Приоритет у текущих параметров.
             *
             * @param {Object} source Объект-источник. Может быть обычным объектом js или icase объектом
             *
             * @returns {Object} Текущий icase объект
             */
            defaults: function defaults(source) {
                // Поддержка слияния из icase объектов
                if (source && _.isFunction(source.all)) {
                    source = source.all();
                }
                var _all = this._all;
                utils.imerge(_all, source, false);
                return this;
            },

            /**
             * Возврат объекта с ключами текущего объекта
             *
             * @returns {Object} Объект с ключами текущего объекта
             */
            all: function all() {
                var _all = this._all;
                return _all;
            },

            /**
             * Вырезание ключей из icase объекта. Ключи проверяются регистронезависимо. Возвращается icase объект с вырезанными
             * ключами.
             *
             * @param {Array} [keys=[]] Массив с ключами для вырезания из icase объекта. Если не задан, ключи не вырезаются.
             *
             * @returns {Object} Новый icase объект, содержащий набор вырезанных ключей. Набор может быть пустым, если ключи не
             * заданы или не найдены.
             */
            cut: function cut(keys) {
                var _this2 = this;

                var res = utils.createICase();
                if (!_.isArray(keys)) {
                    return res;
                }
                _.each(keys, function (key) {
                    var _all = _this2._all;
                    var ikey = _this2.key(key);
                    var value = _all[ikey];
                    if (typeof value !== 'undefined') {
                        res.set(ikey, value);
                    }
                    delete _all[ikey];
                });
                return res;
            },

            /**
             * Копирование ключей из icase объекта. Ключи проверяются регистронезависимо. Возвращается icase объект со
             * скопированными ключами.
             *
             * @param {Array} [keys=[]] Массив с ключами для копирования из icase объекта. Если не задан, копируются все ключи.
             *
             * @returns {Object} Новый icase объект, содержащий набор скопированных ключей.
             */
            copy: function copy(keys) {
                var _this3 = this;

                var _all = this._all;
                var res = utils.createICase();
                if (!_.isArray(keys)) {
                    res._all = _.clone(_all);
                    return res;
                }
                _.each(keys, function (key) {
                    var ikey = _this3.key(key);
                    var value = _all[ikey];
                    if (typeof value !== 'undefined') {
                        res.set(ikey, value);
                    }
                });
                return res;
            },

            /**
             * Сжатие объекта через удаление всех ключей с falsey значениями - null, 0, "", false, undefined, NaN. Аналог lodash
             * compact().
             *
             * @returns {Object} Текущий icase объект
             */
            compact: function compact() {
                this._all = utils.compactObject(this._all);
                return this;
            },

            /**
             * Переименование ключей по заданным правилам
             *
             * @param {Object} rules Объект с правилами переименования ключей, где свойства объекта задают исходные имена, а
             *		значения - конечные имена.
             * @returns {Object}
             */
            rename: function rename(rules) {
                var _this4 = this;

                _.each(rules, function (targetName, sourceName) {
                    var val = _this4.get(sourceName);
                    // Если нет источника, не делаем переименование
                    if (_.isUndefined(val)) {
                        return;
                    }
                    // Сначала удаляем старый ключ
                    _this4.del(sourceName);
                    _this4.set(targetName, val);
                });

                return this;
            },

            /**
             * Возврат нового icase объекта с плоской копией текущего icase объекта
             *
             * @returns {Object} Новый icase объект
             */
            clone: function clone() {
                return utils.createICase(_.clone(this.all()));
            },

            /**
             * Возврат нового icase объекта, полученного вычитанием из текущего icase объекта заданных ключей.
             *
             * @param {Array} [keys=[]] Массив с ключами для вырезания из icase объекта. Если не задан, ключи не вырезаются.
             *
             * @returns {Object} Новый icase объект
             */
            diff: function diff(keys) {
                var clone = this.clone();
                if (!_.isArray(keys)) {
                    return clone;
                }
                _.each(keys, function (key) {
                    clone.del(key);
                });
                return clone;
            },


            /**
             * Сериализация ключей в querystring
             *
             * @returns {String}
             */
            serialize: function serialize() {
                var url = require('yandex-money-url');
                return url.serializeParams(this.all());
            },


            /**
             * Сериализация адреса и ключей в querystring
             *
             * @param {String} [_url] Адрес для добавления к нему параметров
             *
             * @returns {String}
             */
            serializeWithUrl: function serializeWithUrl(_url) {
                var url = require('yandex-money-url');
                return url.serializeWithParams(_url, this.all());
            },


            /**
             * Очистка icase объекта.
             *
             * @returns {Object}
             */
            clear: function clear() {
                this._all = {};
                return this;
            }
        };

        /**
         * Создание объекта с привязанными методами для регистронезависимой работы с ключами. Ключи хранятся в свойстве _all.
         *
         * @param {Object} [keys={}] Набор ключей для заполнения объекта, по умолчанию пустой набор.
         *
         * @returns {Object}
         */
        utils.createICase = function (keys) {
            keys = keys || {};
            var objectICase = _.create(utils.methodsICase, {
                _all: keys
            });
            return objectICase;
        };

        /**
         * Преобразование строки в число.
         * Допустимыми разделителями разрядов считаются "." и ",". Также допусакется в начале минус.
         *
         * @param {string} str Строка для преобразования в число
         * @param {number} [defaultNum] Значение по умолчанию, если str преобразовался в NaN
         * @returns {number} Число или NaN
         */
        utils.toNum = require('./functions/toNum');

        /**
         * Преобразует строку с датой в формате ISO-8601 в человеко-удобный формат (ДД.ММ.ГГГГ)
         *
         * @param {String} isoDate Строка с датой в формате ISO-8601
         * @param {String} [format='DD.MM.YYYY'] Строка с форматом для преобразования, поддерживаемая библиотекой moment.js.
         *
         * @returns {String}
         */
        utils.convertDateFromIso = function (isoDate, format) {
            if (!isoDate) {
                return '';
            }

            var momentData = moment(isoDate, moment.ISO_8601);
            format = format || 'DD.MM.YYYY';

            if (momentData.isValid()) {
                return momentData.format(format);
            } else {
                return '';
            }
        };

        /**
         * Преобразует строку с датой в формате ISO-8601 в человеко-удобный формат времени (hh:mm)
         *
         * @see http://momentjs.com/
         * @param {String} isoDate Строка с датой в формате ISO-8601
         * @param {String} [format='HH:mm'] Строка с форматом для преобразования, поддерживаемая библиотекой moment.js.
         *
         * @returns {String}
         */
        utils.convertTimeFromIso = function (isoDate, format) {
            if (!isoDate) {
                return '';
            }

            var momentData = moment(isoDate, moment.ISO_8601);
            format = format || 'HH:mm';

            if (momentData.isValid()) {
                return momentData.format(format);
            } else {
                return '';
            }
        };

        /**
         * Проверяет, что дата начала временного интервала меньше даты конца.
         *
         * @see http://momentjs.com/docs/#/get-set/max/
         * @param {String|Date} startDate Дата начала временного интервала
         * @param {String|Date} endDate Дата конца временного интервала
         *
         * @returns {Boolean}
         */
        utils.checkDateInterval = function (startDate, endDate) {
            startDate instanceof Date ? startDate = moment(startDate) : startDate = moment(startDate, 'DD-MM-YYYY');
            endDate instanceof Date ? endDate = moment(endDate) : endDate = moment(endDate, 'DD-MM-YYYY');
            endDate.endOf('day');

            return endDate === moment.max(startDate, endDate);
        };

        /**
         * Проверяет дату на валидность
         *
         * @see http://momentjs.com/docs/
         * @param {String} date Дата начала временного интервала
         * @param {String} format Формат даты для moment.js
         *
         * @returns {Boolean}
         */
        utils.dateIsValid = function (date, format) {
            date = moment(date, format);

            return date.isValid();
        };

        /**
         * Быстрое получение нужных дат для установки времени жизни куки.
         * @type {object}
         */
        utils.cookieExpires = {

            /**
             * Разница в миллисекундах между текущей или переданной датой и этим днем через год.
             * Использовать в качестве maxAge
             * @param {Date} [date] Если дата не задана, то будет использована текущая дата.
             * @returns {number}
             */
            afterYear: function afterYear(date) {
                var currentDate = date || new Date();
                var expiryDate = new Date().setFullYear(currentDate.getFullYear() + 1);
                return expiryDate - currentDate;
            }
        };

        /**
         * Проверка номер банковской карты по алгоритму Луна.
         * Пробельные символы при проверке не учитываются.
         *
         * @see http://ru.wikipedia.org/wiki/%D0%90%D0%BB%D0%B3%D0%BE%D1%80%D0%B8%D1%82%D0%BC_%D0%9B%D1%83%D0%BD%D0%B0
         * @param {String} cardNumber Номер банковской карты.
         * @returns {Boolean}
         * @example
         * ym.textUtils.checkCardNumber('1111 1111 1111 1111'); // false
         * ym.textUtils.checkCardNumber('4454 3580 3158 1395'); // true
         */
        utils.checkCardNumber = function (cardNumber) {
            var isNumberCorrect = false;
            var minLength = 12;
            var maxLength = 19;

            // Номер карты должен быть необходимой длины.
            if (cardNumber && cardNumber.length >= minLength && cardNumber.length <= maxLength) {
                isNumberCorrect = utils.luhnCheck(cardNumber);
            }

            return isNumberCorrect;
        };

        /**
         * Выполняет проверку строки по алгоритму Луна.
         * Пробельные символы при проверке не учитываются.
         * @see http://ru.wikipedia.org/wiki/%D0%90%D0%BB%D0%B3%D0%BE%D1%80%D0%B8%D1%82%D0%BC_%D0%9B%D1%83%D0%BD%D0%B0
         *
         * @param {String} strForCheck Строка для проверки
         * @returns {Boolean}
         */
        utils.luhnCheck = function (strForCheck) {
            if (!strForCheck) {
                return false;
            }

            var sum = 0;
            var digit = void 0;
            var digitNumber = void 0;
            var checkNumberStr = '';

            // Приводим к строке и оставляем только цифры.
            checkNumberStr = strForCheck.toString().replace(/\D/g, '');
            for (var l = checkNumberStr.length, i = l - 1; i >= 0; i--) {
                digitNumber = l - i;
                digit = utils.toNum(checkNumberStr.substr(i, 1));
                if (!(digitNumber % 2)) {
                    digit = digit < 5 ? digit * 2 : digit * 2 - 9;
                }
                sum += digit;
            }
            return sum % 10 === 0;
        };

        /**
         * Функция удаляет все теги в строке
         * @param	{String}	htmlString	строка для обработки
         * @returns	{String}				строка без тегов
         */
        utils.removeAllTags = function (htmlString) {
            return htmlString.replace(/<.*?>/g, '').replace(/<[a-zA-Z]+/g, '').replace(/&lt;/ig, '').replace('&#60;', '');
        };

        /*
         * Траслитирация имени на карте в соотвествии с правилами УФМС
         * http://www.ufms.spb.ru/desc/pravila-transliteracii-dind-1009.html
         * @param {string} string
         * @returns {string}
         */
        utils.transliterateCardHolderName = require('./functions/transliterateCardHolderName');

        /**
         *
         */
        utils.doMatchPattern = require('./functions/do-match-pattern');

        /**
         * Округляет число с плавающей точкой
         * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/round
         *
         * @param {Number} num число, которо нужно округлить
         * @param {Number} [decimalPartLength = 2] длинна дробной части
         *
         * @returns {Number}
         */
        utils.decimalRound = function (num, decimalPartLength) {
            num = utils.toNum(num);
            var result = num;
            if (num) {
                decimalPartLength = _.isUndefined(decimalPartLength) ? 2 : decimalPartLength;
                var plusExp = "e+" + decimalPartLength;
                var minusExp = "e-" + decimalPartLength;
                result = Number(Math.round(num + plusExp) + minusExp);
            }
            return result;
        };

        /**
         * Поиск ключа в объекте независимо от регистра. Если в объекте нет такого ключа, возвращается ключ без изменений.
         *
         * @param {Object} obj Объект
         * @param {String} key Имя ключа
         *
         * @returns {String}
         */
        utils.ikey = function (obj, key) {
            obj = obj || {};

            // Если ключ существует без изменения регистра, сразу возвращаем его без перебора объекта
            if (_.has(obj, key)) {
                return key;
            }

            var ikey = key.toLowerCase();
            // Ищем совпадение ключей в объекте
            var found = _.findKey(obj, function (_obj, _key) {
                return _key.toLowerCase() === ikey;
            });

            return found || key;
        };

        /**
         * Плоское слияние объектов независимо от регистра ключей. В качестве значений ключей поддерживаются только простые типы
         * и массивы. Ключи структурных типов игнорируются.
         *
         * @param {Object} target Объект-получатель
         * @param {Object} [source] Объект-источник, по умолчанию пустой
         * @param {Boolean} [merge] Флаг поведения при слиянии, по умолчанию true, используется поведение merge (затирание
         *		параметров target из source). При merge=false используется поведение defaults (параметры target не затираются из
         *		source).
         *
         * @returns {Object} Объект-получатель
         */
        utils.imerge = function (target, source, merge) {
            if (_.isUndefined(merge)) {
                merge = true;
            }
            source = source || {};
            var ikey = void 0;

            _.each(source, function (_value, _key) {
                if (!_key) {
                    return;
                }
                ikey = utils.ikey(target, _key);
                // vyt: @todo: написать тесты
                // Поддерживаем значение из массива (берём последнее)
                if (_.isArray(_value)) {
                    target[ikey] = _.last(_value);
                    // Из других структур значения не поддерживаем
                } else if (_.isObject(_value)) {
                    return;
                    // Поддерживаем значения из простых типов
                } else if (merge) {
                    target[ikey] = _value;
                } else {
                    _.has(target, ikey) || (target[ikey] = _value);
                }
            });

            return target;
        };

        /**
         * Трансформация строки их HEX-формата в формат RGB.
         * Компоненты результирующей строки разделены запятыми.
         *
         * @param {String} hex Исходная HEX-строка
         * @returns {Strig} RGB-строка
         */
        utils.hexToRgb = function (hex) {
            var buffer = new ArrayBuffer(4);
            var dataView = new DataView(buffer);
            var hexValue = Number.parseInt(hex.slice(1), 16);

            dataView.setUint32(0, hexValue);

            return [1, 2, 3].map(function (offset) {
                return dataView.getUint8(offset);
            }).join(',');
        };

        /**
         * Оборачиваем контент кавычками, которые подходят для текущего языка пользователя
         *
         * @param {String} content Контент, который нужно обернуть кавычками.
         * @param {String} [lang] Язык, кавычки для которого нужно использовать.
         * @returns {String} Контент с кавычками.
         */
        utils.setLocalizedQuotes = require('./functions/setLocalizedQuotes');

        /**
         * Формирует название цели для любого шага процесса платежа.
         * Правила, по которым формируется название цели
         * https://wiki.yamoney.ru/display/WebPortal/Documentation.Portal.MakeUp.CPS.Metrika
         *
         * @param {Object} params Объект с данными для построения цели.
         * @param {Boolean} [params.isDev] Признак вызова с dev-среды. Будет дописывать 'dev'
         * @param {string} [params.env] Окружение.
         * @param {string} params.paymentType Тип платежа.
         * @param {string} params.step Название текущего шага.
         * @param {string} [params.subStep] Название подшага.
         * @param {number | string} params.scid Scid витрины.
         * @param {string} [params.delimiter = '_'] Разделитель параметров в имени цели.
         *
         * @returns {string} Название цели.
         */
        utils.getPaymentStepGoalName = require('./functions/getPaymentStepGoalName');

        /**
         * Возвращает псевдо случайную строку заданной длинны
         *
         * @param {string} length длинна строки
         *
         * @returns {string}
         */
        utils.getRandomString = require('./functions/getRandomString');

        module.exports = utils;
    }, { "./functions/compactObject": 70, "./functions/do-match-pattern": 72, "./functions/getPaymentStepGoalName": 73, "./functions/getRandomString": 74, "./functions/ref": 75, "./functions/setLocalizedQuotes": 76, "./functions/setRef": 77, "./functions/toNum": 78, "./functions/transliterateCardHolderName": 79, "moment": 59, "yandex-money-url": 65 }], 70: [function (require, module, exports) {
        'use strict';

        var _ = window._;
        /**
         * Создает новый объект без "пустых" значений. "Пустыми" значениями являются false, NULL, 0, "", undefined и NaN.
         * Аналог метода lo-dash _.compact для работы с  массивами.
         * @see https://lodash.com/docs#compact
         *
         * @param {Object} obj Исходный объект
         * @returns {Object}
         * @example
         * var newObj = utils.compactObject({
         *		foo: 'bar',
         *		a: 0,
         *		b: false,
         *		c: '',
         *		d: null,
         *		e: undefined,
         *		f: NaN
         *	}
         *  console.log(newObj);
         * // {foo: 'bar'}
         *
         */
        var compactObject = function compactObject(obj) {
            var result = {};
            _.each(obj, function (value, key) {
                if (value) {
                    result[key] = value;
                }
            });
            return result;
        };

        module.exports = compactObject;
    }, {}], 71: [function (require, module, exports) {
        'use strict';

        var _ = window._;

        /**
         * Возвращает случайный индекс в заданном дискретном распределении
         *
         * @param {Number[]} distr Дискретное распределение. Вероятность задается в процентах.
         * @param {Function} log Функция логирования
         * @returns {Number|Null}
         * @example
         * var index = utils.distributedIndex([80, 10, 10]);
         * // index - случайное число 0..2 с распределением:
         * // 0 - 80%
         * // 1 - 10%
         * // 2 - 10%
         */
        function distributedIndex(distr, log) {
            var randomValue = Math.floor(Math.random() * 100);
            var probSum = 0;
            var distrNorm = _.reduce(distr, function (distrNorm, prob) {
                probSum += prob;
                return distrNorm.push(probSum) && distrNorm;
            }, []);

            if (probSum < 100 && _.last(distr) === 0) {
                distrNorm.pop();
                distrNorm.push(probSum = 100);
            }

            if (probSum !== 100) {
                log('Probability sum should equal 100%');
                return null;
            }

            return _.findIndex(distrNorm, function (prob) {
                return prob > randomValue;
            });
        }

        module.exports = distributedIndex;
    }, {}], 72: [function (require, module, exports) {
        'use strict';

        var _ = window._;

        /**
         * Проверяет наличие строки в массиве строк или regexp-ов
         *
         * @param {String} str Строка для сверки
         * @param {String[]|RegExp[]} patterns Шаблоны проверки (белый или черный список)
         * @returns {Boolean}
         */
        module.exports = function doMatchPattern(str, patterns) {
            if (!_.isString(str)) {
                return false;
            }

            if (!_.isArray(patterns)) {
                return false;
            }

            if (_.isEmpty(patterns)) {
                return false;
            }

            return _.some(patterns, function (pattern) {
                /* Проверяем по регекспу или используем строгое сравнение */
                return _.isRegExp(pattern) && pattern.test(str) || pattern === str;
            });
        };
    }, {}], 73: [function (require, module, exports) {
        'use strict';

        var _ = window._;

        /**
         * Формирует название цели для любого шага процесса платежа.
         * Правила, по которым формируется название цели
         * https://wiki.yamoney.ru/display/WebPortal/Documentation.Portal.MakeUp.CPS.Metrika
         *
         * @param {Object} params Объект с данными для построения цели.
         * @param {Object} params.metricsConfig конфигурация метрики
         * @param {String} [params.metricsConfig.paymentType] тип платежа
         * @param {String} params.metricsConfig.goalPrefix префикс для названия цели
         * @param {String} params.metricsConfig.goalSuffix суффикс для названия цели
         * @param {String[]} params.metricsConfig.onLoadGoals массив целей, которые должны быть вызваны при  загрузке страницы
         * @param {string} [params.event] название события.
         * @param {string} [params.delimiter = '_'] Разделитель параметров в имени цели.
         *
         * @returns {string} Название цели.
         */
        function getPaymentStepGoalName(params) {
            params = _.defaults(params, {
                delimiter: '_'
            });
            var goal = '';
            if (params.metricsConfig) {
                var goalName = [params.metricsConfig.goalPrefix];
                if (params.event) {
                    goalName.push(params.event);
                }
                goalName.push(params.metricsConfig.goalSuffix);
                goal = goalName.join(params.delimiter);
            }
            return goal;
        }

        module.exports = getPaymentStepGoalName;
    }, {}], 74: [function (require, module, exports) {
        'use strict';

        /**
         * Возвращает псевдо случайную строку
         *
         * @returns {String}
         */

        var getRandomString = function getRandomString() {
            var randomString = Math.random().toString(36);
            return randomString.substring(2, randomString.length);
        };

        /**
         * Возвращает псевдо случайную строку заданной длинны
         *
         * @param {Number} length длинна строки
         * @returns {String}
         */
        module.exports = function (length) {
            var randomStringLength = 0;
            var result = '';
            while (randomStringLength <= length) {
                var randomString = getRandomString();
                randomStringLength += randomString.length;
                result += randomString;
            }
            return result.substring(0, length);
        };
    }, {}], 75: [function (require, module, exports) {
        'use strict';

        /**
         * Возвращает значение поля объекта или undefined, если поле не найдено
         *
         * @example
         *
         * var ref = require('yandex-money-utils').ref;
         *
         * var obj = { a: { b: { c: 3 } } } ;
         * ref(obj, 'a.b.c') === 3; // true
         * typeof ref(obj, 'a.b.d.e'); === 'undefined'; // true
         *
         * @param {object} obj Объект.
         * @param {string} path Путь до нужного поля объекта.
         * @returns {any} Возвращает значение поля или undefined, если поле не найдено.
         */

        function ref(obj, path) {
            // Если целевой объект не задан, то path придёт первым вместо obj
            path = (typeof path === 'undefined' && typeof obj === 'string' ? obj : path) || '';
            obj = obj || {};
            return path.split('.').reduce(function (o, x) {
                return o ? o[x] : undefined;
            }, obj);
        }

        module.exports = ref;
    }, {}], 76: [function (require, module, exports) {
        'use strict';

        /**
         * Оборачиваем контент кавычками, которые подходят для текущего языка пользователя
         * Внимание! При правках не забываем, что у нас есть common-global.xsl localized-quotes
         *
         * @param {String} content Контент, который нужно обернуть кавычками.
         * @param {String} [lang] Язык, кавычки для которого нужно использовать.
         * @returns {String} Контент с кавычками.
         */

        function setLocalizedQuotes(content, lang) {
            if (!content) {
                return '';
            }
            lang = lang || 'ru';
            var result = void 0;

            switch (lang) {
                case 'en':
                    result = "\u2018" + content + "\u2018";
                    break;
                default:
                    result = "\xAB" + content + "\xBB";
                    break;
            }

            return result;
        }

        module.exports = setLocalizedQuotes;
    }, {}], 77: [function (require, module, exports) {
        'use strict';

        var _ = window._;

        /**
         * Устанавливает значение поля объекта, создавая промежуточные свойства, если их нет
         *
         * @param {object} obj Объект
         * @param {string} path Путь до нужного поля объекта
         * @param {string} value Устанавливаемое значение
         *
         * @returns {object}
         *
         * @example
         *
         * var setRef = require('yandex-money-utils').setRef;
         *
         * var obj = { p: 1 } ;
         * setRef(obj, 'a.b.c', 3);
         * obj.a.b.c === 3; // true
         */
        function setRef(obj, path, value) {
            obj = obj || {};

            _.reduce(path.split('.'), function (o, prop, ind, props) {
                // Последнему свойству присваиваем итоговое значение
                if (ind === props.length - 1) {
                    // eslint-disable-next-line no-return-assign
                    return o[prop] = value;
                }
                return _.isObject(o[prop]) ? o[prop] : o[prop] = {};
            }, obj);

            return obj;
        }

        module.exports = setRef;
    }, {}], 78: [function (require, module, exports) {
        'use strict';

        /**
         * Преобразование строки в число.
         * Допустимыми разделителями разрядов считаются "." и ",". Также допусакется в начале минус.
         *
         * @param {string} str Строка для преобразования в число
         * @param {number} [defaultNum] Значение по умолчанию, если str преобразовался в NaN
         * @returns {number} Число или NaN
         */

        function toNum(str, defaultNum) {
            // Код используется на клиенте тоже,
            // поэтому будем использовать базовые методы js

            // Значением по умолчанию может быть только число
            defaultNum = typeof defaultNum === 'number' ? defaultNum : NaN;
            // Если пришла не строка, сразу возвращаем число или дефолт
            if (typeof str !== 'string') {
                return typeof str === 'number' ? str : defaultNum;
            }
            // Перед проверкой на формат проверяем наличие хотя бы одной цифры в строке
            if (!str.match(/\d/)) {
                return defaultNum;
            }
            // Поддерживаемый формат
            var validNumRegExp = /^-?\d*(\.\d*)?$/;
            // Учитываем запятую.
            str = str.replace(',', '.');
            // Поддерживаем формат '10.' - эквивалент 10, но не '10..',
            // поэтому просто удалять последнюю запятую нельзя.
            if (str.indexOf('.') > -1) {
                str += '0';
            }
            // Поддерживаем только определенный формат.
            // Например, экспонициальная запись и плюс в начале не поддерживаются.
            if (!validNumRegExp.test(str)) {
                str = NaN;
            }
            // Один из самых строгих способов преобразования к числу
            str = str * 1;
            return isNaN(str) ? defaultNum : str;
        }

        module.exports = toNum;
    }, {}], 79: [function (require, module, exports) {
        'use strict';

        /**
         * Траслитирация имени на карте в соотвествии с правилами УФМС
         * http://www.ufms.spb.ru/desc/pravila-transliteracii-dind-1009.html
         * Добавлена поддержка частично транслитерированных имен, где некоторые буквы могут быть заменены кирилическими.
         *
         * @see https://jira.yamoney.ru/browse/CARDS-2 символ девиса "-" заменяем на пробел, т.к TSYS не разрешает использовать
         * этот символ для поля владельца карты (cardholder)
         *
         * @param {string} string строка для обработки
         * @returns {string}
         */

        function transliterateCardHolderName(string) {
            var fromTo = {
                'а': 'A',
                'б': 'B',
                'в': 'V',
                'г': 'G',
                'д': 'D',
                'е': 'E',
                'ё': 'E',
                'ж': 'ZH',
                'з': 'Z',
                'и': 'I',
                'й': 'I',
                'к': 'K',
                'л': 'L',
                'м': 'M',
                'н': 'N',
                'о': 'O',
                'п': 'P',
                'р': 'R',
                'с': 'S',
                'т': 'T',
                'у': 'U',
                'ф': 'F',
                'х': 'KH',
                'ц': 'TS',
                'ч': 'CH',
                'ш': 'SH',
                'щ': 'SHCH',
                'ы': 'Y',
                'ъ': 'IE',
                'э': 'E',
                'ю': 'IU',
                'я': 'IA',
                '-': ' ',
                ' ': ' ',
                'a': 'A',
                'b': 'B',
                'c': 'C',
                'd': 'D',
                'e': 'E',
                'f': 'F',
                'g': 'G',
                'h': 'H',
                'i': 'I',
                'j': 'J',
                'k': 'K',
                'l': 'L',
                'm': 'M',
                'n': 'N',
                'o': 'O',
                'p': 'P',
                'q': 'Q',
                'r': 'R',
                's': 'S',
                't': 'T',
                'u': 'U',
                'v': 'V',
                'w': 'W',
                'x': 'X',
                'y': 'Y',
                'z': 'Z'
            };

            var ret = '';

            for (var i = 0; i < string.length; i++) {
                var char = string.charAt(i).toLowerCase();
                if (char in fromTo) {
                    ret += fromTo[char];
                }
            }

            return ret;
        }

        module.exports = transliterateCardHolderName;
    }, {}], 80: [function (require, module, exports) {
        var Xev = require('./common');
        module.exports = new Xev();
    }, { "./common": 82 }], 81: [function (require, module, exports) {
        var _ = _ || window._;
        var utils = require('yandex-money-utils');

        /**
         * Объект с проверяющими функциями
         *
         * @type {Object}
         */
        var callbacks = {
            getBem: function getBem() {
                return BEM;
            },
            getBemHtml: function getBemHtml() {
                return BEMHTML;
            },
            getJquery: function getJquery() {
                return $;
            },

            /**
             * Проверка заполненности поля
             *
             * @param {Object} params Параметры проверки
             * @param {String} params.value Валидируемое значение
             * @param {String} params.label имя поля
             * @param {String} [params.message] Текст сообщения об ошибке заполнения поля
             *
             * @returns {Object} Объект с признаком успешной проверки и типом ошибки
             */
            ym_required: function ym_required(params) {
                var $ = callbacks.getJquery();
                var value = !_.isObject(params.value) ? $.trim(params.value) : '';
                var label = utils.setLocalizedQuotes(params.label);

                if (!value) {
                    return {
                        success: false,
                        error: 'empty',
                        message: params.message,
                        errorKeyId: 'xev-error-require',
                        errorKeyParams: {
                            label: label
                        }
                    };
                }
                return { success: true };
            },

            /**
             * Проверка типа ym_integer
             *
             * @param {Object} [params] Настройки проверки числа
             * @param {Number} [params.minLength=1] Минимальная длина числа
             * @param {Number} [params.maxLength=20] Максимальная длина числа
             * @param {String} [params.optional] Флаг необязательности поля. Default = false
             * @param {String} [params.message] Текст сообщения об ошибке заполнения поля
             * @param {RegExp} [params.banRegexp] Регулярное выражение для проверки запрещённых символов
             * @param {String} [params.banMessage] Текст сообщения при проверке запрещённых символов
             * @param {String} params.label имя поля
             *
             * @returns {Object} Результат проверки поля
             */

            ym_integer: function ym_integer(params) {
                var value = params.value;
                var label = utils.setLocalizedQuotes(params.label);

                // Готовим параметры с учётом значений по-умолчанию
                params = _.defaults(params, {
                    minLength: 1,
                    maxLength: 20
                });

                if (params.optional && value === '') {
                    return { success: true };
                }

                var numberValue = utils.toNum(value);
                // Если поле не пустое и либо не число, либо отрицательное число, сообщаем об этом
                if (value && (_.isNaN(numberValue) || numberValue < 0)) {
                    return {
                        success: false,
                        error: 'wrongFormat',
                        message: params.message,
                        errorKeyId: 'xev-error-wrongFormat',
                        errorKeyParams: {
                            label: label
                        }
                    };
                }
                if (params.banRegexp && getValidRegExp(params.banRegexp).test(numberValue)) {
                    return {
                        success: false,
                        error: 'wrongFormat',
                        message: params.banMessage,
                        errorKeyId: 'xev-error-wrongFormat',
                        errorKeyParams: {
                            label: label
                        }
                    };
                }
                var len = value.length;

                if (len < params.minLength) {
                    return {
                        success: false,
                        error: 'tooSmall',
                        message: params.message,
                        errorKeyId: 'xev-error-integer-tooSmall',
                        errorKeyParams: {
                            label: label,
                            min: params.minLength,
                            digits: callbacks.getBem().I18N('form', 'xev-digits', {
                                count: params.minLength
                            })
                        }
                    };
                }
                if (len > params.maxLength) {
                    return {
                        success: false,
                        error: 'tooBig',
                        message: params.message,
                        errorKeyId: 'xev-error-integer-tooBig',
                        errorKeyParams: {
                            label: label,
                            max: params.maxLength,
                            digits: callbacks.getBem().I18N('form', 'xev-digits', {
                                count: params.maxLength
                            })
                        }
                    };
                }
                return { success: true };
            },

            /**
             * Проверка типа ym_sum
             *
             * @param {Object} params Параметры проверки
             * @param {String} params.value Валидируемое значение
             * @param {String} [params.min] Минимальное значение
             * @param {String} [params.max] Максимальное значение
             * @param {Number} [params.multiple=0.01] Кратность суммы
             * @param {String} [params.optional] Флаг необязательности поля. Default = false
             * @param {String} [params.message] Текст сообщения об ошибке заполнения поля
             *
             * vyt @TODO: Добавить поддержку currencyID, брать название валюты из единого справочника валют
             * azbykov @todo: использовать блок b-sum
             *
             * @returns {Object} Объект с признаком успешной проверки и типом ошибки
             *
             */
            ym_sum: function ym_sum(params) {
                var value = utils.toNum(params.value);
                var formattedValue = Math.round(value * 100) / 100;

                // Готовим параметры с учётом значений по-умолчанию
                params = _.defaults(params, {
                    min: 0.01,
                    max: 15000,
                    multiple: 0.01
                });

                // Если поле не обязательно к заполнению и не заполнено, выходим с успехом
                if (params.optional && _.isEmpty(value)) {
                    return { success: true };
                }

                if (params.value === '') {
                    return {
                        success: false,
                        error: 'empty',
                        message: params.message,
                        errorKeyId: 'xev-error-sum-empty'
                    };
                }

                if (_.isNaN(value) || value < 0 || value != formattedValue || !/^[0-9\.,]+$/.test(params.value)) {
                    return {
                        success: false,
                        message: params.message,
                        error: 'wrongFormat',
                        errorKeyId: 'xev-error-sum-wrongFormat'
                    };
                } else if (params.min && value < params.min) {
                    return {
                        success: false,
                        error: 'tooSmall',
                        message: params.message,
                        errorKeyId: 'xev-error-sum-tooSmall',
                        errorKeyParams: {
                            sumMin: params.min + ' ' + callbacks.getBemHtml().apply({
                                block: 'currency',
                                mods: { type: 'rub' }
                            })
                        }
                    };
                } else if (params.max && value > params.max) {
                    return {
                        success: false,
                        error: 'tooBig',
                        message: params.message,
                        errorKeyId: 'xev-error-sum-tooBig',
                        errorKeyParams: {
                            sumMax: params.max + ' ' + callbacks.getBemHtml().apply({
                                block: 'currency',
                                mods: { type: 'rub' }
                            })
                        }
                    };
                }

                var multiple = utils.toNum(params.multiple);
                // В операторе modulus нельзя использовать деление на дробное
                // число, поэтому используем числа, умноженные на 100.
                var multiple100 = multiple * 100;
                // Компенсируем потерю точности при конвертации чисел с
                // мантиссой в десятичные. Иначе, например, 2.01 * 100 != 201
                multiple100 = Math.round(multiple100 * Math.pow(10, 2)) / Math.pow(10, 2);
                var value100 = value * 100;
                value100 = Math.round(value100 * Math.pow(10, 2)) / Math.pow(10, 2);
                if (multiple === 1 && value100 % multiple100 !== 0) {
                    return {
                        success: false,
                        error: 'wrongFormat',
                        message: params.message,
                        errorKeyId: 'xev-error-sum_must_be_integer'
                    };
                }
                if (value100 % multiple100 !== 0) {
                    return {
                        success: false,
                        error: 'wrongFormat',
                        message: params.message,
                        errorKeyId: 'xev-error-sum-must_be_multiple',
                        errorKeyParams: {
                            multiple: multiple
                        }
                    };
                }

                return { success: true };
            },

            /**
             * Проверка типа ym_regexp
             *
             * @param {Object} params Настройки проверки на соответствие регулярному выражению
             * @param {RegExp} params.regexp Регулярное выражение
             * @param {Boolean} [params.optional=false] Флаг необязательности поля
             * @param {String} [params.message] Текст сообщения об ошибке заполнения поля
             * @param {RegExp} [params.banRegexp] Регулярное выражение для проверки запрещённых символов
             * @param {String} [params.banMessage] Текст сообщения при проверке запрещённых символов
             *
             * @returns {Object} Результат проверки поля
             */
            ym_regexp: function ym_regexp(params) {
                var regexp = getValidRegExp(params.regexp);
                var value = params.value;
                var label = utils.setLocalizedQuotes(params.label);

                if (params.optional && value === '') {
                    return { success: true };
                }

                if (params.banRegexp && getValidRegExp(params.banRegexp).test(value)) {
                    // Название поля для вставки в сообщения об ошибках
                    return {
                        success: false,
                        error: 'wrongFormat',
                        message: params.banMessage,
                        errorKeyId: 'xev-error-wrongFormat',
                        errorKeyParams: {
                            label: label
                        }
                    };
                }

                var result = {
                    success: regexp.test(value)
                };
                if (!result.success) {
                    result = _.defaults(result, {
                        error: 'wrongFormat',
                        message: params.message,
                        errorKeyId: 'xev-error-wrongFormat',
                        errorKeyParams: {
                            label: label
                        }
                    });
                }

                return result;
            },

            /**
             * Проверка типа ym_natural_number.
             * Надстройка над ym_integer
             *
             * @param {Object} [params] Настройки проверки числа
             * @param {Number} [params.minLength=1] Минимальная длина числа
             * @param {Number} [params.maxLength=20] Максимальная длина числа
             * @param {Boolean} [params.optional=false] Флаг необязательности поля
             * @param {String} [params.message] Текст сообщения об ошибке заполнения поля
             *
             * @returns {Object} Результат проверки поля
             */
            ym_natural_number: function ym_natural_number(params) {
                var value = params.value;
                var label = utils.setLocalizedQuotes(params.label);

                if (params.optional && value === '') {
                    return {
                        success: true
                    };
                }
                var result = callbacks.ym_integer.call(this, params);
                if (result.success) {
                    var num = utils.toNum(value);
                    if (num < 1 || /^\d*\.\d*$/.test(value)) {
                        return {
                            success: false,
                            message: params.message,
                            error: 'wrongFormat',
                            errorKeyId: 'xev-error-natural-number',
                            errorKeyParams: {
                                label: label
                            }
                        };
                    }
                }
                return result;
            },

            /**
             * Проверка типа ym_textsize
             *
             * @param {Object} [params] Настройки проверки размера строки
             * @param {Number} [params.min=1] Минимальная длина строки
             * @param {Number} [params.max=200] Максимальная длина строки
             * @param {Boolean} [params.optional=false] Флаг необязательности поля
             * @param {String} [params.message] Текст сообщения об ошибке заполнения поля
             * @param {RegExp} [params.banRegexp] Регулярное выражение для проверки запрещённых символов
             * @param {String} [params.banMessage] Текст сообщения при проверке запрещённых символов
             *
             * @returns {Object} Результат проверки поля
             */
            ym_textsize: function ym_textsize(params) {
                var value = params.value;
                var label = utils.setLocalizedQuotes(params.label);
                // Готовим параметры с учётом значений по-умолчанию
                params = _.defaults(params, {
                    min: 1,
                    max: 200
                });

                if (params.optional && value === '') {
                    return {
                        success: true
                    };
                }

                if (params.banRegexp && getValidRegExp(params.banRegexp).test(value)) {
                    return {
                        success: false,
                        error: 'wrongFormat',
                        message: params.banMessage,
                        errorKeyId: 'xev-error-wrongFormat',
                        errorKeyParams: {
                            label: label
                        }
                    };
                }
                var len = value.length;

                if (len < params.min) {
                    return {
                        success: false,
                        error: 'tooSmall',
                        message: params.message,
                        errorKeyId: 'xev-error-textsize-tooSmall',
                        errorKeyParams: {
                            label: label,
                            min: params.min,
                            symbols: callbacks.getBem().I18N('form', 'xev-symbols', {
                                count: params.min
                            })
                        }
                    };
                }
                if (len > params.max) {
                    return {
                        success: false,
                        error: 'tooBig',
                        message: params.message,
                        errorKeyId: 'xev-error-textsize-tooBig',
                        errorKeyParams: {
                            label: label,
                            max: params.max,
                            symbols: callbacks.getBem().I18N('form', 'xev-symbols', {
                                count: params.max
                            })
                        }
                    };
                }
                return { success: true };
            },

            /**
             * Проверка типа ym_peoplename
             *
             * @param {Object} [params] Настройки проверки на соответствие ФИО
             * @param {Boolean} [params.optional=false] Флаг необязательности поля
             * @param {String} [params.message] Текст сообщения об ошибке заполнения поля
             * @param {RegExp} [params.banRegexp] Регулярное выражение для проверки запрещённых символов
             * @param {String} [params.banMessage] Текст сообщения при проверке запрещённых символов
             *
             * Поддерживаются также все параметры ym_textsize
             *
             * @returns {Object} Результат проверки поля
             */
            ym_peoplename: function ym_peoplename(params) {
                var value = params.value;
                var label = utils.setLocalizedQuotes(params.label);

                params = params || {};
                if (params.optional && value === '') {
                    return { success: true };
                }
                // Проверяем значение на размер строки
                var result = callbacks.ym_textsize.call(this, params);
                if (!result.success) {
                    return result;
                }

                // Поддержка опционального запрета символов, например, 'ё'
                if (params.banRegexp && getValidRegExp(params.banRegexp).test(value)) {
                    return {
                        success: false,
                        error: 'wrongFormat',
                        message: params.banMessage,
                        errorKeyId: 'xev-error-wrongFormat',
                        errorKeyParams: {
                            label: label
                        }
                    };
                }

                if (!/^\s*[а-еёж-яА-ЕЁЖ-Я]+[а-еёж-яА-ЕЁЖ-Я\-\s]*$/.test(value)) {
                    // Название поля для вставки в сообщения об ошибках
                    return {
                        success: false,
                        error: 'wrongFormat',
                        message: params.message,
                        errorKeyId: 'xev-error-wrongFormat',
                        errorKeyParams: {
                            label: label
                        }
                    };
                }
                return { success: true };
            },

            /**
             * Проверка типа ym_card_number - правильность номера банковской карты.
             *
             * @param {object} [params] Настройки проверки.
             * @param {string} [params.message] Текст сообщения об ошибке.
             *
             * @returns {object} Результат проверки поля.
             */
            ym_card_number: function ym_card_number(params) {
                var cardNumber = params.value;
                var label = utils.setLocalizedQuotes(params.label);
                var result = {
                    success: true
                };
                result.success = utils.checkCardNumber(cardNumber);

                if (!result.success) {
                    result = {
                        success: false,
                        error: 'wrongFormat',
                        errorKeyId: 'xev-error-wrongFormat',
                        errorKeyParams: {
                            label: label
                        }
                    };
                }
                return result;
            },

            /**
             * Проверка типа xsd_integer
             *
             * @param {Object} [params] Настройки проверки на целое число
             * @param {Boolean} [params.optional=false] Флаг необязательности поля
             * @param {String} [params.message] Текст сообщения об ошибке заполнения поля
             *
             * @returns {Object} Результат проверки поля
             */
            xsd_integer: function xsd_integer(params) {
                params = params || {};
                var value = params.value;
                var label = utils.setLocalizedQuotes(params.label);

                if (params.optional && value === '') {
                    return { success: true };
                }
                if (!_.isNumber(value)) {
                    return {
                        success: false,
                        error: 'wrongFormat',
                        message: params.message,
                        errorKeyId: 'xev-error-only-digits',
                        errorKeyParams: {
                            label: label
                        }
                    };
                }
                return { success: true };
            },

            /**
             * Проверка типа ym_sum_related (пересчёт связанных сумм поверх типа ym_sum)
             * @deprecated Устаревший метод. Основная проверка была на сервере. Сейчас проверяем по правилу ym_sum;
             *
             * @param {Object} params Настройки проверки на сумму, почти полностью повторяют настройки ym_sum
             * @param {String} params.addComissionField Имя поля для пересчёта с добавлением комиссии
             * @param {String} params.subtractComissionField Имя поля для пересчёта с вычитанием комиссии
             * @param {Boolean} params.skipInFinalCheck Флаг для пропуска проверки при финальной валидации
             * @param {Function} params.afterSetField Функция, вызываемая после пересчета и выставления суммы
             * @returns {Object} Результат проверки поля
             */
            ym_sum_related: function ym_sum_related(params) {
                var result = {
                    success: true
                };
                params.optional = false;
                result = callbacks.ym_sum.call(this, params);
                return result;
            },

            /**
             * Проверка типа ym_sum_interest (пересчёт связанной суммы и пени поверх типа ym_sum)
             * @deprecated Устаревший метод. Основная проверка была на сервере. Сейчас проверяем по правилу ym_sum;
             *
             * @param {Object} params Параметры проверки
             * @param {String} params.value Валидируемое значение
             * @param {String} [params.min] Минимальное значение
             * @param {String} [params.max] Максимальное значение
             * @param {Number} [params.multiple=0.01] Кратность суммы
             * @param {String} [params.optional] Флаг необязательности поля. Default = false
             * @param {String} [params.message] Текст сообщения об ошибке заполнения поля
             * @param {String} [params.interestField] имя связанного поля "Пени"
             * @param {String} [params.sumField] имя связанного поля "сумма"
             * @returns {Object} Результат проверки поля
             */
            ym_sum_interest: function ym_sum_interest(params) {
                var isValid = callbacks.ym_sum.call(this, params);
                var sumField = params.sumField;
                var $ = callbacks.getJquery();
                if (isValid.success && sumField) {
                    var value = utils.toNum(params.value, 0);
                    var sum = $('input[name = ' + sumField + ']').bem('input').val();
                    sum = utils.toNum(sum, 0);
                    // Если пени больше суммы, выходим с ошибкой
                    if (value > sum) {
                        return {
                            success: false,
                            error: 'wrongFormat',
                            message: params.message,
                            errorKeyId: 'xev-error-fine-higher-than-sum'
                        };
                    }
                }
                return isValid;
            },

            /**
             * Обработка поля кастомным правилом.
             * Выполняем этот метод когда не нашли подходящее правило в callbacks.
             *
             * @param {Object} params Настройки
             * @param {Object} params.xev - объект xev, необходим для проброски в кастомные методы из киоска
             * @param {String} params.callback - имя кастомного метода
             * @returns {Object}
             */
            xevCustom: function xevCustom(params) {
                var xev = params.xev;
                var callback = xev[params.callback];

                if (params.formData) {
                    xev.fields.merge(params.formData);
                }

                if (_.isFunction(callback)) {
                    /**
                     * Устанавливаем параметр ctx т.к. с ним работает старый механизм xev
                     * и все кастомные правила из киоска используют это свойство
                     * Мержим обработчики правил в XEV. Это необходимо,
                     * чтобы в кастомных правилах из киоска работали правила из XEV
                     */
                    params.ctx = _.merge(xev, xev.callback);
                    var callbackResult = callback.call(params.value, params);
                    return _.defaults(callbackResult);
                }
                return { success: true };
            }
        };

        /**
         * Метод преобразует паттерн из строки в валидную строку и возвращает объект RegExp
         *
         * @param {String} regexpString паттерн для RegExp
         * @returns {RegExp}
         */
        var getValidRegExp = function getValidRegExp(regexpString) {
            var pattern = '';
            if (!_.isEmpty(regexpString)) {
                pattern = regexpString.slice(1, regexpString.length - 1);
                pattern.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
            }
            return new RegExp(pattern);
        };

        module.exports = callbacks;
    }, { "yandex-money-utils": 68 }], 82: [function (require, module, exports) {
        var _ = _ || window._;
        var utils = require('yandex-money-utils');
        var ymContext = require('./ymContext');
        var callbacks = require('./callbacks');

        function XevCommon() {
            // TODO: описать форматы внутренних объектов и объекты
            // результатов из функций проверок

            // Правила полей
            this.rules = {};
            // Поля формы
            this.fields = utils.createICase();
            // Ошибки полей формы
            this.errors = {};
            // поддерживаемые контролы
            this.supportedControls = ['input', 'select'];
        }

        var ym = ym || {};

        /**
         * Округление суммы до копеек
         *
         * @param {String|Number} sum Сумма
         *
         * @returns {Number}
         */
        XevCommon.prototype.roundSum = function (sum) {
            if (_.isString(sum)) {
                sum = Number(sum.replace(',', '.'));
            }
            return Math.round(sum * 100) / 100;
        };

        /**
         * Получение процентов от суммы
         *
         * @param {String|Number} sum Сумма
         * @param {Number} percentages Проценты
         * @param {Boolean} [countDown=false] Направление вычисления процентов: false - считаем проценты от данной суммы,
         *                              true - считаем проценты так, чтобы получилась данная сумма. По умолчанию - false.
         *
         * @returns {Number}
         */
        XevCommon.prototype.getPercentages = function (sum, percentages, countDown) {
            countDown = countDown && true;
            sum = this.roundSum(sum);
            var sumPercent = 0;
            // Считаем проценты от суммы
            if (countDown) {
                sumPercent = sum * (percentages / (100 + percentages));
            } else {
                sumPercent = sum * percentages / 100;
            }
            // Проценты не могут быть меньше "минимальной единицы в
            // настройках банка для текущей валюты". На практике это
            // просто "комиссия не может быть меньше копейки"
            return Math.max(this.roundSum(sumPercent), 0.01);
        };

        /**
         * Получение суммы с вычетом процентов
         *
         * @param {String|Number} sum Сумма
         * @param {Number} percentages Проценты
         *
         * @returns {Number}
         */
        XevCommon.prototype.subtractPercentages = function (sum, percentages) {
            sum = this.roundSum(sum);
            var sumSubtracted = this.roundSum(sum - this.getPercentages(sum, percentages, true));
            if (sumSubtracted === sum) {
                sumSubtracted -= 0.01;
            }
            return this.roundSum(sumSubtracted);
        };

        /**
         * Получение суммы с добавлением процентов
         *
         * @param {String|Number} sum Сумма
         * @param {Number} percentages Проценты
         *
         * @returns {Number}
         */
        XevCommon.prototype.addPercentages = function (sum, percentages) {
            sum = this.roundSum(sum);
            // Для обратного добавления процентов нельзя использовать
            // this.getPercentages(), там считаются проценты от исходной
            // суммы вниз
            var sumAdded = this.roundSum(sum + this.getPercentages(sum, percentages, false));
            // Если после округления сумма с комиссией равна сумме без комиссии, добавляем минимальную комиссию
            if (sumAdded === sum) {
                sumAdded += 0.01;
            }
            return this.roundSum(sumAdded);
        };

        /**
         * Получение комиссии по фиксированному минимуму или процентам.
         *
         * @param {String|Number} sum Сумма
         * @param {Number} min Фиксированный минимум комиссии
         * @param {Number} percentages Проценты
         * @param {Boolean} countDown Направление пересчета процентов
         *
         * @returns {Number}
         */
        XevCommon.prototype.getMinimumOrPercentages = function (sum, min, percentages, countDown) {
            var percent = this.getPercentages(sum, percentages, countDown);
            // Возвращаем тот навар, который больше - минимальная комиссия или проценты
            return Math.max(min, percent);
        };

        /**
         * Получение суммы с добавлением комиссии по фиксированному минимуму или процентам.
         *
         * @param {String|Number} sum Сумма
         * @param {Number} min Фиксированный минимум комиссии
         * @param {Number} percentages Проценты
         *
         * @returns {Number}
         */
        XevCommon.prototype.addMinimumOrPercentages = function (sum, min, percentages) {
            sum = this.roundSum(sum);
            var sumAdded = this.addPercentages(sum, percentages);
            return Math.max(sumAdded, this.roundSum(sum + min));
        };

        /**
         * Получение суммы с вычитанием комиссии по фиксированному минимуму или процентам.
         *
         * @param {String|Number} sum Сумма
         * @param {Number} min Фиксированный минимум комиссии
         * @param {Number} percentages Проценты
         *
         * @returns {Number}
         */
        XevCommon.prototype.subtractMinimumOrPercentages = function (sum, min, percentages) {
            sum = this.roundSum(sum);
            return this.roundSum(sum - this.getMinimumOrPercentages(sum, min, percentages, true));
        };

        /**
         * Получение суммы с добавлением комиссии по фиксированной сумме и процентам
         *
         * @param {String|Number} sum Сумма
         * @param {Number} fixed Фиксированный размер комиссии
         * @param {Number} percentages Проценты
         *
         * @returns {Number}
         */
        XevCommon.prototype.addFixedAndPercentages = function (sum, fixed, percentages) {
            sum = this.roundSum(sum);
            return this.roundSum(this.addPercentages(sum, percentages) + fixed);
        };

        /**
         * Получение суммы с вычитанием комиссии по фиксированной сумме и процентам
         *
         * @param {String|Number} sum Сумма
         * @param {Number} fixed Фиксированный размер комиссии
         * @param {Number} percentages Проценты
         *
         * @returns {Number}
         */
        XevCommon.prototype.subtractFixedAndPercentages = function (sum, fixed, percentages) {
            sum = this.roundSum(sum);
            return this.roundSum(this.subtractPercentages(sum - fixed, percentages));
        };

        /**
         * Получение комиссии по фиксированной сумме и процентам
         *
         * @param {String|Number} sum Сумма
         * @param {Number} fixed Фиксированный размер комиссии
         * @param {Number} percentages Проценты
         * @param {Boolean} [countDown=false] Направление пересчета комиссии. true - считаем комиссию с которой получится данная сумма,
         *                                                           false - считаем комиссию от данной суммы.
         *
         * @returns {Number}
         */
        XevCommon.prototype.getFixedAndPercentages = function (sum, fixed, percentages, countDown) {
            countDown = countDown && true;
            sum = this.roundSum(sum);
            if (countDown) {
                return this.roundSum(sum - this.subtractFixedAndPercentages(sum, fixed, percentages));
            } else {
                return this.roundSum(this.addFixedAndPercentages(sum, fixed, percentages) - sum);
            }
        };

        /**
         * Объект с проверяющими функциями
         *
         * @type {Object}
         */
        XevCommon.prototype.callback = callbacks;

        /**
         * Получение значения поля (регистронезависимо)
         *
         * @param {String} fieldName Имя поля
         *
         * @returns {String}
         */
        XevCommon.prototype.getField = function (fieldName) {
            return this.fields.get(fieldName) || '';
        };

        /**
         * Установка значения поля (регистронезависимо) в валидатор и в форму на клиенте.
         * Общий код.
         *
         * @param {String} fieldName Имя поля
         * @param {String|Number} value Значение
         *
         * @returns {String}
         *
         */
        XevCommon.prototype.setField = function (fieldName, value) {
            if (_.isEmpty(fieldName)) {
                return '';
            }
            var xev = this;
            xev.fields.set(fieldName, value);
            return fieldName;
        };

        /**
         * Установка значения полей (регистронезависимо) в валидатор и в форму на клиенте.
         * Общий код.
         *
         * @param {Object} fields Объекст со значениями {ИМЯ_ПОЛЯ: ЗНАЧЕНИЕ_ПОЛЯ}
         *
         * @returns {[String]}
         *
         */
        XevCommon.prototype.setFields = function (fields) {
            var fieldNames = [];
            if (_.isEmpty(fields)) {
                return fieldNames;
            }
            var xev = this;
            _.each(fields, function (val, name) {
                var fieldName = xev.setField(name, val);
                fieldNames.push(fieldName);
            });
            return fieldNames;
        };

        XevCommon.prototype.getRule = function (fieldName) {
            var $ = callbacks.getJquery();
            var fieldNameInRules = ym.getIName(this.rules, fieldName);
            /* На стороне сервера некоторые правила представляют собой перенос строки
             и они из-за этого не проходят проверку !rule, поэтому обрезаем пустые символы. */
            if (typeof this.rules[fieldNameInRules] === 'string') {
                this.rules[fieldNameInRules] = $.trim(this.rules[fieldNameInRules]);
            }
            return this.rules[fieldNameInRules] || null;
        };

        /**
         * Добавление правил в свойство rules
         * @param {Object} fieldsRules правила валидации
         */
        XevCommon.prototype.setRule = function (fieldsRules) {
            var xev = this;
            xev.rules = fieldsRules;
        };

        /**
         * Инициализация правил валидации в форме.
         *
         * Сначала смотрим, есть ли у нас метод getXevRulesFromShowcase.
         * Этот метод создается если мы получаем правила валидации из киоска.
         *
         * @param {Object} getXevRulesFromShowcase Функция для получения правил из витрины
         */
        XevCommon.prototype.initRules = function (getXevRulesFromShowcase) {
            var xev = this;
            // Создаем контекст для XEV с методами из /js/utils.js, которые используются в валидации из киоска.
            ymContext.xformsExtendedValidation = this;
            if (getXevRulesFromShowcase) {
                getXevRulesFromShowcase(ymContext);
            }

            _.each(xev.rules, function (rule, nameField) {
                var bemRule = xev.getRulesToBem(rule);
                xev.insertRulesToElement(bemRule, nameField);
            });
        };

        /**
         * Метод возвращает объект правил, подготовленный для priv.js
         *
         * @param {Object} rule Правило валидации
         * @returns {Array}
         */
        XevCommon.prototype.getRulesToBem = function (rule) {
            var xev = this;
            return xev.getRuleBemJsonByParams(rule);
        };

        /**
         * Добавляем правила валидации в контролы
         *
         * @param {Object} rule правила валидации
         * @param {String} name имя контрола
         */
        XevCommon.prototype.insertRulesToElement = function (rule, name) {
            var xev = this;
            var elem = $('.form').bem('form').findElem('control', 'name', name);
            var ctrlElem = elem.bem('validation');
            var defaultSetName = ctrlElem.DEFAULT_VALIDATION_SET_NAME;
            if (!_.isEmpty(ctrlElem)) {
                ctrlElem.params.validationSets[defaultSetName].validationRules = [rule];
            }
        };

        /**
         * Метод возвращает объект для блока правил валидации по определенному правилу.
         *
         * @param {Object} rule Правило валидации
         * @param {Object} rule.type Тип валидации
         * @param {Object} rule.params Параметры правила валидации
         * @returns {Object}
         */
        XevCommon.prototype.getRuleBemJsonByParams = function (rule) {
            var params = _.defaults(rule.params || {}, {
                callback: rule.callback,
                label: rule.label
            });

            if (params.regexp) {
                params.regexp = params.regexp + '';
            }

            if (params.banRegexp) {
                params.banRegexp = params.banRegexp + '';
            }

            return {
                type: 'xevCallback',
                params: params
            };
        };

        module.exports = XevCommon;
    }, { "./callbacks": 81, "./ymContext": 83, "yandex-money-utils": 68 }], 83: [function (require, module, exports) {
        /**
         * Создаем контекст для XEV, с методами из /js/utils.js, которые используются в валидации из киоска
         */
        var utils = require('yandex-money-utils');

        var ym = {
            mergeObjects: utils.imerge
        };

        module.exports = ym;
    }, { "yandex-money-utils": 68 }] }, {}, [1]);
modules.define('paranja', ['i-bem__dom', 'jquery'], function (provide, BEMDOM, $) {
	provide(BEMDOM.decl(this.name, {
		onSetMod: {
			js: {
				inited: function inited() {
					[].concat(this.params.rel || []).forEach(function (rel) {
						$(rel.elem || this.domElem).on(rel.event, this[rel.method].bind(this));
					}, this);

					this.bindTo('pointerclick', function () {
						this.emit('click');
					});
				}
			},

			state: {
				open: function open() {
					this.emit('open');
				},
				close: function close() {
					this.emit('close');
				}
			}
		},

		/**
   * Показывает паранжу
   * @public
   */
		open: function open() {
			this.setMod('state', 'open');
		},


		/**
   * Прячет паранжу
   * @public
   */
		close: function close() {
			this.setMod('state', 'close');
		}
	}, {
		live: false
	}));
});
/**
 * @module spin
 */
modules.define('spin', ['i-bem__dom'], function (provide, BEMDOM) {
	/**
  * @exports
  * @class spin
  * @bem
  */
	provide(BEMDOM.decl(this.name, /** @lends spin.prototype */{
		/**
   * Запускает спиннер
   * @public
   */
		start: function start() {
			this.setMod('visible', true);
		},


		/**
   * Останаваливает спиннер
   * @public
   */
		stop: function stop() {
			this.delMod('visible');
		}
	}));
});
/**
 * @module spinner
 */
modules.define('spinner', ['i-bem__dom'], function (provide, BEMDOM) {
	/**
  * @exports
  * @class spinner
  * @bem
  */
	provide(BEMDOM.decl(this.name, /** @lends spinner.prototype */{

		onSetMod: {
			js: {
				inited: function inited() {
					/**
      * Блок paranja
      * @private
      * @type {BEM}
      */
					this._bParanja = this.findBlockInside('paranja');

					/**
      * Блок b-page
      * @private
      * @type {BEM}
      */
					this._bPage = this.findBlockOutside('b-page');
				}
			}
		},

		/**
   * Показывает блок
   * @public
   */
		open: function open() {
			this._bParanja.open();
			this.setMod('state', 'open');
			// Устанавливаем модификатор b-page для накладывания фильтров размытия
			this._bPage.setMod('blur', 'yes');
		},


		/**
   * Скрывает блок
   * @public
   */
		close: function close() {
			this._bParanja.close();
			this.setMod('state', 'close');
			this._bPage.delMod('blur');
		}
	}));
});
/**
 * @module form
 */
modules.define('form', ['i-bem__dom'], function (provide, BEMDOM) {
	/**
  * @exports
  * @class form
  * @bem
  */
	provide(BEMDOM.decl({ block: this.name, modName: 'disabled', modVal: true }, /** @lends form.prototype */{
		onSetMod: {
			js: {
				inited: function inited() {
					this.__base.apply(this, arguments);

					this.disable();
				}
			}
		}
	}));
});
/**
 * @module button
 */

modules.define('button', ['i-bem__dom', 'control', 'jquery', 'dom', 'functions', 'keyboard__codes'], function (provide, BEMDOM, Control, $, dom, functions, keyCodes) {

    /**
     * @exports
     * @class button
     * @augments control
     * @bem
     */
    provide(BEMDOM.decl({ block: this.name, baseBlock: Control }, /** @lends button.prototype */{
        beforeSetMod: {
            'pressed': {
                'true': function _true() {
                    return !this.hasMod('disabled') || this.hasMod('togglable');
                }
            },

            'focused': {
                '': function _() {
                    return !this._isPointerPressInProgress;
                }
            }
        },

        onSetMod: {
            'js': {
                'inited': function inited() {
                    this.__base.apply(this, arguments);
                    this._isPointerPressInProgress = false;
                    this._focusedByPointer = false;
                }
            },

            'disabled': {
                'true': function _true() {
                    this.__base.apply(this, arguments);
                    this.hasMod('togglable') || this.delMod('pressed');
                    this.domElem.attr('aria-disabled', true);
                },
                '': function _() {
                    this.__base.apply(this, arguments);
                    this.domElem.removeAttr('aria-disabled');
                }
            },

            'focused': {
                'true': function _true() {
                    this.__base.apply(this, arguments);
                    this._focusedByPointer || this.setMod('focused-hard');
                },

                '': function _() {
                    this.__base.apply(this, arguments);
                    this.delMod('focused-hard');
                }
            }
        },

        /**
         * Returns text of the button
         * @returns {String}
         */
        getText: function getText() {
            return this.elem('text').text();
        },

        /**
         * Sets text to the button
         * @param {String} text
         * @returns {button} this
         */
        setText: function setText(text) {
            this.elem('text').text(text || '');
            return this;
        },

        _onFocus: function _onFocus() {
            if (this._isPointerPressInProgress) return;

            this.__base.apply(this, arguments);
            this.bindTo('control', 'keydown', this._onKeyDown);
        },

        _onBlur: function _onBlur() {
            this.unbindFrom('control', 'keydown', this._onKeyDown).__base.apply(this, arguments);
        },

        _onMouseDown: function _onMouseDown(e) {
            e.preventDefault(); // NOTE: prevents button from being blurred at least in FF and Safari
            this.unbindFrom('mousedown', this._onMouseDown);
        },

        _onPointerPress: function _onPointerPress() {
            this.bindTo('mousedown', this._onMouseDown);
            if (!this.hasMod('disabled')) {
                this._isPointerPressInProgress = true;
                this.bindToDoc('pointerrelease', this._onPointerRelease).setMod('pressed');
            }
        },

        _onPointerRelease: function _onPointerRelease(e) {
            this._isPointerPressInProgress = false;
            this.unbindFromDoc('pointerrelease', this._onPointerRelease);

            if (e.originalEvent.type === 'pointerup' && dom.contains(this.elem('control'), $(e.target))) {
                this._focusedByPointer = true;
                this._focus();
                this._focusedByPointer = false;
                this.bindTo('pointerclick', this._onPointerClick);
            } else {
                this._blur();
            }

            this.delMod('pressed');
        },

        _onPointerClick: function _onPointerClick() {
            this.unbindFrom('pointerclick', this._onPointerClick)._updateChecked().emit('click');
        },

        _onKeyDown: function _onKeyDown(e) {
            if (this.hasMod('disabled')) return;

            var keyCode = e.keyCode;
            if (keyCode === keyCodes.SPACE || keyCode === keyCodes.ENTER) {
                this.unbindFrom('control', 'keydown', this._onKeyDown).bindTo('control', 'keyup', this._onKeyUp)._updateChecked().setMod('pressed');
            }
        },

        _onKeyUp: function _onKeyUp(e) {
            this.unbindFrom('control', 'keyup', this._onKeyUp).bindTo('control', 'keydown', this._onKeyDown).delMod('pressed');

            e.keyCode === keyCodes.SPACE && this._doAction();

            this.emit('click');
        },

        _updateChecked: function _updateChecked() {
            this.hasMod('togglable') && (this.hasMod('togglable', 'check') ? this.toggleMod('checked') : this.setMod('checked'));

            return this;
        },

        _doAction: functions.noop
    }, /** @lends button */{
        live: function live() {
            this.liveBindTo('control', 'pointerpress', this.prototype._onPointerPress);
            return this.__base.apply(this, arguments);
        }
    }));
});
/**
 * @module button
 */
modules.define('button', ['i-bem__dom'], function (provide, BEMDOM) {
	/**
  * @exports
  * @class button
  * @bem
  */
	provide(BEMDOM.decl(this.name, /** @lends button.prototype */{
		/**
   * Генерируется перед получением модификатора _pressed_yes.
   *
   * @event button#press
   */

		/**
   * Генерируется перед снятием модификатора _pressed.
   *
   * @event button#release
   */

		/**
   * Генерируется перед получением модификатора _checked_true.
   *
   * @event button#check
   */

		/**
   * Генерируется перед снятием модификатора _checked.
   *
   * @event button#uncheck
   */
		onSetMod: {
			pressed: {
				'true': function _true() {
					this.__base.apply(this, arguments);
					if (this.hasMod('disabled')) {
						return false;
					}

					this.emit('press');
				},
				'': function _() {
					this.__base.apply(this, arguments);

					this.emit('release');
				}
			},

			checked: {
				'true': function _true() {
					this.__base.apply(this, arguments);
					this.emit('check').domElem.attr('aria-pressed', 'true');
				},
				'': function _() {
					this.emit('uncheck').domElem.attr('aria-pressed', 'false');
				}
			},

			disabled: {
				'true': function _true() {
					this.__base.apply(this, arguments);
					this.delMod('pressed');
				}
			},

			focused: {
				'': function _() {
					this.__base.apply(this, arguments);
					this.delMod('pressed');
				}
			}
		}
	}));
});
/**
 * @module tick
 * @description Helpers for polling anything
 */

modules.define('tick', ['inherit', 'events'], function (provide, inherit, events) {

    var TICK_INTERVAL = 50,
        global = this.global,


    /**
     * @class Tick
     * @augments events:Emitter
     */
    Tick = inherit(events.Emitter, /** @lends Tick.prototype */{
        /**
         * @constructor
         */
        __constructor: function __constructor() {
            this._timer = null;
            this._isStarted = false;
        },

        /**
         * Starts polling
         */
        start: function start() {
            if (!this._isStarted) {
                this._isStarted = true;
                this._scheduleTick();
            }
        },

        /**
         * Stops polling
         */
        stop: function stop() {
            if (this._isStarted) {
                this._isStarted = false;
                global.clearTimeout(this._timer);
            }
        },

        _scheduleTick: function _scheduleTick() {
            var _this = this;
            this._timer = global.setTimeout(function () {
                _this._onTick();
            }, TICK_INTERVAL);
        },

        _onTick: function _onTick() {
            this.emit('tick');

            this._isStarted && this._scheduleTick();
        }
    });

    provide(
    /**
     * @exports
     * @type Tick
     */
    new Tick());
});
/**
 * @module idle
 */

modules.define('idle', ['inherit', 'events', 'jquery'], function (provide, inherit, events, $) {

    var IDLE_TIMEOUT = 3000,
        USER_EVENTS = 'mousemove keydown click',

    /**
     * @class Idle
     * @augments events:Emitter
     */
    Idle = inherit(events.Emitter, /** @lends Idle.prototype */{
        /**
         * @constructor
         */
        __constructor: function __constructor() {
            this._timer = null;
            this._isStarted = false;
            this._isIdle = false;
        },

        /**
         * Starts monitoring of idle state
         */
        start: function start() {
            if (!this._isStarted) {
                this._isStarted = true;
                this._startTimer();
                $(document).on(USER_EVENTS, $.proxy(this._onUserAction, this));
            }
        },

        /**
         * Stops monitoring of idle state
         */
        stop: function stop() {
            if (this._isStarted) {
                this._isStarted = false;
                this._stopTimer();
                $(document).off(USER_EVENTS, this._onUserAction);
            }
        },

        /**
         * Returns whether state is idle
         * @returns {Boolean}
         */
        isIdle: function isIdle() {
            return this._isIdle;
        },

        _onUserAction: function _onUserAction() {
            if (this._isIdle) {
                this._isIdle = false;
                this.emit('wakeup');
            }

            this._stopTimer();
            this._startTimer();
        },

        _startTimer: function _startTimer() {
            var _this = this;
            this._timer = setTimeout(function () {
                _this._onTimeout();
            }, IDLE_TIMEOUT);
        },

        _stopTimer: function _stopTimer() {
            this._timer && clearTimeout(this._timer);
        },

        _onTimeout: function _onTimeout() {
            this._isIdle = true;
            this.emit('idle');
        }
    });

    provide(
    /**
     * @exports
     * @type Idle
     */
    new Idle());
});
/**
 * @module popup
 */

modules.define('popup', ['i-bem__dom'], function (provide, BEMDOM) {

    var ZINDEX_FACTOR = 1000,
        visiblePopupsZIndexes = {},
        undef;

    /**
     * @exports
     * @class popup
     * @bem
     *
     * @param {Number} [zIndexGroupLevel=0] z-index group level
     *
     * @bemmod visible Represents visible state
     */
    provide(BEMDOM.decl(this.name, /** @lends popup.prototype */{
        onSetMod: {
            'js': {
                'inited': function inited() {
                    this._parentPopup = undef;
                    this._zIndex = null;
                    this._zIndexGroupLevel = null;
                    this._isAttachedToScope = false;
                },

                '': function _() {
                    this.delMod('visible');
                }
            },

            'visible': {
                'true': function _true() {
                    if (!this._isAttachedToScope) {
                        BEMDOM.scope.append(this.domElem);
                        this._isAttachedToScope = true;
                    }

                    this._captureZIndex()._bindToParentPopup().bindTo('pointerpress pointerclick', this._setPreventHideByClick).domElem.removeAttr('aria-hidden');
                },

                '': function _() {
                    this._releaseZIndex()._unbindFromParentPopup().unbindFrom('pointerpress pointerclick', this._setPreventHideByClick).domElem.attr('aria-hidden', true);
                }
            }
        },

        /**
         * Sets content
         * @param {String|jQuery} content
         * @returns {popup} this
         */
        setContent: function setContent(content) {
            BEMDOM.update(this.domElem, content);
            return this;
        },

        _calcZIndexGroupLevel: function _calcZIndexGroupLevel() {
            var res = this.params.zIndexGroupLevel,
                parentPopup = this._getParentPopup();

            parentPopup && (res += parentPopup._zIndexGroupLevel);

            return res;
        },

        _setPreventHideByClick: function _setPreventHideByClick() {
            var curPopup = this;
            do {
                curPopup._preventHideByClick = true;
            } while (curPopup = curPopup._getParentPopup());
        },

        _bindToParentPopup: function _bindToParentPopup() {
            var parentPopup = this._getParentPopup();
            parentPopup && parentPopup.on({ modName: 'visible', modVal: '' }, this._onParentPopupHide, this);

            return this;
        },

        _unbindFromParentPopup: function _unbindFromParentPopup() {
            this._parentPopup && this._parentPopup.un({ modName: 'visible', modVal: '' }, this._onParentPopupHide, this);
            this._parentPopup = undef;

            return this;
        },

        _onParentPopupHide: function _onParentPopupHide() {
            this.delMod('visible');
        },

        _getParentPopup: function _getParentPopup() {
            return this._parentPopup;
        },

        _captureZIndex: function _captureZIndex() {
            var level = this._zIndexGroupLevel === null ? this._zIndexGroupLevel = this._calcZIndexGroupLevel() : this._zIndexGroupLevel,
                zIndexes = visiblePopupsZIndexes[level] || (visiblePopupsZIndexes[level] = [(level + 1) * ZINDEX_FACTOR]),
                prevZIndex = this._zIndex;

            this._zIndex = zIndexes[zIndexes.push(zIndexes[zIndexes.length - 1] + 1) - 1];
            this._zIndex !== prevZIndex && this.domElem.css('z-index', this._zIndex);

            return this;
        },

        _releaseZIndex: function _releaseZIndex() {
            var zIndexes = visiblePopupsZIndexes[this._zIndexGroupLevel];
            zIndexes.splice(zIndexes.indexOf(this._zIndex), 1);

            return this;
        },

        _recaptureZIndex: function _recaptureZIndex() {
            this._releaseZIndex();
            this._zIndexGroupLevel = null;

            return this._captureZIndex();
        },

        getDefaultParams: function getDefaultParams() {
            return {
                zIndexGroupLevel: 0
            };
        }
    }, /** @lends popup */{
        live: true
    }));
});
/**
 * @module popup
 */

modules.define('popup', ['i-bem__dom', 'objects', 'jquery'], function (provide, BEMDOM, objects, $) {
	/**
  * @exports
  * @class popup
  */
	provide(BEMDOM.decl(this.name, /** @lends popup.prototype */{
		onSetMod: {
			js: {
				inited: function inited() {
					var _this = this;

					var bPage = $('.b-page').bem('b-page');
					// Подписываемся на событие изменения страницы.
					// Триггерится вручную на блоке b-page при отображении/скрытии видимых элементов.
					bPage.on('change', function () {
						return _this._onPageChange();
					});
					this.__base.apply(this, arguments);
				}
			},
			autoclosable: {
				yes: function yes() {
					this.setMod('autoclosable');
				}
			},
			visible: {
				yes: function yes() {
					this.setMod('visible');
				},
				true: function _true() {
					this.emit('beforeOpen');
					this.__base.apply(this, arguments);
					this.emit('show');
				},
				'': function _() {
					this.emit('beforeClose');
					this.__base.apply(this, arguments);
					this.emit('hide');
				}
			}
		},

		/**
   * Перерисовывает попап. Метод для обратной совместимости
   *
   * @public
   * @deprecated
   */
		repaint: function repaint() {
			this.redraw();
		},


		/**
   * Проверка видимости попапа. Метод для обратной совместимости
   *
   * @public
   * @deprecated
   * @returns {Boolean}
   */
		isShown: function isShown() {
			return this.hasMod('visible');
		},


		/**
   * Скрывает попап. Метод для обратной совместимости
   *
   * @public
   * @deprecated
   */
		hide: function hide() {
			this.delMod('visible');
		},


		/**
   * Переключает видимость. Метод для обратной совместимости
   *
   * @public
   * @deprecated
   */
		toggle: function toggle() {
			this.toggleMod('visible');
		},


		/**
   * Параметры отрисовки по умолчанию
   *
   * @public
   * @returns {Object}
   */
		getDefaultParams: function getDefaultParams() {
			return objects.extend(this.__base(), {
				mainOffset: 5,
				viewportOffset: 10
			});
		},


		/**
   * Обработчик события изменившейся страницы.
   * Событие возникает при отображении/скрытии видимых элементов страницы.
   * Инициирует перерисовку блока, если он видим.
   *
   * @private
   */
		_onPageChange: function _onPageChange() {
			// попап видим или в процессе скрытия
			if (this.hasMod('visible')) {
				this.redraw();
			}
		}
	}));
});
/**
 * @module functions__throttle
 */

modules.define('functions__throttle', function (provide) {

    var global = this.global;

    provide(
    /**
     * Throttle given function
     * @exports
     * @param {Function} fn function to throttle
     * @param {Number} timeout throttle interval
     * @param {Boolean} [invokeAsap=true] invoke before first interval
     * @param {Object} [ctx] context of function invocation
     * @returns {Function} throttled function
     */
    function (fn, timeout, invokeAsap, ctx) {
        var typeofInvokeAsap = typeof invokeAsap === 'undefined' ? 'undefined' : babelHelpers.typeof(invokeAsap);
        if (typeofInvokeAsap === 'undefined') {
            invokeAsap = true;
        } else if (arguments.length === 3 && typeofInvokeAsap !== 'boolean') {
            ctx = invokeAsap;
            invokeAsap = true;
        }

        var timer,
            args,
            needInvoke,
            wrapper = function wrapper() {
            if (needInvoke) {
                fn.apply(ctx, args);
                needInvoke = false;
                timer = global.setTimeout(wrapper, timeout);
            } else {
                timer = null;
            }
        };

        return function () {
            args = arguments;
            ctx || (ctx = this);
            needInvoke = true;

            if (!timer) {
                invokeAsap ? wrapper() : timer = global.setTimeout(wrapper, timeout);
            }
        };
    });
});
/**
 * @module popup
 */

modules.define('popup', ['i-bem__dom', 'objects'], function (provide, BEMDOM, objects, Popup) {

    var VIEWPORT_ACCURACY_FACTOR = 0.99,
        DEFAULT_DIRECTIONS = ['bottom-left', 'bottom-center', 'bottom-right', 'top-left', 'top-center', 'top-right', 'right-top', 'right-center', 'right-bottom', 'left-top', 'left-center', 'left-bottom'],
        win = BEMDOM.win,
        undef;

    /**
     * @exports
     * @class popup
     * @bem
     *
     * @param {Number} [mainOffset=0] offset along the main direction
     * @param {Number} [secondaryOffset=0] offset along the secondary direction
     * @param {Number} [viewportOffset=0] offset from the viewport (window)
     * @param {Array[String]} [directions] allowed directions
     */
    provide(Popup.decl({ modName: 'target' }, /** @lends popup.prototype */{
        onSetMod: {
            'js': {
                'inited': function inited() {
                    this.__base.apply(this, arguments);

                    this._lastDrawingCss = {
                        left: undef,
                        top: undef,
                        zIndex: undef,
                        display: undef
                    };
                }
            },

            'visible': {
                'true': function _true() {
                    this.__base.apply(this, arguments);
                    this.bindToWin('scroll resize', this._onWinScrollAndResize).redraw();
                },

                '': function _() {
                    this.__base.apply(this, arguments);
                    this.unbindFromWin('scroll resize', this._onWinScrollAndResize);
                }
            }
        },

        /**
         * @override
         */
        setContent: function setContent() {
            return this.__base.apply(this, arguments).redraw();
        },

        /**
         * Redraws popup
         * @returns {popup} this
         */
        redraw: function redraw() {
            if (!this.hasMod('visible')) return this;

            var bestDrawingParams = this._calcBestDrawingParams();

            this.setMod('direction', bestDrawingParams.direction);

            var lastDrawingCss = this._lastDrawingCss,
                needUpdateCss = false;

            objects.each(this._calcDrawingCss(bestDrawingParams), function (val, name) {
                if (lastDrawingCss[name] !== val) {
                    lastDrawingCss[name] = val;
                    needUpdateCss = true;
                }
            });

            needUpdateCss && this.domElem.css(lastDrawingCss);

            return this;
        },

        _calcDrawingCss: function _calcDrawingCss(drawingParams) {
            return {
                left: drawingParams.left,
                top: drawingParams.top
            };
        },

        /**
         * Returns possible directions to draw with max available width and height.
         * @returns {Array}
         */
        calcPossibleDrawingParams: function calcPossibleDrawingParams() {
            var target = this._calcTargetDimensions(),
                viewport = this._calcViewportDimensions(),
                params = this.params,
                mainOffset = params.mainOffset,
                secondaryOffset = params.secondaryOffset,
                viewportOffset = params.viewportOffset;

            return this.params.directions.map(function (direction) {
                var subRes = {
                    direction: direction,
                    width: 0,
                    height: 0,
                    left: 0,
                    top: 0
                };

                if (this._checkMainDirection(direction, 'bottom')) {
                    subRes.top = target.top + target.height + mainOffset;
                    subRes.height = viewport.bottom - subRes.top - viewportOffset;
                } else if (this._checkMainDirection(direction, 'top')) {
                    subRes.height = target.top - viewport.top - mainOffset - viewportOffset;
                    subRes.top = target.top - subRes.height - mainOffset;
                } else {
                    if (this._checkSecondaryDirection(direction, 'center')) {
                        subRes.height = viewport.bottom - viewport.top - 2 * viewportOffset;
                        subRes.top = target.top + target.height / 2 - subRes.height / 2;
                    } else if (this._checkSecondaryDirection(direction, 'bottom')) {
                        subRes.height = target.top + target.height - viewport.top - secondaryOffset - viewportOffset;
                        subRes.top = target.top + target.height - subRes.height - secondaryOffset;
                    } else if (this._checkSecondaryDirection(direction, 'top')) {
                        subRes.top = target.top + secondaryOffset;
                        subRes.height = viewport.bottom - subRes.top - viewportOffset;
                    }

                    if (this._checkMainDirection(direction, 'left')) {
                        subRes.width = target.left - viewport.left - mainOffset - viewportOffset;
                        subRes.left = target.left - subRes.width - mainOffset;
                    } else {
                        subRes.left = target.left + target.width + mainOffset;
                        subRes.width = viewport.right - subRes.left - viewportOffset;
                    }
                }

                if (this._checkSecondaryDirection(direction, 'right')) {
                    subRes.width = target.left + target.width - viewport.left - secondaryOffset - viewportOffset;
                    subRes.left = target.left + target.width - subRes.width - secondaryOffset;
                } else if (this._checkSecondaryDirection(direction, 'left')) {
                    subRes.left = target.left + secondaryOffset;
                    subRes.width = viewport.right - subRes.left - viewportOffset;
                } else if (this._checkSecondaryDirection(direction, 'center')) {
                    if (this._checkMainDirection(direction, 'top', 'bottom')) {
                        subRes.width = viewport.right - viewport.left - 2 * viewportOffset;
                        subRes.left = target.left + target.width / 2 - subRes.width / 2;
                    }
                }

                return subRes;
            }, this);
        },

        _calcBestDrawingParams: function _calcBestDrawingParams() {
            var popup = this._calcPopupDimensions(),
                target = this._calcTargetDimensions(),
                viewport = this._calcViewportDimensions(),
                directions = this.params.directions,
                i = 0,
                direction,
                pos,
                viewportFactor,
                bestDirection,
                bestPos,
                bestViewportFactor;

            while (direction = directions[i++]) {
                pos = this._calcPos(direction, target, popup);
                viewportFactor = this._calcViewportFactor(pos, viewport, popup);
                if (i === 1 || viewportFactor > bestViewportFactor || !bestViewportFactor && this.hasMod('direction', direction)) {
                    bestDirection = direction;
                    bestViewportFactor = viewportFactor;
                    bestPos = pos;
                }
                if (bestViewportFactor > VIEWPORT_ACCURACY_FACTOR) break;
            }

            return {
                direction: bestDirection,
                left: bestPos.left,
                top: bestPos.top
            };
        },

        _calcPopupDimensions: function _calcPopupDimensions() {
            var popupWidth = this.domElem.outerWidth(),
                popupHeight = this.domElem.outerHeight();

            return {
                width: popupWidth,
                height: popupHeight,
                area: popupWidth * popupHeight
            };
        },

        /**
         * @abstract
         * @protected
         * @returns {Object}
         */
        _calcTargetDimensions: function _calcTargetDimensions() {},

        _calcViewportDimensions: function _calcViewportDimensions() {
            var winTop = win.scrollTop(),
                winLeft = win.scrollLeft(),
                winWidth = win.width(),
                winHeight = win.height();

            return {
                top: winTop,
                left: winLeft,
                bottom: winTop + winHeight,
                right: winLeft + winWidth
            };
        },

        _calcPos: function _calcPos(direction, target, popup) {
            var res = {},
                mainOffset = this.params.mainOffset,
                secondaryOffset = this.params.secondaryOffset;

            if (this._checkMainDirection(direction, 'bottom')) {
                res.top = target.top + target.height + mainOffset;
            } else if (this._checkMainDirection(direction, 'top')) {
                res.top = target.top - popup.height - mainOffset;
            } else if (this._checkMainDirection(direction, 'left')) {
                res.left = target.left - popup.width - mainOffset;
            } else if (this._checkMainDirection(direction, 'right')) {
                res.left = target.left + target.width + mainOffset;
            }

            if (this._checkSecondaryDirection(direction, 'right')) {
                res.left = target.left + target.width - popup.width - secondaryOffset;
            } else if (this._checkSecondaryDirection(direction, 'left')) {
                res.left = target.left + secondaryOffset;
            } else if (this._checkSecondaryDirection(direction, 'bottom')) {
                res.top = target.top + target.height - popup.height - secondaryOffset;
            } else if (this._checkSecondaryDirection(direction, 'top')) {
                res.top = target.top + secondaryOffset;
            } else if (this._checkSecondaryDirection(direction, 'center')) {
                if (this._checkMainDirection(direction, 'top', 'bottom')) {
                    res.left = target.left + target.width / 2 - popup.width / 2;
                } else if (this._checkMainDirection(direction, 'left', 'right')) {
                    res.top = target.top + target.height / 2 - popup.height / 2;
                }
            }

            return res;
        },

        _calcViewportFactor: function _calcViewportFactor(pos, viewport, popup) {
            var viewportOffset = this.params.viewportOffset,
                intersectionLeft = Math.max(pos.left, viewport.left + viewportOffset),
                intersectionRight = Math.min(pos.left + popup.width, viewport.right - viewportOffset),
                intersectionTop = Math.max(pos.top, viewport.top + viewportOffset),
                intersectionBottom = Math.min(pos.top + popup.height, viewport.bottom - viewportOffset);

            return intersectionLeft < intersectionRight && intersectionTop < intersectionBottom ? // has intersection
            (intersectionRight - intersectionLeft) * (intersectionBottom - intersectionTop) / popup.area : 0;
        },

        _checkMainDirection: function _checkMainDirection(direction, mainDirection1, mainDirection2) {
            return !direction.indexOf(mainDirection1) || mainDirection2 && !direction.indexOf(mainDirection2);
        },

        _checkSecondaryDirection: function _checkSecondaryDirection(direction, secondaryDirection) {
            return ~direction.indexOf('-' + secondaryDirection);
        },

        _onWinScrollAndResize: function _onWinScrollAndResize() {
            this.redraw();
        },

        getDefaultParams: function getDefaultParams() {
            return objects.extend(this.__base.apply(this, arguments), {
                mainOffset: 0,
                secondaryOffset: 0,
                viewportOffset: 0,
                directions: DEFAULT_DIRECTIONS
            });
        }
    }));
});
/**
 * @module popup
 */

modules.define('popup', ['i-bem__dom', 'jquery', 'objects', 'functions__throttle'], function (provide, BEMDOM, $, objects, throttle, Popup) {

    var body = $(BEMDOM.doc[0].body),
        UPDATE_TARGET_VISIBILITY_THROTTLING_INTERVAL = 100,
        undef;

    /**
     * @exports
     * @class popup
     * @bem
     */
    provide(Popup.decl({ modName: 'target', modVal: 'anchor' }, /** @lends popup.prototype */{
        beforeSetMod: {
            'visible': {
                'true': function _true() {
                    if (!this._anchor) throw Error('Can\'t show popup without anchor');
                }
            }
        },

        onSetMod: {
            'js': {
                'inited': function inited() {
                    this.__base.apply(this, arguments);

                    this._anchor = null;
                    this._anchorParents = null;
                    this._destructor = null;
                    this._isAnchorVisible = undef;
                    this._updateIsAnchorVisible = throttle(this._updateIsAnchorVisible, UPDATE_TARGET_VISIBILITY_THROTTLING_INTERVAL, false, this);
                },

                '': function _() {
                    this.__base.apply(this, arguments);
                    this._unbindFromDestructor(); // don't destruct anchor as it might be the same anchor for several popups
                }
            },

            'visible': {
                'true': function _true() {
                    this._anchorParents = this._anchor.parents();
                    this._bindToAnchorParents();

                    this.__base.apply(this, arguments);
                },

                '': function _() {
                    this.__base.apply(this, arguments);

                    this._unbindFromAnchorParents();
                    this._anchorParents = null;
                    this._isAnchorVisible = undef;
                }
            }
        },

        /**
         * Sets target
         * @param {jQuery|BEMDOM} anchor DOM elem or anchor BEMDOM block
         * @returns {popup} this
         */
        setAnchor: function setAnchor(anchor) {
            this._unbindFromAnchorParents()._unbindFromParentPopup()._unbindFromDestructor();

            this._anchor = anchor instanceof BEMDOM ? anchor.domElem : anchor;

            this._destructor = this._anchor.bem('_' + this.__self.getName() + '-destructor');
            this._isAnchorVisible = undef;

            this._bindToDestructor();

            if (this.hasMod('visible')) {
                this._anchorParents = this._anchor.parents();
                this._recaptureZIndex()._bindToAnchorParents()._bindToParentPopup().redraw();
            } else {
                this._anchorParents = null;
                this._zIndexGroupLevel = null;
            }

            return this;
        },

        /**
         * @override
         */
        _calcTargetDimensions: function _calcTargetDimensions() {
            var anchor = this._anchor,
                anchorOffset = anchor.offset(),
                bodyOffset = body.css('position') === 'static' ? { left: 0, top: 0 } : body.offset();

            return {
                left: anchorOffset.left - bodyOffset.left,
                top: anchorOffset.top - bodyOffset.top,
                width: anchor.outerWidth(),
                height: anchor.outerHeight()
            };
        },

        /**
         * @override
         */
        _calcDrawingCss: function _calcDrawingCss(drawingParams) {
            typeof this._isAnchorVisible === 'undefined' && (this._isAnchorVisible = this._calcIsAnchorVisible());

            return objects.extend(this.__base(drawingParams), { display: this._isAnchorVisible ? '' : 'none' });
        },

        /**
         * Calculates target visibility state
         * @private
         * @returns {Boolean} Whether state is visible
         */
        _calcIsAnchorVisible: function _calcIsAnchorVisible() {
            var anchor = this._anchor,
                anchorOffset = anchor.offset(),
                anchorLeft = anchorOffset.left,
                anchorTop = anchorOffset.top,
                anchorRight = anchorLeft + anchor.outerWidth(),
                anchorBottom = anchorTop + anchor.outerHeight(),
                direction = this.getMod('direction'),
                vertBorder = Math.floor(this._checkMainDirection(direction, 'top') || this._checkSecondaryDirection(direction, 'top') ? anchorTop : anchorBottom),
                horizBorder = Math.floor(this._checkMainDirection(direction, 'left') || this._checkSecondaryDirection(direction, 'left') ? anchorLeft : anchorRight),
                res = true;

            this._anchorParents.each(function () {
                if (this.tagName === 'BODY') return false;

                var parent = $(this),
                    overflowY = parent.css('overflow-y'),
                    checkOverflowY = overflowY === 'scroll' || overflowY === 'hidden' || overflowY === 'auto',
                    overflowX = parent.css('overflow-x'),
                    checkOverflowX = overflowX === 'scroll' || overflowX === 'hidden' || overflowX === 'auto';

                if (checkOverflowY || checkOverflowX) {
                    var parentOffset = parent.offset();

                    if (checkOverflowY) {
                        var parentTopOffset = Math.floor(parentOffset.top);
                        if (vertBorder < parentTopOffset || parentTopOffset + parent.outerHeight() < vertBorder) {
                            return res = false;
                        }
                    }

                    if (checkOverflowX) {
                        var parentLeftOffset = Math.floor(parentOffset.left);
                        return res = !(horizBorder < parentLeftOffset || parentLeftOffset + parent.outerWidth() < horizBorder);
                    }
                }
            });

            return res;
        },

        _calcZIndexGroupLevel: function _calcZIndexGroupLevel() {
            var res = this.__base.apply(this, arguments);

            return this._destructor.findBlocksOutside('z-index-group').reduce(function (res, zIndexGroup) {
                return res + Number(zIndexGroup.getMod('level'));
            }, res);
        },

        _bindToAnchorParents: function _bindToAnchorParents() {
            return this.bindTo(this._anchorParents, 'scroll', this._onAnchorParentsScroll);
        },

        _unbindFromAnchorParents: function _unbindFromAnchorParents() {
            this._anchorParents && this.unbindFrom(this._anchorParents, 'scroll', this._onAnchorParentsScroll);
            return this;
        },

        _onAnchorParentsScroll: function _onAnchorParentsScroll() {
            this.redraw()._updateIsAnchorVisible();
        },

        /**
         * @override
         */
        _onWinScrollAndResize: function _onWinScrollAndResize() {
            this.__base.apply(this, arguments);
            this._updateIsAnchorVisible();
        },

        _updateIsAnchorVisible: function _updateIsAnchorVisible() {
            if (!this.hasMod('js', 'inited') || !this.hasMod('visible')) return;

            var isAnchorVisible = this._calcIsAnchorVisible();
            if (isAnchorVisible !== this._isAnchorVisible) {
                this._isAnchorVisible = isAnchorVisible;
                this.redraw();
            }
        },

        _bindToDestructor: function _bindToDestructor() {
            this._destructor.on({ modName: 'js', modVal: '' }, this._onPopupAnchorDestruct, this);
            return this;
        },

        _unbindFromDestructor: function _unbindFromDestructor() {
            this._destructor && this._destructor.un({ modName: 'js', modVal: '' }, this._onPopupAnchorDestruct, this);
            return this;
        },

        _onPopupAnchorDestruct: function _onPopupAnchorDestruct() {
            BEMDOM.destruct(this.domElem);
        },

        _getParentPopup: function _getParentPopup() {
            return this._parentPopup === undef ? this._parentPopup = this.findBlockOutside(this._anchor, this.__self.getName()) : this._parentPopup;
        }
    }));
});
/**
 * @module select
 */

modules.define('select', ['i-bem__dom', 'popup', 'menu', 'menu-item', 'button', 'jquery', 'dom', 'keyboard__codes', 'strings__escape'], function (provide, BEMDOM, Popup, Menu, MenuItem, Button, $, dom, keyCodes, escape) {

    /**
     * @exports
     * @class select
     * @bem
     *
     * @bemmod opened Represents opened state
     */
    provide(BEMDOM.decl(this.name, /** @lends select.prototype */{
        beforeSetMod: {
            'opened': {
                'true': function _true() {
                    return !this.hasMod('disabled');
                }
            },

            'focused': {
                '': function _() {
                    return !this._isPointerPressInProgress;
                }
            }
        },

        onSetMod: {
            'js': {
                'inited': function inited() {
                    this._button = this.findBlockInside('button').on('click', this._onButtonClick, this);

                    this._popup = this.findBlockInside('popup').setAnchor(this._button).on({ modName: 'visible', modVal: '' }, this._onPopupHide, this);

                    this._menu = this._popup.findBlockInside('menu').on({
                        'change': this._onMenuChange,
                        'item-click': this._onMenuItemClick,
                        'item-hover': this._onMenuItemHover
                    }, this);

                    this._isPointerPressInProgress = false;
                    this._buttonWidth = null;

                    this.hasMod('focused') && this._focus();
                }
            },

            'focused': {
                'true': function _true() {
                    this._focus();
                },

                '': function _() {
                    this._blur();
                }
            },

            'opened': {
                '*': function _(_2, modVal) {
                    this._menu.setMod('focused', modVal);
                },

                'true': function _true() {
                    this._buttonWidth === null && this._updateMenuWidth();

                    this._updateMenuHeight();
                    this._popup.setMod('visible');
                    this.bindToDoc('pointerpress', this._onDocPointerPress).setMod('focused')._hoverCheckedOrFirstItem();
                },

                '': function _() {
                    this.unbindFromDoc('pointerpress', this._onDocPointerPress)._popup.delMod('visible');
                }
            },

            'disabled': {
                '*': function _(modName, modVal) {
                    this._button.setMod(modName, modVal);
                    this._menu.setMod(modName, modVal);
                },

                'true': function _true() {
                    this.elem('control').attr('disabled', true);
                    this._popup.delMod('visible');
                },

                '': function _() {
                    this.elem('control').removeAttr('disabled');
                }
            }
        },

        /**
         * Get value
         * @returns {*}
         */
        getVal: function getVal() {
            return this._menu.getVal();
        },

        /**
         * Set value
         * @param {*} val
         * @returns {select} this
         */
        setVal: function setVal(val) {
            this._menu.setVal(val);
            return this;
        },

        /**
         * Get name
         * @returns {String}
         */
        getName: function getName() {
            return this.params.name;
        },

        getDefaultParams: function getDefaultParams() {
            return {
                optionsMaxHeight: Number.POSITIVE_INFINITY
            };
        },

        _focus: function _focus() {
            this.bindTo('button', {
                keydown: this._onKeyDown,
                keypress: this._onKeyPress
            })._button.setMod('focused');
        },

        _blur: function _blur() {
            this.unbindFrom('button', {
                keydown: this._onKeyDown,
                keypress: this._onKeyPress
            }).delMod('opened')._button.delMod('focused');
        },

        _updateMenuWidth: function _updateMenuWidth() {
            this._menu.domElem.css('min-width', this._buttonWidth = this._button.domElem.outerWidth());

            this._popup.redraw();
        },

        _updateMenuHeight: function _updateMenuHeight() {
            var drawingParams = this._popup.calcPossibleDrawingParams(),
                menuDomElem = this._menu.domElem,
                menuWidth = menuDomElem.outerWidth(),
                bestHeight = 0;

            drawingParams.forEach(function (params) {
                params.width >= menuWidth && params.height > bestHeight && (bestHeight = params.height);
            });

            bestHeight && menuDomElem.css('max-height', Math.min(this.params.optionsMaxHeight, bestHeight));
        },

        _getCheckedItems: function _getCheckedItems() {
            return this._menu.getItems().filter(function (item) {
                return item.hasMod('checked');
            });
        },

        _hoverCheckedOrFirstItem: function _hoverCheckedOrFirstItem() {
            // NOTE: may be it should be moved to menu
            (this._getCheckedItems()[0] || this._menu.getItems()[0]).setMod('hovered');
        },

        _onKeyDown: function _onKeyDown(e) {
            if (this.hasMod('opened')) {
                if (e.keyCode === keyCodes.ESC) {
                    // NOTE: stop propagation to prevent from being listened by global handlers
                    e.stopPropagation();
                    this.delMod('opened');
                }
            } else if ((e.keyCode === keyCodes.UP || e.keyCode === keyCodes.DOWN) && !e.shiftKey) {
                e.preventDefault();
                this.setMod('opened');
            }
        },

        _onKeyPress: function _onKeyPress(e) {
            // press a key: closed select - set value, opened select - set hover on menu-item.
            if (!this.hasMod('opened')) {
                var item = this._menu.searchItemByKeyboardEvent(e);
                item && this._setSingleVal(item.getVal());
            }
        },

        _setSingleVal: function _setSingleVal(value) {
            this.setVal(value);
        },

        _onMenuChange: function _onMenuChange() {
            this._updateControl();
            this._updateButton();

            this.hasMod('opened') ? this._updateMenuWidth() : this._buttonWidth = null;

            this.emit('change');
        },

        _onMenuItemClick: function _onMenuItemClick() {},

        _onMenuItemHover: function _onMenuItemHover(e, data) {
            var item = data.item;
            item.hasMod('hovered') ? this._button.domElem.attr('aria-activedescendant', item.domElem.attr('id')) : this._button.domElem.removeAttr('aria-activedescendant');
        },

        _updateControl: function _updateControl() {},

        _updateButton: function _updateButton() {},

        _onButtonClick: function _onButtonClick() {
            this.toggleMod('opened');
        },

        _onButtonFocusChange: function _onButtonFocusChange(e, data) {
            this.setMod('focused', data.modVal);
        },

        _onPopupHide: function _onPopupHide() {
            this.delMod('opened');
        },

        _onDocPointerPress: function _onDocPointerPress(e) {
            if (this._isEventInPopup(e)) {
                e.pointerType === 'mouse' && e.preventDefault(); // prevents button blur in most desktop browsers
                this._isPointerPressInProgress = true;
                this.bindToDoc('pointerrelease', { focusedHardMod: this._button.getMod('focused-hard') }, this._onDocPointerRelease);
            }
        },

        _onDocPointerRelease: function _onDocPointerRelease(e) {
            this._isPointerPressInProgress = false;
            this.unbindFromDoc('pointerrelease', this._onDocPointerRelease)._button.toggleMod('focused', true, '', this._isEventInPopup(e)).setMod('focused-hard', e.data.focusedHardMod);
        },

        _isEventInPopup: function _isEventInPopup(e) {
            return dom.contains(this._popup.domElem, $(e.target));
        }
    }, /** @lends select */{
        live: function live() {
            this.liveInitOnBlockInsideEvent({ modName: 'focused', modVal: '*' }, 'button', this.prototype._onButtonFocusChange);
        },

        _createControlHTML: function _createControlHTML(name, val) {
            // Using string concatenation to not depend on template engines
            return '<input ' + 'type="hidden" ' + 'name="' + name + '" ' + 'class="' + this.buildClass('control') + '" ' + 'value="' + escape.attr(val) + '"/>';
        }
    }));
});
/**
 * @module select
 */
modules.define('select', ['i-bem__dom', 'BEMHTML', 'jquery'], function (provide, BEMDOM, BEMHTML, $) {
	/**
  * @exports
  * @class select
  * @bem
  *
  * @bemmod opened Represents opened state
  */
	provide(BEMDOM.decl(this.name, /** @lends select.prototype */{

		onSetMod: {
			'js': {
				'inited': function inited() {
					this.__base.apply(this, arguments);

					/**
      * Всплывающие тултипы к текущему селекту.
      * Может хранить блок tooltip для ошибки и для подсказки.
      *
      * @private
      * @type {Object}
      */
					this._tooltips = {
						error: null,
						hint: null
					};

					this._menu.on({
						'item-click': this._onSelectMenuItemClick
					}, this);
				}
			},

			'disable-default': {
				'yes': function yes() {
					var checkedItem = this._menu.getItems().find(function (item) {
						return item.hasMod('default');
					});
					checkedItem && checkedItem.setMod('disabled', true);
				}
			},

			'focused': {
				'true': function _true() {
					this.__base.apply(this, arguments);
					this.hideErrorTip();
				}
			}
		},

		/**
   * Устанавливает и получает значение
   *
   * @deprecated добавлен для обратной совместимости
   * @param {Object} value значение
   * @returns {*}
   */
		val: function val(value) {
			if (typeof value === 'undefined') {
				return this.getVal();
			}

			this.setVal(value);
			return this;
		},
		_onSelectMenuItemClick: function _onSelectMenuItemClick(e, data) {
			this.__base.apply(this, arguments);
			this._changeIcon(e, data);
		},


		/**
   * Смена иконки
   *
   * @param {Object} e событие клика по menu-item
   * @param {?Object} data данные об menu-item
   * @protected
   */
		_changeIcon: function _changeIcon(e, data) {
			var menu = this._menu;
			var button = this._button;
			var items = menu.getItems();

			var item = items.filter(function (item) {
				return item === data.item;
			}).shift();

			var icon = item && item.findBlockInside('icon');
			var image = item && item.findBlockInside('image');

			var iconLeft = button.findElem('icon', 'side', 'left');

			var mods = void 0;
			var buttonIcon = void 0;

			if (icon) {
				if (!iconLeft.length) {
					button.domElem.prepend(this._buildLeftIcon());
					iconLeft = button.findElem('icon', 'side', 'left');
				}

				buttonIcon = button.findBlockInside(iconLeft, image ? 'image' : 'icon');

				mods = image ? image.getMods() : icon.getMods();
				delete mods.js;
				Object.keys(mods).forEach(function (modName) {
					buttonIcon.setMod(modName, mods[modName]);
				});
			} else if (iconLeft.length) {
				// Удаляем из-за отступов на иконке.
				iconLeft.remove();
			}
		},
		_buildLeftIcon: function _buildLeftIcon() {
			return BEMHTML.apply({
				block: 'button',
				mix: {
					block: 'icon'
				},
				elem: 'icon',
				elemMods: {
					side: 'left'
				}
			});
		},


		/**
   * Показывает всплывающий тултип
   *
   * @private
   * @param {Object} options Опции для показа
   * @param {String} options.type Тип тултипа - 'error' или 'hint'
   * @param {string} [options.theme='ffffff'] Тема тултипа.
   */
		_showTip: function _showTip(options) {
			var type = options.type;
			var tipContent = options.content;

			if (!this._tooltips[type]) {
				var tooltipTheme = type === 'error' ? 'error' : 'normal';
				var isAutoclosable = type !== 'error';
				var customTip = this.hasMod('customTip') ? this.getMod('customTip') : '';
				var tooltipOffset = this.params.tipOffset || 3;
				var tooltipAxis = this.params.tipAxis || 'top';
				tooltipAxis = tooltipAxis === 'middle' ? 'center' : tooltipAxis;
				var tooltipSize = this.params.tooltipSize ? this.params.tooltipSize : this.getMod('size');

				var tooltipHtml = BEMHTML.apply({
					block: 'tooltip',
					mods: {
						theme: tooltipTheme,
						size: tooltipSize,
						autoclosable: isAutoclosable,
						custom: customTip
					},
					js: {
						offset: tooltipOffset,
						directions: this.params.tipDirections || ['right'],
						axis: tooltipAxis
					},
					content: tipContent
				});

				var $tooltip = $(tooltipHtml).insertBefore(this.domElem);
				BEMDOM.init($tooltip);

				this._tooltips[type] = $tooltip.bem('tooltip');
			}

			// Без _getPopup() не будет обновляться содержимое тултипа
			this._tooltips[type].setContent(tipContent);
			this._tooltips[type].setOwner(this.elem('button')).setMod('visible');
		},


		/**
   * Скрывает всплывающий тултип
   *
   * @private
   * @param {Object} options Опции для показа
   * @param {String} options.type Тип тултипа - 'error' или 'hint'
   */
		_hideTip: function _hideTip(options) {
			this._tooltips[options.type] && this._tooltips[options.type].delMod('visible');
		},


		/**
   * Показывает всплывающую ошибку
   *
   * @public
   * @param {String} content Содержимое ошибки
   */
		showErrorTip: function showErrorTip(content) {
			this._showTip({
				type: 'error',
				theme: 'error',
				content: content
			});
		},


		/**
   * Скрывает всплывающую ошибку
   *
   * @public
   */
		hideErrorTip: function hideErrorTip() {
			this._hideTip({ type: 'error' });
		},


		/**
   * Показывает всплывающую подсказку
   *
   * @public
   * @param {object} params Параметры подсказки.
   * @param {string} params.content Содержимое подсказки.
   * @param {string} [params.theme] Тема подсказки.
   */
		showHintTip: function showHintTip(params) {
			this._showTip({
				type: 'hint',
				theme: params.theme,
				content: params.content
			});
		},


		/**
   * Скрывает всплывающую подсказку
   *
   * @public
   */
		hideHintTip: function hideHintTip() {
			this._hideTip({ type: 'hint' });
		},


		/**
   * Возвращает индекс выбранного элемента
  *
  * @returns {Number} Индекс
  *
  * @public
  */
		getSelectedIndex: function getSelectedIndex() {
			var selected = this._menu.findBlockInside({
				block: 'menu-item',
				modName: 'checked',
				modVal: true
			});
			return this._menu.getItems().indexOf(selected);
		},


		/**
   * Устанавливает первый доступный вариант в качестве выбранного
   *
   * @public
   */
		resetSelectedItem: function resetSelectedItem() {
			var _this = this;

			var items = this._menu.getItems();
			$.each(items, function (index, item) {
				var bItemDisabled = item.hasMod('disabled');
				var bItemVisibility = _this.findBlockOn(item.domElem, 'visibility');
				if (bItemVisibility && !bItemVisibility.hasMod('hidden') || !bItemDisabled) {
					_this.setSelectedIndex(index);

					return false;
				}
			});
		},


		/**
   * Задаёт выбранный элемент и обновляет текст на кнопке
   *
   * @param {Number} index Индекс элемента
   *
   * @public
   */
		setSelectedIndex: function setSelectedIndex(index) {
			this._menu.getItems()[index].domElem.trigger('click');
		},


		/**
  * Переключает видимость и доступность item'а в зависимости от условия
  *
  * @param {Number} index Индекс
  * @param {Boolean} condition Условие
  *
  * @public
  */
		toggleItem: function toggleItem(index, condition) {
			var item = this._menu.getItems()[index];

			if (item) {
				item.toggleMod('disabled', true, condition);
				item.findBlockOn('visibility') && item.findBlockOn('visibility').toggleMod('hidden', 'yes', '', condition);
			}
		}
	}));
});
/**
 * @module menu
 */

modules.define('menu', ['i-bem__dom', 'control', 'keyboard__codes', 'menu-item'], function (provide, BEMDOM, Control, keyCodes) {

    /** @const Number */
    var TIMEOUT_KEYBOARD_SEARCH = 1500;

    /**
     * @exports
     * @class menu
     * @augments control
     * @bem
     */
    provide(BEMDOM.decl({ block: this.name, baseBlock: Control }, /** @lends menu.prototype */{
        onSetMod: {
            'js': {
                'inited': function inited() {
                    this.__base.apply(this, arguments);
                    this._hoveredItem = null;
                    this._items = null;

                    this._lastTyping = {
                        char: '',
                        text: '',
                        index: 0,
                        time: 0
                    };
                }
            },

            'disabled': {
                '*': function _(modName, modVal) {
                    this.__base.apply(this, arguments);
                    this.getItems().forEach(function (menuItem) {
                        menuItem.setMod(modName, modVal);
                    });
                },
                'true': function _true() {
                    this.__base.apply(this, arguments);
                    this.domElem.attr('aria-disabled', true);
                },
                '': function _() {
                    this.__base.apply(this, arguments);
                    this.domElem.removeAttr('aria-disabled');
                }
            }
        },

        /**
         * Returns items
         * @returns {menu-item[]}
         */
        getItems: function getItems() {
            return this._items || (this._items = this.findBlocksInside('menu-item'));
        },

        /**
         * Sets content
         * @param {String|jQuery} content
         * @returns {menu} this
         */
        setContent: function setContent(content) {
            BEMDOM.update(this.domElem, content);
            this._hoveredItem = null;
            this._items = null;
            return this;
        },

        /**
         * Search menu item by keyboard event
         * @param {jQuery.Event} e
         * @returns {menu-item}
         */
        searchItemByKeyboardEvent: function searchItemByKeyboardEvent(e) {
            var currentTime = +new Date(),
                charCode = e.charCode,
                char = String.fromCharCode(charCode).toLowerCase(),
                lastTyping = this._lastTyping,
                index = lastTyping.index,
                isSameChar = char === lastTyping.char && lastTyping.text.length === 1,
                items = this.getItems();

            if (charCode <= keyCodes.SPACE || e.ctrlKey || e.altKey || e.metaKey) {
                lastTyping.time = currentTime;
                return null;
            }

            if (currentTime - lastTyping.time > TIMEOUT_KEYBOARD_SEARCH || isSameChar) {
                lastTyping.text = char;
            } else {
                lastTyping.text += char;
            }

            lastTyping.char = char;
            lastTyping.time = currentTime;

            // If key is pressed again, then continue to search to next menu item
            if (isSameChar && items[index].getText().search(lastTyping.char) === 0) {
                index = index >= items.length - 1 ? 0 : index + 1;
            }

            // 2 passes: from index to items.length and from 0 to index.
            var i = index,
                len = items.length;
            while (i < len) {
                if (this._doesItemMatchText(items[i], lastTyping.text)) {
                    lastTyping.index = i;
                    return items[i];
                }

                i++;

                if (i === items.length) {
                    i = 0;
                    len = index;
                }
            }

            return null;
        },

        /** @override **/
        _onFocus: function _onFocus() {
            this.__base.apply(this, arguments);
            this.bindToDoc('keydown', this._onKeyDown) // NOTE: should be called after __base
            .bindToDoc('keypress', this._onKeyPress);
        },

        /** @override **/
        _onBlur: function _onBlur() {
            this.unbindFromDoc('keydown', this._onKeyDown).unbindFromDoc('keypress', this._onKeyPress).__base.apply(this, arguments);
            this._hoveredItem && this._hoveredItem.delMod('hovered');
        },

        /**
         * @param {Object} item
         * @private
         */
        _onItemHover: function _onItemHover(item) {
            if (item.hasMod('hovered')) {
                this._hoveredItem && this._hoveredItem.delMod('hovered');
                this._scrollToItem(this._hoveredItem = item);
                this.domElem.attr('aria-activedescendant', item.domElem.attr('id'));
            } else if (this._hoveredItem === item) {
                this._hoveredItem = null;
                this.domElem.removeAttr('aria-activedescendant');
            }
            this.emit('item-hover', { item: item });
        },

        /**
         * @param {Object} item
         * @private
         */
        _scrollToItem: function _scrollToItem(item) {
            var domElemOffsetTop = this.domElem.offset().top,
                itemDomElemOffsetTop = item.domElem.offset().top,
                relativeScroll;

            if ((relativeScroll = itemDomElemOffsetTop - domElemOffsetTop) < 0 || (relativeScroll = itemDomElemOffsetTop + item.domElem.outerHeight() - domElemOffsetTop - this.domElem.outerHeight()) > 0) {
                this.domElem.scrollTop(this.domElem.scrollTop() + relativeScroll);
            }
        },

        /**
         * @param {Object} item
         * @param {Object} data
         * @private
         */
        _onItemClick: function _onItemClick(item, data) {
            this.emit('item-click', { item: item, source: data.source });
        },

        /**
         * @param {jQuery.Event} e
         * @private
         */
        _onKeyDown: function _onKeyDown(e) {
            var keyCode = e.keyCode,
                isArrow = keyCode === keyCodes.UP || keyCode === keyCodes.DOWN;

            if (isArrow && !e.shiftKey) {
                e.preventDefault();

                var dir = keyCode - 39,
                    // using the features of key codes for "up"/"down" ;-)
                items = this.getItems(),
                    len = items.length,
                    hoveredIdx = items.indexOf(this._hoveredItem),
                    nextIdx = hoveredIdx,
                    i = 0;

                do {
                    nextIdx += dir;
                    nextIdx = nextIdx < 0 ? len - 1 : nextIdx >= len ? 0 : nextIdx;
                    if (++i === len) return; // if we have no next item to hover
                } while (items[nextIdx].hasMod('disabled'));

                this._lastTyping.index = nextIdx;

                items[nextIdx].setMod('hovered');
            }
        },

        /**
         * @param {jQuery.Event} e
         * @private
         */
        _onKeyPress: function _onKeyPress(e) {
            var item = this.searchItemByKeyboardEvent(e);
            item && item.setMod('hovered');
        },

        /**
         * @param {Object} item
         * @param {String} text
         * @private
         */
        _doesItemMatchText: function _doesItemMatchText(item, text) {
            return !item.hasMod('disabled') && item.getText().toLowerCase().search(text) === 0;
        }
    }, /** @lends menu */{
        live: function live() {
            this.liveInitOnBlockInsideEvent({ modName: 'hovered', modVal: '*' }, 'menu-item', function (e) {
                this._onItemHover(e.target);
            }).liveInitOnBlockInsideEvent('click', 'menu-item', function (e, data) {
                this._onItemClick(e.target, data);
            });

            return this.__base.apply(this, arguments);
        }
    }));
});
/**
 * @module menu-item
 */

modules.define('menu-item', ['i-bem__dom'], function (provide, BEMDOM) {

    /**
     * @exports
     * @class menu-item
     * @bem
     *
     * @param val Value of item
     */
    provide(BEMDOM.decl(this.name, /** @lends menu-item.prototype */{
        beforeSetMod: {
            'hovered': {
                'true': function _true() {
                    return !this.hasMod('disabled');
                }
            }
        },

        onSetMod: {
            'js': {
                'inited': function inited() {
                    this.bindTo('pointerleave', this._onPointerLeave);
                }
            },

            'disabled': {
                'true': function _true() {
                    this.delMod('hovered').domElem.attr('aria-disabled', true);
                },
                '': function _() {
                    this.domElem.removeAttr('aria-disabled');
                }
            },

            'checked': {
                '*': function _(_2, modVal) {
                    this.domElem.attr('aria-checked', !!modVal);
                }
            }
        },

        /**
         * Checks whether given value is equal to current value
         * @param {String|Number} val
         * @returns {Boolean}
         */
        isValEq: function isValEq(val) {
            // NOTE: String(true) == String(1) -> false
            return String(this.params.val) === String(val);
        },

        /**
         * Returns item value
         * @returns {*}
         */
        getVal: function getVal() {
            return this.params.val;
        },

        /**
         * Returns item text
         * @returns {String}
         */
        getText: function getText() {
            return this.params.text || this.domElem.text();
        },

        _onPointerOver: function _onPointerOver() {
            this.setMod('hovered');
        },

        _onPointerLeave: function _onPointerLeave() {
            this.delMod('hovered');
        },

        _onPointerClick: function _onPointerClick() {
            this.hasMod('disabled') || this.emit('click', { source: 'pointer' });
        }
    }, /** @lends menu-item */{
        live: function live() {
            var ptp = this.prototype;
            this.liveBindTo('pointerover', ptp._onPointerOver).liveBindTo('pointerclick', ptp._onPointerClick);
        }
    }));
});
/**
 * @module popup
 */

modules.define('popup', ['jquery', 'i-bem__dom', 'ua', 'dom', 'keyboard__codes'], function (provide, $, BEMDOM, ua, dom, keyCodes, Popup) {

    var KEYDOWN_EVENT = ua.opera && ua.version < 12.10 ? 'keypress' : 'keydown',
        visiblePopupsStack = [];

    /**
     * @exports
     * @class popup
     * @bem
     */
    provide(Popup.decl({ modName: 'autoclosable', modVal: true }, /** @lends popup.prototype */{
        onSetMod: {
            'visible': {
                'true': function _true() {
                    visiblePopupsStack.unshift(this);
                    this
                    // NOTE: nextTick because of event bubbling to document
                    .nextTick(function () {
                        this.bindToDoc('pointerclick', this._onDocPointerClick);
                    }).__base.apply(this, arguments);
                },

                '': function _() {
                    visiblePopupsStack.splice(visiblePopupsStack.indexOf(this), 1);
                    this.unbindFromDoc('pointerclick', this._onDocPointerClick).__base.apply(this, arguments);
                }
            }
        },

        _onDocPointerClick: function _onDocPointerClick(e) {
            if (this.hasMod('target', 'anchor') && dom.contains(this._anchor, $(e.target))) return;

            this._preventHideByClick ? this._preventHideByClick = null : this.delMod('visible');
        }
    }, /** @lends popup */{
        live: function live() {
            BEMDOM.doc.on(KEYDOWN_EVENT, onDocKeyPress);
        }
    }));

    function onDocKeyPress(e) {
        e.keyCode === keyCodes.ESC &&
        // omit ESC in inputs, selects and etc.
        visiblePopupsStack.length && !dom.isEditable($(e.target)) && visiblePopupsStack[0].delMod('visible');
    }
});
/**
 * @module strings__escape
 * @description A set of string escaping functions
 */

modules.define('strings__escape', function (provide) {

    var symbols = {
        '"': '&quot;',
        '\'': '&apos;',
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;'
    },
        mapSymbol = function mapSymbol(s) {
        return symbols[s] || s;
    },
        buildEscape = function buildEscape(regexp) {
        regexp = new RegExp(regexp, 'g');
        return function (str) {
            return ('' + str).replace(regexp, mapSymbol);
        };
    };

    provide( /** @exports */{
        /**
         * Escape string to use in XML
         * @type Function
         * @param {String} str
         * @returns {String}
         */
        xml: buildEscape('[&<>]'),

        /**
         * Escape string to use in HTML
         * @type Function
         * @param {String} str
         * @returns {String}
         */
        html: buildEscape('[&<>]'),

        /**
         * Escape string to use in attributes
         * @type Function
         * @param {String} str
         * @returns {String}
         */
        attr: buildEscape('["\'&<>]')
    });
});
/**
 * @module menu
 */

modules.define('menu', ['keyboard__codes'], function (provide, keyCodes, Menu) {

    /**
     * @exports
     * @class menu
     * @bem
     */
    provide(Menu.decl({ modName: 'mode' }, /** @lends menu.prototype */{
        onSetMod: {
            'js': {
                'inited': function inited() {
                    this.__base.apply(this, arguments);
                    this._val = null;
                    this._isValValid = false;
                }
            }
        },

        _onKeyDown: function _onKeyDown(e) {
            if (e.keyCode === keyCodes.ENTER || e.keyCode === keyCodes.SPACE) {
                this.unbindFromDoc('keydown', this._onKeyDown).bindToDoc('keyup', this._onKeyUp);

                e.keyCode === keyCodes.SPACE && e.preventDefault();
                this._onItemClick(this._hoveredItem, { source: 'keyboard' });
            }
            this.__base.apply(this, arguments);
        },

        _onKeyUp: function _onKeyUp() {
            this.unbindFromDoc('keyup', this._onKeyUp);
            // it could be unfocused while is key being pressed
            this.hasMod('focused') && this.bindToDoc('keydown', this._onKeyDown);
        },

        /**
         * Returns menu value
         * @returns {*}
         */
        getVal: function getVal() {
            if (!this._isValValid) {
                this._val = this._getVal();
                this._isValValid = true;
            }
            return this._val;
        },

        /**
         * @abstract
         * @protected
         * @returns {*}
         */
        _getVal: function _getVal() {
            throw Error('_getVal is not implemented');
        },

        /**
         * Sets menu value
         * @param {*} val
         * @returns {menu} this
         */
        setVal: function setVal(val) {
            if (this._setVal(val)) {
                this._val = val;
                this._isValValid = true;
                this.emit('change');
            }
            return this;
        },

        /**
         * @abstract
         * @protected
         * @param {*} val
         * @returns {Boolean} returns true if value was changed
         */
        _setVal: function _setVal() {
            throw Error('_setVal is not implemented');
        },

        _updateItemsCheckedMod: function _updateItemsCheckedMod(modVals) {
            var items = this.getItems();
            modVals.forEach(function (modVal, i) {
                items[i].setMod('checked', modVal);
            });
        },

        /**
         * Sets content
         * @override
         */
        setContent: function setContent() {
            var res = this.__base.apply(this, arguments);
            this._isValValid = false;
            this.emit('change'); // NOTE: potentially unwanted event could be emitted
            return res;
        }
    }));
});
/**
 * @module checkbox
 */

modules.define('checkbox', ['i-bem__dom', 'control'], function (provide, BEMDOM, Control) {

    /**
     * @exports
     * @class checkbox
     * @augments control
     * @bem
     */
    provide(BEMDOM.decl({ block: this.name, baseBlock: Control }, /** @lends checkbox.prototype */{
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
            this.setMod('checked', this.elem('control').prop('checked'));
        }
    }, /** @lends checkbox */{
        live: function live() {
            this.liveBindTo('control', 'change', this.prototype._onChange);
            return this.__base.apply(this, arguments);
        }
    }));
});
/**
 * @module checkbox
 */
modules.define('checkbox', ['i-bem__dom'], function (provide, BEMDOM) {
	/**
  * @exports
  * @class checkbox
  * @bem
  */
	provide(BEMDOM.decl(this.name, /** @lends checkbox.prototype */{
		onSetMod: {
			js: {
				inited: function inited() {
					this.__base.apply(this, arguments);

					this._onLinkClick();
				}
			},

			/**
    * Переопределяем библиотечную логику: триггерим событие change,
    * чтобы поддержать обратную совместимость
    */
			checked: {
				'true': function _true() {
					this.elem('control').attr('checked', true).prop('checked', true);

					this.emit('change', { checked: true });
				},
				'': function _() {
					this.elem('control').removeAttr('checked').prop('checked', false);

					this.emit('change', { checked: false });
				}
			}
		},

		/**
   * Предотвращает всплытие события при клике на ссылку или кнопку в контенте
   *
   * @private
   */
		_onLinkClick: function _onLinkClick() {
			this.domElem.on('click', '.link, .button', function (e) {
				e.stopPropagation();
			});
		},


		/**
   * Сокращенная форма для проверки модификатора `_disabled`.
   * (Дополняем библиотечную логику, чтобы поддержатать обратную совместимость)
   *
   * @public
   * @returns {Boolean}
   */
		isDisabled: function isDisabled() {
			return this.hasMod('disabled');
		},


		/**
   * Сокращенная форма для проверки модификатора `_checked`.
   * (Дополняем библиотечную логику, чтобы поддержатать обратную совместимость)
   *
   * @public
   * @returns {Boolean}
   */
		isChecked: function isChecked() {
			return this.hasMod('checked');
		}
	}));
});
/**
 * @module label
 */
modules.define('label', ['i-bem__dom'], function (provide, BEMDOM) {
	/**
  * @exports
  * @class label
  * @bem
  */
	provide(BEMDOM.decl(this.name, /** @lends label.prototype */{
		onSetMod: {
			js: {
				inited: function inited() {
					this.__base.apply(this, arguments);
				}
			},

			/**
    * Модификатор неактивности метки
    */
			disabled: {
				true: function _true() {
					this.domElem.attr('for', '');
				},
				yes: function yes() {
					this.setMod('disabled');
				},
				'': function _() {
					this.domElem.attr('for', this.params.for);
				}
			}
		}
	}));
});
/**
 * @module promo-header
 */
modules.define('promo-header', ['i-bem__dom', 'lodash', 'jquery'], function (provide, BEMDOM, _, $) {
	/**
     * @exports
     * @class promo-header
     * @bem
     */
	provide(BEMDOM.decl(this.name, /** @lends block-name.prototype */{
		onSetMod: {
			js: function js() {
				if (this.params.goalName) {
					this._reachGoal(this.params.goalName);
				}

				if (this.params.rStr && window.r) {
					window.r(this.params.rStr);
				}

				this._onClose();

				this._show();
			}
		},

		/**
   * Показывает шапку
   *
   * @private
   */
		_show: function _show() {
			var _this = this;

			window.setTimeout(function () {
				_this.domElem.slideDown('slow', function () {
					_this._triggerChangeEvent();
				});
			}, 700);
		},


		/**
   * Вызов цели. Для ноды и xsript.
   *
   * @param {string} goalName Имя цели
   * @private
   */
		_reachGoal: function _reachGoal(goalName) {
			var bPage = this.findBlockOutside('b-page') || this.findBlockOutside('page');
			var bStat;

			if (bPage) {
				bStat = bPage.findBlockInside('stat-scripts');
			}

			// Вызов метрки на ноде
			if (bStat) {
				bStat.customYandexMetricsGoal(goalName);
				return;
			}
		},


		/**
   * Обработчик DOM-события `click` на крестик закрытия
   *
   * @param {Function} callback Метод, который будет вызван в обработчике закрытия шапки
   * @private
   */
		_onClose: function _onClose(callback) {
			var _this2 = this;

			this.bindTo('close', 'click touchstart', function () {
				_this2.close(_this2._afterClose.bind(_this2, callback));
			});
		},


		/**
   * После окончания анимации установка флага закрытия, удаление блока и выполнение колбэка, если есть
   *
   * @param {Function} callback Метод, который будет вызван после окончания анимации установки флага закрытия
   * @private
   */
		_afterClose: function _afterClose(callback) {
			if (_.isFunction(callback)) {
				callback();
			}

			this._setClosingParams();

			this._triggerChangeEvent();
			BEMDOM.destruct(this.domElem);
		},


		/**
   * Устанавливает признак закрытия шапки
   *
   * @private
   */
		_setClosingParams: function _setClosingParams() {
			if (this.params.setFlagUrl) {
				$.ajax({
					url: this.params.setFlagUrl
				});
			}
		},


		/**
   * Триггерит события изменения страницы
   *
   * @private
   */
		_triggerChangeEvent: function _triggerChangeEvent() {
			var bPage = this.findBlockOutside('b-page');
			// триггерим событие для перерисовки попапов
			bPage && bPage.emit('change');
		},


		/**
   * Закрывает шапку
   *
   * @public
   * @param {Function} [callback] функция, которая выполнится после скрытия шапки
   */
		close: function close(callback) {
			callback = callback || _.noop();
			this.domElem.slideUp('slow', callback);
		}
	}));
});
/**
 * @module promo-header
 */
modules.define('promo-header', ['i-bem__dom', 'BEMHTML', 'jquery'], function (provide, BEMDOM, BEMHTML, $) {
	/**
  * @exports
  * @class promo-header
  * @bem
  */
	provide(BEMDOM.decl({
		block: this.name, modName: 'id', modVal: 'inactive'
	}, /** @lends promo-header.prototype */{
		onSetMod: {
			js: function js() {
				var _this = this;

				this.__base.apply(this, arguments);

				var inactiveResultButton = this.findBlockInside({
					block: 'button',
					modName: 'name',
					modVal: 'inactiveResultButton'
				});
				inactiveResultButton && inactiveResultButton.on('click', function () {
					return _this._onClick();
				});
			}
		},

		/**
   * Обработчик клика по кнопке
   *
   * @private
   */
		_onClick: function _onClick() {
			var _this2 = this;

			$.ajax({
				url: this.params.ajaxUrl,
				xhrFields: {
					withCredentials: true
				},
				success: function success(data) {
					if (data.status === 'success') {
						_this2._onResponseSuccess();
						return;
					}
					_this2._onResponseError();
				},
				error: function error() {
					return _this2._onResponseError();
				}
			});
		},


		/**
   * Возвращает размер кнопки в зависимости от параметров
   *
   * @private
   * @returns {String}
   */
		_getControlButtonSize: function _getControlButtonSize() {
			return this.params.layout === 'column' ? 'm' : 'ml';
		},


		/**
   * Возвращает mix для кнопок
   *
   * @private
   * @returns {Object}
   */
		_getControlButtonMix: function _getControlButtonMix() {
			return {
				block: 'promo-header',
				elem: 'control',
				elemMods: {
					layout: this.params.layout
				}
			};
		},


		/**
   * Показывает шапку успеха
   *
   * @private
   */
		_onResponseSuccess: function _onResponseSuccess() {
			var content = BEMHTML.apply({
				block: 'promo-header',
				mods: { type: 'success', id: 'inactive' },
				js: {
					name: 'inactive'
				},
				logo: true,
				title: BEM.I18N('promo-header', 'inactive-success-title'),
				text: BEM.I18N('promo-header', 'inactive-success-text'),
				control: [{
					block: 'button',
					url: this.params.shopsUrl,
					mods: { size: this._getControlButtonSize(), view: 'action', type: 'link' },
					mix: this._getControlButtonMix(),
					text: BEM.I18N('promo-header', 'inactive-success-catalog')
				}]
			});

			var $content = $(content);

			this.domElem.replaceWith($content);
			$content.show();

			$content.find('.promo-header__close').click(function () {
				$content.slideUp(function () {
					$content.remove();
				});
			});
		},


		/**
   * Показывает шапку ошибки
   *
   * @private
   */
		_onResponseError: function _onResponseError() {
			var content = BEMHTML.apply({
				block: 'promo-header',
				mods: { type: 'error', id: 'inactive', close: 'no' },
				js: {
					name: 'inactive',
					ajaxUrl: this.params.ajaxUrl
				},
				logo: true,
				title: BEM.I18N('promo-header', 'inactive-error-title'),
				text: BEM.I18N('promo-header', 'inactive-error-text'),
				control: [{
					block: 'button',
					mods: { size: this._getControlButtonSize(), view: 'action', name: 'inactiveResultButton' },
					mix: this._getControlButtonMix(),
					text: BEM.I18N('promo-header', 'inactive-stop-charging')
				}, {
					block: 'button',
					url: this.params.feedbackLink,
					mix: this._getControlButtonMix(),
					mods: { size: this._getControlButtonSize(), view: 'normal', type: 'link' },
					text: BEM.I18N('promo-header', 'inactive-error-feedback')
				}]
			});

			var $content = BEMDOM.init($(content));

			this.domElem.replaceWith($content);
			$content.show();
		}
	}));
});
/**
 * @module jquery
 * @description Provide jQuery (load if it does not exist).
 */

modules.define('jquery', ['loader_type_js', 'jquery__config'], function (provide, loader, cfg) {

    /* global jQuery */

    function doProvide(preserveGlobal) {
        /**
         * @exports
         * @type Function
         */
        provide(preserveGlobal ? jQuery : jQuery.noConflict(true));
    }

    typeof jQuery !== 'undefined' ? doProvide(true) : loader(cfg.url, doProvide);
});
/**
 * @module jquery
 */
modules.define('jquery', function (provide, $) {
  window.$ = $;

  provide($);
});
/**
 * @module loader_type_js
 * @description Load JS from external URL.
 */

modules.define('loader_type_js', function (provide) {

    var loading = {},
        loaded = {},
        head = document.getElementsByTagName('head')[0],
        runCallbacks = function runCallbacks(path, type) {
        var cbs = loading[path],
            cb,
            i = 0;
        delete loading[path];
        while (cb = cbs[i++]) {
            cb[type] && cb[type]();
        }
    },
        onSuccess = function onSuccess(path) {
        loaded[path] = true;
        runCallbacks(path, 'success');
    },
        onError = function onError(path) {
        runCallbacks(path, 'error');
    };

    provide(
    /**
     * @exports
     * @param {String} path resource link
     * @param {Function} [success] to be called if the script succeeds
     * @param {Function} [error] to be called if the script fails
     */
    function (path, success, error) {
        if (loaded[path]) {
            success && success();
            return;
        }

        if (loading[path]) {
            loading[path].push({ success: success, error: error });
            return;
        }

        loading[path] = [{ success: success, error: error }];

        var script = document.createElement('script');
        script.type = 'text/javascript';
        script.charset = 'utf-8';
        script.src = (location.protocol === 'file:' && !path.indexOf('//') ? 'http:' : '') + path;

        if ('onload' in script) {
            script.onload = function () {
                script.onload = script.onerror = null;
                onSuccess(path);
            };

            script.onerror = function () {
                script.onload = script.onerror = null;
                onError(path);
            };
        } else {
            script.onreadystatechange = function () {
                var readyState = this.readyState;
                if (readyState === 'loaded' || readyState === 'complete') {
                    script.onreadystatechange = null;
                    onSuccess(path);
                }
            };
        }

        head.insertBefore(script, head.lastChild);
    });
});

/**
 * @module i-global
 */
modules.define('i-global', ['i-bem__dom', 'BEMHTML', 'jquery', 'querystring__uri'], function (provide, BEMDOM, BEMHTML, $, QuerystringUri) {
	/**
  * @exports
  * @class i-global
  * @bem
  */
	provide(BEMDOM.decl('i-global', {
		onSetMod: {
			js: {
				inited: function inited() {
					var params = this.__self._params = $.extend({}, this.params);
					// Удаляем системные свойства
					delete params.uniqId;
					delete params.name;

					params.locale = params.lang;

					// Прокидываем параметры
					BEMHTML.apply({
						block: 'i-global',
						params: params
					});

					// Если пришел флаг о запрете показа страницы во фрейме и мы не в топе - выпрыгиваем
					if (params.denyFrame && window.location !== window.top.location) {
						window.top.location = window.location;
					}
				}
			}
		},

		getDefaultParams: function getDefaultParams() {
			return {
				id: '',
				login: '',
				lang: 'ru',
				tld: 'ru',
				retpath: encodeURI(QuerystringUri.decodeURI(location.href))
			};
		}
	}, {
		param: function param(name, value) {
			if (typeof value === 'undefined') {
				return (this._params || {})[name];
			} else {
				this._params && (this._params[name] = value);
			}
		}
	}));
});
/**
 * @module stat-scripts
 */
modules.define('stat-scripts', ['i-bem__dom', 'jquery', 'lodash'], function (provide, BEMDOM, $, _) {
	/**
  * @exports
  * @class stat-scripts
  * @bem
  */
	provide(BEMDOM.decl(this.name, /** @lends stat-scripts.prototype */{
		onSetMod: {
			js: function js() {
				this.__base.apply(this, arguments);
				/**
     * Параметры из блока i-global
     * @type {Object}
     * @public
     */
				this._globalParams = this.findBlockOutside('i-global').params;

				/**
     * Идентификатор счетчика в метрике
     * @type {Number[]}
     * @public
     */
				this.yaMetricsCounterId = this.getYaMetricsCounterId();

				this._callGoalOnLoad();
			}
		},

		/**
   * Получает идентификатор счетчика в метрике. Содержит значение, полученное из конфига
   * @public
   * @returns {Number[]}
   */
		getYaMetricsCounterId: function getYaMetricsCounterId() {
			return [].concat(this._globalParams.yametricsId || '');
		},


		/**
   * Название события, оказывающего на то, что инициализация счетчика завершена
   * @public
   * @param {Number} counterId id счетчика
   * @returns {String}
   */
		yaMetricsInitedEventName: function yaMetricsInitedEventName(counterId) {
			return 'ya-counter-' + counterId + '-inited';
		},


		/**
   * Получает идентификаторы счетчика в метрике, в которых включен вебвизор.
   * Рекомендуется включать не более одного вебвизора во избежание тормозов у пользователя
   * @public
   * @returns {Number[]}
   */
		getWebvisorEnabledYaMetricsCounterId: function getWebvisorEnabledYaMetricsCounterId() {
			return [].concat(this._globalParams.webvisorEnabledYametricsId);
		},


		/**
   * Признак того, что webvisor для метрики должен быть включен
   * @public
   * @param {Number} counterId id счетчика
   * @returns {Boolean}
   */
		isYaMetricsCounterWebvisorEnabled: function isYaMetricsCounterWebvisorEnabled(counterId) {
			return this.getWebvisorEnabledYaMetricsCounterId().includes(counterId);
		},


		/**
   * Создание сессии метрики, подгрузка скрипта, инициализация.
   * @public
   */
		startYandexMetrics: function startYandexMetrics() {
			var _this = this;

			var callbacks = 'yandex_metrika_callbacks2';
			var n = document.getElementsByTagName('script')[0];
			var s = document.createElement('script');
			var f = function f() {
				n.parentNode.insertBefore(s, n);
			};
			var eventName = void 0;

			// Настраиваем callback для скриптов метрики до загрузки скрипта.
			window[callbacks] = window[callbacks] || [];
			window[callbacks].push(function () {
				try {
					_this.yaMetricsCounterId.forEach(function (counterId) {
						// eslint-disable-next-line no-undef
						window['yaCounter' + counterId] = new Ya.Metrika2({
							id: counterId,
							clickmap: true,
							trackLinks: true,
							accurateTrackBounce: true,
							params: {
								platform: _this._globalParams.platform,
								puid: _this._globalParams.uid,
								yuid: _this._globalParams.yandexuid,
								accountKey: _this._globalParams.accountKey
							},
							webvisor: _this.isYaMetricsCounterWebvisorEnabled(counterId)
						});
						// Счетчик готов (QWEB-9777)
						eventName = _this.yaMetricsInitedEventName(counterId);

						$('body').trigger(eventName);
					});
					// eslint-disable-next-line no-empty
				} catch (e) {}
			});

			s.type = 'text/javascript';
			s.async = true;
			s.src = '' + (document.location.protocol === 'https:' ? 'https:' : 'http:') + '//mc.yandex.ru/metrika/tag.js';

			if (window.opera === '[object Opera]') {
				document.addEventListener('DOMContentLoaded', f, false);
			} else {
				f();
			}
		},


		/**
   * Передача идентификатора посетителя
   * @param {String} account Произвольный идентификатор (номер счета)
   * @param {Number[]|String[]} customCounterId ID метрики для вызова цели счётчика, отличного от i-global
   * @public
   */
		setCustomYaMetricsUserID: function setCustomYaMetricsUserID(account, customCounterId) {
			var counterIds = [].concat(customCounterId || this.yaMetricsCounterId);

			counterIds.forEach(function (counterId) {
				var yaCounterId = 'yaCounter' + counterId;

				try {
					var yaCounter = window[yaCounterId];

					var isYaCounterExists = !yaCounter;
					if (isYaCounterExists) {
						$('body').on('ya-counter-' + counterId + '-inited', function () {
							window[counterId].setUserID(account);
						});
					} else {
						yaCounter.setUserID(account);
					}
					// eslint-disable-next-line no-empty
				} catch (e) {}
			});
		},


		/**
   * Вызов достижения цели успешной регистрации.
   * @public
   */
		registrationYandexMetricsGoal: function registrationYandexMetricsGoal() {
			var globalParams = this.findBlockOutside('i-global').params;
			this.customYandexMetricsGoal('REGISTRATION', {});

			if (globalParams.sauthType === 'SMS') {
				/* QWEB-10751: дополнительная цель Яндекс.Метрики при регистрации с УА через СМС. */
				this.customYandexMetricsGoal('REGISTRATION_SMS', {});
			}
		},


		/**
   * Вызов достижения произвольной цели.
   *
   * @param {String} goal наименование цели
   * @param {Object} params параметры для цели
   * @param {Number[]|String[]} customCounterId ID метрики для вызова цели счётчика, отличного от i-global
   * @public
   */
		customYandexMetricsGoal: function customYandexMetricsGoal(goal, params, customCounterId) {
			var counterIds = [].concat(customCounterId || this.yaMetricsCounterId);

			counterIds.forEach(function (counterId) {
				var yaCounterId = 'yaCounter' + counterId;

				try {
					if (goal) {
						if (!_.isObject(params)) {
							params = {};
						}

						var yaCounter = window[yaCounterId];

						var isYaCounterExists = !yaCounter;
						if (isYaCounterExists) {
							$('body').on('ya-counter-' + counterId + '-inited', function () {
								window[yaCounterId].reachGoal(goal, params);
							});
						} else {
							yaCounter.reachGoal(goal, params);
						}
					}
					// eslint-disable-next-line no-empty
				} catch (e) {}
			});
		},


		/**
   * Вызов переданного метода на счётчиках
   * @param {Object} params параметры
   * @param {string} params.methodName Название метода
   * @param {Any[]} params.paramsList Список параметров метода
   * @param {number[]|string[]} params.customCounterId ID метрики для вызова цели счётчика,
   *	отличного от i-global
   * @public
   */
		callYandexMetricsMethod: function callYandexMetricsMethod(params) {
			var methodName = params.methodName,
			    _params$paramsList = params.paramsList,
			    paramsList = _params$paramsList === undefined ? [] : _params$paramsList,
			    customCounterId = params.customCounterId;

			if (!methodName) {
				return;
			}

			var counterIds = [].concat(customCounterId || this.yaMetricsCounterId);

			counterIds.forEach(function (counterId) {
				var yaCounterId = 'yaCounter' + counterId;

				try {
					var yaCounter = window[yaCounterId];

					var isYaCounterExists = !yaCounter;
					if (isYaCounterExists) {
						$('body').on('ya-counter-' + counterId + '-inited', function () {
							window[yaCounterId][methodName].apply(window[yaCounterId], paramsList);
						});
					} else {
						yaCounter[methodName].apply(yaCounter, paramsList);
					}
				} catch (e) {
					// nothing to do
				}
			});
		},


		/**
   * Вызов достижения цели по метке _openstat в урле
   * @private
   */
		_callGoalOnLoad: function _callGoalOnLoad() {
			var _this2 = this;

			_.forEach(this.yaMetricsCounterId, function (counterId) {
				var yaCounterId = 'yaCounter' + counterId;
				var stat = void 0;
				try {
					stat = decodeURIComponent(window.location.search.substr(1)).match(/_openstat=([^&]+)/);
				} catch (e) {
					/*
      * Если search-компонента URL'а синтаксически невалидна, просто выходим,
      * т. к. Я.Метрика не должна аффектить бизнес-сценарии
      */
					return;
				}
				if (!stat) {
					return;
				}
				stat = stat[1] || '';

				var statParams = stat.split(';');
				var statLength = statParams.length;
				var goal = 'OPENSTAT';
				var goalParams = {};

				if (statLength === 1) {
					goalParams[statParams[0]] = {};
				} else if (statLength > 1) {
					goalParams = _this2._arrToObj(statParams);
				}

				var yaCounter = window[yaCounterId];
				if (yaCounter) {
					yaCounter.reachGoal(goal, goalParams);
				} else {
					$('body').on('ya-counter-' + counterId + '-inited', function () {
						window[yaCounterId].reachGoal(goal, goalParams);
					});
				}
			});
		},


		/**
   * Рекурсивно преобразует массив [1,2,3,4] к объекту {1:{2:{3:4}}}
   *
   * @param {String[]} arr входной массив
   * @returns {Object|String}
   */
		_arrToObj: function _arrToObj(arr) {
			var obj = {};
			if (!arr.length) {
				return;
			}

			// если в массиве только один элемент или второй - пустая строка
			if (arr.length === 1 || arr.length === 2 && !arr[1]) {
				return arr.shift();
			}

			obj[arr.shift()] = this._arrToObj(arr);
			return obj;
		}
	}));
});
/**
 * @module stat-scripts
 */
modules.define('stat-scripts', ['i-bem__dom'], function (provide, BEMDOM) {
	/**
  * @exports
  * @class stat-scripts
  * @bem
  */
	provide(BEMDOM.decl(this.name, /** @lends stat-scripts.prototype */{
		/**
   * Создание сессии метрики, подгрузка скрипта, инициализация.
   * @public
   */
		startVkMetrics: function startVkMetrics() {
			var _this = this;

			this._globalParams = this.findBlockOutside('i-global').params;
			this._vkAppId = this._globalParams.vkAppId;

			if (!this._vkAppId || window.VK) {
				return;
			}

			window.vkAsyncInit = function () {
				// eslint-disable-next-line
				VK.Retargeting.Init(_this._vkAppId);
				// eslint-disable-next-line
				VK.Retargeting.Hit();

				if (Array.isArray(window.__vkEventsQueue)) {
					// eslint-disable-next-line
					window.__vkEventsQueue.forEach(function (eventName) {
						return VK.Retargeting.Event(eventName);
					});
					delete window.__vkEventsQueue;
				}
			};

			setTimeout(function () {
				var el = document.createElement('script');
				el.type = 'text/javascript';
				el.src = 'https://vk.com/js/api/openapi.js?154';
				el.async = true;
				document.getElementById('vk_api_transport').appendChild(el);
			}, 0);
		},


		/**
   * Вызов события ретаргетинга
   * @param {String} eventName Имя события
   */
		vkRetargetingEvent: function vkRetargetingEvent(eventName) {
			if (window.VK) {
				// eslint-disable-next-line
				VK.Retargeting.Event(eventName);
			} else {
				if (!window.__vkEventsQueue) {
					window.__vkEventsQueue = [];
				}
				window.__vkEventsQueue.push(eventName);
			}
		}
	}));
});
/**
 * @module stat-scripts
 */
modules.define('stat-scripts', ['i-bem__dom'], function (provide, BEMDOM) {
	/**
  * @exports
  * @class stat-scripts
  * @bem
  */
	provide(BEMDOM.decl(this.name, /** @lends stat-scripts.prototype */{
		/**
   * Создание сессии метрики, подгрузка скрипта, инициализация.
   * @public
   */
		startMyTargetMetrics: function startMyTargetMetrics() {
			this._globalParams = this.findBlockOutside('i-global').params;
			this._myTargetAppId = this._globalParams.myTargetAppId;

			if (!this._myTargetAppId) {
				return;
			}

			var _tmr = window._tmr || (window._tmr = []);

			_tmr.push({
				id: this._myTargetAppId,
				type: 'pageView',
				start: new Date().getTime()
			});
			(function (d, w, id) {
				if (d.getElementById(id)) {
					return;
				}

				var ts = d.createElement('script');

				ts.type = 'text/javascript';
				ts.async = true;
				ts.id = id;
				ts.src = (d.location.protocol === 'https:' ? 'https:' : 'http:') + '//top-fwz1.mail.ru/js/code.js';

				var f = function f() {
					var s = d.getElementsByTagName('script')[0];
					s.parentNode.insertBefore(ts, s);
				};

				if (w.opera === '[object Opera]') {
					d.addEventListener('DOMContentLoaded', f, false);
				} else {
					f();
				}
			})(document, window, 'topmailru-code');
		},


		/**
   * Вызов события ретаргетинга
   * @see {@link https://target.my.com/adv/help/dynamic_remarketing/?sudo=yamoney.artics.web%40mail.ru} Описание объекта событий
   * @param {Object} options Объект события
   */
		myTargetRetargetingEvent: function myTargetRetargetingEvent(options) {
			var _tmr = window._tmr || [];

			_tmr.push(options);
		}
	}));
});
/**
 * @module link
 */
modules.define('link', ['i-bem__dom'], function (provide, BEMDOM) {
	/**
  * @exports
  * @class link
  * @bem
  */
	provide(BEMDOM.decl({ block: 'link', modName: 'refresh', modVal: 'yes' }, /** @lends link.prototype */{
		onSetMod: {
			js: {
				inited: function inited() {
					this.__base.apply(this, arguments);

					this.on('click', function () {
						location.reload();
					});
				}
			}
		}
	}));
});
modules.define('jquery', ['next-tick'], function (provide, nextTick, $) {

    var isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream,
        event = $.event.special.pointerclick = {
        setup: function setup() {
            if (isIOS) {
                $(this).on('pointerdown', event.onPointerdown).on('pointerup', event.onPointerup).on('pointerleave pointercancel', event.onPointerleave);
            } else {
                $(this).on('click', event.handler);
            }
        },

        teardown: function teardown() {
            if (isIOS) {
                $(this).off('pointerdown', event.onPointerdown).off('pointerup', event.onPointerup).off('pointerleave pointercancel', event.onPointerleave);
            } else {
                $(this).off('click', event.handler);
            }
        },

        handler: function handler(e) {
            if (!e.button) {
                var type = e.type;
                e.type = 'pointerclick';
                $.event.dispatch.apply(this, arguments);
                e.type = type;
            }
        },

        onPointerdown: function onPointerdown(e) {
            pointerdownEvent = e;
        },

        onPointerleave: function onPointerleave() {
            pointerdownEvent = null;
        },

        onPointerup: function onPointerup(e) {
            if (!pointerdownEvent) return;

            if (!pointerDownUpInProgress) {
                nextTick(function () {
                    pointerDownUpInProgress = false;
                    pointerdownEvent = null;
                });
                pointerDownUpInProgress = true;
            }

            event.handler.apply(this, arguments);
        }
    },
        pointerDownUpInProgress = false,
        pointerdownEvent;

    provide($);
});
// В bem-core@3 есть баг https://github.com/bem/bem-core/issues/1477 на iOS, который починен только bem-core@4
// @TODO: если вдруг будет обновление на bem-core@4, то удалить это переопределение
modules.define('jquery', ['next-tick'], function (provide, nextTick, $) {
	var event = $.event.special.pointerclick = {
		setup: function setup() {
			$(this).on('click', event.handler);
		},
		teardown: function teardown() {
			$(this).off('click', event.handler);
		},
		handler: function handler(e) {
			if (!e.button) {
				var type = e.type;
				e.type = 'pointerclick';
				$.event.dispatch.apply(this, arguments);
				e.type = type;
			}
		}
	};

	provide($);
});
;(function (global, factory) {

    if ((typeof modules === 'undefined' ? 'undefined' : babelHelpers.typeof(modules)) === 'object' && modules.isDefined('jquery')) {
        modules.define('jquery', function (provide, $) {
            factory(this.global, $);
            provide($);
        });
    } else if (typeof jQuery === 'function') {
        factory(global, jQuery);
    }
})(this, function (window, $) {

    var jqEvent = $.event;

    // NOTE: Remove jQuery special fixes for pointerevents – we fix them ourself
    delete jqEvent.special.pointerenter;
    delete jqEvent.special.pointerleave;

    if (window.PointerEvent) {
        // Have native PointerEvent support, nothing to do than
        return;
    }

    /*!
     * Most of source code is taken from PointerEvents Polyfill
     * written by Polymer Team (https://github.com/Polymer/PointerEvents)
     * and licensed under the BSD License.
     */

    var doc = document,
        HAS_BITMAP_TYPE = window.MSPointerEvent && typeof window.MSPointerEvent.MSPOINTER_TYPE_MOUSE === 'number',
        undef;

    /*!
     * Returns a snapshot of the event, with writable properties.
     *
     * @param {Event} event An event that contains properties to copy.
     * @returns {Object} An object containing shallow copies of `inEvent`'s
     *    properties.
     */
    function cloneEvent(event) {
        var eventCopy = $.extend(new $.Event(), event);
        if (event.preventDefault) {
            eventCopy.preventDefault = function () {
                event.preventDefault();
            };
        }
        return eventCopy;
    }

    /*!
     * Dispatches the event to the target, taking event's bubbling into account.
     */
    function _dispatchEvent(event, target) {
        return event.bubbles ? jqEvent.trigger(event, null, target) : jqEvent.dispatch.call(target, event);
    }

    var MOUSE_PROPS = {
        bubbles: false,
        cancelable: false,
        view: null,
        detail: null,
        screenX: 0,
        screenY: 0,
        clientX: 0,
        clientY: 0,
        ctrlKey: false,
        altKey: false,
        shiftKey: false,
        metaKey: false,
        button: 0,
        relatedTarget: null,
        pageX: 0,
        pageY: 0
    },
        mouseProps = Object.keys(MOUSE_PROPS),
        mousePropsLen = mouseProps.length,
        mouseDefaults = mouseProps.map(function (prop) {
        return MOUSE_PROPS[prop];
    });

    /*!
     * Pointer event constructor
     *
     * @param {String} type
     * @param {Object} [params]
     * @returns {Event}
     * @constructor
     */
    function PointerEvent(type, params) {
        params || (params = {});

        var e = $.Event(type);

        // define inherited MouseEvent properties
        for (var i = 0, p; i < mousePropsLen; i++) {
            p = mouseProps[i];
            e[p] = params[p] || mouseDefaults[i];
        }

        e.buttons = params.buttons || 0;

        // add x/y properties aliased to clientX/Y
        e.x = e.clientX;
        e.y = e.clientY;

        // Spec requires that pointers without pressure specified use 0.5 for down
        // state and 0 for up state.
        var pressure = 0;
        if (params.pressure) {
            pressure = params.pressure;
        } else {
            pressure = e.buttons ? 0.5 : 0;
        }

        // define the properties of the PointerEvent interface
        e.pointerId = params.pointerId || 0;
        e.width = params.width || 0;
        e.height = params.height || 0;
        e.pressure = pressure;
        e.tiltX = params.tiltX || 0;
        e.tiltY = params.tiltY || 0;
        e.pointerType = params.pointerType || '';
        e.hwTimestamp = params.hwTimestamp || 0;
        e.isPrimary = params.isPrimary || false;

        // add some common jQuery properties
        e.which = typeof params.which === 'undefined' ? 1 : params.which;

        return e;
    }

    function SparseArrayMap() {
        this.array = [];
        this.size = 0;
    }

    SparseArrayMap.prototype = {
        set: function set(k, v) {
            if (v === undef) {
                return this['delete'](k);
            }
            if (!this.has(k)) {
                this.size++;
            }
            this.array[k] = v;
        },

        has: function has(k) {
            return this.array[k] !== undef;
        },

        'delete': function _delete(k) {
            if (this.has(k)) {
                delete this.array[k];
                this.size--;
            }
        },

        get: function get(k) {
            return this.array[k];
        },

        clear: function clear() {
            this.array.length = 0;
            this.size = 0;
        },

        // return value, key, map
        forEach: function forEach(callback, ctx) {
            return this.array.forEach(function (v, k) {
                callback.call(ctx, v, k, this);
            }, this);
        }
    };

    // jscs:disable requireMultipleVarDecl
    var PointerMap = window.Map && window.Map.prototype.forEach ? Map : SparseArrayMap,
        pointerMap = new PointerMap();

    var dispatcher = {
        eventMap: {},
        eventSourceList: [],

        /*!
         * Add a new event source that will generate pointer events
         */
        registerSource: function registerSource(name, source) {
            var newEvents = source.events;
            if (newEvents) {
                newEvents.forEach(function (e) {
                    source[e] && (this.eventMap[e] = function () {
                        source[e].apply(source, arguments);
                    });
                }, this);
                this.eventSourceList.push(source);
            }
        },

        register: function register(element) {
            var len = this.eventSourceList.length;
            for (var i = 0, es; i < len && (es = this.eventSourceList[i]); i++) {
                // call eventsource register
                es.register.call(es, element);
            }
        },

        unregister: function unregister(element) {
            var l = this.eventSourceList.length;
            for (var i = 0, es; i < l && (es = this.eventSourceList[i]); i++) {
                // call eventsource register
                es.unregister.call(es, element);
            }
        },

        down: function down(event) {
            event.bubbles = true;
            this.fireEvent('pointerdown', event);
        },

        move: function move(event) {
            event.bubbles = true;
            this.fireEvent('pointermove', event);
        },

        up: function up(event) {
            event.bubbles = true;
            this.fireEvent('pointerup', event);
        },

        enter: function enter(event) {
            event.bubbles = false;
            this.fireEvent('pointerenter', event);
        },

        leave: function leave(event) {
            event.bubbles = false;
            this.fireEvent('pointerleave', event);
        },

        over: function over(event) {
            event.bubbles = true;
            this.fireEvent('pointerover', event);
        },

        out: function out(event) {
            event.bubbles = true;
            this.fireEvent('pointerout', event);
        },

        cancel: function cancel(event) {
            event.bubbles = true;
            this.fireEvent('pointercancel', event);
        },

        leaveOut: function leaveOut(event) {
            this.out(event);
            this.enterLeave(event, this.leave);
        },

        enterOver: function enterOver(event) {
            this.over(event);
            this.enterLeave(event, this.enter);
        },

        enterLeave: function enterLeave(event, fn) {
            var target = event.target,
                relatedTarget = event.relatedTarget;

            if (!this.contains(target, relatedTarget)) {
                while (target && target !== relatedTarget) {
                    event.target = target;
                    fn.call(this, event);

                    target = target.parentNode;
                }
            }
        },

        contains: function contains(target, relatedTarget) {
            return target === relatedTarget || $.contains(target, relatedTarget);
        },

        // LISTENER LOGIC
        eventHandler: function eventHandler(e) {
            // This is used to prevent multiple dispatch of pointerevents from
            // platform events. This can happen when two elements in different scopes
            // are set up to create pointer events, which is relevant to Shadow DOM.
            if (e._handledByPE) {
                return;
            }

            var type = e.type,
                fn;
            (fn = this.eventMap && this.eventMap[type]) && fn(e);

            e._handledByPE = true;
        },

        /*!
         * Sets up event listeners
         */
        listen: function listen(target, events) {
            events.forEach(function (e) {
                this.addEvent(target, e);
            }, this);
        },

        /*!
         * Removes event listeners
         */
        unlisten: function unlisten(target, events) {
            events.forEach(function (e) {
                this.removeEvent(target, e);
            }, this);
        },

        addEvent: function addEvent(target, eventName) {
            $(target).on(eventName, boundHandler);
        },

        removeEvent: function removeEvent(target, eventName) {
            $(target).off(eventName, boundHandler);
        },

        getTarget: function getTarget(event) {
            return event._target;
        },

        /*!
         * Creates a new Event of type `type`, based on the information in `event`
         */
        makeEvent: function makeEvent(type, event) {
            var e = new PointerEvent(type, event);
            if (event.preventDefault) {
                e.preventDefault = event.preventDefault;
            }

            e._target = e._target || event.target;

            return e;
        },

        /*!
         * Dispatches the event to its target
         */
        dispatchEvent: function dispatchEvent(event) {
            var target = this.getTarget(event);
            if (target) {
                if (!event.target) {
                    event.target = target;
                }

                return _dispatchEvent(event, target);
            }
        },

        /*!
         * Makes and dispatch an event in one call
         */
        fireEvent: function fireEvent(type, event) {
            var e = this.makeEvent(type, event);
            return this.dispatchEvent(e);
        }
    };

    function boundHandler() {
        dispatcher.eventHandler.apply(dispatcher, arguments);
    }

    var CLICK_COUNT_TIMEOUT = 200,

    // Radius around touchend that swallows mouse events
    MOUSE_DEDUP_DIST = 25,
        MOUSE_POINTER_ID = 1,

    // This should be long enough to ignore compat mouse events made by touch
    TOUCH_DEDUP_TIMEOUT = 2500,

    // A distance for which touchmove should fire pointercancel event
    TOUCHMOVE_HYSTERESIS = 20;

    // handler block for native mouse events
    var mouseEvents = {
        POINTER_TYPE: 'mouse',
        events: ['mousedown', 'mousemove', 'mouseup', 'mouseover', 'mouseout'],

        register: function register(target) {
            dispatcher.listen(target, this.events);
        },

        unregister: function unregister(target) {
            dispatcher.unlisten(target, this.events);
        },

        lastTouches: [],

        // collide with the global mouse listener
        isEventSimulatedFromTouch: function isEventSimulatedFromTouch(event) {
            var lts = this.lastTouches,
                x = event.clientX,
                y = event.clientY;

            for (var i = 0, l = lts.length, t; i < l && (t = lts[i]); i++) {
                // simulated mouse events will be swallowed near a primary touchend
                var dx = Math.abs(x - t.x),
                    dy = Math.abs(y - t.y);
                if (dx <= MOUSE_DEDUP_DIST && dy <= MOUSE_DEDUP_DIST) {
                    return true;
                }
            }
        },

        prepareEvent: function prepareEvent(event) {
            var e = cloneEvent(event);
            e.pointerId = MOUSE_POINTER_ID;
            e.isPrimary = true;
            e.pointerType = this.POINTER_TYPE;
            return e;
        },

        mousedown: function mousedown(event) {
            if (!this.isEventSimulatedFromTouch(event)) {
                if (pointerMap.has(MOUSE_POINTER_ID)) {
                    // http://crbug/149091
                    this.cancel(event);
                }

                pointerMap.set(MOUSE_POINTER_ID, event);

                var e = this.prepareEvent(event);
                dispatcher.down(e);
            }
        },

        mousemove: function mousemove(event) {
            if (!this.isEventSimulatedFromTouch(event)) {
                var e = this.prepareEvent(event);
                dispatcher.move(e);
            }
        },

        mouseup: function mouseup(event) {
            if (!this.isEventSimulatedFromTouch(event)) {
                var p = pointerMap.get(MOUSE_POINTER_ID);
                if (p && p.button === event.button) {
                    var e = this.prepareEvent(event);
                    dispatcher.up(e);
                    this.cleanupMouse();
                }
            }
        },

        mouseover: function mouseover(event) {
            if (!this.isEventSimulatedFromTouch(event)) {
                var e = this.prepareEvent(event);
                dispatcher.enterOver(e);
            }
        },

        mouseout: function mouseout(event) {
            if (!this.isEventSimulatedFromTouch(event)) {
                var e = this.prepareEvent(event);
                dispatcher.leaveOut(e);
            }
        },

        cancel: function cancel(inEvent) {
            var e = this.prepareEvent(inEvent);
            dispatcher.cancel(e);
            this.cleanupMouse();
        },

        cleanupMouse: function cleanupMouse() {
            pointerMap['delete'](MOUSE_POINTER_ID);
        }
    };

    var touchEvents = {
        events: ['touchstart', 'touchmove', 'touchend', 'touchcancel'],

        register: function register(target) {
            dispatcher.listen(target, this.events);
        },

        unregister: function unregister(target) {
            dispatcher.unlisten(target, this.events);
        },

        POINTER_TYPE: 'touch',
        clickCount: 0,
        resetId: null,
        firstTouch: null,

        isPrimaryTouch: function isPrimaryTouch(touch) {
            return this.firstTouch === touch.identifier;
        },

        /*!
         * Sets primary touch if there no pointers, or the only pointer is the mouse
         */
        setPrimaryTouch: function setPrimaryTouch(touch) {
            if (pointerMap.size === 0 || pointerMap.size === 1 && pointerMap.has(MOUSE_POINTER_ID)) {
                this.firstTouch = touch.identifier;
                this.firstXY = { X: touch.clientX, Y: touch.clientY };
                this.scrolling = null;

                this.cancelResetClickCount();
            }
        },

        removePrimaryPointer: function removePrimaryPointer(pointer) {
            if (pointer.isPrimary) {
                this.firstTouch = null;
                // TODO(@narqo): It seems that, flushing `firstXY` flag explicitly in `touchmove` handler is enough.
                // Original code from polymer doing `this.firstXY = null` on every `removePrimaryPointer` call, but looks
                // like it is harmful in some of our usecases.
                this.resetClickCount();
            }
        },

        resetClickCount: function resetClickCount() {
            var _this = this;
            this.resetId = setTimeout(function () {
                _this.clickCount = 0;
                _this.resetId = null;
            }, CLICK_COUNT_TIMEOUT);
        },

        cancelResetClickCount: function cancelResetClickCount() {
            this.resetId && clearTimeout(this.resetId);
        },

        typeToButtons: function typeToButtons(type) {
            return type === 'touchstart' || type === 'touchmove' ? 1 : 0;
        },

        findTarget: function findTarget(event) {
            // Currently we don't interested in shadow dom handling
            return doc.elementFromPoint(event.clientX, event.clientY);
        },

        touchToPointer: function touchToPointer(touch) {
            var cte = this.currentTouchEvent,
                e = cloneEvent(touch);

            // Spec specifies that pointerId 1 is reserved for Mouse.
            // Touch identifiers can start at 0.
            // Add 2 to the touch identifier for compatibility.
            e.pointerId = touch.identifier + 2;
            e.target = this.findTarget(e);
            e.bubbles = true;
            e.cancelable = true;
            e.detail = this.clickCount;
            e.button = 0;
            e.buttons = this.typeToButtons(cte.type);
            e.width = touch.webkitRadiusX || touch.radiusX || 0;
            e.height = touch.webkitRadiusY || touch.radiusY || 0;
            e.pressure = touch.mozPressure || touch.webkitForce || touch.force || 0.5;
            e.isPrimary = this.isPrimaryTouch(touch);
            e.pointerType = this.POINTER_TYPE;

            // forward touch preventDefaults
            var _this = this;
            e.preventDefault = function () {
                _this.scrolling = false;
                _this.firstXY = null;
                cte.preventDefault();
            };

            return e;
        },

        processTouches: function processTouches(event, fn) {
            var tl = event.originalEvent.changedTouches;
            this.currentTouchEvent = event;
            for (var i = 0, t; i < tl.length; i++) {
                t = tl[i];
                fn.call(this, this.touchToPointer(t));
            }
        },

        shouldScroll: function shouldScroll(touchEvent) {
            // return "true" for things to be much easier
            return true;
        },

        findTouch: function findTouch(touches, pointerId) {
            for (var i = 0, l = touches.length, t; i < l && (t = touches[i]); i++) {
                if (t.identifier === pointerId) {
                    return true;
                }
            }
        },

        /*!
         * In some instances, a touchstart can happen without a touchend.
         * This leaves the pointermap in a broken state.
         * Therefore, on every touchstart, we remove the touches
         * that did not fire a touchend event.
         *
         * To keep state globally consistent, we fire a pointercancel
         * for this "abandoned" touch
         */
        vacuumTouches: function vacuumTouches(touchEvent) {
            var touches = touchEvent.touches;
            // `pointermap.size` should be less than length of touches here, as the touchstart has not
            // been processed yet.
            if (pointerMap.size >= touches.length) {
                var d = [];

                pointerMap.forEach(function (pointer, pointerId) {
                    // Never remove pointerId == 1, which is mouse.
                    // Touch identifiers are 2 smaller than their pointerId, which is the
                    // index in pointermap.
                    if (pointerId === MOUSE_POINTER_ID || this.findTouch(touches, pointerId - 2)) return;
                    d.push(pointer.outEvent);
                }, this);

                d.forEach(this.cancelOut, this);
            }
        },

        /*!
         * Prevents synth mouse events from creating pointer events
         */
        dedupSynthMouse: function dedupSynthMouse(touchEvent) {
            var lts = mouseEvents.lastTouches,
                t = touchEvent.changedTouches[0];

            // only the primary finger will synth mouse events
            if (this.isPrimaryTouch(t)) {
                // remember x/y of last touch
                var lt = { x: t.clientX, y: t.clientY };
                lts.push(lt);

                setTimeout(function () {
                    var i = lts.indexOf(lt);
                    i > -1 && lts.splice(i, 1);
                }, TOUCH_DEDUP_TIMEOUT);
            }
        },

        touchstart: function touchstart(event) {
            var touchEvent = event.originalEvent;

            this.vacuumTouches(touchEvent);
            this.setPrimaryTouch(touchEvent.changedTouches[0]);
            this.dedupSynthMouse(touchEvent);

            if (!this.scrolling) {
                this.clickCount++;
                this.processTouches(event, this.overDown);
            }
        },

        touchmove: function touchmove(event) {
            var touchEvent = event.originalEvent;
            if (!this.scrolling) {
                if (this.scrolling === null && this.shouldScroll(touchEvent)) {
                    this.scrolling = true;
                } else {
                    event.preventDefault();
                    this.processTouches(event, this.moveOverOut);
                }
            } else if (this.firstXY) {
                var firstXY = this.firstXY,
                    touch = touchEvent.changedTouches[0],
                    dx = touch.clientX - firstXY.X,
                    dy = touch.clientY - firstXY.Y,
                    dd = Math.sqrt(dx * dx + dy * dy);
                if (dd >= TOUCHMOVE_HYSTERESIS) {
                    this.touchcancel(event);
                    this.scrolling = true;
                    this.firstXY = null;
                }
            }
        },

        touchend: function touchend(event) {
            var touchEvent = event.originalEvent;
            this.dedupSynthMouse(touchEvent);
            this.processTouches(event, this.upOut);
        },

        touchcancel: function touchcancel(event) {
            this.processTouches(event, this.cancelOut);
        },

        overDown: function overDown(pEvent) {
            var target = pEvent.target;
            pointerMap.set(pEvent.pointerId, {
                target: target,
                outTarget: target,
                outEvent: pEvent
            });
            dispatcher.over(pEvent);
            dispatcher.enter(pEvent);
            dispatcher.down(pEvent);
        },

        moveOverOut: function moveOverOut(pEvent) {
            var pointer = pointerMap.get(pEvent.pointerId);

            // a finger drifted off the screen, ignore it
            if (!pointer) {
                return;
            }

            dispatcher.move(pEvent);

            var outEvent = pointer.outEvent,
                outTarget = pointer.outTarget;

            if (outEvent && outTarget !== pEvent.target) {
                pEvent.relatedTarget = outTarget;
                outEvent.relatedTarget = pEvent.target;
                // recover from retargeting by shadow
                outEvent.target = outTarget;

                if (pEvent.target) {
                    dispatcher.leaveOut(outEvent);
                    dispatcher.enterOver(pEvent);
                } else {
                    // clean up case when finger leaves the screen
                    pEvent.target = outTarget;
                    pEvent.relatedTarget = null;
                    this.cancelOut(pEvent);
                }
            }

            pointer.outEvent = pEvent;
            pointer.outTarget = pEvent.target;
        },

        upOut: function upOut(pEvent) {
            dispatcher.up(pEvent);
            dispatcher.out(pEvent);
            dispatcher.leave(pEvent);

            this.cleanUpPointer(pEvent);
        },

        cancelOut: function cancelOut(pEvent) {
            dispatcher.cancel(pEvent);
            dispatcher.out(pEvent);
            dispatcher.leave(pEvent);
            this.cleanUpPointer(pEvent);
        },

        cleanUpPointer: function cleanUpPointer(pEvent) {
            pointerMap['delete'](pEvent.pointerId);
            this.removePrimaryPointer(pEvent);
        }
    };

    var msEvents = {
        events: ['MSPointerDown', 'MSPointerMove', 'MSPointerUp', 'MSPointerOut', 'MSPointerOver', 'MSPointerCancel'],

        register: function register(target) {
            dispatcher.listen(target, this.events);
        },

        unregister: function unregister(target) {
            dispatcher.unlisten(target, this.events);
        },

        POINTER_TYPES: ['', 'unavailable', 'touch', 'pen', 'mouse'],

        prepareEvent: function prepareEvent(event) {
            var e = cloneEvent(event);
            HAS_BITMAP_TYPE && (e.pointerType = this.POINTER_TYPES[event.pointerType]);
            return e;
        },

        MSPointerDown: function MSPointerDown(event) {
            pointerMap.set(event.pointerId, event);
            var e = this.prepareEvent(event);
            dispatcher.down(e);
        },

        MSPointerMove: function MSPointerMove(event) {
            var e = this.prepareEvent(event);
            dispatcher.move(e);
        },

        MSPointerUp: function MSPointerUp(event) {
            var e = this.prepareEvent(event);
            dispatcher.up(e);
            this.cleanup(event.pointerId);
        },

        MSPointerOut: function MSPointerOut(event) {
            var e = this.prepareEvent(event);
            dispatcher.leaveOut(e);
        },

        MSPointerOver: function MSPointerOver(event) {
            var e = this.prepareEvent(event);
            dispatcher.enterOver(e);
        },

        MSPointerCancel: function MSPointerCancel(event) {
            var e = this.prepareEvent(event);
            dispatcher.cancel(e);
            this.cleanup(event.pointerId);
        },

        cleanup: function cleanup(id) {
            pointerMap['delete'](id);
        }
    };

    var navigator = window.navigator;
    if (navigator.msPointerEnabled) {
        dispatcher.registerSource('ms', msEvents);
    } else {
        dispatcher.registerSource('mouse', mouseEvents);
        if (typeof window.ontouchstart !== 'undefined') {
            dispatcher.registerSource('touch', touchEvents);
        }
    }

    dispatcher.register(doc);
});
/**
 * @module form
 */
modules.define('form', ['i-bem__dom', 'lodash', 'yamoney-lib'], function (provide, BEMDOM, _, ymLib) {
	/**
  * @exports
  * @class form
  * @bem
  */
	provide(BEMDOM.decl({ block: 'form', modName: 'validation', modVal: 'yes' }, /** @lends form.prototype */{

		onSetMod: {
			js: {
				inited: function inited() {
					/**
      * Вьюпорт для показа ошибок
      * @private
      * @type {string}
      */
					this._viewport = 'html,body';

					// Выполняем валидацию сразу после загрузки страницы.
					if (this.params.validateOnLoad) {
						this.validate();
					}
					this.__base.apply(this, arguments);

					// window.getXevRulesFromShowcase - это метод генерируемый модулем yandex-money-showcase.
					// Он содержит в себе все содержимое ноды java из киоска
					// если свойство getXevRulesFromShowcase отсутствует или пустое, инициализация xev не произойдет
					ymLib.xev.initRules(window.getXevRulesFromShowcase);
				}
			}
		},

		/**
   * Выставляет настройки валидации по умолчанию.
   *
   * @public
   * @param {object} [params] Настройки валидации.
   * @param {boolean} [params.focusToFirstInvalid=false]
   * 		Включает фокус на первое поле, которое не прошло валидацию.
   * @param {number} [params.viewportPadding=100]
   * 		Расстояние от границы окна до поля с ошибкой после скролла до поля с ошибкой, px.
   * @param {string} [params.viewport='html,body']
   * 		Скроллимый контент
   * @returns {object}
   */
		setDefaultValidationParams: function setDefaultValidationParams(params) {
			return _.defaults(params || {}, {
				focusToFirstInvalid: this.params.focusToFirstInvalid || false,
				viewportPadding: 100,
				viewport: this.params.viewport || this._viewport
			});
		},


		/**
   * Валидирует форму
   *
   * @param {object} validateParams Настройки валидации.
   * 		См. setDefaultValidationParams.
   *
   * @public
   * @returns {Boolean}
   */
		validate: function validate(validateParams) {
			var _this = this;
			validateParams = this.setDefaultValidationParams(validateParams);

			// Валидируемые контролы
			var bControls = this.findBlocksInside('validation');
			// Признак успешного прохождения процесса валидации
			var isValidationSuccess = true;

			_.each(bControls, function (bControl) {
				var bInput = bControl.findBlockOn('input');

				if (bControl.hasMod('state', 'failed') && bInput && !bControl.isForceRevalidation()) {
					// Очищаем инпут при ошибке, если передан параметр clearOnError
					_this._clearInputOnError(bControl);
					isValidationSuccess = false;
				} else {
					// Валидируем контрол
					var validationResult = bControl.validate(validateParams);

					validationResult.fail(function () {
						// Очищаем инпут при ошибке, если передан параметр clearOnError
						_this._clearInputOnError(bControl);
						isValidationSuccess = false;
					});
				}

				// lozenko: Ошибки в инпутах скрываются по фокусу в поле.
				// Поэтому если валидируемое поле находится в фокусе в момент сабмита (н-р, по нажатии enter),
				// навешиваем на ввод и очистку по крестику одноразовый обработчик для скрытия ошибки
				_this._hideErrorOnFirstChange(bControl._getValidatingControl());
			});

			return isValidationSuccess;
		}
	}));
});
/**
 * @module basis
 */
modules.define('basis', ['jquery', 'yamoney-lib', 'lodash'], function (provide, $, ymLib, _) {
	var basis = /** @lends basis */{

		/**
   * Общие настройки форматирования ввода по маске
   * @type {Object}
   */
		maskFormats: /** @lends basis */{

			/**
    * Маска ввода регистрационного номера автомобиля
    * @type {Object}
    */
			carRegNumber: {
				pattern: '{{Y}} {{999}} {{YY}} {{999}}',
				inputTypes: [{
					char: 'Y',
					pattern: '[АВЕКМНОРСТУХавекмнорстух]'
				}]
			},

			/**
    * Правила проверки ВУ и СТС (уточнены в QWEB-12881 + QWEB-12566)
    * Разрешены определенные символы из кириллицы и латиницы, пробелы и цифры
    * Данные имеют формат: '00 АА 000000'
    * Все вместе - 12 знаков
    * @type {Object}
    */
			driverData: {
				pattern: '{{99}} {{ZZ}} {{999999}}',
				inputTypes: [{
					char: 'Z',
					pattern: '[0-9АВСЕНКМОРТХУавсенкмортхуABCEHKMOPTXYabcehkmoptxy]'
				}]
			},

			/**
    * Номер мобильного телефона
    * @type {Object}
    */
			phone: {
				pattern: '+{{9}} {{999}} {{9999999}}'
			},

			/**
    * Номер мобильного телефона без кода страны
    * @type {Object}
    */
			phoneWithoutCountryCode: {
				pattern: '{{999}} {{9999999}}'
			},

			/**
    * Международный формат телефонного номера
    * @see https://en.wikipedia.org/wiki/E.164
    * @type {Object}
    */
			internationalPhone: {
				pattern: '+{{999999999999999}}'
			},

			/**
    * Время
    * @type {Object}
    */
			time: {
				pattern: '{{99}}:{{99}}'
			},

			/**
    * Полная дата
    * Разрешены только цифры
    * Данные имеют формат: 'ДД.ММ.ГГГГ'
    * Все вместе - 10 знаков
    * @type {Object}
    */
			fullDate: {
				pattern: '{{99}}.{{99}}.{{9999}}'
			},

			/**
    * Короткая дата (скрок действия банковских карт)
    * Разрешены только цифры
    * Данные имеют формат: 'ММ / ГГ'
    * Все вместе - 7 знаков
    *
    * Формат связан с хаком, когда не поддерживается formatter.js
    * mobile-site\yamoney-mobile-components\card-info\card-info.js
    * метод _expirationDateHandlerAddFormat
    * @type {Object}
    */
			shortDate: {
				pattern: '{{99}} / {{99}}'
			},

			/**
    * Интервал дат
    * Разрешены только цифры
    * Данные имеют формат: 'ДД.ММ.ГГГГ-ДД.ММ.ГГГГ'
    * Все вместе - 21 знак
    * @type {Object}
    */
			interval: {
				pattern: '{{99}}.{{99}}.{{9999}}-{{99}}.{{99}}.{{9999}}'
			},

			/**
    * Полная дата с разделителем '/'
    * Разрешены только цифры
    * Данные имеют формат: 'ДД / ММ / ГГГГ'
    * Все вместе - 14 знаков
    *
    * Формат связан с хаком, когда не поддерживается formatter.js
    * mobile-site\yamoney-mobile-components\personal-info\personal-info.js
    * метод _docIssueDateHandlerAddFormat
    * @type {Object}
    */
			fullDateWithSlash: {
				pattern: '{{99}} / {{99}} / {{9999}}'
			},

			/**
    * Серия и номер паспорта
    * Разрешены только цифры
    * Данные имеют формат: 'XXXX XXXXXX'
    * Все вместе - 11 знаков
    * @type {Object}
    */
			passport: {
				pattern: '{{9999}} {{999999}}'
			},

			/**
    * Правила проверки номера банковской карты
    * Разрешены только цифры
    * Данные имеют формат: '9999 9999 9999 9999 999'
    * Все вместе - 13-19 знаков
    * @type {Object}
    */
			bankCard: {
				pattern: '{{9999}} {{9999}} {{9999}} {{9999}} {{999}}',
				inputTypes: [{
					pattern: '[0-9]'
				}]
			},

			/**
    * Для ПА токен или одноразовый код разрешено ко вводу 8 цифр.
    * @type {Object}
    */
			totpAndToken: {
				pattern: '{{99999999}}',
				inputTypes: [{
					pattern: '^[0-9]{8}$'
				}]
			},
			/**
    * Для ПА смс разрешено ко вводу 6 цифр.
    * @type {Object}
    */
			sms: {
				pattern: '{{999999}}',
				inputTypes: [{
					pattern: '^[0-9]{6}$'
				}]
			},
			/**
    * Для ПА аварийные коды разрешено ко вводу 10 символов.
    * @type {Object}
    */
			emergencyCode: {
				pattern: '{{**********}}'
			},
			/**
    * Для ПА таблица кодов разрешено ко вводу 2 символа.
    * @type {Object}
    */
			grid: {
				pattern: '{{ZZ}}',
				inputTypes: [{
					char: 'Z',
					pattern: '^[A-Za-z0-9А-Яа-я]$'
				}]
			},
			/**
    * Поле для кода arrowpassID при активации фестивальных карт (QWEB-16045).
    * @type {Object}
    */
			arrowpassId: {
				pattern: '{{*****}} {{*****}}'
			},

			/**
    * CVV/CVC код
    * Разрешены только цифры
    * Данные имеют формат: '9999'
    * Все вместе - 3-4 знака
    * @type {Object}
    */
			cvc: {
				pattern: '{{9999}}'
			}
		},

		/**
   * Объект с параметрами фильтрации ввода
   * @type {Object}
   */
		filters: {
			numbers: '0123456789',

			float: '0123456789.,',

			latin: 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ',

			cyrillic: 'абвгдеёжзийклмнопрстуфхцчшщъыьэюяАБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ',

			specials: ' !#$%&\'*+-/=?^_`{|}~.'
		},

		/**
   * Объект с проверяющими функциями
   * @type {Object}
   */
		validationCheckers: /** @lends basis */{
			/**
    * Проверка заполненности поля
    *
    * @param {Object} params Параметры проверки
    * @param {String} params.value Валидируемое значение(z)
    *
    * @returns {Object} Объект с признаком успешной проверки и типом ошибки
    */
			required: function required(params) {
				var value = $.trim(params.value);

				if (!value) {
					return {
						success: false,
						error: 'empty'
					};
				}

				return {
					success: true
				};
			},


			/**
    * Проверка значения по регулярному выражению
    *
    * @param {Object} params Параметры проверки
    * @param {String} params.value Валидируемое значение
    * @param {String} params.regexp Строка, содержащая регулярное выражение
    * @param {Boolean} [params.mismatch=false] Если true,
    * * проверка завершится успехом при несоответствии регулярному выражению
    * @param {Boolean} [params.isOptional = false] Признак необязательности поля
    *
    * @returns {Object} Объект с признаком успешной проверки и типом ошибки
    */
			regexp: function regexp(params) {
				var regexp = new RegExp(params.regexp);
				var testResult = regexp.test(params.value);
				if (params.isOptional && !params.value) {
					return { success: true };
				}

				var result = {
					success: params.mismatch ? !testResult : testResult
				};
				if (!result.success) {
					result.error = 'wrongFormat';
				}

				return result;
			},


			/**
    * Проверка корректности суммы
    *
    * @param {Object} params Параметры проверки
    * @param {String} params.value Валидируемое значение
    * @param {String} [params.min] Минимальное значение
    * @param {String} [params.max] Максимальное значение
    * @param {String} [params.step=0.01] Кратность значения суммы
    *
    * @returns {Object} Объект с признаком успешной проверки и типом ошибки
    */
			sum: function sum(params) {
				// Пустое значение считается валидным
				if ($.trim(params.value) === '') {
					return { success: true };
				}

				var value = ymLib.utils.toNum(params.value);
				var formattedValue = Math.round(value * 100) / 100;

				if (isNaN(value) || value < 0 || value !== formattedValue || !/^[0-9]+(.|,)*\d{0,2}$/.test(params.value)) {
					return {
						success: false,
						error: 'wrongFormat'
					};
				}

				if (params.min && value < params.min) {
					return {
						success: false,
						error: 'tooSmall'
					};
				}

				if (params.max && value > params.max) {
					return {
						success: false,
						error: 'tooBig'
					};
				}

				var step = ymLib.utils.toNum(params.step);
				var stepDefault = 0.01;
				if (step && step > stepDefault) {
					// Компенсируем потерю точности при конвертации чисел с
					// мантиссой в десятичные. Иначе, например, 2.01 * 100 !== 201
					var step100 = step * 100;
					step100 = Math.round(step100 * Math.pow(10, 2)) / Math.pow(10, 2);
					var value100 = value * 100;
					value100 = Math.round(value100 * Math.pow(10, 2)) / Math.pow(10, 2);

					var isFrequencyRate = value100 % step100 !== 0;

					if (isFrequencyRate) {
						return {
							success: false,
							error: 'wrongFrequencyRate'
						};
					}
				}

				return {
					success: true
				};
			},


			/**
    * Проверка email
    *
    * @param {Object} params Параметры проверки
    * @param {String} params.value Валидируемое значение
    *
    * @returns {Object} Объект с признаком успешной проверки и типом ошибки
    */
			email: function email(params) {
				var value = $.trim(params.value);
				// eslint-disable-next-line max-len, no-useless-escape
				var mailRegExp = /^[A-Za-z0-9а-яА-Я]+[A-Za-z0-9а-яА-Я\!\#\$\%\&\'\*\+\-\/\=\?\^\_\`\{\|\}\~\ ]*(\.[A-Za-z0-9а-яА-Я]+[A-Za-z0-9а-яА-Я\!\#\$\%\&\'\*\+\-\/\=\?\^\_\`\{\|\}\~\ ]*)*\@([A-Za-z0-9а-яА-Я]+(([A-Za-z0-9а-яА-Я\-]*[\w]+)?)\.)+[a-zA-Zа-яА-Я]{2,63}$/;

				if (value && !mailRegExp.test(value)) {
					return {
						success: false,
						error: 'wrongFormat'
					};
				}

				return {
					success: true
				};
			},


			/**
    * Проверка URL
    *
    * @param {Object} params Параметры проверки
    * @param {String} params.value Валидируемое значение
    * @param {Boolean} [params.onlyHttps=false] Признак проверки URL с https-протоколом
    *
    * @returns {Object} Объект с признаком успешной проверки и типом ошибки
    */
			url: function url(params) {
				var value = $.trim(params.value);
				var onlyHttps = params.onlyHttps || false;

				// Проверка урла на недопустимые символы
				// (разрешены буквы, цифры, дефисы, точки, слеши, символы процента и подчеркивания)
				// eslint-disable-next-line no-useless-escape
				var urlCheckRegexp = /^[\d\w\%\-\/\_\.\:\?=&а-яА-ЯёЁ]+$/;
				var isValid = urlCheckRegexp.test(value);
				// RFC-2396
				// eslint-disable-next-line no-useless-escape
				var urlMatchRegExp = /^(([^:\/?#]+):)?(\/\/([^\/?#]*))?([^?#]*)(\?([^#]*))?(#(.*))?/;
				var parsedUrl = value.match(urlMatchRegExp);
				var hasProtocol = parsedUrl[2] === 'http' || parsedUrl[2] === 'https';
				var protocolIsHttps = parsedUrl[2] === 'https';
				var host = parsedUrl[4];

				if (!hasProtocol || !host || !isValid) {
					return {
						success: false,
						error: 'wrongFormat'
					};
				}
				if (onlyHttps && !protocolIsHttps) {
					return {
						success: false,
						error: 'isNotHttps'
					};
				}

				return {
					success: true
				};
			},


			/**
    *  Проверка номера телефона
    *
    * @param {Object} params Параметры проверки
    * @param {String} params.value Валидируемое значение
    * @param {Boolean} [params.optional=false] Признак необязательности поля
    *
    * @returns {Object} Объект с признаком успешной проверки и типом ошибки
    */
			phoneNumber: function phoneNumber(params) {
				var value = $.trim(params.value);
				// eslint-disable-next-line no-useless-escape
				var phoneNumberRegExp = /^\+?[\-\d\s()]+$/;

				// в случае, когда блок с номером телефона состоит из двух инпутов
				if (_.isObject(params.value)) {
					var prefix = $.trim(params.value.phonePrefix);
					var number = $.trim(params.value.phoneNumber);
					value = prefix + number;
				}

				var hasValue = !params.optional || value;

				if (hasValue && !phoneNumberRegExp.test(value)) {
					return {
						success: false,
						error: 'wrongFormat'
					};
				}

				return {
					success: true
				};
			},


			/**
    * Проверка ИНН
    * @see http://ru.wikipedia.org/wiki/Идентификационный_номер_налогоплательщика
    *
    * @param {Object} params Параметры проверки
    * @param {String} [params.businessEntity='legalEntity'] Тип организации
    *   legalEntity - юр. лицо
    *   soleTrader - ИП
    * @param {String} params.value Валидируемое значение
    *
    * @returns {Object} Объект с признаком успешной проверки и типом ошибки
    */
			itn: function itn(params) {
				var value = params.value;
				var businessEntity = params.businessEntity || (value.length === 10 ? 'legalEntity' : 'soleTrader');
				var controlSumm10 = void 0;
				var controlSumm11 = void 0;
				var controlSumm12 = void 0;
				var result = {};

				// ИНН - 10 или 12 цифр и не нули
				if (businessEntity === 'legalEntity' && !/^\d{10}$/.test(value) || businessEntity === 'soleTrader' && !/^\d{12}$/.test(value) || !parseInt(value)) {
					result.success = false;
				} else if (businessEntity === 'legalEntity') {
					// Проверяем контрольную сумму
					controlSumm10 = (2 * value.substring(0, 1) + 4 * value.substring(1, 2) + 10 * value.substring(2, 3) + 3 * value.substring(3, 4) + 5 * value.substring(4, 5) + 9 * value.substring(5, 6) + 4 * value.substring(6, 7) + 6 * value.substring(7, 8) + 8 * value.substring(8, 9)) % 11 % 10;

					result = {
						success: value.substring(9, 10) === controlSumm10.toString()
					};
				} else if (businessEntity === 'soleTrader') {
					// Проверяем контрольные суммы
					controlSumm11 = (7 * value.substring(0, 1) + 2 * value.substring(1, 2) + 4 * value.substring(2, 3) + 10 * value.substring(3, 4) + 3 * value.substring(4, 5) + 5 * value.substring(5, 6) + 9 * value.substring(6, 7) + 4 * value.substring(7, 8) + 6 * value.substring(8, 9) + 8 * value.substring(9, 10)) % 11 % 10;
					controlSumm12 = (3 * value.substring(0, 1) + 7 * value.substring(1, 2) + 2 * value.substring(2, 3) + 4 * value.substring(3, 4) + 10 * value.substring(4, 5) + 3 * value.substring(5, 6) + 5 * value.substring(6, 7) + 9 * value.substring(7, 8) + 4 * value.substring(8, 9) + 6 * value.substring(9, 10) + 8 * value.substring(10, 11)) % 11 % 10;

					result = {
						success: value.substring(10, 11) === controlSumm11.toString() && value.substring(11, 12) === controlSumm12.toString()
					};
				}
				if (!result.success) {
					result.error = 'wrongFormat';
				}

				return result;
			},


			/**
    * Проверка УИН (уникальный идентификатор начисления)
    * @see http://help.quorum.ru/pages/viewpage.action?pageId=6491320 п1
    *
    * @param {Object} params Параметры проверки
    * @params {Boolean} [params.isOptional = false] Признак не обязательности заполнения поля.
    * 	В значении true флага считаем пустое поле валидным.
    * @params {Boolean} [params.isUin4DigitAllowed = false] Признак 4-значного УИНа.
    * 	В значении true не валидируем поле, если его длинна === 4.
    * @param {String} params.value Валидируемое значение
    * @returns {Object} Объект с признаком успешности проверки и типом ошибки
    */
			uicn: function uicn(params) {
				var value = params.value.replace(/\D/g, '');

				// Дефолтный успешный ответ
				var resultSuccess = {
					success: true
				};

				// Если 4-значный УИН разрешён и длина 4 = не надо валидировать контрольные суммы
				if (params.isUin4DigitAllowed && value.length === 4) {
					return resultSuccess;
				}

				if (params.isOptional && value === '') {
					return resultSuccess;
				}

				var valueArray = value.split('');
				// Контрольный разряд для 20-ти и 25-ти значного УИН
				var targetDigit = parseInt(valueArray.slice(-1), 10);
				// Перебираемый массив с разрядями УИН (кроме контрольного)
				var slicedArray = valueArray.slice(0, -1);
				// Дефолтный ответ с ошибкой
				var resultError = {
					success: false,
					error: 'wrongFormat'
				};

				var regexp20number = /^\d{20}$/;
				if (regexp20number.test(value)) {
					// 16 цифр, указанных в разрядах с 4 по 19, не могут все одновременно быть нулями
					var checkedByZeroArray = valueArray.slice(3, 19);
					var isEveryZero = checkedByZeroArray.every(function (item) {
						return Number(item) === 0;
					});
					if (isEveryZero) {
						return resultError;
					}

					// Первая контрольная сумма
					var firstSum = slicedArray.reduce(function (result, value, id) {
						var multiplier = (id + 1) % 11;
						if (id > 9) {
							multiplier += 1;
						}

						return result + value * multiplier;
					}, 0);
					var firstRemainder = firstSum % 11;

					if (firstRemainder === 10) {
						// Вторая контрольная сумма
						var secondSum = slicedArray.reduce(function (result, value, id) {
							var multiplier = void 0;
							if (id < 8) {
								multiplier = (id + 3) % 11;
							}
							if (id >= 8 && id < 18) {
								multiplier = (id + 3) % 11 + 1;
							}
							if (id >= 18) {
								multiplier = (id + 4) % 11 + 1;
							}

							return result + value * multiplier;
						}, 0);
						var secondRemainder = secondSum % 11;
						var checkDigit = secondRemainder === 10 ? 0 : secondRemainder;

						if (targetDigit === checkDigit) {
							return resultSuccess;
						}

						return resultError;
					}

					if (targetDigit === firstRemainder) {
						return resultSuccess;
					}

					return resultError;
				}

				var regexp25number = /^\d{25}$/;
				if (regexp25number.test(value)) {
					// 16 цифр, указанных в разрядах с 9 по 24, не могут все одновременно быть нулями
					var _checkedByZeroArray = valueArray.slice(8, 24);
					var _isEveryZero = _checkedByZeroArray.every(function (item) {
						return Number(item) === 0;
					});
					if (_isEveryZero) {
						return resultError;
					}

					// Первая контрольная сумма
					// каждому разряду УИН, начиная со старшего, присваивается набор весов,
					// соответствующий натуральному ряду чисел от 1 до 10, далее набор весов повторяется
					var _firstSum = slicedArray.reduce(function (result, value, id) {
						var multiplier = void 0;
						if (id <= 9) {
							multiplier = (id + 1) % 11;
						}
						if (id > 9 && id < 20) {
							multiplier = (id + 1) % 11 + 1;
						}
						if (id >= 20) {
							multiplier = (id + 2) % 11 + 1;
						}

						return result + value * multiplier;
					}, 0);
					var _firstRemainder = _firstSum % 11;

					if (_firstRemainder === 10) {
						// Вторая контрольная сумма
						// Набор весов начинается с 3ки
						var _secondSum = slicedArray.reduce(function (result, value, id) {
							var multiplier = void 0;
							if (id < 8) {
								multiplier = (id + 3) % 11;
							}
							if (id >= 8 && id < 18) {
								multiplier = (id + 3) % 11 + 1;
							}
							if (id >= 18) {
								multiplier = (id + 4) % 11 + 1;
							}

							return result + value * multiplier;
						}, 0);
						var _secondRemainder = _secondSum % 11;
						var _checkDigit = _secondRemainder === 10 ? 0 : _secondRemainder;

						if (targetDigit === _checkDigit) {
							return resultSuccess;
						}

						return resultError;
					}

					if (targetDigit === _firstRemainder) {
						return resultSuccess;
					}
				}

				return resultError;
			},


			/**
    * Проверка СНИЛС
    * @param {Object} params Параметры проверки
    * @param {String} params.value Валидируемое значение
    * @returns {Object} Объект с признаком успешной проверки и типом ошибки
    */
			snils: function snils(params) {
				var result = {};
				var checkedValue = params.value.replace(/\D/g, '');
				var maskFormats = /^\d{11}$/;
				var zeroMask = /^0{11}$/;

				if (checkedValue.length && maskFormats.test(checkedValue) && !zeroMask.test(checkedValue)) {
					var checkSum = parseInt(checkedValue.slice(9), 10);

					// строка как массив
					checkedValue = checkedValue.toString();
					checkedValue = checkedValue.split('');

					var sum = checkedValue[0] * 9 + checkedValue[1] * 8 + checkedValue[2] * 7 + checkedValue[3] * 6 + checkedValue[4] * 5 + checkedValue[5] * 4 + checkedValue[6] * 3 + checkedValue[7] * 2 + checkedValue[8] * 1;

					// Если сумма больше 101, берем остаток от деления на 101
					sum = sum > 101 ? sum % 101 : sum;

					if (sum === checkSum || (sum === 100 || sum === 101) && checkSum === 0) {
						result.success = true;
					} else {
						result = {
							success: false,
							error: 'wrongFormat'
						};
					}
				} else {
					result = {
						success: false,
						error: 'wrongFormat'
					};
				}

				return result;
			},


			/**
    * Проверка на максимальную длину строки.
    *
    * @param {object} params Параметры проверки
    * @param {string} params.value Валидируемое значение
    * @param {string} params.maxLength Максимальная длина строки.
    * @returns {Object} Объект с признаком успешной проверки и типом ошибки
    */
			maxLength: function maxLength(params) {
				var result = {
					success: params.value.length <= params.maxLength
				};

				if (!result.success) {
					result.error = 'wrongFormat';
				}

				return result;
			},


			/**
    * Проверка на минимальную длину строки.
    *
    * @param {object} params Параметры проверки
    * @param {string} params.value Валидируемое значение
    * @param {string} params.minLength Минимальная длина строки.
    * @returns {Object} Объект с признаком успешной проверки и типом ошибки
    */
			minLength: function minLength(params) {
				var result = {
					success: params.value.length >= params.minLength
				};

				if (!result.success) {
					result.error = 'wrongFormat';
				}

				return result;
			},


			/**
    * Проверка номера банковской карты.
    * @param {object} params Параметры проверки
    * @param {string} params.value Валидируемое значение
    * @param {Number} params.minLength Минимальная длинна карты
    * @returns {Object} Объект с признаком успешной проверки и типом ошибки
    */
			cardNumber: function cardNumber(params) {
				var cardNumber = params.value.replace(/\D/g, '');
				var minLength = params.minLength || 12;
				var result = {
					success: true
				};

				if (ymLib.utils.checkCardNumber) {
					result.success = cardNumber.length >= minLength && ymLib.utils.checkCardNumber(cardNumber);
				} else {
					// Если ymLib.checkCardNumber недоступна, то проверяем только на наличие цифр.
					result.success = !!cardNumber && cardNumber.length >= minLength;
				}

				if (!result.success) {
					result.error = 'wrongFormat';
				}

				return result;
			},


			/**
    * Проверка строки по алгоритму Луна
    * @param {object} params Параметры проверки
    * @param {string} params.value Валидируемое значение
    * @returns {Object} Объект с признаком успешной проверки и типом ошибки
    */
			luhn: function luhn(params) {
				var result = {
					success: ymLib.utils.luhnCheck(params.value)
				};
				if (!result.success) {
					result.error = 'wrongFormat';
				}
				return result;
			},


			/**
    * Проверка расчетного счета
    *
    * @param {Object} params Параметры проверки
    * @param {String} params.value Валидируемое значение
    * @param {String} [params.businessEntity] Тип организации (по умолчанию любой кроме физического лица)
    *		legalEntity - проверка р/с для юр. лица
    *		soleTrader - проверка р/с для ИП
    * @param {String[]} [params.forbiddenAccounts] Список запрещенных счетов
    * @param {Number} [params.currencyCode] Код валюты
    * @returns {Object} Объект с признаком успешной проверки и типом ошибки
    */
			receiptAccount: function receiptAccount(params) {
				var value = params.value;
				var businessEntity = params.businessEntity;
				// Запрещенные счета
				var forbiddenAccounts = params.forbiddenAccounts || [];
				var currencyCode = params.currencyCode;
				var regexp = /^\d{20}$/;
				var part1 = value.substring(0, 5);
				var part2 = value.substring(0, 3);
				var currencyPart = value.substring(5, 8);
				var currencyPartValue = +currencyPart;
				var isIncorrectCurrency = currencyPartValue !== currencyCode;

				// Расчетный счет - 20 цифр
				if (!regexp.test(value)) {
					return {
						success: false,
						error: 'wrongFormat'
					};
				} else if (part1 === '40817') {
					return {
						success: false,
						error: 'isNaturalPerson'
					};
				} else if (businessEntity === 'legalEntity' && part1 === '40802') {
					return {
						success: false,
						error: 'isSoleTrader'
					};
				} else if (businessEntity === 'soleTrader' && part1 !== '40802') {
					return {
						success: false,
						error: 'isNotSoleTrader'
					};
				} else if (!_.isEmpty(forbiddenAccounts) && (_.includes(forbiddenAccounts, part1) || _.includes(forbiddenAccounts, part2))) {
					return {
						success: false,
						error: 'forbiddenAccount'
					};
				} else if (currencyCode && isIncorrectCurrency) {
					return {
						success: false,
						error: 'wrongCurrency'
					};
				}

				return {
					success: true
				};
			},


			/**
    * Проверка принадлежности расчетного счета допустимым организациям
    * @param {Object} params Параметры проверки
    * @param {String} params.value Валидируемое значение
    * @param {String} params.relevantBusinessEntities Допустимые организации
    * @returns {Object}
    */
			relevantReceiptAccount: function relevantReceiptAccount(params) {
				var value = params.value;
				var relevantEntities = params.relevantBusinessEntities;

				var businessEntitiesFeatureTests = {
					businessOrg: /^40702/,
					nonprofitOrg: /^40703/,
					federalOrg: /^405/,
					legalEntity: /^40802/
				};

				var isRelevantEntity = relevantEntities.some(function (entity) {
					var entityRegexp = businessEntitiesFeatureTests[entity];
					return entityRegexp && entityRegexp.test(value);
				});

				if (!isRelevantEntity) {
					return {
						success: false,
						error: 'isIrrelevantBusinessEntity'
					};
				}

				return { success: true };
			},


			/**
    * Проверка расчетного счета на принадлежность физическому лицу на основе списка префиксов счетов.
    *
    * @param {Object} params Параметры проверки
    * @param {String} params.value Валидируемое значение
    * @param {String} params.privatePersonAccountPrefixArr Массив префиксов
    * @returns {Object}
    */
			privatePersonAccount: function privatePersonAccount(params) {
				var value = params.value;
				var privatePersonAccountPrefixArr = params.privatePersonAccountPrefixArr;
				var isPrivatePersonAccount = _.some(privatePersonAccountPrefixArr, function (prefix) {
					return value.indexOf(prefix) === 0;
				});

				if (isPrivatePersonAccount) {
					return {
						success: false,
						error: 'isNaturalPerson'
					};
				}

				return {
					success: true
				};
			},


			/**
    * Проверка поля с человеческим именем/фамилией/отчеством.
    *
    * @param {Object} params Объект с параметрами
    * @param {String} params.value Валидируемое значение
    * @param {Boolean} [params.optional] Признак необязательности поля
    * @param {Number} [params.maxLength] Максимальная длина значения
    * @param {String} [params.banRegexp] Регулярное выражение для исключения определенных символов. Текст
    *      ошибки берется из параметров блока errors.banMessage
    * @returns {Object} Объект с признаком успеха или ошибки и текст.
    */
			humanName: function humanName(params) {
				var value = params.value;
				var result = {
					success: true
				};
				var isLatin = params.isLatin || false;
				var regexpForLatinOrNot = isLatin ? /^\s*[a-zA-Z]+[a-zA-Z\-\s]*$/ : /^\s*[а-еёж-яА-ЕЁЖ-Я]+[а-еёж-яА-ЕЁЖ-Я\-\s]*$/;
				var isMixed = params.isMixed || false;
				var regexp = isMixed ? /^\s*[a-zA-Zа-еёж-яА-ЕЁЖ-Я]+[a-zA-Zа-еёж-яА-ЕЁЖ-Я\-\s]*$/ : regexpForLatinOrNot;

				if (params.optional && value === '') {
					return result;
				} else {
					result = this.required(params);
					if (!result.success) {
						return result;
					}
				}

				if (params.maxLength) {
					result = this.maxLength(params);
					if (!result.success) {
						return result;
					}
				}

				if (params.banRegexp) {
					result = this.regexp(params);
					if (!result.success) {
						return _.merge(result, {
							error: 'banMessage'
						});
					}
				}

				_.merge(params, { regexp: regexp });

				return this.regexp(params);
			},


			/**
    * Проверка ФИО
    *
    * @param {Object} params Объект с параметрами
    * @param {String} params.value Валидируемое значение
    * @param {Boolean} [params.optional] Признак необязательности поля
    *
    * @returns {Object} Объект с признаком успеха или ошибки
    */
			humanFio: function humanFio(params) {
				var value = $.trim(params.value);

				if (params.optional && !value) {
					return {
						success: true
					};
				}

				var requireResult = this.required(params);

				if (!requireResult.success) {
					return requireResult;
				}

				return this.regexp(_.extend(params, {
					regexp: '^\\s*[а-еёж-яА-ЕЁЖ-Я]+[а-еёж-яА-ЕЁЖ-Я\\-]*(\\s+[а-еёж-яА-ЕЁЖ-Я]+[а-еёж-яА-ЕЁЖ-Я\\-]*)+\\s*$'
				}));
			},


			/**
    * Проверка на минимальный возраст
    *
    * @param {Object} params Параметры проверки
    * @param {String} params.value Валидируемое значение
    * @param {Boolean} params.validateOnly флаг показа ошибок
    * @param {Number} params.minAge минимальный возраст
    *
    * @returns {Object} Объект с признаком успешной проверки и типом ошибки
    */
			adulthood: function adulthood(params) {
				var success = { success: true };
				var failed = {
					success: false,
					error: 'wrongFormat',
					validateOnly: params.validateOnly || false
				};
				var birthDateVal = params.value;
				if (!birthDateVal) {
					return success;
				}

				var moment = ymLib.utils.moment;
				var MIN_AGE = params.minAge || 18;
				var currentDate = moment();
				var diffDate = currentDate.diff(moment(birthDateVal, 'DD.MM.YYYY'), 'years', true);
				var result = MIN_AGE < diffDate ? success : failed;

				return result;
			},


			/**
    * Проверка документов, разрешающих нерезидентам находиться в РФ
    *
    * @param {Object} params Параметры проверки
    * @param {String} params.value Валидируемое значение
    *
    * @returns {Object} Объект с признаком успешной проверки и типом ошибки
    */
			visa: function visa(params) {
				var value = params.value;
				// eslint-disable-next-line no-useless-escape
				var visaRegexp = /^[\d\w\№\#\(\)\s\,\;\.\-\–\—\\\/а-яА-ЯёЁ]+$/;

				if (!visaRegexp.test(value)) {
					return {
						success: false,
						error: 'wrongFormat'
					};
				}

				return {
					success: true
				};
			},


			/**
    * Проверка рег.номера машины
    *
    * @param {Object} params Объект с параметрами
    * @param {String} params.value Валидируемое значение
    *
    * @returns {Object} Объект с признаком успешной проверки и типом ошибки
    */
			carRegNumber: function carRegNumber(params) {
				var value = params.value;
				var carRegNumberRegexp = /^[АВЕКМНОРСТУХавекмнорстух]\s*\d{3}\s*[АВЕКМНОРСТУХавекмнорстух]{2}\s*\d{2,3}$/;

				if (!carRegNumberRegexp.test(value)) {
					return {
						success: false,
						error: 'wrongFormat'
					};
				}

				return { success: true };
			},


			/**
    * Проверка номера ВУ, СТС
    *
    * @param {Object} params Объект с параметрами
    * @param {String} params.value Валидируемое значение
    *
    * @returns {Object} Объект с признаком успешной проверки и типом ошибки
    */
			driverData: function driverData(params) {
				return this.regexp(_.extend(params, {
					regexp: '^\\d{2}\\s?([АВСЕНКМОРТХУавсенкмортхуABCEHKMOPTXYabcehkmoptxy]{2}|\\d{2})\\s?\\d{6}$|^$'
				}));
			},


			/**
    * Проверка платежного пароля
    *
    * @param {Object} params Параметры проверки
    * @param {String} params.value Валидируемое значение
    * @returns {Object} Объект с признаком успешной проверки и типом ошибки
    */
			sAuthPassword: function sAuthPassword(params) {
				var value = params.value;
				// eslint-disable-next-line no-useless-escape
				var regexp = /^[\040a-zA-Z0-9_\-\!\?\@\#\$\%\^\&amp;\*\(\)\+\=\{\}\[\]\;\:\.\>\<\,\\\/\`\~\|]+$/;

				if (!regexp.test(value)) {
					return {
						success: false,
						error: 'wrongFormat'
					};
				}

				return {
					success: true
				};
			},


			/**
    * Проверка поля на латинские символы и цифры
    * @param {Object} params Параметры проверки
    * @param {String} params.value Валидируемое значение
    * @returns {Object} Объект с признаком успешной проверки и типом ошибки
    */
			alfanum: function alfanum(params) {
				var value = params.value;
				var regexp = /^[a-z0-9]+$/i;

				if (!regexp.test(value)) {
					return {
						success: false,
						error: 'wrongFormat'
					};
				}

				return {
					success: true
				};
			},


			/**
    * Проверка поля адреса с индексом в начале
    * @param {Object} params Параметры проверки
    * @param {String} params.value Валидируемое значение
    * @returns {Object} Объект с признаком успешной проверки и типом ошибки
    */
			addressWithPostcode: function addressWithPostcode(params) {
				var value = params.value;
				var regexp = /^\d{6}/i;
				if (!regexp.test(value)) {
					return {
						success: false,
						error: 'wrongFormat'
					};
				}
				return {
					success: true
				};
			},


			/**
    * Проверка даты
    * Проверяет форматы, в которых цифрами являются только день,
    * месяц, год и идут в следующем порядке ДДММГГГГ
    *
    * @param {Object} params Параметры проверки
    * @param {String} params.value Валидируемое значение
    * @returns {Object} Объект с признаком успешной проверки и типом ошибки
    */
			docDate: function docDate(params) {
				var value = params.value.replace(/\D/g, '');
				if (value.length !== 8) {
					return {
						success: false,
						error: 'incorrectFormat'
					};
				}

				var year = ymLib.utils.toNum(value.substr(4, 4));
				var curDate = new Date();
				var isIncorrectYear = year > curDate.getFullYear();

				if (isIncorrectYear) {
					return {
						success: false,
						error: 'incorrectYear'
					};
				}

				var month = ymLib.utils.toNum(value.substr(2, 2));
				var isIncorrectMonth = month < 1 || month > 12;

				if (isIncorrectMonth) {
					return {
						success: false,
						error: 'incorrectMonth'
					};
				}

				var day = ymLib.utils.toNum(value.substr(0, 2));
				var daysInMonth = new Date(year, month, 1, -1).getDate();
				var isIncorrectDaysInMonth = day < 1 || day > daysInMonth;

				if (isIncorrectDaysInMonth) {
					return {
						success: false,
						error: 'incorrectDay'
					};
				}

				/*
    * Если и год в порядке, и месяц есть такой,
    * и число дней для месяца этого года тоже,
    * то проверим, чтобы введенная дата не была в будущем.
    */
				var monthName = function monthName(monthNum) {
					monthNum = monthNum || 0;
					var monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
					return monthNames[monthNum];
				};

				// Используем устаревший формат для совместимости с IE8-
				var docDateStr = monthName(month - 1) + ' ' + day + ', ' + year + ' 23:59:59';
				var docDate = Date.parse(docDateStr);
				if (docDate > curDate) {
					return {
						success: false,
						error: 'isFutureDate'
					};
				}

				return {
					success: true
				};
			},


			/**
    * Проверка даты выдачи паспорта
    * Проверяет форматы, в которых цифрами являются только день,
    * месяц, год и идут в следующем порядке ДДММГГГГ
    *
    * @param {Object} params Параметры проверки
    * @param {String} params.value Валидируемое значение
    * @returns {Object} Объект с признаком успешной проверки и типом ошибки
    */
			docIssueDate: function docIssueDate(params) {
				var docDateResult = this.docDate(params);

				// Если валидация не прошла, сразу возвращаем результат проверки даты
				if (!docDateResult.success) {
					return docDateResult;
				}

				/**
     * Документ должен быть выдан не больше чем N лет назад
     * @const
     * @type {Number}
     */
				var PAST_OFFSET_YEARS = 70;

				var value = params.value.replace(/\D/g, '');
				var year = ymLib.utils.toNum(value.substr(4, 4));
				var curDate = new Date();
				var isIncorrectYear = year < curDate.getFullYear() - PAST_OFFSET_YEARS;

				if (isIncorrectYear) {
					return {
						success: false,
						error: 'incorrectYear'
					};
				}

				return {
					success: true
				};
			},


			/**
    * Проверка даты рождения в паспорте
    * Проверяет форматы, в которых цифрами являются только день,
    * месяц, год и идут в следующем порядке ДДММГГГГ
    *
    * @param {Object} params Параметры проверки
    * @param {String} params.value Валидируемое значение
    * @returns {Object} Объект с признаком успешной проверки и типом ошибки
    */
			docBirthDate: function docBirthDate(params) {
				var docDateResult = this.docDate(params);

				// Если валидация не прошла, сразу возвращаем результат проверки даты
				if (!docDateResult.success) {
					return docDateResult;
				}
				var birthDateVal = params.value;

				/**
     * Пользователю не больше 120 лет
     * @const
     * @type {Number}
     */
				var MAX_AGE = 120;

				var moment = ymLib.utils.moment;
				var MIN_AGE = 14;
				var currentDate = moment();
				var diffDate = currentDate.diff(moment(birthDateVal, 'DD.MM.YYYY'), 'years', true);
				var isAdult = MIN_AGE <= diffDate;

				if (!(isAdult && MAX_AGE > diffDate)) {
					return {
						success: false,
						error: 'incorrectYear'
					};
				}

				return {
					success: true
				};
			}
		},

		/**
   * Обработка события изменения содержимого input'а - разрешает
   * только нажатия навигационных клавиш, комбинаций Ctrl/Alt/Shift
   * и ввод разрешённых символов.
   * Внимание! Не использовать совместно с formatter.js. У него свой фильтр и есть маска ввода.
   *
   * @param {object} event jQuery event object
   * @param {string} allowedChars Список разрешённых к вводу символов.
   * @param {jQuery} $control Jquery объект с текущим контролом
   */
		filterCharsMobile: function filterCharsMobile(event, allowedChars, $control) {
			/*
    * Если нажаты клавиатурные модификаторы, выходим без
    * фильтрации символов, чтобы разрешать комбинации
    * Ctrl+a,x,c,v и т.п.
    *
    */
			if (event.metaKey || event.ctrlKey) {
				return;
			}

			var illegalChars = new RegExp('[^' + allowedChars + ']', 'g');
			var newVal = $control.val();
			newVal = newVal.replace(illegalChars, '');

			if (this.value !== newVal) {
				$control.val(newVal);
			}
		},


		/**
   * Вызов цели Яндекс.Метрики
   * @param {String} goal название цели
   * @param {Object} goalParams параметры цели
   * @param {?Number|?String} customCounterId ID метрики для вызова цели счётчика отличного от i-global
   */
		customYandexMetricsGoal: function customYandexMetricsGoal(goal) {
			var goalParams = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
			var customCounterId = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;

			if (!_.isString(goal)) {
				/* eslint-disable no-console */
				console.warn('WARN goal не строка. Обработан не будет.');
				return;
			}

			var $bPage = $('.b-page');
			var bPage = void 0;
			// Для мобильной версии вместо блока b-page page
			if ($bPage.length) {
				bPage = $bPage.bem('b-page');
			} else {
				$bPage = $('.page');
				bPage = $bPage.bem('page');
			}
			var bStat = bPage.findBlockInside('stat-scripts');
			bStat && bStat.customYandexMetricsGoal(goal, goalParams, customCounterId);
		},


		/**
   * Вызов переданного метода на счётчиках
   * @param {Object} params параметры
   * @param {string} params.methodName Название метода
   * @param {Any[]} params.paramsList Список параметров метода
   * @param {number[]|string[]} params.customCounterId ID метрики для вызова цели счётчика, отличного от i-global
   * @public
   */
		callYandexMetricsMethod: function callYandexMetricsMethod(params) {
			if (!_.isString(params.methodName)) {
				/* eslint-disable no-console */
				console.warn('WARN methodName не строка. Обработан не будет.');
				return;
			}

			var $bPage = $('.b-page');
			var bPage = void 0;
			// Для мобильной версии вместо блока b-page page
			if ($bPage.length) {
				bPage = $bPage.bem('b-page');
			} else {
				$bPage = $('.page');
				bPage = $bPage.bem('page');
			}
			var bStat = bPage.findBlockInside('stat-scripts');
			bStat && bStat.callYandexMetricsMethod(params);
		},


		/**
   * Вызов цели Яндекс.Метрики для массива целей без параметров
   * @param {Array} goals массив целей
   * @param {Object} goalsParams объект с параметрами для цели
   */
		customYandexMetricsGoals: function customYandexMetricsGoals() {
			var goals = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
			var goalsParams = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

			var _this = this;

			if (!_.isArray(goals)) {
				/* eslint-disable no-console */
				console.warn('WARN goals не массив. Обработан не будет.');
				return;
			}

			_.each(goals, function (goal) {
				var goalParams = goalsParams[goal];
				_this.customYandexMetricsGoal(goal, goalParams);
			});
		},


		/**
   * Отправляет событие в амплитуд если он инициализирован на странице
   * @param {string} event имя события
   * @param {Object} params параметры
   */
		amplitudeLogEvent: function amplitudeLogEvent(event, params) {
			if (window && window.amplitude && window.amplitude.getInstance) {
				window.amplitude.getInstance().logEvent(event, params);
			}
		},


		/**
   * Вызов события gtag
   * @param {String} eventName название события
   * @param {Object} eventParams параметры события
   */
		gtagEvent: function gtagEvent(eventName, eventParams) {
			if (!_.isString(eventName)) {
				/* eslint-disable no-console */
				console.warn('WARN eventName не строка. Обработан не будет.');
				return;
			}

			var $bPage = $('.b-page');
			var bPage = void 0;
			// Для мобильной версии вместо блока b-page page
			if ($bPage.length) {
				bPage = $bPage.bem('b-page');
			} else {
				$bPage = $('.page');
				bPage = $bPage.bem('page');
			}
			var bStat = bPage.findBlockInside('stat-scripts');
			bStat && bStat.gtagEvent(eventName, eventParams);
		},


		/**
   * Вызов события VK
   * @param {String} eventName название события
   */
		vkRetargetingEvent: function vkRetargetingEvent(eventName) {
			if (!_.isString(eventName)) {
				/* eslint-disable no-console */
				console.warn('WARN eventName не строка. Обработан не будет.');
				return;
			}

			var $bPage = $('.b-page');
			var bPage = void 0;
			// Для мобильной версии вместо блока b-page page
			if ($bPage.length) {
				bPage = $bPage.bem('b-page');
			} else {
				$bPage = $('.page');
				bPage = $bPage.bem('page');
			}
			var bStat = bPage.findBlockInside('stat-scripts');
			bStat && bStat.vkRetargetingEvent(eventName);
		}
	};

	/**
  * @exports
  * @class basis
  * @bem
  */
	provide(basis);
});
/**
 * @module form
 */
modules.define('form', ['i-bem__dom', 'BEMHTML', 'lodash', 'jquery'], function (provide, BEMDOM, BEMHTML, _, $) {
	/**
  * @exports
  * @class form
  * @bem
  *
  * @bemmod faded Модификатор неактивности формы во время отправки
  */
	provide(BEMDOM.decl({ block: this.name, modName: 'ajax', modVal: 'yes' }, /** @lends form.prototype */{

		/**
   * @event redirect Генерируется при редиректе на заданный урл в результате ajax-запроса сабмита формы.
   */

		onSetMod: {
			js: {
				inited: function inited() {
					this.__base.apply(this, arguments);

					this._validationErrorMessage = BEM.I18N('form', 'wrong-format-field');

					/**
      * Блок paranja для модификатора faded
      * @private
      * @type {BEM}
      */
					this._paranja = this.findBlockOn(this.elem('paranja'), 'paranja');

					/**
      * Блок spinner для статуса ожидания
      * @private
      * @type {BEM}
      */
					this._bSpinner = null;

					/**
      * Preload паранджа на время до инициализации блока
      * @private
      * @type {BEM}
      */
					this._$preload = this.elem('preload');

					if (this._$preload) {
						BEMDOM.destruct(this._$preload);
					}

					/**
      * Параметры для повторной отправки формы в статусе ожидания ("кручение часиков")
      * @private
      * @type {Object}
      */
					this._retryParams = null;

					/**
      * Статус ожидания ответа от аякса
      * @private
      * @type {Boolean}
      */
					this._isAjaxInProgress = false;

					/**
      * Блок b-page
      * @private
      * @type {BEM}
      */
					this._bPage = this.findBlockOutside('b-page');

					/**
      * Блок статистики
      * @private
      * @type {BEM}
      */
					this._bStat = this._bPage.findBlockInside('stat-scripts');

					this._handleHistoryChange();
				}
			},

			faded: {
				yes: function yes() {
					this._paranja ? this._paranja.open() : this.disable();
				},
				'': function _() {
					this._paranja ? this._paranja.close() : this.unDisable();
				}
			}
		},

		/**
   * Добавляет обработчик изменения состояния страницы
   *
   * @private
   */
		_handleHistoryChange: function _handleHistoryChange() {
			var _this = this;
			window.addEventListener && window.addEventListener('popstate', function (event) {
				_this.updateContent(event.state);
			});
		},


		/**
   * Отправляет форму
   *
   * @public
   */
		sendAjaxRequest: function sendAjaxRequest() {
			var _this = this;
			// Используем параметры для повторной отправки, если есть, иначе параметры формы
			var ajaxData = _this._retryParams || _this.domElem.serialize();

			// По умолчанию исползуем урл из параметров блока или формы,
			// но если пришел урл в retryParams, то берем его
			var ajaxUrl = _this.params.ajaxUrl || _this.domElem.attr('action');
			if (_this._retryParams && _this._retryParams.retryUrl) {
				ajaxUrl = _this._retryParams.retryUrl;
			}

			// Если есть secret key добавляем его в параметры запроса
			if (this.params.sk) {
				ajaxData.sk = this.params.sk;
			}

			// Обнуляем параметры для повторной отправки
			_this._retryParams = null;
			// "надеваем" паранджу на форму
			_this.setMod('faded', 'yes');
			if (this.params.alwaysShowSpinner) {
				_this._startSpinner();
			}

			_this.ajaxRequest({
				method: _this.domElem.attr('method').toUpperCase(),
				data: ajaxData,
				url: ajaxUrl
			});
		},


		/**
   * Отправка ajax запроса
   *
   * @param {Object} options Параметры
   * @param {String} options.url Урл запроса
   * @param {Object} [options.data] Параметры запроса
   * @param {Object} [options.method = 'POST'] Метод запроса
   * @param {Object} [options.success] Функция обработчик в успешного выполнения
   * @param {Object} [options.error] Функция обработчик в случае ошибки
   */
		ajaxRequest: function ajaxRequest(options) {
			var _this = this;

			// Связываем методы с this блока.
			_.bindAll(_this, 'onXhrComplete', 'onXhrSuccess', 'onXhrError');

			$.ajax({
				type: options.method || 'POST',
				data: options.data || {},
				url: options.url,
				dataType: 'json',
				complete: _this.onXhrComplete,
				success: options.success || function (data) {
					// Принудительно снимаем статус "isAjaxInProgress", чтобы удалить спинер
					_this._isAjaxInProgress = false;
					_this.onXhrSuccess(data);
				},
				error: options.error || function () {
					// Принудительно снимаем статус "isAjaxInProgress", чтобы удалить спинер
					_this._isAjaxInProgress = false;
					_this.onXhrError();
				}
			});
		},


		/**
   * Обрабатывает завершение аякса
   *
   * @public
   */
		onXhrComplete: function onXhrComplete() {
			// Проверяем наличие DOM-элемента, т.к. блок может быть уже уничтожен (заменен на СУ или СО),
			// + проверяем признак статуса ожидания (т. к. на время ожидания паранджа не снимается)
			if (this.domElem && !this._isAjaxInProgress) {
				// "Снимаем" паранджу с формы
				this.delMod('faded');
				// Если до этого находились в статусе ожидания, останавливаем спиннер
				if (this._bSpinner) {
					this._bSpinner.close();
				}
			}
		},


		/**
   * Обрабатывает успешное выполнение аякса
   *
   * @public
   * @param {Object} data Ответ аякс-запроса
   */
		onXhrSuccess: function onXhrSuccess(data) {
			var _this = this;
			var status = data.status;
			var errors = _.get(data, 'errors');
			var validationErrors = _.get(data, 'errors.validationErrors.fields');
			// Проверяем ответ на наличие в форме валидационных ошибок
			if (status === 'success') {
				_this.onResponseSuccess(data);
			} else if (status === 'error' && validationErrors) {
				// Вывод валидационных ошибок
				_this.showErrors(errors);
			} else if (status === 'error' && errors) {
				// Обработка невалидационных ошибок
				_this.onResponseError(data);
			} else if (status === 'pending-auth') {
				// Если нужна аутентификация
				_this.onPendingAuth(data);
			} else if (status === 'progress') {
				_this.onRetry(data);
			} else {
				// Обработка неожиданного ответа
				_this.onResponseError(data);
			}
		},


		/**
   * Обработка ответа аякса со статусом pending-auth.
   * Метод вызывается, если нужна аутентификация
   *
   */
		onPendingAuth: function onPendingAuth() {
			/* eslint-disable no-console */
			console.error('Method onPendingAuth must be overridden');
		},


		/**
   * Выводит валидационные ошибки
   * В метод передаем весь объект errors, чтобы можно было переопределять его на своем уровне
   * и выводить ошибки в зависимости от других условий, вернувшихся в errors
   *
   * @public
   * @param {Object} errors Объект с ошибками
   */
		showErrors: function showErrors(errors) {
			var fields = errors.validationErrors.fields;
			// Вывод валидационных ошибок
			this._showValidationErrors(fields);
		},


		/**
   * Обрабатывает выполнение аякса с ошибкой
   *
   * @public
   */
		onXhrError: function onXhrError() {
			// По умолчанию ничего не делаем
		},


		/**
   * Обработка ответа аякса со статусом success
   *
   * @public
   */
		onResponseSuccess: function onResponseSuccess() {
			var ajaxSuccessRedirectUrl = this.params.ajaxSuccessRedirectUrl;

			// Редирект на заданный урл
			if (ajaxSuccessRedirectUrl) {
				this.emit('redirect');
				window.location = ajaxSuccessRedirectUrl;
			}
		},


		/**
   * Обработка ответа аякса со статусом error
   *
   * @public
   */
		onResponseError: function onResponseError() {
			// По умолчанию ничего не делаем
		},


		/**
   * Логика повторной отправки формы
   *
   * @param {Object} data ответ AJAX запроса
   */
		onRetry: function onRetry(data) {
			var _this = this;
			this._isAjaxInProgress = true;
			// Запускаем спиннер, если он еще не был запущен
			this._startSpinner();
			// Добавляем параметры для повторной отправки, если есть
			this._retryParams = data.retryParams || null;

			// Повторяем запрос каждые 3 секунды, пока не получим статус, отличный от "progress"
			window.setTimeout(function () {
				_this.sendAjaxRequest();
			}, 3000);
		},


		/**
   * Запускает спиннер с паранджой
   *
   * @private
   */
		_startSpinner: function _startSpinner() {
			// Запускаем спиннер, если он еще не был запущен
			if (!this._bSpinner) {
				// Создаем блок spinner
				var spinnerHtml = BEMHTML.apply({
					block: 'spinner',
					content: this.params.spinnerText || ''
				});

				this._bSpinner = BEMDOM.append(this._bPage.domElem, $(spinnerHtml)).bem('spinner');
			}

			this._bSpinner.open();
		},


		/**
   * Запускает спиннер с паранджой
   * Публичная обертка над _startSpinner
   *
   * @public
   * @returns {*}
   */
		startSpinner: function startSpinner() {
			return this._startSpinner();
		},


		/**
   * Показывает тултипы полей с ошибками
   *
   * @private
   * @param {Object} validationErrors Валидационные ошибки
   */
		_showValidationErrors: function _showValidationErrors(validationErrors) {
			var _this2 = this;

			// Для каждой ошибки ищем инпут и показываем тултип
			$.each(validationErrors, function (inputName, errorType) {
				// Получаем данные ошибки
				errorType = _.isObject(errorType) ? errorType.name : errorType;
				var errorData = _this2._getErrorData(errorType);

				var errorText = errorData.errorText;
				var callback = errorData.callback;
				var ignoreErrorTip = errorData.ignoreErrorTip;
				// инпут для отображения ошибки
				var $errorInput = _this2.domElem.find('[name="' + inputName + '"]').closest('.input');
				if ($errorInput.length) {
					var bInput = $errorInput.bem('input');
					var isDisabled = bInput.hasMod('disabled');

					if (!isDisabled && !ignoreErrorTip) {
						// Скрываем галку успешной валидации (QWEB-15725)
						if (bInput.bValidation && bInput.bValidation.getMod('success-mark') === 'yes') {
							bInput.bValidation.hideMark();
						}
						bInput.showErrorTip(errorText);
						// Очищаем инпут при ошибке, если передан параметр clearOnError
						_this2._clearInputOnError(bInput.findBlockOn('validation') || bInput.findBlockOutside('validation'));
						// lozenko: Ошибки в инпутах скрываются по фокусу в поле.
						// Поэтому если валидируемое поле находится в фокусе в момент сабмита (н-р, по нажатии enter),
						// навешиваем на ввод и очистку по крестику одноразовый обработчик для скрытия ошибки
						_this2._hideErrorOnFirstChange(bInput);
					}

					if (callback && _.isFunction(callback)) {
						callback();
					}
				}
			});
		},


		/**
   * Получает данные об ошибке
   *
   * @private
   * @param {String} errorType код ошибки
   * @returns {Object} текст ошибки и колбэк
   */
		_getErrorData: function _getErrorData(errorType) {
			// Дефолтный текст ошибки
			var errorText = this._validationErrorMessage;
			var callback = _.noop();
			var ignoreErrorTip = void 0;

			// Если у формы задан объект с параметрами серверных ошибок, используем его
			if (this.serverErrorsData) {
				// Находим тип ошибки
				var errorData = this.serverErrorsData[errorType];

				// Если ошибка описана в виде объекта, получаем текст ошибки и колбэк
				if (_.isObject(errorData)) {
					errorText = errorData.errorText || errorText;
					callback = errorData.callback || callback;
					ignoreErrorTip = errorData.ignoreErrorTip || false;
				} else {
					// иначе считаем, что задан только текст
					errorText = errorData || errorText;
				}
			} else {
				errorText = _.isString(errorType) ? errorType : errorText;
			}

			return {
				errorText: errorText,
				callback: callback,
				ignoreErrorTip: ignoreErrorTip
			};
		}
	}));
});
/**
 * @module input
 */

modules.define('input', ['i-bem__dom', 'control'], function (provide, BEMDOM, Control) {

    /**
     * @exports
     * @class input
     * @augments control
     * @bem
     */
    provide(BEMDOM.decl({ block: this.name, baseBlock: Control }, /** @lends input.prototype */{
        onSetMod: {
            'js': {
                'inited': function inited() {
                    this.__base.apply(this, arguments);
                    this._val = this.elem('control').val();
                }
            }
        },

        /**
         * Returns control value
         * @returns {String}
         * @override
         */
        getVal: function getVal() {
            return this._val;
        },

        /**
         * Sets control value
         * @param {String} val value
         * @param {Object} [data] additional data
         * @returns {input} this
         */
        setVal: function setVal(val, data) {
            val = String(val);

            if (this._val !== val) {
                this._val = val;

                var control = this.elem('control');
                control.val() !== val && control.val(val);

                this.emit('change', data);
            }

            return this;
        }
    }, /** @lends input */{
        live: function live() {
            this.__base.apply(this, arguments);
            return false;
        }
    }));
});
/**
 * @module input
 */

modules.define('input', ['tick', 'idle'], function (provide, tick, idle, Input) {

    var instances = [],
        boundToTick,
        bindToTick = function bindToTick() {
        boundToTick = true;
        tick.on('tick', update).start();
        idle.on({
            idle: function idle() {
                tick.un('tick', update);
            },
            wakeup: function wakeup() {
                tick.on('tick', update);
            }
        }).start();
    },
        update = function update() {
        var instance,
            i = 0;
        while (instance = instances[i++]) {
            instance.setVal(instance.elem('control').val());
        }
    };

    /**
     * @exports
     * @class input
     * @bem
     */
    provide(Input.decl( /** @lends input.prototype */{
        onSetMod: {
            'js': {
                'inited': function inited() {
                    this.__base.apply(this, arguments);

                    boundToTick || bindToTick();

                    // сохраняем индекс в массиве инстансов чтобы потом быстро из него удалять
                    this._instanceIndex = instances.push(this) - 1;
                },

                '': function _() {
                    this.__base.apply(this, arguments);

                    // удаляем из общего массива instances
                    instances.splice(this._instanceIndex, 1);
                    // понижаем _instanceIndex всем тем кто был добавлен в instances после нас
                    var i = this._instanceIndex,
                        instance;
                    while (instance = instances[i++]) {
                        --instance._instanceIndex;
                    }
                }
            }
        },

        /**
         * Нормализация установки фокуса для IE
         * @private
         * @override
         */
        _focus: function _focus() {
            var input = this.elem('control')[0];
            if (input.createTextRange && !input.selectionStart) {
                var range = input.createTextRange();
                range.move('character', input.value.length);
                range.select();
            } else {
                input.focus();
            }
        }
    }));
});
/**
 * @module input
 */
modules.define('input', ['i-bem__dom', 'BEMHTML', 'keycodes', 'jquery', 'lodash'], function (provide, BEMDOM, BEMHTML, keycodes, $, _, Input) {
	/**
  * @exports
  * @class input
  * @bem
  */
	provide(Input.decl(this.name, /** @lends input.prototype */{
		onSetMod: {
			js: {
				inited: function inited() {
					this.__base.apply(this, arguments);
					// Тримим значение, у строки с пробелами будет виден крестик
					this._val && this.setVal(this._val.trim());

					/**
      * Всплывающие тултипы к текущему инпуту.
      * Может хранить блок tooltip для ошибки и для подсказки.
      *
      * @private
      * @type {Object}
      */
					this._tooltips = {
						error: null,
						hint: null
					};

					/**
      * Блок валидации текущего контрола, eсли он есть.
      *
      * @public
      * @type {Object}
      */
					this.bValidation = this.findBlockOn('validation');

					// При фокусе скрываем всплывающую ошибку
					// Не вынесено в onSetMod.focuced.true,
					// потому что в некоторых модификаторах есть отписка от скрытия ошибки по фокусу
					this.on('focus', this.hideErrorTip, this);

					this._bRightIcon = this.findBlockOn(this.elem('icon', 'side', 'right'), 'icon');
				}
			},

			focused: {
				true: function _true() {
					this.__base.apply(this, arguments);
					this.emit('focus');

					// Показываем подсказку, если она есть
					this.params.hintMessage && this.showHintTip({ content: this.params.hintMessage });
				},
				'': function _() {
					this.__base.apply(this, arguments);

					// При снятии фокуса тримим значение
					var newVal = this.getVal();
					newVal && this.setVal(newVal.trim());

					// Скрываем подсказку, если она есть
					this.params.hintMessage && this.hideHintTip();
					this.emit('blur');
				}
			}
		},

		/**
   * Проверяет задизейбленность поля
   *
   * @deprecated Использовать this.hasMod('disabled');
   * @public
   * @returns {Boolean}
   */
		isDisabled: function isDisabled() {
			return this.hasMod('disabled');
		},


		/**
   * Получает или возвращает значение
   *
   * @deprecated Использовать setVal/getVal
   * @public
   * @param {String} [val] Устанавливаемое значение.
   * @param {Object} [data] Дополнительные данные, которые будут переданы в обработчик события `change`.
   * @returns {BEMDOM|String}
   */
		val: function val(_val, data) {
			var hasVal = typeof _val !== 'undefined';
			if (hasVal) {
				this.setVal(_val, data);
				return this;
			} else {
				return this.getVal();
			}
		},


		/**
   * Сбрасывает результат валидации
   *
   * @public
   */
		resetValidation: function resetValidation() {
			this.hideErrorTip();
			if (this.bValidation && this.bValidation.getValidationState() === 'failed') {
				this.bValidation.setValidationState('');
			}
		},


		/**
   * Показывает или скрывает галку успешной валидации, если она есть
   *
   * @public
   */
		toggleSuccessMark: function toggleSuccessMark() {
			if (this.bValidation && this.bValidation.hasMod('success-mark', 'yes')) {
				// В зависимости от статуса валидации скрываем или показываем галку
				var markMod = this.bValidation.getValidationState() === 'failed' ? 'yes' : '';

				this.bValidation.setMod(this.bValidation._$mark, 'hidden', markMod);
			}
		},


		/**
   * Показывает всплывающую ошибку
   *
   * @public
   * @param {object|string} params Параметры подсказки или текст ошибки.
   * @param {string} params.content Содержимое ошибки
   * @param {string} [params.unclosable=''] Значение модификатора незакрываемого тултипа ('yes', '')
   * @param {string} [params.custom=''] Значение модификатора custom для тултипа
   */
		showErrorTip: function showErrorTip(params) {
			var hintTip = this._tooltips.hint;
			var isHintTipShown = hintTip ? hintTip.hasMod('visible') : false;
			var content = params;
			var unclosable = '';
			var custom = '';

			if (_.isObject(params)) {
				content = params.content || content;
				unclosable = params.unclosable || '';
				custom = params.custom || '';
			}

			if (!content && this.params.defaultErrorTipContent) {
				content = this.params.defaultErrorTipContent;
			}

			// Если видим тултип подсказки, скрываем его
			if (isHintTipShown) {
				hintTip.delMod('visible');
			}

			this._showTip({
				type: 'error',
				theme: 'error',
				unclosable: unclosable,
				custom: custom,
				content: content
			});
		},


		/**
   * Скрывает всплывающую ошибку
   *
   * @public
   */
		hideErrorTip: function hideErrorTip() {
			this._hideTip({ type: 'error' });
		},


		/**
   * Показывает всплывающую подсказку
   *
   * @public
   * @param {object} params Параметры подсказки.
   * @param {string} params.content Содержимое подсказки.
   * @param {string} [params.tipTheme='normal'] Тема подсказки.
   * @param {string} [params.unclosable=''] Значение модификатора незакрываемого тултипа ('yes', '')
   * @param {string} [params.custom] Значение модификатора custom для тултипа
   */
		showHintTip: function showHintTip(params) {
			this._showTip({
				type: 'hint',
				theme: params.theme,
				unclosable: params.unclosable || '',
				custom: params.custom,
				content: params.content
			});
		},


		/**
   * Скрывает всплывающую подсказку
   *
   * @public
   */
		hideHintTip: function hideHintTip() {
			this._hideTip({ type: 'hint' });
		},


		/**
   * Показывает всплывающий тултип
   *
   * @private
   * @param {Object} options Опции для показа
   * @param {String} options.type Тип тултипа - 'error' или 'hint'
   * @param {String} [options.content] Содержимое тултипа
   */
		_showTip: function _showTip(options) {
			var type = options.type;
			var tipContent = options.content || '';
			var defaultTheme = type === 'error' ? 'error' : 'normal';
			var tooltipTheme = options.theme || defaultTheme;
			var customTip = this.hasMod('customTip') ? this.getMod('customTip') : '';
			customTip = options.custom || customTip;

			if (!this._tooltips) {
				return;
			}

			// eslint-disable-next-line
			if (!this._tooltips[type]) {
				var isAutoclosable = type !== 'error';
				// Если у инпута есть внешняя иконка (напр, удаление поля),
				// делаем больший отступ
				// @todo Добавить параметр tipOffset к инпутам с иконками
				// и убрать проверку this.hasMod('outer-icon')
				var tooltipOffset = this.params.tipOffset || 10;
				var tooltipAxis = this.params.tipAxis || 'top';
				var tooltipSize = this.params.tooltipSize ? this.params.tooltipSize : this.getMod('size');

				var tooltipHtml = BEMHTML.apply({
					block: 'tooltip',
					mods: {
						theme: tooltipTheme,
						size: tooltipSize,
						autoclosable: isAutoclosable,
						unclosable: options.unclosable,
						custom: customTip
					},
					js: {
						offset: tooltipOffset,
						directions: this.params.tipDirections || ['right'],
						axis: tooltipAxis
					},
					content: tipContent
				});

				var $tooltip = $(tooltipHtml).insertBefore(this.domElem);
				BEMDOM.init($tooltip);

				this._tooltips[type] = $tooltip.bem('tooltip');
			} else {
				// Если тултип уже создан, но тема при новом показе отличается, обновляем ее
				if (tooltipTheme !== this._tooltips[type].getMod('theme')) {
					this._tooltips[type].setMod('theme', tooltipTheme);
				}

				// Если параметры закрывания тултипа отличаются, обновляем их
				if (options.unclosable !== this._tooltips[type].getMod('unclosable')) {
					this._tooltips[type].setMod('unclosable', options.unclosable);
				}

				// Если кастомные стили тултипа отличаются от первоначальных, обновляем их
				if (options.customTip !== this.getMod('customTip')) {
					this._tooltips[type].setMod('custom', customTip);
				}
			}

			if (tipContent) {
				this._tooltips[type].setContent(tipContent);
			}

			this._tooltips[type].setOwner(this).setMod('visible');
		},


		/**
   * Скрывает всплывающий тултип
   *
   * @private
   * @param {Object} options Опции для показа
   * @param {String} options.type Тип тултипа - 'error' или 'hint'
   */
		_hideTip: function _hideTip(options) {
			this._tooltips[options.type] && this._tooltips[options.type].delMod('visible');
		},


		/**
   * Обработка события изменения содержимого input'а - разрешает
   * только нажатия навигационных клавиш, комбинаций Ctrl/Alt/Shift
   * и ввод разрешённых символов.
   * @param {object} event jQuery event object
   * @param {string} allowedChars Список разрешённых к вводу символов.
   */
		filterChars: function filterChars(event, allowedChars) {
			/*
    * Если нажаты клавиатурные модификаторы, выходим без
    * фильтрации символов, чтобы разрешать комбинации
    * Ctrl+a,x,c,v и т.п.
    *
    */
			if (event.metaKey || event.ctrlKey) {
				return;
			}

			var charCode = event.which;
			var character = String.fromCharCode(charCode);

			// Символ находится в наборе разрешённых.
			if (keycodes.isNavKey(charCode) || keycodes.isSpecialKey(charCode) || allowedChars.indexOf(character) > -1) {
				return;
			}

			// Отменяем событие и ввод символа.
			event.preventDefault();
		},


		/**
   * Показ правой иконки если она есть
   */
		showRightIcon: function showRightIcon() {
			this._bRightIcon && this._bRightIcon.delMod('hidden');
		},


		/**
   * Скрытие правой иконки если она есть
   */
		hideRightIcon: function hideRightIcon() {
			this._bRightIcon && this._bRightIcon.setMod('hidden', 'yes');
		},


		/**
   * Переключение видимости правой иконки если она есть
   */
		toggleRightIcon: function toggleRightIcon() {
			if (!this._bRightIcon) {
				return;
			}

			if (this._bRightIcon.hasMod('hidden')) {
				this.showRightIcon();
				return;
			}

			this.hideRightIcon();
		}
	}));
});
/**
 * @module input
 */

modules.define('input', function (provide, Input) {

    /**
     * @exports
     * @class input
     * @bem
     */
    provide(Input.decl({ modName: 'has-clear', modVal: true }, /** @lends input.prototype */{
        onSetMod: {
            'js': {
                'inited': function inited() {
                    this.__base.apply(this, arguments);

                    this.on('change', this._updateClear)._updateClear();
                }
            }
        },

        _onClearClick: function _onClearClick() {
            this.setVal('', { source: 'clear' }).setMod('focused');
        },

        _updateClear: function _updateClear() {
            this.toggleMod(this.elem('clear'), 'visible', true, !!this._val);
        }
    }, /** @lends input */{
        live: function live() {
            this.liveBindTo('clear', 'pointerclick', function () {
                this._onClearClick();
            });

            return this.__base.apply(this, arguments);
        }
    }));
});
modules.define('input', function (provide, Input) {

    provide(Input.decl({ modName: 'has-clear', modVal: true }, {
        _onBoxClick: function _onBoxClick() {
            this.hasMod(this.elem('clear'), 'visible') || this.setMod('focused');
        }
    }, {
        live: function live() {
            this.liveBindTo('box', 'pointerclick', function () {
                this._onBoxClick();
            });

            return this.__base.apply(this, arguments);
        }
    }));
});
modules.define('popup', ['objects'], function (provide, objects, Popup) {

    provide(Popup.decl({ modName: 'theme', modVal: 'islands' }, {
        getDefaultParams: function getDefaultParams() {
            return objects.extend(this.__base(), {
                mainOffset: 5,
                viewportOffset: 10
            });
        }
    }));
});
/**
 * @module popup
 */
modules.define('popup', ['objects'], function (provide, objects, Popup) {
	/**
  * @exports
  * @class popup
  */
	provide(Popup.decl({ block: this.name, modName: 'theme', modVal: 'normal' }, /** @lends popup.prototype */{
		getDefaultParams: function getDefaultParams() {
			return objects.extend(this.__base(), {
				mainOffset: 5,
				viewportOffset: 10
			});
		}
	}));
});
/**
 * @module popup
 */

modules.define('popup', function (provide, Popup) {

    /**
     * @exports
     * @class popup
     * @bem
     */
    provide(Popup.decl({ modName: 'target', modVal: 'position' }, /** @lends popup.prototype */{
        beforeSetMod: {
            'visible': {
                'true': function _true() {
                    if (!this._position) throw Error('Can\'t show popup without position');
                }
            }
        },

        onSetMod: {
            'js': {
                'inited': function inited() {
                    this.__base.apply(this, arguments);
                    this._position = null;
                }
            }
        },

        /**
         * Sets position
         * @param {Number} left x-coordinate
         * @param {Number} top y-coordinate
         * @returns {popup} this
         */
        setPosition: function setPosition(left, top) {
            this._position = { left: left, top: top };
            return this.redraw();
        },

        /**
         * @override
         */
        _calcTargetDimensions: function _calcTargetDimensions() {
            var pos = this._position;

            return {
                left: pos.left,
                top: pos.top,
                width: 0,
                height: 0
            };
        }
    }));
});
/**
 * @module select
 */
modules.define('select', function (provide, Select) {
	/**
  * @exports
  * @class select
  * @bem
  */
	provide(Select.decl({ modName: 'type', modVal: 'country' }, /** @lends select.prototype */{
		// переопределение min-width на width - фиксируем ширину попапа по ширине кнопки
		_updateMenuWidth: function _updateMenuWidth() {
			this._menu.domElem.css('width', this._buttonWidth = this._button.domElem.outerWidth());
			this._popup.redraw();
		}
	}));
});
/**
 * @module select
 */

modules.define('select', function (provide, Select) {

    /**
     * @exports
     * @class select
     * @bem
     */
    provide(Select.decl({ modName: 'mode', modVal: 'radio' }, /** @lends select.prototype */{
        _updateControl: function _updateControl() {
            var val = this.getVal();
            this.elem('control').val(val);
        },

        _updateButton: function _updateButton() {
            this._button.setText(this._getCheckedItems()[0].getText());
        },

        _onMenuItemClick: function _onMenuItemClick(_, data) {
            data.source === 'pointer' && this.delMod('opened');
        }
    }));
});
/**
 * @module select
 */

modules.define('select', ['i-bem__dom', 'jquery', 'BEMHTML'], function (provide, BEMDOM, $, BEMHTML, Select) {
	/**
  * @exports
  * @class select
  * @bem
  */
	provide(Select.decl({ modName: 'mode', modVal: 'radio' }, /** @lends select.prototype */{
		/**
   * Переписываем метод, чтобы можно было добавлять не только строки, но и блоки
   * @override
   **/
		_updateButton: function _updateButton() {
			var $buttonText = this._button.findElem('text');

			$buttonText.replaceWith(BEMDOM.init($(BEMHTML.apply({
				block: 'button',
				elem: 'text',
				content: this._getCheckedItems()[0].getText()
			}))));
		}
	}));
});
/**
 * @module menu
 */

modules.define('menu', function (provide, Menu) {

    /**
     * @exports
     * @class menu
     * @bem
     */
    provide(Menu.decl({ modName: 'mode', modVal: 'radio' }, /** @lends menu.prototype */{
        /**
         * @override
         */
        _getVal: function _getVal() {
            var items = this.getItems(),
                i = 0,
                item;

            while (item = items[i++]) {
                if (item.hasMod('checked')) return item.getVal();
            }
        },

        /**
         * @override
         */
        _setVal: function _setVal(val) {
            var wasChanged = false,
                hasVal = false,
                itemsCheckedVals = this.getItems().map(function (item) {
                if (!item.isValEq(val)) return false;

                item.hasMod('checked') || (wasChanged = true);
                return hasVal = true;
            });

            if (!hasVal) return false;

            this._updateItemsCheckedMod(itemsCheckedVals);

            return wasChanged;
        },

        /**
         * @override
         */
        _onItemClick: function _onItemClick(clickedItem) {
            this.__base.apply(this, arguments);

            var isChanged = false;
            this.getItems().forEach(function (item) {
                if (item === clickedItem) {
                    if (!item.hasMod('checked')) {
                        item.setMod('checked', true);
                        this._isValValid = false;
                        isChanged = true;
                    }
                } else {
                    item.delMod('checked');
                }
            }, this);
            isChanged && this.emit('change');
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
    provide(Button.decl({ modName: 'type', modVal: 'link' }, /** @lends button.prototype */{
        onSetMod: {
            'js': {
                'inited': function inited() {
                    this.__base.apply(this, arguments);
                    this._url = this.params.url || this.domElem.attr('href');

                    this.hasMod('disabled') && this.domElem.removeAttr('href');
                }
            },

            'disabled': {
                'true': function _true() {
                    this.__base.apply(this, arguments);
                    this.domElem.removeAttr('href').attr('aria-disabled', true);
                },

                '': function _() {
                    this.__base.apply(this, arguments);
                    this.domElem.attr('href', this._url).removeAttr('aria-disabled');
                }
            }
        },

        /**
         * Returns url
         * @returns {String}
         */
        getUrl: function getUrl() {
            return this._url;
        },

        /**
         * Sets url
         * @param {String} url
         * @returns {button} this
         */
        setUrl: function setUrl(url) {
            this._url = url;
            this.hasMod('disabled') || this.domElem.attr('href', url);
            return this;
        },

        _doAction: function _doAction() {
            this._url && (document.location = this._url);
        }
    }));
});
modules.define('jquery', function (provide, $) {

    $.each({
        pointerpress: 'pointerdown',
        pointerrelease: 'pointerup pointercancel'
    }, function (fix, origEvent) {
        function eventHandler(e) {
            if (e.which === 1) {
                var fixedEvent = cloneEvent(e);
                fixedEvent.type = fix;
                fixedEvent.originalEvent = e;
                return $.event.dispatch.call(this, fixedEvent);
            }
        }

        $.event.special[fix] = {
            setup: function setup() {
                $(this).on(origEvent, eventHandler);
                return false;
            },
            teardown: function teardown() {
                $(this).off(origEvent, eventHandler);
                return false;
            }
        };
    });

    function cloneEvent(event) {
        var eventCopy = $.extend(new $.Event(), event);
        if (event.preventDefault) {
            eventCopy.preventDefault = function () {
                event.preventDefault();
            };
        }
        return eventCopy;
    }

    provide($);
});
/**
 * Тултип
 */
modules.define('tooltip', ['i-bem__dom', 'BEMHTML'], function (provide, BEMDOM, BEMHTML) {
	provide(BEMDOM.decl(this.name, {
		/**
   * Генерируется при клике по подсказке.
   *
   * @event tooltip#click
   */

		/**
   * Генерируется при показе подсказки.
   *
   * @event tooltip#show
   */

		/**
   * Генерируется при скрытии подсказки.
   *
   * @event tooltip#hide
   */

		onSetMod: {
			js: {
				inited: function inited() {
					this._popup = null;
					this._owner = null;
				}
			},

			shown: {
				yes: function yes() {
					this.setMod('visible');
				},
				'': function _() {
					this.delMod('visible');
				}
			},
			visible: {
				true: function _true() {
					this.setAnchor(this._owner)._getPopup().setMod('visible').unbindFromDoc('keydown');

					this._bPage = this.findBlockOutside('b-page');
					this._bPageLayout = this._bPage.findBlockInside('page-layout') || '';

					if (this._bPageLayout) {
						// В зависимости от типа страницы устанавливаем модификатор
						// минимального отступа тултипа от правого края экрана
						var pageLayoutTheme = this._bPageLayout.getMod('theme') || '';
						var tooltipMarginMod = '';

						switch (pageLayoutTheme) {
							// витрины во фрейме - отступ 25px (со скроллом 42px)
							case 'iframe-showcase':
								{
									tooltipMarginMod = this._bPage.findBlockInside('scroll') ? 'xl' : 'l';
									break;
								}
							// промо страницы с белой рамкой - отступ 18px
							case 'promo':
								{
									tooltipMarginMod = 'm';
									break;
								}
							// все остальные страницы - отступ 8px
							default:
								{
									tooltipMarginMod = 's';
								}
						}

						this.setMod('margin', tooltipMarginMod);
					}
				},
				'': function _() {
					this.delMod('visible');
					this._getPopup().delMod('visible');
				}
			}
		},

		/**
   * Устанавливаем модификатор видимости блоку
   * @public
   */
		show: function show() {
			this.setMod('visible');
		},


		/**
   * Устанавливает якорь, к которому указывает тултип
   * @param {BEM|BEMDOM} anchor якорь для тултипа
   * @returns {BEMDOM} this
   * @public
   */
		setAnchor: function setAnchor(anchor) {
			this.setOwner(anchor)._getPopup().setAnchor(anchor);
			return this;
		},


		/**
   * Позиционирует элемент относительно координаты на странице
   * @param {Number} left Горизонтальная координата
   * @param {Number} top Вертикальная координата
   * @public
   */
		setPosition: function setPosition(left, top) {
			this._getPopup().setPosition(left, top);
		},


		/**
   * Возвращает объект на который указывает тултип
   *
   * @public
   * @returns {BEMDOM|jQuery}
   */
		getOwner: function getOwner() {
			return this._owner;
		},


		/**
   * Определяет объект на который будет указывать тултип
   *
   * ```js
   * tooltip.setOwner(ownerBlock).setMod('visible');
   * ```
   *
   * @public
   * @param {BEMDOM|jQuery} owner Якорь для тултипа
   * @returns {BEMDOM} this
   */
		setOwner: function setOwner(owner) {
			this._owner = owner;
			return this;
		},


		/**
   * Устанавливает содержимое блока.
   *
   * @public
   * @param {String|jQuery} content jQuery-элемент или строка, используемые в качестве содержимого.
   * @returns {BEMDOM}
   */
		setContent: function setContent(content) {
			this._getPopup().setContent(BEMHTML.apply([{ block: 'tooltip', elem: 'tail' }, { block: 'tooltip', elem: 'content', content: content }]));
			return this;
		},


		/**
   * Перерисовывает подсказку относительно заданного `owner`, в случае если она показана.
   *
   * @public
   * @returns {BEMDOM} this
   */
		redraw: function redraw() {
			if (this.hasMod('shown', 'yes') || this.hasMod('visible')) {
				this._getPopup().redraw();
			}
			return this;
		},


		/**
   * Устанавливает содержимое блока.
   *
   * @public
   * @param {String|jQuery} content jQuery-элемент или строка, используемые в качестве содержимого.
   * @returns {BEMDOM}
   */
		_getPopup: function _getPopup() {
			if (!this._popup) {
				this._popup = this.findBlockOn('popup').on('beforeOpen', this._onPopupShow, this).on('beforeClose', this._onPopupHide, this);
			}

			return this._popup;
		},


		/**
   * Показ тултипа по событию попапа
   *
   * @private
   */
		_onPopupShow: function _onPopupShow() {
			// не уносить в обработчик модификатора, потому что события попапа инициализируются асинхронно
			this.emit('show');
		},


		/**
   * Скрытие тултипа при скрытии попапа
   *
   * @private
   */
		_onPopupHide: function _onPopupHide() {
			this.delMod('visible').emit('hide');
		},


		/**
   * Скрытие по клику
   *
   * @private
   */
		_onClick: function _onClick() {
			this.emit('click').delMod('visible');
		}
	}, {
		live: function live() {
			this.liveBindTo('click', function () {
				this._onClick();
			});
		}
	}));
});
/**
 * @module b-page
 */
modules.define('b-page', ['i-bem__dom', 'i-global'], function (provide, BEMDOM, bGlob) {
	/**
  * @exports
  * @class b-page
  * @bem
  */
	provide(BEMDOM.decl(this.name, /** @lends b-page.prototype */{
		onSetMod: {
			js: function js() {
				var userId = this.params.userId;
				if (userId) {
					this.findBlockInside('stat-scripts').setCustomYaMetricsUserID(userId);
				}
			}
		},

		/**
   * Переходит на страницу авторизации с возвратом на retpath
   *
   * @param {Object} options options
   * @param {String} options.retpath Retpath
   * @public
   */
		goToAuth: function goToAuth() {
			var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
			var retpath = options.retpath;


			retpath = retpath || bGlob.param('retpath');

			var loginUrl = '/yooid/login?origin=Wallet&returnUrl=' + encodeURIComponent(retpath);

			window.location = loginUrl;
		}
	}));
});
/* end: ./bc-common.js */
/* begin: ./bc-common.lang.all.js */
(function(global_, bem_, undefined) {

// Check if BEM.I18N was already initialized
if (typeof bem_.I18N === 'function' && bem_.I18N._proto) {
	return bem_.I18N;
}

/**
 * Support tanker-like syntax of keys in `i-bem__i18n`
 * @example
 *  i18n['prj']['keyset']['key'](params)
 */
if (typeof i18n === 'undefined') {
	/* jshint -W020 */
	i18n = {};
	/* jshint +W020 */
}

/* jshint -W020 */
BEM = bem_;
/* jshint +W020 */

var MOD_DELIM = '_',
	ELEM_DELIM = '__',
	DEFAULT_LANG = 'ru',
	cache = {},
	// {String[]} A stack used for restoring context of dynamic keysets
	stack = [],
	debug = false,
	// @see http://whattheheadsaid.com/2011/04/internet-explorer-9s-problematic-console-object
	hasConsole = typeof console !== 'undefined' && typeof console.log === 'function';

function log() {
	if (debug && hasConsole) {
		console.log.apply(console, arguments);
	}
}

function bemName(decl) {
	typeof decl === 'string' && (decl = { block : decl });

	return decl.block +
		(decl.elem? (ELEM_DELIM + decl.elem) : '') +
		(decl.modName? MOD_DELIM + decl.modName + MOD_DELIM + decl.modVal : '');
}

function bemParse(name) {
	var bemitem = {};

	name.split(ELEM_DELIM).forEach(function(item, i) {
		var keys = [i? 'elem' : 'block', 'mod', 'val'];

		item.split(MOD_DELIM).forEach(function(part, j) {
			bemitem[keys[j]] = part;
		});
	});

	return bemitem;
}

function _pushStack(name) {
	if (!name) return false;
	return stack.push(name);
}

function _popStack() {
	return stack.length && stack.pop();
}

/**
 * @constructor
 */
function _i18n() {
	this._lang = '';
	this._prj = 'bem-core';
	this._keyset = '';
	this._key = '';
}

_i18n.prototype = {

	lang : function(name) {
		this._lang = name;
		return this;
	},

	project : function(name) {
		this._prj = name;
		return this;
	},

	keyset : function(name, saveCtx) {
		saveCtx && _pushStack(this._keyset);

		this._keyset = bemName(name);
		return this;
	},

	key : function(name) {
		this._key = name;
		return this;
	},

	/**
	 * FIXME: Move legacy-syntax support into separate method
	 * @param {Object|Function} v
	 */
	decl : function(v) {
		var bemitem = bemParse(this._keyset),
			// tanker legacy syntax
			prj = bemitem.block === 'i-tanker'? 'tanker' : this._prj,
			keyset = bemitem.elem || this._keyset,
			key = this._key;

		prj = i18n[prj] || (i18n[prj] = {});
		keyset = prj[keyset] || (prj[keyset] = {});
		keyset[key] = typeof v === 'function'? v : (function() { return (v); });

		// `BEM.I18N` syntax
		var l = cache[this._lang] || (cache[this._lang] = {}),
			k = l[this._keyset] || (l[this._keyset] = {});

		k[key] = v;
	},

	val : function(params, ctx) {
		var value = cache[this._lang] && cache[this._lang][this._keyset],
			debugString = 'keyset: ' + this._keyset + ' key: ' + this._key + ' (lang: ' + this._lang + ')';

		if (!value) {
			log('[I18N_NO_KEYSET] %s', debugString);
			return '';
		}

		value = value[this._key];

		var valtype = typeof value;
		if (valtype === 'undefined') {
			log('[I18N_NO_VALUE] %s', debugString);
			return '';
		}

		if (valtype === 'string') {
			return value;
		}

		ctx || (ctx = this);

		// TODO: try/catch
		return value.call(ctx, params);
	},

	_cache : function() { return cache; }

};

/**
 * @namespace
 * @lends BEM.I18N
 */
bem_.I18N = (function(base) {

	/**
	 * Shortcut to get key value
	 *
	 * @param {String|Object} keyset
	 * @param {String} key
	 * @param {Object} [params]
	 * @returns {String}
	 */
	var klass = function(keyset, key, params) {
		return klass.keyset(keyset).key(key, params);
	};

	klass._proto = base;

	/**
	 * @param {String} name
	 * @returns {BEM.I18N}
	 */
	klass.project = function(name) {
		this._proto.project(name);
		return this;
	};

	/**
	 * @param {String} name
	 * @returns {BEM.I18N}
	 */
	klass.keyset = function(name) {
		this._proto.keyset(name, true);
		return this;
	};

	/**
	 * @param {String} name Key name
	 * @param {Object} params
	 * @returns {String}
	 */
	klass.key = function(name, params) {
		var proto = this._proto,
			result,
			ksetRestored;

		proto.lang(this._lang).key(name);

		// TODO: kiss
		result = proto.val.call(proto, params, klass);

		// restoring keyset's context
		// NOTE: should not save current ctx, `saveCtx = false`
		ksetRestored = _popStack();
		ksetRestored && proto.keyset(ksetRestored, false);

		return result;
	};

	/**
	 * Declaration of translations
	 *
	 * @param {String|Object} bemitem
	 * @param {Object} keysets
	 * @param {Object} [params] declaration params
	 * @returns {BEM.I18N}
	 */
	klass.decl = function(bemitem, keysets, params) {
		var proto = this._proto,
			k;

		params || (params = {});
		params.lang && proto.lang(params.lang);

		proto.keyset(bemitem);

		for(k in keysets) {
			if (keysets.hasOwnProperty(k)) {
				proto.key(k).decl(keysets[k]);
			}
		}

		return this;
	};

	/**
	 * Get/set current language
	 *
	 * @param {String} [lang]
	 * @returns {String}
	 */
	klass.lang = function(lang) {
		typeof lang !== 'undefined' && (this._lang = lang);
		return this._lang;
	};

	klass.debug = function(flag) {
		debug = !!flag;
	};

	klass.lang(DEFAULT_LANG);

	return klass;

}(new _i18n()));

})(this, typeof BEM === 'undefined'? {} : BEM);

/* end: ./bc-common.lang.all.js */
/* begin: ./bc-common.lang.ru.js */
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

BEM.I18N.decl('basis', {
    "func-call": function(params) { return (function(params) { return (typeof params.func === "function") ? params.func(params.pass) : params.pass;  }).call(this, params) },
    "april-parental": "апреля",
    "august-parental": "августа",
    "december-parental": "декабря",
    "february-parental": "февраля",
    "january-parental": "января",
    "july-parental": "июля",
    "june-parental": "июня",
    "march-parental": "марта",
    "may-parental": "мая",
    "november-parental": "ноября",
    "october-parental": "октября",
    "september-parental": "сентября",
    "today": "Сегодня",
    "tomorrow": "Завтра",
    "yesterday": "Вчера"
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
    "empty-phone": "Укажите свой телефон"
}, {
"lang": "ru"
});

BEM.I18N.decl('i-tanker__dynamic', {
    "gender": function(params) { return (function(params) { 
        return params[params.gender];
     }).call(this, params) },
    "plural": function(params) { return (function(params) { var count = isNaN(parseInt(params.count)) ? 0 : params.count,
        lastNumber = count % 10,
        lastNumbers = count % 100;

        return (lastNumber == 1 && lastNumbers != 11)
                ? params.one
                : ( (lastNumber > 1 && lastNumber < 5) && (lastNumbers < 10 || lastNumbers > 20)
                    ? params.some
                    : params.many
                  );
     }).call(this, params) },
    "plural_adv": function(params) { return (function(params) { var count = isNaN(parseInt(params.count)) ? 0 : params.count;

        if (count === 0) { return params.none; }

        return this.keyset("i-tanker__dynamic").key("plural", {"count": params["count"], "one": params["one"], "some": params["some"], "many": params["many"]});
     }).call(this, params) },
    "toggle": function(params) { return (function(params) { return Boolean(params.condition) ? params['true'] : params['false']; }).call(this, params) }
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

BEM.I18N.decl('promo-header', {
    "full-wallet": "Кошелек переполнен",
    "go-to-pay": "Перевести деньги",
    "identification": "Пройти идентификацию",
    "identify-to-increase-limit-ident": "На одном счете можно хранить до 500 000 рублей, а у вас в кошельке уже больше.<br>Можете перевести часть денег на другой кошелек, банковский счет или карту.",
    "identify-to-increase-limit-idlight": "Чтобы хранить на счете до 500 000 рублей, пройдите идентификацию.",
    "identify-to-increase-limit-noident": "Чтобы хранить на счете до 500 000 рублей, пройдите идентификацию.",
    "inactive-title": "Абонентская плата для неактивных пользователей",
    "inactive-text": "Мы списываем абонентскую плату со счетов, которыми не пользовались дольше двух лет.<br/>Размер — 270 рублей в месяц, но не больше остатка на счете.<br/>Чтобы отменить абонентскую плату, достаточно пополнить счет или потратить любую сумму.<br/>Если вы не готовы сделать это сейчас, отложите списание на три месяца.",
    "inactive-stop-charging": "Отложить списания",
    "inactive-more-information": "Подробнее",
    "inactive-success-title": "Вы отложили списание",
    "inactive-success-text": "Деньги останутся на вашем счете. Потратить или перевести их можно в любой момент.<br/>Если в ближайшие три месяца вы не совершите ни одной операции, мы снова напомним про абонентскую плату.",
    "inactive-success-catalog": "Открыть каталог товаров и услуг",
    "inactive-error-title": "Не получилось",
    "inactive-error-text": "Пожалуйста, нажмите на кнопку еще раз. Если снова ничего не получится, напишите нам — мы обязательно разберемся.",
    "inactive-error-feedback": "Сообщить об ошибке"
}, {
"lang": "ru"
});

BEM.I18N.decl('select', {
    "100": "Болгария",
    "104": "Мьянма",
    "108": "Бурунди",
    "112": "Беларусь",
    "116": "Камбоджа",
    "120": "Камерун",
    "124": "Канада",
    "132": "Кабо-Верде",
    "136": "Кайман, Острова",
    "140": "Центральноафриканская Республика",
    "144": "Шри-Ланка",
    "148": "Чад",
    "152": "Чили",
    "156": "Китай",
    "170": "Колумбия",
    "174": "Коморские Острова",
    "175": "Маоре (Майотта)",
    "178": "Конго",
    "180": "Заир",
    "184": "Кука, Острова",
    "188": "Коста-Рика",
    "191": "Хорватия",
    "192": "Куба",
    "196": "Кипр",
    "203": "Чешская Республика",
    "204": "Бенин",
    "208": "Дания",
    "212": "Доминика",
    "214": "Доминиканская Республика",
    "218": "Эквадор",
    "222": "Сальвадор",
    "226": "Экваториальная Гвинея",
    "231": "Эфиопия",
    "232": "Эритрея",
    "233": "Эстония",
    "234": "Фарерские острова",
    "238": "Фолклендские (Мальвинские) Острова",
    "242": "Фиджи",
    "246": "Финляндия",
    "248": "Аландские острова (владение Финляндии)",
    "250": "Франция",
    "254": "Гвиана Французская",
    "258": "Французская Полинезия",
    "262": "Джибути",
    "266": "Габон",
    "268": "Грузия",
    "270": "Гамбия",
    "275": "Палестина",
    "276": "Германия",
    "288": "Гана",
    "292": "Гибралтар",
    "296": "Кирибати",
    "300": "Греция",
    "304": "Гренландия",
    "308": "Гренада",
    "312": "Гваделупа",
    "316": "Гуам",
    "320": "Гватемала",
    "324": "Гвинея",
    "328": "Гайана",
    "332": "Гаити",
    "336": "Ватикан",
    "340": "Гондурас",
    "344": "Гонконг",
    "348": "Венгрия",
    "352": "Исландия",
    "356": "Индия",
    "360": "Индонезия",
    "364": "Иран",
    "368": "Ирак",
    "372": "Ирландия",
    "376": "Израиль",
    "380": "Италия",
    "384": "Кот-д'Ивуар",
    "388": "Ямайка",
    "392": "Япония",
    "398": "Казахстан",
    "400": "Иордания",
    "404": "Кения",
    "408": "Корейская Народно-Демократическая Республика",
    "410": "Корея, Республика",
    "414": "Кувейт",
    "417": "Кыргызстан",
    "418": "Лаос",
    "422": "Ливан",
    "426": "Лесото",
    "428": "Латвия",
    "430": "Либерия",
    "434": "Ливия",
    "438": "Лихтенштейн",
    "440": "Литва",
    "442": "Люксембург",
    "446": "Макао",
    "450": "Мадагаскар",
    "454": "Малави",
    "458": "Малайзия",
    "462": "Мальдивы",
    "466": "Мали",
    "470": "Мальта",
    "474": "Мартиника",
    "478": "Мавритания",
    "480": "Маврикий",
    "484": "Мексика",
    "492": "Монако",
    "496": "Монголия",
    "498": "Молдова",
    "499": "Черногория",
    "500": "Монтсеррат",
    "504": "Марокко",
    "508": "Мозамбик",
    "512": "Оман",
    "516": "Намибия",
    "520": "Науру",
    "524": "Непал",
    "528": "Нидерланды",
    "530": "Нидерландские Антильские острова",
    "531": "Кюрасао",
    "533": "Аруба",
    "540": "Новая Каледония",
    "548": "Вануату",
    "554": "Новая Зеландия",
    "558": "Никарагуа",
    "562": "Нигер",
    "566": "Нигерия",
    "570": "Ниуэ",
    "574": "Норфолк",
    "578": "Норвегия",
    "580": "Северные Марианские Острова",
    "583": "Микронезия (Федеративные Штаты Микронезии)",
    "584": "Маршалловы Острова",
    "585": "Палау",
    "586": "Пакистан",
    "591": "Панама",
    "598": "Папуа — Новая Гвинея",
    "600": "Парагвай",
    "604": "Перу",
    "608": "Филиппины",
    "612": "Питкэрн",
    "616": "Польша",
    "620": "Португалия",
    "624": "Гвинея-Бисау",
    "626": "Восточный Тимор",
    "630": "Пуэрто-Рико",
    "634": "Катар",
    "638": "Реюньон",
    "642": "Румыния",
    "643": "Россия",
    "646": "Руанда",
    "652": "Сент-Бартелеми",
    "654": "Святой Елены, Остров",
    "659": "Сент-Китс и Невис",
    "660": "Ангилья",
    "662": "Сент-Люсия",
    "663": "Сент-Мартин",
    "666": "Сен-Пьер и Микелон",
    "670": "Сент-Винсент и Гренадины",
    "674": "Сан-Марино",
    "678": "Сан-Томе и Принсипи",
    "682": "Саудовская Аравия",
    "686": "Сенегал",
    "688": "Сербия",
    "690": "Сейшельские Острова",
    "694": "Сьерра-Леоне",
    "702": "Сингапур",
    "703": "Словакия",
    "704": "Вьетнам",
    "705": "Словения",
    "706": "Сомали",
    "710": "Южно-Африканская Республика",
    "716": "Зимбабве",
    "724": "Испания",
    "732": "Западная Сахара",
    "736": "Судан",
    "740": "Суринам",
    "744": "Свальбард и Ян-Майен",
    "748": "Свазиленд",
    "752": "Швеция",
    "756": "Швейцария",
    "760": "Сирия",
    "762": "Таджикистан",
    "764": "Таиланд",
    "768": "Того",
    "772": "Токелау",
    "776": "Тонга",
    "780": "Тринидад и Тобаго",
    "784": "Объединенные Арабские Эмираты",
    "788": "Тунис",
    "792": "Турция",
    "795": "Туркменистан",
    "796": "Теркс и Кайкос",
    "798": "Тувалу",
    "800": "Уганда",
    "804": "Украина",
    "807": "Македония",
    "818": "Египет",
    "826": "Великобритания",
    "830": "Нормандские острова (территория Великобритании)",
    "831": "Гернси (территория Великобритании)",
    "832": "Джерси (территория Великобритании)",
    "833": "Остров Мэн (территория Великобритании)",
    "834": "Танзания",
    "840": "Соединенные Штаты Америки (США)",
    "850": "Виргинские Острова (США)",
    "854": "Буркина-Фасо",
    "858": "Уругвай",
    "860": "Узбекистан",
    "862": "Венесуэла",
    "876": "Уоллис и Футуна",
    "882": "Западное Самоа",
    "887": "Йемен",
    "894": "Замбия",
    "895": "Абхазия",
    "896": "Южная Осетия",
    "any-card": "С новой банковской карты",
    "to-any-card": "На новую банковскую карту",
    "empty": "Выберите",
    "000": "Другая страна",
    "004": "Афганистан",
    "008": "Албания",
    "012": "Алжир",
    "016": "Восточное Самоа",
    "020": "Андорра",
    "024": "Ангола",
    "028": "Антигуа и Барбуда",
    "031": "Азербайджан",
    "032": "Аргентина",
    "036": "Австралия",
    "040": "Австрия",
    "044": "Багамские Острова",
    "048": "Бахрейн",
    "050": "Бангладеш",
    "051": "Армения",
    "052": "Барбадос",
    "056": "Бельгия",
    "060": "Бермудские Острова",
    "064": "Бутан",
    "068": "Боливия",
    "070": "Босния и Герцеговина",
    "072": "Ботсвана",
    "076": "Бразилия",
    "084": "Белиз",
    "090": "Соломоновы Острова",
    "092": "Виргинские Острова (Британские)",
    "096": "Бруней",
    "citizenship": "Гражданство",
    "country-select-label": "Страна"
}, {
"lang": "ru"
});

BEM.I18N.decl('server-error', {
    "move-to-index": "Вернуться на главную страницу.",
    "not-found": "Несуществующая страница",
    "not-found-page": "Вы попали в никуда. Такой страницы не существует.<br/>Проверьте написание адреса — может быть, вы просто ошиблись при наборе.<br/>А может, этой страницы уже нет.",
    "refresh-page": "обновить страницу",
    "search": "Найти",
    "service-unavailable": "Сайт ЮMoney временно недоступен",
    "try-later": function(params) { return "Мы делаем все, чтобы это исправить.<br/>Попробуйте " + params["link"] + " чуть позже." }
}, {
"lang": "ru"
});

BEM.I18N.lang('ru');

}

/* end: ./bc-common.lang.ru.js */