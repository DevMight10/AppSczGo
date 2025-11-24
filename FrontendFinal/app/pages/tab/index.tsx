import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, Modal} from 'react-native';
import { stylesGlobal } from '@/const/styles';
import { useRouter } from 'expo-router';
import { colors } from '@/const/color';
import CardModeComponent from '../../components/cardModeComponent';
import { useEffect, useState } from 'react';
import ButtonComponent from '@/app/components/buttonComponent';
import React from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '@/api/axios';
import { Asset } from 'expo-asset';
import { ImageSourcePropType } from 'react-native';
import { useMonumentoStore } from '@/store/useMonumentoStore';
import BotonVisitar from '@/app/components/BotonVisitar';

function shuffleArray<T>(array: T[]): T[] {
  return array
    .map(value => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value);
}

interface Lugares{
    title : string,
    distance : number,
    img : ImageSourcePropType,
    tiempo : number,
    descripcion : string,
    tipo : string,
    coordenadas: {
        latitud: number;
        longitud: number;
    };
}

export default function TabIndex() {
    const router = useRouter();

    // const lugar: Lugares = {
    //     title: 'Catedral',
    //     distance: 1.5,
    //     img: require('../../img/lugar.png'),
    //     tiempo : 10,
    //     descripcion: 'lorem ipsum dolor sit amet, consectetur adipiscing elit. ut labore et.',
    //     tipo : 'Monumento Religioso'
    // }

    
    const [lugares, setLugares] = useState<Lugares[]>([]);
    const [nombreUsuario, setNombreUsuario] = useState('')
    const [modalVisible, setModalVisible] = useState(false);
    const [lugarSeleccionado, setLugarSeleccionado] = useState<Lugares | null>(null);
    const { setMonumentoSeleccionado, setRuta } = useMonumentoStore();


    const abrirModal = (lugar: Lugares) => {
        setLugarSeleccionado(lugar);
        setModalVisible(true);
    }

    const cerrarModal = () => {
        setModalVisible(false);
        setLugarSeleccionado(null);
    }

    useEffect(() => {
    (async () => {
        try {
        const token = await AsyncStorage.getItem('token');
        const res = await api.get('/monumentos', {
            headers: {
            Authorization: `Bearer ${token}`
            }
        });

        const datos = res.data;

        const lugaresFormateados = datos.map((item: any): Lugares => ({
            title: item.nombre,
            descripcion: item.descripcion,
            img: item.imagenes && item.imagenes.length > 0
                ? { uri: item.imagenes[0].startsWith('http') ? item.imagenes[0] : `${api.defaults.baseURL}/${item.imagenes[0]}` }
                : require('../../img/catedral.png'),
            distance: Math.floor(Math.random() * 5) + 1,
            tiempo: Math.floor(Math.random() * 10) + 5,
            tipo: item.categoria || 'Monumento',
            coordenadas: {
                latitud: item.coordenadas.latitud,
                longitud: item.coordenadas.longitud
            }
        }));

        setLugares(shuffleArray<Lugares>(lugaresFormateados).slice(0, 5));
        } catch (error) {
        console.error('❌ Error al cargar los lugares:', error);
        }
    })();

    const obtenerNombre = async () => {
        const nombreGuardado = await AsyncStorage.getItem('nombreUsuario');
        if (nombreGuardado) setNombreUsuario(nombreGuardado);
    };
    obtenerNombre();
    }, []);

    return(
        <ScrollView contentContainerStyle={stylesGlobal.container}>
            <View style={stl.div}>
                <Text style={stylesGlobal.h2}>¡Hola, {nombreUsuario}!</Text>
                <Text style={stl.p}>¿Listo para descubrir Santa Cruz?</Text>
                <CardModeComponent
                    title='Turista libre'
                    subtitle='Explora monumentos cercanos'
                    route='/pages/tab/FreeTour'
                    img={require('../../img/TuristaLibre.png')}

                />
                <CardModeComponent 
                    title='Historia'
                    subtitle='Descubre eventos históricos'
                    route='/pages/tab/HistoryMode'
                    img={require('../../img/HistoriaIcon.png')}

                />
                <CardModeComponent 
                    title='Turismo Guiado'
                    subtitle='Obten rutas personalizadas'
                    route='/pages/tab/GuidedTour'
                    img={require('../../img/GuiadoIcon.png')}
                />

                {/* carrucel de lugares */}

                <View style={stl.divCard}>
                    <Text style={stylesGlobal.h2}>Lugares Populares</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                        {lugares.map((lug, index) => (
                            <View key={index} style={stl.cardPlace}>
                                <TouchableOpacity onPress={()=> abrirModal(lug)}>
                                    <Image source={lug.img} style={stl.imgLugar}/>
                                </TouchableOpacity>
                                <View>
                                    <Text style={stl.title}>{lug.title}</Text>
                                    <Text style={stl.distance}>{lug.distance} Km</Text>
                                </View>
                            </View>
                        ))}
                    </ScrollView>
                </View>

                {/* modal */}                        

                <Modal
                    animationType='fade'
                    transparent={true}
                    visible={modalVisible}
                    onRequestClose={cerrarModal}
                >
                    <View style={stl.modalOverlay}>
                        <View style={stl.divModal}>

                            <ScrollView>
                                {lugarSeleccionado && (
                                    <>
                                <View style={stl.headerModal}>
                                    <View style={stl.navModal}>
                                        <Image 
                                            source={lugarSeleccionado.img} 
                                            
                                        />

                                        <View style={stl.container}>
                                            <View style={stl.section}>
                                                <Text style={stl.titleModal}>{lugarSeleccionado.title}</Text>
                                                <TouchableOpacity onPress={cerrarModal}>
                                                    <Image 
                                                        source={Image.resolveAssetSource(require('../../img/cancel.png'))} 
                                                        style={{ height: 35, marginRight: -20}}
                                                    />
                                                </TouchableOpacity>
                                                
                                            </View>
                                            <Text style={stl.dateModal}>{lugarSeleccionado.distance} km - {lugarSeleccionado.tiempo} min</Text>
                                        </View>
                                    </View>

                                    <Text style={stl.descripcionModal}>{lugarSeleccionado.descripcion}</Text>
                                </View>

                                <Image source={lugarSeleccionado.img} style={{ width: '100%', height: 200, borderRadius: 10 }} />
                                <View style={stl.button}>
                                <BotonVisitar monumento={{
                                    _id: '', // opcional si no tenés ID
                                    nombre: lugarSeleccionado.title,
                                    descripcion: lugarSeleccionado.descripcion,
                                    categoria: lugarSeleccionado.tipo,
                                    coordenadas: lugarSeleccionado.coordenadas,
                                    imagenes: [],
                                    radioGeofence: 50,
                                    distancia: lugarSeleccionado.distance,
                                    }} />
                                </View>
                                </>
                                )} 
                            </ScrollView>
                        </View>
                    </View>
                </Modal>
            </View>
        </ScrollView>
    )
}

