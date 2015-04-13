/*!
 * verge 1.9.1+201402130803
 * https://github.com/ryanve/verge
 * MIT License 2013 Ryan Van Etten
 */

(function(root, name, make) {
  if (typeof module != 'undefined' && module['exports']) module['exports'] = make();
  else root[name] = make();
}(this, 'verge', function () {
    "use strict";

    var xports = {},
        win = window !== undefined && window,
        doc = document !== undefined && document,
        docElem = doc && doc.documentElement,
        matchMedia = win.matchMedia || win.msMatchMedia,
        mq = matchMedia ? function (q) {
            return !!matchMedia.call(win, q).matches;
        } : function () {
            return false;
        };

    xports.viewportW = function () {
        var a = docElem.clientWidth,
            b = win.innerWidth;
        return a < b ? b : a;
    };

    xports.viewportH = function () {
        var a = docElem.clientHeight,
            b = win.innerHeight;
        return a < b ? b : a;
    };

    xports.mq = mq;

    xports.matchMedia = matchMedia ? function () {
        // matchMedia must be bound to window
        return matchMedia.apply(win, arguments);
    } : function () {
        // Gracefully degrade to plain object
        return {};
    };

    xports.viewport = function () {
        return {
            'width': xports.viewportW(),
            'height': xports.viewportH()
        };
    };

    xports.scrollX = function () {
        return win.pageXOffset || docElem.scrollLeft;
    };

    xports.scrollY = function () {
        return win.pageYOffset || docElem.scrollTop;
    };

    function calibrate(coords, cushion) {
        var o = {};

        cushion = +cushion || 0;

        o.right =  coords.right  + cushion;
        o.left =   coords.left   - cushion;
        o.bottom = coords.bottom + cushion;
        o.top =    coords.top    - cushion;

        o.width = o.right - o.left;
        o.height = o.bottom - o.top;

        return o;
    }

    xports.rectangle = function (el, cushion) {
        el = el && !el.nodeType ? el[0] : el;
        if (!el || 1 !== el.nodeType) { return false; }
        return calibrate(el.getBoundingClientRect(), cushion);
    };

    xports.aspect = function (o) {
        o = o === undefined ? xports.viewport() : 1 === o.nodeType ? xports.rectangle(o) : o;

        var h = o.height,
            w = o.width;

        h = typeof h === 'function' ? h.call(o) : h;
        w = typeof w === 'function' ? w.call(o) : w;

        return w / h;
    };

    xports.inX = function (el, cushion) {
        var r = xports.rectangle(el, cushion);
        return !!r && r.right >= 0 && r.left <= xports.viewportW();
    };

    xports.inY = function (el, cushion) {
        var r = xports.rectangle(el, cushion);
        return !!r && r.bottom >= 0 && r.top <= xports.viewportH();
    };

    xports.inViewport = function (el, cushion) {
        var r = xports.rectangle(el, cushion);
        return !!r && r.bottom >= 0 && r.right >= 0 && r.top <= xports.viewportH() && r.left <= xports.viewportW();
    };

    return xports;
}));
