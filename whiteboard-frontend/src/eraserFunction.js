import { ERASER_THRESHOULDS, TOOL_ITEMS } from "./constants";
function distanceBetweenPoints(x1, y1, x2, y2) {
    const dx = x2 - x1;
    const dy = y2 - y1;
    return Math.sqrt(dx * dx + dy * dy);
}
function isPointNearBrush(element, x, y, tolerance = 10) {
    // jsut checking the distance for every two points and checking if brush point is on the line of two points
    const pts = element.points;
    if (pts.length === 1) {
        if (Math.abs(x - pts[0].x) <= tolerance && Math.abs(y - pts[0].y) <= tolerance) return true;
    }
    for (let i = 0; i < pts.length - 1; i++) {
        const p1 = pts[i];
        const p2 = pts[i + 1];

        const d1 = distanceBetweenPoints(x, y, p1.x, p1.y);
        const d2 = distanceBetweenPoints(x, y, p2.x, p2.y);
        const lineLen = distanceBetweenPoints(p1.x, p1.y, p2.x, p2.y);

        if (Math.abs(d1 + d2 - lineLen) < tolerance) {
            return true;
        }
    }
    return false;

}

function isPointCloseToLine(x, y, x1, y1, x2, y2) {
    const disFromStart = distanceBetweenPoints(x, y, x1, y1);
    const disFromEnd = distanceBetweenPoints(x, y, x2, y2);
    const lineDist = distanceBetweenPoints(x1, y1, x2, y2);
    if (Math.abs(disFromEnd + disFromStart - lineDist) < ERASER_THRESHOULDS.LINE) {
        return true;

    }
    else return false;
}




function isPointNearElement(element, x, y) {
    const { x1, y1, x2, y2 } = element;
    if (element.tool === TOOL_ITEMS.LINE || element.tool === TOOL_ITEMS.ARROW) {
        return isPointCloseToLine(x, y, x1, y1, x2, y2);
    }
    else if (element.tool === TOOL_ITEMS.RECTANGLE || element.tool === TOOL_ITEMS.CIRCLE) {
        // for freactange if the point touches or on the any line of 4 sides then it is deleted so
        return (
            isPointCloseToLine(x, y, x1, y1, x2, y1) || isPointCloseToLine(x, y, x1, y1, x1, y2) || isPointCloseToLine(x, y, x1, y2, x2, y2) || isPointCloseToLine(x, y, x2, y2, x2, y1)
        );
    }
    else if (element.tool === TOOL_ITEMS.BRUSH) {
        return isPointNearBrush(element, x, y, 10);
    }
    else if (element.tool === TOOL_ITEMS.TEXT) {
        const canvas = document.getElementById("canvas");
        const context = canvas.getContext("2d");
        context.font = `${element.fontSize || 20}px ${element.fontFamily || "Arial"}`;
        const metrics = context.measureText(element.value);
        const textWidth = metrics.width;
        return isPointCloseToLine(
            x, y,
            element.clientX, element.clientY,
            element.clientX + textWidth, element.clientY
        );
    }

}
export default isPointNearElement;