import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, StyleSheet, ActivityIndicator, RefreshControl, TouchableOpacity, Modal, Pressable, Alert } from 'react-native';
import NavShare from '@/app/components/navShare';
import ShareComponent from '@/app/components/shareComponent';
import api from '../../../../api/axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors } from '@/const/color';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import CameraComponent from '@/app/components/CameraComponent';

type Post = {
  _id: string;
  fotoUrl: string;
  usuarioNombre: string;
  descripcion: string;
  fecha: string;
};

export default function MyPostsScreen() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [likedPosts, setLikedPosts] = useState<{ [key: string]: boolean }>({});

  const fetchMyPosts = async () => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('token');
      const usuarioId = await AsyncStorage.getItem('usuarioId');
      const response = await api.get(`/publicaciones/usuario/${usuarioId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPosts(response.data || []);
    } catch (error) {
      setPosts([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchMyPosts();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchMyPosts();
    setRefreshing(false);
  };

  // Lógica para el Like
  const toggleLike = (postId: string) => {
    setLikedPosts(prev => ({ ...prev, [postId]: !prev[postId] }));
  };

  // Eliminar publicación
  const handleDelete = async (postId: string) => {
    Alert.alert(
      'Eliminar publicación',
      '¿Estás seguro de que deseas eliminar esta publicación?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              const token = await AsyncStorage.getItem('token');
              await api.delete(`/publicaciones/${postId}`, {
                headers: { Authorization: `Bearer ${token}` }
              });
              setPosts(posts.filter(post => post._id !== postId));
            } catch (error) {
              Alert.alert('Error', 'No se pudo eliminar la publicación.');
            }
          }
        }
      ]
    );
  };

  // Render de cada publicación
  const renderPost = ({ item }: { item: Post }) => (
    <View style={styles.card}>
      {/* Encabezado: Nombre y botón eliminar */}
      <View style={styles.headerRow}>
        <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
          <Ionicons name="person" size={18} color={colors.verdeOscuro} style={{ marginRight: 5 }} />
          <Text style={styles.user}>{item.usuarioNombre}</Text>
        </View>
        {/* Botón eliminar */}
        <TouchableOpacity onPress={() => handleDelete(item._id)} style={styles.deleteBtn}>
          <MaterialIcons name="delete" size={22} color="#e53935" />
        </TouchableOpacity>
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
          onPress={() => toggleLike(item._id)}
          activeOpacity={0.8}
        >
          <Ionicons
            name={likedPosts[item._id] ? "heart" : "heart-outline"}
            size={22}
            color={likedPosts[item._id] ? "#0b7d34" : colors.verdeOscuro}
          />
          <Text style={[styles.likeText, likedPosts[item._id] && { color: "#0b7d34" }]}>
            {" "}Like
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
      {/* Encabezado centrado */}
      <View style={styles.headerCenter}>
        <Text style={styles.title}>Mis publicaciones</Text>
        <View>
          <ShareComponent />
        </View>
      <View>
            <CameraComponent onCapture={(uri) => {console.log('Foto tomada:', uri);}} />
        </View>
      </View>
      
      {loading ? (
        <ActivityIndicator color={colors.verdeOscuro} size="large" style={{ marginTop: 38 }} />
      ) : posts.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="images-outline" size={52} color={colors.verdeOscuro} />
          <Text style={styles.emptyText}>Aún no tienes publicaciones compartidas.</Text>
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
  headerCenter: {
    // alignItems: 'center',
    // marginBottom: 14,
    // marginTop: 8,
    flexDirection: 'row',
    width: '100%',
    // justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
  },
  title: {
    fontSize: 20,
    // fontWeight: 'bold',
    fontFamily: 'InterBold',
    color: colors.verdeOscuro,
    // marginBottom: 10,
    // textAlign: 'center',
    
  },
  // shareBtn: {
  //   flexDirection: 'row',
  //   alignItems: 'center',
  //   backgroundColor: colors.verdeOscuro,
  //   borderRadius: 18,
  //   paddingVertical: 10,
  //   paddingHorizontal: 32,
  //   marginTop: 4,
  //   marginBottom: 3,
  //   elevation: 4,
  //   shadowColor: '#0b7d34',
  // },
  // shareBtnText: {
  //   color: "#fff",
  //   fontWeight: "bold",
  //   fontSize: 17,
  // },
  list: {
    paddingBottom: 24,
  },
  card: {
    backgroundColor: '#fff',
    marginVertical: 8,
    marginHorizontal: 5,
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
    justifyContent: 'space-between',
  },
  deleteBtn: {
    padding: 5,
    borderRadius: 50,
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
