import { View, Text, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native'
import { useState, useContext, use, useEffect, useMemo } from 'react';
import { useRouter } from 'expo-router';
import { AuthContext } from '@/context/AuthContext';
import React from 'react';
import { Image } from 'react-native';
import styles from '../../assets/styles/login.styles';
import { Ionicons } from '@expo/vector-icons';
import { TextInput } from 'react-native';
import { switchTheme } from '@/constants/colors';
import { TouchableOpacity } from 'react-native';
import { PreferencesContext } from '@/context/PreferencesContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const [isCheckingTheme, setIsCheckingTheme] = useState(true);
    const {user, login, isCheckingUser} = useContext(AuthContext);
    const {COLORS, setColors} = useContext(PreferencesContext);

    const fullStyles = useMemo(() => {
        console.log("Change detecteddd");
  if (!COLORS) return null;
  return styles(COLORS);
}, [COLORS]);
    const router = useRouter();
     
    const getColor = async () => {
        try {
            const value = await AsyncStorage.getItem('COLORS');
            const parsedValue = JSON.parse(value);
            return parsedValue;
        } catch (e) {
            console.log("ERROR HERE: ", e);
        }
    };
    const storeColor = async (color) => {
        try {
            const prepColor = await JSON.stringify(color);
            await AsyncStorage.setItem('COLORS',prepColor );
        } catch (e) {
            console.log("ERROR HERE: ", e); 
        }
    };
    useEffect(()=>{
        console.log("Change detecteddd");
        if(COLORS !== null){
            const fullStyles = COLORS ? styles(COLORS) : null;
            //setFullStyles(fullStyles);
            if(getColor() !== COLORS){
                storeColor(COLORS);
            }
            setIsCheckingTheme(false);
        }
    },[COLORS])
    useEffect(()=>{
        const fetchColor = async ()=> {
        const storedColor = await getColor();
        console.log("STORED COLOR: ", storedColor)
        if(!storedColor){
            const defColor = switchTheme('forestTheme');
            setColors(defColor);
            await storeColor(defColor)
        }else{
            setColors(storedColor)
        }
    }
    fetchColor()
    }, [])
    const handleLogin = async () => {
        try{
        setIsLoading(true);
        const result = await login(email, password);
        if(result.success){
            setIsLoading(false);
            router.push('/(tabs)/');
        }else{
            setIsLoading(false);
            alert(result.message);
        }
    }catch (error) {
        console.error('Error:', error);
        setIsLoading(false);
    }
}
  if(isCheckingUser) return null;
  if(isCheckingTheme) return <View><Text>Checking</Text></View>;
  return (
    <KeyboardAvoidingView
    style={{flex: 1}}
    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
    <View style={fullStyles.container}>
        <View style={fullStyles.topIllustration}>
      <Image source={require('../../assets/images/ilustration.png')} 
      style={fullStyles.illustrationImage} 
      resizeMode='contain'/>
      </View>
      <View style={fullStyles.card}>
        <View style={fullStyles.formContainer}>
            <View style={fullStyles.inputGroup}>                
                <Text style={fullStyles.label}>Email</Text>
                <View style={fullStyles.inputContainer}>
                    <Ionicons name="mail-outline" size={20} color={COLORS.primary} style={fullStyles.inputIcon} />
                    <TextInput
                    style={fullStyles.input}
                    placeholder='Enter your email'
                    placeholderTextColor={COLORS.placeholderText}
                    value={email}
                    onChangeText={setEmail}
                    keyboardType='email-address'
                    autoCapitalize='none'
                    autoCorrect={false}
                    ></TextInput>
                </View>    
            </View>
            <View style={fullStyles.inputGroup}>                
                <Text style={fullStyles.label}>Password</Text>
                <View style={fullStyles.inputContainer}>
                    <Ionicons name="lock-closed-outline" size={20} color={COLORS.primary} style={fullStyles.inputIcon} />
                    <TextInput
                    style={fullStyles.input}
                    placeholder='Enter your password'
                    placeholderTextColor={COLORS.placeholderText}
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!showPassword}
                    autoCapitalize='none'
                    autoCorrect={false}
                    ></TextInput>
                    <Ionicons name={showPassword ? "eye-outline" : "eye-off"} size={22} color={COLORS.primary} style={fullStyles.inputIcon} 
                    onPress={() => setShowPassword(!showPassword)}/>
                </View>
            </View>
            <TouchableOpacity style={fullStyles.button} onPress={handleLogin} disabled={isLoading}>
                {isLoading ? (
                    <ActivityIndicator size="small" color={COLORS.white} />
                ) : (
                    <Text style={fullStyles.buttonText}>Login</Text>
                )}
            </TouchableOpacity>
            <View style={fullStyles.footer}>
                <Text style={fullStyles.footerText}>Don't have an account? </Text>
                <TouchableOpacity onPress={()=> router.push('/(auth)/signup')}>
                    <Text style={fullStyles.link}>Sign up</Text>
                </TouchableOpacity>
            </View>
        </View>
      </View>
    </View>
    </KeyboardAvoidingView>
  )
}