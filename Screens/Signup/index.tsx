import {
  StyleSheet,
  Text,
  ToastAndroid,
  TouchableOpacity,
  View,
  ActivityIndicator,
  TextInput,
  Image,
  ScrollView,
  Linking,
} from 'react-native';
import React, {useRef, useState, useEffect, useContext} from 'react';
import {Theme} from '../../constant/theme';
import axios from 'axios';
import {Base_Uri} from '../../constant/BaseUri';
import TutorDetailsContext from '../../context/tutorDetailsContext';
import Icon from 'react-native-vector-icons/Ionicons';
const Signup = ({navigation, route}: any) => {
  let data = route.params;
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [fullName, setFullName] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const context = useContext(TutorDetailsContext);


  let tutorDetail = context?.tutorDetails;
  const handleLoginPress = () => {
    if (!fullName) {
      ToastAndroid.show('Kindly Enter Full Name', ToastAndroid.SHORT);
      return;
    }
    if (!email) {
      ToastAndroid.show('Kindly Enter Email Address', ToastAndroid.SHORT);
      return;
    }

    if (!rememberMe) {
      ToastAndroid.show('Kindly Accept Terms and Services', ToastAndroid.SHORT);
      return;
    }

    let emailReg = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/;

    let testEmail = emailReg.test(email);

    if (!testEmail) {
      ToastAndroid.show('Invalid Email Address', ToastAndroid.SHORT);
      return;
    }

    const formData = new FormData();
    formData.append('fullName', fullName);
    formData.append('email', email);
    formData.append('tutorId', data.tutorDetailById[0]?.id);
    formData.append('phoneNumber', data.tutorDetailById[0]?.phoneNumber);

    setLoading(true);
    console.log(formData, 'formData');
    console.log('data.tutorDetailById[0]?.id', data.tutorDetailById[0]?.id);
    axios
      .post(`${Base_Uri}api/appTutorRegister`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .then(({data}) => {
        console.log('data signup===>', data.Msg);
        if (data?.Msg) {
          ToastAndroid.show(`${data?.Msg}`, ToastAndroid.SHORT);
          setLoading(false);
          return;
        }
        if (data.status == 200) {
          navigation.reset({
            index: 0,
            routes: [
              {
                name: 'Main',
                params: {
                  screen: 'Home',
                },
              },
            ],
          });
          navigation.replace('Main', {
            screen: 'Home',
          });
          ToastAndroid.show('Register Successfully', ToastAndroid.SHORT);
          setLoading(false);
        }
      })
      .catch((error: any) => {
        setLoading(false);
        console.log('error', error);

        ToastAndroid.show('Internal Server Error', ToastAndroid.SHORT);
      });
  };

  return (
    <View
      style={{
        backgroundColor: 'white',
        height: '100%',
        justifyContent: 'center',
        paddingHorizontal: 15,
      }}>
      <ScrollView
        showsHorizontalScrollIndicator={false}
        style={{height: '100%'}}>
        <Text
          style={[
            styles.textType1,
            {fontSize: 35, color: 'black', marginTop: 100, lineHeight: 40},
          ]}>
          Welcome To {'\n'}SifuTutor
        </Text>
        <Text
          style={[
            styles.textType1,
            {fontSize: 22, color: 'black', marginTop: 14, paddingRight: 15},
          ]}>
          Sign up to join
        </Text>
        <View style={styles.container}>
          <Text style={[styles.textType3, {lineHeight: 30, fontWeight: '800'}]}>
            Full Name
          </Text>
          <TextInput
            placeholder="Enter Full Name"
            placeholderTextColor={Theme.gray}
            style={{
              height: 60,
              backgroundColor: 'white',
              borderRadius: 10,
              fontSize: 16,
              borderColor: Theme.black,
              marginBottom: 10,
              borderWidth: 1,
              padding: 10,
              color: Theme.black,
              fontFamily: 'Circular Std Book',
              textTransform: 'capitalize',
            }}
            onChangeText={text => {
              setFullName(text);
            }}
          />
          <Text style={[styles.textType3, {lineHeight: 30, fontWeight: '800'}]}>
            Email
          </Text>
          <TextInput
            placeholder="Enter Your Email"
            placeholderTextColor={Theme.gray}
            style={{
              height: 60,
              backgroundColor: 'white',
              borderRadius: 10,
              fontSize: 16,
              borderColor: Theme.black,
              marginBottom: 10,
              borderWidth: 1,
              padding: 10,
              color: Theme.black,
              fontFamily: 'Circular Std Book',
              textTransform:'lowercase'
            }}
            onChangeText={text => {
              setEmail(text);
            }}
          />
        </View>
        {/* Submit Button */}

        <View
          style={{
            borderWidth: 1,
            borderColor: Theme.white,
            marginVertical: 20,
            width: '100%',
            alignSelf: 'center',
          }}>
          <TouchableOpacity
            onPress={() => handleLoginPress()}
            style={{
              alignItems: 'center',
              padding: 10,
              backgroundColor: Theme.darkGray,
              borderRadius: 10,
            }}>
            {loading ? (
              <ActivityIndicator color={Theme.white} size="small" />
            ) : (
              <Text
                style={{
                  color: 'white',
                  fontSize: 18,
                  fontFamily: 'Poppins-Regular',
                }}>
                Register
              </Text>
            )}
          </TouchableOpacity>
          <View
            style={{
              marginTop: 10,
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'row',
            }}>
            <TouchableOpacity
              style={{
                width: 18,
                height: 18,
                borderWidth: 1,
                borderRadius: 0,
                margin: 10,
              }}
              onPress={() => setRememberMe(!rememberMe)}>
              {rememberMe ? (
                <Icon
                  name="checkmark"
                  size={15}
                  color="white"
                  style={{backgroundColor: Theme.darkGray}}
                />
              ) : (
                ''
              )}
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() =>
                Linking.openURL('https://sifututor.my/terms-of-use/')
              }>
              <Text style={[styles.textType3, {textAlign: 'center'}]}>
                I agree to the
                <Text
                  style={[
                    styles.textType3,
                    {textAlign: 'center', color: Theme.darkGray},
                  ]}>
                  Terms and services
                </Text>
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default Signup;

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
  },
  phoneNumberView: {
    width: '100%',
    backgroundColor: 'white',
    borderColor: Theme.gray,
    borderRadius: 10,
    borderWidth: 1,
    color: '#E5E5E5',
    flexShrink: 22,
    //   autoFocus: true,
  },
  textType1: {
    fontWeight: '500',
    fontSize: 24,
    color: Theme.Dune,
    fontFamily: 'Circular Std Book',
    lineHeight: 24,
    fontStyle: 'normal',
  },
  textType3: {
    color: Theme.Dune,
    fontWeight: '500',
    fontSize: 16,
    fontFamily: 'Circular Std Book',
    fontStyle: 'normal',
  },
});
