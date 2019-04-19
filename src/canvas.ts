import History from "./history.js";
import Region from "./region.js";

const HISTORY_DEFAULTS = {
    size: 8,
    enabled: true
};

export default class Canvas {

    /**
     * The canvas element to track
     */
    public el: HTMLCanvasElement;

    /**
     * The rendering context to use
     */
    public context: CanvasRenderingContext2D;

    /**
     * History object to track canvas state, provide undo, redo functions
     */
    private history: History;

    /**
     * Constructs a new canvas
     * 
     * @param options options to use for the canvas object
     */
    constructor(options: CanvasParameter) {
        this.el = document.createElement("canvas");
        this.el.height = options.height;
        this.el.width = options.width;
        
        let context = this.el.getContext("2d", { alpha: false });
        if(context === null) throw `Failed to get the CanvasRenderingContext2D`;

        this.context = context;
        this.context.imageSmoothingEnabled = false;

        let historyOptions = Object.assign(HISTORY_DEFAULTS, options.history);
        this.history = new History({ 
            canvas: this, 
            size: historyOptions.size,
            enabled: historyOptions.enabled
        });
    }

    /**
     * Clears the canvas to one color
     * 
     * @param color color to clear the canvas with
     */
    clear(color: string = "white") {
        this.drawRect({
            x:      0,
            y:      0,
            width:  this.el.width,
            height: this.el.height,
            color:  color
        });

        this.history.capture();
    }

    /**
     * Draws a rectangle on the canvas
     * 
     * @param param0 options for drawing a rectangle to the canvas
     */
    drawRect({ x, y, width, height, color }: DrawRectangleParameter) {
        let context = this.context;
        context.fillStyle = color;
        context.fillRect(x, y, width, height);
        this.save();
    }

    /**
     * Draws an image to the canvas
     * 
     * @param image the image to draw
     * @param offset the offset to draw the image at
     */
    drawImage(image: HTMLImageElement, offset = [ 0, 0 ]) {
        this.context.drawImage(image, offset[0], offset[1]);
        this.save();
    }

    /**
     * Gets image data from a region of the canvas
     * 
     * @param region the region to get image data from
     */
    getImageData(region: Region = { x: 0, y: 0, width: this.el.width, height: this.el.height}) {
        return this.context.getImageData(region.x, region.y, region.width, region.height);
    }

    /**
     * Puts image data onto a region of the canvas
     * 
     * @param data the image data to put onto the canvas
     * @param x x offset to start at, defaults to 0
     * @param y y offset to start at, defaults to 0
     */
    putImageData(data: ImageData, x: number = 0, y: number = 0) {
        this.context.putImageData(data, x, y);
    }

    /**
     * Converts the canvas to a blob
     * 
     * @param type image type to convert to
     * @param quality image quality to use
     */
    toBlob(type: string = "image/png", quality: number = 1): Promise<Blob> {
        return new Promise((resolve, reject) => {
            //@ts-ignore
            this.el.toBlob(blob => resolve(blob), type, quality);
        });
    }

    /**
     * Getter for historyEnabled: whether or not to use history to track
     * changes
     * 
     * @return true if history is enabled, false if not
     */
    get historyEnabled(): boolean {
        return this.history.enabled;
    }

    /**
     * Setter for historyEnabled: enables or disables history depending on the value
     * parameter
     * 
     * @param value true if history should be enabled, false if not
     */
    set historyEnabled(value: boolean) {
        this.history.enabled = value;
        this.save();
    }

    /**
     * Getter for historySize
     * 
     * @return {integer} the max size the history stack can be
     */
    get historySize() {
        return this.history.maxSize;
    }

    /**
     * Setter for historySize
     * 
     * @param {integer} value the new max size for the history stack
     */
    set historySize(value: number) {
        this.history.maxSize = value;
    }

    /**
     * Utility for extracting colors
     */
    getColors() {
        let unique: Array<string> = [];
        let image = this.getImageData();
        let size = ((image.height * image.width) * 4) - 4;
        let data = image.data;
        
        for(let i = 0; i < size; i += 4)
         {
            let r = data[i];
            let g = data[i + 1];
            let b = data[i + 2];
            let a = data[i + 3];

            let hex = "#" + ("000000" + ((r << 16) | (g << 8) | b).toString(16)).slice(-6);
            hex += a.toString(16);
        
            if(!unique.includes(hex)) unique.push(hex);
        }

        return unique;
    }

    private padHex(hex: string) {
        return hex.length === 1 ? "0" + hex : hex;
    }

    /**
     * Undo the last action
     */
    undo() {
        this.history.undo();
    }

    /**
     * Redo the last action
     */
    redo() {
        this.history.redo();
    }

    /**
     * Saves the current state into history
     */
    save() {
        this.history.capture();
    }

    /**
     * Clamp an x coordinate to the canvas' dimensions
     */
    clampX(x: number): number {
        x = Math.max(0, x);
        x = Math.min(x, this.el.width);
        return x;
    }

    /**
     * Clamp a y coordinate to the canvas' dimensions
     */
    clampY(y: number): number {
        y = Math.max(0, y);
        y = Math.min(y, this.el.height);
        return y;
    }

    /**
     * Create a new canvas from an image, using the image's natural width and height 
     * as the canvas' width and height.
     * 
     * @param {Blob} image image data
     */
    static fromImage(image: HTMLImageElement): Canvas {
        let canvas = new Canvas({
            height: image.naturalWidth,
            width: image.naturalHeight
        });

        canvas.drawImage(image);
        return canvas;
    }
}

export interface CanvasParameter {
    width: number
    height: number,
    smoothing?: boolean,
    history?: {
        size: number,
        enabled?: boolean
    }
}

export interface DrawRectangleParameter extends Region {
    color: string
};