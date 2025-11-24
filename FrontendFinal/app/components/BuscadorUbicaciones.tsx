import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  FlatList,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Monumento } from '../../types/Monumento';
import { useMonumentoStore } from '../../store/useMonumentoStore';

interface Props {
  setRegion: (region: {
    latitude: number;
    longitude: number;
    latitudeDelta: number;
    longitudeDelta: number;
  }) => void;
}

export default function BuscadorUbicaciones({ setRegion }: Props) {
  const [visible, setVisible] = useState(false);
  const [query, setQuery] = useState('');
  const [resultados, setResultados] = useState<Monumento[]>([]);
  const { monumentos } = useMonumentoStore();

  const handleSearch = (text: string) => {
    setQuery(text);
    if (text.trim() === '') {
      setResultados([]);
      return;
    }
    const filtrados = monumentos.filter((m) =>
      m.nombre.toLowerCase().includes(text.toLowerCase())
    );
    setResultados(filtrados);
  };

  const centrarMapa = (monumento: Monumento) => {
    setRegion({
      latitude: monumento.coordenadas.latitud,
      longitude: monumento.coordenadas.longitud,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    });
    setVisible(false);
    setQuery('');
    setResultados([]);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.botonCircular} onPress={() => setVisible(!visible)}>
        <Ionicons name="search" size={22} color="white" />
      </TouchableOpacity>

      {visible && (
        <View style={styles.popover}>
          <TextInput
            placeholder="Buscar lugar..."
            value={query}
            onChangeText={handleSearch}
            style={styles.input}
            autoFocus
          />
          <FlatList
            data={resultados}
            keyExtractor={(item) => item._id}
            style={styles.resultList}
            ListEmptyComponent={
              query.trim() !== '' ? (
                <Text style={styles.noResult}>Ubicación no encontrada</Text>
              ) : null
            }
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.item} onPress={() => centrarMapa(item)}>
                <Text style={styles.itemTexto}>{item.nombre}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 10,
    right: 20,
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
    top: 50,
    right: 0,
    width: 260,
    maxHeight: 300,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    elevation: 8,
    borderColor: 'green',
    borderWidth: 1.5,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 10,
    marginBottom: 8,
  },
  resultList: {
    maxHeight: 220, // ✅ Scrollable height for the result list
  },
  item: {
    paddingVertical: 8,
  },
  itemTexto: {
    fontSize: 15,
    color: '#333',
  },
  noResult: {
    fontStyle: 'italic',
    color: '#888',
    textAlign: 'center',
    marginTop: 10,
  },
});
