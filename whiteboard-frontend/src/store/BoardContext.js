import { createContext } from "react";
const BoardContext = createContext({
    activeToolItem: "",
    elements: [],
    handleToolClick: function () { },
    boardMouseDownHandler: function () { },
    boardMouseMoveHandler: function () { },
    toolActionType: "",
    boardMouseUpHandler: function () { },
    history: [[]],
    index: 0,
    handleInputChange: function () { },
    handleBlur: function () { },
    boardUndoHandler: function () { },
    boardRedoHandler: function () { },
});
export default BoardContext;