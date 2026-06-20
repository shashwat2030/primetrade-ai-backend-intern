import {createContext, useContext, useState, useCallback} from "react";

     const AuthContext = createContext(null);

export function AuthProvider({children}) {
    //safely initialize session from local storage
    const [session, setSession] = useState(() => {
        try {
            return JSON.parse(localStorage.getItem("session"));
        } catch {
            return null;
        }
    });

    const login = useCallback((data) => {
        localStorage.setItem("session", JSON.stringify(data));
        setSession(data);
    }, []);

    const logout = useCallback(() => {
        localStorage.removeItem("session");
        setSession(null);
    }, []);

    return (
        <AuthContext.Provider value={{session, login, logout, setSession}}>
            {children}
        </AuthContext.Provider>
    );
}
//eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be within AuthProvider");
    }
    return context;

};