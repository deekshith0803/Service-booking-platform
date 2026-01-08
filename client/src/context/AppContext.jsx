import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

// -----------------------------------
// Axios global config
// -----------------------------------
axios.defaults.baseURL =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";
axios.defaults.withCredentials = true;

// -----------------------------------
export const AppContext = createContext(null);

// -----------------------------------
export const AppProvider = ({ children }) => {
    const navigate = useNavigate();
    const currency = import.meta.env.VITE_CURRENCY || "₹";

    const [token, setToken] = useState(null);
    const [user, setUser] = useState(null);
    const [isProvider, setIsProvider] = useState(false);
    const [showLogin, setShowLogin] = useState(false);
    const [service, setService] = useState([]);
    const [date, setDate] = useState("");
    const [time, setTime] = useState("");

    // -----------------------------------
    // LOAD TOKEN ON APP START (if exists)
    // -----------------------------------
    useEffect(() => {
        const storedToken = localStorage.getItem("token");

        if (storedToken) {
            setToken(storedToken);
            axios.defaults.headers.common["Authorization"] =
                `Bearer ${storedToken}`;
        }
    }, []);

    // -----------------------------------
    // FETCH SERVICES (PUBLIC — ALWAYS)
    // -----------------------------------
    useEffect(() => {
        fetchService();
    }, []);

    // -----------------------------------
    // FETCH USER (ONLY WHEN LOGGED IN)
    // -----------------------------------
    useEffect(() => {
        if (token) {
            fetchUser();
        }
    }, [token]);

    // -----------------------------------
    // FETCH USER
    // -----------------------------------
    const fetchUser = async () => {
        try {
            const { data } = await axios.get("/api/user/data");

            if (data.success) {
                setUser(data.user);
                setIsProvider(data.user.role === "provider");
            } else {
                logout();
            }
        } catch (error) {
            console.error("Fetch user error:", error);
            logout();
        }
    };

    // -----------------------------------
    // FETCH SERVICES
    // -----------------------------------
    const fetchService = async () => {
        try {
            const { data } = await axios.get("/api/user/services");

            if (data.success) {
                setService(data.services);
            }
        } catch (error) {
            console.error("Fetch services error:", error);
            toast.error("Failed to load services");
        }
    };

    // -----------------------------------
    // LOGOUT
    // -----------------------------------
    const logout = () => {
        localStorage.removeItem("token");
        delete axios.defaults.headers.common["Authorization"];
        setToken(null);
        setUser(null);
        setIsProvider(false);
        navigate("/");
        toast.success("Logged out successfully");
    };

    // -----------------------------------
    const value = {
        navigate,
        currency,
        axios,
        token,
        setToken,
        user,
        setUser,
        isProvider,
        setIsProvider,
        showLogin,
        setShowLogin,
        fetchUser,
        fetchService,
        service,
        logout,
        date,
        setDate,
        time,
        setTime,
    };

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    );
};

// -----------------------------------
export const useAppContext = () => useContext(AppContext);
