import { IModal } from '../../interface/index';
import {TModal} from '../../types/TModal';
import './index.scss';

export default class Modal implements IModal {

    o: any;
    defaultOptions: TModal;

    constructor(options: TModal) {
        // 默认参数
        this.defaultOptions = {
            content: options.content || '',
            el: options.el || null,
            title: options.title || '',
            during: options.during || 1000
        };

        this.render(this.defaultOptions);
    }

    render(options: TModal) {
        const modalHtml = `<div class='modal'><div class='mask'></div><div class='container'><div class='title'>${options.title}</div><div class='content'>${options.content}</div></div></div>`;
    }

    show(options: TModal) {

    }
}