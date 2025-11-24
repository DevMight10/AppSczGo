import { Text, StyleSheet, TouchableOpacity, View } from 'react-native';
import { colors } from '@/const/color';
import { Feather } from '@expo/vector-icons';
import React from 'react';

interface Props {
  text: string;
  onPress?: () => void;
}

export default function CardButton({ text, onPress }: Props) {
  return (
    <TouchableOpacity onPress={onPress} style={styles.card}>
      <View style={styles.content}>
        <Feather name="chevron-left" size={20} color={colors.verdeOscuro} />
        <Text style={styles.text}>{text}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    
    backgroundColor: colors.blanco,
    paddingVertical: 14,            // más alto
    paddingHorizontal: 24,          // más ancho visualmente
    borderRadius: 12,
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
    marginBottom: 25,
    width: '100%',                  // ocupa el ancho disponible con margen
    alignItems: 'flex-start', 
    },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  text: {
    fontSize: 20,
    fontFamily: 'InterBold',
    color: colors.textoPrincipal,
    marginLeft: 8,
  },
});
