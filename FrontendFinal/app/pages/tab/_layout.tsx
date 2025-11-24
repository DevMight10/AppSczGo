// import { Tabs } from 'expo-router';
// import { Ionicons } from '@expo/vector-icons';
// import React from 'react';

// export default function TabLayout() {
//   return (
//     <Tabs
//       screenOptions={{
//         headerShown: false,
//         tabBarActiveTintColor: '#367C28',
//         tabBarInactiveTintColor: '#333333',
//       }}
//     >
//       <Tabs.Screen
//         name="index"
//         options={{
//           title: 'Inicio',
//           tabBarIcon: ({ color, size }) => (
//             <Ionicons name="home-outline" size={size} color={color} />
//           ),
//         }}
//       />
//       <Tabs.Screen
//         name="FreeTour"
//         options={{
//           title: 'Turista libre',
//           tabBarIcon: ({ color, size }) => (
//             <Ionicons name="compass-outline" size={size} color={color} />
//           ),
//         }}
//       />
//       <Tabs.Screen
//         name="HistoryMode"
//         options={{
//           title: 'Historia',
//           tabBarIcon: ({ color, size }) => (
//             <Ionicons name="book-outline" size={size} color={color} />
//           ),
//         }}
//       />
//       <Tabs.Screen
//         name="GuidedTour"
//         options={{
//           title: 'Turista guiado',
//           tabBarIcon: ({ color, size }) => (
//             <Ionicons name="map-outline" size={size} color={color} />
//           ),
//         }}
//       />
//       <Tabs.Screen
//         name="Profile"
//         options={{
//             title: 'Perfil',
//             tabBarIcon: ({ color, size }) => (
//             <Ionicons name="person-circle-outline" size={size} color={color} />
//             ),
//         }}
//       />

//     </Tabs>
//   );
// }


// app/pages/tab/_layout.tsx
import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Toast, { BaseToast } from 'react-native-toast-message';



export default function TabLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: '#367C28',
          tabBarInactiveTintColor: '#333333',
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Inicio',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="home-outline" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="FreeTour"
          options={{
            title: 'Turista libre',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="compass-outline" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="HistoryMode"
          options={{
            title: 'Historia',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="book-outline" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="GuidedTour"
          options={{
            title: 'Turista guiado',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="map-outline" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="SczShare"
          options={{
            title: 'SczShare',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="share-social-outline" size={size} color={color} />
            ),
          }}
        />
      </Tabs>
      <Toast
        position="top"
        topOffset={118}
        config={{
          info: (props) => (
            <BaseToast
              {...props}
              style={{ borderLeftColor: '#2E7D32' }}
              contentContainerStyle={{ paddingHorizontal: 16 }}
              text1Style={{
                fontSize: 18, // 👈 texto más grande
                fontWeight: 'bold',
              }}
              text2Style={{
                fontSize: 14, // 👈 texto más grande
                fontWeight: 'normal',
              }}
              text1NumberOfLines={2}
              text2NumberOfLines={3}
            />
          ),
        }}
      />


    </GestureHandlerRootView>
  );
}
