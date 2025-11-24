import React from 'react';
import { View, Text, StyleSheet, Modal, Image, TouchableOpacity } from 'react-native';
import { useMonumentoStore } from '../../store/useMonumentoStore';
import { obtenerIconoPorCategoria } from '../../utils/iconosPorCategoria';
import { useRouter } from 'expo-router';
import BotonVisitar from './BotonVisitar';
import { useGuidedTourStore } from '@/store/useGuidedTourStore';

export default function ModalMonumento() {
  const { tourStarted } = useGuidedTourStore();

  const {
    modalVisible,
    monumentoSeleccionado,
    setModalVisible,
    setMonumentoSeleccionado,
  } = useMonumentoStore();

  const router = useRouter();

  if (!monumentoSeleccionado) return null;

  const descripcionCorta = monumentoSeleccionado.descripcion
    ? monumentoSeleccionado.descripcion.length > 100
      ? monumentoSeleccionado.descripcion.slice(0, 100) + '...'
      : monumentoSeleccionado.descripcion
    : 'Descripción no disponible.';

  const distanciaFormateada =
    monumentoSeleccionado.distancia !== undefined
      ? `A ${Math.round(monumentoSeleccionado.distancia)} M`
      : 'Distancia no disponible';

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => {
        setModalVisible(false);
        setMonumentoSeleccionado(null);
      }}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <View style={styles.header}>
            <Image
              source={obtenerIconoPorCategoria(monumentoSeleccionado.categoria)}
              style={styles.icon}
            />
            <View style={styles.infoHeader}>
              <Text style={styles.nombre}>{monumentoSeleccionado.nombre}</Text>
              <Text style={styles.categoria}>{monumentoSeleccionado.categoria}</Text>
              <Text style={styles.distancia}>{distanciaFormateada}</Text>
            </View>
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Text style={styles.cerrar}>✕</Text>
            </TouchableOpacity>
          </View>

          <Image
            source={{ uri: monumentoSeleccionado.imagenes?.[0] ?? 'https://via.placeholder.com/300' }}
            style={styles.imagen}
          />

          <Text style={styles.descripcion}>{descripcionCorta}</Text>


            <View style={styles.botonesContainer}>
              {!tourStarted && (
                <View style={{ flex: 1 }}>
                  <BotonVisitar monumento={monumentoSeleccionado} />
                </View>
              )}

              <TouchableOpacity
                style={styles.botonBlanco}
                onPress={() => {
                  setModalVisible(false);
                  router.push({
                    pathname: '/pages/monumento/[id]',
                    params: { id: monumentoSeleccionado._id },
                  });
                }}
              >
                <Text style={styles.textoBotonVerde}>Conocer más</Text>
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
  },
  modalContainer: {
    width: '85%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    gap: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  icon: {
    width: 40,
    height: 40,
  },
  infoHeader: {
    flex: 1,
  },
  nombre: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#000',
  },
  categoria: {
    fontSize: 14,
    color: '#4CAF50',
  },
  distancia: {
    fontSize: 13,
    color: '#888',
  },
  cerrar: {
    fontSize: 20,
    color: '#888',
  },
  imagen: {
    width: '100%',
    height: 160,
    borderRadius: 10,
  },
  descripcion: {
    fontSize: 13,
    color: '#444',
  },
  botonesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  botonBlanco: {
    flex: 1,
    backgroundColor: '#fff',
    borderColor: '#4CAF50',
    borderWidth: 1.5,
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  textoBotonVerde: {
    color: '#4CAF50',
    fontWeight: 'bold',
  },
});