const stl = StyleSheet.create({
    div :{
        width : '100%',
        marginTop: -8,
    },
    p :{
        fontFamily :'Inter',
        fontSize : 16,
        color : colors.textoSecundario,
        marginBottom : 15,
    },
    divCard: {
        //borderWidth : 1,
        gap : 15,
    },
    cardPlace: {
        //borderWidth : 1,
        borderRadius : 5,
        marginRight : 15,
        gap : 20,
        width: 180,
        maxWidth: '90%',
        maxHeight: '100%',
    },
    imgLugar: {
        width: '100%',
        height: 120,
        borderRadius: 10,
        marginBottom: 0,
    },
    title: {
        fontSize : 16,
        fontFamily : 'InterBold',
        color : colors.textoPrincipal,
        marginTop: -10
    },
    distance: {
        fontSize : 14,
        fontFamily : 'InterBold',
        color : colors.verdeOscuro,
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.4)',
    },
    divModal: {
        width: 320,
        maxWidth: '90%',
        backgroundColor: colors.blanco,
        borderRadius: 10,
        padding: 20,
        maxHeight: "90%",
        alignItems: 'center',
        elevation: 10,
        gap: 10,
        borderWidth : 1,
    },
    headerModal: {
        gap: 5
    },
    navModal: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        paddingVertical: 5,
    },
    section: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
    },
    container:{
        width: '87%',
    },
    titleModal: {
        fontSize: 18,
        fontFamily: 'InterBold',
        color: colors.textoPrincipal,
        //textAlign: 'center',
        flexShrink: 1,
    },
    dateModal:{
        fontSize: 14,
        color: colors.verdeOscuro,
        fontFamily: 'InterBold',
    },
    descripcionModal: {
        fontSize: 16,
        color: colors.textoSecundario,
        fontFamily: 'Inter',
    },
    button:{
        width: '100%',
        marginTop: 10,
    }
})  