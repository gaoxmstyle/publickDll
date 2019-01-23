import GlobalClass from '../../utils/class';
import Utils from '../../utils/utils';

export default class Progress extends GlobalClass {
    constructor(options) {
        super();
        this.timer = null;
        this.angleStart = -90;
        this.angleEnd = 270;
        this.ratio = document.defaultView.innerWidth / 375;
        this.scale = document.defaultView.devicePixelRatio || 1;
        this.lastPriceRatio = 0;

        const radius = Math.floor(((options && options.radius) || 110) * this.ratio);
        const lineWidth = (options && options.lineWidth) || 14;
        this.width = radius * 2 + lineWidth;

        const centerX = Math.floor(this.width * this.ratio * this.scale / this.scale / 2);
        const centerY = Math.floor(this.width * this.ratio * this.scale / this.scale / 2);
        const priceRatio = (options && Utils.retainDecimal(options.priceRatio)) || .50;

        this.o = {
            centerX: centerX,
            centerY: centerY,
            radius: radius,
            lineWidth: lineWidth,
            priceRatio: priceRatio,
            animate: null
        };
    }

    _renderCircleBg(ctx) {
        ctx.save();
        ctx.beginPath();
        ctx.arc(this.o.centerX, this.o.centerY, this.o.radius, 0, 2 * Math.PI, false);
        ctx.lineWidth = this.o.lineWidth * this.ratio;
        ctx.strokeStyle = '#dfeeff';
        ctx.shadowColor = "rgba(0, 0, 0, 0.06)";
        ctx.shadowBlur = 10 * this.ratio;
        ctx.stroke();
        ctx.closePath();
    }

    _clear(ctx) {
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    }


    _renderCircle(ctx) {
        const gradient = ctx.createLinearGradient(0, 120 * this.ratio, 0, 0);
        gradient.addColorStop(1, '#31CBF5');
        gradient.addColorStop(0, '#169BE8');

        ctx.restore();
        ctx.beginPath();
        if(this.lastPriceRatio > 0) {
            this.angleStart = this.angleStart - 3;
        } else {
            this.angleStart = this.angleStart + 3;
        }
        ctx.arc(this.o.centerX, this.o.centerY, this.o.radius, Utils.dToR(this.angleStart), Utils.dToR(this.angleEnd));
        ctx.strokeStyle = gradient;
        ctx.lineWidth = this.o.lineWidth * this.ratio;
        ctx.lineCap = 'round';
        ctx.stroke();
        ctx.closePath();
    }

    _renderCirWhite(ctx) {
        ctx.beginPath();
        ctx.arc(this.o.centerX, this.o.centerX - this.o.radius, 4.5 * this.ratio, 0, 2 * Math.PI, false);
        ctx.fillStyle = "white";
        ctx.fill();
        ctx.closePath();
    }

    _loop(canvas, ctx) {
        this._clear(ctx);
        this._renderCircleBg(ctx);
        this._renderCircle(ctx);
        this._renderCirWhite(ctx);
        this.o.animate && this.o.animate(1 - (this.angleStart + 90) / 360);
        const aimsAngle = Math.floor(-(this.o.priceRatio * 100) * 3.6 + 270);
        if(this._checkStopLoop(aimsAngle)){
            this.o.animate && this.o.animate(this.o.priceRatio);
            return window.cancelAnimationFrame(this.timer);
        }
        this.timer = window.requestAnimationFrame(() => this._loop(canvas, ctx));
    }

    _checkStopLoop(aimsAngle) {
        return ((this.lastPriceRatio > 0) && (this.angleStart <= aimsAngle)) || ((this.lastPriceRatio <= 0) && (this.angleStart >= aimsAngle));
    }

    setRatio(params) {
        const lastPriceRatio = Utils.retainDecimal(params.priceRatio) - this.o.priceRatio;
        if(lastPriceRatio === 0) return false;
        this.lastPriceRatio = lastPriceRatio;
        Utils.extend(this.o, params);
        this.timer = window.requestAnimationFrame(() => this._loop(this.canvas, this.ctx));
    }

    render(canvas, ctx) {
        this.canvas = canvas;
        this.ctx = ctx;
        canvas.width = Math.floor(this.width * this.ratio * this.scale);
        canvas.height = Math.floor(this.width * this.ratio * this.scale);
        canvas.style.width = canvas.width / this.scale + 'px';
        canvas.style.height = canvas.width / this.scale + 'px';
        if(!ctx) {
            ctx = canvas.getContext('2d');
            this.ctx = ctx;
        }
        ctx.scale(this.scale, this.scale);
        ctx.translate(-0, -0);

        this.timer = window.requestAnimationFrame(() => this._loop(canvas, ctx));
    }
}