import { create } from 'zustand';
import { Monumento } from '../types/Monumento';
import * as Location from 'expo-location';

interface Coordenada {
  latitude: number;
  longitude: number;
}

const TODAS_LAS_CATEGORIAS = [
  'Académicos',
  'Gastronómicos',
  'Monumentos',
  'Religiosos',
  'Históricos',
  'Plaza y Parques',
  'Turísticos',
];

interface MonumentoStore {
  monumentoSeleccionado: Monumento | null;
  modalVisible: boolean;
  categoriasSeleccionadas: string[];
  ruta: Coordenada[];
  distancia: string | null;
  duracion: string | null;
  mostrarRutaActiva: boolean;
  monumentos: Monumento[];
  ubicacionActual: Location.LocationObject | null; 

  setMonumentoSeleccionado: (monumento: Monumento | null) => void;
  setModalVisible: (visible: boolean) => void;

  toggleCategoria: (categoria: string) => void;
  resetCategorias: () => void;
  seleccionarTodasLasCategorias: () => void;

  setRuta: (coords: Coordenada[]) => void;
  resetRuta: () => void;
  setDistancia: (valor: string) => void;
  setDuracion: (valor: string) => void;

  setMostrarRutaActiva: (estado: boolean) => void;
  resetRutaActiva: () => void;

  setMonumentos: (lista: Monumento[]) => void;
  setUbicacionActual: (ubicacion: Location.LocationObject) => void;
}

export const useMonumentoStore = create<MonumentoStore>((set, get) => ({
  monumentoSeleccionado: null,
  modalVisible: false,
  categoriasSeleccionadas: [],
  ruta: [],
  distancia: null,
  duracion: null,
  mostrarRutaActiva: false,
  monumentos: [],
  ubicacionActual: null,
  

  setMonumentoSeleccionado: (monumento) => set({ monumentoSeleccionado: monumento }),
  setModalVisible: (visible) => set({ modalVisible: visible }),

  toggleCategoria: (categoria) => {
    const actuales = get().categoriasSeleccionadas;
    const existe = actuales.includes(categoria);
    set({
      categoriasSeleccionadas: existe
        ? actuales.filter((c) => c !== categoria)
        : [...actuales, categoria],
    });
  },

  resetCategorias: () => set({ categoriasSeleccionadas: [] }),

  seleccionarTodasLasCategorias: () => set({ categoriasSeleccionadas: [...TODAS_LAS_CATEGORIAS] }),

  setRuta: (coords) => set({ ruta: coords }),
  resetRuta: () => set({ ruta: [], distancia: null, duracion: null }),

  setDistancia: (valor) => set({ distancia: valor }),
  setDuracion: (valor) => set({ duracion: valor }),

  setMostrarRutaActiva: (estado) => set({ mostrarRutaActiva: estado }),

  resetRutaActiva: () =>
    set({
      ruta: [],
      distancia: null,
      duracion: null,
      mostrarRutaActiva: false,
      monumentoSeleccionado: null,
    }),

  setMonumentos: (lista) => set({ monumentos: lista }),
  setUbicacionActual: (ubicacion) => set({ ubicacionActual: ubicacion }),
}));
