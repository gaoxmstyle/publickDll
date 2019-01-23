import GlobalClass from '../../utils/class';
import Utils from "../../utils/utils";

export default class Toast extends GlobalClass {
    constructor(...args) {
        let params, el;
        if(args.length === 1) {
            params = args[0]
        } else {
            [el, params] = args;
        }
        super(params);
        this.el = document.querySelector(el) || document.body;
        this.o = {
            content: '温馨提示',
            during: 1000
        };

        this.o = Utils.extend(this.o, params);
        this.timer = null;
        this.opened = false;
        this._render();
    }

    _render() {
        const _this = this;
        const _toastHtml = `<div class="toast">${_this.o.content}</div>`;
        const _html = document.createElement('div');

        _html.innerHTML = _toastHtml;
        _this.toast = _html.childNodes[0];
    }

    show(content = this.o.content) {
        const _this = this;

        _this.opened = false;
        Utils.clearTick(_this.timer);
        _this.toast.innerText = content;
        Utils.show(_this.toast);
        !_this.el.contains(_this.toast) && _this.el.appendChild(_this.toast);



        Utils.nextTick(function () {
            !_this.toast.classList.contains('show') && _this.toast.classList.add('show');
            Utils.transitionEnd(_this.toast, function () {
                _this.opened = true;
            });
        });

        _this.timer = Utils.nextTick(function () {
            _this.toast.classList.contains('show') && _this.toast.classList.remove('show');
            Utils.transitionEnd(_this.toast, function () {
                if(_this.opened) {
                    Utils.hide(_this.toast);
                    _this.el.contains(_this.toast) && _this.el.removeChild(_this.toast);
                }
            });
        }, _this.o.during);
    }
}