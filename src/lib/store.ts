import { configureStore } from "@reduxjs/toolkit";
import { rootReducer } from "./root-reducer";

export const store = configureStore({
  reducer: rootReducer,
});

// Infer the type of makeStore
export type AppStore = typeof store;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
