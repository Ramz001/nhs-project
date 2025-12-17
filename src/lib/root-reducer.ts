import navigation from "@/features/navigation/navigation.slice";
import { Action, combineReducers, Reducer } from "@reduxjs/toolkit";

export const combinedReducer = combineReducers({ navigation });

export type RootState = ReturnType<typeof combinedReducer>;

export const rootReducer: Reducer<RootState, Action> = (state, action) => {
  return combinedReducer(state, action);
};
