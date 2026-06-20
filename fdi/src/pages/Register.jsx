//@ts-nocheck
import {useState} from "react";
import {Link, useNavigate} from "react-router-dom";

//Pointing strictly to our core engine room
import {useAuth} from "../core/auth";
import {apiFetch} from "../core/api";

// Dropping the "page" suffix

export default function Register() {
    const {login} = useAuth();
    const navigate = useNavigate();

    const [form, setForm] = useState({name: "", email: "", password: ""});
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const set = (k) => (e) => setForm((f) => ({...f, [k]: e.target.value}));
    const handleSubmit = async () => {
        setError(null);
        setLoading(true);

        try {
            const data = await apiFetch("/auth/register",
                {
                    method: "POST",
                    body: JSON.stringify(form),
                });
            login(data);
            //Smart routing aligns with our App.jsx security
            if (data.role?.toUpperCase() === "ADMIN") {
                navigate("/admin");
            } else {
                navigate("/dashboard");
            }
        } catch (e) {
            setError(e.message);
        } finally {
            setLoading(false);
        }
    };
    return (
        <div style={styles.wrap}>
            <div style={styles.card}>
                <h2 style={styles.title}>Create Account</h2>
                <p style={styles.sub}>Starting the free Account</p>
                {error && <p style={styles.error}>{error}</p>}

                <label style={styles.label}>Name</label>
                <input style={styles.input} value={form.name} onChange={set("name")} placeholder="Your_Name"/>
                <label style={styles.label}>Email</label>
                <input style={styles.input} type="email" value={form.email} onChange={set("email")}
                       placeholder="Youremailid@example.com"/>
                <label style={styles.label}>Password</label>
                <input
                    style={styles.input}
                    type="password"
                    value={form.password}
                    onChange={set("password")}
                    placeholder="min 6 characters"
                    onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                />
                <button style={styles.btn} disabled={loading} onClick={handleSubmit}>
                    {loading ? "Creating account..." : "Create account"}
                </button>
                <p style={styles.switch}>
                    Have an account?{" "}
                    <Link to="/login" style={styles.link}>Sign in</Link>
                </p>
            </div>
        </div>
    );
}
const styles = {
    wrap: {minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#F3F4F6"},
    card: {background: "#fff", border: "1px solid #E5E7EB", borderRadius: 12, padding: "36px 40px", width: 360},
    title: {fontSize: 20, fontWeight: 600, margin: "0 0 4px", color: "#111827"},
    sub: {fontSize: 13, color: "#6B7280", margin: "0 0 24px"},
    label: {display: "block", fontSize: 13, fontWeight: 500, marginBottom: 6, color: "#111827"},
    input: {
        display: "block",
        width: "100%",
        padding: "8px 12px",
        fontSize: 14,
        border: "1px solid #E5E7EB",
        borderRadius: 6,
        marginBottom: 16,
        boxSizing: "border-box",
        outline: "none",
        color: "#111827"
    },
    btn: {
        width: "100%",
        padding: "9px 0",
        fontSize: 14,
        fontWeight: 500,
        backgroundColor: "#4F46E5",
        color: "#fff",
        border: "none",
        borderRadius: 6,
        cursor: "pointer",
        marginTop: 4
    },
    error: {
        fontSize: 13,
        color: "#DC2626",
        background: "#FEF2F2",
        border: "1px solid #FECACA",
        borderRadius: 6,
        padding: "8px 12px",
        marginBottom: 16
    },
    switch: {textAlign: "center", marginTop: 18, fontSize: 13, color: "#6B7280"},
    link: {color: "#4F46E5", fontWeight: 500, textDecoration: "none"}


};