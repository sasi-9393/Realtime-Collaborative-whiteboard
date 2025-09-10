import getStroke from "perfect-freehand";
import { useContext, useEffect, useLayoutEffect, useRef } from "react";
import rough from "roughjs";
import { updateCanvas } from "../../api";
import { TOOL_ACTION_TYPE, TOOL_ITEMS } from "../../constants";
import BoardContext from "../../store/BoardContext";
import ToolbarContext from "../../store/toolboxContext";
function getSvgPathFromStroke(points) {
    if (points.length === 0) return "";
    const stroke = getStroke(points, { size: 8 });
    if (!stroke.length) return "";

    return `M${stroke.map(p => p.join(",")).join("L")}Z`;
}

const Board = (props) => {
    const id = props.id;
    const { activeToolItem, elements, boardMouseDownHandler, boardMouseMoveHandler, toolActionType, boardMouseUpHandler, handleInputChange, handleBlur } = useContext(BoardContext);
    const { toolboxState } = useContext(ToolbarContext);
    const inputFocus = useRef();
    const canvasRef = useRef();

    // removed the previous useEffect that set canvas size here
    // and instead set canvas size inside useLayoutEffect (before drawing)

    useLayoutEffect(() => {
        const canvas = canvasRef.current;

        // set size BEFORE drawing — setting width/height clears the canvas
        // here we set to window size; you can adapt if you use a wrapper element
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const context = canvas.getContext("2d");
        context.save();
        const roughCanvas = rough.canvas(canvas);

        elements.forEach((ele, index) => {
            if (ele.tool === TOOL_ITEMS.BRUSH) {
                const pathData = getSvgPathFromStroke(ele.points, {
                    size: 10,
                });

                if (pathData) {
                    const path2D = new Path2D(pathData);
                    context.fillStyle = ele.stroke || "black";
                    context.fill(path2D);
                }
            }
            else if (ele.tool === TOOL_ITEMS.TEXT) {
                // text tool is selected 
                if (index != elements.length - 1) {
                    const size = ele.size || 18;
                    context.font = `italic ${size}px Georgia`;
                    context.fillStyle = ele.stroke || "black";
                    context.fillText(ele.value, ele.clientX, ele.clientY);
                }
            }
            else {
                roughCanvas.draw(ele.roughEle);
            }
        });

        // so when elements changes then first clean up the board and draw the new state
        return () => {
            context.clearRect(0, 0, canvas.width, canvas.height)
        }
    }, [elements]); // draws whenever elements changes

    //
    useEffect(() => {
        if (toolActionType === TOOL_ACTION_TYPE.TYPING) {
            setTimeout(() => {
                inputFocus.current?.focus();
            }, 0);
        }
    }, [toolActionType])


    // handle window resize so we update canvas size and force a redraw


    function handleMouseDown(event) {
        // when action type is drawing then only handle move else dont draw so basically to draw we have to hold then only drawing happens
        // this drawing is setted when we click meand onMouseDown
        // and we reset it to "NONE" onMouseUp
        boardMouseDownHandler(event, toolboxState);
    }
    function handleMouseMove(event) {
        if (toolActionType === "DRAWING" || toolActionType === "ERASING") boardMouseMoveHandler(event, toolboxState);
    }
    async function handleMouseUp() {
        boardMouseUpHandler();
        try {
            await updateCanvas(id, elements);
            console.log("Canvas updated on backend");
        } catch (err) {
            console.error("Failed to sync canvas:", err);
        }
    }
    return (
        <>
            {toolActionType === TOOL_ACTION_TYPE.TYPING && (
                <textarea
                    ref={inputFocus}
                    value={elements[elements.length - 1].value}
                    rows={1}
                    style={{
                        position: "absolute",
                        top: elements[elements.length - 1].clientY,
                        left: elements[elements.length - 1].clientX,
                        color: elements[elements.length - 1].stroke,
                        fontStyle: "italic",
                        fontSize: `${elements[elements.length - 1].size + 5}px`,
                        fontFamily: "Georgia, serif",
                        lineHeight: 1.1,
                        border: "none",
                        outline: "none",
                        background: "transparent",
                        resize: "none",
                        minWidth: "4ch",
                        padding: 0,
                        caretColor: "black",
                        zIndex: 1000,
                    }}
                    placeholder=""
                    onChange={(event) => handleInputChange(event.target.value)}
                    onBlur={() => handleBlur()}
                />
            )}

            <canvas id="canvas" ref={canvasRef}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}>
            </canvas>
        </>
    );
}

export default Board
