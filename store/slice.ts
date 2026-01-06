import { navState } from "@/type";
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  origin: null,
  destination: null,
  travelTimeInformation: null,
}

export const navSlice = createSlice({
  name: "nav",
  initialState,
  reducers: {
    setOrigin: (state, action) => {
      state.origin = action.payload;
    },
    setDestination: (state, action) => {
      state.destination = action.payload;
    },
    setTravelTimeInformation: (state, action) => {
      state.travelTimeInformation = action.payload;
    },
  },
});

export const { setOrigin, setDestination, setTravelTimeInformation } = navSlice.actions;

export const selectOrigin = (state: navState) => state.nav.origin;
export const selectDestination = (state: navState) => state.nav.destination;
export const selectTravelTimeInformation = (state: navState) => state.nav.travelTimeInformation;


export default navSlice.reducer;

