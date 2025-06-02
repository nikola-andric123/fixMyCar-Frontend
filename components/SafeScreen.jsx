import { View, Text } from 'react-native'
import React, { useEffect } from 'react';
import COLORS from '../constants/colors.js';
import { StyleSheet } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { PreferencesContext } from '@/context/PreferencesContext.js';



export default function SafeScreen({children}) {
    const insets = useSafeAreaInsets();
    const {COLORS} = React.useContext(PreferencesContext);

  
  return (
    
  // <SafeAreaView style={[styles.container,{ backgroundColor: COLORS?.background}]} edges={['top', 'left', 'right']}>
     <View style={[styles.container, {paddingTop: insets.top, backgroundColor: COLORS?.background}]}>
      
    
      {children}
      
 

    </View>
  
  )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        
    },
})