import type { Middleware } from "@reduxjs/toolkit";
import { appStarted } from "../appSlice";


const authMiddleware: Middleware = (store) => (next) => (action: any) => {

    // if (action.type === appStarted.type) {
    //     store.dispatch<any>(validateSessionThunk());
    // }
    // return next(action);

}

export default authMiddleware;
