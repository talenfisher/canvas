export default class Canvas {
    constructor(options) {
        this.el = document.createElement("canvas");
        this.el.height = options.height;
        this.el.width = options.width;

        this.context = this.el.getContext("2d");
    }

    clear(color = "white") {
        this.drawRect({
            x:      0,
            y:      0,
            width:  this.el.width,
            height: this.el.height,
            color:  color
        });
    }

    drawRect({ x, y, width, height, color }) {
        let context = this.context;
        context.fillStyle = color;
        context.fillRect(x, y, width, height);
    }

    drawImage(image, offset = [ 0, 0 ]) {
        this.context.drawImage(image, offset[0], offset[1]);
    }

    static fromImage(image) {
        let canvas = new Canvas({
            height: image.naturalWidth,
            width: image.naturalHeight
        });

        canvas.drawImage(image);
        return canvas;
    }
}