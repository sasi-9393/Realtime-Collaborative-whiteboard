import { createContext } from "react";

const ToolbarContext = createContext({
    toolboxState: {},
    toolboxStrokeHandler: function () { },
    toolboxFillHandler: function () { },
    changeSize: function () { }
});
export default ToolbarContext;
