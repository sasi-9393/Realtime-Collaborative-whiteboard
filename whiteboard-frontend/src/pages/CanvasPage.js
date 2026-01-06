import { useContext, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import io from "socket.io-client";
import Board from "../Components/Board/index";
import Toolbar from "../Components/Toolbar/index";
import Toolbox from "../Components/Toolbox/index";
import BoardContext from "../store/BoardContext";
import BoardProvider from "../store/BoardProvider";
import ToolbarProvider from "../store/toolboxProvider";
import "./CanvasPage.css";

const SOCKET_URL = "https://realtime-collaborative-whiteboard-pcpd.onrender.com";

function CanvasPageContent() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [canvas, setCanvas] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showShareModal, setShowShareModal] = useState(false);
    const [shareEmail, setShareEmail] = useState("");
    const [shareLoading, setShareLoading] = useState(false);
    const [shareError, setShareError] = useState(null);
    const [shareSuccess, setShareSuccess] = useState(false);

    const token = localStorage.getItem("token");
    const socketRef = useRef(null);
    const { dispatchBoardActions } = useContext(BoardContext);

    // Initialize socket connection
    useEffect(() => {
        if (!id || !token) return;

        const socket = io(SOCKET_URL);
        socketRef.current = socket;

        // Join canvas room
        socket.emit("join-canvas", {
            canvasId: id,
            token
        });

        // Listen for element updates from other users
        socket.on("elements-updated", (data) => {
            console.log("Remote update received from:", data.updatedBy);
            console.log("New elements:", data.elements);
            // Update board context with remote elements in real-time
            dispatchBoardActions({
                type: 'SET_ELEMENTS',
                payload: data.elements
            });
        });

        socket.on("user-joined", (data) => {
            console.log(`${data.name} joined the canvas`);
        });

        socket.on("user-left", (data) => {
            console.log(`${data.name} left the canvas`);
        });

        socket.on("error", (data) => {
            console.error("Socket error:", data.message);
        });

        return () => {
            if (socket.connected) {
                socket.disconnect();
            }
        };
    }, [id, token, dispatchBoardActions]);

    // Send elements to other users
    const sendElements = (updatedElements) => {
        if (socketRef.current?.connected) {
            socketRef.current.emit("update-elements", {
                canvasId: id,
                elements: updatedElements
            });
        }
    };

    // Fetch canvas on mount
    useEffect(() => {
        if (!token) {
            navigate("/login");
            return;
        }

        const fetchCanvas = async () => {
            try {
                const res = await fetch(`https://realtime-collaborative-whiteboard-pcpd.onrender.com/canvases/load/${id}`, {
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

    const handleShareClick = () => {
        setShowShareModal(true);
        setShareError(null);
        setShareSuccess(false);
    };

    const handleShareSubmit = async (e) => {
        e.preventDefault();
        setShareLoading(true);
        setShareError(null);
        setShareSuccess(false);

        if (!shareEmail.trim()) {
            setShareError("Please enter an email address");
            setShareLoading(false);
            return;
        }

        try {
            const res = await fetch(`https://realtime-collaborative-whiteboard-pcpd.onrender.com/canvases/share/${id}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ sharedWithEmail: shareEmail }),
            });

            const data = await res.json();

            if (!res.ok) {
                setShareError(data.message || "Failed to share canvas");
                return;
            }

            setShareSuccess(true);
            setShareEmail("");
            setTimeout(() => {
                setShowShareModal(false);
                setShareSuccess(false);
            }, 1500);
        } catch (err) {
            console.error("Error sharing canvas:", err);
            setShareError("An error occurred while sharing. Please try again.");
        } finally {
            setShareLoading(false);
        }
    };

    const handleCloseModal = () => {
        setShowShareModal(false);
        setShareEmail("");
        setShareError(null);
        setShareSuccess(false);
    };

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
                <button onClick={() => navigate("/profile")}>Back to Profile</button>
            </div>
        );
    }

    if (!canvas) {
        return (
            <div style={{ padding: '2rem', textAlign: 'center' }}>
                <p>No canvas found.</p>
                <button onClick={() => navigate("/profile")}>Back to Profile</button>
            </div>
        );
    }

    return (
        <>
            <div className="canvas-page-header">
                <button className="share-button" onClick={handleShareClick}>
                    Share
                </button>
            </div>
            <Toolbar />
            <Board
                id={id}
                sendElements={sendElements}
            />
            <Toolbox />

            {showShareModal && (
                <div className="modal-overlay" onClick={handleCloseModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>Share Canvas</h2>
                            <button className="close-button" onClick={handleCloseModal}>
                                ×
                            </button>
                        </div>
                        <form onSubmit={handleShareSubmit}>
                            <div className="form-group">
                                <label htmlFor="share-email">Email Address</label>
                                <input
                                    id="share-email"
                                    type="email"
                                    placeholder="Enter email to share with"
                                    value={shareEmail}
                                    onChange={(e) => setShareEmail(e.target.value)}
                                    disabled={shareLoading}
                                    required
                                />
                            </div>
                            {shareError && (
                                <div className="error-message">{shareError}</div>
                            )}
                            {shareSuccess && (
                                <div className="success-message">Canvas shared successfully!</div>
                            )}
                            <div className="modal-actions">
                                <button
                                    type="button"
                                    className="cancel-button"
                                    onClick={handleCloseModal}
                                    disabled={shareLoading}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="submit-button"
                                    disabled={shareLoading}
                                >
                                    {shareLoading ? "Sharing..." : "Share"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}

function CanvasPage() {
    const { id } = useParams();
    const [canvas, setCanvas] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const token = localStorage.getItem("token");
    const navigate = useNavigate();

    // Fetch canvas on mount
    useEffect(() => {
        if (!token) {
            navigate("/login");
            return;
        }

        const fetchCanvas = async () => {
            try {
                const res = await fetch(`https://realtime-collaborative-whiteboard-pcpd.onrender.com/canvases/load/${id}`, {
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
                <button onClick={() => navigate("/profile")}>Back to Profile</button>
            </div>
        );
    }

    if (!canvas) {
        return (
            <div style={{ padding: '2rem', textAlign: 'center' }}>
                <p>No canvas found.</p>
                <button onClick={() => navigate("/profile")}>Back to Profile</button>
            </div>
        );
    }

    return (
        <BoardProvider initialElements={canvas.elements}>
            <ToolbarProvider>
                <CanvasPageContent />
            </ToolbarProvider>
        </BoardProvider>
    );
}

export default CanvasPage;