import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TextInput, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/const/color';
import api from '../../../../api/axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

export default function FormPost() {
  const [image, setImage] = useState<string | null>(null);
  const [desc, setDesc] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.85,
    });
    if (!result.canceled && result.assets && result.assets[0]?.uri) {
      setImage(result.assets[0].uri);
    }
  };

  const handlePublish = async () => {
    if (!image) {
      Alert.alert('Elige una imagen para publicar.');
      return;
    }
    if (!desc.trim()) {
      Alert.alert('Agrega una descripción para tu publicación.');
      return;
    }
    setLoading(true);

    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        Alert.alert('Sesión expirada', 'Vuelve a iniciar sesión.');
        setLoading(false);
        return;
      }

      const formData = new FormData();
      formData.append('foto', {
        uri: image,
        name: 'publicacion.jpg',
        type: 'image/jpeg',
      } as any);
      formData.append('descripcion', desc);

      await api.post('/publicaciones', formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      setImage(null);
      setDesc('');
      Alert.alert('¡Publicado!', 'Tu publicación se ha compartido correctamente.');
      router.back(); // Regresa a la pantalla anterior
    } catch (e) {
      Alert.alert('Error', 'No se pudo publicar. Intenta de nuevo.');
    }
    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Nueva publicación</Text>
      <View style={styles.imgPickerWrapper}>
        {image ? (
          <Image source={{ uri: image }} style={styles.previewImg} />
        ) : (
          <TouchableOpacity style={styles.imgPicker} onPress={pickImage}>
            <Ionicons name="images-outline" size={46} color={colors.verdeOscuro} />
            <Text style={styles.imgPickerText}>Elegir imagen</Text>
          </TouchableOpacity>
        )}
      </View>

      <TextInput
        style={styles.input}
        placeholder="Escribe una descripción..."
        placeholderTextColor="#999"
        value={desc}
        onChangeText={setDesc}
        maxLength={220}
        multiline
      />

      <View style={styles.buttonsRow}>
        <TouchableOpacity style={styles.cancelBtn} onPress={() => router.back()} disabled={loading}>
          <Text style={styles.cancelText}>Cancelar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.publishBtn} onPress={handlePublish} disabled={loading}>
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.publishText}>Publicar</Text>}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
  title: {
    color: colors.verdeOscuro,
    fontWeight: 'bold',
    fontSize: 22,
    marginBottom: 14,
    alignSelf: 'center',
  },
  imgPickerWrapper: {
    marginVertical: 8,
    alignItems: 'center',
    width: '100%',
  },
  imgPicker: {
    backgroundColor: colors.verdeOscuro + '14',
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: colors.verdeOscuro,
    paddingVertical: 30,
    paddingHorizontal: 34,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imgPickerText: {
    color: colors.verdeOscuro,
    marginTop: 7,
    fontWeight: 'bold',
    fontSize: 16,
  },
  previewImg: {
    width: 210,
    height: 210,
    borderRadius: 13,
    borderWidth: 2,
    borderColor: colors.verdeOscuro,
    marginBottom: 8,
  },
  input: {
    width: '100%',
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    borderWidth: 1.2,
    borderColor: colors.verdeOscuro + '55',
    color: colors.verdeOscuro,
    padding: 13,
    fontSize: 16,
    marginTop: 10,
    marginBottom: 14,
    minHeight: 52,
    maxHeight: 110,
  },
  buttonsRow: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'flex-end',
    marginTop: 7,
  },
  cancelBtn: {
    paddingVertical: 11,
    paddingHorizontal: 18,
    borderRadius: 10,
    backgroundColor: '#ddd',
    marginRight: 14,
  },
  cancelText: {
    color: colors.verdeOscuro,
    fontWeight: 'bold',
    fontSize: 16,
  },
  publishBtn: {
    paddingVertical: 11,
    paddingHorizontal: 22,
    borderRadius: 10,
    backgroundColor: colors.verdeOscuro,
  },
  publishText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
