import { configureStore } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import authReducer from "./slices/authSlice";
import datasetReducer from "./slices/datasetSlice";
import searchReducer from "./slices/searchSlice";
import savedViewsReducer from "./slices/savedViewsSlice";
import uiReducer from "./slices/uiSlice";
import { dataScopeApi } from "./api/dataScopeApi";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    dataset: datasetReducer,
    search: searchReducer,
    savedViews: savedViewsReducer,
    ui: uiReducer,
    [dataScopeApi.reducerPath]: dataScopeApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(dataScopeApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

