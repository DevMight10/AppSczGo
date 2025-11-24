import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { colors } from '@/const/color';

export default function EventoMitoCard({ titulo, descripcion, imagen, onPress }: any) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <Text style={styles.titulo}>{titulo}</Text>
      <Text style={styles.descripcion}>{descripcion.slice(0, 100)}...</Text>
      <Image source={imagen} style={styles.imagen} />
      <View style={styles.boton}>
        <Text style={styles.textoBoton}>Ver más</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff7ec',
    borderWidth: 2,
    borderColor: colors.verdeOscuro,
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  titulo: {
    fontWeight: 'bold',
    fontSize: 18,
    color: colors.verdeOscuro,
    marginBottom: 6,
  },
  descripcion: {
    color: '#444',
    fontSize: 14,
    marginBottom: 10,
  },
  imagen: {
    width: '100%',
    height: 150,
    borderRadius: 8,
    marginBottom: 10,
  },
  boton: {
    alignSelf: 'flex-end',
    borderWidth: 1,
    borderColor: colors.verdeOscuro,
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  textoBoton: {
    color: colors.verdeOscuro,
    fontWeight: 'bold',
  },
});
