
import React, { useContext, useEffect } from 'react'

import { Tabs } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'

import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context'

import { PreferencesContext } from '@/context/PreferencesContext'


export default function TabLayout() {
    const insets = useSafeAreaInsets();
    
    const {COLORS} = useContext(PreferencesContext);
    
    
    
  return (
    
    <Tabs
    screenOptions={{headerShown: false,
        tabBarActiveTintColor: COLORS.primary,
        headerTitleStyle: {color: COLORS.primary},
        headerShadowVisible: false,
       
        tabBarStyle:{
            backgroundColor: COLORS.cardBackground,
            borderTopWidth: 1,
            borderTopColor: COLORS.border,
            paddingTop: 5,
            height: 60 + insets.bottom,
        }
    }} backBehavior='history'
    >
        <Tabs.Screen name="index" options={{ title: 'Home', 
            tabBarIcon: ({color, size}) => <Ionicons color={color} size={size} name='home-outline'/> }} />
      
        <Tabs.Screen name="create" options={{ title: 'Create', 
            tabBarIcon: ({color, size}) => <Ionicons color={color} size={size} name='add-circle-outline'/>
        }} 
        />
        <Tabs.Screen name="profile" options={{ title: 'Profile',
            tabBarIcon: ({color, size}) => <Ionicons color={color} size={size} name='person-outline'/>
         }}  />
         <Tabs.Screen name="(details)/details" options={{ title: 'Details', href: null
         }
      
         }  />
         <Tabs.Screen name="(settings)/settings" options={{ title: 'Settings', href: null
         }
      
         }  />
         
    </Tabs>
    
  )
}