// @ts-nocheck
import {useState, useEffect} from "react";

//Pointing strictly to custom engine
import {useAuth} from "../core/auth";
import {apiFetch} from "../core/api";

const STATUS_LABELS = {TODO: "To Do", IN_PROGRESS: "In Progress", DONE: "Done"};
const STATUS_COLORS = {
    "To Do": {bg: "#EEF2FF", color: "#4338CA"},
    "In Progress": {bg: "#FFFBEB", color: "#B45309"},
    "Done": {bg: "#F0FDF4", color: "#15803D"},
};


//Dropped the "Page" suffix to perfectly match App.jsx
export default function Admin() {

    const {session, logout} = useAuth();
    const [users, setUsers] = useState([]);
    const [tasks, setTasks] = useState([]);
    const [tab, setTab] = useState("users");
    const [msg, setMsg] = useState(null);
    const flash = (text, type = "success") => {
        setMsg({text, type});
        setTimeout(() => setMsg(null), 3000);

    };
    useEffect(() => {
        // firing parallel request to protected endpoints
        apiFetch("/admin/users", {}, session?.token).then(setUsers).catch((e) => flash(e.message, "error"));
        apiFetch("/admin/tasks", {}, session?.token).then(setTasks).catch((e) => flash(e.message, "error"));

    }, [session?.token]);

    const handleDeleteUser = async (id) => {
        if (!confirm("Delete this user?")) {
            return;
        }
        try {
            await apiFetch(`/admin/users/${id}`, {method: "DELETE"}, session?.token);
            setUsers((prev) => prev.filter((u) => u.id !== id));
            flash("Users deleted");
        } catch (e) {
            flash(e.message, "error");
        }
    };


    return (
        <div style={styles.page}>
            <nav style={styles.nav}>
                <span style={styles.brand}>System Manager</span>
                <div style={styles.navRight}>
                    <span style={styles.navUser}>{session?.name}</span>
                    <span style={styles.adminBadge}>OVERWATCH</span>
                    <button style={styles.btnLogout} onClick={logout}> Disconnect
                    </button>
                </div>
            </nav>

            <div style={styles.body}>
                {msg && <p style={msg.type === "error" ? styles.error : styles.success}>{msg.text}</p>}


                <h2 style={styles.heading}>Administrative Interface</h2>
                <p style={styles.sub}>Global oversight of personnel and operations</p>

                <div style={styles.statsRow}>
                    <div style={styles.statCard}>
                        <p style={styles.statNum}>{users.length}</p>
                        <p style={styles.statLabel}>Active Personnel</p>
                    </div>

                    <div style={styles.statCard}>
                        <p style={styles.statNum}>{tasks.length}</p>
                        <p style={styles.statLabel}>Total Operations</p>
                    </div>

                    <div style={styles.statCard}>
                        <p style={styles.statNum}>{tasks.filter((t) => (STATUS_LABELS[t.status] || t.status) === "Done").length}</p>
                        <p style={styles.statLabel}>Completed</p>
                    </div>
                </div>

                <div style={styles.tabs}>
                    <button style={tab === "users" ? styles.tabActive : styles.tab}
                            onClick={() => setTab("users")}>Personnel
                        ({users.length})
                    </button>
                    <button style={tab === "tasks" ? styles.tabActive : styles.tab}
                            onClick={() => setTab("tasks")}>Operations({tasks.length})
                    </button>
                </div>


                {tab === "users" && (
                    <div style={styles.tableWrap}>
                        <table style={styles.table}>
                            <thead>
                            <tr>
                                <th style={styles.th}>Name</th>
                                <th style={styles.th}>Email</th>
                                <th style={styles.th}>Clearance</th>
                                <th style={styles.th}>Action</th>
                            </tr>
                            </thead>
                            <tbody>
                            {users.map((u) => (
                                <tr key={u.id}>
                                    <td style={styles.td}>{u.name}</td>
                                    <td style={styles.td}>{u.email}</td>
                                    <td style={styles.td}>
                    <span style={{
                        ...styles.roleBadge,
                        background: u.role?.toUpperCase() === "ADMIN" ? "#EEF2FF" : "#F3F4F6",
                        color: u.role?.toUpperCase() === "ADMIN" ? "#4338CA" : "#6B7280"
                    }}>
                        {u.role}
                    </span>
                                    </td>

                                    <td style={styles.td}>
                                        <button style={styles.btnDelete} onClick={() => handleDeleteUser(u.id)}>Revoke
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                )}
                {tab === "tasks" && (
                    <div style={styles.tableWrap}>
                        <table style={styles.table}>
                            <thead>
                            <tr>
                                <th style={styles.th}>Operation Title</th>
                                <th style={styles.th}>Assigned To</th>
                                <th style={styles.th}>Status</th>
                            </tr>
                            </thead>
                            <tbody>
                            {tasks.map((t) => {
                                const label = STATUS_LABELS[t.status] || t.status;
                                const sc = STATUS_COLORS[label] || {bg: "#F3F4F6", color: "#6B7280"};
                                return (
                                    <tr key={t.id}>
                                        <td style={styles.td}>{t.title}</td>
                                        <td style={styles.td}>{t.ownerName}</td>
                                        <td style={styles.td}>
                                            <span style={{
                                                ...styles.roleBadge,
                                                background: sc.bg,
                                                color: sc.color
                                            }}>{label}</span>
                                        </td>
                                    </tr>
                                );
                            })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    )
        ;
}
const styles = {
    page: {minHeight: "100vh", backgroundColor: "#F3F4F6", fontFamily: "Inter, system, sans-serif"},
    nav: {
        background: "#fff",
        borderBottom: "1px solid #E5E7EB",
        padding: "0 24px",
        height: 56,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between"
    },
    brand: {fontWeight: 600, fontSize: 15, color: "#111827"},
    navRight: {display: "flex", alignItems: "center", gap: 12},
    navUser: {fontSize: 13, color: "#6B7280"},
    adminBadge: {
        fontSize: 11,
        fontWeight: 600,
        padding: "2px 8px ",
        borderRadius: 99,
        background: "#EEF2FF",
        color: "#4338CA",
    },
    btnLogout: {
        fontSize: 13,
        padding: "6px 14px",
        border: "1px solid #E5E7EB",
        borderRadius: 6,
        background: "transparent",
        color: "#6B7280",
        cursor: "pointer"
    },
    body: {maxWidth: 860, margin: "0 auto", padding: "32px 24px"},
    heading: {fontSize: 18, fontWeight: 600, color: "#111827", margin: "0 0 4px"},
    sub: {fontSize: 13, color: "#6B7280", margin: "0 0 24px"},
    statsRow: {display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 28},
    statCard: {background: "#fff", border: "1px solid #E5E7EB", borderRadius: 10, padding: "20px 24px"},
    statNum: {fontSize: 28, fontWeight: 600, color: "#111827", margin: 0},
    statLabel: {fontSize: 12, color: "#6B7280", marginTop: 4},
    tabs: {display: "flex", gap: 4, borderBottom: "1px solid #E5E7EB", marginBottom: 20},
    tab: {
        padding: "8px 16px",
        fontSize: 13,
        fontWeight: 500,
        border: "none",
        background: "none",
        color: "#6B7280",
        cursor: "pointer",
        borderBottom: "2px solid transparent",
        marginBottom: -1
    },
    tabActive: {
        padding: "8px 16px",
        fontSize: 13,
        fontWeight: 500,
        border: "none",
        background: "none",
        color: "#4F46E5",
        cursor: "pointer",
        borderBottom: "2px solid #4F46E5",
        marginBottom: -1
    },
    tableWrap: {background: "#fff", border: "1px solid #E5E7EB", borderRadius: 10, overflow: "hidden"},
    table: {width: "100%", borderCollapse: "collapse", fontSize: 13},
    th: {
        padding: "10px 16px",
        textAlign: "left",
        fontSize: 11,
        fontWeight: 600,
        color: "#6B7280",
        background: "#F9FAFB",
        borderBottom: "1px solid #E5E7EB",
        textTransform: "uppercase",
        letterSpacing: "0.05em"
    },
    td: {padding: "12px 16px", borderBottom: "1px solid #E5E7EB", color: "#111827"},
    roleBadge: {display: "inline-block", fontSize: 11, fontWeight: 600, padding: "2px 9px", borderRadius: 99},
    btnDelete: {
        padding: "4px 12px",
        fontSize: 12,
        border: "1px solid #FECACA",
        borderRadius: 6,
        background: "transparent",
        color: "#DC2626",
        cursor: "pointer"
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
    success: {
        fontSize: 13,
        color: "#15803D",
        background: "#F0FDF4",
        border: "1px solid #BBF7D0",
        borderRadius: 6,
        padding: "8px 12px",
        marginBottom: 16
    },

};