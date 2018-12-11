import Canvas from "./canvas.js";

export interface BrushParameter {
    canvas: Canvas,
    color?: string,
    size?: number,
    nolisteners: boolean,
    capStyle?: string
}

export default class Brush {
    private canvas: Canvas;
    private context: CanvasRenderingContext2D;
    private active: boolean = false;
    public color: string = "red";
    public size: number = 5;
    public capStyle: string = "round";

    constructor(options: BrushParameter) {
        this.canvas = options.canvas;
        this.context = options.canvas.context;

        if(options.color) this.color = options.color;
        if(options.size) this.size = options.size;
        if(options.capStyle) this.capStyle = options.capStyle; 
        if(!options.nolisteners) this.setupListeners();
    }

    private setupListeners() {
        let el = this.canvas.el;
        el.addEventListener("mousedown", e => this.begin.apply(this, [ e.clientX, e.clientY ]));
        el.addEventListener("mousemove", e => this.move.apply(this, [ e.clientX, e.clientY ]));
        el.addEventListener("mouseup", e => this.end.apply(this, [ e.clientX, e.clientY ]));
    }

    begin(x: number, y: number) {
        if(this.active) return;
        this.active = true;

        let context = this.context;
        context.lineWidth = this.size;
        context.strokeStyle = this.color;

        //@ts-ignore
        context.lineCap = this.capStyle;

        context.beginPath();
        context.moveTo(x, y);
        context.lineTo(x, y);
        context.stroke();
    }

    move(x: number, y: number) {
        if(!this.active) return;
        
        let context = this.context;
        context.lineTo(x, y);
        context.stroke();
    }

    end(x: number, y: number) {
        if(!this.active) return;

        let context = this.context;
        context.lineTo(x, y);
        context.stroke();

        this.active = false;
        this.canvas.save();
    }
}