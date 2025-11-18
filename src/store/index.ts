import { configureStore } from "@reduxjs/toolkit";
import { appStarted } from "./appSlice";
import authReducer from "./authSlice";
import { validateSessionThunk } from "./thunks";

const store = configureStore({
    reducer: {
        auth: authReducer,
        // theme: themeReducer,
        // loginStep: loginStepSlice,
        // register: registerReducer,
        // user: userReducer,
        // company: companyReducer,
        // organizational: organizationalReducer,
        // people: peopleReducer,
    },
    // middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat([
    //     loginStepMiddleware,
    //     authMiddleware,
    // ]),
});

store.dispatch(appStarted());
store.dispatch(validateSessionThunk());
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
