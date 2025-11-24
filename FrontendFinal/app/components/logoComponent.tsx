import { View, Text, StyleSheet, Image } from 'react-native';
import { stylesGlobal } from '@/const/styles';
import { colors } from '@/const/color';
import React from "react";

export default function LogoComponent() {
    return (
        <View style={stl.div}>
            <View>
                <Text style={stl.t1}>Bienvenido a</Text>
                <Text style={stl.t2}>scz go</Text>
                <Text style={stl.t3}>descubre santa cruz</Text>
            </View>
            <Image source={require('../img/logo.png')} />
            
        </View>
    );
}

const stl = StyleSheet.create({
    div :{
        flexDirection : 'row',
        alignItems : 'center',
        gap : 5,
        justifyContent : 'center',
        // backgroundColor : 'yellow',
    },
    t1 :{
        textAlign : 'right',
        fontFamily : 'InterExtraBold',
        fontSize : 24,
        color : colors.textoPrincipal,
        // backgroundColor : 'yellow',
    },
    t2 :{
        textAlign : 'right',
        fontFamily : 'InterExtraBold',
        fontSize : 28,
        color : colors.verdeOscuro,
        textTransform : 'uppercase',
    },
    t3 :{
        textAlign : 'right',
        fontFamily : 'InterBold',
        color : colors.verdeClaro,
        fontSize : 14,
        textTransform : 'capitalize',
    },
})