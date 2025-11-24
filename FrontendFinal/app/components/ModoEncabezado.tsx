import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';

interface ModoEncabezadoProps {
  icono: any;
  titulo: string;
  infoIcon?: React.ReactNode;
  onPress?: () => void; // nueva prop opcional
}

const ModoEncabezado: React.FC<ModoEncabezadoProps> = ({ icono, titulo, infoIcon, onPress }) => {
  return (
    <TouchableOpacity style={styles.banner} onPress={onPress} activeOpacity={0.85}>
      <Image source={icono} style={styles.icono} />
      <View style={styles.textos}>
        <Text style={styles.modo}>Modo</Text>
        <View style={styles.tituloRow}>
          <Text style={styles.titulo}>{titulo}</Text>
          {infoIcon && <View style={styles.info}>{infoIcon}</View>}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  banner: {
    width: 343,
    flex: 1,
    height: 65,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    marginTop: -5,
    marginLeft: 13,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: 'green',
  },
  icono: {
    width: 55,
    height: 55,
    marginLeft: 11,
    marginTop: 4,
    resizeMode: 'contain',
  },
  textos: {
    flex: 1,
    marginLeft: 8,
    marginTop: 4,
  },
  modo: {
    fontFamily: 'Inter-Bold',
    fontWeight: 'bold',
    fontSize: 13,
    lineHeight: 11,
    letterSpacing: -0.02 * 11,
    color: '#000000',
    marginLeft: 0,
  },
  titulo: {
    fontFamily: 'Inter-Bold',
    fontWeight: 'bold',
    fontSize: 19,
    lineHeight: 25,
    letterSpacing: -0.02 * 18,
    color: '#367C28',
  },
  tituloRow: {
    fontFamily: 'Inter-Bold',
    fontWeight: 'bold',
    fontSize: 17,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  info: {
    marginLeft: 8,
  },
});

export default ModoEncabezado;
