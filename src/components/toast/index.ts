import {IModal} from '../../interface/index';
import {TModal} from '../../types/TModal';
import './index.scss';

export default class Toast implements IModal {
    el: any;
    toast: any;
    timer: any; 
    defaultOptions: TModal;

    constructor(options: TModal) {
        // 默认参数
        this.defaultOptions = {
            content: options.content || '',
            el: options.el || null,
            title: options.title || '',
            during: options.during || 1000,
            maskCallBack: options.maskCallBack || null
        };

        this.render(this.defaultOptions);
    }

    render(options: TModal) {
        const toastHtml = `<div class='gxm-toast'>${options.content}</div>`;
        
        this.el = document.body;
        if(options.el !== null) {
            this.el = document.querySelector(options.el);
        }

        const html = document.createElement('div');
    
        html.innerHTML = toastHtml;
        this.toast = html.childNodes[0];

        this.el.appendChild(this.toast);
    };

    show(options: TModal) {
        const content = (options && options.content) || this.defaultOptions.content;

        this.timer && clearTimeout(this.timer);
        (!this.toast.classList.contains('show')) && this.toast.classList.add('show');

        (this.toast.innerText !== content) && (this.toast.innerText = content);

        this.timer = setTimeout(()=> {
            this.toast.classList.remove('show');
        }, this.defaultOptions.during);
    }
}