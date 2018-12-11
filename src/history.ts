import Canvas from "./canvas.js";
import Region from "./region.js";

export interface HistoryParameter {
    canvas: Canvas,
    size: number,
    enabled?: boolean
}

/**
 * Data structure for managing canvas history
 */
export default class History {

    /**
     * The canvas to track
     */
    public readonly canvas: Canvas;

    /**
     * Whether or not to enable history
     */
    public enabled: boolean = true;

    /**
     * The maximum size the history can be
     */
    public maxSize: number = 8;

    /**
     * Points to the current index in the history stack
     */
    private pointer: number = -1;

    /**
     * The history stack
     */
    private stack: Array<ImageData> = [];

    /**
     * Constructs a new history object
     * 
     * @param options an object of options to use for the history
     */
    constructor(options: HistoryParameter) {
        this.canvas = options.canvas;
        if(options.size) this.maxSize = options.size;
        if(options.enabled) this.enabled = options.enabled;

        this.reset();
    }

    /**
     * Captures the current state of the canvas, saving it to the history
     * stack.  If history elements exist past the current state index, they are deleted.
     */
    async capture() {        
        if(!this.enabled) return;

        let img = this.canvas.getImageData();
        this.stack[++this.pointer] = img;

        for(let i = this.pointer + 1; i < this.stack.length; i++) {
            delete this.stack[i];
        }

        while(this.stack.length > this.maxSize) {
            this.stack.shift();
        }
    }

    /**
     * Restores the canvas to a specific place in the history
     * 
     * @param index the history index to restore the canvas to
     */
    restore(index: number) {
        if(!this.enabled) return;

        if(index < 0 || this.stack.length < index) {
            throw `History at index ${index} does not exist`;
        }

        let data = this.stack[index];
        this.canvas.putImageData(data);
    }

    /**
     * Undos the last history event captured
     */
    undo() {
        if(!this.enabled || this.pointer <= 0) return;
        this.restore(--this.pointer);
    }

    /**
     * Redoes the last hsitory event that was undone.
     */
    redo() {
        if(!this.enabled || this.pointer >= this.stack.length) return;
        this.restore(++this.pointer);
    }

    /**
     * Resets the history to its default state
     */
    reset() {
        this.stack = [];
        this.pointer = -1;
    }
}