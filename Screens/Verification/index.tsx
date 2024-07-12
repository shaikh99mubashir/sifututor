import {
  Dimensions,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ToastAndroid,
  ActivityIndicator,
} from 'react-native';
import React, { useState } from 'react';
import Header from '../../Component/Header';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from 'react-native-confirmation-code-field';

import { Theme } from '../../constant/theme';
import { Base_Uri } from '../../constant/BaseUri';
import axios from 'axios';
import messaging from '@react-native-firebase/messaging';
import CustomLoader from '../../Component/CustomLoader';
import { getFcmToken } from '../../src/utils/fcmHelper';
import Toast from 'react-native-toast-message';
const Verification = ({ navigation, route }: any) => {
  let data = route.params;
  const CELL_COUNT = 6;
  const [value, setValue] = useState('');
  const ref = useBlurOnFulfill({ value, cellCount: CELL_COUNT });
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue,
  });
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);

  const Verify = () => {
    const sendDeviceTokenToDatabase = async (tutorId: any) => {
      try {
        let token = await messaging().getToken();
        let formData = new FormData();
        formData.append('tutor_id', tutorId);
        formData.append('device_token', token);

        axios
          .post(`${Base_Uri}api/getTutorDeviceToken`, formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          })
          .then(res => {
            let data = res.data;
            console.log(data, 'tokenResponse');
          })
          .catch(error => {
            console.log(error, 'error');
          });
      }
      catch (error) {
        console.log("error in get token verification");

      }
    };

    if (!value) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Kindly Enter 6 Digut OTP Code',
        position: 'bottom'
      });
      return;
    }

    if (value.length < 6) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Invalid Code',
        position: 'bottom'
      });
      return;
    }

    setLoading(true);
    let formData = new FormData();
    formData.append("code", value);
    formData.append("id", data?.tutorDetail?.id);
    console.log("form DAtat", formData);
    axios.post(`${Base_Uri}api/verificationCode`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
      .then(({ data }: any) => {
        console.log('data.tutorID', data);

        if (data?.status !== 200) {
          setLoading(false);
          Toast.show({
            type: 'error',
            text1: 'Error',
            text2: `${data?.errorMessage}`,
            position: 'bottom'
          });
          return;
        }
        if (data?.status == 200) {
          setLoading(false);
          let mydata = JSON.stringify(data);
          AsyncStorage.setItem('loginAuth', mydata);
          sendDeviceTokenToDatabase(data.tutorID)
          axios
            .get(`${Base_Uri}getTutorDetailByID/${data?.tutorID}`)
            .then((res) => {
              if (res.data.tutorDetailById == null) {
                AsyncStorage.removeItem('loginAuth');
                navigation.replace('Login');
                Toast.show({
                  type: 'info',
                  text1: 'Terminated',
                  position: 'bottom'
                });
                return
              }
              let tutorData = res.data;

              if (
                tutorData?.tutorDetailById[0]?.full_name == null && tutorData?.tutorDetailById[0]?.email == null
              ) {
                navigation.replace('Signup', tutorData)
                Toast.show({
                  type: 'success',
                  text1: 'Verification Successfully',
                  text2: "Let's Register Your Account",
                  position: 'bottom'
                });

              }
              else if (tutorData?.tutorDetailById[0]?.status.toLowerCase() === 'unverified' || tutorData?.tutorDetailById[0]?.status.toLowerCase() === 'verified') {

                navigation.reset({
                  index: 0,
                  routes: [{ name: 'Main' }],
                });
                Toast.show({
                  type: 'success',
                  text1: 'Login Successfully',
                  text2: "Let's Register Your Account",
                  position: 'bottom'
                });
              }
            });
        }
      })
      .catch(error => {
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: 'Invalid Code',
          position: 'bottom'
        });
        setLoading(false);
      });
  };

  const handleResendPress = () => {
    let { UserDetail } = data;
    setResendLoading(true);

    axios
      .get(`${Base_Uri}loginAPI/${data?.tutorDetail?.phoneNumber}`)
      .then(({ data }) => {
        if (data?.status == 200) {
          setResendLoading(false);
          Toast.show({
            type: 'success',
            text1: 'Success',
            text2: "Resend Code Send Successfully",
            position: 'bottom'
          });
          return;
        }
        if (data?.status !== 200) {
          setResendLoading(false);
          Toast.show({
            type: 'error',
            text1: 'Error',
            text2: `${data?.errorMessage}`,
            position: 'bottom'
          });
          
        }
      })
      .catch(error => {
        setResendLoading(false);
        Toast.show({
          type: 'error',
          text1: 'Network Error',
          text2: `Check Your Internet Connectivity`,
          position: 'bottom'
        });
      });
  };

  return (
    <View
      style={{
        backgroundColor: Theme.white,
        height: '100%',
      }}>
      <View style={{ marginTop: 30 }}></View>
      <Header
        navigation={navigation}
        backBtn
        noSignUp
        title="Verification"
      />
      <View style={{ marginVertical: 10, paddingHorizontal: 15, marginTop: 30 }}>
        <Text
          style={{
            fontFamily: 'Circular Std Medium',
            color: Theme.gray,
            fontSize: 16,
            textAlign: 'center',
          }}>
          Enter Verification Code
        </Text>
      </View>
      <View style={{ paddingHorizontal: 15, borderRadius: 10, }}>
        <CodeField
          ref={ref}
          {...props}
          value={value}
          onChangeText={setValue}
          cellCount={CELL_COUNT}
          rootStyle={styles.codeFieldRoot}
          keyboardType="number-pad"
          textContentType="oneTimeCode"
          renderCell={({ index, symbol, isFocused }: any) => (
            <Text
              key={index}
              style={[styles.cell, isFocused && styles.focusCell]}
              onLayout={getCellOnLayoutHandler(index)}>
              {symbol || (isFocused ? <Cursor /> : null)}
            </Text>
          )}
        />
      </View>
      <View style={{ alignItems: 'center', marginVertical: 20 }}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => handleResendPress()}>
          <Text
            style={{
              color: Theme.gray,
              fontSize: 15,
              fontFamily: 'Circular Std Medium',
            }}>
            If you didn,t receive a code!

            <Text
              style={{
                color: Theme.darkGray,
                fontSize: 15,
                fontFamily: 'Circular Std Medium',
              }}>
              {' '}
              Resend{' '}
            </Text>
          </Text>
        </TouchableOpacity>
      </View>
      <CustomLoader visible={resendLoading} />
      {/* Verify Button */}
      <View
        style={{
          borderRadius: 5,
          marginHorizontal: 15,
          marginVertical: 20,
        }}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => !resendLoading && Verify()}
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
                fontFamily: 'Circular Std Medium',
              }}>
              Verify
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Verification;

const styles = StyleSheet.create({
  digitbtn: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  btn: {
    flex: 1,
    height: 50,
    borderRadius: 4,
    backgroundColor: Theme.darkGray,
    borderColor: Theme.darkGray,
    justifyContent: 'center',
    alignItems: 'center',
    fontFamily: 'Circular Std Medium',
  },
  codeFieldRoot: {
    marginTop: 20,
    justifyContent: 'center',
  },
  cell: {
    width: Dimensions.get('window').width / 7.5,
    height: 60,
    color: Theme.black,
    padding: 10,
    alignItems: 'center',
    lineHeight: 38,
    fontSize: 24,
    marginHorizontal: 4,
    borderWidth: 1,
    borderRadius: 5,
    backgroundColor: '#e6e9fa',
    borderColor: Theme.darkGray,
    textAlign: 'center',
  },
  focusCell: {
    borderColor: Theme.darkGray,
  },
});
