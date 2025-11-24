import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

export default function Index() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verificarSesion = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        if (token) {
          router.replace('/pages/tab'); // usuario autenticado
        } else {
          router.replace('/pages/WelcomeScreen'); // usuario nuevo o sin sesión
        }
      } catch (error) {
        console.error("Error verificando sesión:", error);
        router.replace('/pages/WelcomeScreen');
      } finally {
        setLoading(false);
      }
    };

    verificarSesion();
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return null;
}
