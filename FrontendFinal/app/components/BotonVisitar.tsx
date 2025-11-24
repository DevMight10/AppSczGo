import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Monumento } from '../../types/Monumento';
import { useMonumentoStore } from '../../store/useMonumentoStore';
import * as Location from 'expo-location';
import { useRouter } from 'expo-router';

const GOOGLE_API_KEY = 'AIzaSyCpjgdzAgwoeJOVFVlThL6tW3A8c_urJH8';

interface Props {
  monumento: Monumento;
}

export default function BotonVisitar({ monumento }: Props) {
  const router = useRouter();
  const {
    setModalVisible,
    setRuta,
    setDistancia,
    setDuracion,
    setMostrarRutaActiva,
  } = useMonumentoStore();

  const decodePolyline = (encoded: string): { latitude: number; longitude: number }[] => {
    const points = [];
    let index = 0, lat = 0, lng = 0;

    while (index < encoded.length) {
      let b, shift = 0, result = 0;
      do {
        b = encoded.charCodeAt(index++) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);
      const dlat = (result & 1) ? ~(result >> 1) : result >> 1;
      lat += dlat;

      shift = 0;
      result = 0;
      do {
        b = encoded.charCodeAt(index++) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);
      const dlng = (result & 1) ? ~(result >> 1) : result >> 1;
      lng += dlng;

      points.push({ latitude: lat / 1e5, longitude: lng / 1e5 });
    }

    return points;
  };

  const manejarVisitar = async () => {
    try {
      const ubicacion = await Location.getCurrentPositionAsync({});
      const origen = `${ubicacion.coords.latitude},${ubicacion.coords.longitude}`;
      const destino = `${monumento.coordenadas.latitud},${monumento.coordenadas.longitud}`;

      const res = await fetch(
        `https://maps.googleapis.com/maps/api/directions/json?origin=${origen}&destination=${destino}&mode=walking&key=${GOOGLE_API_KEY}`
      );
      const data = await res.json();

      if (data.routes.length > 0) {
        const route = data.routes[0];
        const puntos = decodePolyline(route.overview_polyline.points);
        const duracion = route.legs[0].duration.text;
        const distancia = route.legs[0].distance.text;

        setRuta(puntos);
        setDuracion(duracion);
        setDistancia(distancia);
        setModalVisible(false);
        setTimeout(() => {
          setMostrarRutaActiva(true);
          router.push('/pages/tab/FreeTour');
        }, 100); // pequeño delay para evitar bug en el primer render
        setModalVisible(false);
      } else {
        console.warn('No se encontró una ruta.');
      }

      // setModalVisible(false);
      // router.push('/pages/tab/FreeTour');
    } catch (error) {
      console.error('Error al generar ruta:', error);
    }
  };

  return (
    <TouchableOpacity style={styles.boton} onPress={manejarVisitar}>
      <Text style={styles.texto}>Visitar</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  boton: {
    backgroundColor: 'green',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  texto: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
