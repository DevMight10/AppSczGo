import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, ScrollView } from 'react-native';
import * as Location from 'expo-location';
import { useRouter } from 'expo-router';
import { colors } from '@/const/color';

import ModoEncabezado from '../../../components/ModoEncabezado';
import InfoIcon from '@/app/components/infoComponent';
import EventoHistoriaCard from '../../../components/EventsHistoryCard';
import EventoMitoCard from '../../../components/EventoMitoCard';
import api from '../../../../api/axios';

export default function HistoryMode() {
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [loading, setLoading] = useState(true);
  const [modoActivo, setModoActivo] = useState<'historia' | 'mitos'>('historia');
  const [contenidos, setContenidos] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.warn('Permiso de ubicación denegado');
        setLoading(false);
        return;
      }

      const currentLocation = await Location.getCurrentPositionAsync({});
      setLocation(currentLocation);

      try {
        const response = await api.get('/historias');
        const datos = response.data;
        const contenidosFormateados = datos.map((item: any) => ({
          ...item,
          imagen: item.imagenes && item.imagenes.length > 0 ? { uri: item.imagenes[0] } : require('../../../img/Introduccion.png'),
        }));
        setContenidos(contenidosFormateados);
      } catch (error) {
        console.error('Error al obtener datos:', error);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const recargarContenido = async () => {
    setLoading(true);
    try {
      const currentLocation = await Location.getCurrentPositionAsync({});
      setLocation(currentLocation);

      const response = await api.get('/historias');
      const datos = response.data;

      const contenidosFormateados = datos.map((item: any) => ({
        ...item,
        imagen:
          item.imagenes && item.imagenes.length > 0
            ? { uri: item.imagenes[0] }
            : require('../../../img/Introduccion.png'),
      }));

      setContenidos(contenidosFormateados);
    } catch (error) {
      console.error('Error al recargar contenido:', error);
    } finally {
      setLoading(false);
    }
  };

  const EncabezadoToggle = ({
    modoActivo,
    setModoActivo,
  }: {
    modoActivo: 'historia' | 'mitos';
    setModoActivo: React.Dispatch<React.SetStateAction<'historia' | 'mitos'>>;
  }) => {
    return (
      <View style={styles.toggleContainer}>
        <View style={styles.toggle}>
          <Text
            style={[styles.toggleItem, modoActivo === 'historia' ? styles.toggleItemActive : styles.toggleItemInactive]}
            onPress={() => setModoActivo('historia')}
          >
            Historia
          </Text>
          <Text
            style={[styles.toggleItem, modoActivo === 'mitos' ? styles.toggleItemActive : styles.toggleItemInactive]}
            onPress={() => setModoActivo('mitos')}
          >
            Mitos y Leyendas
          </Text>
        </View>
      </View>
    );
  };

  if (loading || !location) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color={colors.verdeOscuro} />
        <Text>Cargando historias...</Text>
      </View>
    );
  }

  const categoriaFiltrada = modoActivo === 'historia' ? 'histórico' : 'cultural';
  const listaFiltrada = contenidos.filter(c => c.categoria === categoriaFiltrada);

  const listaOrdenada = listaFiltrada.sort((a, b) => {
    const fechaA = new Date(a.fechaEvento);
    const fechaB = new Date(b.fechaEvento);
    return fechaA.getTime() - fechaB.getTime();
  });

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.encabezado}>
          <ModoEncabezado
            icono={require('../../../img/HistoriaIcon.png')}
            titulo={modoActivo === 'historia' ? 'Historia' : 'Mitos y leyendas'}
            onPress={recargarContenido}
            infoIcon={
              <InfoIcon
                titulo={modoActivo === 'historia' ? 'Modo Historia' : 'Mitos y leyendas'}
                descripcion={
                  modoActivo === 'historia'
                    ? 'En este modo recorrerás una línea de tiempo que presenta los eventos históricos más importantes de Santa Cruz de la Sierra...'
                    : 'Aquí descubrirás relatos populares transmitidos de generación en generación: leyendas urbanas, mitos religiosos...'
                }
              />
            }
          />
          <View style={{ height: 12 }} />
          <EncabezadoToggle modoActivo={modoActivo} setModoActivo={setModoActivo} />
        </View>

        <View style={styles.lista}>
          {listaOrdenada.map((item, index) => (
            modoActivo === 'historia' ? (
              <EventoHistoriaCard
                key={item._id || index}
                titulo={item.titulo}
                descripcion={item.descripcion}
                imagen={item.imagen}
                categoria={item.categoria}
                fechaEvento={item.fechaEvento}
                onPress={() => {
                  router.push({ pathname: '/pages/tab/HistoryMode/[id]', params: { id: item._id } });
                }}
              />
            ) : (
              <EventoMitoCard
                key={item._id || index}
                titulo={item.titulo}
                descripcion={item.descripcion}
                imagen={item.imagen}
                onPress={() => {
                  router.push({ pathname: '/pages/tab/HistoryMode/[id]', params: { id: item._id } });
                }}
              />
            )
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  loader: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  scrollContent: { paddingTop: 30, paddingBottom: 30 },
  encabezado: { paddingHorizontal: 9, marginBottom: 20, marginTop: 20 },
  lista: { paddingHorizontal: 25 },
  toggleContainer: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 4,
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 10,
    elevation: 2,
  },
  toggle: {
    flexDirection: 'row',
    backgroundColor: '#e0e0e0',
    borderRadius: 20,
    overflow: 'hidden',
  },
  toggleItem: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    fontSize: 14,
    fontWeight: 'bold',
    borderRadius: 20,
  },
  toggleItemActive: {
    backgroundColor: colors.verdeOscuro,
    color: '#fff',
  },
  toggleItemInactive: {
    backgroundColor: '#e0e0e0',
    color: '#666',
  },
});
