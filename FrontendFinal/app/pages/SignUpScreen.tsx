
import React, { useState, useEffect } from "react";
import { View, Text, TextInput, StyleSheet, Alert, ScrollView, KeyboardAvoidingView, Platform,TouchableOpacity } from 'react-native';
import BackComponent from '../components/backComponent';
import LogoComponent from '../components/logoComponent';
import ButtonComponent from '../components/buttonComponent';
import { stylesGlobal } from '@/const/styles';
import { colors } from '@/const/color';
import { registrarUsuario } from '../../api/auth';
import { useRouter } from 'expo-router';
import TermsModalComponent from "../components/termsModalComponent"; 
import * as Network from 'expo-network';
import ConexionModalComponent from '../components/conexionModalComponent';
import { Feather } from '@expo/vector-icons';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { MaterialIcons } from '@expo/vector-icons';

export default function SignUpScreen() {
  const router = useRouter();
  //Valor caracter minimo para el password
  const MIN_CONTRASENA = 6;

  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [confirmar, setConfirmar] = useState('');
  const [verContrasena, setVerContrasena] = useState(false);
  const [verConfirmar, setVerConfirmar] = useState(false);

  // Estados para errores
  const [errorNombre, setErrorNombre] = useState('');
  const [errorApellido, setErrorApellido] = useState('');
  const [errorCorreo, setErrorCorreo] = useState('');
  const [errorContrasena, setErrorContrasena] = useState('');
  const [errorConfirmar, setErrorConfirmar] = useState('');

  const esCorreoValido = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  //modal de conexion
  const [modalVisible, setModalVisible] = useState(false);
  const [aceptaTerminos, setAceptaTerminos] = useState(false);
  const [sinConexion, setSinConexion] = useState(false);

  // Paso previo al registro: valida campos y muestra el modal
const handleRegistro = async () => {
    // Reiniciar errores
    setErrorNombre('');
    setErrorApellido('');
    setErrorCorreo('');
    setErrorContrasena('');
    setErrorConfirmar('');

    let esValido = true;

    if (!nombre.trim()) {
      setErrorNombre('Por favor ingresa tu nombre');
      esValido = false;
    }
    if (!apellido.trim()) {
      setErrorApellido('Por favor ingresa tu apellido');
      esValido = false;
    }

    if (!correo.trim()) {
      setErrorCorreo('Por favor ingresa tu correo');
      esValido = false;
    } else if (!esCorreoValido(correo)) {
      setErrorCorreo('Ingresa un correo electrónico válido');
      esValido = false;
    }

    if (!contrasena) {
      setErrorContrasena('Por favor ingresa una contraseña');
      esValido = false;
    } else if (contrasena.length <  MIN_CONTRASENA) {
      setErrorContrasena(`La contraseña debe tener al menos ${ MIN_CONTRASENA} caracteres`);
      esValido = false;
    }

    if (!confirmar) {
      setErrorConfirmar('Por favor confirma tu contraseña');
      esValido = false;
    } else if (contrasena !== confirmar) {
      setErrorConfirmar('Las contraseñas no coinciden');
      esValido = false;
    }

    if (!esValido) return;


const { isConnected } = await Network.getNetworkStateAsync();
    if (!isConnected) {
      setSinConexion(true);
      return;
    };
    // Mostrar modal para aceptar términos
    setModalVisible(true);
  };
  const reintentarConexion = () => {
    setSinConexion(false);
  };

  // Solo se llama si el usuario acepta los términos
  const confirmarTerminosYRegistrar = async () => {
    if (!aceptaTerminos) {
      Alert.alert("Términos", "Debes aceptar los términos y condiciones para continuar.");
      return;
    }

    try {
      const res = await registrarUsuario({
        nombre: `${nombre} ${apellido}`,
        correo,
        contrasena
      });
      await AsyncStorage.setItem('token', res.token);
      await AsyncStorage.setItem('nombreUsuario', res.nombre);
      setModalVisible(false); // cerrar modal
      Alert.alert("Registro exitoso");
      router.push('/pages/WelcomeBicentenario');
    } catch (error:any) {
        //const errorMessage = (error as any)?.response?.data?.mensaje || "No se pudo registrar";
        //Alert.alert("Error", errorMessage);
        console.error("Error en el registro:", error);
        
        // Si es error de red (axios sin conexión)
        if (!error.response) {
            setModalVisible(false);
            setSinConexion(true);
            return;
        }
        // Si vino mensaje desde el backend (por ejemplo: correo ya registrado)
        const mensaje =error?.response?.data?.mensaje || "No se pudo registrar. Intenta nuevamente.";
        Alert.alert("Error", mensaje);
        }
  };

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
      <KeyboardAvoidingView
          style={stylesGlobal.container}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          // keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0}
      >
      <BackComponent />
      <LogoComponent />

        <View style={stylesGlobal.form}>
            <Text style={stl.h2}>Registrate</Text>
            <TextInput
                placeholder='Nombre'
                style={stl.input}
                onChangeText={setNombre}
                value={nombre}
            />
            {errorNombre ? <Text style={stl.error}>{errorNombre}</Text> : null}

            <TextInput
                placeholder='Apellido'
                style={stl.input}
                onChangeText={setApellido}
                value={apellido}
            />
            {errorApellido ? <Text style={stl.error}>{errorApellido}</Text> : null}

            <View style={stl.inputGroup}>
              <TextInput
                  placeholder='Correo electrónico'
                  style={stl.inputEmail}
                  onChangeText={setCorreo}
                  keyboardType="email-address"
                  value={correo}
                  autoCapitalize="none"
              />
              {errorCorreo ? <Text style={stl.error}>{errorCorreo}</Text> : null}
              <MaterialIcons name="email" size={22} color={colors.textoSecundario} style={{ marginRight: 10 }} />
            </View>

            {/* Contraseña */}
            <View style={stl.inputPassword}>
                <TextInput
                placeholder='Contraseña'
                style={stl.input}
                secureTextEntry={!verContrasena}
                onChangeText={setContrasena}
                value={contrasena}
                />
                <TouchableOpacity onPress={() => setVerContrasena(!verContrasena)} style={stl.icon}>
                    <Feather name={verContrasena ? 'eye-off' : 'eye'} size={20} color={colors.textoSecundario} />
                </TouchableOpacity>
            </View>
            {errorContrasena ? <Text style={stl.error}>{errorContrasena}</Text> : null}

            {/* Confirmar contraseña */}
            <View style={stl.inputPassword}>
                <TextInput
                placeholder='Confirmar contraseña'
                style={stl.input}
                secureTextEntry={!verConfirmar}
                onChangeText={setConfirmar}
                value={confirmar}
                />
                <TouchableOpacity onPress={() => setVerConfirmar(!verConfirmar)} style={stl.icon}>
                    <Feather name={verConfirmar ? 'eye-off' : 'eye'} size={20} color={colors.textoSecundario} />
                </TouchableOpacity>
            </View>
            {errorConfirmar ? <Text style={stl.error}>{errorConfirmar}</Text> : null}
            <ButtonComponent label='Continuar' onPress={handleRegistro} />
            <ConexionModalComponent
                visible={sinConexion}
                modo="Registro"
                onRetry={reintentarConexion}
            />

            <TermsModalComponent
            visible={modalVisible}
            onClose={() => setModalVisible(false)}
            onAccept={confirmarTerminosYRegistrar}
            aceptaTerminos={aceptaTerminos}
            setAceptaTerminos={setAceptaTerminos}
            />
        </View>
      </KeyboardAvoidingView>
    </ScrollView>
  );
}

const stl = StyleSheet.create({
  h2: {
    fontSize: 24,
    fontFamily: 'InterBold',
    marginBottom: 10,
  },
  input: {
    paddingVertical: 12,
    paddingHorizontal: 10,
    fontFamily: 'Inter',
    color: colors.textoSecundario,
    fontSize: 18,
    borderWidth: 1,
    borderRadius: 10,
    marginVertical: 5,
    flex: 1,
  },
  inputEmail: {
    paddingHorizontal: 10,
    paddingVertical: 7,
    fontFamily: 'Inter',
    color: colors.textoSecundario,
    fontSize: 18,
    borderRadius: 10,
    marginVertical: 5,
    //borderWidth: 1,
    flex: 1
  },
  error: {
    color: 'red',
    fontSize: 14,
    marginBottom: 8,
    fontFamily: 'Inter',
  },
  inputPassword: {
    position: 'relative',
  },
  icon: {
    position: 'absolute',
    right: 10,
    top: 14,
  },
  inputGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 10,
    justifyContent: 'space-between',
    flex: 1,
  },
  
});
