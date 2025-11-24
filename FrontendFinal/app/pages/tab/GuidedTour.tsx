

// app/pages/tab/GuidedTour.tsx
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  Modal,
  TextInput,
  ScrollView,
  Alert,
  StyleSheet,
} from 'react-native';
import MapView, { Circle, Marker, Polyline, PROVIDER_GOOGLE, Region } from 'react-native-maps';
import * as Location from 'expo-location';

import polyline from '@mapbox/polyline';
import { FontAwesome, Feather } from '@expo/vector-icons';  // Para los iconos de "muñeco caminando" y "auto"



// import { useMonumentStore } from '@/store/useMonumento';
import { useMonumentoStore } from '@/store/useMonumentoStore';

import ModoEncabezado from '@/app/components/ModoEncabezado';
import InfoIcon from '@/app/components/infoComponent';
import Toast from 'react-native-toast-message';
import { Monumento } from '@/types/Monumento';
import { completarRuta } from '@/api/rutas';
import { Image } from 'react-native';
import { useGuidedTourStore } from '@/store/useGuidedTourStore';
import api from '@/api/axios';
import { obtenerIconoPorCategoria } from '@/utils/iconosPorCategoria';
import ModalMonumento from '@/app/components/ModalMonumento';
import FiltroCategorias from '../../components/FiltroCategorias';
import BuscadorUbicaciones from '../../components/BuscadorUbicaciones';
import { router } from 'expo-router';






const CATEGORIAS = [
  'Gastronomicos',
  'Monumentos',
  'Museos',
  'Recreativos',
  'Iglesias',
];

const GOOGLE_API_KEY = "AIzaSyCpjgdzAgwoeJOVFVlThL6tW3A8c_urJH8";

