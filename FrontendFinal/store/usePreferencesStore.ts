// app/store/usePreferencesStore.ts
import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../api/axios';

interface PreferencesState {
  preferencias: string[];
  cargarPreferencias: () => Promise<void>;
  actualizarPreferencias: (nuevas: string[]) => Promise<void>;
  setPreferencias: (nuevas: string[]) => void;
}

export const usePreferencesStore = create<PreferencesState>((set) => ({
  preferencias: [],

  cargarPreferencias: async () => {
    const token = await AsyncStorage.getItem('token');
    if (!token) return;

    const res = await api.get('/usuarios/perfil', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    set({ preferencias: res.data.intereses });
  },

actualizarPreferencias: async (nuevas) => {
  const token = await AsyncStorage.getItem('token');
  if (!token) {
    console.warn('Token no encontrado. Usuario no autenticado.');
    return;
  }

  try {
    const res = await api.put(
      '/usuarios/preferencias',
      { intereses: nuevas },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    set({ preferencias: nuevas });
  } catch (error: any) {
    console.error("❌ Error al actualizar preferencias:", error.response?.data || error.message);
    throw error; // lo relanzamos por si quieres capturarlo en la pantalla
  }
},


  setPreferencias: (nuevas) => set({ preferencias: nuevas }),
}));
