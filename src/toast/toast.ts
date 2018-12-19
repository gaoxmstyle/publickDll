import * as objectAssign from 'object-assign';
import { Modal } from '../interface/index';
import {ModalOptionsType} from '../types/Modal';

export class Toast implements Modal {
    o: any;
    el: any;
    toast: any;
    timer: any;
    defaultOptions: ModalOptionsType;

    constructor(options: ModalOptionsType) {
        // 默认参数
        this.defaultOptions = {
            content: '',
            during: 1,
            el: null
        };

        this.o = objectAssign(this.defaultOptions, options);

        this.render(this.o);
    }

    render(options: ModalOptionsType) {
        const toastHtml = `<div class='toast'>${options.content}</div>`;
        const toastCss = `.toast {
            position: fixed;
            visibility: hidden; 
            -webkit-transform: translate(-50%, 50%);
            transform: translate(-50%, -50%);
            left: 50%;
            top: 50%;
            background-color: rgba(0,0,0,.5);
            padding: ${10/16}rem;
            border-radius: ${5/16}rem;
            color: #fff;
            font-size: 1rem; 
            opacity: 0;
            transition: all .3s;
        }
        .toast.show {
            visibility: visible;
            opacity: 1;
        }`;
        
        this.el = document.body;
        if(options.el !== null) {
            this.el = document.querySelector(options.el);
        }

        const style = document.createElement('style');
        const html = document.createElement('div');
        
        style.innerHTML = toastCss;
        html.innerHTML = toastHtml;
        this.toast = html.childNodes[0];

        document.head.appendChild(style);
        this.el.appendChild(this.toast);
    };

    show(text: string = this.o.content) {
        this.timer && clearTimeout(this.timer);
        (!this.toast.classList.contains('show')) && this.toast.classList.add('show');
        (this.toast.innerText !== text) && (this.toast.innerText = 'asd');

        this.timer = setTimeout(()=> {
            this.toast.classList.remove('show');
        }, 1000);
    }
}