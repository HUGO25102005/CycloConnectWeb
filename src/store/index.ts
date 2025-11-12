import { configureStore } from "@reduxjs/toolkit";
import { appStarted } from "./appSlice";

const store = configureStore({
    reducer: {
        // theme: themeReducer,
        // loginStep: loginStepSlice,
        // auth: authReducer,
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

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
