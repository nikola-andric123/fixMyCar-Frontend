import { router, SplashScreen, Stack } from "expo-router";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import AuthProvider, { AuthContext } from "../context/AuthContext";
import PreferencesProvider from "../context/PreferencesContext"
import React, { use, useContext, useEffect, useState } from "react";
import * as Notifications from "expo-notifications";
import SafeScreen from "@/components/SafeScreen";
//import * as Device from "expo-device";
import {useFonts} from 'expo-font';

 Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

SplashScreen.preventAutoHideAsync();
export default function RootLayout() {
  
  const [fontsLoaded] = useFonts({
    "JetBrainsMono-Medium": require("../assets/fonts/JetBrainsMono-Medium.ttf")
  })
  useEffect(()=>{
    if(fontsLoaded) SplashScreen.hideAsync();
  }, [fontsLoaded])
  return (
    
  <AuthProvider>
    <PreferencesProvider>
    <SafeAreaProvider>
      <SafeScreen>
        <Stack screenOptions={{headerShown: false}}>
          <Stack.Screen name="(auth)" />
          <Stack.Screen name="(tabs)" />
          
           
        </Stack>
     
     </SafeScreen>
    </SafeAreaProvider>
    </PreferencesProvider>
    
 </AuthProvider>

    );
}
