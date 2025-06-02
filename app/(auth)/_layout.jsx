import { View, Text } from 'react-native'
import React, { useState } from 'react'
import { Stack } from 'expo-router'
import { useContext, useEffect } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { useRouter } from 'expo-router';

import { PreferencesContext } from '@/context/PreferencesContext';
import { SafeAreaView } from 'react-native-safe-area-context';


export default function AuthLayout() {
    const {user, token, checkUser} = useContext(AuthContext);
    const {COLORS, setColors} = useContext(PreferencesContext);
    const [isCheckingTheme, setIsCheckingTheme] = useState(true);
    const router = useRouter();






      useEffect(() => {
        checkUser();
      }, []);
      useEffect(() => {
        if (user && token) {
          router.replace("/(tabs)");
        } 
      }, [user, token]);
  return (
    
   <Stack screenOptions={{headerShown: false}}/>
   
  )
}