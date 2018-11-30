export default class Canvas {
    constructor(options) {
        this.el = document.createElement("canvas");
        this.el.height = options.height;
        this.el.width = options.width;
        this.context = this.el.getContext("2d");
    }

    clear(color = "white") {
        this.context.beginPath();
        this.context.fillStyle = color;
        this.context.fillRect(0, 0, this.el.width, this.el.height);
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