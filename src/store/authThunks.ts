import { createAsyncThunk } from "@reduxjs/toolkit";
import { auth } from "../services/firebase";
import {
    signInWithEmailAndPassword,
    sendPasswordResetEmail,
    signOut,
    type User,
} from "firebase/auth";

export type SerializedUser = {
    uid: string;
    email: string | null;
    displayName: string | null;
    photoURL: string | null;
    emailVerified: boolean;
};

const serializeUser = (u: User): SerializedUser => ({
    uid: u.uid,
    email: u.email,
    displayName: u.displayName,
    photoURL: u.photoURL,
    emailVerified: u.emailVerified,
});

export const loginWithEmail = createAsyncThunk<
    SerializedUser,
    { email: string; password: string },
    { rejectValue: string }
>("auth/loginWithEmail", async ({ email, password }, { rejectWithValue }) => {
    try {
        const cred = await signInWithEmailAndPassword(auth, email, password);
        return serializeUser(cred.user);
    } catch (err: any) {
        const code = err?.code as string | undefined;
        switch (code) {
            case "auth/invalid-credential":
            case "auth/wrong-password":
            case "auth/user-not-found":
                return rejectWithValue("Credenciales inválidas.");
            case "auth/too-many-requests":
                return rejectWithValue("Demasiados intentos. Intenta más tarde.");
            case "auth/invalid-email":
                return rejectWithValue("Email inválido.");
            case "auth/user-disabled":
                return rejectWithValue("Esta cuenta ha sido deshabilitada.");
            default:
                return rejectWithValue("Error al iniciar sesión.");
        }
    }
});

export const requestPasswordReset = createAsyncThunk<
    void,
    { email: string },
    { rejectValue: string }
>("auth/requestPasswordReset", async ({ email }, { rejectWithValue }) => {
    try {
        await sendPasswordResetEmail(auth, email);
    } catch (err: any) {
        const code = err?.code as string | undefined;
        switch (code) {
            case "auth/user-not-found":
                return rejectWithValue("No existe una cuenta con este email.");
            case "auth/invalid-email":
                return rejectWithValue("Email inválido.");
            default:
                return rejectWithValue("No se pudo enviar el correo de restablecimiento.");
        }
    }
});

export const logout = createAsyncThunk<void, void, { rejectValue: string }>(
    "auth/logout",
    async (_, { rejectWithValue }) => {
        try {
            await signOut(auth);
        } catch {
            return rejectWithValue("No se pudo cerrar sesión.");
        }
    }
);

