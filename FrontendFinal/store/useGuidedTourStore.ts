

// app/store/useGuidedTourStore.ts
import { create } from 'zustand'
import api from '../api/axios'
import * as rutasAPI from '@/api/rutas'
import type { Monumento } from '../types/Monumento'



/** Un punto de la ruta, con tiempos estimados a pie y en auto */
export interface PuntoRuta {
  monumento: string    // _id del monumento
  orden: number
  tiempoEstimadoPie: number    // en minutos
  tiempoEstimadoAuto: number   // en minutos
}

export interface RutaActual {
  _id: string
  puntos: PuntoRuta[]
  duracionEstimadaPie: number
  duracionEstimadaAuto: number
  preferencias: string[]
  inicio: string
  fin?: string
  completada: boolean
  checkins: { puntoId: string; nombre: string; llegada: string }[] // ← agrega nombre
}

interface GuidedTourState {
  ubicacionInicio: { lat: number; lng: number } | null
  tiempoSeleccionado: number
  interesesSeleccionados: string[]

  rutaActual: RutaActual | null
  indicePuntoActual: number
  /** Nuevo flag que indica si el tour ya fue iniciado */
  tourStarted: boolean

  tiempoPorSitio: number;
  setTiempoPorSitio: (min: number) => void;

  totalDistance: string | null;
  totalDuration: number | null;
  setTotalDistance: (distance: string) => void;
  setTotalDuration: (duration: number) => void;

  setTiempo: (mins: number) => void
  toggleInteres: (cat: string) => void

  generarRuta: (ubicacion: { lat: number; lng: number }) => Promise<void>
  /** Invoca al backend para crear la ruta real y marca el tour como iniciado */
  startTour: () => Promise<void>
  checkinPunto: () => Promise<void>
  completarRuta: () => Promise<void>
  resetTour: () => void
}

