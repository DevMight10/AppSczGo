// app/pages/tab/Profile/EditProfile.tsx
import { View, Text, StyleSheet, Image, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { colors } from '@/const/color';
import { stylesGlobal } from '@/const/styles';
import CardButton from '@/app/components/CardButton';
import { useProfileStore } from '@/store/useProfileStore';
import { useState, useEffect } from 'react';
import * as ImagePicker from 'expo-image-picker';
import React from 'react';

export default function EditProfile() {
  const router = useRouter();
  const { nombre, correo, fotoPerfil, actualizarPerfil, setAvatar, cargarPerfil } = useProfileStore();

  const [nuevoNombre, setNuevoNombre] = useState(nombre);
  const [nuevoCorreo, setNuevoCorreo] = useState(correo);
  const [imageUri, setImageUri] = useState(fotoPerfil);

  useEffect(() => {
    setNuevoNombre(nombre);
    setNuevoCorreo(correo);
    setImageUri(fotoPerfil);
  }, [nombre, correo, fotoPerfil]);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== 'granted') {
      Alert.alert('Permiso denegado', 'Necesitas permitir acceso a la galería.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
      allowsEditing: true,
      aspect: [1, 1],
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      setImageUri(uri);
      setAvatar(uri);
    }
  };

const guardarCambios = async () => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (nuevoNombre.trim() === '' || nuevoCorreo.trim() === '') {
    Alert.alert('Campos requeridos', 'Por favor, completa ambos campos: nombre y correo.');
    return;
  }

  if (!emailRegex.test(nuevoCorreo)) {
    Alert.alert('Correo inválido', 'Por favor, ingresa un correo electrónico válido.');
    return;
  }

  try {
    await actualizarPerfil({
      nombre: nuevoNombre,
      correo: nuevoCorreo,
      fotoPerfil: imageUri,
    });

    await cargarPerfil();

    Alert.alert('Cambios guardados', 'Tu perfil se actualizó correctamente');
    router.back();
  } catch (error: any) {
    const mensaje = error?.response?.data?.mensaje || 'No se pudo actualizar tu perfil.';
    console.error('Error al actualizar perfil:', mensaje);
    Alert.alert('Error', mensaje);
  }
};
;

  return (
    <View style={stylesGlobal.container}>
      <CardButton text="Editar información" onPress={() => router.back()} />

      <View style={styles.centeredSection}>
        <Image source={{ uri: imageUri || 'https://via.placeholder.com/100' }} style={styles.avatar} />
        <TouchableOpacity style={styles.buttonChangePhoto} onPress={pickImage}>
          <Text style={styles.buttonText}>Cambiar foto</Text>
          <Feather name="chevron-right" size={16} color={colors.verdeOscuro} />
        </TouchableOpacity>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Nombre:</Text>
        <TextInput
          style={styles.input}
          value={nuevoNombre}
          onChangeText={setNuevoNombre}
          placeholder="Nombre completo"
        />

        <Text style={styles.label}>Correo:</Text>
        <TextInput
          style={styles.input}
          value={nuevoCorreo}
          onChangeText={setNuevoCorreo}
          placeholder="Correo electrónico"
          keyboardType="email-address"
        />

        <TouchableOpacity style={styles.saveButton} onPress={guardarCambios}>
          <Text style={styles.saveText}>Guardar</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.bottomButton}>
        <Text style={styles.changePassText}>Cambiar contraseña</Text>
        <Feather name="chevron-right" size={16} color={colors.verdeOscuro} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  centeredSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 8,
  },
  buttonChangePhoto: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.blanco,
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 8,
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
  },
  buttonText: {
    fontSize: 14,
    color: colors.textoPrincipal,
    marginRight: 4,
  },
  card: {
    backgroundColor: colors.blanco,
    padding: 20,
    borderRadius: 12,
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
    width: '100%',
  },
  label: {
    fontFamily: 'InterBold',
    marginBottom: 6,
    color: colors.textoPrincipal,
  },
  input: {
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    marginBottom: 16,
  },
  saveButton: {
    backgroundColor: colors.verdeOscuro,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveText: {
    color: colors.blanco,
    fontWeight: 'bold',
    fontSize: 16,
  },
  bottomButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 40,
    paddingVertical: 16,
    paddingHorizontal: 12,
  },
  changePassText: {
    fontSize: 15,
    color: colors.textoPrincipal,
  },
});
