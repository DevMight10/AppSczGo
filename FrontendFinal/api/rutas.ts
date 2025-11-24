// app/api/rutas.ts
import api from './axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Punto {
  monumento: string;   // _id de Monumento
  orden: number;
  tiempoEstimado: number;
}

async function getAuthHeaders() {
  const token = await AsyncStorage.getItem('token');
  if (!token) throw new Error('No autorizado: falta token');
  return {
    headers: { Authorization: `Bearer ${token}` },
  };
}

/**
 * 1. Genera una nueva ruta
 */
export async function generarRuta(
  tiempo: number,
  intereses: string[],
  ubicacion: { lat: number; lng: number }
) {
  const opts = await getAuthHeaders();
  const body = {
    duracionEstimada: tiempo,
    preferencias: intereses,
    puntos: [] as Punto[],
    coordenadasInicio: ubicacion,
    // usuarioId lo ignora el backend y usa req.usuario.id
  };
  const resp = await api.post('/rutas', body, opts);
  return resp.data;
}

/**
 * 2. Lista todas las rutas del usuario
 */
export async function listarRutas() {
  const opts = await getAuthHeaders();
  const resp = await api.get('/rutas', opts);
  return resp.data;
}

/**
 * 3. Obtiene una ruta concreta por ID
 */
export async function obtenerRuta(id: string) {
  const opts = await getAuthHeaders();
  const resp = await api.get(`/rutas/${id}`, opts);
  return resp.data;
}

/**
 * 4. Check-in en un punto de la ruta
 */
export async function checkinRuta(rutaId: string, puntoId: string) {
  const opts = await getAuthHeaders();
  const resp = await api.post(`/rutas/${rutaId}/checkin`, { puntoId }, opts);
  return resp.data;
}

/**
 * 5. Marcar la ruta como completada
 */
export async function completarRuta(rutaId: string) {
  const opts = await getAuthHeaders();
  const resp = await api.post(`/rutas/${rutaId}/complete`, {}, opts);
  return resp.data;
}


/**
 * 6. Eliminar una ruta (opcional)
 */
export async function eliminarRuta(rutaId: string) {
  const opts = await getAuthHeaders();
  const resp = await api.delete(`/rutas/${rutaId}`, opts);
  return resp.data;
}

//Eliminar todas las rutas del usuario

export async function eliminarTodasLasRutas() {
  const opts = await getAuthHeaders();
  const resp = await api.delete('/rutas', opts);
  return resp.data;
}

/**
 * 7. Actualizar una ruta (opcional)
 */

