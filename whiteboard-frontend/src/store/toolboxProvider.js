import { useReducer } from 'react';
import { COLORS, TOOL_ITEMS } from "../constants";
import ToolbarContext from './toolboxContext';

function toolboxReducer(state, action) {
    if (action.type === "CHANGE_STROKE_COLOR") {
        const { tool, color } = action.payload;
        return {
            ...state,
            [tool]: {
                ...state[tool],
                stroke: color,
            }
        }
    }
    else if (action.type === "CHANGE_FILL_COLOR") {
        const { tool, color } = action.payload;
        return {
            ...state,
            [tool]: {
                ...state[tool],
                fill: color,
            }
        }
    }
    else if (action.type === "CHANGE_SIZE") {
        const { tool, size } = action.payload;
        return {
            ...state,
            [tool]: {
                ...state[tool],
                size,
            }
        }
    }
    else return state;
}
// this is the initial state for the tools bcoz every tool has different state

const initialToolboxState = {
    [TOOL_ITEMS.LINE]: {
        stroke: COLORS.BLACK,
        size: 1
    },
    [TOOL_ITEMS.BRUSH]: {
        stroke: COLORS.BLACK,
        size: 1
    },
    [TOOL_ITEMS.RECTANGLE]: {
        stroke: COLORS.BLACK,
        fill: null,
        size: 1
    },
    [TOOL_ITEMS.ARROW]: {
        stroke: COLORS.BLACK,
        size: 1
    },
    [TOOL_ITEMS.CIRCLE]: {
        stroke: COLORS.BLACK,
        size: 1,
        fill: null
    },
    [TOOL_ITEMS.TEXT]: {
        stroke: COLORS.BLACK,
        fill: null
    },

}

const ToolbarProvider = ({ children }) => {
    const [toolboxState, dispatchToolboxAction] = useReducer(toolboxReducer, initialToolboxState);
    function toolboxStrokeHandler(color, tool) {
        dispatchToolboxAction({
            type: "CHANGE_STROKE_COLOR",
            payload: {
                color,
                tool,
            }
        })
    }
    function toolboxFillHandler(color, tool) {
        dispatchToolboxAction({
            type: "CHANGE_FILL_COLOR",
            payload: {
                color,
                tool,
            }
        })
    }
    function toolboxSizeHandler(size, tool) {
        dispatchToolboxAction({
            type: "CHANGE_SIZE",
            payload: {
                size,
                tool,
            }
        })
    }



    let obj = { toolboxState, toolboxStrokeHandler, toolboxFillHandler, toolboxSizeHandler, };

    return (
        <ToolbarContext.Provider value={obj}>
            {children}
        </ToolbarContext.Provider>
    )
}

export default ToolbarProvider