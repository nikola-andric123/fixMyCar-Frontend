import styles from '@/assets/styles/home.styles'

import React, { useContext, useEffect } from 'react'
import { Image } from 'expo-image'
import { TouchableOpacity, Text } from 'react-native'
import { View } from 'react-native'
import blossomTheme from '@/assets/images/blossomTheme.jpg'
import forestTheme from '@/assets/images/forestTheme.jpg'
import oceanTheme from '@/assets/images/oceanTheme.jpg'
import retroTheme from '@/assets/images/retroTheme.jpg'
import COLORS, { switchTheme } from '@/constants/colors'
import { PreferencesContext } from '@/context/PreferencesContext'
import AsyncStorage from '@react-native-async-storage/async-storage'

export default function Settings() {
    
    const {COLORS, setColors, selectedTheme, setSelectedTheme} = useContext(PreferencesContext);
    useEffect(()=>{
        const getColor = async () => {
            try {
                const value = await AsyncStorage.getItem('selectedTheme');
                if(value !== null) {
                    setSelectedTheme(value);
                    const newColor = switchTheme(value);
                    setColors(newColor);
                }
            } catch (e) {
                console.log("ERROR HERE: ", e);
            }
        };
        getColor();
    },[])

    const setTheme = async (theme) => {
      try{
        await AsyncStorage.setItem('selectedTheme', theme);
      }catch(e) {
        console.log("Error setting theme: ", e);
      }
    }
    const handleChangeTheme = async (theme) => {
        setSelectedTheme(theme);
        setTheme(theme);
        const newColor = switchTheme(theme);
        setColors(newColor);
    }
  return (
    <View style={styles(COLORS).container}>
      <Text style={[styles(COLORS).bookTitle, {margin: 15, fontSize: 25}]}>General Settings</Text>
      <View style={styles(COLORS).bookCard}>
        <Text style={[styles(COLORS).bookDetails, {margin: 10, fontSize: 20}]}>Choose Theme</Text>
        <View style={{flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center'}}>
            <TouchableOpacity onPress={()=>{if(selectedTheme !== 'blossomTheme') {
              handleChangeTheme('blossomTheme');}
            }} style={{ backgroundColor: COLORS.cardBackground,
              borderWidth:selectedTheme ==='blossomTheme' ? 3 : 0, borderRadius: 5, borderColor: 'pink',
              alignItems: 'center'
            }}>
                <Image style={{width: 100, height: 200, margin: 15,
                }} source={blossomTheme}></Image>
            <Text style={styles.bookDetails}>Blossom</Text>    
            </TouchableOpacity>
            
            <TouchableOpacity onPress={()=>{if(selectedTheme !== 'forestTheme') {
              handleChangeTheme('forestTheme');}
            }} 
            style={{backgroundColor: COLORS.cardBackground, alignItems: 'center',
              borderWidth:selectedTheme ==='forestTheme' ? 3 : 0, borderRadius: 5, borderColor: 'green'}}>
                <Image style={{width: 100, height: 200, margin: 15,
                  
                }} source={forestTheme}></Image>
                <Text style={styles(COLORS).bookDetails}>Forest</Text> 
            </TouchableOpacity>    
            <TouchableOpacity onPress={()=>{if(selectedTheme !== 'oceanTheme') {
              handleChangeTheme('oceanTheme');}
            }} style={{backgroundColor: COLORS.cardBackground,
              borderWidth:selectedTheme ==='oceanTheme' ? 3 : 0, borderRadius: 5, borderColor: 'blue', alignItems: 'center'}}>
                <Image style={{width: 100, height: 200, margin: 15}} source={oceanTheme}></Image>
                <Text style={styles(COLORS).bookDetails}>Ocean</Text> 
            </TouchableOpacity> 
            <TouchableOpacity onPress={()=>{ if(selectedTheme !== 'retroTheme') {
              handleChangeTheme('retroTheme');}
            }} style={{backgroundColor: COLORS.cardBackground,
              borderWidth:selectedTheme ==='retroTheme' ? 3 : 0, borderRadius: 5,alignItems: 'center', borderColor: 'orange', alignItems: 'center'}}>
                <Image style={{width: 100, height: 200, margin: 15}} source={retroTheme}></Image>
                <Text style={styles(COLORS).bookDetails}>Retro</Text> 
            </TouchableOpacity>   
        </View>
      </View>
    </View>
  )
}