 // FiltroCategorias.tsx (actualizado con botón circular y menú estilo popover)
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Easing, FlatList } from 'react-native';
import { useMonumentoStore } from '../../store/useMonumentoStore';
import { Ionicons } from '@expo/vector-icons';

const TODAS_CATEGORIAS = [
  'Gastronomicos',
  'Monumentos',
  'Museos',
  'Recreativos',
  'Iglesias', 
];

export default function FiltroCategorias() {
  const [visible, setVisible] = useState(false);
  const slideAnim = useState(new Animated.Value(0))[0];

  const {
    categoriasSeleccionadas,
    toggleCategoria,
    resetCategorias,
  } = useMonumentoStore();

  const toggleMenu = () => {
    if (visible) {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 250,
        easing: Easing.ease,
        useNativeDriver: false,
      }).start(() => setVisible(false));
    } else {
      setVisible(true);
      Animated.timing(slideAnim, {
        toValue: 1,
        duration: 250,
        easing: Easing.ease,
        useNativeDriver: false,
      }).start();
    }
  };

  const scaleAnim = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  const opacityAnim = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.botonCircular} onPress={toggleMenu}>
        <Ionicons name="filter" size={22} color="white" />
      </TouchableOpacity>

      {visible && (
        <Animated.View style={[styles.popover, { transform: [{ scale: scaleAnim }], opacity: opacityAnim }]}>
          <View style={styles.rowButtons}>
            <TouchableOpacity style={styles.botonHecho} onPress={toggleMenu}>
              <Text style={styles.textoHecho}>Hecho</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.botonLimpiar} onPress={resetCategorias}>
              <Text style={styles.textoLimpiar}>Limpiar</Text>
            </TouchableOpacity>
          </View>

          <FlatList
            data={TODAS_CATEGORIAS}
            keyExtractor={(item) => item}
            style={styles.lista}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => toggleCategoria(item)}
                style={[styles.itemCategoria, categoriasSeleccionadas.includes(item) && styles.categoriaActiva]}
              >
                <Text
                  style={[
                    styles.textoCategoria,
                    categoriasSeleccionadas.includes(item) && styles.textoCategoriaActiva,
                  ]}
                >
                  {item}
                </Text>
              </TouchableOpacity>
            )}
          />
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 10,
    left: 20,
    zIndex: 999,
  },
  botonCircular: {
    width: 42,
    height: 42,
    backgroundColor: 'green',
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
  },
  popover: {
    position: 'absolute',
    top: 40,
    left: 40,
    width: 280,
    maxHeight: 305,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    elevation: 8,
    borderColor: 'green', // ✅ borde verde
    borderWidth: 1.5,
  },
  rowButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  botonHecho: {
    backgroundColor: 'green',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  textoHecho: {
    color: '#fff',
    fontWeight: '600',
  },
  botonLimpiar: {
    backgroundColor: '#F44336',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  textoLimpiar: {
    color: '#fff',
    fontWeight: '600',
  },
  lista: {
    paddingBottom: 10,
  },
  itemCategoria: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderBottomWidth: 2,
    borderBottomColor: '#eee',
    alignItems: 'center',
  },
  categoriaActiva: {
    backgroundColor: '#C8E6C9',
    borderRadius: 8,
    borderColor: 'green'
  },
  textoCategoria: {
    color: '#333',
    fontSize: 15,
    fontWeight: '600'
  },
  textoCategoriaActiva: {
    fontWeight: '600',
    color: '#2E7D32',
  },
});