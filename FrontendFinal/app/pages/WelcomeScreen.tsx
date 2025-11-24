import { colors } from '@/const/color';
import { stylesGlobal } from '@/const/styles';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import ButtonComponent from '../components/buttonComponent';
import LogoComponent from '../components/logoComponent';
import { useRouter } from 'expo-router';
import React from "react";

export default function WelcomeScreen() {
    const router = useRouter();

    return (
        <View style={[stylesGlobal.container, {justifyContent : 'center'}]}>

            {/* header */}
            <View style={stl.header}>
                <LogoComponent/>
                <Text style={stl.p}>Explora la historia, cultura y encanto {'\n'}de Santa Cruz a tu ritmo</Text>
            </View>

            {/* img-main */}
            <Image source={require('../img/directions.png')} style={stl.img}/>

            {/* form */}
            <View style={stl.footer}>
                <ButtonComponent label = 'Registrate' route='/pages/SignUpScreen'/>
                
                {/* link iniciar sesion */}
                <View style={stl.div}>
                    <Text style={stl.text}>¿Ya tienes un cuenta?</Text>
                    <TouchableOpacity onPress={() => router.push('/pages/SignInScreen')}>
                        <Text style={stl.link}> Inicia sesión</Text>
                    </TouchableOpacity>
                </View>
                
            </View>
        </View>
    );
}

const stl = StyleSheet.create({
    header : {
        width : '100%',
        gap : 10,
    },
    p :{
        textAlign : 'center',
        fontFamily : 'Inter',
        fontSize : 16,
        color : colors.textoSecundario,
    },
    img :{
        width : '100%',
        marginVertical : 20,
    },
    footer : {
        width : '90%',
        gap : 10,
    },
    text :{
        textAlign : 'center',
        fontSize : 16,
        fontFamily : 'Inter',
        color : colors.textoSecundario,
    },
    link :{
        textAlign : 'center',
        fontSize : 18,
        fontFamily : 'InterBold',
        color : colors.verdeClaro,
    },
    div :{
        flexDirection : 'row',
        justifyContent : 'center',
        alignItems : 'center',
        marginVertical : 10,
    }
})