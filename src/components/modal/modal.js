import GlobalClass from '../../utils/class';
import Utils from "../../utils/utils";

export default class Modal extends GlobalClass{
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
            title: '温馨提示',
            content: ''
        };

        Utils.extend(this.o, params);
        this._render();
    }

    _render() {
        const _this = this;
        const modalOverlayHtml = '<div class="modal-overlay"></div>';
        const modalHtml = `<div class="modal"><div class="modal-inner"><div class="modal-title">${_this.o.title}</div><div class="modal-content">${this.o.content}</div></div><div class="modal-buttons"><div class="btn-cancel btn" data-on="cancel">取消</div><div class="btn-confirm btn" data-on="confirm">确定</div></div></div>`;
        const _html = document.createElement('div');

        _html.innerHTML = modalOverlayHtml;
        this.modalOverlay = _html.childNodes[0];

        _html.innerHTML = modalHtml;
        this.modal = _html.childNodes[0];

        this.modalArr = [this.modalOverlay, this.modal];

        this.modal.querySelectorAll('.btn').forEach(function (item) {
            item.addEventListener('click', function (e) {
                const event = e.target.getAttribute('data-on');
                _this.hide();
                _this.emit(event, event);
            });
        });
    }

    show() {
        const _this = this;
        _this.modalArr.forEach(function (item) {
            Utils.addChild(_this.el, item);
            Utils.show(item);
            _this.modal.style.marginTop = _this.modal.offsetHeight / 2 * -1 + 'px';
            Utils.nextTick(() => item.classList.add('in'));
        });
    }

    hide() {
        const _this = this;
        this.modalArr.forEach(function (item) {
            item.classList.add('out');
            Utils.transitionEnd(item, function () {
                Utils.hide(item);
                Utils.removeChild(_this.el, item);
            });
        });
    }
}