export default function GuidedTour() {
  const mapRef = React.useRef<MapView>(null);

  const {
    rutaActual,
    tiempoSeleccionado,
    interesesSeleccionados,
    setTiempo,
    toggleInteres,
    generarRuta,
    startTour,
    tourStarted,
    resetTour,
    checkinPunto,
    ubicacionInicio,
    setTiempoPorSitio,
    tiempoPorSitio,

    
  } = useGuidedTourStore();

  

  

  // const { monumentos, cargarMonumentos } = useMonumentStore();
  //const [monumentos, setMonumentos] = useState<Monumento[]>([]);
//   const {
//   setMonumentoSeleccionado,
//   setModalVisible,
//   setMonumentos: setMonumentosStore,
//   categoriasSeleccionadas
// } = useMonumentoStore();

const {
  monumentos,
  setMonumentos,
  setMonumentoSeleccionado,
  setModalVisible,
  categoriasSeleccionadas
} = useMonumentoStore();




  const [ubicacion, setUbicacion] = useState<{ lat: number; lng: number } | null>(null);
  const [loadingUbic, setLoadingUbic] = useState(true);
  const [modalVisible, setModalVisibleRuta] = useState(false);
  const [inputTiempo, setInputTiempo] = useState(String(tiempoSeleccionado));
  const [routeCoords, setRouteCoords] = useState<{ latitude: number; longitude: number }[]>([]);
  const [loadingRoute, setLoadingRoute] = useState(false);
  const [totalDistance, setTotalDistance] = useState(0);
  const [nextPointDistance, setNextPointDistance] = useState(0);
  const [distance, setDistance] = useState(0);
  const [monumentoVisitado, setMonumentoVisitado] = useState<Monumento | null>(null);
  const [mostrarSiguiente, setMostrarSiguiente] = useState(false);
  const [esUltimoPunto, setEsUltimoPunto] = useState(false);
  const [mostrarFinal, setMostrarFinal] = useState(false); // Muestra tarjeta final
  const [finalizado, setFinalizado] = useState(false);
  const [modalResumenVisible, setModalResumenVisible] = useState(false);
  const [mostrarMiniBanner, setMostrarMiniBanner] = useState(true);
  const [verMas, setVerMas] = useState(false);
  const [modoTransporte, setModoTransporte] = useState<'caminando' | 'conduciendo'>('caminando');
  const [inputEstadia, setInputEstadia] = useState("5");


const duracionTotal = rutaActual
  ? (modoTransporte === 'caminando'
      ? rutaActual.duracionEstimadaPie
      : rutaActual.duracionEstimadaAuto) + (tiempoPorSitio * rutaActual.puntos.length)
  : 0;


const cantidadLugares = rutaActual?.puntos.length || 0;
const duracionBase = modoTransporte === 'caminando'
  ? rutaActual?.duracionEstimadaPie || 0
  : rutaActual?.duracionEstimadaAuto || 0;

const modoTexto = modoTransporte === 'caminando' ? 'caminando 🚶‍♂️' : 'auto 🚗';
const tiempoTotal = duracionBase; // ya incluye el tiempoPorSitio, gracias a la lógica de generarRuta




// ...en tu componente...
const [mapAngle, setMapAngle] = useState(0);

const centrarEnRegion = (region: Region) => {
  if (mapRef.current) {
    mapRef.current.animateToRegion(region, 1000);
  }
};





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




  // useEffect(() => { cargarMonumentos(); }, []);
//   useEffect(() => {
//   const fetchMonumentos = async () => {
//     try {
//       const response = await api.get('/monumentos');
//       setMonumentos(response.data);
//       setMonumentosStore(response.data);
//     } catch (error) {
//       console.error('Error al cargar monumentos:', error);
//     }
//   };

//   fetchMonumentos();
// }, []);

useEffect(() => {
  const fetchMonumentos = async () => {
    try {
      const response = await api.get('/monumentos');
      setMonumentos(response.data);
    } catch (error) {
      console.error('Error al cargar monumentos:', error);
    }
  };

  fetchMonumentos();
}, []);

useEffect(() => {
  setModalVisibleRuta(false); // Siempre asegúrate que el modal esté cerrado al iniciar
}, []);

  

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        const pos = await Location.getCurrentPositionAsync();
        setUbicacion({ lat: pos.coords.latitude, lng: pos.coords.longitude });
      }
      setLoadingUbic(false);
    })();
  }, []);


  useEffect(() => {
  if (!rutaActual || !ubicacion || !tourStarted || rutaActual.completada) return;


  (async () => {
    setLoadingRoute(true);
    try {
      const origin = `${ubicacionInicio?.lat || ubicacion.lat},${ubicacionInicio?.lng || ubicacion.lng}`;
      const pts = rutaActual.puntos.map(p => {
        const m = monumentos.find(m => m._id === p.monumento)!;
        return `${m.coordenadas.latitud},${m.coordenadas.longitud}`;
      });
      const destination = pts.pop()!;
      const waypoints = pts.join('|');
      const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${origin}&destination=${destination}&${waypoints ? `waypoints=${waypoints}&` : ''}mode=caminando&key=${GOOGLE_API_KEY}`;
      const res = await fetch(url);
      const json = await res.json();
      if (json.routes?.length) {
        const decoded = polyline.decode(json.routes[0].overview_polyline.points);
        const coords = decoded.map(([lat, lng]) => ({ latitude: lat, longitude: lng }));
        setRouteCoords(coords);
      } else {
        Alert.alert('Ruta no encontrada', 'No se pudo obtener la ruta detallada.');
      }
    } catch (e: any) {
      console.error(e);
      Alert.alert('Error de rutas', e.message);
    } finally {
      setLoadingRoute(false);
    }
  })();
}, [rutaActual, ubicacion]);

useEffect(() => {
  if (!tourStarted || !rutaActual) return;

  let subscriber: Location.LocationSubscription;

  const startWatching = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') return;

    subscriber = await Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.High,
        timeInterval: 3000, // cada 3 segundos
        distanceInterval: 2, // o cada que se mueva 2 metros
      },
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        setUbicacion({ lat, lng }); // actualiza en tiempo real
      }
    );
  };

  startWatching();

  return () => {
    if (subscriber) subscriber.remove();
  };
}, [tourStarted, rutaActual]);


useEffect(() => {
  if (!ubicacion || !tourStarted || !rutaActual || mostrarFinal) return;

  const nextIdx = rutaActual.checkins.length;
  const next = rutaActual.puntos[nextIdx];
  if (!next) return;

  const m = monumentos.find((x) => String(x._id) === String(next.monumento));
  if (!m) return;

  const distancia = getDistance(
    ubicacion.lat,
    ubicacion.lng,
    m.coordenadas.latitud,
    m.coordenadas.longitud
  );

  setDistance(distancia);

  const radio = 200;

  if (distancia <= radio) {
    setMonumentoVisitado(m);
    setMostrarFinal(true);
    const esUltimo = nextIdx >= rutaActual.puntos.length - 1;
    setEsUltimoPunto(esUltimo);
    setMostrarSiguiente(true);
    if (esUltimo && !mostrarFinal) {
      setMostrarFinal(true);
    }
  }
    // Recalcular ruta restante desde ubicación actual
  const origin = `${ubicacion.lat},${ubicacion.lng}`;

  const puntosRestantes = rutaActual.puntos.slice(nextIdx);
  const destinos = puntosRestantes.map(p => {
    const mon = monumentos.find(m => m._id === p.monumento);
    return mon ? `${mon.coordenadas.latitud},${mon.coordenadas.longitud}` : null;
  }).filter(Boolean);

  if (destinos.length > 0) {
    const destination = destinos.pop();
    const waypoints = destinos.join('|');

    const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${origin}&destination=${destination}&${waypoints ? `waypoints=${waypoints}&` : ''}mode=caminando&key=${GOOGLE_API_KEY}`;
    
    fetch(url)
      .then(res => res.json())
      .then(json => {
        if (json.routes?.length) {
          const decoded = polyline.decode(json.routes[0].overview_polyline.points);
          const nuevaRuta = decoded.map(([lat, lng]) => ({
            latitude: lat,
            longitude: lng,
          }));
          setRouteCoords(nuevaRuta); // ← esto actualiza solo el camino restante
        }
      })
      .catch(err => {
        console.warn("Error al recalcular ruta:", err);
      });
  }

}, [ubicacion]);


  const fmt = (m: number) => m > 1000 ? `${(m/1000).toFixed(1)} km` : `${Math.round(m)} m`;

  const getDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371e3;
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon2 - lon1) * Math.PI) / 180;
    const a = Math.sin(Δφ / 2) ** 2 + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  
