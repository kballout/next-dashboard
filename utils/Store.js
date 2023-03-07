import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authReducer";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { combineReducers } from "redux";


const persistConfig = {
  key: "root",
  storage,
};

const reducers = combineReducers({
    auth: authReducer
})
const persistedReducer = persistReducer(persistConfig, reducers);

const Store = configureStore({
  reducer: persistedReducer,
});

const persistor = persistStore(Store);

export { Store, persistor };
