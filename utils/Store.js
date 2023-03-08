import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
import authReducer from "./authReducer";
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from "redux-persist";
import storage from './storage'
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
  middleware: (getDefaultMiddleware) => 
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      }
    })
});

const persistor = persistStore(Store);

export { Store, persistor };
