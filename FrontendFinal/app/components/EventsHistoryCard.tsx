import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { colors } from '@/const/color';
import TimeLine from '@/app/components/TimeLine';
import { useRouter } from 'expo-router';

interface Props {
  titulo: string;
  descripcion: string;
  imagen: any;
  onPress: () => void;
  categoria: string;
  fechaEvento?: string; 
}

export default function EventoHistoriaCard({
  titulo,
  descripcion,
  imagen,
  onPress,
  categoria,
  fechaEvento,
}: Props) {
  const router = useRouter();

  return (
    <View style={styles.marginContainer}>
      <View style={styles.borderedContainer}>
        <View style={styles.contentRow}>
          <View style={styles.leftSpacer}>
            {categoria === 'histórico' && fechaEvento && (
              <TimeLine fecha={fechaEvento} /> // 🆕 se pasa la fecha completa y TimeLine extrae el año
            )}
          </View>

          <View style={styles.centerContent}>
            <Text style={styles.title}>{titulo}</Text>
            <Text style={styles.description} numberOfLines={5} ellipsizeMode="tail">
              {descripcion}
            </Text>
          </View>

          <View style={styles.rightContent}>
            <Image source={imagen} style={styles.image} resizeMode="cover" />
            <TouchableOpacity style={styles.button} onPress={onPress}>
              <Text style={styles.buttonText}>Ver más</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  marginContainer: {
    marginBottom: 20,
  },
  borderedContainer: {
    borderWidth: 2,
    borderColor: colors.verdeClaro,
    borderRadius: 10,
    padding: 10,
    backgroundColor: '#fff',
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  leftSpacer: {
    width: '25%',
  },
  centerContent: {
    width: '50%',
    paddingHorizontal: 5,
  },
  rightContent: {
    width: '25%',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontFamily: 'InterBold',
    fontSize: 18,
    marginBottom: 4,
  },
  description: {
    fontFamily: 'Inter',
    fontSize: 14,
    color: colors.textoSecundario,
  },
  image: {
    width: 70,
    height: 70,
    borderRadius: 8,
    marginBottom: 6,
  },
  button: {
    borderWidth: 1,
    borderColor: colors.verdeOscuro,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  buttonText: {
    fontFamily: 'InterBold',
    fontSize: 14,
    color: colors.verdeOscuro,
  },
});
