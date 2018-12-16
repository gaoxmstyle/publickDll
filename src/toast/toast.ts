namespace GXM {  
    export interface Modal {
        render(options: object): void;
        show(text: string): void;
    }; 

    export class Toast implements Modal {
        render(options: object) {
            console.log('render');
        };

        show(text: string) {
            console.log(text);
        }
    }
}