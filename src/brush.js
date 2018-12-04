export default class Brush {
    constructor({ canvas, color, size, nolisteners }) {
        this._canvas = canvas;
        this._ctx = canvas.context;
        this._active = false;

        this.color = color || "red";
        this.size = size || 5;

        if(!nolisteners) {
            this._canvas.el.addEventListener("mousedown", this.begin.bind(this));
            this._canvas.el.addEventListener("mousemove", this.move.bind(this));
            this._canvas.el.addEventListener("mouseup", this.end.bind(this));
        }
    }

    begin(e) {
        this._active = true;
        this._ctx.lineWidth = this.size;
        this._ctx.strokeStyle = this.color;
        this._ctx.lineCap = "round";

        this._ctx.beginPath();
        this._ctx.moveTo(e.clientX, e.clientY);
        this._ctx.lineTo(e.clientX, e.clientY);
        this._ctx.stroke();

    }

    move(e) {
        if(!this._active) return;
        this._ctx.lineTo(e.clientX, e.clientY);
        this._ctx.stroke();
    }

    end(e) {
        if(!this._active) return;
        this._active = false;
        this._ctx.lineTo(e.clientX, e.clientY);
        this._ctx.stroke();
    }
}