import { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../store/index";
import { loginWithEmail, requestPasswordReset, logout } from "../store/authThunks";
import { clearError } from "../store/authSlice";
import { useNavigate } from "react-router-dom";

export function useAuth() {
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();
    const { user, status, error } = useSelector((state: RootState) => state.auth);

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

    // useEffect(() => {
    //     if (status === "succeeded" || user?.uid) {
    //         navigate("/app");
    //     }
    // }, [status, user, dispatch]);

    return { user, status, error, login, resetPassword, signOut, clearAuthError };
}