const avanzarAlSiguiente = async () => {
  if (!rutaActual || rutaActual.checkins.length >= rutaActual.puntos.length) {
  await finalizarRuta();
  return;
}


  try {
    await checkinPunto();

    const siguienteIdx = rutaActual.checkins.length;
    const puntosRestantes = rutaActual.puntos.slice(siguienteIdx);

    if (puntosRestantes.length === 0) {
      // ✅ Ya se visitaron todos los puntos → finalizar ruta
      await finalizarRuta();
      return;
    }

    // 🔁 Recalcular ruta SOLO con los puntos restantes
    const ubic = await Location.getCurrentPositionAsync();
    const origin = `${ubic.coords.latitude},${ubic.coords.longitude}`;

    const destinos = puntosRestantes.map(p => {
      const mon = monumentos.find(m => m._id === p.monumento);
      return mon ? `${mon.coordenadas.latitud},${mon.coordenadas.longitud}` : null;
    }).filter(Boolean);

    if (destinos.length === 0) return;

    const destination = destinos.pop();
    const waypoints = destinos.join('|');

    const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${origin}&destination=${destination}&${waypoints ? `waypoints=${waypoints}&` : ''}mode=caminando&key=${GOOGLE_API_KEY}`;
    const res = await fetch(url);
    const json = await res.json();

    if (json.routes?.length) {
      const decoded = polyline.decode(json.routes[0].overview_polyline.points);
      const nuevaRuta = decoded.map(([lat, lng]) => ({ latitude: lat, longitude: lng }));
      setRouteCoords(nuevaRuta);
    }

    setMostrarFinal(false);
    setMostrarSiguiente(false);
    setMonumentoVisitado(null);

  } catch (error) {
    console.warn('Error al avanzar:', error);
    Toast.show({
      type: 'error',
      text1: 'Error al avanzar',
      text2: 'Intenta de nuevo.',
    });
  }
};





const finalizarRuta = async () => {
  if (!rutaActual?._id) return;

  try {
    // 1. Marcar como completada en backend y Zustand
    const rutaFinal = await completarRuta(rutaActual._id);
    useGuidedTourStore.setState({ rutaActual: rutaFinal });

    // 2. Obtener ubicación actual
    const pos = await Location.getCurrentPositionAsync();
    const currentLocation = {
      latitude: pos.coords.latitude,
      longitude: pos.coords.longitude,
      latitudeDelta: 0.02,
      longitudeDelta: 0.02,
    };

    // 3. Centrar el mapa
    if (mapRef.current) {
      mapRef.current.animateToRegion(currentLocation, 1000);
    }

    // 4. Limpiar estado visual
    setMostrarFinal(false);
    setMostrarSiguiente(false);
    setMonumentoVisitado(null);
    setRouteCoords([]);
    setTotalDistance(0);
    setNextPointDistance(0);
    setDistance(0);

    // 5. Reset Zustand global
    resetTour();

    // 6. Mostrar mensaje de confirmación
    Toast.show({
      type: 'success',
      text1: '🎉 Ruta finalizada',
      text2: 'Gracias por usar el modo guiado.',
      position: 'top',
    });

  } catch (e) {
    console.warn('Error al finalizar ruta:', e);
    Toast.show({
      type: 'error',
      text1: 'Error al finalizar ruta',
      text2: 'Inténtalo de nuevo.',
    });
  }
};





const onConfirmar = async () => {
  const mins = parseInt(inputTiempo, 10);
  const estadia = parseInt(inputEstadia, 10); 

  if (isNaN(mins) || mins <= 0) {
    return Alert.alert('Tiempo inválido', 'Introduce un número válido.');
  }


  if (isNaN(estadia) || estadia <= 0) {
  return Alert.alert('Tiempo de visita inválido', 'Introduce un tiempo de estadía válido.');
  }

  if (!interesesSeleccionados.length) {
    return Alert.alert('Selecciona categorías', 'Elige al menos una.');
  }

  try {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      return Alert.alert('Permisos denegados', 'Activa la ubicación en los ajustes del sistema.');
    }

    const pos = await Location.getCurrentPositionAsync({});
    if (!pos) throw new Error('Ubicación no disponible');

    const ubicacionActual = {
      lat: pos.coords.latitude,
      lng: pos.coords.longitude,
    };

    setUbicacion(ubicacionActual); // << importante para todo el flujo
    setTiempo(mins);
    setTiempoPorSitio(estadia);
    setModalVisibleRuta(false);

    const exito = await generarRuta(ubicacionActual);

    // Si generarRuta no retorna nada (void), asumimos éxito tras la llamada
    setModalResumenVisible(true);

  } catch (e: any) {
    console.error(e);
    Alert.alert('Error de ubicación', 'No se pudo obtener la ubicación actual.');
  }
};


  const handleStart = async () => {
    try {
      await startTour();
    } catch (e: any) {
      Alert.alert('Error iniciando tour', e.message);
    }
  };

  if (loadingUbic || !ubicacion) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#2E7D32" />
        <Text>Cargando ubicación…</Text>
      </View>
    );
  }

  const handleResetTour = async () => {
  Alert.alert(
    '¿Terminar guía?',
    '¿Estás seguro de que deseas finalizar esta ruta?',
    [
      {
        text: 'Cancelar',
        style: 'cancel',
      },
      {
        text: 'Sí, terminar',
        style: 'destructive',
        onPress: async () => {
          setMostrarFinal(false); // 👈 ESTO ES LO QUE FALTABA
          resetTour();
          setRouteCoords([]);
          setTotalDistance(0);
          setNextPointDistance(0);
          setDistance(0);

          try {
            const pos = await Location.getCurrentPositionAsync();
            const currentLocation = {
              latitude: pos.coords.latitude,
              longitude: pos.coords.longitude,
              latitudeDelta: 0.02,
              longitudeDelta: 0.02,
            };

            if (mapRef.current) {
              mapRef.current.animateToRegion(currentLocation, 1000);
            }
          } catch {
            console.warn("No se pudo obtener ubicación actual para centrar el mapa.");
          }

          Toast.show({
            type: 'info',
            text1: 'Guía terminada',
            text2: 'Puedes crear una nueva ruta cuando quieras.',
            position: 'top',
            visibilityTime: 3000,
            topOffset: 130,
          });
        }
      }
    ]
  );
  
};


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

  const recargarUbicacionYMonumentos = async () => {
    setLoadingUbic(true);
    try {
      const [pos, response] = await Promise.all([
        Location.getCurrentPositionAsync(),
        api.get('/monumentos'),
      ]);

      setUbicacion({ lat: pos.coords.latitude, lng: pos.coords.longitude });
      setMonumentos(response.data);
    } catch (error) {
      console.warn('Error al recargar:', error);
      Alert.alert('Error', 'No se pudo recargar la información.');
    }
    setLoadingUbic(false);
  };



return (
  <View style={styles.container}>
    <View style={styles.encabezado}>
      <ModoEncabezado
        icono={require('../../img/GuiadoIcon.png')}
        titulo="Turista guiado"
        onPress={recargarUbicacionYMonumentos}
        infoIcon={
          <InfoIcon
            titulo='Modo Turista Guiado'
            descripcion='Este modo está diseñado para llevarte en un recorrido ordenado por los puntos turísticos de la ciudad. 
      Primero configuras tu tiempo disponible, tus intereses y el medio de transporte. 
      La app genera una ruta inteligente optimizada y te guía paso a paso. 
      A medida que llegues a cada destino, se irá desbloqueando el siguiente punto hasta finalizar el recorrido completo. 
      Es ideal para quienes quieren aprovechar su tiempo al máximo y descubrir Santa Cruz con orientación.'
          />
        }
      />
      <View style={styles.filtrosRow}>
        <FiltroCategorias />
        <BuscadorUbicaciones setRegion={centrarEnRegion} />
      </View>
    </View>


    <MapView
    
      ref={mapRef}
      provider={PROVIDER_GOOGLE}
      style={StyleSheet.absoluteFillObject}
      initialRegion={{
        latitude: ubicacion.lat,
        longitude: ubicacion.lng,
        latitudeDelta: 0.02,
        longitudeDelta: 0.02,
      }}
      showsUserLocation
      customMapStyle={estiloMapaVerdeContrastado}
    >

      {rutaActual?.puntos.map((p) => {
        const yaVisitado = rutaActual.checkins.find(
          (c) => String(c.puntoId) === String(p.monumento)
        );
        const m = monumentos.find((mon) => String(mon._id) === String(p.monumento));
        if (!m || yaVisitado) return null;

        return (
          <Marker
            key={p.orden}
            coordinate={{
              latitude: m.coordenadas.latitud,
              longitude: m.coordenadas.longitud,
            }}
            image={obtenerIconoPorCategoria(m.categoria)} 
          />
        );
      })}

{/* Mostrar solo puntos de la ruta si la guía está activa */}
{tourStarted &&
  rutaActual?.puntos.map((p) => {
    const yaVisitado = rutaActual.checkins.find(
      (c) => String(c.puntoId) === String(p.monumento)
    );
    const m = monumentos.find((mon) => String(mon._id) === String(p.monumento));
    if (!m) return null;

    const distancia = calcularDistancia(
      ubicacion.lat,
      ubicacion.lng,
      m.coordenadas.latitud,
      m.coordenadas.longitud
    );

    return (
      <Marker
        key={`ruta-${p.orden}`}
        coordinate={{
          latitude: m.coordenadas.latitud,
          longitude: m.coordenadas.longitud,
        }}
        onPress={() => {
          setMonumentoSeleccionado({ ...m, distancia });
          setModalVisible(true);
        }}
        anchor={{ x: 0.5, y: 1 }}
        image={obtenerIconoPorCategoria(m.categoria)}
      />
    );
  })}

{/* Mostrar todos los monumentos generales si la guía NO está activa */}
{!tourStarted &&
  monumentos
    .filter((monumento) => {
      if (categoriasSeleccionadas.length === 0) return true;
      return categoriasSeleccionadas.includes(monumento.categoria);
    })
    .map((monumento) => {
      const distancia = calcularDistancia(
        ubicacion.lat,
        ubicacion.lng,
        monumento.coordenadas.latitud,
        monumento.coordenadas.longitud
      );

      return (
        <React.Fragment key={`extra-${monumento._id}`}>
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


            


      {!loadingRoute && routeCoords.length > 0 && (
        <Polyline coordinates={routeCoords} strokeColor="#2E7D32" strokeWidth={4} />
      )}
    </MapView>

    <ModalMonumento />


    {tourStarted && !mostrarFinal && mostrarMiniBanner && rutaActual && (
//       <View style={styles.bannerDestino}>
// <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
//   <View>
//     <Text style={styles.bannerTitulo}>
//       {monumentos.find(m => m._id === rutaActual.puntos[rutaActual.checkins.length]?.monumento)?.nombre || 'Siguiente destino'}
//     </Text>
//     <Text style={styles.bannerSub}>
//       {monumentos.find(m => m._id === rutaActual.puntos[rutaActual.checkins.length]?.monumento)?.categoria || 'Categoría'}
//     </Text>
//   </View>
//   <Text style={{ fontSize: 20, marginLeft: 10 }}>
//     {modoTransporte === 'caminando' ? '🚶‍♂️' : '🚗'}
//   </Text>
// </View>
<View style={styles.bannerDestino}>
  <View style={styles.bannerContent}>
    <View style={styles.bannerText}>
      <Text style={styles.bannerTitle}>
        {monumentos.find(m => m._id === rutaActual.puntos[rutaActual.checkins.length]?.monumento)?.nombre || 'Siguiente destino'}
      </Text>
      <Text style={styles.bannerSubtitle}>
        {modoTransporte === 'caminando' 
          ? 'Estás caminando a '
          : 'Estás conduciendo a '}
        {monumentos.find(m => m._id === rutaActual.puntos[rutaActual.checkins.length]?.monumento)?.nombre || 'Destino'}
      </Text>
    </View>
    
    <View style={styles.transportIconContainer}>
      <FontAwesome  
        name={modoTransporte === 'caminando' ? 'male' : 'car'}
        size={28} 
        color="#fff" 
      />
    </View>
  </View>
  
  <View style={styles.distanceContainer}>
    <Text style={styles.distanceInfo}>
      {(() => {
        const monumento = monumentos.find(m => m._id === rutaActual.puntos[rutaActual.checkins.length]?.monumento);
        if (monumento) {
          const distance = getDistance(ubicacion.lat, ubicacion.lng, monumento.coordenadas.latitud, monumento.coordenadas.longitud);
          return `Distancia: ${fmt(distance)} – ${modoTransporte === 'caminando' ? 'a pie' : 'en auto'}`;
        }
        return '';
      })()}
    </Text>
  </View>

  <TouchableOpacity onPress={() => setVerMas(true)}  style={styles.moreButton}>
    <Text style={styles.moreButtonText}>Ver más</Text>
  </TouchableOpacity>
</View>

    )}
{/* 
onPress={() => setVerMas(true)}  */}

   {tourStarted && !mostrarFinal && verMas && rutaActual && (
  <View style={styles.panelParadas}>
    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
<View style={{ flexDirection: 'row', alignItems: 'center' }}>
  <Text style={styles.panelTitulo}>
    Faltan {rutaActual.puntos.length - rutaActual.checkins.length} paradas
  </Text>
  <Text style={{ fontSize: 20, marginLeft: 10 }}>
    {modoTransporte === 'caminando' ? '🚶‍♂️' : '🚗'}
  </Text>
</View>

      <TouchableOpacity onPress={() => setVerMas(false)}>
        <Text style={styles.verMenos}>Ver menos</Text>
      </TouchableOpacity>
    </View>

    <Text style={styles.panelSub}>En camino a tu próximo destino…</Text>



<ScrollView style={{ marginTop: 10 }}>
  {rutaActual.puntos.slice(rutaActual.checkins.length).map((punto) => {
    const mon = monumentos.find((m) => m._id === punto.monumento);
    if (!mon) return null;
    return (
      <View key={punto.orden} style={styles.cardResumen}>
        <View style={styles.verticalLine} />
        <View style={styles.cardContent}>
          <Image source={{ uri: mon.imagenes[0] }} style={styles.cardImage} />
          <View style={{ marginLeft: 10 }}>
            <Text style={styles.cardTitle}>{mon.nombre}</Text>
            <Text style={styles.cardSubtitle}>{mon.categoria}</Text>
            <Text style={styles.cardDistancia}>
              A {fmt(
                getDistance(
                  ubicacion.lat,
                  ubicacion.lng,
                  mon.coordenadas.latitud,
                  mon.coordenadas.longitud
                )
              )} –{' '}
              {(() => {
                const velocidades: { caminando: number; conduciendo: number } = {
                  caminando: 80,
                  conduciendo: 666,
                };
                const distancia = getDistance(
                  ubicacion.lat,
                  ubicacion.lng,
                  mon.coordenadas.latitud,
                  mon.coordenadas.longitud
                );
                const tiempo = Math.ceil(distancia / velocidades[modoTransporte]);
                return `${tiempo} min`;
              })()}{' '}
              aprox {modoTransporte === 'caminando' ? '🚶‍♂️' : '🚗'}
            </Text>
          </View>
        </View>
      </View>
    );
  })}
</ScrollView>


    {/* Botones al final del panel */}
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 16 }}>
      <TouchableOpacity
        onPress={handleResetTour}
        style={{
          padding: 10,
          backgroundColor: '#c62828',
          borderRadius: 8,
          flex: 1,
          marginRight: 8,
          alignItems: 'center',
        }}
      >
        <Text style={{ color: '#fff', fontWeight: 'bold' }}>Terminar guía</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => setVerMas(false)}
        style={{
          padding: 10,
          backgroundColor: '#2E7D32',
          borderRadius: 8,
          flex: 1,
          marginLeft: 8,
          alignItems: 'center',
        }}
      >
        <Text style={{ color: '#fff', fontWeight: 'bold' }}>Cerrar panel</Text>
      </TouchableOpacity>
    </View>
  </View>
)}


{mostrarFinal && monumentoVisitado && (
  <View style={styles.cardDestinoFinal}>
    <Text style={styles.destinoTitulo}>
      {esUltimoPunto ? '¡Has terminado tu recorrido!' : '¡Haz llegado a un destino!'}
    </Text>
    <Text style={styles.destinoSub}>
      {esUltimoPunto
        ? 'Disfrutaste una ruta con historia y cultura.'
        : 'Estás en un lugar lleno de historia.'}
    </Text>

    <View style={styles.cardContent}>
      <Image source={{ uri: monumentoVisitado.imagenes[0] }} style={styles.cardImage} />
      <View style={{ marginLeft: 10 }}>
        <Text style={styles.cardTitle}>{monumentoVisitado.nombre}</Text>
        <Text style={styles.cardSubtitle}>{monumentoVisitado.categoria}</Text>

      </View>
    </View>

{!esUltimoPunto && (
  <TouchableOpacity
    style={styles.botonConocer}
    onPress={() => {
      setMonumentoSeleccionado(monumentoVisitado);
      router.push({
        pathname: '/pages/monumento/[id]',
        params: { id: monumentoVisitado._id },
      });
    }}
  >
    <Text style={styles.botonTexto}>Conocer más</Text>
  </TouchableOpacity>
)}


    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }}>
      <TouchableOpacity
        onPress={handleResetTour}
        style={{
          backgroundColor: '#c62828',
          paddingVertical: 8,
          borderRadius: 8,
          flex: 1,
          marginRight: 8,
          alignItems: 'center',
        }}
      >
        <Text style={{ color: '#fff', fontWeight: 'bold' }}>
          {esUltimoPunto ? 'Finalizar recorrido' : 'Terminar guía'}
        </Text>
      </TouchableOpacity>

      {!esUltimoPunto && (
        <TouchableOpacity
          onPress={avanzarAlSiguiente}
          style={{
            backgroundColor: '#2E7D32',
            paddingVertical: 8,
            borderRadius: 8,
            flex: 1,
            marginLeft: 8,
            alignItems: 'center',
          }}
        >
          <Text style={{ color: '#fff', fontWeight: 'bold' }}>Siguiente sitio</Text>
        </TouchableOpacity>
      )}
    </View>
  </View>
)}





    {!rutaActual && !tourStarted && (
      <TouchableOpacity style={styles.fab} onPress={() => setModalVisibleRuta(true)}>
        <Feather name="flag" size={24} color="#fff" />
      </TouchableOpacity>
    )}

    {/* {rutaActual && tourStarted &&  (
      <View style={styles.summaryCard}>
        <Text style={styles.summaryText}>📍 Puntos: {rutaActual.puntos.length}</Text>
        <Text style={styles.summaryText}>🚶‍♂️ Pie: {rutaActual.duracionEstimadaPie} min</Text>
        <Text style={styles.summaryText}>🚗 Auto: {rutaActual.duracionEstimadaAuto} min</Text>
        <Text style={styles.summaryText}>🛣️ Ruta: {fmt(totalDistance)}</Text>
        <Text style={styles.summaryText}>➡️ Próx: {fmt(nextPointDistance)}</Text>
      </View>
    )} */}


{!rutaActual && !tourStarted && (
  <>
    {/* Botón para centrar en mi ubicación */}
    <TouchableOpacity
      style={{
        position: 'absolute',
        bottom: 100, // un poco más arriba que la banderita
        right: 25,
        backgroundColor: 'green',
        borderRadius: 28,
        width: 52,
        height: 52,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 6,
        zIndex: 11,
      }}
      onPress={async () => {
        try {
          const pos = await Location.getCurrentPositionAsync();
          const region = {
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
            latitudeDelta: 0.02,
            longitudeDelta: 0.02,
          };
          if (mapRef.current) {
            mapRef.current.animateToRegion(region, 1000);
          }
        } catch {
          Alert.alert('No se pudo obtener tu ubicación');
        }
      }}
    >
      <Feather name="navigation" size={30} color="white" />
    </TouchableOpacity>


  </>
)}

    <Modal transparent visible={modalVisible} animationType="fade">
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>🛠️ Configurar Ruta</Text>

          <Text style={styles.modalLabel}>Modo de transporte:</Text>
          <View style={{ flexDirection: 'row', gap: 10, marginBottom: 12 }}>
            <TouchableOpacity
              style={[
                styles.botonModo,
                modoTransporte === 'caminando' && styles.botonModoActivo,
              ]}
              onPress={() => setModoTransporte('caminando')}
            >
              <Text
                style={[
                  styles.textoModo,
                  modoTransporte === 'caminando' && styles.textoModoActivo,
                ]}
              >
                A pie
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.botonModo,
                modoTransporte === 'conduciendo' && styles.botonModoActivo,
              ]}
              onPress={() => setModoTransporte('conduciendo')}
            >
              <Text
                style={[
                  styles.textoModo,
                  modoTransporte === 'conduciendo' && styles.textoModoActivo,
                ]}
              >
                En auto
              </Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.modalLabel}>Tiempo disponible (en minutos):</Text>
          <TextInput
            style={styles.input}
            keyboardType="number-pad"
            value={inputTiempo}
            onChangeText={setInputTiempo}
            placeholder="Ej: 30"
            placeholderTextColor="#888"
          />
          <Text style={styles.modalLabel}>Tiempo en cada sitio (min):</Text>
<TextInput
  style={styles.input}
  keyboardType="number-pad"
  value={inputEstadia}
  onChangeText={setInputEstadia}
  placeholder="Ej: 5"
  placeholderTextColor="#888"
/>

          <Text style={[styles.modalLabel, { marginTop: 12 }]}>Categorías de interés:</Text>
          <TouchableOpacity
            onPress={() => {
              if (interesesSeleccionados.length === CATEGORIAS.length) {
                CATEGORIAS.forEach(c => toggleInteres(c)); // deselecciona todas
              } else {
                CATEGORIAS.forEach(c => {
                  if (!interesesSeleccionados.includes(c)) toggleInteres(c);
                });
              }
            }}
            style={{ alignSelf: 'flex-end', marginBottom: 8 }}
          >
            <Text style={{ color: '#2E7D32', fontWeight: 'bold' }}>
              {interesesSeleccionados.length === CATEGORIAS.length ? 'Deseleccionar todas' : 'Seleccionar todas'}
            </Text>
          </TouchableOpacity>

          <ScrollView style={[styles.catsContainer, { maxHeight: 160 }]}>
            {CATEGORIAS.map((cat) => {
              const sel = interesesSeleccionados.includes(cat);
              return (
                <TouchableOpacity key={cat} style={styles.catRow} onPress={() => toggleInteres(cat)}>
                  <Feather name={sel ? 'check-square' : 'square'} size={20} color={sel ? '#2E7D32' : '#666'} />
                  <Text style={styles.catLabel}>{cat}</Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
          <View style={styles.modalButtons}>
            <TouchableOpacity onPress={() => setModalVisibleRuta(false)}>
              <Text style={styles.modalCancel}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={onConfirmar}>
              <Text style={styles.modalOk}>Generar Ruta</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>

    <Modal visible={modalResumenVisible} animationType="slide" transparent>
      <View style={styles.modalOverlay}>
        <View style={[styles.modalContent, { maxHeight: '90%' }]}>
          <Text style={styles.modalTitle}>📍 Tu ruta está lista</Text>
          {rutaActual && (
            <>
<View style={{ flexDirection: 'column', alignItems: 'center', marginBottom: 1 }}>


  {/* <Text style={{ color: '#333', marginRight: 6 }}>Duración estimada:</Text>
  {modoTransporte === 'caminando' ? (
    <>
      <Text style={{ fontWeight: 'bold', color: '#2E7D32' }}>
        {rutaActual.duracionEstimadaPie} min
      </Text>
      <Text style={{ marginLeft: 6 }}>🚶‍♂️</Text>
    </>
  ) : (
    <>
      <Text style={{ fontWeight: 'bold', color: '#2E7D32' }}>
        {rutaActual.duracionEstimadaAuto} min
      </Text>
      <Text style={{ marginLeft: 6 }}>🚗</Text>
    </>
  )}
  <Text style={{ color: '#333', marginLeft: 12 }}>
    con{' '}
    <Text style={{ fontWeight: 'bold', color: '#2E7D32' }}>
      {rutaActual.puntos.length}
    </Text>{' '}
    paradas
  </Text> */}
<View style={{ marginBottom: 12 }}>
  {/* Tiempo solo de camino */}
  <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#333' }}>
    Duración estimada de recorrido en{' '}
    {modoTransporte === 'caminando' ? 'modo caminando 🚶‍♂️' : 'modo auto 🚗'}:{' '}
    <Text style={{ color: '#2E7D32' }}>
      {(() => {
        const duracionTotal = modoTransporte === 'caminando'
          ? rutaActual.duracionEstimadaPie
          : rutaActual.duracionEstimadaAuto;
        const totalVisita = rutaActual.puntos.length * tiempoPorSitio;
        return duracionTotal - totalVisita;
      })()} min
    </Text>
  </Text>

  {/* Tiempo de estadía */}
  <Text style={{ fontSize: 14, color: '#555', marginTop: 4 }}>
    Incluye{' '}
    <Text style={{ fontWeight: 'bold', color: '#2E7D32' }}>
      {tiempoPorSitio} min
    </Text>{' '}
    por parada ({rutaActual.puntos.length} paradas ={' '}
    <Text style={{ fontWeight: 'bold', color: '#2E7D32' }}>
      {rutaActual.puntos.length * tiempoPorSitio} min
    </Text>)
  </Text>

  {/* Tiempo total */}
  <Text style={{ fontSize: 15, marginTop: 4, fontWeight: '600', color: '#000' }}>
    🕒 Tiempo total de viaje: {' '}
    {modoTransporte === 'caminando'
      ? rutaActual.duracionEstimadaPie
      : rutaActual.duracionEstimadaAuto}{' '}
    min aprox.
  </Text>
</View>



  
</View>
<View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
      <Text style={{ color: '#555' }}>
    Incluye{' '}
    <Text style={{ fontWeight: 'bold', color: '#2E7D32' }}>
      {inputEstadia} min
    </Text>{' '}
    por parada
  </Text>
</View>

              <ScrollView style={{ marginBottom: 16 }}>
                {rutaActual.puntos.map((punto) => {
                  const monumento = monumentos.find((m) => m._id === punto.monumento);
                  if (!monumento) return null;
                  return (
                    <View key={punto.orden} style={styles.cardResumen}>
                      <View style={styles.verticalLine} />
                      <View style={styles.cardContent}>
                        <Image source={{ uri: monumento.imagenes[0] }} style={styles.cardImage} />
                        <View style={{ flex: 1, marginLeft: 10 }}>
                          <Text style={styles.cardTitle}>{monumento.nombre}</Text>
                          <Text style={styles.cardSubtitle}>{monumento.categoria}</Text>

<Text style={styles.cardDistancia}>
  A {fmt(
    getDistance(
      ubicacion.lat,
      ubicacion.lng,
      monumento.coordenadas.latitud,
      monumento.coordenadas.longitud
    )
  )} –{' '}
  {(() => {
    const velocidades: { caminando: number; conduciendo: number } = { caminando: 80, conduciendo: 666 }; // m/min
    const distancia = getDistance(
      ubicacion.lat,
      ubicacion.lng,
      monumento.coordenadas.latitud,
      monumento.coordenadas.longitud
    );
    
    const tiempo = Math.ceil(distancia / velocidades[modoTransporte]);
    return `${tiempo} min`;
  })()}{' '}
  aprox {modoTransporte === 'caminando' ? '🚶‍♂️' : '🚗'}
</Text>


                        </View>

                      </View>
                    </View>
                  );
                })}
              </ScrollView>
              <TouchableOpacity onPress={() => {
                setModalResumenVisible(false);
                handleStart();
              }} style={styles.startBtn}>
                <Text style={styles.startBtnText}>Comenzar recorrido</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>
    </Modal>
    
  </View>
);

}



const styles = StyleSheet.create({
  container: { flex: 1 },
  encabezado: {
    position: 'absolute',
    top: 50,
    left: 10,
    right: 10,
    zIndex: 999,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fab: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    backgroundColor: '#2E7D32',
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 6,
    zIndex: 10,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 12,
    borderTopWidth: 1,
    borderColor: '#ddd',
  },
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2E7D32',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  btnText: {
    color: '#fff',
    marginLeft: 8,
    fontFamily: 'InterBold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 18,
    fontFamily: 'InterBold',
    marginBottom: 12,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 12,
  },
  catsContainer: {
    marginBottom: 12,
  },
  catRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 6,
  },
  catLabel: {
    marginLeft: 8,
    fontSize: 16,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 20,
  },
  modalCancel: {
    color: '#666',
    fontSize: 16,
  },
  modalOk: {
    color: '#2E7D32',
    fontSize: 16,
    fontFamily: 'InterBold',
  },
    // ↓↓↓ Añadido ↓↓↓
  summaryCard: {
    position: 'absolute',
    top: 120,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 10,
    padding: 12,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    zIndex: 10,
  },
  summaryText: {
    fontSize: 16,
    fontFamily: 'InterBold',
    color: '#333',
    marginBottom: 4,
  },
  modalLabel: {
  fontSize: 16,
  fontWeight: 'bold',
  color: '#333',
  marginBottom: 6,
},
cardResumen: {
  marginBottom: 10,
  position: 'relative',
  paddingLeft: 12,
},

verticalLine: {
  position: 'absolute',
  top: 0,
  bottom: 0,
  left: 6,
  width: 2,
  backgroundColor: '#2E7D32',
  borderRadius: 1,
},

cardContent: {
  flexDirection: 'row',
  alignItems: 'center',
  backgroundColor: '#f9f9f9',
  padding: 10,
  borderRadius: 8,
  elevation: 1,
  marginLeft: 12,
},

cardImage: {
  width: 60,
  height: 60,
  borderRadius: 8,
  backgroundColor: '#ddd',
},

cardTitle: {
  fontSize: 16,
  fontWeight: 'bold',
  color: '#2E7D32',
},

cardSubtitle: {
  fontSize: 14,
  color: '#555',
},

cardDistancia: {
  fontSize: 13,
  color: '#666',
},

startBtn: {
  backgroundColor: '#2E7D32',
  padding: 12,
  borderRadius: 10,
  alignItems: 'center',
},

startBtnText: {
  color: '#fff',
  fontWeight: 'bold',
  fontSize: 16,
},
  distanceContainer: {
    marginTop: 8,
  },
bannerDestino: {
  position: 'absolute',
  bottom: 10,
  left: 20,
  right: 20,
  backgroundColor: '#2E7D32',
  padding: 12,
  borderRadius: 12,
  zIndex: 99,
  flexDirection: 'column', // Para colocar el texto y el icono uno encima del otro
  alignItems: 'center',
},

  bannerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    padding: 10,
    fontSize: 28,
  },
  bannerText: {
    flex: 1,
    marginRight: 10,
  },
  bannerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
  },
  bannerSubtitle: {
    fontSize: 16,
    color: '#fff',
    marginTop: 4,
  },
  transportIconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  transportIcon: {
    fontSize: 24,
    marginLeft: 10,
    color: '#fff',
  },
  distanceInfo: {
    fontSize: 14,
    marginLeft: 6,
    color: '#fff',
  },
  moreButton: {
    backgroundColor: '#fff',
    paddingVertical: 8,
    paddingHorizontal: 30,
    borderRadius: 12,
    marginTop: 8,
    alignItems: 'center',
  },
  moreButtonText: {
    color: '#2E7D32',
    fontWeight: 'bold',
  },

bannerTitulo: {
  fontSize: 16,
  color: '#fff',
  fontWeight: 'bold',
},
bannerSub: {
  fontSize: 14,
  color: '#fff',
  marginTop: 4,
},
bannerBoton: {
  marginTop: 10,
  backgroundColor: '#fff',
  paddingVertical: 6,
  paddingHorizontal: 12,
  borderRadius: 8,
  alignSelf: 'flex-start',
},
bannerBotonTexto: {
  color: '#2E7D32',
  fontWeight: 'bold',
},
panelParadas: {
  position: 'absolute',
  bottom: 10,
  left: 20,
  right: 20,
  backgroundColor: '#fff',
  padding: 16,
  borderRadius: 12,
  elevation: 4,
  zIndex: 100,
  flex: 1,
  maxHeight: '70%',
},
panelTitulo: {
  fontSize: 16,
  fontWeight: 'bold',
  color: '#333',
},
panelSub: {
  fontSize: 14,
  color: '#666',
  marginBottom: 8,
},
verMenos: {
  color: '#2E7D32',
  fontWeight: 'bold',
  textAlign: 'right',
  marginBottom: 8,
},
cardDestinoFinal: {
  position: 'absolute',
  bottom: 10,
  left: 20,
  right: 20,
  backgroundColor: '#fff',
  padding: 16,
  borderRadius: 12,
  elevation: 1,
},
destinoTitulo: {
  fontSize: 16,
  fontWeight: 'bold',
  color: '#333',
  marginBottom: 4,
},
destinoSub: {
  fontSize: 14,
  color: '#666',
  marginBottom: 8,
},
botonConocer: {
  backgroundColor: '#2E7D32',
  paddingVertical: 8,
  borderRadius: 8,
  marginTop: 10,
  alignItems: 'center',
},
botonTexto: {
  color: '#fff',
  fontWeight: 'bold',
},
filtrosRow: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  marginTop: 5,
  paddingRight: 15,
},
botonModo: {
  flex: 1,
  paddingVertical: 8,
  borderRadius: 8,
  borderWidth: 1,
  borderColor: '#2E7D32',
  alignItems: 'center',
},
botonModoActivo: {
  backgroundColor: '#2E7D32',
},
textoModo: {
  color: '#2E7D32',
  fontWeight: 'bold',
},
textoModoActivo: {
  color: '#fff',
},



});
