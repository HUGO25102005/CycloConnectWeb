import { onAuthStateChanged, type User } from "firebase/auth";
import { auth } from "../services/firebase";
import { type AppDispatch } from "./index";
import { setUser } from "./authSlice";
import { type SerializedUser } from "./thunks";

const serializeUser = (u: User): SerializedUser => ({
    uid: u.uid,
    email: u.email,
    displayName: u.displayName,
    photoURL: u.photoURL,
    emailVerified: u.emailVerified,
});

export const initAuthListener = (dispatch: AppDispatch) => {
    return onAuthStateChanged(auth, (user) => {
        if (user) {
            dispatch(setUser(serializeUser(user)));
        } else {
            dispatch(setUser(null));
        }
    });
};

