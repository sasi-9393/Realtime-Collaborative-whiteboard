import { BrowserRouter, Route, Routes } from "react-router-dom";
import CanvasPage from "./pages/CanvasPage";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import Register from "./pages/Register";


function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Register />} />
                <Route path="/login" element={<Login />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/canvas/:id" element={<CanvasPage />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
