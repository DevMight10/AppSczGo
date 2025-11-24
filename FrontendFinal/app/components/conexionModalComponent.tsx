import React from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface Props {
  visible: boolean;
  modo: 'Turista Libre' | 'Historia' | 'Turista Guiado' | 'Inicio sesion' | 'Registro' | 'Index ';
  onRetry: () => void;
}

export default function ConexionModalComponent({ visible, modo, onRetry }: Props) {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <Ionicons name="wifi" size={50} color="#cc0000" />
          <Text style={styles.titulo}>Sin conexión</Text>
          <Text style={styles.descripcion}>
            No pudimos cargar los datos para el modo <Text style={styles.modo}>{modo}</Text>. Asegurate de estar conectada a internet o dentro de la misma red e intenta nuevamente.
          </Text>
          <TouchableOpacity onPress={onRetry} style={styles.boton}>
            <Text style={styles.textoBoton}>Reintentar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    backgroundColor: '#fff',
    padding: 25,
    borderRadius: 15,
    marginHorizontal: 25,
    alignItems: 'center',
  },
  titulo: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#cc0000',
    marginVertical: 10,
  },
  descripcion: {
    fontSize: 16,
    textAlign: 'center',
    color: '#333',
    marginBottom: 20,
  },
  modo: {
    fontWeight: 'bold',
    color: '#367C28',
  },
  boton: {
    backgroundColor: '#367C28',
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 8,
  },
  textoBoton: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
