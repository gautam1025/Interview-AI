import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [token, setToken] = useState(localStorage.getItem("token"));
    const navigate = useNavigate();

    const login = (newToken) => {
        localStorage.setItem("token", newToken);
        setToken(newToken);
        navigate("/dashboard");
    };

    const logout = () => {
        localStorage.removeItem("token");
        setToken(null);
        navigate("/");
    };

    useEffect(() => {
        setToken(localStorage.getItem("token"));
    }, []);

    return (
        <AuthContext.Provider value={{ token, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}