

import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet, Alert, ScrollView, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { colors } from '@/const/color';
import { stylesGlobal } from '@/const/styles';
import LogoComponent from '../components/logoComponent';
import BackComponent from '../components/backComponent';
import ButtonComponent from '../components/buttonComponent';
import { MaterialIcons } from '@expo/vector-icons';
import { iniciarSesion } from '../../api/auth';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage'; // 👈 nuevo import
import * as Network from 'expo-network';
import ConexionModalComponent from '../components/conexionModalComponent';
import { Feather } from '@expo/vector-icons';


export default function LoginScreen() {
  const router = useRouter();
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [verContrasena, setVerContrasena] = useState(false);
  const [sinConexion, setSinConexion] = useState(false);

  const [errorCorreo, setErrorCorreo] = useState('');
  const [errorContrasena, setErrorContrasena] = useState('');
  const [errorGeneral, setErrorGeneral] = useState('');

  const handleLogin = async () => {
    if (!correo || !contrasena) {
      Alert.alert("Error", "Por favor completa todos los campos.");
      return;
    }

    let esValido = true;

    if (!correo.trim()) {
      setErrorCorreo('Ingrese su correo');
      esValido = false;
    }

    if (!contrasena) {
      setErrorContrasena('Ingrese su contraseña');
      esValido = false;
    }

    if (!esValido) return;

    try {
      const res = await iniciarSesion({ correo, contrasena });

      await AsyncStorage.setItem('token', res.token);
      await AsyncStorage.setItem('nombreUsuario', res.nombre);
      await AsyncStorage.setItem('usuarioId', res.id);

      const token = await AsyncStorage.getItem('token');

      router.push('/pages/tab');
    } catch (error:any) {
      console.error("Error en el login:", error);
      if (!error.response) {
        setSinConexion(true); // muestra el modal personalizado
        return;
      }
      Alert.alert("Error", error.response?.data?.mensaje || "No se pudo iniciar sesión");
    }
  };

  return (
    // <View style={stylesGlobal.container}>
    <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
          <KeyboardAvoidingView
              style={stylesGlobal.container}
              behavior={Platform.OS === 'ios' ? 'padding' : undefined}
              // keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0}
          >
      <BackComponent />
      <LogoComponent />
      <View style={stylesGlobal.form}>
        <Text style={stl.titleForm}>Iniciar sesión</Text>

        {/* Input de correo */}
        <View style={stl.inputGroup}>
          <TextInput
            placeholder="Correo electrónico"
            style={stl.input}
            placeholderTextColor={colors.textoSecundario}
            keyboardType="email-address"
            onChangeText={setCorreo}
          />
          <MaterialIcons name="email" size={22} color={colors.textoSecundario} style={{ marginRight: 10 }} />
        </View>

        {/* Input de contraseña */}
        <View style={stl.inputGroup}>
        <TextInput
            placeholder="Contraseña"
            secureTextEntry={!verContrasena}
            style={stl.input}
            placeholderTextColor={colors.textoSecundario}
            onChangeText={setContrasena}
            value={contrasena}
          />
          <TouchableOpacity onPress={() => setVerContrasena(!verContrasena)}>
            <Feather
              name={verContrasena ? 'eye-off' : 'eye'}
              size={22}
              color={colors.textoSecundario}
              style={{ marginRight: 10 }}
            />
          </TouchableOpacity>
        </View>
        {errorContrasena ? <Text style={stl.error}>{errorContrasena}</Text> : null}
        {errorGeneral ? <Text style={stl.error}>{errorGeneral}</Text> : null}

        <ButtonComponent label="Ingresar" onPress={handleLogin} />
        <ConexionModalComponent
          visible={sinConexion}
          modo="Inicio sesion"
          onRetry={() => setSinConexion(false)}
        />
      </View>
    {/* </View> */}
    </KeyboardAvoidingView>
    </ScrollView>
  );
}

const stl = StyleSheet.create({
  titleForm: {
    fontSize: 24,
    fontFamily: 'InterBold',
  },
  inputGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 10,
    justifyContent: 'space-between',
  },
  input: {
    paddingHorizontal: 10,
    paddingVertical: 12,
    fontFamily: 'Inter',
    color: colors.textoSecundario,
    fontSize: 18,
    //borderWidth: 1,
    flex: 1
  },
  error: {
    color: 'red',
    fontSize: 14,
    marginBottom: 10,
    marginLeft: 4,
    fontFamily: 'Inter',
  },
  div: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  text: {
    fontSize: 16,
    fontFamily: 'Inter',
    color: colors.textoSecundario,
  },
  link: {
    fontSize: 16,
    fontFamily: 'InterBold',
    color: colors.verdeClaro,
  },
});
