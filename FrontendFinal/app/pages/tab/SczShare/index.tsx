import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, StyleSheet, ActivityIndicator, RefreshControl, TouchableOpacity, Modal, Pressable, Alert } from 'react-native';
import NavShare from '@/app/components/navShare';
import api from '@/api/axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors } from '@/const/color';
import { Ionicons } from '@expo/vector-icons';

type Post = {
  _id: string;
  fotoUrl: string;
  usuarioNombre: string;
  descripcion: string;
  fecha: string;
  likes: string[];
};

export default function AllPostsScreen() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const id = await AsyncStorage.getItem('usuarioId');
      setUserId(id);
      fetchPosts();
    })();
  }, []);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await api.get('/publicaciones', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPosts(response.data || []);
    } catch (error) {
      setPosts([]);
    }
    setLoading(false);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchPosts();
    setRefreshing(false);
  };

  // Like funcional, llama al backend y actualiza la cantidad
  const handleLike = async (postId: string) => {
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await api.put(`/publicaciones/${postId}/like`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      // Actualizar los likes localmente
      setPosts(posts =>
        posts.map(post =>
          post._id === postId
            ? { ...post, likes: response.data.likes ? Array(response.data.likes).fill('') : [] }
            : post
        )
      );
    } catch (error) {
      Alert.alert('Error', 'No se pudo actualizar el like.');
    }
  };

  // Renderizar cada publicación
  const renderPost = ({ item }: { item: Post }) => (
    <View style={styles.card}>
      {/* Encabezado */}
      <View style={styles.headerRow}>
        <Ionicons name="person" size={18} color={colors.verdeOscuro} style={{ marginRight: 5 }} />
        <Text style={styles.user}>{item.usuarioNombre}</Text>
      </View>
      {/* Descripción */}
      <Text style={styles.desc}>{item.descripcion}</Text>
      {/* Imagen */}
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={() => {
          setSelectedImage(item.fotoUrl);
          setModalVisible(true);
        }}
      >
        <Image source={{ uri: item.fotoUrl }} style={styles.image} />
      </TouchableOpacity>
      {/* Like y Fecha */}
      <View style={styles.footerRow}>
        <TouchableOpacity
          style={styles.likeBtn}
          onPress={() => handleLike(item._id)}
          activeOpacity={0.8}
        >
          <Ionicons
            name={item.likes && userId && item.likes.includes(userId) ? "heart" : "heart-outline"}
            size={22}
            color={item.likes && userId && item.likes.includes(userId) ? "#0b7d34" : colors.verdeOscuro}
          />
          <Text style={[styles.likeText, item.likes && userId && item.likes.includes(userId) && { color: "#0b7d34" }]}>
            {" "}{item.likes ? item.likes.length : 0}
          </Text>
        </TouchableOpacity>
        <Text style={styles.date}>{new Date(item.fecha).toLocaleDateString()}</Text>
      </View>
      {/* Modal para mostrar imagen grande */}
      <Modal
        animationType="fade"
        transparent
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <Pressable style={styles.modalBackdrop} onPress={() => setModalVisible(false)}>
          <View style={styles.modalContent}>
            <Image
              source={{ uri: selectedImage || "" }}
              style={styles.bigImage}
              resizeMode="contain"
            />
          </View>
        </Pressable>
      </Modal>
    </View>
  );

  return (
    <View style={styles.container}>
      <NavShare />
      {/* <Text style={styles.title}>Publicaciones</Text> */}
      {loading ? (
        <ActivityIndicator color={colors.verdeOscuro} size="large" style={{ marginTop: 38 }} />
      ) : posts.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="images-outline" size={52} color={colors.verdeOscuro} />
          <Text style={styles.emptyText}>Aún no hay publicaciones.</Text>
        </View>
      ) : (
        <FlatList
          data={posts}
          keyExtractor={item => item._id}
          renderItem={renderPost}
          contentContainerStyle={styles.list}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          showsVerticalScrollIndicator={false}
        />
      )}
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
    fontSize: 23,
    fontWeight: 'bold',
    color: colors.verdeOscuro,
    marginTop: 16,
    marginBottom: 16,
    textAlign: 'center',
  },
  list: {
    paddingBottom: 24,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 18,
    marginVertical: 8,
    marginHorizontal: 5,
    shadowColor: '#000',
    shadowOpacity: 0.07,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 7,
    elevation: 3,
    padding: 13,
    flexDirection: 'column',
    position: 'relative',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 1,
  },
  user: {
    color: colors.verdeOscuro,
    fontWeight: 'bold',
    fontSize: 16.5,
  },
  desc: {
    color: '#222',
    fontSize: 16,
    marginTop: 5,
    marginBottom: 10,
    flexWrap: 'wrap',
  },
  image: {
    width: '100%',
    height: 190,
    borderRadius: 13,
    borderWidth: 2,
    borderColor: colors.verdeOscuro,
    backgroundColor: '#eee',
    marginBottom: 13,
    marginTop: 3,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: -7,
  },
  likeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 18,
  },
  likeText: {
    color: colors.verdeOscuro,
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: 2,
  },
  date: {
    color: colors.verdeOscuro,
    fontSize: 14,
    opacity: 0.62,
    alignSelf: 'flex-end',
    fontWeight: '500',
  },
  emptyState: {
    marginTop: 50,
    alignItems: 'center',
  },
  emptyText: {
    color: colors.verdeOscuro,
    fontSize: 17,
    marginTop: 12,
    fontWeight: '600',
    textAlign: 'center',
    opacity: 0.7,
  },
  // Modal styles:
  modalBackdrop: {
    flex: 1,
    backgroundColor: "#000a",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 8,
    borderRadius: 18,
    alignItems: "center",
    elevation: 7,
  },
  bigImage: {
    width: 320,
    height: 370,
    borderRadius: 15,
    borderWidth: 3,
    borderColor: colors.verdeOscuro,
    backgroundColor: "#fff",
  },
});
