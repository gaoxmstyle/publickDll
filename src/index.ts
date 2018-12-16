/// <reference path='./toast/index.ts' />;

namespace GXM {
    import Toast = GXM.Toast;

    export class Main {
        private _toast: Toast;

        constructor(){
            console.log('main');

            this._toast = new Toast();
            this._toast.show('hello');
        }
    }
}