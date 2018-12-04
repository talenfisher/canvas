export default class Brush {
    constructor({ canvas, color, size, nolisteners, ...options }) {
        this._canvas = canvas;
        this._ctx = canvas.context;
        this.active = false;

        this.color = color || "red";
        this.size = size || 5;
        this.capStyle = options.capStyle || "round";

        if(!nolisteners) {
            this._canvas.el.addEventListener("mousedown", this.begin.bind(this));
            this._canvas.el.addEventListener("mousemove", this.move.bind(this));
            this._canvas.el.addEventListener("mouseup", this.end.bind(this));
        }
    }

    begin(e) {
        if(this.active) return;
        this.active = true;

        let context = this._ctx;
        context.lineWidth = this.size;
        context.strokeStyle = this.color;
        context.lineCap = this.capStyle;

        context.beginPath();
        context.moveTo(e.clientX, e.clientY);
        context.lineTo(e.clientX, e.clientY);
        context.stroke();

    }

    move(e) {
        if(!this.active) return;
        
        let context = this._ctx;
        context.lineTo(e.clientX, e.clientY);
        context.stroke();
    }

    end(e) {
        if(!this.active) return;

        let context = this._ctx;
        context.lineTo(e.clientX, e.clientY);
        context.stroke();

        this.active = false;
    }
}