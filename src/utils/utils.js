const Utils = {
    deleteProps(obj) {
        const object = obj;
        Object.keys(object).forEach(key => {
            try {
                object[key] = null;
            } catch (e) {
                throw e.toString();
            }
            try {
                delete object[key];
            } catch (e) {
                throw e.toString();
            }
        });
    },
    retainDecimal(num, fixed = 2) {
        fixed = Math.pow(10, fixed);
        return Math.floor(num * fixed) / fixed;
    },
    nextTick(callback, delay = 0){
        return setTimeout(callback, delay);
    },
    clearTick(timer) {
        return timer && clearTimeout(timer);
    },
    now() {
        return Date.now();
    },
    dToR(degrees){
        return degrees * (Math.PI / 180);
    },
    show(el) {
        el.style.display = 'block';
    },
    hide(el) {
        el.style.display = 'none';
    },
    addChild(el, nodes) {
        !el.contains(nodes) && el.appendChild(nodes);
    },
    removeChild(el, nodes) {
        el.contains(nodes) && el.removeChild(nodes);
    },
    transitionEnd(dom, callBack) {
        const events = ['webkitTransitionEnd', 'transitionend', 'oTransitionEnd', 'MSTransitionEnd', 'msTransitionEnd'];
        function fireCallBack(e) {
            if(e.target !== this) return;
            callBack.call(this, e);
            for (let i = events.length; i--;){
                dom.removeEventListener(events[i], fireCallBack);
            }
        }

        if(callBack) {
            for (let i = events.length; i--;) {
                dom.addEventListener(events[i], fireCallBack);
            }
        }
    },
    getTranslate(el, axis = 'x') {
        let matrix;
        let curTransform;
        let transformMatrix;

        const curStyle = window.getComputedStyle(el, null);

        if (window.WebKitCSSMatrix) {
            curTransform = curStyle.transform || curStyle.webkitTransform;
            if (curTransform.split(',').length > 6) {
                curTransform = curTransform.split(', ').map(a => a.replace(',', '.')).join(', ');
            }
            // Some old versions of Webkit choke when 'none' is passed; pass
            // empty string instead in this case
            transformMatrix = new window.WebKitCSSMatrix(curTransform === 'none' ? '' : curTransform);
        } else {
            transformMatrix = curStyle.MozTransform || curStyle.OTransform || curStyle.MsTransform || curStyle.msTransform || curStyle.transform || curStyle.getPropertyValue('transform').replace('translate(', 'matrix(1, 0, 0, 1,');
            matrix = transformMatrix.toString().split(',');
        }

        if (axis === 'x') {
            // Latest Chrome and webkits Fix
            if (window.WebKitCSSMatrix) curTransform = transformMatrix.m41;
            // Crazy IE10 Matrix
            else if (matrix.length === 16) curTransform = parseFloat(matrix[12]);
            // Normal Browsers
            else curTransform = parseFloat(matrix[4]);
        }
        if (axis === 'y') {
            // Latest Chrome and webkits Fix
            if (window.WebKitCSSMatrix) curTransform = transformMatrix.m42;
            // Crazy IE10 Matrix
            else if (matrix.length === 16) curTransform = parseFloat(matrix[13]);
            // Normal Browsers
            else curTransform = parseFloat(matrix[5]);
        }
        return curTransform || 0;
    },
    isObject(o) {
        return typeof o === 'object' && o !== null && o.constructor && o.constructor === Object;
    },
    extend(...args) {
        const to = Object(args[0]);
        for (let i = 0; i < args.length; i++) {
            const nextSource = args[i];
            if(nextSource !== undefined && nextSource !== null) {
                const keysArray = Object.keys(Object(nextSource));
                for(let nextIndex = 0, len = keysArray.length; nextIndex < len; nextIndex++){
                    const nextKey = keysArray[nextIndex];
                    const desc = Object.getOwnPropertyDescriptor(nextSource, nextKey);
                    if (desc !== undefined && desc.enumerable) {
                        if (Utils.isObject(to[nextKey]) && Utils.isObject(nextSource[nextKey])) {
                            Utils.extend(to[nextKey], nextSource[nextKey]);
                        } else if (!Utils.isObject(to[nextKey]) && Utils.isObject(nextSource[nextKey])) {
                            to[nextKey] = {};
                            Utils.extend(to[nextKey], nextSource[nextKey]);
                        } else {
                            to[nextKey] = nextSource[nextKey];
                        }
                    }
                }
            }
        }
        return to;
    }
};

export default Utils;