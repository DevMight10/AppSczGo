import React from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity, ScrollView, Switch } from 'react-native';
import { colors } from '@/const/color';
import { Link } from 'expo-router';

interface Props {
  visible: boolean;
  onClose?: () => void;
  onAccept?: () => void;
  aceptaTerminos: boolean;
  setAceptaTerminos: (val: boolean) => void;
}

export default function TermsModalComponent({
  visible,
  onClose,
  onAccept,
  aceptaTerminos,
  setAceptaTerminos,
  
}: Props) {
  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Text style={styles.title}>Términos y Condiciones</Text>

          <ScrollView style={styles.scroll}>
            <Text style={styles.paragraph}>
              La app móvil SCZ-GO es una plataforma de turismo interactivo desarrollada para promover el conocimiento histórico y cultural de Santa Cruz de la Sierra, Bolivia. El uso de esta App implica la aceptación plena y sin reservas de los siguientes términos y condiciones:
            </Text>
            <Link href="/legal/Terminos" asChild>
              <TouchableOpacity>
                <Text style={styles.linkText}>Al registrarse, usted acepta cumplir con nuestros términos y condiciones.</Text>
              </TouchableOpacity>
            </Link>
          </ScrollView>

          <View style={styles.switchRow}>
            <Switch
              value={aceptaTerminos}
              onValueChange={setAceptaTerminos}
              thumbColor={aceptaTerminos ? "#fff" : "#ccc"}
              trackColor={{ false: '#ccc', true: '#2E7D32' }}
            />
            <Text style={styles.switchLabel}>Acepto los Términos y Condiciones</Text>
          </View>

          <View style={styles.botones}>
            <TouchableOpacity style={styles.botonesCancel} onPress={onClose}>
                <Text style={styles.buttonText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.botonesAccept} onPress={onAccept}>
                <Text style={styles.buttonText}>Aceptar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    padding: 20,
  },
  container: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    maxHeight: '90%',
  },
  scroll: {
    marginVertical: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#000',
  },
  paragraph: {
    fontSize: 14,
    color: '#333',
    marginBottom: 8,
    textAlign: 'justify',
  },
  bold: {
    fontWeight: 'bold',
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  switchLabel: {
    marginLeft: 10,
    fontSize: 14,
    color: '#000',
  },
  buttonText: {
    color: colors.blanco,
    fontSize: 16,
  },
  botones: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10
  },
  botonesCancel: {
    flex: 1,
    backgroundColor: 'red',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center'
  },
  botonesAccept: {
    flex: 1,
    backgroundColor: colors.verdeOscuro,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center'
  },
  linkContainer: {
    marginVertical: 15,
    alignItems: 'center',
  },
  linkText: {
    color: colors.verdeOscuro,
    fontWeight: 'bold',
    textDecorationLine: 'underline',
    fontSize: 18
  },
});
