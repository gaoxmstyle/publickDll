import {ModalOptionsType} from '../types/index';

export interface Modal {
    render(options: ModalOptionsType): void;
    show(text: string): void;
}