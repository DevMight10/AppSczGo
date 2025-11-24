// components/NotificacionMonumento.tsx
import React from 'react';
import { View, Text, Modal, StyleSheet, TouchableOpacity } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

interface Props {
  visible: boolean;
  onClose: () => void;
}

export default function NotificacionMonumento({ visible, onClose }: Props) {
  const router = useRouter();

  const irATuristaLibre = () => {
    onClose();
    router.push('/pages/tab/FreeTour');
  };

  return (
    <Modal animationType="fade" transparent visible={visible}>
      <View style={styles.overlay}>
        <View style={styles.container}>
          <FontAwesome5 name="bell" size={36} color="#4CAF50" />
          <Text style={styles.titulo}>¡Estás cerca de un lugar turístico!</Text>
          <Text style={styles.subtitulo}>¿Deseas ver los detalles ahora?</Text>

          <View style={styles.botonesRow}>
            <TouchableOpacity style={styles.botonAceptar} onPress={irATuristaLibre}>
              <Text style={styles.textoAceptar}>Ir a Turista Libre</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.botonCerrar} onPress={onClose}>
              <Text style={styles.textoCerrar}>✕</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
  },
  container: {
    width: '80%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    gap: 10,
    elevation: 10,
  },
  titulo: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  subtitulo: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  botonesRow: {
    flexDirection: 'row',
    marginTop: 15,
    gap: 10,
  },
  botonAceptar: {
    backgroundColor: '#4CAF50',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  textoAceptar: {
    color: '#fff',
    fontWeight: 'bold',
  },
  botonCerrar: {
    padding: 10,
  },
  textoCerrar: {
    fontSize: 22,
    color: '#888',
  },
});
