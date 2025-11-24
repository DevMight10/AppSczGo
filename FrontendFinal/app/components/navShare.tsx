import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import { colors } from '../../const/color';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function NavShare(){
    const router = useRouter();
    return(
        <View style={stl.nav}>
            <View style={stl.box_logo}>
                <Text style={stl.logo}>SczShare</Text>
                {/* logo de mensaje */}
                <Ionicons
                    name="navigate-outline"
                    size={28}
                    color={colors.verdeOscuro}
                />
            </View>
            <View style={stl.box_view}>
                <TouchableOpacity onPress={()=> router.push('/pages/tab/SczShare')}>
                    <Ionicons
                        name='home-outline'
                        size={28}
                        color={colors.verdeOscuro}
                    />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => router.push('/pages/tab/SczShare/MyPostsScreen')}>
                    <Ionicons
                        name='image-outline'
                        size={28}
                        color={colors.verdeOscuro}
                    />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => router.push('/pages/tab/SczShare/Profile')}>
                    <Ionicons
                        name='person-outline'
                        size={28}
                        color={colors.verdeOscuro}
                    />
                </TouchableOpacity>
            </View>
            
        </View>
    )
}

const stl = StyleSheet.create({
    logo: {
        textAlign: 'right',
        fontFamily: 'InterExtraBold',
        color: colors.verdeOscuro,
        fontSize: 24,
    },
    box_logo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5
    },
    nav: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginVertical: 5,
    },
    box_view: {
        flexDirection: 'row',
        gap: 20
    }
})