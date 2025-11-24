import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/const/color';
import { useRouter } from 'expo-router';

export default function ShareComponent(){
    const router = useRouter();
  return (
    <View style={styles.wrapper}>
      <TouchableOpacity style={styles.button} activeOpacity={0.8} onPress={()=> router.push('/pages/tab/SczShare/FormPost')}>
        <Ionicons name="add-circle-outline" size={30} color={colors.verdeOscuro} style={{ marginRight: 8 }} />
        {/* <Text style={styles.buttonText}>Compartir</Text> */}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    // alignItems: 'center',
    marginVertical: 10,
    // width: '100%',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    // backgroundColor: colors.verdeOscuro,
    // paddingVertical: 10,
    // paddingHorizontal: 10,
    borderRadius: 18,
    fontWeight: 'bold',
    // elevation: 2,
    // shadowColor: colors.verdeOscuro,
    // shadowOffset: { width: 0, height: 3 },
    // shadowOpacity: 0.18,
    shadowRadius: 8,
    // backgroundColor: 'black'

  },
  // buttonText: {
  //   color: '#fff',
  //   fontWeight: 'bold',
  //   fontSize: 18,
  //   letterSpacing: 0.4,
  // },
});
