import GlobalClass from '../../utils/class';

export default class Modal extends GlobalClass{
    constructor(...args) {
        let el;
        let params;
        if(args.length === 1 && args[0].constructor && args[0].constructor === Object) {
            params = args[0];
        } else {
            [el, params] = args
        }

        super(params);


    }
}