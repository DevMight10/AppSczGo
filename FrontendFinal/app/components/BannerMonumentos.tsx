import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Image } from 'react-native';
import { Monumento } from '../../types/Monumento';
import { useMonumentoStore } from '../../store/useMonumentoStore';
import BotonVisitar from './BotonVisitar';
import { useRouter } from 'expo-router';

interface BannerMonumentosProps {
  cercanos: Monumento[];
}

export default function BannerMonumentos({ cercanos }: BannerMonumentosProps) {
  const [expandido, setExpandido] = useState(false);
  const { setMonumentoSeleccionado } = useMonumentoStore();
  const router = useRouter();

  const handleToggle = () => setExpandido(!expandido);

  return (
    <View style={styles.banner}>
      <View style={styles.headerRow}>
        <Text style={styles.titulo}>{cercanos.length} lugares cercanos</Text>
        <TouchableOpacity onPress={handleToggle}>
          <Text style={styles.verMas}>{expandido ? 'Ver menos' : 'Ver más'}</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.subtitulo}>Explora monumentos cercanos</Text>

      {expandido && (
        <FlatList
          data={cercanos}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Image source={{ uri: item.imagenes?.[0] ?? 'https://via.placeholder.com/60' }} style={styles.img} />
              <View style={styles.info}>
                <Text style={styles.nombre}>{item.nombre}</Text>
                <Text style={styles.categoria}>{item.categoria}</Text>
                <Text style={styles.distancia}>A {Math.round(item.distancia ?? 0)} M</Text>

                <View style={styles.botonesRow}>
                  <View style={{ flex: 1 }}>
                    <BotonVisitar monumento={item} />
                  </View>

                  <TouchableOpacity
                    style={styles.btnConocer}
                    onPress={() => {
                      setMonumentoSeleccionado(item);
                      router.push({
                        pathname: '/pages/monumento/[id]',
                        params: { id: item._id },
                      });
                    }}
                  >
                    <Text style={styles.btnTextSecundario}>conocer más</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
  position: 'absolute',
  bottom: 20,
  left: 10,
  right: 10,
  backgroundColor: '#fff',
  padding: 12,
  borderRadius: 12,

  borderWidth: 1,
  borderColor: 'green',

  shadowColor: '#000',
  shadowOpacity: 0.15,
  shadowOffset: { width: 0, height: 1 },
  shadowRadius: 4,
  elevation: 4,
  zIndex: 999,
},

  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  titulo: {
    fontFamily: 'Inter-Bold',
    fontWeight: 'bold',
    fontSize: 20,
    color: '#333',
  },
  verMas: {
    color: '#367C28',
    fontWeight: '600',
    borderWidth: 1,
    borderColor: '#367C28',
    borderRadius: 9,
    paddingVertical: 2,
    paddingHorizontal: 20,
    marginRight: 10,
  },
  subtitulo: {
    fontFamily: 'Inter',
    color: '#666',
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 8,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 30,
    marginBottom: 5,
  },
  img: {
    width: 90,
    height: 90,
    borderRadius: 8,
  },
  info: {
    flex: 1,
  },
  nombre: {
    fontWeight: '500',
    fontSize: 14,
    color: '#000',
  },
  categoria: {
    color: '#666',
    fontSize: 13,
  },
  distancia: {
    color: '#4CAF50',
    marginTop: 2,
    fontSize: 13,
  },
  botonesRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 8,
  },
  btnVisitar: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 14,
    paddingVertical: 5,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  btnConocer: {
    backgroundColor: '#eee',
    paddingHorizontal: 14,
    paddingVertical: 5,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  btnText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  btnTextSecundario: {
    color: '#333',
    fontWeight: '600',
    fontSize: 14,
    padding: 5
  },
  separator: {
    height: 10,
    borderBottomWidth: 2,
    borderBottomColor: '#eee',
    marginVertical: 5,
    marginBottom: 25,
  },
});
