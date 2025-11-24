import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Switch,
  Linking,
} from 'react-native';
import * as Location from 'expo-location';
import * as MediaLibrary from 'expo-media-library';
import { useCameraPermissions } from 'expo-camera';
import { Feather } from '@expo/vector-icons';
import { colors } from '@/const/color';
import { stylesGlobal } from '@/const/styles';
import { useRouter } from 'expo-router';
import CardButton from '@/app/components/CardButton';

export default function PrivacySettings() {
  const router = useRouter();

  const [locationEnabled, setLocationEnabled] = useState(false);
  const [cameraEnabled, setCameraEnabled] = useState(false);
  const [galleryEnabled, setGalleryEnabled] = useState(false);

  const [cameraPermission, requestCameraPermission] = useCameraPermissions();

  const checkPermissions = async () => {
    const { status: locStatus } = await Location.getForegroundPermissionsAsync();
    setLocationEnabled(locStatus === 'granted');

    if (cameraPermission) {
      setCameraEnabled(cameraPermission.granted);
    }

    const { status: galStatus } = await MediaLibrary.getPermissionsAsync();
    setGalleryEnabled(galStatus === 'granted');
  };

  useEffect(() => {
    checkPermissions();
  }, [cameraPermission]);

  const openAppSettings = () => {
    Linking.openSettings();
  };

  const toggleLocation = async () => {
    if (locationEnabled) {
      Alert.alert(
        'Desactivar geolocalización',
        'Para desactivar este permiso, ve a la configuración del sistema.',
        [
          { text: 'Cancelar', style: 'cancel' },
          { text: 'Ir a configuración', onPress: openAppSettings },
        ]
      );
      return;
    }

    const { status } = await Location.requestForegroundPermissionsAsync();
    setLocationEnabled(status === 'granted');
    if (status !== 'granted') {
      Alert.alert('Permiso denegado', 'No se pudo activar la geolocalización.');
    }
  };

  const toggleCamera = async () => {
    if (cameraEnabled) {
      Alert.alert(
        'Desactivar cámara',
        'Para desactivar este permiso, ve a la configuración del sistema.',
        [
          { text: 'Cancelar', style: 'cancel' },
          { text: 'Ir a configuración', onPress: openAppSettings },
        ]
      );
      return;
    }

    const result = await requestCameraPermission?.();
    setCameraEnabled(result?.granted ?? false);
    if (!result?.granted) {
      Alert.alert('Permiso denegado', 'No se pudo activar la cámara.');
    }
  };

  const toggleGallery = async () => {
    if (galleryEnabled) {
      Alert.alert(
        'Desactivar acceso a galería',
        'Para desactivar este permiso, ve a la configuración del sistema.',
        [
          { text: 'Cancelar', style: 'cancel' },
          { text: 'Ir a configuración', onPress: openAppSettings },
        ]
      );
      return;
    }

    const { status } = await MediaLibrary.requestPermissionsAsync();
    setGalleryEnabled(status === 'granted');
    if (status !== 'granted') {
      Alert.alert('Permiso denegado', 'No se pudo activar el acceso a la galería.');
    }
  };

  return (
    <View style={stylesGlobal.container}>


      <CardButton text="Permisos y ajustes de privacidad" onPress={() => router.back()} />

      <View style={styles.row}>
        <View style={styles.iconContainer}>
          <Feather name="map-pin" size={24} color={locationEnabled ? colors.verdeOscuro : '#ccc'} />
        </View>
        <View>
          <Text style={styles.label}>Geolocalización</Text>
          <Text style={styles.description}>Acceso a la ubicación del dispositivo</Text>
        </View>
        <Switch
          value={locationEnabled}
          onValueChange={toggleLocation}
          thumbColor={locationEnabled ? colors.verdeOscuro : '#ccc'}
        />
      </View>

      <View style={styles.row}>
        <View style={styles.iconContainer}>
          <Feather name="camera" size={24} color={cameraEnabled ? colors.verdeOscuro : '#ccc'} />
        </View>
        <View>
          <Text style={styles.label}>Cámara</Text>
          <Text style={styles.description}>Acceso a la cámara del dispositivo</Text>
        </View>
        <Switch
          value={cameraEnabled}
          onValueChange={toggleCamera}
          thumbColor={cameraEnabled ? colors.verdeOscuro : '#ccc'}
        />
      </View>

      <View style={styles.row}>
        <View style={styles.iconContainer}>
          <Feather name="image" size={24} color={galleryEnabled ? colors.verdeOscuro : '#ccc'} />
        </View>
        <View>
          <Text style={styles.label}>Multimedia</Text>
          <Text style={styles.description}>Acceso a fotos y archivos multimedia</Text>
        </View>
        <Switch
          value={galleryEnabled}
          onValueChange={toggleGallery}
          thumbColor={galleryEnabled ? colors.verdeOscuro : '#ccc'}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  backButton: {
    padding: 10,
    position: 'absolute',
    top: 10,
    left: 10,
  },
  title: {
    fontSize: 20,
    fontFamily: 'InterBold',
    marginBottom: 20,
    textAlign: 'center',
    color: colors.textoPrincipal,
  },
  card: {
    backgroundColor: colors.blanco,
    borderRadius: 12,
    padding: 20,
    elevation: 4,
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    gap: 20,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontFamily: 'InterBold',
    color: colors.textoPrincipal,
  },
  description: {
    fontSize: 13,
    fontFamily: 'Inter',
    color: colors.textoSecundario,
  },
  iconContainer: {
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15, // Adjust space between icon and text
  },
});
