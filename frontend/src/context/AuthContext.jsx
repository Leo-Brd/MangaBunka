import { createContext, useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();
    const [refreshKey, setRefreshKey] = useState(0);

    const triggerRefresh = () => {
        setRefreshKey(prev => prev + 1);
    };

    // Fonction de logout centralisée
    const logout = useCallback(() => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setIsLoggedIn(false);
        setUser(null);
        navigate('/login');
    }, [navigate]);

    // Vérification des erreurs d'authentification
    const checkAuthError = useCallback((response) => {
        if (response.status === 401) {
            logout();
            return true;
        }
        return false;
    }, [logout]);

    // Initialisation au montage
    useEffect(() => {
        const token = localStorage.getItem('token');
        const userData = localStorage.getItem('user');
        
        if (token && userData) {
            try {
                setUser(JSON.parse(userData));
                setIsLoggedIn(true);
            } catch (error) {
                console.error("Invalid user data", error);
                logout();
            }
        }
        setIsLoading(false);
    }, [logout]);

    // Fonction de login
    const login = useCallback((token, userData) => {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
        setIsLoggedIn(true);
        navigate('/');
    }, [navigate]);

    return (
        <AuthContext.Provider value={{ 
            isLoggedIn,
            user,
            isLoading,
            login,
            logout,
            checkAuthError,
            triggerRefresh, 
            refreshKey
        }}>
            {children}
        </AuthContext.Provider>
    );
};