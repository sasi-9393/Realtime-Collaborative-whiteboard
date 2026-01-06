import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Register() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch("https://realtime-collaborative-whiteboard-pcpd.onrender.com/api/users/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, email, password }),
            });
            const data = await res.json();
            if (res.ok) {
                alert("Registered successfully!");
                navigate("/login");
            } else {
                alert(data.message || "Registration failed");
            }
        } catch (err) {
            console.error(err);
            alert("Something went wrong");
        }
    };

    const containerStyle = {
        maxWidth: "400px",
        margin: "80px auto",
        padding: "30px",
        backgroundColor: "#fff",
        borderRadius: "12px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        fontFamily: "Arial, sans-serif",
    };

    const formStyle = {
        display: "flex",
        flexDirection: "column",
        gap: "15px",
    };

    const inputStyle = {
        padding: "12px",
        borderRadius: "8px",
        border: "1px solid #dcdde1",
        fontSize: "16px",
        width: "100%",
        boxSizing: "border-box",
    };

    const buttonStyle = {
        padding: "12px",
        borderRadius: "8px",
        border: "none",
        backgroundColor: "#44bd32",
        color: "#fff",
        fontSize: "16px",
        cursor: "pointer",
    };

    const titleStyle = {
        textAlign: "center",
        marginBottom: "20px",
        color: "#2f3640",
    };

    return (
        <div style={containerStyle}>
            <h2 style={titleStyle}>Register</h2>
            <form style={formStyle} onSubmit={handleSubmit}>
                <input
                    style={inputStyle}
                    type="text"
                    placeholder="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
                <input
                    style={inputStyle}
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <input
                    style={inputStyle}
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button style={buttonStyle} type="submit">Register</button>
            </form>
            <p style={{ textAlign: "center", marginTop: "15px" }}>
                Already have an account? <Link to="/login">Login</Link>
            </p>
        </div>
    );
}

export default Register;