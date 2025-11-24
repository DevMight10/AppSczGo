// app/store/useProfileStore.ts
// ...

import api from "@/api/axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";

interface ProfileState {
  nombre: string;
  correo: string;
  fotoPerfil: string;
  cargarPerfil: () => Promise<void>;
  actualizarPerfil: (data: { nombre: string; correo: string; fotoPerfil?: string }) => Promise<void>;
  setAvatar: (uri: string) => void;
  resetPerfil: () => void; // 👈 NUEVA función
}

export const useProfileStore = create<ProfileState>((set) => ({
  nombre: '',
  correo: '',
  fotoPerfil: '',

  cargarPerfil: async () => {
    const token = await AsyncStorage.getItem('token');
    if (!token) return;

    const res = await api.get('/usuarios/perfil', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    set({
      nombre: res.data.nombre,
      correo: res.data.correo,
      fotoPerfil: res.data.fotoPerfil,
    });
  },

  actualizarPerfil: async ({ nombre, correo, fotoPerfil }) => {
    const token = await AsyncStorage.getItem('token');
    if (!token) {
      console.warn('Token no disponible');
      throw new Error('Token no disponible');
    }

    try {
      const res = await api.put(
        '/usuarios/perfil',
        { nombre, correo, fotoPerfil },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      set({
        nombre: res.data.nombre,
        correo: res.data.correo,
        fotoPerfil: res.data.fotoPerfil || '',
      });

      return res.data;
    } catch (error: any) {
      console.error("❌ Error al actualizar perfil:", error.response?.data || error.message);
      throw error;
    }
  },

  setAvatar: (uri: string) => {
    set({ fotoPerfil: uri });
  },

  resetPerfil: () => {
    set({
      nombre: '',
      correo: '',
      fotoPerfil: '',
    });
  }
}));
