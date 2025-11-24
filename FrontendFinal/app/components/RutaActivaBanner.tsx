import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useMonumentoStore } from '../../store/useMonumentoStore';
import { FontAwesome5 } from '@expo/vector-icons';
import * as Location from 'expo-location'; // ✅ Importación corregida

const GOOGLE_API_KEY = 'AIzaSyCpjgdzAgwoeJOVFVlThL6tW3A8c_urJH8';

export default function RutaActivaBanner() {
  const router = useRouter();
  const {
    monumentoSeleccionado,
    distancia,
    duracion,
    resetRuta
  } = useMonumentoStore();

  const [expandido, setExpandido] = useState(false);
  const [duracionVehiculo, setDuracionVehiculo] = useState<string | null>(null);

  useEffect(() => {
    if (expandido && monumentoSeleccionado) {
      const obtenerDuracionVehiculo = async () => {
        try {
          const location = await Location.getCurrentPositionAsync({});
          const origen = `${location.coords.latitude},${location.coords.longitude}`;
          const destino = `${monumentoSeleccionado.coordenadas.latitud},${monumentoSeleccionado.coordenadas.longitud}`;

          const response = await fetch(
            `https://maps.googleapis.com/maps/api/directions/json?origin=${origen}&destination=${destino}&mode=driving&key=${GOOGLE_API_KEY}`
          );
          const data = await response.json();
          const resultado = data.routes?.[0]?.legs?.[0]?.duration?.text;
          if (resultado) setDuracionVehiculo(formatearDuracion(resultado));
        } catch (error) {
          console.warn('Error al calcular duración vehículo:', error);
        }
      };

      obtenerDuracionVehiculo();
    }
  }, [expandido]);

  if (!monumentoSeleccionado || !distancia || !duracion) return null;

  const formatearDuracion = (texto: string) => {
    return texto
      .replace('hours', 'h')
      .replace('hour', 'h')
      .replace('mins', 'm')
      .replace('min', 'm');
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <View style={styles.infoRuta}>
          <FontAwesome5 name="walking" size={20} color="white" />
          <Text style={styles.texto}>
            {distancia && duracion
              ? `A ${distancia} - ${formatearDuracion(duracion)} hasta el destino`
              : 'Calculando ruta...'}
          </Text>
        </View>

        <TouchableOpacity onPress={() => setExpandido(!expandido)}>
          <Text style={styles.verMas}>{expandido ? 'Ver menos' : 'Ver más'}</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={resetRuta}>
          <Text style={styles.cerrar}>✕</Text>
        </TouchableOpacity>
      </View>

      {expandido && (
        <View style={styles.menuOpciones}>
          <View style={styles.infoRuta}>
            <FontAwesome5 name="car" size={20} color="white" />
            <Text style={styles.texto}>
              {duracionVehiculo ? `${duracionVehiculo} en vehículo aprox.` : 'Calculando...'}
            </Text>
          </View>

          <TouchableOpacity
            style={styles.botonVerde}
            onPress={() => router.push(`/pages/monumento/${monumentoSeleccionado._id}`)}
          >
            <Text style={styles.textoBoton}>Conocer más</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.botonBlanco} onPress={resetRuta}>
            <Text style={styles.textoBotonVerde}>Cancelar recorrido</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 20,
    left: 10,
    right: 10,
    backgroundColor: '#4CAF50',
    padding: 14,
    borderRadius: 12,
    zIndex: 999,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  infoRuta: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 8,
  },
  texto: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  verMas: {
    color: '#fff',
    fontWeight: 'bold',
    paddingHorizontal: 10,
  },
  cerrar: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  menuOpciones: {
    marginTop: 10,
    flexDirection: 'column',
    gap: 10,
  },
  botonVerde: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 10,
    alignItems: 'center',
  },
  textoBoton: {
    color: '#4CAF50',
    fontWeight: 'bold',
  },
  botonBlanco: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 10,
    alignItems: 'center',
  },
  textoBotonVerde: {
    color: '#4CAF50',
    fontWeight: 'bold',
  },
});
