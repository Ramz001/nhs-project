import { createSlice } from "@reduxjs/toolkit";

export interface Service {
  id: string;
  name: string;
  address: string;
  telephone: string;
  longitude: number;
  latitude: number;
}
interface Location {
  latitude: number;
  longitude: number;
}

interface NavigationState {
  postcode: string | null;
  currentService: Service | null;
  serviceTypeId: string | null;
  selectedServices: Service[];
  location?: Location;
}

const initialState: NavigationState = {
  postcode: null,
  currentService: null,
  serviceTypeId: null,
  selectedServices: [],
};

const navigation = createSlice({
  name: "navigation",
  initialState,
  reducers: {
    setPostcode(state, action) {
      state.postcode = action.payload;
    },
    setCurrentService(state, action) {
      state.currentService = action.payload;
    },
    setServiceTypeId(state, action) {
      state.serviceTypeId = action.payload;
    },
    addSelectedService(state, action: { payload: Service }) {
      state.selectedServices.push(action.payload);
    },
    resetSeletedServices(state) {
      state.selectedServices = [];
    },
    setLocation(state, action) {
      state.location = action.payload;
    },
  },
});

export const {
  setPostcode,
  setCurrentService,
  setServiceTypeId,
  addSelectedService,
  setLocation,
  resetSeletedServices,
} = navigation.actions;

export default navigation.reducer;
