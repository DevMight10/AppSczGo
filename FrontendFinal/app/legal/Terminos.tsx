import React from 'react';
import { View, Text, StyleSheet, ScrollView, ImageBackground } from 'react-native';
import { colors } from '@/const/color';
import LogoComponent from '@/app/components/logoComponent';
import BackComponent from '@/app/components/backComponent';

export default function Terminos() {
  return (
    <ImageBackground
            source={require('../img/CristoVerde.png')}
            style={styles.background}
            resizeMode="cover"
            >
    
    <ScrollView contentContainerStyle={styles.container}>
        <BackComponent/>
        <LogoComponent/>
        <Text style={styles.title}>Términos y Condiciones</Text>
        <Text style={styles.date}>Fecha de entrada en vigor: 01 de junio del 2025</Text>
        <Text style={styles.paragraph}>
            <Text style={styles.bold}>1. Introducción {'\n'}</Text>
            SCZ-GO es una aplicación móvil desarrollada con el propósito de enriquecer la experiencia turística en Santa Cruz de la Sierra, Bolivia. Ofrecemos modos interactivos que combinan geolocalización, contenido histórico y social, siempre cuidando la confidencialidad, integridad y disponibilidad de la información del usuario. {'\n'}
            {'\n'}
            El uso de la app implica la aceptación plena de estos términos y condiciones, redactados en concordancia con la norma ISO 27002:2022 y la PISI-Bolivia.
        </Text>
        <Text style={styles.paragraph}>
            <Text style={styles.bold}>2. Recolección y Uso de Datos{'\n'}</Text>
            Conforme a las buenas prácticas de seguridad de la información, SCZ-GO recopila únicamente los datos necesarios para su funcionamiento:{'\n'}
            {'\n'}
            Datos recolectados:{'\n'}
            - Ubicación geográfica: Para mostrar monumentos cercanos y calcular rutas.{'\n'}
            - Imágenes y multimedia: Para publicaciones en la red social.{'\n'}
            - Datos de perfil: Nombre, correo electrónico y preferencias turísticas.{'\n'}
            - Datos de uso: Interacciones dentro de la app para mejorar el servicio.{'\n'}
            {'\n'}
            Finalidad:{'\n'}
            - Brindar navegación turística personalizada.{'\n'}
            - Permitir interacción social dentro de la app.{'\n'}
            - Mejorar continuamente nuestros servicios.{'\n'}
            {'\n'}
            La información es tratada bajo estrictos controles de seguridad, incluyendo el uso de cifrado, acceso restringido, y monitoreo de incidentes.
        </Text>
        <Text style={styles.paragraph}>
            <Text style={styles.bold}>3. Permisos Requeridos{'\n'}</Text>
            La App solicitará los siguientes permisos, los cuales el usuario podrá aceptar o rechazar:{'\n'}
            {'\n'}
            - Geolocalización: para ubicar al usuario en el mapa y sugerir destinos cercanos.{'\n'}
            - Cámara y Galería: para tomar y subir fotografías a la red social.{'\n'}
            - Almacenamiento interno: para guardar configuraciones y preferencias de uso.{'\n'}
            {'\n'}
            La denegación de permisos puede limitar algunas funcionalidades de la App.
        </Text>
        <Text style={styles.paragraph}>
            <Text style={styles.bold}>4. Condición de Uso {'\n'}</Text>
            - El usuario se compromete a utilizar la App de forma legal, ética y respetuosa.{'\n'}
            - Está prohibido subir contenido ofensivo, discriminatorio, violento o con fines publicitarios no autorizados.{'\n'}
            - El uso indebido de la App puede conllevar la suspensión o eliminación del usuario.
        </Text>
        <Text style={styles.paragraph}>
            <Text style={styles.bold}>5. Seguridad de la Información{'\n'}</Text>
            SCZ-GO aplica controles de seguridad basados en la ISO 27002 y PISI para proteger la información de amenazas internas y externas:{'\n'}
            {'\n'}
            - Control de accesos con autenticación segura mediante token.{'\n'}
            - Protección contra pérdida o robo de datos.{'\n'}
            - Gestión de incidentes de seguridad.{'\n'}
            - Seguridad en el desarrollo de software y ciclo de vida de la app.{'\n'}
            - Actualizaciones frecuentes de seguridad.{'\n'}
            {'\n'}
            En caso de incidentes de seguridad o fallos del servicio, SCZ-GO activará procedimientos internos de recuperación para asegurar la continuidad del uso de la aplicación.
        </Text>
        <Text style={styles.paragraph}>
            <Text style={styles.bold}>6. Servicio de Terceros{'\n'}</Text>
            SCZ-GO puede hacer uso de servicios de terceros que también recopilan información, bajo sus propios términos y condiciones:{'\n'}
            {'\n'}
            - Google Maps Platform: Para geolocalización y rutas.{'\n'}
            - Cloudinary: Para almacenamiento multimedia.{'\n'}
            - Expo / React Native: Como tecnologías de desarrollo de la app.{'\n'}
            {'\n'}
            Estos servicios cumplen con normas internacionales de protección de datos y seguridad.
        </Text>
        <Text style={styles.paragraph}>
            <Text style={styles.bold}>7. Derechos y Obligaciones del Usuario{'\n'}</Text>
            Al utilizar la aplicación, el usuario se compromete a:{'\n'}
            {'\n'}
            - No usar la app con fines ilegales o dañinos.{'\n'}
            - Mantener la confidencialidad de sus credenciales.{'\n'}
            - Proporcionar datos reales y exactos.{'\n'}
            - Respetar las publicaciones de otros usuarios.{'\n'}
            {'\n'}
            El usuario puede solicitar en cualquier momento la eliminación de su cuenta y sus datos 
            personales, en cumplimiento del principio de autodeterminación informativa.
        </Text>
        <Text style={styles.paragraph}>
            <Text style={styles.bold}>8. Propiedad Intelectual{'\n'}</Text>
            Todo el contenido visual, textual y gráfico de la App (exceptuando el contenido generado por los usuarios) es propiedad de los desarrolladores del proyecto SCZGO y está protegido por las leyes de derechos de autor.
        </Text>
        <Text style={styles.paragraph}>
            <Text style={styles.bold}>9. Limitación de Responsabilidad{'\n'}</Text>
            Los desarrolladores no se responsabilizan por daños directos o indirectos derivados del uso o mal uso de la App. El usuario entiende que la App depende del uso de terceros servicios como GPS, internet y servicios en la nube.
        </Text>
        <Text style={styles.paragraph}>
            <Text style={styles.bold}>10. Modificaciones a los Términos{'\n'}</Text>
            Los presentes términos podrán ser modificados en cualquier momento. Los cambios serán notificados mediante la App. El uso continuado de la misma después de tales modificaciones se considerará como aceptación de las nuevas condiciones.
        </Text>
        <Text style={styles.paragraph}>
            <Text style={styles.bold}>11. Contacto{'\n'}</Text>
            Para consultas, reclamos o solicitudes relacionadas con estos términos, puede contactarnos al correo: sczsoporte@gmail.com
        </Text>
    </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    //backgroundColor: '#fff',
    backgroundColor: 'rgba(255,255,255,0.9)'
  },
  background: {
    flex: 1,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 15,
    marginTop: 15,
    color: colors.verdeOscuro,
    textAlign: 'center',
  },
  paragraph: {
    fontSize: 16,
    textAlign: 'justify',
    color: colors.textoPrincipal,
    marginBottom: 10,
  },
    overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    padding: 20,
  },
  scroll: {
    marginVertical: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#000',
  },
  bold: {
    fontWeight: 'bold',
    fontSize: 20,
  },
  date: {
    marginBottom: 10,
    fontSize: 16,
    color: colors.verdeClaro
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
