import { Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import React from "react";

export default function BackComponent(){
    const router = useRouter();

    return (
        <TouchableOpacity style={stl.div} onPress={() => router.back()}>
            <Image source={require('../img/back.png')}/>
            <Text style={stl.text}>Volver</Text>
        </TouchableOpacity>
    )
}

const stl = StyleSheet.create({
    div :{
        width : '100%',
        flexDirection : 'row',
        alignItems : 'center',
        marginBottom : 20,
    },
    text :{
        fontFamily : 'Inter',
        fontSize : 18,
        // borderBottomWidth : 1,
    }
})