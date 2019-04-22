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
c.drawRect({ x: 800, y: 800, width: 6, height: 6, color: "#ffffff" });
brush.fillPolygons = true;