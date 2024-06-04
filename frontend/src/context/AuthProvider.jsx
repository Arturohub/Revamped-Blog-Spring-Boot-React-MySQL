import React, { useState, useEffect } from 'react';
import { AuthContext } from './AuthContext.jsx';
import Cookies from 'js-cookie';
import { jwtDecode } from "jwt-decode";

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState("");

    useEffect(() => {
        const jwt = Cookies.get('jwt');
        if (jwt) {
            const decodedToken = jwtDecode(jwt);
            const decodedUsername = decodedToken.sub;
            setUser(decodedUsername);
        } else {
            setUser("");
        }
    }, []);

    return (
        <AuthContext.Provider value={{ user, setUser }}>
            {children}
        </AuthContext.Provider>
    );
};
