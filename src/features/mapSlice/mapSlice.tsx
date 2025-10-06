import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface LocationState {
  location: {
    lat: number;
    lng: number;
  } | null;
  description: string | null;
}

export interface MapState {
  origin: LocationState | null;
}

const initialState: MapState = {
  origin: null,
};

export const mapSlice = createSlice({
  name: "map",
  initialState,
  reducers: {
    setOrigin: (state, action: PayloadAction<LocationState | null>) => {
      state.origin = action.payload;
    },
    clearOrigin: (state) => {
      state.origin = null;
    },
  },
});

export const { setOrigin, clearOrigin } = mapSlice.actions;

export const selectOrigin = (state: { map: MapState }) => state.map.origin;

export default mapSlice.reducer;
