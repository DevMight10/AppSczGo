import React, { useState } from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import InfoModalComponent from '../components/infoModalComponent';
import { colors } from '@/const/color';

interface Props {
  titulo: string;
  descripcion: string;
}

export default function InfoIcon({ titulo, descripcion }: Props) {
  const [visible, setVisible] = useState(false);

  return (
    <>
      <TouchableOpacity onPress={() => setVisible(true)} style={styles.icono}>
        <Ionicons name="help-circle-outline" size={24} color={colors.verdeClaro} />
      </TouchableOpacity>
      <InfoModalComponent
        visible={visible}
        titulo={titulo}
        descripcion={descripcion}
        onClose={() => setVisible(false)}
      />
    </>
  );
}

const styles = StyleSheet.create({
  icono: {
    padding: 4,
    marginLeft: 6,
  },
});
