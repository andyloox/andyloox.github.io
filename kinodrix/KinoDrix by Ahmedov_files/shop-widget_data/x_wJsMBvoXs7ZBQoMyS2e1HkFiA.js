/**
 * Modules
 *
 * Copyright (c) 2013 Filatov Dmitry (dfilatov@yandex-team.ru)
 * Dual licensed under the MIT and GPL licenses:
 * http://www.opensource.org/licenses/mit-license.php
 * http://www.gnu.org/licenses/gpl.html
 *
 * @version 0.1.2
 */

(function(global) {

var undef,

    DECL_STATES = {
        NOT_RESOLVED : 'NOT_RESOLVED',
        IN_RESOLVING : 'IN_RESOLVING',
        RESOLVED     : 'RESOLVED'
    },

    /**
     * Creates a new instance of modular system
     * @returns {Object}
     */
    create = function() {
        var curOptions = {
                trackCircularDependencies : true,
                allowMultipleDeclarations : true
            },

            modulesStorage = {},
            waitForNextTick = false,
            pendingRequires = [],

            /**
             * Defines module
             * @param {String} name
             * @param {String[]} [deps]
             * @param {Function} declFn
             */
            define = function(name, deps, declFn) {
                if(!declFn) {
                    declFn = deps;
                    deps = [];
                }

                var module = modulesStorage[name];
                if(!module) {
                    module = modulesStorage[name] = {
                        name : name,
                        decl : undef
                    };
                }

                module.decl = {
                    name       : name,
                    prev       : module.decl,
                    fn         : declFn,
                    state      : DECL_STATES.NOT_RESOLVED,
                    deps       : deps,
                    dependents : [],
                    exports    : undef
                };
            },

            /**
             * Requires modules
             * @param {String|String[]} modules
             * @param {Function} cb
             * @param {Function} [errorCb]
             */
            require = function(modules, cb, errorCb) {
                if(typeof modules === 'string') {
                    modules = [modules];
                }

                if(!waitForNextTick) {
                    waitForNextTick = true;
                    nextTick(onNextTick);
                }

                pendingRequires.push({
                    deps : modules,
                    cb   : function(exports, error) {
                        error?
                            (errorCb || onError)(error) :
                            cb.apply(global, exports);
                    }
                });
            },

            /**
             * Returns state of module
             * @param {String} name
             * @returns {String} state, possible values are NOT_DEFINED, NOT_RESOLVED, IN_RESOLVING, RESOLVED
             */
            getState = function(name) {
                var module = modulesStorage[name];
                return module?
                    DECL_STATES[module.decl.state] :
                    'NOT_DEFINED';
            },

            /**
             * Returns whether the module is defined
             * @param {String} name
             * @returns {Boolean}
             */
            isDefined = function(name) {
                return !!modulesStorage[name];
            },

            /**
             * Sets options
             * @param {Object} options
             */
            setOptions = function(options) {
                for(var name in options) {
                    if(options.hasOwnProperty(name)) {
                        curOptions[name] = options[name];
                    }
                }
            },

            getStat = function() {
                var res = {},
                    module;

                for(var name in modulesStorage) {
                    if(modulesStorage.hasOwnProperty(name)) {
                        module = modulesStorage[name];
                        (res[module.decl.state] || (res[module.decl.state] = [])).push(name);
                    }
                }

                return res;
            },

            onNextTick = function() {
                waitForNextTick = false;
                applyRequires();
            },

            applyRequires = function() {
                var requiresToProcess = pendingRequires,
                    i = 0, require;

                pendingRequires = [];

                while(require = requiresToProcess[i++]) {
                    requireDeps(null, require.deps, [], require.cb);
                }
            },

            requireDeps = function(fromDecl, deps, path, cb) {
                var unresolvedDepsCnt = deps.length;
                if(!unresolvedDepsCnt) {
                    cb([]);
                }

                var decls = [],
                    onDeclResolved = function(_, error) {
                        if(error) {
                            cb(null, error);
                            return;
                        }

                        if(!--unresolvedDepsCnt) {
                            var exports = [],
                                i = 0, decl;
                            while(decl = decls[i++]) {
                                exports.push(decl.exports);
                            }
                            cb(exports);
                        }
                    },
                    i = 0, len = unresolvedDepsCnt,
                    dep, decl;

                while(i < len) {
                    dep = deps[i++];
                    if(typeof dep === 'string') {
                        if(!modulesStorage[dep]) {
                            cb(null, buildModuleNotFoundError(dep, fromDecl));
                            return;
                        }

                        decl = modulesStorage[dep].decl;
                    }
                    else {
                        decl = dep;
                    }

                    decls.push(decl);

                    startDeclResolving(decl, path, onDeclResolved);
                }
            },

            startDeclResolving = function(decl, path, cb) {
                if(decl.state === DECL_STATES.RESOLVED) {
                    cb(decl.exports);
                    return;
                }
                else if(decl.state === DECL_STATES.IN_RESOLVING) {
                    curOptions.trackCircularDependencies && isDependenceCircular(decl, path)?
                        cb(null, buildCircularDependenceError(decl, path)) :
                        decl.dependents.push(cb);
                    return;
                }

                decl.dependents.push(cb);

                if(decl.prev && !curOptions.allowMultipleDeclarations) {
                    provideError(decl, buildMultipleDeclarationError(decl));
                    return;
                }

                curOptions.trackCircularDependencies && (path = path.slice()).push(decl);

                var isProvided = false,
                    deps = decl.prev? decl.deps.concat([decl.prev]) : decl.deps;

                decl.state = DECL_STATES.IN_RESOLVING;
                requireDeps(
                    decl,
                    deps,
                    path,
                    function(depDeclsExports, error) {
                        if(error) {
                            provideError(decl, error);
                            return;
                        }

                        depDeclsExports.unshift(function(exports, error) {
                            if(isProvided) {
                                cb(null, buildDeclAreadyProvidedError(decl));
                                return;
                            }

                            isProvided = true;
                            error?
                                provideError(decl, error) :
                                provideDecl(decl, exports);
                        });

                        decl.fn.apply(
                            {
                                name   : decl.name,
                                deps   : decl.deps,
                                global : global
                            },
                            depDeclsExports);
                    });
            },

            provideDecl = function(decl, exports) {
                decl.exports = exports;
                decl.state = DECL_STATES.RESOLVED;

                var i = 0, dependent;
                while(dependent = decl.dependents[i++]) {
                    dependent(exports);
                }

                decl.dependents = undef;
            },

            provideError = function(decl, error) {
                decl.state = DECL_STATES.NOT_RESOLVED;

                var i = 0, dependent;
                while(dependent = decl.dependents[i++]) {
                    dependent(null, error);
                }

                decl.dependents = [];
            };

        return {
            create     : create,
            define     : define,
            require    : require,
            getState   : getState,
            isDefined  : isDefined,
            setOptions : setOptions,
            getStat    : getStat
        };
    },

    onError = function(e) {
        nextTick(function() {
            throw e;
        });
    },

    buildModuleNotFoundError = function(name, decl) {
        return Error(decl?
            'Module "' + decl.name + '": can\'t resolve dependence "' + name + '"' :
            'Required module "' + name + '" can\'t be resolved');
    },

    buildCircularDependenceError = function(decl, path) {
        var strPath = [],
            i = 0, pathDecl;
        while(pathDecl = path[i++]) {
            strPath.push(pathDecl.name);
        }
        strPath.push(decl.name);

        return Error('Circular dependence has been detected: "' + strPath.join(' -> ') + '"');
    },

    buildDeclAreadyProvidedError = function(decl) {
        return Error('Declaration of module "' + decl.name + '" has already been provided');
    },

    buildMultipleDeclarationError = function(decl) {
        return Error('Multiple declarations of module "' + decl.name + '" have been detected');
    },

    isDependenceCircular = function(decl, path) {
        var i = 0, pathDecl;
        while(pathDecl = path[i++]) {
            if(decl === pathDecl) {
                return true;
            }
        }
        return false;
    },

    nextTick = (function() {
        var fns = [],
            enqueueFn = function(fn) {
                return fns.push(fn) === 1;
            },
            callFns = function() {
                var fnsToCall = fns, i = 0, len = fns.length;
                fns = [];
                while(i < len) {
                    fnsToCall[i++]();
                }
            };

        if(typeof process === 'object' && process.nextTick) { // nodejs
            return function(fn) {
                enqueueFn(fn) && process.nextTick(callFns);
            };
        }

        if(global.setImmediate) { // ie10
            return function(fn) {
                enqueueFn(fn) && global.setImmediate(callFns);
            };
        }

        if(global.postMessage && !global.opera) { // modern browsers
            var isPostMessageAsync = true;
            if(global.attachEvent) {
                var checkAsync = function() {
                        isPostMessageAsync = false;
                    };
                global.attachEvent('onmessage', checkAsync);
                global.postMessage('__checkAsync', '*');
                global.detachEvent('onmessage', checkAsync);
            }

            if(isPostMessageAsync) {
                var msg = '__modules' + (+new Date()),
                    onMessage = function(e) {
                        if(e.data === msg) {
                            e.stopPropagation && e.stopPropagation();
                            callFns();
                        }
                    };

                global.addEventListener?
                    global.addEventListener('message', onMessage, true) :
                    global.attachEvent('onmessage', onMessage);

                return function(fn) {
                    enqueueFn(fn) && global.postMessage(msg, '*');
                };
            }
        }

        var doc = global.document;
        if('onreadystatechange' in doc.createElement('script')) { // ie6-ie8
            var head = doc.getElementsByTagName('head')[0],
                createScript = function() {
                    var script = doc.createElement('script');
                    script.onreadystatechange = function() {
                        script.parentNode.removeChild(script);
                        script = script.onreadystatechange = null;
                        callFns();
                    };
                    head.appendChild(script);
                };

            return function(fn) {
                enqueueFn(fn) && createScript();
            };
        }

        return function(fn) { // old browsers
            enqueueFn(fn) && setTimeout(callFns, 0);
        };
    })();

if(typeof exports === 'object') {
    module.exports = create();
}
else {
    global.modules = create();
}

})(typeof window !== 'undefined' ? window : global);
if(typeof module !== 'undefined') {modules = module.exports;}
var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var BEMHTML;

