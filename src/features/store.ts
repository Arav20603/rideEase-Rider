import { configureStore } from "@reduxjs/toolkit";
import rideReducer from "./riderSlice/riderSlice";
import mapReducer from './mapSlice/mapSlice'


export const store = configureStore({
  reducer: {
    ride: rideReducer,
    map: mapReducer
  }
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;