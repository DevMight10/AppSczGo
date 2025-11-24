// components/ButtonComponent.tsx
import { Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors } from '@/const/color';
import { useRouter } from 'expo-router';
import React from "react";

interface Props {
  label: string;
  route?: string;          // ahora es opcional
  onPress?: () => void;    // nuevo: permite lógica personalizada
}

export default function ButtonComponent({ label, route, onPress }: Props) {
  const router = useRouter();

  const handlePress = () => {
    if (onPress) {
      onPress(); // ejecuta lógica externa
    } else if (route) {
      router.push(route as any); // navegación por defecto
    }
  };

  return (
    <TouchableOpacity style={stl.div} onPress={handlePress}>
      <Text style={stl.text}>{label}</Text>
    </TouchableOpacity>
  );
}

const stl = StyleSheet.create({
  div: {
    backgroundColor: colors.verdeOscuro,
    paddingVertical: 15,
    borderRadius: 10,
  },
  text: {
    color: colors.blanco,
    textAlign: 'center',
    fontFamily: 'InterBold',
    fontSize: 16,
  },
});
