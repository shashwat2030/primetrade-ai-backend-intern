import {BrowserRouter, Routes, Route, Navigate} from "react-router-dom";
import {AuthProvider, useAuth} from "./core/auth";
// Visual Targets (Notice the clean naming convention)
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Admin from "./pages/Admin";

// guard for standard logged -in users
function ProtectedRoute({children}) {
    const {session} = useAuth();
    if (!session) {
        return <Navigate to="/login"/>;

    }
    return children;
}

//Guard specifically for Admin-level access
function AdminRoute({children}) {
    const {session} = useAuth();
    if (!session) {
        return <Navigate to="/login"/>;
    }
    if (session.role?.toUpperCase() !== "ADMIN") {
        return <Navigate to="/dashboard"/>;
    }
    return children;
}

function Layout() {
    const {session, logout} = useAuth();
    return (
        <div>
            {session && (
                <nav style={{
                    padding: 20,
                    backgroundColor: "#1a1a1a",
                    color: "#fff",
                    display: "flex",
                    justifyContent: "space-between"
                }}>
                    <span>System Active//{session.name}[{session.role?.toUpperCase()}]</span>
                    <button
                        onClick={logout}
                        style={{
                            cursor: "pointer",
                            padding: "5px,15px",
                            background: "#ff4757",
                            border: "none",
                            color: "white",
                            borderRadius: "4px"
                        }}
                    >
                        Terminate Session
                    </button>
                </nav>
            )

            }
            {/* The routing canvas*/}
            <main style={{padding: "20px"}}>
                <Routes>
                    <Route path="/login" element={<Login/>}/>
                    <Route path="/register" element={<Register/>}/>
                    <Route path="/dashboard" element={
                        <ProtectedRoute>
                            <Dashboard/>
                        </ProtectedRoute>
                    }/>
                    <Route path="/admin" element={
                        <AdminRoute>
                            <Admin/>
                        </AdminRoute>
                    }/>
                    {/*Catch-all route to prevent dead links */}
                    <Route path="*" element={<Navigate to="/login"/>}/>
                </Routes>
            </main>
        </div>
    );
}

// the master application wrapper
export default function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <Layout/>
            </AuthProvider>
        </BrowserRouter>
    );
}