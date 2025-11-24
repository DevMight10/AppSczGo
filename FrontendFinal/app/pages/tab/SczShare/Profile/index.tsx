// app/pages/tab/Profile/Profile.tsx
import { View, Text, StyleSheet, Image, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { stylesGlobal } from '@/const/styles';
import { colors } from '@/const/color';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NavShare from '@/app/components/navShare';

import { usePreferencesStore } from '@/store/usePreferencesStore';
import { useProfileStore } from '@/store/useProfileStore';
import React from 'react';
import CardButton from '@/app/components/CardButton';


export default function Profile() {
  const router = useRouter();
  const { preferencias, cargarPreferencias } = usePreferencesStore();
  const { nombre, correo, fotoPerfil, cargarPerfil, resetPerfil } = useProfileStore();

  useEffect(() => {
    cargarPerfil();
    cargarPreferencias();
  }, []);

  const cerrarSesion = async () => {
    try {
      await AsyncStorage.removeItem('token');
      await AsyncStorage.removeItem('nombreUsuario');
      resetPerfil(); // 🧹 Limpia el estado global de perfil

      Alert.alert('Sesión cerrada', 'Tu sesión ha sido cerrada correctamente.');
      router.replace('/pages/WelcomeScreen'); // Redirige a inicio o login
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      Alert.alert('Error', 'No se pudo cerrar la sesión.');
    }
  };

return (
  <View style={styles.container}>
    <NavShare />
    <ScrollView
      contentContainerStyle={{
        flexGrow: 1,
        justifyContent: 'space-between',
      }}
      showsVerticalScrollIndicator={false}
    >
      
      <View>
        

        {/* Perfil */}
        <View style={styles.card}>
          <View style={styles.row}>
            <View style={styles.avatarShadow}>
              <Image
                source={{ uri: fotoPerfil || 'https://via.placeholder.com/100' }}
                style={styles.avatar}
              />
            </View>
            <View>
              <Text style={styles.name}>{nombre}</Text>
              <Text style={styles.email}>{correo}</Text>
              <TouchableOpacity
                style={[styles.button, { width: 160 }]}
                onPress={() => router.push('/pages/tab/SczShare/Profile/EditProfile')}
              >
                <Text style={styles.buttonText}>Editar información</Text>
                <Feather name="chevron-right" size={20} color={colors.verdeOscuro} />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Preferencias */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Preferencias</Text>
          {preferencias.length > 0 && (
            <View style={styles.preferences}>
              {preferencias.map((item) => (
                <Text key={item} style={styles.badge}>
                  {item}
                </Text>
              ))}
            </View>
          )}
          <TouchableOpacity
            style={[styles.button, { width: 180 }]}
            onPress={() => router.push('../SczShare/Profile/Preferences')}
          >
            <Text style={styles.buttonText}>Editar preferencias</Text>
            <Feather name="chevron-right" size={20} color={colors.verdeOscuro} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Ajustes y cerrar sesión */}
      <View style={styles.bottomSection}>
        <TouchableOpacity style={styles.optionRow}  onPress={() => router.push('../SczShare/Profile/PrivacySettings')}>
          <Text style={styles.optionText}>Permisos y ajustes de privacidad</Text>
          <Feather name="chevron-right" size={20} color={colors.verdeOscuro} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.optionRow}  onPress={() => router.push('/legal/Terminos')}>
          <Text style={styles.optionText}>Términos y Condiciones de Uso</Text>
          <Feather name="chevron-right" size={20} color={colors.verdeOscuro} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.optionRow} onPress={() => router.push('../SczShare/Profile/MisRutas')}>
        <Text style={styles.optionText}>Mis rutas</Text>
        <Feather name="chevron-right" size={20} color={colors.verdeOscuro} />
      </TouchableOpacity>

        <TouchableOpacity style={styles.optionRow} onPress={cerrarSesion}>
          <Text style={styles.optionText}>Cerrar sesión</Text>
          <Feather name="chevron-right" size={20} color={colors.verdeOscuro} />
        </TouchableOpacity>
      </View>
    </ScrollView>
  </View>
);


}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 40,
    paddingHorizontal: 30,
    backgroundColor: colors.blanco,
    flex: 1,
  },

  title: {
    fontSize: 22,
    fontFamily: 'InterBold',
    color: colors.textoPrincipal,
  },
  card: {
    width: '100%',
    backgroundColor: colors.blanco,
    padding: 20,
    borderRadius: 12,
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
    marginBottom: 30,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarShadow: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 6,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  name: {
    fontSize: 18,
    fontFamily: 'InterBold',
    color: colors.textoPrincipal,
  },
  email: {
    fontSize: 14,
    color: colors.textoSecundario,
  },
  button: {
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderColor: colors.grisClaro,
    borderWidth: 1,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  buttonText: {
    fontSize: 14,
    color: colors.textoPrincipal,
  },
  badge: {
    backgroundColor: colors.verdeOscuro,
    color: colors.blanco,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    fontSize: 13,
  },
  preferences: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 16,
  },
  sectionTitle: {
    fontFamily: 'InterBold',
    fontSize: 16,
    color: colors.textoPrincipal,
    marginBottom: 12,
  },
  bottomSection: {
    width: '100%',
    marginTop: 60,
    gap: 10,
  },
  optionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.grisClaro,
  },
  optionText: {
    fontSize: 15,
    color: colors.textoPrincipal,
  },
});
