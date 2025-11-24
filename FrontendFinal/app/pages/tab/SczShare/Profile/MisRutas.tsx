// app/pages/tab/Profile/MisRutas.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, ActivityIndicator, TouchableOpacity, Alert, Modal } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import * as rutasAPI from '@/api/rutas';
import { colors } from '@/const/color';
import CardButton from '@/app/components/CardButton';
import { SwipeListView } from 'react-native-swipe-list-view';
import RutaCard from '@/app/components/rutaCard';
import Toast from 'react-native-toast-message';




interface Checkin {
  puntoId: string;
  llegada?: string;
}

interface Ruta {
  _id: string;
  nombreRuta: string;
  duracionEstimada: number;
  preferencias: string[];
  inicio?: string;
  fin?: string;
  completada: boolean;
  checkins: Checkin[];
}

export default function MisRutas() {
  const [rutas, setRutas] = useState<Ruta[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const [modalVisible, setModalVisible] = useState(false);  // Estado para mostrar el modal
  const [rutaSeleccionada, setRutaSeleccionada] = useState<Ruta | null>(null);  // Estado para almacenar la ruta seleccionada


  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await rutasAPI.listarRutas();
        setRutas(data);
      } catch (err: any) {
        console.error('Error cargando rutas', err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);


  const getEstadoRuta = (ruta: Ruta) => {
    if (ruta.completada) return { color: '#2E7D32', texto: 'Finalizada' };
    if (ruta.inicio && !ruta.fin) return { color: '#F9A825', texto: 'En progreso' };
    return { color: '#C62828', texto: 'No iniciada' };
  };

  const eliminarTodasRutas = async () => {
  try {
    await rutasAPI.eliminarTodasLasRutas(); // Llamamos a la API para eliminar todas las rutas
    const nuevasRutas = await rutasAPI.listarRutas(); // Actualizamos la lista de rutas
    setRutas(nuevasRutas); // Actualizamos el estado con las nuevas rutas
    Toast.show({
      type: 'info',
      text1: 'Todas las rutas han sido eliminadas.',
      position: 'top',
      visibilityTime: 3000,
    });
  } catch (e) {
    console.error('Error eliminando rutas', e);
    Alert.alert('Error', 'No se pudo eliminar las rutas.');
  }
};


function formatearFecha(fechaStr?: string) {
  if (!fechaStr) return 'No disponible';
  const fecha = new Date(fechaStr);
  if (isNaN(fecha.getTime())) return 'No disponible';
  const horas = fecha.getHours().toString().padStart(2, '0');
  const minutos = fecha.getMinutes().toString().padStart(2, '0');
  const dia = fecha.getDate().toString().padStart(2, '0');
  const mes = (fecha.getMonth() + 1).toString().padStart(2, '0');
  const anio = fecha.getFullYear();
  return `${horas}:${minutos} hrs , ${dia}-${mes}-${anio}`;
}


  return (
    <View style={{ flex: 1, padding: 20 }}>
      <CardButton text="Mis Rutas" onPress={() => router.back()} />
          <View style={styles.eliminarTodasButtonContainer}>
        <TouchableOpacity
          style={styles.eliminarTodasButton}
          onPress={eliminarTodasRutas}
        >
          <Text style={styles.botonTexto}>Eliminar todas las rutas</Text>
        </TouchableOpacity>
      </View>
      {loading ? (
        <ActivityIndicator size="large" color={colors.verdeOscuro} />
      ) : (
<SwipeListView
  data={rutas}
  keyExtractor={(item) => item._id}
  renderItem={({ item, index }) => (
    <TouchableOpacity
      onPress={() => {
        setRutaSeleccionada(item);  // Establece la ruta seleccionada
        setModalVisible(true);  // Muestra el modal
      }}
    >
      <RutaCard ruta={item} index={index} />
    </TouchableOpacity>
  )}
  renderHiddenItem={({ item }) => (
    <TouchableOpacity
      style={styles.hiddenFullDelete}
      onPress={() => {
        Alert.alert(
          '¿Eliminar ruta?',
          'Esta acción no se puede deshacer.',
          [
            { text: 'Cancelar', style: 'cancel' },
            {
              text: 'Eliminar',
              style: 'destructive',
              onPress: async () => {
                try {
                  await rutasAPI.eliminarRuta(item._id);
                  const nuevasRutas = await rutasAPI.listarRutas();
                  setRutas(nuevasRutas);
                  Toast.show({
                    type: 'info',
                    text1: 'Ruta eliminada con éxito',
                    position: 'top',
                    visibilityTime: 3000,
                  });
                } catch (e) {
                  console.error('Error eliminando ruta', e);
                  Alert.alert('Error', 'No se pudo eliminar la ruta.');
                }
              }
            }
          ]
        );
      }}
    >
      <Text style={styles.textoEliminar}>Eliminar</Text>
    </TouchableOpacity>
  )}
  rightOpenValue={-120}
/>


      )}

      {modalVisible && rutaSeleccionada && (
  <Modal transparent visible={modalVisible} animationType="slide">
    <View style={styles.modalOverlay}>
      <View style={styles.modalContent}>
        <Text style={styles.modalTitle}>Detalles de la Ruta</Text>

        {/* Información de la ruta */}

        <Text style={styles.modalLabel}>Duración Estimada:</Text>
        <Text style={styles.modalText}>
          {rutaSeleccionada.duracionEstimada} minutos
        </Text>

        <Text style={styles.modalLabel}>Estado:</Text>
        <Text style={styles.modalText}>
          {rutaSeleccionada.completada ? 'Finalizada' : 'En progreso'}
        </Text>

        <Text style={styles.modalLabel}>Fecha de Inicio:</Text>
        <Text style={styles.modalText}>{formatearFecha(rutaSeleccionada.inicio)}</Text>
        <Text style={styles.modalLabel}>Fecha de Finalización:</Text>
        <Text style={styles.modalText}>{formatearFecha(rutaSeleccionada.fin)}</Text>
        {/* Mostrar los puntos de la ruta */}
        <Text style={styles.modalLabel}>Puntos Visitados:</Text>
        {rutaSeleccionada.checkins.length > 0 ? (
          rutaSeleccionada.checkins.map((checkin, index) => (
            <Text key={index} style={styles.modalText}>
              - {checkin.puntoId} (Llegada: {checkin.llegada?.toString()})
            </Text>
          ))
        ) : (
          <Text style={styles.modalText}>No has visitado ningún punto en esta ruta.</Text>
        )}

        <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.modalCloseButton}>
          <Text style={styles.modalCloseButtonText}>Cerrar</Text>
        </TouchableOpacity>
      </View>
    </View>
  </Modal>
)}

    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  card: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  nombre: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  estado: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  pref: {
    fontSize: 14,
    color: '#444',
  },
  fecha: {
    fontSize: 13,
    color: '#666',
    marginTop: 4,
  },
  hiddenRow: {
  alignItems: 'center',
  backgroundColor: '#fff',
  flex: 1,
  flexDirection: 'row',
  justifyContent: 'flex-end',
  paddingRight: 16,
  marginBottom: 16,
  borderRadius: 12,
  elevation: 2,
},
deleteButton: {
  backgroundColor: '#C62828',
  borderRadius: 8,
  paddingVertical: 10,
  paddingHorizontal: 16,
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  width: 100,
},
hiddenFullDelete: {
  flex: 1,
  justifyContent: 'center',
  alignItems: 'flex-end',
  backgroundColor: '#C62828',
  paddingRight: 20,
  borderRadius: 12,
  marginBottom: 16,
},
textoEliminar: {
  color: '#fff',
  fontWeight: 'bold',
  fontSize: 16,
},
  eliminarTodasButtonContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  eliminarTodasButton: {
    backgroundColor: '#C62828',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignItems: 'center',
    bottom: 20,
  },
  botonTexto: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },



    modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    maxHeight: '80%',
    overflow: 'scroll',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  modalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 8,
  },
  modalText: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  modalCloseButton: {
    marginTop: 20,
    backgroundColor: '#2E7D32',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  modalCloseButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
