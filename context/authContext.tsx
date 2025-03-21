import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import { AuthContextType, UserType } from "@/types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import uuid from 'react-native-uuid';

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<UserType | null>(null);
    const router = useRouter();
    const db = useSQLiteContext();

    useEffect(() => {
        checkUserSession();
    }, []);
    
    const checkUserSession = async () => {
        try {
            const uid = await AsyncStorage.getItem("user_id"); 
            if (uid) {
                updateUserData(uid)
                
                router.replace("/(tabs)");
                return;
            }
            router.replace("/(auth)/welcome");
        } catch (error) {
            console.log("Error checking session:", error);
        }
    };

    const login = async (email: string, password: string) => {
        try {
            const user = await db.getFirstAsync("SELECT * FROM users WHERE email = ? AND password = ?", [email, password]);

            if (user) {
                await AsyncStorage.setItem("user_id", user.uid);
                router.replace("/(tabs)");
                return { success: true };
            } else {
                return { success: false, msg: "Email atau password salah" };
            }
        } catch (error) {
            console.log("Login error:", error);
            return { success: false, msg: "Terjadi kesalahan saat login" };
        }
    };

    const updateUserData = async (uid: string) => {
        try {
            const user = await db.getFirstAsync("SELECT * FROM users WHERE uid = ?", [uid]);        
                
    
            if (user) {
                const userData: UserType = {
                    uid: user.uid,
                    email: user.email || null,
                    name: user.name || null,
                    phone: user.phone || null,
                    profession: user.profession || null,
                    gender: user.gender || null,
                    address: user.address || null,
                    image: user.image || null,
                };
                setUser({ ...userData });
                
            }
        } catch (error) {
            console.log("Error updating user data:", error);
        }
    };
    

    const register = async (
        email: string,
        password: string,
        name: string,
        phone: string,
        profession: string,
        gender: string,
        address: string
    ) => {
        try {
            const existingUser = await db.getFirstAsync("SELECT * FROM users WHERE email = ?", [email]);

            if (existingUser) {
                return { success: false, msg: "Email sudah digunakan" };
            }

            const uid = uuid.v4(); 

            await db.runAsync(
                "INSERT INTO users (uid, email, password, name, phone, profession, gender, address) VALUES (?, ?, ?, ?, ?, ?, ?, ?)", 
                [uid, email, password, name, phone, profession, gender, address]
            );

           await db.getFirstAsync("SELECT * FROM users WHERE email = ?", [email]);
            

            router.replace("/(auth)/login");
            return { success: true };
        } catch (error) {
            console.log("Register error:", error);
            return { success: false, msg: "Terjadi kesalahan saat registrasi" };
        }
    };

    const contextValue: AuthContextType = {
        user,
        setUser,
        login,
        register,
        updateUserData
    };

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    )
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be wrapped inside AuthProvider");
    }
    return context;
};
