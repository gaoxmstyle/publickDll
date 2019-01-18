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
            content: '',
            during: 1000
        };

        this.o = Utils.extend(this.o, params);

        this._render();
    }

    _render() {
        const _this = this;
        const _toastHtml = `<div class="toast">${_this.o.content}</div>`;
        const _html = document.createElement('div');

        _html.innerHTML = _toastHtml;
        this.toast = _html.childNodes[0];


    }
}