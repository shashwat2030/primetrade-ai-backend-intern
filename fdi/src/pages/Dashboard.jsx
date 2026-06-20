//@ts-nocheck
import {useState, useEffect, useCallback} from "react";

//Pointing strictly to our core engine rom
import {useAuth} from "../core/auth";
import {apiFetch} from "../core/api";

const STATUS_LABELS = {TODO: "To Do", IN_PROGRESS: "In Progress", DONE: "Done"};
const STATUS_COLORS = {
    "To Do": {bg: "#EEF2FF", color: "#4338CA", border: "#C7D2FE"},
    "In Progress": {bg: "#FFFBEB", color: "#B45309", border: "#FDE68A"},
    "Done": {bg: "#F0FDF4", color: "#15803D", border: "#BBF7D0"},

};

const FILTERS = ["All", "To Do", "In Progress", "Done"];


//Dropped the "Page" Suffix
export default function Dashboard() {

    const {session, logout} = useAuth();
    const [tasks, setTasks] = useState([]);
    const [filter, setFilter] = useState("All");
    const [msg, setMsg] = useState(null);
    const [modal, setModal] = useState(null);  // null  | {} | {task}


    const flash = (text, type = "success") => {
        setMsg({text, type});
        setTimeout(() => setMsg(null), 3000);
    };


    const loadTasks = useCallback(async () => {
        try {
            // notice passing session?. token safely
            const data = await apiFetch("/tasks", {}, session?.token);
            setTasks(data);
        } catch (e) {
            flash(e.message, "error");
        }
    }, [session?.token]);


    useEffect(() => {
        const init = async () => {
            await loadTasks();
        };
        void init();
    }, [loadTasks]);


    const handleDelete = async (id) => {
        if (!confirm("Do you want to delete this task?")) {
            return;
        }
        try {
            await apiFetch(`/tasks/${id}`, {method: "DELETE"}, session?.token);
            flash("Task deleted ");
            void loadTasks();
        } catch (e) {
            flash(e.message, "error");
        }

    };


    const visible = filter === "All"
        ? tasks
        : tasks.filter((t) => (STATUS_LABELS[t.status] || t.status) === filter);

    return (
        <div style={styles.page}>
            <nav style={styles.nav}>
                <span style={styles.brand}>System Manager</span>
                <div style={styles.navRight}>
                    <span style={styles.navUser}>{session?.name}[{session?.role}]</span>
                    <button style={styles.btnLogout} onClick={logout}>Disconnect</button>
                </div>
            </nav>

            <div style={styles.body}>
                {msg && <p style={msg.type === "error" ? styles.error : styles.success}>{msg.text}</p>}

                <div style={styles.topRow}>

                    <div>
                        <h2 style={styles.heading}>Active Operations</h2>
                        <p style={styles.sub}>{tasks.length}total</p>

                    </div>

                    <button style={styles.btnAdd} onClick={() => setModal({})}>+Initialize Task</button>
                </div>

                <div style={styles.filterRow}>
                    {FILTERS.map((f) => (
                        <button key={f} style={filter === f ? styles.filterActive : styles.filterBtn}
                                onClick={() => setFilter(f)}>{f}</button>
                    ))}
                </div>


                {visible.length === 0
                    ? <p style={styles.empty}>No operations found. Initialize one above.</p>
                    : visible.map((task) => {
                        const label = STATUS_LABELS[task.status] || task.status;
                        const sc = STATUS_COLORS[label] || STATUS_COLORS["To Do"];//fallback safety

                        return (
                            <div key={task.id} style={styles.taskCard}>


                                <div style={styles.taskRow}>

                                    <div>
                                        <p style={styles.taskTitle}>{task.title}</p>
                                        {task.description && <p style={styles.taskDesc}>{task.description}</p>}
                                        <span style={{
                                            ...styles.badge,
                                            background: sc.bg,
                                            color: sc.color,
                                            border: `1px solid ${sc.border}`
                                        }}>
                                            {label}
                                        </span>
                                    </div>

                                    <div style={styles.taskActions}>
                                        <button style={styles.btnEdit} onClick={() => setModal({task})}>Configure
                                        </button>
                                        <button style={styles.btnDelete}
                                                onClick={() => handleDelete(task.id)}>Terminate
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                }
            </div>
            {modal != null && (
                <TaskModal
                    task={modal.task}
                    token={session?.token}
                    onClose={() => setModal(null)}
                    onDone={() => {
                        setModal(null);
                        void loadTasks();
                        flash(modal.task ? "Task updated" : "Task created");
                    }}
                    onError={(e) => flash(e, "error")}
                />
            )}
        </div>
    );
}

function TaskModal({task, token, onClose, onDone, onError}) {
    const [form, setForm] = useState({
        title: task?.title || "",
        description: task?.description || "",
        status: task?.status || "TODO",
    });
    const [loading, setLoading] = useState(false);
    const handleSave = async () => {
        setLoading(true);
        try {
            if (task) {
                await apiFetch(`/tasks/${task.id}`, {method: "PUT", body: JSON.stringify(form)}, token);

            } else {
                await apiFetch("/tasks", {method: "POST", body: JSON.stringify(form)}, token);

            }
            onDone();
        } catch (e) {
            onError(e.message);
        }
        setLoading(false);
    };
    return (
        <div style={styles.overlay} onClick={onClose}>
            <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
                <h3 style={styles.modalTitle}>{task ? "Configure Task" : "Initialize Task"}</h3>
                <label style={styles.label}>Title</label>
                <input style={styles.input} value={form.title}
                       onChange={(e) => setForm((f) => ({...f, title: e.target.value}))}
                       placeholder="Task Title"/>
                <label style={styles.label}>Description</label>
                <textarea style={styles.textarea} value={form.description}
                          onChange={(e) => setForm((f) => ({...f, description: e.target.value}))}
                          placeholder="Optional parameters..."/>
                <label style={styles.label}>Status</label>
                <select style={styles.select} value={form.status}
                        onChange={(e) => setForm((f) => ({...f, status: e.target.value}))}>
                    <option value="TODO">To Do</option>
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="DONE">Done</option>
                </select>
                <div style={styles.modalActions}>
                    <button style={styles.btnCancel} onClick={onClose}>Abort</button>
                    <button style={styles.btnSave} disabled={loading} onClick={handleSave}>
                        {loading ? "Processing..." : task ? "Commit Changes" : "Execute Creation"}
                    </button>

                </div>
            </div>
        </div>

    );
}

const styles = {
    page: {minHeight: "100vh", background: "#F3F4F6", fontFamily: "Inter, system-ui,sans-serif"},
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
    btnLogout: {
        fontSize: 13,
        padding: "6px 14px",
        border: "1px solid #E5E7EB",
        borderRadius: 6,
        background: "transparent",
        color: "#6B7280",
        cursor: "pointer"
    },
    body: {maxWidth: 760, margin: "0 auto", padding: "32px 24px"},
    topRow: {display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 20},
    heading: {fontSize: 18, fontWeight: 600, color: "#111827", margin: 0},
    sub: {fontSize: 13, color: "#6B7280", marginTop: 4},
    btnAdd: {
        padding: "8px 16px",
        fontSize: 13,
        fontWeight: 500,
        background: "#4F46E5",
        color: "#fff",
        border: "none",
        borderRadius: 6,
        cursor: "pointer"
    },
    filterRow: {display: "flex", gap: 8, marginBottom: 8},
    filterBtn: {
        padding: "5px 14px",
        fontSize: 12,
        fontWeight: 500,
        borderRadius: 99,
        border: "1px solid #E5E7EB",
        background: "transparent",
        color: "#6B7280",
        cursor: "pointer"
    },
    filterActive: {
        padding: "5px 14px",
        fontSize: 12,
        fontWeight: 500,
        borderRadius: 99,
        border: "1px solid #4F46E5",
        background: "#EE2FF",
        color: "#4F46E5",
        cursor: "pointer"
    },
    taskCard: {
        background: "#fff",
        border: "1px solid #E5E7EB",
        borderRadius: 10,
        padding: "16px 20px",
        marginBottom: 12
    },
    taskRow: {display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12},
    taskTitle: {fontSize: 15, fontWeight: 500, color: "#111827", margin: "0 0 4px"},
    taskDesc: {fontSize: 13, color: "#6B7280", margin: "0 0 8px", lineHeight: 1.5},
    badge: {display: "inline-block", fontSize: 11, fontWeight: 600, padding: "2px 9px", borderRadius: 99},
    taskActions: {display: "flex", gap: 6, flexShrink: 0},
    btnEdit: {
        padding: "5x 12px",
        fontSize: 12,
        border: "1px solid #E5E7EB",
        borderRadius: 6,
        background: "transparent",
        color: "#6B7280",
        cursor: "pointer"
    },
    btnDelete: {
        padding: "5px 12px",
        fontSize: 12,
        border: "1px solid #FECACA",
        borderRadius: 6,
        background: "transparent",
        color: "#DC2626",
        cursor: "pointer"
    },
    empty: {textAlign: "center", padding: "48px 0", color: "#6B7280", fontSize: 14},
    overlay: {
        position: "fixed",
        inset: "0",
        background: "rgba(0,0,0,0.4)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 50
    },
    modal: {background: "#fff", borderRadius: 12, padding: "28px 32px", width: 420},
    modalTitle: {fontSize: 16, fontWeight: 600, margin: "0 0 20px", color: "#111827"},
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
    textarea: {
        display: "block",
        width: "100%",
        padding: "8px 12px",
        fontSize: 14,
        border: "1px solid #E5E7EB",
        borderRadius: 6,
        marginBottom: 16,
        boxSizing: "border-box",
        minHeight: 80,
        resize: "vertical",
        outline: "none",
        fontFamily: "inherit",
        color: "#111827"
    },
    select: {
        display: "block",
        width: "100%",
        padding: "8px 12px",
        fontSize: 14,
        border: "1px solid #E5E7EB",
        borderRadius: 6,
        marginBottom: 16,
        boxSizing: "border-box",
        background: "#fff",
        color: "#111827",
        outline: "none"
    },
    modalActions: {display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 8},
    btnCancel: {
        padding: "8px 18px",
        fontSize: 13,
        border: "1px solid #E5E7EB",
        borderRadius: 6,
        background: "transparent",
        color: "#6B7280",
        cursor: "pointer"
    },
    btnSave: {
        padding: "8px 20px",
        fontSize: 13,
        fontWeight: 500,
        background: "#4F46E5",
        color: "#fff",
        border: "none",
        borderRadius: 6,
        cursor: "pointer"
    },


};