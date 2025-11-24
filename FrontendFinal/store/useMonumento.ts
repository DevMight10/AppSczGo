import { create } from 'zustand';
import api from '@/api/axios';
import type { Monumento } from '@/types/Monumento';

interface MonumentStore {
  monumentos: Monumento[];
  cargarMonumentos: () => Promise<void>;
}

export const useMonumentStore = create<MonumentStore>((set) => ({
  monumentos: [],
  cargarMonumentos: async () => {
    try {
      const resp = await api.get<Monumento[]>('/monumentos');
      set({ monumentos: resp.data });
    } catch (err) {
      console.error('Error cargando monumentos:', err);
    }
  },
}));
