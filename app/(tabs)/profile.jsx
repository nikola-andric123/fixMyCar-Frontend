import { View, Text, TouchableOpacity, FlatList, RefreshControl, Alert, Modal, Pressable, ActivityIndicator } from 'react-native'
import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { StyleSheet } from 'react-native'

import { useFocusEffect, usePathname, useRouter } from 'expo-router'
import { Image } from 'expo-image'

import { AuthContext } from '../../context/AuthContext';
import {formatMemberSinceDate, formatPublishDate} from "@/lib/utils"
import { Ionicons } from '@expo/vector-icons'
import { PreferencesContext } from '@/context/PreferencesContext'
import  styles  from '@/assets/styles/profile.styles'

export default function Profile() {
    
    const {user, token, logout, selectedPost, setSelectedPost} = useContext(AuthContext);
    const [issues, setIssues] = useState([]);
    const [refreshing, setRefreshing] = useState(false);
    const {COLORS} = useContext(PreferencesContext);
    
    const profileStyles = useMemo(()=>{
        if(!COLORS) return null;
        return styles(COLORS);
    }, [COLORS])
    const router = useRouter()
    
    
    useEffect(()=>{
        
        if(selectedPost ){
           
            router.push(`/(details)/details`);
        }
    },[selectedPost])
    
    
    const confirmLogout = async () => {
        Alert.alert("Logout", "Are you sure you want to logout?",[
            {text: "Cancel", style: 'cancel'},
            {text: "Logout", onPress: async ()=>{  await logout()}, style: 'destructive'}
        ] )
    }
    const deletePost = async (postId) => {
        try{
            console.log("CALLED");
            const response = await fetch(`http://192.168.1.3:3000/api/issueRoutes/${postId}`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            })
            const result = await response.json();
            if(response.ok){
                alert("Post deleted successfully!");
                //await fetchData();
                setIssues(issues.filter((item) => item._id !== postId));
            }
        }catch(error){
            console.log(error);
        }
    }
    const fetchData = async (refresh=false) => {
        try{
            if(refresh) setRefreshing(true);
            const response = await fetch(`http://192.168.1.3:3000/api/issueRoutes/usersPosts?${user._id}`,{
                method: 'GET',
                headers:{
                    'Authorization': `Bearer ${token}`
                }
            });
            const responseData = await response.json();
            if(response.ok){
                setIssues(responseData.issues);
            }
        }catch(error){
            console.log(error);
        }finally{
            setRefreshing(false);
        }
    }
    useEffect(()=>{
         fetchData()
        
    },[]);
    useEffect(()=>{
        if(!user) router.replace('/(auth)/');
    }, [user])

    const renderItem = ({item}) => (
        <TouchableOpacity activeOpacity={0.9} onPress={()=>{ setSelectedPost(item);}}>
        <View style={[profileStyles.card,{marginVertical: 10}]}>
            <Image style={{width: 120, height: 100, borderRadius: 8, margin: 15}} source={{uri: item.image}}></Image>
            <View style={profileStyles.bookInfo}>
                <Text style={profileStyles.bookTitle} numberOfLines={1}>{item.title}</Text>
                <View style={profileStyles.ratingContainer}>
                    {renderLevel(item.level)}                  
                </View>
                <Text style={profileStyles.bookCaption} numberOfLines={2}>{item.description}</Text>
                <Text style={profileStyles.bookDate}>{formatPublishDate(item.createdAt)}</Text>
            </View>
            <View  style={{flex: 1, justifyContent: 'flex-end', alignItems: 'flex-end', flexDirection: 'row'  }}>
                <View style={{flex: 1, justifyContent: 'flex-end', alignItems: 'flex-end'}}>
                    <Ionicons onPress={() => deletePost(item._id)} name='trash-bin-outline' size={30} color={'red'} style={profileStyles.trash}></Ionicons>
                </View>
            </View>
        </View>
        </TouchableOpacity>
    )

    
    const renderLevel = (level) => {
        const levels = [];
        for (let i = 1; i <= 5; i++) {
            levels.push(
                <Ionicons key={i} name={i<=level ? "alert-circle" : "alert-circle-outline" } size={20} 
                color={i<=level ? "#c20000" : COLORS.textSecondary} style={{marginRight: 2}} />
            );
        }
        return levels;
    }
    if(!profileStyles) return( <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator size='large' color={"black"} />
        </View>)
  return (
    <>
 {user ? <View style={profileStyles.container}>
      <View style={[profileStyles.card, {marginVertical: 30}]}>
        <Image source={{uri: user.profileImage}} style={profileStyles.profileImage}/>
        <View style={profileStyles.userInfo}>
            <Text style={profileStyles.username}>{user.username}</Text>
            <Text style={profileStyles.email}>{user.email}</Text>
            <Text style={profileStyles.memberSince}>Member since: {formatMemberSinceDate(user.createdAt)}</Text>

        </View>
        <TouchableOpacity style={{justifyContent: 'flex-start', marginTop: 10, alignItems: 'center'}} onPress={()=> router.push('/(tabs)/(settings)/settings')}>
            <Ionicons name='settings-outline' size={25} color={COLORS.textSecondary}></Ionicons>
        </TouchableOpacity>
      </View>
      
      <TouchableOpacity style={profileStyles.logoutButton} onPress={confirmLogout}>
        <Ionicons name='log-out-outline' color={'white'} size={25}></Ionicons>    
        <Text style={{fontSize: 20, marginLeft:10, color: 'white'}}>Logout</Text>
    </TouchableOpacity>
    <View style={profileStyles.recommendationHeader}>
        <Text style={profileStyles.recommendationHeaderText}>Your Recommendations</Text>
        <Text style={profileStyles.recommendationText}>{issues.length} posts</Text>
        
    </View>
    <FlatList 
        data={issues}
        renderItem={renderItem}
        keyExtractor={(item) => item._id}
        contentContainerStyle={profileStyles.booksList}
        showsVerticalScrollIndicator={false}
        refreshControl={
            <RefreshControl
            refreshing={refreshing}
            onRefresh={ ()=> {
               
                fetchData(true)
                
            }}
            colors={[COLORS.primary]}
             />
        }
        ListEmptyComponent={
            <View style={profileStyles.emptyContainer}>
                <Text>You do not have any posts! Create one.</Text>
                <TouchableOpacity style={styles.createPost} onPress={()=> router.push('/(tabs)/create')}>
                    <Ionicons name='add-circle-outline' color={'white'} size={25}></Ionicons>
                    <Text style={{color: 'white', marginLeft: 15, fontSize:20}}>Create</Text>
                </TouchableOpacity>
            </View>
        }
    />
    </View> : <></>}
   </> 
  )
}

