import {TModal} from '../types/index';

export interface IModal {
    render(options: TModal): void;
    show(options: TModal): void;
}