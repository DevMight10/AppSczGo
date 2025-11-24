import { Stack } from "expo-router";
import React from "react";
import Toast, { BaseToast } from "react-native-toast-message";

export default function UserLayout(){
    return (
      <>
        <Stack screenOptions={{
          headerShown: false,
        }}/>
        <Toast
          position="top"
          topOffset={90}
          config={{
            info: (props) => (
              <BaseToast
                {...props}
                style={{ borderLeftColor: '#2E7D32' }}
                contentContainerStyle={{ paddingHorizontal: 16 }}
                text1Style={{
                  fontSize: 20, // 👈 texto más grande
                  fontWeight: 'bold',
                }}
                text1NumberOfLines={2}

              />
            ),
          }}
        />
      </>
    );
}