import { StyleSheet } from "react-native";
import { colors } from './color';

export const stylesGlobal = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        backgroundColor : colors.fondo,
        paddingVertical : 40,
        paddingHorizontal : 30,
    },
    form: {
        marginVertical: 35,
        width: '100%',
        gap: 20,
        paddingHorizontal: 20,
        paddingVertical: 35,
        borderWidth: 1,
        borderRadius: 10,
    },
    h2 :{
        fontSize: 24,
        fontFamily: 'InterBold',
        color : colors.textoPrincipal,
    },
    
})