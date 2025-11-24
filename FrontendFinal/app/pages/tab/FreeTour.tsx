import React, { useEffect, useState, useRef } from 'react';
import { View, StyleSheet, ActivityIndicator, Text } from 'react-native';
import MapView, { Marker, Circle, PROVIDER_GOOGLE, Polyline, Region } from 'react-native-maps';
import * as Location from 'expo-location';
import * as Network from 'expo-network';
import api from '@/api/axios';
import ModoEncabezado from '../../components/ModoEncabezado';
import BannerMonumentos from '../../components/BannerMonumentos';
import RutaActivaBanner from '../../components/RutaActivaBanner';
import FiltroCategorias from '../../components/FiltroCategorias';
import BuscadorUbicaciones from '../../components/BuscadorUbicaciones';
import { Monumento } from '@/types/Monumento';
import { obtenerIconoPorCategoria } from '@/utils/iconosPorCategoria';
import { useMonumentoStore } from '@/store/useMonumentoStore';
import ModalMonumento from '../../components/ModalMonumento';
import ConexionModalComponent from '@/app/components/conexionModalComponent';
import InfoIcon from '../../components/infoComponent';
import polyline from '@mapbox/polyline';
import NotificacionMonumento from '../../components/NotificacionMonumento';

const estiloMapaVerdeContrastado = [
  { elementType: 'geometry', stylers: [{ color: '#e5e5e5' }] },
  { elementType: 'labels.icon', stylers: [{ visibility: 'off' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#333' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#ffffff' }] },
  {
    featureType: 'administrative',
    elementType: 'geometry',
    stylers: [{ visibility: 'off' }],
  },
  {
    featureType: 'poi',
    elementType: 'geometry',
    stylers: [{ color: '#cde7c6' }],
  },
  {
    featureType: 'poi',
    elementType: 'labels.text',
    stylers: [{ visibility: 'off' }],
  },
  {
    featureType: 'road',
    elementType: 'geometry',
    stylers: [{ color: '#ffffff' }],
  },
  {
    featureType: 'road',
    elementType: 'geometry.stroke',
    stylers: [{ color: '#9ecf8d' }],
  },
  {
    featureType: 'transit',
    stylers: [{ visibility: 'off' }],
  },
  {
    featureType: 'water',
    elementType: 'geometry',
    stylers: [{ color: '#a3d5e0' }],
  },
];

export default function FreeTour() {
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [monumentos, setMonumentos] = useState<Monumento[]>([]);
  const [cercanos, setCercanos] = useState<Monumento[]>([]);
  const [loading, setLoading] = useState(true);
  const [mostrarNotificacion, setMostrarNotificacion] = useState(false);
  const mapRef = useRef<MapView | null>(null);

  const {
    setMonumentoSeleccionado,
    setModalVisible,
    ruta,
    mostrarRutaActiva,
    categoriasSeleccionadas,
    monumentoSeleccionado,
    setRuta,
    setMonumentos: setMonumentosStore,
    setUbicacionActual,
  } = useMonumentoStore();

  const [sinConexion, setSinConexion] = useState(false);
  const reintentarConexion = () => {
    setSinConexion(false);
  };

  useEffect(() => {
    const verificarConexion = async () => {
      try {
        const { isConnected } = await Network.getNetworkStateAsync();
        if (!isConnected) {
          setSinConexion(true);
        }
      } catch (error) {
        setSinConexion(true);
      }
    };

    verificarConexion();
  }, []);

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
      setUbicacionActual(currentLocation);
      setLoading(false);
    })();
  }, []);

  useEffect(() => {
    const fetchMonumentos = async () => {
      try {
        const response = await api.get('/monumentos');
        setMonumentos(response.data);
        setMonumentosStore(response.data);
      } catch (error) {
        console.error('Error al cargar monumentos:', error);
      }
    };

    fetchMonumentos();
  }, []);

  useEffect(() => {
    if (!location) return;

    const nuevosCercanos = monumentos
      .filter((monumento) => {
        if (categoriasSeleccionadas.length === 0) return true;
        return categoriasSeleccionadas.includes(monumento.categoria);
      })
      .map((monumento) => {
        const distancia = calcularDistancia(
          location.coords.latitude,
          location.coords.longitude,
          monumento.coordenadas.latitud,
          monumento.coordenadas.longitud
        );
        return { ...monumento, distancia };
      })
      .filter((m) => m.distancia <= m.radioGeofence);

    setCercanos(nuevosCercanos);

    if (nuevosCercanos.length > 0) {
      setMostrarNotificacion(true);
    }
  }, [location, monumentos, categoriasSeleccionadas]);

  const calcularDistancia = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number => {
    const R = 6371e3;
    const φ1 = lat1 * (Math.PI / 180);
    const φ2 = lat2 * (Math.PI / 180);
    const Δφ = (lat2 - lat1) * (Math.PI / 180);
    const Δλ = (lon2 - lon1) * (Math.PI / 180);

    const a =
      Math.sin(Δφ / 2) ** 2 +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  };

  const centrarEnRegion = (region: Region) => {
    if (mapRef.current) {
      mapRef.current.animateToRegion(region, 1000);
    }
  };

  if (loading || !location) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#2E7D32" />
        <Text>Cargando ubicación...</Text>
      </View>
    );
  }

  const recargarTodo = async () => {
  setLoading(true);
    try {
      const currentLocation = await Location.getCurrentPositionAsync({});
      setLocation(currentLocation);
      setUbicacionActual(currentLocation);

      const response = await api.get('/monumentos');
      setMonumentos(response.data);
      setMonumentosStore(response.data);
    } catch (error) {
      console.error('Error al recargar:', error);
    }
    setLoading(false);
  };


  return (
    <View style={styles.container}>
      <View style={styles.encabezado}>
        <ModoEncabezado 
          icono={require('../../img/TuristaLibre.png')} 
          titulo="Turista Libre" 
          onPress={recargarTodo}
           infoIcon={
              <InfoIcon
                titulo="Modo Turista Libre"
                descripcion="Este modo está pensado para los exploradores espontáneos. Podés moverte libremente por la ciudad y 
                la aplicación te mostrará un mapa con tu ubicación actual y los monumentos más cercanos a tu alrededor. 
                Al ingresar dentro del área de alguno de estos lugares, recibirás una notificación con su nombre, categoría y detalles importantes. También tendrás la opción de generar una ruta directa desde tu ubicación hasta ese destino, visualizada con una línea verde en el mapa. No necesitás seguir un orden específico ni una ruta predefinida: vos decidís a dónde ir y cuándo detenerte.  Es ideal para quienes quieren descubrir Santa Cruz a su propio ritmo, sin limitaciones."
              />
            }
        />
        <View style={styles.filtrosRow}>
          <FiltroCategorias />
          <BuscadorUbicaciones setRegion={centrarEnRegion} />
        </View>
      </View>
      <ConexionModalComponent
        visible={sinConexion}
        modo="Turista Libre"
        onRetry={reintentarConexion}
      />

      <MapView
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        style={StyleSheet.absoluteFillObject}
        initialRegion={{
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
        showsUserLocation={true}
        showsMyLocationButton={true}
        customMapStyle={estiloMapaVerdeContrastado}
      >
        {monumentos
          .filter((monumento) => {
            if (categoriasSeleccionadas.length === 0) return true;
            return categoriasSeleccionadas.includes(monumento.categoria);
          })
          .map((monumento) => {
            const distancia = calcularDistancia(
              location.coords.latitude,
              location.coords.longitude,
              monumento.coordenadas.latitud,
              monumento.coordenadas.longitud
            );

            return (
              <React.Fragment key={monumento._id}>
                <Marker
                  coordinate={{
                    latitude: monumento.coordenadas.latitud,
                    longitude: monumento.coordenadas.longitud,
                  }}
                  onPress={() => {
                    setMonumentoSeleccionado({ ...monumento, distancia });
                    setModalVisible(true);
                  }}
                  anchor={{ x: 0.5, y: 1 }}
                  image={obtenerIconoPorCategoria(monumento.categoria)}
                />
                <Circle
                  center={{
                    latitude: monumento.coordenadas.latitud,
                    longitude: monumento.coordenadas.longitud,
                  }}
                  radius={monumento.radioGeofence}
                  strokeColor="rgba(46, 125, 50, 0.8)"
                  fillColor="rgba(46, 125, 50, 0.2)"
                />
              </React.Fragment>
            );
          })}

        {ruta.length > 1 && (
          <Polyline coordinates={ruta} strokeColor="#2E7D32" strokeWidth={5} />
        )}
      </MapView>

      {mostrarRutaActiva && ruta.length > 1 ? (
        <RutaActivaBanner />
      ) : (
        cercanos.length > 0 && <BannerMonumentos cercanos={cercanos} />
      )}

      <ModalMonumento />

      <NotificacionMonumento
        visible={mostrarNotificacion}
        onClose={() => setMostrarNotificacion(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  encabezado: {
    position: 'absolute',
    top: 50,
    left: 10,
    right: 10,
    zIndex: 999,
  },
  filtrosRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 5,
    paddingRight: 15,
  },
});
