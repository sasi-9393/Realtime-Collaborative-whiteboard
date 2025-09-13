import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Board from "../Components/Board/index";
import Toolbar from "../Components/Toolbar/index";
import Toolbox from "../Components/Toolbox/index";
import BoardProvider from "../store/BoardProvider";
import ToolbarProvider from "../store/toolboxProvider";

function CanvasPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [canvas, setCanvas] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const token = localStorage.getItem("token");

    useEffect(() => {
        if (!token) {
            navigate("/login");
            return;
        }

        const fetchCanvas = async () => {
            try {
                // Fixed endpoint - added /canvases prefix
                const res = await fetch(`http://localhost:5000/canvases/load/${id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                if (!res.ok) {
                    if (res.status === 401) {
                        localStorage.removeItem("token");
                        navigate("/login");
                        return;
                    }
                    throw new Error(`HTTP error! status: ${res.status}`);
                }

                const data = await res.json();

                if (data.success) {
                    setCanvas(data.canvas);
                } else {
                    setError("Failed to load canvas");
                }
            } catch (err) {
                console.error("Error loading canvas:", err);
                setError("Failed to load canvas. Please try again.");
            } finally {
                setLoading(false);
            }
        };

        fetchCanvas();
    }, [id, token, navigate]);

    if (loading) {
        return (
            <div style={{ padding: '2rem', textAlign: 'center' }}>
                <p>Loading canvas...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div style={{ padding: '2rem', textAlign: 'center' }}>
                <p style={{ color: 'red' }}>{error}</p>
                <button onClick={() => navigate("/profile")}>
                    Back to Profile
                </button>
            </div>
        );
    }

    if (!canvas) {
        return (
            <div style={{ padding: '2rem', textAlign: 'center' }}>
                <p>No canvas found.</p>
                <button onClick={() => navigate("/profile")}>
                    Back to Profile
                </button>
            </div>
        );
    }

    return (
        <BoardProvider initialElements={canvas.elements}>
            <ToolbarProvider>
                <Toolbar />
                <Board id={id} />
                <Toolbox />
            </ToolbarProvider>
        </BoardProvider>
    );
}

export default CanvasPage;