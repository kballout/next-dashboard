import { configureStore } from "@reduxjs/toolkit";
import authReducer from './authReducer'

export const Store = configureStore({
    reducer: {
        auth: authReducer
    }
})