export const useGuidedTourStore = create<GuidedTourState>((set, get) => ({
  ubicacionInicio: null,
  tiempoSeleccionado: 30,
  interesesSeleccionados: [],

  rutaActual: null,
  indicePuntoActual: 0,
  tourStarted: false,   //  ⇐ inicializamos en false


  totalDistance: null,
  totalDuration: null,

  tiempoPorSitio: 5, // valor por defecto
  setTiempoPorSitio: (min) => set({ tiempoPorSitio: min }),






  setTiempo: (mins) => set({ tiempoSeleccionado: mins }),
  toggleInteres: (cat) =>
    set((state) => ({
      interesesSeleccionados: state.interesesSeleccionados.includes(cat)
        ? state.interesesSeleccionados.filter((i) => i !== cat)
        : [...state.interesesSeleccionados, cat],
    })),
      // Funciones nuevas para actualizar los estados de distancia y duración
  setTotalDistance: (distance: string) => set({ totalDistance: distance }),
  setTotalDuration: (duration: number) => set({ totalDuration: duration }),

generarRuta: async (ubicacion, modoTransporte = 'caminando') => {
  set({ ubicacionInicio: ubicacion });

  const { tiempoSeleccionado, interesesSeleccionados, tiempoPorSitio } = get();

  const resp = await api.get<Monumento[]>('/monumentos');
  const todos = resp.data;

  const candidatos = todos.filter((m) =>
    interesesSeleccionados.includes(m.categoria)
  );

  if (candidatos.length === 0) {
    throw new Error('No se encontraron sitios con esas categorías');
  }



  const calcularDistancia = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371e3;
    const φ1 = lat1 * (Math.PI / 180);
    const φ2 = lat2 * (Math.PI / 180);
    const Δφ = (lat2 - lat1) * (Math.PI / 180);
    const Δλ = (lon2 - lon1) * (Math.PI / 180);
    const a = Math.sin(Δφ / 2) ** 2 + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const velocidades = { pie: 80, auto: 666 }; // m/min

  const info = candidatos.map((m) => {
    const d = calcularDistancia(
      ubicacion.lat,
      ubicacion.lng,
      m.coordenadas.latitud,
      m.coordenadas.longitud
    );
    return {
      _id: m._id,
      d,
      tiempoPie: Math.ceil(d / velocidades.pie),
      tiempoAuto: Math.ceil(d / velocidades.auto),
    };
  });
  

  info.sort((a, b) => a.d - b.d);

  const puntos: PuntoRuta[] = [];
  let sumPie = 0,
    sumAuto = 0,
    orden = 1;

  let totalDistance = 0; // Variable para acumular la distancia total
  let totalDuration = 0; // Variable para acumular la duración total

  for (const sitio of info) {
    const tiempo = modoTransporte === 'caminando' ? sitio.tiempoPie : sitio.tiempoAuto;
    const sumaActual = modoTransporte === 'caminando' ? sumPie : sumAuto;

    const tiempoTotalConEstadia = sumaActual + tiempo + tiempoPorSitio;
    if (tiempoTotalConEstadia > tiempoSeleccionado) break;

    puntos.push({
      monumento: sitio._id,
      orden: orden++,
      tiempoEstimadoPie: sitio.tiempoPie,
      tiempoEstimadoAuto: sitio.tiempoAuto,
    });

   // Sumar la distancia y la duración total
    totalDistance += sitio.d; // Acumular distancia
    totalDuration += tiempo; // Acumular duración


    sumPie += sitio.tiempoPie + tiempoPorSitio;
    sumAuto += sitio.tiempoAuto + tiempoPorSitio;

  }

  if (puntos.length === 0) {
    throw new Error('No es posible generar una ruta con ese tiempo');
  }
  
    // Convertir totalDistance a kilómetros
  const totalDistanceKm = (totalDistance / 1000).toFixed(2);

  // Actualizar el estado con la distancia total y la duración total
  set({
    totalDistance: totalDistanceKm, // Distancia total en kilómetros
    totalDuration: totalDuration, // Duración total en minutos
  });

  const rutaLocal: RutaActual = {
    _id: Date.now().toString(),
    puntos,
    duracionEstimadaPie: sumPie,
    duracionEstimadaAuto: sumAuto,
    preferencias: interesesSeleccionados,
    inicio: new Date().toISOString(),
    completada: false,
    checkins: [],
  };

  set({ rutaActual: rutaLocal, indicePuntoActual: 0, tourStarted: false });
}
,

  /** Cuando el usuario pulsa “Empezar ruta” */
  /** Cuando el usuario pulsa “Empezar ruta” */
  startTour: async () => {
    const { rutaActual } = get()
    if (!rutaActual) throw new Error('No hay ruta para iniciar')
    // llamamos al backend para crear la ruta real
    const creada = await rutasAPI.generarRuta(
      rutaActual.duracionEstimadaPie,       // tiempo en minutos
      rutaActual.preferencias,             // categorías elegidas
      rutaActual.checkins.length === 0
        ? rutaActual.puntos.length > 0
          ? (() => {
              // el backend espera coordInicio; le pasamos la primera coordenada
              const first = rutaActual.puntos[0].monumento
              // pero en tu caso ya guardas coordenadasInicio en generarRuta, así que omitimos:
              return {} as any
            })()
          : {}
        : {}
    )
    // GitHub issue: rutasAPI.generarRuta ya ignora puntos en el body y usa req.usuario.id
    // el objeto creada incluirá el _id real de la ruta en BD
    set({
      rutaActual: { ...rutaActual, _id: creada._id },
      tourStarted: true,
    })
  },

  // checkinPunto: async () => {
  //   const { rutaActual, indicePuntoActual } = get()
  //   if (!rutaActual) throw new Error('No hay ruta activa')
  //   const puntoId = rutaActual.puntos[indicePuntoActual].monumento

  //   // Solo local
  //   const nuevoCheckin = { puntoId, llegada: new Date().toISOString() }
  //   const rutaLocal = {
  //     ...rutaActual,
  //     checkins: [...rutaActual.checkins, nuevoCheckin],
  //   }
  //   set({
  //     rutaActual: rutaLocal,
  //     indicePuntoActual: indicePuntoActual + 1,
  //   })
  // },
  checkinPunto: async () => {
  const { rutaActual, indicePuntoActual } = get();
  if (!rutaActual) throw new Error('No hay ruta activa');
  const punto = rutaActual.puntos[indicePuntoActual];
  // Busca el nombre del monumento
  const resp = await api.get<Monumento>(`/monumentos/${punto.monumento}`);
  const nombre = resp.data?.nombre || '';
  const nuevoCheckin = { puntoId: punto.monumento, nombre, llegada: new Date().toISOString() };
  const rutaLocal = {
    ...rutaActual,
    checkins: [...rutaActual.checkins, nuevoCheckin],
  };
  set({
    rutaActual: rutaLocal,
    indicePuntoActual: indicePuntoActual + 1,
  });
},

// completarRuta: async () => {
//   const { rutaActual } = get();
//   if (!rutaActual) throw new Error('No hay ruta activa');

//   const rutaLocal = {
//     ...rutaActual,
//     fin: new Date().toISOString(),
//     completada: true,
//   };
//   set({ rutaActual: rutaLocal });

//   // Puedes llamar también al backend aquí si aún no lo haces:
//   await rutasAPI.completarRuta(rutaActual._id);
// }
// ,

completarRuta: async () => {
  const { rutaActual } = get();
  if (!rutaActual) throw new Error('No hay ruta activa');
  // Completada solo si visitó todos los puntos
  const completada = rutaActual.checkins.length === rutaActual.puntos.length;
  const rutaLocal = {
    ...rutaActual,
    fin: new Date().toISOString(),
    completada,
  };
  set({ rutaActual: rutaLocal });
  await rutasAPI.completarRuta(rutaActual._id);
}
,

  resetTour: () =>
    set({
      rutaActual: null,
      indicePuntoActual: 0,
      tourStarted: false,
    }),
}))