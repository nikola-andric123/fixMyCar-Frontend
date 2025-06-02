import { View, Text, KeyboardAvoidingView, Platform, TextInput, TouchableOpacity } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
//import  from '@/constants/colors'
import { AuthContext } from '@/context/AuthContext'
import React, { useEffect, useContext } from 'react'
import styles from '@/assets/styles/signup.styles'
import { PreferencesContext } from '@/context/PreferencesContext'

export default function Signup() {
    const [username, setUsername] = React.useState('');
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [showPassword, setShowPassword] = React.useState(false);
    const [isLoading, setIsLoading] = React.useState(false);
    const {user, setUser, register, token} = React.useContext(AuthContext);
    const { COLORS } = useContext(PreferencesContext);

    
    const handleSignup = async ()=>{
        const result = await register(username, email, password);
        if (result.success) {
            setIsLoading(false);
            router.push('/(auth)/');
        } else {
            setIsLoading(false);
            alert(result.message);
        }
        
    }
    
    
    const router = useRouter();
   // if(!COLORS) return <View><Text>Checking</Text></View>;
  return (
    <KeyboardAvoidingView
        style={{flex: 1}}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
    <View style={styles(COLORS).container}>
      <View style={styles(COLORS).card}>
        <View style={styles(COLORS).header}>
            <Text style={styles(COLORS).title}>FixMyCar</Text>
            <Text style={styles(COLORS).subtitle}>Find solutions for your problem</Text>
        </View>
        <View style={styles(COLORS).formContainer}>
            <View style={styles(COLORS).inputGroup}>                
                <Text style={styles(COLORS).label}>Username</Text>
                <View style={styles(COLORS).inputContainer}>
                    <Ionicons name="person-outline" size={20} color={COLORS.primary} style={styles(COLORS).inputIcon} />
                    <TextInput
                    style={styles(COLORS).input}
                    placeholder='Enter your username'
                    placeholderTextColor={COLORS.placeholderText}
                    value={username}
                    onChangeText={setUsername}
                    ></TextInput>
                </View>
            </View>
            <View style={styles(COLORS).inputGroup}>                
                <Text style={styles(COLORS).label}>Email</Text>
                <View style={styles(COLORS).inputContainer}>
                    <Ionicons name="mail-outline" size={20} color={COLORS.primary} style={styles(COLORS).inputIcon} />
                    <TextInput
                    style={styles(COLORS).input}
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
            <View style={styles(COLORS).inputGroup}>                
                <Text style={styles(COLORS).label}>Password</Text>
                <View style={styles(COLORS).inputContainer}>
                    <Ionicons name="lock-closed-outline" size={20} color={COLORS.primary} style={styles(COLORS).inputIcon} />
                    <TextInput
                    style={styles(COLORS).input}
                    placeholder='Enter your password'
                    placeholderTextColor={COLORS.placeholderText}
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!showPassword}
                    autoCapitalize='none'
                    autoCorrect={false}
                    ></TextInput>
                    <Ionicons name={showPassword ? "eye-outline" : "eye-off"} size={22} color={COLORS.primary} style={styles(COLORS).inputIcon} 
                    onPress={() => setShowPassword(!showPassword)}/>
                </View>
            </View>
            <TouchableOpacity style={styles(COLORS).button} onPress={handleSignup} disabled={isLoading}>
                {isLoading ? (
                    <ActivityIndicator size="small" color={COLORS.white} />
                ) : (
                    <Text style={styles(COLORS).buttonText}>Sign Up</Text>
                )}
            </TouchableOpacity>
            <View style={styles(COLORS).footer}>
                <Text style={styles(COLORS).footerText}>Already have an account? </Text>
                <TouchableOpacity onPress={()=> router.push('/(auth)/')}>
                    <Text style={styles(COLORS).link}>Login</Text>
                </TouchableOpacity>
            </View>
        </View>
      </View>
    </View>
    </KeyboardAvoidingView>
  )
}