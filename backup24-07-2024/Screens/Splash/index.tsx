import {
  Image,
  StyleSheet,
  Text,
  View,
  Dimensions,
  ToastAndroid,
} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {Base_Uri} from '../../constant/BaseUri';
import TutorDetailsContext from '../../context/tutorDetailsContext';
import Toast from 'react-native-toast-message';
const Splash = ({navigation}: any) => {
  const tutorDetailsCont = useContext(TutorDetailsContext);
  const {tutorDetails, setTutorDetail} = tutorDetailsCont;

  const navigateToHomeScreen = () => {
    setTimeout(async () => {
      let data = await AsyncStorage.getItem('login');
      let authData = await AsyncStorage.getItem('loginAuth');

      if (authData) {
        let tutorData:any = JSON.parse(authData);
        console.log("tutorData :>> ", tutorData.contact);
        
        axios
          .get(`${Base_Uri}getTutorDetailByID/${tutorData?.tutorID}`)
          .then((res:any) => {
            if(res.data.tutorDetailById== null){
              AsyncStorage.removeItem('loginAuth');
              navigation.replace('Login');
              setTutorDetail('')
              Toast.show({
                type: 'info',
                text2: `Terminated`,
                position: 'bottom'
              });
              return;
            }

            let tutorData = res.data;
            setTutorDetail(tutorData?.tutorDetailById[0]);
            console.log('tutorData?.tutorDetailById[0]',tutorData?.tutorDetailById[0].phoneNumber);
            
            if (
                !tutorData.tutorDetailById[0]?.full_name &&
                !tutorData.tutorDetailById[0]?.email
              ) {
                AsyncStorage.removeItem('loginAuth');
                navigation.replace('Login');
                setTutorDetail('')
                return
              }

            if (tutorData?.tutorDetailById[0].phoneNumber != tutorData.contact && tutorData?.tutorDetailById[0]?.status.toLowerCase() === 'unverified' || 
            tutorData?.tutorDetailById[0]?.status.toLowerCase() === 'verified') {
              navigation.replace('Main', {
                screen: 'Home',
              });
            }
            else{
              AsyncStorage.removeItem('loginAuth');
              navigation.replace('Login');
              setTutorDetail('')
              console.log(
                tutorData?.tutorDetailById[0]?.status,
                'terminated or block',
              );
            }
          })
          .catch(error => {
            console.log('error', error);
            if (error.response) {
              // The request was made and the server responded with a status code
              console.log('Server responded with data:', error.response.data);
              console.log('Status code:', error.response.status);
              console.log('Headers:', error.response.headers);
            } else if (error.request) {
              // The request was made but no response was received
              console.log('No response received:', error.request);
            } else {
              // Something happened in setting up the request that triggered an Error
              console.log('Error setting up the request:', error.message);
            }
            AsyncStorage.removeItem('loginAuth');
            navigation.replace('Login');
            setTutorDetail('')
            // ToastAndroid.show('Session Expire', ToastAndroid.SHORT);
            // ToastAndroid.show('Internal Server Error', ToastAndroid.SHORT);
          });
        return;
      }

      if (data) {
        navigation.replace('Login');
        return;
      }
      navigation.replace('OnBoarding');
    }, 3000);
  };
  useEffect(() => {
    navigateToHomeScreen();
  }, []);
  return (
    <View
      style={{
        backgroundColor: 'white',
        height: '100%',
        paddingHorizontal: 15,
        alignItems: 'center',
      }}>
      <Image
        source={require('../../Assets/Images/logo.png')}
        resizeMode="contain"
        style={styles.logo}
      />
    </View>
  );
};

export default Splash;

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    height: Dimensions.get('window').height,
    width: Dimensions.get('window').width / 1.1,
  },
});
