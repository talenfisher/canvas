import { Brush } from "./index";

interface BrushQueueOptions {
    brush: Brush;
}

export default class BrushQueue {
    private queue: number[][] = [];
    private previous?: number[];
    private brush: Brush;
    private dequeuing: boolean = false;

    constructor(options: BrushQueueOptions) {
        this.brush = options.brush;
    }

    push(x: number, y: number) {
        this.queue.push([ x, y ]);
        
        if(!this.dequeuing) {
            this.dequeue();
        }
    }

    dequeue() {
        if(this.queue.length === 0) {
            this.dequeuing = false;
            return;
        }

        this.dequeuing = true;
        let previous = this.previous;
        let current = this.queue.shift() as number[];
        
        if(!previous) {
            this.brush.draw(current[0], current[1]);
        } else {
            this.brush.lineTo(previous[0], previous[1], current[0], current[1]);
        }

        this.previous = current;
        this.dequeue();
    }

    reset() {
        this.previous = undefined;
    }
}