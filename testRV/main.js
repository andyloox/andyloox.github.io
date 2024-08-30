!function () {
    var t = {
        3984: function (t, e) {
            var n, r, o, i;

            function a(t) {
                return a = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (t) {
                    return typeof t
                } : function (t) {
                    return t && "function" == typeof Symbol && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t
                }, a(t)
            }

            i = function () {
                var t = {};
                Object.defineProperty(t, "__esModule", {value: !0}), t.default = void 0, t.default = function (t) {
                    return !(!t || !t.Window) && t instanceof t.Window
                };
                var e = {};
                Object.defineProperty(e, "__esModule", {value: !0}), e.getWindow = function (e) {
                    return (0, t.default)(e) ? e : (e.ownerDocument || e).defaultView || r.window
                }, e.init = o, e.window = e.realWindow = void 0;
                var n = void 0;
                e.realWindow = n;
                var r = void 0;

                function o(t) {
                    e.realWindow = n = t;
                    var o = t.document.createTextNode("");
                    o.ownerDocument !== t.document && "function" == typeof t.wrap && t.wrap(o) === o && (t = t.wrap(t)), e.window = r = t
                }

                e.window = r, "undefined" != typeof window && window && o(window);
                var i = {};

                function s(t) {
                    return s = "function" == typeof Symbol && "symbol" == a(Symbol.iterator) ? function (t) {
                        return a(t)
                    } : function (t) {
                        return t && "function" == typeof Symbol && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : a(t)
                    }, s(t)
                }

                Object.defineProperty(i, "__esModule", {value: !0}), i.default = void 0;
                var l = function (t) {
                    return !!t && "object" === s(t)
                }, c = function (t) {
                    return "function" == typeof t
                }, u = {
                    window: function (n) {
                        return n === e.window || (0, t.default)(n)
                    }, docFrag: function (t) {
                        return l(t) && 11 === t.nodeType
                    }, object: l, func: c, number: function (t) {
                        return "number" == typeof t
                    }, bool: function (t) {
                        return "boolean" == typeof t
                    }, string: function (t) {
                        return "string" == typeof t
                    }, element: function (t) {
                        if (!t || "object" !== s(t)) return !1;
                        var n = e.getWindow(t) || e.window;
                        return /object|function/.test("undefined" == typeof Element ? "undefined" : s(Element)) ? t instanceof Element || t instanceof n.Element : 1 === t.nodeType && "string" == typeof t.nodeName
                    }, plainObject: function (t) {
                        return l(t) && !!t.constructor && /function Object\b/.test(t.constructor.toString())
                    }, array: function (t) {
                        return l(t) && void 0 !== t.length && c(t.splice)
                    }
                };
                i.default = u;
                var d = {};

                function f(t) {
                    var e = t.interaction;
                    if ("drag" === e.prepared.name) {
                        var n = e.prepared.axis;
                        "x" === n ? (e.coords.cur.page.y = e.coords.start.page.y, e.coords.cur.client.y = e.coords.start.client.y, e.coords.velocity.client.y = 0, e.coords.velocity.page.y = 0) : "y" === n && (e.coords.cur.page.x = e.coords.start.page.x, e.coords.cur.client.x = e.coords.start.client.x, e.coords.velocity.client.x = 0, e.coords.velocity.page.x = 0)
                    }
                }

                function p(t) {
                    var e = t.iEvent, n = t.interaction;
                    if ("drag" === n.prepared.name) {
                        var r = n.prepared.axis;
                        if ("x" === r || "y" === r) {
                            var o = "x" === r ? "y" : "x";
                            e.page[o] = n.coords.start.page[o], e.client[o] = n.coords.start.client[o], e.delta[o] = 0
                        }
                    }
                }

                Object.defineProperty(d, "__esModule", {value: !0}), d.default = void 0;
                var v = {
                    id: "actions/drag",
                    install: function (t) {
                        var e = t.actions, n = t.Interactable, r = t.defaults;
                        n.prototype.draggable = v.draggable, e.map.drag = v, e.methodDict.drag = "draggable", r.actions.drag = v.defaults
                    },
                    listeners: {
                        "interactions:before-action-move": f,
                        "interactions:action-resume": f,
                        "interactions:action-move": p,
                        "auto-start:check": function (t) {
                            var e = t.interaction, n = t.interactable, r = t.buttons, o = n.options.drag;
                            if (o && o.enabled && (!e.pointerIsDown || !/mouse|pointer/.test(e.pointerType) || 0 != (r & n.options.drag.mouseButtons))) return t.action = {
                                name: "drag",
                                axis: "start" === o.lockAxis ? o.startAxis : o.lockAxis
                            }, !1
                        }
                    },
                    draggable: function (t) {
                        return i.default.object(t) ? (this.options.drag.enabled = !1 !== t.enabled, this.setPerAction("drag", t), this.setOnEvents("drag", t), /^(xy|x|y|start)$/.test(t.lockAxis) && (this.options.drag.lockAxis = t.lockAxis), /^(xy|x|y)$/.test(t.startAxis) && (this.options.drag.startAxis = t.startAxis), this) : i.default.bool(t) ? (this.options.drag.enabled = t, this) : this.options.drag
                    },
                    beforeMove: f,
                    move: p,
                    defaults: {startAxis: "xy", lockAxis: "xy"},
                    getCursor: function () {
                        return "move"
                    }
                }, h = v;
                d.default = h;
                var g = {};
                Object.defineProperty(g, "__esModule", {value: !0}), g.default = void 0;
                var y = {
                    init: function (t) {
                        var e = t;
                        y.document = e.document, y.DocumentFragment = e.DocumentFragment || m, y.SVGElement = e.SVGElement || m, y.SVGSVGElement = e.SVGSVGElement || m, y.SVGElementInstance = e.SVGElementInstance || m, y.Element = e.Element || m, y.HTMLElement = e.HTMLElement || y.Element, y.Event = e.Event, y.Touch = e.Touch || m, y.PointerEvent = e.PointerEvent || e.MSPointerEvent
                    },
                    document: null,
                    DocumentFragment: null,
                    SVGElement: null,
                    SVGSVGElement: null,
                    SVGElementInstance: null,
                    Element: null,
                    HTMLElement: null,
                    Event: null,
                    Touch: null,
                    PointerEvent: null
                };

                function m() {
                }

                var b = y;
                g.default = b;
                var x = {};
                Object.defineProperty(x, "__esModule", {value: !0}), x.default = void 0;
                var w = {
                    init: function (t) {
                        var e = g.default.Element, n = t.navigator || {};
                        w.supportsTouch = "ontouchstart" in t || i.default.func(t.DocumentTouch) && g.default.document instanceof t.DocumentTouch, w.supportsPointerEvent = !1 !== n.pointerEnabled && !!g.default.PointerEvent, w.isIOS = /iP(hone|od|ad)/.test(n.platform), w.isIOS7 = /iP(hone|od|ad)/.test(n.platform) && /OS 7[^\d]/.test(n.appVersion), w.isIe9 = /MSIE 9/.test(n.userAgent), w.isOperaMobile = "Opera" === n.appName && w.supportsTouch && /Presto/.test(n.userAgent), w.prefixedMatchesSelector = "matches" in e.prototype ? "matches" : "webkitMatchesSelector" in e.prototype ? "webkitMatchesSelector" : "mozMatchesSelector" in e.prototype ? "mozMatchesSelector" : "oMatchesSelector" in e.prototype ? "oMatchesSelector" : "msMatchesSelector", w.pEventTypes = w.supportsPointerEvent ? g.default.PointerEvent === t.MSPointerEvent ? {
                            up: "MSPointerUp",
                            down: "MSPointerDown",
                            over: "mouseover",
                            out: "mouseout",
                            move: "MSPointerMove",
                            cancel: "MSPointerCancel"
                        } : {
                            up: "pointerup",
                            down: "pointerdown",
                            over: "pointerover",
                            out: "pointerout",
                            move: "pointermove",
                            cancel: "pointercancel"
                        } : null, w.wheelEvent = g.default.document && "onmousewheel" in g.default.document ? "mousewheel" : "wheel"
                    },
                    supportsTouch: null,
                    supportsPointerEvent: null,
                    isIOS7: null,
                    isIOS: null,
                    isIe9: null,
                    isOperaMobile: null,
                    prefixedMatchesSelector: null,
                    pEventTypes: null,
                    wheelEvent: null
                }, _ = w;
                x.default = _;
                var P = {};

                function O(t) {
                    var e = t.parentNode;
                    if (i.default.docFrag(e)) {
                        for (; (e = e.host) && i.default.docFrag(e);) ;
                        return e
                    }
                    return e
                }

                function E(t, n) {
                    return e.window !== e.realWindow && (n = n.replace(/\/deep\//g, " ")), t[x.default.prefixedMatchesSelector](n)
                }

                Object.defineProperty(P, "__esModule", {value: !0}), P.closest = function (t, e) {
                    for (; i.default.element(t);) {
                        if (E(t, e)) return t;
                        t = O(t)
                    }
                    return null
                }, P.getActualElement = function (t) {
                    return t.correspondingUseElement || t
                }, P.getElementClientRect = M, P.getElementRect = function (t) {
                    var n = M(t);
                    if (!x.default.isIOS7 && n) {
                        var r = j(e.getWindow(t));
                        n.left += r.x, n.right += r.x, n.top += r.y, n.bottom += r.y
                    }
                    return n
                }, P.getPath = function (t) {
                    for (var e = []; t;) e.push(t), t = O(t);
                    return e
                }, P.getScrollXY = j, P.indexOfDeepestElement = function (t) {
                    for (var n, r = [], o = 0; o < t.length; o++) {
                        var i = t[o], a = t[n];
                        if (i && o !== n) if (a) {
                            var s = S(i), l = S(a);
                            if (s !== i.ownerDocument) if (l !== i.ownerDocument) if (s !== l) {
                                r = r.length ? r : T(a);
                                var c = void 0;
                                if (a instanceof g.default.HTMLElement && i instanceof g.default.SVGElement && !(i instanceof g.default.SVGSVGElement)) {
                                    if (i === l) continue;
                                    c = i.ownerSVGElement
                                } else c = i;
                                for (var u = T(c, a.ownerDocument), d = 0; u[d] && u[d] === r[d];) d++;
                                var f = [u[d - 1], u[d], r[d]];
                                if (f[0]) for (var p = f[0].lastChild; p;) {
                                    if (p === f[1]) {
                                        n = o, r = u;
                                        break
                                    }
                                    if (p === f[2]) break;
                                    p = p.previousSibling
                                }
                            } else v = i, h = a, (parseInt(e.getWindow(v).getComputedStyle(v).zIndex, 10) || 0) >= (parseInt(e.getWindow(h).getComputedStyle(h).zIndex, 10) || 0) && (n = o); else n = o
                        } else n = o
                    }
                    var v, h;
                    return n
                }, P.matchesSelector = E, P.matchesUpTo = function (t, e, n) {
                    for (; i.default.element(t);) {
                        if (E(t, e)) return !0;
                        if ((t = O(t)) === n) return E(t, e)
                    }
                    return !1
                }, P.nodeContains = function (t, e) {
                    if (t.contains) return t.contains(e);
                    for (; e;) {
                        if (e === t) return !0;
                        e = e.parentNode
                    }
                    return !1
                }, P.parentNode = O, P.trySelector = function (t) {
                    return !!i.default.string(t) && (g.default.document.querySelector(t), !0)
                };
                var S = function (t) {
                    return t.parentNode || t.host
                };

                function T(t, e) {
                    for (var n, r = [], o = t; (n = S(o)) && o !== e && n !== o.ownerDocument;) r.unshift(o), o = n;
                    return r
                }

                function j(t) {
                    return {
                        x: (t = t || e.window).scrollX || t.document.documentElement.scrollLeft,
                        y: t.scrollY || t.document.documentElement.scrollTop
                    }
                }

                function M(t) {
                    var e = t instanceof g.default.SVGElement ? t.getBoundingClientRect() : t.getClientRects()[0];
                    return e && {
                        left: e.left,
                        right: e.right,
                        top: e.top,
                        bottom: e.bottom,
                        width: e.width || e.right - e.left,
                        height: e.height || e.bottom - e.top
                    }
                }

                var k = {};
                Object.defineProperty(k, "__esModule", {value: !0}), k.default = function (t, e) {
                    for (var n in e) t[n] = e[n];
                    return t
                };
                var I = {};

                function A(t, e) {
                    (null == e || e > t.length) && (e = t.length);
                    for (var n = 0, r = Array(e); n < e; n++) r[n] = t[n];
                    return r
                }

                function D(t, e, n) {
                    return "parent" === t ? (0, P.parentNode)(n) : "self" === t ? e.getRect(n) : (0, P.closest)(n, t)
                }

                Object.defineProperty(I, "__esModule", {value: !0}), I.addEdges = function (t, e, n) {
                    t.left && (e.left += n.x), t.right && (e.right += n.x), t.top && (e.top += n.y), t.bottom && (e.bottom += n.y), e.width = e.right - e.left, e.height = e.bottom - e.top
                }, I.getStringOptionResult = D, I.rectToXY = function (t) {
                    return t && {x: "x" in t ? t.x : t.left, y: "y" in t ? t.y : t.top}
                }, I.resolveRectLike = function (t, e, n, r) {
                    var o, a = t;
                    return i.default.string(a) ? a = D(a, e, n) : i.default.func(a) && (a = a.apply(void 0, function (t) {
                        if (Array.isArray(t)) return A(t)
                    }(o = r) || function (t) {
                        if ("undefined" != typeof Symbol && null != t[Symbol.iterator] || null != t["@@iterator"]) return Array.from(t)
                    }(o) || function (t, e) {
                        if (t) {
                            if ("string" == typeof t) return A(t, e);
                            var n = Object.prototype.toString.call(t).slice(8, -1);
                            return "Object" === n && t.constructor && (n = t.constructor.name), "Map" === n || "Set" === n ? Array.from(t) : "Arguments" === n || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n) ? A(t, e) : void 0
                        }
                    }(o) || function () {
                        throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")
                    }())), i.default.element(a) && (a = (0, P.getElementRect)(a)), a
                }, I.tlbrToXywh = function (t) {
                    return !t || "x" in t && "y" in t || ((t = (0, k.default)({}, t)).x = t.left || 0, t.y = t.top || 0, t.width = t.width || (t.right || 0) - t.x, t.height = t.height || (t.bottom || 0) - t.y), t
                }, I.xywhToTlbr = function (t) {
                    return !t || "left" in t && "top" in t || ((t = (0, k.default)({}, t)).left = t.x || 0, t.top = t.y || 0, t.right = t.right || t.left + t.width, t.bottom = t.bottom || t.top + t.height), t
                };
                var C = {};
                Object.defineProperty(C, "__esModule", {value: !0}), C.default = function (t, e, n) {
                    var r = t.options[n], o = r && r.origin || t.options.origin,
                        i = (0, I.resolveRectLike)(o, t, e, [t && e]);
                    return (0, I.rectToXY)(i) || {x: 0, y: 0}
                };
                var z = {};

                function R(t) {
                    return t.trim().split(/ +/)
                }

                Object.defineProperty(z, "__esModule", {value: !0}), z.default = function t(e, n, r) {
                    if (r = r || {}, i.default.string(e) && -1 !== e.search(" ") && (e = R(e)), i.default.array(e)) return e.reduce((function (e, o) {
                        return (0, k.default)(e, t(o, n, r))
                    }), r);
                    if (i.default.object(e) && (n = e, e = ""), i.default.func(n)) r[e] = r[e] || [], r[e].push(n); else if (i.default.array(n)) for (var o = 0; o < n.length; o++) {
                        var a;
                        a = n[o], t(e, a, r)
                    } else if (i.default.object(n)) for (var s in n) {
                        var l = R(s).map((function (t) {
                            return "".concat(e).concat(t)
                        }));
                        t(l, n[s], r)
                    }
                    return r
                };
                var F = {};
                Object.defineProperty(F, "__esModule", {value: !0}), F.default = void 0, F.default = function (t, e) {
                    return Math.sqrt(t * t + e * e)
                };
                var L = {};
                Object.defineProperty(L, "__esModule", {value: !0}), L.default = function (t, e) {
                    t.__set || (t.__set = {});
                    var n = function (n) {
                        "function" != typeof t[n] && "__set" !== n && Object.defineProperty(t, n, {
                            get: function () {
                                return n in t.__set ? t.__set[n] : t.__set[n] = e[n]
                            }, set: function (e) {
                                t.__set[n] = e
                            }, configurable: !0
                        })
                    };
                    for (var r in e) n(r);
                    return t
                };
                var B = {};

                function q(t) {
                    return t instanceof g.default.Event || t instanceof g.default.Touch
                }

                function X(t, e, n) {
                    return t = t || "page", (n = n || {}).x = e[t + "X"], n.y = e[t + "Y"], n
                }

                function Y(t, e) {
                    return e = e || {
                        x: 0,
                        y: 0
                    }, x.default.isOperaMobile && q(t) ? (X("screen", t, e), e.x += window.scrollX, e.y += window.scrollY) : X("page", t, e), e
                }

                function N(t, e) {
                    return e = e || {}, x.default.isOperaMobile && q(t) ? X("screen", t, e) : X("client", t, e), e
                }

                function W(t) {
                    var e = [];
                    return i.default.array(t) ? (e[0] = t[0], e[1] = t[1]) : "touchend" === t.type ? 1 === t.touches.length ? (e[0] = t.touches[0], e[1] = t.changedTouches[0]) : 0 === t.touches.length && (e[0] = t.changedTouches[0], e[1] = t.changedTouches[1]) : (e[0] = t.touches[0], e[1] = t.touches[1]), e
                }

                function U(t) {
                    for (var e = {
                        pageX: 0,
                        pageY: 0,
                        clientX: 0,
                        clientY: 0,
                        screenX: 0,
                        screenY: 0
                    }, n = 0; n < t.length; n++) {
                        var r = t[n];
                        for (var o in e) e[o] += r[o]
                    }
                    for (var i in e) e[i] /= t.length;
                    return e
                }

                Object.defineProperty(B, "__esModule", {value: !0}), B.coordsToEvent = function (t) {
                    return {
                        coords: t, get page() {
                            return this.coords.page
                        }, get client() {
                            return this.coords.client
                        }, get timeStamp() {
                            return this.coords.timeStamp
                        }, get pageX() {
                            return this.coords.page.x
                        }, get pageY() {
                            return this.coords.page.y
                        }, get clientX() {
                            return this.coords.client.x
                        }, get clientY() {
                            return this.coords.client.y
                        }, get pointerId() {
                            return this.coords.pointerId
                        }, get target() {
                            return this.coords.target
                        }, get type() {
                            return this.coords.type
                        }, get pointerType() {
                            return this.coords.pointerType
                        }, get buttons() {
                            return this.coords.buttons
                        }, preventDefault: function () {
                        }
                    }
                }, B.copyCoords = function (t, e) {
                    t.page = t.page || {}, t.page.x = e.page.x, t.page.y = e.page.y, t.client = t.client || {}, t.client.x = e.client.x, t.client.y = e.client.y, t.timeStamp = e.timeStamp
                }, B.getClientXY = N, B.getEventTargets = function (t) {
                    var e = i.default.func(t.composedPath) ? t.composedPath() : t.path;
                    return [P.getActualElement(e ? e[0] : t.target), P.getActualElement(t.currentTarget)]
                }, B.getPageXY = Y, B.getPointerId = function (t) {
                    return i.default.number(t.pointerId) ? t.pointerId : t.identifier
                }, B.getPointerType = function (t) {
                    return i.default.string(t.pointerType) ? t.pointerType : i.default.number(t.pointerType) ? [void 0, void 0, "touch", "pen", "mouse"][t.pointerType] : /touch/.test(t.type || "") || t instanceof g.default.Touch ? "touch" : "mouse"
                }, B.getTouchPair = W, B.getXY = X, B.isNativePointer = q, B.newCoords = function () {
                    return {page: {x: 0, y: 0}, client: {x: 0, y: 0}, timeStamp: 0}
                }, B.pointerAverage = U, Object.defineProperty(B, "pointerExtend", {
                    enumerable: !0, get: function () {
                        return L.default
                    }
                }), B.setCoordDeltas = function (t, e, n) {
                    t.page.x = n.page.x - e.page.x, t.page.y = n.page.y - e.page.y, t.client.x = n.client.x - e.client.x, t.client.y = n.client.y - e.client.y, t.timeStamp = n.timeStamp - e.timeStamp
                }, B.setCoordVelocity = function (t, e) {
                    var n = Math.max(e.timeStamp / 1e3, .001);
                    t.page.x = e.page.x / n, t.page.y = e.page.y / n, t.client.x = e.client.x / n, t.client.y = e.client.y / n, t.timeStamp = n
                }, B.setCoords = function (t, e, n) {
                    var r = e.length > 1 ? U(e) : e[0];
                    Y(r, t.page), N(r, t.client), t.timeStamp = n
                }, B.setZeroCoords = function (t) {
                    t.page.x = 0, t.page.y = 0, t.client.x = 0, t.client.y = 0
                }, B.touchAngle = function (t, e) {
                    var n = e + "X", r = e + "Y", o = W(t), i = o[1][n] - o[0][n], a = o[1][r] - o[0][r];
                    return 180 * Math.atan2(a, i) / Math.PI
                }, B.touchBBox = function (t) {
                    if (!t.length) return null;
                    var e = W(t), n = Math.min(e[0].pageX, e[1].pageX), r = Math.min(e[0].pageY, e[1].pageY),
                        o = Math.max(e[0].pageX, e[1].pageX), i = Math.max(e[0].pageY, e[1].pageY);
                    return {x: n, y: r, left: n, top: r, right: o, bottom: i, width: o - n, height: i - r}
                }, B.touchDistance = function (t, e) {
                    var n = e + "X", r = e + "Y", o = W(t), i = o[0][n] - o[1][n], a = o[0][r] - o[1][r];
                    return (0, F.default)(i, a)
                };
                var V = {};

                function H(t, e, n) {
                    return e in t ? Object.defineProperty(t, e, {
                        value: n,
                        enumerable: !0,
                        configurable: !0,
                        writable: !0
                    }) : t[e] = n, t
                }

                Object.defineProperty(V, "__esModule", {value: !0}), V.BaseEvent = void 0;
                var G = function () {
                    function t(e) {
                        !function (t, e) {
                            if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function")
                        }(this, t), H(this, "immediatePropagationStopped", !1), H(this, "propagationStopped", !1), this._interaction = e
                    }

                    var e, n;
                    return e = t, (n = [{
                        key: "preventDefault", value: function () {
                        }
                    }, {
                        key: "stopPropagation", value: function () {
                            this.propagationStopped = !0
                        }
                    }, {
                        key: "stopImmediatePropagation", value: function () {
                            this.immediatePropagationStopped = this.propagationStopped = !0
                        }
                    }]) && function (t, e) {
                        for (var n = 0; n < e.length; n++) {
                            var r = e[n];
                            r.enumerable = r.enumerable || !1, r.configurable = !0, "value" in r && (r.writable = !0), Object.defineProperty(t, r.key, r)
                        }
                    }(e.prototype, n), Object.defineProperty(e, "prototype", {writable: !1}), t
                }();
                V.BaseEvent = G, Object.defineProperty(G.prototype, "interaction", {
                    get: function () {
                        return this._interaction._proxy
                    }, set: function () {
                    }
                });
                var $ = {};
                Object.defineProperty($, "__esModule", {value: !0}), $.remove = $.merge = $.from = $.findIndex = $.find = $.contains = void 0, $.contains = function (t, e) {
                    return -1 !== t.indexOf(e)
                }, $.remove = function (t, e) {
                    return t.splice(t.indexOf(e), 1)
                };
                var K = function (t, e) {
                    for (var n = 0; n < e.length; n++) {
                        var r = e[n];
                        t.push(r)
                    }
                    return t
                };
                $.merge = K, $.from = function (t) {
                    return K([], t)
                };
                var Z = function (t, e) {
                    for (var n = 0; n < t.length; n++) if (e(t[n], n, t)) return n;
                    return -1
                };
                $.findIndex = Z, $.find = function (t, e) {
                    return t[Z(t, e)]
                };
                var J = {};

                function Q(t) {
                    return Q = "function" == typeof Symbol && "symbol" == a(Symbol.iterator) ? function (t) {
                        return a(t)
                    } : function (t) {
                        return t && "function" == typeof Symbol && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : a(t)
                    }, Q(t)
                }

                function tt(t, e) {
                    return tt = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function (t, e) {
                        return t.__proto__ = e, t
                    }, tt(t, e)
                }

                function et(t, e) {
                    if (e && ("object" === Q(e) || "function" == typeof e)) return e;
                    if (void 0 !== e) throw new TypeError("Derived constructors may only return object or undefined");
                    return nt(t)
                }

                function nt(t) {
                    if (void 0 === t) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
                    return t
                }

                function rt(t) {
                    return rt = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function (t) {
                        return t.__proto__ || Object.getPrototypeOf(t)
                    }, rt(t)
                }

                function ot(t, e, n) {
                    return e in t ? Object.defineProperty(t, e, {
                        value: n,
                        enumerable: !0,
                        configurable: !0,
                        writable: !0
                    }) : t[e] = n, t
                }

                Object.defineProperty(J, "__esModule", {value: !0}), J.DropEvent = void 0;
                var it = function (t) {
                    !function (t, e) {
                        if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function");
                        t.prototype = Object.create(e && e.prototype, {
                            constructor: {
                                value: t,
                                writable: !0,
                                configurable: !0
                            }
                        }), Object.defineProperty(t, "prototype", {writable: !1}), e && tt(t, e)
                    }(a, t);
                    var e, n, r, o, i = (r = a, o = function () {
                        if ("undefined" == typeof Reflect || !Reflect.construct) return !1;
                        if (Reflect.construct.sham) return !1;
                        if ("function" == typeof Proxy) return !0;
                        try {
                            return Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], (function () {
                            }))), !0
                        } catch (t) {
                            return !1
                        }
                    }(), function () {
                        var t, e = rt(r);
                        if (o) {
                            var n = rt(this).constructor;
                            t = Reflect.construct(e, arguments, n)
                        } else t = e.apply(this, arguments);
                        return et(this, t)
                    });

                    function a(t, e, n) {
                        var r;
                        !function (t, e) {
                            if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function")
                        }(this, a), ot(nt(r = i.call(this, e._interaction)), "dropzone", void 0), ot(nt(r), "dragEvent", void 0), ot(nt(r), "relatedTarget", void 0), ot(nt(r), "draggable", void 0), ot(nt(r), "propagationStopped", !1), ot(nt(r), "immediatePropagationStopped", !1);
                        var o = "dragleave" === n ? t.prev : t.cur, s = o.element, l = o.dropzone;
                        return r.type = n, r.target = s, r.currentTarget = s, r.dropzone = l, r.dragEvent = e, r.relatedTarget = e.target, r.draggable = e.interactable, r.timeStamp = e.timeStamp, r
                    }

                    return e = a, (n = [{
                        key: "reject", value: function () {
                            var t = this, e = this._interaction.dropState;
                            if ("dropactivate" === this.type || this.dropzone && e.cur.dropzone === this.dropzone && e.cur.element === this.target) if (e.prev.dropzone = this.dropzone, e.prev.element = this.target, e.rejected = !0, e.events.enter = null, this.stopImmediatePropagation(), "dropactivate" === this.type) {
                                var n = e.activeDrops, r = $.findIndex(n, (function (e) {
                                    var n = e.dropzone, r = e.element;
                                    return n === t.dropzone && r === t.target
                                }));
                                e.activeDrops.splice(r, 1);
                                var o = new a(e, this.dragEvent, "dropdeactivate");
                                o.dropzone = this.dropzone, o.target = this.target, this.dropzone.fire(o)
                            } else this.dropzone.fire(new a(e, this.dragEvent, "dragleave"))
                        }
                    }, {
                        key: "preventDefault", value: function () {
                        }
                    }, {
                        key: "stopPropagation", value: function () {
                            this.propagationStopped = !0
                        }
                    }, {
                        key: "stopImmediatePropagation", value: function () {
                            this.immediatePropagationStopped = this.propagationStopped = !0
                        }
                    }]) && function (t, e) {
                        for (var n = 0; n < e.length; n++) {
                            var r = e[n];
                            r.enumerable = r.enumerable || !1, r.configurable = !0, "value" in r && (r.writable = !0), Object.defineProperty(t, r.key, r)
                        }
                    }(e.prototype, n), Object.defineProperty(e, "prototype", {writable: !1}), a
                }(V.BaseEvent);
                J.DropEvent = it;
                var at = {};

                function st(t, e) {
                    for (var n = 0; n < t.slice().length; n++) {
                        var r = t.slice()[n], o = r.dropzone, i = r.element;
                        e.dropzone = o, e.target = i, o.fire(e), e.propagationStopped = e.immediatePropagationStopped = !1
                    }
                }

                function lt(t, e) {
                    for (var n = function (t, e) {
                        for (var n = t.interactables, r = [], o = 0; o < n.list.length; o++) {
                            var a = n.list[o];
                            if (a.options.drop.enabled) {
                                var s = a.options.drop.accept;
                                if (!(i.default.element(s) && s !== e || i.default.string(s) && !P.matchesSelector(e, s) || i.default.func(s) && !s({
                                    dropzone: a,
                                    draggableElement: e
                                }))) for (var l = i.default.string(a.target) ? a._context.querySelectorAll(a.target) : i.default.array(a.target) ? a.target : [a.target], c = 0; c < l.length; c++) {
                                    var u = l[c];
                                    u !== e && r.push({dropzone: a, element: u, rect: a.getRect(u)})
                                }
                            }
                        }
                        return r
                    }(t, e), r = 0; r < n.length; r++) {
                        var o = n[r];
                        o.rect = o.dropzone.getRect(o.element)
                    }
                    return n
                }

                function ct(t, e, n) {
                    for (var r = t.dropState, o = t.interactable, i = t.element, a = [], s = 0; s < r.activeDrops.length; s++) {
                        var l = r.activeDrops[s], c = l.dropzone, u = l.element, d = l.rect;
                        a.push(c.dropCheck(e, n, o, i, u, d) ? u : null)
                    }
                    var f = P.indexOfDeepestElement(a);
                    return r.activeDrops[f] || null
                }

                function ut(t, e, n) {
                    var r = t.dropState,
                        o = {enter: null, leave: null, activate: null, deactivate: null, move: null, drop: null};
                    return "dragstart" === n.type && (o.activate = new J.DropEvent(r, n, "dropactivate"), o.activate.target = null, o.activate.dropzone = null), "dragend" === n.type && (o.deactivate = new J.DropEvent(r, n, "dropdeactivate"), o.deactivate.target = null, o.deactivate.dropzone = null), r.rejected || (r.cur.element !== r.prev.element && (r.prev.dropzone && (o.leave = new J.DropEvent(r, n, "dragleave"), n.dragLeave = o.leave.target = r.prev.element, n.prevDropzone = o.leave.dropzone = r.prev.dropzone), r.cur.dropzone && (o.enter = new J.DropEvent(r, n, "dragenter"), n.dragEnter = r.cur.element, n.dropzone = r.cur.dropzone)), "dragend" === n.type && r.cur.dropzone && (o.drop = new J.DropEvent(r, n, "drop"), n.dropzone = r.cur.dropzone, n.relatedTarget = r.cur.element), "dragmove" === n.type && r.cur.dropzone && (o.move = new J.DropEvent(r, n, "dropmove"), o.move.dragmove = n, n.dropzone = r.cur.dropzone)), o
                }

                function dt(t, e) {
                    var n = t.dropState, r = n.activeDrops, o = n.cur, i = n.prev;
                    e.leave && i.dropzone.fire(e.leave), e.enter && o.dropzone.fire(e.enter), e.move && o.dropzone.fire(e.move), e.drop && o.dropzone.fire(e.drop), e.deactivate && st(r, e.deactivate), n.prev.dropzone = o.dropzone, n.prev.element = o.element
                }

                function ft(t, e) {
                    var n = t.interaction, r = t.iEvent, o = t.event;
                    if ("dragmove" === r.type || "dragend" === r.type) {
                        var i = n.dropState;
                        e.dynamicDrop && (i.activeDrops = lt(e, n.element));
                        var a = r, s = ct(n, a, o);
                        i.rejected = i.rejected && !!s && s.dropzone === i.cur.dropzone && s.element === i.cur.element, i.cur.dropzone = s && s.dropzone, i.cur.element = s && s.element, i.events = ut(n, 0, a)
                    }
                }

                Object.defineProperty(at, "__esModule", {value: !0}), at.default = void 0;
                var pt = {
                    id: "actions/drop",
                    install: function (t) {
                        var e = t.actions, n = t.interactStatic, r = t.Interactable, o = t.defaults;
                        t.usePlugin(d.default), r.prototype.dropzone = function (t) {
                            return function (t, e) {
                                if (i.default.object(e)) {
                                    if (t.options.drop.enabled = !1 !== e.enabled, e.listeners) {
                                        var n = (0, z.default)(e.listeners),
                                            r = Object.keys(n).reduce((function (t, e) {
                                                return t[/^(enter|leave)/.test(e) ? "drag".concat(e) : /^(activate|deactivate|move)/.test(e) ? "drop".concat(e) : e] = n[e], t
                                            }), {});
                                        t.off(t.options.drop.listeners), t.on(r), t.options.drop.listeners = r
                                    }
                                    return i.default.func(e.ondrop) && t.on("drop", e.ondrop), i.default.func(e.ondropactivate) && t.on("dropactivate", e.ondropactivate), i.default.func(e.ondropdeactivate) && t.on("dropdeactivate", e.ondropdeactivate), i.default.func(e.ondragenter) && t.on("dragenter", e.ondragenter), i.default.func(e.ondragleave) && t.on("dragleave", e.ondragleave), i.default.func(e.ondropmove) && t.on("dropmove", e.ondropmove), /^(pointer|center)$/.test(e.overlap) ? t.options.drop.overlap = e.overlap : i.default.number(e.overlap) && (t.options.drop.overlap = Math.max(Math.min(1, e.overlap), 0)), "accept" in e && (t.options.drop.accept = e.accept), "checker" in e && (t.options.drop.checker = e.checker), t
                                }
                                return i.default.bool(e) ? (t.options.drop.enabled = e, t) : t.options.drop
                            }(this, t)
                        }, r.prototype.dropCheck = function (t, e, n, r, o, a) {
                            return function (t, e, n, r, o, a, s) {
                                var l = !1;
                                if (!(s = s || t.getRect(a))) return !!t.options.drop.checker && t.options.drop.checker(e, n, l, t, a, r, o);
                                var c = t.options.drop.overlap;
                                if ("pointer" === c) {
                                    var u = (0, C.default)(r, o, "drag"), d = B.getPageXY(e);
                                    d.x += u.x, d.y += u.y;
                                    var f = d.x > s.left && d.x < s.right, p = d.y > s.top && d.y < s.bottom;
                                    l = f && p
                                }
                                var v = r.getRect(o);
                                if (v && "center" === c) {
                                    var h = v.left + v.width / 2, g = v.top + v.height / 2;
                                    l = h >= s.left && h <= s.right && g >= s.top && g <= s.bottom
                                }
                                return v && i.default.number(c) && (l = Math.max(0, Math.min(s.right, v.right) - Math.max(s.left, v.left)) * Math.max(0, Math.min(s.bottom, v.bottom) - Math.max(s.top, v.top)) / (v.width * v.height) >= c), t.options.drop.checker && (l = t.options.drop.checker(e, n, l, t, a, r, o)), l
                            }(this, t, e, n, r, o, a)
                        }, n.dynamicDrop = function (e) {
                            return i.default.bool(e) ? (t.dynamicDrop = e, n) : t.dynamicDrop
                        }, (0, k.default)(e.phaselessTypes, {
                            dragenter: !0,
                            dragleave: !0,
                            dropactivate: !0,
                            dropdeactivate: !0,
                            dropmove: !0,
                            drop: !0
                        }), e.methodDict.drop = "dropzone", t.dynamicDrop = !1, o.actions.drop = pt.defaults
                    },
                    listeners: {
                        "interactions:before-action-start": function (t) {
                            var e = t.interaction;
                            "drag" === e.prepared.name && (e.dropState = {
                                cur: {dropzone: null, element: null},
                                prev: {dropzone: null, element: null},
                                rejected: null,
                                events: null,
                                activeDrops: []
                            })
                        }, "interactions:after-action-start": function (t, e) {
                            var n = t.interaction, r = (t.event, t.iEvent);
                            if ("drag" === n.prepared.name) {
                                var o = n.dropState;
                                o.activeDrops = null, o.events = null, o.activeDrops = lt(e, n.element), o.events = ut(n, 0, r), o.events.activate && (st(o.activeDrops, o.events.activate), e.fire("actions/drop:start", {
                                    interaction: n,
                                    dragEvent: r
                                }))
                            }
                        }, "interactions:action-move": ft, "interactions:after-action-move": function (t, e) {
                            var n = t.interaction, r = t.iEvent;
                            "drag" === n.prepared.name && (dt(n, n.dropState.events), e.fire("actions/drop:move", {
                                interaction: n,
                                dragEvent: r
                            }), n.dropState.events = {})
                        }, "interactions:action-end": function (t, e) {
                            if ("drag" === t.interaction.prepared.name) {
                                var n = t.interaction, r = t.iEvent;
                                ft(t, e), dt(n, n.dropState.events), e.fire("actions/drop:end", {
                                    interaction: n,
                                    dragEvent: r
                                })
                            }
                        }, "interactions:stop": function (t) {
                            var e = t.interaction;
                            if ("drag" === e.prepared.name) {
                                var n = e.dropState;
                                n && (n.activeDrops = null, n.events = null, n.cur.dropzone = null, n.cur.element = null, n.prev.dropzone = null, n.prev.element = null, n.rejected = !1)
                            }
                        }
                    },
                    getActiveDrops: lt,
                    getDrop: ct,
                    getDropEvents: ut,
                    fireDropEvents: dt,
                    defaults: {enabled: !1, accept: null, overlap: "pointer"}
                }, vt = pt;
                at.default = vt;
                var ht = {};

                function gt(t) {
                    var e = t.interaction, n = t.iEvent, r = t.phase;
                    if ("gesture" === e.prepared.name) {
                        var o = e.pointers.map((function (t) {
                            return t.pointer
                        })), a = "start" === r, s = "end" === r, l = e.interactable.options.deltaSource;
                        if (n.touches = [o[0], o[1]], a) n.distance = B.touchDistance(o, l), n.box = B.touchBBox(o), n.scale = 1, n.ds = 0, n.angle = B.touchAngle(o, l), n.da = 0, e.gesture.startDistance = n.distance, e.gesture.startAngle = n.angle; else if (s) {
                            var c = e.prevEvent;
                            n.distance = c.distance, n.box = c.box, n.scale = c.scale, n.ds = 0, n.angle = c.angle, n.da = 0
                        } else n.distance = B.touchDistance(o, l), n.box = B.touchBBox(o), n.scale = n.distance / e.gesture.startDistance, n.angle = B.touchAngle(o, l), n.ds = n.scale - e.gesture.scale, n.da = n.angle - e.gesture.angle;
                        e.gesture.distance = n.distance, e.gesture.angle = n.angle, i.default.number(n.scale) && n.scale !== 1 / 0 && !isNaN(n.scale) && (e.gesture.scale = n.scale)
                    }
                }

                Object.defineProperty(ht, "__esModule", {value: !0}), ht.default = void 0;
                var yt = {
                    id: "actions/gesture",
                    before: ["actions/drag", "actions/resize"],
                    install: function (t) {
                        var e = t.actions, n = t.Interactable, r = t.defaults;
                        n.prototype.gesturable = function (t) {
                            return i.default.object(t) ? (this.options.gesture.enabled = !1 !== t.enabled, this.setPerAction("gesture", t), this.setOnEvents("gesture", t), this) : i.default.bool(t) ? (this.options.gesture.enabled = t, this) : this.options.gesture
                        }, e.map.gesture = yt, e.methodDict.gesture = "gesturable", r.actions.gesture = yt.defaults
                    },
                    listeners: {
                        "interactions:action-start": gt,
                        "interactions:action-move": gt,
                        "interactions:action-end": gt,
                        "interactions:new": function (t) {
                            t.interaction.gesture = {angle: 0, distance: 0, scale: 1, startAngle: 0, startDistance: 0}
                        },
                        "auto-start:check": function (t) {
                            if (!(t.interaction.pointers.length < 2)) {
                                var e = t.interactable.options.gesture;
                                if (e && e.enabled) return t.action = {name: "gesture"}, !1
                            }
                        }
                    },
                    defaults: {},
                    getCursor: function () {
                        return ""
                    }
                }, mt = yt;
                ht.default = mt;
                var bt = {};

                function xt(t, e, n, r, o, a, s) {
                    if (!e) return !1;
                    if (!0 === e) {
                        var l = i.default.number(a.width) ? a.width : a.right - a.left,
                            c = i.default.number(a.height) ? a.height : a.bottom - a.top;
                        if (s = Math.min(s, Math.abs(("left" === t || "right" === t ? l : c) / 2)), l < 0 && ("left" === t ? t = "right" : "right" === t && (t = "left")), c < 0 && ("top" === t ? t = "bottom" : "bottom" === t && (t = "top")), "left" === t) {
                            var u = l >= 0 ? a.left : a.right;
                            return n.x < u + s
                        }
                        if ("top" === t) {
                            var d = c >= 0 ? a.top : a.bottom;
                            return n.y < d + s
                        }
                        if ("right" === t) return n.x > (l >= 0 ? a.right : a.left) - s;
                        if ("bottom" === t) return n.y > (c >= 0 ? a.bottom : a.top) - s
                    }
                    return !!i.default.element(r) && (i.default.element(e) ? e === r : P.matchesUpTo(r, e, o))
                }

                function wt(t) {
                    var e = t.iEvent, n = t.interaction;
                    if ("resize" === n.prepared.name && n.resizeAxes) {
                        var r = e;
                        n.interactable.options.resize.square ? ("y" === n.resizeAxes ? r.delta.x = r.delta.y : r.delta.y = r.delta.x, r.axes = "xy") : (r.axes = n.resizeAxes, "x" === n.resizeAxes ? r.delta.y = 0 : "y" === n.resizeAxes && (r.delta.x = 0))
                    }
                }

                Object.defineProperty(bt, "__esModule", {value: !0}), bt.default = void 0;
                var _t = {
                    id: "actions/resize",
                    before: ["actions/drag"],
                    install: function (t) {
                        var e = t.actions, n = t.browser, r = t.Interactable, o = t.defaults;
                        _t.cursors = function (t) {
                            return t.isIe9 ? {
                                x: "e-resize",
                                y: "s-resize",
                                xy: "se-resize",
                                top: "n-resize",
                                left: "w-resize",
                                bottom: "s-resize",
                                right: "e-resize",
                                topleft: "se-resize",
                                bottomright: "se-resize",
                                topright: "ne-resize",
                                bottomleft: "ne-resize"
                            } : {
                                x: "ew-resize",
                                y: "ns-resize",
                                xy: "nwse-resize",
                                top: "ns-resize",
                                left: "ew-resize",
                                bottom: "ns-resize",
                                right: "ew-resize",
                                topleft: "nwse-resize",
                                bottomright: "nwse-resize",
                                topright: "nesw-resize",
                                bottomleft: "nesw-resize"
                            }
                        }(n), _t.defaultMargin = n.supportsTouch || n.supportsPointerEvent ? 20 : 10, r.prototype.resizable = function (e) {
                            return function (t, e, n) {
                                return i.default.object(e) ? (t.options.resize.enabled = !1 !== e.enabled, t.setPerAction("resize", e), t.setOnEvents("resize", e), i.default.string(e.axis) && /^x$|^y$|^xy$/.test(e.axis) ? t.options.resize.axis = e.axis : null === e.axis && (t.options.resize.axis = n.defaults.actions.resize.axis), i.default.bool(e.preserveAspectRatio) ? t.options.resize.preserveAspectRatio = e.preserveAspectRatio : i.default.bool(e.square) && (t.options.resize.square = e.square), t) : i.default.bool(e) ? (t.options.resize.enabled = e, t) : t.options.resize
                            }(this, e, t)
                        }, e.map.resize = _t, e.methodDict.resize = "resizable", o.actions.resize = _t.defaults
                    },
                    listeners: {
                        "interactions:new": function (t) {
                            t.interaction.resizeAxes = "xy"
                        }, "interactions:action-start": function (t) {
                            !function (t) {
                                var e = t.iEvent, n = t.interaction;
                                if ("resize" === n.prepared.name && n.prepared.edges) {
                                    var r = e, o = n.rect;
                                    n._rects = {
                                        start: (0, k.default)({}, o),
                                        corrected: (0, k.default)({}, o),
                                        previous: (0, k.default)({}, o),
                                        delta: {left: 0, right: 0, width: 0, top: 0, bottom: 0, height: 0}
                                    }, r.edges = n.prepared.edges, r.rect = n._rects.corrected, r.deltaRect = n._rects.delta
                                }
                            }(t), wt(t)
                        }, "interactions:action-move": function (t) {
                            !function (t) {
                                var e = t.iEvent, n = t.interaction;
                                if ("resize" === n.prepared.name && n.prepared.edges) {
                                    var r = e, o = n.interactable.options.resize.invert,
                                        i = "reposition" === o || "negate" === o, a = n.rect, s = n._rects, l = s.start,
                                        c = s.corrected, u = s.delta, d = s.previous;
                                    if ((0, k.default)(d, c), i) {
                                        if ((0, k.default)(c, a), "reposition" === o) {
                                            if (c.top > c.bottom) {
                                                var f = c.top;
                                                c.top = c.bottom, c.bottom = f
                                            }
                                            if (c.left > c.right) {
                                                var p = c.left;
                                                c.left = c.right, c.right = p
                                            }
                                        }
                                    } else c.top = Math.min(a.top, l.bottom), c.bottom = Math.max(a.bottom, l.top), c.left = Math.min(a.left, l.right), c.right = Math.max(a.right, l.left);
                                    for (var v in c.width = c.right - c.left, c.height = c.bottom - c.top, c) u[v] = c[v] - d[v];
                                    r.edges = n.prepared.edges, r.rect = c, r.deltaRect = u
                                }
                            }(t), wt(t)
                        }, "interactions:action-end": function (t) {
                            var e = t.iEvent, n = t.interaction;
                            if ("resize" === n.prepared.name && n.prepared.edges) {
                                var r = e;
                                r.edges = n.prepared.edges, r.rect = n._rects.corrected, r.deltaRect = n._rects.delta
                            }
                        }, "auto-start:check": function (t) {
                            var e = t.interaction, n = t.interactable, r = t.element, o = t.rect, a = t.buttons;
                            if (o) {
                                var s = (0, k.default)({}, e.coords.cur.page), l = n.options.resize;
                                if (l && l.enabled && (!e.pointerIsDown || !/mouse|pointer/.test(e.pointerType) || 0 != (a & l.mouseButtons))) {
                                    if (i.default.object(l.edges)) {
                                        var c = {left: !1, right: !1, top: !1, bottom: !1};
                                        for (var u in c) c[u] = xt(u, l.edges[u], s, e._latestPointer.eventTarget, r, o, l.margin || _t.defaultMargin);
                                        c.left = c.left && !c.right, c.top = c.top && !c.bottom, (c.left || c.right || c.top || c.bottom) && (t.action = {
                                            name: "resize",
                                            edges: c
                                        })
                                    } else {
                                        var d = "y" !== l.axis && s.x > o.right - _t.defaultMargin,
                                            f = "x" !== l.axis && s.y > o.bottom - _t.defaultMargin;
                                        (d || f) && (t.action = {name: "resize", axes: (d ? "x" : "") + (f ? "y" : "")})
                                    }
                                    return !t.action && void 0
                                }
                            }
                        }
                    },
                    defaults: {
                        square: !1,
                        preserveAspectRatio: !1,
                        axis: "xy",
                        margin: NaN,
                        edges: null,
                        invert: "none"
                    },
                    cursors: null,
                    getCursor: function (t) {
                        var e = t.edges, n = t.axis, r = t.name, o = _t.cursors, i = null;
                        if (n) i = o[r + n]; else if (e) {
                            for (var a = "", s = ["top", "bottom", "left", "right"], l = 0; l < s.length; l++) {
                                var c = s[l];
                                e[c] && (a += c)
                            }
                            i = o[a]
                        }
                        return i
                    },
                    defaultMargin: null
                }, Pt = _t;
                bt.default = Pt;
                var Ot = {};
                Object.defineProperty(Ot, "__esModule", {value: !0}), Ot.default = void 0;
                var Et = {
                    id: "actions", install: function (t) {
                        t.usePlugin(ht.default), t.usePlugin(bt.default), t.usePlugin(d.default), t.usePlugin(at.default)
                    }
                };
                Ot.default = Et;
                var St = {};
                Object.defineProperty(St, "__esModule", {value: !0}), St.default = void 0;
                var Tt, jt, Mt = 0, kt = {
                    request: function (t) {
                        return Tt(t)
                    }, cancel: function (t) {
                        return jt(t)
                    }, init: function (t) {
                        if (Tt = t.requestAnimationFrame, jt = t.cancelAnimationFrame, !Tt) for (var e = ["ms", "moz", "webkit", "o"], n = 0; n < e.length; n++) {
                            var r = e[n];
                            Tt = t["".concat(r, "RequestAnimationFrame")], jt = t["".concat(r, "CancelAnimationFrame")] || t["".concat(r, "CancelRequestAnimationFrame")]
                        }
                        Tt = Tt && Tt.bind(t), jt = jt && jt.bind(t), Tt || (Tt = function (e) {
                            var n = Date.now(), r = Math.max(0, 16 - (n - Mt)), o = t.setTimeout((function () {
                                e(n + r)
                            }), r);
                            return Mt = n + r, o
                        }, jt = function (t) {
                            return clearTimeout(t)
                        })
                    }
                };
                St.default = kt;
                var It = {};
                Object.defineProperty(It, "__esModule", {value: !0}), It.default = void 0, It.getContainer = Dt, It.getScroll = Ct, It.getScrollSize = function (t) {
                    return i.default.window(t) && (t = window.document.body), {x: t.scrollWidth, y: t.scrollHeight}
                }, It.getScrollSizeDelta = function (t, e) {
                    var n = t.interaction, r = t.element, o = n && n.interactable.options[n.prepared.name].autoScroll;
                    if (!o || !o.enabled) return e(), {x: 0, y: 0};
                    var i = Dt(o.container, n.interactable, r), a = Ct(i);
                    e();
                    var s = Ct(i);
                    return {x: s.x - a.x, y: s.y - a.y}
                };
                var At = {
                    defaults: {enabled: !1, margin: 60, container: null, speed: 300},
                    now: Date.now,
                    interaction: null,
                    i: 0,
                    x: 0,
                    y: 0,
                    isScrolling: !1,
                    prevTime: 0,
                    margin: 0,
                    speed: 0,
                    start: function (t) {
                        At.isScrolling = !0, St.default.cancel(At.i), t.autoScroll = At, At.interaction = t, At.prevTime = At.now(), At.i = St.default.request(At.scroll)
                    },
                    stop: function () {
                        At.isScrolling = !1, At.interaction && (At.interaction.autoScroll = null), St.default.cancel(At.i)
                    },
                    scroll: function () {
                        var t = At.interaction, e = t.interactable, n = t.element, r = t.prepared.name,
                            o = e.options[r].autoScroll, a = Dt(o.container, e, n), s = At.now(),
                            l = (s - At.prevTime) / 1e3, c = o.speed * l;
                        if (c >= 1) {
                            var u = {x: At.x * c, y: At.y * c};
                            if (u.x || u.y) {
                                var d = Ct(a);
                                i.default.window(a) ? a.scrollBy(u.x, u.y) : a && (a.scrollLeft += u.x, a.scrollTop += u.y);
                                var f = Ct(a), p = {x: f.x - d.x, y: f.y - d.y};
                                (p.x || p.y) && e.fire({
                                    type: "autoscroll",
                                    target: n,
                                    interactable: e,
                                    delta: p,
                                    interaction: t,
                                    container: a
                                })
                            }
                            At.prevTime = s
                        }
                        At.isScrolling && (St.default.cancel(At.i), At.i = St.default.request(At.scroll))
                    },
                    check: function (t, e) {
                        var n;
                        return null == (n = t.options[e].autoScroll) ? void 0 : n.enabled
                    },
                    onInteractionMove: function (t) {
                        var e = t.interaction, n = t.pointer;
                        if (e.interacting() && At.check(e.interactable, e.prepared.name)) if (e.simulation) At.x = At.y = 0; else {
                            var r, o, a, s, l = e.interactable, c = e.element, u = e.prepared.name,
                                d = l.options[u].autoScroll, f = Dt(d.container, l, c);
                            if (i.default.window(f)) s = n.clientX < At.margin, r = n.clientY < At.margin, o = n.clientX > f.innerWidth - At.margin, a = n.clientY > f.innerHeight - At.margin; else {
                                var p = P.getElementClientRect(f);
                                s = n.clientX < p.left + At.margin, r = n.clientY < p.top + At.margin, o = n.clientX > p.right - At.margin, a = n.clientY > p.bottom - At.margin
                            }
                            At.x = o ? 1 : s ? -1 : 0, At.y = a ? 1 : r ? -1 : 0, At.isScrolling || (At.margin = d.margin, At.speed = d.speed, At.start(e))
                        }
                    }
                };

                function Dt(t, n, r) {
                    return (i.default.string(t) ? (0, I.getStringOptionResult)(t, n, r) : t) || (0, e.getWindow)(r)
                }

                function Ct(t) {
                    return i.default.window(t) && (t = window.document.body), {x: t.scrollLeft, y: t.scrollTop}
                }

                var zt = {
                    id: "auto-scroll", install: function (t) {
                        var e = t.defaults, n = t.actions;
                        t.autoScroll = At, At.now = function () {
                            return t.now()
                        }, n.phaselessTypes.autoscroll = !0, e.perAction.autoScroll = At.defaults
                    }, listeners: {
                        "interactions:new": function (t) {
                            t.interaction.autoScroll = null
                        }, "interactions:destroy": function (t) {
                            t.interaction.autoScroll = null, At.stop(), At.interaction && (At.interaction = null)
                        }, "interactions:stop": At.stop, "interactions:action-move": function (t) {
                            return At.onInteractionMove(t)
                        }
                    }
                }, Rt = zt;
                It.default = Rt;
                var Ft = {};
                Object.defineProperty(Ft, "__esModule", {value: !0}), Ft.copyAction = function (t, e) {
                    return t.name = e.name, t.axis = e.axis, t.edges = e.edges, t
                }, Ft.sign = void 0, Ft.warnOnce = function (t, n) {
                    var r = !1;
                    return function () {
                        return r || (e.window.console.warn(n), r = !0), t.apply(this, arguments)
                    }
                }, Ft.sign = function (t) {
                    return t >= 0 ? 1 : -1
                };
                var Lt = {};

                function Bt(t) {
                    return i.default.bool(t) ? (this.options.styleCursor = t, this) : null === t ? (delete this.options.styleCursor, this) : this.options.styleCursor
                }

                function qt(t) {
                    return i.default.func(t) ? (this.options.actionChecker = t, this) : null === t ? (delete this.options.actionChecker, this) : this.options.actionChecker
                }

                Object.defineProperty(Lt, "__esModule", {value: !0}), Lt.default = void 0;
                var Xt = {
                    id: "auto-start/interactableMethods", install: function (t) {
                        var e = t.Interactable;
                        e.prototype.getAction = function (e, n, r, o) {
                            var i = function (t, e, n, r, o) {
                                var i = t.getRect(r), a = {
                                    action: null,
                                    interactable: t,
                                    interaction: n,
                                    element: r,
                                    rect: i,
                                    buttons: e.buttons || {0: 1, 1: 4, 3: 8, 4: 16}[e.button]
                                };
                                return o.fire("auto-start:check", a), a.action
                            }(this, n, r, o, t);
                            return this.options.actionChecker ? this.options.actionChecker(e, n, i, this, o, r) : i
                        }, e.prototype.ignoreFrom = (0, Ft.warnOnce)((function (t) {
                            return this._backCompatOption("ignoreFrom", t)
                        }), "Interactable.ignoreFrom() has been deprecated. Use Interactble.draggable({ignoreFrom: newValue})."), e.prototype.allowFrom = (0, Ft.warnOnce)((function (t) {
                            return this._backCompatOption("allowFrom", t)
                        }), "Interactable.allowFrom() has been deprecated. Use Interactble.draggable({allowFrom: newValue})."), e.prototype.actionChecker = qt, e.prototype.styleCursor = Bt
                    }
                };
                Lt.default = Xt;
                var Yt = {};

                function Nt(t, e, n, r, o) {
                    return e.testIgnoreAllow(e.options[t.name], n, r) && e.options[t.name].enabled && Ht(e, n, t, o) ? t : null
                }

                function Wt(t, e, n, r, o, i, a) {
                    for (var s = 0, l = r.length; s < l; s++) {
                        var c = r[s], u = o[s], d = c.getAction(e, n, t, u);
                        if (d) {
                            var f = Nt(d, c, u, i, a);
                            if (f) return {action: f, interactable: c, element: u}
                        }
                    }
                    return {action: null, interactable: null, element: null}
                }

                function Ut(t, e, n, r, o) {
                    var a = [], s = [], l = r;

                    function c(t) {
                        a.push(t), s.push(l)
                    }

                    for (; i.default.element(l);) {
                        a = [], s = [], o.interactables.forEachMatch(l, c);
                        var u = Wt(t, e, n, a, s, r, o);
                        if (u.action && !u.interactable.options[u.action.name].manualStart) return u;
                        l = P.parentNode(l)
                    }
                    return {action: null, interactable: null, element: null}
                }

                function Vt(t, e, n) {
                    var r = e.action, o = e.interactable, i = e.element;
                    r = r || {name: null}, t.interactable = o, t.element = i, (0, Ft.copyAction)(t.prepared, r), t.rect = o && r.name ? o.getRect(i) : null, Kt(t, n), n.fire("autoStart:prepared", {interaction: t})
                }

                function Ht(t, e, n, r) {
                    var o = t.options, i = o[n.name].max, a = o[n.name].maxPerElement, s = r.autoStart.maxInteractions,
                        l = 0, c = 0, u = 0;
                    if (!(i && a && s)) return !1;
                    for (var d = 0; d < r.interactions.list.length; d++) {
                        var f = r.interactions.list[d], p = f.prepared.name;
                        if (f.interacting()) {
                            if (++l >= s) return !1;
                            if (f.interactable === t) {
                                if ((c += p === n.name ? 1 : 0) >= i) return !1;
                                if (f.element === e && (u++, p === n.name && u >= a)) return !1
                            }
                        }
                    }
                    return s > 0
                }

                function Gt(t, e) {
                    return i.default.number(t) ? (e.autoStart.maxInteractions = t, this) : e.autoStart.maxInteractions
                }

                function $t(t, e, n) {
                    var r = n.autoStart.cursorElement;
                    r && r !== t && (r.style.cursor = ""), t.ownerDocument.documentElement.style.cursor = e, t.style.cursor = e, n.autoStart.cursorElement = e ? t : null
                }

                function Kt(t, e) {
                    var n = t.interactable, r = t.element, o = t.prepared;
                    if ("mouse" === t.pointerType && n && n.options.styleCursor) {
                        var a = "";
                        if (o.name) {
                            var s = n.options[o.name].cursorChecker;
                            a = i.default.func(s) ? s(o, n, r, t._interacting) : e.actions.map[o.name].getCursor(o)
                        }
                        $t(t.element, a || "", e)
                    } else e.autoStart.cursorElement && $t(e.autoStart.cursorElement, "", e)
                }

                Object.defineProperty(Yt, "__esModule", {value: !0}), Yt.default = void 0;
                var Zt = {
                    id: "auto-start/base", before: ["actions"], install: function (t) {
                        var e = t.interactStatic, n = t.defaults;
                        t.usePlugin(Lt.default), n.base.actionChecker = null, n.base.styleCursor = !0, (0, k.default)(n.perAction, {
                            manualStart: !1,
                            max: 1 / 0,
                            maxPerElement: 1,
                            allowFrom: null,
                            ignoreFrom: null,
                            mouseButtons: 1
                        }), e.maxInteractions = function (e) {
                            return Gt(e, t)
                        }, t.autoStart = {maxInteractions: 1 / 0, withinInteractionLimit: Ht, cursorElement: null}
                    }, listeners: {
                        "interactions:down": function (t, e) {
                            var n = t.interaction, r = t.pointer, o = t.event, i = t.eventTarget;
                            n.interacting() || Vt(n, Ut(n, r, o, i, e), e)
                        }, "interactions:move": function (t, e) {
                            !function (t, e) {
                                var n = t.interaction, r = t.pointer, o = t.event, i = t.eventTarget;
                                "mouse" !== n.pointerType || n.pointerIsDown || n.interacting() || Vt(n, Ut(n, r, o, i, e), e)
                            }(t, e), function (t, e) {
                                var n = t.interaction;
                                if (n.pointerIsDown && !n.interacting() && n.pointerWasMoved && n.prepared.name) {
                                    e.fire("autoStart:before-start", t);
                                    var r = n.interactable, o = n.prepared.name;
                                    o && r && (r.options[o].manualStart || !Ht(r, n.element, n.prepared, e) ? n.stop() : (n.start(n.prepared, r, n.element), Kt(n, e)))
                                }
                            }(t, e)
                        }, "interactions:stop": function (t, e) {
                            var n = t.interaction, r = n.interactable;
                            r && r.options.styleCursor && $t(n.element, "", e)
                        }
                    }, maxInteractions: Gt, withinInteractionLimit: Ht, validateAction: Nt
                }, Jt = Zt;
                Yt.default = Jt;
                var Qt = {};
                Object.defineProperty(Qt, "__esModule", {value: !0}), Qt.default = void 0;
                var te = {
                    id: "auto-start/dragAxis", listeners: {
                        "autoStart:before-start": function (t, e) {
                            var n = t.interaction, r = t.eventTarget, o = t.dx, a = t.dy;
                            if ("drag" === n.prepared.name) {
                                var s = Math.abs(o), l = Math.abs(a), c = n.interactable.options.drag, u = c.startAxis,
                                    d = s > l ? "x" : s < l ? "y" : "xy";
                                if (n.prepared.axis = "start" === c.lockAxis ? d[0] : c.lockAxis, "xy" !== d && "xy" !== u && u !== d) {
                                    n.prepared.name = null;
                                    for (var f = r, p = function (t) {
                                        if (t !== n.interactable) {
                                            var o = n.interactable.options.drag;
                                            if (!o.manualStart && t.testIgnoreAllow(o, f, r)) {
                                                var i = t.getAction(n.downPointer, n.downEvent, n, f);
                                                if (i && "drag" === i.name && function (t, e) {
                                                    if (!e) return !1;
                                                    var n = e.options.drag.startAxis;
                                                    return "xy" === t || "xy" === n || n === t
                                                }(d, t) && Yt.default.validateAction(i, t, f, r, e)) return t
                                            }
                                        }
                                    }; i.default.element(f);) {
                                        var v = e.interactables.forEachMatch(f, p);
                                        if (v) {
                                            n.prepared.name = "drag", n.interactable = v, n.element = f;
                                            break
                                        }
                                        f = (0, P.parentNode)(f)
                                    }
                                }
                            }
                        }
                    }
                };
                Qt.default = te;
                var ee = {};

                function ne(t) {
                    var e = t.prepared && t.prepared.name;
                    if (!e) return null;
                    var n = t.interactable.options;
                    return n[e].hold || n[e].delay
                }

                Object.defineProperty(ee, "__esModule", {value: !0}), ee.default = void 0;
                var re = {
                    id: "auto-start/hold", install: function (t) {
                        var e = t.defaults;
                        t.usePlugin(Yt.default), e.perAction.hold = 0, e.perAction.delay = 0
                    }, listeners: {
                        "interactions:new": function (t) {
                            t.interaction.autoStartHoldTimer = null
                        }, "autoStart:prepared": function (t) {
                            var e = t.interaction, n = ne(e);
                            n > 0 && (e.autoStartHoldTimer = setTimeout((function () {
                                e.start(e.prepared, e.interactable, e.element)
                            }), n))
                        }, "interactions:move": function (t) {
                            var e = t.interaction, n = t.duplicate;
                            e.autoStartHoldTimer && e.pointerWasMoved && !n && (clearTimeout(e.autoStartHoldTimer), e.autoStartHoldTimer = null)
                        }, "autoStart:before-start": function (t) {
                            var e = t.interaction;
                            ne(e) > 0 && (e.prepared.name = null)
                        }
                    }, getHoldDuration: ne
                }, oe = re;
                ee.default = oe;
                var ie = {};
                Object.defineProperty(ie, "__esModule", {value: !0}), ie.default = void 0;
                var ae = {
                    id: "auto-start", install: function (t) {
                        t.usePlugin(Yt.default), t.usePlugin(ee.default), t.usePlugin(Qt.default)
                    }
                };
                ie.default = ae;
                var se = {};

                function le(t) {
                    return /^(always|never|auto)$/.test(t) ? (this.options.preventDefault = t, this) : i.default.bool(t) ? (this.options.preventDefault = t ? "always" : "never", this) : this.options.preventDefault
                }

                function ce(t) {
                    var e = t.interaction, n = t.event;
                    e.interactable && e.interactable.checkAndPreventDefault(n)
                }

                function ue(t) {
                    var n = t.Interactable;
                    n.prototype.preventDefault = le, n.prototype.checkAndPreventDefault = function (n) {
                        return function (t, n, r) {
                            var o = t.options.preventDefault;
                            if ("never" !== o) if ("always" !== o) {
                                if (n.events.supportsPassive && /^touch(start|move)$/.test(r.type)) {
                                    var a = (0, e.getWindow)(r.target).document, s = n.getDocOptions(a);
                                    if (!s || !s.events || !1 !== s.events.passive) return
                                }
                                /^(mouse|pointer|touch)*(down|start)/i.test(r.type) || i.default.element(r.target) && (0, P.matchesSelector)(r.target, "input,select,textarea,[contenteditable=true],[contenteditable=true] *") || r.preventDefault()
                            } else r.preventDefault()
                        }(this, t, n)
                    }, t.interactions.docEvents.push({
                        type: "dragstart", listener: function (e) {
                            for (var n = 0; n < t.interactions.list.length; n++) {
                                var r = t.interactions.list[n];
                                if (r.element && (r.element === e.target || (0, P.nodeContains)(r.element, e.target))) return void r.interactable.checkAndPreventDefault(e)
                            }
                        }
                    })
                }

                Object.defineProperty(se, "__esModule", {value: !0}), se.default = void 0, se.install = ue;
                var de = {
                    id: "core/interactablePreventDefault",
                    install: ue,
                    listeners: ["down", "move", "up", "cancel"].reduce((function (t, e) {
                        return t["interactions:".concat(e)] = ce, t
                    }), {})
                };
                se.default = de;
                var fe = {};
                Object.defineProperty(fe, "__esModule", {value: !0}), fe.default = void 0, fe.default = {};
                var pe, ve = {};
                Object.defineProperty(ve, "__esModule", {value: !0}), ve.default = void 0, function (t) {
                    t.touchAction = "touchAction", t.boxSizing = "boxSizing", t.noListeners = "noListeners"
                }(pe || (pe = {})), pe.touchAction, pe.boxSizing, pe.noListeners, ve.default = {
                    id: "dev-tools",
                    install: function () {
                    }
                };
                var he = {};
                Object.defineProperty(he, "__esModule", {value: !0}), he.default = function t(e) {
                    var n = {};
                    for (var r in e) {
                        var o = e[r];
                        i.default.plainObject(o) ? n[r] = t(o) : i.default.array(o) ? n[r] = $.from(o) : n[r] = o
                    }
                    return n
                };
                var ge = {};

                function ye(t, e) {
                    return function (t) {
                        if (Array.isArray(t)) return t
                    }(t) || function (t, e) {
                        var n = null == t ? null : "undefined" != typeof Symbol && t[Symbol.iterator] || t["@@iterator"];
                        if (null != n) {
                            var r, o, i = [], a = !0, s = !1;
                            try {
                                for (n = n.call(t); !(a = (r = n.next()).done) && (i.push(r.value), !e || i.length !== e); a = !0) ;
                            } catch (t) {
                                s = !0, o = t
                            } finally {
                                try {
                                    a || null == n.return || n.return()
                                } finally {
                                    if (s) throw o
                                }
                            }
                            return i
                        }
                    }(t, e) || function (t, e) {
                        if (t) {
                            if ("string" == typeof t) return me(t, e);
                            var n = Object.prototype.toString.call(t).slice(8, -1);
                            return "Object" === n && t.constructor && (n = t.constructor.name), "Map" === n || "Set" === n ? Array.from(t) : "Arguments" === n || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n) ? me(t, e) : void 0
                        }
                    }(t, e) || function () {
                        throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")
                    }()
                }

                function me(t, e) {
                    (null == e || e > t.length) && (e = t.length);
                    for (var n = 0, r = Array(e); n < e; n++) r[n] = t[n];
                    return r
                }

                function be(t, e, n) {
                    return e in t ? Object.defineProperty(t, e, {
                        value: n,
                        enumerable: !0,
                        configurable: !0,
                        writable: !0
                    }) : t[e] = n, t
                }

                Object.defineProperty(ge, "__esModule", {value: !0}), ge.default = void 0, ge.getRectOffset = _e;
                var xe = function () {
                    function t(e) {
                        !function (t, e) {
                            if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function")
                        }(this, t), be(this, "states", []), be(this, "startOffset", {
                            left: 0,
                            right: 0,
                            top: 0,
                            bottom: 0
                        }), be(this, "startDelta", void 0), be(this, "result", void 0), be(this, "endResult", void 0), be(this, "edges", void 0), be(this, "interaction", void 0), this.interaction = e, this.result = we()
                    }

                    var e, n;
                    return e = t, (n = [{
                        key: "start", value: function (t, e) {
                            var n = t.phase, r = this.interaction, o = function (t) {
                                var e = t.interactable.options[t.prepared.name], n = e.modifiers;
                                return n && n.length ? n : ["snap", "snapSize", "snapEdges", "restrict", "restrictEdges", "restrictSize"].map((function (t) {
                                    var n = e[t];
                                    return n && n.enabled && {options: n, methods: n._methods}
                                })).filter((function (t) {
                                    return !!t
                                }))
                            }(r);
                            this.prepareStates(o), this.edges = (0, k.default)({}, r.edges), this.startOffset = _e(r.rect, e), this.startDelta = {
                                x: 0,
                                y: 0
                            };
                            var i = this.fillArg({phase: n, pageCoords: e, preEnd: !1});
                            return this.result = we(), this.startAll(i), this.result = this.setAll(i)
                        }
                    }, {
                        key: "fillArg", value: function (t) {
                            var e = this.interaction;
                            return t.interaction = e, t.interactable = e.interactable, t.element = e.element, t.rect = t.rect || e.rect, t.edges = this.edges, t.startOffset = this.startOffset, t
                        }
                    }, {
                        key: "startAll", value: function (t) {
                            for (var e = 0; e < this.states.length; e++) {
                                var n = this.states[e];
                                n.methods.start && (t.state = n, n.methods.start(t))
                            }
                        }
                    }, {
                        key: "setAll", value: function (t) {
                            var e = t.phase, n = t.preEnd, r = t.skipModifiers, o = t.rect;
                            t.coords = (0, k.default)({}, t.pageCoords), t.rect = (0, k.default)({}, o);
                            for (var i = r ? this.states.slice(r) : this.states, a = we(t.coords, t.rect), s = 0; s < i.length; s++) {
                                var l, c = i[s], u = c.options, d = (0, k.default)({}, t.coords), f = null;
                                null != (l = c.methods) && l.set && this.shouldDo(u, n, e) && (t.state = c, f = c.methods.set(t), I.addEdges(this.interaction.edges, t.rect, {
                                    x: t.coords.x - d.x,
                                    y: t.coords.y - d.y
                                })), a.eventProps.push(f)
                            }
                            a.delta.x = t.coords.x - t.pageCoords.x, a.delta.y = t.coords.y - t.pageCoords.y, a.rectDelta.left = t.rect.left - o.left, a.rectDelta.right = t.rect.right - o.right, a.rectDelta.top = t.rect.top - o.top, a.rectDelta.bottom = t.rect.bottom - o.bottom;
                            var p = this.result.coords, v = this.result.rect;
                            if (p && v) {
                                var h = a.rect.left !== v.left || a.rect.right !== v.right || a.rect.top !== v.top || a.rect.bottom !== v.bottom;
                                a.changed = h || p.x !== a.coords.x || p.y !== a.coords.y
                            }
                            return a
                        }
                    }, {
                        key: "applyToInteraction", value: function (t) {
                            var e = this.interaction, n = t.phase, r = e.coords.cur, o = e.coords.start,
                                i = this.result, a = this.startDelta, s = i.delta;
                            "start" === n && (0, k.default)(this.startDelta, i.delta);
                            for (var l = 0; l < [[o, a], [r, s]].length; l++) {
                                var c = ye([[o, a], [r, s]][l], 2), u = c[0], d = c[1];
                                u.page.x += d.x, u.page.y += d.y, u.client.x += d.x, u.client.y += d.y
                            }
                            var f = this.result.rectDelta, p = t.rect || e.rect;
                            p.left += f.left, p.right += f.right, p.top += f.top, p.bottom += f.bottom, p.width = p.right - p.left, p.height = p.bottom - p.top
                        }
                    }, {
                        key: "setAndApply", value: function (t) {
                            var e = this.interaction, n = t.phase, r = t.preEnd, o = t.skipModifiers,
                                i = this.setAll(this.fillArg({
                                    preEnd: r,
                                    phase: n,
                                    pageCoords: t.modifiedCoords || e.coords.cur.page
                                }));
                            if (this.result = i, !i.changed && (!o || o < this.states.length) && e.interacting()) return !1;
                            if (t.modifiedCoords) {
                                var a = e.coords.cur.page,
                                    s = {x: t.modifiedCoords.x - a.x, y: t.modifiedCoords.y - a.y};
                                i.coords.x += s.x, i.coords.y += s.y, i.delta.x += s.x, i.delta.y += s.y
                            }
                            this.applyToInteraction(t)
                        }
                    }, {
                        key: "beforeEnd", value: function (t) {
                            var e = t.interaction, n = t.event, r = this.states;
                            if (r && r.length) {
                                for (var o = !1, i = 0; i < r.length; i++) {
                                    var a = r[i];
                                    t.state = a;
                                    var s = a.options, l = a.methods, c = l.beforeEnd && l.beforeEnd(t);
                                    if (c) return this.endResult = c, !1;
                                    o = o || !o && this.shouldDo(s, !0, t.phase, !0)
                                }
                                o && e.move({event: n, preEnd: !0})
                            }
                        }
                    }, {
                        key: "stop", value: function (t) {
                            var e = t.interaction;
                            if (this.states && this.states.length) {
                                var n = (0, k.default)({
                                    states: this.states,
                                    interactable: e.interactable,
                                    element: e.element,
                                    rect: null
                                }, t);
                                this.fillArg(n);
                                for (var r = 0; r < this.states.length; r++) {
                                    var o = this.states[r];
                                    n.state = o, o.methods.stop && o.methods.stop(n)
                                }
                                this.states = null, this.endResult = null
                            }
                        }
                    }, {
                        key: "prepareStates", value: function (t) {
                            this.states = [];
                            for (var e = 0; e < t.length; e++) {
                                var n = t[e], r = n.options, o = n.methods, i = n.name;
                                this.states.push({options: r, methods: o, index: e, name: i})
                            }
                            return this.states
                        }
                    }, {
                        key: "restoreInteractionCoords", value: function (t) {
                            var e = t.interaction, n = e.coords, r = e.rect, o = e.modification;
                            if (o.result) {
                                for (var i = o.startDelta, a = o.result, s = a.delta, l = a.rectDelta, c = [[n.start, i], [n.cur, s]], u = 0; u < c.length; u++) {
                                    var d = ye(c[u], 2), f = d[0], p = d[1];
                                    f.page.x -= p.x, f.page.y -= p.y, f.client.x -= p.x, f.client.y -= p.y
                                }
                                r.left -= l.left, r.right -= l.right, r.top -= l.top, r.bottom -= l.bottom
                            }
                        }
                    }, {
                        key: "shouldDo", value: function (t, e, n, r) {
                            return !(!t || !1 === t.enabled || r && !t.endOnly || t.endOnly && !e || "start" === n && !t.setStart)
                        }
                    }, {
                        key: "copyFrom", value: function (t) {
                            this.startOffset = t.startOffset, this.startDelta = t.startDelta, this.edges = t.edges, this.states = t.states.map((function (t) {
                                return (0, he.default)(t)
                            })), this.result = we((0, k.default)({}, t.result.coords), (0, k.default)({}, t.result.rect))
                        }
                    }, {
                        key: "destroy", value: function () {
                            for (var t in this) this[t] = null
                        }
                    }]) && function (t, e) {
                        for (var n = 0; n < e.length; n++) {
                            var r = e[n];
                            r.enumerable = r.enumerable || !1, r.configurable = !0, "value" in r && (r.writable = !0), Object.defineProperty(t, r.key, r)
                        }
                    }(e.prototype, n), Object.defineProperty(e, "prototype", {writable: !1}), t
                }();

                function we(t, e) {
                    return {
                        rect: e,
                        coords: t,
                        delta: {x: 0, y: 0},
                        rectDelta: {left: 0, right: 0, top: 0, bottom: 0},
                        eventProps: [],
                        changed: !0
                    }
                }

                function _e(t, e) {
                    return t ? {
                        left: e.x - t.left,
                        top: e.y - t.top,
                        right: t.right - e.x,
                        bottom: t.bottom - e.y
                    } : {left: 0, top: 0, right: 0, bottom: 0}
                }

                ge.default = xe;
                var Pe = {};

                function Oe(t) {
                    var e = t.iEvent, n = t.interaction.modification.result;
                    n && (e.modifiers = n.eventProps)
                }

                Object.defineProperty(Pe, "__esModule", {value: !0}), Pe.addEventModifiers = Oe, Pe.default = void 0, Pe.makeModifier = function (t, e) {
                    var n = t.defaults, r = {start: t.start, set: t.set, beforeEnd: t.beforeEnd, stop: t.stop},
                        o = function (t) {
                            var o = t || {};
                            for (var i in o.enabled = !1 !== o.enabled, n) i in o || (o[i] = n[i]);
                            var a = {
                                options: o, methods: r, name: e, enable: function () {
                                    return o.enabled = !0, a
                                }, disable: function () {
                                    return o.enabled = !1, a
                                }
                            };
                            return a
                        };
                    return e && "string" == typeof e && (o._defaults = n, o._methods = r), o
                };
                var Ee = {
                    id: "modifiers/base", before: ["actions"], install: function (t) {
                        t.defaults.perAction.modifiers = []
                    }, listeners: {
                        "interactions:new": function (t) {
                            var e = t.interaction;
                            e.modification = new ge.default(e)
                        },
                        "interactions:before-action-start": function (t) {
                            var e = t.interaction.modification;
                            e.start(t, t.interaction.coords.start.page), t.interaction.edges = e.edges, e.applyToInteraction(t)
                        },
                        "interactions:before-action-move": function (t) {
                            return t.interaction.modification.setAndApply(t)
                        },
                        "interactions:before-action-end": function (t) {
                            return t.interaction.modification.beforeEnd(t)
                        },
                        "interactions:action-start": Oe,
                        "interactions:action-move": Oe,
                        "interactions:action-end": Oe,
                        "interactions:after-action-start": function (t) {
                            return t.interaction.modification.restoreInteractionCoords(t)
                        },
                        "interactions:after-action-move": function (t) {
                            return t.interaction.modification.restoreInteractionCoords(t)
                        },
                        "interactions:stop": function (t) {
                            return t.interaction.modification.stop(t)
                        }
                    }
                }, Se = Ee;
                Pe.default = Se;
                var Te = {};
                Object.defineProperty(Te, "__esModule", {value: !0}), Te.defaults = void 0, Te.defaults = {
                    base: {
                        preventDefault: "auto",
                        deltaSource: "page"
                    }, perAction: {enabled: !1, origin: {x: 0, y: 0}}, actions: {}
                };
                var je = {};

                function Me(t) {
                    return Me = "function" == typeof Symbol && "symbol" == a(Symbol.iterator) ? function (t) {
                        return a(t)
                    } : function (t) {
                        return t && "function" == typeof Symbol && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : a(t)
                    }, Me(t)
                }

                function ke(t, e) {
                    return ke = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function (t, e) {
                        return t.__proto__ = e, t
                    }, ke(t, e)
                }

                function Ie(t, e) {
                    if (e && ("object" === Me(e) || "function" == typeof e)) return e;
                    if (void 0 !== e) throw new TypeError("Derived constructors may only return object or undefined");
                    return Ae(t)
                }

                function Ae(t) {
                    if (void 0 === t) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
                    return t
                }

                function De(t) {
                    return De = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function (t) {
                        return t.__proto__ || Object.getPrototypeOf(t)
                    }, De(t)
                }

                function Ce(t, e, n) {
                    return e in t ? Object.defineProperty(t, e, {
                        value: n,
                        enumerable: !0,
                        configurable: !0,
                        writable: !0
                    }) : t[e] = n, t
                }

                Object.defineProperty(je, "__esModule", {value: !0}), je.InteractEvent = void 0;
                var ze = function (t) {
                    !function (t, e) {
                        if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function");
                        t.prototype = Object.create(e && e.prototype, {
                            constructor: {
                                value: t,
                                writable: !0,
                                configurable: !0
                            }
                        }), Object.defineProperty(t, "prototype", {writable: !1}), e && ke(t, e)
                    }(a, t);
                    var e, n, r, o, i = (r = a, o = function () {
                        if ("undefined" == typeof Reflect || !Reflect.construct) return !1;
                        if (Reflect.construct.sham) return !1;
                        if ("function" == typeof Proxy) return !0;
                        try {
                            return Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], (function () {
                            }))), !0
                        } catch (t) {
                            return !1
                        }
                    }(), function () {
                        var t, e = De(r);
                        if (o) {
                            var n = De(this).constructor;
                            t = Reflect.construct(e, arguments, n)
                        } else t = e.apply(this, arguments);
                        return Ie(this, t)
                    });

                    function a(t, e, n, r, o, s, l) {
                        var c;
                        !function (t, e) {
                            if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function")
                        }(this, a), Ce(Ae(c = i.call(this, t)), "relatedTarget", null), Ce(Ae(c), "screenX", void 0), Ce(Ae(c), "screenY", void 0), Ce(Ae(c), "button", void 0), Ce(Ae(c), "buttons", void 0), Ce(Ae(c), "ctrlKey", void 0), Ce(Ae(c), "shiftKey", void 0), Ce(Ae(c), "altKey", void 0), Ce(Ae(c), "metaKey", void 0), Ce(Ae(c), "page", void 0), Ce(Ae(c), "client", void 0), Ce(Ae(c), "delta", void 0), Ce(Ae(c), "rect", void 0), Ce(Ae(c), "x0", void 0), Ce(Ae(c), "y0", void 0), Ce(Ae(c), "t0", void 0), Ce(Ae(c), "dt", void 0), Ce(Ae(c), "duration", void 0), Ce(Ae(c), "clientX0", void 0), Ce(Ae(c), "clientY0", void 0), Ce(Ae(c), "velocity", void 0), Ce(Ae(c), "speed", void 0), Ce(Ae(c), "swipe", void 0), Ce(Ae(c), "axes", void 0), Ce(Ae(c), "preEnd", void 0), o = o || t.element;
                        var u = t.interactable, d = (u && u.options || Te.defaults).deltaSource,
                            f = (0, C.default)(u, o, n), p = "start" === r, v = "end" === r,
                            h = p ? Ae(c) : t.prevEvent, g = p ? t.coords.start : v ? {
                                page: h.page,
                                client: h.client,
                                timeStamp: t.coords.cur.timeStamp
                            } : t.coords.cur;
                        return c.page = (0, k.default)({}, g.page), c.client = (0, k.default)({}, g.client), c.rect = (0, k.default)({}, t.rect), c.timeStamp = g.timeStamp, v || (c.page.x -= f.x, c.page.y -= f.y, c.client.x -= f.x, c.client.y -= f.y), c.ctrlKey = e.ctrlKey, c.altKey = e.altKey, c.shiftKey = e.shiftKey, c.metaKey = e.metaKey, c.button = e.button, c.buttons = e.buttons, c.target = o, c.currentTarget = o, c.preEnd = s, c.type = l || n + (r || ""), c.interactable = u, c.t0 = p ? t.pointers[t.pointers.length - 1].downTime : h.t0, c.x0 = t.coords.start.page.x - f.x, c.y0 = t.coords.start.page.y - f.y, c.clientX0 = t.coords.start.client.x - f.x, c.clientY0 = t.coords.start.client.y - f.y, c.delta = p || v ? {
                            x: 0,
                            y: 0
                        } : {
                            x: c[d].x - h[d].x,
                            y: c[d].y - h[d].y
                        }, c.dt = t.coords.delta.timeStamp, c.duration = c.timeStamp - c.t0, c.velocity = (0, k.default)({}, t.coords.velocity[d]), c.speed = (0, F.default)(c.velocity.x, c.velocity.y), c.swipe = v || "inertiastart" === r ? c.getSwipe() : null, c
                    }

                    return e = a, (n = [{
                        key: "getSwipe", value: function () {
                            var t = this._interaction;
                            if (t.prevEvent.speed < 600 || this.timeStamp - t.prevEvent.timeStamp > 150) return null;
                            var e = 180 * Math.atan2(t.prevEvent.velocityY, t.prevEvent.velocityX) / Math.PI;
                            e < 0 && (e += 360);
                            var n = 112.5 <= e && e < 247.5, r = 202.5 <= e && e < 337.5;
                            return {
                                up: r,
                                down: !r && 22.5 <= e && e < 157.5,
                                left: n,
                                right: !n && (292.5 <= e || e < 67.5),
                                angle: e,
                                speed: t.prevEvent.speed,
                                velocity: {x: t.prevEvent.velocityX, y: t.prevEvent.velocityY}
                            }
                        }
                    }, {
                        key: "preventDefault", value: function () {
                        }
                    }, {
                        key: "stopImmediatePropagation", value: function () {
                            this.immediatePropagationStopped = this.propagationStopped = !0
                        }
                    }, {
                        key: "stopPropagation", value: function () {
                            this.propagationStopped = !0
                        }
                    }]) && function (t, e) {
                        for (var n = 0; n < e.length; n++) {
                            var r = e[n];
                            r.enumerable = r.enumerable || !1, r.configurable = !0, "value" in r && (r.writable = !0), Object.defineProperty(t, r.key, r)
                        }
                    }(e.prototype, n), Object.defineProperty(e, "prototype", {writable: !1}), a
                }(V.BaseEvent);
                je.InteractEvent = ze, Object.defineProperties(ze.prototype, {
                    pageX: {
                        get: function () {
                            return this.page.x
                        }, set: function (t) {
                            this.page.x = t
                        }
                    }, pageY: {
                        get: function () {
                            return this.page.y
                        }, set: function (t) {
                            this.page.y = t
                        }
                    }, clientX: {
                        get: function () {
                            return this.client.x
                        }, set: function (t) {
                            this.client.x = t
                        }
                    }, clientY: {
                        get: function () {
                            return this.client.y
                        }, set: function (t) {
                            this.client.y = t
                        }
                    }, dx: {
                        get: function () {
                            return this.delta.x
                        }, set: function (t) {
                            this.delta.x = t
                        }
                    }, dy: {
                        get: function () {
                            return this.delta.y
                        }, set: function (t) {
                            this.delta.y = t
                        }
                    }, velocityX: {
                        get: function () {
                            return this.velocity.x
                        }, set: function (t) {
                            this.velocity.x = t
                        }
                    }, velocityY: {
                        get: function () {
                            return this.velocity.y
                        }, set: function (t) {
                            this.velocity.y = t
                        }
                    }
                });
                var Re = {};

                function Fe(t, e, n) {
                    return e in t ? Object.defineProperty(t, e, {
                        value: n,
                        enumerable: !0,
                        configurable: !0,
                        writable: !0
                    }) : t[e] = n, t
                }

                Object.defineProperty(Re, "__esModule", {value: !0}), Re.PointerInfo = void 0;
                var Le = function (t, e, n) {
                    return Object.defineProperty(t, "prototype", {writable: !1}), t
                }((function t(e, n, r, o, i) {
                    !function (t, e) {
                        if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function")
                    }(this, t), Fe(this, "id", void 0), Fe(this, "pointer", void 0), Fe(this, "event", void 0), Fe(this, "downTime", void 0), Fe(this, "downTarget", void 0), this.id = e, this.pointer = n, this.event = r, this.downTime = o, this.downTarget = i
                }));
                Re.PointerInfo = Le;
                var Be, qe, Xe = {};

                function Ye(t, e, n) {
                    return e in t ? Object.defineProperty(t, e, {
                        value: n,
                        enumerable: !0,
                        configurable: !0,
                        writable: !0
                    }) : t[e] = n, t
                }

                Object.defineProperty(Xe, "__esModule", {value: !0}), Xe.Interaction = void 0, Object.defineProperty(Xe, "PointerInfo", {
                    enumerable: !0,
                    get: function () {
                        return Re.PointerInfo
                    }
                }), Xe.default = Xe._ProxyValues = Xe._ProxyMethods = void 0, Xe._ProxyValues = Be, function (t) {
                    t.interactable = "", t.element = "", t.prepared = "", t.pointerIsDown = "", t.pointerWasMoved = "", t._proxy = ""
                }(Be || (Xe._ProxyValues = Be = {})), Xe._ProxyMethods = qe, function (t) {
                    t.start = "", t.move = "", t.end = "", t.stop = "", t.interacting = ""
                }(qe || (Xe._ProxyMethods = qe = {}));
                var Ne = 0, We = function () {
                    function t(e) {
                        var n = this, r = e.pointerType, o = e.scopeFire;
                        !function (t, e) {
                            if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function")
                        }(this, t), Ye(this, "interactable", null), Ye(this, "element", null), Ye(this, "rect", null), Ye(this, "_rects", void 0), Ye(this, "edges", null), Ye(this, "_scopeFire", void 0), Ye(this, "prepared", {
                            name: null,
                            axis: null,
                            edges: null
                        }), Ye(this, "pointerType", void 0), Ye(this, "pointers", []), Ye(this, "downEvent", null), Ye(this, "downPointer", {}), Ye(this, "_latestPointer", {
                            pointer: null,
                            event: null,
                            eventTarget: null
                        }), Ye(this, "prevEvent", null), Ye(this, "pointerIsDown", !1), Ye(this, "pointerWasMoved", !1), Ye(this, "_interacting", !1), Ye(this, "_ending", !1), Ye(this, "_stopped", !0), Ye(this, "_proxy", null), Ye(this, "simulation", null), Ye(this, "doMove", (0, Ft.warnOnce)((function (t) {
                            this.move(t)
                        }), "The interaction.doMove() method has been renamed to interaction.move()")), Ye(this, "coords", {
                            start: B.newCoords(),
                            prev: B.newCoords(),
                            cur: B.newCoords(),
                            delta: B.newCoords(),
                            velocity: B.newCoords()
                        }), Ye(this, "_id", Ne++), this._scopeFire = o, this.pointerType = r;
                        var i = this;
                        this._proxy = {};
                        var a = function (t) {
                            Object.defineProperty(n._proxy, t, {
                                get: function () {
                                    return i[t]
                                }
                            })
                        };
                        for (var s in Be) a(s);
                        var l = function (t) {
                            Object.defineProperty(n._proxy, t, {
                                value: function () {
                                    return i[t].apply(i, arguments)
                                }
                            })
                        };
                        for (var c in qe) l(c);
                        this._scopeFire("interactions:new", {interaction: this})
                    }

                    var e, n;
                    return e = t, n = [{
                        key: "pointerMoveTolerance", get: function () {
                            return 1
                        }
                    }, {
                        key: "pointerDown", value: function (t, e, n) {
                            var r = this.updatePointer(t, e, n, !0), o = this.pointers[r];
                            this._scopeFire("interactions:down", {
                                pointer: t,
                                event: e,
                                eventTarget: n,
                                pointerIndex: r,
                                pointerInfo: o,
                                type: "down",
                                interaction: this
                            })
                        }
                    }, {
                        key: "start", value: function (t, e, n) {
                            return !(this.interacting() || !this.pointerIsDown || this.pointers.length < ("gesture" === t.name ? 2 : 1) || !e.options[t.name].enabled) && ((0, Ft.copyAction)(this.prepared, t), this.interactable = e, this.element = n, this.rect = e.getRect(n), this.edges = this.prepared.edges ? (0, k.default)({}, this.prepared.edges) : {
                                left: !0,
                                right: !0,
                                top: !0,
                                bottom: !0
                            }, this._stopped = !1, this._interacting = this._doPhase({
                                interaction: this,
                                event: this.downEvent,
                                phase: "start"
                            }) && !this._stopped, this._interacting)
                        }
                    }, {
                        key: "pointerMove", value: function (t, e, n) {
                            this.simulation || this.modification && this.modification.endResult || this.updatePointer(t, e, n, !1);
                            var r, o,
                                i = this.coords.cur.page.x === this.coords.prev.page.x && this.coords.cur.page.y === this.coords.prev.page.y && this.coords.cur.client.x === this.coords.prev.client.x && this.coords.cur.client.y === this.coords.prev.client.y;
                            this.pointerIsDown && !this.pointerWasMoved && (r = this.coords.cur.client.x - this.coords.start.client.x, o = this.coords.cur.client.y - this.coords.start.client.y, this.pointerWasMoved = (0, F.default)(r, o) > this.pointerMoveTolerance);
                            var a = this.getPointerIndex(t), s = {
                                pointer: t,
                                pointerIndex: a,
                                pointerInfo: this.pointers[a],
                                event: e,
                                type: "move",
                                eventTarget: n,
                                dx: r,
                                dy: o,
                                duplicate: i,
                                interaction: this
                            };
                            i || B.setCoordVelocity(this.coords.velocity, this.coords.delta), this._scopeFire("interactions:move", s), i || this.simulation || (this.interacting() && (s.type = null, this.move(s)), this.pointerWasMoved && B.copyCoords(this.coords.prev, this.coords.cur))
                        }
                    }, {
                        key: "move", value: function (t) {
                            t && t.event || B.setZeroCoords(this.coords.delta), (t = (0, k.default)({
                                pointer: this._latestPointer.pointer,
                                event: this._latestPointer.event,
                                eventTarget: this._latestPointer.eventTarget,
                                interaction: this
                            }, t || {})).phase = "move", this._doPhase(t)
                        }
                    }, {
                        key: "pointerUp", value: function (t, e, n, r) {
                            var o = this.getPointerIndex(t);
                            -1 === o && (o = this.updatePointer(t, e, n, !1));
                            var i = /cancel$/i.test(e.type) ? "cancel" : "up";
                            this._scopeFire("interactions:".concat(i), {
                                pointer: t,
                                pointerIndex: o,
                                pointerInfo: this.pointers[o],
                                event: e,
                                eventTarget: n,
                                type: i,
                                curEventTarget: r,
                                interaction: this
                            }), this.simulation || this.end(e), this.removePointer(t, e)
                        }
                    }, {
                        key: "documentBlur", value: function (t) {
                            this.end(t), this._scopeFire("interactions:blur", {
                                event: t,
                                type: "blur",
                                interaction: this
                            })
                        }
                    }, {
                        key: "end", value: function (t) {
                            var e;
                            this._ending = !0, t = t || this._latestPointer.event, this.interacting() && (e = this._doPhase({
                                event: t,
                                interaction: this,
                                phase: "end"
                            })), this._ending = !1, !0 === e && this.stop()
                        }
                    }, {
                        key: "currentAction", value: function () {
                            return this._interacting ? this.prepared.name : null
                        }
                    }, {
                        key: "interacting", value: function () {
                            return this._interacting
                        }
                    }, {
                        key: "stop", value: function () {
                            this._scopeFire("interactions:stop", {interaction: this}), this.interactable = this.element = null, this._interacting = !1, this._stopped = !0, this.prepared.name = this.prevEvent = null
                        }
                    }, {
                        key: "getPointerIndex", value: function (t) {
                            var e = B.getPointerId(t);
                            return "mouse" === this.pointerType || "pen" === this.pointerType ? this.pointers.length - 1 : $.findIndex(this.pointers, (function (t) {
                                return t.id === e
                            }))
                        }
                    }, {
                        key: "getPointerInfo", value: function (t) {
                            return this.pointers[this.getPointerIndex(t)]
                        }
                    }, {
                        key: "updatePointer", value: function (t, e, n, r) {
                            var o = B.getPointerId(t), i = this.getPointerIndex(t), a = this.pointers[i];
                            return r = !1 !== r && (r || /(down|start)$/i.test(e.type)), a ? a.pointer = t : (a = new Re.PointerInfo(o, t, e, null, null), i = this.pointers.length, this.pointers.push(a)), B.setCoords(this.coords.cur, this.pointers.map((function (t) {
                                return t.pointer
                            })), this._now()), B.setCoordDeltas(this.coords.delta, this.coords.prev, this.coords.cur), r && (this.pointerIsDown = !0, a.downTime = this.coords.cur.timeStamp, a.downTarget = n, B.pointerExtend(this.downPointer, t), this.interacting() || (B.copyCoords(this.coords.start, this.coords.cur), B.copyCoords(this.coords.prev, this.coords.cur), this.downEvent = e, this.pointerWasMoved = !1)), this._updateLatestPointer(t, e, n), this._scopeFire("interactions:update-pointer", {
                                pointer: t,
                                event: e,
                                eventTarget: n,
                                down: r,
                                pointerInfo: a,
                                pointerIndex: i,
                                interaction: this
                            }), i
                        }
                    }, {
                        key: "removePointer", value: function (t, e) {
                            var n = this.getPointerIndex(t);
                            if (-1 !== n) {
                                var r = this.pointers[n];
                                this._scopeFire("interactions:remove-pointer", {
                                    pointer: t,
                                    event: e,
                                    eventTarget: null,
                                    pointerIndex: n,
                                    pointerInfo: r,
                                    interaction: this
                                }), this.pointers.splice(n, 1), this.pointerIsDown = !1
                            }
                        }
                    }, {
                        key: "_updateLatestPointer", value: function (t, e, n) {
                            this._latestPointer.pointer = t, this._latestPointer.event = e, this._latestPointer.eventTarget = n
                        }
                    }, {
                        key: "destroy", value: function () {
                            this._latestPointer.pointer = null, this._latestPointer.event = null, this._latestPointer.eventTarget = null
                        }
                    }, {
                        key: "_createPreparedEvent", value: function (t, e, n, r) {
                            return new je.InteractEvent(this, t, this.prepared.name, e, this.element, n, r)
                        }
                    }, {
                        key: "_fireEvent", value: function (t) {
                            var e;
                            null == (e = this.interactable) || e.fire(t), (!this.prevEvent || t.timeStamp >= this.prevEvent.timeStamp) && (this.prevEvent = t)
                        }
                    }, {
                        key: "_doPhase", value: function (t) {
                            var e = t.event, n = t.phase, r = t.preEnd, o = t.type, i = this.rect;
                            if (i && "move" === n && (I.addEdges(this.edges, i, this.coords.delta[this.interactable.options.deltaSource]), i.width = i.right - i.left, i.height = i.bottom - i.top), !1 === this._scopeFire("interactions:before-action-".concat(n), t)) return !1;
                            var a = t.iEvent = this._createPreparedEvent(e, n, r, o);
                            return this._scopeFire("interactions:action-".concat(n), t), "start" === n && (this.prevEvent = a), this._fireEvent(a), this._scopeFire("interactions:after-action-".concat(n), t), !0
                        }
                    }, {
                        key: "_now", value: function () {
                            return Date.now()
                        }
                    }], n && function (t, e) {
                        for (var n = 0; n < e.length; n++) {
                            var r = e[n];
                            r.enumerable = r.enumerable || !1, r.configurable = !0, "value" in r && (r.writable = !0), Object.defineProperty(t, r.key, r)
                        }
                    }(e.prototype, n), Object.defineProperty(e, "prototype", {writable: !1}), t
                }();
                Xe.Interaction = We;
                var Ue = We;
                Xe.default = Ue;
                var Ve = {};

                function He(t) {
                    t.pointerIsDown && (Ze(t.coords.cur, t.offset.total), t.offset.pending.x = 0, t.offset.pending.y = 0)
                }

                function Ge(t) {
                    $e(t.interaction)
                }

                function $e(t) {
                    if (!function (t) {
                        return !(!t.offset.pending.x && !t.offset.pending.y)
                    }(t)) return !1;
                    var e = t.offset.pending;
                    return Ze(t.coords.cur, e), Ze(t.coords.delta, e), I.addEdges(t.edges, t.rect, e), e.x = 0, e.y = 0, !0
                }

                function Ke(t) {
                    var e = t.x, n = t.y;
                    this.offset.pending.x += e, this.offset.pending.y += n, this.offset.total.x += e, this.offset.total.y += n
                }

                function Ze(t, e) {
                    var n = t.page, r = t.client, o = e.x, i = e.y;
                    n.x += o, n.y += i, r.x += o, r.y += i
                }

                Object.defineProperty(Ve, "__esModule", {value: !0}), Ve.addTotal = He, Ve.applyPending = $e, Ve.default = void 0, Xe._ProxyMethods.offsetBy = "";
                var Je = {
                    id: "offset",
                    before: ["modifiers", "pointer-events", "actions", "inertia"],
                    install: function (t) {
                        t.Interaction.prototype.offsetBy = Ke
                    },
                    listeners: {
                        "interactions:new": function (t) {
                            t.interaction.offset = {total: {x: 0, y: 0}, pending: {x: 0, y: 0}}
                        },
                        "interactions:update-pointer": function (t) {
                            return He(t.interaction)
                        },
                        "interactions:before-action-start": Ge,
                        "interactions:before-action-move": Ge,
                        "interactions:before-action-end": function (t) {
                            var e = t.interaction;
                            if ($e(e)) return e.move({offset: !0}), e.end(), !1
                        },
                        "interactions:stop": function (t) {
                            var e = t.interaction;
                            e.offset.total.x = 0, e.offset.total.y = 0, e.offset.pending.x = 0, e.offset.pending.y = 0
                        }
                    }
                }, Qe = Je;
                Ve.default = Qe;
                var tn = {};

                function en(t, e, n) {
                    return e in t ? Object.defineProperty(t, e, {
                        value: n,
                        enumerable: !0,
                        configurable: !0,
                        writable: !0
                    }) : t[e] = n, t
                }

                Object.defineProperty(tn, "__esModule", {value: !0}), tn.default = tn.InertiaState = void 0;
                var nn = function () {
                    function t(e) {
                        !function (t, e) {
                            if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function")
                        }(this, t), en(this, "active", !1), en(this, "isModified", !1), en(this, "smoothEnd", !1), en(this, "allowResume", !1), en(this, "modification", void 0), en(this, "modifierCount", 0), en(this, "modifierArg", void 0), en(this, "startCoords", void 0), en(this, "t0", 0), en(this, "v0", 0), en(this, "te", 0), en(this, "targetOffset", void 0), en(this, "modifiedOffset", void 0), en(this, "currentOffset", void 0), en(this, "lambda_v0", 0), en(this, "one_ve_v0", 0), en(this, "timeout", void 0), en(this, "interaction", void 0), this.interaction = e
                    }

                    var e, n;
                    return e = t, (n = [{
                        key: "start", value: function (t) {
                            var e = this.interaction, n = rn(e);
                            if (!n || !n.enabled) return !1;
                            var r = e.coords.velocity.client, o = (0, F.default)(r.x, r.y),
                                i = this.modification || (this.modification = new ge.default(e));
                            if (i.copyFrom(e.modification), this.t0 = e._now(), this.allowResume = n.allowResume, this.v0 = o, this.currentOffset = {
                                x: 0,
                                y: 0
                            }, this.startCoords = e.coords.cur.page, this.modifierArg = i.fillArg({
                                pageCoords: this.startCoords,
                                preEnd: !0,
                                phase: "inertiastart"
                            }), this.t0 - e.coords.cur.timeStamp < 50 && o > n.minSpeed && o > n.endSpeed) this.startInertia(); else {
                                if (i.result = i.setAll(this.modifierArg), !i.result.changed) return !1;
                                this.startSmoothEnd()
                            }
                            return e.modification.result.rect = null, e.offsetBy(this.targetOffset), e._doPhase({
                                interaction: e,
                                event: t,
                                phase: "inertiastart"
                            }), e.offsetBy({
                                x: -this.targetOffset.x,
                                y: -this.targetOffset.y
                            }), e.modification.result.rect = null, this.active = !0, e.simulation = this, !0
                        }
                    }, {
                        key: "startInertia", value: function () {
                            var t = this, e = this.interaction.coords.velocity.client, n = rn(this.interaction),
                                r = n.resistance, o = -Math.log(n.endSpeed / this.v0) / r;
                            this.targetOffset = {
                                x: (e.x - o) / r,
                                y: (e.y - o) / r
                            }, this.te = o, this.lambda_v0 = r / this.v0, this.one_ve_v0 = 1 - n.endSpeed / this.v0;
                            var i = this.modification, a = this.modifierArg;
                            a.pageCoords = {
                                x: this.startCoords.x + this.targetOffset.x,
                                y: this.startCoords.y + this.targetOffset.y
                            }, i.result = i.setAll(a), i.result.changed && (this.isModified = !0, this.modifiedOffset = {
                                x: this.targetOffset.x + i.result.delta.x,
                                y: this.targetOffset.y + i.result.delta.y
                            }), this.onNextFrame((function () {
                                return t.inertiaTick()
                            }))
                        }
                    }, {
                        key: "startSmoothEnd", value: function () {
                            var t = this;
                            this.smoothEnd = !0, this.isModified = !0, this.targetOffset = {
                                x: this.modification.result.delta.x,
                                y: this.modification.result.delta.y
                            }, this.onNextFrame((function () {
                                return t.smoothEndTick()
                            }))
                        }
                    }, {
                        key: "onNextFrame", value: function (t) {
                            var e = this;
                            this.timeout = St.default.request((function () {
                                e.active && t()
                            }))
                        }
                    }, {
                        key: "inertiaTick", value: function () {
                            var t, e, n, r, o, i = this, a = this.interaction, s = rn(a).resistance,
                                l = (a._now() - this.t0) / 1e3;
                            if (l < this.te) {
                                var c, u = 1 - (Math.exp(-s * l) - this.lambda_v0) / this.one_ve_v0;
                                this.isModified ? (t = this.targetOffset.x, e = this.targetOffset.y, n = this.modifiedOffset.x, r = this.modifiedOffset.y, c = {
                                    x: an(o = u, 0, t, n),
                                    y: an(o, 0, e, r)
                                }) : c = {x: this.targetOffset.x * u, y: this.targetOffset.y * u};
                                var d = {x: c.x - this.currentOffset.x, y: c.y - this.currentOffset.y};
                                this.currentOffset.x += d.x, this.currentOffset.y += d.y, a.offsetBy(d), a.move(), this.onNextFrame((function () {
                                    return i.inertiaTick()
                                }))
                            } else a.offsetBy({
                                x: this.modifiedOffset.x - this.currentOffset.x,
                                y: this.modifiedOffset.y - this.currentOffset.y
                            }), this.end()
                        }
                    }, {
                        key: "smoothEndTick", value: function () {
                            var t = this, e = this.interaction, n = e._now() - this.t0, r = rn(e).smoothEndDuration;
                            if (n < r) {
                                var o = {x: sn(n, 0, this.targetOffset.x, r), y: sn(n, 0, this.targetOffset.y, r)},
                                    i = {x: o.x - this.currentOffset.x, y: o.y - this.currentOffset.y};
                                this.currentOffset.x += i.x, this.currentOffset.y += i.y, e.offsetBy(i), e.move({skipModifiers: this.modifierCount}), this.onNextFrame((function () {
                                    return t.smoothEndTick()
                                }))
                            } else e.offsetBy({
                                x: this.targetOffset.x - this.currentOffset.x,
                                y: this.targetOffset.y - this.currentOffset.y
                            }), this.end()
                        }
                    }, {
                        key: "resume", value: function (t) {
                            var e = t.pointer, n = t.event, r = t.eventTarget, o = this.interaction;
                            o.offsetBy({
                                x: -this.currentOffset.x,
                                y: -this.currentOffset.y
                            }), o.updatePointer(e, n, r, !0), o._doPhase({
                                interaction: o,
                                event: n,
                                phase: "resume"
                            }), (0, B.copyCoords)(o.coords.prev, o.coords.cur), this.stop()
                        }
                    }, {
                        key: "end", value: function () {
                            this.interaction.move(), this.interaction.end(), this.stop()
                        }
                    }, {
                        key: "stop", value: function () {
                            this.active = this.smoothEnd = !1, this.interaction.simulation = null, St.default.cancel(this.timeout)
                        }
                    }]) && function (t, e) {
                        for (var n = 0; n < e.length; n++) {
                            var r = e[n];
                            r.enumerable = r.enumerable || !1, r.configurable = !0, "value" in r && (r.writable = !0), Object.defineProperty(t, r.key, r)
                        }
                    }(e.prototype, n), Object.defineProperty(e, "prototype", {writable: !1}), t
                }();

                function rn(t) {
                    var e = t.interactable, n = t.prepared;
                    return e && e.options && n.name && e.options[n.name].inertia
                }

                tn.InertiaState = nn;
                var on = {
                    id: "inertia", before: ["modifiers", "actions"], install: function (t) {
                        var e = t.defaults;
                        t.usePlugin(Ve.default), t.usePlugin(Pe.default), t.actions.phases.inertiastart = !0, t.actions.phases.resume = !0, e.perAction.inertia = {
                            enabled: !1,
                            resistance: 10,
                            minSpeed: 100,
                            endSpeed: 10,
                            allowResume: !0,
                            smoothEndDuration: 300
                        }
                    }, listeners: {
                        "interactions:new": function (t) {
                            var e = t.interaction;
                            e.inertia = new nn(e)
                        },
                        "interactions:before-action-end": function (t) {
                            var e = t.interaction, n = t.event;
                            return (!e._interacting || e.simulation || !e.inertia.start(n)) && null
                        },
                        "interactions:down": function (t) {
                            var e = t.interaction, n = t.eventTarget, r = e.inertia;
                            if (r.active) for (var o = n; i.default.element(o);) {
                                if (o === e.element) {
                                    r.resume(t);
                                    break
                                }
                                o = P.parentNode(o)
                            }
                        },
                        "interactions:stop": function (t) {
                            var e = t.interaction.inertia;
                            e.active && e.stop()
                        },
                        "interactions:before-action-resume": function (t) {
                            var e = t.interaction.modification;
                            e.stop(t), e.start(t, t.interaction.coords.cur.page), e.applyToInteraction(t)
                        },
                        "interactions:before-action-inertiastart": function (t) {
                            return t.interaction.modification.setAndApply(t)
                        },
                        "interactions:action-resume": Pe.addEventModifiers,
                        "interactions:action-inertiastart": Pe.addEventModifiers,
                        "interactions:after-action-inertiastart": function (t) {
                            return t.interaction.modification.restoreInteractionCoords(t)
                        },
                        "interactions:after-action-resume": function (t) {
                            return t.interaction.modification.restoreInteractionCoords(t)
                        }
                    }
                };

                function an(t, e, n, r) {
                    var o = 1 - t;
                    return o * o * e + 2 * o * t * n + t * t * r
                }

                function sn(t, e, n, r) {
                    return -n * (t /= r) * (t - 2) + e
                }

                var ln = on;
                tn.default = ln;
                var cn = {};

                function un(t, e, n) {
                    return e in t ? Object.defineProperty(t, e, {
                        value: n,
                        enumerable: !0,
                        configurable: !0,
                        writable: !0
                    }) : t[e] = n, t
                }

                function dn(t, e) {
                    for (var n = 0; n < e.length; n++) {
                        var r = e[n];
                        if (t.immediatePropagationStopped) break;
                        r(t)
                    }
                }

                Object.defineProperty(cn, "__esModule", {value: !0}), cn.Eventable = void 0;
                var fn = function () {
                    function t(e) {
                        !function (t, e) {
                            if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function")
                        }(this, t), un(this, "options", void 0), un(this, "types", {}), un(this, "propagationStopped", !1), un(this, "immediatePropagationStopped", !1), un(this, "global", void 0), this.options = (0, k.default)({}, e || {})
                    }

                    var e, n;
                    return e = t, (n = [{
                        key: "fire", value: function (t) {
                            var e, n = this.global;
                            (e = this.types[t.type]) && dn(t, e), !t.propagationStopped && n && (e = n[t.type]) && dn(t, e)
                        }
                    }, {
                        key: "on", value: function (t, e) {
                            var n = (0, z.default)(t, e);
                            for (t in n) this.types[t] = $.merge(this.types[t] || [], n[t])
                        }
                    }, {
                        key: "off", value: function (t, e) {
                            var n = (0, z.default)(t, e);
                            for (t in n) {
                                var r = this.types[t];
                                if (r && r.length) for (var o = 0; o < n[t].length; o++) {
                                    var i = n[t][o], a = r.indexOf(i);
                                    -1 !== a && r.splice(a, 1)
                                }
                            }
                        }
                    }, {
                        key: "getRect", value: function (t) {
                            return null
                        }
                    }]) && function (t, e) {
                        for (var n = 0; n < e.length; n++) {
                            var r = e[n];
                            r.enumerable = r.enumerable || !1, r.configurable = !0, "value" in r && (r.writable = !0), Object.defineProperty(t, r.key, r)
                        }
                    }(e.prototype, n), Object.defineProperty(e, "prototype", {writable: !1}), t
                }();
                cn.Eventable = fn;
                var pn = {};
                Object.defineProperty(pn, "__esModule", {value: !0}), pn.default = function (t, e) {
                    if (e.phaselessTypes[t]) return !0;
                    for (var n in e.map) if (0 === t.indexOf(n) && t.substr(n.length) in e.phases) return !0;
                    return !1
                };
                var vn = {};
                Object.defineProperty(vn, "__esModule", {value: !0}), vn.createInteractStatic = function (t) {
                    var e = function e(n, r) {
                        var o = t.interactables.get(n, r);
                        return o || ((o = t.interactables.new(n, r)).events.global = e.globalEvents), o
                    };
                    return e.getPointerAverage = B.pointerAverage, e.getTouchBBox = B.touchBBox, e.getTouchDistance = B.touchDistance, e.getTouchAngle = B.touchAngle, e.getElementRect = P.getElementRect, e.getElementClientRect = P.getElementClientRect, e.matchesSelector = P.matchesSelector, e.closest = P.closest, e.globalEvents = {}, e.version = "1.10.17", e.scope = t, e.use = function (t, e) {
                        return this.scope.usePlugin(t, e), this
                    }, e.isSet = function (t, e) {
                        return !!this.scope.interactables.get(t, e && e.context)
                    }, e.on = (0, Ft.warnOnce)((function (t, e, n) {
                        if (i.default.string(t) && -1 !== t.search(" ") && (t = t.trim().split(/ +/)), i.default.array(t)) {
                            for (var r = 0; r < t.length; r++) {
                                var o = t[r];
                                this.on(o, e, n)
                            }
                            return this
                        }
                        if (i.default.object(t)) {
                            for (var a in t) this.on(a, t[a], e);
                            return this
                        }
                        return (0, pn.default)(t, this.scope.actions) ? this.globalEvents[t] ? this.globalEvents[t].push(e) : this.globalEvents[t] = [e] : this.scope.events.add(this.scope.document, t, e, {options: n}), this
                    }), "The interact.on() method is being deprecated"), e.off = (0, Ft.warnOnce)((function (t, e, n) {
                        if (i.default.string(t) && -1 !== t.search(" ") && (t = t.trim().split(/ +/)), i.default.array(t)) {
                            for (var r = 0; r < t.length; r++) {
                                var o = t[r];
                                this.off(o, e, n)
                            }
                            return this
                        }
                        if (i.default.object(t)) {
                            for (var a in t) this.off(a, t[a], e);
                            return this
                        }
                        var s;
                        return (0, pn.default)(t, this.scope.actions) ? t in this.globalEvents && -1 !== (s = this.globalEvents[t].indexOf(e)) && this.globalEvents[t].splice(s, 1) : this.scope.events.remove(this.scope.document, t, e, n), this
                    }), "The interact.off() method is being deprecated"), e.debug = function () {
                        return this.scope
                    }, e.supportsTouch = function () {
                        return x.default.supportsTouch
                    }, e.supportsPointerEvent = function () {
                        return x.default.supportsPointerEvent
                    }, e.stop = function () {
                        for (var t = 0; t < this.scope.interactions.list.length; t++) this.scope.interactions.list[t].stop();
                        return this
                    }, e.pointerMoveTolerance = function (t) {
                        return i.default.number(t) ? (this.scope.interactions.pointerMoveTolerance = t, this) : this.scope.interactions.pointerMoveTolerance
                    }, e.addDocument = function (t, e) {
                        this.scope.addDocument(t, e)
                    }, e.removeDocument = function (t) {
                        this.scope.removeDocument(t)
                    }, e
                };
                var hn = {};

                function gn(t, e, n) {
                    return e in t ? Object.defineProperty(t, e, {
                        value: n,
                        enumerable: !0,
                        configurable: !0,
                        writable: !0
                    }) : t[e] = n, t
                }

                Object.defineProperty(hn, "__esModule", {value: !0}), hn.Interactable = void 0;
                var yn = function () {
                    function t(n, r, o, i) {
                        !function (t, e) {
                            if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function")
                        }(this, t), gn(this, "options", void 0), gn(this, "_actions", void 0), gn(this, "target", void 0), gn(this, "events", new cn.Eventable), gn(this, "_context", void 0), gn(this, "_win", void 0), gn(this, "_doc", void 0), gn(this, "_scopeEvents", void 0), gn(this, "_rectChecker", void 0), this._actions = r.actions, this.target = n, this._context = r.context || o, this._win = (0, e.getWindow)((0, P.trySelector)(n) ? this._context : n), this._doc = this._win.document, this._scopeEvents = i, this.set(r)
                    }

                    var n, r;
                    return n = t, (r = [{
                        key: "_defaults", get: function () {
                            return {base: {}, perAction: {}, actions: {}}
                        }
                    }, {
                        key: "setOnEvents", value: function (t, e) {
                            return i.default.func(e.onstart) && this.on("".concat(t, "start"), e.onstart), i.default.func(e.onmove) && this.on("".concat(t, "move"), e.onmove), i.default.func(e.onend) && this.on("".concat(t, "end"), e.onend), i.default.func(e.oninertiastart) && this.on("".concat(t, "inertiastart"), e.oninertiastart), this
                        }
                    }, {
                        key: "updatePerActionListeners", value: function (t, e, n) {
                            (i.default.array(e) || i.default.object(e)) && this.off(t, e), (i.default.array(n) || i.default.object(n)) && this.on(t, n)
                        }
                    }, {
                        key: "setPerAction", value: function (t, e) {
                            var n = this._defaults;
                            for (var r in e) {
                                var o = r, a = this.options[t], s = e[o];
                                "listeners" === o && this.updatePerActionListeners(t, a.listeners, s), i.default.array(s) ? a[o] = $.from(s) : i.default.plainObject(s) ? (a[o] = (0, k.default)(a[o] || {}, (0, he.default)(s)), i.default.object(n.perAction[o]) && "enabled" in n.perAction[o] && (a[o].enabled = !1 !== s.enabled)) : i.default.bool(s) && i.default.object(n.perAction[o]) ? a[o].enabled = s : a[o] = s
                            }
                        }
                    }, {
                        key: "getRect", value: function (t) {
                            return t = t || (i.default.element(this.target) ? this.target : null), i.default.string(this.target) && (t = t || this._context.querySelector(this.target)), (0, P.getElementRect)(t)
                        }
                    }, {
                        key: "rectChecker", value: function (t) {
                            var e = this;
                            return i.default.func(t) ? (this._rectChecker = t, this.getRect = function (t) {
                                var n = (0, k.default)({}, e._rectChecker(t));
                                return "width" in n || (n.width = n.right - n.left, n.height = n.bottom - n.top), n
                            }, this) : null === t ? (delete this.getRect, delete this._rectChecker, this) : this.getRect
                        }
                    }, {
                        key: "_backCompatOption", value: function (t, e) {
                            if ((0, P.trySelector)(e) || i.default.object(e)) {
                                for (var n in this.options[t] = e, this._actions.map) this.options[n][t] = e;
                                return this
                            }
                            return this.options[t]
                        }
                    }, {
                        key: "origin", value: function (t) {
                            return this._backCompatOption("origin", t)
                        }
                    }, {
                        key: "deltaSource", value: function (t) {
                            return "page" === t || "client" === t ? (this.options.deltaSource = t, this) : this.options.deltaSource
                        }
                    }, {
                        key: "context", value: function () {
                            return this._context
                        }
                    }, {
                        key: "inContext", value: function (t) {
                            return this._context === t.ownerDocument || (0, P.nodeContains)(this._context, t)
                        }
                    }, {
                        key: "testIgnoreAllow", value: function (t, e, n) {
                            return !this.testIgnore(t.ignoreFrom, e, n) && this.testAllow(t.allowFrom, e, n)
                        }
                    }, {
                        key: "testAllow", value: function (t, e, n) {
                            return !t || !!i.default.element(n) && (i.default.string(t) ? (0, P.matchesUpTo)(n, t, e) : !!i.default.element(t) && (0, P.nodeContains)(t, n))
                        }
                    }, {
                        key: "testIgnore", value: function (t, e, n) {
                            return !(!t || !i.default.element(n)) && (i.default.string(t) ? (0, P.matchesUpTo)(n, t, e) : !!i.default.element(t) && (0, P.nodeContains)(t, n))
                        }
                    }, {
                        key: "fire", value: function (t) {
                            return this.events.fire(t), this
                        }
                    }, {
                        key: "_onOff", value: function (t, e, n, r) {
                            i.default.object(e) && !i.default.array(e) && (r = n, n = null);
                            var o = "on" === t ? "add" : "remove", a = (0, z.default)(e, n);
                            for (var s in a) {
                                "wheel" === s && (s = x.default.wheelEvent);
                                for (var l = 0; l < a[s].length; l++) {
                                    var c = a[s][l];
                                    (0, pn.default)(s, this._actions) ? this.events[t](s, c) : i.default.string(this.target) ? this._scopeEvents["".concat(o, "Delegate")](this.target, this._context, s, c, r) : this._scopeEvents[o](this.target, s, c, r)
                                }
                            }
                            return this
                        }
                    }, {
                        key: "on", value: function (t, e, n) {
                            return this._onOff("on", t, e, n)
                        }
                    }, {
                        key: "off", value: function (t, e, n) {
                            return this._onOff("off", t, e, n)
                        }
                    }, {
                        key: "set", value: function (t) {
                            var e = this._defaults;
                            for (var n in i.default.object(t) || (t = {}), this.options = (0, he.default)(e.base), this._actions.methodDict) {
                                var r = n, o = this._actions.methodDict[r];
                                this.options[r] = {}, this.setPerAction(r, (0, k.default)((0, k.default)({}, e.perAction), e.actions[r])), this[o](t[r])
                            }
                            for (var a in t) i.default.func(this[a]) && this[a](t[a]);
                            return this
                        }
                    }, {
                        key: "unset", value: function () {
                            if (i.default.string(this.target)) for (var t in this._scopeEvents.delegatedEvents) for (var e = this._scopeEvents.delegatedEvents[t], n = e.length - 1; n >= 0; n--) {
                                var r = e[n], o = r.selector, a = r.context, s = r.listeners;
                                o === this.target && a === this._context && e.splice(n, 1);
                                for (var l = s.length - 1; l >= 0; l--) this._scopeEvents.removeDelegate(this.target, this._context, t, s[l][0], s[l][1])
                            } else this._scopeEvents.remove(this.target, "all")
                        }
                    }]) && function (t, e) {
                        for (var n = 0; n < e.length; n++) {
                            var r = e[n];
                            r.enumerable = r.enumerable || !1, r.configurable = !0, "value" in r && (r.writable = !0), Object.defineProperty(t, r.key, r)
                        }
                    }(n.prototype, r), Object.defineProperty(n, "prototype", {writable: !1}), t
                }();
                hn.Interactable = yn;
                var mn = {};

                function bn(t, e, n) {
                    return e in t ? Object.defineProperty(t, e, {
                        value: n,
                        enumerable: !0,
                        configurable: !0,
                        writable: !0
                    }) : t[e] = n, t
                }

                Object.defineProperty(mn, "__esModule", {value: !0}), mn.InteractableSet = void 0;
                var xn = function () {
                    function t(e) {
                        var n = this;
                        !function (t, e) {
                            if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function")
                        }(this, t), bn(this, "list", []), bn(this, "selectorMap", {}), bn(this, "scope", void 0), this.scope = e, e.addListeners({
                            "interactable:unset": function (t) {
                                var e = t.interactable, r = e.target, o = e._context,
                                    a = i.default.string(r) ? n.selectorMap[r] : r[n.scope.id],
                                    s = $.findIndex(a, (function (t) {
                                        return t.context === o
                                    }));
                                a[s] && (a[s].context = null, a[s].interactable = null), a.splice(s, 1)
                            }
                        })
                    }

                    var e, n;
                    return e = t, (n = [{
                        key: "new", value: function (t, e) {
                            e = (0, k.default)(e || {}, {actions: this.scope.actions});
                            var n = new this.scope.Interactable(t, e, this.scope.document, this.scope.events),
                                r = {context: n._context, interactable: n};
                            return this.scope.addDocument(n._doc), this.list.push(n), i.default.string(t) ? (this.selectorMap[t] || (this.selectorMap[t] = []), this.selectorMap[t].push(r)) : (n.target[this.scope.id] || Object.defineProperty(t, this.scope.id, {
                                value: [],
                                configurable: !0
                            }), t[this.scope.id].push(r)), this.scope.fire("interactable:new", {
                                target: t,
                                options: e,
                                interactable: n,
                                win: this.scope._win
                            }), n
                        }
                    }, {
                        key: "get", value: function (t, e) {
                            var n = e && e.context || this.scope.document, r = i.default.string(t),
                                o = r ? this.selectorMap[t] : t[this.scope.id];
                            if (!o) return null;
                            var a = $.find(o, (function (e) {
                                return e.context === n && (r || e.interactable.inContext(t))
                            }));
                            return a && a.interactable
                        }
                    }, {
                        key: "forEachMatch", value: function (t, e) {
                            for (var n = 0; n < this.list.length; n++) {
                                var r = this.list[n], o = void 0;
                                if ((i.default.string(r.target) ? i.default.element(t) && P.matchesSelector(t, r.target) : t === r.target) && r.inContext(t) && (o = e(r)), void 0 !== o) return o
                            }
                        }
                    }]) && function (t, e) {
                        for (var n = 0; n < e.length; n++) {
                            var r = e[n];
                            r.enumerable = r.enumerable || !1, r.configurable = !0, "value" in r && (r.writable = !0), Object.defineProperty(t, r.key, r)
                        }
                    }(e.prototype, n), Object.defineProperty(e, "prototype", {writable: !1}), t
                }();
                mn.InteractableSet = xn;
                var wn = {};

                function _n(t, e, n) {
                    return e in t ? Object.defineProperty(t, e, {
                        value: n,
                        enumerable: !0,
                        configurable: !0,
                        writable: !0
                    }) : t[e] = n, t
                }

                function Pn(t, e) {
                    return function (t) {
                        if (Array.isArray(t)) return t
                    }(t) || function (t, e) {
                        var n = null == t ? null : "undefined" != typeof Symbol && t[Symbol.iterator] || t["@@iterator"];
                        if (null != n) {
                            var r, o, i = [], a = !0, s = !1;
                            try {
                                for (n = n.call(t); !(a = (r = n.next()).done) && (i.push(r.value), !e || i.length !== e); a = !0) ;
                            } catch (t) {
                                s = !0, o = t
                            } finally {
                                try {
                                    a || null == n.return || n.return()
                                } finally {
                                    if (s) throw o
                                }
                            }
                            return i
                        }
                    }(t, e) || function (t, e) {
                        if (t) {
                            if ("string" == typeof t) return On(t, e);
                            var n = Object.prototype.toString.call(t).slice(8, -1);
                            return "Object" === n && t.constructor && (n = t.constructor.name), "Map" === n || "Set" === n ? Array.from(t) : "Arguments" === n || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n) ? On(t, e) : void 0
                        }
                    }(t, e) || function () {
                        throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")
                    }()
                }

                function On(t, e) {
                    (null == e || e > t.length) && (e = t.length);
                    for (var n = 0, r = Array(e); n < e; n++) r[n] = t[n];
                    return r
                }

                Object.defineProperty(wn, "__esModule", {value: !0}), wn.default = void 0;
                var En = function () {
                    function t(e) {
                        !function (t, e) {
                            if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function")
                        }(this, t), _n(this, "currentTarget", void 0), _n(this, "originalEvent", void 0), _n(this, "type", void 0), this.originalEvent = e, (0, L.default)(this, e)
                    }

                    var e, n;
                    return e = t, (n = [{
                        key: "preventOriginalDefault", value: function () {
                            this.originalEvent.preventDefault()
                        }
                    }, {
                        key: "stopPropagation", value: function () {
                            this.originalEvent.stopPropagation()
                        }
                    }, {
                        key: "stopImmediatePropagation", value: function () {
                            this.originalEvent.stopImmediatePropagation()
                        }
                    }]) && function (t, e) {
                        for (var n = 0; n < e.length; n++) {
                            var r = e[n];
                            r.enumerable = r.enumerable || !1, r.configurable = !0, "value" in r && (r.writable = !0), Object.defineProperty(t, r.key, r)
                        }
                    }(e.prototype, n), Object.defineProperty(e, "prototype", {writable: !1}), t
                }();

                function Sn(t) {
                    if (!i.default.object(t)) return {capture: !!t, passive: !1};
                    var e = (0, k.default)({}, t);
                    return e.capture = !!t.capture, e.passive = !!t.passive, e
                }

                var Tn = {
                    id: "events", install: function (t) {
                        var e, n = [], r = {}, o = [], a = {
                            add: s,
                            remove: l,
                            addDelegate: function (t, e, n, i, a) {
                                var l = Sn(a);
                                if (!r[n]) {
                                    r[n] = [];
                                    for (var d = 0; d < o.length; d++) {
                                        var f = o[d];
                                        s(f, n, c), s(f, n, u, !0)
                                    }
                                }
                                var p = r[n], v = $.find(p, (function (n) {
                                    return n.selector === t && n.context === e
                                }));
                                v || (v = {selector: t, context: e, listeners: []}, p.push(v)), v.listeners.push([i, l])
                            },
                            removeDelegate: function (t, e, n, o, i) {
                                var a, s = Sn(i), d = r[n], f = !1;
                                if (d) for (a = d.length - 1; a >= 0; a--) {
                                    var p = d[a];
                                    if (p.selector === t && p.context === e) {
                                        for (var v = p.listeners, h = v.length - 1; h >= 0; h--) {
                                            var g = Pn(v[h], 2), y = g[0], m = g[1], b = m.capture, x = m.passive;
                                            if (y === o && b === s.capture && x === s.passive) {
                                                v.splice(h, 1), v.length || (d.splice(a, 1), l(e, n, c), l(e, n, u, !0)), f = !0;
                                                break
                                            }
                                        }
                                        if (f) break
                                    }
                                }
                            },
                            delegateListener: c,
                            delegateUseCapture: u,
                            delegatedEvents: r,
                            documents: o,
                            targets: n,
                            supportsOptions: !1,
                            supportsPassive: !1
                        };

                        function s(t, e, r, o) {
                            var i = Sn(o), s = $.find(n, (function (e) {
                                return e.eventTarget === t
                            }));
                            s || (s = {
                                eventTarget: t,
                                events: {}
                            }, n.push(s)), s.events[e] || (s.events[e] = []), t.addEventListener && !$.contains(s.events[e], r) && (t.addEventListener(e, r, a.supportsOptions ? i : i.capture), s.events[e].push(r))
                        }

                        function l(t, e, r, o) {
                            var i = Sn(o), s = $.findIndex(n, (function (e) {
                                return e.eventTarget === t
                            })), c = n[s];
                            if (c && c.events) if ("all" !== e) {
                                var u = !1, d = c.events[e];
                                if (d) {
                                    if ("all" === r) {
                                        for (var f = d.length - 1; f >= 0; f--) l(t, e, d[f], i);
                                        return
                                    }
                                    for (var p = 0; p < d.length; p++) if (d[p] === r) {
                                        t.removeEventListener(e, r, a.supportsOptions ? i : i.capture), d.splice(p, 1), 0 === d.length && (delete c.events[e], u = !0);
                                        break
                                    }
                                }
                                u && !Object.keys(c.events).length && n.splice(s, 1)
                            } else for (e in c.events) c.events.hasOwnProperty(e) && l(t, e, "all")
                        }

                        function c(t, e) {
                            for (var n = Sn(e), o = new En(t), a = r[t.type], s = Pn(B.getEventTargets(t), 1)[0], l = s; i.default.element(l);) {
                                for (var c = 0; c < a.length; c++) {
                                    var u = a[c], d = u.selector, f = u.context;
                                    if (P.matchesSelector(l, d) && P.nodeContains(f, s) && P.nodeContains(f, l)) {
                                        var p = u.listeners;
                                        o.currentTarget = l;
                                        for (var v = 0; v < p.length; v++) {
                                            var h = Pn(p[v], 2), g = h[0], y = h[1], m = y.capture, b = y.passive;
                                            m === n.capture && b === n.passive && g(o)
                                        }
                                    }
                                }
                                l = P.parentNode(l)
                            }
                        }

                        function u(t) {
                            return c(t, !0)
                        }

                        return null == (e = t.document) || e.createElement("div").addEventListener("test", null, {
                            get capture() {
                                return a.supportsOptions = !0
                            }, get passive() {
                                return a.supportsPassive = !0
                            }
                        }), t.events = a, a
                    }
                };
                wn.default = Tn;
                var jn = {};
                Object.defineProperty(jn, "__esModule", {value: !0}), jn.default = void 0;
                var Mn = {
                    methodOrder: ["simulationResume", "mouseOrPen", "hasPointer", "idle"], search: function (t) {
                        for (var e = 0; e < Mn.methodOrder.length; e++) {
                            var n;
                            n = Mn.methodOrder[e];
                            var r = Mn[n](t);
                            if (r) return r
                        }
                        return null
                    }, simulationResume: function (t) {
                        var e = t.pointerType, n = t.eventType, r = t.eventTarget, o = t.scope;
                        if (!/down|start/i.test(n)) return null;
                        for (var i = 0; i < o.interactions.list.length; i++) {
                            var a = o.interactions.list[i], s = r;
                            if (a.simulation && a.simulation.allowResume && a.pointerType === e) for (; s;) {
                                if (s === a.element) return a;
                                s = P.parentNode(s)
                            }
                        }
                        return null
                    }, mouseOrPen: function (t) {
                        var e, n = t.pointerId, r = t.pointerType, o = t.eventType, i = t.scope;
                        if ("mouse" !== r && "pen" !== r) return null;
                        for (var a = 0; a < i.interactions.list.length; a++) {
                            var s = i.interactions.list[a];
                            if (s.pointerType === r) {
                                if (s.simulation && !kn(s, n)) continue;
                                if (s.interacting()) return s;
                                e || (e = s)
                            }
                        }
                        if (e) return e;
                        for (var l = 0; l < i.interactions.list.length; l++) {
                            var c = i.interactions.list[l];
                            if (!(c.pointerType !== r || /down/i.test(o) && c.simulation)) return c
                        }
                        return null
                    }, hasPointer: function (t) {
                        for (var e = t.pointerId, n = t.scope, r = 0; r < n.interactions.list.length; r++) {
                            var o = n.interactions.list[r];
                            if (kn(o, e)) return o
                        }
                        return null
                    }, idle: function (t) {
                        for (var e = t.pointerType, n = t.scope, r = 0; r < n.interactions.list.length; r++) {
                            var o = n.interactions.list[r];
                            if (1 === o.pointers.length) {
                                var i = o.interactable;
                                if (i && (!i.options.gesture || !i.options.gesture.enabled)) continue
                            } else if (o.pointers.length >= 2) continue;
                            if (!o.interacting() && e === o.pointerType) return o
                        }
                        return null
                    }
                };

                function kn(t, e) {
                    return t.pointers.some((function (t) {
                        return t.id === e
                    }))
                }

                var In = Mn;
                jn.default = In;
                var An = {};

                function Dn(t) {
                    return Dn = "function" == typeof Symbol && "symbol" == a(Symbol.iterator) ? function (t) {
                        return a(t)
                    } : function (t) {
                        return t && "function" == typeof Symbol && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : a(t)
                    }, Dn(t)
                }

                function Cn(t, e) {
                    return function (t) {
                        if (Array.isArray(t)) return t
                    }(t) || function (t, e) {
                        var n = null == t ? null : "undefined" != typeof Symbol && t[Symbol.iterator] || t["@@iterator"];
                        if (null != n) {
                            var r, o, i = [], a = !0, s = !1;
                            try {
                                for (n = n.call(t); !(a = (r = n.next()).done) && (i.push(r.value), !e || i.length !== e); a = !0) ;
                            } catch (t) {
                                s = !0, o = t
                            } finally {
                                try {
                                    a || null == n.return || n.return()
                                } finally {
                                    if (s) throw o
                                }
                            }
                            return i
                        }
                    }(t, e) || function (t, e) {
                        if (t) {
                            if ("string" == typeof t) return zn(t, e);
                            var n = Object.prototype.toString.call(t).slice(8, -1);
                            return "Object" === n && t.constructor && (n = t.constructor.name), "Map" === n || "Set" === n ? Array.from(t) : "Arguments" === n || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n) ? zn(t, e) : void 0
                        }
                    }(t, e) || function () {
                        throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")
                    }()
                }

                function zn(t, e) {
                    (null == e || e > t.length) && (e = t.length);
                    for (var n = 0, r = Array(e); n < e; n++) r[n] = t[n];
                    return r
                }

                function Rn(t, e) {
                    if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function")
                }

                function Fn(t, e) {
                    return Fn = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function (t, e) {
                        return t.__proto__ = e, t
                    }, Fn(t, e)
                }

                function Ln(t, e) {
                    if (e && ("object" === Dn(e) || "function" == typeof e)) return e;
                    if (void 0 !== e) throw new TypeError("Derived constructors may only return object or undefined");
                    return function (t) {
                        if (void 0 === t) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
                        return t
                    }(t)
                }

                function Bn(t) {
                    return Bn = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function (t) {
                        return t.__proto__ || Object.getPrototypeOf(t)
                    }, Bn(t)
                }

                Object.defineProperty(An, "__esModule", {value: !0}), An.default = void 0;
                var qn = ["pointerDown", "pointerMove", "pointerUp", "updatePointer", "removePointer", "windowBlur"];

                function Xn(t, e) {
                    return function (n) {
                        var r = e.interactions.list, o = B.getPointerType(n), i = Cn(B.getEventTargets(n), 2), a = i[0],
                            s = i[1], l = [];
                        if (/^touch/.test(n.type)) {
                            e.prevTouchTime = e.now();
                            for (var c = 0; c < n.changedTouches.length; c++) {
                                var u = n.changedTouches[c], d = {
                                    pointer: u,
                                    pointerId: B.getPointerId(u),
                                    pointerType: o,
                                    eventType: n.type,
                                    eventTarget: a,
                                    curEventTarget: s,
                                    scope: e
                                }, f = Yn(d);
                                l.push([d.pointer, d.eventTarget, d.curEventTarget, f])
                            }
                        } else {
                            var p = !1;
                            if (!x.default.supportsPointerEvent && /mouse/.test(n.type)) {
                                for (var v = 0; v < r.length && !p; v++) p = "mouse" !== r[v].pointerType && r[v].pointerIsDown;
                                p = p || e.now() - e.prevTouchTime < 500 || 0 === n.timeStamp
                            }
                            if (!p) {
                                var h = {
                                    pointer: n,
                                    pointerId: B.getPointerId(n),
                                    pointerType: o,
                                    eventType: n.type,
                                    curEventTarget: s,
                                    eventTarget: a,
                                    scope: e
                                }, g = Yn(h);
                                l.push([h.pointer, h.eventTarget, h.curEventTarget, g])
                            }
                        }
                        for (var y = 0; y < l.length; y++) {
                            var m = Cn(l[y], 4), b = m[0], w = m[1], _ = m[2];
                            m[3][t](b, n, w, _)
                        }
                    }
                }

                function Yn(t) {
                    var e = t.pointerType, n = t.scope, r = {interaction: jn.default.search(t), searchDetails: t};
                    return n.fire("interactions:find", r), r.interaction || n.interactions.new({pointerType: e})
                }

                function Nn(t, e) {
                    var n = t.doc, r = t.scope, o = t.options, i = r.interactions.docEvents, a = r.events, s = a[e];
                    for (var l in r.browser.isIOS && !o.events && (o.events = {passive: !1}), a.delegatedEvents) s(n, l, a.delegateListener), s(n, l, a.delegateUseCapture, !0);
                    for (var c = o && o.events, u = 0; u < i.length; u++) {
                        var d = i[u];
                        s(n, d.type, d.listener, c)
                    }
                }

                var Wn = {
                    id: "core/interactions", install: function (t) {
                        for (var e = {}, n = 0; n < qn.length; n++) {
                            var r = qn[n];
                            e[r] = Xn(r, t)
                        }
                        var o, i = x.default.pEventTypes;

                        function a() {
                            for (var e = 0; e < t.interactions.list.length; e++) {
                                var n = t.interactions.list[e];
                                if (n.pointerIsDown && "touch" === n.pointerType && !n._interacting) for (var r = function () {
                                    var e = n.pointers[o];
                                    t.documents.some((function (t) {
                                        var n = t.doc;
                                        return (0, P.nodeContains)(n, e.downTarget)
                                    })) || n.removePointer(e.pointer, e.event)
                                }, o = 0; o < n.pointers.length; o++) r()
                            }
                        }

                        (o = g.default.PointerEvent ? [{type: i.down, listener: a}, {
                            type: i.down,
                            listener: e.pointerDown
                        }, {type: i.move, listener: e.pointerMove}, {
                            type: i.up,
                            listener: e.pointerUp
                        }, {type: i.cancel, listener: e.pointerUp}] : [{
                            type: "mousedown",
                            listener: e.pointerDown
                        }, {type: "mousemove", listener: e.pointerMove}, {
                            type: "mouseup",
                            listener: e.pointerUp
                        }, {type: "touchstart", listener: a}, {
                            type: "touchstart",
                            listener: e.pointerDown
                        }, {type: "touchmove", listener: e.pointerMove}, {
                            type: "touchend",
                            listener: e.pointerUp
                        }, {type: "touchcancel", listener: e.pointerUp}]).push({
                            type: "blur", listener: function (e) {
                                for (var n = 0; n < t.interactions.list.length; n++) t.interactions.list[n].documentBlur(e)
                            }
                        }), t.prevTouchTime = 0, t.Interaction = function (e) {
                            !function (t, e) {
                                if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function");
                                t.prototype = Object.create(e && e.prototype, {
                                    constructor: {
                                        value: t,
                                        writable: !0,
                                        configurable: !0
                                    }
                                }), Object.defineProperty(t, "prototype", {writable: !1}), e && Fn(t, e)
                            }(s, e);
                            var n, r, o, i, a = (o = s, i = function () {
                                if ("undefined" == typeof Reflect || !Reflect.construct) return !1;
                                if (Reflect.construct.sham) return !1;
                                if ("function" == typeof Proxy) return !0;
                                try {
                                    return Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], (function () {
                                    }))), !0
                                } catch (t) {
                                    return !1
                                }
                            }(), function () {
                                var t, e = Bn(o);
                                if (i) {
                                    var n = Bn(this).constructor;
                                    t = Reflect.construct(e, arguments, n)
                                } else t = e.apply(this, arguments);
                                return Ln(this, t)
                            });

                            function s() {
                                return Rn(this, s), a.apply(this, arguments)
                            }

                            return n = s, (r = [{
                                key: "pointerMoveTolerance", get: function () {
                                    return t.interactions.pointerMoveTolerance
                                }, set: function (e) {
                                    t.interactions.pointerMoveTolerance = e
                                }
                            }, {
                                key: "_now", value: function () {
                                    return t.now()
                                }
                            }]) && function (t, e) {
                                for (var n = 0; n < e.length; n++) {
                                    var r = e[n];
                                    r.enumerable = r.enumerable || !1, r.configurable = !0, "value" in r && (r.writable = !0), Object.defineProperty(t, r.key, r)
                                }
                            }(n.prototype, r), Object.defineProperty(n, "prototype", {writable: !1}), s
                        }(Xe.default), t.interactions = {
                            list: [], new: function (e) {
                                e.scopeFire = function (e, n) {
                                    return t.fire(e, n)
                                };
                                var n = new t.Interaction(e);
                                return t.interactions.list.push(n), n
                            }, listeners: e, docEvents: o, pointerMoveTolerance: 1
                        }, t.usePlugin(se.default)
                    }, listeners: {
                        "scope:add-document": function (t) {
                            return Nn(t, "add")
                        }, "scope:remove-document": function (t) {
                            return Nn(t, "remove")
                        }, "interactable:unset": function (t, e) {
                            for (var n = t.interactable, r = e.interactions.list.length - 1; r >= 0; r--) {
                                var o = e.interactions.list[r];
                                o.interactable === n && (o.stop(), e.fire("interactions:destroy", {interaction: o}), o.destroy(), e.interactions.list.length > 2 && e.interactions.list.splice(r, 1))
                            }
                        }
                    }, onDocSignal: Nn, doOnInteractions: Xn, methodNames: qn
                }, Un = Wn;
                An.default = Un;
                var Vn = {};

                function Hn(t) {
                    return Hn = "function" == typeof Symbol && "symbol" == a(Symbol.iterator) ? function (t) {
                        return a(t)
                    } : function (t) {
                        return t && "function" == typeof Symbol && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : a(t)
                    }, Hn(t)
                }

                function Gn() {
                    return Gn = "undefined" != typeof Reflect && Reflect.get ? Reflect.get.bind() : function (t, e, n) {
                        var r = $n(t, e);
                        if (r) {
                            var o = Object.getOwnPropertyDescriptor(r, e);
                            return o.get ? o.get.call(arguments.length < 3 ? t : n) : o.value
                        }
                    }, Gn.apply(this, arguments)
                }

                function $n(t, e) {
                    for (; !Object.prototype.hasOwnProperty.call(t, e) && null !== (t = Jn(t));) ;
                    return t
                }

                function Kn(t, e) {
                    return Kn = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function (t, e) {
                        return t.__proto__ = e, t
                    }, Kn(t, e)
                }

                function Zn(t, e) {
                    if (e && ("object" === Hn(e) || "function" == typeof e)) return e;
                    if (void 0 !== e) throw new TypeError("Derived constructors may only return object or undefined");
                    return function (t) {
                        if (void 0 === t) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
                        return t
                    }(t)
                }

                function Jn(t) {
                    return Jn = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function (t) {
                        return t.__proto__ || Object.getPrototypeOf(t)
                    }, Jn(t)
                }

                function Qn(t, e) {
                    if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function")
                }

                function tr(t, e) {
                    for (var n = 0; n < e.length; n++) {
                        var r = e[n];
                        r.enumerable = r.enumerable || !1, r.configurable = !0, "value" in r && (r.writable = !0), Object.defineProperty(t, r.key, r)
                    }
                }

                function er(t, e, n) {
                    return e && tr(t.prototype, e), n && tr(t, n), Object.defineProperty(t, "prototype", {writable: !1}), t
                }

                function nr(t, e, n) {
                    return e in t ? Object.defineProperty(t, e, {
                        value: n,
                        enumerable: !0,
                        configurable: !0,
                        writable: !0
                    }) : t[e] = n, t
                }

                Object.defineProperty(Vn, "__esModule", {value: !0}), Vn.Scope = void 0, Vn.initScope = or;
                var rr = function () {
                    function t() {
                        var e = this;
                        Qn(this, t), nr(this, "id", "__interact_scope_".concat(Math.floor(100 * Math.random()))), nr(this, "isInitialized", !1), nr(this, "listenerMaps", []), nr(this, "browser", x.default), nr(this, "defaults", (0, he.default)(Te.defaults)), nr(this, "Eventable", cn.Eventable), nr(this, "actions", {
                            map: {},
                            phases: {start: !0, move: !0, end: !0},
                            methodDict: {},
                            phaselessTypes: {}
                        }), nr(this, "interactStatic", (0, vn.createInteractStatic)(this)), nr(this, "InteractEvent", je.InteractEvent), nr(this, "Interactable", void 0), nr(this, "interactables", new mn.InteractableSet(this)), nr(this, "_win", void 0), nr(this, "document", void 0), nr(this, "window", void 0), nr(this, "documents", []), nr(this, "_plugins", {
                            list: [],
                            map: {}
                        }), nr(this, "onWindowUnload", (function (t) {
                            return e.removeDocument(t.target)
                        }));
                        var n = this;
                        this.Interactable = function (t) {
                            !function (t, e) {
                                if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function");
                                t.prototype = Object.create(e && e.prototype, {
                                    constructor: {
                                        value: t,
                                        writable: !0,
                                        configurable: !0
                                    }
                                }), Object.defineProperty(t, "prototype", {writable: !1}), e && Kn(t, e)
                            }(i, t);
                            var e, r, o = (e = i, r = function () {
                                if ("undefined" == typeof Reflect || !Reflect.construct) return !1;
                                if (Reflect.construct.sham) return !1;
                                if ("function" == typeof Proxy) return !0;
                                try {
                                    return Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], (function () {
                                    }))), !0
                                } catch (t) {
                                    return !1
                                }
                            }(), function () {
                                var t, n = Jn(e);
                                if (r) {
                                    var o = Jn(this).constructor;
                                    t = Reflect.construct(n, arguments, o)
                                } else t = n.apply(this, arguments);
                                return Zn(this, t)
                            });

                            function i() {
                                return Qn(this, i), o.apply(this, arguments)
                            }

                            return er(i, [{
                                key: "_defaults", get: function () {
                                    return n.defaults
                                }
                            }, {
                                key: "set", value: function (t) {
                                    return Gn(Jn(i.prototype), "set", this).call(this, t), n.fire("interactable:set", {
                                        options: t,
                                        interactable: this
                                    }), this
                                }
                            }, {
                                key: "unset", value: function () {
                                    Gn(Jn(i.prototype), "unset", this).call(this);
                                    var t = n.interactables.list.indexOf(this);
                                    t < 0 || (Gn(Jn(i.prototype), "unset", this).call(this), n.interactables.list.splice(t, 1), n.fire("interactable:unset", {interactable: this}))
                                }
                            }]), i
                        }(hn.Interactable)
                    }

                    return er(t, [{
                        key: "addListeners", value: function (t, e) {
                            this.listenerMaps.push({id: e, map: t})
                        }
                    }, {
                        key: "fire", value: function (t, e) {
                            for (var n = 0; n < this.listenerMaps.length; n++) {
                                var r = this.listenerMaps[n].map[t];
                                if (r && !1 === r(e, this, t)) return !1
                            }
                        }
                    }, {
                        key: "init", value: function (t) {
                            return this.isInitialized ? this : or(this, t)
                        }
                    }, {
                        key: "pluginIsInstalled", value: function (t) {
                            return this._plugins.map[t.id] || -1 !== this._plugins.list.indexOf(t)
                        }
                    }, {
                        key: "usePlugin", value: function (t, e) {
                            if (!this.isInitialized) return this;
                            if (this.pluginIsInstalled(t)) return this;
                            if (t.id && (this._plugins.map[t.id] = t), this._plugins.list.push(t), t.install && t.install(this, e), t.listeners && t.before) {
                                for (var n = 0, r = this.listenerMaps.length, o = t.before.reduce((function (t, e) {
                                    return t[e] = !0, t[ir(e)] = !0, t
                                }), {}); n < r; n++) {
                                    var i = this.listenerMaps[n].id;
                                    if (o[i] || o[ir(i)]) break
                                }
                                this.listenerMaps.splice(n, 0, {id: t.id, map: t.listeners})
                            } else t.listeners && this.listenerMaps.push({id: t.id, map: t.listeners});
                            return this
                        }
                    }, {
                        key: "addDocument", value: function (t, n) {
                            if (-1 !== this.getDocIndex(t)) return !1;
                            var r = e.getWindow(t);
                            n = n ? (0, k.default)({}, n) : {}, this.documents.push({
                                doc: t,
                                options: n
                            }), this.events.documents.push(t), t !== this.document && this.events.add(r, "unload", this.onWindowUnload), this.fire("scope:add-document", {
                                doc: t,
                                window: r,
                                scope: this,
                                options: n
                            })
                        }
                    }, {
                        key: "removeDocument", value: function (t) {
                            var n = this.getDocIndex(t), r = e.getWindow(t), o = this.documents[n].options;
                            this.events.remove(r, "unload", this.onWindowUnload), this.documents.splice(n, 1), this.events.documents.splice(n, 1), this.fire("scope:remove-document", {
                                doc: t,
                                window: r,
                                scope: this,
                                options: o
                            })
                        }
                    }, {
                        key: "getDocIndex", value: function (t) {
                            for (var e = 0; e < this.documents.length; e++) if (this.documents[e].doc === t) return e;
                            return -1
                        }
                    }, {
                        key: "getDocOptions", value: function (t) {
                            var e = this.getDocIndex(t);
                            return -1 === e ? null : this.documents[e].options
                        }
                    }, {
                        key: "now", value: function () {
                            return (this.window.Date || Date).now()
                        }
                    }]), t
                }();

                function or(t, n) {
                    return t.isInitialized = !0, i.default.window(n) && e.init(n), g.default.init(n), x.default.init(n), St.default.init(n), t.window = n, t.document = n.document, t.usePlugin(An.default), t.usePlugin(wn.default), t
                }

                function ir(t) {
                    return t && t.replace(/\/.*$/, "")
                }

                Vn.Scope = rr;
                var ar = {};
                Object.defineProperty(ar, "__esModule", {value: !0}), ar.default = void 0;
                var sr = new Vn.Scope, lr = sr.interactStatic;
                ar.default = lr;
                var cr = "undefined" != typeof globalThis ? globalThis : "undefined" != typeof window ? window : void 0;
                sr.init(cr);
                var ur = {};
                Object.defineProperty(ur, "__esModule", {value: !0}), ur.default = void 0, ur.default = function () {
                };
                var dr = {};
                Object.defineProperty(dr, "__esModule", {value: !0}), dr.default = void 0, dr.default = function () {
                };
                var fr = {};

                function pr(t, e) {
                    return function (t) {
                        if (Array.isArray(t)) return t
                    }(t) || function (t, e) {
                        var n = null == t ? null : "undefined" != typeof Symbol && t[Symbol.iterator] || t["@@iterator"];
                        if (null != n) {
                            var r, o, i = [], a = !0, s = !1;
                            try {
                                for (n = n.call(t); !(a = (r = n.next()).done) && (i.push(r.value), !e || i.length !== e); a = !0) ;
                            } catch (t) {
                                s = !0, o = t
                            } finally {
                                try {
                                    a || null == n.return || n.return()
                                } finally {
                                    if (s) throw o
                                }
                            }
                            return i
                        }
                    }(t, e) || function (t, e) {
                        if (t) {
                            if ("string" == typeof t) return vr(t, e);
                            var n = Object.prototype.toString.call(t).slice(8, -1);
                            return "Object" === n && t.constructor && (n = t.constructor.name), "Map" === n || "Set" === n ? Array.from(t) : "Arguments" === n || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n) ? vr(t, e) : void 0
                        }
                    }(t, e) || function () {
                        throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")
                    }()
                }

                function vr(t, e) {
                    (null == e || e > t.length) && (e = t.length);
                    for (var n = 0, r = Array(e); n < e; n++) r[n] = t[n];
                    return r
                }

                Object.defineProperty(fr, "__esModule", {value: !0}), fr.default = void 0, fr.default = function (t) {
                    var e = [["x", "y"], ["left", "top"], ["right", "bottom"], ["width", "height"]].filter((function (e) {
                        var n = pr(e, 2), r = n[0], o = n[1];
                        return r in t || o in t
                    })), n = function (n, r) {
                        for (var o = t.range, i = t.limits, a = void 0 === i ? {
                            left: -1 / 0,
                            right: 1 / 0,
                            top: -1 / 0,
                            bottom: 1 / 0
                        } : i, s = t.offset, l = void 0 === s ? {x: 0, y: 0} : s, c = {
                            range: o,
                            grid: t,
                            x: null,
                            y: null
                        }, u = 0; u < e.length; u++) {
                            var d = pr(e[u], 2), f = d[0], p = d[1], v = Math.round((n - l.x) / t[f]),
                                h = Math.round((r - l.y) / t[p]);
                            c[f] = Math.max(a.left, Math.min(a.right, v * t[f] + l.x)), c[p] = Math.max(a.top, Math.min(a.bottom, h * t[p] + l.y))
                        }
                        return c
                    };
                    return n.grid = t, n.coordFields = e, n
                };
                var hr = {};
                Object.defineProperty(hr, "__esModule", {value: !0}), Object.defineProperty(hr, "edgeTarget", {
                    enumerable: !0,
                    get: function () {
                        return ur.default
                    }
                }), Object.defineProperty(hr, "elements", {
                    enumerable: !0, get: function () {
                        return dr.default
                    }
                }), Object.defineProperty(hr, "grid", {
                    enumerable: !0, get: function () {
                        return fr.default
                    }
                });
                var gr = {};
                Object.defineProperty(gr, "__esModule", {value: !0}), gr.default = void 0;
                var yr = {
                    id: "snappers", install: function (t) {
                        var e = t.interactStatic;
                        e.snappers = (0, k.default)(e.snappers || {}, hr), e.createSnapGrid = e.snappers.grid
                    }
                }, mr = yr;
                gr.default = mr;
                var br = {};

                function xr(t, e) {
                    var n = Object.keys(t);
                    if (Object.getOwnPropertySymbols) {
                        var r = Object.getOwnPropertySymbols(t);
                        e && (r = r.filter((function (e) {
                            return Object.getOwnPropertyDescriptor(t, e).enumerable
                        }))), n.push.apply(n, r)
                    }
                    return n
                }

                function wr(t) {
                    for (var e = 1; e < arguments.length; e++) {
                        var n = null != arguments[e] ? arguments[e] : {};
                        e % 2 ? xr(Object(n), !0).forEach((function (e) {
                            _r(t, e, n[e])
                        })) : Object.getOwnPropertyDescriptors ? Object.defineProperties(t, Object.getOwnPropertyDescriptors(n)) : xr(Object(n)).forEach((function (e) {
                            Object.defineProperty(t, e, Object.getOwnPropertyDescriptor(n, e))
                        }))
                    }
                    return t
                }

                function _r(t, e, n) {
                    return e in t ? Object.defineProperty(t, e, {
                        value: n,
                        enumerable: !0,
                        configurable: !0,
                        writable: !0
                    }) : t[e] = n, t
                }

                Object.defineProperty(br, "__esModule", {value: !0}), br.default = br.aspectRatio = void 0;
                var Pr = {
                    start: function (t) {
                        var e = t.state, n = t.rect, r = t.edges, o = t.pageCoords, i = e.options.ratio, a = e.options,
                            s = a.equalDelta, l = a.modifiers;
                        "preserve" === i && (i = n.width / n.height), e.startCoords = (0, k.default)({}, o), e.startRect = (0, k.default)({}, n), e.ratio = i, e.equalDelta = s;
                        var c = e.linkedEdges = {
                            top: r.top || r.left && !r.bottom,
                            left: r.left || r.top && !r.right,
                            bottom: r.bottom || r.right && !r.top,
                            right: r.right || r.bottom && !r.left
                        };
                        if (e.xIsPrimaryAxis = !(!r.left && !r.right), e.equalDelta) {
                            var u = (c.left ? 1 : -1) * (c.top ? 1 : -1);
                            e.edgeSign = {x: u, y: u}
                        } else e.edgeSign = {x: c.left ? -1 : 1, y: c.top ? -1 : 1};
                        if ((0, k.default)(t.edges, c), l && l.length) {
                            var d = new ge.default(t.interaction);
                            d.copyFrom(t.interaction.modification), d.prepareStates(l), e.subModification = d, d.startAll(wr({}, t))
                        }
                    }, set: function (t) {
                        var e = t.state, n = t.rect, r = t.coords, o = (0, k.default)({}, r),
                            i = e.equalDelta ? Or : Er;
                        if (i(e, e.xIsPrimaryAxis, r, n), !e.subModification) return null;
                        var a = (0, k.default)({}, n);
                        (0, I.addEdges)(e.linkedEdges, a, {x: r.x - o.x, y: r.y - o.y});
                        var s = e.subModification.setAll(wr(wr({}, t), {}, {
                            rect: a,
                            edges: e.linkedEdges,
                            pageCoords: r,
                            prevCoords: r,
                            prevRect: a
                        })), l = s.delta;
                        return s.changed && (i(e, Math.abs(l.x) > Math.abs(l.y), s.coords, s.rect), (0, k.default)(r, s.coords)), s.eventProps
                    }, defaults: {ratio: "preserve", equalDelta: !1, modifiers: [], enabled: !1}
                };

                function Or(t, e, n) {
                    var r = t.startCoords, o = t.edgeSign;
                    e ? n.y = r.y + (n.x - r.x) * o.y : n.x = r.x + (n.y - r.y) * o.x
                }

                function Er(t, e, n, r) {
                    var o = t.startRect, i = t.startCoords, a = t.ratio, s = t.edgeSign;
                    if (e) {
                        var l = r.width / a;
                        n.y = i.y + (l - o.height) * s.y
                    } else {
                        var c = r.height * a;
                        n.x = i.x + (c - o.width) * s.x
                    }
                }

                br.aspectRatio = Pr;
                var Sr = (0, Pe.makeModifier)(Pr, "aspectRatio");
                br.default = Sr;
                var Tr = {};
                Object.defineProperty(Tr, "__esModule", {value: !0}), Tr.default = void 0;
                var jr = function () {
                };
                jr._defaults = {};
                var Mr = jr;
                Tr.default = Mr;
                var kr = {};
                Object.defineProperty(kr, "__esModule", {value: !0}), Object.defineProperty(kr, "default", {
                    enumerable: !0,
                    get: function () {
                        return Tr.default
                    }
                });
                var Ir = {};

                function Ar(t, e, n) {
                    return i.default.func(t) ? I.resolveRectLike(t, e.interactable, e.element, [n.x, n.y, e]) : I.resolveRectLike(t, e.interactable, e.element)
                }

                Object.defineProperty(Ir, "__esModule", {value: !0}), Ir.default = void 0, Ir.getRestrictionRect = Ar, Ir.restrict = void 0;
                var Dr = {
                    start: function (t) {
                        var e = t.rect, n = t.startOffset, r = t.state, o = t.interaction, i = t.pageCoords,
                            a = r.options, s = a.elementRect,
                            l = (0, k.default)({left: 0, top: 0, right: 0, bottom: 0}, a.offset || {});
                        if (e && s) {
                            var c = Ar(a.restriction, o, i);
                            if (c) {
                                var u = c.right - c.left - e.width, d = c.bottom - c.top - e.height;
                                u < 0 && (l.left += u, l.right += u), d < 0 && (l.top += d, l.bottom += d)
                            }
                            l.left += n.left - e.width * s.left, l.top += n.top - e.height * s.top, l.right += n.right - e.width * (1 - s.right), l.bottom += n.bottom - e.height * (1 - s.bottom)
                        }
                        r.offset = l
                    }, set: function (t) {
                        var e = t.coords, n = t.interaction, r = t.state, o = r.options, i = r.offset,
                            a = Ar(o.restriction, n, e);
                        if (a) {
                            var s = I.xywhToTlbr(a);
                            e.x = Math.max(Math.min(s.right - i.right, e.x), s.left + i.left), e.y = Math.max(Math.min(s.bottom - i.bottom, e.y), s.top + i.top)
                        }
                    }, defaults: {restriction: null, elementRect: null, offset: null, endOnly: !1, enabled: !1}
                };
                Ir.restrict = Dr;
                var Cr = (0, Pe.makeModifier)(Dr, "restrict");
                Ir.default = Cr;
                var zr = {};
                Object.defineProperty(zr, "__esModule", {value: !0}), zr.restrictEdges = zr.default = void 0;
                var Rr = {top: 1 / 0, left: 1 / 0, bottom: -1 / 0, right: -1 / 0},
                    Fr = {top: -1 / 0, left: -1 / 0, bottom: 1 / 0, right: 1 / 0};

                function Lr(t, e) {
                    for (var n = ["top", "left", "bottom", "right"], r = 0; r < n.length; r++) {
                        var o = n[r];
                        o in t || (t[o] = e[o])
                    }
                    return t
                }

                var Br = {
                    noInner: Rr, noOuter: Fr, start: function (t) {
                        var e, n = t.interaction, r = t.startOffset, o = t.state, i = o.options;
                        if (i) {
                            var a = (0, Ir.getRestrictionRect)(i.offset, n, n.coords.start.page);
                            e = I.rectToXY(a)
                        }
                        e = e || {x: 0, y: 0}, o.offset = {
                            top: e.y + r.top,
                            left: e.x + r.left,
                            bottom: e.y - r.bottom,
                            right: e.x - r.right
                        }
                    }, set: function (t) {
                        var e = t.coords, n = t.edges, r = t.interaction, o = t.state, i = o.offset, a = o.options;
                        if (n) {
                            var s = (0, k.default)({}, e), l = (0, Ir.getRestrictionRect)(a.inner, r, s) || {},
                                c = (0, Ir.getRestrictionRect)(a.outer, r, s) || {};
                            Lr(l, Rr), Lr(c, Fr), n.top ? e.y = Math.min(Math.max(c.top + i.top, s.y), l.top + i.top) : n.bottom && (e.y = Math.max(Math.min(c.bottom + i.bottom, s.y), l.bottom + i.bottom)), n.left ? e.x = Math.min(Math.max(c.left + i.left, s.x), l.left + i.left) : n.right && (e.x = Math.max(Math.min(c.right + i.right, s.x), l.right + i.right))
                        }
                    }, defaults: {inner: null, outer: null, offset: null, endOnly: !1, enabled: !1}
                };
                zr.restrictEdges = Br;
                var qr = (0, Pe.makeModifier)(Br, "restrictEdges");
                zr.default = qr;
                var Xr = {};
                Object.defineProperty(Xr, "__esModule", {value: !0}), Xr.restrictRect = Xr.default = void 0;
                var Yr = (0, k.default)({
                    get elementRect() {
                        return {top: 0, left: 0, bottom: 1, right: 1}
                    }, set elementRect(t) {
                    }
                }, Ir.restrict.defaults), Nr = {start: Ir.restrict.start, set: Ir.restrict.set, defaults: Yr};
                Xr.restrictRect = Nr;
                var Wr = (0, Pe.makeModifier)(Nr, "restrictRect");
                Xr.default = Wr;
                var Ur = {};
                Object.defineProperty(Ur, "__esModule", {value: !0}), Ur.restrictSize = Ur.default = void 0;
                var Vr = {width: -1 / 0, height: -1 / 0}, Hr = {width: 1 / 0, height: 1 / 0}, Gr = {
                    start: function (t) {
                        return zr.restrictEdges.start(t)
                    }, set: function (t) {
                        var e = t.interaction, n = t.state, r = t.rect, o = t.edges, i = n.options;
                        if (o) {
                            var a = I.tlbrToXywh((0, Ir.getRestrictionRect)(i.min, e, t.coords)) || Vr,
                                s = I.tlbrToXywh((0, Ir.getRestrictionRect)(i.max, e, t.coords)) || Hr;
                            n.options = {
                                endOnly: i.endOnly,
                                inner: (0, k.default)({}, zr.restrictEdges.noInner),
                                outer: (0, k.default)({}, zr.restrictEdges.noOuter)
                            }, o.top ? (n.options.inner.top = r.bottom - a.height, n.options.outer.top = r.bottom - s.height) : o.bottom && (n.options.inner.bottom = r.top + a.height, n.options.outer.bottom = r.top + s.height), o.left ? (n.options.inner.left = r.right - a.width, n.options.outer.left = r.right - s.width) : o.right && (n.options.inner.right = r.left + a.width, n.options.outer.right = r.left + s.width), zr.restrictEdges.set(t), n.options = i
                        }
                    }, defaults: {min: null, max: null, endOnly: !1, enabled: !1}
                };
                Ur.restrictSize = Gr;
                var $r = (0, Pe.makeModifier)(Gr, "restrictSize");
                Ur.default = $r;
                var Kr = {};
                Object.defineProperty(Kr, "__esModule", {value: !0}), Object.defineProperty(Kr, "default", {
                    enumerable: !0,
                    get: function () {
                        return Tr.default
                    }
                });
                var Zr = {};
                Object.defineProperty(Zr, "__esModule", {value: !0}), Zr.snap = Zr.default = void 0;
                var Jr = {
                    start: function (t) {
                        var e, n = t.interaction, r = t.interactable, o = t.element, i = t.rect, a = t.state,
                            s = t.startOffset, l = a.options, c = l.offsetWithOrigin ? function (t) {
                                var e = t.interaction.element;
                                return (0, I.rectToXY)((0, I.resolveRectLike)(t.state.options.origin, null, null, [e])) || (0, C.default)(t.interactable, e, t.interaction.prepared.name)
                            }(t) : {x: 0, y: 0};
                        if ("startCoords" === l.offset) e = {x: n.coords.start.page.x, y: n.coords.start.page.y}; else {
                            var u = (0, I.resolveRectLike)(l.offset, r, o, [n]);
                            (e = (0, I.rectToXY)(u) || {x: 0, y: 0}).x += c.x, e.y += c.y
                        }
                        var d = l.relativePoints;
                        a.offsets = i && d && d.length ? d.map((function (t, n) {
                            return {
                                index: n,
                                relativePoint: t,
                                x: s.left - i.width * t.x + e.x,
                                y: s.top - i.height * t.y + e.y
                            }
                        })) : [{index: 0, relativePoint: null, x: e.x, y: e.y}]
                    },
                    set: function (t) {
                        var e = t.interaction, n = t.coords, r = t.state, o = r.options, a = r.offsets,
                            s = (0, C.default)(e.interactable, e.element, e.prepared.name), l = (0, k.default)({}, n),
                            c = [];
                        o.offsetWithOrigin || (l.x -= s.x, l.y -= s.y);
                        for (var u = 0; u < a.length; u++) for (var d = a[u], f = l.x - d.x, p = l.y - d.y, v = 0, h = o.targets.length; v < h; v++) {
                            var g, y = o.targets[v];
                            (g = i.default.func(y) ? y(f, p, e._proxy, d, v) : y) && c.push({
                                x: (i.default.number(g.x) ? g.x : f) + d.x,
                                y: (i.default.number(g.y) ? g.y : p) + d.y,
                                range: i.default.number(g.range) ? g.range : o.range,
                                source: y,
                                index: v,
                                offset: d
                            })
                        }
                        for (var m = {
                            target: null,
                            inRange: !1,
                            distance: 0,
                            range: 0,
                            delta: {x: 0, y: 0}
                        }, b = 0; b < c.length; b++) {
                            var x = c[b], w = x.range, _ = x.x - l.x, P = x.y - l.y, O = (0, F.default)(_, P),
                                E = O <= w;
                            w === 1 / 0 && m.inRange && m.range !== 1 / 0 && (E = !1), m.target && !(E ? m.inRange && w !== 1 / 0 ? O / w < m.distance / m.range : w === 1 / 0 && m.range !== 1 / 0 || O < m.distance : !m.inRange && O < m.distance) || (m.target = x, m.distance = O, m.range = w, m.inRange = E, m.delta.x = _, m.delta.y = P)
                        }
                        return m.inRange && (n.x = m.target.x, n.y = m.target.y), r.closest = m, m
                    },
                    defaults: {
                        range: 1 / 0,
                        targets: null,
                        offset: null,
                        offsetWithOrigin: !0,
                        origin: null,
                        relativePoints: null,
                        endOnly: !1,
                        enabled: !1
                    }
                };
                Zr.snap = Jr;
                var Qr = (0, Pe.makeModifier)(Jr, "snap");
                Zr.default = Qr;
                var to = {};

                function eo(t, e) {
                    (null == e || e > t.length) && (e = t.length);
                    for (var n = 0, r = Array(e); n < e; n++) r[n] = t[n];
                    return r
                }

                Object.defineProperty(to, "__esModule", {value: !0}), to.snapSize = to.default = void 0;
                var no = {
                    start: function (t) {
                        var e = t.state, n = t.edges, r = e.options;
                        if (!n) return null;
                        t.state = {
                            options: {
                                targets: null,
                                relativePoints: [{x: n.left ? 0 : 1, y: n.top ? 0 : 1}],
                                offset: r.offset || "self",
                                origin: {x: 0, y: 0},
                                range: r.range
                            }
                        }, e.targetFields = e.targetFields || [["width", "height"], ["x", "y"]], Zr.snap.start(t), e.offsets = t.state.offsets, t.state = e
                    }, set: function (t) {
                        var e, n = t.interaction, r = t.state, o = t.coords, a = r.options, s = r.offsets,
                            l = {x: o.x - s[0].x, y: o.y - s[0].y};
                        r.options = (0, k.default)({}, a), r.options.targets = [];
                        for (var c = 0; c < (a.targets || []).length; c++) {
                            var u = (a.targets || [])[c], d = void 0;
                            if (d = i.default.func(u) ? u(l.x, l.y, n) : u) {
                                for (var f = 0; f < r.targetFields.length; f++) {
                                    var p = function (t) {
                                        if (Array.isArray(t)) return t
                                    }(e = r.targetFields[f]) || function (t, e) {
                                        var n = null == t ? null : "undefined" != typeof Symbol && t[Symbol.iterator] || t["@@iterator"];
                                        if (null != n) {
                                            var r, o, i = [], a = !0, s = !1;
                                            try {
                                                for (n = n.call(t); !(a = (r = n.next()).done) && (i.push(r.value), 2 !== i.length); a = !0) ;
                                            } catch (t) {
                                                s = !0, o = t
                                            } finally {
                                                try {
                                                    a || null == n.return || n.return()
                                                } finally {
                                                    if (s) throw o
                                                }
                                            }
                                            return i
                                        }
                                    }(e) || function (t, e) {
                                        if (t) {
                                            if ("string" == typeof t) return eo(t, 2);
                                            var n = Object.prototype.toString.call(t).slice(8, -1);
                                            return "Object" === n && t.constructor && (n = t.constructor.name), "Map" === n || "Set" === n ? Array.from(t) : "Arguments" === n || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n) ? eo(t, 2) : void 0
                                        }
                                    }(e) || function () {
                                        throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")
                                    }(), v = p[0], h = p[1];
                                    if (v in d || h in d) {
                                        d.x = d[v], d.y = d[h];
                                        break
                                    }
                                }
                                r.options.targets.push(d)
                            }
                        }
                        var g = Zr.snap.set(t);
                        return r.options = a, g
                    }, defaults: {range: 1 / 0, targets: null, offset: null, endOnly: !1, enabled: !1}
                };
                to.snapSize = no;
                var ro = (0, Pe.makeModifier)(no, "snapSize");
                to.default = ro;
                var oo = {};
                Object.defineProperty(oo, "__esModule", {value: !0}), oo.snapEdges = oo.default = void 0;
                var io = {
                    start: function (t) {
                        var e = t.edges;
                        return e ? (t.state.targetFields = t.state.targetFields || [[e.left ? "left" : "right", e.top ? "top" : "bottom"]], to.snapSize.start(t)) : null
                    },
                    set: to.snapSize.set,
                    defaults: (0, k.default)((0, he.default)(to.snapSize.defaults), {
                        targets: null,
                        range: null,
                        offset: {x: 0, y: 0}
                    })
                };
                oo.snapEdges = io;
                var ao = (0, Pe.makeModifier)(io, "snapEdges");
                oo.default = ao;
                var so = {};
                Object.defineProperty(so, "__esModule", {value: !0}), Object.defineProperty(so, "default", {
                    enumerable: !0,
                    get: function () {
                        return Tr.default
                    }
                });
                var lo = {};
                Object.defineProperty(lo, "__esModule", {value: !0}), Object.defineProperty(lo, "default", {
                    enumerable: !0,
                    get: function () {
                        return Tr.default
                    }
                });
                var co = {};
                Object.defineProperty(co, "__esModule", {value: !0}), co.default = void 0;
                var uo = {
                    aspectRatio: br.default,
                    restrictEdges: zr.default,
                    restrict: Ir.default,
                    restrictRect: Xr.default,
                    restrictSize: Ur.default,
                    snapEdges: oo.default,
                    snap: Zr.default,
                    snapSize: to.default,
                    spring: so.default,
                    avoid: kr.default,
                    transform: lo.default,
                    rubberband: Kr.default
                };
                co.default = uo;
                var fo = {};
                Object.defineProperty(fo, "__esModule", {value: !0}), fo.default = void 0;
                var po = {
                    id: "modifiers", install: function (t) {
                        var e = t.interactStatic;
                        for (var n in t.usePlugin(Pe.default), t.usePlugin(gr.default), e.modifiers = co.default, co.default) {
                            var r = co.default[n], o = r._defaults, i = r._methods;
                            o._methods = i, t.defaults.perAction[n] = o
                        }
                    }
                }, vo = po;
                fo.default = vo;
                var ho = {};

                function go(t) {
                    return go = "function" == typeof Symbol && "symbol" == a(Symbol.iterator) ? function (t) {
                        return a(t)
                    } : function (t) {
                        return t && "function" == typeof Symbol && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : a(t)
                    }, go(t)
                }

                function yo(t, e) {
                    return yo = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function (t, e) {
                        return t.__proto__ = e, t
                    }, yo(t, e)
                }

                function mo(t, e) {
                    if (e && ("object" === go(e) || "function" == typeof e)) return e;
                    if (void 0 !== e) throw new TypeError("Derived constructors may only return object or undefined");
                    return bo(t)
                }

                function bo(t) {
                    if (void 0 === t) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
                    return t
                }

                function xo(t) {
                    return xo = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function (t) {
                        return t.__proto__ || Object.getPrototypeOf(t)
                    }, xo(t)
                }

                Object.defineProperty(ho, "__esModule", {value: !0}), ho.default = ho.PointerEvent = void 0;
                var wo = function (t) {
                    !function (t, e) {
                        if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function");
                        t.prototype = Object.create(e && e.prototype, {
                            constructor: {
                                value: t,
                                writable: !0,
                                configurable: !0
                            }
                        }), Object.defineProperty(t, "prototype", {writable: !1}), e && yo(t, e)
                    }(a, t);
                    var e, n, r, o, i = (r = a, o = function () {
                        if ("undefined" == typeof Reflect || !Reflect.construct) return !1;
                        if (Reflect.construct.sham) return !1;
                        if ("function" == typeof Proxy) return !0;
                        try {
                            return Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], (function () {
                            }))), !0
                        } catch (t) {
                            return !1
                        }
                    }(), function () {
                        var t, e = xo(r);
                        if (o) {
                            var n = xo(this).constructor;
                            t = Reflect.construct(e, arguments, n)
                        } else t = e.apply(this, arguments);
                        return mo(this, t)
                    });

                    function a(t, e, n, r, o, s) {
                        var l;
                        if (function (t, e) {
                            if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function")
                        }(this, a), l = i.call(this, o), B.pointerExtend(bo(l), n), n !== e && B.pointerExtend(bo(l), e), l.timeStamp = s, l.originalEvent = n, l.type = t, l.pointerId = B.getPointerId(e), l.pointerType = B.getPointerType(e), l.target = r, l.currentTarget = null, "tap" === t) {
                            var c = o.getPointerIndex(e);
                            l.dt = l.timeStamp - o.pointers[c].downTime;
                            var u = l.timeStamp - o.tapTime;
                            l.double = !!o.prevTap && "doubletap" !== o.prevTap.type && o.prevTap.target === l.target && u < 500
                        } else "doubletap" === t && (l.dt = e.timeStamp - o.tapTime, l.double = !0);
                        return l
                    }

                    return e = a, (n = [{
                        key: "_subtractOrigin", value: function (t) {
                            var e = t.x, n = t.y;
                            return this.pageX -= e, this.pageY -= n, this.clientX -= e, this.clientY -= n, this
                        }
                    }, {
                        key: "_addOrigin", value: function (t) {
                            var e = t.x, n = t.y;
                            return this.pageX += e, this.pageY += n, this.clientX += e, this.clientY += n, this
                        }
                    }, {
                        key: "preventDefault", value: function () {
                            this.originalEvent.preventDefault()
                        }
                    }]) && function (t, e) {
                        for (var n = 0; n < e.length; n++) {
                            var r = e[n];
                            r.enumerable = r.enumerable || !1, r.configurable = !0, "value" in r && (r.writable = !0), Object.defineProperty(t, r.key, r)
                        }
                    }(e.prototype, n), Object.defineProperty(e, "prototype", {writable: !1}), a
                }(V.BaseEvent);
                ho.PointerEvent = ho.default = wo;
                var _o = {};
                Object.defineProperty(_o, "__esModule", {value: !0}), _o.default = void 0;
                var Po = {
                    id: "pointer-events/base",
                    before: ["inertia", "modifiers", "auto-start", "actions"],
                    install: function (t) {
                        t.pointerEvents = Po, t.defaults.actions.pointerEvents = Po.defaults, (0, k.default)(t.actions.phaselessTypes, Po.types)
                    },
                    listeners: {
                        "interactions:new": function (t) {
                            var e = t.interaction;
                            e.prevTap = null, e.tapTime = 0
                        }, "interactions:update-pointer": function (t) {
                            var e = t.down, n = t.pointerInfo;
                            !e && n.hold || (n.hold = {duration: 1 / 0, timeout: null})
                        }, "interactions:move": function (t, e) {
                            var n = t.interaction, r = t.pointer, o = t.event, i = t.eventTarget;
                            t.duplicate || n.pointerIsDown && !n.pointerWasMoved || (n.pointerIsDown && So(t), Oo({
                                interaction: n,
                                pointer: r,
                                event: o,
                                eventTarget: i,
                                type: "move"
                            }, e))
                        }, "interactions:down": function (t, e) {
                            !function (t, e) {
                                for (var n = t.interaction, r = t.pointer, o = t.event, i = t.eventTarget, a = t.pointerIndex, s = n.pointers[a].hold, l = P.getPath(i), c = {
                                    interaction: n,
                                    pointer: r,
                                    event: o,
                                    eventTarget: i,
                                    type: "hold",
                                    targets: [],
                                    path: l,
                                    node: null
                                }, u = 0; u < l.length; u++) {
                                    var d = l[u];
                                    c.node = d, e.fire("pointerEvents:collect-targets", c)
                                }
                                if (c.targets.length) {
                                    for (var f = 1 / 0, p = 0; p < c.targets.length; p++) {
                                        var v = c.targets[p].eventable.options.holdDuration;
                                        v < f && (f = v)
                                    }
                                    s.duration = f, s.timeout = setTimeout((function () {
                                        Oo({interaction: n, eventTarget: i, pointer: r, event: o, type: "hold"}, e)
                                    }), f)
                                }
                            }(t, e), Oo(t, e)
                        }, "interactions:up": function (t, e) {
                            So(t), Oo(t, e), function (t, e) {
                                var n = t.interaction, r = t.pointer, o = t.event, i = t.eventTarget;
                                n.pointerWasMoved || Oo({
                                    interaction: n,
                                    eventTarget: i,
                                    pointer: r,
                                    event: o,
                                    type: "tap"
                                }, e)
                            }(t, e)
                        }, "interactions:cancel": function (t, e) {
                            So(t), Oo(t, e)
                        }
                    },
                    PointerEvent: ho.PointerEvent,
                    fire: Oo,
                    collectEventTargets: Eo,
                    defaults: {holdDuration: 600, ignoreFrom: null, allowFrom: null, origin: {x: 0, y: 0}},
                    types: {down: !0, move: !0, up: !0, cancel: !0, tap: !0, doubletap: !0, hold: !0}
                };

                function Oo(t, e) {
                    var n = t.interaction, r = t.pointer, o = t.event, i = t.eventTarget, a = t.type, s = t.targets,
                        l = void 0 === s ? Eo(t, e) : s, c = new ho.PointerEvent(a, r, o, i, n, e.now());
                    e.fire("pointerEvents:new", {pointerEvent: c});
                    for (var u = {
                        interaction: n,
                        pointer: r,
                        event: o,
                        eventTarget: i,
                        targets: l,
                        type: a,
                        pointerEvent: c
                    }, d = 0; d < l.length; d++) {
                        var f = l[d];
                        for (var p in f.props || {}) c[p] = f.props[p];
                        var v = (0, C.default)(f.eventable, f.node);
                        if (c._subtractOrigin(v), c.eventable = f.eventable, c.currentTarget = f.node, f.eventable.fire(c), c._addOrigin(v), c.immediatePropagationStopped || c.propagationStopped && d + 1 < l.length && l[d + 1].node !== c.currentTarget) break
                    }
                    if (e.fire("pointerEvents:fired", u), "tap" === a) {
                        var h = c.double ? Oo({
                            interaction: n,
                            pointer: r,
                            event: o,
                            eventTarget: i,
                            type: "doubletap"
                        }, e) : c;
                        n.prevTap = h, n.tapTime = h.timeStamp
                    }
                    return c
                }

                function Eo(t, e) {
                    var n = t.interaction, r = t.pointer, o = t.event, i = t.eventTarget, a = t.type,
                        s = n.getPointerIndex(r), l = n.pointers[s];
                    if ("tap" === a && (n.pointerWasMoved || !l || l.downTarget !== i)) return [];
                    for (var c = P.getPath(i), u = {
                        interaction: n,
                        pointer: r,
                        event: o,
                        eventTarget: i,
                        type: a,
                        path: c,
                        targets: [],
                        node: null
                    }, d = 0; d < c.length; d++) {
                        var f = c[d];
                        u.node = f, e.fire("pointerEvents:collect-targets", u)
                    }
                    return "hold" === a && (u.targets = u.targets.filter((function (t) {
                        var e;
                        return t.eventable.options.holdDuration === (null == (e = n.pointers[s]) ? void 0 : e.hold.duration)
                    }))), u.targets
                }

                function So(t) {
                    var e = t.interaction, n = t.pointerIndex, r = e.pointers[n].hold;
                    r && r.timeout && (clearTimeout(r.timeout), r.timeout = null)
                }

                var To = Po;
                _o.default = To;
                var jo = {};

                function Mo(t) {
                    var e = t.interaction;
                    e.holdIntervalHandle && (clearInterval(e.holdIntervalHandle), e.holdIntervalHandle = null)
                }

                Object.defineProperty(jo, "__esModule", {value: !0}), jo.default = void 0;
                var ko = {
                    id: "pointer-events/holdRepeat", install: function (t) {
                        t.usePlugin(_o.default);
                        var e = t.pointerEvents;
                        e.defaults.holdRepeatInterval = 0, e.types.holdrepeat = t.actions.phaselessTypes.holdrepeat = !0
                    }, listeners: ["move", "up", "cancel", "endall"].reduce((function (t, e) {
                        return t["pointerEvents:".concat(e)] = Mo, t
                    }), {
                        "pointerEvents:new": function (t) {
                            var e = t.pointerEvent;
                            "hold" === e.type && (e.count = (e.count || 0) + 1)
                        }, "pointerEvents:fired": function (t, e) {
                            var n = t.interaction, r = t.pointerEvent, o = t.eventTarget, i = t.targets;
                            if ("hold" === r.type && i.length) {
                                var a = i[0].eventable.options.holdRepeatInterval;
                                a <= 0 || (n.holdIntervalHandle = setTimeout((function () {
                                    e.pointerEvents.fire({
                                        interaction: n,
                                        eventTarget: o,
                                        type: "hold",
                                        pointer: r,
                                        event: r
                                    }, e)
                                }), a))
                            }
                        }
                    })
                }, Io = ko;
                jo.default = Io;
                var Ao = {};

                function Do(t) {
                    return (0, k.default)(this.events.options, t), this
                }

                Object.defineProperty(Ao, "__esModule", {value: !0}), Ao.default = void 0;
                var Co = {
                    id: "pointer-events/interactableTargets", install: function (t) {
                        var e = t.Interactable;
                        e.prototype.pointerEvents = Do;
                        var n = e.prototype._backCompatOption;
                        e.prototype._backCompatOption = function (t, e) {
                            var r = n.call(this, t, e);
                            return r === this && (this.events.options[t] = e), r
                        }
                    }, listeners: {
                        "pointerEvents:collect-targets": function (t, e) {
                            var n = t.targets, r = t.node, o = t.type, i = t.eventTarget;
                            e.interactables.forEachMatch(r, (function (t) {
                                var e = t.events, a = e.options;
                                e.types[o] && e.types[o].length && t.testIgnoreAllow(a, r, i) && n.push({
                                    node: r,
                                    eventable: e,
                                    props: {interactable: t}
                                })
                            }))
                        }, "interactable:new": function (t) {
                            var e = t.interactable;
                            e.events.getRect = function (t) {
                                return e.getRect(t)
                            }
                        }, "interactable:set": function (t, e) {
                            var n = t.interactable, r = t.options;
                            (0, k.default)(n.events.options, e.pointerEvents.defaults), (0, k.default)(n.events.options, r.pointerEvents || {})
                        }
                    }
                }, zo = Co;
                Ao.default = zo;
                var Ro = {};
                Object.defineProperty(Ro, "__esModule", {value: !0}), Ro.default = void 0;
                var Fo = {
                    id: "pointer-events", install: function (t) {
                        t.usePlugin(_o), t.usePlugin(jo.default), t.usePlugin(Ao.default)
                    }
                }, Lo = Fo;
                Ro.default = Lo;
                var Bo = {};

                function qo(t) {
                    var e = t.Interactable;
                    t.actions.phases.reflow = !0, e.prototype.reflow = function (e) {
                        return function (t, e, n) {
                            for (var r = i.default.string(t.target) ? $.from(t._context.querySelectorAll(t.target)) : [t.target], o = n.window.Promise, a = o ? [] : null, s = function () {
                                var i = r[l], s = t.getRect(i);
                                if (!s) return "break";
                                var c = $.find(n.interactions.list, (function (n) {
                                    return n.interacting() && n.interactable === t && n.element === i && n.prepared.name === e.name
                                })), u = void 0;
                                if (c) c.move(), a && (u = c._reflowPromise || new o((function (t) {
                                    c._reflowResolve = t
                                }))); else {
                                    var d = (0, I.tlbrToXywh)(s),
                                        f = {page: {x: d.x, y: d.y}, client: {x: d.x, y: d.y}, timeStamp: n.now()},
                                        p = B.coordsToEvent(f);
                                    u = function (t, e, n, r, o) {
                                        var i = t.interactions.new({pointerType: "reflow"}),
                                            a = {interaction: i, event: o, pointer: o, eventTarget: n, phase: "reflow"};
                                        i.interactable = e, i.element = n, i.prevEvent = o, i.updatePointer(o, o, n, !0), B.setZeroCoords(i.coords.delta), (0, Ft.copyAction)(i.prepared, r), i._doPhase(a);
                                        var s = t.window.Promise, l = s ? new s((function (t) {
                                            i._reflowResolve = t
                                        })) : void 0;
                                        return i._reflowPromise = l, i.start(r, e, n), i._interacting ? (i.move(a), i.end(o)) : (i.stop(), i._reflowResolve()), i.removePointer(o, o), l
                                    }(n, t, i, e, p)
                                }
                                a && a.push(u)
                            }, l = 0; l < r.length && "break" !== s(); l++) ;
                            return a && o.all(a).then((function () {
                                return t
                            }))
                        }(this, e, t)
                    }
                }

                Object.defineProperty(Bo, "__esModule", {value: !0}), Bo.default = void 0, Bo.install = qo;
                var Xo = {
                    id: "reflow", install: qo, listeners: {
                        "interactions:stop": function (t, e) {
                            var n = t.interaction;
                            "reflow" === n.pointerType && (n._reflowResolve && n._reflowResolve(), $.remove(e.interactions.list, n))
                        }
                    }
                }, Yo = Xo;
                Bo.default = Yo;
                var No = {exports: {}};

                function Wo(t) {
                    return Wo = "function" == typeof Symbol && "symbol" == a(Symbol.iterator) ? function (t) {
                        return a(t)
                    } : function (t) {
                        return t && "function" == typeof Symbol && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : a(t)
                    }, Wo(t)
                }

                Object.defineProperty(No.exports, "__esModule", {value: !0}), No.exports.default = void 0, ar.default.use(se.default), ar.default.use(Ve.default), ar.default.use(Ro.default), ar.default.use(tn.default), ar.default.use(fo.default), ar.default.use(ie.default), ar.default.use(Ot.default), ar.default.use(It.default), ar.default.use(Bo.default);
                var Uo = ar.default;
                if (No.exports.default = Uo, "object" === Wo(No) && No) try {
                    No.exports = ar.default
                } catch (t) {
                }
                ar.default.default = ar.default, Ot.default, It.default, ie.default, se.default, ve.default, tn.default, ar.default, fo.default, Ve.default, Ro.default, Bo.default, No = No.exports;
                var Vo = {exports: {}};

                function Ho(t) {
                    return Ho = "function" == typeof Symbol && "symbol" == a(Symbol.iterator) ? function (t) {
                        return a(t)
                    } : function (t) {
                        return t && "function" == typeof Symbol && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : a(t)
                    }, Ho(t)
                }

                Object.defineProperty(Vo.exports, "__esModule", {value: !0}), Vo.exports.default = void 0;
                var Go = No.default;
                if (Vo.exports.default = Go, "object" === Ho(Vo) && Vo) try {
                    Vo.exports = No.default
                } catch (t) {
                }
                return No.default.default = No.default, Vo.exports
            }, "object" == a(e) ? t.exports = i() : (r = [], void 0 === (o = "function" == typeof (n = i) ? n.apply(e, r) : n) || (t.exports = o))
        }
    }, e = {};

    function n(r) {
        var o = e[r];
        if (void 0 !== o) return o.exports;
        var i = e[r] = {exports: {}};
        return t[r](i, i.exports, n), i.exports
    }

    n.n = function (t) {
        var e = t && t.__esModule ? function () {
            return t.default
        } : function () {
            return t
        };
        return n.d(e, {a: e}), e
    }, n.d = function (t, e) {
        for (var r in e) n.o(e, r) && !n.o(t, r) && Object.defineProperty(t, r, {enumerable: !0, get: e[r]})
    }, n.o = function (t, e) {
        return Object.prototype.hasOwnProperty.call(t, e)
    }, function () {
        "use strict";
        var t = {
            type: "ddPairs",
            title: "Мост из настоящего в будущее",
            question: "",
            frames: [{
                pairs: [{
                    pic_0: "assets/images/pic_1_1.png",
                    pic_1: "assets/images/pic_1_2.png",
                    result: "assets/images/pic_1_3.png",
                    result_txt: ""
                }, {
                    pic_0: "assets/images/pic_2_1.png",
                    pic_1: "assets/images/pic_2_2.png",
                    result: "assets/images/pic_2_3.png",
                    result_txt: ""
                }, {
                    pic_0: "assets/images/pic_3_1.png",
                    pic_1: "assets/images/pic_3_2.png",
                    result: "assets/images/pic_3_3.png",
                    result_txt: ""
                }, {
                    pic_0: "assets/images/pic_4_1.png",
                    pic_1: "assets/images/pic_4_2.png",
                    result: "assets/images/pic_4_3.png",
                    result_txt: ""
                }], type: "simple"
            },
                {
                    pairs: [{
                        pic_0: "assets/images/pic_5_1.png",
                        pic_1: "assets/images/pic_5_2.png",
                        result: "assets/images/pic_5_3.png",
                        result_txt: ""
                    }, {
                        pic_0: "assets/images/pic_6_1.png",
                        pic_1: "assets/images/pic_6_2.png",
                        result: "assets/images/pic_6_3.png",
                        result_txt: ""
                    }, {
                        pic_0: "assets/images/pic_7_1.png",
                        pic_1: "assets/images/pic_7_2.png",
                        result: "assets/images/pic_7_3.png",
                        result_txt: ""
                    }, {
                        pic_0: "assets/images/pic_8_1.png",
                        pic_1: "assets/images/pic_8_2.png",
                        result: "assets/images/pic_8_3.png",
                        result_txt: ""
                    }], type: "simple"
                }]
        };

        function e(t, e) {
            for (var n = 0; n < e.length; n++) {
                var r = e[n];
                r.enumerable = r.enumerable || !1, r.configurable = !0, "value" in r && (r.writable = !0), Object.defineProperty(t, r.key, r)
            }
        }

        var r = function () {
            function t() {
                !function (t, e) {
                    if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function")
                }(this, t), this.lib = {
                    simpleClick: new Audio("assets/audio/simpleClick.mp3"),
                    tictac: new Audio("assets/audio/tictac.mp3"),
                    tictac5: new Audio("assets/audio/tictac-last-five-sec.mp3"),
                    goodAnswer: new Audio("assets/audio/goodAnswer.mp3"),
                    badAnswer: new Audio("assets/audio/badAnswer.mp3"),
                    prize: new Audio("assets/audio/prize.mp3"),
                    nextPage: new Audio("assets/audio/nextPage.mp3"),
                    connection: new Audio("assets/audio/connection.mp3"),
                    typing: new Audio("assets/audio/typing.mp3")
                }
            }

            var n, r;
            return n = t, (r = [{
                key: "simpleClick", value: function () {
                    this.lib.simpleClick.currentTime = 0, this.lib.simpleClick.play()
                }
            }, {
                key: "startTimer", value: function () {
                    this.lib.tictac.loop = !0, this.lib.tictac.currentTime = 0, this.lib.tictac.play()
                }
            }, {
                key: "stopTimer", value: function () {
                    this.lib.tictac.pause()
                }
            }, {
                key: "tictac5", value: function () {
                    this.lib.tictac5.currentTime = 0, this.lib.tictac5.play()
                }
            }, {
                key: "goodAnswer", value: function () {
                    this.lib.goodAnswer.currentTime = 0, this.lib.goodAnswer.play()
                }
            }, {
                key: "badAnswer", value: function () {
                    this.lib.badAnswer.currentTime = 0, this.lib.badAnswer.play()
                }
            }, {
                key: "prize", value: function () {
                    this.lib.prize.currentTime = 0, this.lib.prize.play()
                }
            }, {
                key: "nextPage", value: function () {
                    this.lib.nextPage.currentTime = 0, this.lib.nextPage.play()
                }
            }, {
                key: "connection", value: function () {
                    this.lib.connection.currentTime = 0, this.lib.connection.play()
                }
            }, {
                key: "typing", value: function () {
                    this.lib.typing.currentTime = 0, this.lib.typing.play()
                }
            }]) && e(n.prototype, r), Object.defineProperty(n, "prototype", {writable: !1}), t
        }();

        function o(t, e) {
            for (var n = 0; n < e.length; n++) {
                var r = e[n];
                r.enumerable = r.enumerable || !1, r.configurable = !0, "value" in r && (r.writable = !0), Object.defineProperty(t, r.key, r)
            }
        }

        var i = function () {
            function t(e, n) {
                !function (t, e) {
                    if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function")
                }(this, t), this.cont = e, this.props = n, this.sounder = new r, this.render()
            }

            var e, n;
            return e = t, (n = [{
                key: "render", value: function () {
                    var t = this;
                    this.modalCont = document.createElement("div"), this.modalCont.classList.add("modal_page"), this.modalCont.innerHTML = '\n        <div class="intro_container_abstract">\n            <div class="intro_stroke_abstract"></div>\n            <div class="intro_pg_abstract info-block">\n                <h3>'.concat(this.props.content, '</h3>\n                <div class="intro_start_abstract closeBtn"> \n                        <ul>\n                            <a><li class="no_timer green_clr">Закрыть</li></a>\n                        </ul>\n                    </div>\n            </div>\n        </div>'), this.modalCont.querySelector(".closeBtn").addEventListener("click", (function () {
                        t.close()
                    })), this.cont.appendChild(this.modalCont)
                }
            }, {
                key: "close", value: function () {
                    this.sounder.simpleClick(), this.modalCont.parentNode.removeChild(this.modalCont)
                }
            }]) && o(e.prototype, n), Object.defineProperty(e, "prototype", {writable: !1}), t
        }();

        function a(t, e) {
            for (var n = 0; n < e.length; n++) {
                var r = e[n];
                r.enumerable = r.enumerable || !1, r.configurable = !0, "value" in r && (r.writable = !0), Object.defineProperty(t, r.key, r)
            }
        }

        var s = function () {
            function t(e, n) {
                !function (t, e) {
                    if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function")
                }(this, t), this.cont = e, this.info = n, this.sounder = new r, this.render()
            }

            var e, n;
            return e = t, (n = [{
                key: "render", value: function () {
                    var t = this, e = document.createElement("div");
                    e.innerHTML = '<img src="./assets/images/info.svg" width="112" height="112"/>', e.classList.add("copyrightInfo"), e.addEventListener("click", (function () {
                        t.sounder.simpleClick(), t.showInfo()
                    })), this.cont.appendChild(e)
                }
            }, {
                key: "showInfo", value: function () {
                    this.modal = new i(this.cont.parentNode, {content: this.info})
                }
            }]) && a(e.prototype, n), Object.defineProperty(e, "prototype", {writable: !1}), t
        }(), l = n(3984), c = n.n(l);

        function u(t) {
            t.length ? t.forEach((function (t) {
                t.classList.add("close")
            })) : t.classList.add("close")
        }

        function d(t) {
            return function (t) {
                if (Array.isArray(t)) return f(t)
            }(t) || function (t) {
                if ("undefined" != typeof Symbol && null != t[Symbol.iterator] || null != t["@@iterator"]) return Array.from(t)
            }(t) || function (t, e) {
                if (t) {
                    if ("string" == typeof t) return f(t, e);
                    var n = Object.prototype.toString.call(t).slice(8, -1);
                    return "Object" === n && t.constructor && (n = t.constructor.name), "Map" === n || "Set" === n ? Array.from(t) : "Arguments" === n || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n) ? f(t, e) : void 0
                }
            }(t) || function () {
                throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")
            }()
        }

        function f(t, e) {
            (null == e || e > t.length) && (e = t.length);
            for (var n = 0, r = new Array(e); n < e; n++) r[n] = t[n];
            return r
        }

        function p(t, e) {
            for (var n = 0; n < e.length; n++) {
                var r = e[n];
                r.enumerable = r.enumerable || !1, r.configurable = !0, "value" in r && (r.writable = !0), Object.defineProperty(t, r.key, r)
            }
        }

        var v = function () {
            function t(e, n) {
                !function (t, e) {
                    if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function")
                }(this, t), this.container = e, this.data = n, this.sounder = new r, this.currentFrame = 1, this.donePairsCount = 0, this.zIndex = 100, this.render(), this.preloadMedia(), this.renderFrame(this.currentFrame)
            }

            var e, n;
            return e = t, (n = [{
                key: "render", value: function () {
                    this.container.innerHTML = '\n        <div class="wrapper">    \n            <div class="reload_pg">\n                <a><img src="./assets/images/reload.svg" height="52"></a>\n            </div>\n            <div class="txt-block">\n                <h1 class="title">'.concat(this.data.title, '</h1>\n                <p class="q_text">').concat(this.data.question, '</p>\n            </div>\n\n            <div class="wrapper-drag">\n                <div class="ddCont solution0"></div>\n            </div>\n\n            <div class="bottom-answer">\n                <div class="button">\n                    <button class="nextBtn">Далее</button>\n                </div>\n            </div>\n\n        </div>    \n        '), this.ddCont = this.container.querySelector(".ddCont"), this.initNextBtn()
                }
            }, {
                key: "initNextBtn", value: function () {
                    var t = this;
                    this.nextBtn = this.container.querySelector(".nextBtn"), this.nextBtn.addEventListener("click", (function () {
                        t.goNext()
                    }))
                }
            }, {
                key: "goNext", value: function () {
                    this.currentFrame++, this.renderFrame(this.currentFrame)
                }
            }, {
                key: "renderFrame", value: function (t) {
                    var e;
                    this.currentFrameData = this.data.frames[t - 1], this.throwCards(), this.initDD(), this.mixStep = 1, this.donePairsCount = 0, this.ddCont.className = "", this.ddCont.classList.add("ddCont", "solution0"), this.ddCont.classList.add(this.getCardNumberClass()), console.log(this.currentFrame, this.data.frames.length), this.currentFrame < this.data.frames.length ? function (t) {
                        t.length ? t.forEach((function (t) {
                            t.classList.remove("close")
                        })) : t.classList.remove("close")
                    }(this.nextBtn) : (e = this.nextBtn).length ? e.forEach((function (t) {
                        t.classList.add("hide")
                    })) : e.classList.add("hide")
                }
            }, {
                key: "getCardNumberClass", value: function () {
                    var t = "none";
                    return "simple" === this.currentFrameData.type ? (t = "six-card", 2 === this.currentFrameData.pairs.length ? t = "four-card" : 4 === this.currentFrameData.pairs.length ? t = "eight-card" : 5 === this.currentFrameData.pairs.length && (t = "ten-card")) : "strictSequence" === this.currentFrameData.type && 4 === this.currentFrameData.parts.length && (t = "four-card"), t
                }
            }, {
                key: "preloadMedia", value: function () {
                    var t = [];
                    this.data.frames.forEach((function (e) {
                        "simple" === e.type && e.pairs.forEach((function (e) {
                            t.push({type: "img", src: e.pic_0}), t.push({
                                type: "img",
                                src: e.pic_1
                            }), t.push({type: "img", src: e.result})
                        })), "strictSequence" === e.type && (e.parts.forEach((function (e) {
                            t.push({type: "img", src: e})
                        })), e.mixes.forEach((function (e) {
                            t.push({type: "img", src: e})
                        })))
                    })), function (t, e) {
                        var n, r, o = document.createElement("div");
                        u(o), o.classList.add("mediaLoader"), t.querySelector(".mediaLoader") ? o = t.querySelector(".mediaLoader") : t.appendChild(o), r = [(n = e)[0]], n.forEach((function (t) {
                            (function (t, e) {
                                var n = !1;
                                return t.forEach((function (t) {
                                    JSON.stringify(e) === JSON.stringify(t) && (n = !0)
                                })), n
                            })(r, t) || r.push(t)
                        }));
                        var i = null;
                        (e = r).forEach((function (t) {
                            i = null, "video" === t.type ? (i = document.createElement("video")).setAttribute("preload", "auto") : "img" === t.type && (i = document.createElement("img")), i && (i.src = t.src, o.appendChild(i))
                        }))
                    }(this.container, t)
                }
            }, {
                key: "throwCards", value: function () {
                    var t = this, e = [];
                    "simple" === this.currentFrameData.type ? this.currentFrameData.pairs.forEach((function (t, n) {
                        e.push('\n                <div class="card draggable" data-n="'.concat(n + 1, '">\n                    <img src="').concat(t.pic_0, '"/>\n                </div>')), e.push('            \n                <div class="card draggable" data-n="'.concat(n + 1, '">\n                    <img src="').concat(t.pic_1, '"/>\n                </div>\n                '))
                    })) : "strictSequence" === this.currentFrameData.type && this.currentFrameData.parts.forEach((function (t, n) {
                        e.push('\n                <div class="card draggable" data-n="'.concat(n + 1, '">\n                    <img src="').concat(t, '"/>\n                </div>\n                '))
                    })), function (t) {
                        for (var e = t.length - 1; e > 0; e--) {
                            var n = Math.floor(Math.random() * (e + 1)), r = [t[n], t[e]];
                            t[e] = r[0], t[n] = r[1]
                        }
                    }(e);
                    var n = "";
                    e.forEach((function (t) {
                        n += t
                    })), this.ddCont.innerHTML = n, this.ddCards = this.ddCont.querySelectorAll(".card"), this.ddCards.forEach((function (e) {
                        e.style.zIndex = t.zIndex++
                    })), this.initSpecialClasses()
                }
            }, {
                key: "initSpecialClasses", value: function () {
                    var t = this, e = 1;
                    this.ddCont.querySelectorAll(".card").forEach((function (t) {
                        d(t.classList).filter((function (t) {
                            return t.match(/^img*/)
                        })).forEach((function (e) {
                            t.classList.remove(e)
                        }))
                    }));
                    var n = this.ddCont.querySelectorAll(".result");
                    n && n.forEach((function (t) {
                        t.classList.add("img".concat(e++))
                    })), this.ddCont.querySelectorAll(".card").forEach((function (t) {
                        t.classList.contains("draggable") && t.classList.add("img".concat(e++))
                    }));
                    var r = this.ddCont.querySelectorAll(".result");
                    r && (d(this.ddCont.classList).filter((function (t) {
                        return t.match(/^solution*/)
                    })).forEach((function (e) {
                        t.ddCont.classList.remove(e)
                    })), this.ddCont.classList.add("solution".concat(r.length)))
                }
            }, {
                key: "initDD", value: function () {
                    var t = this;
                    this.currentDrop = null;
                    var e = function (e) {
                        var n = e.target;
                        if (t.currentDrop && t.currentDrop.dataset.n === n.dataset.n) n.classList.remove("draggable"), t.currentDrop.classList.remove("draggable"), t.pairFind(n.dataset.n, [n, t.currentDrop]); else {
                            t.sounder.badAnswer();
                            var r = n.getAttribute("data-x0"), o = n.getAttribute("data-y0");
                            n.setAttribute("data-x", r), n.setAttribute("data-y", o), n.style.transform = "translate(".concat(r, "px, ").concat(o, "px)")
                        }
                    };
                    "strictSequence" === this.currentFrameData.type && (e = function (e) {
                        var n = e.target;
                        if (!t.currentDrop || 1 !== Math.abs(parseInt(t.currentDrop.dataset.n) - parseInt(n.dataset.n)) || parseInt(t.currentDrop.dataset.n) !== t.mixStep && parseInt(n.dataset.n) !== t.mixStep) {
                            t.sounder.badAnswer();
                            var r = n.getAttribute("data-x0"), o = n.getAttribute("data-y0");
                            n.setAttribute("data-x", r), n.setAttribute("data-y", o), n.style.transform = "translate(".concat(r, "px, ").concat(o, "px)")
                        } else t.sequencePairFind(n.dataset.n, [n, t.currentDrop])
                    }), c()(".draggable").draggable({
                        listeners: {
                            start: function (e) {
                                var n = e.target;
                                e.target.style.zIndex = t.zIndex++;
                                var r = (parseFloat(n.getAttribute("data-x")) || 0) + e.dx,
                                    o = (parseFloat(n.getAttribute("data-y")) || 0) + e.dy;
                                n.style.transform = "translate(" + r + "px, " + o + "px)", n.setAttribute("data-x0", r), n.setAttribute("data-y0", o)
                            }, move: function (t) {
                                var e = t.target, n = (parseFloat(e.getAttribute("data-x")) || 0) + t.dx,
                                    r = (parseFloat(e.getAttribute("data-y")) || 0) + t.dy;
                                e.style.transform = "translate(" + n + "px, " + r + "px)", e.setAttribute("data-x", n), e.setAttribute("data-y", r)
                            }, end: e
                        }, modifiers: [c().modifiers.restrictRect({restriction: "parent"})]
                    }), c()(".draggable").dropzone({
                        accept: ".draggable", overlap: .25, ondropactivate: function (t) {
                        }, ondragenter: function (e) {
                            var n = e.target;
                            t.currentDrop = n
                        }, ondragleave: function (e) {
                            t.currentDrop = null
                        }, ondrop: function (e) {
                            var n = e.target;
                            t.currentDrop = n
                        }
                    })
                }
            }, {
                key: "pairFind", value: function (t, e) {
                    this.sounder.goodAnswer(), this.donePairsCount++, u(e[0]), e[1].querySelector("img").src = this.currentFrameData.pairs[t - 1].result, e[1].classList.add("result"), this.addFinalHint(e[1], this.currentFrameData.pairs[t - 1].result_txt), this.initSpecialClasses(), this.donePairsCount === this.currentFrameData.pairs.length && (this.ddCont.classList.add("winner"), this.allDone())
                }
            }, {
                key: "sequencePairFind", value: function (t, e) {
                    this.sounder.goodAnswer(), this.donePairsCount++, u(e[0]), e[0].parentNode.removeChild(e[0]), e[1].dataset.n = this.mixStep + 1, e[1].querySelector("img").src = this.currentFrameData.mixes[this.mixStep - 1], e[1].classList.add("result"), this.mixStep++, this.ddCont.classList.remove("solution".concat(this.donePairsCount - 1)), this.ddCont.classList.add("solution".concat(this.donePairsCount)), this.donePairsCount === this.currentFrameData.mixes.length && (this.ddCont.classList.add("winner"), e[1].classList.remove("draggable"), this.addFinalHint(e[1], this.currentFrameData.result_txt), this.allDone())
                }
            }, {
                key: "addFinalHint", value: function (t, e) {
                    if (console.log("in", e), e) {
                        var n = document.createElement("div");
                        n.innerHTML = e, n.classList.add("final-text"), t.appendChild(n)
                    }
                }
            }, {
                key: "allDone", value: function () {
                    var t = this;
                    setTimeout((function () {
                        t.sounder.prize()
                    }), 1e3)
                }
            }]) && p(e.prototype, n), Object.defineProperty(e, "prototype", {writable: !1}), t
        }();
        !function (t, e) {
            var n, o, i = document.body;
            document.body.classList.add("theme-" + (null !== (n = t.theme) && void 0 !== n ? n : "default")), document.body.classList.add("type-" + t.type), document.title = null !== (o = t.title) && void 0 !== o ? o : "", e(i);
            var a = new r, l = i.querySelector(".reload_pg");
            l && l.addEventListener("click", (function () {
                a.simpleClick(), confirm("Вы уверены, что хотите начать заново?") && window.location.reload(!0)
            })), t.copyrightInfo && new s(i, t.copyrightInfo), t.customBgColor && (i.querySelector("div").style.backgroundColor = t.customBgColor)
        }(t, (function (e) {
            new v(e, t)
        }))
    }()
}();