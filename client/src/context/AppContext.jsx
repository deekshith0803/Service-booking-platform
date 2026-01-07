import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";
axios.defaults.withCredentials = true;

export const AppContext = createContext();

export const AppProvider = ({ children }) => {

    const navigate = useNavigate()
    const currency = import.meta.env.VITE_CURRENCY || "₹";

    const [token, setToken] = useState(null);
    const [user, setUser] = useState(null);
    const [isProvider, setIsProvider] = useState(false);
    const [showLogin, setShowLogin] = useState(false);
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');

    const [service, setService] = useState([]);

    //function to check if the user is logged in
    const fetchUser = async () => {
        try {
            const { data } = await axios.get('/api/user/data')
            if (data.success) {
                setUser(data.user);
                setIsProvider(data.user.role === 'provider');
            } else {
                navigate('/');
            }
        } catch (error) {
            console.log("Error fetching user data", error);
            toast.error(error.message);
            navigate('/');
        }
    }

    //function to fetch all service from the server
    const fetchService = async () => {
        try {
            const { data } = await axios.get('/api/user/services')
            data.success ? setService(data.services) : toast.error(data.message);
        } catch (error) {
            console.log("Error fetching services", error);
            toast.error(error.message);
        }
    }

    //function to logout the user
    const logout = async () => {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
        setIsProvider(false);
        delete axios.defaults.headers.common['Authorization'];
        navigate('/');
        toast.success('Logged out successfully');
    }

    //useEffect to retrieve the token from local storage
    useEffect(() => {
        const token = localStorage.getItem('token');
        setToken(token);
    }, []);

    //useEffect to fetch user datawhen token is avalible
    useEffect(() => {
        if (token) {
            axios.defaults.headers.common['Authorization'] = `${token}`
            fetchUser();
            fetchService();
        }
    }, [token]);

    const value = {
        // Add any global state or functions you want to provide here
        navigate,
        currency,
        axios,
        user,
        setUser,
        token,
        setToken,
        isProvider,
        setIsProvider,
        fetchUser,
        showLogin,
        setShowLogin,
        logout,
        fetchService,
        service,
        setService,
        date,
        setDate,
        time,
        setTime,
    };

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    )
}


export const useAppContext = () => {
    return useContext(AppContext);
}

