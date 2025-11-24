// app/store/usePermissionsStore.ts
import { create } from 'zustand';

interface PermissionsState {
  cameraGranted: boolean;
  locationGranted: boolean;
  mediaGranted: boolean;
  setCameraGranted: (value: boolean) => void;
  setLocationGranted: (value: boolean) => void;
  setMediaGranted: (value: boolean) => void;
}

export const usePermissionsStore = create<PermissionsState>((set) => ({
  cameraGranted: false,
  locationGranted: false,
  mediaGranted: false,
  setCameraGranted: (value) => set({ cameraGranted: value }),
  setLocationGranted: (value) => set({ locationGranted: value }),
  setMediaGranted: (value) => set({ mediaGranted: value }),
}));
