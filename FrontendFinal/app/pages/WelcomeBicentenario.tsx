import { colors } from '@/const/color';
import { stylesGlobal } from '@/const/styles';
import { Image, StyleSheet, Text, View } from 'react-native';
import ButtonComponent from '../components/buttonComponent';
import { useRouter } from 'expo-router';
import React from "react";

export default function WelcomeBicentenarioScreen() {
  const router = useRouter();

  return (
    <View style={[stylesGlobal.container, { justifyContent: 'center' }]}>

      {/* Imagen central */}
      <Image source={require('../img/Introduccion.png')} style={stl.img} />

      {/* Texto principal */}
      <Text style={stl.h1}>¡Bienvenido a SCZ GO !</Text>
      <Text style={stl.p}>
        Descubre los lugares más emblemáticos, turísticos, culturales e históricos de nuestra ciudad con una experiencia única e interactiva.
      </Text>
      <Text style={stl.p}>
        Explora mapas, rutas personalizadas, historia local y comparte tus aventuras con otros usuarios. Todo desde una sola app pensada para celebrar 200 años de historia viva.
      </Text>
      <Text style={stl.pBold}>¡Vive Santa Cruz como nunca antes!</Text>

      {/* Botón */}
      <View style={stl.footer}>
        <ButtonComponent label="Continuar" onPress={() => router.push('/pages/PreferencesScreen')} />
      </View>

    </View>
  );
}

const stl = StyleSheet.create({
  img: {
    width: '100%',
    height: 250,
    resizeMode: 'contain',
    marginBottom: 20,
  },
  h1: {
    fontSize: 22,
    textAlign: 'center',
    fontFamily: 'InterBold',
    color: colors.textoPrincipal,
    marginBottom: 10,
  },
  p: {
    textAlign: 'center',
    fontFamily: 'Inter',
    fontSize: 16,
    color: colors.textoSecundario,
    marginBottom: 8,
    paddingHorizontal: 10,
  },
  pBold: {
    textAlign: 'center',
    fontFamily: 'InterBold',
    fontSize: 16,
    color: colors.textoPrincipal,
    marginBottom: 20,
  },
  footer: {
    width: '90%',
    alignSelf: 'center',
    marginTop: 10,
  },
});