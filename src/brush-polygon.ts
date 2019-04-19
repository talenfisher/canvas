interface PointOptions {
    x: number;
    y: number;
}

interface LineSegmentOptions {
    a: Point;
    b: Point;
}

export class Point {
    public x: number;
    public y: number;

    constructor(options: PointOptions) {
        this.x = options.x;
        this.y = options.y;
    }

    /**
     * Checks to see if this point is on line segment (left, this, right)
     * assuming these are colinear points.
     * 
     * @param left the left point
     * @param right the right point
     */
    onSegment(segment: LineSegment) {
        let left = segment.a;
        let right = segment.b;
        
        return (this.x <= Math.max(left.x, right.x) && 
                this.x >= Math.min(left.x, right.x) &&
                this.y <= Math.max(left.y, right.y) &&
                this.y >= Math.min(left.y, right.y));
    }
}

export class LineSegment {
    public a: Point;
    public b: Point;

    constructor(options: LineSegmentOptions) {
        this.a = options.a;
        this.b = options.b;
    }

    /**
     * Checks to see if this line segment intersects another
     * @param other the other line segment.`
     */
    intersects(other: LineSegment) {
        let o1 = Polygon.orientation(this.a, this.b, other.a);
        let o2 = Polygon.orientation(this.a, this.b, other.b);
        let o3 = Polygon.orientation(other.a, other.b, this.a);
        let o4 = Polygon.orientation(other.a, other.b, this.b);

        if(o1 != o2 && o3 != o4) {
            return true;
        }

        if(o1 == 0 && other.a.onSegment(this))    return true;
        if(o2 == 0 && other.b.onSegment(this))    return true;
        if(o3 == 0 && this.a.onSegment(other))   return true;
        if(o4 == 0 && this.b.onSegment(other))   return true;
        return false;
    }
}

export default class Polygon {
    private points: Point[] = [];

    constructor() {

    }

    /**
     * Adds a point to the polygon
     * 
     * @param x the x coordinate of the new point
     * @param y the y coordinate of the new point
     */
    addPoint(x: number, y: number) {
        this.points.push(new Point({ x, y }));
    }

    /**
     * Point-in-polygon test
     * 
     * @param point the point to test
     */
    contains(point: Point) {
        let length = this.points.length;
        if(length < 3) return false;

        let extreme = new Point({ x: Infinity, y: point.y });
        let right = new LineSegment({ a: point, b: extreme });
        let count = 0;
        let i = 0;

        do {
            let j = (i + 1) % length;
            let next = this.points[j];
            let current = this.points[i];
            let left = new LineSegment({ a: current, b: next });
            
            if(left.intersects(right)) {
                if(Polygon.orientation(current, point, next) === 0) {
                    return point.onSegment(left);
                }

                count++;
            }
        } while(i != 0);

        return count % 2 === 1;
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

