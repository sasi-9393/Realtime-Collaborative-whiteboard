import rough from "roughjs/bin/rough";
import { TOOL_ITEMS } from "./constants";
function getArrowCordinates(x1, y1, x2, y2, size) {
    const arrowlength = 20 + size * 2;
    const angle = Math.atan2(y2 - y1, x2 - x1);

    const x3 = x2 - arrowlength * Math.cos(angle - Math.PI / 6);
    const y3 = y2 - arrowlength * Math.sin(angle - Math.PI / 6);

    const x4 = x2 - arrowlength * Math.cos(angle + Math.PI / 6);
    const y4 = y2 - arrowlength * Math.sin(angle + Math.PI / 6);

    return {
        x3,
        y3,
        x4,
        y4,
    }
}
const gen = rough.generator();
function getRoughElement(id, tool, x1, y1, x2, y2, details) {
    const { stroke, fill, size } = details;
    let options = {
        seed: id + 1,// bcoz id cant be 0
        stroke,
        fill,
        strokeWidth: size,
        roughness: 1,
        strokeLineJoin: "round",
        //fillStyle: "solid",
    }

    // seed in options make sure that handwriting of each shape is same like for different objects and drawings the style of handwriting will be same . we pass it as parameter while drawing passed at last argument 

    if (tool === TOOL_ITEMS.LINE) {
        const temp = gen.line(x1, y1, x2, y2, options);
        return temp;
    }
    else if (tool === TOOL_ITEMS.RECTANGLE) {
        const temp = gen.rectangle(x1, y1, x2 - x1, y2 - y1, options);
        return temp;
    }
    else if (tool === TOOL_ITEMS.CIRCLE) {
        // for ellipse we want center x and center y and height and width
        const centerx = (x1 + x2) / 2;
        const centery = (y1 + y2) / 2;
        return gen.ellipse(centerx, centery, x2 - x1, y2 - y1, options);
    }
    else if (tool === TOOL_ITEMS.ARROW) {
        // basically bydefualt we dont have the arrow tool in rough
        const { x3, y3, x4, y4 } = getArrowCordinates(x1, y1, x2, y2, size);
        const points = [
            [x1, y1], [x2, y2], [x3, y3], [x2, y2], [x4, y4]
        ];
        return gen.linearPath(points, options);
    }


}

export function getSvgPathFromStroke(stroke) {
    if (!stroke.length) return "";
    // just takes the stroke and convert it to path and at final it returns a string so display it we use path2D

    const d = stroke.reduce(
        (acc, [x0, y0], i, arr) => {
            const [x1, y1] = arr[(i + 1) % arr.length];
            acc.push(`${i === 0 ? "M" : "L"} ${x0.toFixed(2)} ${y0.toFixed(2)}`);
            acc.push(`Q ${x0.toFixed(2)} ${y0.toFixed(2)} ${(x0 + x1) / 2} ${(y0 + y1) / 2}`);
            return acc;
        },
        []
    );
    return d.join(" ");
}
export default getRoughElement;