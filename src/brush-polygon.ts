import { Brush } from "./index";

interface PointOptions {
    x: number;
    y: number;
}

interface LineSegmentOptions {
    a: Point;
    b: Point;
}

interface BrushPolygonOptions {
    brush: Brush;
}

export class Point {
    public x: number;
    public y: number;

    constructor(options: PointOptions) {
        this.x = options.x;
        this.y = options.y;
    }
}

export default class BrushPolygon {
    private points: Point[] = [];
    private brush: Brush;
    private minY: number = Infinity;
    private minX: number = Infinity;
    private maxX: number = 0;
    private maxY: number = 0;

    constructor(options: BrushPolygonOptions) {
        this.brush = options.brush;
    }

    /**
     * Adds a point to the polygon
     * 
     * @param x the x coordinate of the new point
     * @param y the y coordinate of the new point
     */
    addPoint(x: number, y: number) {
        this.points.push(new Point({ x, y }));
        this.minX = Math.min(this.minX, x);
        this.minY = Math.min(this.minY, y);
        this.maxX = Math.max(this.maxX, x);
        this.maxY = Math.max(this.maxY, y);
    }

    /**
     * Point-in-polygon test using the non-zero winding rule
     * 
     * @param point the point to test
     */
    contains(point: Point) {
        let length = this.points.length;
        if(length < 3) return false;

        let windingNo = 0;

        for(let i = 0; i < length; i++) {
            let current = this.points[i];
            let next = this.points[(i + 1) % length];

            if(current.y <= point.y) {
                if(next.y > point.y) {
                    if(BrushPolygon.orientation(current, next, point) > 0) {
                        windingNo++;
                    }
                }
            } else {
                if(next.y <= point.y) {
                    if(BrushPolygon.orientation(current, next, point) < 0) {
                        windingNo--;
                    }
                }
            }
        }

        return windingNo != 0;
    }

    fill() {
        for(let x = this.minX; x < this.maxX; x++) {
            for(let y = this.minY; y < this.maxY; y++) {
                if(this.contains(new Point({ x, y }))) {
                    this.brush.draw(x, y);
                }
            }
        }
    }

    /**
     * Find orientation of an ordered triplet (a,b,c)
     * 
     *  0  = a b and c are colinear
     *  1  = clockwise
     * -1  = counterclockwise
     * 
     * @param a point a
     * @param b point b 
     * @param c point c
     */
    static orientation(a: Point, b: Point, c: Point) {
        let value = (b.y - a.y) * (c.x - b.x) -
                    (b.x - a.x) * (c.y - b.y);
        
        return Math.sign(value);
    }
}

