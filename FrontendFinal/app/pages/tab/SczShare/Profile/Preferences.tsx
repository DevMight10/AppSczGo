// app/pages/tab/Profile/Preferences.tsx
import { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { stylesGlobal } from '@/const/styles';
import CardButton from '@/app/components/CardButton';
import { colors } from '@/const/color';
import { Feather } from '@expo/vector-icons';
import { usePreferencesStore } from '@/store/usePreferencesStore';
import React from 'react';

const interesesDisponibles = [
  'Gastronomicos',
  'Monumentos',
  'Museos',
  'Recreativos',
  'Iglesias',
];

export default function Preferences() {
  const router = useRouter();
  const { preferencias, setPreferencias, actualizarPreferencias, cargarPreferencias } = usePreferencesStore();
  const [seleccionados, setSeleccionados] = useState<string[]>([]);

  useEffect(() => {
    const cargar = async () => {
      await cargarPreferencias();
    };
    cargar();
  }, []);

  useEffect(() => {
    setSeleccionados(preferencias);
  }, [preferencias]);

  const toggleSeleccion = (interes: string) => {
    setSeleccionados((prev) =>
      prev.includes(interes)
        ? prev.filter((i) => i !== interes)
        : [...prev, interes]
    );
  };

  const guardar = async () => {
    try {
      await actualizarPreferencias(seleccionados);
      Alert.alert('Preferencias actualizadas');
      router.back();
    } catch (error) {
      Alert.alert('Error', 'No se pudo actualizar tus preferencias');
    }
  };

  return (
    <View style={stylesGlobal.container}>
      <CardButton text="Editar preferencias" onPress={() => router.back()} />
      <View style={styles.preferenceBox}>
        <Text style={styles.title}>Selecciona tus intereses:</Text>

        <TouchableOpacity
          style={styles.selectAllButton}
        onPress={() =>
          setSeleccionados(prev =>
            prev.length === interesesDisponibles.length
                ? []
                : [...interesesDisponibles]
            )
          }
          activeOpacity={0.7}
        >
          <Text style={styles.selectAllText}>
            {seleccionados.length === interesesDisponibles.length
              ? 'Deseleccionar todas'
              : 'Seleccionar todas'}
          </Text>
        </TouchableOpacity>

        {interesesDisponibles.map((item) => {
          const marcado = seleccionados.includes(item);
          return (
            <TouchableOpacity
              key={item}
              style={styles.checkboxRow}
              onPress={() => toggleSeleccion(item)}
              activeOpacity={0.7}
            >
              <View
                style={[styles.checkbox, marcado && styles.checkboxMarcado]}
              >
                {marcado && (
                  <Feather name="check" size={16} color={colors.blanco} />
                )}
              </View>
              <Text style={styles.checkboxLabel}>{item}</Text>
            </TouchableOpacity>
          );
        })}
        <TouchableOpacity style={styles.saveButton} onPress={guardar}>
          <Text style={styles.saveText}>Guardar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  preferenceBox: {
    backgroundColor: colors.blanco,
    padding: 24,
    borderRadius: 16,
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
    marginBottom: 30,
    width: '100%',
  },
  title: {
    fontSize: 17,
    fontFamily: 'InterBold',
    color: colors.textoPrincipal,
    marginBottom: 16,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: colors.verdeOscuro,
    borderRadius: 6,
    marginRight: 12,
    backgroundColor: colors.blanco,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxMarcado: {
    backgroundColor: colors.verdeOscuro,
  },
  checkboxLabel: {
    fontSize: 16,
    color: colors.textoPrincipal,
  },
  saveButton: {
    marginTop: 24,
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
  selectAllButton: {
    alignSelf: 'flex-end',
    marginBottom: 12,
  },
  selectAllText: {
    color: colors.verdeOscuro,
    fontWeight: 'bold',
    fontSize: 14,
  },

});
