import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./authSlice.js";
import storage from 'redux-persist/lib/storage'; // defaults to localStorage for web
import { combineReducers } from 'redux';
import postSlice from "./postSlice.js";
import chatSlice from "./chatSlice.js";
import themeSlice from "./themeSlice.js";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist'
import { PersistGate } from 'redux-persist/integration/react'
const persistConfig = {
  key: 'root',
  storage,
  version: 1 // only auth will be persisted
};
const rootReducer = combineReducers({
  auth: authSlice,
  post: postSlice,
  chat: chatSlice,
  theme: themeSlice
});

const persistedReducer = persistReducer(persistConfig, rootReducer);


const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
})


const persistor = persistStore(store);

export default store;
export { persistor };