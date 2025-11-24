import { View, Text, StyleSheet, Image } from 'react-native';
import { stylesGlobal } from '@/const/styles';
import { colors } from '@/const/color';
import ButtonComponent from '../components/buttonComponent';
import React from "react";


export default function ThankYouScreen() {
  return (
    <View style={[stylesGlobal.container, { justifyContent: 'space-between' }]}>
        <View style={stl.div}>
            <Image source={require('../img/confirmation.png')} />
            <Text style={stl.t1}>¡Gracias por registrarte!</Text>
            <Text style={stl.t2}> Tu experiencia se personalizará según tus preferencias.</Text>
            <Text style={stl.t3}>Puedes cambiarlas mas {'\n'} adelante desde tu perfil</Text>
            <ButtonComponent label='Continuar' route='/pages/SignInScreen' />
        </View>
    </View>
  );
}


const stl = StyleSheet.create({
    div :{
        width : '100%',
        gap : 10,
    },
    t1:{
        fontSize : 24,
        fontFamily : 'InterBold',
        color : colors.verdeOscuro,
        textAlign : 'center',
    },
    t2:{
        fontSize : 24,
        fontFamily : 'InterBold',
        color : colors.textoPrincipal,
        textAlign : 'center',
    },
    t3:{
        fontSize : 14,
        fontFamily : 'Inter',
        color : colors.textoSecundario,
        textAlign : 'center',
        marginVertical : 10,
    }
});
