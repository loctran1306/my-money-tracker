"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { User } from "firebase/auth";
import { onAuthStateChange, checkAndRefreshSession } from "@/lib/firebase-auth";

interface AuthContextType {
    user: User | null;
    loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    loading: true,
});

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Kiểm tra và refresh session khi component mount
        const initializeAuth = async () => {
            try {
                const { user: refreshedUser } = await checkAndRefreshSession();
                if (refreshedUser?.email === "tranthanhloc130600@gmail.com") {
                    setUser(refreshedUser);
                }
            } catch (error) {
                console.log("Session refresh error:", error);
            }
        };

        initializeAuth();

        const unsubscribe = onAuthStateChange((user) => {
            if (user?.email === "tranthanhloc130600@gmail.com") {
                setUser(user);
            } else {
                setUser(null);
            }

            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const value = {
        user,
        loading,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

