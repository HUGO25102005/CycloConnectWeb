import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../store/index";
import { loginWithEmail, requestPasswordReset, logout } from "../store/thunks";
import { clearError } from "../store/authSlice";

export function useAuth() {
    const dispatch = useDispatch<AppDispatch>();
    const { user, status, error, loading, isInitialized } = useSelector((state: RootState) => state.auth);

    const login = useCallback(
        (email: string, password: string) => {
            dispatch(loginWithEmail({ email, password }));
        },
        [dispatch]
    );

    const resetPassword = useCallback(
        (email: string) => {
            dispatch(requestPasswordReset({ email }));
        },
        [dispatch]
    );

    const signOut = useCallback(() => {
        dispatch(logout());
    }, [dispatch]);

    const clearAuthError = useCallback(() => {
        dispatch(clearError());
    }, [dispatch]);

    return { user, status, error, loading, isInitialized, login, resetPassword, signOut, clearAuthError };
}

