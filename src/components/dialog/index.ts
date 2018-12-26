import {IModal} from '../../interface/index';
import {TModal} from '../../types/TModal';
import './index.scss';

export default class Dialog implements IModal {
    el: any;
    dialog: any;
    defaultOptions: TModal;

    constructor(options: TModal) {
        // 默认参数
        this.defaultOptions = {
            content: options.content || '',
            el: options.el || null,
            title: options.title || '温馨提示',
            during: options.during || 1000,
            maskCallBack: options.maskCallBack || null,
            isCancel: options.isCancel || false,
            confirmCallBack: options.confirmCallBack || null,
            cancelCallBack: options.cancelCallBack || null
        };

        this.render(this.defaultOptions);
    }

    render(options: TModal) {
        const dialogHtml = `<div class='gxm-dialog'><div class='mask'></div><div class='container'><div class='title'>${options.title}</div><div class='content'>${options.content}</div><div class='btn-container'>${this.defaultOptions.isCancel ? '<button class=\'confirm\'>确定</button><button class=\'cancel\'>取消</button>':'<button class=\'confirm\'>确定</button>'}</div></div></div>`;

        this.el = document.body;
        if(options.el !== null) {
            this.el = document.querySelector(options.el);
        }

        const html = document.createElement('div');
        html.innerHTML = dialogHtml;
        this.dialog = html.childNodes[0];

        if(options.maskCallBack) {
            const mask = this.dialog.querySelector('.mask');
            mask.addEventListener('click', (e: any) => {
                options.maskCallBack(e);
            });
        }

        const btnConfirm = this.dialog.querySelector('.confirm');
        const btnCancel = this.dialog.querySelector('.cancel');

        btnConfirm.addEventListener('click', (e: any) => {
            options.confirmCallBack && options.confirmCallBack();
        });

        btnCancel && btnCancel.addEventListener('click', (e: any) => {
            this.hide();
            options.cancelCallBack && options.cancelCallBack();
        });

        this.el.appendChild(this.dialog);
    }

    show(options: TModal) {
        const title = (options && options.title) || this.defaultOptions.title;
        const content = (options && options.content) || this.defaultOptions.content;
        const titleNode = this.dialog.querySelector('.title');
        const contentNode = this.dialog.querySelector('.content');

        (titleNode.innerText !== title) && (titleNode.innerText = title);
        (contentNode.innerText !== content) && (contentNode.innerText = content);

        this.dialog.classList.add('show');
    }

    hide() {
        this.dialog.classList.remove('show');
    }
}