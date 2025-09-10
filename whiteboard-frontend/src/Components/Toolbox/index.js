import cx from "classnames";
import { useContext } from "react";
import { COLORS, nonFillTools, nonSizeTools, nonToolBoxItems } from "../../constants";
import BoardContext from "../../store/BoardContext";
import ToolbarContext from "../../store/toolboxContext";
import classes from "./index.module.css";
const Toolbox = () => {
    const { activeToolItem } = useContext(BoardContext)
    const { toolboxState, toolboxStrokeHandler, toolboxFillHandler, toolboxSizeHandler } = useContext(ToolbarContext)
    const strokeColor = toolboxState[activeToolItem]?.stroke;
    const fillColor = toolboxState[activeToolItem]?.fill;
    function handleStroke(color, activeToolItem) {
        toolboxStrokeHandler(color, activeToolItem);
    }
    function handleFill(color, activeToolItem) {
        toolboxFillHandler(color, activeToolItem);
    }


    return (
        <>
            {!nonToolBoxItems.includes(activeToolItem) && <div className={classes.container}>
                <div className={classes.selectOptionContainer}>
                    <div className={classes.toolBoxLabel}>
                        Stroke Color
                    </div>
                    { /*basically we did Object.keys bcoz we want to create a color box container for each color so iterate and map but COLORS is an object*/}
                    <div className={classes.colorsContainer}>
                        {Object.keys(COLORS).map((k) => {
                            return <div key={COLORS[k]} className={
                                cx(classes.colorBox,
                                    { [classes.activeColorBox]: strokeColor === COLORS[k] })} style={{ backgroundColor: COLORS[k] }} onClick={() => {
                                        handleStroke(COLORS[k], activeToolItem)
                                    }}  >

                            </div>
                        })}
                    </div>
                </div>
                { /**/}
                {!(nonFillTools.includes(activeToolItem)) && <div className={classes.selectOptionContainer}>
                    <div className={classes.toolBoxLabel}>
                        Fill Color
                    </div>

                    <div className={classes.colorsContainer}>
                        {Object.keys(COLORS).map((k) => {
                            return <div key={k} className={cx(classes.colorBox, { [classes.activeColorBox]: fillColor === COLORS[k] }, { [classes.noFillColorBox]: k === "WHITE" })} style={{ backgroundColor: COLORS[k] }} onClick={() => {
                                handleFill(COLORS[k], activeToolItem)
                            }}  >

                            </div>
                        })}
                    </div>
                </div>
                }
                { /* Conditional rendering for size */}
                {!nonSizeTools.includes(activeToolItem) && <div className={classes.selectOptionContainer}>
                    <div className={classes.toolBoxLabel}>
                        Size
                    </div>
                    <input type="range"
                        min="1"
                        max="25"
                        step="2"
                        value={toolboxState[activeToolItem]?.size || 10}
                        onChange={(event) => toolboxSizeHandler(Number(event.target.value), activeToolItem)} />
                </div>}
            </div >}
        </>
    )
}

export default Toolbox