function createStyles(){
    return StyleSheet.create({
        container:{
            backgroundColor: COLORS.background,
            flexGrow: 1,
           
        },
        card: {
            
            backgroundColor: 'white',
            borderRadius: 10,
            elevation: 3,
            marginHorizontal: 18,
            
            flexDirection: 'row',
            justifyContent: 'flex-start'
        },
        profileImage: {
            height: 76,
            width: 76,
            margin: 25,
            borderRadius: 30
        },
        userInfo: {
            justifyContent: "center",
            alignContent: 'center',
            marginLeft: 25,
            fontSize: 30

        },
        username: {
            fontSize: 30,
            color: COLORS.textPrimary,
            fontWeight: 600,
            marginBottom: 5
        },
        detailsText: {
            fontSize: 15,
            color: COLORS.textSecondary
        },
        logoutBtn: {
            backgroundColor: COLORS.primary,
            marginHorizontal: 25,
            padding: 15,
            borderRadius: 15,
            alignItems: 'center',
            flexDirection: 'row',
            justifyContent: 'center'

        },
        recommendationHeader: {
            flexDirection: 'row',
            
        },
        recommendationHeaderText: {
            fontSize: 20,
            color: COLORS.textDark,
            fontWeight: 700,
            marginTop: 15,
            marginLeft: 10
        },
        recommendationText: {
            fontSize: 15,
            color: COLORS.textSecondary,
            marginTop: 18,
            marginLeft: 85
        },
        postCreated: {
            fontSize: 14,
            color: COLORS.textSecondary,
            marginTop: 10,
            marginLeft: 15
        },
        postTitle: {
            fontSize: 20,
            marginTop: 15,
            marginLeft: 20,
            color: COLORS.textPrimary,
            fontWeight: 600,
            width: 160
        },
        postDescription:{
            marginLeft: 15,
            width: 120
        },
        ratingContainer: {
            flexDirection: "row",
            marginBottom: 4,
            marginLeft: 15,
            marginTop: 5
        },
        trash:{
            //marginLeft: 50,
           margin: 10
        },
        listContainer: {
            padding: 5,
            paddingBottom: 350, 
        },
        createPost: {
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: COLORS.primary,
            marginHorizontal: 50,
            marginTop: 15,
            padding: 8,
            borderRadius: 15,
            shadowColor: COLORS.black,
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.5,
            shadowRadius: 5,
            elevation: 2,
                    
        },
        noPosts: {
            justifyContent: 'center',
            margin: 'auto',
            marginTop: 50
        }
    })
}