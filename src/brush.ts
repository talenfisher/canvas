import Canvas from "./canvas.js";
import BrushQueue from "./brush-queue.js";
import BrushPolygon from "./brush-polygon.js";
export interface BrushParameter {
    canvas: Canvas,
    color?: string,
    size?: number,
    nolisteners: boolean,
    capStyle?: string,
    fillPolygons?: boolean;
}
declare var window: any;

export default class Brush {
    private canvas: Canvas;
    private context: CanvasRenderingContext2D;
    private queue: BrushQueue = new BrushQueue({ brush: this });
    private polygon?: BrushPolygon;
    private active: boolean = false;

    public color: string;
    public size: number;
    public capStyle: string;
    public fillPolygons: boolean;

    constructor(options: BrushParameter) {
        this.canvas = options.canvas;
        this.context = options.canvas.context;
        
        this.color = options.color || "#ffffff";
        this.size = options.size || 6;
        this.capStyle = options.capStyle || "square";
        this.fillPolygons = options.fillPolygons || true;
        if(!options.nolisteners) this.setupListeners();
    }

    private setupListeners() {
        let el = this.canvas.el;
        el.addEventListener("mousedown", e => this.begin.apply(this, [ e.clientX, e.clientY ]));
        el.addEventListener("mousemove", e => this.move.apply(this, [ e.clientX, e.clientY ]));
        el.addEventListener("mouseup", e => this.end.apply(this, [ e.clientX, e.clientY ]));
    }

    draw(x: number, y: number) {
        let context = this.context;
        context.fillStyle = this.color;
        context.fillRect(x, y, this.size, this.size);
    }

    // draw a bresenham line
    lineTo(x0: number, y0: number, x1: number, y1: number) {
        let x, y, xUpperBound, yUpperBound;
        let dx = x1 - x0;
        let dy = y1 - y0;
        let dxp = Math.abs(dx);
        let dyp = Math.abs(dy);
        let xError = 2 * dyp - dxp;
        let yError = 2 * dxp - dyp;
        let increment = Math.sign(dx) === Math.sign(dy);

        // x dominant
        if(dyp < dxp) {
            let movingForward = dx >= 0;
            x = movingForward ? x0 : x1;
            y = movingForward ? y0 : y1;
            xUpperBound = movingForward ? x1 : x0;

            this.draw(x, y);
            for(x; x < xUpperBound; x++) {                
                if(xError < 0) {
                    xError += 2 * dyp;
                } else {
                    y += increment ? 1 : -1;
                    xError += 2 * (dyp - dxp);
                }

                this.draw(x, y);
            }
        } else {
            let movingForward = dy > 0;
            x = movingForward ? x0 : x1;
            y = movingForward ? y0 : y1;
            yUpperBound = movingForward ? y1 : y0;
            
            this.draw(x, y);
            for(y; y < yUpperBound; y++) {
                if(yError <= 0) {
                    yError += 2 * dxp;
                } else {
                    x += increment ? 1 : -1;
                    yError += 2 * (dxp - dyp);
                }

                this.draw(x, y);
            }
        }
        
    }

    begin(x: number, y: number) {
        if(this.active) return;
        
        this.queue.push(x, y);
        
        if(this.fillPolygons) {
            this.polygon = new BrushPolygon({ brush: this });
            this.polygon.addPoint(x, y);
        }

        this.active = true;
    }

    move(x: number, y: number) {
        if(!this.active) return;
        this.queue.push(x, y);

        if(this.fillPolygons && this.polygon) {
            this.polygon.addPoint(x, y);
        }
    }

    end(x: number, y: number) {
        if(!this.active) return;
        this.move(x, y);
        this.queue.reset();
        window.p = this.polygon;
        
        if(this.fillPolygons && this.polygon) {
            let poly = this.polygon;
            requestAnimationFrame(() => poly.fill());
        }

        this.active = false;
        this.canvas.save();
    }


}