(function (global) {
  function buildBemXjst(__bem_xjst_libs__) {
    var exports = {};

    /// -------------------------------------
    /// --------- BEM-XJST Runtime Start ----
    /// -------------------------------------
    var BEMHTML = function (module, exports) {
      var inherits;

      if (typeof Object.create === 'function') {
        // implementation from standard node.js 'util' module
        inherits = function inherits(ctor, superCtor) {
          ctor.super_ = superCtor;
          ctor.prototype = Object.create(superCtor.prototype, {
            constructor: {
              value: ctor,
              enumerable: false,
              writable: true,
              configurable: true
            }
          });
        };
      } else {
        // old school shim for old browsers
        inherits = function inherits(ctor, superCtor) {
          ctor.super_ = superCtor;
          var TempCtor = function TempCtor() {};
          TempCtor.prototype = superCtor.prototype;
          ctor.prototype = new TempCtor();
          ctor.prototype.constructor = ctor;
        };
      }

      var utils = {};

      var amp = '&amp;';
      var lt = '&lt;';
      var gt = '&gt;';
      var quot = '&quot;';
      var singleQuot = '&#39;';

      var matchXmlRegExp = /[&<>]/;

      utils.xmlEscape = function (string) {
        var str = '' + string;
        var match = matchXmlRegExp.exec(str);

        if (!match) return str;

        var escape;
        var html = '';
        var index = 0;
        var lastIndex = 0;

        for (index = match.index; index < str.length; index++) {
          switch (str.charCodeAt(index)) {
            case 38:
              // &
              escape = amp;
              break;
            case 60:
              // <
              escape = lt;
              break;
            case 62:
              // >
              escape = gt;
              break;
            default:
              continue;
          }

          if (lastIndex !== index) html += str.substring(lastIndex, index);

          lastIndex = index + 1;
          html += escape;
        }

        return lastIndex !== index ? html + str.substring(lastIndex, index) : html;
      };

      var matchAttrRegExp = /["&]/;

      utils.attrEscape = function (string) {
        var str = '' + string;
        var match = matchAttrRegExp.exec(str);

        if (!match) return str;

        var escape;
        var html = '';
        var index = 0;
        var lastIndex = 0;

        for (index = match.index; index < str.length; index++) {
          switch (str.charCodeAt(index)) {
            case 34:
              // "
              escape = quot;
              break;
            case 38:
              // &
              escape = amp;
              break;
            default:
              continue;
          }

          if (lastIndex !== index) html += str.substring(lastIndex, index);

          lastIndex = index + 1;
          html += escape;
        }

        return lastIndex !== index ? html + str.substring(lastIndex, index) : html;
      };

      var matchJsAttrRegExp = /['&]/;

      utils.jsAttrEscape = function (string) {
        var str = '' + string;
        var match = matchJsAttrRegExp.exec(str);

        if (!match) return str;

        var escape;
        var html = '';
        var index = 0;
        var lastIndex = 0;

        for (index = match.index; index < str.length; index++) {
          switch (str.charCodeAt(index)) {
            case 38:
              // &
              escape = amp;
              break;
            case 39:
              // '
              escape = singleQuot;
              break;
            default:
              continue;
          }

          if (lastIndex !== index) html += str.substring(lastIndex, index);

          lastIndex = index + 1;
          html += escape;
        }

        return lastIndex !== index ? html + str.substring(lastIndex, index) : html;
      };

      utils.extend = function (o1, o2) {
        if (!o1 || !o2) return o1 || o2;

        var res = {};
        var n;

        for (n in o1) {
          if (o1.hasOwnProperty(n)) res[n] = o1[n];
        }for (n in o2) {
          if (o2.hasOwnProperty(n)) res[n] = o2[n];
        }return res;
      };

      var SHORT_TAGS = { // hash for quick check if tag short
        area: 1, base: 1, br: 1, col: 1, command: 1, embed: 1, hr: 1, img: 1,
        input: 1, keygen: 1, link: 1, meta: 1, param: 1, source: 1, wbr: 1
      };

      utils.isShortTag = function (t) {
        return SHORT_TAGS.hasOwnProperty(t);
      };

      utils.isSimple = function isSimple(obj) {
        if (!obj || obj === true) return true;
        if (!obj.block && !obj.elem && !obj.tag && !obj.cls && !obj.attrs && obj.hasOwnProperty('html') && isSimple(obj.html)) return true;
        return typeof obj === 'string' || typeof obj === 'number';
      };

      var uniqCount = 0;
      var uniqId = +new Date();
      var uniqExpando = '__' + uniqId;
      var uniqPrefix = 'uniq' + uniqId;

      function getUniq() {
        return uniqPrefix + ++uniqCount;
      }
      utils.getUniq = getUniq;

      utils.identify = function (obj, onlyGet) {
        if (!obj) return getUniq();
        if (onlyGet || obj[uniqExpando]) return obj[uniqExpando];

        var u = getUniq();
        obj[uniqExpando] = u;
        return u;
      };

      /**
       * regexp for check may attribute be unquoted
       *
       * https://www.w3.org/TR/html4/intro/sgmltut.html#h-3.2.2
       * https://www.w3.org/TR/html5/syntax.html#attributes
       */
      var UNQUOTED_ATTR_REGEXP = /^[:\w.-]+$/;

      utils.isUnquotedAttr = function (str) {
        return str && UNQUOTED_ATTR_REGEXP.exec(str);
      };

      function ClassBuilder(options) {
        this.modDelim = options.mod || '_';
        this.elemDelim = options.elem || '__';
      }

      ClassBuilder.prototype.build = function (block, elem) {
        return elem ? block + this.elemDelim + elem : block;
      };

      ClassBuilder.prototype.buildModPostfix = function (modName, modVal) {
        var res = this.modDelim + modName;
        if (modVal !== true) res += this.modDelim + modVal;
        return res;
      };

      ClassBuilder.prototype.buildBlockClass = function (name, modName, modVal) {
        var res = name;
        if (modVal) res += this.buildModPostfix(modName, modVal);
        return res;
      };

      ClassBuilder.prototype.buildElemClass = function (block, name, modName, modVal) {
        return this.buildBlockClass(block) + this.elemDelim + name + this.buildModPostfix(modName, modVal);
      };

      ClassBuilder.prototype.split = function (key) {
        return key.split(this.elemDelim, 2);
      };

      function Context(bemxjst) {
        this._bemxjst = bemxjst;

        this.ctx = null;
        this.block = '';

        // Save current block until the next BEM entity
        this._currBlock = '';

        this.elem = null;
        this.mods = {};
        this.elemMods = {};

        this.position = 0;
        this._listLength = 0;
        this._notNewList = false;

        this.escapeContent = bemxjst.options.escapeContent === true;
      }

      Context.prototype._flush = null;

      Context.prototype.isSimple = utils.isSimple;

      Context.prototype.isShortTag = utils.isShortTag;
      Context.prototype.extend = utils.extend;
      Context.prototype.identify = utils.identify;

      Context.prototype.xmlEscape = utils.xmlEscape;
      Context.prototype.attrEscape = utils.attrEscape;
      Context.prototype.jsAttrEscape = utils.jsAttrEscape;

      Context.prototype.isFirst = function () {
        return this.position === 1;
      };

      Context.prototype.isLast = function () {
        return this.position === this._listLength;
      };

      Context.prototype.generateId = function () {
        return utils.identify(this.ctx);
      };

      Context.prototype.reapply = function (ctx) {
        return this._bemxjst.run(ctx);
      };

      function MatchNested(template, pred) {
        this.template = template;
        this.keys = pred.key;
        this.value = pred.value;
      }

      MatchNested.prototype.exec = function (context) {
        var val = context;

        for (var i = 0; i < this.keys.length - 1; i++) {
          val = val[this.keys[i]];
          if (!val) return false;
        }

        val = val[this.keys[i]];

        if (this.value === true) return val !== undefined && val !== '' && val !== false && val !== null;

        return String(val) === this.value;
      };

      function MatchCustom(template, pred) {
        this.template = template;
        this.body = pred.body;
      }

      MatchCustom.prototype.exec = function (context) {
        return this.body.call(context, context, context.ctx);
      };

      function MatchWrap(template) {
        this.template = template;
        this.wrap = null;
      }

      MatchWrap.prototype.exec = function (context) {
        var res = this.wrap !== context.ctx;
        this.wrap = context.ctx;
        return res;
      };

      function MatchExtend(template) {
        this.template = template;
        this.wrap = null;
      }

      MatchExtend.prototype.exec = function (context) {
        var res = this.ext !== context.ctx;
        this.ext = context.ctx;
        return res;
      };

      function AddWrap(template, pred) {
        this.template = template;
        this.key = pred.key;
        this.value = pred.value;
      }

      AddWrap.prototype.exec = function (context) {
        return context[this.key] === this.value;
      };

      function Template(predicates, body) {
        this.predicates = predicates;

        this.body = body;
      }

      Template.prototype.wrap = function () {
        var body = this.body;
        for (var i = 0; i < this.predicates.length; i++) {
          var pred = this.predicates[i];
          body = pred.wrapBody(body);
        }
        this.body = body;
      };

      Template.prototype.clone = function () {
        return new Template(this.predicates.slice(), this.body);
      };

      function MatchBase() {}

      MatchBase.prototype.wrapBody = function (body) {
        return body;
      };

      function Item(tree, children) {
        this.conditions = [];
        this.children = [];

        for (var i = children.length - 1; i >= 0; i--) {
          var arg = children[i];
          if (arg instanceof MatchBase) this.conditions.push(arg);else if (arg === tree.boundBody) this.children[i] = tree.queue.pop();else this.children[i] = arg;
        }
      }

      function WrapMatch(refs) {
        MatchBase.call(this);

        this.refs = refs;
      }
      inherits(WrapMatch, MatchBase);

      WrapMatch.prototype.wrapBody = function (body) {
        var applyCtx = this.refs.applyCtx;

        if (typeof body !== 'function') return function () {
          return applyCtx(body);
        };

        return function () {
          return applyCtx(body.call(this, this, this.ctx));
        };
      };

      function ReplaceMatch(refs) {
        MatchBase.call(this);

        this.refs = refs;
      }
      inherits(ReplaceMatch, MatchBase);

      ReplaceMatch.prototype.wrapBody = function (body) {
        var applyCtx = this.refs.applyCtx;

        if (typeof body !== 'function') return function () {
          return applyCtx(body);
        };

        return function () {
          return applyCtx(body.call(this, this, this.ctx));
        };
      };

      function ExtendMatch(refs) {
        MatchBase.call(this);

        this.refs = refs;
      }
      inherits(ExtendMatch, MatchBase);

      ExtendMatch.prototype.wrapBody = function (body) {
        var applyCtx = this.refs.applyCtx;
        var local = this.refs.local;

        if (typeof body !== 'function') {
          return function () {
            var changes = {};

            var keys = Object.keys(body);
            for (var i = 0; i < keys.length; i++) {
              changes[keys[i]] = body[keys[i]];
            }return local(changes)(function () {
              return applyCtx(this.ctx);
            });
          };
        }

        return function () {
          var changes = {};

          var obj = body.call(this, this, this.ctx);
          var keys = Object.keys(obj);
          for (var i = 0; i < keys.length; i++) {
            changes[keys[i]] = obj[keys[i]];
          }return local(changes)(function () {
            return applyCtx(this.ctx);
          });
        };
      };

      function AddMatch(mode, refs) {
        MatchBase.call(this);

        this.mode = mode;
        this.refs = refs;
      }
      inherits(AddMatch, MatchBase);

      AddMatch.prototype.wrapBody = function (body) {
        return this[this.mode + 'WrapBody'](body);
      };

      AddMatch.prototype.appendContentWrapBody = function (body) {
        var refs = this.refs;
        var applyCtx = refs.applyCtx;
        var apply = refs.apply;

        if (typeof body !== 'function') return function () {
          return [apply('content'), body];
        };

        return function () {
          return [apply('content'), applyCtx(body.call(this, this, this.ctx))];
        };
      };

      AddMatch.prototype.prependContentWrapBody = function (body) {
        var refs = this.refs;
        var applyCtx = refs.applyCtx;
        var apply = refs.apply;

        if (typeof body !== 'function') return function () {
          return [body, apply('content')];
        };

        return function () {
          return [applyCtx(body.call(this, this, this.ctx)), apply('content')];
        };
      };

      function CompilerOptions(options) {
        MatchBase.call(this);
        this.options = options;
      }
      inherits(CompilerOptions, MatchBase);

      function PropertyMatch(key, value) {
        MatchBase.call(this);

        this.key = key;
        this.value = value;
      }
      inherits(PropertyMatch, MatchBase);

      function CustomMatch(body) {
        MatchBase.call(this);

        this.body = body;
      }
      inherits(CustomMatch, MatchBase);

      function MatchTemplate(mode, template) {
        this.mode = mode;
        this.predicates = new Array(template.predicates.length);
        this.body = template.body;

        var postpone = [];

        for (var i = 0, j = 0; i < this.predicates.length; i++, j++) {
          var pred = template.predicates[i];
          if (pred instanceof PropertyMatch) {
            this.predicates[j] = new MatchNested(this, pred);
          } else if (pred instanceof ExtendMatch) {
            j--;
            postpone.push(new MatchExtend(this));
          } else if (pred instanceof AddMatch) {
            this.predicates[i] = new AddWrap(this, pred);
          } else if (pred instanceof CustomMatch) {
            this.predicates[j] = new MatchCustom(this, pred);

            // Push MatchWrap later, they should not be executed first.
            // Otherwise they will set flag too early, and body might not be executed
          } else if (pred instanceof WrapMatch) {
            j--;
            postpone.push(new MatchWrap(this));
          } else {
            // Skip
            j--;
          }
        }

        // Insert late predicates
        for (var i = 0; i < postpone.length; i++, j++) {
          this.predicates[j] = postpone[i];
        }if (this.predicates.length !== j) this.predicates.length = j;
      }

      function Match(entity, modeName) {
        this.entity = entity;
        this.modeName = modeName;
        this.bemxjst = this.entity.bemxjst;
        this.templates = [];

        // applyNext mask
        this.mask = [0];

        // We are going to create copies of mask for nested `applyNext()`
        this.maskSize = 0;
        this.maskOffset = 0;

        this.count = 0;
        this.depth = -1;

        this.thrownError = null;
      }

      Match.prototype.prepend = function (other) {
        this.templates = other.templates.concat(this.templates);
        this.count += other.count;

        while (Math.ceil(this.count / 31) > this.mask.length) {
          this.mask.push(0);
        }this.maskSize = this.mask.length;
      };

      Match.prototype.push = function (template) {
        this.templates.push(new MatchTemplate(this, template));
        this.count++;

        if (Math.ceil(this.count / 31) > this.mask.length) this.mask.push(0);

        this.maskSize = this.mask.length;
      };

      Match.prototype.tryCatch = function (fn, ctx) {
        try {
          return fn.call(ctx, ctx, ctx.ctx);
        } catch (e) {
          this.thrownError = e;
        }
      };

      Match.prototype.exec = function (context) {
        var save = this.checkDepth();

        var template;
        var bitIndex = this.maskOffset;
        var mask = this.mask[bitIndex];
        var bit = 1;
        for (var i = 0; i < this.count; i++) {
          if ((mask & bit) === 0) {
            template = this.templates[i];
            for (var j = 0; j < template.predicates.length; j++) {
              var pred = template.predicates[j];

              /* jshint maxdepth : false */
              if (!pred.exec(context)) break;
            }

            // All predicates matched!
            if (j === template.predicates.length) break;
          }

          if (bit === 0x40000000) {
            bitIndex++;
            mask = this.mask[bitIndex];
            bit = 1;
          } else {
            bit <<= 1;
          }
        }

        if (i === this.count) {
          this.restoreDepth(save);
          return context.ctx[this.modeName];
        }

        var oldMask = mask;
        var oldMatch = this.bemxjst.match;
        this.mask[bitIndex] |= bit;
        this.bemxjst.match = this;

        this.thrownError = null;

        var out = typeof template.body === 'function' ? this.tryCatch(template.body, context) : template.body;

        this.mask[bitIndex] = oldMask;
        this.bemxjst.match = oldMatch;
        this.restoreDepth(save);

        var e = this.thrownError;
        if (e !== null) {
          this.thrownError = null;
          throw e;
        }

        return out;
      };

      Match.prototype.checkDepth = function () {
        if (this.depth === -1) {
          this.depth = this.bemxjst.depth;
          return -1;
        }

        if (this.bemxjst.depth === this.depth) return this.depth;

        var depth = this.depth;
        this.depth = this.bemxjst.depth;

        this.maskOffset += this.maskSize;

        while (this.mask.length < this.maskOffset + this.maskSize) {
          this.mask.push(0);
        }return depth;
      };

      Match.prototype.restoreDepth = function (depth) {
        if (depth !== -1 && depth !== this.depth) this.maskOffset -= this.maskSize;
        this.depth = depth;
      };

      function Tree(options) {
        this.options = options;
        this.refs = this.options.refs;

        this.boundBody = this.body.bind(this);

        var methods = this.methods('body');
        for (var i = 0; i < methods.length; i++) {
          var method = methods[i];
          // NOTE: method.name is empty because of .bind()
          this.boundBody[Tree.methods[i]] = method;
        }

        this.queue = [];
        this.templates = [];
        this.initializers = [];
      }

      Tree.methods = ['match', 'wrap', 'block', 'elem', 'mode', 'mod', 'elemMod', 'def', 'tag', 'attrs', 'cls', 'js', 'bem', 'mix', 'content', 'replace', 'extend', 'oninit', 'xjstOptions', 'appendContent', 'prependContent'];

      Tree.prototype.build = function (templates, apply) {
        var methods = this.methods('global').concat(apply);
        methods[0] = this.match.bind(this);

        templates.apply({}, methods);

        return {
          templates: this.templates.slice().reverse(),
          oninit: this.initializers
        };
      };

      function methodFactory(self, kind, name) {
        var method = self[name];
        var boundBody = self.boundBody;

        if (kind !== 'body') {
          if (name === 'replace' || name === 'extend' || name === 'wrap') return function () {
            return method.apply(self, arguments);
          };

          return function () {
            method.apply(self, arguments);
            return boundBody;
          };
        }

        return function () {
          var res = method.apply(self, arguments);

          // Insert body into last item
          var child = self.queue.pop();
          var last = self.queue[self.queue.length - 1];
          last.conditions = last.conditions.concat(child.conditions);
          last.children = last.children.concat(child.children);

          if (name === 'replace' || name === 'extend' || name === 'wrap') return res;
          return boundBody;
        };
      }

      Tree.prototype.methods = function (kind) {
        var out = new Array(Tree.methods.length);

        for (var i = 0; i < out.length; i++) {
          var name = Tree.methods[i];
          out[i] = methodFactory(this, kind, name);
        }

        return out;
      };

      // Called after all matches
      Tree.prototype.flush = function (conditions, item) {
        var subcond = item.conditions ? conditions.concat(item.conditions) : item.conditions;

        for (var i = 0; i < item.children.length; i++) {
          var arg = item.children[i];

          // Go deeper
          if (arg instanceof Item) {
            this.flush(subcond, item.children[i]);

            // Body
          } else {
            var template = new Template(conditions, arg);
            template.wrap();
            this.templates.push(template);
          }
        }
      };

      Tree.prototype.body = function () {
        var children = new Array(arguments.length);
        for (var i = 0; i < arguments.length; i++) {
          children[i] = arguments[i];
        }var child = new Item(this, children);
        this.queue[this.queue.length - 1].children.push(child);

        if (this.queue.length === 1) this.flush([], this.queue.shift());

        return this.boundBody;
      };

      Tree.prototype.match = function () {
        var children = new Array(arguments.length);
        for (var i = 0; i < arguments.length; i++) {
          var arg = arguments[i];
          if (typeof arg === 'function') arg = new CustomMatch(arg);
          if (!(arg instanceof MatchBase)) throw new Error('Wrong .match() argument');
          children[i] = arg;
        }

        this.queue.push(new Item(this, children));

        return this.boundBody;
      };

      Tree.prototype.applyMode = function (args, mode) {
        if (args.length) throw new Error('Predicate should not have arguments but ' + JSON.stringify(args) + ' passed');

        return this.mode(mode);
      };

      Tree.prototype.xjstOptions = function (options) {
        this.queue.push(new Item(this, [new CompilerOptions(options)]));
        return this.boundBody;
      };

      Tree.prototype.block = function (name) {
        return this.match(new PropertyMatch('block', name));
      };

      Tree.prototype.elem = function (name) {
        return this.match(new PropertyMatch('elem', name));
      };

      Tree.prototype.mode = function (name) {
        return this.match(new PropertyMatch('_mode', name));
      };

      Tree.prototype.mod = function (name, value) {
        return this.match(new PropertyMatch(['mods', name], value === undefined ? true : String(value)));
      };

      Tree.prototype.elemMod = function (name, value) {
        return this.match(new PropertyMatch(['elemMods', name], value === undefined ? true : String(value)));
      };

      Tree.prototype.def = function () {
        return this.applyMode(arguments, 'default');
      };

      ['tag', 'attrs', 'cls', 'js', 'bem', 'mix', 'content'].forEach(function (method) {
        Tree.prototype[method] = function () {
          return this.applyMode(arguments, method);
        };
      });

      ['appendContent', 'prependContent'].forEach(function (method) {
        Tree.prototype[method] = function () {
          return this.content.apply(this, arguments).match(new AddMatch(method, this.refs));
        };
      });

      Tree.prototype.wrap = function () {
        return this.def.apply(this, arguments).match(new WrapMatch(this.refs));
      };

      Tree.prototype.replace = function () {
        return this.def.apply(this, arguments).match(new ReplaceMatch(this.refs));
      };

      Tree.prototype.extend = function () {
        return this.def.apply(this, arguments).match(new ExtendMatch(this.refs));
      };

      Tree.prototype.oninit = function (fn) {
        this.initializers.push(fn);
      };

      function BemxjstEntity(bemxjst, block, elem, templates) {
        this.bemxjst = bemxjst;

        this.block = null;
        this.elem = null;

        // Compiler options via `xjstOptions()`
        this.options = {};

        // `true` if entity has just a default renderer for `def()` mode
        this.canFlush = true;

        // "Fast modes"
        this.def = new Match(this);
        this.content = new Match(this, 'content');

        // "Slow modes"
        this.rest = {};

        // Initialize
        this.init(block, elem);
        this.initModes(templates);
      }

      BemxjstEntity.prototype.init = function (block, elem) {
        this.block = block;
        this.elem = elem;
      };

      function contentMode() {
        return this.ctx.content;
      }

      BemxjstEntity.prototype.initModes = function (templates) {
        /* jshint maxdepth : false */
        for (var i = 0; i < templates.length; i++) {
          var template = templates[i];

          for (var j = template.predicates.length - 1; j >= 0; j--) {
            var pred = template.predicates[j];
            if (!(pred instanceof PropertyMatch)) continue;

            if (pred.key !== '_mode') continue;

            template.predicates.splice(j, 1);
            this._initRest(pred.value);

            // All templates should go there anyway
            this.rest[pred.value].push(template);
            break;
          }

          if (j === -1) this.def.push(template);

          // Merge compiler options
          for (var j = template.predicates.length - 1; j >= 0; j--) {
            var pred = template.predicates[j];
            if (!(pred instanceof CompilerOptions)) continue;

            this.options = utils.extend(this.options, pred.options);
          }
        }
      };

      BemxjstEntity.prototype.prepend = function (other) {
        // Prepend to the slow modes, fast modes are in this hashmap too anyway
        var keys = Object.keys(this.rest);
        for (var i = 0; i < keys.length; i++) {
          var key = keys[i];
          if (!other.rest[key]) continue;

          this.rest[key].prepend(other.rest[key]);
        }

        // Add new slow modes
        keys = Object.keys(other.rest);
        for (var i = 0; i < keys.length; i++) {
          var key = keys[i];
          if (this.rest[key]) continue;

          this._initRest(key);
          this.rest[key].prepend(other.rest[key]);
        }
      };

      // NOTE: This could be potentially compiled into inlined invokations
      BemxjstEntity.prototype.run = function (context) {
        if (this.def.count !== 0) return this.def.exec(context);

        return this.defaultBody(context);
      };

      BemxjstEntity.prototype.setDefaults = function () {
        // Default .content() template for applyNext()
        if (this.content.count !== 0) this.content.push(new Template([], contentMode));

        // .def() default
        if (this.def.count !== 0) {
          this.canFlush = this.options.flush || false;
          var self = this;
          this.def.push(new Template([], function defaultBodyProxy() {
            return self.defaultBody(this);
          }));
        }
      };
      function BEMXJSTError(msg, func) {
        this.name = 'BEMXJSTError';
        this.message = msg;

        if (Error.captureStackTrace) Error.captureStackTrace(this, func || this.constructor);else this.stack = new Error().stack;
      }

      BEMXJSTError.prototype = Object.create(Error.prototype);
      BEMXJSTError.prototype.constructor = BEMXJSTError;

      function BEMXJST(options) {
        this.options = options || {};

        this.entities = null;
        this.defaultEnt = null;

        // Current tree
        this.tree = null;

        // Current match
        this.match = null;

        // Create new Context constructor for overriding prototype
        this.contextConstructor = function ContextChild(bemxjst) {
          Context.call(this, bemxjst);
        };
        inherits(this.contextConstructor, Context);
        this.context = null;

        this.classBuilder = new ClassBuilder(this.options.naming || {});

        // Execution depth, used to invalidate `applyNext` bitfields
        this.depth = 0;

        // Do not call `_flush` on overridden `def()` mode
        this.canFlush = false;

        // oninit templates
        this.oninit = null;

        // Initialize default entity (no block/elem match)
        this.defaultEnt = new this.Entity(this, '', '', []);
        this.defaultElemEnt = new this.Entity(this, '', '', []);
      }

      BEMXJST.prototype.locals = Tree.methods.concat('local', 'applyCtx', 'applyNext', 'apply');

      BEMXJST.prototype.compile = function (code) {
        var self = this;

        function applyCtx() {
          return self._run(self.context.ctx);
        }

        function applyCtxWrap(ctx, changes) {
          // Fast case
          if (!changes) return self.local({ ctx: ctx }, applyCtx);

          return self.local(changes, function () {
            return self.local({ ctx: ctx }, applyCtx);
          });
        }

        function apply(mode, changes) {
          return self.applyMode(mode, changes);
        }

        function localWrap(changes) {
          return function localBody(body) {
            return self.local(changes, body);
          };
        }

        var tree = new Tree({
          refs: {
            applyCtx: applyCtxWrap,
            local: localWrap,
            apply: apply
          }
        });

        // Yeah, let people pass functions to us!
        var templates = this.recompileInput(code);

        var out = tree.build(templates, [localWrap, applyCtxWrap, function applyNextWrap(changes) {
          if (changes) return self.local(changes, applyNextWrap);
          return self.applyNext();
        }, apply]);

        // Concatenate templates with existing ones
        // TODO(indutny): it should be possible to incrementally add templates
        if (this.tree) out = {
          templates: out.templates.concat(this.tree.templates),
          oninit: this.tree.oninit.concat(out.oninit)
        };
        this.tree = out;

        // Group block+elem entities into a hashmap
        var ent = this.groupEntities(out.templates);

        // Transform entities from arrays to Entity instances
        ent = this.transformEntities(ent);

        this.entities = ent;
        this.oninit = out.oninit;
      };

      BEMXJST.prototype.recompileInput = function (code) {
        var args = BEMXJST.prototype.locals;
        // Reuse function if it already has right arguments
        if (typeof code === 'function' && code.length === args.length) return code;

        var out = code.toString();

        // Strip the function
        out = out.replace(/^function[^{]+{|}$/g, '');

        // And recompile it with right arguments
        out = new Function(args.join(', '), out);

        return out;
      };

      BEMXJST.prototype.groupEntities = function (tree) {
        var res = {};
        for (var i = 0; i < tree.length; i++) {
          // Make sure to change only the copy, the original is cached in `this.tree`
          var template = tree[i].clone();
          var block = null;
          var elem;

          elem = undefined;
          for (var j = 0; j < template.predicates.length; j++) {
            var pred = template.predicates[j];
            if (!(pred instanceof PropertyMatch) && !(pred instanceof AddMatch)) continue;

            if (pred.key === 'block') block = pred.value;else if (pred.key === 'elem') elem = pred.value;else continue;

            // Remove predicate, we won't much against it
            template.predicates.splice(j, 1);
            j--;
          }

          if (block === null) {
            var msg = 'block(…) subpredicate is not found.\n' + '    See template with subpredicates:\n     * ';

            for (var j = 0; j < template.predicates.length; j++) {
              var pred = template.predicates[j];

              if (j !== 0) msg += '\n     * ';

              if (pred.key === '_mode') {
                msg += pred.value + '()';
              } else {
                if (Array.isArray(pred.key)) {
                  msg += pred.key[0].replace('mods', 'mod').replace('elemMods', 'elemMod') + '(\'' + pred.key[1] + '\', \'' + pred.value + '\')';
                } else if (!pred.value || !pred.key) {
                  msg += 'match(…)';
                } else {
                  msg += pred.key + '(\'' + pred.value + '\')';
                }
              }
            }

            msg += '\n    And template body: \n    (' + (typeof template.body === 'function' ? template.body : JSON.stringify(template.body)) + ')';

            throw new BEMXJSTError(msg);
          }

          var key = this.classBuilder.build(block, elem);

          if (!res[key]) res[key] = [];
          res[key].push(template);
        }
        return res;
      };

      BEMXJST.prototype.transformEntities = function (entities) {
        var wildcardElems = [];

        var keys = Object.keys(entities);
        for (var i = 0; i < keys.length; i++) {
          var key = keys[i];

          // TODO(indutny): pass this values over
          var parts = this.classBuilder.split(key);
          var block = parts[0];
          var elem = parts[1];

          if (elem === '*') wildcardElems.push(block);

          entities[key] = new this.Entity(this, block, elem, entities[key]);
        }

        // Merge wildcard block templates
        if (entities.hasOwnProperty('*')) {
          var wildcard = entities['*'];
          for (var i = 0; i < keys.length; i++) {
            var key = keys[i];
            if (key === '*') continue;

            entities[key].prepend(wildcard);
          }
          this.defaultEnt.prepend(wildcard);
          this.defaultElemEnt.prepend(wildcard);
        }

        // Merge wildcard elem templates
        for (var i = 0; i < wildcardElems.length; i++) {
          var block = wildcardElems[i];
          var wildcardKey = this.classBuilder.build(block, '*');
          var wildcard = entities[wildcardKey];
          for (var i = 0; i < keys.length; i++) {
            var key = keys[i];
            if (key === wildcardKey) continue;

            var entity = entities[key];
            if (entity.block !== block) continue;

            if (entity.elem === undefined) continue;

            entities[key].prepend(wildcard);
          }
          this.defaultElemEnt.prepend(wildcard);
        }

        // Set default templates after merging with wildcard
        for (var i = 0; i < keys.length; i++) {
          var key = keys[i];
          entities[key].setDefaults();
          this.defaultEnt.setDefaults();
          this.defaultElemEnt.setDefaults();
        }

        return entities;
      };

      BEMXJST.prototype._run = function (context) {
        if (context === undefined || context === '' || context === null) return this.runEmpty();else if (Array.isArray(context)) return this.runMany(context);else if (typeof context.html === 'string' && !context.tag && typeof context.block === 'undefined' && typeof context.elem === 'undefined' && typeof context.cls === 'undefined' && typeof context.attrs === 'undefined') return this.runUnescaped(context);else if (utils.isSimple(context)) return this.runSimple(context);

        return this.runOne(context);
      };

      BEMXJST.prototype.run = function (json) {
        var match = this.match;
        var context = this.context;

        this.match = null;
        this.context = new this.contextConstructor(this);
        this.canFlush = this.context._flush !== null;
        this.depth = 0;
        var res = this._run(json);

        if (this.canFlush) res = this.context._flush(res);

        this.match = match;
        this.context = context;

        return res;
      };

      BEMXJST.prototype.runEmpty = function () {
        this.context._listLength--;
        return '';
      };

      BEMXJST.prototype.runUnescaped = function (context) {
        this.context._listLength--;
        return '' + context.html;
      };

      BEMXJST.prototype.runSimple = function (simple) {
        this.context._listLength--;

        if (!simple && simple !== 0 || simple === true) return '';

        return typeof simple === 'string' && this.context.escapeContent ? utils.xmlEscape(simple) : simple;
      };

      BEMXJST.prototype.runOne = function (json) {
        var context = this.context;

        var oldCtx = context.ctx;
        var oldBlock = context.block;
        var oldCurrBlock = context._currBlock;
        var oldElem = context.elem;
        var oldMods = context.mods;
        var oldElemMods = context.elemMods;

        if (json.block || json.elem) context._currBlock = '';else context._currBlock = context.block;

        context.ctx = json;
        if (json.block) {
          context.block = json.block;

          if (json.mods) context.mods = json.mods;else if (json.block !== oldBlock || !json.elem) context.mods = {};
        } else {
          if (!json.elem) context.block = '';else if (oldCurrBlock) context.block = oldCurrBlock;
        }

        context.elem = json.elem;
        if (json.elemMods) context.elemMods = json.elemMods;else context.elemMods = {};

        var block = context.block || '';
        var elem = context.elem;

        // Control list position
        if (block || elem) context.position++;else context._listLength--;

        // To invalidate `applyNext` flags
        this.depth++;

        var restoreFlush = false;
        var ent = this.entities[this.classBuilder.build(block, elem)];
        if (ent) {
          if (this.canFlush && !ent.canFlush) {
            // Entity does not support flushing, do not flush anything nested
            restoreFlush = true;
            this.canFlush = false;
          }
        } else {
          // No entity - use default one
          ent = this.defaultEnt;
          if (elem !== undefined) ent = this.defaultElemEnt;
          ent.init(block, elem);
        }

        var res = this.options.production === true ? this.tryRun(context, ent) : ent.run(context);

        context.ctx = oldCtx;
        context.block = oldBlock;
        context.elem = oldElem;
        context.mods = oldMods;
        context.elemMods = oldElemMods;
        context._currBlock = oldCurrBlock;
        this.depth--;
        if (restoreFlush) this.canFlush = true;

        return res;
      };

      BEMXJST.prototype.tryRun = function (context, ent) {
        try {
          return ent.run(context);
        } catch (e) {
          console.error('BEMXJST ERROR: cannot render ' + ['block ' + context.block, 'elem ' + context.elem, 'mods ' + JSON.stringify(context.mods), 'elemMods ' + JSON.stringify(context.elemMods)].join(', '), e);
          return '';
        }
      };

      BEMXJST.prototype.renderContent = function (content, isBEM) {
        var context = this.context;
        var oldPos = context.position;
        var oldListLength = context._listLength;
        var oldNotNewList = context._notNewList;

        context._notNewList = false;
        if (isBEM) {
          context.position = 0;
          context._listLength = 1;
        }

        var res = this._run(content);

        context.position = oldPos;
        context._listLength = oldListLength;
        context._notNewList = oldNotNewList;

        return res;
      };

      BEMXJST.prototype.local = function (changes, body) {
        var keys = Object.keys(changes);
        var restore = [];
        for (var i = 0; i < keys.length; i++) {
          var key = keys[i];
          var parts = key.split('.');

          var value = this.context;
          for (var j = 0; j < parts.length - 1; j++) {
            value = value[parts[j]];
          }restore.push({
            parts: parts,
            value: value[parts[j]]
          });
          value[parts[j]] = changes[key];
        }

        var res = body.call(this.context);

        for (var i = 0; i < restore.length; i++) {
          var parts = restore[i].parts;
          var value = this.context;
          for (var j = 0; j < parts.length - 1; j++) {
            value = value[parts[j]];
          }value[parts[j]] = restore[i].value;
        }

        return res;
      };

      BEMXJST.prototype.applyNext = function () {
        return this.match.exec(this.context);
      };

      BEMXJST.prototype.applyMode = function (mode, changes) {
        var match = this.match.entity.rest[mode];
        if (!match) return this.context.ctx[mode];

        if (!changes) return match.exec(this.context);

        var self = this;

        // Allocate function this way, to prevent allocation at the top of the
        // `applyMode`
        var fn = function fn() {
          return match.exec(self.context);
        };
        return this.local(changes, fn);
      };

      BEMXJST.prototype.exportApply = function (exports) {
        var self = this;
        exports.apply = function (context) {
          return self.run(context);
        };

        // Add templates at run time
        exports.compile = function (templates) {
          return self.compile(templates);
        };

        exports.BEMContext = self.contextConstructor;

        for (var i = 0; i < self.oninit.length; i++) {
          // NOTE: oninit has global context instead of BEMXJST
          var oninit = self.oninit[i];
          oninit(exports, { BEMContext: exports.BEMContext });
        }
      };
      /**
       * @class Entity
       * @param {BEMXJST} bemxjst
       * @param {String} block
       * @param {String} elem
       * @param {Array} templates
       */
      function Entity(bemxjst) {
        this.bemxjst = bemxjst;

        this.jsClass = null;

        // "Fast modes"
        this.tag = new Match(this, 'tag');
        this.attrs = new Match(this, 'attrs');

        BemxjstEntity.apply(this, arguments);
      }

      inherits(Entity, BemxjstEntity);

      Entity.prototype.init = function (block, elem) {
        this.block = block;
        this.elem = elem;

        // Class for jsParams
        this.jsClass = this.bemxjst.classBuilder.build(this.block, this.elem);
      };

      Entity.prototype._initRest = function (key) {
        if (key === 'default') {
          this.rest[key] = this.def;
        } else if (key === 'tag' || key === 'attrs' || key === 'content') {
          this.rest[key] = this[key];
        } else {
          if (!this.rest.hasOwnProperty(key)) this.rest[key] = new Match(this, key);
        }
      };

      Entity.prototype.defaultBody = function (context) {
        return this.bemxjst.render(context, this, this.tag.exec(context), context.ctx.js !== false ? this.rest.js ? this.rest.js.exec(context) : context.ctx.js : undefined, this.rest.bem ? this.rest.bem.exec(context) : context.ctx.bem, this.rest.cls ? this.rest.cls.exec(context) : context.ctx.cls, this.rest.mix ? this.rest.mix.exec(context) : context.ctx.mix, this.attrs.exec(context), this.content.exec(context));
      };

      function BEMHTML(options) {
        BEMXJST.apply(this, arguments);

        this._shortTagCloser = typeof options.xhtml !== 'undefined' && options.xhtml ? '/>' : '>';

        this._elemJsInstances = options.elemJsInstances;
        this._omitOptionalEndTags = options.omitOptionalEndTags;
        this._unquotedAttrs = typeof options.unquotedAttrs === 'undefined' ? false : options.unquotedAttrs;
      }

      inherits(BEMHTML, BEMXJST);
      module.exports = BEMHTML;

      BEMHTML.prototype.Entity = Entity;

      BEMHTML.prototype.runMany = function (arr) {
        var out = '';
        var context = this.context;
        var prevPos = context.position;
        var prevNotNewList = context._notNewList;

        if (prevNotNewList) {
          context._listLength += arr.length - 1;
        } else {
          context.position = 0;
          context._listLength = arr.length;
        }
        context._notNewList = true;

        if (this.canFlush) {
          for (var i = 0; i < arr.length; i++) {
            out += context._flush(this._run(arr[i]));
          }
        } else {
          for (var i = 0; i < arr.length; i++) {
            out += this._run(arr[i]);
          }
        }

        if (!prevNotNewList) context.position = prevPos;

        return out;
      };

      BEMHTML.prototype.render = function (context, entity, tag, js, bem, cls, mix, attrs, content) {
        var ctx = context.ctx;

        if (tag === undefined) tag = 'div';else if (!tag) return content || content === 0 ? this._run(content) : '';

        var out = '<' + tag;

        var ctxJS = ctx.js;
        if (ctxJS !== false) {
          if (js === true) js = {};

          if (js && js !== ctx.js) {
            if (ctxJS !== true) js = utils.extend(ctxJS, js);
          } else if (ctxJS === true) {
            js = {};
          }
        }

        var jsParams;
        if (js) {
          jsParams = {};
          jsParams[entity.jsClass] = js;
        }

        var isBEM = typeof bem !== 'undefined' ? bem : entity.block || entity.elem;
        isBEM = !!isBEM;

        var addJSInitClass = jsParams && (this._elemJsInstances ? entity.block || entity.elem : entity.block && !entity.elem);

        if (!isBEM && !cls) return this.renderClose(out, context, tag, attrs, isBEM, ctx, content);

        out += ' class=';
        var classValue = '';
        if (isBEM) {
          classValue += entity.jsClass + this.buildModsClasses(entity.block, entity.elem, entity.elem ? context.elemMods : context.mods);

          if (ctx.mix && mix && mix !== ctx.mix) mix = [].concat(mix, ctx.mix);

          if (mix) {
            var m = this.renderMix(entity, mix, jsParams, addJSInitClass);
            classValue += m.out;
            jsParams = m.jsParams;
            addJSInitClass = m.addJSInitClass;
          }

          if (cls) classValue += ' ' + (typeof cls === 'string' ? utils.attrEscape(cls).trim() : cls);
        } else {
          classValue += typeof cls === 'string' ? utils.attrEscape(cls).trim() : cls;
        }

        if (addJSInitClass) classValue += ' i-bem';

        out += this._unquotedAttrs && utils.isUnquotedAttr(classValue) ? classValue : '"' + classValue + '"';

        if (isBEM && jsParams) out += ' data-bem=\'' + utils.jsAttrEscape(JSON.stringify(jsParams)) + '\'';

        return this.renderClose(out, context, tag, attrs, isBEM, ctx, content);
      };

      var OPTIONAL_END_TAGS = {
        // https://www.w3.org/TR/html4/index/elements.html
        html: 1, head: 1, body: 1, p: 1, li: 1, dt: 1, dd: 1,
        colgroup: 1, thead: 1, tbody: 1, tfoot: 1, tr: 1, th: 1, td: 1, option: 1,

        // html5 https://www.w3.org/TR/html5/syntax.html#optional-tags
        /* dl — Neither tag is omissible */rb: 1, rt: 1, rtc: 1, rp: 1, optgroup: 1
      };

      BEMHTML.prototype.renderClose = function (prefix, context, tag, attrs, isBEM, ctx, content) {
        var out = prefix;

        out += this.renderAttrs(attrs, ctx);

        if (utils.isShortTag(tag)) {
          out += this._shortTagCloser;
          if (this.canFlush) out = context._flush(out);
        } else {
          out += '>';
          if (this.canFlush) out = context._flush(out);

          // TODO(indutny): skip apply next flags
          if (content || content === 0) out += this.renderContent(content, isBEM);

          if (!this._omitOptionalEndTags || !OPTIONAL_END_TAGS.hasOwnProperty(tag)) out += '</' + tag + '>';
        }

        if (this.canFlush) out = context._flush(out);
        return out;
      };

      var isObj = function isObj(val) {
        return val && (typeof val === 'undefined' ? 'undefined' : _typeof(val)) === 'object' && !Array.isArray(val) && val !== null;
      };

      BEMHTML.prototype.renderAttrs = function (attrs, ctx) {
        var out = '';

        // NOTE: maybe we need to make an array for quicker serialization
        if (isObj(attrs) || isObj(ctx.attrs)) {
          attrs = utils.extend(attrs, ctx.attrs);

          /* jshint forin : false */
          for (var name in attrs) {
            var attr = attrs[name];
            if (attr === undefined || attr === false || attr === null) continue;

            if (attr === true) {
              out += ' ' + name;
            } else {
              var attrVal = utils.isSimple(attr) ? attr : this.context.reapply(attr);
              out += ' ' + name + '=';

              out += this._unquotedAttrs && utils.isUnquotedAttr(attrVal) ? attrVal : '"' + utils.attrEscape(attrVal) + '"';
            }
          }
        }

        return out;
      };

      BEMHTML.prototype.renderMix = function (entity, mix, jsParams, addJSInitClass) {
        var visited = {};
        var context = this.context;
        var js = jsParams;
        var addInit = addJSInitClass;

        visited[entity.jsClass] = true;

        // Transform mix to the single-item array if it's not array
        if (!Array.isArray(mix)) mix = [mix];

        var classBuilder = this.classBuilder;

        var out = '';
        for (var i = 0; i < mix.length; i++) {
          var item = mix[i];
          if (!item) continue;
          if (typeof item === 'string') item = { block: item, elem: undefined };

          var hasItem = false;

          if (item.elem) {
            hasItem = item.elem !== entity.elem && item.elem !== context.elem || item.block && item.block !== entity.block;
          } else if (item.block) {
            hasItem = !(item.block === entity.block && item.mods) || item.mods && entity.elem;
          }

          var block = item.block || item._block || context.block;
          var elem = item.elem || item._elem || context.elem;
          var key = classBuilder.build(block, elem);

          var classElem = item.elem || item._elem || (item.block ? undefined : context.elem);
          if (hasItem) out += ' ' + classBuilder.build(block, classElem);

          out += this.buildModsClasses(block, classElem, item.elem || !item.block && (item._elem || context.elem) ? item.elemMods : item.mods);

          if (item.js) {
            if (!js) js = {};

            js[classBuilder.build(block, item.elem)] = item.js === true ? {} : item.js;
            if (!addInit) addInit = block && !item.elem;
          }

          // Process nested mixes
          if (!hasItem || visited[key]) continue;

          visited[key] = true;
          var nestedEntity = this.entities[key];
          if (!nestedEntity) continue;

          var oldBlock = context.block;
          var oldElem = context.elem;
          var nestedMix = nestedEntity.rest.mix && nestedEntity.rest.mix.exec(context);
          context.elem = oldElem;
          context.block = oldBlock;

          if (!nestedMix) continue;

          for (var j = 0; j < nestedMix.length; j++) {
            var nestedItem = nestedMix[j];
            if (!nestedItem) continue;

            if (!nestedItem.block && !nestedItem.elem || !visited[classBuilder.build(nestedItem.block, nestedItem.elem)]) {
              if (nestedItem.block) continue;

              nestedItem._block = block;
              nestedItem._elem = elem;
              mix = mix.slice(0, i + 1).concat(nestedItem, mix.slice(i + 1));
            }
          }
        }

        return {
          out: out,
          jsParams: js,
          addJSInitClass: addInit
        };
      };

      BEMHTML.prototype.buildModsClasses = function (block, elem, mods) {
        if (!mods) return '';

        var res = '';

        /*jshint -W089 */
        for (var modName in mods) {
          if (!mods.hasOwnProperty(modName) || modName === '') continue;

          var modVal = mods[modName];
          if (!modVal && modVal !== 0) continue;
          if (typeof modVal !== 'boolean') modVal += '';

          var builder = this.classBuilder;
          res += ' ' + (elem ? builder.buildElemClass(block, elem, modName, modVal) : builder.buildBlockClass(block, modName, modVal));
        }

        return res;
      };
      ;
      return module.exports || exports.BEMHTML;
    }({}, {});
    /// -------------------------------------
    /// --------- BEM-XJST Runtime End ------
    /// -------------------------------------

    var api = new BEMHTML({});
    /// -------------------------------------
    /// ------ BEM-XJST User-code Start -----
    /// -------------------------------------
    api.compile(function (match, wrap, block, elem, mode, mod, elemMod, def, tag, attrs, cls, js, bem, mix, content, replace, extend, oninit, xjstOptions, appendContent, prependContent, local, applyCtx, applyNext, apply) {
      /* begin: /var/lib/jenkins/workspace/FRONTEND-GEN/frontend/yamoney-frontend-makeupd/release_9.266.0/release_flow/source/node_modules/@yoo/bem-portal-components/common.blocks/i-bem/__i18n/i-bem__i18n.bemhtml.js */
      /* global exports, BEM */

      block('i-bem').elem('i18n').def()(function () {
        if (!this.ctx) return '';

        var ctx = this.ctx,
            keyset = ctx.keyset,
            key = ctx.key,
            params = ctx.params || {};

        if (!(keyset || key)) return '';

        /**
         * Consider `content` is a reserved param that contains
         * valid bemjson data
         */
        if (typeof ctx.content === 'undefined' || ctx.content !== null) {
          params.content = exports.apply(ctx.content);
        }

        this._buf.push(BEM.I18N(keyset, key, params));
      });

      /* end: /var/lib/jenkins/workspace/FRONTEND-GEN/frontend/yamoney-frontend-makeupd/release_9.266.0/release_flow/source/node_modules/@yoo/bem-portal-components/common.blocks/i-bem/__i18n/i-bem__i18n.bemhtml.js */
      /* begin: /var/lib/jenkins/workspace/FRONTEND-GEN/frontend/yamoney-frontend-makeupd/release_9.266.0/release_flow/source/node_modules/bem-core/common.blocks/ua/ua.bemhtml.js */
      block('ua')(tag()('script'), bem()(false), content()(['(function(e,c){', 'e[c]=e[c].replace(/(ua_js_)no/g,"$1yes");', '})(document.documentElement,"className");']));

      /* end: /var/lib/jenkins/workspace/FRONTEND-GEN/frontend/yamoney-frontend-makeupd/release_9.266.0/release_flow/source/node_modules/bem-core/common.blocks/ua/ua.bemhtml.js */
      /* begin: /var/lib/jenkins/workspace/FRONTEND-GEN/frontend/yamoney-frontend-makeupd/release_9.266.0/release_flow/source/node_modules/@yoo/bem-portal-components/common.blocks/title/title.bemhtml.js */
      block('title')(tag()('h1'), mod('level', '2').tag()('h2'), mod('level', '3').tag()('h3'), cls()(function () {
        return this.isLast() && 'title_last_yes';
      }));

      /* end: /var/lib/jenkins/workspace/FRONTEND-GEN/frontend/yamoney-frontend-makeupd/release_9.266.0/release_flow/source/node_modules/@yoo/bem-portal-components/common.blocks/title/title.bemhtml.js */
      /* begin: /var/lib/jenkins/workspace/FRONTEND-GEN/frontend/yamoney-frontend-makeupd/release_9.266.0/release_flow/source/node_modules/@yoo/bem-portal-components/common.blocks/promo-header/__title/promo-header__title.bemhtml.js */
      block('promo-header').elem('title').mix()({
        block: 'title'
      });

      /* end: /var/lib/jenkins/workspace/FRONTEND-GEN/frontend/yamoney-frontend-makeupd/release_9.266.0/release_flow/source/node_modules/@yoo/bem-portal-components/common.blocks/promo-header/__title/promo-header__title.bemhtml.js */
      /* begin: /var/lib/jenkins/workspace/FRONTEND-GEN/frontend/yamoney-frontend-makeupd/release_9.266.0/release_flow/source/node_modules/@yoo/bem-portal-components/common.blocks/promo-header/__close/promo-header__close.bemhtml.js */
      block('promo-header').elem('close').def()(function () {
        this.elemMods.theme = 'grey';

        return applyNext();
      });

      /* end: /var/lib/jenkins/workspace/FRONTEND-GEN/frontend/yamoney-frontend-makeupd/release_9.266.0/release_flow/source/node_modules/@yoo/bem-portal-components/common.blocks/promo-header/__close/promo-header__close.bemhtml.js */
      /* begin: /var/lib/jenkins/workspace/FRONTEND-GEN/frontend/yamoney-frontend-makeupd/release_9.266.0/release_flow/source/node_modules/bem-components/common.blocks/button/button.bemhtml.js */
      block('button')(def()(function () {
        var tag = apply('tag'),
            isRealButton = tag === 'button' && (!this.mods.type || this.mods.type === 'submit');

        return applyNext({ _isRealButton: isRealButton });
      }), tag()(function () {
        return this.ctx.tag || 'button';
      }), js()(true),

      // NOTE: mix below is to satisfy interface of `control`
      mix()({ elem: 'control' }), attrs()(
      // Common attributes
      function () {
        var ctx = this.ctx,
            attrs = {
          role: 'button',
          tabindex: ctx.tabIndex,
          id: ctx.id,
          title: ctx.title
        };

        this.mods.disabled && !this._isRealButton && (attrs['aria-disabled'] = 'true');

        return attrs;
      },

      // Attributes for button variant
      match(function () {
        return this._isRealButton;
      })(function () {
        var ctx = this.ctx,
            attrs = {
          type: this.mods.type || 'button',
          name: ctx.name,
          value: ctx.val
        };

        this.mods.disabled && (attrs.disabled = 'disabled');

        return this.extend(applyNext(), attrs);
      })), content()(function () {
        var ctx = this.ctx,
            content = [ctx.icon];
        // NOTE: wasn't moved to separate template for optimization
        /* jshint eqnull: true */
        ctx.text != null && content.push({ elem: 'text', content: ctx.text });
        return content;
      }, match(function () {
        return typeof this.ctx.content !== 'undefined';
      })(function () {
        return this.ctx.content;
      })));

      /* end: /var/lib/jenkins/workspace/FRONTEND-GEN/frontend/yamoney-frontend-makeupd/release_9.266.0/release_flow/source/node_modules/bem-components/common.blocks/button/button.bemhtml.js */
      /* begin: /var/lib/jenkins/workspace/FRONTEND-GEN/frontend/yamoney-frontend-makeupd/release_9.266.0/release_flow/source/node_modules/@yoo/bem-portal-components/common.blocks/button/button.bemhtml.js */
      block('button')(
      // Порядок важен для правильного применения стилей.
      // Элементы icon должны идти раньше, чем text.
      match(function () {
        return !this.ctx.content;
      }).content()(function () {
        var ctx = this.ctx;

        return [ctx.icon && {
          elem: 'icon',
          icon: ctx.icon
        }, ctx.iconLeft && {
          elem: 'icon',
          elemMods: { side: 'left' },
          icon: ctx.iconLeft
        }, ctx.iconRight && {
          elem: 'icon',
          elemMods: { side: 'right' },
          icon: ctx.iconRight
        },
        // Текст может быть пустой строкой.
        ctx.text !== undefined && (this.isSimple(ctx.text) ? { elem: 'text', content: { html: this.xmlEscape(ctx.text) } } : this.extend(ctx.text, { elem: 'text' }))].filter(Boolean); // Удаляем все undefined в массиве.
      }));

      /* end: /var/lib/jenkins/workspace/FRONTEND-GEN/frontend/yamoney-frontend-makeupd/release_9.266.0/release_flow/source/node_modules/@yoo/bem-portal-components/common.blocks/button/button.bemhtml.js */
      /* begin: /var/lib/jenkins/workspace/FRONTEND-GEN/frontend/yamoney-frontend-makeupd/release_9.266.0/release_flow/source/node_modules/bem-components/common.blocks/button/_focused/button_focused.bemhtml.js */
      block('button').mod('focused', true).js()(function () {
        return this.extend(applyNext(), { live: false });
      });

      /* end: /var/lib/jenkins/workspace/FRONTEND-GEN/frontend/yamoney-frontend-makeupd/release_9.266.0/release_flow/source/node_modules/bem-components/common.blocks/button/_focused/button_focused.bemhtml.js */
      /* begin: /var/lib/jenkins/workspace/FRONTEND-GEN/frontend/yamoney-frontend-makeupd/release_9.266.0/release_flow/source/node_modules/bem-components/common.blocks/button/__text/button__text.bemhtml.js */
      block('button').elem('text').tag()('span');

      /* end: /var/lib/jenkins/workspace/FRONTEND-GEN/frontend/yamoney-frontend-makeupd/release_9.266.0/release_flow/source/node_modules/bem-components/common.blocks/button/__text/button__text.bemhtml.js */
      /* begin: /var/lib/jenkins/workspace/FRONTEND-GEN/frontend/yamoney-frontend-makeupd/release_9.266.0/release_flow/source/node_modules/@yoo/bem-portal-components/common.blocks/button/__icon/button__icon.bemhtml.js */
      block('button').elem('icon').def()(function () {
        var icon = this.extend({}, this.ctx.icon); // Копируем, чтобы быть immutable.

        icon.block = 'icon';
        icon.mix = [{ block: 'button', elem: 'icon', elemMods: this.elemMods }].concat(icon.mix);
        icon.mods = this.extend({ size: this.mods.size }, icon.mods);

        return applyCtx(icon);
      });

      /* end: /var/lib/jenkins/workspace/FRONTEND-GEN/frontend/yamoney-frontend-makeupd/release_9.266.0/release_flow/source/node_modules/@yoo/bem-portal-components/common.blocks/button/__icon/button__icon.bemhtml.js */
      /* begin: /var/lib/jenkins/workspace/FRONTEND-GEN/frontend/yamoney-frontend-makeupd/release_9.266.0/release_flow/source/node_modules/bem-components/common.blocks/icon/icon.bemhtml.js */
      block('icon')(tag()('span'), attrs()(function () {
        var attrs = {},
            url = this.ctx.url;
        if (url) attrs.style = 'background-image:url(' + url + ')';
        return attrs;
      }));

      /* end: /var/lib/jenkins/workspace/FRONTEND-GEN/frontend/yamoney-frontend-makeupd/release_9.266.0/release_flow/source/node_modules/bem-components/common.blocks/icon/icon.bemhtml.js */
      /* begin: /var/lib/jenkins/workspace/FRONTEND-GEN/frontend/yamoney-frontend-makeupd/release_9.266.0/release_flow/source/node_modules/@yoo/bem-portal-components/common.blocks/spinner/spinner.bemhtml.js */
      block('spinner')(def()(function () {
        this.mods.state = 'close';

        return applyNext();
      }), js()(true), content()(function () {
        return [{
          block: 'paranja',
          mix: {
            block: 'spinner',
            elem: 'paranja'
          },
          content: [{
            block: 'spin',
            mods: {
              visible: true,
              size: 'l'
            },
            mix: {
              block: 'spinner',
              elem: 'spin'
            }
          }, {
            block: 'spinner',
            elem: 'content',
            content: this.ctx.content
          }]
        }];
      }));

      /* end: /var/lib/jenkins/workspace/FRONTEND-GEN/frontend/yamoney-frontend-makeupd/release_9.266.0/release_flow/source/node_modules/@yoo/bem-portal-components/common.blocks/spinner/spinner.bemhtml.js */
      /* begin: /var/lib/jenkins/workspace/FRONTEND-GEN/frontend/yamoney-frontend-makeupd/release_9.266.0/release_flow/source/node_modules/bem-components/common.blocks/spin/spin.bemhtml.js */
      block('spin')(tag()('span'));

      /* end: /var/lib/jenkins/workspace/FRONTEND-GEN/frontend/yamoney-frontend-makeupd/release_9.266.0/release_flow/source/node_modules/bem-components/common.blocks/spin/spin.bemhtml.js */
      /* begin: /var/lib/jenkins/workspace/FRONTEND-GEN/frontend/yamoney-frontend-makeupd/release_9.266.0/release_flow/source/node_modules/@yoo/bem-portal-components/common.blocks/spin/spin.bemhtml.js */
      block('spin')(js()(true));

      /* end: /var/lib/jenkins/workspace/FRONTEND-GEN/frontend/yamoney-frontend-makeupd/release_9.266.0/release_flow/source/node_modules/@yoo/bem-portal-components/common.blocks/spin/spin.bemhtml.js */
      /* begin: /var/lib/jenkins/workspace/FRONTEND-GEN/frontend/yamoney-frontend-makeupd/release_9.266.0/release_flow/source/node_modules/@yoo/bem-portal-components/common.blocks/paranja/paranja.bemhtml.js */
      block('paranja')(js()(true), def()(function () {
        // Состояние и тема по умолчанию
        return applyNext({
          'mods.state': this.mods.state || 'close',
          'mods.theme': this.mods.theme || 'normal'
        });
      }));

      /* end: /var/lib/jenkins/workspace/FRONTEND-GEN/frontend/yamoney-frontend-makeupd/release_9.266.0/release_flow/source/node_modules/@yoo/bem-portal-components/common.blocks/paranja/paranja.bemhtml.js */
      /* begin: /var/lib/jenkins/workspace/FRONTEND-GEN/frontend/yamoney-frontend-makeupd/release_9.266.0/release_flow/source/node_modules/bem-components/common.blocks/popup/popup.bemhtml.js */
      block('popup')(js()(function () {
        var ctx = this.ctx;
        return {
          mainOffset: ctx.mainOffset,
          secondaryOffset: ctx.secondaryOffset,
          viewportOffset: ctx.viewportOffset,
          directions: ctx.directions,
          zIndexGroupLevel: ctx.zIndexGroupLevel
        };
      }), attrs()({ 'aria-hidden': 'true' }));

      /* end: /var/lib/jenkins/workspace/FRONTEND-GEN/frontend/yamoney-frontend-makeupd/release_9.266.0/release_flow/source/node_modules/bem-components/common.blocks/popup/popup.bemhtml.js */
      /* begin: /var/lib/jenkins/workspace/FRONTEND-GEN/frontend/yamoney-frontend-makeupd/release_9.266.0/release_flow/source/node_modules/@yoo/bem-portal-components/common.blocks/popup/__tail/popup__tail.bemhtml.js */
      block('popup').elem('tail').tag()('span');

      /* end: /var/lib/jenkins/workspace/FRONTEND-GEN/frontend/yamoney-frontend-makeupd/release_9.266.0/release_flow/source/node_modules/@yoo/bem-portal-components/common.blocks/popup/__tail/popup__tail.bemhtml.js */
      /* begin: /var/lib/jenkins/workspace/FRONTEND-GEN/frontend/yamoney-frontend-makeupd/release_9.266.0/release_flow/source/node_modules/@yoo/bem-portal-components/common.blocks/lantern/lantern.bemhtml.js */
      block('lantern')(def()(function () {
        this.mods.theme = this.mods.theme || 'alert';
        this.mods.size = this.mods.size || 'normal';

        return applyNext({
          _lanternTheme: this.mods.theme
        });
      }), content()(function () {
        return {
          elem: 'content',
          content: applyNext()
        };
      }), match(function () {
        return this.ctx.under;
      }).content()(function () {
        return [applyNext(), {
          elem: 'under',
          content: this.ctx.under
        }];
      }));
      // yalovenko: перенести в правильный файл FRONTEND-536
      block('link').match(function () {
        return this._lanternTheme;
      }).def()(function () {
        this.mods.type = 'underlined';

        switch (this._lanternTheme) {
          case 'alert':
          case 'positive':
          case 'negative':
          case 'neutral':
            {
              this.mods.theme = 'light';
              break;
            }
          case 'await':
            {
              this.mods.theme = 'dark';
              break;
            }
        }

        return applyNext();
      });

      /* end: /var/lib/jenkins/workspace/FRONTEND-GEN/frontend/yamoney-frontend-makeupd/release_9.266.0/release_flow/source/node_modules/@yoo/bem-portal-components/common.blocks/lantern/lantern.bemhtml.js */
      /* begin: /var/lib/jenkins/workspace/FRONTEND-GEN/frontend/yamoney-frontend-makeupd/release_9.266.0/release_flow/source/node_modules/@yoo/bem-portal-components/common.blocks/i-bem/__i18n/_dummy/i-bem__i18n_dummy_yes.bemhtml.js */
      /*global oninit, BEM, exports */

      oninit(function () {
        (function (global, bem_) {

          if (bem_.I18N) {
            return;
          }

          /** @global points to global context */
          global.BEM = bem_;

          /**
          * `BEM.I18N` API stub
          */
          var i18n = global.BEM.I18N = function (keyset, key) {
            return key;
          };

          i18n.keyset = function () {
            return i18n;
          };
          i18n.key = function (key) {
            return key;
          };
          i18n.lang = function () {
            return;
          };
        })(this, typeof BEM === 'undefined' ? {} : BEM);
      });

      /* end: /var/lib/jenkins/workspace/FRONTEND-GEN/frontend/yamoney-frontend-makeupd/release_9.266.0/release_flow/source/node_modules/@yoo/bem-portal-components/common.blocks/i-bem/__i18n/_dummy/i-bem__i18n_dummy_yes.bemhtml.js */
      /* begin: /var/lib/jenkins/workspace/FRONTEND-GEN/frontend/yamoney-frontend-makeupd/release_9.266.0/release_flow/source/node_modules/@yoo/bem-portal-components/common.blocks/promo-header/promo-header.bemhtml.js */
      block('promo-header')(js()(true), content()(function () {
        return {
          elem: 'content',
          elemMods: {
            type: this.mods.type
          },
          content: [this.ctx.logo && {
            elem: 'logo',
            elemMods: {
              type: this.mods.type
            },
            content: this.ctx.logo
          }, {
            elem: 'description',
            elemMods: {
              type: this.mods.id
            },
            content: [{
              elem: 'title',
              elemMods: this.ctx.elemTitleMods || {},
              content: this.ctx.title
            }, {
              elem: 'text',
              content: this.ctx.text
            }, {
              elem: 'control',
              content: this.ctx.control
            }]
          }, this.mods.close !== 'no' && {
            elem: 'close'
          }]
        };
      }));

      /* end: /var/lib/jenkins/workspace/FRONTEND-GEN/frontend/yamoney-frontend-makeupd/release_9.266.0/release_flow/source/node_modules/@yoo/bem-portal-components/common.blocks/promo-header/promo-header.bemhtml.js */
      /* begin: /var/lib/jenkins/workspace/FRONTEND-GEN/frontend/yamoney-frontend-makeupd/release_9.266.0/release_flow/source/node_modules/bem-components/common.blocks/button/_type/button_type_link.bemhtml.js */
      block('button').mod('type', 'link')(tag()('a'), attrs()(function () {
        var ctx = this.ctx,
            attrs = { role: 'link' };

        ctx.target && (attrs.target = ctx.target);
        this.mods.disabled ? attrs['aria-disabled'] = 'true' : attrs.href = ctx.url;

        return this.extend(applyNext(), attrs);
      }), mod('disabled', true).js()(function () {
        return this.extend(applyNext(), { url: this.ctx.url });
      }));

      /* end: /var/lib/jenkins/workspace/FRONTEND-GEN/frontend/yamoney-frontend-makeupd/release_9.266.0/release_flow/source/node_modules/bem-components/common.blocks/button/_type/button_type_link.bemhtml.js */
      /* begin: /var/lib/jenkins/workspace/FRONTEND-GEN/frontend/yamoney-frontend-makeupd/release_9.266.0/release_flow/source/node_modules/@yoo/bem-portal-components/common.blocks/i-global/i-global.bemhtml.js */
      oninit(function (exports) {
        var ctxProto = exports.BEMContext.prototype,

        // Параметры по умолчанию
        glob = exports['i-global'] = ctxProto['i-global'] = ctxProto.extend({
          lang: 'ru',
          login: '',
          environment: 'development'
        }, ctxProto['i-global']);

        // Параметры доступные в JS
        glob._public = {
          lang: true,
          login: true,
          displayName: true,
          retpath: true,
          uid: true,
          'root-host': true,
          'spass-add': true,
          auth: true,
          'offer': true,
          'sauthType': true,
          'isDev': true,
          'protocol': true,
          'avatarHost': true,
          'auth-retpath': true,
          'logout-retpath': true,
          'yametricsId': true,
          'denyFrame': true,
          platform: true,
          pageTheme: true,
          myTargetAppId: true,
          doubleclickAppId: true,
          accountKey: true,
          gtmAppId: true
        };

        /**
         * Делает один или несколько параметров доступными или недоступными в JS.
         *
         *
         * @param {String|Object<String,Boolean>} param Имя параметра или объект именами параметров в качестве ключей
         * и значениями `true` или `false`
         * @param {Boolean} [flag] Устанавливаемое значение доступности параметра
         */
        glob.makePublic = function (param, flag) {
          if ((typeof param === 'undefined' ? 'undefined' : _typeof(param)) === 'object') {
            glob._public = ctxProto.extend(glob._public, param);
            return;
          }

          if (typeof flag === 'undefined') {
            flag = true;
          }

          glob._public[param] = flag;
        };

        /**
         * Проверяет доступен ли параметр в JS.
         *
         * @param {String} param Имя параметра
         * @returns {Boolean} Доступность параметра
         */
        glob.isPublic = function (param) {
          return Boolean(glob._public[param]);
        };

        ctxProto._iGlobalBackup = {
          _backup: null,
          exists: function exists() {
            return Boolean(this._backup);
          },
          save: function save() {
            this._backup = ctxProto.extend({}, glob);
          },
          restore: function restore() {
            // Нельзя просто заменить ссылку на i-global, некоторые блоки сохраняют её при инициализации шаблонов.
            // Приходится удалять и перезаписывать содержимое.
            var p;
            for (p in glob) {
              delete glob[p];
            }
            for (p in this._backup) {
              glob[p] = this._backup[p];
            }
          }
        };
      });

      block('i-global')(tag()(''), def()(function () {
        var params = this.ctx.params || {};
        var iGlobal = this['i-global'];

        if (!this._iGlobalBackup.exists()) {
          this._iGlobalBackup.save();
        } else if (this.ctx.reset !== false) {
          this._iGlobalBackup.restore();
        }

        for (var p in params) {
          iGlobal[p] = params[p];
        }

        return '';
      }));

      /* end: /var/lib/jenkins/workspace/FRONTEND-GEN/frontend/yamoney-frontend-makeupd/release_9.266.0/release_flow/source/node_modules/@yoo/bem-portal-components/common.blocks/i-global/i-global.bemhtml.js */
      /* begin: /var/lib/jenkins/workspace/FRONTEND-GEN/frontend/yamoney-frontend-makeupd/release_9.266.0/release_flow/source/node_modules/@yoo/bem-portal-components/common.blocks/tooltip/tooltip.bemhtml.js */
      block('tooltip').def()(function () {
        var ctx = this.ctx;
        var mods = this.mods;
        var closeMod = mods.autoclosable;
        var autoclosableMap = { 'yes': true, 'no': false };
        var popupMods = {
          target: mods.target || 'anchor',
          autoclosable: typeof closeMod == 'string' ? autoclosableMap[closeMod] : closeMod,
          theme: 'islands' // анимация при показе
        };
        var contentMods = Object.assign({}, ctx.contentMods);
        var tooltipJs = apply('js');

        tooltipJs = (tooltipJs ? this.extend(tooltipJs, Object(ctx.js)) : ctx.js) || {};

        var directions = ctx.directions || tooltipJs.to || tooltipJs.directions;
        var to = directions && [].concat(directions);
        var userAxis = tooltipJs.axis;
        var defaultAxis = 'center';
        var axis = userAxis === 'middle' ? defaultAxis : userAxis || defaultAxis;
        var defaultTipOffset = 8;
        // обратная совместимость, раньше отступ высчитывался в противоположную сторону от раскрытия
        var tipOffset = tooltipJs.offset == -defaultTipOffset ? defaultTipOffset : tooltipJs.offset;

        return applyCtx({
          block: 'popup',
          mods: popupMods,
          directions: (to || ['right', 'bottom', 'top', 'left']).map(function (dir) {
            if (dir.indexOf('-') === -1) {
              return dir + '-' + axis;
            }
            return dir;
          }),
          mainOffset: ctx.mainOffset || tipOffset || defaultTipOffset,
          secondaryOffset: ctx.secondaryOffset,
          viewportOffset: ctx.viewportOffset,
          zIndexGroupLevel: ctx.zIndexGroupLevel || 3,
          mix: [{ block: 'tooltip', mods: mods, js: {} }].concat(ctx.mix),
          content: [{ block: 'tooltip', elem: 'tail' }, {
            block: 'tooltip',
            elem: 'content',
            elemMods: contentMods,
            content: ctx.content
          }]
        });
      });

      /* end: /var/lib/jenkins/workspace/FRONTEND-GEN/frontend/yamoney-frontend-makeupd/release_9.266.0/release_flow/source/node_modules/@yoo/bem-portal-components/common.blocks/tooltip/tooltip.bemhtml.js */
      oninit(function (exports, context) {
        var BEMContext = exports.BEMContext || context.BEMContext;
        // Provides third-party libraries from different modular systems
        BEMContext.prototype.require = function (lib) {
          return __bem_xjst_libs__[lib];
        };
      });;
    });
    api.exportApply(exports);
    /// -------------------------------------
    /// ------ BEM-XJST User-code End -------
    /// -------------------------------------


    return exports;
  };

  var require = function () {
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
  }()({ 1: [function (require, module, exports) {
      "use strict";

      module.exports = {
        // Российский рубль
        643: {
          'alpha-code': 'RUB',
          symbol: '\u20BD',
          html: '&#8381;'
        },
        // На демо, код рубля другой
        // @todo возможно не должно быть логики окружения
        10643: {
          'alpha-code': 'RUB',
          symbol: '\u20BD',
          html: '&#8381;'
        },
        // Доллар США
        840: {
          'alpha-code': 'USD',
          symbol: "$",
          html: '&#36;'
        },
        // Евро
        978: {
          'alpha-code': 'EUR',
          symbol: '\u20AC',
          html: '&#8364;'
        },
        // Казахстанский тенге
        398: {
          'alpha-code': 'KZT',
          symbol: '\u20B8',
          html: '&#8376;'
        },
        // Белорусский рубль
        974: {
          'alpha-code': 'BYR',
          symbol: 'Br',
          html: 'Br'
        },
        // Белорусский рубль (после деноминации 01.07.2016)
        933: {
          'alpha-code': 'BYN',
          symbol: 'Br',
          html: 'Br'
        },
        // Белорусский рубль на демо (после деноминации 01.07.2016)
        10933: {
          'alpha-code': 'BYN',
          symbol: 'Br',
          html: 'Br'
        },
        // Украинская гривна
        980: {
          'alpha-code': 'UAH',
          symbol: '\u20B4',
          html: '&#8372;'
        },
        // Algerian Dinar
        '012': {
          'alpha-code': 'DZD',
          symbol: 'Dzd',
          html: 'Dzd'
        },
        // Argentine Peso
        '032': {
          'alpha-code': 'ARS',
          symbol: 'Ars',
          html: 'Ars'
        },
        // Australian Dollar
        '036': {
          'alpha-code': 'AUD',
          symbol: 'Aud',
          html: 'Aud'
        },
        // Bahamian Dollar
        '044': {
          'alpha-code': 'BSD',
          symbol: 'Bsd',
          html: 'Bsd'
        },
        // Bahraini Dinar
        '048': {
          'alpha-code': 'BHD',
          symbol: 'Bhd',
          html: 'Bhd'
        },
        // Taka
        '050': {
          'alpha-code': 'BDT',
          symbol: '\u09F3',
          html: 'Bdt'
        },
        // Armenian Dram
        '051': {
          'alpha-code': 'AMD',
          symbol: 'Amd',
          html: 'Amd'
        },
        // Barbados Dollar
        '052': {
          'alpha-code': 'BBD',
          symbol: 'Bbd',
          html: 'Bbd'
        },
        // Bermudian Dollar
        '060': {
          'alpha-code': 'BMD',
          symbol: 'Bmd',
          html: 'Bmd'
        },
        // Bhutan ngultrum
        '064': {
          'alpha-code': 'BTN',
          symbol: 'Btn',
          html: 'Btn'
        },
        // Boliviano
        '068': {
          'alpha-code': 'BOB',
          symbol: 'Bob',
          html: 'Bob'
        },
        // Pula
        '072': {
          'alpha-code': 'BWP',
          symbol: 'Bwp',
          html: 'Bwp'
        },
        // Belize Dollar
        '084': {
          'alpha-code': 'BZD',
          symbol: 'Bzd',
          html: 'Bzd'
        },
        // Solomon Islands Dollar
        '090': {
          'alpha-code': 'SBD',
          symbol: 'Sbd',
          html: 'Sbd'
        },
        // Brunei Dollar
        '096': {
          'alpha-code': 'BND',
          symbol: 'Bnd',
          html: 'Bnd'
        },
        // Kyat
        104: {
          'alpha-code': 'MMK',
          symbol: 'Mmk',
          html: 'Mmk'
        },
        // Burundi Franc
        108: {
          'alpha-code': 'BIF',
          symbol: 'Bif',
          html: 'Bif'
        },
        // Riel
        116: {
          'alpha-code': 'KHR',
          symbol: '\u17DB',
          html: 'Khr'
        },
        // Canadian Dollar
        124: {
          'alpha-code': 'CAD',
          symbol: 'Cad',
          html: 'Cad'
        },
        // Cape Verde Escudo
        132: {
          'alpha-code': 'CVE',
          symbol: 'Cve',
          html: 'Cve'
        },
        // Cayman Islands Dollar
        136: {
          'alpha-code': 'KYD',
          symbol: 'Kyd',
          html: 'Kyd'
        },
        // Sri Lanka Rupee
        144: {
          'alpha-code': 'LKR',
          symbol: 'Lkr',
          html: 'Lkr'
        },
        // Chilean Peso
        152: {
          'alpha-code': 'CLP',
          symbol: 'Clp',
          html: 'Clp'
        },
        // Yuan Renminbi
        156: {
          'alpha-code': 'CNY',
          symbol: "\xA5",
          html: 'Cny'
        },
        // Chinese Renminbi
        157: {
          'alpha-code': 'CNH',
          symbol: 'Cnh',
          html: 'Cnh'
        },
        // CHINESE RENMINBI
        158: {
          'alpha-code': 'CNX',
          symbol: 'Cnx',
          html: 'Cnx'
        },
        // Colombian Peso
        170: {
          'alpha-code': 'COP',
          symbol: 'Cop',
          html: 'Cop'
        },
        // Comoro Franc
        174: {
          'alpha-code': 'KMF',
          symbol: 'Kmf',
          html: 'Kmf'
        },
        // Costa Rican Colon
        188: {
          'alpha-code': 'CRC',
          symbol: '\u20A1',
          html: 'Crc'
        },
        // Kuna
        191: {
          'alpha-code': 'HRK',
          symbol: 'Hrk',
          html: 'Hrk'
        },
        // Cuban Peso
        192: {
          'alpha-code': 'CUP',
          symbol: 'Cup',
          html: 'Cup'
        },
        // Czech Koruna
        203: {
          'alpha-code': 'CZK',
          symbol: 'Kč',
          html: 'Kč'
        },
        // Danish Krone
        208: {
          'alpha-code': 'DKK',
          symbol: 'Dkk',
          html: 'Dkk'
        },
        // Dominican Peso
        214: {
          'alpha-code': 'DOP',
          symbol: 'Dop',
          html: 'Dop'
        },
        // El Salvador Colon
        222: {
          'alpha-code': 'SVC',
          symbol: 'Svc',
          html: 'Svc'
        },
        // Ethiopian Birr
        230: {
          'alpha-code': 'ETB',
          symbol: 'Etb',
          html: 'Etb'
        },
        // Pound
        238: {
          'alpha-code': 'FKP',
          symbol: 'Fkp',
          html: 'Fkp'
        },
        // Fiji Dollar
        242: {
          'alpha-code': 'FJD',
          symbol: 'Fjd',
          html: 'Fjd'
        },
        // Djibouti Franc
        262: {
          'alpha-code': 'DJF',
          symbol: 'Djf',
          html: 'Djf'
        },
        // Dalasi
        270: {
          'alpha-code': 'GMD',
          symbol: 'Gmd',
          html: 'Gmd'
        },
        // Gibraltar Pound
        292: {
          'alpha-code': 'GIP',
          symbol: 'Gip',
          html: 'Gip'
        },
        // Quetzal
        320: {
          'alpha-code': 'GTQ',
          symbol: 'Gtq',
          html: 'Gtq'
        },
        // Guinea Franc
        324: {
          'alpha-code': 'GNF',
          symbol: 'Gnf',
          html: 'Gnf'
        },
        // Guyana Dollar
        328: {
          'alpha-code': 'GYD',
          symbol: 'Gyd',
          html: 'Gyd'
        },
        // Gourde
        332: {
          'alpha-code': 'HTG',
          symbol: 'Htg',
          html: 'Htg'
        },
        // Lempira
        340: {
          'alpha-code': 'HNL',
          symbol: 'Hnl',
          html: 'Hnl'
        },
        // Hong Kong Dollar
        344: {
          'alpha-code': 'HKD',
          symbol: 'Hkd',
          html: 'Hkd'
        },
        // Forint
        348: {
          'alpha-code': 'HUF',
          symbol: 'Huf',
          html: 'Huf'
        },
        // Iceland Krona
        352: {
          'alpha-code': 'ISK',
          symbol: 'Isk',
          html: 'Isk'
        },
        // Indian Rupee
        356: {
          'alpha-code': 'INR',
          symbol: '\u20B9',
          html: 'Inr'
        },
        // Rupiah
        360: {
          'alpha-code': 'IDR',
          symbol: 'Idr',
          html: 'Idr'
        },
        // Iraqi Dinar
        368: {
          'alpha-code': 'IQD',
          symbol: 'Iqd',
          html: 'Iqd'
        },
        // New Israeli Sheqel
        376: {
          'alpha-code': 'ILS',
          symbol: '\u20AA',
          html: 'Ils'
        },
        // Jamaican Dollar
        388: {
          'alpha-code': 'JMD',
          symbol: 'Jmd',
          html: 'Jmd'
        },
        // Yen
        392: {
          'alpha-code': 'JPY',
          symbol: "\xA5",
          html: 'Jpy'
        },
        // Jordanian Dinar
        400: {
          'alpha-code': 'JOD',
          symbol: 'Jod',
          html: 'Jod'
        },
        // Kenyan Shilling
        404: {
          'alpha-code': 'KES',
          symbol: 'Kes',
          html: 'Kes'
        },
        // Won
        410: {
          'alpha-code': 'KRW',
          symbol: '\u20A9',
          html: 'Krw'
        },
        // Kuwaiti Dinar
        414: {
          'alpha-code': 'KWD',
          symbol: 'Kwd',
          html: 'Kwd'
        },
        // Som
        417: {
          'alpha-code': 'KGS',
          symbol: 'Kgs',
          html: 'Kgs'
        },
        // Kip
        418: {
          'alpha-code': 'LAK',
          symbol: '\u20AD',
          html: 'Lak'
        },
        // Lebanese Pound
        422: {
          'alpha-code': 'LBP',
          symbol: 'Lbp',
          html: 'Lbp'
        },
        // LESOTHO LOTI
        426: {
          'alpha-code': 'LSL',
          symbol: 'Lsl',
          html: 'Lsl'
        },
        // Liberian Dollar
        430: {
          'alpha-code': 'LRD',
          symbol: 'Lrd',
          html: 'Lrd'
        },
        // Libyan Dinar
        434: {
          'alpha-code': 'LYD',
          symbol: 'Lyd',
          html: 'Lyd'
        },
        // Lithuanian Litas
        440: {
          'alpha-code': 'LTL',
          symbol: 'Ltl',
          html: 'Ltl'
        },
        // Pataca
        446: {
          'alpha-code': 'MOP',
          symbol: 'Mop',
          html: 'Mop'
        },
        // Kwacha
        454: {
          'alpha-code': 'MWK',
          symbol: 'Mwk',
          html: 'Mwk'
        },
        // Malaysian Ringgit
        458: {
          'alpha-code': 'MYR',
          symbol: 'Myr',
          html: 'Myr'
        },
        // Rufiyaa
        462: {
          'alpha-code': 'MVR',
          symbol: 'Mvr',
          html: 'Mvr'
        },
        // Ouguiya
        478: {
          'alpha-code': 'MRO',
          symbol: 'Mro',
          html: 'Mro'
        },
        // Mauritius Rupee
        480: {
          'alpha-code': 'MUR',
          symbol: 'Mur',
          html: 'Mur'
        },
        // Mexican Peso
        484: {
          'alpha-code': 'MXN',
          symbol: 'Mxn',
          html: 'Mxn'
        },
        // Tugrik
        496: {
          'alpha-code': 'MNT',
          symbol: '\u20AE',
          html: 'Mnt'
        },
        // Moldovan Leu
        498: {
          'alpha-code': 'MDL',
          symbol: 'Mdl',
          html: 'Mdl'
        },
        // Moroccan Dirham
        504: {
          'alpha-code': 'MAD',
          symbol: 'Mad',
          html: 'Mad'
        },
        // Rial Omani
        512: {
          'alpha-code': 'OMR',
          symbol: 'Omr',
          html: 'Omr'
        },
        // Namibia Dollar
        516: {
          'alpha-code': 'NAD',
          symbol: 'Nad',
          html: 'Nad'
        },
        // Nepalese Rupee
        524: {
          'alpha-code': 'NPR',
          symbol: 'Npr',
          html: 'Npr'
        },
        // Antillian Guilder
        532: {
          'alpha-code': 'ANG',
          symbol: '\u0192',
          html: 'Ang'
        },
        // Aruban Guilder
        533: {
          'alpha-code': 'AWG',
          symbol: 'Awg',
          html: 'Awg'
        },
        // Vatu
        548: {
          'alpha-code': 'VUV',
          symbol: 'Vuv',
          html: 'Vuv'
        },
        // New Zealand Dollar
        554: {
          'alpha-code': 'NZD',
          symbol: 'Nzd',
          html: 'Nzd'
        },
        // Cordoba Oro
        558: {
          'alpha-code': 'NIO',
          symbol: 'Nio',
          html: 'Nio'
        },
        // Naira
        566: {
          'alpha-code': 'NGN',
          symbol: '\u20A6',
          html: 'Ngn'
        },
        // Norwegian Krone
        578: {
          'alpha-code': 'NOK',
          symbol: 'Nok',
          html: 'Nok'
        },
        // Pakistan Rupee
        586: {
          'alpha-code': 'PKR',
          symbol: 'Pkr',
          html: 'Pkr'
        },
        // Balboa
        590: {
          'alpha-code': 'PAB',
          symbol: 'Pab',
          html: 'Pab'
        },
        // Kina
        598: {
          'alpha-code': 'PGK',
          symbol: 'Pgk',
          html: 'Pgk'
        },
        // Guarani
        600: {
          'alpha-code': 'PYG',
          symbol: '\u20B2',
          html: 'Pyg'
        },
        // Nuevo Sol
        604: {
          'alpha-code': 'PEN',
          symbol: 'Pen',
          html: 'Pen'
        },
        // Philippine Peso
        608: {
          'alpha-code': 'PHP',
          symbol: '\u20B1',
          html: 'Php'
        },
        // Qatari Rial
        634: {
          'alpha-code': 'QAR',
          symbol: 'Qar',
          html: 'Qar'
        },
        // Rwanda Franc
        646: {
          'alpha-code': 'RWF',
          symbol: 'Rwf',
          html: 'Rwf'
        },
        // St Helena Pound
        654: {
          'alpha-code': 'SHP',
          symbol: 'Shp',
          html: 'Shp'
        },
        // Dobra
        678: {
          'alpha-code': 'STD',
          symbol: 'Std',
          html: 'Std'
        },
        // Saudi Riyal
        682: {
          'alpha-code': 'SAR',
          symbol: 'Sar',
          html: 'Sar'
        },
        // Seychelles Rupee
        690: {
          'alpha-code': 'SCR',
          symbol: 'Scr',
          html: 'Scr'
        },
        // Leone
        694: {
          'alpha-code': 'SLL',
          symbol: 'Sll',
          html: 'Sll'
        },
        // Singapore Dollar
        702: {
          'alpha-code': 'SGD',
          symbol: 'Sgd',
          html: 'Sgd'
        },
        // Vietnamese Dong
        704: {
          'alpha-code': 'VND',
          symbol: '\u20AB',
          html: 'Vnd'
        },
        // Somali Shilling
        706: {
          'alpha-code': 'SOS',
          symbol: 'Sos',
          html: 'Sos'
        },
        // South African rand
        710: {
          'alpha-code': 'ZAR',
          symbol: 'Zar',
          html: 'Zar'
        },
        // South Sudanese Pound
        728: {
          'alpha-code': 'SSP',
          symbol: 'Ssp',
          html: 'Ssp'
        },
        // Lilangeni
        748: {
          'alpha-code': 'SZL',
          symbol: 'Szl',
          html: 'Szl'
        },
        // Swedish Krona
        752: {
          'alpha-code': 'SEK',
          symbol: 'Sek',
          html: 'Sek'
        },
        // Swiss Franc
        756: {
          'alpha-code': 'CHF',
          symbol: '₣',
          html: '₣'
        },
        // Baht
        764: {
          'alpha-code': 'THB',
          symbol: '\u0E3F',
          html: 'Thb'
        },
        // Pa'anga
        776: {
          'alpha-code': 'TOP',
          symbol: 'Top',
          html: 'Top'
        },
        // Trinidad and Tobago Dollar
        780: {
          'alpha-code': 'TTD',
          symbol: 'Ttd',
          html: 'Ttd'
        },
        // UAE Dirham
        784: {
          'alpha-code': 'AED',
          symbol: 'Aed',
          html: 'Aed'
        },
        // Tunisian Dinar
        788: {
          'alpha-code': 'TND',
          symbol: 'Tnd',
          html: 'Tnd'
        },
        // Uganda Shilling
        800: {
          'alpha-code': 'UGX',
          symbol: 'Ugx',
          html: 'Ugx'
        },
        // Denar
        807: {
          'alpha-code': 'MKD',
          symbol: 'Mkd',
          html: 'Mkd'
        },
        // Egyptian Pound
        818: {
          'alpha-code': 'EGP',
          symbol: 'Egp',
          html: 'Egp'
        },
        // Pound Sterling
        826: {
          'alpha-code': 'GBP',
          symbol: "\xA3",
          html: 'Gbp'
        },
        // Tanzanian Shilling
        834: {
          'alpha-code': 'TZS',
          symbol: 'Tzs',
          html: 'Tzs'
        },
        // Peso Uruguayo
        858: {
          'alpha-code': 'UYU',
          symbol: 'Uyu',
          html: 'Uyu'
        },
        // Uzbekistan Sum
        860: {
          'alpha-code': 'UZS',
          symbol: 'Uzs',
          html: 'Uzs'
        },
        // Tala
        882: {
          'alpha-code': 'WST',
          symbol: 'Wst',
          html: 'Wst'
        },
        // Yemeni Rial
        886: {
          'alpha-code': 'YER',
          symbol: 'Yer',
          html: 'Yer'
        },
        // New Taiwan Dollar
        901: {
          'alpha-code': 'TWD',
          symbol: 'Twd',
          html: 'Twd'
        },
        // Turkmenistan Manat
        934: {
          'alpha-code': 'TMT',
          symbol: 'Tmt',
          html: 'Tmt'
        },
        // Cedi
        936: {
          'alpha-code': 'GHS',
          symbol: '\u20B5',
          html: 'Ghs'
        },
        // Bolivar Fuerte
        937: {
          'alpha-code': 'VEF',
          symbol: 'Vef',
          html: 'Vef'
        },
        // Serbian Dinar
        941: {
          'alpha-code': 'RSD',
          symbol: 'Rsd',
          html: 'Rsd'
        },
        // Mozambique Metical
        943: {
          'alpha-code': 'MZN',
          symbol: 'Mzn',
          html: 'Mzn'
        },
        // Azerbaijanian Manat
        944: {
          'alpha-code': 'AZN',
          symbol: 'Azn',
          html: 'Azn'
        },
        // Romanian Lei
        946: {
          'alpha-code': 'RON',
          symbol: 'Ron',
          html: 'Ron'
        },
        // New Turkish Lira
        949: {
          'alpha-code': 'TRY',
          symbol: '\u20BA',
          html: 'Try'
        },
        // CFA Franc BEAC
        950: {
          'alpha-code': 'XAF',
          symbol: 'Xaf',
          html: 'Xaf'
        },
        // East Caribbean Dollar
        951: {
          'alpha-code': 'XCD',
          symbol: 'Xcd',
          html: 'Xcd'
        },
        // CFA Franc BCEAO
        952: {
          'alpha-code': 'XOF',
          symbol: 'Xof',
          html: 'Xof'
        },
        // CFP Franc
        953: {
          'alpha-code': 'XPF',
          symbol: 'Xpf',
          html: 'Xpf'
        },
        // Zambian Kwacha
        967: {
          'alpha-code': 'ZMW',
          symbol: 'Zmw',
          html: 'Zmw'
        },
        // Suriname Dollar
        968: {
          'alpha-code': 'SRD',
          symbol: 'Srd',
          html: 'Srd'
        },
        // Madagascar Ariary
        969: {
          'alpha-code': 'MGA',
          symbol: 'Mga',
          html: 'Mga'
        },
        // New Afghanistan Afghani
        971: {
          'alpha-code': 'AFN',
          symbol: '\u060B',
          html: 'Afn'
        },
        // Somoni
        972: {
          'alpha-code': 'TJS',
          symbol: 'Tjs',
          html: 'Tjs'
        },
        // Kwanza
        973: {
          'alpha-code': 'AOA',
          symbol: 'Aoa',
          html: 'Aoa'
        },
        // Bulgarian LEV
        975: {
          'alpha-code': 'BGN',
          symbol: 'Bgn',
          html: 'Bgn'
        },
        // Congolese Franc
        976: {
          'alpha-code': 'CDF',
          symbol: 'Cdf',
          html: 'Cdf'
        },
        // Convertible Marks
        977: {
          'alpha-code': 'BAM',
          symbol: 'Bam',
          html: 'Bam'
        },
        // Lari
        981: {
          'alpha-code': 'GEL',
          symbol: 'Gel',
          html: 'Gel'
        },
        // Zloty
        985: {
          'alpha-code': 'PLN',
          symbol: 'zł',
          html: 'zł'
        },
        // Brazilian Real
        986: {
          'alpha-code': 'BRL',
          symbol: 'Brl',
          html: 'Brl'
        }
      };
    }, {}], 2: [function (require, module, exports) {
      "use strict";

      module.exports = {
        // Российский рубль
        643: {
          ru: 'Рубль',
          ruPlural: 'Рубли',
          en: 'Rouble',
          enPlural: 'Roubles'
        },
        // На демо, код рубля другой
        // @todo возможно не должно быть логики окружения
        10643: {
          ru: 'Рубль',
          ruPlural: 'Рубли',
          en: 'Rouble',
          enPlural: 'Roubles'
        },
        // Доллар США
        840: {
          ru: 'Доллар США',
          ruPlural: 'Доллары США',
          en: 'Dollar',
          enPlural: 'Dollars'
        },
        // Евро
        978: {
          ru: 'Евро',
          ruPlural: 'Евро',
          en: 'Euro',
          enPlural: 'Euro'
        },
        // Белорусский рубль
        933: {
          ru: 'Белорусский рубль',
          ruPlural: 'Белорусские рубли',
          en: 'Belarusian ruble',
          enPlural: 'Belarusian rubles'
        },
        // Казахстанский тенге
        398: {
          ru: 'Тенге',
          ruPlural: 'Тенге',
          en: 'Tenge',
          enPlural: 'Tenge'
        },
        // Фунт стерлингов
        826: {
          ru: 'Фунт стерлингов',
          ruPlural: 'Фунты стерлингов',
          en: 'Pound sterling',
          enPlural: 'Pounds sterling'
        },
        // Юань
        156: {
          ru: 'Китайский юань',
          ruPlural: 'Китайские юани',
          en: 'Renminbi',
          enPlural: 'Renminbi'
        },
        // Швейцарский франк
        756: {
          ru: 'Швейцарский франк',
          ruPlural: 'Швейцарские франки',
          en: 'Swiss franc',
          enPlural: 'Swiss francs'
        },
        // Чешская крона
        203: {
          ru: 'Чешская крона',
          ruPlural: 'Чешские кроны',
          en: 'Czech koruna',
          enPlural: 'Czech korun'
        },
        // Канадский доллар
        124: {
          ru: 'Канадский доллар',
          ruPlural: 'Канадские доллары',
          en: 'Canadian dollar',
          enPlural: 'Canadian dollars'
        },
        // Польский злотый
        985: {
          ru: 'Польский злотый',
          ruPlural: 'Польские злотые',
          en: 'Polish zloty',
          enPlural: 'Polish zloty'
        },
        392: {
          ru: 'Японская иена',
          ruPlural: 'Японские иены',
          en: 'Japanese yen',
          enPlural: 'Japanese yen'
        }
      };
    }, {}], 3: [function (require, module, exports) {
      "use strict";

      module.exports = {
        // Российский рубль
        RUB: '643',
        // Доллар США
        USD: '840',
        // Евро
        EUR: '978',
        // Казахстанский тенге
        KZT: '398',
        // Белорусский рубль
        BYR: '974',
        // Белорусский рубль (после деноминации 01.07.2016)
        BYN: '933',
        // Украинская гривна
        UAH: '980',
        // Algerian Dinar
        DZD: '012',
        // Argentine Peso
        ARS: '032',
        // Australian Dollar
        AUD: '036',
        // Bahamian Dollar
        BSD: '044',
        // Bahraini Dinar
        BHD: '048',
        // Taka
        BDT: '050',
        // Armenian Dram
        AMD: '051',
        // Barbados Dollar
        BBD: '052',
        // Bermudian Dollar
        BMD: '060',
        // Bhutan ngultrum
        BTN: '064',
        // Boliviano
        BOB: '068',
        // Pula
        BWP: '072',
        // Belize Dollar
        BZD: '084',
        // Solomon Islands Dollar
        SBD: '090',
        // Brunei Dollar
        BND: '096',
        // Kyat
        MMK: '104',
        // Burundi Franc
        BIF: '108',
        // Riel
        KHR: '116',
        // Canadian Dollar
        CAD: '124',
        // Cape Verde Escudo
        CVE: '132',
        // Cayman Islands Dollar
        KYD: '136',
        // Sri Lanka Rupee
        LKR: '144',
        // Chilean Peso
        CLP: '152',
        // Yuan Renminbi
        CNY: '156',
        // Chinese Renminbi
        CNH: '157',
        // CHINESE RENMINBI
        CNX: '158',
        // Colombian Peso
        COP: '170',
        // Comoro Franc
        KMF: '174',
        // Costa Rican Colon
        CRC: '188',
        // Kuna
        HRK: '191',
        // Cuban Peso
        CUP: '192',
        // Czech Koruna
        CZK: '203',
        // Danish Krone
        DKK: '208',
        // Dominican Peso
        DOP: '214',
        // El Salvador Colon
        SVC: '222',
        // Ethiopian Birr
        ETB: '230',
        // Pound
        FKP: '238',
        // Fiji Dollar
        FJD: '242',
        // Djibouti Franc
        DJF: '262',
        // Dalasi
        GMD: '270',
        // Gibraltar Pound
        GIP: '292',
        // Quetzal
        GTQ: '320',
        // Guinea Franc
        GNF: '324',
        // Guyana Dollar
        GYD: '328',
        // Gourde
        HTG: '332',
        // Lempira
        HNL: '340',
        // Hong Kong Dollar
        HKD: '344',
        // Forint
        HUF: '348',
        // Iceland Krona
        ISK: '352',
        // Indian Rupee
        INR: '356',
        // Rupiah
        IDR: '360',
        // Iraqi Dinar
        IQD: '368',
        // New Israeli Sheqel
        ILS: '376',
        // Jamaican Dollar
        JMD: '388',
        // Yen
        JPY: '392',
        // Jordanian Dinar
        JOD: '400',
        // Kenyan Shilling
        KES: '404',
        // Won
        KRW: '410',
        // Kuwaiti Dinar
        KWD: '414',
        // Som
        KGS: '417',
        // Kip
        LAK: '418',
        // Lebanese Pound
        LBP: '422',
        // LESOTHO LOTI
        LSL: '426',
        // Liberian Dollar
        LRD: '430',
        // Libyan Dinar
        LYD: '434',
        // Lithuanian Litas
        LTL: '440',
        // Pataca
        MOP: '446',
        // Kwacha
        MWK: '454',
        // Malaysian Ringgit
        MYR: '458',
        // Rufiyaa
        MVR: '462',
        // Ouguiya
        MRO: '478',
        // Mauritius Rupee
        MUR: '480',
        // Mexican Peso
        MXN: '484',
        // Tugrik
        MNT: '496',
        // Moldovan Leu
        MDL: '498',
        // Moroccan Dirham
        MAD: '504',
        // Rial Omani
        OMR: '512',
        // Namibia Dollar
        NAD: '516',
        // Nepalese Rupee
        NPR: '524',
        // Antillian Guilder
        ANG: '532',
        // Aruban Guilder
        AWG: '533',
        // Vatu
        VUV: '548',
        // New Zealand Dollar
        NZD: '554',
        // Cordoba Oro
        NIO: '558',
        // Naira
        NGN: '566',
        // Norwegian Krone
        NOK: '578',
        // Pakistan Rupee
        PKR: '586',
        // Balboa
        PAB: '590',
        // Kina
        PGK: '598',
        // Guarani
        PYG: '600',
        // Nuevo Sol
        PEN: '604',
        // Philippine Peso
        PHP: '608',
        // Qatari Rial
        QAR: '634',
        // Rwanda Franc
        RWF: '646',
        // St Helena Pound
        SHP: '654',
        // Dobra
        STD: '678',
        // Saudi Riyal
        SAR: '682',
        // Seychelles Rupee
        SCR: '690',
        // Leone
        SLL: '694',
        // Singapore Dollar
        SGD: '702',
        // Vietnamese Dong
        VND: '704',
        // Somali Shilling
        SOS: '706',
        // South African rand
        ZAR: '710',
        // South Sudanese Pound
        SSP: '728',
        // Lilangeni
        SZL: '748',
        // Swedish Krona
        SEK: '752',
        // Swiss Franc
        CHF: '756',
        // Baht
        THB: '764',
        // Pa'anga
        TOP: '776',
        // Trinidad and Tobago Dollar
        TTD: '780',
        // UAE Dirham
        AED: '784',
        // Tunisian Dinar
        TND: '788',
        // Uganda Shilling
        UGX: '800',
        // Denar
        MKD: '807',
        // Egyptian Pound
        EGP: '818',
        // Pound Sterling
        GBP: '826',
        // Tanzanian Shilling
        TZS: '834',
        // Peso Uruguayo
        UYU: '858',
        // Uzbekistan Sum
        UZS: '860',
        // Tala
        WST: '882',
        // Yemeni Rial
        YER: '886',
        // New Taiwan Dollar
        TWD: '901',
        // Turkmenistan Manat
        TMT: '934',
        // Cedi
        GHS: '936',
        // Bolivar Fuerte
        VEF: '937',
        // Serbian Dinar
        RSD: '941',
        // Mozambique Metical
        MZN: '943',
        // Azerbaijanian Manat
        AZN: '944',
        // Romanian Lei
        RON: '946',
        // New Turkish Lira
        TRY: '949',
        // CFA Franc BEAC
        XAF: '950',
        // East Caribbean Dollar
        XCD: '951',
        // CFA Franc BCEAO
        XOF: '952',
        // CFP Franc
        XPF: '953',
        // Zambian Kwacha
        ZMW: '967',
        // Suriname Dollar
        SRD: '968',
        // Madagascar Ariary
        MGA: '969',
        // New Afghanistan Afghani
        AFN: '971',
        // Somoni
        TJS: '972',
        // Kwanza
        AOA: '973',
        // Bulgarian LEV
        BGN: '975',
        // Congolese Franc
        CDF: '976',
        // Convertible Marks
        BAM: '977',
        // Lari
        GEL: '981',
        // Zloty
        PLN: '985',
        // Brazilian Real
        BRL: '986'
      };
    }, {}], "@yoomoney/currency-info": [function (require, module, exports) {
      "use strict";

      var currenciesInfoByNumber = require('./currenciesInfoByNumber');

      var currenciesNamesByNumber = require('./currenciesNamesByNumber');

      var numericCodesByAlphaCode = require('./numericCodesByAlphaCode');

      var CURRENCY_CODE_TYPES = {
        numericCode: 'numeric',
        alphaCode: 'alpha'
      };
      var RUB_NUMERIC_CODE = '643';
      /**
       * Конструктор объекта информации о валюте
       *
       * @param {Object} [options] Параметры вызова
       * @param {String} [options.code='643'] Код валюты
       * @param {String} [options.codeType='numeric'] Тип кода (numeric или alpha)
       *
       * @constructor
       */

      function Currency(options) {
        if (!options) {
          throw new Error('options is required');
        }

        var _options$code = options.code,
            code = _options$code === void 0 ? RUB_NUMERIC_CODE : _options$code,
            _options$codeType = options.codeType,
            codeType = _options$codeType === void 0 ? CURRENCY_CODE_TYPES.numericCode : _options$codeType;
        /**
         * Цифровой код валюты согласно ISO-4217
         * @type {string}
         */

        this.numericCode = codeType === CURRENCY_CODE_TYPES.alphaCode ? numericCodesByAlphaCode[code] : code;
        /**
         * Свойства текущей валюты
         * @type {object}
         */

        this._currencyProperties = currenciesInfoByNumber[this.numericCode] || {};
        /**
         * Имя валюты на разных языках
         * @type {object}
         */

        this._names = currenciesNamesByNumber[this.numericCode] || {};
      }

      Currency.prototype = {
        /**
         * Буквенный код валюты согласно ISO-4217
         * @returns {string}
         */
        getAlphaCode: function getAlphaCode() {
          return this._currencyProperties['alpha-code'] || '';
        },

        /**
         * Символ (знак) валюты
         * @returns {string}
         */
        getSymbol: function getSymbol() {
          return this._currencyProperties.symbol || '';
        },

        /**
         * Html-представление символа валюты
         * @returns {string}
         */
        getHtml: function getHtml() {
          return this._currencyProperties.html || '';
        },

        /**
         * Приводит первую букву названия валюты к нижнему регистру
         * @param {String} currency Название валюты
         * @returns {String}
         */
        _firstLetterToLowerCase: function _firstLetterToLowerCase(currency) {
          return currency.substr(0, 1).toLowerCase() + currency.substr(1);
        },

        /**
         * Имя валюты на русском языке
         * @param {Boolean} isPlural Требуется ли множественное число
         * @returns {string}
         */
        getRussianName: function getRussianName() {
          var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
              _ref$isPlural = _ref.isPlural,
              isPlural = _ref$isPlural === void 0 ? false : _ref$isPlural,
              _ref$firstLetterLower = _ref.firstLetterLowerCase,
              firstLetterLowerCase = _ref$firstLetterLower === void 0 ? false : _ref$firstLetterLower;

          var key = isPlural ? 'ruPlural' : 'ru';
          var name = this._names[key] || '';
          return firstLetterLowerCase ? this._firstLetterToLowerCase(name) : name;
        },

        /**
         * Имя валюты на английском языке
         * @param {Boolean} isPlural Требуется ли множественное число
         * @returns {string}
         */
        getEnglishName: function getEnglishName() {
          var _ref2 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
              _ref2$isPlural = _ref2.isPlural,
              isPlural = _ref2$isPlural === void 0 ? false : _ref2$isPlural,
              _ref2$firstLetterLowe = _ref2.firstLetterLowerCase,
              firstLetterLowerCase = _ref2$firstLetterLowe === void 0 ? false : _ref2$firstLetterLowe;

          var key = isPlural ? 'enPlural' : 'en';
          var name = this._names[key] || '';
          return firstLetterLowerCase ? this._firstLetterToLowerCase(name) : name;
        },

        /**
         * Получаем цифровой код валюты согласно ISO-4217
         * @returns {string}
         */
        getNumericCode: function getNumericCode() {
          return this.numericCode;
        }
      };
      module.exports = Currency;
    }, { "./currenciesInfoByNumber": 1, "./currenciesNamesByNumber": 2, "./numericCodesByAlphaCode": 3 }] }, {}, []);

  var defineAsGlobal = true;

  // Provide with CommonJS
  if ((typeof module === 'undefined' ? 'undefined' : _typeof(module)) === 'object' && _typeof(module.exports) === 'object') {
    exports['BEMHTML'] = buildBemXjst({

      yandexMoneyCurrencyInfo: require('@yoomoney/currency-info')

    });
    defineAsGlobal = false;
  }

  // Provide to YModules
  if ((typeof modules === 'undefined' ? 'undefined' : _typeof(modules)) === 'object') {
    modules.define('BEMHTML', [], function (provide) {
      provide(buildBemXjst({

        yandexMoneyCurrencyInfo: require('@yoomoney/currency-info')

      }));
    });

    defineAsGlobal = false;
  }

  // Provide to global scope
  if (defineAsGlobal) {
    BEMHTML = buildBemXjst({

      yandexMoneyCurrencyInfo: require('@yoomoney/currency-info')

    });
    global['BEMHTML'] = BEMHTML;
  }
})(typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : this);