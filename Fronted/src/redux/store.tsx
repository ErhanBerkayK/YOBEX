import { configureStore } from "@reduxjs/toolkit";
import appReducer from "./appSlice";
import basketReducer from "./basketSlice";
import FavoriteReducer from "./FavoriteSlice";

export const store = configureStore({
  reducer: {
    app: appReducer,
    basket: basketReducer,
    favorite: FavoriteReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
