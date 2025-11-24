import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Image, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import api from '../../../../api/axios';
import { colors } from '@/const/color';
import BackComponent from '../../../components/backComponent';

export default function DetalleHistoria() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [evento, setEvento] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvento = async () => {
      try {
        const response = await api.get(`/historias/${id}`);
        setEvento(response.data);
      } catch (error) {
        console.error('Error al obtener el detalle:', error);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchEvento();
  }, [id]);

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color={colors.verdeOscuro} />
        <Text>Cargando detalle del evento...</Text>
      </View>
    );
  }

  if (!evento) {
    return (
      <View style={styles.container}>
        <Text style={styles.error}>No se encontró el evento.</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <BackComponent />
      {evento.fechaEvento && !isNaN(Date.parse(evento.fechaEvento)) && (
        <Text style={styles.fecha}>
          {new Date(evento.fechaEvento).toLocaleDateString('es-BO', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </Text>
      )}
      {/* <Text style={styles.fecha}>{evento.anio}</Text> */}
      <Text style={styles.titulo}>{evento.titulo}</Text>
      <Text style={styles.subtitulo}>Descripción</Text>
      <Text style={styles.descripcion}>{evento.descripcion}</Text>
      {evento.imagenes?.length > 0 && (
        <Image source={{ uri: evento.imagenes[0] }} style={styles.imagen} />
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 40,
    backgroundColor: '#fff',
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.verdeOscuro,
    //marginBottom: 8,
    marginTop: 10,
  },
  subtitulo: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
    color: '#333',
  },
  descripcion: {
    fontSize: 16,
    color: '#444',
    marginTop: 5,
    textAlign: 'justify',
    lineHeight: 22,
  },
  fecha: {
    fontSize: 20,
    color: colors.verdeClaro,
    fontFamily: 'InterBold',
    marginBottom: 5,
    textAlign: 'left',
  },
  imagen: {
    width: '100%',
    height: 200,
    marginVertical: 15,
    borderRadius: 10,
  },
  error: {
    color: 'red',
    fontSize: 18,
    textAlign: 'center',
  },
});
