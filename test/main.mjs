import { Canvas, Brush } from "../../dist/index.js";

window.c = new Canvas({
    height: window.innerHeight,
    width: window.innerWidth
});

c.clear("black");

document.body.appendChild(c.el);

let brush = new Brush({
    canvas: c,
    color: "white",
    fillPolygons: true,
});