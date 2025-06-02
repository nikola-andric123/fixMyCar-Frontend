import { View, Text, KeyboardAvoidingView, ScrollView, TextInput, TouchableOpacity, AccessibilityInfo, ActivityIndicator } from 'react-native'
import React, { useMemo } from 'react'
import { useContext, useState } from 'react';
import { Image } from 'react-native';
import { useRouter } from 'expo-router';
import styles from '@/assets/styles/create.styles';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';

import { Platform } from 'react-native';
import { AuthContext } from '@/context/AuthContext';
import { Ionicons } from '@expo/vector-icons';

import { PreferencesContext } from '@/context/PreferencesContext';

export default function Create() {
    const [loading, setloading] = useState(false);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [image, setImage] = useState(null);
    const [imageBase64, setImageBase64] = useState("");
    const [level, setLevel] = useState(1);
    const {token} = useContext(AuthContext);
    const {COLORS} = useContext(PreferencesContext);
    const router = useRouter();

    const createStyles = useMemo(()=>{
        if(!COLORS) return null;
        return styles(COLORS);
    }, [COLORS]);

    const pickImage = async () => {
        try{
            if(Platform.OS !== 'web'){
           const {status} = await ImagePicker.requestMediaLibraryPermissionsAsync();
           if(status !== 'granted'){
                alert('Permission to access images is required!');
                return;
           }
           const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: 'images',
                allowsEditing: true,
                aspect: [4,3],
                quality: 0.5, //lower quality for smaller base64 string
                base64: true,
           });
              if(!result.canceled){
                 setImage(result.assets[0].uri);
                 if(result.assets[0].base64){
                    setImageBase64(result.assets[0].base64);
                 }else{
                    const base64 = await FileSystem.readAsStringAsync(result.assets[0].uri, {
                        encoding: FileSystem.EncodingType.Base64,
                    });
                    setImageBase64(base64);
                 }
                 
              }
        }
        }catch (error) {
            console.error('Error picking image:', error);
            alert('Error picking image');
        }
    }
    const handleSubmit = async () => {
        if(!title || !description || !level){
            alert('Please fill all fields');
            return;
        }
        try{
            setloading(true);
            
            const uriParts = image ? image.split('.') : [""];
            const fileType = uriParts[uriParts.length - 1];
            const imageType = fileType ? `image/${fileType}` : 'image/jpeg';
            const imageDataUrl = image ? `data:${imageType};base64,${imageBase64}` : "";
            
            const response = await fetch('http://192.168.1.3:3000/api/issueRoutes/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    title,
                    description,
                    image: imageDataUrl,
                    level
                })
            })
            //console.log('Image base 64:', imageBase64);
            console.log("COntent typpe:", response.headers.get('content-Type'));
            const data = await response.json();
            if(response.ok){
                
                alert('Post created successfully');
                setTitle("");
                setDescription("");
                setImage(null);
                setImageBase64("");
                setLevel(1);
                router.push('/(tabs)/');
            }else{
                alert(data.message);
                
            }
        }catch (error) {
            console.error('Error:', error);
            alert('Error creating post');
        }finally{
            setloading(false);
        }
        
    }
    const renderLevelPicker = () => {
        const levels = [];
        for(let i=1; i<=5;i++){
            levels.push(
                <TouchableOpacity key={i} onPress={() => setLevel(i)}>
                    <Ionicons name={i <= level ? "alert-circle" : "alert-circle-outline"} size={30} 
                    color={i<=level ? "#c20000" : COLORS.textSecondary} />
                </TouchableOpacity>
            )
        }
        return (<View style={createStyles.ratingContainer}>{levels}</View>)
    }

  return (
    <KeyboardAvoidingView style={{flex: 1}}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView style={createStyles.scrollViewStyle} contentContainerStyle={createStyles.container}>
            <View style={createStyles.card}>
                <View style={createStyles.header}>
                    <Text style={createStyles.title}>Create a new post</Text>
                    <Text style={createStyles.subtitle}>Share your problem with the community</Text>
                </View>
                <View style={createStyles.form}>
                    <View style={createStyles.formGroup}>                
                        <Text style={createStyles.label}>Title</Text>
                        <View style={createStyles.inputContainer}>
                            <Ionicons name="book-outline" size={20} color={COLORS.textSecondary} style={createStyles.inputIcon} />
                            <TextInput
                            style={createStyles.input}
                            placeholder='Enter the title'
                            placeholderTextColor={COLORS.placeholderText}
                            value={title}
                            onChangeText={setTitle}
                            ></TextInput>
                        </View>
                    </View>
                    <View style={createStyles.formGroup}>
                         <Text style={createStyles.label}>Difficulty Level</Text>
                        {renderLevelPicker()}
                    </View>
                    <View style={createStyles.formGroup}>
                        <Text style={createStyles.label}>Image</Text>
                        <TouchableOpacity onPress={pickImage} style={createStyles.imagePicker}>
                            {image ?
                                <Image source={{uri: image}} style={createStyles.previewImage} /> : (
                                <View style={createStyles.placeholderContainer}>
                                <Ionicons name="image-outline" size={40} color={COLORS.textSecondary} />
                                <Text style={createStyles.placeholderText}>Pick an image</Text>
                            </View>)
                            }
                        </TouchableOpacity>
                    </View>
                    <View style={createStyles.formGroup}>                
                        <Text style={createStyles.label}>Description</Text>
                        
                            <TextInput
                            style={createStyles.textArea}
                            placeholder='Enter the description'
                            placeholderTextColor={COLORS.placeholderText}
                            value={description}
                            onChangeText={setDescription}
                            multiline={true}
                            ></TextInput>
                        
                    </View>
                    <TouchableOpacity style={createStyles.button} onPress={handleSubmit} disabled={loading}>
                        {loading ? (
                            <ActivityIndicator size="small" color={COLORS.white} />
                        ) : (
                            <>
                                <Ionicons name="cloud-upload-outline" size={20} color={COLORS.white} 
                                style={createStyles.buttonIcon}/>
                                <Text style={createStyles.buttonText}>Share</Text>
                            </>
                        )}
                    </TouchableOpacity>

                </View>
            </View>
        </ScrollView>
    </KeyboardAvoidingView>
  )
}