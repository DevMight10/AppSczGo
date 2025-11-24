import axios from 'axios';

const GOOGLE_MAPS_API_KEY = 'AIzaSyCpjgdzAgwoeJOVFVlThL6tW3A8c_urJH8';

export const obtenerRuta = async (
  origen: { lat: number; lng: number },
  destino: { lat: number; lng: number }
) => {
  try {
    const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${origen.lat},${origen.lng}&destination=${destino.lat},${destino.lng}&mode=walking&key=${GOOGLE_MAPS_API_KEY}`;

    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error('❌ Error al obtener la ruta:', error);
    throw error;
  }
};
