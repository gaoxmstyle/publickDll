import { IModal } from '../../interface/index';
import {TModal} from '../../types/TModal';
import './index.scss';

export default class Modal implements IModal {
    el: any;
    o: any;
    modal: any;
    defaultOptions: TModal;

    constructor(options: TModal) {
        // 默认参数
        this.defaultOptions = {
            content: options.content || '',
            el: options.el || null,
            title: options.title || '温馨提示',
            during: options.during || 1000,
            maskCallBack: options.maskCallBack || null
        };

        this.render(this.defaultOptions);
    }

    render(options: TModal) {
        const modalHtml = `<div class='gxm-modal'><div class='mask'></div><div class='container'><div class='title'>${options.title}</div><div class='content'>${options.content}</div></div></div>`;

        this.el = document.body;
        if(options.el !== null) {
            this.el = document.querySelector(options.el);
        }

        const html = document.createElement('div');
        html.innerHTML = modalHtml;
        this.modal = html.childNodes[0];

        if(options.maskCallBack) {
            const mask = this.modal.querySelector('.mask');
            mask.addEventListener('click', (e: any) => {
                options.maskCallBack(e);
            });
        }

        this.el.appendChild(this.modal);
    }

    show(options: TModal) {
        const title = (options && options.title) || this.defaultOptions.title;
        const content = (options && options.content) || this.defaultOptions.content;
        const titleNode = this.modal.querySelector('.title');
        const contentNode = this.modal.querySelector('.content');

        (titleNode.innerText !== title) && (titleNode.innerText = title);
        (contentNode.innerText !== content) && (contentNode.innerText = content);

        this.modal.classList.add('show');
    }

    hide() {
        this.modal.classList.remove('show');
    }

    toggle() {
        this.modal.classList.toggle('show');
    }
}