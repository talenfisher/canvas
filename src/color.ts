export interface RGB {
    r: number;
    g: number;
    b: number;
}

export function hex2rgb(hex: string) {
    let i = hex.indexOf("#");
    let start = i === -1 ? 0 : 1;
    hex = hex.substring(start);

    let r = parseInt(hex.substring(0, 2), 16);
    let g = parseInt(hex.substring(2, 4), 16);
    let b = parseInt(hex.substring(4, 6), 16);
    return { r, g, b } as RGB;
}