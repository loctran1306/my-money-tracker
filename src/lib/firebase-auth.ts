import {
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    User,
    sendPasswordResetEmail,
    GoogleAuthProvider,
    signInWithPopup,
} from "firebase/auth";
import { auth } from "./firebase";

// Sign in with email and password
export const signIn = async (email: string, password: string) => {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        return { user: userCredential.user, error: null };
    } catch (error: any) {
        return { user: null, error: error.message };
    }
};

// Sign up with email and password
export const signUp = async (email: string, password: string) => {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        return { user: userCredential.user, error: null };
    } catch (error: any) {
        return { user: null, error: error.message };
    }
};

// Sign out
export const signOutUser = async () => {
    try {
        await signOut(auth);
        return { error: null };
    } catch (error: any) {
        return { error: error.message };
    }
};

// Get current user
export const getCurrentUser = (): User | null => {
    return auth.currentUser;
};

// Check if user session is valid and refresh if needed
export const checkAndRefreshSession = async () => {
    try {
        const currentUser = auth.currentUser;
        if (currentUser) {
            // Force refresh the token
            await currentUser.getIdToken(true);
            return { user: currentUser, error: null };
        }
        return { user: null, error: null };
    } catch (error: any) {
        return { user: null, error: error.message };
    }
};

// Listen to auth state changes
export const onAuthStateChange = (callback: (user: User | null) => void) => {
    return onAuthStateChanged(auth, callback);
};

// Reset password
export const resetPassword = async (email: string) => {
    try {
        await sendPasswordResetEmail(auth, email);
        return { error: null };
    } catch (error: any) {
        return { error: error.message };
    }
};

// Sign in with Google
export const signInWithGoogle = async () => {
    try {
        const provider = new GoogleAuthProvider();
        const userCredential = await signInWithPopup(auth, provider);

        // Kiểm tra email có phải là tranthanhloc130600@gmail.com không
        if (userCredential.user.email !== "tranthanhloc130600@gmail.com") {
            // Nếu không phải email được phép, đăng xuất ngay
            await signOut(auth);
            return {
                user: null,
                error: "Chỉ cho phép đăng nhập với email tranthanhloc130600@gmail.com",
            };
        }

        return { user: userCredential.user, error: null };
    } catch (error: any) {
        // Nếu user đóng popup hoặc có lỗi khác
        if (error.code === "auth/popup-closed-by-user") {
            return { user: null, error: null }; // Không hiển thị lỗi nếu user đóng popup
        }
        return { user: null, error: error.message };
    }
};

