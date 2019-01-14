import Utils from './utils';

export default class GlobalClass {
    constructor(params = {}) {
        const _this = this;
        _this.params = params;
        _this.eventsListeners = {};
        if (_this.params && _this.params.on) {
            Object.keys(_this.params.on).forEach((eventName) => {
                _this.on(eventName, _this.params.on[eventName]);
            });
        }
    }

    on(events, handler, priority) {
        const _this = this;
        if(typeof handler !== 'function') return _this;
        const method = priority ? 'unshift' : 'push';
        events.split(' ').forEach(event => {
            if(!_this.eventsListeners[event]) _this.eventsListeners[event] = [];
            _this.eventsListeners[event][method](handler);
        });
        return this;
    }

    once(events, handler, priority) {
        const _this = this;
        if (typeof handler !== 'function') return _this;
        function onceHandler(...args) {
            handler.apply(_this, args);
            _this.off(events, onceHandler);
        }
        return _this.on(events, onceHandler, priority);
    }

    off(events, handler) {
        const _this = this;
        if (!_this.eventsListeners) return _this;
        events.split(' ').forEach((event) => {
            if (typeof handler === 'undefined') {
                _this.eventsListeners[event] = [];
            } else if (_this.eventsListeners[event] && _this.eventsListeners[event].length) {
                _this.eventsListeners[event].forEach((eventHandler, index) => {
                    if (eventHandler === handler) {
                        _this.eventsListeners[event].splice(index, 1);
                    }
                });
            }
        });
        return _this;
    }

    emit(...args) {
        const _this = this;
        if (!_this.eventsListeners) return _this;
        let events;
        let data;
        let context;
        if (typeof args[0] === 'string' || Array.isArray(args[0])) {
            events = args[0];
            data = args.slice(1, args.length);
            context = _this;
        } else {
            events = args[0].events;
            data = args[0].data;
            context = args[0].context || _this;
        }
        const eventsArray = Array.isArray(events) ? events : events.split(' ');
        eventsArray.forEach((event) => {
            if (_this.eventsListeners && _this.eventsListeners[event]) {
                const handlers = [];
                _this.eventsListeners[event].forEach((eventHandler) => {
                    handlers.push(eventHandler);
                });
                handlers.forEach((eventHandler) => {
                    eventHandler.apply(context, data);
                });
            }
        });
        return _this;
    }

    static installModule(module, ...params) {
        const Class = this;
        console.log(module);
    }

    static use(module, ...params) {
        const Class = this;
        if (Array.isArray(module)) {
            module.forEach(m => Class.installModule(m));
            return Class;
        }
        return Class.installModule(module, ...params);
    }
}