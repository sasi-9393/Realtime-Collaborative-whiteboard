import { useEffect, useReducer } from 'react';
import rough from "roughjs/bin/rough";
import { BOARD_ACTIONS, TOOL_ACTION_TYPE, TOOL_ITEMS } from '../constants';
import getRoughElement from '../createroughelement.js';
import isPointNearElement from "../eraserFunction.js";
import BoardContext from './BoardContext.js';

const gen = rough.generator();
function boardReducer(state, action) {
    let roughEle = gen.line(0, 0, 0, 0);

    if (action.type === 'SET_ELEMENTS') {
        return {
            ...state,
            elements: action.payload
        };
    }

    if (action.type === BOARD_ACTIONS.CHANGE_TOOL) {

        return {
            ...state,
            activeToolItem: action.payload.tool,
            elements: state.elements
        }
    }
    else if (action.type === "ERASE_DOWN") {
        let newElements = [...state.elements];
        const { clientX, clientY } = action.payload;
        const filteredElements = newElements.filter((ele) => {
            return !isPointNearElement(ele, clientX, clientY)
        })
        // basically we filtered out non touching elements and which are got touched by current cordinates are not there in these array
        return {
            ...state,
            elements: filteredElements,
            history: [...state.history.slice(0, state.index + 1), filteredElements],
            toolActionType: TOOL_ACTION_TYPE.ERASING
        }
    }
    else if (action.type === "ERASE_MOVE") {
        //console.log("ERASE is moving event dispatched");
        const { clientX, clientY } = action.payload;
        let newElements = [...state.elements];
        newElements = newElements.filter((ele) => {
            return !isPointNearElement(ele, clientX, clientY);
        });
        //console.log(newElements);
        return {
            ...state,
            history: [...state.history.slice(0, state.index + 1), newElements],
            elements: newElements,
        };

    }
    else if (action.type === "TEXT_DOWN") {
        const { clientX, clientY } = action.payload;
        let textEle = {
            clientX,
            clientY,
            tool: TOOL_ITEMS.TEXT,
            value: "",
            stroke: action.payload.stroke,
            size: action.payload.size,

        }
        let newElements = [...state.elements, textEle];
        return {
            ...state,
            elements: newElements,
            toolActionType: TOOL_ACTION_TYPE.TYPING
        }
    }
    else if (action.type === "HANDLE_VALUE_CHANGE") {
        let newElements = [...state.elements];
        newElements[newElements.length - 1].value = action.payload.value;
        return {
            ...state,
            elements: newElements
        }
    }
    else if (action.type === BOARD_ACTIONS.DRAW_DOWN) {

        const { clientX, clientY, stroke, tool } = action.payload;
        // general structure for tool items like has id and start and end coordinates and roughEle means its shape
        // which is stored
        if (state.activeToolItem === TOOL_ITEMS.BRUSH) {
            const brushElement = {
                id: state.elements.length,
                points: [{ x: clientX, y: clientY }],
                tool: "BRUSH",
                stroke,
            }
            return {
                ...state,
                toolActionType: TOOL_ACTION_TYPE.DRAWING,
                elements: [...state.elements, brushElement]
            }
        }
        else {
            const newElelment = {
                id: state.elements.length,
                x1: clientX,
                y1: clientY,
                x2: clientX,
                y2: clientY,
                roughEle,
                tool,
            }
            return {
                ...state,
                toolActionType: TOOL_ACTION_TYPE.DRAWING,
                elements: [...state.elements, newElelment]
            }
        }

    }
    else if (action.type === BOARD_ACTIONS.DRAW_MOVE) {
        const { clientX, clientY, stroke, fill, size } = action.payload;
        //console.log(size);
        const newElements = [...state.elements];
        const lastInd = state.elements.length - 1;
        if (lastInd < 0) return state;
        if (state.activeToolItem === TOOL_ITEMS.BRUSH) {
            newElements[lastInd].points.push({ x: clientX, y: clientY });

            return {
                ...state,
                elements: newElements,
            }
        }
        newElements[lastInd].x2 = clientX;
        newElements[lastInd].y2 = clientY;
        const details = { stroke, fill, size }
        roughEle = getRoughElement(newElements.length, state.activeToolItem, newElements[lastInd].x1, newElements[lastInd].y1, clientX, clientY, details);
        newElements[lastInd].roughEle = roughEle;

        return {
            ...state,
            elements: newElements
        }
    }
    else if (action.type === BOARD_ACTIONS.DRAW_UP) {
        const elementsCopy = [...state.elements];

        return {
            ...state,
            history: [...state.history.slice(0, state.index + 1), elementsCopy],
            index: state.index + 1,
            toolActionType: TOOL_ACTION_TYPE.NONE
        }
    }
    else if (action.type === "UNDO") {
        if (state.index <= 0) return state;
        return {
            ...state,
            elements: state.history[state.index - 1],
            index: state.index - 1
        }
    }
    else if (action.type === "REDO") {
        if (state.index >= state.history.length - 1) return state;
        return {
            ...state,
            elements: state.history[state.index + 1],
            index: state.index + 1
        }
    }
    else {
        return state;
    }
}


