import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, ActivityIndicator, TouchableOpacity, Animated } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import api from '../../../api/axios';
import { Monumento } from '@/types/Monumento';
import { obtenerIconoPorCategoria } from '@/utils/iconosPorCategoria';
import { FontAwesome5, MaterialIcons } from '@expo/vector-icons';
import { stylesGlobal } from '@/const/styles';

export default function MonumentoDetail() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const [monumento, setMonumento] = useState<Monumento | null>(null);
  const [loading, setLoading] = useState(true);
  const [fadeAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    const fetchMonumento = async () => {
      try {
        const res = await api.get(`/monumentos/${id}`);
        setMonumento(res.data);
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }).start();
      } catch (error) {
        console.error('Error al cargar monumento:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMonumento();
  }, [id]);

  if (loading || !monumento) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#2E7D32" />
        <Text>Cargando monumento...</Text>
      </View>
    );
  }

  return (
    <Animated.ScrollView contentContainerStyle={styles.container} style={{ opacity: fadeAnim }}>
      <TouchableOpacity onPress={() => router.back()} style={styles.botonVolver}>
        <Text style={styles.volverTexto}>◀ Detalles del monumento</Text>
      </TouchableOpacity>

      <Image source={{ uri: monumento.imagenes[0] }} style={styles.imagen} />

      <View style={styles.tituloContainer}>
        <Image source={obtenerIconoPorCategoria(monumento.categoria)} style={styles.icono} />
        <View>
          <Text style={styles.nombre}>{monumento.nombre}</Text>
          <Text style={styles.categoria}>{monumento.categoria}</Text>
        </View>
      </View>

      <View style={styles.cardSeccion}>
        <Text style={styles.descripcion}>
          {(monumento.descripcion ?? '').slice(0, 1000)}
        </Text>
      </View>

      <View style={styles.cardSeccion}>
        <Text style={styles.seccionTitulo}>Aspectos positivos</Text>
        {monumento.aspectosPositivos?.map((item, i) => (
          <View key={i} style={styles.itemRow}>
            <FontAwesome5 name="check-circle" size={16} color="#4CAF50" style={styles.iconoItem} />
            <Text style={styles.seccionItem}>{item}</Text>
          </View>
        ))}
      </View>

      <View style={styles.cardSeccion}>
        <Text style={styles.seccionTitulo}>Aspectos a tener en cuenta</Text>
        {monumento.aspectosNegativos?.map((item, i) => (
          <View key={i} style={styles.itemRow}>
            <MaterialIcons name="warning" size={18} color="#FFC107" style={styles.iconoItem} />
            <Text style={styles.seccionItem}>{item}</Text>
          </View>
        ))}
      </View>
    </Animated.ScrollView>
  );
}

const styles = StyleSheet.create({
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    padding: 16,
    paddingBottom: 40,
    backgroundColor: '#f8f8f8',
  },
  botonVolver: {
    marginBottom: 10,
  },
  volverTexto: {
    color: '#2E7D32',
    fontWeight: 'bold',
  },
  imagen: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    marginBottom: 14,
  },
  tituloContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 10,
  },
  icono: {
    width: 40,
    height: 40,
  },
  nombre: {
    fontSize: 26,
    fontWeight: 'bold',
    color: 'green',
    flexWrap: 'wrap'
  },
  categoria: {
    fontSize: 14,
    color: '#4CAF50',
  },
  descripcion: {
    fontSize: 15,
    color: '#333',
    marginBottom: 5,
  },
  cardSeccion: {
    backgroundColor: '#fff',
    padding: 12,
    marginVertical: 8,
    borderRadius: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  seccionTitulo: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 6,
    color: '#2E7D32',
  },
  seccionItem: {
    fontSize: 14,
    color: '#444',
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  iconoItem: {
    marginRight: 8,
  },
});
