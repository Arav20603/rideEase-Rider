import { createSlice } from '@reduxjs/toolkit'

type LocationState = {
  location: {
    lat: number,
    lng: number
  } | null,
  description: string | null
}

type UserState = {
  email: string | null,
  name: string | null,
  phone: string | null
}

type RideState = {
  id: string,
  title: string,
  baseFare: string,
  pricePerKm: string,
  image: number,
  badge: 'Fastest'
}

export interface RideProps {
  origin:LocationState | null
  fare: number | 0,
  destination: LocationState | null
  user: UserState | null,
  ride: RideState | null
}

const initialState: RideProps = {
  origin: null,
  fare: 0,
  destination: null,
  user: null,
  ride: null
}

export const riderSlice = createSlice({
  name: 'ride',
  initialState,
  reducers: {
    setRideDetails: (state, action) => {
      state.user = action.payload.user
      state.origin = action.payload.origin
      state.destination = action.payload.destination
      state.fare = action.payload.fare
      state.ride = action.payload.ride
    }
  }
})

export const { setRideDetails } = riderSlice.actions

export default riderSlice.reducer