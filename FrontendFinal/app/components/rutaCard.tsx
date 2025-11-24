import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface Props {
  ruta: {
    _id: string;
    nombreRuta: string;
    duracionEstimada: number;
    preferencias: string[];
    inicio?: string;
    fin?: string;
    completada: boolean;
  };
  index: number;
}

const getEstadoRuta = (ruta: Props['ruta']) => {
  if (ruta.completada) return { color: '#2E7D32', texto: 'Finalizada' };
  if (ruta.inicio && !ruta.fin) return { color: '#F9A825', texto: 'En progreso' };
  return { color: '#C62828', texto: 'No iniciada' };
};

export default function RutaCard({ ruta, index }: Props) {
  const estado = getEstadoRuta(ruta);

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <Text style={styles.nombre}>Ruta {index + 1}</Text>
        <Text style={[styles.estado, { color: estado.color }]}>{estado.texto}</Text>
      </View>
      <Text style={styles.pref}>⏱️ {ruta.duracionEstimada} min</Text>
      <Text style={styles.pref}>🎯 Preferencias: {ruta.preferencias.join(', ')}</Text>
      {ruta.inicio && (
        <Text style={styles.fecha}>
          🕒 Inicio: {new Date(ruta.inicio).toLocaleString()}
        </Text>
      )}
      {ruta.fin && (
        <Text style={styles.fecha}>
          ✅ Fin: {new Date(ruta.fin).toLocaleString()}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  nombre: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  estado: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  pref: {
    fontSize: 14,
    color: '#444',
  },
  fecha: {
    fontSize: 13,
    color: '#666',
    marginTop: 4,
  },
});
