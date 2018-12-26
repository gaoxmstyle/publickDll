export type TModal = {
    content: string;
    el: string;
    title: string;
    during: number;
    maskCallBack: any,
    isCancel: boolean,
    confirmCallBack: any,
    cancelCallBack: any
}