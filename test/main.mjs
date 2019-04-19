import { Canvas, Brush } from "../../dist/index.js";

window.c = new Canvas({
    height: window.innerHeight,
    width: window.innerWidth
});

c.clear("#000000");

document.body.appendChild(c.el);

window.brush = new Brush({
    canvas: c,
    color: "#ffffff",
});


let ctx = c.context;

brush.fillPolygons = false;
brush.begin(0,10);
brush.end(800, 800);