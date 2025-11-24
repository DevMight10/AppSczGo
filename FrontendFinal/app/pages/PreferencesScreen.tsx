


import React, { useState } from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Alert,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors } from '@/const/color';
import { stylesGlobal } from '@/const/styles';
import ButtonComponent from '../components/buttonComponent';
import { useRouter } from 'expo-router';
import { usePreferencesStore } from '@/store/usePreferencesStore';

export default function InterestsScreen() {
  const router = useRouter();
  const { actualizarPreferencias } = usePreferencesStore();
  const [seleccionados, setSeleccionados] = useState<string[]>([]);

const interesesDisponibles = [
  'Gastronomicos',
  'Monumentos',
  'Museos',
  'Recreativos',
  'Iglesias',
];



  const toggleSeleccion = (interes: string) => {
    setSeleccionados(prev =>
      prev.includes(interes)
        ? prev.filter(i => i !== interes)
        : [...prev, interes]
    );
  };

  const handleRegistrar = async () => {
    if (seleccionados.length === 0) {
      Alert.alert('Selecciona al menos un interés');
      return;
    }
    try {
      // Crear las preferencias iniciales
      await actualizarPreferencias(seleccionados);

      // Navegar a pantalla de bienvenida/confirmación
      router.push('/pages/ConfirmationScreen');
    } catch {
      Alert.alert('Error', 'No se pudo guardar tus intereses');
    }
  };

  return (
    <View style={stylesGlobal.container}>
      <Text style={stl.title}>
        ¿Qué tipo de lugares históricos te gustaría conocer en Santa Cruz?
      </Text>
      <Text style={stl.subtitle}>Selecciona tus intereses turísticos:</Text>

      <Pressable
      style={stl.selectAllBtn}
      onPress={() =>
        setSeleccionados(prev =>
          prev.length === interesesDisponibles.length
            ? []
            : [...interesesDisponibles]
        )
      }
    >
      <Text style={stl.selectAllText}>
        {seleccionados.length === interesesDisponibles.length
          ? 'Deseleccionar todas'
          : 'Seleccionar todas'}
      </Text>
    </Pressable>

      <View style={stl.div}>
        {interesesDisponibles.map(item => {
          const marcado = seleccionados.includes(item);
          return (
            <Pressable
              key={item}
              style={stl.option}
              onPress={() => toggleSeleccion(item)}
            >
              <MaterialIcons
                name={marcado ? 'check-box' : 'check-box-outline-blank'}
                size={30}
                color={colors.verdeOscuro}
              />
              <Text style={stl.label}>{item}</Text>
            </Pressable>
          );
        })}

        <View style={{ marginTop: 30 }}>
          <ButtonComponent label="Registrar" onPress={handleRegistrar} />
        </View>
      </View>
    </View>
  );
}

const stl = StyleSheet.create({
  title: {
    fontSize: 24,
    fontFamily: 'InterBold',
    textAlign: 'center',
    marginBottom: 20,
    color: colors.textoPrincipal,
  },
  subtitle: {
    fontSize: 20,
    fontFamily: 'Inter',
    color: colors.textoSecundario,
    marginBottom: 20,
  },
  div: {
    width: '95%',
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 6,
  },
  label: {
    fontSize: 18,
    fontFamily: 'Inter',
    marginLeft: 10,
    color: colors.textoPrincipal,
  },
    selectAllBtn: {
    alignSelf: 'flex-end',
    marginBottom: 12,
  },
  selectAllText: {
    color: colors.verdeOscuro,
    fontWeight: 'bold',
    fontSize: 14,
  },

});
