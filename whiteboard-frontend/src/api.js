// update the canvas
const API_URL = "https://realtime-collaborative-whiteboard-pcpd.onrender.com/canvases";

export const updateCanvas = async function (id, elements) {
    try {
        const token = localStorage.getItem("token");
        if (!token) {
            throw new Error("Not authorized");
        }
        const response = await fetch(`${API_URL}/${id}`, {
            method: "PUT",
            headers: {
                "Content-type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ elements })
        })
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || "Failed to uodate");
        }
        return data;
    }
    catch (err) {
        throw new Error(err);
    }
}