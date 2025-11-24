import React, { useRef, useState } from 'react';
import { View, Text, TouchableOpacity, Image, ActivityIndicator, Modal, StyleSheet } from 'react-native';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../const/color'; // Ajusta la ruta si es necesario

interface CameraComponentProps {
  onCapture: (uri: string) => void;
}

export default function CameraComponent({ onCapture }: CameraComponentProps) {
  const [permission, requestPermission] = useCameraPermissions();
  const [mediaPermission, requestMediaPermission] = MediaLibrary.usePermissions();
  const [type, setType] = useState<CameraType>('back');
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [cameraVisible, setCameraVisible] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const cameraRef = useRef<any>(null);

  const openCamera = async () => {
    if (!permission) return;
    if (!permission.granted) {
      await requestPermission();
      if (!permission.granted) return;
    }
    setCameraVisible(true);
  };

  const takePhoto = async () => {
    if (!cameraRef.current) return;
    setIsLoading(true);
    try {
      const photo = await cameraRef.current.takePictureAsync();
      setPhotoUri(photo.uri);
    } catch (e) {
      console.error('Error al tomar foto', e);
    } finally {
      setIsLoading(false);
    }
  };

  // Guardar en álbum personalizado y mostrar modal elegante
  const handleSavePhoto = async () => {
    try {
      if (!mediaPermission || !mediaPermission.granted) {
        await requestMediaPermission();
      }
      // 1. Crear el asset de la foto
      const asset = await MediaLibrary.createAssetAsync(photoUri!);
      // 2. Intentar buscar el álbum
      let album = await MediaLibrary.getAlbumAsync('SCZGO');
      // 3. Si no existe, crearlo
      if (!album) {
        album = await MediaLibrary.createAlbumAsync('SCZGO', asset, false);
      } else {
        // 4. Si existe, añadir la foto al álbum
        await MediaLibrary.addAssetsToAlbumAsync([asset], album, false);
      }
      // Mostrar modal elegante de éxito
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 1300);

      setPhotoUri(null);
      setCameraVisible(false);
      if (onCapture) onCapture(photoUri!);
    } catch (e) {
      alert('No se pudo guardar la foto.');
      console.error('Error al guardar foto', e);
    }
  };

  return (
    <View>
      <TouchableOpacity style={styles.mainButton} onPress={openCamera}>
        <Ionicons name="camera-outline" size={30} color={colors.verdeOscuro} />
        {/* <Text style={styles.mainButtonText}>Tomar foto</Text> */}
      </TouchableOpacity>

      {/* Modal elegante de éxito */}
      <Modal transparent visible={showSuccess}>
        <View style={styles.successModalBoxBg}>
          <View style={styles.successModalBox}>
            <Ionicons name="checkmark-circle-outline" size={56} color={colors.verdeOscuro} style={{ marginBottom: 10 }} />
            <Text style={styles.successTextBox}>¡Foto guardada en SCZGO!</Text>
          </View>
        </View>
      </Modal>

      {/* Preview de la última foto tomada */}
      <Modal visible={cameraVisible} animationType="slide">
        {photoUri ? (
          <View style={styles.previewContainer}>
            <Image source={{ uri: photoUri }} style={styles.previewImage} />
            <TouchableOpacity style={styles.saveButton} onPress={handleSavePhoto}>
              <Ionicons name="download-outline" size={18} color="#fff" />
              <Text style={styles.saveButtonText}>Guardar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.retakeButton} onPress={() => setPhotoUri(null)}>
              <Ionicons name="refresh" size={18} color="#fff" />
              <Text style={styles.retakeButtonText}>Volver a tomar</Text>
            </TouchableOpacity>
          </View>
        ) : (!permission || !permission.granted) ? (
          <View style={styles.centered}>
            <Text style={styles.noPermText}>No hay permisos para la cámara</Text>
            <TouchableOpacity style={styles.permissionButton} onPress={requestPermission}>
              <Text style={styles.permissionButtonText}>Solicitar permisos</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.cameraWrapper}>
            <CameraView
              style={styles.camera}
              ref={cameraRef}
              facing={type}
            >
              <View style={styles.cameraControls}>
                <TouchableOpacity
                  style={styles.controlButton}
                  onPress={() => setType(type === 'back' ? 'front' : 'back')}
                >
                  <Ionicons name="camera-reverse-outline" size={28} color="#fff" />
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.captureButton}
                  onPress={takePhoto}
                  disabled={isLoading}
                >
                  {isLoading
                    ? <ActivityIndicator color="#fff" />
                    : <Ionicons name="camera" size={32} color="#fff" />
                  }
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.controlButton}
                  onPress={() => {
                    setCameraVisible(false);
                    setPhotoUri(null);
                  }}
                >
                  <Ionicons name="close-circle-outline" size={28} color="#fff" />
                </TouchableOpacity>
              </View>
            </CameraView>
          </View>
        )}
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
mainButton: {
  padding: 14,
  alignSelf: 'center',
  // marginVertical: 18,
},

  mainButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    marginLeft: 8,
    fontSize: 16,
  },
  successModalBoxBg: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0009',
  },
  successModalBox: {
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingVertical: 36,
    paddingHorizontal: 36,
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#333',
    shadowOpacity: 0.13,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
  },
  successTextBox: {
    color: colors.verdeOscuro,
    fontWeight: 'bold',
    fontSize: 20,
    textAlign: 'center',
    marginTop: 8,
  },
  previewContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#222',
  },
  previewImage: {
    width: 260,
    height: 260,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: colors.verdeOscuro,
    marginBottom: 22,
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.verdeOscuro,
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 14,
    marginBottom: 12,
    elevation: 2,
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    marginLeft: 8,
    fontSize: 16,
  },
  retakeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#444',
    paddingVertical: 8,
    paddingHorizontal: 18,
    borderRadius: 14,
    marginBottom: 18,
    elevation: 2,
  },
  retakeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    marginLeft: 5,
    fontSize: 15,
  },
  cameraWrapper: {
    flex: 1,
    backgroundColor: '#000',
  },
  camera: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  cameraControls: {
    position: 'absolute',
    bottom: 28,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  captureButton: {
    backgroundColor: colors.verdeOscuro,
    width: 66,
    height: 66,
    borderRadius: 33,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
  },
  controlButton: {
    backgroundColor: '#333c',
    padding: 10,
    borderRadius: 24,
    alignItems: 'center',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noPermText: {
    color: colors.verdeOscuro,
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 16,
  },
  permissionButton: {
    backgroundColor: colors.verdeOscuro,
    padding: 12,
    borderRadius: 10,
    marginTop: 6,
  },
  permissionButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
  },
});