const BoardProvider = ({ children, initialElements }) => {
    const initialBoardState = {
        activeToolItem: TOOL_ITEMS.BRUSH,
        toolActionType: TOOL_ACTION_TYPE.NONE,
        elements: initialElements || [],
        history: [[...initialElements]],
        index: 0
    }

    const [boardState, dispatchBoardActions] = useReducer(boardReducer, initialBoardState);

    useEffect(() => {
        if (initialElements && initialElements.length > 0) {
            dispatchBoardActions({
                type: 'SET_ELEMENTS',
                payload: initialElements
            });
        }
    }, [initialElements]);

    //const { toolboxState } = useContext(ToolbarContext); This vant be donr bcoz boardProvider is not child for toolboxProvider . so pass it state as function parzmeter 


    function handleToolClick(tool) {
        dispatchBoardActions({
            type: "CHANGE_TOOL",
            payload: {
                tool,
            }
        })
    }
    function boardMouseDownHandler(event, toolboxState) {
        const { clientX, clientY } = event;
        if (boardState.activeToolItem === TOOL_ITEMS.ERASER) {
            //console.log("Erase is downed");
            dispatchBoardActions({
                type: "ERASE_DOWN",
                payload: {
                    clientX,
                    clientY,
                }

            })
        }
        else if (boardState.activeToolItem === TOOL_ITEMS.TEXT) {
            dispatchBoardActions({
                type: "TEXT_DOWN",
                payload: {
                    clientX,
                    clientY,
                    stroke: toolboxState[boardState.activeToolItem].stroke,
                    size: toolboxState[boardState.activeToolItem].size,
                }
            })
        }
        else if (boardState.activeToolItem !== TOOL_ITEMS.ERASER) {
            dispatchBoardActions({
                type: "DRAW_DOWN",
                payload: {
                    clientX,
                    clientY,
                    stroke: toolboxState[boardState.activeToolItem]?.stroke,
                    fill: toolboxState[boardState.activeToolItem]?.fill,
                    tool: boardState.activeToolItem,

                }
            })
        }




    }
    function boardMouseMoveHandler(event, toolboxState) {
        const { clientX, clientY } = event;
        if (boardState.toolActionType === TOOL_ACTION_TYPE.ERASING) {
            //console.log("Erase is moved")
            dispatchBoardActions({
                type: "ERASE_MOVE",
                payload: {
                    clientX,
                    clientY,
                }
            })
        }
        else {
            dispatchBoardActions({
                type: "DRAW_MOVE",
                payload: {
                    clientX,
                    clientY,
                    stroke: toolboxState[boardState.activeToolItem]?.stroke,
                    fill: toolboxState[boardState.activeToolItem]?.fill,
                    size: toolboxState[boardState.activeToolItem]?.size,
                }
            })
        }

    }

    function boardMouseUpHandler() {
        if (boardState.activeToolItem !== "TEXT") {
            dispatchBoardActions({
                type: "DRAW_UP",
            })
        }
    }
    function handleBlur() {
        boardMouseUpHandler();
    }
    function boardUndoHandler() {
        dispatchBoardActions({
            type: "UNDO"
        })
    }
    function boardRedoHandler() {
        dispatchBoardActions({
            type: "REDO"
        })
    }
    function handleInputChange(value) {
        dispatchBoardActions({
            type: "HANDLE_VALUE_CHANGE",
            payload: {
                value,
            }
        })
    }

    const obj = {
        activeToolItem: boardState.activeToolItem,
        elements: boardState.elements,
        handleToolClick,
        boardMouseDownHandler,
        boardMouseMoveHandler,
        boardMouseUpHandler,
        toolActionType: boardState.toolActionType,
        handleInputChange,
        handleBlur,
        boardUndoHandler,
        boardRedoHandler,
    }
    return (
        <BoardContext.Provider value={
            obj
        }>
            {children}
        </BoardContext.Provider>
    )
}

export default BoardProvider
