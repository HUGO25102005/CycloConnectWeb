import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { loginWithEmail, logout, requestPasswordReset } from "./authThunks";
import { type SerializedUser } from "./authThunks";

export type AuthState = {
    user: SerializedUser | null;
    status: "idle" | "loading" | "succeeded" | "failed" | "initializing";
    error: string | null;
    isInitialized: boolean;
};

const initialState: AuthState = {
    user: null,
    status: "initializing",
    error: null,
    isInitialized: false,
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setUser(state, action: PayloadAction<SerializedUser | null>) {
            state.user = action.payload;
            state.error = null;
            state.status = "idle";
            state.isInitialized = true;
        },
        clearError(state) {
            state.error = null;
        },
    },
    extraReducers(builder) {
        builder
            .addCase(loginWithEmail.pending, (state) => {
                state.status = "loading";
                state.error = null;
            })
            .addCase(loginWithEmail.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.user = action.payload;
                state.error = null;
            })
            .addCase(loginWithEmail.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload ?? "No se pudo iniciar sesión.";
            })
            .addCase(requestPasswordReset.pending, (state) => {
                state.status = "loading";
                state.error = null;
            })
            .addCase(requestPasswordReset.fulfilled, (state) => {
                state.status = "succeeded";
                state.error = null;
            })
            .addCase(requestPasswordReset.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload ?? "Error al enviar correo.";
            })
            .addCase(logout.pending, (state) => {
                state.status = "loading";
            })
            .addCase(logout.fulfilled, (state) => {
                state.user = null;
                state.status = "idle";
                state.error = null;
            })
            .addCase(logout.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload ?? "Error al cerrar sesión.";
            });
    },
});

export const { setUser, clearError } = authSlice.actions;
export default authSlice.reducer;

