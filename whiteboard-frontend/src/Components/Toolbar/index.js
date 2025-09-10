import cx from "classnames";
import { useContext } from "react";
import { FaArrowRight, FaDownload, FaEraser, FaFont, FaPaintBrush, FaRedoAlt, FaRegCircle, FaSlash, FaUndoAlt } from "react-icons/fa";
import { LuRectangleHorizontal } from "react-icons/lu";
import { TOOL_ITEMS } from "../../constants";
import BoardContext from "../../store/BoardContext.js";
import classes from "./index.module.css";


const Toolbar = () => {
    const { activeToolItem, handleToolClick, boardRedoHandler, boardUndoHandler } = useContext(BoardContext);
    function handleDownload() {
        const canvas = document.getElementById("canvas");
        const data = canvas.toDataURL("image/png");
        const anchor = document.createElement("a");
        anchor.href = data;
        anchor.download = "board.png";
        anchor.click();
    }

    return (

        <div className={classes.container}>
            {/* brush*/}
            <div className={cx(classes.toolItem, { [classes.active]: activeToolItem === TOOL_ITEMS.BRUSH })} onClick={() => { handleToolClick(TOOL_ITEMS.BRUSH) }}>
                <FaPaintBrush />
            </div>
            {/*line */}
            <div className={cx(classes.toolItem, { [classes.active]: activeToolItem === TOOL_ITEMS.LINE })} onClick={() => { handleToolClick(TOOL_ITEMS.LINE) }}>
                <FaSlash />
            </div>
            {/* rectangel*/}
            <div className={cx(classes.toolItem, { [classes.active]: activeToolItem === TOOL_ITEMS.RECTANGLE })} onClick={() => { handleToolClick(TOOL_ITEMS.RECTANGLE); }}>
                <LuRectangleHorizontal />
            </div>
            {/*circle */}
            <div className={cx(classes.toolItem, { [classes.active]: activeToolItem === TOOL_ITEMS.CIRCLE })} onClick={() => { handleToolClick(TOOL_ITEMS.CIRCLE) }}>
                <FaRegCircle />
            </div>
            {/* arrow*/}
            <div className={cx(classes.toolItem, { [classes.active]: activeToolItem === TOOL_ITEMS.ARROW })} onClick={() => { handleToolClick(TOOL_ITEMS.ARROW) }}>
                <FaArrowRight />
            </div>
            {/* TEXT*/}
            <div className={cx(classes.toolItem, { [classes.active]: activeToolItem === TOOL_ITEMS.TEXT })} onClick={() => { handleToolClick(TOOL_ITEMS.TEXT) }}>
                <FaFont />
            </div>
            <div className={cx(classes.toolItem, { [classes.active]: activeToolItem === TOOL_ITEMS.ERASER })} onClick={() => { handleToolClick(TOOL_ITEMS.ERASER) }}>
                <FaEraser />
            </div>
            {/*undo */}
            <div className={cx(classes.toolItem)} onClick={boardUndoHandler}>
                <FaUndoAlt />
            </div>
            {/* REDO*/}
            <div className={cx(classes.toolItem)} onClick={boardRedoHandler}>
                <FaRedoAlt />
            </div>
            {/* download*/}
            <div
                className={cx(classes.toolItem)} onClick={handleDownload}>
                <FaDownload />
            </div>
        </div>
    )
}

export default Toolbar