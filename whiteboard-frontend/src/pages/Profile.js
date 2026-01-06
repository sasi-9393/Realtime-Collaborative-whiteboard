import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";
import { FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "./profile.css";
function Profile() {
    const [canvases, setCanvases] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newCanvasName, setNewCanvasName] = useState("");
    const [creating, setCreating] = useState(false);
    const [name, setUsername] = useState("");
    const navigate = useNavigate();
    const token = localStorage.getItem("token");

    useEffect(() => {
        if (!token) {
            navigate("/login");
            return;
        }

        try {
            const decoded = jwtDecode(token);
            setUsername(decoded.name || "User");
        } catch (err) {
            console.error("Invalid token", err);
            setUsername("User");
        }

        const fetchCanvases = async () => {
            try {
                const res = await fetch("https://realtime-collaborative-whiteboard-pcpd.onrender.com/canvases", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const data = await res.json();
                if (data.success) {
                    setCanvases(data.canvases);
                } else {
                    navigate("/login");
                }
            } catch (err) {
                console.error("Failed to fetch canvases:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchCanvases();
    }, [token, navigate]);



    const handleCreate = async (e) => {
        e.preventDefault();
        if (!newCanvasName.trim()) return;

        setCreating(true);
        try {
            const res = await fetch("https://realtime-collaborative-whiteboard-pcpd.onrender.com/canvases", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ name: newCanvasName }),
            });

            const data = await res.json();
            if (data && data._id) {
                setCanvases((prev) => [data, ...prev]);
                setNewCanvasName("");
            } else {
                alert("Failed to create canvas");
            }
        } catch (err) {
            console.error("Error creating canvas:", err);
        } finally {
            setCreating(false);
        }
    };
    async function handleDeleteCanvas(id) {
        console.log('Attempting to delete canvas:', id);

        try {
            const res = await fetch(`https://realtime-collaborative-whiteboard-pcpd.onrender.com/canvases/${id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` }
            });

            // Check if the request was successful first
            if (!res.ok) {
                console.error('Delete request failed with status:', res.status);

                // Try to get error message
                const contentType = res.headers.get("content-type");
                let errorMessage = `HTTP ${res.status}`;

                try {
                    if (contentType && contentType.includes("application/json")) {
                        const errorData = await res.json();
                        errorMessage = errorData.message || errorMessage;
                    } else {
                        const errorText = await res.text();
                        errorMessage = errorText || errorMessage;
                    }
                } catch (parseError) {
                    console.error('Error parsing error response:', parseError);
                }

                alert(`Failed to delete canvas: ${errorMessage}`);
                return;
            }

            //  the request was successful
            console.log('Canvas deleted successfully');
            setCanvases(prev => prev.filter(c => c._id !== id));


        } catch (err) {
            console.error("Network error during delete:", err);
            alert("Network error: Failed to delete canvas");
        }
    }




    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    const handleOpenCanvas = (id) => {
        navigate(`/canvas/${id}`);
    };

    return (
        <div className="profile-container">
            <div className="profile-header">
                <h1>Hello, {name}</h1>
                <button className="logout-btn" onClick={handleLogout}>
                    Logout
                </button>
            </div>

            <form className="create-canvas-form" onSubmit={handleCreate}>
                <input
                    type="text"
                    placeholder="Enter canvas name"
                    value={newCanvasName}
                    onChange={(e) => setNewCanvasName(e.target.value)}
                    disabled={creating}
                />
                <button type="submit" disabled={creating}>
                    {creating ? "Creating..." : "Create Canvas"}
                </button>
            </form>

            {loading ? (
                <p>Loading canvases...</p>
            ) : canvases.length === 0 ? (
                <p>No canvas found.</p>
            ) : (
                <div className="canvas-list">
                    {canvases.map((canvas) => (
                        <div className="canvas-card" key={canvas._id}>
                            <h2 className="canvas-name">{canvas.name}</h2>
                            <p className="canvas-info">
                                <strong>Created:</strong> {new Date(canvas.createdAt).toLocaleString()}
                            </p>
                            <p className="canvas-info">
                                <strong>Last Updated:</strong> {new Date(canvas.updatedAt).toLocaleString()}
                            </p>
                            <div className="flex justify-between">

                                <button
                                    className="open-btn"
                                    onClick={() => handleOpenCanvas(canvas._id)}
                                >
                                    Open Canvas
                                </button>
                                <FaTrash style={{ color: "red", marginTop: "20px", cursor: "pointer" }} onClick={() => handleDeleteCanvas(canvas._id)} />
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default Profile;