import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { colors } from '@/const/color';
import React from 'react';
// import { stylesGlobal } from '@/const/styles';
import { useRouter } from 'expo-router';

interface Props {
    title : string,
    subtitle : string,
    route : string,
    img : any
}

export default function CardModeComponent({title, subtitle, route, img} : Props) {
    const router = useRouter();
    return (
        <View style={stl.div}>
            <Image source={img} style={stl.img}/>
            <View style={stl.text}>
                <Text style={stl.title}>{title}</Text>
                <Text style={stl.p}>{subtitle}</Text>
            </View>
            <TouchableOpacity style={stl.link} onPress={()=> router.push(route as any)}>
                <Text style={stl.a}>Explorar</Text>
            </TouchableOpacity>
        </View>
    );
}

const stl = StyleSheet.create({
    div :{
        marginVertical : 15,
        flexDirection : 'row',
        alignItems : 'center',
        justifyContent : 'space-between',
        gap : 10,
        borderWidth : 1,
        borderRadius : 10,
        paddingRight : 20,
        paddingLeft : 10,
        paddingVertical : 10,
        marginBottom: 8
    },
    img: {
        width: 70,
        height: 70,
    },
    title:{ 
        fontSize : 18,
        fontFamily : 'InterBold',
        color : colors.textoPrincipal,
    },
    p: {
        fontSize : 14,
        fontFamily : 'Inter',
        color : colors.textoSecundario,
    },
    link: {
        borderWidth : 1,
        paddingVertical : 5,
        paddingHorizontal : 12,
        borderRadius : 4,
        borderColor : colors.verdeOscuro,
    },
    text: {
        width : '40%',
    },
    a :{
        color : colors.verdeOscuro,
        fontFamily : 'InterBold',
        fontSize : 16,
    }
})