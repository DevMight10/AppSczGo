import React from 'react';
import { View, StyleSheet, Text } from 'react-native';

interface Props {
  fecha: string;
}

export default function Timeline({ fecha }: Props) {
  // 🧠 Extraer solo el año si fecha es válida
  const anio = typeof fecha === 'string' && fecha.includes('-')
    ? fecha.split('-')[0]
    : '¿?';
  return (
    <View style={styles.wrapper}>
      {/* Línea vertical completa */}
      <View style={styles.verticalLine} />

      {/* Círculo centrado con texto */}
      <View style={styles.circle}>
        <Text style={styles.fechaTexto}>{anio}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: '100%', // Se ajusta al contenedor del 25% de la tarjeta
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  verticalLine: {
    position: 'absolute',
    width: 6,               /* Grosor de la linea */
    top: -90,
    bottom: -120,
    backgroundColor: '#2e7d32',
    zIndex: 0,
  },
  circle: {
    width: 40,      /* Modificar el tamaño del circulo-Ancho*/
    height: 40,         /* Modificar el tamaño del circulo-Altura */
    borderRadius: 20,   /* Borde de la figura -- Mitad del ancho/altura */
    backgroundColor: '#2e7d32',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  fechaTexto: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
});
